-- Add annual subscription for user: 17582369-c223-4773-bba1-e5d88912c3d0
-- This will give them an active annual subscription

INSERT INTO user_subscriptions (
    id,
    user_id,
    plan_id,
    status,
    billing_cycle,
    razorpay_subscription_id,
    razorpay_payment_id,
    current_period_start,
    current_period_end,
    cancelled_at,
    trial_ends_at,
    created_at,
    updated_at
) VALUES (
    gen_random_uuid(), -- Generate a new UUID for the subscription
    '17582369-c223-4773-bba1-e5d88912c3d0', -- The user ID
    '345e51d4-31d7-4619-bcb3-5d441f1e636b', -- Annual plan ID (from your example)
    'active', -- Active status
    'annual', -- Annual billing cycle
    NULL, -- No Razorpay subscription ID
    NULL, -- No Razorpay payment ID
    NOW(), -- Current period starts now
    NOW() + INTERVAL '1 year', -- Current period ends in 1 year
    NULL, -- Not cancelled
    NULL, -- No trial
    NOW(), -- Created now
    NOW() -- Updated now
);

-- Verify the subscription was created
SELECT 
    us.id,
    us.user_id,
    us.plan_id,
    us.status,
    us.billing_cycle,
    us.current_period_start,
    us.current_period_end,
    us.created_at
FROM user_subscriptions us
WHERE us.user_id = '17582369-c223-4773-bba1-e5d88912c3d0'
ORDER BY us.created_at DESC;
