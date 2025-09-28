-- Fix drinking constraint to include all actual form values
ALTER TABLE user_profiles DROP CONSTRAINT IF EXISTS user_profiles_drinking_check;

ALTER TABLE user_profiles ADD CONSTRAINT user_profiles_drinking_check 
CHECK (drinking IN (
    -- Original values
    'Never', 'Occasionally', 'Regularly', 'Prefer not to say',
    -- LifestyleFactorsStep values
    'No alcohol', 'Light drinking', 'Moderate drinking', 'Heavy drinking',
    -- DrinkingStep.tsx values
    'Never drink', 'Moderately', 'Heavily'
));
