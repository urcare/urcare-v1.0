-- =====================================================
-- Subscription Management Database Setup
-- =====================================================

-- Drop existing tables if they exist (for clean setup)
DROP TABLE IF EXISTS user_subscriptions CASCADE;
DROP TABLE IF EXISTS subscription_plans CASCADE;
DROP TABLE IF EXISTS payment_transactions CASCADE;

-- =====================================================
-- Subscription Plans Table
-- =====================================================
CREATE TABLE subscription_plans (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    description TEXT,
    price_monthly DECIMAL(10,2) NOT NULL,
    price_annual DECIMAL(10,2) NOT NULL,
    original_price_monthly DECIMAL(10,2),
    original_price_annual DECIMAL(10,2),
    features JSONB DEFAULT '[]'::jsonb,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- User Subscriptions Table
-- =====================================================
CREATE TABLE user_subscriptions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    plan_id UUID NOT NULL REFERENCES subscription_plans(id),
    status TEXT NOT NULL CHECK (status IN ('active', 'cancelled', 'expired', 'pending')),
    billing_cycle TEXT NOT NULL CHECK (billing_cycle IN ('monthly', 'annual')),
    razorpay_subscription_id TEXT,
    razorpay_payment_id TEXT,
    current_period_start TIMESTAMP WITH TIME ZONE,
    current_period_end TIMESTAMP WITH TIME ZONE,
    cancelled_at TIMESTAMP WITH TIME ZONE,
    trial_ends_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- Payment Transactions Table
-- =====================================================
CREATE TABLE payment_transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    subscription_id UUID REFERENCES user_subscriptions(id) ON DELETE CASCADE,
    razorpay_payment_id TEXT UNIQUE NOT NULL,
    razorpay_order_id TEXT,
    amount DECIMAL(10,2) NOT NULL,
    currency TEXT DEFAULT 'INR',
    status TEXT NOT NULL CHECK (status IN ('pending', 'captured', 'failed', 'refunded')),
    payment_method TEXT,
    billing_cycle TEXT NOT NULL CHECK (billing_cycle IN ('monthly', 'annual')),
    plan_name TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- Enable Row Level Security
-- =====================================================
ALTER TABLE subscription_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE payment_transactions ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- RLS Policies for subscription_plans
-- =====================================================
CREATE POLICY "Anyone can view active subscription plans" ON subscription_plans
    FOR SELECT USING (is_active = true);

-- =====================================================
-- RLS Policies for user_subscriptions
-- =====================================================
CREATE POLICY "Users can view own subscriptions" ON user_subscriptions
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own subscriptions" ON user_subscriptions
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own subscriptions" ON user_subscriptions
    FOR UPDATE USING (auth.uid() = user_id);

-- =====================================================
-- RLS Policies for payment_transactions
-- =====================================================
CREATE POLICY "Users can view own payment transactions" ON payment_transactions
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own payment transactions" ON payment_transactions
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own payment transactions" ON payment_transactions
    FOR UPDATE USING (auth.uid() = user_id);

-- =====================================================
-- Grant Permissions
-- =====================================================
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT ALL ON subscription_plans TO authenticated;
GRANT ALL ON user_subscriptions TO authenticated;
GRANT ALL ON payment_transactions TO authenticated;

-- =====================================================
-- Insert Default Subscription Plans
-- =====================================================
INSERT INTO subscription_plans (name, slug, description, price_monthly, price_annual, original_price_monthly, original_price_annual, features) VALUES
(
    'UrCare Basic',
    'basic',
    'Essential health tracking and personalized insights',
    9.57,
    56.36,
    19.99,
    149.99,
    '[
        "Personalized health insights",
        "Lifestyle disorder tracking",
        "UrHealth Twin AI",
        "Blockchain-secured data",
        "Continuous updates",
        "Pre-launch access"
    ]'::jsonb
);

-- =====================================================
-- Database Functions
-- =====================================================

-- Function to create subscription
CREATE OR REPLACE FUNCTION create_subscription(
    p_user_id UUID,
    p_plan_slug TEXT,
    p_billing_cycle TEXT,
    p_razorpay_payment_id TEXT DEFAULT NULL,
    p_razorpay_subscription_id TEXT DEFAULT NULL
)
RETURNS UUID AS $$
DECLARE
    v_plan_id UUID;
    v_subscription_id UUID;
    v_period_start TIMESTAMP WITH TIME ZONE;
    v_period_end TIMESTAMP WITH TIME ZONE;
BEGIN
    -- Get plan ID
    SELECT id INTO v_plan_id FROM subscription_plans WHERE slug = p_plan_slug AND is_active = true;
    
    IF v_plan_id IS NULL THEN
        RAISE EXCEPTION 'Plan not found: %', p_plan_slug;
    END IF;
    
    -- Calculate period dates
    v_period_start := NOW();
    IF p_billing_cycle = 'monthly' THEN
        v_period_end := v_period_start + INTERVAL '1 month';
    ELSE
        v_period_end := v_period_start + INTERVAL '1 year';
    END IF;
    
    -- Create subscription
    INSERT INTO user_subscriptions (
        user_id, plan_id, status, billing_cycle, 
        razorpay_payment_id, razorpay_subscription_id,
        current_period_start, current_period_end
    ) VALUES (
        p_user_id, v_plan_id, 'active', p_billing_cycle,
        p_razorpay_payment_id, p_razorpay_subscription_id,
        v_period_start, v_period_end
    ) RETURNING id INTO v_subscription_id;
    
    RETURN v_subscription_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get user's active subscription
CREATE OR REPLACE FUNCTION get_user_subscription(p_user_id UUID)
RETURNS TABLE (
    subscription_id UUID,
    plan_name TEXT,
    plan_slug TEXT,
    status TEXT,
    billing_cycle TEXT,
    current_period_end TIMESTAMP WITH TIME ZONE,
    is_active BOOLEAN
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        us.id as subscription_id,
        sp.name as plan_name,
        sp.slug as plan_slug,
        us.status,
        us.billing_cycle,
        us.current_period_end,
        (us.status = 'active' AND us.current_period_end > NOW()) as is_active
    FROM user_subscriptions us
    JOIN subscription_plans sp ON us.plan_id = sp.id
    WHERE us.user_id = p_user_id
    ORDER BY us.created_at DESC
    LIMIT 1;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to record payment transaction
CREATE OR REPLACE FUNCTION record_payment(
    p_user_id UUID,
    p_razorpay_payment_id TEXT,
    p_amount DECIMAL(10,2),
    p_billing_cycle TEXT,
    p_plan_name TEXT,
    p_status TEXT DEFAULT 'captured'
)
RETURNS UUID AS $$
DECLARE
    v_transaction_id UUID;
BEGIN
    INSERT INTO payment_transactions (
        user_id, razorpay_payment_id, amount, billing_cycle, plan_name, status
    ) VALUES (
        p_user_id, p_razorpay_payment_id, p_amount, p_billing_cycle, p_plan_name, p_status
    ) RETURNING id INTO v_transaction_id;
    
    RETURN v_transaction_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permissions
GRANT EXECUTE ON FUNCTION create_subscription(UUID, TEXT, TEXT, TEXT, TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION get_user_subscription(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION record_payment(UUID, TEXT, DECIMAL, TEXT, TEXT, TEXT) TO authenticated;

-- =====================================================
-- Success Message
-- =====================================================
DO $$
BEGIN
    RAISE NOTICE '✅ UrCare Subscription Database Setup Complete!';
    RAISE NOTICE '📊 Created 3 tables: subscription_plans + user_subscriptions + payment_transactions';
    RAISE NOTICE '🔒 Row Level Security enabled on all tables';
    RAISE NOTICE '⚡ Razorpay integration ready';
    RAISE NOTICE '🎯 Database functions for subscription management created';
    RAISE NOTICE '💰 Default Basic plan inserted';
END $$;
