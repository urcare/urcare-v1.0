# Routing and Database Fixes

## Issues Fixed

### 1. Missing Razorpay Tables Error
**Problem**: The application was trying to query `razorpay_subscriptions` table that didn't exist, causing 404 errors and infinite loops.

**Solution**: 
- Created `razorpay_subscriptions` and `razorpay_payments` tables
- Added proper error handling in `razorpaySubscriptionService.ts` to gracefully handle missing tables
- Created migration files for both Supabase and standalone execution

### 2. Incorrect Authentication Routing Logic
**Problem**: The routing logic was checking subscription status before onboarding completion, causing users to be redirected incorrectly.

**Solution**: Updated `SubscriptionFlowHandler.tsx` to follow the correct flow:
1. **First**: Check if onboarding is completed
2. **Second**: Check subscription status
3. **Third**: Route accordingly

## New Routing Flow

### For New Users (First Time Login):
1. **Onboarding not completed** → Redirect to `/onboarding`
2. **Onboarding completed** → Redirect to `/health-assessment`
3. **Health assessment completed + No subscription** → Redirect to `/paywall`
4. **Health assessment completed + Active subscription** → Redirect to `/dashboard`

### For Returning Users:
1. **Onboarding not completed** → Redirect to `/onboarding`
2. **Onboarding completed + No subscription** → Redirect to `/health-assessment`
3. **Onboarding completed + Active subscription** → Redirect to `/dashboard`

## Files Modified

### Database Migrations
- `supabase/migrations/017_create_razorpay_tables.sql` - Creates Razorpay tables
- `run_razorpay_migration.sql` - Standalone script to create Razorpay tables

### Frontend Components
- `src/components/SubscriptionFlowHandler.tsx` - Fixed routing logic
- `src/services/razorpaySubscriptionService.ts` - Added graceful error handling

## Database Schema

### razorpay_subscriptions Table
```sql
CREATE TABLE razorpay_subscriptions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  plan_slug TEXT NOT NULL,
  billing_cycle TEXT NOT NULL CHECK (billing_cycle IN ('monthly', 'yearly')),
  payment_id TEXT NOT NULL,
  order_id TEXT,
  amount DECIMAL(10,2) NOT NULL,
  currency TEXT NOT NULL DEFAULT 'INR',
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'expired', 'cancelled')),
  start_date TIMESTAMPTZ NOT NULL,
  end_date TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

### razorpay_payments Table
```sql
CREATE TABLE razorpay_payments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  payment_id TEXT NOT NULL UNIQUE,
  order_id TEXT,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  amount DECIMAL(10,2) NOT NULL,
  currency TEXT NOT NULL DEFAULT 'INR',
  status TEXT NOT NULL CHECK (status IN ('captured', 'failed', 'pending')),
  plan_slug TEXT NOT NULL,
  billing_cycle TEXT NOT NULL CHECK (billing_cycle IN ('monthly', 'yearly')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

## How to Apply Fixes

### 1. Run Database Migration
Execute the SQL migration in your Supabase SQL Editor:
```sql
-- Copy and paste the contents of run_razorpay_migration.sql
```

### 2. Deploy Frontend Changes
The frontend changes are already applied and will take effect immediately.

## Error Handling Improvements

### Graceful Table Missing Handling
The `razorpaySubscriptionService` now handles missing tables gracefully:
- Returns `false` for subscription checks when table doesn't exist
- Logs warnings instead of errors
- Prevents infinite loops and 404 errors

### Improved Error Recovery
The `SubscriptionFlowHandler` now has better error recovery:
- Checks onboarding status first
- Falls back to appropriate routes on errors
- Prevents users from getting stuck in redirect loops

## Testing the Fix

1. **New User Flow**:
   - Sign up with new account
   - Should be redirected to `/onboarding`
   - Complete onboarding
   - Should be redirected to `/health-assessment`
   - Complete health assessment
   - Should be redirected to `/paywall`

2. **Returning User Flow**:
   - Login with existing account
   - If onboarding not completed → `/onboarding`
   - If onboarding completed but no subscription → `/health-assessment`
   - If onboarding completed and has subscription → `/dashboard`

3. **Error Handling**:
   - No more 404 errors in console
   - No more infinite redirect loops
   - Graceful fallbacks for missing tables

## Benefits

✅ **Fixed 404 Errors**: No more missing table errors
✅ **Correct Routing**: Users follow the proper flow sequence
✅ **Better UX**: No more infinite redirects or getting stuck
✅ **Error Recovery**: Graceful handling of edge cases
✅ **Database Integrity**: Proper table structure with constraints and indexes
✅ **Security**: Row Level Security (RLS) policies implemented
