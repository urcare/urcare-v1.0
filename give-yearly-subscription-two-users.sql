-- Give Yearly Subscription to Two Users
-- User IDs: 21760e43-192e-4632-ae9e-4891ca3acb1d and edbd5421-929e-4984-b05a-83daa78ba9c9
-- Run this in your Supabase SQL Editor

-- First, let's get the Basic plan ID (assuming you want the Basic plan)
-- You can change this to 'family' or 'elite' if you want a different plan
WITH plan_info AS (
  SELECT id as plan_id, name, price_annual 
  FROM subscription_plans 
  WHERE slug = 'basic' 
  LIMIT 1
)

-- Insert yearly subscriptions for both users
INSERT INTO subscriptions (
  user_id,
  plan_id,
  status,
  billing_cycle,
  current_period_start,
  current_period_end,
  cancel_at_period_end,
  trial_start,
  trial_end,
  stripe_subscription_id,
  stripe_customer_id,
  metadata
) 
SELECT 
  user_id,
  plan_id,
  'active' as status,
  'annual' as billing_cycle,
  NOW() as current_period_start,
  NOW() + INTERVAL '1 year' as current_period_end,
  false as cancel_at_period_end,
  NULL as trial_start,
  NULL as trial_end,
  'manual_admin_' || user_id || '_' || extract(epoch from now()) as stripe_subscription_id,
  'manual_customer_' || user_id || '_' || extract(epoch from now()) as stripe_customer_id,
  '{"admin_created": true, "plan_type": "yearly", "created_by": "admin"}'::JSONB as metadata
FROM plan_info
CROSS JOIN (
  VALUES 
    ('21760e43-192e-4632-ae9e-4891ca3acb1d'::UUID),
    ('edbd5421-929e-4984-b05a-83daa78ba9c9'::UUID)
) AS user_ids(user_id);

-- Verify the subscriptions were created
SELECT 
  s.id as subscription_id,
  s.user_id,
  up.full_name,
  sp.name as plan_name,
  sp.slug as plan_slug,
  s.status,
  s.billing_cycle,
  s.current_period_start,
  s.current_period_end,
  s.created_at
FROM subscriptions s
JOIN subscription_plans sp ON s.plan_id = sp.id
LEFT JOIN user_profiles up ON s.user_id = up.id
WHERE s.user_id IN (
  '21760e43-192e-4632-ae9e-4891ca3acb1d'::UUID,
  'edbd5421-929e-4984-b05a-83daa78ba9c9'::UUID
)
ORDER BY s.created_at DESC;

-- Optional: Create trial records for additional access (if user_trials table exists)
-- First, delete any existing trials for these users
DELETE FROM user_trials 
WHERE user_id IN (
  '21760e43-192e-4632-ae9e-4891ca3acb1d'::UUID,
  'edbd5421-929e-4984-b05a-83daa78ba9c9'::UUID
);

-- Then insert new trials (if user_trials table exists)
-- Uncomment the following if you have a user_trials table:
/*
INSERT INTO user_trials (
  user_id,
  trial_start,
  trial_end,
  is_active,
  created_at
) VALUES 
(
  '21760e43-192e-4632-ae9e-4891ca3acb1d'::UUID,
  NOW(),
  NOW() + INTERVAL '1 year',
  true,
  NOW()
),
(
  'edbd5421-929e-4984-b05a-83daa78ba9c9'::UUID,
  NOW(),
  NOW() + INTERVAL '1 year',
  true,
  NOW()
);
*/
