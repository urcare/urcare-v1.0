-- Fix subscription_plans table inserts based on actual table structure
-- This script works with the existing table structure

-- First, let's see what columns actually exist
SELECT 
    'Current subscription_plans structure' as info,
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'subscription_plans' 
AND table_schema = 'public'
ORDER BY ordinal_position;

-- Insert plans using the correct column names
-- Based on the error, it seems the table has price_monthly and price_annual columns
INSERT INTO public.subscription_plans (
    name, 
    slug, 
    description, 
    price_monthly, 
    price_annual, 
    billing_cycle, 
    is_active
)
SELECT 'Basic Monthly', 'basic-monthly', 'Basic monthly subscription plan', 849.00, 4999.00, 'monthly', true
WHERE NOT EXISTS (SELECT 1 FROM public.subscription_plans WHERE slug = 'basic-monthly');

INSERT INTO public.subscription_plans (
    name, 
    slug, 
    description, 
    price_monthly, 
    price_annual, 
    billing_cycle, 
    is_active
)
SELECT 'Basic Annual', 'basic-annual', 'Basic annual subscription plan', 849.00, 4999.00, 'annual', true
WHERE NOT EXISTS (SELECT 1 FROM public.subscription_plans WHERE slug = 'basic-annual');

-- Show the inserted plans
SELECT 
    'Inserted Plans' as info,
    id,
    name,
    slug,
    price_monthly,
    price_annual,
    billing_cycle,
    is_active
FROM public.subscription_plans
WHERE slug IN ('basic-monthly', 'basic-annual')
ORDER BY created_at;
