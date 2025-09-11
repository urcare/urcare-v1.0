-- Fix subscription functions to include trial subscriptions
-- This migration updates the existing functions to properly handle trial subscriptions

-- Update has_active_subscription function to include trials
CREATE OR REPLACE FUNCTION has_active_subscription(user_uuid UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM subscriptions 
    WHERE user_id = user_uuid 
    AND status IN ('active', 'trialing')
    AND current_period_end > NOW()
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Update get_user_subscription function to include trials
CREATE OR REPLACE FUNCTION get_user_subscription(user_uuid UUID)
RETURNS TABLE (
  subscription_id UUID,
  plan_name VARCHAR(100),
  plan_slug VARCHAR(50),
  status VARCHAR(20),
  billing_cycle VARCHAR(10),
  current_period_end TIMESTAMP WITH TIME ZONE,
  features JSONB
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    s.id,
    sp.name,
    sp.slug,
    s.status,
    s.billing_cycle,
    s.current_period_end,
    sp.features
  FROM subscriptions s
  JOIN subscription_plans sp ON s.plan_id = sp.id
  WHERE s.user_id = user_uuid 
  AND s.status IN ('active', 'trialing')
  AND s.current_period_end > NOW()
  ORDER BY s.created_at DESC
  LIMIT 1;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
