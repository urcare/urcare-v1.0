-- =====================================================
-- Simple UrCare Onboarding Database Setup
-- =====================================================
-- Single table approach - much simpler!

-- Drop existing table if it exists
DROP TABLE IF EXISTS user_onboarding_data CASCADE;

-- =====================================================
-- Single Comprehensive Onboarding Table
-- =====================================================
CREATE TABLE user_onboarding_data (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
    
    -- Basic Information
    full_name TEXT,
    age INTEGER,
    birth_month TEXT,
    birth_day TEXT,
    birth_year TEXT,
    gender TEXT,
    
    -- Physical Measurements
    height_feet TEXT,
    height_inches TEXT,
    height_cm TEXT,
    weight_kg TEXT,
    
    -- Demographics
    country TEXT,
    state TEXT,
    district TEXT,
    
    -- Daily Schedule
    wake_up_time TEXT,
    sleep_time TEXT,
    work_start TEXT,
    work_end TEXT,
    
    -- Health Information
    blood_group TEXT,
    critical_conditions TEXT,
    
    -- Lifestyle & Preferences
    diet_type TEXT,
    breakfast_time TEXT,
    lunch_time TEXT,
    dinner_time TEXT,
    workout_time TEXT,
    routine_flexibility TEXT,
    workout_type TEXT,
    smoking TEXT,
    drinking TEXT,
    
    -- Additional Features
    track_family TEXT,
    referral_code TEXT,
    
    -- Arrays for multiple values (stored as JSONB)
    health_goals JSONB DEFAULT '[]'::jsonb,
    chronic_conditions JSONB DEFAULT '[]'::jsonb,
    medications JSONB DEFAULT '[]'::jsonb,
    surgery_details JSONB DEFAULT '[]'::jsonb,
    health_reports JSONB DEFAULT '[]'::jsonb,
    
    -- System Fields
    onboarding_completed BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- Health Reports Table (Only for file storage)
-- =====================================================
CREATE TABLE user_health_report_files (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    report_name TEXT NOT NULL,
    file_path TEXT,
    file_size BIGINT,
    mime_type TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- Indexes for Performance
-- =====================================================
CREATE INDEX idx_user_onboarding_data_user_id ON user_onboarding_data(user_id);
CREATE INDEX idx_user_health_report_files_user_id ON user_health_report_files(user_id);

-- =====================================================
-- Row Level Security (RLS) Policies
-- =====================================================
ALTER TABLE user_onboarding_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_health_report_files ENABLE ROW LEVEL SECURITY;

-- Onboarding Data Policies
CREATE POLICY "Users can view own onboarding data" ON user_onboarding_data
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own onboarding data" ON user_onboarding_data
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own onboarding data" ON user_onboarding_data
    FOR UPDATE USING (auth.uid() = user_id);

-- Health Report Files Policies
CREATE POLICY "Users can view own health report files" ON user_health_report_files
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own health report files" ON user_health_report_files
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own health report files" ON user_health_report_files
    FOR DELETE USING (auth.uid() = user_id);

-- =====================================================
-- Simple Functions for Data Management
-- =====================================================

-- Function to save onboarding data (much simpler!)
CREATE OR REPLACE FUNCTION save_onboarding_data(
    p_user_id UUID,
    p_onboarding_data JSONB
) RETURNS UUID AS $func$
DECLARE
    profile_id UUID;
BEGIN
    -- Insert or update onboarding data
    INSERT INTO user_onboarding_data (
        user_id,
        full_name,
        age,
        birth_month,
        birth_day,
        birth_year,
        gender,
        height_feet,
        height_inches,
        height_cm,
        weight_kg,
        country,
        state,
        district,
        wake_up_time,
        sleep_time,
        work_start,
        work_end,
        blood_group,
        critical_conditions,
        diet_type,
        breakfast_time,
        lunch_time,
        dinner_time,
        workout_time,
        routine_flexibility,
        workout_type,
        smoking,
        drinking,
        track_family,
        referral_code,
        health_goals,
        chronic_conditions,
        medications,
        surgery_details,
        health_reports,
        onboarding_completed,
        updated_at
    ) VALUES (
        p_user_id,
        p_onboarding_data->>'fullName',
        (p_onboarding_data->>'age')::INTEGER,
        p_onboarding_data->>'birthMonth',
        p_onboarding_data->>'birthDay',
        p_onboarding_data->>'birthYear',
        p_onboarding_data->>'gender',
        p_onboarding_data->>'heightFeet',
        p_onboarding_data->>'heightInches',
        p_onboarding_data->>'heightCm',
        p_onboarding_data->>'weightKg',
        p_onboarding_data->>'country',
        p_onboarding_data->>'state',
        p_onboarding_data->>'district',
        p_onboarding_data->>'wakeUpTime',
        p_onboarding_data->>'sleepTime',
        p_onboarding_data->>'workStart',
        p_onboarding_data->>'workEnd',
        p_onboarding_data->>'bloodGroup',
        p_onboarding_data->>'criticalConditions',
        p_onboarding_data->>'dietType',
        p_onboarding_data->>'breakfastTime',
        p_onboarding_data->>'lunchTime',
        p_onboarding_data->>'dinnerTime',
        p_onboarding_data->>'workoutTime',
        p_onboarding_data->>'routineFlexibility',
        p_onboarding_data->>'workoutType',
        p_onboarding_data->>'smoking',
        p_onboarding_data->>'drinking',
        p_onboarding_data->>'trackFamily',
        p_onboarding_data->>'referralCode',
        COALESCE(p_onboarding_data->'healthGoals', '[]'::jsonb),
        COALESCE(p_onboarding_data->'chronicConditions', '[]'::jsonb),
        COALESCE(p_onboarding_data->'medications', '[]'::jsonb),
        COALESCE(p_onboarding_data->'surgeryDetails', '[]'::jsonb),
        COALESCE(p_onboarding_data->'healthReports', '[]'::jsonb),
        TRUE,
        NOW()
    )
    ON CONFLICT (user_id) DO UPDATE SET
        full_name = EXCLUDED.full_name,
        age = EXCLUDED.age,
        birth_month = EXCLUDED.birth_month,
        birth_day = EXCLUDED.birth_day,
        birth_year = EXCLUDED.birth_year,
        gender = EXCLUDED.gender,
        height_feet = EXCLUDED.height_feet,
        height_inches = EXCLUDED.height_inches,
        height_cm = EXCLUDED.height_cm,
        weight_kg = EXCLUDED.weight_kg,
        country = EXCLUDED.country,
        state = EXCLUDED.state,
        district = EXCLUDED.district,
        wake_up_time = EXCLUDED.wake_up_time,
        sleep_time = EXCLUDED.sleep_time,
        work_start = EXCLUDED.work_start,
        work_end = EXCLUDED.work_end,
        blood_group = EXCLUDED.blood_group,
        critical_conditions = EXCLUDED.critical_conditions,
        diet_type = EXCLUDED.diet_type,
        breakfast_time = EXCLUDED.breakfast_time,
        lunch_time = EXCLUDED.lunch_time,
        dinner_time = EXCLUDED.dinner_time,
        workout_time = EXCLUDED.workout_time,
        routine_flexibility = EXCLUDED.routine_flexibility,
        workout_type = EXCLUDED.workout_type,
        smoking = EXCLUDED.smoking,
        drinking = EXCLUDED.drinking,
        track_family = EXCLUDED.track_family,
        referral_code = EXCLUDED.referral_code,
        health_goals = EXCLUDED.health_goals,
        chronic_conditions = EXCLUDED.chronic_conditions,
        medications = EXCLUDED.medications,
        surgery_details = EXCLUDED.surgery_details,
        health_reports = EXCLUDED.health_reports,
        onboarding_completed = EXCLUDED.onboarding_completed,
        updated_at = NOW()
    RETURNING id INTO profile_id;

    RETURN profile_id;
END;
$func$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get onboarding data (much simpler!)
CREATE OR REPLACE FUNCTION get_onboarding_data(p_user_id UUID)
RETURNS JSONB AS $func$
DECLARE
    result JSONB;
BEGIN
    SELECT to_jsonb(t.*) INTO result
    FROM user_onboarding_data t
    WHERE user_id = p_user_id;
    
    RETURN result;
END;
$func$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- Grant Permissions
-- =====================================================
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT ALL ON user_onboarding_data TO authenticated;
GRANT ALL ON user_health_report_files TO authenticated;
GRANT EXECUTE ON FUNCTION save_onboarding_data(UUID, JSONB) TO authenticated;
GRANT EXECUTE ON FUNCTION get_onboarding_data(UUID) TO authenticated;

-- =====================================================
-- Success Message
-- =====================================================
DO $$
BEGIN
    RAISE NOTICE '✅ Simple UrCare Onboarding Database Setup Complete!';
    RAISE NOTICE '📊 Created 2 tables (main + file storage)';
    RAISE NOTICE '🔒 Row Level Security enabled';
    RAISE NOTICE '⚡ Simple JSONB arrays for multiple values';
    RAISE NOTICE '🎯 Much simpler to manage and query!';
END $$;
