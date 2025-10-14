-- Fix existing database tables for payment processing
-- This script handles existing tables and adds missing columns

-- 1. Check if subscription_plans table exists and what columns it has
DO $$
BEGIN
    -- Add price column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'subscription_plans' 
                   AND column_name = 'price') THEN
        ALTER TABLE public.subscription_plans ADD COLUMN price DECIMAL(10,2);
    END IF;
    
    -- Add billing_cycle column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'subscription_plans' 
                   AND column_name = 'billing_cycle') THEN
        ALTER TABLE public.subscription_plans ADD COLUMN billing_cycle TEXT;
    END IF;
    
    -- Add is_active column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'subscription_plans' 
                   AND column_name = 'is_active') THEN
        ALTER TABLE public.subscription_plans ADD COLUMN is_active BOOLEAN DEFAULT true;
    END IF;
    
    -- Add description column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'subscription_plans' 
                   AND column_name = 'description') THEN
        ALTER TABLE public.subscription_plans ADD COLUMN description TEXT;
    END IF;
    
    -- Add slug column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'subscription_plans' 
                   AND column_name = 'slug') THEN
        ALTER TABLE public.subscription_plans ADD COLUMN slug TEXT UNIQUE;
    END IF;
END $$;

-- 2. Enable RLS on subscription_plans if not already enabled
ALTER TABLE public.subscription_plans ENABLE ROW LEVEL SECURITY;

-- 3. Create RLS policies for subscription_plans (drop first to avoid conflicts)
DROP POLICY IF EXISTS "Anyone can view subscription plans" ON public.subscription_plans;
CREATE POLICY "Anyone can view subscription plans" ON public.subscription_plans
    FOR SELECT USING (true);

DROP POLICY IF EXISTS "Authenticated users can insert subscription plans" ON public.subscription_plans;
CREATE POLICY "Authenticated users can insert subscription plans" ON public.subscription_plans
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- 4. Grant permissions
GRANT ALL ON public.subscription_plans TO authenticated;
GRANT SELECT ON public.subscription_plans TO anon;

-- 5. Insert basic plans (only if they don't exist)
INSERT INTO public.subscription_plans (name, slug, description, price, billing_cycle, is_active)
SELECT 'Basic Monthly', 'basic-monthly', 'Basic monthly subscription plan', 849.00, 'monthly', true
WHERE NOT EXISTS (SELECT 1 FROM public.subscription_plans WHERE slug = 'basic-monthly');

INSERT INTO public.subscription_plans (name, slug, description, price, billing_cycle, is_active)
SELECT 'Basic Annual', 'basic-annual', 'Basic annual subscription plan', 4999.00, 'annual', true
WHERE NOT EXISTS (SELECT 1 FROM public.subscription_plans WHERE slug = 'basic-annual');

-- 6. Create manual_upi_payments table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.manual_upi_payments (
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

-- 7. Enable RLS on manual_upi_payments
ALTER TABLE public.manual_upi_payments ENABLE ROW LEVEL SECURITY;

-- 8. Create RLS policies for manual_upi_payments
DROP POLICY IF EXISTS "Users can view their own manual UPI payments" ON public.manual_upi_payments;
CREATE POLICY "Users can view their own manual UPI payments" ON public.manual_upi_payments
    FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert their own manual UPI payments" ON public.manual_upi_payments;
CREATE POLICY "Users can insert their own manual UPI payments" ON public.manual_upi_payments
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- 9. Grant permissions on manual_upi_payments
GRANT ALL ON public.manual_upi_payments TO authenticated;

-- 10. Show current table structure
SELECT 
    'Current subscription_plans structure' as info,
    column_name,
    data_type,
    is_nullable
FROM information_schema.columns 
WHERE table_name = 'subscription_plans' 
AND table_schema = 'public'
ORDER BY ordinal_position;

-- 11. Show existing plans
SELECT 
    'Existing Plans' as info,
    id,
    name,
    slug,
    price,
    billing_cycle,
    is_active
FROM public.subscription_plans
ORDER BY created_at;

-- 12. Verify the setup
SELECT 
    'Subscription Plans' as table_name,
    COUNT(*) as record_count
FROM public.subscription_plans
UNION ALL
SELECT 
    'Manual UPI Payments' as table_name,
    COUNT(*) as record_count
FROM public.manual_upi_payments;
