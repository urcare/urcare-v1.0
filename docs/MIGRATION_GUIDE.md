# Database Migration Guide

## Overview

This guide provides step-by-step instructions for migrating from the old database schema to the new unified schema. The migration is designed to be **zero-downtime** and **zero-breaking-changes**.

## Prerequisites

- Access to Supabase project
- Database backup (recommended)
- Admin access to run migrations
- Test environment for validation

## Migration Steps

### Step 1: Backup Database

```bash
# Create database backup
pg_dump -h your-supabase-host -U postgres -d your-database > backup_before_migration.sql

# Or use Supabase dashboard backup feature
```

### Step 2: Run Migration Scripts

Execute the migration scripts in order:

```sql
-- 1. Create unified tables
\i supabase/migrations/015_create_unified_health_analysis.sql
\i supabase/migrations/016_create_unified_health_plans.sql
\i supabase/migrations/017_create_unified_daily_schedules.sql
\i supabase/migrations/018_create_unified_subscriptions.sql
\i supabase/migrations/019_create_unified_payments.sql
\i supabase/migrations/020_create_unified_user_profiles.sql
\i supabase/migrations/021_create_unified_plan_activities.sql
\i supabase/migrations/022_create_unified_progress_tracking.sql

-- 2. Migrate data
\i supabase/migrations/023_migrate_health_analysis_data.sql
\i supabase/migrations/024_migrate_health_plans_data.sql
\i supabase/migrations/025_migrate_daily_schedules_data.sql
\i supabase/migrations/026_migrate_subscriptions_data.sql
\i supabase/migrations/027_migrate_payments_data.sql
\i supabase/migrations/028_migrate_user_profiles_data.sql
\i supabase/migrations/029_migrate_activities_and_progress.sql

-- 3. Create compatibility views
\i supabase/migrations/030_create_compatibility_views.sql
```

### Step 3: Validate Migration

Run the test scripts to validate the migration:

```bash
# Test database consolidation
node test/database-consolidation-test.js

# Test service compatibility
node test/service-compatibility-test.js
```

### Step 4: Update Application Code

#### Option A: Gradual Migration (Recommended)

1. **Update imports** to use unified services:
```typescript
// Old imports
import { calculateHealthScore } from '@/services/healthScoreService';
import { subscriptionService } from '@/services/subscriptionService';

// New imports (with deprecation warnings)
import { calculateHealthScore } from '@/services/adapters/healthServiceAdapter';
import { subscriptionService } from '@/services/adapters/subscriptionServiceAdapter';
```

2. **Update service calls** to use unified services:
```typescript
// Old way
import { unifiedHealthAnalysisService } from '@/services/unifiedHealthAnalysisService';
import { unifiedSubscriptionService } from '@/services/unifiedSubscriptionService';

// New way (direct usage)
const healthScore = await unifiedHealthAnalysisService.calculateHealthScore(data);
const subscription = await unifiedSubscriptionService.getUserSubscription(userId);
```

#### Option B: Direct Migration

Update all service imports to use unified services directly:

```typescript
// Update all service imports
import { unifiedHealthAnalysisService } from '@/services/unifiedHealthAnalysisService';
import { unifiedHealthPlanService } from '@/services/unifiedHealthPlanService';
import { unifiedSubscriptionService } from '@/services/unifiedSubscriptionService';
import { unifiedUserProfileService } from '@/services/unifiedUserProfileService';
```

### Step 5: Test Application

1. **Test all functionality**:
   - User registration and onboarding
   - Health analysis generation
   - Health plan creation and selection
   - Subscription management
   - Payment processing
   - Daily schedule management

2. **Verify data integrity**:
   - Check that all existing data is accessible
   - Verify new data is saved correctly
   - Test data relationships and foreign keys

3. **Performance testing**:
   - Monitor query performance
   - Check for any slow queries
   - Verify indexes are working

### Step 6: Monitor and Optimize

1. **Monitor logs** for any deprecation warnings
2. **Check performance** of unified tables
3. **Optimize queries** as needed
4. **Update documentation** for team

## Rollback Procedure

If issues arise, you can rollback using:

```sql
-- Run rollback script
\i rollback/001_rollback_to_original_schema.sql
```

**Warning**: This will delete all data in unified tables!

## Post-Migration Tasks

### 1. Update Documentation
- Update API documentation
- Update database schema docs
- Update team on new structure

### 2. Clean Up (Future)
After 6 months of stable operation:
- Remove compatibility views
- Remove old service adapters
- Update all code to use unified services directly

### 3. Performance Optimization
- Monitor query performance
- Add indexes as needed
- Optimize JSONB queries
- Review and update RLS policies

## Troubleshooting

### Common Issues

#### 1. Migration Scripts Fail
```bash
# Check Supabase logs
# Verify database permissions
# Ensure all prerequisites are met
```

#### 2. Data Inconsistency
```bash
# Run data validation scripts
# Check foreign key constraints
# Verify data migration completeness
```

#### 3. Performance Issues
```bash
# Check index usage
# Monitor slow queries
# Optimize JSONB queries
```

#### 4. RLS Policy Issues
```bash
# Check RLS policies
# Verify user authentication
# Test with different user contexts
```

### Debug Commands

```sql
-- Check table existence
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public' AND table_name LIKE '%_unified';

-- Check view existence
SELECT table_name FROM information_schema.views 
WHERE table_schema = 'public';

-- Check data counts
SELECT 
  'health_analysis_unified' as table_name, 
  COUNT(*) as count 
FROM health_analysis_unified
UNION ALL
SELECT 'health_plans_unified', COUNT(*) FROM health_plans_unified
UNION ALL
SELECT 'subscriptions_unified', COUNT(*) FROM subscriptions_unified;

-- Check RLS policies
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual 
FROM pg_policies 
WHERE schemaname = 'public';
```

## Success Criteria

- [ ] All migration scripts executed successfully
- [ ] All test scripts pass
- [ ] Application functions normally
- [ ] No data loss
- [ ] Performance is acceptable
- [ ] All existing queries work
- [ ] New data is saved correctly
- [ ] Rollback procedure tested

## Support

If you encounter issues during migration:

1. Check the troubleshooting section above
2. Review Supabase logs
3. Run validation scripts
4. Contact the development team
5. Use rollback procedure if necessary

## Timeline

- **Preparation**: 1 hour
- **Migration**: 2-4 hours (depending on data size)
- **Testing**: 2-4 hours
- **Monitoring**: 24-48 hours
- **Cleanup**: 6 months (future)

Total estimated time: 1-2 days for complete migration and validation.
