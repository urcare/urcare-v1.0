<!-- 1a713dee-fc76-4b40-a80c-e3f4d28eb03f b6622d28-7677-49ca-856f-0a2dbf641045 -->
# Database Consolidation & Integration Plan

## Overview

Merge 14 duplicate tables (56% of database) into 8 unified tables while maintaining 100% backward compatibility with existing codebase. Zero functionality loss, zero breaking changes.

## Phase 1: Analysis & Schema Design

### 1.1 Create Unified Schema Document

- Design consolidated table schemas for:
- **health_analysis_unified** (merges: health_analysis, health_insights, user_health_scores)
- **health_plans_unified** (merges: health_plans, user_health_plans, user_selected_health_plans)
- **daily_schedules_unified** (merges: daily_schedules, user_daily_schedules)
- **subscriptions_unified** (merges: subscriptions, razorpay_subscriptions)
- **payments_unified** (merges: payments, razorpay_payments)
- **user_profiles_unified** (merges: user_profiles, onboarding_profiles)
- **plan_activities_unified** (consolidates user_plan_activities)
- **progress_tracking_unified** (consolidates user_progress_tracking)

### 1.2 Field Mapping Documentation

- Create mapping document showing old table columns → new unified columns
- Identify fields to keep, merge, or deprecate
- Document JSONB field structures for flexible data storage

## Phase 2: Database Migration Scripts

### 2.1 Create Migration Files

Create sequential migration files in `supabase/migrations/`:

**015_create_unified_health_analysis.sql**

- Create `health_analysis_unified` table with all fields from 3 tables
- Include: health_score, display_analysis, detailed_analysis, user_input, uploaded_files, voice_transcript, ai_provider, ai_model, calculation_method, factors_considered, is_latest
- Add indexes for user_id, analysis_date, is_latest
- Set up RLS policies

**016_create_unified_health_plans.sql**

- Create `health_plans_unified` table consolidating 3 plan tables
- Include: plan_name, plan_type, primary_goal, secondary_goals, plan_data, status, duration_weeks, start_date, end_date, progress_percentage, selected_plan_id, health_analysis_id, user_input, is_selected, is_active
- Add indexes for user_id, status, start_date, is_active
- Set up RLS policies

**017_create_unified_daily_schedules.sql**

- Create `daily_schedules_unified` table merging 2 schedule tables
- Include: schedule_date, day_number, schedule_data, activities, nutrition_plan, hydration_plan, is_generated, is_completed, completion_percentage, user_feedback, completion_status
- Add indexes for user_id, plan_id, schedule_date
- Set up RLS policies

**018_create_unified_subscriptions.sql**

- Create `subscriptions_unified` table combining both subscription systems
- Include: plan_id, plan_slug, status, billing_cycle, amount, currency, payment_method, payment_provider (razorpay/phonepe/stripe), current_period_start, current_period_end, trial_start, trial_end, provider_subscription_id, provider_customer_id, metadata
- Add indexes for user_id, status, payment_provider
- Set up RLS policies

**019_create_unified_payments.sql**

- Create `payments_unified` table consolidating payment records
- Include: subscription_id, plan_id, amount, currency, status, payment_method, payment_provider, provider_transaction_id, provider_payment_id, provider_response, billing_cycle, is_first_time, failure_reason, processed_at
- Add indexes for user_id, subscription_id, payment_provider, status
- Set up RLS policies

**020_create_unified_user_profiles.sql**

- Create `user_profiles_unified` table merging profile and onboarding
- Include all current user_profiles fields + onboarding_version, completed_steps, skipped_steps, completion_percentage from onboarding_profiles
- Merge country, state, district (currently duplicated)
- Add indexes for user_id, onboarding_completed
- Set up RLS policies

**021_create_unified_plan_activities.sql**

- Create `plan_activities_unified` optimizing user_plan_activities
- Clean up redundant tracking fields
- Add proper indexes

**022_create_unified_progress_tracking.sql**

- Create `progress_tracking_unified` optimizing user_progress_tracking
- Consolidate metrics into JSONB for flexibility
- Add proper indexes

### 2.2 Data Migration Scripts

**023_migrate_health_analysis_data.sql**

- Copy data from health_analysis, health_insights, health_scores to health_analysis_unified
- Handle conflicts (keep most recent)
- Validate data integrity

**024_migrate_health_plans_data.sql**

- Migrate from health_plans, user_health_plans, user_selected_health_plans
- Preserve relationships
- Validate data integrity

**025_migrate_daily_schedules_data.sql**

- Migrate from daily_schedules and user_daily_schedules
- Merge overlapping records

**026_migrate_subscriptions_data.sql**

- Migrate from both subscription tables
- Tag payment_provider correctly

**027_migrate_payments_data.sql**

- Migrate from both payment tables
- Tag payment_provider correctly

**028_migrate_user_profiles_data.sql**

- Migrate from user_profiles and onboarding_profiles
- Merge by user_id

**029_migrate_activities_and_progress.sql**

- Migrate plan_activities and progress_tracking data

### 2.3 Create Database Views for Backward Compatibility

**030_create_compatibility_views.sql**

- Create views mimicking old table structures:
- `health_analysis` → points to health_analysis_unified
- `health_insights` → points to health_analysis_unified
- `user_health_scores` → points to health_analysis_unified
- (Repeat for all deprecated tables)
- Allows existing queries to work unchanged

## Phase 3: Service Layer Updates

### 3.1 Create Unified Service Classes

**src/services/unifiedHealthAnalysisService.ts**

- Replace healthScoreService.ts logic
- Use health_analysis_unified table
- Maintain all existing function signatures
- Add migration helpers

**src/services/unifiedHealthPlanService.ts**

- Replace healthPlanService.ts logic
- Use health_plans_unified table
- Maintain all existing function signatures

**src/services/unifiedSubscriptionService.ts**

- Merge subscriptionService.ts and razorpaySubscriptionService.ts
- Use subscriptions_unified and payments_unified
- Handle multiple payment providers
- Maintain all existing function signatures

**src/services/unifiedUserProfileService.ts**

- Update userProfileService.ts
- Use user_profiles_unified
- Handle onboarding data

### 3.2 Create Service Adapter Layer

**src/services/adapters/healthServiceAdapter.ts**

- Provides backward-compatible interface
- Routes calls to new unified services
- Logs deprecation warnings (not errors)

**src/services/adapters/subscriptionServiceAdapter.ts**

- Routes to unified subscription service
- Handles both Razorpay and PhonePe

**src/services/adapters/profileServiceAdapter.ts**

- Routes to unified profile service

### 3.3 Update Existing Services (Non-Breaking)

Update these files to use unified tables:

- `src/services/healthScoreService.ts` - update table references
- `src/services/healthPlanService.ts` - update table references
- `src/services/subscriptionService.ts` - update table references
- `src/services/razorpaySubscriptionService.ts` - update table references
- `src/services/userProfileService.ts` - update table references
- `src/services/onboardingService.ts` - update table references

## Phase 4: Update Hooks & Components

### 4.1 Update React Hooks

- `src/hooks/useUserProfile.ts` - use unified table
- `src/hooks/useSubscription.ts` - use unified subscription service
- `src/hooks/useHealthGoals.ts` - use unified health analysis

### 4.2 Update Components (Query Changes Only)

No UI changes, only update data fetching:

- Components using health score data
- Components using health plans
- Components using subscription status
- Components using user profiles

## Phase 5: Testing & Validation

### 5.1 Create Test Scripts

**test/database-consolidation-test.js**

- Verify all old table views work
- Test data migration completeness
- Validate foreign key relationships
- Check RLS policies

**test/service-compatibility-test.js**

- Test all service methods still work
- Verify backward compatibility
- Check data consistency

### 5.2 Create Rollback Scripts

**rollback/001_rollback_to_original_schema.sql**

- Script to revert all changes if needed
- Restore from unified back to original tables

## Phase 6: Documentation

### 6.1 Create Documentation Files

**docs/DATABASE_CONSOLIDATION.md**

- What changed and why
- Table mapping reference
- Migration guide for developers

**docs/DATABASE_SCHEMA_V2.md**

- New unified schema documentation
- Field descriptions
- Relationships diagram

**docs/MIGRATION_GUIDE.md**

- For existing deployments
- Step-by-step migration instructions
- Rollback procedures

### 6.2 Update Existing Docs

- Update README.md with new schema info
- Update DATABASE_SCHEMA.md (if exists)

## Phase 7: Cleanup (Optional - Future)

### 7.1 Deprecation Notices

- Add deprecation warnings to old table views
- Set timeline for complete removal (e.g., 6 months)

### 7.2 Remove Old Tables (After Validation Period)

- Drop old tables after sufficient testing
- Remove compatibility views
- Clean up old service adapters

## Implementation Order

1. **Days 1-2**: Create all migration scripts (Phase 2)
2. **Day 3**: Create unified services (Phase 3.1)
3. **Day 4**: Create adapters and update existing services (Phase 3.2-3.3)
4. **Day 5**: Update hooks and components (Phase 4)
5. **Day 6**: Testing and validation (Phase 5)
6. **Day 7**: Documentation (Phase 6)

## Key Principles

✅ **Zero Breaking Changes**: All existing code continues to work
✅ **Backward Compatibility**: Views mimic old table structures
✅ **Data Preservation**: All existing data migrated safely
✅ **Incremental Migration**: Services can use new tables gradually
✅ **Easy Rollback**: Complete rollback scripts provided
✅ **Full Testing**: Comprehensive test coverage before deployment

## Success Criteria

- [ ] All 14 old tables replaced with 8 unified tables
- [ ] 100% data migrated successfully
- [ ] All existing queries work unchanged (via views)
- [ ] All service methods maintain same signatures
- [ ] No frontend code changes required
- [ ] Complete test coverage passing
- [ ] Documentation complete
- [ ] Rollback tested and ready

### To-dos

- [ ] Design unified table schemas for all 8 consolidated tables with complete field mappings
- [ ] Create 16 migration SQL files (8 table creation + 7 data migration + 1 compatibility views)
- [ ] Build 4 unified service classes (health analysis, health plans, subscriptions, user profiles)
- [ ] Create backward-compatibility adapter layer for existing services
- [ ] Update 6 existing service files to reference new unified tables
- [ ] Update 3 React hooks to use unified services
- [ ] Create comprehensive test scripts for data migration and service compatibility
- [ ] Create rollback migration scripts for safe reversion
- [ ] Write complete documentation for database consolidation and migration guide