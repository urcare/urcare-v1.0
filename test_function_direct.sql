-- Direct test of the get_user_daily_activities function
-- This will help identify the exact issue

-- Test with the specific user ID that's failing
SELECT 'Testing get_user_daily_activities function...' as test_name;

-- Test 1: Check if function exists
SELECT 
    routine_name, 
    routine_type, 
    data_type as return_type
FROM information_schema.routines 
WHERE routine_schema = 'public' 
AND routine_name = 'get_user_daily_activities';

-- Test 2: Try calling the function with the failing user ID
SELECT 'Calling function with user ID: b73be2d4-b0c2-4d2b-837d-100d486aa32f' as test_name;
SELECT * FROM get_user_daily_activities(
    'b73be2d4-b0c2-4d2b-837d-100d486aa32f'::UUID, 
    CURRENT_DATE
);

-- Test 3: Check if there are any activities for this user
SELECT 'Checking existing activities...' as test_name;
SELECT 
    id,
    activity,
    user_id,
    created_at
FROM daily_activities 
WHERE user_id = 'b73be2d4-b0c2-4d2b-837d-100d486aa32f'
LIMIT 5;

-- Test 4: Check table structure
SELECT 'Checking daily_activities table structure...' as test_name;
SELECT 
    column_name, 
    data_type, 
    is_nullable
FROM information_schema.columns 
WHERE table_name = 'daily_activities' 
AND table_schema = 'public'
ORDER BY ordinal_position;
