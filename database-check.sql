-- Comprehensive Database Check for UrCare Onboarding Issues
-- Run this in your Supabase SQL Editor to identify and fix issues

-- 1. Check if user_profiles table has all required columns
SELECT 
    column_name, 
    data_type, 
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'user_profiles' 
ORDER BY ordinal_position;

-- 2. Check if the new onboarding fields exist
SELECT 
    CASE 
        WHEN EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'user_profiles' AND column_name = 'workout_type') 
        THEN 'EXISTS' 
        ELSE 'MISSING' 
    END as workout_type_status,
    CASE 
        WHEN EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'user_profiles' AND column_name = 'smoking') 
        THEN 'EXISTS' 
        ELSE 'MISSING' 
    END as smoking_status,
    CASE 
        WHEN EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'user_profiles' AND column_name = 'drinking') 
        THEN 'EXISTS' 
        ELSE 'MISSING' 
    END as drinking_status;

-- 3. Check if old columns that should be removed still exist
SELECT 
    CASE 
        WHEN EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'user_profiles' AND column_name = 'uses_wearable') 
        THEN 'STILL EXISTS (should be removed)' 
        ELSE 'REMOVED' 
    END as uses_wearable_status,
    CASE 
        WHEN EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'user_profiles' AND column_name = 'wearable_type') 
        THEN 'STILL EXISTS (should be removed)' 
        ELSE 'REMOVED' 
    END as wearable_type_status;

-- 4. Check RLS policies
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual,
    with_check
FROM pg_policies 
WHERE tablename = 'user_profiles';

-- 5. Check if onboarding_profiles table exists
SELECT 
    CASE 
        WHEN EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'onboarding_profiles') 
        THEN 'EXISTS' 
        ELSE 'MISSING' 
    END as onboarding_profiles_status;

-- 6. Check recent user_profiles data to see if data is being saved
SELECT 
    id,
    full_name,
    date_of_birth,
    onboarding_completed,
    created_at,
    updated_at
FROM user_profiles 
ORDER BY created_at DESC 
LIMIT 5;

-- 7. Check if there are any constraint violations
SELECT 
    conname as constraint_name,
    contype as constraint_type,
    confrelid::regclass as referenced_table
FROM pg_constraint 
WHERE conrelid = 'user_profiles'::regclass;
