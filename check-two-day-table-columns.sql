-- CHECK TWO_DAY_HEALTH_PLANS TABLE COLUMNS
-- This will show us the exact column structure

SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns 
WHERE table_schema = 'public' 
AND table_name = 'two_day_health_plans'
ORDER BY ordinal_position;

-- Also show existing records to understand the structure
SELECT * FROM two_day_health_plans LIMIT 5;
