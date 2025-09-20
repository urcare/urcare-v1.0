-- Fix RLS policies to allow development user
-- This is safer than disabling RLS entirely

-- Drop existing policies
DROP POLICY IF EXISTS "Users can view their own comprehensive plans" ON comprehensive_health_plans;
DROP POLICY IF EXISTS "Users can insert their own comprehensive plans" ON comprehensive_health_plans;
DROP POLICY IF EXISTS "Users can update their own comprehensive plans" ON comprehensive_health_plans;
DROP POLICY IF EXISTS "Users can delete their own comprehensive plans" ON comprehensive_health_plans;

-- Create new policies that allow development user
CREATE POLICY "Users can view their own comprehensive plans" ON comprehensive_health_plans
  FOR SELECT USING (
    auth.uid() = user_id OR 
    user_id = '9d1051c9-0241-4370-99a3-034bd2d5d001'::uuid
  );

CREATE POLICY "Users can insert their own comprehensive plans" ON comprehensive_health_plans
  FOR INSERT WITH CHECK (
    auth.uid() = user_id OR 
    user_id = '9d1051c9-0241-4370-99a3-034bd2d5d001'::uuid
  );

CREATE POLICY "Users can update their own comprehensive plans" ON comprehensive_health_plans
  FOR UPDATE USING (
    auth.uid() = user_id OR 
    user_id = '9d1051c9-0241-4370-99a3-034bd2d5d001'::uuid
  );

CREATE POLICY "Users can delete their own comprehensive plans" ON comprehensive_health_plans
  FOR DELETE USING (
    auth.uid() = user_id OR 
    user_id = '9d1051c9-0241-4370-99a3-034bd2d5d001'::uuid
  );
