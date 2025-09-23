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

-- Create daily_activities table
CREATE TABLE IF NOT EXISTS daily_activities (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    activity_date DATE NOT NULL,
    exercise_completed BOOLEAN DEFAULT FALSE,
    nutrition_completed BOOLEAN DEFAULT FALSE,
    hydration_completed BOOLEAN DEFAULT FALSE,
    meals_completed BOOLEAN DEFAULT FALSE,
    sleep_completed BOOLEAN DEFAULT FALSE,
    exercise_duration INTEGER DEFAULT 0, -- in minutes
    water_intake INTEGER DEFAULT 0, -- in ml
    calories_consumed INTEGER DEFAULT 0,
    sleep_hours DECIMAL(3,1) DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, activity_date)
);

-- Create weekly_summaries table
CREATE TABLE IF NOT EXISTS weekly_summaries (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    week_start_date DATE NOT NULL,
    week_end_date DATE NOT NULL,
    total_score INTEGER DEFAULT 0,
    exercise_days INTEGER DEFAULT 0,
    nutrition_days INTEGER DEFAULT 0,
    hydration_days INTEGER DEFAULT 0,
    meal_days INTEGER DEFAULT 0,
    sleep_days INTEGER DEFAULT 0,
    streak_bonus DECIMAL(3,2) DEFAULT 1.0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, week_start_date)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_health_scores_user_id ON health_scores(user_id);
CREATE INDEX IF NOT EXISTS idx_daily_activities_user_id_date ON daily_activities(user_id, activity_date);
CREATE INDEX IF NOT EXISTS idx_weekly_summaries_user_id_week ON weekly_summaries(user_id, week_start_date);

-- Create RLS policies
ALTER TABLE health_scores ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE weekly_summaries ENABLE ROW LEVEL SECURITY;

-- Health scores policies
CREATE POLICY "Users can view their own health scores" ON health_scores
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own health scores" ON health_scores
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own health scores" ON health_scores
    FOR UPDATE USING (auth.uid() = user_id);

-- Daily activities policies
CREATE POLICY "Users can view their own daily activities" ON daily_activities
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own daily activities" ON daily_activities
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own daily activities" ON daily_activities
    FOR UPDATE USING (auth.uid() = user_id);

-- Weekly summaries policies
CREATE POLICY "Users can view their own weekly summaries" ON weekly_summaries
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own weekly summaries" ON weekly_summaries
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own weekly summaries" ON weekly_summaries
    FOR UPDATE USING (auth.uid() = user_id);

-- Create function to update health score
CREATE OR REPLACE FUNCTION update_health_score(p_user_id UUID)
RETURNS INTEGER AS $$
DECLARE
    base_score INTEGER := 0;
    streak_bonus DECIMAL(3,2) := 1.0;
    final_score INTEGER;
    current_streak INTEGER := 0;
    recent_activities RECORD;
BEGIN
    -- Calculate base score from recent activities (last 7 days)
    SELECT 
        COUNT(CASE WHEN exercise_completed THEN 1 END) * 20 +
        COUNT(CASE WHEN nutrition_completed THEN 1 END) * 15 +
        COUNT(CASE WHEN hydration_completed THEN 1 END) * 10 +
        COUNT(CASE WHEN meals_completed THEN 1 END) * 10 +
        COUNT(CASE WHEN sleep_completed THEN 1 END) * 15
    INTO base_score
    FROM daily_activities 
    WHERE user_id = p_user_id 
    AND activity_date >= CURRENT_DATE - INTERVAL '7 days';

    -- Calculate current streak
    SELECT COUNT(*) INTO current_streak
    FROM daily_activities
    WHERE user_id = p_user_id
    AND activity_date >= CURRENT_DATE - (
        SELECT COUNT(*) FROM daily_activities 
        WHERE user_id = p_user_id 
        AND activity_date <= CURRENT_DATE
        AND (exercise_completed = FALSE OR nutrition_completed = FALSE OR hydration_completed = FALSE)
        ORDER BY activity_date DESC LIMIT 1
    );

    -- Apply streak bonus
    IF current_streak >= 7 THEN
        streak_bonus := 1.2;
    ELSIF current_streak >= 3 THEN
        streak_bonus := 1.1;
    END IF;

    -- Calculate final score (max 100)
    final_score := LEAST(100, FLOOR(base_score * streak_bonus));

    -- Upsert health score
    INSERT INTO health_scores (user_id, score, streak_days)
    VALUES (p_user_id, final_score, current_streak)
    ON CONFLICT (user_id) 
    DO UPDATE SET 
        score = final_score,
        streak_days = current_streak,
        last_updated = NOW(),
        updated_at = NOW();

    RETURN final_score;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to get weekly view data
CREATE OR REPLACE FUNCTION get_weekly_view(p_user_id UUID)
RETURNS TABLE (
    exercise_completed BOOLEAN,
    nutrition_completed BOOLEAN,
    hydration_completed BOOLEAN,
    meals_completed BOOLEAN,
    sleep_completed BOOLEAN,
    activity_date DATE
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        COALESCE(da.exercise_completed, FALSE),
        COALESCE(da.nutrition_completed, FALSE),
        COALESCE(da.hydration_completed, FALSE),
        COALESCE(da.meals_completed, FALSE),
        COALESCE(da.sleep_completed, FALSE),
        dates.activity_date
    FROM generate_series(
        CURRENT_DATE - INTERVAL '6 days',
        CURRENT_DATE,
        INTERVAL '1 day'
    ) AS dates(activity_date)
    LEFT JOIN daily_activities da ON da.user_id = p_user_id AND da.activity_date = dates.activity_date
    ORDER BY dates.activity_date;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
