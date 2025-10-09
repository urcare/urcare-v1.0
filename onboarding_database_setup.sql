-- =====================================================
-- UrCare Onboarding Database Setup
-- =====================================================
-- This script creates the necessary tables and functions
-- to store comprehensive onboarding data

-- Drop existing tables if they exist (for clean setup)
DROP TABLE IF EXISTS onboarding_profiles CASCADE;
DROP TABLE IF EXISTS user_health_goals CASCADE;
DROP TABLE IF EXISTS user_chronic_conditions CASCADE;
DROP TABLE IF EXISTS user_medications CASCADE;
DROP TABLE IF EXISTS user_surgery_details CASCADE;
DROP TABLE IF EXISTS user_health_reports CASCADE;

-- =====================================================
-- Main Onboarding Profiles Table
-- =====================================================
CREATE TABLE onboarding_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    
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
    
    -- System Fields
    onboarding_completed BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- Health Goals Table (Many-to-Many)
-- =====================================================
CREATE TABLE user_health_goals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    goal_name TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- Chronic Conditions Table (Many-to-Many)
-- =====================================================
CREATE TABLE user_chronic_conditions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    condition_name TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- Medications Table (Many-to-Many)
-- =====================================================
CREATE TABLE user_medications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    medication_name TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- Surgery Details Table (Many-to-Many)
-- =====================================================
CREATE TABLE user_surgery_details (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    surgery_detail TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- Health Reports Table (Many-to-Many)
-- =====================================================
CREATE TABLE user_health_reports (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    report_name TEXT NOT NULL,
    file_path TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- Indexes for Performance
-- =====================================================
CREATE INDEX idx_onboarding_profiles_user_id ON onboarding_profiles(user_id);
CREATE INDEX idx_user_health_goals_user_id ON user_health_goals(user_id);
CREATE INDEX idx_user_chronic_conditions_user_id ON user_chronic_conditions(user_id);
CREATE INDEX idx_user_medications_user_id ON user_medications(user_id);
CREATE INDEX idx_user_surgery_details_user_id ON user_surgery_details(user_id);
CREATE INDEX idx_user_health_reports_user_id ON user_health_reports(user_id);

-- =====================================================
-- Row Level Security (RLS) Policies
-- =====================================================

-- Enable RLS on all tables
ALTER TABLE onboarding_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_health_goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_chronic_conditions ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_medications ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_surgery_details ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_health_reports ENABLE ROW LEVEL SECURITY;

-- Onboarding Profiles Policies
CREATE POLICY "Users can view own onboarding profile" ON onboarding_profiles
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own onboarding profile" ON onboarding_profiles
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own onboarding profile" ON onboarding_profiles
    FOR UPDATE USING (auth.uid() = user_id);

-- Health Goals Policies
CREATE POLICY "Users can view own health goals" ON user_health_goals
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own health goals" ON user_health_goals
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own health goals" ON user_health_goals
    FOR DELETE USING (auth.uid() = user_id);

-- Chronic Conditions Policies
CREATE POLICY "Users can view own chronic conditions" ON user_chronic_conditions
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own chronic conditions" ON user_chronic_conditions
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own chronic conditions" ON user_chronic_conditions
    FOR DELETE USING (auth.uid() = user_id);

-- Medications Policies
CREATE POLICY "Users can view own medications" ON user_medications
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own medications" ON user_medications
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own medications" ON user_medications
    FOR DELETE USING (auth.uid() = user_id);

-- Surgery Details Policies
CREATE POLICY "Users can view own surgery details" ON user_surgery_details
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own surgery details" ON user_surgery_details
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own surgery details" ON user_surgery_details
    FOR DELETE USING (auth.uid() = user_id);

-- Health Reports Policies
CREATE POLICY "Users can view own health reports" ON user_health_reports
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own health reports" ON user_health_reports
    FOR INSERT WITH CHECK (auth.uid() = user_id);

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
    goal_item JSONB;
    condition_item JSONB;
    medication_item TEXT;
    surgery_item TEXT;
    report_item TEXT;
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
        onboarding_completed = EXCLUDED.onboarding_completed,
        updated_at = NOW()
    RETURNING id INTO profile_id;

    -- Clear existing related data
    DELETE FROM user_health_goals WHERE user_id = p_user_id;
    DELETE FROM user_chronic_conditions WHERE user_id = p_user_id;
    DELETE FROM user_medications WHERE user_id = p_user_id;
    DELETE FROM user_surgery_details WHERE user_id = p_user_id;
    DELETE FROM user_health_reports WHERE user_id = p_user_id;

    -- Insert health goals
    IF p_onboarding_data ? 'healthGoals' AND jsonb_array_length(p_onboarding_data->'healthGoals') > 0 THEN
        FOR goal_item IN SELECT * FROM jsonb_array_elements(p_onboarding_data->'healthGoals')
        LOOP
            INSERT INTO user_health_goals (user_id, goal_name) 
            VALUES (p_user_id, goal_item->>0);
        END LOOP;
    END IF;

    -- Insert chronic conditions
    IF p_onboarding_data ? 'chronicConditions' AND jsonb_array_length(p_onboarding_data->'chronicConditions') > 0 THEN
        FOR condition_item IN SELECT * FROM jsonb_array_elements(p_onboarding_data->'chronicConditions')
        LOOP
            INSERT INTO user_chronic_conditions (user_id, condition_name) 
            VALUES (p_user_id, condition_item->>0);
        END LOOP;
    END IF;

    -- Insert medications
    IF p_onboarding_data ? 'medications' AND jsonb_array_length(p_onboarding_data->'medications') > 0 THEN
        FOR medication_item IN SELECT * FROM jsonb_array_elements_text(p_onboarding_data->'medications')
        LOOP
            INSERT INTO user_medications (user_id, medication_name) 
            VALUES (p_user_id, medication_item);
        END LOOP;
    END IF;

    -- Insert surgery details
    IF p_onboarding_data ? 'surgeryDetails' AND jsonb_array_length(p_onboarding_data->'surgeryDetails') > 0 THEN
        FOR surgery_item IN SELECT * FROM jsonb_array_elements_text(p_onboarding_data->'surgeryDetails')
        LOOP
            INSERT INTO user_surgery_details (user_id, surgery_detail) 
            VALUES (p_user_id, surgery_item);
        END LOOP;
    END IF;

    -- Insert health reports
    IF p_onboarding_data ? 'healthReports' AND jsonb_array_length(p_onboarding_data->'healthReports') > 0 THEN
        FOR report_item IN SELECT * FROM jsonb_array_elements_text(p_onboarding_data->'healthReports')
        LOOP
            INSERT INTO user_health_reports (user_id, report_name) 
            VALUES (p_user_id, report_item);
        END LOOP;
    END IF;

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
    
    -- Build result JSON
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
        'health_goals', (
            SELECT jsonb_agg(goal_name) 
            FROM user_health_goals 
            WHERE user_id = p_user_id
        ),
        'chronic_conditions', (
            SELECT jsonb_agg(condition_name) 
            FROM user_chronic_conditions 
            WHERE user_id = p_user_id
        ),
        'medications', (
            SELECT jsonb_agg(medication_name) 
            FROM user_medications 
            WHERE user_id = p_user_id
        ),
        'surgery_details', (
            SELECT jsonb_agg(surgery_detail) 
            FROM user_surgery_details 
            WHERE user_id = p_user_id
        ),
        'health_reports', (
            SELECT jsonb_agg(report_name) 
            FROM user_health_reports 
            WHERE user_id = p_user_id
        )
    );
    
    RETURN result;
END;
$func$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- Grant Permissions
-- =====================================================
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT ALL ON onboarding_profiles TO authenticated;
GRANT ALL ON user_health_goals TO authenticated;
GRANT ALL ON user_chronic_conditions TO authenticated;
GRANT ALL ON user_medications TO authenticated;
GRANT ALL ON user_surgery_details TO authenticated;
GRANT ALL ON user_health_reports TO authenticated;
GRANT EXECUTE ON FUNCTION save_onboarding_data(UUID, JSONB) TO authenticated;
GRANT EXECUTE ON FUNCTION get_onboarding_data(UUID) TO authenticated;

-- =====================================================
-- Success Message
-- =====================================================
DO $$
BEGIN
    RAISE NOTICE '✅ UrCare Onboarding Database Setup Complete!';
    RAISE NOTICE '📊 Created 6 tables with proper relationships';
    RAISE NOTICE '🔒 Row Level Security enabled on all tables';
    RAISE NOTICE '⚡ Performance indexes created';
    RAISE NOTICE '🛠️ Helper functions created for data management';
    RAISE NOTICE '🎯 Ready to save comprehensive onboarding data!';
END $$;

