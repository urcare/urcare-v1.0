-- Create user_trials table for tracking trial periods
CREATE TABLE IF NOT EXISTS user_trials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  trial_start TIMESTAMP WITH TIME ZONE NOT NULL,
  trial_end TIMESTAMP WITH TIME ZONE NOT NULL,
  is_active BOOLEAN DEFAULT true,
  claimed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Ensure one active trial per user
  UNIQUE(user_id, is_active) DEFERRABLE INITIALLY DEFERRED
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_user_trials_user_id ON user_trials(user_id);
CREATE INDEX IF NOT EXISTS idx_user_trials_is_active ON user_trials(is_active);
CREATE INDEX IF NOT EXISTS idx_user_trials_trial_end ON user_trials(trial_end);

-- Enable RLS
ALTER TABLE user_trials ENABLE ROW LEVEL SECURITY;

-- RLS Policies for user_trials
CREATE POLICY "Users can view their own trials" ON user_trials
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own trials" ON user_trials
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own trials" ON user_trials
  FOR UPDATE USING (auth.uid() = user_id);

-- Create trigger for updated_at
CREATE TRIGGER update_user_trials_updated_at 
  BEFORE UPDATE ON user_trials 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Create function to check if user has active trial
CREATE OR REPLACE FUNCTION has_active_trial(user_uuid UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM user_trials 
    WHERE user_id = user_uuid 
    AND is_active = true
    AND trial_end > NOW()
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to get user's trial info
CREATE OR REPLACE FUNCTION get_user_trial(user_uuid UUID)
RETURNS TABLE (
  trial_id UUID,
  trial_start TIMESTAMP WITH TIME ZONE,
  trial_end TIMESTAMP WITH TIME ZONE,
  is_active BOOLEAN,
  days_remaining INTEGER,
  claimed_at TIMESTAMP WITH TIME ZONE
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    ut.id,
    ut.trial_start,
    ut.trial_end,
    ut.is_active,
    GREATEST(0, EXTRACT(DAY FROM (ut.trial_end - NOW()))::INTEGER) as days_remaining,
    ut.claimed_at
  FROM user_trials ut
  WHERE ut.user_id = user_uuid 
  AND ut.is_active = true
  AND ut.trial_end > NOW()
  ORDER BY ut.claimed_at DESC
  LIMIT 1;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to automatically deactivate expired trials
CREATE OR REPLACE FUNCTION deactivate_expired_trials()
RETURNS INTEGER AS $$
DECLARE
  expired_count INTEGER;
BEGIN
  -- Deactivate expired trials
  UPDATE user_trials 
  SET is_active = false, updated_at = NOW()
  WHERE is_active = true 
  AND trial_end <= NOW();
  
  GET DIAGNOSTICS expired_count = ROW_COUNT;
  
  -- Also cancel trial subscriptions
  UPDATE subscriptions 
  SET status = 'canceled', updated_at = NOW()
  WHERE status = 'trialing' 
  AND user_id IN (
    SELECT user_id FROM user_trials 
    WHERE is_active = false 
    AND trial_end <= NOW()
  );
  
  RETURN expired_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create a scheduled job to run the deactivation function (if pg_cron is available)
-- This would need to be set up in the Supabase dashboard
-- SELECT cron.schedule('deactivate-expired-trials', '0 0 * * *', 'SELECT deactivate_expired_trials();');
