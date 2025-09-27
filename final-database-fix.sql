-- FINAL DATABASE SETUP FOR URCARE
-- This script only creates missing tables without dropping existing functions
-- Run this in your Supabase SQL Editor

-- 1. Only drop tables that don't exist yet (health_scores and daily_activities)
DROP TABLE IF EXISTS health_scores CASCADE;
DROP TABLE IF EXISTS daily_activities CASCADE;
DROP FUNCTION IF EXISTS get_weekly_view(UUID);

-- 2. Create health_scores table
CREATE TABLE IF NOT EXISTS health_scores (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL,
    score INTEGER NOT NULL DEFAULT 75 CHECK (score >= 0 AND score <= 100),
    streak_days INTEGER DEFAULT 0,
    last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add a unique constraint for user_id to prevent duplicate health scores per user
ALTER TABLE health_scores ADD CONSTRAINT health_scores_user_id_unique UNIQUE (user_id);

-- Enable RLS for health_scores
ALTER TABLE health_scores ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all for health_scores" ON health_scores FOR ALL USING (true) WITH CHECK (true);

-- Create trigger for health_scores updated_at (using existing function)
CREATE TRIGGER update_health_scores_updated_at
    BEFORE UPDATE ON health_scores
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 3. Create daily_activities table
CREATE TABLE IF NOT EXISTS daily_activities (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL,
    activity_date DATE NOT NULL,
    activities_completed INTEGER DEFAULT 0,
    total_score INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add a unique constraint for user_id and activity_date
ALTER TABLE daily_activities ADD CONSTRAINT daily_activities_user_id_date_unique UNIQUE (user_id, activity_date);

-- Enable RLS for daily_activities
ALTER TABLE daily_activities ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all for daily_activities" ON daily_activities FOR ALL USING (true) WITH CHECK (true);

-- Create trigger for daily_activities updated_at (using existing function)
CREATE TRIGGER update_daily_activities_updated_at
    BEFORE UPDATE ON daily_activities
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 4. Create get_weekly_view function
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

-- 5. Insert default data for current user (replace with your actual user ID)
-- Insert default data (ignore if already exists)
INSERT INTO health_scores (user_id, score, streak_days)
SELECT '6295da0b-c227-4404-875a-0f16834bfa75', 75, 0
WHERE NOT EXISTS (SELECT 1 FROM health_scores WHERE user_id = '6295da0b-c227-4404-875a-0f16834bfa75');

-- Note: We're NOT inserting into two_day_health_plans because:
-- 1. It already exists with a different structure
-- 2. It already has 2 records
-- 3. We don't want to interfere with existing data
