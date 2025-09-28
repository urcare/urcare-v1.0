-- Create subscription_plans table
CREATE TABLE IF NOT EXISTS subscription_plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL,
  slug VARCHAR(50) UNIQUE NOT NULL,
  description TEXT,
  price_monthly DECIMAL(10,2) NOT NULL,
  price_annual DECIMAL(10,2) NOT NULL,
  price_first_time_monthly DECIMAL(10,2),
  price_first_time_annual DECIMAL(10,2),
  features JSONB NOT NULL DEFAULT '[]',
  max_users INTEGER DEFAULT 1,
  max_storage_gb INTEGER DEFAULT 1,
  is_active BOOLEAN DEFAULT true,
  is_popular BOOLEAN DEFAULT false,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes
CREATE INDEX idx_subscription_plans_slug ON subscription_plans(slug);
CREATE INDEX idx_subscription_plans_active ON subscription_plans(is_active);
CREATE INDEX idx_subscription_plans_sort ON subscription_plans(sort_order);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_subscription_plans_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_subscription_plans_updated_at
  BEFORE UPDATE ON subscription_plans
  FOR EACH ROW
  EXECUTE FUNCTION update_subscription_plans_updated_at();

-- Insert default subscription plans
INSERT INTO subscription_plans (name, slug, description, price_monthly, price_annual, price_first_time_monthly, price_first_time_annual, features, max_users, max_storage_gb, is_popular, sort_order) VALUES
(
  'Basic',
  'basic',
  'Perfect for individuals starting their health journey',
  12.00,
  99.00,
  8.00,
  79.00,
  '["AI-powered health insights", "Personalized meal plans", "Basic health tracking", "24/7 health support", "Mobile app access"]',
  1,
  1,
  false,
  1
),
(
  'Family',
  'family',
  'Ideal for families who want to stay healthy together',
  25.00,
  199.00,
  20.00,
  159.00,
  '["Everything in Basic", "Up to 5 family members", "Family health dashboard", "Shared meal planning", "Family health reports", "Priority customer support"]',
  5,
  5,
  true,
  2
),
(
  'Elite',
  'elite',
  'Premium health management with unlimited features',
  40.00,
  399.00,
  32.00,
  319.00,
  '["Everything in Family", "Unlimited health consultations", "Advanced AI diagnostics", "Personal health coach", "Premium meal plans", "Exclusive wellness content", "VIP customer support"]',
  10,
  20,
  false,
  3
);

-- Enable RLS
ALTER TABLE subscription_plans ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Anyone can view active subscription plans" ON subscription_plans
  FOR SELECT USING (is_active = true);

CREATE POLICY "Service role can manage subscription plans" ON subscription_plans
  FOR ALL USING (auth.role() = 'service_role');
