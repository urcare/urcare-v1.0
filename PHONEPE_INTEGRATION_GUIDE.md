# PhonePe Integration Guide for URCare

This guide provides comprehensive documentation for integrating PhonePe payment gateway with the URCare subscription system.

## Overview

The PhonePe integration includes:

- Payment initiation for subscriptions
- Payment status checking
- Payment callbacks handling
- Refund processing
- VPA validation
- Payment options retrieval

## Environment Variables

Add these environment variables to your Supabase project:

```bash
# PhonePe Configuration
PHONEPE_MERCHANT_ID=PHONEPEPGUAT
PHONEPE_KEY_INDEX=1
PHONEPE_SALT_KEY=c817ffaf-8471-48b5-a7e2-a27e5b7efbd3
PHONEPE_BASE_URL=https://api-preprod.phonepe.com/apis/pg-sandbox

# Frontend URL for redirects
FRONTEND_URL=https://your-frontend-domain.com
```

## Supabase Edge Functions

### 1. Payment Initiation (`phonepe-payment-initiate`)

**Endpoint:** `POST /functions/v1/phonepe-payment-initiate`

**Purpose:** Initiates a payment for subscription plans

**Request Body:**

```json
{
  "user_id": "uuid",
  "plan_id": "uuid",
  "billing_cycle": "monthly" | "annual",
  "amount": 99.00,
  "currency": "INR",
  "payment_method": "card" | "upi" | "netbanking" | "wallet",
  "redirect_url": "https://your-app.com/payment/success",
  "callback_url": "https://your-supabase-url.com/functions/v1/phonepe-payment-callback"
}
```

**Response:**

```json
{
  "success": true,
  "payment_id": "uuid",
  "merchant_transaction_id": "TXN_1234567890_abc123",
  "phonepe_transaction_id": "phonepe_txn_id",
  "redirect_url": "https://mercury.phonepe.com/transact/...",
  "payment_url": "https://mercury.phonepe.com/transact/..."
}
```

### 2. Payment Callback (`phonepe-payment-callback`)

**Endpoint:** `POST /functions/v1/phonepe-payment-callback`

**Purpose:** Handles PhonePe payment callbacks and updates payment status

**Request Body:** (Sent by PhonePe)

```json
{
  "response": "base64_encoded_response",
  "checksum": "sha256_checksum"
}
```

### 3. Payment Status Check (`phonepe-payment-status`)

**Endpoint:** `POST /functions/v1/phonepe-payment-status`

**Purpose:** Checks the status of a payment

**Request Body:**

```json
{
  "merchant_transaction_id": "TXN_1234567890_abc123",
  "transaction_id": "phonepe_txn_id" // optional
}
```

**Response:**

```json
{
  "success": true,
  "payment": {
    "id": "uuid",
    "status": "completed",
    "amount": 99.00,
    "currency": "INR",
    "payment_method": "card",
    "billing_cycle": "monthly",
    "created_at": "2024-01-01T00:00:00Z",
    "processed_at": "2024-01-01T00:05:00Z"
  },
  "phonepe_response": { ... }
}
```

### 4. Refund Processing (`phonepe-refund`)

**Endpoint:** `POST /functions/v1/phonepe-refund`

**Purpose:** Processes refunds for completed payments

**Request Body:**

```json
{
  "payment_id": "uuid",
  "refund_amount": 99.0, // optional, defaults to full amount
  "reason": "Customer requested refund"
}
```

**Response:**

```json
{
  "success": true,
  "refund_id": "REF_1234567890_abc123",
  "refund_amount": 99.00,
  "payment_id": "uuid",
  "phonepe_response": { ... }
}
```

### 5. VPA Validation (`phonepe-vpa-validate`)

**Endpoint:** `POST /functions/v1/phonepe-vpa-validate`

**Purpose:** Validates UPI VPA (Virtual Payment Address)

**Request Body:**

```json
{
  "vpa": "user@paytm"
}
```

**Response:**

```json
{
  "success": true,
  "valid": true,
  "vpa": "user@paytm",
  "message": "VPA is valid"
}
```

### 6. Payment Options (`phonepe-payment-options`)

**Endpoint:** `POST /functions/v1/phonepe-payment-options`

**Purpose:** Retrieves available payment methods

**Request Body:**

```json
{
  "amount": 99.0, // optional
  "currency": "INR" // optional
}
```

**Response:**

```json
{
  "success": true,
  "payment_options": {
    "upi": {
      "enabled": true,
      "methods": ["UPI_ID", "UPI_QR", "UPI_COLLECT"]
    },
    "card": {
      "enabled": true,
      "methods": ["DEBIT_CARD", "CREDIT_CARD"]
    },
    "netbanking": {
      "enabled": true,
      "methods": ["NET_BANKING"]
    },
    "wallet": {
      "enabled": true,
      "methods": ["WALLET"]
    }
  }
}
```

## Database Functions

### 1. `create_phonepe_payment`

Creates a new payment record for PhonePe processing.

### 2. `update_payment_status`

Updates payment status and PhonePe response data.

### 3. `create_or_update_subscription`

Creates new subscription or updates existing one after successful payment.

### 4. `cancel_subscription`

Cancels user subscription immediately or at period end.

### 5. `get_user_payment_history`

Returns payment history for a specific user.

### 6. `get_subscription_analytics`

Returns subscription analytics and statistics for a user.

### 7. `is_payment_refundable`

Checks if a payment is eligible for refund.

## Payment Flow

1. **User selects subscription plan** → Frontend calls `phonepe-payment-initiate`
2. **Payment initiated** → User redirected to PhonePe payment page
3. **User completes payment** → PhonePe calls `phonepe-payment-callback`
4. **Payment processed** → Subscription created/updated
5. **User redirected** → Back to success page

## Refund Flow

1. **Admin initiates refund** → Call `phonepe-refund` function
2. **Refund processed** → PhonePe processes refund
3. **Refund callback** → `phonepe-refund-callback` updates status
4. **Subscription canceled** → User access revoked

## Test Credentials

### PhonePe Test Credentials

- **MID:** PHONEPEPGUAT
- **Key Index:** 1
- **Key:** c817ffaf-8471-48b5-a7e2-a27e5b7efbd3

### Test Card Details

- **Card Number:** 4622943126146407
- **Card Type:** DEBIT_CARD
- **Card Issuer:** VISA
- **Expiry Month:** 12
- **Expiry Year:** 2023
- **CVV:** 936
- **Bank Page OTP:** 123456

### Test Netbanking Details

- **Username:** Test
- **Password:** Test

## Error Handling

All functions include comprehensive error handling:

- Input validation
- Database error handling
- PhonePe API error handling
- Checksum verification
- Timeout handling

## Security Features

- **Checksum verification** for all PhonePe communications
- **Row Level Security (RLS)** on all database tables
- **Input validation** and sanitization
- **CORS protection** with proper headers
- **Environment variable** configuration for sensitive data

## Monitoring and Logging

- All functions include console logging for debugging
- Payment status tracking in database
- Error logging with detailed messages
- PhonePe response storage for audit trails

## Deployment

1. Deploy all Edge Functions to Supabase
2. Run the database migration: `025_create_phonepe_functions.sql`
3. Set environment variables in Supabase dashboard
4. Test with PhonePe UAT environment
5. Update to production credentials when ready

## Support

For PhonePe integration support:

- PhonePe Developer Documentation: https://developer.phonepe.com/
- UAT Simulator: https://developer.phonepe.com/v1/docs/uat-simulator-1
- Test Account Setup: https://developer.phonepe.com/v1/docs/setting-up-test-account
