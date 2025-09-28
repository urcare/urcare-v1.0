-- Grant yearly subscriptions to specific users
-- This SQL will give annual subscriptions to the two specified users

-- First, let's get the Family plan ID (the popular plan)
-- We'll use the Family plan as it's marked as popular and has good features

-- Insert yearly subscriptions for both users
INSERT INTO subscriptions (
    user_id,
    plan_id,
    status,
    billing_cycle,
    current_period_start,
    current_period_end,
    cancel_at_period_end,
    metadata
) VALUES 
(
    '6aac8de9-a08d-43d8-8313-1d63ed14d7e9', -- Sarthak Sharma
    (SELECT id FROM subscription_plans WHERE slug = 'family' LIMIT 1),
    'active',
    'annual',
    NOW(),
    NOW() + INTERVAL '1 year',
    false,
    '{"granted_by": "admin", "grant_type": "manual", "notes": "Yearly subscription granted manually"}'
),
(
    '819678ca-1b3f-4f86-9391-b9c24f5e7d20', -- Second User
    (SELECT id FROM subscription_plans WHERE slug = 'family' LIMIT 1),
    'active',
    'annual',
    NOW(),
    NOW() + INTERVAL '1 year',
    false,
    '{"granted_by": "admin", "grant_type": "manual", "notes": "Yearly subscription granted manually"}'
);

-- Verify the subscriptions were created
SELECT 
    s.id,
    s.user_id,
    up.full_name,
    sp.name as plan_name,
    s.status,
    s.billing_cycle,
    s.current_period_start,
    s.current_period_end,
    s.created_at
FROM subscriptions s
JOIN user_profiles up ON s.user_id = up.id
JOIN subscription_plans sp ON s.plan_id = sp.id
WHERE s.user_id IN (
    '6aac8de9-a08d-43d8-8313-1d63ed14d7e9',
    '819678ca-1b3f-4f86-9391-b9c24f5e7d20'
)
ORDER BY s.created_at DESC;
