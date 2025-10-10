-- Fix save_daily_activities function to match actual table schema
-- Drop and recreate the function with correct column mapping

DROP FUNCTION IF EXISTS save_daily_activities(UUID, DATE, JSONB);

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

-- Grant execute permission
GRANT EXECUTE ON FUNCTION save_daily_activities(UUID, DATE, JSONB) TO authenticated;
