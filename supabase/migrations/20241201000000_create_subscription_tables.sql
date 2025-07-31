-- Create subscription plans table
CREATE TABLE IF NOT EXISTS subscription_plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL,
  slug VARCHAR(50) UNIQUE NOT NULL,
  description TEXT,
  price_monthly DECIMAL(10,2) NOT NULL,
  price_annual DECIMAL(10,2) NOT NULL,
  features JSONB DEFAULT '[]',
  max_users INTEGER DEFAULT 1,
  max_storage_gb INTEGER DEFAULT 1,
  is_active BOOLEAN DEFAULT true,
  is_popular BOOLEAN DEFAULT false,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create subscriptions table
CREATE TABLE IF NOT EXISTS subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  plan_id UUID REFERENCES subscription_plans(id) ON DELETE RESTRICT,
  status VARCHAR(20) NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'canceled', 'past_due', 'unpaid', 'trialing')),
  billing_cycle VARCHAR(10) NOT NULL CHECK (billing_cycle IN ('monthly', 'annual')),
  current_period_start TIMESTAMP WITH TIME ZONE NOT NULL,
  current_period_end TIMESTAMP WITH TIME ZONE NOT NULL,
  cancel_at_period_end BOOLEAN DEFAULT false,
  canceled_at TIMESTAMP WITH TIME ZONE,
  trial_start TIMESTAMP WITH TIME ZONE,
  trial_end TIMESTAMP WITH TIME ZONE,
  stripe_subscription_id VARCHAR(255),
  stripe_customer_id VARCHAR(255),
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create subscription usage table for tracking feature usage
CREATE TABLE IF NOT EXISTS subscription_usage (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  subscription_id UUID REFERENCES subscriptions(id) ON DELETE CASCADE,
  feature_name VARCHAR(100) NOT NULL,
  usage_count INTEGER DEFAULT 0,
  usage_limit INTEGER,
  reset_date DATE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(subscription_id, feature_name, reset_date)
);

-- Create subscription invoices table
CREATE TABLE IF NOT EXISTS subscription_invoices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  subscription_id UUID REFERENCES subscriptions(id) ON DELETE CASCADE,
  amount DECIMAL(10,2) NOT NULL,
  currency VARCHAR(3) DEFAULT 'USD',
  status VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'failed', 'canceled')),
  stripe_invoice_id VARCHAR(255),
  due_date TIMESTAMP WITH TIME ZONE,
  paid_at TIMESTAMP WITH TIME ZONE,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_subscriptions_user_id ON subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_status ON subscriptions(status);
CREATE INDEX IF NOT EXISTS idx_subscriptions_period_end ON subscriptions(current_period_end);
CREATE INDEX IF NOT EXISTS idx_subscription_usage_subscription_id ON subscription_usage(subscription_id);
CREATE INDEX IF NOT EXISTS idx_subscription_usage_feature ON subscription_usage(feature_name);
CREATE INDEX IF NOT EXISTS idx_subscription_invoices_subscription_id ON subscription_invoices(subscription_id);

-- Create RLS policies
ALTER TABLE subscription_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscription_usage ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscription_invoices ENABLE ROW LEVEL SECURITY;

-- RLS Policies for subscription_plans (read-only for all authenticated users)
CREATE POLICY "subscription_plans_select_policy" ON subscription_plans
  FOR SELECT USING (auth.role() = 'authenticated');

-- RLS Policies for subscriptions (users can only see their own subscriptions)
CREATE POLICY "subscriptions_select_policy" ON subscriptions
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "subscriptions_insert_policy" ON subscriptions
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "subscriptions_update_policy" ON subscriptions
  FOR UPDATE USING (auth.uid() = user_id);

-- RLS Policies for subscription_usage
CREATE POLICY "subscription_usage_select_policy" ON subscription_usage
  FOR SELECT USING (
    auth.uid() IN (
      SELECT user_id FROM subscriptions WHERE id = subscription_usage.subscription_id
    )
  );

CREATE POLICY "subscription_usage_insert_policy" ON subscription_usage
  FOR INSERT WITH CHECK (
    auth.uid() IN (
      SELECT user_id FROM subscriptions WHERE id = subscription_usage.subscription_id
    )
  );

CREATE POLICY "subscription_usage_update_policy" ON subscription_usage
  FOR UPDATE USING (
    auth.uid() IN (
      SELECT user_id FROM subscriptions WHERE id = subscription_usage.subscription_id
    )
  );

-- RLS Policies for subscription_invoices
CREATE POLICY "subscription_invoices_select_policy" ON subscription_invoices
  FOR SELECT USING (
    auth.uid() IN (
      SELECT user_id FROM subscriptions WHERE id = subscription_invoices.subscription_id
    )
  );

-- Insert default subscription plans
INSERT INTO subscription_plans (name, slug, description, price_monthly, price_annual, features, max_users, max_storage_gb, is_popular, sort_order) VALUES
(
  'Basic',
  'basic',
  'Perfect for individuals starting their health journey',
  12.00,
  99.99,
  '[
    "AI-powered health insights",
    "Personalized meal plans", 
    "Basic health tracking",
    "24/7 health support",
    "Mobile app access"
  ]',
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
  199.99,
  '[
    "Everything in Basic",
    "Up to 5 family members",
    "Family health dashboard",
    "Shared meal planning", 
    "Family health reports",
    "Priority customer support"
  ]',
  5,
  5,
  true,
  2
),
(
  'Elite',
  'elite',
  'Premium health management for serious wellness enthusiasts',
  40.00,
  399.99,
  '[
    "Everything in Family",
    "Unlimited health consultations",
    "Advanced AI diagnostics",
    "Personal health coach",
    "Premium meal plans",
    "Exclusive wellness content",
    "VIP customer support"
  ]',
  10,
  20,
  false,
  3
);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_subscription_plans_updated_at 
  BEFORE UPDATE ON subscription_plans 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_subscriptions_updated_at 
  BEFORE UPDATE ON subscriptions 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_subscription_usage_updated_at 
  BEFORE UPDATE ON subscription_usage 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Create function to check if user has active subscription
CREATE OR REPLACE FUNCTION has_active_subscription(user_uuid UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM subscriptions 
    WHERE user_id = user_uuid 
    AND status = 'active' 
    AND current_period_end > NOW()
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to get user's current subscription
CREATE OR REPLACE FUNCTION get_user_subscription(user_uuid UUID)
RETURNS TABLE (
  subscription_id UUID,
  plan_name VARCHAR(100),
  plan_slug VARCHAR(50),
  status VARCHAR(20),
  billing_cycle VARCHAR(10),
  current_period_end TIMESTAMP WITH TIME ZONE,
  features JSONB
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    s.id,
    sp.name,
    sp.slug,
    s.status,
    s.billing_cycle,
    s.current_period_end,
    sp.features
  FROM subscriptions s
  JOIN subscription_plans sp ON s.plan_id = sp.id
  WHERE s.user_id = user_uuid 
  AND s.status = 'active'
  AND s.current_period_end > NOW()
  ORDER BY s.created_at DESC
  LIMIT 1;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER; 