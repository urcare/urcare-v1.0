# Supabase Functions Test Summary

## 🔍 Identified Functions

### RPC Functions (Database Functions)
Based on the codebase analysis, here are the RPC functions that should exist:

#### ✅ **Confirmed Functions (from SQL files)**
1. **`get_user_daily_activities(p_user_id UUID, p_activity_date DATE)`**
   - **Purpose**: Get user's daily activities for a specific date
   - **Returns**: Table with activity details (id, activity, time, duration, category, etc.)
   - **Used in**: `src/services/planActivitiesService.ts`, `src/pages/Dashboard.tsx`

2. **`save_daily_activities(p_user_id UUID, p_activity_date DATE, p_activities JSONB)`**
   - **Purpose**: Save daily activities for a user
   - **Returns**: UUID of the created activity
   - **Used in**: `src/services/planActivitiesService.ts`

3. **`mark_activity_completed(p_activity_id UUID, p_user_id UUID, p_notes TEXT)`**
   - **Purpose**: Mark an activity as completed
   - **Returns**: Boolean (true if updated)
   - **Used in**: `src/services/planActivitiesService.ts`

4. **`mark_old_analyses_not_latest(p_user_id UUID)`**
   - **Purpose**: Mark old health analyses as not latest
   - **Returns**: Void
   - **Used in**: Health analysis workflows

#### ❓ **Functions Referenced in Code (May Not Exist)**
1. **`get_user_subscription(p_user_id UUID)`**
   - **Purpose**: Get user's subscription details
   - **Used in**: `src/services/subscriptionService.ts`, `src/hooks/useSubscription.ts`
   - **Status**: ⚠️ **May not be defined in database**

2. **`create_subscription(p_user_id, p_plan_slug, p_billing_cycle, p_razorpay_payment_id, p_razorpay_subscription_id)`**
   - **Purpose**: Create a new subscription
   - **Used in**: `src/services/subscriptionService.ts`, `src/pages/AdminPayments.tsx`
   - **Status**: ⚠️ **May not be defined in database**

3. **`record_payment(p_user_id, p_plan_id, p_amount, p_currency, p_payment_method, p_payment_id)`**
   - **Purpose**: Record a payment
   - **Used in**: `src/services/subscriptionService.ts`
   - **Status**: ⚠️ **May not be defined in database**

4. **`can_access_feature(p_user_id UUID, p_feature TEXT)`**
   - **Purpose**: Check if user can access a feature
   - **Used in**: `src/hooks/useSubscription.ts`
   - **Status**: ⚠️ **May not be defined in database**

5. **`update_subscription_usage(p_user_id UUID, p_feature TEXT)`**
   - **Purpose**: Update subscription usage
   - **Used in**: `src/hooks/useSubscription.ts`
   - **Status**: ⚠️ **May not be defined in database**

6. **`get_onboarding_data(p_user_id UUID)`**
   - **Purpose**: Get user's onboarding data
   - **Used in**: `src/services/onboardingService.ts`
   - **Status**: ⚠️ **May not be defined in database**

7. **`save_health_report(p_user_id, p_report_name, p_file_path, p_file_size, p_mime_type)`**
   - **Purpose**: Save health report
   - **Used in**: `src/services/onboardingService.ts`
   - **Status**: ⚠️ **May not be defined in database**

### Edge Functions (Serverless Functions)
Located in `supabase/functions/`:

#### ✅ **Confirmed Edge Functions**
1. **`health-score`**
   - **Purpose**: Calculate health score based on user data
   - **Used in**: `src/services/healthAnalysisService.ts`, `src/components/YourHealthPopup.tsx`

2. **`health-plans`**
   - **Purpose**: Generate health plans for users
   - **Used in**: `src/services/healthPlanService.ts`

3. **`plan-activities`**
   - **Purpose**: Generate activities for health plans
   - **Used in**: `src/services/planActivitiesService.ts`, `src/services/healthSystemService.ts`

4. **`phonepe-sandbox-pay`**
   - **Purpose**: Process PhonePe sandbox payments
   - **Used in**: `src/services/phonepeSandboxService.ts`

5. **`create-razorpay-order`**
   - **Purpose**: Create Razorpay payment orders
   - **Used in**: `src/components/payment/RazorpayPaymentButton.tsx`

6. **`verify-razorpay-payment`**
   - **Purpose**: Verify Razorpay payments
   - **Used in**: `src/components/payment/RazorpayPaymentButton.tsx`

#### 📱 **PhonePe Functions**
7. **`phonepe-create-order`**
8. **`phonepe-payment-callback`**
9. **`phonepe-payment-initiate`**
10. **`phonepe-payment-options`**
11. **`phonepe-payment-status`**
12. **`phonepe-refund`**
13. **`phonepe-refund-callback`**
14. **`phonepe-status`**
15. **`phonepe-vpa-validate`**

16. **`test-claude-keys`** - Testing function

## 🧪 How to Test Functions

### Method 1: Use the HTML Test Suite
1. Open `test-functions.html` in your browser
2. Enter your Supabase credentials
3. Enter a test user ID
4. Click the test buttons to run individual tests

### Method 2: Use Browser Console
1. Open your app in browser
2. Open Developer Console (F12)
3. Copy and paste the test functions from `test-functions-direct.js`
4. Run tests manually:
```javascript
// Test a specific RPC function
testRPCFunction(supabase, 'get_user_daily_activities', 
  { p_user_id: 'your-user-id', p_activity_date: '2024-01-15' }, 
  'Get daily activities');

// Test a specific Edge function
testEdgeFunction(supabase, 'health-score', 
  { user_id: 'your-user-id', health_data: { test: 'data' } }, 
  'Calculate health score');
```

### Method 3: Use Node.js Script
1. Update credentials in `test-functions-simple.js`
2. Run: `node test-functions-simple.js`

## 📊 Expected Data Types

### RPC Function Returns:
- **`get_user_daily_activities`**: Array of activity objects
- **`save_daily_activities`**: UUID string
- **`mark_activity_completed`**: Boolean
- **`get_user_subscription`**: Single subscription object or null
- **`can_access_feature`**: Boolean

### Edge Function Returns:
- **`health-score`**: Object with score and analysis
- **`health-plans`**: Array of health plan objects
- **`plan-activities`**: Array of activity objects
- **Payment functions**: Payment status and transaction details

## ⚠️ Potential Issues

1. **Missing RPC Functions**: Several subscription-related functions may not be defined in the database
2. **Permission Issues**: Some functions may not have proper RLS policies
3. **Parameter Mismatches**: Function signatures might not match what the code expects
4. **Edge Function Errors**: Edge functions might fail due to missing environment variables or dependencies

## 🔧 Next Steps

1. **Test all functions** using the provided test suite
2. **Create missing RPC functions** if they don't exist
3. **Fix any permission issues** with RLS policies
4. **Update function signatures** if there are mismatches
5. **Test Edge functions** with proper environment setup

