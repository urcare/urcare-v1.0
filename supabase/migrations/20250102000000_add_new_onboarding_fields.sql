-- Add new onboarding fields to user_profiles table
-- These fields were added in the updated onboarding flow

-- Add new columns for the updated onboarding steps
ALTER TABLE user_profiles 
ADD COLUMN IF NOT EXISTS workout_type VARCHAR(100),
ADD COLUMN IF NOT EXISTS smoking VARCHAR(50),
ADD COLUMN IF NOT EXISTS drinking VARCHAR(50);

-- Update the existing columns that were removed from the onboarding flow
-- Remove columns that are no longer used in the new onboarding flow
ALTER TABLE user_profiles 
DROP COLUMN IF EXISTS uses_wearable,
DROP COLUMN IF EXISTS wearable_type,
DROP COLUMN IF EXISTS share_progress,
DROP COLUMN IF EXISTS emergency_contact_name,
DROP COLUMN IF EXISTS emergency_contact_phone;

-- Add indexes for the new fields for better query performance
CREATE INDEX IF NOT EXISTS idx_user_profiles_workout_type ON user_profiles(workout_type);
CREATE INDEX IF NOT EXISTS idx_user_profiles_smoking ON user_profiles(smoking);
CREATE INDEX IF NOT EXISTS idx_user_profiles_drinking ON user_profiles(drinking);

-- Update the onboarding_profiles table to store the new fields in the JSONB details column
-- The details column already exists and can store the new fields

-- Add comments for documentation
COMMENT ON COLUMN user_profiles.workout_type IS 'Preferred workout type (Yoga, Home Gym, Gym, Swimming, Cardio, HIIT)';
COMMENT ON COLUMN user_profiles.smoking IS 'Smoking status (Never smoked, Former smoker, Occasional smoker, Regular smoker)';
COMMENT ON COLUMN user_profiles.drinking IS 'Alcohol consumption level (Never drink, Occasionally, Moderately, Regularly, Heavily)';
