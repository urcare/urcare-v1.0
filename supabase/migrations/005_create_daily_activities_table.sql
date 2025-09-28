-- Create daily_activities table
-- This table stores daily activity tracking and completion data

CREATE TABLE IF NOT EXISTS daily_activities (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    
    -- Activity metadata
    activity_date DATE NOT NULL,
    activity_type TEXT NOT NULL CHECK (activity_type IN (
        'exercise', 'meal', 'wellness', 'hydration', 'sleep', 
        'medication', 'measurement', 'check_in', 'goal_check'
    )),
    activity_name TEXT NOT NULL,
    activity_category TEXT,
    
    -- Activity details
    description TEXT,
    duration_minutes INTEGER,
    calories_burned DECIMAL(8,2),
    intensity_level TEXT CHECK (intensity_level IN ('low', 'moderate', 'high')),
    
    -- Completion tracking
    is_completed BOOLEAN DEFAULT FALSE,
    completion_percentage INTEGER DEFAULT 0 CHECK (completion_percentage >= 0 AND completion_percentage <= 100),
    completed_at TIMESTAMP WITH TIME ZONE,
    
    -- User feedback
    difficulty_rating INTEGER CHECK (difficulty_rating >= 1 AND difficulty_rating <= 5),
    enjoyment_rating INTEGER CHECK (enjoyment_rating >= 1 AND enjoyment_rating <= 5),
    energy_level_before INTEGER CHECK (energy_level_before >= 1 AND energy_level_before <= 10),
    energy_level_after INTEGER CHECK (energy_level_after >= 1 AND energy_level_after <= 10),
    user_notes TEXT,
    
    -- Related data
    related_goal_id UUID,
    related_plan_id UUID,
    tags TEXT[],
    
    -- System fields
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_daily_activities_user_id ON daily_activities(user_id);
CREATE INDEX IF NOT EXISTS idx_daily_activities_activity_date ON daily_activities(activity_date);
CREATE INDEX IF NOT EXISTS idx_daily_activities_activity_type ON daily_activities(activity_type);
CREATE INDEX IF NOT EXISTS idx_daily_activities_user_date ON daily_activities(user_id, activity_date);
CREATE INDEX IF NOT EXISTS idx_daily_activities_is_completed ON daily_activities(is_completed);
CREATE INDEX IF NOT EXISTS idx_daily_activities_related_goal_id ON daily_activities(related_goal_id);
CREATE INDEX IF NOT EXISTS idx_daily_activities_related_plan_id ON daily_activities(related_plan_id);

-- Create GIN index for tags array
CREATE INDEX IF NOT EXISTS idx_daily_activities_tags_gin ON daily_activities USING GIN (tags);

-- Create updated_at trigger
CREATE TRIGGER update_daily_activities_updated_at
    BEFORE UPDATE ON daily_activities
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security
ALTER TABLE daily_activities ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view their own daily activities" ON daily_activities
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own daily activities" ON daily_activities
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own daily activities" ON daily_activities
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own daily activities" ON daily_activities
    FOR DELETE USING (auth.uid() = user_id);

-- Add comments for documentation
COMMENT ON TABLE daily_activities IS 'Daily activity tracking and completion data';
COMMENT ON COLUMN daily_activities.user_id IS 'References auth.users.id - the authenticated user ID';
COMMENT ON COLUMN daily_activities.activity_date IS 'Date when activity was performed';
COMMENT ON COLUMN daily_activities.activity_type IS 'Type of activity being tracked';
COMMENT ON COLUMN daily_activities.is_completed IS 'Whether the activity was completed';
COMMENT ON COLUMN daily_activities.completion_percentage IS 'Percentage of activity completed (0-100)';
COMMENT ON COLUMN daily_activities.difficulty_rating IS 'User rating of activity difficulty (1-5)';
COMMENT ON COLUMN daily_activities.enjoyment_rating IS 'User rating of activity enjoyment (1-5)';
COMMENT ON COLUMN daily_activities.energy_level_before IS 'User energy level before activity (1-10)';
COMMENT ON COLUMN daily_activities.energy_level_after IS 'User energy level after activity (1-10)';
COMMENT ON COLUMN daily_activities.tags IS 'Array of tags for categorizing activities';
