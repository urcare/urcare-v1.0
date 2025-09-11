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
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_user_trials_user_id ON user_trials(user_id);
CREATE INDEX IF NOT EXISTS idx_user_trials_is_active ON user_trials(is_active);
CREATE INDEX IF NOT EXISTS idx_user_trials_trial_end ON user_trials(trial_end);

-- Enable RLS
ALTER TABLE user_trials ENABLE ROW LEVEL SECURITY;

-- RLS Policies for user_trials
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'user_trials' AND policyname = 'Users can view their own trials') THEN
        CREATE POLICY "Users can view their own trials" ON user_trials
          FOR SELECT USING (auth.uid() = user_id);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'user_trials' AND policyname = 'Users can insert their own trials') THEN
        CREATE POLICY "Users can insert their own trials" ON user_trials
          FOR INSERT WITH CHECK (auth.uid() = user_id);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'user_trials' AND policyname = 'Users can update their own trials') THEN
        CREATE POLICY "Users can update their own trials" ON user_trials
          FOR UPDATE USING (auth.uid() = user_id);
    END IF;
END $$;
