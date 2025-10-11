-- Fix get_user_daily_activities function to match actual table schema
-- This migration only fixes the function without touching existing policies

DROP FUNCTION IF EXISTS get_user_daily_activities(UUID, DATE);

CREATE OR REPLACE FUNCTION get_user_daily_activities(
    p_user_id UUID,
    p_activity_date DATE
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

-- Grant permissions
GRANT EXECUTE ON FUNCTION get_user_daily_activities(UUID, DATE) TO authenticated;
GRANT EXECUTE ON FUNCTION get_user_daily_activities(UUID, DATE) TO service_role;
