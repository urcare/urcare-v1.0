-- Complete database setup for payment processing
-- Run this in your Supabase SQL Editor

-- 1. Create subscription_plans table
CREATE TABLE IF NOT EXISTS public.subscription_plans (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    slug TEXT UNIQUE,
    description TEXT,
    price DECIMAL(10,2),
    billing_cycle TEXT CHECK (billing_cycle IN ('monthly', 'annual')),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Enable RLS on subscription_plans
ALTER TABLE public.subscription_plans ENABLE ROW LEVEL SECURITY;

-- 3. Create RLS policies for subscription_plans
DROP POLICY IF EXISTS "Anyone can view subscription plans" ON public.subscription_plans;
CREATE POLICY "Anyone can view subscription plans" ON public.subscription_plans
    FOR SELECT USING (true);

DROP POLICY IF EXISTS "Authenticated users can insert subscription plans" ON public.subscription_plans;
CREATE POLICY "Authenticated users can insert subscription plans" ON public.subscription_plans
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- 4. Grant permissions
GRANT ALL ON public.subscription_plans TO authenticated;
GRANT SELECT ON public.subscription_plans TO anon;

-- 5. Insert basic plans
INSERT INTO public.subscription_plans (name, slug, description, price, billing_cycle, is_active)
VALUES 
    ('Basic Monthly', 'basic-monthly', 'Basic monthly subscription plan', 849.00, 'monthly', true),
    ('Basic Annual', 'basic-annual', 'Basic annual subscription plan', 4999.00, 'annual', true)
ON CONFLICT (slug) DO NOTHING;

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

-- 10. Verify the setup
SELECT 
    'Subscription Plans' as table_name,
    COUNT(*) as record_count
FROM public.subscription_plans
UNION ALL
SELECT 
    'Manual UPI Payments' as table_name,
    COUNT(*) as record_count
FROM public.manual_upi_payments;

-- 11. Show the plans that were created
SELECT 
    'Created Plans' as info,
    id,
    name,
    slug,
    price,
    billing_cycle,
    is_active
FROM public.subscription_plans
ORDER BY billing_cycle, price;
