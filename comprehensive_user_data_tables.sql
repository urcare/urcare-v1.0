-- Comprehensive User Data Tables for UrCare Health App
-- Based on actual AI function data structures: health-score, health-plans, plan-activities
-- Run this SQL in your Supabase SQL Editor

-- 1. User Health Scores Table
CREATE TABLE IF NOT EXISTS user_health_scores (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    
    -- Health Score Data (from health-score.js)
    health_score INTEGER NOT NULL CHECK (health_score >= 0 AND health_score <= 100),
    analysis TEXT NOT NULL,
    recommendations TEXT[] NOT NULL,
    
    -- User Input Context
    user_input TEXT,
    uploaded_files JSONB DEFAULT '[]',
    voice_transcript TEXT,
    
    -- AI Generation Metadata
    ai_provider TEXT NOT NULL, -- 'Groq-Primary', 'Groq-Secondary', 'Fallback'
    generation_timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    processing_time_ms INTEGER,
    
    -- System fields
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. User Health Plans Table
CREATE TABLE IF NOT EXISTS user_health_plans (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    
    -- Plan Data (from health-plans.js)
    plan_id TEXT NOT NULL, -- 'plan_1', 'plan_2', 'plan_3'
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    duration TEXT NOT NULL, -- '4 weeks', '8 weeks', '12 weeks'
    difficulty TEXT NOT NULL CHECK (difficulty IN ('Beginner', 'Intermediate', 'Advanced')),
    focus_areas TEXT[] NOT NULL,
    estimated_calories INTEGER NOT NULL,
    equipment TEXT[] NOT NULL,
    benefits TEXT[] NOT NULL,
    
    -- Plan Status
    is_selected BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT FALSE,
    status TEXT NOT NULL CHECK (status IN ('draft', 'active', 'paused', 'completed', 'cancelled')) DEFAULT 'draft',
    
    -- Progress Tracking
    current_week INTEGER DEFAULT 1,
    total_weeks INTEGER NOT NULL,
    progress_percentage INTEGER DEFAULT 0 CHECK (progress_percentage >= 0 AND progress_percentage <= 100),
    
    -- AI Generation Metadata
    ai_provider TEXT NOT NULL, -- 'Groq-Primary', 'Groq-Secondary', 'Fallback'
    generation_timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    processing_time_ms INTEGER,
    
    -- System fields
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. User Plan Activities Table
CREATE TABLE IF NOT EXISTS user_plan_activities (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    plan_id UUID NOT NULL REFERENCES user_health_plans(id) ON DELETE CASCADE,
    
    -- Activity Data (from plan-activities.js)
    activity_id TEXT NOT NULL, -- 'morning-stretch', 'cardio-walk', etc.
    name TEXT NOT NULL,
    duration TEXT NOT NULL, -- '15 minutes', '30 minutes', etc.
    instructions TEXT NOT NULL,
    equipment TEXT[] NOT NULL,
    difficulty TEXT NOT NULL CHECK (difficulty IN ('Beginner', 'Intermediate', 'Advanced')),
    calories INTEGER NOT NULL,
    
    -- Scheduling
    week_number INTEGER NOT NULL CHECK (week_number > 0),
    day_number INTEGER NOT NULL CHECK (day_number >= 1 AND day_number <= 7),
    scheduled_date DATE,
    scheduled_time TIME,
    
    -- Completion Tracking
    is_completed BOOLEAN DEFAULT FALSE,
    completion_percentage INTEGER DEFAULT 0 CHECK (completion_percentage >= 0 AND completion_percentage <= 100),
    completed_at TIMESTAMP WITH TIME ZONE,
    actual_duration INTEGER, -- in minutes
    actual_calories INTEGER,
    
    -- User Feedback
    difficulty_rating INTEGER CHECK (difficulty_rating >= 1 AND difficulty_rating <= 5),
    satisfaction_rating INTEGER CHECK (satisfaction_rating >= 1 AND satisfaction_rating <= 5),
    energy_level_before INTEGER CHECK (energy_level_before >= 1 AND energy_level_before <= 10),
    energy_level_after INTEGER CHECK (energy_level_after >= 1 AND energy_level_after <= 10),
    user_notes TEXT,
    
    -- AI Generation Metadata
    ai_provider TEXT NOT NULL,
    generation_timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- System fields
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. User Daily Schedules Table
CREATE TABLE IF NOT EXISTS user_daily_schedules (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    plan_id UUID REFERENCES user_health_plans(id) ON DELETE CASCADE,
    
    -- Schedule Data
    schedule_date DATE NOT NULL,
    day_of_week TEXT NOT NULL CHECK (day_of_week IN ('Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday')),
    week_number INTEGER NOT NULL CHECK (week_number > 0),
    
    -- Schedule Content
    activities JSONB NOT NULL DEFAULT '[]', -- Array of activities for the day
    nutrition_plan JSONB DEFAULT '{}',
    hydration_plan JSONB DEFAULT '{}',
    recovery_activities JSONB DEFAULT '[]',
    
    -- Schedule Status
    status TEXT NOT NULL CHECK (status IN ('pending', 'in_progress', 'completed', 'skipped', 'modified')) DEFAULT 'pending',
    completion_percentage INTEGER DEFAULT 0 CHECK (completion_percentage >= 0 AND completion_percentage <= 100),
    
    -- User Feedback
    energy_level INTEGER CHECK (energy_level >= 1 AND energy_level <= 10),
    difficulty_rating INTEGER CHECK (difficulty_rating >= 1 AND difficulty_rating <= 5),
    satisfaction_rating INTEGER CHECK (satisfaction_rating >= 1 AND satisfaction_rating <= 5),
    user_notes TEXT,
    
    -- System fields
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. User AI Sessions Table
CREATE TABLE IF NOT EXISTS user_ai_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    
    -- Session Data
    session_type TEXT NOT NULL CHECK (session_type IN (
        'health_score', 'health_plans', 'plan_activities', 'daily_schedule',
        'general_consultation', 'progress_review'
    )),
    session_purpose TEXT NOT NULL,
    
    -- Input/Output Data
    user_input TEXT,
    ai_response TEXT NOT NULL,
    generated_content JSONB NOT NULL DEFAULT '{}',
    
    -- Related Data
    related_plan_id UUID REFERENCES user_health_plans(id) ON DELETE SET NULL,
    related_health_score_id UUID REFERENCES user_health_scores(id) ON DELETE SET NULL,
    
    -- AI Generation Metadata
    ai_provider TEXT NOT NULL,
    ai_model TEXT,
    generation_parameters JSONB DEFAULT '{}',
    processing_time_ms INTEGER,
    tokens_used INTEGER,
    
    -- Session Status
    status TEXT NOT NULL CHECK (status IN ('active', 'completed', 'failed', 'cancelled')) DEFAULT 'completed',
    user_satisfaction INTEGER CHECK (user_satisfaction >= 1 AND user_satisfaction <= 5),
    
    -- System fields
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. User Progress Tracking Table
CREATE TABLE IF NOT EXISTS user_progress_tracking (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    plan_id UUID NOT NULL REFERENCES user_health_plans(id) ON DELETE CASCADE,
    
    -- Progress Data
    tracking_date DATE NOT NULL,
    week_number INTEGER NOT NULL CHECK (week_number > 0),
    
    -- Daily Metrics
    activities_completed INTEGER DEFAULT 0,
    total_activities INTEGER DEFAULT 0,
    calories_burned INTEGER DEFAULT 0,
    calories_consumed INTEGER DEFAULT 0,
    water_intake_liters DECIMAL(4,2) DEFAULT 0,
    sleep_hours DECIMAL(3,1) DEFAULT 0,
    
    -- Health Metrics
    weight_kg DECIMAL(5,2),
    blood_pressure_systolic INTEGER,
    blood_pressure_diastolic INTEGER,
    heart_rate INTEGER,
    energy_level INTEGER CHECK (energy_level >= 1 AND energy_level <= 10),
    mood_rating INTEGER CHECK (mood_rating >= 1 AND mood_rating <= 10),
    
    -- Progress Notes
    daily_notes TEXT,
    challenges_faced TEXT,
    achievements TEXT,
    
    -- System fields
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 7. User AI Insights Table
CREATE TABLE IF NOT EXISTS user_ai_insights (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    
    -- Insight Data
    insight_type TEXT NOT NULL CHECK (insight_type IN (
        'health_analysis', 'progress_review', 'recommendation', 
        'warning', 'achievement', 'pattern_analysis', 'goal_suggestion'
    )),
    insight_category TEXT NOT NULL,
    priority_level TEXT NOT NULL CHECK (priority_level IN ('low', 'medium', 'high', 'critical')),
    
    -- Insight Content
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    analysis TEXT NOT NULL,
    recommendations TEXT[],
    supporting_data JSONB DEFAULT '{}',
    
    -- Context
    related_plan_id UUID REFERENCES user_health_plans(id) ON DELETE SET NULL,
    related_health_score_id UUID REFERENCES user_health_scores(id) ON DELETE SET NULL,
    time_period_start DATE,
    time_period_end DATE,
    
    -- User Interaction
    is_read BOOLEAN DEFAULT FALSE,
    is_acknowledged BOOLEAN DEFAULT FALSE,
    user_feedback TEXT,
    action_taken TEXT,
    
    -- AI Generation Metadata
    ai_provider TEXT NOT NULL,
    confidence_score DECIMAL(3,2) CHECK (confidence_score >= 0 AND confidence_score <= 1),
    generated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- System fields
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_user_health_scores_user_id ON user_health_scores(user_id);
CREATE INDEX IF NOT EXISTS idx_user_health_scores_created_at ON user_health_scores(created_at);
CREATE INDEX IF NOT EXISTS idx_user_health_scores_health_score ON user_health_scores(health_score);

CREATE INDEX IF NOT EXISTS idx_user_health_plans_user_id ON user_health_plans(user_id);
CREATE INDEX IF NOT EXISTS idx_user_health_plans_plan_id ON user_health_plans(plan_id);
CREATE INDEX IF NOT EXISTS idx_user_health_plans_status ON user_health_plans(status);
CREATE INDEX IF NOT EXISTS idx_user_health_plans_is_active ON user_health_plans(is_active);
CREATE INDEX IF NOT EXISTS idx_user_health_plans_difficulty ON user_health_plans(difficulty);

CREATE INDEX IF NOT EXISTS idx_user_plan_activities_user_id ON user_plan_activities(user_id);
CREATE INDEX IF NOT EXISTS idx_user_plan_activities_plan_id ON user_plan_activities(plan_id);
CREATE INDEX IF NOT EXISTS idx_user_plan_activities_week_day ON user_plan_activities(week_number, day_number);
CREATE INDEX IF NOT EXISTS idx_user_plan_activities_scheduled_date ON user_plan_activities(scheduled_date);
CREATE INDEX IF NOT EXISTS idx_user_plan_activities_is_completed ON user_plan_activities(is_completed);
CREATE INDEX IF NOT EXISTS idx_user_plan_activities_difficulty ON user_plan_activities(difficulty);

CREATE INDEX IF NOT EXISTS idx_user_daily_schedules_user_id ON user_daily_schedules(user_id);
CREATE INDEX IF NOT EXISTS idx_user_daily_schedules_plan_id ON user_daily_schedules(plan_id);
CREATE INDEX IF NOT EXISTS idx_user_daily_schedules_schedule_date ON user_daily_schedules(schedule_date);
CREATE INDEX IF NOT EXISTS idx_user_daily_schedules_week_number ON user_daily_schedules(week_number);
CREATE INDEX IF NOT EXISTS idx_user_daily_schedules_status ON user_daily_schedules(status);

CREATE INDEX IF NOT EXISTS idx_user_ai_sessions_user_id ON user_ai_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_user_ai_sessions_session_type ON user_ai_sessions(session_type);
CREATE INDEX IF NOT EXISTS idx_user_ai_sessions_status ON user_ai_sessions(status);
CREATE INDEX IF NOT EXISTS idx_user_ai_sessions_created_at ON user_ai_sessions(created_at);

CREATE INDEX IF NOT EXISTS idx_user_progress_tracking_user_id ON user_progress_tracking(user_id);
CREATE INDEX IF NOT EXISTS idx_user_progress_tracking_plan_id ON user_progress_tracking(plan_id);
CREATE INDEX IF NOT EXISTS idx_user_progress_tracking_tracking_date ON user_progress_tracking(tracking_date);
CREATE INDEX IF NOT EXISTS idx_user_progress_tracking_week_number ON user_progress_tracking(week_number);

CREATE INDEX IF NOT EXISTS idx_user_ai_insights_user_id ON user_ai_insights(user_id);
CREATE INDEX IF NOT EXISTS idx_user_ai_insights_insight_type ON user_ai_insights(insight_type);
CREATE INDEX IF NOT EXISTS idx_user_ai_insights_priority_level ON user_ai_insights(priority_level);
CREATE INDEX IF NOT EXISTS idx_user_ai_insights_is_read ON user_ai_insights(is_read);

-- Create GIN indexes for JSONB columns
CREATE INDEX IF NOT EXISTS idx_user_health_scores_uploaded_files_gin ON user_health_scores USING GIN (uploaded_files);
CREATE INDEX IF NOT EXISTS idx_user_daily_schedules_activities_gin ON user_daily_schedules USING GIN (activities);
CREATE INDEX IF NOT EXISTS idx_user_daily_schedules_nutrition_plan_gin ON user_daily_schedules USING GIN (nutrition_plan);
CREATE INDEX IF NOT EXISTS idx_user_ai_sessions_generated_content_gin ON user_ai_sessions USING GIN (generated_content);
CREATE INDEX IF NOT EXISTS idx_user_ai_insights_supporting_data_gin ON user_ai_insights USING GIN (supporting_data);

-- Create updated_at triggers
CREATE TRIGGER update_user_health_scores_updated_at
    BEFORE UPDATE ON user_health_scores
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_health_plans_updated_at
    BEFORE UPDATE ON user_health_plans
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_plan_activities_updated_at
    BEFORE UPDATE ON user_plan_activities
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_daily_schedules_updated_at
    BEFORE UPDATE ON user_daily_schedules
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_ai_sessions_updated_at
    BEFORE UPDATE ON user_ai_sessions
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_progress_tracking_updated_at
    BEFORE UPDATE ON user_progress_tracking
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_ai_insights_updated_at
    BEFORE UPDATE ON user_ai_insights
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security
ALTER TABLE user_health_scores ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_health_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_plan_activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_daily_schedules ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_ai_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_progress_tracking ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_ai_insights ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for user_health_scores
CREATE POLICY "Users can view their own health scores" ON user_health_scores
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own health scores" ON user_health_scores
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own health scores" ON user_health_scores
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own health scores" ON user_health_scores
    FOR DELETE USING (auth.uid() = user_id);

-- Create RLS policies for user_health_plans
CREATE POLICY "Users can view their own health plans" ON user_health_plans
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own health plans" ON user_health_plans
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own health plans" ON user_health_plans
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own health plans" ON user_health_plans
    FOR DELETE USING (auth.uid() = user_id);

-- Create RLS policies for user_plan_activities
CREATE POLICY "Users can view their own plan activities" ON user_plan_activities
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own plan activities" ON user_plan_activities
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own plan activities" ON user_plan_activities
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own plan activities" ON user_plan_activities
    FOR DELETE USING (auth.uid() = user_id);

-- Create RLS policies for user_daily_schedules
CREATE POLICY "Users can view their own daily schedules" ON user_daily_schedules
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own daily schedules" ON user_daily_schedules
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own daily schedules" ON user_daily_schedules
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own daily schedules" ON user_daily_schedules
    FOR DELETE USING (auth.uid() = user_id);

-- Create RLS policies for user_ai_sessions
CREATE POLICY "Users can view their own AI sessions" ON user_ai_sessions
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own AI sessions" ON user_ai_sessions
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own AI sessions" ON user_ai_sessions
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own AI sessions" ON user_ai_sessions
    FOR DELETE USING (auth.uid() = user_id);

-- Create RLS policies for user_progress_tracking
CREATE POLICY "Users can view their own progress tracking" ON user_progress_tracking
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own progress tracking" ON user_progress_tracking
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own progress tracking" ON user_progress_tracking
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own progress tracking" ON user_progress_tracking
    FOR DELETE USING (auth.uid() = user_id);

-- Create RLS policies for user_ai_insights
CREATE POLICY "Users can view their own AI insights" ON user_ai_insights
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own AI insights" ON user_ai_insights
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own AI insights" ON user_ai_insights
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own AI insights" ON user_ai_insights
    FOR DELETE USING (auth.uid() = user_id);

-- Add comments for documentation
COMMENT ON TABLE user_health_scores IS 'Health scores generated by AI based on user profile and health data';
COMMENT ON TABLE user_health_plans IS 'Health plans generated by AI with different difficulty levels and focus areas';
COMMENT ON TABLE user_plan_activities IS 'Detailed activities for each plan with scheduling and completion tracking';
COMMENT ON TABLE user_daily_schedules IS 'Daily schedules combining activities, nutrition, and recovery plans';
COMMENT ON TABLE user_ai_sessions IS 'AI conversation sessions and generated content tracking';
COMMENT ON TABLE user_progress_tracking IS 'Daily progress tracking for health metrics and plan adherence';
COMMENT ON TABLE user_ai_insights IS 'AI-generated insights, recommendations, and health analysis';

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated;