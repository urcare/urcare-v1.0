-- Complete fix for all database functions
-- This script ensures all functions exist with correct signatures

-- 1. Drop all existing functions to avoid conflicts
DROP FUNCTION IF EXISTS mark_old_analyses_not_latest(UUID);
DROP FUNCTION IF EXISTS save_daily_activities(UUID, DATE, JSONB);
DROP FUNCTION IF EXISTS get_user_daily_activities(UUID, DATE);
DROP FUNCTION IF EXISTS mark_activity_completed(UUID, UUID, TEXT);

-- 2. Create mark_old_analyses_not_latest function
CREATE OR REPLACE FUNCTION mark_old_analyses_not_latest(p_user_id UUID)
RETURNS VOID AS $$
BEGIN
    UPDATE public.health_analysis 
    SET is_latest = false, updated_at = NOW()
    WHERE user_id = p_user_id AND is_latest = true;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 3. Create save_daily_activities function
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
                activity_date,
                activity_time,
                duration,
                category,
                instructions,
                created_at
            ) VALUES (
                p_user_id,
                activity_record->>'activity',
                p_activity_date,
                activity_record->>'time',
                activity_record->>'duration',
                activity_record->>'category',
                CASE 
                    WHEN activity_record->>'instructions' IS NOT NULL 
                    THEN string_to_array(activity_record->>'instructions', '|')
                    ELSE NULL
                END,
                NOW()
            ) RETURNING id INTO activity_id;
        END LOOP;
    END IF;
    
    RETURN activity_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 4. Create get_user_daily_activities function
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
        COALESCE(da.description, '') as description,
        COALESCE(da.is_completed, false) as is_completed,
        da.completed_at,
        da.notes,
        da.created_at
    FROM public.daily_activities da
    WHERE da.user_id = p_user_id 
    AND DATE(da.created_at) = p_activity_date
    ORDER BY da.created_at ASC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 5. Create mark_activity_completed function
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

-- 6. Grant execute permissions on all functions
GRANT EXECUTE ON FUNCTION mark_old_analyses_not_latest(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION save_daily_activities(UUID, DATE, JSONB) TO authenticated;
GRANT EXECUTE ON FUNCTION get_user_daily_activities(UUID, DATE) TO authenticated;
GRANT EXECUTE ON FUNCTION mark_activity_completed(UUID, UUID, TEXT) TO authenticated;

-- 7. Test the functions exist
SELECT 
    routine_name, 
    routine_type, 
    data_type as return_type
FROM information_schema.routines 
WHERE routine_schema = 'public' 
AND routine_name IN (
    'mark_old_analyses_not_latest',
    'save_daily_activities', 
    'get_user_daily_activities',
    'mark_activity_completed'
)
ORDER BY routine_name;
