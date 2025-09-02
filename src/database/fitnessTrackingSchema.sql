-- Fitness Tracking Database Schema
-- This schema supports the custom step counter and GPS tracking system

-- Enable UUID extension for PostgreSQL
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Daily fitness statistics table
CREATE TABLE IF NOT EXISTS daily_fitness_stats (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    total_steps INTEGER DEFAULT 0,
    total_distance DECIMAL(10,2) DEFAULT 0.0, -- in meters
    total_calories DECIMAL(8,2) DEFAULT 0.0,
    average_pace DECIMAL(8,2) DEFAULT 0.0, -- in m/s
    active_time INTEGER DEFAULT 0, -- in seconds
    gps_route JSONB, -- GPS coordinates array
    step_history JSONB, -- Step data history
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Ensure one record per user per day
    UNIQUE(user_id, date)
);

-- Fitness sessions table
CREATE TABLE IF NOT EXISTS fitness_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    start_time BIGINT NOT NULL, -- Unix timestamp
    end_time BIGINT, -- Unix timestamp
    duration INTEGER DEFAULT 0, -- in milliseconds
    total_steps INTEGER DEFAULT 0,
    total_distance DECIMAL(10,2) DEFAULT 0.0, -- in meters
    total_calories DECIMAL(8,2) DEFAULT 0.0,
    average_pace DECIMAL(8,2) DEFAULT 0.0, -- in m/s
    max_pace DECIMAL(8,2) DEFAULT 0.0, -- in m/s
    activity_type VARCHAR(20) NOT NULL CHECK (activity_type IN ('walking', 'running', 'cycling', 'hiking', 'mixed')),
    gps_route_id UUID, -- Reference to activity_routes table
    step_data JSONB, -- Step data during session
    weather JSONB, -- Weather conditions during session
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Activity routes table (GPS tracking)
CREATE TABLE IF NOT EXISTS activity_routes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    start_time BIGINT NOT NULL, -- Unix timestamp
    end_time BIGINT, -- Unix timestamp
    total_distance DECIMAL(10,2) DEFAULT 0.0, -- in meters
    total_duration INTEGER DEFAULT 0, -- in milliseconds
    average_speed DECIMAL(8,2) DEFAULT 0.0, -- in m/s
    max_speed DECIMAL(8,2) DEFAULT 0.0, -- in m/s
    elevation_gain DECIMAL(8,2) DEFAULT 0.0, -- in meters
    elevation_loss DECIMAL(8,2) DEFAULT 0.0, -- in meters
    gps_points JSONB NOT NULL, -- Array of GPS coordinates
    route_segments JSONB, -- Route segments with timing
    activity_type VARCHAR(20) NOT NULL CHECK (activity_type IN ('walking', 'running', 'cycling', 'hiking')),
    weather JSONB, -- Weather conditions during route
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Fitness history table (archived daily stats)
CREATE TABLE IF NOT EXISTS fitness_history (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    total_steps INTEGER DEFAULT 0,
    total_distance DECIMAL(10,2) DEFAULT 0.0, -- in meters
    total_calories DECIMAL(8,2) DEFAULT 0.0,
    average_pace DECIMAL(8,2) DEFAULT 0.0, -- in m/s
    active_time INTEGER DEFAULT 0, -- in seconds
    gps_route JSONB, -- GPS coordinates array
    step_history JSONB, -- Step data history
    archived_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Ensure one record per user per day
    UNIQUE(user_id, date)
);

-- User fitness profiles table
CREATE TABLE IF NOT EXISTS user_fitness_profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    weight DECIMAL(5,2) NOT NULL, -- in kg
    height INTEGER NOT NULL, -- in cm
    age INTEGER NOT NULL,
    gender VARCHAR(10) NOT NULL CHECK (gender IN ('male', 'female')),
    activity_level VARCHAR(20) NOT NULL CHECK (activity_level IN ('sedentary', 'light', 'moderate', 'active', 'very_active')),
    custom_step_length INTEGER, -- in cm, optional custom override
    step_detection_config JSONB, -- Step detection algorithm configuration
    gps_config JSONB, -- GPS tracking configuration
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Ensure one profile per user
    UNIQUE(user_id)
);

-- Fitness goals table
CREATE TABLE IF NOT EXISTS fitness_goals (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    goal_type VARCHAR(20) NOT NULL CHECK (goal_type IN ('daily_steps', 'daily_distance', 'daily_calories', 'weekly_distance', 'monthly_distance')),
    target_value DECIMAL(10,2) NOT NULL,
    current_value DECIMAL(10,2) DEFAULT 0.0,
    start_date DATE NOT NULL,
    end_date DATE,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Fitness achievements table
CREATE TABLE IF NOT EXISTS fitness_achievements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    achievement_type VARCHAR(50) NOT NULL,
    achievement_name VARCHAR(100) NOT NULL,
    description TEXT,
    achieved_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    metadata JSONB, -- Additional achievement data
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Fitness challenges table
CREATE TABLE IF NOT EXISTS fitness_challenges (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL,
    description TEXT,
    challenge_type VARCHAR(20) NOT NULL CHECK (challenge_type IN ('steps', 'distance', 'calories', 'streak')),
    target_value DECIMAL(10,2) NOT NULL,
    duration_days INTEGER NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User challenge participation table
CREATE TABLE IF NOT EXISTS user_challenges (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    challenge_id UUID NOT NULL REFERENCES fitness_challenges(id) ON DELETE CASCADE,
    current_progress DECIMAL(10,2) DEFAULT 0.0,
    is_completed BOOLEAN DEFAULT false,
    completed_at TIMESTAMP WITH TIME ZONE,
    joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Ensure one participation per user per challenge
    UNIQUE(user_id, challenge_id)
);

-- Fitness analytics table (for caching aggregated data)
CREATE TABLE IF NOT EXISTS fitness_analytics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    period_type VARCHAR(20) NOT NULL CHECK (period_type IN ('daily', 'weekly', 'monthly', 'yearly')),
    period_start DATE NOT NULL,
    period_end DATE NOT NULL,
    total_steps INTEGER DEFAULT 0,
    total_distance DECIMAL(10,2) DEFAULT 0.0,
    total_calories DECIMAL(8,2) DEFAULT 0.0,
    average_daily_steps DECIMAL(8,2) DEFAULT 0.0,
    average_daily_distance DECIMAL(8,2) DEFAULT 0.0,
    average_daily_calories DECIMAL(8,2) DEFAULT 0.0,
    active_days INTEGER DEFAULT 0,
    total_sessions INTEGER DEFAULT 0,
    average_session_duration DECIMAL(8,2) DEFAULT 0.0,
    top_activities JSONB, -- Top activities for the period
    calculated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Ensure one record per user per period
    UNIQUE(user_id, period_type, period_start)
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_daily_fitness_stats_user_date ON daily_fitness_stats(user_id, date);
CREATE INDEX IF NOT EXISTS idx_fitness_sessions_user_time ON fitness_sessions(user_id, start_time);
CREATE INDEX IF NOT EXISTS idx_activity_routes_user_time ON activity_routes(user_id, start_time);
CREATE INDEX IF NOT EXISTS idx_fitness_history_user_date ON fitness_history(user_id, date);
CREATE INDEX IF NOT EXISTS idx_fitness_goals_user_active ON fitness_goals(user_id, is_active);
CREATE INDEX IF NOT EXISTS idx_fitness_achievements_user ON fitness_achievements(user_id);
CREATE INDEX IF NOT EXISTS idx_user_challenges_user ON user_challenges(user_id);
CREATE INDEX IF NOT EXISTS idx_fitness_analytics_user_period ON fitness_analytics(user_id, period_type, period_start);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers to automatically update updated_at
CREATE TRIGGER update_daily_fitness_stats_updated_at 
    BEFORE UPDATE ON daily_fitness_stats 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_fitness_sessions_updated_at 
    BEFORE UPDATE ON fitness_sessions 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_activity_routes_updated_at 
    BEFORE UPDATE ON activity_routes 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_fitness_profiles_updated_at 
    BEFORE UPDATE ON user_fitness_profiles 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_fitness_goals_updated_at 
    BEFORE UPDATE ON fitness_goals 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_challenges_updated_at 
    BEFORE UPDATE ON user_challenges 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Create function to archive daily stats at midnight
CREATE OR REPLACE FUNCTION archive_daily_fitness_stats()
RETURNS void AS $$
BEGIN
    -- Move completed daily stats to history
    INSERT INTO fitness_history (
        user_id, date, total_steps, total_distance, total_calories,
        average_pace, active_time, gps_route, step_history
    )
    SELECT 
        user_id, date, total_steps, total_distance, total_calories,
        average_pace, active_time, gps_route, step_history
    FROM daily_fitness_stats
    WHERE date < CURRENT_DATE;
    
    -- Delete archived records from daily stats
    DELETE FROM daily_fitness_stats WHERE date < CURRENT_DATE;
END;
$$ language 'plpgsql';

-- Create function to calculate weekly analytics
CREATE OR REPLACE FUNCTION calculate_weekly_fitness_analytics(p_user_id UUID, p_week_start DATE)
RETURNS void AS $$
DECLARE
    week_end DATE := p_week_start + INTERVAL '6 days';
    analytics_data RECORD;
BEGIN
    -- Calculate weekly statistics
    SELECT 
        COUNT(*) as total_sessions,
        SUM(total_steps) as total_steps,
        SUM(total_distance) as total_distance,
        SUM(total_calories) as total_calories,
        AVG(total_steps) as average_daily_steps,
        AVG(total_distance) as average_daily_distance,
        AVG(total_calories) as average_daily_calories,
        COUNT(DISTINCT DATE(to_timestamp(start_time/1000))) as active_days,
        AVG(duration) as average_session_duration
    INTO analytics_data
    FROM fitness_sessions
    WHERE user_id = p_user_id 
        AND DATE(to_timestamp(start_time/1000)) BETWEEN p_week_start AND week_end;
    
    -- Upsert weekly analytics
    INSERT INTO fitness_analytics (
        user_id, period_type, period_start, period_end,
        total_sessions, total_steps, total_distance, total_calories,
        average_daily_steps, average_daily_distance, average_daily_calories,
        active_days, average_session_duration
    ) VALUES (
        p_user_id, 'weekly', p_week_start, week_end,
        COALESCE(analytics_data.total_sessions, 0),
        COALESCE(analytics_data.total_steps, 0),
        COALESCE(analytics_data.total_distance, 0),
        COALESCE(analytics_data.total_calories, 0),
        COALESCE(analytics_data.average_daily_steps, 0),
        COALESCE(analytics_data.average_daily_distance, 0),
        COALESCE(analytics_data.average_daily_calories, 0),
        COALESCE(analytics_data.active_days, 0),
        COALESCE(analytics_data.average_session_duration, 0)
    )
    ON CONFLICT (user_id, period_type, period_start)
    DO UPDATE SET
        total_sessions = EXCLUDED.total_sessions,
        total_steps = EXCLUDED.total_steps,
        total_distance = EXCLUDED.total_distance,
        total_calories = EXCLUDED.total_calories,
        average_daily_steps = EXCLUDED.average_daily_steps,
        average_daily_distance = EXCLUDED.average_daily_distance,
        average_daily_calories = EXCLUDED.average_daily_calories,
        active_days = EXCLUDED.active_days,
        average_session_duration = EXCLUDED.average_session_duration,
        calculated_at = NOW();
END;
$$ language 'plpgsql';

-- Create function to calculate monthly analytics
CREATE OR REPLACE FUNCTION calculate_monthly_fitness_analytics(p_user_id UUID, p_month VARCHAR)
RETURNS void AS $$
DECLARE
    month_start DATE := (p_month || '-01')::DATE;
    month_end DATE := (month_start + INTERVAL '1 month - 1 day')::DATE;
    analytics_data RECORD;
    top_activities JSONB;
BEGIN
    -- Calculate monthly statistics
    SELECT 
        COUNT(*) as total_sessions,
        SUM(total_steps) as total_steps,
        SUM(total_distance) as total_distance,
        SUM(total_calories) as total_calories,
        AVG(total_steps) as average_daily_steps,
        AVG(total_distance) as average_daily_distance,
        AVG(total_calories) as average_daily_calories,
        COUNT(DISTINCT DATE(to_timestamp(start_time/1000))) as active_days,
        AVG(duration) as average_session_duration
    INTO analytics_data
    FROM fitness_sessions
    WHERE user_id = p_user_id 
        AND DATE(to_timestamp(start_time/1000)) BETWEEN month_start AND month_end;
    
    -- Get top activities for the month
    SELECT jsonb_agg(
        jsonb_build_object(
            'type', activity_type,
            'count', count,
            'total_distance', total_distance
        )
    ) INTO top_activities
    FROM (
        SELECT 
            activity_type,
            COUNT(*) as count,
            SUM(total_distance) as total_distance
        FROM fitness_sessions
        WHERE user_id = p_user_id 
            AND DATE(to_timestamp(start_time/1000)) BETWEEN month_start AND month_end
        GROUP BY activity_type
        ORDER BY count DESC
        LIMIT 5
    ) activity_summary;
    
    -- Upsert monthly analytics
    INSERT INTO fitness_analytics (
        user_id, period_type, period_start, period_end,
        total_sessions, total_steps, total_distance, total_calories,
        average_daily_steps, average_daily_distance, average_daily_calories,
        active_days, average_session_duration, top_activities
    ) VALUES (
        p_user_id, 'monthly', month_start, month_end,
        COALESCE(analytics_data.total_sessions, 0),
        COALESCE(analytics_data.total_steps, 0),
        COALESCE(analytics_data.total_distance, 0),
        COALESCE(analytics_data.total_calories, 0),
        COALESCE(analytics_data.average_daily_steps, 0),
        COALESCE(analytics_data.average_daily_distance, 0),
        COALESCE(analytics_data.average_daily_calories, 0),
        COALESCE(analytics_data.active_days, 0),
        COALESCE(analytics_data.average_session_duration, 0),
        COALESCE(top_activities, '[]'::jsonb)
    )
    ON CONFLICT (user_id, period_type, period_start)
    DO UPDATE SET
        total_sessions = EXCLUDED.total_sessions,
        total_steps = EXCLUDED.total_steps,
        total_distance = EXCLUDED.total_distance,
        total_calories = EXCLUDED.total_calories,
        average_daily_steps = EXCLUDED.average_daily_steps,
        average_daily_distance = EXCLUDED.average_daily_distance,
        average_daily_calories = EXCLUDED.average_daily_calories,
        active_days = EXCLUDED.active_days,
        average_session_duration = EXCLUDED.average_session_duration,
        top_activities = EXCLUDED.top_activities,
        calculated_at = NOW();
END;
$$ language 'plpgsql';

-- Create function to check and award achievements
CREATE OR REPLACE FUNCTION check_fitness_achievements(p_user_id UUID)
RETURNS void AS $$
DECLARE
    achievement RECORD;
    current_value DECIMAL(10,2);
BEGIN
    -- Check for step milestones
    SELECT SUM(total_steps) INTO current_value
    FROM daily_fitness_stats
    WHERE user_id = p_user_id;
    
    -- Award step achievements
    IF current_value >= 10000 AND NOT EXISTS (
        SELECT 1 FROM fitness_achievements 
        WHERE user_id = p_user_id AND achievement_type = 'steps_10k'
    ) THEN
        INSERT INTO fitness_achievements (user_id, achievement_type, achievement_name, description)
        VALUES (p_user_id, 'steps_10k', 'Step Master', 'Reached 10,000 total steps');
    END IF;
    
    IF current_value >= 50000 AND NOT EXISTS (
        SELECT 1 FROM fitness_achievements 
        WHERE user_id = p_user_id AND achievement_type = 'steps_50k'
    ) THEN
        INSERT INTO fitness_achievements (user_id, achievement_type, achievement_name, description)
        VALUES (p_user_id, 'steps_50k', 'Step Champion', 'Reached 50,000 total steps');
    END IF;
    
    -- Check for distance milestones
    SELECT SUM(total_distance) INTO current_value
    FROM daily_fitness_stats
    WHERE user_id = p_user_id;
    
    IF current_value >= 10000 AND NOT EXISTS (
        SELECT 1 FROM fitness_achievements 
        WHERE user_id = p_user_id AND achievement_type = 'distance_10k'
    ) THEN
        INSERT INTO fitness_achievements (user_id, achievement_type, achievement_name, description)
        VALUES (p_user_id, 'distance_10k', 'Distance Runner', 'Covered 10km total distance');
    END IF;
    
    -- Check for streak achievements
    -- This would require more complex logic to track consecutive days
END;
$$ language 'plpgsql';

-- Grant necessary permissions (adjust based on your Supabase setup)
-- GRANT USAGE ON SCHEMA public TO authenticated;
-- GRANT ALL ON ALL TABLES IN SCHEMA public TO authenticated;
-- GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO authenticated;

-- Insert sample data for testing (optional)
-- INSERT INTO fitness_challenges (name, description, challenge_type, target_value, duration_days, start_date, end_date)
-- VALUES 
--     ('10K Steps Challenge', 'Walk 10,000 steps every day for a week', 'steps', 10000, 7, CURRENT_DATE, CURRENT_DATE + INTERVAL '7 days'),
--     ('5K Distance Challenge', 'Cover 5km distance in a week', 'distance', 5000, 7, CURRENT_DATE, CURRENT_DATE + INTERVAL '7 days');

COMMENT ON TABLE daily_fitness_stats IS 'Daily fitness statistics for each user';
COMMENT ON TABLE fitness_sessions IS 'Individual fitness tracking sessions';
COMMENT ON TABLE activity_routes IS 'GPS tracking routes for outdoor activities';
COMMENT ON TABLE fitness_history IS 'Archived daily fitness statistics';
COMMENT ON TABLE user_fitness_profiles IS 'User fitness profile and preferences';
COMMENT ON TABLE fitness_goals IS 'User fitness goals and targets';
COMMENT ON TABLE fitness_achievements IS 'User fitness achievements and milestones';
COMMENT ON TABLE fitness_challenges IS 'Available fitness challenges';
COMMENT ON TABLE user_challenges IS 'User participation in fitness challenges';
COMMENT ON TABLE fitness_analytics IS 'Cached fitness analytics for performance';
