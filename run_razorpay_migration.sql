-- Create Razorpay subscription and payment tables
-- This migration creates the missing razorpay_subscriptions and razorpay_payments tables

-- Create razorpay_subscriptions table
CREATE TABLE IF NOT EXISTS razorpay_subscriptions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  plan_slug TEXT NOT NULL,
  billing_cycle TEXT NOT NULL CHECK (billing_cycle IN ('monthly', 'yearly')),
  payment_id TEXT NOT NULL,
  order_id TEXT,
  amount DECIMAL(10,2) NOT NULL,
  currency TEXT NOT NULL DEFAULT 'INR',
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'expired', 'cancelled')),
  start_date TIMESTAMPTZ NOT NULL,
  end_date TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create razorpay_payments table
CREATE TABLE IF NOT EXISTS razorpay_payments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  payment_id TEXT NOT NULL UNIQUE,
  order_id TEXT,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  amount DECIMAL(10,2) NOT NULL,
  currency TEXT NOT NULL DEFAULT 'INR',
  status TEXT NOT NULL CHECK (status IN ('captured', 'failed', 'pending')),
  plan_slug TEXT NOT NULL,
  billing_cycle TEXT NOT NULL CHECK (billing_cycle IN ('monthly', 'yearly')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_razorpay_subscriptions_user_id ON razorpay_subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_razorpay_subscriptions_status ON razorpay_subscriptions(status);
CREATE INDEX IF NOT EXISTS idx_razorpay_subscriptions_end_date ON razorpay_subscriptions(end_date);
CREATE INDEX IF NOT EXISTS idx_razorpay_subscriptions_user_status_end ON razorpay_subscriptions(user_id, status, end_date);

CREATE INDEX IF NOT EXISTS idx_razorpay_payments_user_id ON razorpay_payments(user_id);
CREATE INDEX IF NOT EXISTS idx_razorpay_payments_payment_id ON razorpay_payments(payment_id);
CREATE INDEX IF NOT EXISTS idx_razorpay_payments_status ON razorpay_payments(status);

-- Add comments for documentation
COMMENT ON TABLE razorpay_subscriptions IS 'Stores Razorpay subscription data for users';
COMMENT ON TABLE razorpay_payments IS 'Stores Razorpay payment records';

COMMENT ON COLUMN razorpay_subscriptions.user_id IS 'Reference to the user who owns this subscription';
COMMENT ON COLUMN razorpay_subscriptions.plan_slug IS 'The plan identifier (e.g., basic, premium, pro)';
COMMENT ON COLUMN razorpay_subscriptions.billing_cycle IS 'Billing frequency (monthly or yearly)';
COMMENT ON COLUMN razorpay_subscriptions.payment_id IS 'Razorpay payment ID';
COMMENT ON COLUMN razorpay_subscriptions.order_id IS 'Razorpay order ID (optional)';
COMMENT ON COLUMN razorpay_subscriptions.amount IS 'Subscription amount in the specified currency';
COMMENT ON COLUMN razorpay_subscriptions.currency IS 'Currency code (default: INR)';
COMMENT ON COLUMN razorpay_subscriptions.status IS 'Subscription status (active, expired, cancelled)';
COMMENT ON COLUMN razorpay_subscriptions.start_date IS 'Subscription start date';
COMMENT ON COLUMN razorpay_subscriptions.end_date IS 'Subscription end date';

COMMENT ON COLUMN razorpay_payments.user_id IS 'Reference to the user who made this payment';
COMMENT ON COLUMN razorpay_payments.payment_id IS 'Razorpay payment ID (unique)';
COMMENT ON COLUMN razorpay_payments.order_id IS 'Razorpay order ID (optional)';
COMMENT ON COLUMN razorpay_payments.amount IS 'Payment amount in the specified currency';
COMMENT ON COLUMN razorpay_payments.currency IS 'Currency code (default: INR)';
COMMENT ON COLUMN razorpay_payments.status IS 'Payment status (captured, failed, pending)';
COMMENT ON COLUMN razorpay_payments.plan_slug IS 'The plan identifier for this payment';
COMMENT ON COLUMN razorpay_payments.billing_cycle IS 'Billing frequency for this payment';

-- Enable Row Level Security (RLS)
ALTER TABLE razorpay_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE razorpay_payments ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view their own subscriptions" ON razorpay_subscriptions
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own payments" ON razorpay_payments
  FOR SELECT USING (auth.uid() = user_id);

-- Grant necessary permissions
GRANT SELECT, INSERT, UPDATE ON razorpay_subscriptions TO anon, authenticated;
GRANT SELECT, INSERT, UPDATE ON razorpay_payments TO anon, authenticated;

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for razorpay_subscriptions
CREATE TRIGGER update_razorpay_subscriptions_updated_at
  BEFORE UPDATE ON razorpay_subscriptions
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
