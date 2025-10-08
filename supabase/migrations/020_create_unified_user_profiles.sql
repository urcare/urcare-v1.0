-- Create unified user profiles table
-- Merges: user_profiles, onboarding_profiles

CREATE TABLE IF NOT EXISTS user_profiles_unified (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    
    -- Basic profile information
    full_name TEXT,
    age INTEGER,
    date_of_birth DATE,
    gender TEXT,
    unit_system TEXT,
    
    -- Physical measurements
    height_feet TEXT,
    height_inches TEXT,
    height_cm TEXT,
    weight_lb TEXT,
    weight_kg TEXT,
    
    -- Daily schedule
    wake_up_time TEXT,
    sleep_time TEXT,
    work_start TEXT,
    work_end TEXT,
    breakfast_time TEXT,
    lunch_time TEXT,
    dinner_time TEXT,
    workout_time TEXT,
    
    -- Health information
    chronic_conditions TEXT[],
    takes_medications TEXT,
    medications TEXT[],
    has_surgery TEXT,
    surgery_details TEXT[],
    health_goals TEXT[],
    diet_type TEXT,
    blood_group TEXT,
    allergies TEXT[],
    
    -- Lifestyle preferences
    routine_flexibility TEXT,
    workout_type TEXT,
    smoking TEXT,
    drinking TEXT,
    uses_wearable TEXT,
    wearable_type TEXT,
    track_family TEXT,
    share_progress TEXT,
    
    -- Emergency contacts
    emergency_contact_name TEXT,
    emergency_contact_phone TEXT,
    critical_conditions TEXT,
    
    -- Health reports
    has_health_reports TEXT,
    health_reports TEXT[],
    
    -- Referral and preferences
    referral_code TEXT,
    save_progress TEXT,
    status TEXT,
    preferences JSONB,
    
    -- Onboarding information (from onboarding_profiles)
    onboarding_version TEXT,
    completed_steps TEXT[],
    skipped_steps TEXT[],
    completion_percentage INTEGER CHECK (completion_percentage >= 0 AND completion_percentage <= 100),
    onboarding_completed BOOLEAN DEFAULT false,
    
    -- Location information (merged from both tables)
    country TEXT,
    state TEXT,
    district TEXT,
    
    -- Subscription information
    subscription_status TEXT,
    subscription_expires_at TIMESTAMP WITH TIME ZONE,
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_user_profiles_unified_user_id ON user_profiles_unified(user_id);
CREATE INDEX IF NOT EXISTS idx_user_profiles_unified_onboarding_completed ON user_profiles_unified(onboarding_completed);
CREATE INDEX IF NOT EXISTS idx_user_profiles_unified_subscription_status ON user_profiles_unified(subscription_status);
CREATE INDEX IF NOT EXISTS idx_user_profiles_unified_country ON user_profiles_unified(country);
CREATE INDEX IF NOT EXISTS idx_user_profiles_unified_state ON user_profiles_unified(state);

-- Enable Row Level Security
ALTER TABLE user_profiles_unified ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view their own profiles" ON user_profiles_unified
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own profiles" ON user_profiles_unified
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own profiles" ON user_profiles_unified
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own profiles" ON user_profiles_unified
    FOR DELETE USING (auth.uid() = user_id);

-- Create function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_user_profiles_unified_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for updated_at
CREATE TRIGGER trigger_update_user_profiles_unified_updated_at
    BEFORE UPDATE ON user_profiles_unified
    FOR EACH ROW
    EXECUTE FUNCTION update_user_profiles_unified_updated_at();

-- Create function to automatically calculate onboarding completion percentage
CREATE OR REPLACE FUNCTION calculate_onboarding_completion()
RETURNS TRIGGER AS $$
BEGIN
    -- Calculate completion percentage based on completed steps
    IF NEW.completed_steps IS NOT NULL THEN
        DECLARE
            total_steps INTEGER := 10; -- Assuming 10 total onboarding steps
            completed_count INTEGER;
        BEGIN
            completed_count := array_length(NEW.completed_steps, 1);
            IF completed_count IS NULL THEN
                completed_count := 0;
            END IF;
            
            NEW.completion_percentage := ROUND((completed_count::numeric / total_steps::numeric) * 100);
            
            -- Set onboarding_completed if 100% complete
            IF NEW.completion_percentage >= 100 THEN
                NEW.onboarding_completed := true;
            END IF;
        END;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to calculate onboarding completion
CREATE TRIGGER trigger_calculate_onboarding_completion
    BEFORE INSERT OR UPDATE ON user_profiles_unified
    FOR EACH ROW
    EXECUTE FUNCTION calculate_onboarding_completion();
