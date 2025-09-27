-- Complete database setup for URCARE
-- Run this in your Supabase SQL editor

-- Create health_scores table
CREATE TABLE IF NOT EXISTS health_scores (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    score INTEGER NOT NULL CHECK (score >= 0 AND score <= 100),
    streak_days INTEGER DEFAULT 0,
    last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_health_scores_user_id ON health_scores(user_id);
CREATE INDEX IF NOT EXISTS idx_health_scores_last_updated ON health_scores(last_updated);

-- Enable RLS
ALTER TABLE health_scores ENABLE ROW LEVEL SECURITY;

-- Create RLS policies (drop if exists first)
DROP POLICY IF EXISTS "Users can view their own health scores" ON health_scores;
DROP POLICY IF EXISTS "Users can insert their own health scores" ON health_scores;
DROP POLICY IF EXISTS "Users can update their own health scores" ON health_scores;

CREATE POLICY "Users can view their own health scores" ON health_scores
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own health scores" ON health_scores
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own health scores" ON health_scores
    FOR UPDATE USING (auth.uid() = user_id);

-- Create trigger for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for health_scores (drop if exists first)
DROP TRIGGER IF EXISTS update_health_scores_updated_at ON health_scores;
CREATE TRIGGER update_health_scores_updated_at
    BEFORE UPDATE ON health_scores
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Create get_weekly_view function
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

-- Create daily_activities table if it doesn't exist
CREATE TABLE IF NOT EXISTS daily_activities (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    activity_date DATE NOT NULL,
    activities_completed INTEGER DEFAULT 0,
    total_score INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for daily_activities
CREATE INDEX IF NOT EXISTS idx_daily_activities_user_id ON daily_activities(user_id);
CREATE INDEX IF NOT EXISTS idx_daily_activities_date ON daily_activities(activity_date);

-- Enable RLS for daily_activities
ALTER TABLE daily_activities ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for daily_activities (drop if exists first)
DROP POLICY IF EXISTS "Users can view their own daily activities" ON daily_activities;
DROP POLICY IF EXISTS "Users can insert their own daily activities" ON daily_activities;
DROP POLICY IF EXISTS "Users can update their own daily activities" ON daily_activities;

CREATE POLICY "Users can view their own daily activities" ON daily_activities
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own daily activities" ON daily_activities
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own daily activities" ON daily_activities
    FOR UPDATE USING (auth.uid() = user_id);

-- Create trigger for daily_activities updated_at (drop if exists first)
DROP TRIGGER IF EXISTS update_daily_activities_updated_at ON daily_activities;
CREATE TRIGGER update_daily_activities_updated_at
    BEFORE UPDATE ON daily_activities
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Create two_day_health_plans table if it doesn't exist
CREATE TABLE IF NOT EXISTS two_day_health_plans (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    plan_name TEXT NOT NULL,
    description TEXT,
    is_active BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for two_day_health_plans
CREATE INDEX IF NOT EXISTS idx_two_day_health_plans_user_id ON two_day_health_plans(user_id);
CREATE INDEX IF NOT EXISTS idx_two_day_health_plans_active ON two_day_health_plans(is_active);

-- Enable RLS for two_day_health_plans
ALTER TABLE two_day_health_plans ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for two_day_health_plans (drop if exists first)
DROP POLICY IF EXISTS "Users can view their own two day health plans" ON two_day_health_plans;
DROP POLICY IF EXISTS "Users can insert their own two day health plans" ON two_day_health_plans;
DROP POLICY IF EXISTS "Users can update their own two day health plans" ON two_day_health_plans;

CREATE POLICY "Users can view their own two day health plans" ON two_day_health_plans
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own two day health plans" ON two_day_health_plans
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own two day health plans" ON two_day_health_plans
    FOR UPDATE USING (auth.uid() = user_id);

-- Create trigger for two_day_health_plans updated_at (drop if exists first)
DROP TRIGGER IF EXISTS update_two_day_health_plans_updated_at ON two_day_health_plans;
CREATE TRIGGER update_two_day_health_plans_updated_at
    BEFORE UPDATE ON two_day_health_plans
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
