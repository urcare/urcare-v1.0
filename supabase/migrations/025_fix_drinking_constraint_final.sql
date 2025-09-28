-- Fix drinking constraint to include all actual form values
-- This migration adds the missing drinking values from DrinkingStep.tsx

-- Drop the existing drinking constraint
ALTER TABLE user_profiles DROP CONSTRAINT IF EXISTS user_profiles_drinking_check;

-- Add the new constraint with ALL drinking values from all forms
ALTER TABLE user_profiles ADD CONSTRAINT user_profiles_drinking_check 
CHECK (drinking IN (
    -- Original values
    'Never', 'Occasionally', 'Regularly', 'Prefer not to say',
    -- LifestyleFactorsStep values
    'No alcohol', 'Light drinking', 'Moderate drinking', 'Heavy drinking',
    -- DrinkingStep.tsx values
    'Never drink', 'Moderately', 'Heavily'
));

-- Add comment for documentation
COMMENT ON CONSTRAINT user_profiles_drinking_check ON user_profiles IS 'Allows all drinking values from all onboarding forms';
