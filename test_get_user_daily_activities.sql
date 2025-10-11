-- Test the get_user_daily_activities function specifically
-- This will help identify if the function is the problem

-- Test 1: Check if function exists
SELECT 'Function exists check' as test_name;
SELECT routine_name, routine_type, data_type 
FROM information_schema.routines 
WHERE routine_name = 'get_user_daily_activities';

-- Test 2: Test function with your user ID and today's date
SELECT 'Function call test' as test_name;
SELECT get_user_daily_activities('52aa4c14-f4db-4ab9-b538-75a0be9e0661'::UUID, CURRENT_DATE);

-- Test 3: Test function with your user ID and a specific date
SELECT 'Function call with specific date test' as test_name;
SELECT get_user_daily_activities('52aa4c14-f4db-4ab9-b538-75a0be9e0661'::UUID, '2025-01-11'::DATE);

-- Test 4: Check what data exists in daily_activities for your user
SELECT 'Daily activities data check' as test_name;
SELECT user_id, activity_date, COUNT(*) as activity_count 
FROM daily_activities 
WHERE user_id = '52aa4c14-f4db-4ab9-b538-75a0be9e0661'::UUID
GROUP BY user_id, activity_date
ORDER BY activity_date DESC
LIMIT 5;

-- Test 5: Check if there are any activities for today
SELECT 'Today activities check' as test_name;
SELECT COUNT(*) as today_activities_count 
FROM daily_activities 
WHERE user_id = '52aa4c14-f4db-4ab9-b538-75a0be9e0661'::UUID 
AND activity_date = CURRENT_DATE;
