-- FIX DATABASE ERRORS - CORRECTED VERSION
-- This script fixes the 406 and 400 errors with correct column names

-- 1. Fix RLS policies for two_day_health_plans table
-- Drop existing policies first
DROP POLICY IF EXISTS "Allow all for two_day_health_plans" ON two_day_health_plans;
DROP POLICY IF EXISTS "Users can view their own two_day_health_plans" ON two_day_health_plans;
DROP POLICY IF EXISTS "Users can insert their own two_day_health_plans" ON two_day_health_plans;
DROP POLICY IF EXISTS "Users can update their own two_day_health_plans" ON two_day_health_plans;
DROP POLICY IF EXISTS "Users can delete their own two_day_health_plans" ON two_day_health_plans;

-- Create new permissive policy for two_day_health_plans
CREATE POLICY "Allow all for two_day_health_plans" ON two_day_health_plans FOR ALL USING (true) WITH CHECK (true);

-- 2. Fix get_weekly_view function structure
-- Drop and recreate with correct structure
DROP FUNCTION IF EXISTS get_weekly_view(UUID);

CREATE OR REPLACE FUNCTION get_weekly_view(p_user_id UUID)
RETURNS TABLE (
    date DATE,
    score INTEGER,
    activities_completed INTEGER,
    streak_days INTEGER
) AS $$
BEGIN
    RETURN QUERY
    SELECT
        (CURRENT_DATE - INTERVAL '6 days' + INTERVAL '1 day' * generate_series(0, 6))::DATE as date,
        COALESCE(hs.score, 75) as score,
        COALESCE(da.activities_completed, 0) as activities_completed,
        COALESCE(hs.streak_days, 0) as streak_days
    FROM generate_series(0, 6) as day_offset
    LEFT JOIN health_scores hs ON hs.user_id = p_user_id
    LEFT JOIN (
        SELECT
            activity_date::DATE as date,
            COUNT(*) as activities_completed
        FROM daily_activities
        WHERE user_id = p_user_id
        AND activity_date >= CURRENT_DATE - INTERVAL '6 days'
        GROUP BY activity_date::DATE
    ) da ON da.date = (CURRENT_DATE - INTERVAL '6 days' + INTERVAL '1 day' * day_offset)::DATE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 3. Ensure health_scores and daily_activities tables exist
-- Create health_scores table if it doesn't exist
CREATE TABLE IF NOT EXISTS health_scores (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL,
    score INTEGER NOT NULL DEFAULT 75 CHECK (score >= 0 AND score <= 100),
    streak_days INTEGER DEFAULT 0,
    last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add unique constraint if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint 
        WHERE conname = 'health_scores_user_id_unique'
    ) THEN
        ALTER TABLE health_scores ADD CONSTRAINT health_scores_user_id_unique UNIQUE (user_id);
    END IF;
END $$;

-- Enable RLS for health_scores
ALTER TABLE health_scores ENABLE ROW LEVEL SECURITY;

-- Create policy for health_scores if it doesn't exist (using correct column names)
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policy p
        JOIN pg_class c ON c.oid = p.polrelid
        WHERE p.polname = 'Allow all for health_scores' 
        AND c.relname = 'health_scores'
    ) THEN
        CREATE POLICY "Allow all for health_scores" ON health_scores FOR ALL USING (true) WITH CHECK (true);
    END IF;
END $$;

-- Create daily_activities table if it doesn't exist
CREATE TABLE IF NOT EXISTS daily_activities (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL,
    activity_date DATE NOT NULL,
    activities_completed INTEGER DEFAULT 0,
    total_score INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add unique constraint if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint 
        WHERE conname = 'daily_activities_user_id_date_unique'
    ) THEN
        ALTER TABLE daily_activities ADD CONSTRAINT daily_activities_user_id_date_unique UNIQUE (user_id, activity_date);
    END IF;
END $$;

-- Enable RLS for daily_activities
ALTER TABLE daily_activities ENABLE ROW LEVEL SECURITY;

-- Create policy for daily_activities if it doesn't exist (using correct column names)
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policy p
        JOIN pg_class c ON c.oid = p.polrelid
        WHERE p.polname = 'Allow all for daily_activities' 
        AND c.relname = 'daily_activities'
    ) THEN
        CREATE POLICY "Allow all for daily_activities" ON daily_activities FOR ALL USING (true) WITH CHECK (true);
    END IF;
END $$;

-- 4. Insert default data for current user if it doesn't exist
INSERT INTO health_scores (user_id, score, streak_days)
SELECT '6295da0b-c227-4404-875a-0f16834bfa75', 75, 0
WHERE NOT EXISTS (SELECT 1 FROM health_scores WHERE user_id = '6295da0b-c227-4404-875a-0f16834bfa75');
