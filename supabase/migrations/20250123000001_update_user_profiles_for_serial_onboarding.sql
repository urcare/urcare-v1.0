-- Update user_profiles table to include all fields collected in SerialOnboarding
-- Add missing fields that are collected but not stored in the database

-- Add missing fields for SerialOnboarding data
ALTER TABLE user_profiles 
ADD COLUMN IF NOT EXISTS workout_type VARCHAR(100),
ADD COLUMN IF NOT EXISTS smoking VARCHAR(50),
ADD COLUMN IF NOT EXISTS drinking VARCHAR(50),
ADD COLUMN IF NOT EXISTS unit_system VARCHAR(10) DEFAULT 'metric',
ADD COLUMN IF NOT EXISTS height_feet VARCHAR(10),
ADD COLUMN IF NOT EXISTS height_inches VARCHAR(10),
ADD COLUMN IF NOT EXISTS height_cm VARCHAR(10),
ADD COLUMN IF NOT EXISTS weight_lb VARCHAR(10),
ADD COLUMN IF NOT EXISTS weight_kg VARCHAR(10),
ADD COLUMN IF NOT EXISTS wake_up_time TIME,
ADD COLUMN IF NOT EXISTS sleep_time TIME,
ADD COLUMN IF NOT EXISTS work_start TIME,
ADD COLUMN IF NOT EXISTS work_end TIME,
ADD COLUMN IF NOT EXISTS chronic_conditions TEXT[],
ADD COLUMN IF NOT EXISTS takes_medications VARCHAR(10),
ADD COLUMN IF NOT EXISTS medications TEXT[],
ADD COLUMN IF NOT EXISTS has_surgery VARCHAR(10),
ADD COLUMN IF NOT EXISTS surgery_details TEXT[],
ADD COLUMN IF NOT EXISTS health_goals TEXT[],
ADD COLUMN IF NOT EXISTS diet_type VARCHAR(100),
ADD COLUMN IF NOT EXISTS blood_group VARCHAR(10),
ADD COLUMN IF NOT EXISTS breakfast_time TIME,
ADD COLUMN IF NOT EXISTS lunch_time TIME,
ADD COLUMN IF NOT EXISTS dinner_time TIME,
ADD COLUMN IF NOT EXISTS workout_time TIME,
ADD COLUMN IF NOT EXISTS routine_flexibility VARCHAR(50),
ADD COLUMN IF NOT EXISTS uses_wearable VARCHAR(10),
ADD COLUMN IF NOT EXISTS wearable_type VARCHAR(100),
ADD COLUMN IF NOT EXISTS track_family VARCHAR(10),
ADD COLUMN IF NOT EXISTS share_progress VARCHAR(10),
ADD COLUMN IF NOT EXISTS emergency_contact_name VARCHAR(255),
ADD COLUMN IF NOT EXISTS emergency_contact_phone VARCHAR(20),
ADD COLUMN IF NOT EXISTS critical_conditions TEXT,
ADD COLUMN IF NOT EXISTS has_health_reports VARCHAR(10),
ADD COLUMN IF NOT EXISTS health_reports TEXT[],
ADD COLUMN IF NOT EXISTS referral_code VARCHAR(50),
ADD COLUMN IF NOT EXISTS save_progress VARCHAR(10),
ADD COLUMN IF NOT EXISTS status VARCHAR(20) DEFAULT 'active',
ADD COLUMN IF NOT EXISTS preferences JSONB DEFAULT '{}',
ADD COLUMN IF NOT EXISTS onboarding_completed BOOLEAN DEFAULT false;

-- Create indexes for the new fields
CREATE INDEX IF NOT EXISTS idx_user_profiles_workout_type ON user_profiles(workout_type);
CREATE INDEX IF NOT EXISTS idx_user_profiles_smoking ON user_profiles(smoking);
CREATE INDEX IF NOT EXISTS idx_user_profiles_drinking ON user_profiles(drinking);
CREATE INDEX IF NOT EXISTS idx_user_profiles_chronic_conditions ON user_profiles USING GIN(chronic_conditions);
CREATE INDEX IF NOT EXISTS idx_user_profiles_medications ON user_profiles USING GIN(medications);
CREATE INDEX IF NOT EXISTS idx_user_profiles_health_goals ON user_profiles USING GIN(health_goals);
CREATE INDEX IF NOT EXISTS idx_user_profiles_diet_type ON user_profiles(diet_type);
CREATE INDEX IF NOT EXISTS idx_user_profiles_blood_group ON user_profiles(blood_group);
CREATE INDEX IF NOT EXISTS idx_user_profiles_onboarding_completed ON user_profiles(onboarding_completed);
CREATE INDEX IF NOT EXISTS idx_user_profiles_status ON user_profiles(status);

-- Add comments for documentation
COMMENT ON COLUMN user_profiles.workout_type IS 'Preferred workout type (Yoga, Home Gym, Gym, Swimming, Cardio, HIIT)';
COMMENT ON COLUMN user_profiles.smoking IS 'Smoking status (Never smoked, Former smoker, Occasional smoker, Regular smoker)';
COMMENT ON COLUMN user_profiles.drinking IS 'Alcohol consumption level (Never drink, Occasionally, Moderately, Regularly, Heavily)';
COMMENT ON COLUMN user_profiles.unit_system IS 'Measurement system preference (imperial or metric)';
COMMENT ON COLUMN user_profiles.chronic_conditions IS 'Array of chronic health conditions';
COMMENT ON COLUMN user_profiles.medications IS 'Array of current medications';
COMMENT ON COLUMN user_profiles.health_goals IS 'Array of health and fitness goals';
COMMENT ON COLUMN user_profiles.diet_type IS 'Dietary preference (Balanced, Vegetarian, Vegan, Keto, etc.)';
COMMENT ON COLUMN user_profiles.blood_group IS 'Blood type (A+, A-, B+, B-, AB+, AB-, O+, O-)';
COMMENT ON COLUMN user_profiles.routine_flexibility IS 'How flexible the user is with their routine (1-10 scale)';
COMMENT ON COLUMN user_profiles.critical_conditions IS 'Any critical health conditions that require immediate attention';
COMMENT ON COLUMN user_profiles.health_reports IS 'Array of uploaded health report file names';
COMMENT ON COLUMN user_profiles.referral_code IS 'Referral code used during signup';
COMMENT ON COLUMN user_profiles.preferences IS 'User preferences stored as JSON';
COMMENT ON COLUMN user_profiles.onboarding_completed IS 'Whether the user has completed the onboarding process';
COMMENT ON COLUMN user_profiles.status IS 'User account status (active, inactive, suspended)';
