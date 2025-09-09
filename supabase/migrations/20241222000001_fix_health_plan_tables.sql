-- Fix health plan tables and RLS policies
-- Drop existing policies if they exist and recreate them

-- Drop existing policies for two_day_health_plans if they exist
DROP POLICY IF EXISTS "two_day_health_plans_select_policy" ON two_day_health_plans;
DROP POLICY IF EXISTS "two_day_health_plans_insert_policy" ON two_day_health_plans;
DROP POLICY IF EXISTS "two_day_health_plans_update_policy" ON two_day_health_plans;
DROP POLICY IF EXISTS "two_day_health_plans_delete_policy" ON two_day_health_plans;

-- Drop existing policies for plan_progress if they exist
DROP POLICY IF EXISTS "plan_progress_select_policy" ON plan_progress;
DROP POLICY IF EXISTS "plan_progress_insert_policy" ON plan_progress;
DROP POLICY IF EXISTS "plan_progress_update_policy" ON plan_progress;
DROP POLICY IF EXISTS "plan_progress_delete_policy" ON plan_progress;

-- Recreate RLS policies for two_day_health_plans
CREATE POLICY "two_day_health_plans_select_policy" ON two_day_health_plans
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "two_day_health_plans_insert_policy" ON two_day_health_plans
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "two_day_health_plans_update_policy" ON two_day_health_plans
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "two_day_health_plans_delete_policy" ON two_day_health_plans
  FOR DELETE USING (auth.uid() = user_id);

-- Recreate RLS policies for plan_progress
CREATE POLICY "plan_progress_select_policy" ON plan_progress
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "plan_progress_insert_policy" ON plan_progress
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "plan_progress_update_policy" ON plan_progress
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "plan_progress_delete_policy" ON plan_progress
  FOR DELETE USING (auth.uid() = user_id);
