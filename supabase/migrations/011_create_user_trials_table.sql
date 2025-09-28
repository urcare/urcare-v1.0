-- Create user_trials table
-- This table tracks user trial periods and subscription status

CREATE TABLE IF NOT EXISTS user_trials (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    
    -- Trial information
    trial_started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    trial_ended_at TIMESTAMP WITH TIME ZONE,
    trial_duration_days INTEGER DEFAULT 7,
    trial_status TEXT CHECK (trial_status IN ('active', 'expired', 'converted', 'cancelled')) DEFAULT 'active',
    
    -- Subscription information
    subscription_type TEXT CHECK (subscription_type IN ('monthly', 'yearly', 'lifetime')) DEFAULT NULL,
    subscription_status TEXT CHECK (subscription_status IN ('active', 'cancelled', 'expired', 'pending')) DEFAULT NULL,
    subscription_started_at TIMESTAMP WITH TIME ZONE,
    subscription_ends_at TIMESTAMP WITH TIME ZONE,
    
    -- Trial tracking
    claimed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    converted_at TIMESTAMP WITH TIME ZONE,
    cancelled_at TIMESTAMP WITH TIME ZONE,
    
    -- System fields
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_user_trials_user_id ON user_trials(user_id);
CREATE INDEX IF NOT EXISTS idx_user_trials_trial_status ON user_trials(trial_status);
CREATE INDEX IF NOT EXISTS idx_user_trials_subscription_status ON user_trials(subscription_status);
CREATE INDEX IF NOT EXISTS idx_user_trials_claimed_at ON user_trials(claimed_at);

-- Create updated_at trigger
CREATE TRIGGER update_user_trials_updated_at
    BEFORE UPDATE ON user_trials
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security
ALTER TABLE user_trials ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view their own trial data" ON user_trials
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own trial data" ON user_trials
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own trial data" ON user_trials
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Add comments for documentation
COMMENT ON TABLE user_trials IS 'User trial periods and subscription tracking';
COMMENT ON COLUMN user_trials.user_id IS 'References auth.users.id - the authenticated user ID';
COMMENT ON COLUMN user_trials.trial_status IS 'Current status of the user trial';
COMMENT ON COLUMN user_trials.subscription_status IS 'Current status of the user subscription';
COMMENT ON COLUMN user_trials.claimed_at IS 'When the user claimed their trial';
COMMENT ON COLUMN user_trials.converted_at IS 'When the user converted from trial to paid subscription';
