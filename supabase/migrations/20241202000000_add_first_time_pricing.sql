-- Add first-time pricing fields to subscription_plans table
ALTER TABLE subscription_plans 
ADD COLUMN IF NOT EXISTS price_first_time_monthly DECIMAL(10,2) DEFAULT NULL,
ADD COLUMN IF NOT EXISTS price_first_time_annual DECIMAL(10,2) DEFAULT NULL;

-- Update existing plans with first-time pricing
UPDATE subscription_plans 
SET 
  price_first_time_monthly = 10.00,
  price_first_time_annual = 99.99
WHERE slug = 'basic';

UPDATE subscription_plans 
SET 
  price_first_time_monthly = 15.00,
  price_first_time_annual = 199.99
WHERE slug = 'family';

UPDATE subscription_plans 
SET 
  price_first_time_monthly = 20.00,
  price_first_time_annual = 399.99
WHERE slug = 'elite';

-- Add RLS policy for first-time pricing fields
ALTER TABLE subscription_plans ENABLE ROW LEVEL SECURITY;

-- Allow authenticated users to read subscription plans
CREATE POLICY "Allow authenticated users to read subscription plans" ON subscription_plans
  FOR SELECT USING (auth.role() = 'authenticated'); 