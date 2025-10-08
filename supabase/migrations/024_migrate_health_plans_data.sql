-- Migrate health plans data to unified table
-- Migrates from: health_plans, user_health_plans, user_selected_health_plans

-- First, migrate from health_plans table
INSERT INTO health_plans_unified (
    user_id,
    plan_name,
    plan_type,
    primary_goal,
    secondary_goals,
    plan_data,
    status,
    duration_weeks,
    start_date,
    end_date,
    actual_end_date,
    progress_percentage,
    weekly_compliance_rate,
    monthly_compliance_rate,
    health_analysis_id,
    user_input,
    ai_provider,
    generation_timestamp,
    generation_model,
    generation_parameters,
    timeline_adjustments,
    intensity_adjustments,
    completion_reason,
    created_at,
    updated_at
)
SELECT 
    hp.user_id,
    hp.plan_name,
    hp.plan_type,
    hp.primary_goal,
    hp.secondary_goals,
    hp.plan_data,
    hp.status,
    hp.duration_weeks,
    hp.start_date,
    hp.target_end_date as end_date,
    hp.actual_end_date,
    hp.overall_progress_percentage as progress_percentage,
    hp.weekly_compliance_rate,
    hp.monthly_compliance_rate,
    hp.health_analysis_id,
    hp.user_input,
    'ai_provider' as ai_provider, -- Default since not in original table
    hp.generated_at as generation_timestamp,
    hp.generation_model,
    hp.generation_parameters,
    hp.timeline_adjustments,
    hp.intensity_adjustments,
    hp.completion_reason,
    hp.created_at,
    hp.updated_at
FROM health_plans hp
WHERE NOT EXISTS (
    SELECT 1 FROM health_plans_unified hpu 
    WHERE hpu.user_id = hp.user_id 
    AND hpu.plan_name = hp.plan_name
    AND hpu.start_date = hp.start_date
);

-- Migrate from user_health_plans table
INSERT INTO health_plans_unified (
    user_id,
    plan_name,
    plan_type,
    primary_goal,
    secondary_goals,
    plan_data,
    status,
    duration_weeks,
    start_date,
    end_date,
    progress_percentage,
    is_selected,
    is_active,
    ai_provider,
    generation_timestamp,
    processing_time_ms,
    created_at,
    updated_at
)
SELECT 
    uhp.user_id,
    uhp.title as plan_name,
    'custom' as plan_type, -- Default type for user-generated plans
    uhp.description as primary_goal,
    uhp.focus_areas as secondary_goals,
    jsonb_build_object(
        'title', uhp.title,
        'description', uhp.description,
        'duration', uhp.duration,
        'difficulty', uhp.difficulty,
        'focus_areas', uhp.focus_areas,
        'estimated_calories', uhp.estimated_calories,
        'equipment', uhp.equipment,
        'benefits', uhp.benefits
    ) as plan_data,
    uhp.status,
    CASE 
        WHEN uhp.duration ~ '^\d+' THEN (uhp.duration ~ '^\d+')::integer
        ELSE 4 -- Default 4 weeks
    END as duration_weeks,
    COALESCE(uhp.created_at::date, CURRENT_DATE) as start_date,
    COALESCE(uhp.created_at::date + INTERVAL '4 weeks', CURRENT_DATE + INTERVAL '4 weeks') as end_date,
    uhp.progress_percentage,
    uhp.is_selected,
    uhp.is_active,
    uhp.ai_provider,
    uhp.generation_timestamp,
    uhp.processing_time_ms,
    uhp.created_at,
    uhp.updated_at
FROM user_health_plans uhp
WHERE NOT EXISTS (
    SELECT 1 FROM health_plans_unified hpu 
    WHERE hpu.user_id = uhp.user_id 
    AND hpu.plan_name = uhp.title
);

-- Migrate from user_selected_health_plans table
INSERT INTO health_plans_unified (
    user_id,
    plan_name,
    plan_type,
    primary_goal,
    plan_data,
    status,
    is_selected,
    selected_plan_id,
    created_at,
    updated_at
)
SELECT 
    ushp.user_id,
    ushp.plan_name,
    ushp.plan_type,
    ushp.primary_goal,
    ushp.plan_data,
    ushp.status,
    true as is_selected,
    ushp.plan_name as selected_plan_id, -- Using plan_name as selected_plan_id
    ushp.created_at,
    ushp.updated_at
FROM user_selected_health_plans ushp
WHERE NOT EXISTS (
    SELECT 1 FROM health_plans_unified hpu 
    WHERE hpu.user_id = ushp.user_id 
    AND hpu.plan_name = ushp.plan_name
    AND hpu.is_selected = true
);

-- Update is_selected flags to ensure only one selected plan per user
WITH selected_plans AS (
    SELECT 
        user_id,
        MAX(created_at) as latest_selected
    FROM health_plans_unified
    WHERE is_selected = true
    GROUP BY user_id
)
UPDATE health_plans_unified 
SET is_selected = (created_at = latest_selected)
FROM selected_plans sp
WHERE health_plans_unified.user_id = sp.user_id
AND health_plans_unified.is_selected = true;

-- Validate migration
DO $$
DECLARE
    health_plans_count INTEGER;
    user_health_plans_count INTEGER;
    user_selected_health_plans_count INTEGER;
    unified_count INTEGER;
BEGIN
    SELECT COUNT(*) INTO health_plans_count FROM health_plans;
    SELECT COUNT(*) INTO user_health_plans_count FROM user_health_plans;
    SELECT COUNT(*) INTO user_selected_health_plans_count FROM user_selected_health_plans;
    SELECT COUNT(*) INTO unified_count FROM health_plans_unified;
    
    RAISE NOTICE 'Migration Summary:';
    RAISE NOTICE 'health_plans records: %', health_plans_count;
    RAISE NOTICE 'user_health_plans records: %', user_health_plans_count;
    RAISE NOTICE 'user_selected_health_plans records: %', user_selected_health_plans_count;
    RAISE NOTICE 'health_plans_unified records: %', unified_count;
    
    -- Check for data integrity
    IF unified_count = 0 AND (health_plans_count > 0 OR user_health_plans_count > 0 OR user_selected_health_plans_count > 0) THEN
        RAISE WARNING 'No data migrated to unified table despite source data existing';
    ELSE
        RAISE NOTICE 'Health plans data migration completed successfully';
    END IF;
END $$;
