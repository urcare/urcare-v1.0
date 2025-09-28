-- Create weekly_progress_tracking table
-- This table stores weekly progress tracking data for health plans

CREATE TABLE IF NOT EXISTS weekly_progress_tracking (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    plan_id UUID NOT NULL REFERENCES health_plans(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    
    -- Week metadata
    week_number INTEGER NOT NULL CHECK (week_number > 0),
    week_start_date DATE NOT NULL,
    week_end_date DATE NOT NULL,
    
    -- Activity tracking
    total_activities INTEGER NOT NULL DEFAULT 0,
    completed_activities INTEGER NOT NULL DEFAULT 0,
    compliance_rate DECIMAL(5,2) NOT NULL DEFAULT 0 CHECK (compliance_rate >= 0 AND compliance_rate <= 100),
    
    -- Physical measurements
    weight_change DECIMAL(5,2),
    body_measurements JSONB DEFAULT '{}',
    
    -- Fitness metrics
    fitness_metrics JSONB DEFAULT '{}',
    
    -- Health metrics
    health_metrics JSONB DEFAULT '{}',
    
    -- Milestone tracking
    milestones_achieved TEXT[],
    milestones_missed TEXT[],
    
    -- User feedback
    weekly_rating INTEGER CHECK (weekly_rating >= 1 AND weekly_rating <= 5),
    challenges_faced TEXT[],
    successes_celebrated TEXT[],
    adjustments_needed TEXT,
    
    -- Status
    status TEXT NOT NULL CHECK (status IN ('in_progress', 'completed', 'needs_adjustment')) DEFAULT 'in_progress',
    
    -- System fields
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_weekly_progress_tracking_plan_id ON weekly_progress_tracking(plan_id);
CREATE INDEX IF NOT EXISTS idx_weekly_progress_tracking_user_id ON weekly_progress_tracking(user_id);
CREATE INDEX IF NOT EXISTS idx_weekly_progress_tracking_week_number ON weekly_progress_tracking(week_number);
CREATE INDEX IF NOT EXISTS idx_weekly_progress_tracking_week_start_date ON weekly_progress_tracking(week_start_date);
CREATE INDEX IF NOT EXISTS idx_weekly_progress_tracking_week_end_date ON weekly_progress_tracking(week_end_date);
CREATE INDEX IF NOT EXISTS idx_weekly_progress_tracking_status ON weekly_progress_tracking(status);
CREATE INDEX IF NOT EXISTS idx_weekly_progress_tracking_plan_week ON weekly_progress_tracking(plan_id, week_number);

-- Create GIN indexes for JSONB columns
CREATE INDEX IF NOT EXISTS idx_weekly_progress_tracking_body_measurements_gin ON weekly_progress_tracking USING GIN (body_measurements);
CREATE INDEX IF NOT EXISTS idx_weekly_progress_tracking_fitness_metrics_gin ON weekly_progress_tracking USING GIN (fitness_metrics);
CREATE INDEX IF NOT EXISTS idx_weekly_progress_tracking_health_metrics_gin ON weekly_progress_tracking USING GIN (health_metrics);

-- Create GIN indexes for text arrays
CREATE INDEX IF NOT EXISTS idx_weekly_progress_tracking_milestones_achieved_gin ON weekly_progress_tracking USING GIN (milestones_achieved);
CREATE INDEX IF NOT EXISTS idx_weekly_progress_tracking_milestones_missed_gin ON weekly_progress_tracking USING GIN (milestones_missed);
CREATE INDEX IF NOT EXISTS idx_weekly_progress_tracking_challenges_faced_gin ON weekly_progress_tracking USING GIN (challenges_faced);
CREATE INDEX IF NOT EXISTS idx_weekly_progress_tracking_successes_celebrated_gin ON weekly_progress_tracking USING GIN (successes_celebrated);

-- Create updated_at trigger
CREATE TRIGGER update_weekly_progress_tracking_updated_at
    BEFORE UPDATE ON weekly_progress_tracking
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security
ALTER TABLE weekly_progress_tracking ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view their own weekly progress tracking" ON weekly_progress_tracking
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own weekly progress tracking" ON weekly_progress_tracking
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own weekly progress tracking" ON weekly_progress_tracking
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own weekly progress tracking" ON weekly_progress_tracking
    FOR DELETE USING (auth.uid() = user_id);

-- Add comments for documentation
COMMENT ON TABLE weekly_progress_tracking IS 'Weekly progress tracking data for health plans';
COMMENT ON COLUMN weekly_progress_tracking.plan_id IS 'References health_plans.id - the health plan this tracking belongs to';
COMMENT ON COLUMN weekly_progress_tracking.user_id IS 'References auth.users.id - the authenticated user ID';
COMMENT ON COLUMN weekly_progress_tracking.week_number IS 'Week number in the plan (1, 2, 3, etc.)';
COMMENT ON COLUMN weekly_progress_tracking.compliance_rate IS 'Weekly compliance rate (0-100)';
COMMENT ON COLUMN weekly_progress_tracking.body_measurements IS 'JSON object containing body measurements for the week';
COMMENT ON COLUMN weekly_progress_tracking.fitness_metrics IS 'JSON object containing fitness metrics for the week';
COMMENT ON COLUMN weekly_progress_tracking.health_metrics IS 'JSON object containing health metrics for the week';
COMMENT ON COLUMN weekly_progress_tracking.milestones_achieved IS 'Array of milestone IDs achieved this week';
COMMENT ON COLUMN weekly_progress_tracking.milestones_missed IS 'Array of milestone IDs missed this week';
