-- Create unified subscriptions table
-- Merges: subscriptions, razorpay_subscriptions

CREATE TABLE IF NOT EXISTS subscriptions_unified (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    plan_id UUID NOT NULL REFERENCES subscription_plans(id) ON DELETE CASCADE,
    
    -- Plan information
    plan_slug TEXT NOT NULL,
    
    -- Subscription status and billing
    status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'trialing', 'past_due', 'canceled', 'unpaid', 'incomplete', 'incomplete_expired')),
    billing_cycle TEXT NOT NULL CHECK (billing_cycle IN ('monthly', 'yearly', 'weekly')),
    amount NUMERIC(10,2) NOT NULL,
    currency TEXT NOT NULL DEFAULT 'INR',
    
    -- Payment provider information
    payment_provider TEXT NOT NULL CHECK (payment_provider IN ('razorpay', 'phonepe', 'stripe', 'manual')),
    payment_method TEXT,
    
    -- Subscription periods
    current_period_start TIMESTAMP WITH TIME ZONE NOT NULL,
    current_period_end TIMESTAMP WITH TIME ZONE NOT NULL,
    trial_start TIMESTAMP WITH TIME ZONE,
    trial_end TIMESTAMP WITH TIME ZONE,
    
    -- Cancellation
    cancel_at_period_end BOOLEAN DEFAULT false,
    canceled_at TIMESTAMP WITH TIME ZONE,
    
    -- Provider-specific IDs
    provider_subscription_id TEXT,
    provider_customer_id TEXT,
    provider_order_id TEXT,
    
    -- Metadata and additional data
    metadata JSONB DEFAULT '{}',
    stripe_customer_id TEXT,
    phonepe_subscription_id TEXT,
    phonepe_customer_id TEXT,
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_subscriptions_unified_user_id ON subscriptions_unified(user_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_unified_plan_id ON subscriptions_unified(plan_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_unified_status ON subscriptions_unified(status);
CREATE INDEX IF NOT EXISTS idx_subscriptions_unified_payment_provider ON subscriptions_unified(payment_provider);
CREATE INDEX IF NOT EXISTS idx_subscriptions_unified_current_period_end ON subscriptions_unified(current_period_end);
CREATE INDEX IF NOT EXISTS idx_subscriptions_unified_provider_subscription_id ON subscriptions_unified(provider_subscription_id);

-- Enable Row Level Security
ALTER TABLE subscriptions_unified ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view their own subscriptions" ON subscriptions_unified
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own subscriptions" ON subscriptions_unified
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own subscriptions" ON subscriptions_unified
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own subscriptions" ON subscriptions_unified
    FOR DELETE USING (auth.uid() = user_id);

-- Create function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_subscriptions_unified_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for updated_at
CREATE TRIGGER trigger_update_subscriptions_unified_updated_at
    BEFORE UPDATE ON subscriptions_unified
    FOR EACH ROW
    EXECUTE FUNCTION update_subscriptions_unified_updated_at();

-- Create function to ensure only one active subscription per user
CREATE OR REPLACE FUNCTION ensure_single_active_subscription()
RETURNS TRIGGER AS $$
BEGIN
    -- If this subscription is being set as active, cancel all others for this user
    IF NEW.status = 'active' THEN
        UPDATE subscriptions_unified 
        SET status = 'canceled', canceled_at = NOW()
        WHERE user_id = NEW.user_id 
        AND id != NEW.id
        AND status IN ('active', 'trialing');
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to ensure single active subscription
CREATE TRIGGER trigger_ensure_single_active_subscription
    BEFORE INSERT OR UPDATE ON subscriptions_unified
    FOR EACH ROW
    EXECUTE FUNCTION ensure_single_active_subscription();

-- Create function to check if subscription is active
CREATE OR REPLACE FUNCTION is_subscription_active(subscription_row subscriptions_unified)
RETURNS BOOLEAN AS $$
BEGIN
    RETURN subscription_row.status = 'active' 
           AND subscription_row.current_period_end > NOW()
           AND (subscription_row.canceled_at IS NULL OR subscription_row.cancel_at_period_end = true);
END;
$$ LANGUAGE plpgsql;
