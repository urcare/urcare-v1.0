-- Create weekly_milestones table
-- This table stores weekly milestones for health plans

CREATE TABLE IF NOT EXISTS weekly_milestones (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    plan_id UUID NOT NULL REFERENCES health_plans(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    
    -- Milestone metadata
    week_number INTEGER NOT NULL CHECK (week_number > 0),
    title TEXT NOT NULL,
    description TEXT,
    
    -- Success criteria
    success_criteria TEXT[] NOT NULL,
    measurement_method TEXT,
    target_value DECIMAL(10,2),
    unit TEXT,
    
    -- Milestone importance and category
    importance TEXT NOT NULL CHECK (importance IN ('low', 'medium', 'high', 'critical')),
    category TEXT NOT NULL CHECK (category IN ('fitness', 'nutrition', 'wellness', 'medical', 'behavioral')),
    
    -- Completion tracking
    is_achieved BOOLEAN DEFAULT FALSE,
    achieved_at TIMESTAMP WITH TIME ZONE,
    actual_value DECIMAL(10,2),
    achievement_notes TEXT,
    
    -- System fields
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_weekly_milestones_plan_id ON weekly_milestones(plan_id);
CREATE INDEX IF NOT EXISTS idx_weekly_milestones_user_id ON weekly_milestones(user_id);
CREATE INDEX IF NOT EXISTS idx_weekly_milestones_week_number ON weekly_milestones(week_number);
CREATE INDEX IF NOT EXISTS idx_weekly_milestones_category ON weekly_milestones(category);
CREATE INDEX IF NOT EXISTS idx_weekly_milestones_importance ON weekly_milestones(importance);
CREATE INDEX IF NOT EXISTS idx_weekly_milestones_is_achieved ON weekly_milestones(is_achieved);
CREATE INDEX IF NOT EXISTS idx_weekly_milestones_plan_week ON weekly_milestones(plan_id, week_number);

-- Create GIN index for success_criteria array
CREATE INDEX IF NOT EXISTS idx_weekly_milestones_success_criteria_gin ON weekly_milestones USING GIN (success_criteria);

-- Create updated_at trigger
CREATE TRIGGER update_weekly_milestones_updated_at
    BEFORE UPDATE ON weekly_milestones
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security
ALTER TABLE weekly_milestones ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view their own weekly milestones" ON weekly_milestones
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own weekly milestones" ON weekly_milestones
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own weekly milestones" ON weekly_milestones
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own weekly milestones" ON weekly_milestones
    FOR DELETE USING (auth.uid() = user_id);

-- Add comments for documentation
COMMENT ON TABLE weekly_milestones IS 'Weekly milestones for health plans';
COMMENT ON COLUMN weekly_milestones.plan_id IS 'References health_plans.id - the health plan this milestone belongs to';
COMMENT ON COLUMN weekly_milestones.user_id IS 'References auth.users.id - the authenticated user ID';
COMMENT ON COLUMN weekly_milestones.week_number IS 'Week number in the plan (1, 2, 3, etc.)';
COMMENT ON COLUMN weekly_milestones.success_criteria IS 'Array of criteria that must be met to achieve the milestone';
COMMENT ON COLUMN weekly_milestones.importance IS 'Importance level of the milestone';
COMMENT ON COLUMN weekly_milestones.category IS 'Category of the milestone';
COMMENT ON COLUMN weekly_milestones.is_achieved IS 'Whether the milestone has been achieved';
COMMENT ON COLUMN weekly_milestones.achieved_at IS 'Timestamp when the milestone was achieved';
