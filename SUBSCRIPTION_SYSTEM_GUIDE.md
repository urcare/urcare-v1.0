# Subscription System Guide

This guide explains how to use the comprehensive subscription and plan checking system for the UrCare healthcare application.

## 🗄️ Database Setup

### 1. Run the Migration

First, run the database migration to create the subscription tables:

```bash
# Apply the migration to your Supabase database
supabase db push
```

This will create the following tables:
- `subscription_plans` - Available subscription plans
- `subscriptions` - User subscriptions
- `subscription_usage` - Feature usage tracking
- `subscription_invoices` - Billing invoices

### 2. Default Plans

The migration automatically creates three default plans:
- **Basic** ($12/month, $99.99/year) - First-time: $10/month, $99.99/year
- **Family** ($25/month, $199.99/year) - First-time: $15/month, $199.99/year - Most Popular
- **Elite** ($40/month, $399.99/year) - First-time: $20/month, $399.99/year

### 3. First-Time Pricing

The system supports special pricing for new users:
- Automatically detects if a user is eligible for first-time pricing
- Applies discounted rates for first-time subscribers
- Tracks user subscription history to determine eligibility

## 🔧 Core Components

### 1. Subscription Service (`src/services/subscriptionService.ts`)

The main service for handling subscription operations:

```typescript
import { subscriptionService } from '@/services/subscriptionService';

// Check if user has active subscription
const hasActive = await subscriptionService.hasActiveSubscription(userId);

// Get user's current subscription
const subscription = await subscriptionService.getUserSubscription(userId);

// Create a new subscription
const newSubscription = await subscriptionService.createSubscription(userId, {
  planId: 'basic',
  billingCycle: 'monthly',
  trialDays: 7
});

// Track feature usage
await subscriptionService.trackFeatureUsage(subscriptionId, 'ai_consultations', 1);

// Check if user can access a feature
const canAccess = await subscriptionService.canAccessFeature(userId, 'health_reports');

// Check first-time pricing eligibility
const isFirstTime = await subscriptionService.isEligibleForFirstTimePricing(userId);

// Get pricing for user (includes first-time discounts)
const price = await subscriptionService.getPricingForUser(userId, 'basic', 'monthly');
```

### 2. React Hooks (`src/hooks/useSubscription.ts`)

Easy-to-use hooks for React components:

```typescript
import { useSubscription, useFeatureAccess, useFeatureUsage } from '@/hooks/useSubscription';

// Main subscription hook
const {
  hasActiveSubscription,
  subscription,
  subscriptionStatus,
  usageMetrics,
  canAccessFeature,
  trackFeatureUsage
} = useSubscription();

// Feature-specific access hook
const { canAccess, hasSubscription, isLoading } = useFeatureAccess('ai_consultations');

// Feature usage tracking hook
const {
  currentUsage,
  limit,
  percentageUsed,
  isOverLimit,
  trackUsage
} = useFeatureUsage('health_reports');
```

### 3. Feature Guard Component (`src/components/subscription/FeatureGuard.tsx`)

Protect premium features with automatic upgrade prompts:

```typescript
import { FeatureGuard } from '@/components/subscription/FeatureGuard';

// Wrap any premium feature
<FeatureGuard featureName="ai_consultations">
  <YourPremiumComponent />
</FeatureGuard>

// With custom fallback
<FeatureGuard 
  featureName="health_reports" 
  fallback={<CustomUpgradePrompt />}
>
  <HealthReportsComponent />
</FeatureGuard>
```

### 4. Subscription Manager (`src/components/subscription/SubscriptionManager.tsx`)

Display subscription status and management options:

```typescript
import { SubscriptionManager } from '@/components/subscription/SubscriptionManager';

// Full subscription management
<SubscriptionManager 
  showUsageMetrics={true}
  showPlanDetails={true}
  showActions={true}
/>

// Minimal display
<SubscriptionManager 
  showUsageMetrics={false}
  showPlanDetails={false}
  showActions={false}
/>
```

## 🚀 Usage Examples

### 1. Basic Subscription Check

```typescript
import { useSubscription } from '@/hooks/useSubscription';

const MyComponent = () => {
  const { hasActiveSubscription, subscription, isLoading } = useSubscription();

  if (isLoading) return <div>Loading...</div>;

  if (!hasActiveSubscription) {
    return <div>Please subscribe to access premium features</div>;
  }

  return (
    <div>
      <h2>Welcome to {subscription?.plan_name} Plan!</h2>
      {/* Your premium content */}
    </div>
  );
};
```

### 2. Feature Access Control

```typescript
import { useFeatureAccess } from '@/hooks/useSubscription';

const AIHealthComponent = () => {
  const { canAccess, hasSubscription, isLoading } = useFeatureAccess('ai_consultations');

  if (isLoading) return <div>Loading...</div>;

  if (!canAccess) {
    return (
      <div>
        <h3>Upgrade Required</h3>
        <p>This feature requires a Basic plan or higher</p>
        <button onClick={() => navigate('/paywall')}>
          View Plans
        </button>
      </div>
    );
  }

  return (
    <div>
      <h3>AI Health Consultations</h3>
      {/* AI consultation interface */}
    </div>
  );
};
```

### 3. Usage Tracking

```typescript
import { useFeatureUsage } from '@/hooks/useSubscription';

const HealthReportsComponent = () => {
  const { currentUsage, limit, percentageUsed, trackUsage } = useFeatureUsage('health_reports');

  const handleGenerateReport = async () => {
    // Generate the report
    const report = await generateHealthReport();
    
    // Track usage
    await trackUsage(1);
    
    // Show success message
    toast.success('Health report generated successfully!');
  };

  return (
    <div>
      <h3>Health Reports</h3>
      <p>Usage: {currentUsage} / {limit || '∞'}</p>
      <button 
        onClick={handleGenerateReport}
        disabled={limit && currentUsage >= limit}
      >
        Generate Report
      </button>
    </div>
  );
};
```

### 4. Subscription Management

```typescript
import { subscriptionService } from '@/services/subscriptionService';

const SubscriptionSettings = () => {
  const handleUpgrade = async () => {
    try {
      await subscriptionService.updateSubscription(subscriptionId, {
        planId: 'family',
        billingCycle: 'annual'
      });
      toast.success('Plan upgraded successfully!');
    } catch (error) {
      toast.error('Failed to upgrade plan');
    }
  };

  const handleCancel = async () => {
    try {
      await subscriptionService.cancelSubscription(subscriptionId);
      toast.success('Subscription canceled');
    } catch (error) {
      toast.error('Failed to cancel subscription');
    }
  };

  return (
    <div>
      <button onClick={handleUpgrade}>Upgrade to Family Plan</button>
      <button onClick={handleCancel}>Cancel Subscription</button>
    </div>
  );
};
```

## 📊 Feature Limits

The system includes predefined feature limits for each plan:

| Feature | Basic | Family | Elite |
|---------|-------|--------|-------|
| AI Consultations | 5/month | 20/month | Unlimited |
| Health Reports | 3/month | 10/month | Unlimited |
| Meal Plans | 7/month | 30/month | Unlimited |
| Family Members | 1 | 5 | 10 |
| Storage | 1GB | 5GB | 20GB |

## 🔒 Security Features

### Row Level Security (RLS)

All subscription tables have RLS policies:
- Users can only see their own subscriptions
- Users can only access their own usage data
- Plan data is read-only for authenticated users

### Database Functions

The system includes PostgreSQL functions:
- `has_active_subscription(user_uuid)` - Check if user has active subscription
- `get_user_subscription(user_uuid)` - Get user's current subscription with plan details

## 🎯 Best Practices

### 1. Always Check Subscription Status

```typescript
// Good: Check subscription before rendering premium content
const { hasActiveSubscription, isLoading } = useSubscription();

if (isLoading) return <LoadingSpinner />;
if (!hasActiveSubscription) return <UpgradePrompt />;

return <PremiumContent />;
```

### 2. Track Feature Usage

```typescript
// Good: Track usage when features are used
const handleUseFeature = async () => {
  try {
    // Use the feature
    await performFeatureAction();
    
    // Track usage
    await trackFeatureUsage('feature_name', 1);
    
    toast.success('Feature used successfully!');
  } catch (error) {
    toast.error('Failed to use feature');
  }
};
```

### 3. Use Feature Guards

```typescript
// Good: Use FeatureGuard for automatic upgrade prompts
<FeatureGuard featureName="premium_feature">
  <PremiumFeatureComponent />
</FeatureGuard>
```

### 4. Handle Loading States

```typescript
// Good: Always handle loading states
const { isLoading, hasActiveSubscription } = useSubscription();

if (isLoading) {
  return <div>Checking subscription...</div>;
}
```

## 🛠️ Customization

### Adding New Features

1. Update the feature limits in `subscriptionService.ts`:
```typescript
private getFeatureLimit(planSlug: string, featureName: string): number | null {
  const featureLimits: FeatureLimits = {
    'your_new_feature': {
      basic: { limit: 5, resetPeriod: 'monthly' },
      family: { limit: 20, resetPeriod: 'monthly' },
      elite: { limit: -1, resetPeriod: 'monthly' }
    }
  };
  // ... rest of the function
}
```

2. Add feature info in `FeatureGuard.tsx`:
```typescript
const getFeatureInfo = (featureName: string): FeatureInfo => {
  const featureMap: Record<string, FeatureInfo> = {
    'your_new_feature': {
      name: 'Your New Feature',
      description: 'Description of your new feature',
      icon: YourIcon,
      requiredPlan: 'Basic',
      planIcon: Shield
    }
  };
  // ... rest of the function
};
```

### Adding New Plans

1. Insert the plan into the database:
```sql
INSERT INTO subscription_plans (
  name, slug, description, price_monthly, price_annual, 
  features, max_users, max_storage_gb, is_popular, sort_order
) VALUES (
  'Premium', 'premium', 'Premium plan description', 
  50.00, 499.99, 
  '["feature1", "feature2", "feature3"]', 
  15, 50, false, 4
);
```

2. Update the plan levels in `subscriptionUtils.ts`:
```typescript
const planLevels: Record<string, number> = {
  'basic': 1,
  'family': 2,
  'elite': 3,
  'premium': 4  // Add your new plan
};
```

## 🧪 Testing

### Testing Subscription Logic

```typescript
import { subscriptionService } from '@/services/subscriptionService';

// Test subscription creation
const testSubscription = await subscriptionService.createSubscription(userId, {
  planId: 'basic',
  billingCycle: 'monthly',
  trialDays: 7
});

// Test feature access
const canAccess = await subscriptionService.canAccessFeature(userId, 'ai_consultations');

// Test usage tracking
await subscriptionService.trackFeatureUsage(subscriptionId, 'ai_consultations', 1);
```

### Testing Components

```typescript
import { render, screen } from '@testing-library/react';
import { SubscriptionManager } from '@/components/subscription/SubscriptionManager';

// Mock the subscription hook
jest.mock('@/hooks/useSubscription', () => ({
  useSubscription: () => ({
    hasActiveSubscription: true,
    subscription: { plan_name: 'Basic', plan_slug: 'basic' },
    isLoading: false
  })
}));

test('renders subscription manager', () => {
  render(<SubscriptionManager />);
  expect(screen.getByText('Basic Plan')).toBeInTheDocument();
});
```

## 📈 Monitoring

### Usage Analytics

Track subscription metrics:
- Active subscriptions by plan
- Feature usage patterns
- Churn rate analysis
- Revenue tracking

### Error Monitoring

Monitor subscription-related errors:
- Failed subscription creations
- Payment processing errors
- Usage tracking failures

## 🔄 Migration Guide

### From Existing System

If you have an existing subscription system:

1. **Data Migration**: Export existing subscription data and map to new schema
2. **API Updates**: Replace old subscription APIs with new service calls
3. **Component Updates**: Replace old subscription components with new ones
4. **Testing**: Verify all subscription functionality works correctly

### Rollback Plan

If issues arise:
1. Keep old subscription tables as backup
2. Maintain backward compatibility during transition
3. Have rollback scripts ready
4. Monitor closely during initial deployment

## 📞 Support

For questions or issues with the subscription system:

1. Check the database migration logs
2. Verify RLS policies are correctly applied
3. Test with different user roles
4. Review subscription service error logs

## 💳 Payment Integration

The system now includes full Razorpay integration:

### Features
- ✅ Secure payment processing
- ✅ First-time pricing support
- ✅ Payment verification
- ✅ Webhook handling
- ✅ Invoice generation
- ✅ Error handling

### Setup
See `RAZORPAY_SETUP.md` for complete setup instructions.

### Usage
```typescript
import { useRazorpay } from '@/hooks/useRazorpay';

const { initiatePayment, loading, error } = useRazorpay();

// Initiate payment
await initiatePayment('basic', 'monthly');
```

## 🎯 Next Steps

1. **Subscription Renewal**: Add automatic renewal logic
2. **Usage Analytics**: Implement detailed usage tracking
3. **Admin Dashboard**: Create admin interface for subscription management
4. **Email Notifications**: Add subscription-related email notifications

The subscription system is designed to be robust, scalable, and easy to integrate. Follow these guidelines to ensure smooth implementation and maintenance. 