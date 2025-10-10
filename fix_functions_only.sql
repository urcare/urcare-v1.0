-- Fix only the functions for daily activities (table already exists)

-- 1. Create save_daily_activities function
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

-- 2. Create get_user_daily_activities function
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

-- 3. Create mark_activity_completed function
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

-- 4. Grant permissions
GRANT EXECUTE ON FUNCTION save_daily_activities(UUID, UUID, DATE, JSONB) TO authenticated;
GRANT EXECUTE ON FUNCTION get_user_daily_activities(UUID, DATE) TO authenticated;
GRANT EXECUTE ON FUNCTION mark_activity_completed(UUID, UUID, TEXT) TO authenticated;
