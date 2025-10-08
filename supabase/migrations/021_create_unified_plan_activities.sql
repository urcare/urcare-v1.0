-- Create unified plan activities table
-- Optimizes: user_plan_activities

CREATE TABLE IF NOT EXISTS plan_activities_unified (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    plan_id UUID NOT NULL REFERENCES health_plans_unified(id) ON DELETE CASCADE,
    
    -- Activity identification
    activity_id TEXT NOT NULL,
    name TEXT NOT NULL,
    duration TEXT NOT NULL,
    instructions TEXT NOT NULL,
    equipment TEXT[] NOT NULL DEFAULT '{}',
    difficulty TEXT NOT NULL,
    calories INTEGER NOT NULL,
    
    -- Scheduling
    week_number INTEGER NOT NULL,
    day_number INTEGER NOT NULL,
    scheduled_date DATE,
    scheduled_time TIME,
    
    -- Completion tracking
    is_completed BOOLEAN DEFAULT false,
    completion_percentage INTEGER DEFAULT 0 CHECK (completion_percentage >= 0 AND completion_percentage <= 100),
    completed_at TIMESTAMP WITH TIME ZONE,
    actual_duration INTEGER, -- in minutes
    actual_calories INTEGER,
    
    -- User feedback
    difficulty_rating INTEGER CHECK (difficulty_rating >= 1 AND difficulty_rating <= 5),
    satisfaction_rating INTEGER CHECK (satisfaction_rating >= 1 AND satisfaction_rating <= 5),
    energy_level_before INTEGER CHECK (energy_level_before >= 1 AND energy_level_before <= 10),
    energy_level_after INTEGER CHECK (energy_level_after >= 1 AND energy_level_after <= 10),
    user_notes TEXT,
    
    -- AI generation metadata
    ai_provider TEXT NOT NULL,
    generation_timestamp TIMESTAMP WITH TIME ZONE,
    processing_time_ms INTEGER,
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_plan_activities_unified_user_id ON plan_activities_unified(user_id);
CREATE INDEX IF NOT EXISTS idx_plan_activities_unified_plan_id ON plan_activities_unified(plan_id);
CREATE INDEX IF NOT EXISTS idx_plan_activities_unified_week_number ON plan_activities_unified(week_number);
CREATE INDEX IF NOT EXISTS idx_plan_activities_unified_day_number ON plan_activities_unified(day_number);
CREATE INDEX IF NOT EXISTS idx_plan_activities_unified_scheduled_date ON plan_activities_unified(scheduled_date);
CREATE INDEX IF NOT EXISTS idx_plan_activities_unified_is_completed ON plan_activities_unified(is_completed);

-- Enable Row Level Security
ALTER TABLE plan_activities_unified ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view their own plan activities" ON plan_activities_unified
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own plan activities" ON plan_activities_unified
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own plan activities" ON plan_activities_unified
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own plan activities" ON plan_activities_unified
    FOR DELETE USING (auth.uid() = user_id);

-- Create function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_plan_activities_unified_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for updated_at
CREATE TRIGGER trigger_update_plan_activities_unified_updated_at
    BEFORE UPDATE ON plan_activities_unified
    FOR EACH ROW
    EXECUTE FUNCTION update_plan_activities_unified_updated_at();

-- Create function to automatically set completed_at when activity is marked as completed
CREATE OR REPLACE FUNCTION set_completed_at_on_completion()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.is_completed = true AND OLD.is_completed = false THEN
        NEW.completed_at = NOW();
    ELSIF NEW.is_completed = false AND OLD.is_completed = true THEN
        NEW.completed_at = NULL;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to set completed_at
CREATE TRIGGER trigger_set_completed_at_on_completion
    BEFORE UPDATE ON plan_activities_unified
    FOR EACH ROW
    EXECUTE FUNCTION set_completed_at_on_completion();
