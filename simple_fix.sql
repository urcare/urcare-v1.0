-- =====================================================
-- Simple Fix: Just Create Missing User Profiles
-- =====================================================
-- This script only creates default onboarding profiles for users who don't have one

-- Create default onboarding profiles for users who don't have one
INSERT INTO onboarding_profiles (
    user_id,
    full_name,
    onboarding_completed,
    created_at,
    updated_at
) 
SELECT 
    id,
    COALESCE(raw_user_meta_data->>'full_name', 'New User'),
    false,
    NOW(),
    NOW()
FROM auth.users 
WHERE id NOT IN (SELECT user_id FROM onboarding_profiles)
ON CONFLICT (user_id) DO NOTHING;

-- =====================================================
-- Success Message
-- =====================================================
DO $$
BEGIN
    RAISE NOTICE '✅ Simple Fix Applied Successfully!';
    RAISE NOTICE '📊 Created default profiles for users without onboarding data';
    RAISE NOTICE '🎯 The infinite loop should be fixed now!';
END $$;
