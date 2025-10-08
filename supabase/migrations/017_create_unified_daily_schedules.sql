-- Create unified daily schedules table
-- Merges: daily_schedules, user_daily_schedules

CREATE TABLE IF NOT EXISTS daily_schedules_unified (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    plan_id UUID REFERENCES health_plans_unified(id) ON DELETE CASCADE,
    
    -- Schedule timing
    schedule_date DATE NOT NULL,
    day_number INTEGER NOT NULL,
    day_of_week TEXT,
    week_number INTEGER,
    
    -- Schedule data
    schedule_data JSONB NOT NULL,
    activities JSONB NOT NULL,
    nutrition_plan JSONB,
    hydration_plan JSONB,
    recovery_activities JSONB,
    
    -- AI generation metadata
    ai_provider TEXT NOT NULL,
    ai_model TEXT NOT NULL,
    generation_parameters JSONB,
    
    -- Schedule status
    is_generated BOOLEAN DEFAULT false,
    is_completed BOOLEAN DEFAULT false,
    completion_percentage INTEGER DEFAULT 0 CHECK (completion_percentage >= 0 AND completion_percentage <= 100),
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed', 'skipped')),
    
    -- User feedback and ratings
    user_feedback JSONB,
    completion_status TEXT,
    energy_level INTEGER CHECK (energy_level >= 1 AND energy_level <= 10),
    difficulty_rating INTEGER CHECK (difficulty_rating >= 1 AND difficulty_rating <= 5),
    satisfaction_rating INTEGER CHECK (satisfaction_rating >= 1 AND satisfaction_rating <= 5),
    user_notes TEXT,
    
    -- Related data
    health_analysis_id UUID REFERENCES health_analysis_unified(id),
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_daily_schedules_unified_user_id ON daily_schedules_unified(user_id);
CREATE INDEX IF NOT EXISTS idx_daily_schedules_unified_plan_id ON daily_schedules_unified(plan_id);
CREATE INDEX IF NOT EXISTS idx_daily_schedules_unified_schedule_date ON daily_schedules_unified(schedule_date);
CREATE INDEX IF NOT EXISTS idx_daily_schedules_unified_day_number ON daily_schedules_unified(day_number);
CREATE INDEX IF NOT EXISTS idx_daily_schedules_unified_status ON daily_schedules_unified(status);
CREATE INDEX IF NOT EXISTS idx_daily_schedules_unified_is_completed ON daily_schedules_unified(is_completed);

-- Enable Row Level Security
ALTER TABLE daily_schedules_unified ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view their own daily schedules" ON daily_schedules_unified
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own daily schedules" ON daily_schedules_unified
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own daily schedules" ON daily_schedules_unified
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own daily schedules" ON daily_schedules_unified
    FOR DELETE USING (auth.uid() = user_id);

-- Create function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_daily_schedules_unified_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for updated_at
CREATE TRIGGER trigger_update_daily_schedules_unified_updated_at
    BEFORE UPDATE ON daily_schedules_unified
    FOR EACH ROW
    EXECUTE FUNCTION update_daily_schedules_unified_updated_at();

-- Create function to automatically calculate completion percentage
CREATE OR REPLACE FUNCTION calculate_completion_percentage()
RETURNS TRIGGER AS $$
BEGIN
    -- If activities is provided and is a JSONB array, calculate completion
    IF NEW.activities IS NOT NULL AND jsonb_typeof(NEW.activities) = 'array' THEN
        DECLARE
            total_activities INTEGER;
            completed_activities INTEGER;
        BEGIN
            total_activities := jsonb_array_length(NEW.activities);
            
            -- Count completed activities (assuming they have a 'completed' field)
            SELECT COUNT(*)
            INTO completed_activities
            FROM jsonb_array_elements(NEW.activities) AS activity
            WHERE (activity->>'completed')::boolean = true;
            
            -- Calculate percentage
            IF total_activities > 0 THEN
                NEW.completion_percentage := ROUND((completed_activities::numeric / total_activities::numeric) * 100);
            ELSE
                NEW.completion_percentage := 0;
            END IF;
        END;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to calculate completion percentage
CREATE TRIGGER trigger_calculate_completion_percentage
    BEFORE INSERT OR UPDATE ON daily_schedules_unified
    FOR EACH ROW
    EXECUTE FUNCTION calculate_completion_percentage();
