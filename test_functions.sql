-- Test all functions to ensure they work correctly
-- Run this after the cleanup script to verify everything works

-- Test 1: Test get_user_daily_activities function
-- Replace 'b73be2d4-b0c2-4d2b-837d-100d486aa32f' with actual user ID
SELECT 'Testing get_user_daily_activities...' as test_name;
SELECT * FROM get_user_daily_activities(
    'b73be2d4-b0c2-4d2b-837d-100d486aa32f'::UUID, 
    CURRENT_DATE
);

-- Test 2: Test save_daily_activities function
SELECT 'Testing save_daily_activities...' as test_name;
SELECT save_daily_activities(
    'b73be2d4-b0c2-4d2b-837d-100d486aa32f'::UUID,
    CURRENT_DATE,
    '[
        {
            "activity": "Morning Walk",
            "time": "7:00 AM",
            "duration": "30 minutes",
            "category": "Exercise",
            "instructions": "Walk at moderate pace|Focus on breathing|Enjoy the outdoors"
        },
        {
            "activity": "Healthy Breakfast",
            "time": "8:00 AM", 
            "duration": "20 minutes",
            "category": "Nutrition",
            "instructions": "Include protein|Add fruits|Stay hydrated"
        }
    ]'::jsonb
) as saved_activity_id;

-- Test 3: Test mark_activity_completed function
-- First get an activity ID from the previous test
SELECT 'Testing mark_activity_completed...' as test_name;
-- This will only work if there are activities in the database
SELECT mark_activity_completed(
    (SELECT id FROM daily_activities WHERE user_id = 'b73be2d4-b0c2-4d2b-837d-100d486aa32f' LIMIT 1),
    'b73be2d4-b0c2-4d2b-837d-100d486aa32f'::UUID,
    'Test completion'
) as activity_marked;

-- Test 4: Test mark_old_analyses_not_latest function
SELECT 'Testing mark_old_analyses_not_latest...' as test_name;
SELECT mark_old_analyses_not_latest('b73be2d4-b0c2-4d2b-837d-100d486aa32f'::UUID);

-- Test 5: Verify final state
SELECT 'Final verification...' as test_name;
SELECT 
    COUNT(*) as total_activities,
    COUNT(CASE WHEN is_completed = true THEN 1 END) as completed_activities
FROM daily_activities 
WHERE user_id = 'b73be2d4-b0c2-4d2b-837d-100d486aa32f';
