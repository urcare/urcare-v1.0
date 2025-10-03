-- Create monthly_assessments table
-- This table stores monthly assessments for health plans

CREATE TABLE IF NOT EXISTS monthly_assessments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    plan_id UUID NOT NULL REFERENCES health_plans(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    
    -- Assessment metadata
    month_number INTEGER NOT NULL CHECK (month_number > 0),
    assessment_date DATE NOT NULL,
    
    -- Progress metrics
    overall_progress DECIMAL(5,2) NOT NULL CHECK (overall_progress >= 0 AND overall_progress <= 100),
    goal_achievement_rate DECIMAL(5,2) NOT NULL CHECK (goal_achievement_rate >= 0 AND goal_achievement_rate <= 100),
    compliance_trend TEXT NOT NULL CHECK (compliance_trend IN ('improving', 'stable', 'declining', 'inconsistent')),
    
    -- Health data
    health_improvements JSONB DEFAULT '{}',
    health_concerns JSONB DEFAULT '{}',
    biomarker_changes JSONB DEFAULT '{}',
    
    -- Plan adjustments
    timeline_adjustment_days INTEGER DEFAULT 0,
    intensity_adjustment_percentage DECIMAL(5,2) DEFAULT 0,
    plan_modifications JSONB DEFAULT '{}',
    
    -- Analysis
    new_barriers_identified TEXT[],
    new_success_factors TEXT[],
    next_month_focus TEXT[],
    additional_support_needed TEXT[],
    
    -- Assessment status
    status TEXT NOT NULL CHECK (status IN ('pending', 'completed', 'requires_attention')) DEFAULT 'pending',
    
    -- System fields
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_monthly_assessments_plan_id ON monthly_assessments(plan_id);
CREATE INDEX IF NOT EXISTS idx_monthly_assessments_user_id ON monthly_assessments(user_id);
CREATE INDEX IF NOT EXISTS idx_monthly_assessments_month_number ON monthly_assessments(month_number);
CREATE INDEX IF NOT EXISTS idx_monthly_assessments_assessment_date ON monthly_assessments(assessment_date);
CREATE INDEX IF NOT EXISTS idx_monthly_assessments_status ON monthly_assessments(status);
CREATE INDEX IF NOT EXISTS idx_monthly_assessments_plan_month ON monthly_assessments(plan_id, month_number);

-- Create GIN indexes for JSONB columns
CREATE INDEX IF NOT EXISTS idx_monthly_assessments_health_improvements_gin ON monthly_assessments USING GIN (health_improvements);
CREATE INDEX IF NOT EXISTS idx_monthly_assessments_health_concerns_gin ON monthly_assessments USING GIN (health_concerns);
CREATE INDEX IF NOT EXISTS idx_monthly_assessments_biomarker_changes_gin ON monthly_assessments USING GIN (biomarker_changes);
CREATE INDEX IF NOT EXISTS idx_monthly_assessments_plan_modifications_gin ON monthly_assessments USING GIN (plan_modifications);

-- Create GIN indexes for text arrays
CREATE INDEX IF NOT EXISTS idx_monthly_assessments_new_barriers_gin ON monthly_assessments USING GIN (new_barriers_identified);
CREATE INDEX IF NOT EXISTS idx_monthly_assessments_success_factors_gin ON monthly_assessments USING GIN (new_success_factors);
CREATE INDEX IF NOT EXISTS idx_monthly_assessments_next_month_focus_gin ON monthly_assessments USING GIN (next_month_focus);
CREATE INDEX IF NOT EXISTS idx_monthly_assessments_additional_support_gin ON monthly_assessments USING GIN (additional_support_needed);

-- Create updated_at trigger
CREATE TRIGGER update_monthly_assessments_updated_at
    BEFORE UPDATE ON monthly_assessments
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security
ALTER TABLE monthly_assessments ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view their own monthly assessments" ON monthly_assessments
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own monthly assessments" ON monthly_assessments
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own monthly assessments" ON monthly_assessments
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own monthly assessments" ON monthly_assessments
    FOR DELETE USING (auth.uid() = user_id);

-- Add comments for documentation
COMMENT ON TABLE monthly_assessments IS 'Monthly assessments for health plans';
COMMENT ON COLUMN monthly_assessments.plan_id IS 'References health_plans.id - the health plan this assessment belongs to';
COMMENT ON COLUMN monthly_assessments.user_id IS 'References auth.users.id - the authenticated user ID';
COMMENT ON COLUMN monthly_assessments.month_number IS 'Month number in the plan (1, 2, 3, etc.)';
COMMENT ON COLUMN monthly_assessments.overall_progress IS 'Overall progress percentage (0-100)';
COMMENT ON COLUMN monthly_assessments.goal_achievement_rate IS 'Rate of goal achievement (0-100)';
COMMENT ON COLUMN monthly_assessments.compliance_trend IS 'Trend in compliance with the plan';
COMMENT ON COLUMN monthly_assessments.health_improvements IS 'JSON object containing health improvements observed';
COMMENT ON COLUMN monthly_assessments.health_concerns IS 'JSON object containing health concerns identified';
COMMENT ON COLUMN monthly_assessments.biomarker_changes IS 'JSON object containing changes in biomarkers';
COMMENT ON COLUMN monthly_assessments.plan_modifications IS 'JSON object containing modifications made to the plan';
