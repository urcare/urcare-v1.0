-- Fix all CHECK constraint values to match onboarding form values
-- This migration makes all constraints more flexible to accept actual form values

-- Fix gender constraint
ALTER TABLE user_profiles DROP CONSTRAINT IF EXISTS user_profiles_gender_check;
ALTER TABLE user_profiles ADD CONSTRAINT user_profiles_gender_check 
CHECK (gender IN ('male', 'female', 'other', 'Male', 'Female', 'Other'));

-- Fix takes_medications constraint
ALTER TABLE user_profiles DROP CONSTRAINT IF EXISTS user_profiles_takes_medications_check;
ALTER TABLE user_profiles ADD CONSTRAINT user_profiles_takes_medications_check 
CHECK (takes_medications IN ('Yes', 'No', 'Prefer not to say', 'yes', 'no'));

-- Fix has_surgery constraint
ALTER TABLE user_profiles DROP CONSTRAINT IF EXISTS user_profiles_has_surgery_check;
ALTER TABLE user_profiles ADD CONSTRAINT user_profiles_has_surgery_check 
CHECK (has_surgery IN ('Yes', 'No', 'Prefer not to say', 'yes', 'no'));

-- Fix blood_group constraint
ALTER TABLE user_profiles DROP CONSTRAINT IF EXISTS user_profiles_blood_group_check;
ALTER TABLE user_profiles ADD CONSTRAINT user_profiles_blood_group_check 
CHECK (blood_group IN ('A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-', 'Unknown', 'Prefer not to say'));

-- Fix uses_wearable constraint
ALTER TABLE user_profiles DROP CONSTRAINT IF EXISTS user_profiles_uses_wearable_check;
ALTER TABLE user_profiles ADD CONSTRAINT user_profiles_uses_wearable_check 
CHECK (uses_wearable IN ('Yes', 'No', 'Prefer not to say', 'yes', 'no'));

-- Fix track_family constraint
ALTER TABLE user_profiles DROP CONSTRAINT IF EXISTS user_profiles_track_family_check;
ALTER TABLE user_profiles ADD CONSTRAINT user_profiles_track_family_check 
CHECK (track_family IN ('Yes', 'No', 'Prefer not to say', 'yes', 'no'));

-- Fix share_progress constraint
ALTER TABLE user_profiles DROP CONSTRAINT IF EXISTS user_profiles_share_progress_check;
ALTER TABLE user_profiles ADD CONSTRAINT user_profiles_share_progress_check 
CHECK (share_progress IN ('Yes', 'No', 'Prefer not to say', 'yes', 'no'));

-- Fix has_health_reports constraint
ALTER TABLE user_profiles DROP CONSTRAINT IF EXISTS user_profiles_has_health_reports_check;
ALTER TABLE user_profiles ADD CONSTRAINT user_profiles_has_health_reports_check 
CHECK (has_health_reports IN ('Yes', 'No', 'Prefer not to say', 'yes', 'no'));

-- Fix save_progress constraint
ALTER TABLE user_profiles DROP CONSTRAINT IF EXISTS user_profiles_save_progress_check;
ALTER TABLE user_profiles ADD CONSTRAINT user_profiles_save_progress_check 
CHECK (save_progress IN ('Yes', 'No', 'Prefer not to say', 'yes', 'no'));

-- Add comments for documentation
COMMENT ON CONSTRAINT user_profiles_gender_check ON user_profiles IS 'Allows gender values from onboarding forms';
COMMENT ON CONSTRAINT user_profiles_takes_medications_check ON user_profiles IS 'Allows medication values from onboarding forms';
COMMENT ON CONSTRAINT user_profiles_has_surgery_check ON user_profiles IS 'Allows surgery values from onboarding forms';
COMMENT ON CONSTRAINT user_profiles_blood_group_check ON user_profiles IS 'Allows blood group values from onboarding forms';
COMMENT ON CONSTRAINT user_profiles_uses_wearable_check ON user_profiles IS 'Allows wearable values from onboarding forms';
COMMENT ON CONSTRAINT user_profiles_track_family_check ON user_profiles IS 'Allows family tracking values from onboarding forms';
COMMENT ON CONSTRAINT user_profiles_share_progress_check ON user_profiles IS 'Allows progress sharing values from onboarding forms';
COMMENT ON CONSTRAINT user_profiles_has_health_reports_check ON user_profiles IS 'Allows health reports values from onboarding forms';
COMMENT ON CONSTRAINT user_profiles_save_progress_check ON user_profiles IS 'Allows save progress values from onboarding forms';
