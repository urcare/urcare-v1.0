-- Complete Database Fix for Health Analysis and Health Plans (Fixed Version)
-- This script ensures all required tables exist with proper RLS policies

-- 1. Create health_analysis table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.health_analysis (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    health_score INTEGER,
    analysis TEXT,
    recommendations JSONB DEFAULT '[]'::jsonb,
    display_analysis JSONB DEFAULT '{}'::jsonb,
    detailed_analysis JSONB DEFAULT '{}'::jsonb,
    factors_considered JSONB DEFAULT '[]'::jsonb,
    ai_provider TEXT,
    ai_model TEXT,
    is_latest BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Create health_plans table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.health_plans (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    plan_name TEXT NOT NULL,
    plan_description TEXT,
    plan_data_json JSONB DEFAULT '{}'::jsonb,
    status TEXT DEFAULT 'generated' CHECK (status IN ('generated', 'selected', 'completed')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Create daily_activities table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.daily_activities (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    activity TEXT NOT NULL,
    activity_time TEXT,
    duration TEXT,
    category TEXT,
    description TEXT,
    is_completed BOOLEAN DEFAULT false,
    completed_at TIMESTAMP WITH TIME ZONE,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_health_analysis_user_id ON public.health_analysis(user_id);
CREATE INDEX IF NOT EXISTS idx_health_analysis_is_latest ON public.health_analysis(is_latest);
CREATE INDEX IF NOT EXISTS idx_health_analysis_user_latest ON public.health_analysis(user_id, is_latest);

CREATE INDEX IF NOT EXISTS idx_health_plans_user_id ON public.health_plans(user_id);
CREATE INDEX IF NOT EXISTS idx_health_plans_status ON public.health_plans(status);
CREATE INDEX IF NOT EXISTS idx_health_plans_user_status ON public.health_plans(user_id, status);

CREATE INDEX IF NOT EXISTS idx_daily_activities_user_id ON public.daily_activities(user_id);
CREATE INDEX IF NOT EXISTS idx_daily_activities_is_completed ON public.daily_activities(is_completed);

-- 5. Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view their own health analysis" ON public.health_analysis;
DROP POLICY IF EXISTS "Users can insert their own health analysis" ON public.health_analysis;
DROP POLICY IF EXISTS "Users can update their own health analysis" ON public.health_analysis;
DROP POLICY IF EXISTS "Users can delete their own health analysis" ON public.health_analysis;

DROP POLICY IF EXISTS "Users can view their own health plans" ON public.health_plans;
DROP POLICY IF EXISTS "Users can insert their own health plans" ON public.health_plans;
DROP POLICY IF EXISTS "Users can update their own health plans" ON public.health_plans;
DROP POLICY IF EXISTS "Users can delete their own health plans" ON public.health_plans;

DROP POLICY IF EXISTS "Users can view their own daily activities" ON public.daily_activities;
DROP POLICY IF EXISTS "Users can insert their own daily activities" ON public.daily_activities;
DROP POLICY IF EXISTS "Users can update their own daily activities" ON public.daily_activities;
DROP POLICY IF EXISTS "Users can delete their own daily activities" ON public.daily_activities;

-- 6. Create RLS policies for health_analysis
CREATE POLICY "Users can view their own health analysis" ON public.health_analysis
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own health analysis" ON public.health_analysis
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own health analysis" ON public.health_analysis
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own health analysis" ON public.health_analysis
    FOR DELETE USING (auth.uid() = user_id);

-- 7. Create RLS policies for health_plans
CREATE POLICY "Users can view their own health plans" ON public.health_plans
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own health plans" ON public.health_plans
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own health plans" ON public.health_plans
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own health plans" ON public.health_plans
    FOR DELETE USING (auth.uid() = user_id);

-- 8. Create RLS policies for daily_activities
CREATE POLICY "Users can view their own daily activities" ON public.daily_activities
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own daily activities" ON public.daily_activities
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own daily activities" ON public.daily_activities
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own daily activities" ON public.daily_activities
    FOR DELETE USING (auth.uid() = user_id);

-- 9. Enable RLS on all tables
ALTER TABLE public.health_analysis ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.health_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.daily_activities ENABLE ROW LEVEL SECURITY;

-- 10. Grant permissions
GRANT ALL ON public.health_analysis TO authenticated;
GRANT ALL ON public.health_analysis TO service_role;

GRANT ALL ON public.health_plans TO authenticated;
GRANT ALL ON public.health_plans TO service_role;

GRANT ALL ON public.daily_activities TO authenticated;
GRANT ALL ON public.daily_activities TO service_role;

-- 11. Drop existing functions first to avoid conflicts
DROP FUNCTION IF EXISTS mark_old_analyses_not_latest(UUID);
DROP FUNCTION IF EXISTS save_daily_activities(UUID, DATE, JSONB);
DROP FUNCTION IF EXISTS get_user_daily_activities(UUID, DATE);
DROP FUNCTION IF EXISTS mark_activity_completed(UUID, UUID, TEXT);

-- 12. Create helper functions
CREATE OR REPLACE FUNCTION mark_old_analyses_not_latest(p_user_id UUID)
RETURNS VOID AS $$
BEGIN
    UPDATE public.health_analysis 
    SET is_latest = false, updated_at = NOW()
    WHERE user_id = p_user_id AND is_latest = true;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION save_daily_activities(
    p_user_id UUID,
    p_activity_date DATE,
    p_activities JSONB DEFAULT '[]'::jsonb
)
RETURNS UUID AS $$
DECLARE
    activity_record JSONB;
    activity_id UUID;
BEGIN
    -- Mark existing activities for this date as not latest
    DELETE FROM public.daily_activities 
    WHERE user_id = p_user_id AND DATE(created_at) = p_activity_date;
    
    -- Insert new activities
    IF p_activities IS NOT NULL AND jsonb_array_length(p_activities) > 0 THEN
        FOR activity_record IN SELECT * FROM jsonb_array_elements(p_activities)
        LOOP
            INSERT INTO public.daily_activities (
                user_id,
                activity,
                activity_time,
                duration,
                category,
                description,
                created_at
            ) VALUES (
                p_user_id,
                activity_record->>'activity',
                activity_record->>'time',
                activity_record->>'duration',
                activity_record->>'category',
                activity_record->>'description',
                NOW()
            ) RETURNING id INTO activity_id;
        END LOOP;
    END IF;
    
    RETURN activity_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION get_user_daily_activities(
    p_user_id UUID,
    p_activity_date DATE
)
RETURNS TABLE (
    id UUID,
    activity TEXT,
    activity_time TEXT,
    duration TEXT,
    category TEXT,
    description TEXT,
    is_completed BOOLEAN,
    completed_at TIMESTAMP WITH TIME ZONE,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        da.id,
        da.activity,
        da.activity_time,
        da.duration,
        da.category,
        da.description,
        da.is_completed,
        da.completed_at,
        da.notes,
        da.created_at
    FROM public.daily_activities da
    WHERE da.user_id = p_user_id 
    AND DATE(da.created_at) = p_activity_date
    ORDER BY da.created_at ASC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION mark_activity_completed(
    p_activity_id UUID,
    p_user_id UUID,
    p_notes TEXT DEFAULT NULL
)
RETURNS BOOLEAN AS $$
BEGIN
    UPDATE public.daily_activities 
    SET 
        is_completed = true,
        completed_at = NOW(),
        notes = COALESCE(p_notes, notes)
    WHERE id = p_activity_id 
    AND user_id = p_user_id;
    
    RETURN FOUND;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 13. Grant execute permissions on functions
GRANT EXECUTE ON FUNCTION mark_old_analyses_not_latest(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION save_daily_activities(UUID, DATE, JSONB) TO authenticated;
GRANT EXECUTE ON FUNCTION get_user_daily_activities(UUID, DATE) TO authenticated;
GRANT EXECUTE ON FUNCTION mark_activity_completed(UUID, UUID, TEXT) TO authenticated;

-- 14. Verify table structures
SELECT 'health_analysis' as table_name, column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'health_analysis' AND table_schema = 'public'
UNION ALL
SELECT 'health_plans' as table_name, column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'health_plans' AND table_schema = 'public'
UNION ALL
SELECT 'daily_activities' as table_name, column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'daily_activities' AND table_schema = 'public'
ORDER BY table_name, column_name;
