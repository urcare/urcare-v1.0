-- =====================================================
-- Fix User Profile and Create Default Onboarding Profile
-- =====================================================
-- This script fixes the missing completion_percentage column and creates default profiles

-- Add the missing column
ALTER TABLE onboarding_profiles 
ADD COLUMN IF NOT EXISTS completion_percentage INTEGER DEFAULT 0 CHECK (completion_percentage >= 0 AND completion_percentage <= 100);

-- Update existing records to have completion_percentage = 0 if they don't have it
UPDATE onboarding_profiles 
SET completion_percentage = 0 
WHERE completion_percentage IS NULL;

-- Create default onboarding profiles for users who don't have one
INSERT INTO onboarding_profiles (
    user_id,
    full_name,
    onboarding_completed,
    completion_percentage,
    created_at,
    updated_at
) 
SELECT 
    id,
    COALESCE(raw_user_meta_data->>'full_name', 'New User'),
    false,
    0,
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
    RAISE NOTICE '✅ User Profile Fix Applied Successfully!';
    RAISE NOTICE '📊 Added completion_percentage column to onboarding_profiles';
    RAISE NOTICE '🔧 Created default profiles for users without onboarding data';
    RAISE NOTICE '🎯 The infinite loop should be fixed now!';
END $$;
