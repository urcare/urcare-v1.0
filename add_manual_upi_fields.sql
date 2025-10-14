-- Idempotent helpers for existing deployments

do $$
begin
  -- Ensure RLS is enabled
  perform 1 from pg_tables where schemaname = 'public' and tablename = 'manual_upi_payments';
  if found then
    execute 'alter table public.manual_upi_payments enable row level security';
  end if;
end $$;

-- Create policies only if missing
do $$
begin
  if not exists (
    select 1 from pg_policies 
    where schemaname = 'public' and tablename = 'manual_upi_payments' and policyname = 'Users can view their own manual UPI payments'
  ) then
    execute $$create policy "Users can view their own manual UPI payments" on public.manual_upi_payments
      for select using (auth.uid() = user_id)$$;
  end if;

  if not exists (
    select 1 from pg_policies 
    where schemaname = 'public' and tablename = 'manual_upi_payments' and policyname = 'Users can insert their own manual UPI payments'
  ) then
    execute $$create policy "Users can insert their own manual UPI payments" on public.manual_upi_payments
      for insert with check (auth.uid() = user_id)$$;
  end if;
end $$;

-- Maintain updated_at trigger idempotently
create or replace function public.update_manual_upi_payments_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists trg_update_manual_upi_payments_updated_at on public.manual_upi_payments;
create trigger trg_update_manual_upi_payments_updated_at
  before update on public.manual_upi_payments
  for each row execute function public.update_manual_upi_payments_updated_at();
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
