-- Create user_profiles table for storing user onboarding data
CREATE TABLE IF NOT EXISTS user_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    full_name VARCHAR(255),
    age INTEGER,
    date_of_birth DATE,
    gender VARCHAR(50),
    unit_system VARCHAR(10) DEFAULT 'metric',
    height_feet VARCHAR(10),
    height_inches VARCHAR(10),
    height_cm VARCHAR(10),
    weight_lb VARCHAR(10),
    weight_kg VARCHAR(10),
    wake_up_time TIME,
    sleep_time TIME,
    work_start TIME,
    work_end TIME,
    chronic_conditions TEXT[],
    takes_medications VARCHAR(10),
    medications TEXT[],
    has_surgery VARCHAR(10),
    surgery_details TEXT[],
    health_goals TEXT[],
    diet_type VARCHAR(100),
    blood_group VARCHAR(10),
    breakfast_time TIME,
    lunch_time TIME,
    dinner_time TIME,
    workout_time TIME,
    routine_flexibility VARCHAR(50),
    uses_wearable VARCHAR(10),
    wearable_type VARCHAR(100),
    track_family VARCHAR(10),
    share_progress VARCHAR(10),
    emergency_contact_name VARCHAR(255),
    emergency_contact_phone VARCHAR(20),
    critical_conditions TEXT,
    has_health_reports VARCHAR(10),
    health_reports TEXT[],
    referral_code VARCHAR(50),
    save_progress VARCHAR(10),
    status VARCHAR(20) DEFAULT 'active',
    preferences JSONB DEFAULT '{}',
    onboarding_completed BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- NEW: Lifestyle fields (no restrictive CHECK)
    drinking VARCHAR(20),   -- e.g., 'never', 'rarely', 'sometimes', 'often', 'daily'
    smoking VARCHAR(20),    -- same as above
    
    -- Ensure one profile per user
    UNIQUE(id)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_user_profiles_onboarding_completed ON user_profiles(onboarding_completed);
CREATE INDEX IF NOT EXISTS idx_user_profiles_status ON user_profiles(status);

-- Enable Row Level Security (RLS)
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for user_profiles
CREATE POLICY "Users can view their own profile" ON user_profiles
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile" ON user_profiles
    FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON user_profiles
    FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can delete their own profile" ON user_profiles
    FOR DELETE USING (auth.uid() = id);

-- Create trigger for updated_at (ensure this function exists)
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_user_profiles_updated_at 
    BEFORE UPDATE ON user_profiles 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();