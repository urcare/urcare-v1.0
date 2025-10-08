-- Create unified payments table
-- Merges: payments, razorpay_payments

CREATE TABLE IF NOT EXISTS payments_unified (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    subscription_id UUID REFERENCES subscriptions_unified(id) ON DELETE SET NULL,
    plan_id UUID NOT NULL REFERENCES subscription_plans(id) ON DELETE CASCADE,
    
    -- Payment amount and currency
    amount NUMERIC(10,2) NOT NULL,
    currency TEXT NOT NULL DEFAULT 'INR',
    
    -- Payment status and method
    status TEXT NOT NULL CHECK (status IN ('pending', 'processing', 'captured', 'failed', 'cancelled', 'refunded')),
    payment_method TEXT NOT NULL,
    payment_provider TEXT NOT NULL CHECK (payment_provider IN ('razorpay', 'phonepe', 'stripe', 'manual')),
    
    -- Provider-specific transaction IDs
    provider_transaction_id TEXT,
    provider_payment_id TEXT,
    provider_order_id TEXT,
    provider_merchant_transaction_id TEXT,
    
    -- Provider response data
    provider_response JSONB,
    
    -- Billing information
    billing_cycle TEXT NOT NULL CHECK (billing_cycle IN ('monthly', 'yearly', 'weekly')),
    is_first_time BOOLEAN DEFAULT false,
    
    -- Payment processing
    failure_reason TEXT,
    processed_at TIMESTAMP WITH TIME ZONE,
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_payments_unified_user_id ON payments_unified(user_id);
CREATE INDEX IF NOT EXISTS idx_payments_unified_subscription_id ON payments_unified(subscription_id);
CREATE INDEX IF NOT EXISTS idx_payments_unified_plan_id ON payments_unified(plan_id);
CREATE INDEX IF NOT EXISTS idx_payments_unified_status ON payments_unified(status);
CREATE INDEX IF NOT EXISTS idx_payments_unified_payment_provider ON payments_unified(payment_provider);
CREATE INDEX IF NOT EXISTS idx_payments_unified_provider_transaction_id ON payments_unified(provider_transaction_id);
CREATE INDEX IF NOT EXISTS idx_payments_unified_processed_at ON payments_unified(processed_at);

-- Enable Row Level Security
ALTER TABLE payments_unified ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view their own payments" ON payments_unified
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own payments" ON payments_unified
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own payments" ON payments_unified
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own payments" ON payments_unified
    FOR DELETE USING (auth.uid() = user_id);

-- Create function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_payments_unified_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for updated_at
CREATE TRIGGER trigger_update_payments_unified_updated_at
    BEFORE UPDATE ON payments_unified
    FOR EACH ROW
    EXECUTE FUNCTION update_payments_unified_updated_at();

-- Create function to automatically set processed_at when status changes to captured
CREATE OR REPLACE FUNCTION set_processed_at_on_capture()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.status = 'captured' AND OLD.status != 'captured' THEN
        NEW.processed_at = NOW();
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to set processed_at
CREATE TRIGGER trigger_set_processed_at_on_capture
    BEFORE UPDATE ON payments_unified
    FOR EACH ROW
    EXECUTE FUNCTION set_processed_at_on_capture();
