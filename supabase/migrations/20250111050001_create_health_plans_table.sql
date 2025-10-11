-- Create health_plans table with same structure as health_plans_unified
CREATE TABLE IF NOT EXISTS health_plans (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    
    -- Plan basic information
    plan_name TEXT NOT NULL,
    plan_type TEXT NOT NULL,
    primary_goal TEXT NOT NULL,
    secondary_goals TEXT[],
    plan_data JSONB NOT NULL,
    
    -- Plan status and timing
    status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'completed', 'paused', 'cancelled')),
    duration_weeks INTEGER NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE,
    actual_end_date DATE,
    
    -- Progress tracking
    progress_percentage INTEGER DEFAULT 0 CHECK (progress_percentage >= 0 AND progress_percentage <= 100),
    weekly_compliance_rate NUMERIC(5,2),
    monthly_compliance_rate NUMERIC(5,2),
    
    -- Plan selection and activation
    is_selected BOOLEAN DEFAULT false,
    is_active BOOLEAN DEFAULT true,
    selected_plan_id TEXT,
    
    -- Related data
    health_analysis_id UUID,
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_health_plans_user_id ON health_plans(user_id);
CREATE INDEX IF NOT EXISTS idx_health_plans_status ON health_plans(status);
CREATE INDEX IF NOT EXISTS idx_health_plans_is_selected ON health_plans(is_selected);
CREATE INDEX IF NOT EXISTS idx_health_plans_is_active ON health_plans(is_active);

-- Enable RLS
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

-- Grant permissions
GRANT SELECT, INSERT, UPDATE, DELETE ON health_plans TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON health_plans TO service_role;
