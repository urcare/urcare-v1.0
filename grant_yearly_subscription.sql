-- Simple SQL Script to Grant Yearly Subscription (4999) to User
-- User ID: 01d2e32a-07ac-415b-bee2-30fdfdcc2b85

-- 1. Create subscription_plans table if it doesn't exist
CREATE TABLE IF NOT EXISTS subscription_plans (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    description TEXT,
    price_monthly DECIMAL(10,2) NOT NULL DEFAULT 0,
    price_annual DECIMAL(10,2) NOT NULL DEFAULT 0,
    price_first_time_monthly DECIMAL(10,2),
    price_first_time_annual DECIMAL(10,2),
    features JSONB DEFAULT '[]',
    max_users INTEGER DEFAULT 1,
    max_storage_gb INTEGER DEFAULT 100,
    is_active BOOLEAN DEFAULT true,
    is_popular BOOLEAN DEFAULT false,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Create subscriptions table if it doesn't exist
CREATE TABLE IF NOT EXISTS subscriptions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    plan_id UUID NOT NULL REFERENCES subscription_plans(id) ON DELETE CASCADE,
    status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'canceled', 'past_due', 'unpaid', 'trialing')),
    billing_cycle TEXT NOT NULL CHECK (billing_cycle IN ('monthly', 'annual')),
    current_period_start TIMESTAMP WITH TIME ZONE NOT NULL,
    current_period_end TIMESTAMP WITH TIME ZONE NOT NULL,
    cancel_at_period_end BOOLEAN DEFAULT false,
    canceled_at TIMESTAMP WITH TIME ZONE,
    trial_start TIMESTAMP WITH TIME ZONE,
    trial_end TIMESTAMP WITH TIME ZONE,
    stripe_subscription_id TEXT,
    stripe_customer_id TEXT,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Create subscription_invoices table if it doesn't exist
CREATE TABLE IF NOT EXISTS subscription_invoices (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    subscription_id UUID NOT NULL REFERENCES subscriptions(id) ON DELETE CASCADE,
    amount DECIMAL(10,2) NOT NULL,
    currency TEXT DEFAULT 'INR',
    status TEXT NOT NULL DEFAULT 'paid' CHECK (status IN ('pending', 'paid', 'failed', 'canceled')),
    stripe_invoice_id TEXT,
    due_date TIMESTAMP WITH TIME ZONE,
    paid_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Create indexes
CREATE INDEX IF NOT EXISTS idx_subscription_plans_slug ON subscription_plans(slug);
CREATE INDEX IF NOT EXISTS idx_subscriptions_user_id ON subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_status ON subscriptions(status);

-- 5. Enable RLS
ALTER TABLE subscription_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscription_invoices ENABLE ROW LEVEL SECURITY;

-- 6. Create basic RLS policies
DROP POLICY IF EXISTS "Anyone can view subscription plans" ON subscription_plans;
CREATE POLICY "Anyone can view subscription plans" ON subscription_plans FOR SELECT USING (true);

DROP POLICY IF EXISTS "Users can view their own subscriptions" ON subscriptions;
CREATE POLICY "Users can view their own subscriptions" ON subscriptions FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert their own subscriptions" ON subscriptions;
CREATE POLICY "Users can insert their own subscriptions" ON subscriptions FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can view their own invoices" ON subscription_invoices;
CREATE POLICY "Users can view their own invoices" ON subscription_invoices FOR SELECT USING (
    EXISTS (SELECT 1 FROM subscriptions WHERE subscriptions.id = subscription_invoices.subscription_id AND subscriptions.user_id = auth.uid())
);

-- 7. Insert or update the yearly plan
INSERT INTO subscription_plans (
    name,
    slug,
    description,
    price_monthly,
    price_annual,
    features,
    max_users,
    max_storage_gb,
    is_active,
    is_popular,
    sort_order
) VALUES (
    'Premium Yearly Plan',
    'premium-yearly-4999',
    'Premium yearly subscription with full access to all features',
    0,
    4999.00,
    '["ai_consultations", "health_reports", "meal_plans", "workout_plans", "progress_tracking", "health_assessments", "personalized_recommendations", "unlimited_usage"]'::jsonb,
    1,
    100,
    true,
    true,
    1
) ON CONFLICT (slug) DO UPDATE SET
    price_annual = 4999.00,
    updated_at = NOW();

-- 8. Cancel any existing active subscription for this user
UPDATE subscriptions 
SET 
    status = 'canceled',
    canceled_at = NOW(),
    updated_at = NOW()
WHERE user_id = '01d2e32a-07ac-415b-bee2-30fdfdcc2b85' 
AND status IN ('active', 'trialing');

-- 9. Create new yearly subscription
INSERT INTO subscriptions (
    user_id,
    plan_id,
    status,
    billing_cycle,
    current_period_start,
    current_period_end,
    cancel_at_period_end,
    metadata
) VALUES (
    '01d2e32a-07ac-415b-bee2-30fdfdcc2b85',
    (SELECT id FROM subscription_plans WHERE slug = 'premium-yearly-4999'),
    'active',
    'annual',
    NOW(),
    NOW() + INTERVAL '1 year',
    false,
    jsonb_build_object(
        'granted_manually', true,
        'granted_at', NOW(),
        'price', 4999.00,
        'currency', 'INR'
    )
);

-- 10. Create invoice record
INSERT INTO subscription_invoices (
    subscription_id,
    amount,
    currency,
    status,
    paid_at,
    metadata
) VALUES (
    (SELECT id FROM subscriptions WHERE user_id = '01d2e32a-07ac-415b-bee2-30fdfdcc2b85' ORDER BY created_at DESC LIMIT 1),
    4999.00,
    'INR',
    'paid',
    NOW(),
    jsonb_build_object(
        'manual_grant', true,
        'granted_at', NOW()
    )
);

-- 11. Verify the subscription was created
SELECT 
    s.id as subscription_id,
    s.user_id,
    sp.name as plan_name,
    sp.slug as plan_slug,
    s.status,
    s.billing_cycle,
    s.current_period_start,
    s.current_period_end,
    s.created_at,
    si.amount as invoice_amount,
    si.currency as invoice_currency,
    si.status as invoice_status
FROM subscriptions s
JOIN subscription_plans sp ON s.plan_id = sp.id
LEFT JOIN subscription_invoices si ON s.id = si.subscription_id
WHERE s.user_id = '01d2e32a-07ac-415b-bee2-30fdfdcc2b85'
ORDER BY s.created_at DESC;