# Authentication and Routing Flow Guide

## Overview

This document explains the updated authentication and routing flow for the UrCare application. The flow ensures proper user onboarding, subscription management, and access control.

## User Flow

### First-Time Users

1. **Landing Page** (`/`) - User starts here
2. **Authentication** (`/auth`) - User signs up/logs in
3. **Onboarding** (`/onboarding`) - User completes profile setup
4. **Custom Plan** (`/custom-plan`) - User generates their health plan
5. **Paywall** (`/paywall`) - User subscribes to continue
6. **Dashboard** (`/dashboard`) - User accesses the main app

### Returning Users

1. **Landing Page** (`/`) - User starts here
2. **Automatic Redirect** - System checks user status:
   - If onboarding incomplete → `/onboarding`
   - If no subscription → `/paywall`
   - If everything complete → `/dashboard`

## Route Protection

### Public Routes

- `/` - Landing page
- `/auth` - Authentication callback
- `/auth/callback` - OAuth callback

### Protected Routes (Require Authentication)

- `/welcome-screen` - Welcome screen
- `/onboarding` - User onboarding

### Protected Routes (Require Onboarding + Authentication)

- `/custom-plan` - Health plan generation
- `/paywall` - Subscription page
- `/subscription` - Subscription management

### Protected Routes (Require Subscription + Onboarding + Authentication)

- `/dashboard` - Main dashboard
- `/health-plan` - Health plan view
- `/diet` - Diet management
- `/workout` - Workout plans
- `/planner` - Activity planner

## Configuration

### Subscription Bypass (Trial Period)

The app includes a trial bypass mechanism that can be toggled in `src/config/subscription.ts`:

```typescript
export const SUBSCRIPTION_CONFIG = {
  // Set to true to bypass subscription checks (for trial period)
  // Set to false to enforce subscription requirements
  TRIAL_BYPASS_ENABLED: true,

  // Trial period duration in days
  TRIAL_DURATION_DAYS: 3,

  // Whether to show paywall even during trial period
  SHOW_PAYWALL_DURING_TRIAL: true,

  // Features that require subscription
  SUBSCRIPTION_REQUIRED_FEATURES: [
    "dashboard",
    "health-plan",
    "diet",
    "workout",
    "planner",
  ],
} as const;
```

### Enabling Subscription Enforcement

To enforce subscription requirements:

1. Set `TRIAL_BYPASS_ENABLED: false` in `src/config/subscription.ts`
2. Ensure your subscription service is properly configured
3. Test the flow to ensure users are redirected to paywall when needed

## Key Components

### ProtectedRoute Component

The `ProtectedRoute` component handles all route protection logic:

```typescript
<ProtectedRoute requireOnboardingComplete={true} requireSubscription={true}>
  <Dashboard />
</ProtectedRoute>
```

### InitialRouteHandler Component

Automatically redirects authenticated users from the landing page to the appropriate route based on their status.

### Subscription Status Check

The `checkSubscriptionStatus` function:

1. Checks if user has an active subscription
2. Respects the trial bypass setting
3. Handles errors gracefully (fails open during development)

## Error Handling

- **Authentication Errors**: Redirect to `/auth`
- **Onboarding Incomplete**: Redirect to `/onboarding`
- **No Subscription**: Redirect to `/paywall`
- **Service Errors**: Allow access (fail open) during development

## Testing the Flow

### Test First-Time User Flow

1. Clear browser storage
2. Go to `/`
3. Sign up/log in
4. Complete onboarding
5. Generate health plan
6. Subscribe via paywall
7. Access dashboard

### Test Returning User Flow

1. Log in with existing account
2. Go to `/`
3. Verify automatic redirect to appropriate page

### Test Subscription Enforcement

1. Set `TRIAL_BYPASS_ENABLED: false`
2. Try accessing `/dashboard` without subscription
3. Verify redirect to `/paywall`

## Troubleshooting

### Common Issues

1. **Infinite Redirects**: Check that subscription service is working
2. **Users Stuck on Landing**: Verify authentication state
3. **Subscription Not Recognized**: Check subscription service configuration

### Debug Mode

Enable debug logging by checking browser console for:

- "Trial bypass enabled" messages
- Subscription status check results
- Route protection decisions

## Future Enhancements

1. **Graceful Subscription Expiry**: Handle expired subscriptions
2. **Feature-Level Access Control**: Different features for different plans
3. **Subscription Upgrade/Downgrade**: Handle plan changes
4. **Offline Support**: Cache subscription status for offline use
