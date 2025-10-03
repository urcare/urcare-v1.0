-- Create user_profiles table
-- This table stores comprehensive user profile information collected during onboarding

CREATE TABLE IF NOT EXISTS user_profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    
    -- Basic Information
    full_name TEXT,
    age INTEGER,
    date_of_birth DATE,
    gender TEXT CHECK (gender IN ('male', 'female', 'other')),
    
    -- Unit System
    unit_system TEXT CHECK (unit_system IN ('metric', 'imperial')) DEFAULT 'metric',
    
    -- Height (both metric and imperial)
    height_feet TEXT,
    height_inches TEXT,
    height_cm TEXT,
    
    -- Weight (both metric and imperial)
    weight_lb TEXT,
    weight_kg TEXT,
    
    -- Daily Schedule
    wake_up_time TEXT,
    sleep_time TEXT,
    work_start TEXT,
    work_end TEXT,
    breakfast_time TEXT,
    lunch_time TEXT,
    dinner_time TEXT,
    workout_time TEXT,
    
    -- Health Information
    chronic_conditions TEXT[],
    takes_medications TEXT CHECK (takes_medications IN ('Yes', 'No', 'Prefer not to say')),
    medications TEXT[],
    has_surgery TEXT CHECK (has_surgery IN ('Yes', 'No', 'Prefer not to say')),
    surgery_details TEXT[],
    health_goals TEXT[],
    diet_type TEXT,
    blood_group TEXT CHECK (blood_group IN ('A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-')),
    
    -- Lifestyle Factors
    routine_flexibility TEXT,
    workout_type TEXT,
    smoking TEXT CHECK (smoking IN ('Never', 'Former', 'Current', 'Prefer not to say')),
    drinking TEXT CHECK (drinking IN ('Never', 'Occasionally', 'Regularly', 'Prefer not to say')),
    uses_wearable TEXT CHECK (uses_wearable IN ('Yes', 'No', 'Prefer not to say')),
    wearable_type TEXT,
    track_family TEXT CHECK (track_family IN ('Yes', 'No', 'Prefer not to say')),
    share_progress TEXT CHECK (share_progress IN ('Yes', 'No', 'Prefer not to say')),
    
    -- Emergency & Safety
    emergency_contact_name TEXT,
    emergency_contact_phone TEXT,
    critical_conditions TEXT,
    has_health_reports TEXT CHECK (has_health_reports IN ('Yes', 'No', 'Prefer not to say')),
    health_reports TEXT[],
    referral_code TEXT,
    save_progress TEXT CHECK (save_progress IN ('Yes', 'No', 'Prefer not to say')),
    
    -- System Fields
    status TEXT CHECK (status IN ('active', 'inactive', 'suspended', 'pending')) DEFAULT 'active',
    preferences JSONB DEFAULT '{}',
    onboarding_completed BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_user_profiles_status ON user_profiles(status);
CREATE INDEX IF NOT EXISTS idx_user_profiles_onboarding_completed ON user_profiles(onboarding_completed);
CREATE INDEX IF NOT EXISTS idx_user_profiles_created_at ON user_profiles(created_at);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_user_profiles_updated_at
    BEFORE UPDATE ON user_profiles
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view their own profile" ON user_profiles
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON user_profiles
    FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile" ON user_profiles
    FOR INSERT WITH CHECK (auth.uid() = id);

-- Add comments for documentation
COMMENT ON TABLE user_profiles IS 'Comprehensive user profile information collected during onboarding';
COMMENT ON COLUMN user_profiles.id IS 'References auth.users.id - the authenticated user ID';
COMMENT ON COLUMN user_profiles.unit_system IS 'User preference for metric or imperial units';
COMMENT ON COLUMN user_profiles.chronic_conditions IS 'Array of chronic health conditions';
COMMENT ON COLUMN user_profiles.medications IS 'Array of current medications';
COMMENT ON COLUMN user_profiles.health_goals IS 'Array of user health goals';
COMMENT ON COLUMN user_profiles.preferences IS 'JSON object storing user preferences and settings';
COMMENT ON COLUMN user_profiles.onboarding_completed IS 'Flag indicating if user completed onboarding process';
