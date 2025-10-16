-- Add missing columns to existing subscription_plans table
-- This is a safer approach that won't conflict with existing data

-- Add price column if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'subscription_plans' 
                   AND column_name = 'price') THEN
        ALTER TABLE public.subscription_plans ADD COLUMN price DECIMAL(10,2);
        RAISE NOTICE 'Added price column to subscription_plans';
    ELSE
        RAISE NOTICE 'price column already exists in subscription_plans';
    END IF;
END $$;

-- Add billing_cycle column if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'subscription_plans' 
                   AND column_name = 'billing_cycle') THEN
        ALTER TABLE public.subscription_plans ADD COLUMN billing_cycle TEXT;
        RAISE NOTICE 'Added billing_cycle column to subscription_plans';
    ELSE
        RAISE NOTICE 'billing_cycle column already exists in subscription_plans';
    END IF;
END $$;

-- Add is_active column if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'subscription_plans' 
                   AND column_name = 'is_active') THEN
        ALTER TABLE public.subscription_plans ADD COLUMN is_active BOOLEAN DEFAULT true;
        RAISE NOTICE 'Added is_active column to subscription_plans';
    ELSE
        RAISE NOTICE 'is_active column already exists in subscription_plans';
    END IF;
END $$;

-- Add description column if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'subscription_plans' 
                   AND column_name = 'description') THEN
        ALTER TABLE public.subscription_plans ADD COLUMN description TEXT;
        RAISE NOTICE 'Added description column to subscription_plans';
    ELSE
        RAISE NOTICE 'description column already exists in subscription_plans';
    END IF;
END $$;

-- Add slug column if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'subscription_plans' 
                   AND column_name = 'slug') THEN
        ALTER TABLE public.subscription_plans ADD COLUMN slug TEXT;
        RAISE NOTICE 'Added slug column to subscription_plans';
    ELSE
        RAISE NOTICE 'slug column already exists in subscription_plans';
    END IF;
END $$;

-- Show current table structure
SELECT 
    'Current subscription_plans structure' as info,
    column_name,
    data_type,
    is_nullable
FROM information_schema.columns 
WHERE table_name = 'subscription_plans' 
AND table_schema = 'public'
ORDER BY ordinal_position;

-- Show existing data
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



