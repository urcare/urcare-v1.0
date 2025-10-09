-- =====================================================
-- Quick Database Fix for completion_percentage Column
-- =====================================================
-- Run this script to fix the missing completion_percentage column

-- Add the missing column
ALTER TABLE onboarding_profiles 
ADD COLUMN IF NOT EXISTS completion_percentage INTEGER DEFAULT 0 CHECK (completion_percentage >= 0 AND completion_percentage <= 100);

-- Update existing records to have completion_percentage = 0 if they don't have it
UPDATE onboarding_profiles 
SET completion_percentage = 0 
WHERE completion_percentage IS NULL;

-- =====================================================
-- Success Message
-- =====================================================
DO $$
BEGIN
    RAISE NOTICE '✅ Database Fix Applied Successfully!';
    RAISE NOTICE '📊 Added completion_percentage column to onboarding_profiles';
    RAISE NOTICE '🔧 Updated existing records with default value';
    RAISE NOTICE '🎯 The application should now work without errors!';
END $$;
