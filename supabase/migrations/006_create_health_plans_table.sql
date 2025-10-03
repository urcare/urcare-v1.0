-- Create health_plans table
-- This table stores comprehensive health plans generated for users

CREATE TABLE IF NOT EXISTS health_plans (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    
    -- Plan metadata
    plan_name TEXT NOT NULL,
    plan_type TEXT NOT NULL CHECK (plan_type IN (
        'quick_win', 'habit_formation', 'health_transformation', 
        'disease_management', 'lifestyle_change'
    )),
    primary_goal TEXT NOT NULL,
    secondary_goals TEXT[],
    
    -- Plan timeline
    start_date DATE NOT NULL,
    target_end_date DATE NOT NULL,
    actual_end_date DATE,
    duration_weeks INTEGER NOT NULL,
    
    -- Plan data (comprehensive plan structure)
    plan_data JSONB NOT NULL DEFAULT '{}',
    
    -- Progress tracking
    overall_progress_percentage INTEGER DEFAULT 0 CHECK (overall_progress_percentage >= 0 AND overall_progress_percentage <= 100),
    weekly_compliance_rate DECIMAL(5,2) DEFAULT 0 CHECK (weekly_compliance_rate >= 0 AND weekly_compliance_rate <= 100),
    monthly_compliance_rate DECIMAL(5,2) DEFAULT 0 CHECK (monthly_compliance_rate >= 0 AND monthly_compliance_rate <= 100),
    
    -- Plan status
    status TEXT NOT NULL CHECK (status IN (
        'draft', 'active', 'paused', 'completed', 'cancelled', 'extended'
    )) DEFAULT 'draft',
    completion_reason TEXT,
    
    -- Plan adjustments
    timeline_adjustments JSONB DEFAULT '[]',
    intensity_adjustments JSONB DEFAULT '[]',
    
    -- AI generation metadata
    generated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    generation_model TEXT,
    generation_parameters JSONB DEFAULT '{}',
    
    -- System fields
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_health_plans_user_id ON health_plans(user_id);
CREATE INDEX IF NOT EXISTS idx_health_plans_plan_type ON health_plans(plan_type);
CREATE INDEX IF NOT EXISTS idx_health_plans_status ON health_plans(status);
CREATE INDEX IF NOT EXISTS idx_health_plans_start_date ON health_plans(start_date);
CREATE INDEX IF NOT EXISTS idx_health_plans_target_end_date ON health_plans(target_end_date);
CREATE INDEX IF NOT EXISTS idx_health_plans_user_status ON health_plans(user_id, status);

-- Create GIN indexes for JSONB columns
CREATE INDEX IF NOT EXISTS idx_health_plans_plan_data_gin ON health_plans USING GIN (plan_data);
CREATE INDEX IF NOT EXISTS idx_health_plans_timeline_adjustments_gin ON health_plans USING GIN (timeline_adjustments);
CREATE INDEX IF NOT EXISTS idx_health_plans_intensity_adjustments_gin ON health_plans USING GIN (intensity_adjustments);
CREATE INDEX IF NOT EXISTS idx_health_plans_generation_parameters_gin ON health_plans USING GIN (generation_parameters);

-- Create updated_at trigger
CREATE TRIGGER update_health_plans_updated_at
    BEFORE UPDATE ON health_plans
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security
ALTER TABLE health_plans ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view their own health plans" ON health_plans
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own health plans" ON health_plans
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own health plans" ON health_plans
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own health plans" ON health_plans
    FOR DELETE USING (auth.uid() = user_id);

-- Add comments for documentation
COMMENT ON TABLE health_plans IS 'Comprehensive health plans generated for users';
COMMENT ON COLUMN health_plans.user_id IS 'References auth.users.id - the authenticated user ID';
COMMENT ON COLUMN health_plans.plan_type IS 'Type of health plan (quick_win, habit_formation, etc.)';
COMMENT ON COLUMN health_plans.primary_goal IS 'Main goal of the health plan';
COMMENT ON COLUMN health_plans.secondary_goals IS 'Array of secondary goals';
COMMENT ON COLUMN health_plans.plan_data IS 'JSON object containing comprehensive plan structure';
COMMENT ON COLUMN health_plans.overall_progress_percentage IS 'Overall progress percentage (0-100)';
COMMENT ON COLUMN health_plans.weekly_compliance_rate IS 'Weekly compliance rate (0-100)';
COMMENT ON COLUMN health_plans.monthly_compliance_rate IS 'Monthly compliance rate (0-100)';
COMMENT ON COLUMN health_plans.timeline_adjustments IS 'JSON array of timeline adjustments made to the plan';
COMMENT ON COLUMN health_plans.intensity_adjustments IS 'JSON array of intensity adjustments made to the plan';
