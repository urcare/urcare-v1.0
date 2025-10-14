-- Check the actual structure of subscription_plans table
-- This will help us understand what columns exist

-- Show the current table structure
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

-- Show existing data to understand the current structure
SELECT 
    'Existing Plans' as info,
    *
FROM public.subscription_plans
ORDER BY created_at;
