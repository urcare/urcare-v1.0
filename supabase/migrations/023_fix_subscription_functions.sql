-- Fix subscription functions to work with the new subscriptions table
-- This migration updates the functions to use the subscriptions table instead of user_trials

-- Drop the old functions that reference user_trials
DROP FUNCTION IF EXISTS get_user_subscription(UUID);
DROP FUNCTION IF EXISTS has_active_trial(UUID);
DROP FUNCTION IF EXISTS has_active_subscription(UUID);
DROP FUNCTION IF EXISTS get_user_access_level(UUID);

-- Create updated function to get user subscription with plan details
CREATE OR REPLACE FUNCTION get_user_subscription(user_uuid UUID)
RETURNS TABLE (
    subscription_id UUID,
    user_id UUID,
    plan_id UUID,
    plan_name VARCHAR(100),
    plan_slug VARCHAR(50),
    status VARCHAR(20),
    billing_cycle VARCHAR(10),
    current_period_start TIMESTAMP WITH TIME ZONE,
    current_period_end TIMESTAMP WITH TIME ZONE,
    cancel_at_period_end BOOLEAN,
    canceled_at TIMESTAMP WITH TIME ZONE,
    trial_start TIMESTAMP WITH TIME ZONE,
    trial_end TIMESTAMP WITH TIME ZONE,
    features JSONB,
    is_active BOOLEAN,
    days_remaining INTEGER
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        s.id as subscription_id,
        s.user_id,
        s.plan_id,
        sp.name as plan_name,
        sp.slug as plan_slug,
        s.status,
        s.billing_cycle,
        s.current_period_start,
        s.current_period_end,
        s.cancel_at_period_end,
        s.canceled_at,
        s.trial_start,
        s.trial_end,
        sp.features,
        (s.status = 'active' AND s.current_period_end > NOW()) as is_active,
        CASE 
            WHEN s.status = 'active' AND s.current_period_end > NOW()
            THEN EXTRACT(DAYS FROM (s.current_period_end - NOW()))::INTEGER
            ELSE 0
        END as days_remaining
    FROM subscriptions s
    JOIN subscription_plans sp ON s.plan_id = sp.id
    WHERE s.user_id = user_uuid
    AND s.status IN ('active', 'trialing')
    ORDER BY s.created_at DESC
    LIMIT 1;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create updated function to check if user has active subscription
CREATE OR REPLACE FUNCTION has_active_subscription(user_uuid UUID)
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM subscriptions s
        WHERE s.user_id = user_uuid 
        AND s.status = 'active' 
        AND s.current_period_end > NOW()
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to check if user has active trial
CREATE OR REPLACE FUNCTION has_active_trial(user_uuid UUID)
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM subscriptions s
        WHERE s.user_id = user_uuid 
        AND s.status = 'trialing' 
        AND s.trial_end > NOW()
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create updated function to get user access level
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
COMMENT ON FUNCTION get_user_subscription(UUID) IS 'Returns comprehensive subscription information for a user from the subscriptions table';
COMMENT ON FUNCTION has_active_trial(UUID) IS 'Checks if user has an active trial period in the subscriptions table';
COMMENT ON FUNCTION has_active_subscription(UUID) IS 'Checks if user has an active paid subscription in the subscriptions table';
COMMENT ON FUNCTION get_user_access_level(UUID) IS 'Returns user access level: free, trial, or premium based on subscriptions table';

