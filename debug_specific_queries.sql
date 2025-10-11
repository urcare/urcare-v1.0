-- Debug specific queries that Dashboard.tsx makes
-- Run this in Supabase Dashboard → SQL Editor to test each query individually

-- Test 1: Check auth.users table access
SELECT 'auth.users test' as test_name;
SELECT COUNT(*) as user_count FROM auth.users;

-- Test 2: Check profiles table access
SELECT 'profiles table test' as test_name;
SELECT COUNT(*) as profiles_count FROM profiles;

-- Test 3: Check onboarding_profiles table access  
SELECT 'onboarding_profiles table test' as test_name;
SELECT COUNT(*) as onboarding_count FROM onboarding_profiles;

-- Test 4: Check health_analysis table access (should work now)
SELECT 'health_analysis table test' as test_name;
SELECT COUNT(*) as health_analysis_count FROM health_analysis;

-- Test 5: Check health_plans table access
SELECT 'health_plans table test' as test_name;
SELECT COUNT(*) as health_plans_count FROM health_plans;

-- Test 6: Check get_user_daily_activities function
SELECT 'get_user_daily_activities function test' as test_name;
SELECT get_user_daily_activities('52aa4c14-f4db-4ab9-b538-75a0be9e0661'::UUID, CURRENT_DATE);

-- Test 7: Check RLS policies on all tables
SELECT 'RLS policies check' as test_name;
SELECT tablename, policyname, permissive, roles, cmd 
FROM pg_policies 
WHERE tablename IN ('profiles', 'onboarding_profiles', 'health_analysis', 'health_plans', 'daily_activities')
ORDER BY tablename, policyname;

-- Test 8: Check if user has proper access
SELECT 'user access check' as test_name;
SELECT auth.uid() as current_user_id;

-- Test 9: Check daily_activities table access
SELECT 'daily_activities table test' as test_name;
SELECT COUNT(*) as daily_activities_count FROM daily_activities;
