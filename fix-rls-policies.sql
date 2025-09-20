-- Fix RLS policies for comprehensive health plans
-- Run this in Supabase SQL Editor if you're getting 406 errors

-- First, let's check if the policies exist
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual 
FROM pg_policies 
WHERE tablename = 'comprehensive_health_plans';

-- If no policies exist, create them:
CREATE POLICY "Users can view their own comprehensive health plans" ON comprehensive_health_plans
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own comprehensive health plans" ON comprehensive_health_plans
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own comprehensive health plans" ON comprehensive_health_plans
  FOR UPDATE USING (auth.uid() = user_id);

-- Also create policies for other tables
CREATE POLICY "Users can view their own daily plan executions" ON daily_plan_execution
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own daily plan executions" ON daily_plan_execution
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own daily plan executions" ON daily_plan_execution
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own weekly progress tracking" ON weekly_progress_tracking
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own weekly progress tracking" ON weekly_progress_tracking
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own weekly progress tracking" ON weekly_progress_tracking
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own monthly assessments" ON monthly_assessments
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own monthly assessments" ON monthly_assessments
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own monthly assessments" ON monthly_assessments
  FOR UPDATE USING (auth.uid() = user_id);

-- If you're still having issues, you can temporarily disable RLS for testing:
-- ALTER TABLE comprehensive_health_plans DISABLE ROW LEVEL SECURITY;
-- ALTER TABLE daily_plan_execution DISABLE ROW LEVEL SECURITY;
-- ALTER TABLE weekly_progress_tracking DISABLE ROW LEVEL SECURITY;
-- ALTER TABLE monthly_assessments DISABLE ROW LEVEL SECURITY;

-- Remember to re-enable RLS after testing:
-- ALTER TABLE comprehensive_health_plans ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE daily_plan_execution ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE weekly_progress_tracking ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE monthly_assessments ENABLE ROW LEVEL SECURITY;
