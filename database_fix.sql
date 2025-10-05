-- Database Fix for UrCare Health App
-- Run this SQL in your Supabase SQL Editor to add missing columns

-- 1. Add missing subscription columns to user_profiles table
ALTER TABLE user_profiles 
ADD COLUMN IF NOT EXISTS subscription_status TEXT DEFAULT 'inactive',
ADD COLUMN IF NOT EXISTS subscription_expires_at TIMESTAMP WITH TIME ZONE;

-- 2. Update existing records to have default subscription status
UPDATE user_profiles 
SET subscription_status = 'inactive' 
WHERE subscription_status IS NULL;

-- 3. Create indexes for better performance (only if they don't exist)
CREATE INDEX IF NOT EXISTS idx_user_profiles_subscription ON user_profiles(subscription_status);
CREATE INDEX IF NOT EXISTS idx_user_profiles_subscription_expires ON user_profiles(subscription_expires_at);

-- 4. Verify the columns were added successfully
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns 
WHERE table_name = 'user_profiles' 
AND column_name IN ('subscription_status', 'subscription_expires_at');
