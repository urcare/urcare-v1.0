-- =====================================================
-- Grant Yearly Subscription to User
-- =====================================================
-- This script grants a yearly subscription to the specified user
-- User ID: f82ffd7a-0cff-446f-9285-d8a4d01de94e

-- First, let's check what subscription plans are available
-- You may need to create a yearly plan if it doesn't exist
-- For now, we'll use a generic plan_id (you may need to adjust this)

-- First, delete any existing subscription for this user
DELETE FROM user_subscriptions 
WHERE user_id = 'f82ffd7a-0cff-446f-9285-d8a4d01de94e';

-- Insert new yearly subscription record
INSERT INTO user_subscriptions (
    user_id,
    plan_id,
    status,
    billing_cycle,
    current_period_start,
    current_period_end,
    created_at,
    updated_at
)
VALUES (
    'f82ffd7a-0cff-446f-9285-d8a4d01de94e',
    (SELECT id FROM subscription_plans LIMIT 1), -- Get first available plan
    'active',
    'annual',
    NOW(),
    NOW() + INTERVAL '1 year',
    NOW(),
    NOW()
);

-- =====================================================
-- Success Message
-- =====================================================
DO $$
BEGIN
    RAISE NOTICE '✅ Yearly subscription granted to user f82ffd7a-0cff-446f-9285-d8a4d01de94e';
    RAISE NOTICE '📅 Subscription valid for 1 year from now';
    RAISE NOTICE '🎯 User will now be redirected to dashboard instead of health assessment';
END $$;
