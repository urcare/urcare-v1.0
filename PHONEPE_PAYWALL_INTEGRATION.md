# PhonePe Paywall Integration Guide

This guide explains how to integrate PhonePe payment gateway with your existing paywall system in URCare.

## Overview

The PhonePe integration has been seamlessly integrated with your existing paywall system, providing:

- **Seamless User Experience**: Users can upgrade directly from paywall modals
- **Multiple Payment Methods**: Cards, UPI, Net Banking, Wallets
- **Test Mode Support**: UAT simulator integration for development
- **Production Ready**: Environment toggle for live payments
- **Feature Gating**: Automatic subscription checks and feature access control

## Components Updated

### 1. PaywallModal.tsx
- **Enhanced**: Now includes PhonePe payment integration
- **Features**: 
  - Triggers PhonePe payment modal on upgrade
  - Maintains existing UI/UX
  - Handles payment success/failure callbacks

### 2. PhonePePaywallModal.tsx (New)
- **Purpose**: Comprehensive payment modal with PhonePe integration
- **Features**:
  - Plan selection with pricing
  - Multiple payment methods
  - Test credentials integration
  - Environment indicators
  - Payment method details collection

### 3. PaymentForm.tsx
- **Updated**: Now uses PhonePe service instead of legacy payment service
- **Features**:
  - PhonePe API integration
  - Payment status polling
  - Error handling and user feedback

## Integration Flow

### 1. Feature Access Check
```typescript
// FeatureGuard automatically checks subscription status
<FeatureGuard featureName="ai_consultations">
  <AIConsultationComponent />
</FeatureGuard>
```

### 2. Paywall Display
```typescript
// PaywallModal shows when user lacks access
<PaywallModal
  isOpen={showModal}
  onClose={handleClose}
  onUpgrade={handleUpgrade}
  featureName="AI Health Consultations"
  currentPlan="Free"
/>
```

### 3. Payment Processing
```typescript
// PhonePe payment initiation
const result = await PhonePeService.initiatePayment({
  user_id: user.id,
  plan_id: planId,
  billing_cycle: "monthly",
  amount: 99,
  payment_method: "PAY_PAGE",
  // ... other parameters
});
```

### 4. Payment Success
```typescript
// Automatic subscription creation after successful payment
// User gains access to premium features immediately
```

## Usage Examples

### Basic Feature Guard
```typescript
import FeatureGuard from "@/components/paywall/FeatureGuard";

function MyComponent() {
  return (
    <FeatureGuard featureName="ai_consultations">
      <div>
        <h2>AI Health Consultations</h2>
        <p>Get personalized health advice from AI</p>
        {/* This content is only shown to premium users */}
      </div>
    </FeatureGuard>
  );
}
```

### Custom Paywall Modal
```typescript
import PaywallModal from "@/components/paywall/PaywallModal";

function MyComponent() {
  const [showPaywall, setShowPaywall] = useState(false);

  return (
    <>
      <button onClick={() => setShowPaywall(true)}>
        Access Premium Feature
      </button>
      
      <PaywallModal
        isOpen={showPaywall}
        onClose={() => setShowPaywall(false)}
        onUpgrade={() => {
          // Handle successful upgrade
          setShowPaywall(false);
          // Refresh user subscription status
        }}
        featureName="Advanced Analytics"
        currentPlan="Free"
      />
    </>
  );
}
```

### Direct PhonePe Integration
```typescript
import PhonePePaywallModal from "@/components/paywall/PhonePePaywallModal";

function SubscriptionPage() {
  const [showPayment, setShowPayment] = useState(false);

  return (
    <PhonePePaywallModal
      isOpen={showPayment}
      onClose={() => setShowPayment(false)}
      onUpgrade={() => {
        // Handle successful payment
        setShowPayment(false);
        // Redirect to dashboard or show success message
      }}
      featureName="Premium Subscription"
      currentPlan="Free"
      onPaymentSuccess={(paymentData) => {
        console.log("Payment successful:", paymentData);
      }}
      onPaymentError={(error) => {
        console.error("Payment failed:", error);
      }}
    />
  );
}
```

## Payment Methods Supported

### 1. All Payment Methods (PAY_PAGE)
- **Description**: Redirects to PhonePe payment page with all options
- **Use Case**: Default option for most users
- **No additional details required**

### 2. UPI Intent (UPI_INTENT)
- **Description**: Opens UPI apps directly
- **Use Case**: Users who prefer UPI apps
- **Details**: Target app selection (PhonePe, GPay, Paytm, BHIM)

### 3. UPI Collect (UPI_COLLECT)
- **Description**: Pay with UPI ID
- **Use Case**: Users who want to enter UPI ID manually
- **Details**: VPA (Virtual Payment Address) with validation

### 4. UPI QR (UPI_QR)
- **Description**: Scan QR code to pay
- **Use Case**: Mobile users who prefer QR scanning
- **No additional details required**

### 5. Card Payment (CARD)
- **Description**: Credit/Debit card payments
- **Use Case**: Users who prefer card payments
- **Details**: Card number, expiry, CVV

### 6. Net Banking (NET_BANKING)
- **Description**: Direct bank transfer
- **Use Case**: Users who prefer net banking
- **Details**: Bank selection

## Test Mode Integration

### UAT Environment
```typescript
// Automatically enabled in development
const environmentInfo = getEnvironmentSettings();
console.log(environmentInfo.isProduction); // false in UAT
console.log(environmentInfo.testCredentials); // Available in UAT
```

### Test Credentials
```typescript
// Test card details
const testCard = {
  number: "4622943126146407",
  type: "DEBIT_CARD",
  issuer: "VISA",
  expiryMonth: 12,
  expiryYear: 2023,
  cvv: "936"
};

// Test UPI details
const testUPI = {
  vpa: "test@upi",
  targetApps: ["phonepe", "gpay", "paytm", "bhim"]
};

// Test net banking
const testNetBanking = {
  username: "Test",
  password: "Test"
};
```

## Environment Configuration

### Development (UAT)
```bash
VITE_PHONEPE_ENVIRONMENT=uat
PHONEPE_MID=PHONEPEPGUAT
PHONEPE_KEY=c817ffaf-8471-48b5-a7e2-a27e5b7efbd3
PHONEPE_BASE_URL=https://api-preprod.phonepe.com/apis/pg-sandbox
```

### Production
```bash
VITE_PHONEPE_ENVIRONMENT=production
PHONEPE_MID=your_production_merchant_id
PHONEPE_KEY=your_production_key
PHONEPE_API_KEY=your_production_api_key
PHONEPE_BASE_URL=https://api.phonepe.com/apis/pg
```

## Subscription Management

### Automatic Feature Access
```typescript
// useSubscription hook automatically manages access
const { hasActiveSubscription, canAccessFeature } = useSubscription();

// Check specific feature access
const canAccessAI = await canAccessFeature("ai_consultations");
const canAccessAnalytics = await canAccessFeature("advanced_analytics");
```

### Manual Subscription Check
```typescript
// Check if user has active subscription
const { data: hasActive } = await supabase.rpc("has_active_subscription", {
  p_user_id: user.id
});

// Get subscription details
const { data: subscription } = await supabase.rpc("get_user_subscription", {
  p_user_id: user.id
});
```

## Error Handling

### Payment Errors
```typescript
try {
  const result = await PhonePeService.initiatePayment(paymentData);
  // Handle success
} catch (error) {
  // Handle different error types
  if (error.message.includes("User not found")) {
    // Handle authentication error
  } else if (error.message.includes("Plan not found")) {
    // Handle plan selection error
  } else {
    // Handle general payment error
  }
}
```

### Network Errors
```typescript
// Automatic retry logic for network failures
const retryPayment = async (maxRetries = 3) => {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await PhonePeService.initiatePayment(paymentData);
    } catch (error) {
      if (i === maxRetries - 1) throw error;
      await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)));
    }
  }
};
```

## Security Features

### 1. HMAC Signing
- All requests to PhonePe are signed with HMAC-SHA256
- Prevents tampering with payment data
- Automatic signature verification

### 2. Input Validation
- VPA format validation for UPI payments
- Card details validation
- Amount validation

### 3. Environment Separation
- UAT and Production environments are completely separate
- Test credentials only available in UAT
- Production credentials required for live payments

## Monitoring and Analytics

### Payment Tracking
```typescript
// Track payment events
const trackPaymentEvent = (event: string, data: any) => {
  // Send to analytics service
  analytics.track(event, {
    ...data,
    timestamp: new Date().toISOString(),
    user_id: user.id
  });
};

// Usage
trackPaymentEvent("payment_initiated", {
  plan_id: planId,
  amount: amount,
  payment_method: paymentMethod
});
```

### Subscription Analytics
```typescript
// Get subscription analytics
const analytics = await PhonePeService.getSubscriptionAnalytics();
console.log(analytics);
```

## Deployment Checklist

### 1. Environment Setup
- [ ] Set environment variables in Supabase
- [ ] Configure frontend environment variables
- [ ] Deploy Edge Functions
- [ ] Test with UAT credentials

### 2. Database Setup
- [ ] Ensure subscription tables exist
- [ ] Verify RLS policies are in place
- [ ] Test database functions

### 3. Testing
- [ ] Test all payment methods
- [ ] Verify webhook processing
- [ ] Test subscription creation
- [ ] Verify feature access controls

### 4. Production
- [ ] Update to production credentials
- [ ] Test with small amounts
- [ ] Monitor payment success rates
- [ ] Set up monitoring and alerts

## Troubleshooting

### Common Issues

1. **Payment Initiation Fails**
   - Check environment variables
   - Verify PhonePe credentials
   - Check network connectivity

2. **Callback Not Received**
   - Verify callback URL is accessible
   - Check PhonePe webhook configuration
   - Verify HMAC signature validation

3. **Feature Access Not Updated**
   - Check subscription creation after payment
   - Verify database functions
   - Check RLS policies

4. **Test Mode Not Working**
   - Verify UAT environment configuration
   - Check test credentials
   - Ensure UAT simulator is accessible

### Debug Mode
```typescript
// Enable debug mode
const debugMode = import.meta.env.VITE_DEBUG_PHONEPE === "true";

if (debugMode) {
  console.log("PhonePe Debug Mode Enabled");
  console.log("Environment:", getEnvironmentSettings());
  console.log("Test Credentials:", getTestCredentials());
}
```

## Support

For technical support:

1. Check the PhonePe documentation: https://developer.phonepe.com/
2. Review the UAT simulator: https://developer.phonepe.com/v1/docs/uat-simulator-1
3. Contact PhonePe support for production issues
4. Check application logs for detailed error information

## Changelog

### Version 1.0.0
- Initial PhonePe paywall integration
- Support for all payment methods
- UAT and Production environment support
- Test credentials integration
- Comprehensive error handling
- Feature access control integration
- Subscription management integration
