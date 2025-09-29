# PhonePe Integration Setup Guide

This guide will help you set up the PhonePe payment gateway integration for your URCare application.

## Environment Variables

### Frontend Environment Variables (.env.local)

Create a `.env.local` file in your project root with the following variables:

```bash
# Supabase Configuration
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

# Frontend URL
VITE_FRONTEND_URL=http://localhost:3000

# PhonePe Configuration
# Environment: "uat" for testing, "production" for live
VITE_PHONEPE_ENVIRONMENT=uat

# UAT Environment (Testing)
# These are the default test credentials provided by PhonePe
PHONEPE_MID=PHONEPEPGUAT
PHONEPE_KEY_INDEX=1
PHONEPE_KEY=c817ffaf-8471-48b5-a7e2-a27e5b7efbd3
PHONEPE_API_KEY=
PHONEPE_BASE_URL=https://api-preprod.phonepe.com/apis/pg-sandbox

# Production Environment (Live)
# Replace with your actual production credentials
# PHONEPE_MID=your_production_merchant_id
# PHONEPE_KEY_INDEX=your_production_key_index
# PHONEPE_KEY=your_production_key
# PHONEPE_API_KEY=your_production_api_key
# PHONEPE_BASE_URL=https://api.phonepe.com/apis/pg
```

### Supabase Edge Functions Environment Variables

Add these environment variables to your Supabase project settings:

1. Go to your Supabase project dashboard
2. Navigate to Settings > Edge Functions
3. Add the following environment variables:

```bash
# Supabase Configuration
SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Frontend URL
FRONTEND_URL=your_frontend_url

# PhonePe Configuration
PHONEPE_MID=PHONEPEPGUAT
PHONEPE_KEY_INDEX=1
PHONEPE_KEY=c817ffaf-8471-48b5-a7e2-a27e5b7efbd3
PHONEPE_API_KEY=
PHONEPE_BASE_URL=https://api-preprod.phonepe.com/apis/pg-sandbox
PHONEPE_ENVIRONMENT=uat
```

## Test Credentials

### UAT Simulator Test Credentials

PhonePe provides the following test credentials for UAT testing:

#### Test Card Details
- **Card Number:** 4622943126146407
- **Card Type:** DEBIT_CARD
- **Card Issuer:** VISA
- **Expiry Month:** 12
- **Expiry Year:** 2023
- **CVV:** 936
- **Bank Page OTP:** 123456

#### Test UPI Details
- **VPA:** test@upi
- **Target Apps:** phonepe, gpay, paytm, bhim

#### Test Net Banking Details
- **Username:** Test
- **Password:** Test

## Database Setup

### Required Tables

The following tables should already exist in your Supabase database:

1. **subscription_plans** - Available subscription plans
2. **subscriptions** - User subscriptions
3. **payments** - Payment records
4. **user_profiles** - User profile information

### Database Functions

The following database functions should be available:

1. `create_phonepe_payment` - Creates a new payment record
2. `update_payment_status` - Updates payment status
3. `create_or_update_subscription` - Creates/updates subscription after payment
4. `cancel_subscription` - Cancels user subscription
5. `get_user_payment_history` - Returns payment history
6. `get_subscription_analytics` - Returns subscription analytics
7. `is_payment_refundable` - Checks if payment is refundable

## Deployment Steps

### 1. Deploy Edge Functions

Deploy all PhonePe Edge Functions to Supabase:

```bash
# Deploy all functions
supabase functions deploy phonepe-payment-initiate
supabase functions deploy phonepe-payment-callback
supabase functions deploy phonepe-payment-status
supabase functions deploy phonepe-refund
supabase functions deploy phonepe-refund-callback
supabase functions deploy phonepe-vpa-validate
supabase functions deploy phonepe-payment-options
```

### 2. Set Environment Variables

Set the environment variables in your Supabase project as mentioned above.

### 3. Test the Integration

1. Start your development server:
   ```bash
   npm run dev
   ```

2. Navigate to the subscription page
3. Select a plan and initiate payment
4. Use the test credentials provided above
5. Verify payment success/failure handling

## Production Setup

### 1. Get Production Credentials

1. Contact PhonePe to get your production credentials
2. Update the environment variables with production values
3. Set `VITE_PHONEPE_ENVIRONMENT=production`

### 2. Update Configuration

Update your Supabase environment variables with production credentials:

```bash
PHONEPE_MID=your_production_merchant_id
PHONEPE_KEY_INDEX=your_production_key_index
PHONEPE_KEY=your_production_key
PHONEPE_API_KEY=your_production_api_key
PHONEPE_BASE_URL=https://api.phonepe.com/apis/pg
PHONEPE_ENVIRONMENT=production
```

### 3. Test Production

1. Test with small amounts first
2. Verify all payment methods work
3. Test refund functionality
4. Monitor payment success rates

## Payment Flow

### 1. Payment Initiation
1. User selects subscription plan
2. Frontend calls `phonepe-payment-initiate` function
3. Function creates payment record and calls PhonePe Pay API
4. User is redirected to PhonePe payment page

### 2. Payment Processing
1. User completes payment on PhonePe
2. PhonePe calls `phonepe-payment-callback` function
3. Function verifies payment and updates database
4. User is redirected to success/failure page

### 3. Payment Verification
1. Frontend calls `phonepe-payment-status` function
2. Function checks payment status with PhonePe
3. Returns current payment status

### 4. Refund Processing
1. Admin initiates refund via `phonepe-refund` function
2. Function calls PhonePe Refund API
3. PhonePe processes refund and calls callback
4. Database is updated with refund status

## Security Features

### 1. HMAC Signing
- All requests to PhonePe are signed with HMAC-SHA256
- Checksums are verified for all responses
- Prevents tampering with payment data

### 2. Environment Separation
- UAT and Production environments are completely separate
- Test credentials are only available in UAT
- Production credentials are required for live payments

### 3. Input Validation
- All inputs are validated before processing
- VPA format validation for UPI payments
- Card details validation for card payments

### 4. Error Handling
- Comprehensive error handling throughout the flow
- Detailed error messages for debugging
- Graceful fallbacks for failed operations

## Monitoring and Logging

### 1. Payment Tracking
- All payments are logged in the database
- Payment status is tracked throughout the lifecycle
- Failed payments are logged with error details

### 2. Webhook Monitoring
- PhonePe callbacks are logged and monitored
- Failed webhook processing is tracked
- Payment success rates are monitored

### 3. Error Logging
- All errors are logged with detailed information
- Failed API calls are tracked
- Database errors are logged

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

3. **Payment Status Not Updated**
   - Check payment status function
   - Verify PhonePe API response
   - Check database permissions

4. **Refund Fails**
   - Verify payment is completed
   - Check refund eligibility
   - Verify PhonePe refund API

### Debug Mode

Enable debug mode by setting:
```bash
VITE_DEBUG_PHONEPE=true
```

This will log detailed information about PhonePe API calls and responses.

## Support

For technical support:

1. Check the PhonePe documentation: https://developer.phonepe.com/
2. Review the UAT simulator: https://developer.phonepe.com/v1/docs/uat-simulator-1
3. Contact PhonePe support for production issues
4. Check the application logs for detailed error information

## Changelog

### Version 1.0.0
- Initial PhonePe integration
- Support for all payment methods
- UAT and Production environment support
- Comprehensive error handling
- HMAC signing and verification
- Refund processing
- Payment status tracking
- Test credentials integration
