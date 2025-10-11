-- Test the remaining queries that Dashboard.tsx makes
-- These are the most likely culprits for the timeout

-- Test 1: Check profiles table access and structure
SELECT 'profiles table test' as test_name;
SELECT COUNT(*) as profiles_count FROM profiles;

-- Test 2: Check onboarding_profiles table access and structure  
SELECT 'onboarding_profiles table test' as test_name;
SELECT COUNT(*) as onboarding_count FROM onboarding_profiles;

-- Test 3: Check health_plans table access and structure
SELECT 'health_plans table test' as test_name;
SELECT COUNT(*) as health_plans_count FROM health_plans;

-- Test 4: Check if there are any RLS policies blocking access
SELECT 'RLS policies check' as test_name;
SELECT tablename, policyname, permissive, roles, cmd, qual
FROM pg_policies 
WHERE tablename IN ('profiles', 'onboarding_profiles', 'health_plans')
ORDER BY tablename, policyname;

-- Test 5: Check if user has access to these tables
SELECT 'User access check' as test_name;
SELECT auth.uid() as current_user_id;

-- Test 6: Test a simple query on each table with user filter
SELECT 'profiles with user filter test' as test_name;
SELECT COUNT(*) as user_profiles_count 
FROM profiles 
WHERE id = '52aa4c14-f4db-4ab9-b538-75a0be9e0661'::UUID;

-- Test 7: Test onboarding_profiles with user filter
SELECT 'onboarding_profiles with user filter test' as test_name;
SELECT COUNT(*) as user_onboarding_count 
FROM onboarding_profiles 
WHERE user_id = '52aa4c14-f4db-4ab9-b538-75a0be9e0661'::UUID;

-- Test 8: Test health_plans with user filter
SELECT 'health_plans with user filter test' as test_name;
SELECT COUNT(*) as user_health_plans_count 
FROM health_plans 
WHERE user_id = '52aa4c14-f4db-4ab9-b538-75a0be9e0661'::UUID;
