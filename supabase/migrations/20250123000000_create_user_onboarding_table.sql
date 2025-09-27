-- Create user_onboarding table to match the useOnboardingData hook expectations
-- This table stores the structured onboarding data from the new onboarding flow

CREATE TABLE IF NOT EXISTS public.user_onboarding (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name VARCHAR(255),
  age INTEGER,
  height_cm INTEGER,
  weight_kg INTEGER,
  gender VARCHAR(50),
  medical_conditions TEXT[],
  medications TEXT[],
  sleep_quality VARCHAR(50),
  stress_level VARCHAR(50),
  health_goals TEXT[],
  profile_photo_url TEXT,
  records_uploaded BOOLEAN DEFAULT false,
  wearable_connected BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_user_onboarding_user_id ON user_onboarding(user_id);
CREATE INDEX IF NOT EXISTS idx_user_onboarding_medical_conditions ON user_onboarding USING GIN(medical_conditions);
CREATE INDEX IF NOT EXISTS idx_user_onboarding_medications ON user_onboarding USING GIN(medications);
CREATE INDEX IF NOT EXISTS idx_user_onboarding_health_goals ON user_onboarding USING GIN(health_goals);

-- Enable Row Level Security (RLS)
ALTER TABLE public.user_onboarding ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view their own onboarding data" ON user_onboarding
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own onboarding data" ON user_onboarding
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own onboarding data" ON user_onboarding
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own onboarding data" ON user_onboarding
    FOR DELETE USING (auth.uid() = user_id);

-- Create trigger for updated_at
CREATE TRIGGER update_user_onboarding_updated_at 
    BEFORE UPDATE ON user_onboarding 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Add comments for documentation
COMMENT ON TABLE user_onboarding IS 'Stores structured onboarding data from the new onboarding flow';
COMMENT ON COLUMN user_onboarding.medical_conditions IS 'Array of medical conditions reported by user';
COMMENT ON COLUMN user_onboarding.medications IS 'Array of medications taken by user';
COMMENT ON COLUMN user_onboarding.health_goals IS 'Array of health goals set by user';
COMMENT ON COLUMN user_onboarding.sleep_quality IS 'User-reported sleep quality (Poor, Fair, Good, Excellent)';
COMMENT ON COLUMN user_onboarding.stress_level IS 'User-reported stress level (Low, Moderate, High, Very High)';
COMMENT ON COLUMN user_onboarding.records_uploaded IS 'Whether user has uploaded health records';
COMMENT ON COLUMN user_onboarding.wearable_connected IS 'Whether user has connected wearable devices';
