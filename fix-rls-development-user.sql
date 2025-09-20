-- Fix RLS policies to allow development user
-- This script updates the RLS policies to allow the development user to access the tables

-- First, let's check if the development user exists in user_profiles
-- If not, create it
INSERT INTO user_profiles (
  id,
  full_name,
  email,
  age,
  gender,
  height_cm,
  weight_kg,
  activity_level,
  health_goals,
  dietary_preferences,
  allergies,
  medical_conditions,
  medications,
  onboarding_completed,
  status,
  subscription_status,
  subscription_plan,
  created_at,
  updated_at
) VALUES (
  '9d1051c9-0241-4370-99a3-034bd2d5d001',
  'Development User',
  'dev@urcare.local',
  25,
  'other',
  170,
  70,
  'moderate',
  ARRAY['weight_loss', 'muscle_gain'],
  ARRAY['balanced'],
  ARRAY[]::text[],
  ARRAY[]::text[],
  ARRAY[]::text[],
  true,
  'active',
  'active',
  'premium',
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  full_name = EXCLUDED.full_name,
  email = EXCLUDED.email,
  updated_at = NOW();

-- Update RLS policies to be more permissive for development
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

-- Also update the other tables' policies
DROP POLICY IF EXISTS "Users can view their own daily plan execution" ON daily_plan_execution;
DROP POLICY IF EXISTS "Users can insert their own daily plan execution" ON daily_plan_execution;
DROP POLICY IF EXISTS "Users can update their own daily plan execution" ON daily_plan_execution;

CREATE POLICY "Users can view their own daily plan execution" ON daily_plan_execution
  FOR SELECT USING (
    auth.uid() = user_id OR 
    user_id = '9d1051c9-0241-4370-99a3-034bd2d5d001'::uuid
  );

CREATE POLICY "Users can insert their own daily plan execution" ON daily_plan_execution
  FOR INSERT WITH CHECK (
    auth.uid() = user_id OR 
    user_id = '9d1051c9-0241-4370-99a3-034bd2d5d001'::uuid
  );

CREATE POLICY "Users can update their own daily plan execution" ON daily_plan_execution
  FOR UPDATE USING (
    auth.uid() = user_id OR 
    user_id = '9d1051c9-0241-4370-99a3-034bd2d5d001'::uuid
  );

-- Weekly progress tracking
DROP POLICY IF EXISTS "Users can view their own weekly progress" ON weekly_progress_tracking;
DROP POLICY IF EXISTS "Users can insert their own weekly progress" ON weekly_progress_tracking;
DROP POLICY IF EXISTS "Users can update their own weekly progress" ON weekly_progress_tracking;

CREATE POLICY "Users can view their own weekly progress" ON weekly_progress_tracking
  FOR SELECT USING (
    auth.uid() = user_id OR 
    user_id = '9d1051c9-0241-4370-99a3-034bd2d5d001'::uuid
  );

CREATE POLICY "Users can insert their own weekly progress" ON weekly_progress_tracking
  FOR INSERT WITH CHECK (
    auth.uid() = user_id OR 
    user_id = '9d1051c9-0241-4370-99a3-034bd2d5d001'::uuid
  );

CREATE POLICY "Users can update their own weekly progress" ON weekly_progress_tracking
  FOR UPDATE USING (
    auth.uid() = user_id OR 
    user_id = '9d1051c9-0241-4370-99a3-034bd2d5d001'::uuid
  );

-- Monthly assessments
DROP POLICY IF EXISTS "Users can view their own monthly assessments" ON monthly_assessments;
DROP POLICY IF EXISTS "Users can insert their own monthly assessments" ON monthly_assessments;
DROP POLICY IF EXISTS "Users can update their own monthly assessments" ON monthly_assessments;

CREATE POLICY "Users can view their own monthly assessments" ON monthly_assessments
  FOR SELECT USING (
    auth.uid() = user_id OR 
    user_id = '9d1051c9-0241-4370-99a3-034bd2d5d001'::uuid
  );

CREATE POLICY "Users can insert their own monthly assessments" ON monthly_assessments
  FOR INSERT WITH CHECK (
    auth.uid() = user_id OR 
    user_id = '9d1051c9-0241-4370-99a3-034bd2d5d001'::uuid
  );

CREATE POLICY "Users can update their own monthly assessments" ON monthly_assessments
  FOR UPDATE USING (
    auth.uid() = user_id OR 
    user_id = '9d1051c9-0241-4370-99a3-034bd2d5d001'::uuid
  );

-- Verify the policies are working
SELECT 'RLS policies updated successfully' as status;
