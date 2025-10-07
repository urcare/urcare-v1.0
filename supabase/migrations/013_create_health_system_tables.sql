-- Create health_system_tables for comprehensive health tracking

-- 1. User selected health plans (only the plan user selected, not all generated)
CREATE TABLE IF NOT EXISTS user_selected_health_plans (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    plan_name TEXT NOT NULL,
    plan_type TEXT NOT NULL,
    primary_goal TEXT NOT NULL,
    plan_data JSONB NOT NULL,
    selected_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'completed', 'paused')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Daily health activities (generated daily, unique per day)
CREATE TABLE IF NOT EXISTS daily_health_activities (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    plan_id UUID REFERENCES user_selected_health_plans(id) ON DELETE CASCADE,
    activity_date DATE NOT NULL,
    activity_type TEXT NOT NULL, -- 'workout', 'meal', 'sleep', 'meditation', etc.
    activity_title TEXT NOT NULL,
    activity_description TEXT NOT NULL,
    scheduled_time TIME NOT NULL,
    duration_minutes INTEGER NOT NULL,
    activity_data JSONB, -- Specific details for each activity type
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'skipped', 'in_progress')),
    completed_at TIMESTAMP WITH TIME ZONE,
    user_notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Activity completion tracking
CREATE TABLE IF NOT EXISTS activity_completions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    activity_id UUID NOT NULL REFERENCES daily_health_activities(id) ON DELETE CASCADE,
    completed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    completion_notes TEXT,
    user_rating INTEGER CHECK (user_rating >= 1 AND user_rating <= 5),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Daily progress summary
CREATE TABLE IF NOT EXISTS daily_progress_summary (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    progress_date DATE NOT NULL,
    total_activities INTEGER NOT NULL DEFAULT 0,
    completed_activities INTEGER NOT NULL DEFAULT 0,
    skipped_activities INTEGER NOT NULL DEFAULT 0,
    completion_percentage DECIMAL(5,2) NOT NULL DEFAULT 0.00,
    daily_notes TEXT,
    energy_level INTEGER CHECK (energy_level >= 1 AND energy_level <= 10),
    mood_rating INTEGER CHECK (mood_rating >= 1 AND mood_rating <= 5),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_user_selected_health_plans_user_id ON user_selected_health_plans(user_id);
CREATE INDEX IF NOT EXISTS idx_user_selected_health_plans_status ON user_selected_health_plans(status);

CREATE INDEX IF NOT EXISTS idx_daily_health_activities_user_id ON daily_health_activities(user_id);
CREATE INDEX IF NOT EXISTS idx_daily_health_activities_date ON daily_health_activities(activity_date);
CREATE INDEX IF NOT EXISTS idx_daily_health_activities_status ON daily_health_activities(status);
CREATE INDEX IF NOT EXISTS idx_daily_health_activities_type ON daily_health_activities(activity_type);

CREATE INDEX IF NOT EXISTS idx_activity_completions_user_id ON activity_completions(user_id);
CREATE INDEX IF NOT EXISTS idx_activity_completions_activity_id ON activity_completions(activity_id);

CREATE INDEX IF NOT EXISTS idx_daily_progress_summary_user_id ON daily_progress_summary(user_id);
CREATE INDEX IF NOT EXISTS idx_daily_progress_summary_date ON daily_progress_summary(progress_date);

-- Enable Row Level Security
ALTER TABLE user_selected_health_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_health_activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_completions ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_progress_summary ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for user_selected_health_plans
CREATE POLICY "Users can view their own health plans" ON user_selected_health_plans
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own health plans" ON user_selected_health_plans
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own health plans" ON user_selected_health_plans
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own health plans" ON user_selected_health_plans
    FOR DELETE USING (auth.uid() = user_id);

-- Create RLS policies for daily_health_activities
CREATE POLICY "Users can view their own daily activities" ON daily_health_activities
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own daily activities" ON daily_health_activities
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own daily activities" ON daily_health_activities
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own daily activities" ON daily_health_activities
    FOR DELETE USING (auth.uid() = user_id);

-- Create RLS policies for activity_completions
CREATE POLICY "Users can view their own activity completions" ON activity_completions
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own activity completions" ON activity_completions
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own activity completions" ON activity_completions
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own activity completions" ON activity_completions
    FOR DELETE USING (auth.uid() = user_id);

-- Create RLS policies for daily_progress_summary
CREATE POLICY "Users can view their own daily progress" ON daily_progress_summary
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own daily progress" ON daily_progress_summary
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own daily progress" ON daily_progress_summary
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own daily progress" ON daily_progress_summary
    FOR DELETE USING (auth.uid() = user_id);

-- Create trigger for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_user_selected_health_plans_updated_at 
    BEFORE UPDATE ON user_selected_health_plans 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_daily_health_activities_updated_at 
    BEFORE UPDATE ON daily_health_activities 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_daily_progress_summary_updated_at 
    BEFORE UPDATE ON daily_progress_summary 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();
