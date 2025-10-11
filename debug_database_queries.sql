-- Debug script to test each database query individually
-- Run this in Supabase Dashboard → SQL Editor to identify which query is hanging

-- Test 1: Check if health_analysis table exists and is accessible
SELECT 'health_analysis table test' as test_name;
SELECT COUNT(*) as health_analysis_count FROM health_analysis;

-- Test 2: Check if get_user_daily_activities function exists and works
SELECT 'get_user_daily_activities function test' as test_name;
SELECT get_user_daily_activities('52aa4c14-f4db-4ab9-b538-75a0be9e0661'::UUID, CURRENT_DATE);

-- Test 3: Check if health_plans table exists and is accessible
SELECT 'health_plans table test' as test_name;
SELECT COUNT(*) as health_plans_count FROM health_plans;

-- Test 4: Check if profiles table exists and is accessible
SELECT 'profiles table test' as test_name;
SELECT COUNT(*) as profiles_count FROM profiles;

-- Test 5: Check if onboarding_profiles table exists and is accessible
SELECT 'onboarding_profiles table test' as test_name;
SELECT COUNT(*) as onboarding_profiles_count FROM onboarding_profiles;

-- Test 6: Check RLS policies on health_analysis
SELECT 'health_analysis RLS policies test' as test_name;
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual 
FROM pg_policies 
WHERE tablename = 'health_analysis';

-- Test 7: Check if user has access to health_analysis
SELECT 'user access test' as test_name;
SELECT auth.uid() as current_user_id;

-- Test 8: Check health_analysis table structure
SELECT 'health_analysis structure test' as test_name;
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'health_analysis' 
ORDER BY ordinal_position;
