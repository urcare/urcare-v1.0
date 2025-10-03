-- Fix smoking constraint values to match onboarding form values
-- This migration updates the CHECK constraint to accept the actual values from the onboarding form

-- Drop the existing smoking constraint
ALTER TABLE user_profiles DROP CONSTRAINT IF EXISTS user_profiles_smoking_check;

-- Add the new constraint with the correct values
ALTER TABLE user_profiles ADD CONSTRAINT user_profiles_smoking_check 
CHECK (smoking IN ('Never smoked', 'Former smoker', 'Occasional smoker', 'Regular smoker', 'Never', 'Former', 'Current', 'Prefer not to say'));

-- Also fix drinking constraint to be more flexible
ALTER TABLE user_profiles DROP CONSTRAINT IF EXISTS user_profiles_drinking_check;

-- Add the new drinking constraint with more flexible values
ALTER TABLE user_profiles ADD CONSTRAINT user_profiles_drinking_check 
CHECK (drinking IN ('Never', 'Occasionally', 'Regularly', 'Prefer not to say', 'No alcohol', 'Light drinking', 'Moderate drinking', 'Heavy drinking'));

-- Add comments for documentation
COMMENT ON CONSTRAINT user_profiles_smoking_check ON user_profiles IS 'Allows smoking values from onboarding forms';
COMMENT ON CONSTRAINT user_profiles_drinking_check ON user_profiles IS 'Allows drinking values from onboarding forms';
