-- Fix onboarding_profiles RLS policies
-- This migration cleans up conflicting RLS policies and ensures proper access

-- Drop all existing policies to start fresh
DROP POLICY IF EXISTS "Users can view their own onboarding data" ON onboarding_profiles;
DROP POLICY IF EXISTS "Users can update their own onboarding data" ON onboarding_profiles;
DROP POLICY IF EXISTS "Users can insert their own onboarding data" ON onboarding_profiles;
DROP POLICY IF EXISTS "Users can upsert their own onboarding data" ON onboarding_profiles;

-- Create comprehensive policies that cover all operations
CREATE POLICY "Users can manage their own onboarding data" ON onboarding_profiles
    FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- Add a specific policy for SELECT operations (for better performance)
CREATE POLICY "Users can view their own onboarding data" ON onboarding_profiles
    FOR SELECT USING (auth.uid() = user_id);

-- Ensure the table has RLS enabled
ALTER TABLE onboarding_profiles ENABLE ROW LEVEL SECURITY;

-- Add comments for documentation
COMMENT ON POLICY "Users can manage their own onboarding data" ON onboarding_profiles IS 'Allows users to INSERT, UPDATE, DELETE their own onboarding data';
COMMENT ON POLICY "Users can view their own onboarding data" ON onboarding_profiles IS 'Allows users to SELECT their own onboarding data';
