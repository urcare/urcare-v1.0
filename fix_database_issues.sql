-- Fix database issues for daily activities and health plans

-- 1. Create health_plans table if it doesn't exist
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
    plan_data_json JSONB,
    status VARCHAR(50) DEFAULT 'draft',
    generation_model VARCHAR(100),
    generation_parameters JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Create daily_activities table
CREATE TABLE IF NOT EXISTS public.daily_activities (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    plan_id UUID REFERENCES health_plans(id) ON DELETE SET NULL,
    activity_date DATE NOT NULL DEFAULT CURRENT_DATE,
    activity_time VARCHAR(10) NOT NULL,
    activity VARCHAR(255) NOT NULL,
    duration VARCHAR(20) NOT NULL,
    category VARCHAR(50) NOT NULL,
    food TEXT,
    exercise TEXT,
    instructions TEXT[],
    health_tip TEXT,
    is_completed BOOLEAN DEFAULT FALSE,
    completed_at TIMESTAMP WITH TIME ZONE,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Create indexes
CREATE INDEX IF NOT EXISTS idx_daily_activities_user_id ON public.daily_activities(user_id);
CREATE INDEX IF NOT EXISTS idx_daily_activities_plan_id ON public.daily_activities(plan_id);
CREATE INDEX IF NOT EXISTS idx_daily_activities_activity_date ON public.daily_activities(activity_date);

-- 4. Enable RLS
ALTER TABLE public.daily_activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.health_plans ENABLE ROW LEVEL SECURITY;

-- 5. Create RLS policies for daily_activities
DROP POLICY IF EXISTS "Users can view own daily activities" ON public.daily_activities;
CREATE POLICY "Users can view own daily activities" ON public.daily_activities
    FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own daily activities" ON public.daily_activities;
CREATE POLICY "Users can insert own daily activities" ON public.daily_activities
    FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own daily activities" ON public.daily_activities;
CREATE POLICY "Users can update own daily activities" ON public.daily_activities
    FOR UPDATE USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete own daily activities" ON public.daily_activities;
CREATE POLICY "Users can delete own daily activities" ON public.daily_activities
    FOR DELETE USING (auth.uid() = user_id);

-- 6. Create RLS policies for health_plans
DROP POLICY IF EXISTS "Users can view own health plans" ON public.health_plans;
CREATE POLICY "Users can view own health plans" ON public.health_plans
    FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own health plans" ON public.health_plans;
CREATE POLICY "Users can insert own health plans" ON public.health_plans
    FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own health plans" ON public.health_plans;
CREATE POLICY "Users can update own health plans" ON public.health_plans
    FOR UPDATE USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete own health plans" ON public.health_plans;
CREATE POLICY "Users can delete own health plans" ON public.health_plans
    FOR DELETE USING (auth.uid() = user_id);

-- 7. Create save_daily_activities function
CREATE OR REPLACE FUNCTION save_daily_activities(
    p_user_id UUID,
    p_plan_id UUID DEFAULT NULL,
    p_activity_date DATE DEFAULT CURRENT_DATE,
    p_activities JSONB DEFAULT '[]'::jsonb
)
RETURNS TABLE (
    id UUID,
    activity_time VARCHAR(10),
    activity VARCHAR(255),
    duration VARCHAR(20),
    category VARCHAR(50)
) AS $$
DECLARE
    activity_item JSONB;
    activity_id UUID;
    activity_time VARCHAR(10);
    activity VARCHAR(255);
    duration VARCHAR(20);
    category VARCHAR(50);
BEGIN
    -- Delete existing activities for the user and date
    DELETE FROM public.daily_activities 
    WHERE user_id = p_user_id 
    AND activity_date = p_activity_date;
    
    -- Insert new activities (only if activities array is not empty)
    IF p_activities IS NOT NULL AND jsonb_array_length(p_activities) > 0 THEN
        FOR activity_item IN SELECT * FROM jsonb_array_elements(p_activities)
        LOOP
        INSERT INTO public.daily_activities (
            user_id,
            plan_id,
            activity_date,
            activity_time,
            activity,
            duration,
            category,
            food,
            exercise,
            instructions,
            health_tip
        ) VALUES (
            p_user_id,
            p_plan_id,
            p_activity_date,
            COALESCE(activity_item->>'time', '00:00'),
            COALESCE(activity_item->>'activity', 'Unknown Activity'),
            COALESCE(activity_item->>'duration', '0min'),
            COALESCE(activity_item->>'category', 'general'),
            activity_item->>'food',
            activity_item->>'exercise',
            CASE 
                WHEN activity_item->'instructions' IS NOT NULL 
                THEN ARRAY(SELECT jsonb_array_elements_text(activity_item->'instructions'))
                ELSE NULL 
            END,
            activity_item->>'health_tip'
        ) RETURNING daily_activities.id, daily_activities.activity_time, daily_activities.activity, daily_activities.duration, daily_activities.category INTO activity_id, activity_time, activity, duration, category;
        
        RETURN NEXT;
        END LOOP;
    END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 8. Create get_user_daily_activities function
CREATE OR REPLACE FUNCTION get_user_daily_activities(
    p_user_id UUID,
    p_activity_date DATE DEFAULT CURRENT_DATE
)
RETURNS TABLE (
    id UUID,
    activity_time VARCHAR(10),
    activity VARCHAR(255),
    duration VARCHAR(20),
    category VARCHAR(50),
    food TEXT,
    exercise TEXT,
    instructions TEXT[],
    health_tip TEXT,
    is_completed BOOLEAN,
    completed_at TIMESTAMP WITH TIME ZONE,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        da.id,
        da.activity_time,
        da.activity,
        da.duration,
        da.category,
        da.food,
        da.exercise,
        da.instructions,
        da.health_tip,
        da.is_completed,
        da.completed_at,
        da.notes,
        da.created_at
    FROM public.daily_activities da
    WHERE da.user_id = p_user_id
    AND da.activity_date = p_activity_date
    ORDER BY da.activity_time ASC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 9. Grant permissions
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT ALL ON public.daily_activities TO authenticated;
GRANT ALL ON public.health_plans TO authenticated;
GRANT EXECUTE ON FUNCTION save_daily_activities(UUID, UUID, DATE, JSONB) TO authenticated;
GRANT EXECUTE ON FUNCTION get_user_daily_activities(UUID, DATE) TO authenticated;
