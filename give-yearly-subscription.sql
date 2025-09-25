-- Give Yearly Subscription to User ID: 6295da0b-c227-4404-875a-0f16834bfa75
-- Run this in your Supabase SQL Editor

-- First, let's get the Basic plan ID (assuming you want the Basic plan)
-- You can change this to 'family' or 'elite' if you want a different plan
WITH plan_info AS (
  SELECT id as plan_id, name, price_annual 
  FROM subscription_plans 
  WHERE slug = 'basic' 
  LIMIT 1
)

-- Insert the yearly subscription
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
  '6295da0b-c227-4404-875a-0f16834bfa75'::UUID as user_id,
  plan_id,
  'active' as status,
  'annual' as billing_cycle,
  NOW() as current_period_start,
  NOW() + INTERVAL '1 year' as current_period_end,
  false as cancel_at_period_end,
  NULL as trial_start,
  NULL as trial_end,
  'manual_admin_' || extract(epoch from now()) as stripe_subscription_id,
  'manual_customer_' || extract(epoch from now()) as stripe_customer_id,
  '{"admin_created": true, "plan_type": "yearly", "created_by": "admin"}'::JSONB as metadata
FROM plan_info;

-- Verify the subscription was created
SELECT 
  s.id as subscription_id,
  s.user_id,
  sp.name as plan_name,
  sp.slug as plan_slug,
  s.status,
  s.billing_cycle,
  s.current_period_start,
  s.current_period_end,
  s.created_at
FROM subscriptions s
JOIN subscription_plans sp ON s.plan_id = sp.id
WHERE s.user_id = '6295da0b-c227-4404-875a-0f16834bfa75'::UUID
ORDER BY s.created_at DESC
LIMIT 1;

-- Also create a trial record for additional access (optional)
-- First, delete any existing trial for this user
DELETE FROM user_trials 
WHERE user_id = '6295da0b-c227-4404-875a-0f16834bfa75'::UUID;

-- Then insert the new trial
INSERT INTO user_trials (
  user_id,
  trial_start,
  trial_end,
  is_active,
  claimed_at,
  expires_at
) VALUES (
  '6295da0b-c227-4404-875a-0f16834bfa75'::UUID,
  NOW(),
  NOW() + INTERVAL '1 year',
  true,
  NOW(),
  NOW() + INTERVAL '1 year'
);

-- Final verification - check if user has active subscription
SELECT 
  'Subscription Status Check' as check_type,
  CASE 
    WHEN EXISTS (
      SELECT 1 FROM subscriptions 
      WHERE user_id = '6295da0b-c227-4404-875a-0f16834bfa75'::UUID 
      AND status IN ('active', 'trialing')
      AND current_period_end > NOW()
    ) THEN 'ACTIVE - User has access to the app'
    ELSE 'INACTIVE - User does not have access'
  END as status;

-- Show all subscription details for this user
SELECT 
  'User Subscription Details' as info_type,
  s.id as subscription_id,
  sp.name as plan_name,
  s.status,
  s.billing_cycle,
  s.current_period_start,
  s.current_period_end,
  CASE 
    WHEN s.current_period_end > NOW() THEN 'VALID'
    ELSE 'EXPIRED'
  END as subscription_validity
FROM subscriptions s
JOIN subscription_plans sp ON s.plan_id = sp.id
WHERE s.user_id = '6295da0b-c227-4404-875a-0f16834bfa75'::UUID
ORDER BY s.created_at DESC;
