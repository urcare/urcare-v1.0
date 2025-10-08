-- Migrate daily schedules data to unified table
-- Migrates from: daily_schedules, user_daily_schedules

-- First, migrate from daily_schedules table
INSERT INTO daily_schedules_unified (
    user_id,
    plan_id,
    schedule_date,
    day_number,
    schedule_data,
    activities,
    ai_provider,
    ai_model,
    generation_parameters,
    is_generated,
    is_completed,
    user_feedback,
    completion_status,
    health_analysis_id,
    created_at,
    updated_at
)
SELECT 
    ds.user_id,
    ds.plan_id,
    ds.schedule_date,
    ds.day_number,
    ds.schedule_data,
    ds.schedule_data as activities, -- Using schedule_data as activities
    ds.ai_provider,
    ds.ai_model,
    ds.generation_parameters,
    ds.is_generated,
    ds.is_completed,
    ds.user_feedback,
    ds.completion_status,
    ds.health_analysis_id,
    ds.created_at,
    ds.updated_at
FROM daily_schedules ds
WHERE NOT EXISTS (
    SELECT 1 FROM daily_schedules_unified dsu 
    WHERE dsu.user_id = ds.user_id 
    AND dsu.schedule_date = ds.schedule_date
    AND dsu.plan_id = ds.plan_id
);

-- Migrate from user_daily_schedules table
INSERT INTO daily_schedules_unified (
    user_id,
    plan_id,
    schedule_date,
    day_number,
    activities,
    nutrition_plan,
    hydration_plan,
    recovery_activities,
    status,
    completion_percentage,
    energy_level,
    difficulty_rating,
    satisfaction_rating,
    user_notes,
    created_at,
    updated_at
)
SELECT 
    uds.user_id,
    uds.plan_id,
    uds.schedule_date,
    uds.week_number * 7 + uds.day_of_week::integer as day_number, -- Calculate day number
    uds.activities,
    uds.nutrition_plan,
    uds.hydration_plan,
    uds.recovery_activities,
    uds.status,
    uds.completion_percentage,
    uds.energy_level,
    uds.difficulty_rating,
    uds.satisfaction_rating,
    uds.user_notes,
    uds.created_at,
    uds.updated_at
FROM user_daily_schedules uds
WHERE NOT EXISTS (
    SELECT 1 FROM daily_schedules_unified dsu 
    WHERE dsu.user_id = uds.user_id 
    AND dsu.schedule_date = uds.schedule_date
    AND dsu.plan_id = uds.plan_id
);

-- Update completion status based on completion_percentage
UPDATE daily_schedules_unified 
SET is_completed = (completion_percentage >= 100)
WHERE completion_percentage IS NOT NULL;

-- Update is_generated flag for records that have activities or schedule_data
UPDATE daily_schedules_unified 
SET is_generated = true
WHERE (activities IS NOT NULL AND activities != '{}'::jsonb) 
   OR (schedule_data IS NOT NULL AND schedule_data != '{}'::jsonb);

-- Validate migration
DO $$
DECLARE
    daily_schedules_count INTEGER;
    user_daily_schedules_count INTEGER;
    unified_count INTEGER;
BEGIN
    SELECT COUNT(*) INTO daily_schedules_count FROM daily_schedules;
    SELECT COUNT(*) INTO user_daily_schedules_count FROM user_daily_schedules;
    SELECT COUNT(*) INTO unified_count FROM daily_schedules_unified;
    
    RAISE NOTICE 'Migration Summary:';
    RAISE NOTICE 'daily_schedules records: %', daily_schedules_count;
    RAISE NOTICE 'user_daily_schedules records: %', user_daily_schedules_count;
    RAISE NOTICE 'daily_schedules_unified records: %', unified_count;
    
    -- Check for data integrity
    IF unified_count = 0 AND (daily_schedules_count > 0 OR user_daily_schedules_count > 0) THEN
        RAISE WARNING 'No data migrated to unified table despite source data existing';
    ELSE
        RAISE NOTICE 'Daily schedules data migration completed successfully';
    END IF;
END $$;
