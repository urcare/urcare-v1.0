-- Create unified progress tracking table
-- Optimizes: user_progress_tracking

CREATE TABLE IF NOT EXISTS progress_tracking_unified (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    plan_id UUID NOT NULL REFERENCES health_plans_unified(id) ON DELETE CASCADE,
    
    -- Tracking date and week
    tracking_date DATE NOT NULL,
    week_number INTEGER NOT NULL,
    
    -- Activity metrics
    activities_completed INTEGER DEFAULT 0,
    total_activities INTEGER DEFAULT 0,
    calories_burned INTEGER DEFAULT 0,
    calories_consumed INTEGER DEFAULT 0,
    
    -- Health metrics
    water_intake_liters NUMERIC(4,2) DEFAULT 0,
    sleep_hours NUMERIC(4,2) DEFAULT 0,
    weight_kg NUMERIC(5,2),
    
    -- Vital signs
    blood_pressure_systolic INTEGER,
    blood_pressure_diastolic INTEGER,
    heart_rate INTEGER,
    
    -- Subjective metrics
    energy_level INTEGER CHECK (energy_level >= 1 AND energy_level <= 10),
    mood_rating INTEGER CHECK (mood_rating >= 1 AND mood_rating <= 5),
    
    -- User notes and feedback
    daily_notes TEXT,
    challenges_faced TEXT,
    achievements TEXT,
    
    -- Consolidated metrics (JSONB for flexibility)
    additional_metrics JSONB DEFAULT '{}',
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_progress_tracking_unified_user_id ON progress_tracking_unified(user_id);
CREATE INDEX IF NOT EXISTS idx_progress_tracking_unified_plan_id ON progress_tracking_unified(plan_id);
CREATE INDEX IF NOT EXISTS idx_progress_tracking_unified_tracking_date ON progress_tracking_unified(tracking_date);
CREATE INDEX IF NOT EXISTS idx_progress_tracking_unified_week_number ON progress_tracking_unified(week_number);

-- Enable Row Level Security
ALTER TABLE progress_tracking_unified ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view their own progress tracking" ON progress_tracking_unified
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own progress tracking" ON progress_tracking_unified
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own progress tracking" ON progress_tracking_unified
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own progress tracking" ON progress_tracking_unified
    FOR DELETE USING (auth.uid() = user_id);

-- Create function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_progress_tracking_unified_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for updated_at
CREATE TRIGGER trigger_update_progress_tracking_unified_updated_at
    BEFORE UPDATE ON progress_tracking_unified
    FOR EACH ROW
    EXECUTE FUNCTION update_progress_tracking_unified_updated_at();

-- Create function to automatically calculate activity completion percentage
CREATE OR REPLACE FUNCTION calculate_activity_completion_percentage()
RETURNS TRIGGER AS $$
BEGIN
    -- Calculate completion percentage if both values are provided
    IF NEW.total_activities > 0 THEN
        NEW.activities_completed := COALESCE(NEW.activities_completed, 0);
        -- This could be used to update a completion percentage field if needed
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to calculate activity completion
CREATE TRIGGER trigger_calculate_activity_completion_percentage
    BEFORE INSERT OR UPDATE ON progress_tracking_unified
    FOR EACH ROW
    EXECUTE FUNCTION calculate_activity_completion_percentage();
