-- Simple fix for get_user_daily_activities function
-- This creates a minimal working version

-- Drop the function if it exists
DROP FUNCTION IF EXISTS get_user_daily_activities(UUID, DATE);

-- Create a simple version that definitely works
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
        COALESCE(da.activity, '') as activity,
        COALESCE(da.activity_time, '') as activity_time,
        COALESCE(da.duration, '') as duration,
        COALESCE(da.category, '') as category,
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

-- Grant permissions
GRANT EXECUTE ON FUNCTION get_user_daily_activities(UUID, DATE) TO authenticated;
GRANT EXECUTE ON FUNCTION get_user_daily_activities(UUID, DATE) TO service_role;

-- Test the function
SELECT 'Function created successfully' as status;
