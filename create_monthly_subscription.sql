-- Create monthly subscription for user 547f0f85-f3ce-48e2-8c11-157982298f54
-- This SQL script will insert a monthly subscription record

-- First, let's check what columns exist in subscription_plans table
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'subscription_plans' 
AND table_schema = 'public';

-- Check if there are any existing subscription plans
SELECT id, name, billing_cycle 
FROM public.subscription_plans 
WHERE billing_cycle = 'monthly' 
LIMIT 1;

-- If no monthly plan exists, create one first (using only the columns that exist)
INSERT INTO public.subscription_plans (
    id,
    name,
    description,
    billing_cycle,
    features,
    is_active,
    created_at,
    updated_at
) VALUES (
    gen_random_uuid(),
    'Monthly Premium Plan',
    'Monthly subscription with full access to all features',
    'monthly',
    '["Unlimited health assessments", "Personalized meal plans", "Workout routines", "Progress tracking"]',
    true,
    NOW(),
    NOW()
) ON CONFLICT DO NOTHING;

-- Get the plan ID for monthly plan
WITH monthly_plan AS (
    SELECT id FROM public.subscription_plans 
    WHERE billing_cycle = 'monthly' 
    ORDER BY created_at DESC 
    LIMIT 1
)
-- Insert monthly subscription using the correct table structure
INSERT INTO public.user_subscriptions (
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
) 
SELECT 
    gen_random_uuid(), -- Generate a new UUID for subscription ID
    '547f0f85-f3ce-48e2-8c11-157982298f54', -- User ID
    mp.id, -- Plan ID from the monthly plan
    'active', -- Status
    'monthly', -- Billing cycle
    NULL, -- No Razorpay subscription ID yet
    NULL, -- No Razorpay payment ID yet
    NOW(), -- Current period start (now)
    NOW() + INTERVAL '1 month', -- Current period end (1 month from now)
    NULL, -- Not cancelled
    NULL, -- No trial
    NOW(), -- Created at
    NOW() -- Updated at
FROM monthly_plan mp;

-- Verify the subscription was created
SELECT 
    us.id,
    us.user_id,
    sp.name as plan_name,
    us.status,
    us.billing_cycle,
    us.current_period_start,
    us.current_period_end,
    us.created_at
FROM public.user_subscriptions us
JOIN public.subscription_plans sp ON us.plan_id = sp.id
WHERE us.user_id = '547f0f85-f3ce-48e2-8c11-157982298f54'
ORDER BY us.created_at DESC
LIMIT 1;
