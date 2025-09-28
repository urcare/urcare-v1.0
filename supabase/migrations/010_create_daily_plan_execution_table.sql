-- Create daily_plan_execution table
-- This table stores daily plan execution and completion data

CREATE TABLE IF NOT EXISTS daily_plan_execution (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    plan_id UUID NOT NULL REFERENCES health_plans(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    
    -- Execution metadata
    execution_date DATE NOT NULL,
    week_number INTEGER NOT NULL CHECK (week_number > 0),
    day_of_week INTEGER NOT NULL CHECK (day_of_week >= 0 AND day_of_week <= 6), -- 0 = Sunday, 6 = Saturday
    
    -- Plan data (snapshot of the plan for this day)
    daily_activities JSONB NOT NULL DEFAULT '[]',
    daily_meals JSONB NOT NULL DEFAULT '[]',
    daily_workouts JSONB NOT NULL DEFAULT '[]',
    daily_wellness JSONB NOT NULL DEFAULT '[]',
    
    -- Completion tracking
    activities_completed INTEGER NOT NULL DEFAULT 0,
    total_activities INTEGER NOT NULL DEFAULT 0,
    completion_percentage DECIMAL(5,2) NOT NULL DEFAULT 0 CHECK (completion_percentage >= 0 AND completion_percentage <= 100),
    
    -- User feedback
    energy_level INTEGER CHECK (energy_level >= 1 AND energy_level <= 10),
    difficulty_rating INTEGER CHECK (difficulty_rating >= 1 AND difficulty_rating <= 5),
    user_notes TEXT,
    
    -- Execution status
    status TEXT NOT NULL CHECK (status IN ('pending', 'in_progress', 'completed', 'skipped', 'modified')) DEFAULT 'pending',
    
    -- System fields
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_daily_plan_execution_plan_id ON daily_plan_execution(plan_id);
CREATE INDEX IF NOT EXISTS idx_daily_plan_execution_user_id ON daily_plan_execution(user_id);
CREATE INDEX IF NOT EXISTS idx_daily_plan_execution_execution_date ON daily_plan_execution(execution_date);
CREATE INDEX IF NOT EXISTS idx_daily_plan_execution_week_number ON daily_plan_execution(week_number);
CREATE INDEX IF NOT EXISTS idx_daily_plan_execution_status ON daily_plan_execution(status);
CREATE INDEX IF NOT EXISTS idx_daily_plan_execution_plan_date ON daily_plan_execution(plan_id, execution_date);
CREATE INDEX IF NOT EXISTS idx_daily_plan_execution_user_date ON daily_plan_execution(user_id, execution_date);

-- Create GIN indexes for JSONB columns
CREATE INDEX IF NOT EXISTS idx_daily_plan_execution_daily_activities_gin ON daily_plan_execution USING GIN (daily_activities);
CREATE INDEX IF NOT EXISTS idx_daily_plan_execution_daily_meals_gin ON daily_plan_execution USING GIN (daily_meals);
CREATE INDEX IF NOT EXISTS idx_daily_plan_execution_daily_workouts_gin ON daily_plan_execution USING GIN (daily_workouts);
CREATE INDEX IF NOT EXISTS idx_daily_plan_execution_daily_wellness_gin ON daily_plan_execution USING GIN (daily_wellness);

-- Create updated_at trigger
CREATE TRIGGER update_daily_plan_execution_updated_at
    BEFORE UPDATE ON daily_plan_execution
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security
ALTER TABLE daily_plan_execution ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view their own daily plan execution" ON daily_plan_execution
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own daily plan execution" ON daily_plan_execution
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own daily plan execution" ON daily_plan_execution
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own daily plan execution" ON daily_plan_execution
    FOR DELETE USING (auth.uid() = user_id);

-- Add comments for documentation
COMMENT ON TABLE daily_plan_execution IS 'Daily plan execution and completion data';
COMMENT ON COLUMN daily_plan_execution.plan_id IS 'References health_plans.id - the health plan being executed';
COMMENT ON COLUMN daily_plan_execution.user_id IS 'References auth.users.id - the authenticated user ID';
COMMENT ON COLUMN daily_plan_execution.execution_date IS 'Date when the plan was executed';
COMMENT ON COLUMN daily_plan_execution.week_number IS 'Week number in the plan (1, 2, 3, etc.)';
COMMENT ON COLUMN daily_plan_execution.day_of_week IS 'Day of week (0=Sunday, 6=Saturday)';
COMMENT ON COLUMN daily_plan_execution.daily_activities IS 'JSON array of activities planned for this day';
COMMENT ON COLUMN daily_plan_execution.daily_meals IS 'JSON array of meals planned for this day';
COMMENT ON COLUMN daily_plan_execution.daily_workouts IS 'JSON array of workouts planned for this day';
COMMENT ON COLUMN daily_plan_execution.daily_wellness IS 'JSON array of wellness activities planned for this day';
COMMENT ON COLUMN daily_plan_execution.completion_percentage IS 'Percentage of daily plan completed (0-100)';
COMMENT ON COLUMN daily_plan_execution.energy_level IS 'User energy level during execution (1-10)';
COMMENT ON COLUMN daily_plan_execution.difficulty_rating IS 'User difficulty rating of the day (1-5)';
