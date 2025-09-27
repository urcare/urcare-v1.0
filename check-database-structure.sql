-- CHECK DATABASE STRUCTURE
-- Run this first to see what tables and columns actually exist

-- 1. Check if tables exist
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('health_scores', 'two_day_health_plans', 'daily_activities')
ORDER BY table_name;

-- 2. Check columns in health_scores table (if it exists)
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns 
WHERE table_schema = 'public' 
AND table_name = 'health_scores'
ORDER BY ordinal_position;

-- 3. Check columns in two_day_health_plans table (if it exists)
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns 
WHERE table_schema = 'public' 
AND table_name = 'two_day_health_plans'
ORDER BY ordinal_position;

-- 4. Check columns in daily_activities table (if it exists)
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns 
WHERE table_schema = 'public' 
AND table_name = 'daily_activities'
ORDER BY ordinal_position;

-- 5. Check if get_weekly_view function exists
SELECT routine_name, routine_type
FROM information_schema.routines 
WHERE routine_schema = 'public' 
AND routine_name = 'get_weekly_view';

-- 6. Check RLS policies
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual
FROM pg_policies 
WHERE schemaname = 'public' 
AND tablename IN ('health_scores', 'two_day_health_plans', 'daily_activities');

-- 7. Check if there are any existing records
SELECT 'health_scores' as table_name, COUNT(*) as record_count FROM health_scores
UNION ALL
SELECT 'two_day_health_plans' as table_name, COUNT(*) as record_count FROM two_day_health_plans
UNION ALL
SELECT 'daily_activities' as table_name, COUNT(*) as record_count FROM daily_activities;
