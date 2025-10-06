-- Create Razorpay subscriptions table
CREATE TABLE IF NOT EXISTS razorpay_subscriptions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    plan_slug VARCHAR(50) NOT NULL,
    billing_cycle VARCHAR(20) NOT NULL CHECK (billing_cycle IN ('monthly', 'yearly')),
    payment_id VARCHAR(255) NOT NULL UNIQUE,
    order_id VARCHAR(255),
    amount INTEGER NOT NULL, -- Amount in paise
    currency VARCHAR(3) NOT NULL DEFAULT 'INR',
    status VARCHAR(20) NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'expired', 'cancelled')),
    start_date TIMESTAMP WITH TIME ZONE NOT NULL,
    end_date TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create Razorpay payments table
CREATE TABLE IF NOT EXISTS razorpay_payments (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    payment_id VARCHAR(255) NOT NULL UNIQUE,
    order_id VARCHAR(255),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    amount INTEGER NOT NULL, -- Amount in paise
    currency VARCHAR(3) NOT NULL DEFAULT 'INR',
    status VARCHAR(20) NOT NULL CHECK (status IN ('captured', 'failed', 'pending')),
    plan_slug VARCHAR(50) NOT NULL,
    billing_cycle VARCHAR(20) NOT NULL CHECK (billing_cycle IN ('monthly', 'yearly')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_razorpay_subscriptions_user_id ON razorpay_subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_razorpay_subscriptions_status ON razorpay_subscriptions(status);
CREATE INDEX IF NOT EXISTS idx_razorpay_subscriptions_end_date ON razorpay_subscriptions(end_date);
CREATE INDEX IF NOT EXISTS idx_razorpay_payments_user_id ON razorpay_payments(user_id);
CREATE INDEX IF NOT EXISTS idx_razorpay_payments_payment_id ON razorpay_payments(payment_id);

-- Create function to check if user has active Razorpay subscription
CREATE OR REPLACE FUNCTION has_active_razorpay_subscription(user_uuid UUID)
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM razorpay_subscriptions 
        WHERE user_id = user_uuid 
        AND status = 'active' 
        AND end_date > NOW()
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to get user's active Razorpay subscription
CREATE OR REPLACE FUNCTION get_user_razorpay_subscription(user_uuid UUID)
RETURNS TABLE (
    id UUID,
    user_id UUID,
    plan_slug VARCHAR,
    billing_cycle VARCHAR,
    payment_id VARCHAR,
    order_id VARCHAR,
    amount INTEGER,
    currency VARCHAR,
    status VARCHAR,
    start_date TIMESTAMP WITH TIME ZONE,
    end_date TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        rs.id,
        rs.user_id,
        rs.plan_slug,
        rs.billing_cycle,
        rs.payment_id,
        rs.order_id,
        rs.amount,
        rs.currency,
        rs.status,
        rs.start_date,
        rs.end_date,
        rs.created_at
    FROM razorpay_subscriptions rs
    WHERE rs.user_id = user_uuid 
    AND rs.status = 'active' 
    AND rs.end_date > NOW()
    ORDER BY rs.created_at DESC
    LIMIT 1;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to update subscription status
CREATE OR REPLACE FUNCTION update_razorpay_subscription_status(
    user_uuid UUID,
    new_status VARCHAR
)
RETURNS BOOLEAN AS $$
BEGIN
    UPDATE razorpay_subscriptions 
    SET 
        status = new_status,
        updated_at = NOW()
    WHERE user_id = user_uuid 
    AND status = 'active';
    
    RETURN FOUND;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Enable Row Level Security
ALTER TABLE razorpay_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE razorpay_payments ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view their own Razorpay subscriptions" ON razorpay_subscriptions
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own Razorpay payments" ON razorpay_payments
    FOR SELECT USING (auth.uid() = user_id);

-- Allow service role to insert/update (for webhooks)
CREATE POLICY "Service role can manage Razorpay subscriptions" ON razorpay_subscriptions
    FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Service role can manage Razorpay payments" ON razorpay_payments
    FOR ALL USING (auth.role() = 'service_role');

-- Create trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_razorpay_subscriptions_updated_at
    BEFORE UPDATE ON razorpay_subscriptions
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
