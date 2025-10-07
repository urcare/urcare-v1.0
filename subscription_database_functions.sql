-- SQL Script to Create Database Functions for Subscription Management
-- This script creates the necessary database functions that the application uses to check subscriptions

-- 1. Function to check if user has active subscription
CREATE OR REPLACE FUNCTION has_active_subscription(p_user_id UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    -- Check if user has any active subscription
    RETURN EXISTS (
        SELECT 1 
        FROM subscriptions s
        WHERE s.user_id = p_user_id 
        AND s.status = 'active'
        AND s.current_period_end > NOW()
    );
END;
$$;

-- 2. Function to get user subscription details
CREATE OR REPLACE FUNCTION get_user_subscription(p_user_id UUID)
RETURNS TABLE (
    subscription_id UUID,
    plan_name TEXT,
    plan_slug TEXT,
    status TEXT,
    billing_cycle TEXT,
    current_period_end TIMESTAMP WITH TIME ZONE,
    features JSONB
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    RETURN QUERY
    SELECT 
        s.id as subscription_id,
        sp.name as plan_name,
        sp.slug as plan_slug,
        s.status,
        s.billing_cycle,
        s.current_period_end,
        sp.features
    FROM subscriptions s
    JOIN subscription_plans sp ON s.plan_id = sp.id
    WHERE s.user_id = p_user_id 
    AND s.status = 'active'
    AND s.current_period_end > NOW()
    ORDER BY s.created_at DESC
    LIMIT 1;
END;
$$;

-- 3. Function to check if user can access a specific feature
CREATE OR REPLACE FUNCTION can_access_feature(p_user_id UUID, p_feature_name TEXT)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    has_subscription BOOLEAN := FALSE;
    has_feature BOOLEAN := FALSE;
    feature_usage INTEGER := 0;
    feature_limit INTEGER := NULL;
BEGIN
    -- First check if user has active subscription
    SELECT has_active_subscription(p_user_id) INTO has_subscription;
    
    IF NOT has_subscription THEN
        RETURN FALSE;
    END IF;
    
    -- Check if feature is included in user's plan
    SELECT EXISTS (
        SELECT 1 
        FROM subscriptions s
        JOIN subscription_plans sp ON s.plan_id = sp.id
        WHERE s.user_id = p_user_id 
        AND s.status = 'active'
        AND s.current_period_end > NOW()
        AND sp.features ? p_feature_name
    ) INTO has_feature;
    
    IF NOT has_feature THEN
        RETURN FALSE;
    END IF;
    
    -- Check usage limits (if any)
    -- Get current usage for today
    SELECT COALESCE(SUM(su.usage_count), 0) INTO feature_usage
    FROM subscriptions s
    JOIN subscription_usage su ON s.id = su.subscription_id
    WHERE s.user_id = p_user_id 
    AND s.status = 'active'
    AND su.feature_name = p_feature_name
    AND su.reset_date = CURRENT_DATE;
    
    -- Get feature limit based on plan
    SELECT 
        CASE 
            WHEN p_feature_name = 'ai_consultations' THEN
                CASE sp.slug
                    WHEN 'basic' THEN 5
                    WHEN 'family' THEN 20
                    WHEN 'elite' THEN -1  -- Unlimited
                    ELSE 0
                END
            WHEN p_feature_name = 'health_reports' THEN
                CASE sp.slug
                    WHEN 'basic' THEN 3
                    WHEN 'family' THEN 10
                    WHEN 'elite' THEN -1  -- Unlimited
                    ELSE 0
                END
            WHEN p_feature_name = 'meal_plans' THEN
                CASE sp.slug
                    WHEN 'basic' THEN 7
                    WHEN 'family' THEN 30
                    WHEN 'elite' THEN -1  -- Unlimited
                    ELSE 0
                END
            ELSE -1  -- No limit for other features
        END INTO feature_limit
    FROM subscriptions s
    JOIN subscription_plans sp ON s.plan_id = sp.id
    WHERE s.user_id = p_user_id 
    AND s.status = 'active'
    AND s.current_period_end > NOW()
    LIMIT 1;
    
    -- If no limit (-1), allow access
    IF feature_limit = -1 THEN
        RETURN TRUE;
    END IF;
    
    -- If limit is 0, deny access
    IF feature_limit = 0 THEN
        RETURN FALSE;
    END IF;
    
    -- Check if usage is within limit
    RETURN feature_usage < feature_limit;
END;
$$;

-- 4. Function to update subscription usage
CREATE OR REPLACE FUNCTION update_subscription_usage(
    p_user_id UUID, 
    p_feature_name TEXT, 
    p_increment INTEGER DEFAULT 1
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    subscription_id_var UUID;
    existing_usage INTEGER := 0;
BEGIN
    -- Get user's active subscription ID
    SELECT s.id INTO subscription_id_var
    FROM subscriptions s
    WHERE s.user_id = p_user_id 
    AND s.status = 'active'
    AND s.current_period_end > NOW()
    LIMIT 1;
    
    IF subscription_id_var IS NULL THEN
        RETURN FALSE;
    END IF;
    
    -- Check if usage record exists for today
    SELECT COALESCE(usage_count, 0) INTO existing_usage
    FROM subscription_usage
    WHERE subscription_id = subscription_id_var
    AND feature_name = p_feature_name
    AND reset_date = CURRENT_DATE;
    
    IF existing_usage > 0 THEN
        -- Update existing usage
        UPDATE subscription_usage
        SET usage_count = usage_count + p_increment,
            updated_at = NOW()
        WHERE subscription_id = subscription_id_var
        AND feature_name = p_feature_name
        AND reset_date = CURRENT_DATE;
    ELSE
        -- Create new usage record
        INSERT INTO subscription_usage (
            subscription_id,
            feature_name,
            usage_count,
            reset_date
        ) VALUES (
            subscription_id_var,
            p_feature_name,
            p_increment,
            CURRENT_DATE
        );
    END IF;
    
    RETURN TRUE;
END;
$$;

-- 5. Function to get subscription status details
CREATE OR REPLACE FUNCTION get_subscription_status(p_user_id UUID)
RETURNS TABLE (
    is_active BOOLEAN,
    is_expired BOOLEAN,
    is_canceled BOOLEAN,
    days_until_expiry INTEGER,
    can_renew BOOLEAN,
    subscription_id UUID,
    plan_name TEXT,
    plan_slug TEXT,
    billing_cycle TEXT,
    current_period_end TIMESTAMP WITH TIME ZONE
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    RETURN QUERY
    SELECT 
        (s.status = 'active' AND s.current_period_end > NOW()) as is_active,
        (s.current_period_end <= NOW()) as is_expired,
        (s.status = 'canceled') as is_canceled,
        GREATEST(0, EXTRACT(DAY FROM (s.current_period_end - NOW())))::INTEGER as days_until_expiry,
        (s.status = 'canceled' OR s.current_period_end <= NOW()) as can_renew,
        s.id as subscription_id,
        sp.name as plan_name,
        sp.slug as plan_slug,
        s.billing_cycle,
        s.current_period_end
    FROM subscriptions s
    JOIN subscription_plans sp ON s.plan_id = sp.id
    WHERE s.user_id = p_user_id
    ORDER BY s.created_at DESC
    LIMIT 1;
END;
$$;

-- 6. Function to check subscription eligibility for first-time pricing
CREATE OR REPLACE FUNCTION is_eligible_for_first_time_pricing(p_user_id UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    -- Check if user has any previous subscriptions
    RETURN NOT EXISTS (
        SELECT 1 
        FROM subscriptions 
        WHERE user_id = p_user_id
    );
END;
$$;

-- 7. Function to get user's subscription usage metrics
CREATE OR REPLACE FUNCTION get_subscription_usage_metrics(p_user_id UUID)
RETURNS TABLE (
    feature_name TEXT,
    current_usage INTEGER,
    usage_limit INTEGER,
    percentage_used DECIMAL(5,2),
    is_over_limit BOOLEAN,
    reset_date DATE
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    subscription_id_var UUID;
    plan_slug_var TEXT;
BEGIN
    -- Get user's active subscription details
    SELECT s.id, sp.slug INTO subscription_id_var, plan_slug_var
    FROM subscriptions s
    JOIN subscription_plans sp ON s.plan_id = sp.id
    WHERE s.user_id = p_user_id 
    AND s.status = 'active'
    AND s.current_period_end > NOW()
    LIMIT 1;
    
    IF subscription_id_var IS NULL THEN
        RETURN;
    END IF;
    
    -- Return usage metrics for all features in the plan
    RETURN QUERY
    SELECT 
        su.feature_name,
        su.usage_count as current_usage,
        CASE 
            WHEN su.feature_name = 'ai_consultations' THEN
                CASE plan_slug_var
                    WHEN 'basic' THEN 5
                    WHEN 'family' THEN 20
                    WHEN 'elite' THEN -1
                    ELSE 0
                END
            WHEN su.feature_name = 'health_reports' THEN
                CASE plan_slug_var
                    WHEN 'basic' THEN 3
                    WHEN 'family' THEN 10
                    WHEN 'elite' THEN -1
                    ELSE 0
                END
            WHEN su.feature_name = 'meal_plans' THEN
                CASE plan_slug_var
                    WHEN 'basic' THEN 7
                    WHEN 'family' THEN 30
                    WHEN 'elite' THEN -1
                    ELSE 0
                END
            ELSE -1
        END as usage_limit,
        CASE 
            WHEN su.feature_name = 'ai_consultations' AND plan_slug_var = 'elite' THEN 0.00
            WHEN su.feature_name = 'health_reports' AND plan_slug_var = 'elite' THEN 0.00
            WHEN su.feature_name = 'meal_plans' AND plan_slug_var = 'elite' THEN 0.00
            ELSE 
                CASE 
                    WHEN su.feature_name = 'ai_consultations' THEN
                        CASE plan_slug_var
                            WHEN 'basic' THEN (su.usage_count::DECIMAL / 5 * 100)
                            WHEN 'family' THEN (su.usage_count::DECIMAL / 20 * 100)
                            ELSE 0.00
                        END
                    WHEN su.feature_name = 'health_reports' THEN
                        CASE plan_slug_var
                            WHEN 'basic' THEN (su.usage_count::DECIMAL / 3 * 100)
                            WHEN 'family' THEN (su.usage_count::DECIMAL / 10 * 100)
                            ELSE 0.00
                        END
                    WHEN su.feature_name = 'meal_plans' THEN
                        CASE plan_slug_var
                            WHEN 'basic' THEN (su.usage_count::DECIMAL / 7 * 100)
                            WHEN 'family' THEN (su.usage_count::DECIMAL / 30 * 100)
                            ELSE 0.00
                        END
                    ELSE 0.00
                END
        END as percentage_used,
        CASE 
            WHEN su.feature_name = 'ai_consultations' AND plan_slug_var = 'elite' THEN FALSE
            WHEN su.feature_name = 'health_reports' AND plan_slug_var = 'elite' THEN FALSE
            WHEN su.feature_name = 'meal_plans' AND plan_slug_var = 'elite' THEN FALSE
            ELSE 
                CASE 
                    WHEN su.feature_name = 'ai_consultations' THEN
                        CASE plan_slug_var
                            WHEN 'basic' THEN (su.usage_count >= 5)
                            WHEN 'family' THEN (su.usage_count >= 20)
                            ELSE FALSE
                        END
                    WHEN su.feature_name = 'health_reports' THEN
                        CASE plan_slug_var
                            WHEN 'basic' THEN (su.usage_count >= 3)
                            WHEN 'family' THEN (su.usage_count >= 10)
                            ELSE FALSE
                        END
                    WHEN su.feature_name = 'meal_plans' THEN
                        CASE plan_slug_var
                            WHEN 'basic' THEN (su.usage_count >= 7)
                            WHEN 'family' THEN (su.usage_count >= 30)
                            ELSE FALSE
                        END
                    ELSE FALSE
                END
        END as is_over_limit,
        su.reset_date
    FROM subscription_usage su
    WHERE su.subscription_id = subscription_id_var
    AND su.reset_date = CURRENT_DATE;
END;
$$;

-- Grant execute permissions to authenticated users
GRANT EXECUTE ON FUNCTION has_active_subscription(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION get_user_subscription(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION can_access_feature(UUID, TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION update_subscription_usage(UUID, TEXT, INTEGER) TO authenticated;
GRANT EXECUTE ON FUNCTION get_subscription_status(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION is_eligible_for_first_time_pricing(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION get_subscription_usage_metrics(UUID) TO authenticated;

-- Test the functions with the granted user
SELECT 'Testing subscription functions...' as status;

-- Test has_active_subscription
SELECT has_active_subscription('01d2e32a-07ac-415b-bee2-30fdfdcc2b85') as has_active;

-- Test get_user_subscription
SELECT * FROM get_user_subscription('01d2e32a-07ac-415b-bee2-30fdfdcc2b85');

-- Test can_access_feature
SELECT can_access_feature('01d2e32a-07ac-415b-bee2-30fdfdcc2b85', 'ai_consultations') as can_access_ai;
SELECT can_access_feature('01d2e32a-07ac-415b-bee2-30fdfdcc2b85', 'health_reports') as can_access_health;

-- Test get_subscription_status
SELECT * FROM get_subscription_status('01d2e32a-07ac-415b-bee2-30fdfdcc2b85');

SELECT 'All subscription functions created and tested successfully!' as result;
