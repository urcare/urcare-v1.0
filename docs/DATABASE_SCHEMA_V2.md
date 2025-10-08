# Database Schema V2 - Unified Architecture

## Overview

This document describes the new unified database schema that consolidates 14 duplicate tables into 8 optimized tables while maintaining 100% backward compatibility.

## Schema Changes Summary

- **Before**: 14 tables with significant duplication
- **After**: 8 unified tables + 16 compatibility views
- **Data Loss**: Zero (all data preserved)
- **Breaking Changes**: None (full backward compatibility)

## Unified Tables

### 1. health_analysis_unified
**Consolidates**: `health_analysis`, `health_insights`, `user_health_scores`

**Purpose**: Single source of truth for all health analysis data

**Key Fields**:
- `id` (UUID, Primary Key)
- `user_id` (UUID, Foreign Key to auth.users)
- `health_score` (INTEGER) - Overall health score
- `display_analysis` (JSONB) - Formatted analysis for UI
- `detailed_analysis` (JSONB) - Comprehensive health breakdown
- `analysis` (TEXT) - Human-readable analysis
- `recommendations` (TEXT[]) - Actionable recommendations
- `user_input` (TEXT) - User-provided health information
- `uploaded_files` (TEXT[]) - Health documents uploaded
- `voice_transcript` (TEXT) - Voice input transcript
- `ai_provider` (TEXT) - AI service used for analysis
- `ai_model` (TEXT) - Specific AI model version
- `calculation_method` (TEXT) - How the score was calculated
- `factors_considered` (TEXT[]) - Health factors analyzed
- `analysis_date` (DATE) - When analysis was performed
- `is_latest` (BOOLEAN) - Most recent analysis for user

**Indexes**:
- `idx_health_analysis_unified_user_id`
- `idx_health_analysis_unified_analysis_date`
- `idx_health_analysis_unified_is_latest`
- `idx_health_analysis_unified_ai_provider`

### 2. health_plans_unified
**Consolidates**: `health_plans`, `user_health_plans`, `user_selected_health_plans`

**Purpose**: Unified health plan management

**Key Fields**:
- `id` (UUID, Primary Key)
- `user_id` (UUID, Foreign Key to auth.users)
- `plan_name` (TEXT) - Name of the health plan
- `plan_type` (TEXT) - Type of plan (custom, generated, etc.)
- `primary_goal` (TEXT) - Main health goal
- `secondary_goals` (TEXT[]) - Additional goals
- `plan_data` (JSONB) - Complete plan structure
- `status` (TEXT) - active, completed, paused, cancelled
- `duration_weeks` (INTEGER) - Plan duration in weeks
- `start_date` (DATE) - When plan starts
- `end_date` (DATE) - When plan ends
- `progress_percentage` (INTEGER) - Completion percentage
- `is_selected` (BOOLEAN) - User's chosen plan
- `is_active` (BOOLEAN) - Currently active plan
- `health_analysis_id` (UUID) - Related health analysis
- `ai_provider` (TEXT) - AI service that generated plan

**Indexes**:
- `idx_health_plans_unified_user_id`
- `idx_health_plans_unified_status`
- `idx_health_plans_unified_is_active`
- `idx_health_plans_unified_is_selected`

### 3. daily_schedules_unified
**Consolidates**: `daily_schedules`, `user_daily_schedules`

**Purpose**: Daily schedule and activity management

**Key Fields**:
- `id` (UUID, Primary Key)
- `user_id` (UUID, Foreign Key to auth.users)
- `plan_id` (UUID, Foreign Key to health_plans_unified)
- `schedule_date` (DATE) - Date of schedule
- `day_number` (INTEGER) - Day in plan
- `schedule_data` (JSONB) - Complete schedule structure
- `activities` (JSONB) - Daily activities
- `nutrition_plan` (JSONB) - Meal planning
- `hydration_plan` (JSONB) - Water intake goals
- `recovery_activities` (JSONB) - Rest and recovery
- `is_generated` (BOOLEAN) - AI-generated schedule
- `is_completed` (BOOLEAN) - Schedule completion status
- `completion_percentage` (INTEGER) - Progress tracking
- `user_feedback` (JSONB) - User notes and ratings
- `ai_provider` (TEXT) - AI service used

**Indexes**:
- `idx_daily_schedules_unified_user_id`
- `idx_daily_schedules_unified_plan_id`
- `idx_daily_schedules_unified_schedule_date`
- `idx_daily_schedules_unified_status`

### 4. subscriptions_unified
**Consolidates**: `subscriptions`, `razorpay_subscriptions`

**Purpose**: Unified subscription management across all payment providers

**Key Fields**:
- `id` (UUID, Primary Key)
- `user_id` (UUID, Foreign Key to auth.users)
- `plan_id` (UUID, Foreign Key to subscription_plans)
- `plan_slug` (TEXT) - Plan identifier
- `status` (TEXT) - active, trialing, past_due, canceled, etc.
- `billing_cycle` (TEXT) - monthly, yearly, weekly
- `amount` (NUMERIC) - Subscription cost
- `currency` (TEXT) - Currency code
- `payment_provider` (TEXT) - razorpay, phonepe, stripe, manual
- `current_period_start` (TIMESTAMP) - Current billing period start
- `current_period_end` (TIMESTAMP) - Current billing period end
- `trial_start` (TIMESTAMP) - Trial period start
- `trial_end` (TIMESTAMP) - Trial period end
- `provider_subscription_id` (TEXT) - External provider ID
- `provider_customer_id` (TEXT) - External customer ID
- `metadata` (JSONB) - Additional provider data

**Indexes**:
- `idx_subscriptions_unified_user_id`
- `idx_subscriptions_unified_status`
- `idx_subscriptions_unified_payment_provider`
- `idx_subscriptions_unified_current_period_end`

### 5. payments_unified
**Consolidates**: `payments`, `razorpay_payments`

**Purpose**: Unified payment tracking across all providers

**Key Fields**:
- `id` (UUID, Primary Key)
- `user_id` (UUID, Foreign Key to auth.users)
- `subscription_id` (UUID, Foreign Key to subscriptions_unified)
- `plan_id` (UUID, Foreign Key to subscription_plans)
- `amount` (NUMERIC) - Payment amount
- `currency` (TEXT) - Currency code
- `status` (TEXT) - pending, captured, failed, cancelled, refunded
- `payment_method` (TEXT) - Payment method used
- `payment_provider` (TEXT) - razorpay, phonepe, stripe, manual
- `provider_transaction_id` (TEXT) - External transaction ID
- `provider_payment_id` (TEXT) - External payment ID
- `provider_response` (JSONB) - Provider response data
- `billing_cycle` (TEXT) - monthly, yearly, weekly
- `is_first_time` (BOOLEAN) - First-time customer
- `failure_reason` (TEXT) - Payment failure reason
- `processed_at` (TIMESTAMP) - When payment was processed

**Indexes**:
- `idx_payments_unified_user_id`
- `idx_payments_unified_subscription_id`
- `idx_payments_unified_status`
- `idx_payments_unified_payment_provider`

### 6. user_profiles_unified
**Consolidates**: `user_profiles`, `onboarding_profiles`

**Purpose**: Complete user profile and onboarding data

**Key Fields**:
- All original user_profiles fields (53 columns)
- `onboarding_version` (TEXT) - Onboarding flow version
- `completed_steps` (TEXT[]) - Completed onboarding steps
- `skipped_steps` (TEXT[]) - Skipped onboarding steps
- `completion_percentage` (INTEGER) - Onboarding progress
- `onboarding_completed` (BOOLEAN) - Onboarding status
- `country`, `state`, `district` (TEXT) - Location data (merged)

**Indexes**:
- `idx_user_profiles_unified_user_id`
- `idx_user_profiles_unified_onboarding_completed`
- `idx_user_profiles_unified_subscription_status`

### 7. plan_activities_unified
**Optimizes**: `user_plan_activities`

**Purpose**: Streamlined activity tracking

**Key Fields**:
- All original user_plan_activities fields (28 columns)
- Optimized for better performance
- Cleaned up redundant tracking fields

**Indexes**:
- `idx_plan_activities_unified_user_id`
- `idx_plan_activities_unified_plan_id`
- `idx_plan_activities_unified_scheduled_date`
- `idx_plan_activities_unified_is_completed`

### 8. progress_tracking_unified
**Optimizes**: `user_progress_tracking`

**Purpose**: Flexible progress tracking with JSONB metrics

**Key Fields**:
- All original user_progress_tracking fields (22 columns)
- `additional_metrics` (JSONB) - Flexible metric storage
- Better indexing for performance

**Indexes**:
- `idx_progress_tracking_unified_user_id`
- `idx_progress_tracking_unified_plan_id`
- `idx_progress_tracking_unified_tracking_date`

## Compatibility Views

16 compatibility views maintain backward compatibility:

- `health_analysis` → points to `health_analysis_unified`
- `health_insights` → points to `health_analysis_unified`
- `user_health_scores` → points to `health_analysis_unified`
- `health_plans` → points to `health_plans_unified`
- `user_health_plans` → points to `health_plans_unified`
- `user_selected_health_plans` → points to `health_plans_unified`
- `daily_schedules` → points to `daily_schedules_unified`
- `user_daily_schedules` → points to `daily_schedules_unified`
- `subscriptions` → points to `subscriptions_unified`
- `razorpay_subscriptions` → points to `subscriptions_unified`
- `payments` → points to `payments_unified`
- `razorpay_payments` → points to `payments_unified`
- `user_profiles` → points to `user_profiles_unified`
- `onboarding_profiles` → points to `user_profiles_unified`
- `user_plan_activities` → points to `plan_activities_unified`
- `user_progress_tracking` → points to `progress_tracking_unified`

## Database Functions

### Automatic Triggers
- `update_*_updated_at()` - Auto-update timestamps
- `ensure_single_latest_health_analysis()` - One latest analysis per user
- `ensure_single_active_health_plan()` - One active plan per user
- `calculate_completion_percentage()` - Auto-calculate completion
- `set_processed_at_on_capture()` - Auto-set payment processing time
- `calculate_onboarding_completion()` - Auto-calculate onboarding progress

### Utility Functions
- `is_subscription_active()` - Check subscription status
- `calculate_activity_completion_percentage()` - Activity progress
- `set_completed_at_on_completion()` - Activity completion tracking

## Row Level Security (RLS)

All unified tables have RLS enabled with policies:
- Users can only access their own data
- Full CRUD permissions for own records
- Automatic user_id filtering

## Performance Optimizations

### Indexes
- Primary keys on all tables
- Foreign key indexes for joins
- Status and date indexes for filtering
- Composite indexes for common queries

### JSONB Fields
- Flexible data storage for complex structures
- Indexed JSONB fields for performance
- Efficient querying of nested data

### Triggers
- Automatic timestamp updates
- Data consistency enforcement
- Business logic automation

## Migration Benefits

1. **Reduced Complexity**: 14 tables → 8 tables (43% reduction)
2. **Better Performance**: Optimized indexes and relationships
3. **Data Consistency**: Single source of truth for each data type
4. **Easier Maintenance**: Unified schema and services
5. **Future-Proof**: Supports multiple payment providers
6. **Zero Breaking Changes**: Full backward compatibility
7. **No Data Loss**: All existing data preserved

## Usage Examples

### Querying Health Analysis
```sql
-- Get latest health analysis for user
SELECT * FROM health_analysis_unified 
WHERE user_id = $1 AND is_latest = true;

-- Using compatibility view (works exactly like before)
SELECT * FROM health_analysis 
WHERE user_id = $1 AND is_latest = true;
```

### Managing Health Plans
```sql
-- Get user's active health plan
SELECT * FROM health_plans_unified 
WHERE user_id = $1 AND is_active = true;

-- Using compatibility view
SELECT * FROM health_plans 
WHERE user_id = $1 AND status = 'active';
```

### Subscription Management
```sql
-- Get active subscription with plan details
SELECT s.*, sp.name as plan_name, sp.features
FROM subscriptions_unified s
JOIN subscription_plans sp ON s.plan_id = sp.id
WHERE s.user_id = $1 AND s.status = 'active';
```

## Maintenance

### Regular Tasks
- Monitor unified table performance
- Update indexes as needed
- Review and optimize JSONB queries
- Clean up old compatibility views (future)

### Monitoring
- Track query performance on unified tables
- Monitor RLS policy effectiveness
- Check data consistency between views and tables
- Validate business logic triggers

This unified schema provides a solid foundation for future growth while maintaining complete backward compatibility with existing code.
