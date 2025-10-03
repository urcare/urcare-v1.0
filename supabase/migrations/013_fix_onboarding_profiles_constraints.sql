-- Fix onboarding_profiles table constraints
-- This migration adds the necessary unique constraint for ON CONFLICT to work

-- Add unique constraint on user_id to enable ON CONFLICT functionality
ALTER TABLE onboarding_profiles 
ADD CONSTRAINT unique_onboarding_profiles_user_id UNIQUE (user_id);

-- Update the existing RLS policies to be more specific
DROP POLICY IF EXISTS "Users can update their own onboarding data" ON onboarding_profiles;
DROP POLICY IF EXISTS "Users can insert their own onboarding data" ON onboarding_profiles;

-- Recreate the policies with better naming
CREATE POLICY "Users can update their own onboarding data" ON onboarding_profiles
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own onboarding data" ON onboarding_profiles
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Add a policy for upsert operations (INSERT ... ON CONFLICT)
CREATE POLICY "Users can upsert their own onboarding data" ON onboarding_profiles
    FOR ALL USING (auth.uid() = user_id);

-- Add comments for documentation
COMMENT ON CONSTRAINT unique_onboarding_profiles_user_id ON onboarding_profiles IS 'Ensures one onboarding profile per user, enables ON CONFLICT functionality';
