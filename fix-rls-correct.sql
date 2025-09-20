-- Fix RLS policies for development user - CORRECT VERSION
-- This script creates the development user profile and fixes RLS policies

-- Create development user profile if it doesn't exist
INSERT INTO user_profiles (
  id,
  full_name,
  age,
  gender,
  height_cm,
  weight_kg,
  chronic_conditions,
  health_goals,
  diet_type,
  workout_time,
  routine_flexibility,
  status,
  onboarding_completed,
  created_at,
  updated_at
) VALUES (
  '9d1051c9-0241-4370-99a3-034bd2d5d001',
  'Development User',
  25,
  'other',
  '170',
  '70',
  ARRAY[]::text[],
  ARRAY['weight_loss', 'muscle_gain'],
  'balanced',
  '08:00:00',
  'moderate',
  'active',
  true,
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  full_name = EXCLUDED.full_name,
  updated_at = NOW();

-- Update RLS policies to allow development user
-- Drop existing policies first
DROP POLICY IF EXISTS "Users can view their own comprehensive health plans" ON comprehensive_health_plans;
DROP POLICY IF EXISTS "Users can insert their own comprehensive health plans" ON comprehensive_health_plans;
DROP POLICY IF EXISTS "Users can update their own comprehensive health plans" ON comprehensive_health_plans;
DROP POLICY IF EXISTS "Users can delete their own comprehensive health plans" ON comprehensive_health_plans;

-- Create new policies that allow development user
CREATE POLICY "Users can view their own comprehensive health plans" ON comprehensive_health_plans
  FOR SELECT USING (
    auth.uid() = user_id OR 
    user_id = '9d1051c9-0241-4370-99a3-034bd2d5d001'::uuid
  );

CREATE POLICY "Users can insert their own comprehensive health plans" ON comprehensive_health_plans
  FOR INSERT WITH CHECK (
    auth.uid() = user_id OR 
    user_id = '9d1051c9-0241-4370-99a3-034bd2d5d001'::uuid
  );

CREATE POLICY "Users can update their own comprehensive health plans" ON comprehensive_health_plans
  FOR UPDATE USING (
    auth.uid() = user_id OR 
    user_id = '9d1051c9-0241-4370-99a3-034bd2d5d001'::uuid
  );

CREATE POLICY "Users can delete their own comprehensive health plans" ON comprehensive_health_plans
  FOR DELETE USING (
    auth.uid() = user_id OR 
    user_id = '9d1051c9-0241-4370-99a3-034bd2d5d001'::uuid
  );

-- Also update user_profiles policies to allow development user
DROP POLICY IF EXISTS "Users can view their own profile" ON user_profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON user_profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON user_profiles;
DROP POLICY IF EXISTS "Users can delete their own profile" ON user_profiles;

CREATE POLICY "Users can view their own profile" ON user_profiles
  FOR SELECT USING (
    auth.uid() = id OR 
    id = '9d1051c9-0241-4370-99a3-034bd2d5d001'::uuid
  );

CREATE POLICY "Users can insert their own profile" ON user_profiles
  FOR INSERT WITH CHECK (
    auth.uid() = id OR 
    id = '9d1051c9-0241-4370-99a3-034bd2d5d001'::uuid
  );

CREATE POLICY "Users can update their own profile" ON user_profiles
  FOR UPDATE USING (
    auth.uid() = id OR 
    id = '9d1051c9-0241-4370-99a3-034bd2d5d001'::uuid
  );

CREATE POLICY "Users can delete their own profile" ON user_profiles
  FOR DELETE USING (
    auth.uid() = id OR 
    id = '9d1051c9-0241-4370-99a3-034bd2d5d001'::uuid
  );

-- Verify the setup
SELECT 'RLS policies updated successfully for development user' as status;
SELECT id, full_name, onboarding_completed FROM user_profiles WHERE id = '9d1051c9-0241-4370-99a3-034bd2d5d001';
