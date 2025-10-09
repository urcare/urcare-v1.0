-- =====================================================
-- UrCare Database Setup - Run this to fix the infinite loop
-- =====================================================

-- First, run the main onboarding database setup
\i balanced_onboarding_database.sql

-- Then run the subscription database setup  
\i subscription_database.sql

-- Finally, add the health assessment field
\i add_health_assessment_field.sql

-- Fix the missing completion_percentage column
\i fix_completion_percentage.sql

-- =====================================================
-- Quick Fix: Create a simple onboarding_profiles record for testing
-- =====================================================

-- This will create a basic record so the queries don't fail
INSERT INTO onboarding_profiles (
    user_id,
    full_name,
    onboarding_completed,
    health_assessment_completed,
    completion_percentage,
    created_at,
    updated_at
) 
SELECT 
    id,
    COALESCE(raw_user_meta_data->>'full_name', 'Test User'),
    false,
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
    RAISE NOTICE '✅ UrCare Database Setup Complete!';
    RAISE NOTICE '📊 All tables created and populated';
    RAISE NOTICE '🔒 RLS policies enabled';
    RAISE NOTICE '⚡ Functions created and granted permissions';
    RAISE NOTICE '🎯 Infinite loop should be fixed now!';
END $$;

