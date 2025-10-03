-- Fix user_profiles RLS policies
-- This migration ensures proper RLS policies for user_profiles table

-- Drop all existing policies to start fresh
DROP POLICY IF EXISTS "Users can view their own profile" ON user_profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON user_profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON user_profiles;

-- Create comprehensive policies that cover all operations
CREATE POLICY "Users can manage their own profile" ON user_profiles
    FOR ALL USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

-- Add a specific policy for SELECT operations (for better performance)
CREATE POLICY "Users can view their own profile" ON user_profiles
    FOR SELECT USING (auth.uid() = id);

-- Ensure the table has RLS enabled
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- Add comments for documentation
COMMENT ON POLICY "Users can manage their own profile" ON user_profiles IS 'Allows users to INSERT, UPDATE, DELETE their own profile data';
COMMENT ON POLICY "Users can view their own profile" ON user_profiles IS 'Allows users to SELECT their own profile data';
