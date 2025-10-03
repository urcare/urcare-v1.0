-- Create onboarding_profiles table
-- This table stores the raw onboarding data as collected during the onboarding process

CREATE TABLE IF NOT EXISTS onboarding_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    
    -- Raw onboarding data as JSON
    details JSONB NOT NULL DEFAULT '{}',
    
    -- Onboarding metadata
    onboarding_version TEXT DEFAULT '1.0',
    completed_steps TEXT[],
    skipped_steps TEXT[],
    completion_percentage INTEGER DEFAULT 0,
    
    -- System fields
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_onboarding_profiles_user_id ON onboarding_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_onboarding_profiles_created_at ON onboarding_profiles(created_at);
CREATE INDEX IF NOT EXISTS idx_onboarding_profiles_completion_percentage ON onboarding_profiles(completion_percentage);

-- Create GIN index for JSONB details column for better query performance
CREATE INDEX IF NOT EXISTS idx_onboarding_profiles_details_gin ON onboarding_profiles USING GIN (details);

-- Create updated_at trigger
CREATE TRIGGER update_onboarding_profiles_updated_at
    BEFORE UPDATE ON onboarding_profiles
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security
ALTER TABLE onboarding_profiles ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view their own onboarding data" ON onboarding_profiles
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own onboarding data" ON onboarding_profiles
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own onboarding data" ON onboarding_profiles
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Add comments for documentation
COMMENT ON TABLE onboarding_profiles IS 'Raw onboarding data collected during user registration process';
COMMENT ON COLUMN onboarding_profiles.user_id IS 'References auth.users.id - the authenticated user ID';
COMMENT ON COLUMN onboarding_profiles.details IS 'JSON object containing all onboarding form data';
COMMENT ON COLUMN onboarding_profiles.onboarding_version IS 'Version of onboarding flow used';
COMMENT ON COLUMN onboarding_profiles.completed_steps IS 'Array of completed onboarding step IDs';
COMMENT ON COLUMN onboarding_profiles.skipped_steps IS 'Array of skipped onboarding step IDs';
COMMENT ON COLUMN onboarding_profiles.completion_percentage IS 'Percentage of onboarding completed (0-100)';
