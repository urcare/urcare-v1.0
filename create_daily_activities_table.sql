-- Add plan_data JSONB field to health_plans table to store complete plan data
ALTER TABLE public.health_plans ADD COLUMN IF NOT EXISTS plan_data_json JSONB;

-- Create index for plan_data_json
CREATE INDEX IF NOT EXISTS idx_health_plans_plan_data_json ON public.health_plans USING GIN (plan_data_json);

-- Create daily_activities table to store AI-generated daily schedules
CREATE TABLE IF NOT EXISTS public.daily_activities (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    plan_id UUID REFERENCES health_plans(id) ON DELETE SET NULL,
    activity_date DATE NOT NULL DEFAULT CURRENT_DATE,
    activity_time VARCHAR(10) NOT NULL, -- e.g., "07:00", "08:30"
    activity VARCHAR(255) NOT NULL, -- e.g., "Morning Routine", "Workout Session"
    duration VARCHAR(20) NOT NULL, -- e.g., "30min", "45min", "1 hour"
    category VARCHAR(50) NOT NULL, -- e.g., "morning", "exercise", "meal", "work", "evening", "sleep"
    food TEXT, -- e.g., "Oatmeal 50g + Banana 1 medium + Almonds 10g"
    exercise TEXT, -- e.g., "10 pushups, 15 squats", "3 days/week"
    instructions TEXT[], -- Array of step-by-step instructions
    health_tip TEXT, -- e.g., "Start slow to avoid stress"
    is_completed BOOLEAN DEFAULT FALSE,
    completed_at TIMESTAMP WITH TIME ZONE,
    notes TEXT, -- User can add personal notes
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_daily_activities_user_id ON public.daily_activities(user_id);
CREATE INDEX IF NOT EXISTS idx_daily_activities_plan_id ON public.daily_activities(plan_id);
CREATE INDEX IF NOT EXISTS idx_daily_activities_activity_date ON public.daily_activities(activity_date);
CREATE INDEX IF NOT EXISTS idx_daily_activities_category ON public.daily_activities(category);
CREATE INDEX IF NOT EXISTS idx_daily_activities_time ON public.daily_activities(activity_time);
CREATE INDEX IF NOT EXISTS idx_daily_activities_is_completed ON public.daily_activities(is_completed);

-- Enable RLS (Row Level Security)
ALTER TABLE public.daily_activities ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view own daily activities" ON public.daily_activities
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own daily activities" ON public.daily_activities
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own daily activities" ON public.daily_activities
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own daily activities" ON public.daily_activities
    FOR DELETE USING (auth.uid() = user_id);

-- Service role can access all daily activities
CREATE POLICY "Service role can access all daily activities" ON public.daily_activities
    FOR ALL USING (auth.role() = 'service_role');

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_daily_activities_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for updated_at
CREATE TRIGGER update_daily_activities_updated_at
    BEFORE UPDATE ON public.daily_activities
    FOR EACH ROW
    EXECUTE FUNCTION update_daily_activities_updated_at();

-- Create function to save daily activities from AI response
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

-- Create function to get user's daily activities
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

-- Create function to mark activity as completed
CREATE OR REPLACE FUNCTION mark_activity_completed(
    p_activity_id UUID,
    p_user_id UUID,
    p_notes TEXT DEFAULT NULL
)
RETURNS BOOLEAN AS $$
BEGIN
    UPDATE public.daily_activities 
    SET 
        is_completed = TRUE,
        completed_at = NOW(),
        notes = COALESCE(p_notes, notes),
        updated_at = NOW()
    WHERE id = p_activity_id 
    AND user_id = p_user_id;
    
    RETURN FOUND;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT ALL ON public.daily_activities TO authenticated;
GRANT EXECUTE ON FUNCTION save_daily_activities(UUID, UUID, DATE, JSONB) TO authenticated;
GRANT EXECUTE ON FUNCTION get_user_daily_activities(UUID, DATE) TO authenticated;
GRANT EXECUTE ON FUNCTION mark_activity_completed(UUID, UUID, TEXT) TO authenticated;
