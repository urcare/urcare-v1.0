-- Create yearly subscription for user 17582369-c223-4773-bba1-e5d88912c3d0
-- Using the same pattern as existing subscriptions

INSERT INTO "public"."user_subscriptions" (
    "id", 
    "user_id", 
    "plan_id", 
    "status", 
    "billing_cycle", 
    "razorpay_subscription_id", 
    "razorpay_payment_id", 
    "current_period_start", 
    "current_period_end", 
    "cancelled_at", 
    "trial_ends_at", 
    "created_at", 
    "updated_at"
) VALUES (
    gen_random_uuid(), -- Generate new UUID for subscription ID
    '17582369-c223-4773-bba1-e5d88912c3d0', -- Your specified user ID
    '345e51d4-31d7-4619-bcb3-5d441f1e636b', -- Same plan ID as other subscriptions
    'active', -- Active status
    'annual', -- Annual billing cycle
    null, -- No Razorpay subscription ID yet
    null, -- No Razorpay payment ID yet
    NOW(), -- Current period start (now)
    NOW() + INTERVAL '1 year', -- Current period end (1 year from now)
    null, -- Not cancelled
    null, -- No trial
    NOW(), -- Created at
    NOW() -- Updated at
);

-- Verify the subscription was created
SELECT 
    us.id,
    us.user_id,
    us.status,
    us.billing_cycle,
    us.current_period_start,
    us.current_period_end,
    us.created_at
FROM public.user_subscriptions us
WHERE us.user_id = '17582369-c223-4773-bba1-e5d88912c3d0'
ORDER BY us.created_at DESC
LIMIT 1;
