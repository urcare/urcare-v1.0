-- =====================================================
-- Fix Missing completion_percentage Column
-- =====================================================
-- This script adds the missing completion_percentage column to onboarding_profiles table

-- Add completion_percentage column to onboarding_profiles table
ALTER TABLE onboarding_profiles 
ADD COLUMN IF NOT EXISTS completion_percentage INTEGER DEFAULT 0 CHECK (completion_percentage >= 0 AND completion_percentage <= 100);

-- Update the save_onboarding_data function to handle completion_percentage
DROP FUNCTION IF EXISTS save_onboarding_data(UUID, JSONB);

CREATE FUNCTION save_onboarding_data(user_id UUID, profile_data JSONB)
RETURNS JSONB AS $$
DECLARE
    result JSONB;
BEGIN
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
        workout_type,
        workout_duration,
        workout_days,
        smoking,
        drinking,
        chronic_conditions,
        medications,
        surgery_details,
        health_goals,
        onboarding_completed,
        health_assessment_completed,
        completion_percentage,
        created_at,
        updated_at
    ) VALUES (
        user_id,
        profile_data->>'full_name',
        (profile_data->>'age')::INTEGER,
        profile_data->>'birth_month',
        profile_data->>'birth_day',
        profile_data->>'birth_year',
        profile_data->>'gender',
        profile_data->>'height_feet',
        profile_data->>'height_inches',
        profile_data->>'height_cm',
        profile_data->>'weight_kg',
        profile_data->>'country',
        profile_data->>'state',
        profile_data->>'district',
        profile_data->>'wake_up_time',
        profile_data->>'sleep_time',
        profile_data->>'work_start',
        profile_data->>'work_end',
        profile_data->>'blood_group',
        profile_data->>'critical_conditions',
        profile_data->>'diet_type',
        profile_data->>'breakfast_time',
        profile_data->>'lunch_time',
        profile_data->>'dinner_time',
        profile_data->>'workout_type',
        profile_data->>'workout_duration',
        profile_data->>'workout_days',
        profile_data->>'smoking',
        profile_data->>'drinking',
        profile_data->'chronic_conditions',
        profile_data->'medications',
        profile_data->'surgery_details',
        profile_data->'health_goals',
        COALESCE((profile_data->>'onboarding_completed')::BOOLEAN, TRUE),
        COALESCE((profile_data->>'health_assessment_completed')::BOOLEAN, FALSE),
        COALESCE((profile_data->>'completion_percentage')::INTEGER, 0),
        NOW(),
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
        workout_type = EXCLUDED.workout_type,
        workout_duration = EXCLUDED.workout_duration,
        workout_days = EXCLUDED.workout_days,
        smoking = EXCLUDED.smoking,
        drinking = EXCLUDED.drinking,
        chronic_conditions = EXCLUDED.chronic_conditions,
        medications = EXCLUDED.medications,
        surgery_details = EXCLUDED.surgery_details,
        health_goals = EXCLUDED.health_goals,
        onboarding_completed = EXCLUDED.onboarding_completed,
        health_assessment_completed = EXCLUDED.health_assessment_completed,
        completion_percentage = EXCLUDED.completion_percentage,
        updated_at = NOW()
    RETURNING jsonb_build_object(
        'success', true,
        'user_id', user_id,
        'onboarding_completed', onboarding_completed,
        'health_assessment_completed', health_assessment_completed,
        'completion_percentage', completion_percentage,
        'message', 'Onboarding data saved successfully'
    ) INTO result;
    
    RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Update the get_onboarding_data function to include completion_percentage
DROP FUNCTION IF EXISTS get_onboarding_data(UUID);

CREATE FUNCTION get_onboarding_data(user_id UUID)
RETURNS JSONB AS $$
DECLARE
    result JSONB;
BEGIN
    SELECT jsonb_build_object(
        'success', true,
        'data', jsonb_build_object(
            'full_name', full_name,
            'age', age,
            'birth_month', birth_month,
            'birth_day', birth_day,
            'birth_year', birth_year,
            'gender', gender,
            'height_feet', height_feet,
            'height_inches', height_inches,
            'height_cm', height_cm,
            'weight_kg', weight_kg,
            'country', country,
            'state', state,
            'district', district,
            'wake_up_time', wake_up_time,
            'sleep_time', sleep_time,
            'work_start', work_start,
            'work_end', work_end,
            'blood_group', blood_group,
            'critical_conditions', critical_conditions,
            'diet_type', diet_type,
            'breakfast_time', breakfast_time,
            'lunch_time', lunch_time,
            'dinner_time', dinner_time,
            'workout_type', workout_type,
            'workout_duration', workout_duration,
            'workout_days', workout_days,
            'smoking', smoking,
            'drinking', drinking,
            'chronic_conditions', chronic_conditions,
            'medications', medications,
            'surgery_details', surgery_details,
            'health_goals', health_goals,
            'onboarding_completed', onboarding_completed,
            'health_assessment_completed', health_assessment_completed,
            'completion_percentage', completion_percentage,
            'created_at', created_at,
            'updated_at', updated_at
        )
    ) INTO result
    FROM onboarding_profiles
    WHERE onboarding_profiles.user_id = get_onboarding_data.user_id;
    
    IF result IS NULL THEN
        RETURN jsonb_build_object(
            'success', false,
            'message', 'No onboarding data found for user'
        );
    END IF;
    
    RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permissions for updated functions
GRANT EXECUTE ON FUNCTION save_onboarding_data(UUID, JSONB) TO authenticated;
GRANT EXECUTE ON FUNCTION get_onboarding_data(UUID) TO authenticated;

-- =====================================================
-- Success Message
-- =====================================================
DO $$
BEGIN
    RAISE NOTICE '✅ Completion Percentage Column Added Successfully!';
    RAISE NOTICE '📊 Added completion_percentage field to onboarding_profiles';
    RAISE NOTICE '🔧 Updated save_onboarding_data and get_onboarding_data functions';
    RAISE NOTICE '🎯 Database schema is now consistent with application code!';
END $$;
