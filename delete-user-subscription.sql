-- Delete subscription for user: 181a558e-2ddd-4321-b863-ac35cbcc3e59
-- Run this in Supabase SQL Editor

-- First, let's see what subscriptions exist for this user
SELECT 
  s.id,
  s.user_id,
  s.status,
  s.billing_cycle,
  s.current_period_start,
  s.current_period_end,
  sp.name as plan_name
FROM subscriptions s
LEFT JOIN subscription_plans sp ON s.plan_id = sp.id
WHERE s.user_id = '181a558e-2ddd-4321-b863-ac35cbcc3e59';

-- Delete all subscriptions for this user
DELETE FROM subscriptions 
WHERE user_id = '181a558e-2ddd-4321-b863-ac35cbcc3e59';

-- Also delete any payment records for this user
DELETE FROM payments 
WHERE user_id = '181a558e-2ddd-4321-b863-ac35cbcc3e59';

-- Verify deletion
SELECT 
  'Subscriptions deleted' as status,
  COUNT(*) as remaining_subscriptions
FROM subscriptions 
WHERE user_id = '181a558e-2ddd-4321-b863-ac35cbcc3e59';

SELECT 
  'Payments deleted' as status,
  COUNT(*) as remaining_payments
FROM payments 
WHERE user_id = '181a558e-2ddd-4321-b863-ac35cbcc3e59';
