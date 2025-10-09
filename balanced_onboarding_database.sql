-- =====================================================
-- Balanced UrCare Onboarding Database Setup
-- =====================================================
-- Perfect balance: 3 tables - not too simple, not too complex!

-- Drop existing tables if they exist (for clean setup)
DROP TABLE IF EXISTS onboarding_profiles CASCADE;
DROP TABLE IF EXISTS user_health_reports CASCADE;
DROP TABLE IF EXISTS profiles CASCADE;

-- =====================================================
-- Main Onboarding Profiles Table
-- =====================================================
CREATE TABLE onboarding_profiles (
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
    -- These are the ones you mentioned - stored as arrays in main table
    medications JSONB DEFAULT '[]'::jsonb,
    chronic_conditions JSONB DEFAULT '[]'::jsonb,
    surgery_details JSONB DEFAULT '[]'::jsonb,
    health_goals JSONB DEFAULT '[]'::jsonb,
    
    -- System Fields
    onboarding_completed BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- User Profiles Table (for authentication tracking)
-- =====================================================
CREATE TABLE profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT UNIQUE,
    full_name TEXT,
    avatar_url TEXT,
    provider TEXT,
    onboarding_completed BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on profiles table
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Create policies for profiles table
CREATE POLICY "Users can view own profile" ON profiles
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON profiles
    FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON profiles
    FOR UPDATE USING (auth.uid() = id);

-- Create trigger to automatically create profile on user signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO profiles (id, email, full_name, avatar_url, provider)
    VALUES (
        NEW.id,
        COALESCE(NEW.email, ''),
        COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
        COALESCE(NEW.raw_user_meta_data->>'avatar_url', ''),
        COALESCE(NEW.app_metadata->>'provider', 'email')
    )
    ON CONFLICT (id) DO NOTHING;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- =====================================================
-- Health Reports Table (Separate for file storage)
-- =====================================================
CREATE TABLE user_health_reports (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    report_name TEXT NOT NULL,
    file_path TEXT,
    file_size BIGINT,
    mime_type TEXT,
    upload_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- Indexes for Performance
-- =====================================================
CREATE INDEX idx_onboarding_profiles_user_id ON onboarding_profiles(user_id);
CREATE INDEX idx_user_health_reports_user_id ON user_health_reports(user_id);
CREATE INDEX idx_user_health_reports_upload_date ON user_health_reports(upload_date);

-- =====================================================
-- Row Level Security (RLS) Policies
-- =====================================================
ALTER TABLE onboarding_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_health_reports ENABLE ROW LEVEL SECURITY;

-- Onboarding Profiles Policies
CREATE POLICY "Users can view own onboarding profile" ON onboarding_profiles
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own onboarding profile" ON onboarding_profiles
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own onboarding profile" ON onboarding_profiles
    FOR UPDATE USING (auth.uid() = user_id);

-- Health Reports Policies
CREATE POLICY "Users can view own health reports" ON user_health_reports
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own health reports" ON user_health_reports
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own health reports" ON user_health_reports
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own health reports" ON user_health_reports
    FOR DELETE USING (auth.uid() = user_id);

-- =====================================================
-- Functions for Data Management
-- =====================================================

-- Function to save onboarding data
CREATE OR REPLACE FUNCTION save_onboarding_data(
    p_user_id UUID,
    p_onboarding_data JSONB
) RETURNS UUID AS $func$
DECLARE
    profile_id UUID;
BEGIN
    -- Insert or update main onboarding profile
    INSERT INTO onboarding_profiles (
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
        medications,
        chronic_conditions,
        surgery_details,
        health_goals,
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
        COALESCE(p_onboarding_data->'medications', '[]'::jsonb),
        COALESCE(p_onboarding_data->'chronicConditions', '[]'::jsonb),
        COALESCE(p_onboarding_data->'surgeryDetails', '[]'::jsonb),
        COALESCE(p_onboarding_data->'healthGoals', '[]'::jsonb),
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
        medications = EXCLUDED.medications,
        chronic_conditions = EXCLUDED.chronic_conditions,
        surgery_details = EXCLUDED.surgery_details,
        health_goals = EXCLUDED.health_goals,
        onboarding_completed = EXCLUDED.onboarding_completed,
        updated_at = NOW()
    RETURNING id INTO profile_id;

    RETURN profile_id;
END;
$func$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get complete onboarding data
CREATE OR REPLACE FUNCTION get_onboarding_data(p_user_id UUID)
RETURNS JSONB AS $func$
DECLARE
    result JSONB;
    profile_data RECORD;
BEGIN
    -- Get main profile data
    SELECT * INTO profile_data FROM onboarding_profiles WHERE user_id = p_user_id;
    
    IF NOT FOUND THEN
        RETURN NULL;
    END IF;
    
    -- Build result JSON with health reports
    result := jsonb_build_object(
        'id', profile_data.id,
        'user_id', profile_data.user_id,
        'full_name', profile_data.full_name,
        'age', profile_data.age,
        'birth_month', profile_data.birth_month,
        'birth_day', profile_data.birth_day,
        'birth_year', profile_data.birth_year,
        'gender', profile_data.gender,
        'height_feet', profile_data.height_feet,
        'height_inches', profile_data.height_inches,
        'height_cm', profile_data.height_cm,
        'weight_kg', profile_data.weight_kg,
        'country', profile_data.country,
        'state', profile_data.state,
        'district', profile_data.district,
        'wake_up_time', profile_data.wake_up_time,
        'sleep_time', profile_data.sleep_time,
        'work_start', profile_data.work_start,
        'work_end', profile_data.work_end,
        'blood_group', profile_data.blood_group,
        'critical_conditions', profile_data.critical_conditions,
        'diet_type', profile_data.diet_type,
        'breakfast_time', profile_data.breakfast_time,
        'lunch_time', profile_data.lunch_time,
        'dinner_time', profile_data.dinner_time,
        'workout_time', profile_data.workout_time,
        'routine_flexibility', profile_data.routine_flexibility,
        'workout_type', profile_data.workout_type,
        'smoking', profile_data.smoking,
        'drinking', profile_data.drinking,
        'track_family', profile_data.track_family,
        'referral_code', profile_data.referral_code,
        'onboarding_completed', profile_data.onboarding_completed,
        'created_at', profile_data.created_at,
        'updated_at', profile_data.updated_at,
        'medications', profile_data.medications,
        'chronic_conditions', profile_data.chronic_conditions,
        'surgery_details', profile_data.surgery_details,
        'health_goals', profile_data.health_goals,
        'health_reports', (
            SELECT jsonb_agg(
                jsonb_build_object(
                    'id', id,
                    'report_name', report_name,
                    'file_path', file_path,
                    'file_size', file_size,
                    'mime_type', mime_type,
                    'upload_date', upload_date
                )
            ) 
            FROM user_health_reports 
            WHERE user_id = p_user_id
        )
    );
    
    RETURN result;
END;
$func$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to save health report file
CREATE OR REPLACE FUNCTION save_health_report(
    p_user_id UUID,
    p_report_name TEXT,
    p_file_path TEXT,
    p_file_size BIGINT DEFAULT NULL,
    p_mime_type TEXT DEFAULT NULL
) RETURNS UUID AS $func$
DECLARE
    report_id UUID;
BEGIN
    INSERT INTO user_health_reports (
        user_id,
        report_name,
        file_path,
        file_size,
        mime_type
    ) VALUES (
        p_user_id,
        p_report_name,
        p_file_path,
        p_file_size,
        p_mime_type
    ) RETURNING id INTO report_id;
    
    RETURN report_id;
END;
$func$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- Grant Permissions
-- =====================================================
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT ALL ON profiles TO authenticated;
GRANT ALL ON onboarding_profiles TO authenticated;
GRANT ALL ON user_health_reports TO authenticated;
GRANT EXECUTE ON FUNCTION save_onboarding_data(UUID, JSONB) TO authenticated;
GRANT EXECUTE ON FUNCTION get_onboarding_data(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION save_health_report(UUID, TEXT, TEXT, BIGINT, TEXT) TO authenticated;

-- =====================================================
-- Success Message
-- =====================================================
DO $$
BEGIN
    RAISE NOTICE '✅ Balanced UrCare Onboarding Database Setup Complete!';
    RAISE NOTICE '📊 Created 3 tables: profiles + onboarding_profiles + user_health_reports';
    RAISE NOTICE '🔒 Row Level Security enabled on all tables';
    RAISE NOTICE '⚡ JSONB arrays for medications/conditions/surgery in main table';
    RAISE NOTICE '📁 Separate table for health report files';
    RAISE NOTICE '🎯 Perfect balance - not too simple, not too complex!';
END $$;
