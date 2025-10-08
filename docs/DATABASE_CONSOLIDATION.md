# Database Consolidation & Integration Guide

## Overview
This document outlines the consolidation of 14 duplicate database tables into 8 unified tables while maintaining 100% backward compatibility.

## Table Consolidation Map

### 1. Health Analysis Group → `health_analysis_unified`
**Merges:** `health_analysis`, `health_insights`, `user_health_scores`

**Key Fields:**
- `id` (UUID, Primary Key)
- `user_id` (UUID, Foreign Key)
- `health_score` (INTEGER) - from health_analysis.health_score
- `display_analysis` (JSONB) - from health_analysis.display_analysis
- `detailed_analysis` (JSONB) - from health_analysis.detailed_analysis
- `analysis` (TEXT) - from health_insights.analysis
- `recommendations` (ARRAY) - from health_insights.recommendations
- `user_input` (TEXT) - from health_analysis.user_input
- `uploaded_files` (ARRAY) - from health_analysis.uploaded_files
- `voice_transcript` (TEXT) - from health_analysis.voice_transcript
- `ai_provider` (TEXT) - from health_analysis.ai_provider
- `ai_model` (TEXT) - from health_analysis.ai_model
- `calculation_method` (TEXT) - from health_analysis.calculation_method
- `factors_considered` (ARRAY) - from health_analysis.factors_considered
- `is_latest` (BOOLEAN) - from health_analysis.is_latest
- `analysis_date` (DATE) - from health_analysis.analysis_date
- `created_at` (TIMESTAMP)
- `updated_at` (TIMESTAMP)

### 2. Health Plans Group → `health_plans_unified`
**Merges:** `health_plans`, `user_health_plans`, `user_selected_health_plans`

**Key Fields:**
- `id` (UUID, Primary Key)
- `user_id` (UUID, Foreign Key)
- `plan_name` (TEXT) - from health_plans.plan_name
- `plan_type` (TEXT) - from health_plans.plan_type
- `primary_goal` (TEXT) - from health_plans.primary_goal
- `secondary_goals` (ARRAY) - from health_plans.secondary_goals
- `plan_data` (JSONB) - from health_plans.plan_data
- `status` (TEXT) - from health_plans.status
- `duration_weeks` (INTEGER) - from health_plans.duration_weeks
- `start_date` (DATE) - from health_plans.start_date
- `end_date` (DATE) - from health_plans.target_end_date
- `progress_percentage` (INTEGER) - from health_plans.overall_progress_percentage
- `is_selected` (BOOLEAN) - from user_selected_health_plans
- `is_active` (BOOLEAN) - from user_health_plans.is_active
- `health_analysis_id` (UUID) - from health_plans.health_analysis_id
- `user_input` (TEXT) - from health_plans.user_input
- `ai_provider` (TEXT) - from user_health_plans.ai_provider
- `created_at` (TIMESTAMP)
- `updated_at` (TIMESTAMP)

### 3. Daily Schedules Group → `daily_schedules_unified`
**Merges:** `daily_schedules`, `user_daily_schedules`

**Key Fields:**
- `id` (UUID, Primary Key)
- `user_id` (UUID, Foreign Key)
- `plan_id` (UUID, Foreign Key)
- `schedule_date` (DATE) - from both tables
- `day_number` (INTEGER) - from daily_schedules.day_number
- `schedule_data` (JSONB) - from daily_schedules.schedule_data
- `activities` (JSONB) - from user_daily_schedules.activities
- `nutrition_plan` (JSONB) - from user_daily_schedules.nutrition_plan
- `hydration_plan` (JSONB) - from user_daily_schedules.hydration_plan
- `recovery_activities` (JSONB) - from user_daily_schedules.recovery_activities
- `is_generated` (BOOLEAN) - from daily_schedules.is_generated
- `is_completed` (BOOLEAN) - from daily_schedules.is_completed
- `completion_percentage` (INTEGER) - from user_daily_schedules.completion_percentage
- `user_feedback` (JSONB) - from daily_schedules.user_feedback
- `completion_status` (TEXT) - from daily_schedules.completion_status
- `ai_provider` (TEXT) - from daily_schedules.ai_provider
- `ai_model` (TEXT) - from daily_schedules.ai_model
- `created_at` (TIMESTAMP)
- `updated_at` (TIMESTAMP)

### 4. Subscriptions Group → `subscriptions_unified`
**Merges:** `subscriptions`, `razorpay_subscriptions`

**Key Fields:**
- `id` (UUID, Primary Key)
- `user_id` (UUID, Foreign Key)
- `plan_id` (UUID, Foreign Key)
- `plan_slug` (TEXT) - from razorpay_subscriptions.plan_slug
- `status` (TEXT) - from both tables
- `billing_cycle` (TEXT) - from both tables
- `amount` (NUMERIC) - from razorpay_subscriptions.amount
- `currency` (TEXT) - from razorpay_subscriptions.currency
- `payment_provider` (TEXT) - 'razorpay', 'phonepe', 'stripe'
- `current_period_start` (TIMESTAMP) - from subscriptions.current_period_start
- `current_period_end` (TIMESTAMP) - from subscriptions.current_period_end
- `trial_start` (TIMESTAMP) - from subscriptions.trial_start
- `trial_end` (TIMESTAMP) - from subscriptions.trial_end
- `provider_subscription_id` (TEXT) - from razorpay_subscriptions.payment_id
- `provider_customer_id` (TEXT) - from subscriptions.phonepe_customer_id
- `metadata` (JSONB) - from subscriptions.metadata
- `created_at` (TIMESTAMP)
- `updated_at` (TIMESTAMP)

### 5. Payments Group → `payments_unified`
**Merges:** `payments`, `razorpay_payments`

**Key Fields:**
- `id` (UUID, Primary Key)
- `user_id` (UUID, Foreign Key)
- `subscription_id` (UUID, Foreign Key)
- `plan_id` (UUID, Foreign Key)
- `amount` (NUMERIC) - from both tables
- `currency` (TEXT) - from both tables
- `status` (TEXT) - from both tables
- `payment_method` (TEXT) - from payments.payment_method
- `payment_provider` (TEXT) - 'razorpay', 'phonepe', 'stripe'
- `provider_transaction_id` (TEXT) - from payments.phonepe_transaction_id
- `provider_payment_id` (TEXT) - from razorpay_payments.payment_id
- `provider_order_id` (TEXT) - from razorpay_payments.order_id
- `provider_response` (JSONB) - from payments.phonepe_response
- `billing_cycle` (TEXT) - from payments.billing_cycle
- `is_first_time` (BOOLEAN) - from payments.is_first_time
- `failure_reason` (TEXT) - from payments.failure_reason
- `processed_at` (TIMESTAMP) - from payments.processed_at
- `created_at` (TIMESTAMP)
- `updated_at` (TIMESTAMP)

### 6. User Profiles Group → `user_profiles_unified`
**Merges:** `user_profiles`, `onboarding_profiles`

**Key Fields:**
- All existing user_profiles fields (53 columns)
- `onboarding_version` (TEXT) - from onboarding_profiles.onboarding_version
- `completed_steps` (ARRAY) - from onboarding_profiles.completed_steps
- `skipped_steps` (ARRAY) - from onboarding_profiles.skipped_steps
- `completion_percentage` (INTEGER) - from onboarding_profiles.completion_percentage
- Note: country, state, district are merged (no duplication)

### 7. Plan Activities → `plan_activities_unified`
**Optimizes:** `user_plan_activities`

**Key Fields:**
- All existing fields from user_plan_activities (28 columns)
- Cleaned up redundant tracking fields
- Better indexing for performance

### 8. Progress Tracking → `progress_tracking_unified`
**Optimizes:** `user_progress_tracking`

**Key Fields:**
- All existing fields from user_progress_tracking (22 columns)
- Metrics consolidated into JSONB for flexibility
- Better indexing for performance

## Migration Strategy

### Phase 1: Create Unified Tables
1. Create 8 new unified tables with proper schemas
2. Set up indexes and RLS policies
3. Ensure all foreign key relationships work

### Phase 2: Migrate Data
1. Copy data from old tables to new unified tables
2. Handle conflicts (keep most recent data)
3. Validate data integrity

### Phase 3: Create Compatibility Views
1. Create views that mimic old table structures
2. Views point to new unified tables
3. Existing queries work unchanged

### Phase 4: Update Services
1. Create unified service classes
2. Create adapter layer for backward compatibility
3. Update existing services to use new tables

## Benefits

✅ **Reduced Complexity**: 14 tables → 8 tables (43% reduction)
✅ **No Data Loss**: All existing data preserved
✅ **Backward Compatibility**: All existing code continues to work
✅ **Better Performance**: Optimized indexes and relationships
✅ **Easier Maintenance**: Single source of truth for each data type
✅ **Future-Proof**: Unified schema supports multiple payment providers

## Rollback Plan

If issues arise, complete rollback is available:
1. Drop unified tables
2. Restore original table structure
3. Restore data from backups
4. All services revert to original behavior

## Timeline

- **Day 1-2**: Create migration scripts
- **Day 3**: Create unified services
- **Day 4**: Update existing services
- **Day 5**: Update hooks and components
- **Day 6**: Testing and validation
- **Day 7**: Documentation and deployment
