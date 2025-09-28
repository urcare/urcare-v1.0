-- Ensure onboarding_profiles table has the correct unique constraint
-- This migration fixes the ON CONFLICT issue

-- First, check if the constraint exists and drop it if it does
DO $$ 
BEGIN
    -- Drop the constraint if it exists
    IF EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'unique_onboarding_profiles_user_id' 
        AND table_name = 'onboarding_profiles'
    ) THEN
        ALTER TABLE onboarding_profiles DROP CONSTRAINT unique_onboarding_profiles_user_id;
    END IF;
END $$;

-- Add the unique constraint on user_id
ALTER TABLE onboarding_profiles 
ADD CONSTRAINT unique_onboarding_profiles_user_id UNIQUE (user_id);

-- Verify the constraint was added
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'unique_onboarding_profiles_user_id' 
        AND table_name = 'onboarding_profiles'
    ) THEN
        RAISE EXCEPTION 'Failed to create unique constraint on onboarding_profiles.user_id';
    END IF;
END $$;

-- Add comments for documentation
COMMENT ON CONSTRAINT unique_onboarding_profiles_user_id ON onboarding_profiles IS 'Ensures one onboarding profile per user, enables ON CONFLICT functionality';
