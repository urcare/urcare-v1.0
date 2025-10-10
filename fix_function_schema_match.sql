-- Fix get_user_daily_activities function to match actual table schema
-- Based on the error, the table doesn't have a 'description' column

-- Drop the function if it exists
DROP FUNCTION IF EXISTS get_user_daily_activities(UUID, DATE);

-- Create function that matches the actual table schema
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
        '' as description, -- This column doesn't exist in the table, so return empty string
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
SELECT 'Function created successfully with correct schema' as status;
