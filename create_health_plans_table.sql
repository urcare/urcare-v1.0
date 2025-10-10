-- Create health_plans table to store AI-generated health plans
CREATE TABLE IF NOT EXISTS public.health_plans (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    plan_name VARCHAR(255) NOT NULL,
    plan_type VARCHAR(100) DEFAULT 'health_transformation',
    primary_goal TEXT,
    secondary_goals TEXT[],
    start_date DATE,
    target_end_date DATE,
    duration_weeks INTEGER,
    health_analysis_id UUID REFERENCES health_analysis(id) ON DELETE SET NULL,
    user_input TEXT,
    plan_data JSONB NOT NULL,
    status VARCHAR(50) DEFAULT 'draft',
    generation_model VARCHAR(100),
    generation_parameters JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_health_plans_user_id ON public.health_plans(user_id);
CREATE INDEX IF NOT EXISTS idx_health_plans_status ON public.health_plans(status);
CREATE INDEX IF NOT EXISTS idx_health_plans_created_at ON public.health_plans(created_at);
CREATE INDEX IF NOT EXISTS idx_health_plans_plan_type ON public.health_plans(plan_type);

-- Enable RLS (Row Level Security)
ALTER TABLE public.health_plans ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view own health plans" ON public.health_plans
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own health plans" ON public.health_plans
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own health plans" ON public.health_plans
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own health plans" ON public.health_plans
    FOR DELETE USING (auth.uid() = user_id);

-- Service role can access all health plans
CREATE POLICY "Service role can access all health plans" ON public.health_plans
    FOR ALL USING (auth.role() = 'service_role');

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_health_plans_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for updated_at
CREATE TRIGGER update_health_plans_updated_at
    BEFORE UPDATE ON public.health_plans
    FOR EACH ROW
    EXECUTE FUNCTION update_health_plans_updated_at();

-- Create function to get user's latest health plans
CREATE OR REPLACE FUNCTION get_user_health_plans(user_uuid UUID)
RETURNS TABLE (
    id UUID,
    plan_name VARCHAR(255),
    plan_type VARCHAR(100),
    primary_goal TEXT,
    secondary_goals TEXT[],
    start_date DATE,
    target_end_date DATE,
    duration_weeks INTEGER,
    plan_data JSONB,
    status VARCHAR(50),
    generation_model VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        hp.id,
        hp.plan_name,
        hp.plan_type,
        hp.primary_goal,
        hp.secondary_goals,
        hp.start_date,
        hp.target_end_date,
        hp.duration_weeks,
        hp.plan_data,
        hp.status,
        hp.generation_model,
        hp.created_at
    FROM public.health_plans hp
    WHERE hp.user_id = user_uuid
    ORDER BY hp.created_at DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT ALL ON public.health_plans TO authenticated;
GRANT EXECUTE ON FUNCTION get_user_health_plans(UUID) TO authenticated;
