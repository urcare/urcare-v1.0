-- Temporarily disable RLS for testing
-- This will allow the Edge Function to insert records without authentication

-- Disable RLS on comprehensive_health_plans table
ALTER TABLE comprehensive_health_plans DISABLE ROW LEVEL SECURITY;

-- Also disable RLS on user_profiles for the development user
ALTER TABLE user_profiles DISABLE ROW LEVEL SECURITY;

-- Verify RLS is disabled
SELECT schemaname, tablename, rowsecurity 
FROM pg_tables 
WHERE tablename IN ('comprehensive_health_plans', 'user_profiles');

SELECT 'RLS temporarily disabled for testing' as status;
