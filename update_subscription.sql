-- Update subscription record for user
-- Original subscription ID: ed8478f3-b397-4c2d-abb2-adfd4f2d8c51
-- Original user ID: 17582369-c223-4773-bba1-e5d88912c3d0
-- New user ID: 547f0f85-f3ce-48e2-8c11-157982298f54

-- First, let's check the current subscription
SELECT 
    us.id,
    us.user_id,
    us.plan_id,
    us.status,
    us.billing_cycle,
    us.current_period_start,
    us.current_period_end,
    us.created_at,
    us.updated_at
FROM public.user_subscriptions us
WHERE us.id = 'ed8478f3-b397-4c2d-abb2-adfd4f2d8c51';

-- Update the subscription to use the new user ID
UPDATE public.user_subscriptions 
SET 
    user_id = '547f0f85-f3ce-48e2-8c11-157982298f54',
    updated_at = NOW()
WHERE id = 'ed8478f3-b397-4c2d-abb2-adfd4f2d8c51';

-- Verify the update was successful
SELECT 
    us.id,
    us.user_id,
    us.plan_id,
    us.status,
    us.billing_cycle,
    us.current_period_start,
    us.current_period_end,
    us.created_at,
    us.updated_at
FROM public.user_subscriptions us
WHERE us.id = 'ed8478f3-b397-4c2d-abb2-adfd4f2d8c51';

-- Also check if there are any other subscriptions for the new user
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
WHERE us.user_id = '547f0f85-f3ce-48e2-8c11-157982298f54'
ORDER BY us.created_at DESC;
