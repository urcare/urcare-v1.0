-- Temporary disable RLS for development
-- This allows the development user to access the table
-- DO NOT run this in production!

ALTER TABLE comprehensive_health_plans DISABLE ROW LEVEL SECURITY;
ALTER TABLE daily_plan_execution DISABLE ROW LEVEL SECURITY;
ALTER TABLE weekly_progress_tracking DISABLE ROW LEVEL SECURITY;
ALTER TABLE monthly_assessments DISABLE ROW LEVEL SECURITY;
