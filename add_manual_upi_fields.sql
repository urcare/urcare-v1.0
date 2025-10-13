-- Create new table for manual UPI payments
-- This is a simple, clean approach that doesn't affect existing tables

CREATE TABLE IF NOT EXISTS manual_upi_payments (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    plan_id UUID NOT NULL REFERENCES subscription_plans(id) ON DELETE CASCADE,
    amount DECIMAL(10,2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'INR',
    billing_cycle VARCHAR(20) NOT NULL CHECK (billing_cycle IN ('monthly', 'annual')),
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'approved', 'rejected')),
    
    -- UPI payment details
    utr VARCHAR(50),
    payer_vpa VARCHAR(100),
    transaction_ref VARCHAR(100),
    screenshot_url TEXT,
    
    -- Admin approval
    approved_by UUID REFERENCES auth.users(id),
    approved_at TIMESTAMP WITH TIME ZONE,
    rejection_reason TEXT,
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_manual_upi_payments_user_id ON manual_upi_payments(user_id);
CREATE INDEX IF NOT EXISTS idx_manual_upi_payments_status ON manual_upi_payments(status);
CREATE INDEX IF NOT EXISTS idx_manual_upi_payments_created_at ON manual_upi_payments(created_at);

-- Enable Row Level Security
ALTER TABLE manual_upi_payments ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view their own manual UPI payments" ON manual_upi_payments
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own manual UPI payments" ON manual_upi_payments
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Grant permissions
GRANT SELECT, INSERT, UPDATE, DELETE ON manual_upi_payments TO authenticated;

-- Create storage bucket for payment screenshots (if storage is available)
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'buckets') THEN
    INSERT INTO storage.buckets (id, name, public)
    VALUES ('payment-screenshots', 'payment-screenshots', true)
    ON CONFLICT (id) DO NOTHING;

    -- Create RLS policy for payment screenshots (drop first to avoid conflicts)
    DROP POLICY IF EXISTS "Users can upload their own payment screenshots" ON storage.objects;
    DROP POLICY IF EXISTS "Users can view their own payment screenshots" ON storage.objects;
    
    CREATE POLICY "Users can upload their own payment screenshots" ON storage.objects
      FOR INSERT WITH CHECK (
        bucket_id = 'payment-screenshots' AND 
        auth.uid()::text = (storage.foldername(name))[1]
      );

    CREATE POLICY "Users can view their own payment screenshots" ON storage.objects
      FOR SELECT USING (
        bucket_id = 'payment-screenshots' AND 
        auth.uid()::text = (storage.foldername(name))[1]
      );
  END IF;
END $$;
