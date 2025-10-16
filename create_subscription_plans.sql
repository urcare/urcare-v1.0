-- Create subscription_plans table if it doesn't exist
-- This ensures the table has the right structure for payment processing

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

-- Enable RLS
ALTER TABLE public.subscription_plans ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
DROP POLICY IF EXISTS "Anyone can view subscription plans" ON public.subscription_plans;
CREATE POLICY "Anyone can view subscription plans" ON public.subscription_plans
    FOR SELECT USING (true);

DROP POLICY IF EXISTS "Authenticated users can insert subscription plans" ON public.subscription_plans;
CREATE POLICY "Authenticated users can insert subscription plans" ON public.subscription_plans
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Grant permissions
GRANT ALL ON public.subscription_plans TO authenticated;
GRANT SELECT ON public.subscription_plans TO anon;

-- Insert a basic plan if none exists
INSERT INTO public.subscription_plans (name, slug, description, price, billing_cycle, is_active)
VALUES 
    ('Basic Monthly', 'basic-monthly', 'Basic monthly subscription plan', 849.00, 'monthly', true),
    ('Basic Annual', 'basic-annual', 'Basic annual subscription plan', 4999.00, 'annual', true)
ON CONFLICT (slug) DO NOTHING;

-- Verify the setup
SELECT 
    'Subscription Plans Table' as info,
    id,
    name,
    slug,
    price,
    billing_cycle,
    is_active
FROM public.subscription_plans
ORDER BY billing_cycle, price;



