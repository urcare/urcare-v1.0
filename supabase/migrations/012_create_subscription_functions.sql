-- Create subscription-related functions
-- This migration creates the get_user_subscription function and related utilities

-- Function to get user subscription status
CREATE OR REPLACE FUNCTION get_user_subscription(user_uuid UUID)
RETURNS TABLE (
    user_id UUID,
    trial_status TEXT,
    subscription_status TEXT,
    subscription_type TEXT,
    trial_started_at TIMESTAMP WITH TIME ZONE,
    trial_ends_at TIMESTAMP WITH TIME ZONE,
    subscription_started_at TIMESTAMP WITH TIME ZONE,
    subscription_ends_at TIMESTAMP WITH TIME ZONE,
    is_trial_active BOOLEAN,
    is_subscription_active BOOLEAN,
    days_remaining INTEGER
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        ut.user_id,
        ut.trial_status,
        ut.subscription_status,
        ut.subscription_type,
        ut.trial_started_at,
        ut.trial_ended_at,
        ut.subscription_started_at,
        ut.subscription_ends_at,
        (ut.trial_status = 'active' AND ut.trial_ended_at > NOW()) as is_trial_active,
        (ut.subscription_status = 'active' AND ut.subscription_ends_at > NOW()) as is_subscription_active,
        CASE 
            WHEN ut.trial_status = 'active' AND ut.trial_ended_at > NOW() 
            THEN EXTRACT(DAYS FROM (ut.trial_ended_at - NOW()))::INTEGER
            WHEN ut.subscription_status = 'active' AND ut.subscription_ends_at > NOW()
            THEN EXTRACT(DAYS FROM (ut.subscription_ends_at - NOW()))::INTEGER
            ELSE 0
        END as days_remaining
    FROM user_trials ut
    WHERE ut.user_id = user_uuid
    ORDER BY ut.created_at DESC
    LIMIT 1;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to check if user has active trial
CREATE OR REPLACE FUNCTION has_active_trial(user_uuid UUID)
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM user_trials 
        WHERE user_id = user_uuid 
        AND trial_status = 'active' 
        AND trial_ended_at > NOW()
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to check if user has active subscription
CREATE OR REPLACE FUNCTION has_active_subscription(user_uuid UUID)
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM user_trials 
        WHERE user_id = user_uuid 
        AND subscription_status = 'active' 
        AND subscription_ends_at > NOW()
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get user access level
CREATE OR REPLACE FUNCTION get_user_access_level(user_uuid UUID)
RETURNS TEXT AS $$
DECLARE
    has_trial BOOLEAN;
    has_subscription BOOLEAN;
BEGIN
    SELECT has_active_trial(user_uuid) INTO has_trial;
    SELECT has_active_subscription(user_uuid) INTO has_subscription;
    
    IF has_subscription THEN
        RETURN 'premium';
    ELSIF has_trial THEN
        RETURN 'trial';
    ELSE
        RETURN 'free';
    END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permissions to authenticated users
GRANT EXECUTE ON FUNCTION get_user_subscription(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION has_active_trial(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION has_active_subscription(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION get_user_access_level(UUID) TO authenticated;

-- Add comments for documentation
COMMENT ON FUNCTION get_user_subscription(UUID) IS 'Returns comprehensive subscription and trial information for a user';
COMMENT ON FUNCTION has_active_trial(UUID) IS 'Checks if user has an active trial period';
COMMENT ON FUNCTION has_active_subscription(UUID) IS 'Checks if user has an active paid subscription';
COMMENT ON FUNCTION get_user_access_level(UUID) IS 'Returns user access level: free, trial, or premium';
