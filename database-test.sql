-- Database Test Script for UrCare Onboarding
-- Run this after applying the database fix to verify everything is working

-- 1. Test inserting a sample user profile
INSERT INTO user_profiles (
    id,
    full_name,
    age,
    date_of_birth,
    gender,
    unit_system,
    height_cm,
    weight_kg,
    chronic_conditions,
    health_goals,
    diet_type,
    blood_group,
    workout_type,
    smoking,
    drinking,
    onboarding_completed
) VALUES (
    gen_random_uuid(),
    'Test User',
    25,
    '1999-01-01',
    'Male',
    'metric',
    '175',
    '70',
    ARRAY['None'],
    ARRAY['Weight loss'],
    'Balanced',
    'O+',
    'Gym',
    'Never smoked',
    'Occasionally',
    true
) ON CONFLICT (id) DO NOTHING;

-- 2. Test inserting onboarding profile data
INSERT INTO onboarding_profiles (
    user_id,
    details
) VALUES (
    (SELECT id FROM user_profiles WHERE full_name = 'Test User' LIMIT 1),
    '{"test": "data", "onboarding": "completed"}'
) ON CONFLICT (user_id) DO NOTHING;

-- 3. Verify the data was inserted correctly
SELECT 
    up.id,
    up.full_name,
    up.date_of_birth,
    up.onboarding_completed,
    op.details
FROM user_profiles up
LEFT JOIN onboarding_profiles op ON up.id = op.user_id
WHERE up.full_name = 'Test User';

-- 4. Test updating the profile
UPDATE user_profiles 
SET 
    full_name = 'Test User Updated',
    age = 26,
    updated_at = NOW()
WHERE full_name = 'Test User';

-- 5. Verify the update worked
SELECT 
    full_name,
    age,
    updated_at
FROM user_profiles 
WHERE full_name = 'Test User Updated';

-- 6. Clean up test data
DELETE FROM onboarding_profiles WHERE user_id IN (
    SELECT id FROM user_profiles WHERE full_name = 'Test User Updated'
);
DELETE FROM user_profiles WHERE full_name = 'Test User Updated';

-- 7. Final verification
SELECT 'Database test completed successfully!' as status;
