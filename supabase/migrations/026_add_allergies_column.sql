-- Add allergies column to user_profiles table
ALTER TABLE user_profiles ADD COLUMN IF NOT EXISTS allergies TEXT[];

-- Add comment for documentation
COMMENT ON COLUMN user_profiles.allergies IS 'Array of user allergies';

