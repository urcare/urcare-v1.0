# PhonePe Payment Integration for URCare

This document provides a comprehensive guide to the PhonePe payment integration implemented in the URCare application.

## Overview

The PhonePe integration provides a complete subscription management system with the following features:

- **Payment Processing**: Multiple payment methods (UPI, Cards, Net Banking, Wallets)
- **Subscription Management**: Create, update, and cancel subscriptions
- **Usage Tracking**: Monitor feature usage and limits
- **Webhook Handling**: Real-time payment status updates
- **Refund Processing**: Handle refunds and cancellations

## Architecture

### Core Components

1. **PhonePe Service** (`src/services/phonepeService.ts`)

   - Handles all PhonePe API interactions
   - Payment initiation and status checking
   - Refund processing
   - VPA validation

2. **Payment Service** (`src/services/paymentService.ts`)

   - Manages payment lifecycle
   - Subscription creation after successful payment
   - Payment history management

3. **Database Schema**

   - `subscription_plans`: Available subscription plans
   - `subscriptions`: User subscriptions
   - `payments`: Payment records
   - `subscription_usage`: Feature usage tracking

4. **UI Components**
   - `PaymentMethodSelector`: Payment method selection
   - `PaymentForm`: Complete payment form
   - `SubscriptionPlans`: Plan selection interface
   - `PaywallModal`: Feature access restrictions
   - `FeatureGuard`: Conditional feature access

## Database Schema

### Subscription Plans Table

```sql
CREATE TABLE subscription_plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL,
  slug VARCHAR(50) UNIQUE NOT NULL,
  description TEXT,
  price_monthly DECIMAL(10,2) NOT NULL,
  price_annual DECIMAL(10,2) NOT NULL,
  price_first_time_monthly DECIMAL(10,2),
  price_first_time_annual DECIMAL(10,2),
  features JSONB NOT NULL DEFAULT '[]',
  max_users INTEGER DEFAULT 1,
  max_storage_gb INTEGER DEFAULT 1,
  is_active BOOLEAN DEFAULT true,
  is_popular BOOLEAN DEFAULT false,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### Subscriptions Table

```sql
CREATE TABLE subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  plan_id UUID NOT NULL REFERENCES subscription_plans(id) ON DELETE RESTRICT,
  status VARCHAR(20) NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'canceled', 'past_due', 'unpaid', 'trialing')),
  billing_cycle VARCHAR(10) NOT NULL CHECK (billing_cycle IN ('monthly', 'annual')),
  current_period_start TIMESTAMP WITH TIME ZONE NOT NULL,
  current_period_end TIMESTAMP WITH TIME ZONE NOT NULL,
  cancel_at_period_end BOOLEAN DEFAULT false,
  canceled_at TIMESTAMP WITH TIME ZONE,
  trial_start TIMESTAMP WITH TIME ZONE,
  trial_end TIMESTAMP WITH TIME ZONE,
  phonepe_subscription_id VARCHAR(255),
  phonepe_customer_id VARCHAR(255),
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### Payments Table

```sql
CREATE TABLE payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  subscription_id UUID REFERENCES subscriptions(id) ON DELETE SET NULL,
  plan_id UUID NOT NULL REFERENCES subscription_plans(id) ON DELETE RESTRICT,
  amount DECIMAL(10,2) NOT NULL,
  currency VARCHAR(3) DEFAULT 'INR',
  status VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed', 'cancelled', 'refunded')),
  payment_method VARCHAR(50) NOT NULL,
  phonepe_transaction_id VARCHAR(255),
  phonepe_merchant_transaction_id VARCHAR(255),
  phonepe_payment_id VARCHAR(255),
  phonepe_response JSONB,
  billing_cycle VARCHAR(10) NOT NULL CHECK (billing_cycle IN ('monthly', 'annual')),
  is_first_time BOOLEAN DEFAULT false,
  failure_reason TEXT,
  processed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

## API Endpoints

### PhonePe Configuration

**Test Environment:**

- Merchant ID: `PHONEPEPGUAT`
- Key Index: `1`
- Secret Key: `c817ffaf-8471-48b5-a7e2-a27e5b7efbd3`
- Base URL: `https://api-preprod.phonepe.com/apis/pg-sandbox`

**Production Environment:**

- Base URL: `https://api.phonepe.com/apis/pg`

### Payment Methods

1. **Pay Page** - All payment methods
2. **UPI Intent** - UPI apps integration
3. **UPI Collect** - UPI ID payments
4. **UPI QR** - QR code payments
5. **Card Payments** - Credit/Debit cards
6. **Net Banking** - Direct bank transfers

### Test Credentials

**Test Card:**

- Card Number: `4622943126146407`
- Card Type: `DEBIT_CARD`
- Card Issuer: `VISA`
- Expiry: `12/2023`
- CVV: `936`

**Test UPI:**

- VPA: `test@upi`
- Target Apps: `phonepe`, `gpay`, `paytm`, `bhim`

**Test Net Banking:**

- Username: `Test`
- Password: `Test`

## Usage Examples

### 1. Initiating a Payment

```typescript
import { paymentService } from "@/services/paymentService";

const result = await paymentService.initiatePayment({
  userId: "user-id",
  planId: "plan-id",
  billingCycle: "monthly",
  paymentMethod: "PAY_PAGE",
  userEmail: "user@example.com",
  userPhone: "+919876543210",
});

if (result.success) {
  // Redirect to payment page
  window.location.href = result.redirectUrl;
}
```

### 2. Checking Payment Status

```typescript
const status = await paymentService.checkPaymentStatus(paymentId);
console.log("Payment status:", status.status);
```

### 3. Using Feature Guard

```typescript
import FeatureGuard from "@/components/paywall/FeatureGuard";

<FeatureGuard featureName="ai_consultations">
  <AIConsultationComponent />
</FeatureGuard>;
```

### 4. Checking Subscription Status

```typescript
import { useSubscription } from "@/hooks/useSubscription";

const { hasActiveSubscription, canAccessFeature } = useSubscription();

const canAccess = await canAccessFeature("ai_consultations");
```

## Webhook Handling

### Webhook Endpoints

1. **Payment Callback**: `/api/phonepe/callback`
2. **Refund Callback**: `/api/phonepe/refund-callback`

### Webhook Payload Structure

```typescript
interface PhonePeWebhookPayload {
  merchantId: string;
  merchantTransactionId: string;
  transactionId: string;
  amount: number;
  state: "PENDING" | "SUCCESS" | "FAILED" | "CANCELLED";
  responseCode: string;
  paymentInstrument: {
    type: string;
    utr?: string;
    cardDetails?: any;
  };
}
```

## Security Features

1. **Signature Verification**: All webhooks are verified using HMAC-SHA256
2. **Row Level Security**: Database access is restricted by user
3. **Input Validation**: All inputs are validated before processing
4. **Error Handling**: Comprehensive error handling and logging

## Error Handling

The system includes comprehensive error handling for:

- Network failures
- Invalid payment data
- Webhook signature verification failures
- Database transaction failures
- PhonePe API errors

## Monitoring and Logging

- All payment transactions are logged
- Webhook processing is monitored
- Error rates are tracked
- Payment success rates are monitored

## Testing

### Test Cards

- Visa: `4622943126146407`
- Mastercard: `5555555555554444`
- American Express: `378282246310005`

### Test UPI Apps

- PhonePe
- Google Pay
- Paytm
- BHIM

### Test Net Banking

- State Bank of India
- HDFC Bank
- ICICI Bank
- Axis Bank

## Deployment Checklist

1. **Environment Variables**

   - Set PhonePe credentials
   - Configure webhook URLs
   - Set database connection

2. **Database Migration**

   - Run subscription table migrations
   - Create database functions
   - Set up RLS policies

3. **Webhook Configuration**

   - Configure PhonePe webhook URLs
   - Set up SSL certificates
   - Test webhook endpoints

4. **Testing**
   - Test all payment methods
   - Verify webhook processing
   - Test subscription creation
   - Verify feature access controls

## Support

For technical support or questions about the PhonePe integration:

1. Check the PhonePe documentation: https://developer.phonepe.com/
2. Review the test credentials and UAT simulator
3. Contact the development team for integration issues

## Changelog

### Version 1.0.0

- Initial PhonePe integration
- Support for all payment methods
- Subscription management
- Webhook handling
- Feature access controls
- Comprehensive error handling
