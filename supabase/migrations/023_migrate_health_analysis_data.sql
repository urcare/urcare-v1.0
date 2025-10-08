-- Migrate health analysis data to unified table
-- Migrates from: health_analysis, health_insights, user_health_scores

-- First, migrate from health_analysis table
INSERT INTO health_analysis_unified (
    user_id,
    health_score,
    display_analysis,
    detailed_analysis,
    analysis,
    recommendations,
    user_input,
    uploaded_files,
    voice_transcript,
    ai_provider,
    ai_model,
    generation_parameters,
    calculation_method,
    factors_considered,
    analysis_date,
    is_latest,
    created_at,
    updated_at
)
SELECT 
    ha.user_id,
    ha.health_score,
    ha.display_analysis,
    ha.detailed_analysis,
    COALESCE(ha.display_analysis->>'summary', 'Health analysis completed') as analysis,
    COALESCE(ARRAY(SELECT jsonb_array_elements_text(ha.display_analysis->'recommendations')), ARRAY[]::text[]) as recommendations,
    ha.user_input,
    ha.uploaded_files,
    ha.voice_transcript,
    ha.ai_provider,
    ha.ai_model,
    ha.generation_parameters,
    ha.calculation_method,
    ha.factors_considered,
    ha.analysis_date,
    ha.is_latest,
    ha.created_at,
    ha.updated_at
FROM health_analysis ha
WHERE NOT EXISTS (
    SELECT 1 FROM health_analysis_unified hau 
    WHERE hau.user_id = ha.user_id 
    AND hau.analysis_date = ha.analysis_date
);

-- Migrate from health_insights table (if not already migrated from health_analysis)
INSERT INTO health_analysis_unified (
    user_id,
    health_score,
    display_analysis,
    detailed_analysis,
    analysis,
    recommendations,
    ai_provider,
    analysis_date,
    is_latest,
    created_at,
    updated_at
)
SELECT 
    hi.user_id,
    hi.health_score,
    COALESCE(hi.display_analysis, '{}'::jsonb) as display_analysis,
    COALESCE(hi.detailed_analysis, '{}'::jsonb) as detailed_analysis,
    hi.analysis,
    hi.recommendations,
    'ai_provider' as ai_provider, -- Default since not in original table
    COALESCE(hi.generated_at::date, CURRENT_DATE) as analysis_date,
    true as is_latest,
    hi.created_at,
    hi.updated_at
FROM health_insights hi
WHERE NOT EXISTS (
    SELECT 1 FROM health_analysis_unified hau 
    WHERE hau.user_id = hi.user_id 
    AND hau.analysis_date = COALESCE(hi.generated_at::date, CURRENT_DATE)
);

-- Migrate from user_health_scores table (if not already migrated)
INSERT INTO health_analysis_unified (
    user_id,
    health_score,
    display_analysis,
    detailed_analysis,
    analysis,
    recommendations,
    user_input,
    uploaded_files,
    voice_transcript,
    ai_provider,
    analysis_date,
    is_latest,
    created_at,
    updated_at
)
SELECT 
    uhs.user_id,
    uhs.health_score,
    COALESCE(uhs.uploaded_files, '{}'::jsonb) as display_analysis,
    '{}'::jsonb as detailed_analysis,
    uhs.analysis,
    uhs.recommendations,
    uhs.user_input,
    COALESCE(ARRAY(SELECT jsonb_array_elements_text(uhs.uploaded_files)), ARRAY[]::text[]),
    uhs.voice_transcript,
    uhs.ai_provider,
    COALESCE(uhs.generation_timestamp::date, CURRENT_DATE) as analysis_date,
    true as is_latest,
    uhs.created_at,
    uhs.updated_at
FROM user_health_scores uhs
WHERE NOT EXISTS (
    SELECT 1 FROM health_analysis_unified hau 
    WHERE hau.user_id = uhs.user_id 
    AND hau.analysis_date = COALESCE(uhs.generation_timestamp::date, CURRENT_DATE)
);

-- Update is_latest flags to ensure only the most recent analysis per user is marked as latest
WITH latest_analyses AS (
    SELECT 
        user_id,
        MAX(analysis_date) as latest_date
    FROM health_analysis_unified
    GROUP BY user_id
)
UPDATE health_analysis_unified 
SET is_latest = (analysis_date = latest_date)
FROM latest_analyses la
WHERE health_analysis_unified.user_id = la.user_id;

-- Validate migration
DO $$
DECLARE
    health_analysis_count INTEGER;
    health_insights_count INTEGER;
    user_health_scores_count INTEGER;
    unified_count INTEGER;
BEGIN
    SELECT COUNT(*) INTO health_analysis_count FROM health_analysis;
    SELECT COUNT(*) INTO health_insights_count FROM health_insights;
    SELECT COUNT(*) INTO user_health_scores_count FROM user_health_scores;
    SELECT COUNT(*) INTO unified_count FROM health_analysis_unified;
    
    RAISE NOTICE 'Migration Summary:';
    RAISE NOTICE 'health_analysis records: %', health_analysis_count;
    RAISE NOTICE 'health_insights records: %', health_insights_count;
    RAISE NOTICE 'user_health_scores records: %', user_health_scores_count;
    RAISE NOTICE 'health_analysis_unified records: %', unified_count;
    
    -- Check for data integrity
    IF unified_count = 0 AND (health_analysis_count > 0 OR health_insights_count > 0 OR user_health_scores_count > 0) THEN
        RAISE WARNING 'No data migrated to unified table despite source data existing';
    ELSE
        RAISE NOTICE 'Health analysis data migration completed successfully';
    END IF;
END $$;
