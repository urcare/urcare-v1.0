-- Create unified health plans table
-- Merges: health_plans, user_health_plans, user_selected_health_plans

CREATE TABLE IF NOT EXISTS health_plans_unified (
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
    health_analysis_id UUID REFERENCES health_analysis_unified(id),
    user_input TEXT,
    
    -- AI generation metadata
    ai_provider TEXT NOT NULL,
    generation_timestamp TIMESTAMP WITH TIME ZONE,
    processing_time_ms INTEGER,
    generation_model TEXT,
    generation_parameters JSONB,
    
    -- Plan adjustments
    timeline_adjustments JSONB,
    intensity_adjustments JSONB,
    completion_reason TEXT,
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_health_plans_unified_user_id ON health_plans_unified(user_id);
CREATE INDEX IF NOT EXISTS idx_health_plans_unified_status ON health_plans_unified(status);
CREATE INDEX IF NOT EXISTS idx_health_plans_unified_start_date ON health_plans_unified(start_date);
CREATE INDEX IF NOT EXISTS idx_health_plans_unified_is_active ON health_plans_unified(is_active);
CREATE INDEX IF NOT EXISTS idx_health_plans_unified_is_selected ON health_plans_unified(is_selected);
CREATE INDEX IF NOT EXISTS idx_health_plans_unified_health_analysis_id ON health_plans_unified(health_analysis_id);

-- Enable Row Level Security
ALTER TABLE health_plans_unified ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view their own health plans" ON health_plans_unified
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own health plans" ON health_plans_unified
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own health plans" ON health_plans_unified
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own health plans" ON health_plans_unified
    FOR DELETE USING (auth.uid() = user_id);

-- Create function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_health_plans_unified_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for updated_at
CREATE TRIGGER trigger_update_health_plans_unified_updated_at
    BEFORE UPDATE ON health_plans_unified
    FOR EACH ROW
    EXECUTE FUNCTION update_health_plans_unified_updated_at();

-- Create function to ensure only one active plan per user
CREATE OR REPLACE FUNCTION ensure_single_active_health_plan()
RETURNS TRIGGER AS $$
BEGIN
    -- If this plan is being set as active, deactivate all others for this user
    IF NEW.is_active = true AND NEW.status = 'active' THEN
        UPDATE health_plans_unified 
        SET is_active = false 
        WHERE user_id = NEW.user_id 
        AND id != NEW.id
        AND status = 'active';
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to ensure single active plan
CREATE TRIGGER trigger_ensure_single_active_health_plan
    BEFORE INSERT OR UPDATE ON health_plans_unified
    FOR EACH ROW
    EXECUTE FUNCTION ensure_single_active_health_plan();
