-- Grant Annual Subscription for Specific User
-- User ID: 52aa4c14-f4db-4ab9-b538-75a0be9e0661
-- Plan ID: 345e51d4-31d7-4619-bcb3-5d441f1e636b

-- Insert annual subscription for the user
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
    gen_random_uuid(),
    '52aa4c14-f4db-4ab9-b538-75a0be9e0661',
    '345e51d4-31d7-4619-bcb3-5d441f1e636b',
    'active',
    'annual',
    null,
    null,
    NOW(),
    NOW() + INTERVAL '1 year',
    null,
    null,
    NOW(),
    NOW()
);

-- Option 2: If you need to create a subscription plan first, use this:
-- Uncomment and modify the plan details as needed

/*
-- Create an annual subscription plan first (if it doesn't exist)
INSERT INTO public.subscription_plans (
    id,
    name,
    description,
    price,
    billing_cycle,
    features,
    is_active,
    created_at,
    updated_at
) VALUES (
    gen_random_uuid(),
    'Annual Premium Plan',
    'Full access to all features for 1 year',
    999.00, -- Adjust price as needed
    'annual',
    '["unlimited_protocols", "priority_support", "advanced_analytics"]'::jsonb,
    true,
    NOW(),
    NOW()
) ON CONFLICT DO NOTHING;

-- Then grant subscriptions using the plan ID
-- You'll need to get the plan ID from the subscription_plans table
*/

-- Option 3: If you want to update existing subscriptions to annual
-- Uncomment this if the users already have subscriptions that need to be updated

/*
UPDATE public.user_subscriptions 
SET 
    billing_cycle = 'annual',
    status = 'active',
    current_period_start = NOW(),
    current_period_end = NOW() + INTERVAL '1 year',
    updated_at = NOW()
WHERE user_id IN (
    '95b765d4-b977-4ff1-a99a-adbb85c8984d'::uuid,
    '5bb55e1a-e7ff-43d9-8e46-003fa7fc6405'::uuid
);
*/

-- Verify the subscriptions were created
SELECT 
    us.id,
    us.user_id,
    us.plan_id,
    us.status,
    us.billing_cycle,
    us.current_period_start,
    us.current_period_end,
    us.created_at
FROM public.user_subscriptions us
WHERE us.user_id IN (
    '95b765d4-b977-4ff1-a99a-adbb85c8984d'::uuid,
    '5bb55e1a-e7ff-43d9-8e46-003fa7fc6405'::uuid
)
ORDER BY us.created_at DESC;
