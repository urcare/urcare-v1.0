-- Rollback Script: Revert to Original Database Schema
-- This script removes all unified tables and compatibility views
-- WARNING: This will permanently delete all data in unified tables!

-- Drop compatibility views first
DROP VIEW IF EXISTS user_progress_tracking;
DROP VIEW IF EXISTS user_plan_activities;
DROP VIEW IF EXISTS onboarding_profiles;
DROP VIEW IF EXISTS user_profiles;
DROP VIEW IF EXISTS razorpay_payments;
DROP VIEW IF EXISTS payments;
DROP VIEW IF EXISTS razorpay_subscriptions;
DROP VIEW IF EXISTS subscriptions;
DROP VIEW IF EXISTS user_daily_schedules;
DROP VIEW IF EXISTS daily_schedules;
DROP VIEW IF EXISTS user_selected_health_plans;
DROP VIEW IF EXISTS user_health_plans;
DROP VIEW IF EXISTS health_plans;
DROP VIEW IF EXISTS user_health_scores;
DROP VIEW IF EXISTS health_insights;
DROP VIEW IF EXISTS health_analysis;

-- Drop unified tables (this will delete all data!)
DROP TABLE IF EXISTS progress_tracking_unified CASCADE;
DROP TABLE IF EXISTS plan_activities_unified CASCADE;
DROP TABLE IF EXISTS user_profiles_unified CASCADE;
DROP TABLE IF EXISTS payments_unified CASCADE;
DROP TABLE IF EXISTS subscriptions_unified CASCADE;
DROP TABLE IF EXISTS daily_schedules_unified CASCADE;
DROP TABLE IF EXISTS health_plans_unified CASCADE;
DROP TABLE IF EXISTS health_analysis_unified CASCADE;

-- Drop functions that were created for unified tables
DROP FUNCTION IF EXISTS update_health_analysis_unified_updated_at();
DROP FUNCTION IF EXISTS ensure_single_latest_health_analysis();
DROP FUNCTION IF EXISTS update_health_plans_unified_updated_at();
DROP FUNCTION IF EXISTS ensure_single_active_health_plan();
DROP FUNCTION IF EXISTS update_daily_schedules_unified_updated_at();
DROP FUNCTION IF EXISTS calculate_completion_percentage();
DROP FUNCTION IF EXISTS update_subscriptions_unified_updated_at();
DROP FUNCTION IF EXISTS ensure_single_active_subscription();
DROP FUNCTION IF EXISTS is_subscription_active(subscriptions_unified);
DROP FUNCTION IF EXISTS update_payments_unified_updated_at();
DROP FUNCTION IF EXISTS set_processed_at_on_capture();
DROP FUNCTION IF EXISTS update_user_profiles_unified_updated_at();
DROP FUNCTION IF EXISTS calculate_onboarding_completion();
DROP FUNCTION IF EXISTS update_plan_activities_unified_updated_at();
DROP FUNCTION IF EXISTS set_completed_at_on_completion();
DROP FUNCTION IF EXISTS update_progress_tracking_unified_updated_at();
DROP FUNCTION IF EXISTS calculate_activity_completion_percentage();

-- Note: Original tables should still exist if they weren't dropped
-- If you need to restore original tables, you would need to run the original migration scripts

-- Verify rollback completion
DO $$
DECLARE
    unified_tables_count INTEGER;
    compatibility_views_count INTEGER;
BEGIN
    -- Check if unified tables still exist
    SELECT COUNT(*) INTO unified_tables_count
    FROM information_schema.tables 
    WHERE table_schema = 'public' 
    AND table_name LIKE '%_unified';

    -- Check if compatibility views still exist
    SELECT COUNT(*) INTO compatibility_views_count
    FROM information_schema.views 
    WHERE table_schema = 'public' 
    AND table_name IN (
        'health_analysis', 'health_insights', 'user_health_scores',
        'health_plans', 'user_health_plans', 'user_selected_health_plans',
        'daily_schedules', 'user_daily_schedules',
        'subscriptions', 'razorpay_subscriptions',
        'payments', 'razorpay_payments',
        'user_profiles', 'onboarding_profiles',
        'user_plan_activities', 'user_progress_tracking'
    );

    RAISE NOTICE 'Rollback Summary:';
    RAISE NOTICE 'Unified tables remaining: %', unified_tables_count;
    RAISE NOTICE 'Compatibility views remaining: %', compatibility_views_count;
    
    IF unified_tables_count = 0 AND compatibility_views_count = 0 THEN
        RAISE NOTICE '✅ Rollback completed successfully - all unified tables and views removed';
    ELSE
        RAISE WARNING '⚠️ Rollback may not be complete - some unified tables or views still exist';
    END IF;
END $$;
