# Razorpay Integration Guide

This document explains how to set up and use the Razorpay payment integration in the UrCare backend.

## Features

- ✅ Pre-configured Razorpay payment links for monthly and yearly subscriptions
- ✅ Razorpay order creation API
- ✅ Payment verification API
- ✅ Webhook handling for payment events
- ✅ Integration with existing PhonePe payment system

## Setup

### 1. Install Dependencies

```bash
cd backend
npm install razorpay
```

### 2. Environment Variables

Create a `.env` file in the backend directory with the following variables:

```env
# Razorpay Configuration
RAZORPAY_KEY_ID=rzp_test_your_key_id_here
RAZORPAY_KEY_SECRET=your_razorpay_secret_key_here
RAZORPAY_WEBHOOK_SECRET=your_webhook_secret_here
```

### 3. Get Razorpay Credentials

1. Sign up at [Razorpay Dashboard](https://dashboard.razorpay.com/)
2. Get your Key ID and Key Secret from the API Keys section
3. Set up webhooks in the Razorpay dashboard pointing to your backend URL

## API Endpoints

### 1. Get Payment Links

**GET** `/api/razorpay/payment-links?billingCycle=monthly|yearly`

Returns the pre-configured Razorpay payment links.

**Response:**
```json
{
  "success": true,
  "paymentLink": "https://razorpay.me/@urcare?amount=...",
  "billingCycle": "monthly",
  "amount": 849,
  "currency": "INR"
}
```

### 2. Create Razorpay Order

**POST** `/api/razorpay/create-order`

Creates a new Razorpay order for custom payments.

**Request Body:**
```json
{
  "orderId": "order_123",
  "amount": 84900,
  "userId": "user_123",
  "planSlug": "basic",
  "billingCycle": "monthly"
}
```

**Response:**
```json
{
  "success": true,
  "orderId": "order_rzp_123",
  "amount": 84900,
  "currency": "INR",
  "keyId": "rzp_test_...",
  "planSlug": "basic",
  "billingCycle": "monthly"
}
```

### 3. Verify Payment

**POST** `/api/razorpay/verify-payment`

Verifies a Razorpay payment signature.

**Request Body:**
```json
{
  "razorpay_order_id": "order_rzp_123",
  "razorpay_payment_id": "pay_rzp_123",
  "razorpay_signature": "signature_here",
  "userId": "user_123",
  "planSlug": "basic",
  "billingCycle": "monthly"
}
```

**Response:**
```json
{
  "success": true,
  "verified": true,
  "paymentId": "pay_rzp_123",
  "orderId": "order_rzp_123",
  "message": "Payment verified successfully"
}
```

### 4. Webhook Handler

**POST** `/api/razorpay/webhook`

Handles Razorpay webhook events for payment status updates.

**Supported Events:**
- `payment.captured` - Payment successfully captured
- `payment.failed` - Payment failed
- `payment_link.paid` - Payment link paid
- `subscription.charged` - Subscription charged
- `subscription.completed` - Subscription completed
- `subscription.cancelled` - Subscription cancelled

## Payment Links Configuration

The system uses pre-configured Razorpay payment links:

- **Monthly Subscription**: `https://razorpay.me/@urcare?amount=vy%2F7jJNxh9pvHsb2%2Bqs52w%3D%3D`
- **Yearly Subscription**: `https://razorpay.me/@urcare?amount=6zcPuaHTrIB8Jllw5habFw%3D%3D`

## Frontend Integration

The frontend paywall component automatically redirects users to the appropriate Razorpay payment link based on their subscription choice.

## Webhook Setup

1. Go to Razorpay Dashboard → Settings → Webhooks
2. Add webhook URL: `https://your-backend-url.com/api/razorpay/webhook`
3. Select events: `payment.captured`, `payment.failed`, `payment_link.paid`
4. Copy the webhook secret and add it to your environment variables

## Testing

### Test Payment Links

1. Start the backend server: `npm start`
2. Test payment links:
   ```bash
   curl "http://localhost:5000/api/razorpay/payment-links?billingCycle=monthly"
   curl "http://localhost:5000/api/razorpay/payment-links?billingCycle=yearly"
   ```

### Test Order Creation

```bash
curl -X POST http://localhost:5000/api/razorpay/create-order \
  -H "Content-Type: application/json" \
  -d '{
    "orderId": "test_order_123",
    "amount": 84900,
    "userId": "test_user_123",
    "planSlug": "basic",
    "billingCycle": "monthly"
  }'
```

## Production Deployment

1. Update environment variables with production Razorpay credentials
2. Configure webhook URLs for production
3. Test payment flows thoroughly
4. Monitor webhook events in Razorpay dashboard

## Troubleshooting

### Common Issues

1. **Invalid API Keys**: Ensure `RAZORPAY_KEY_ID` and `RAZORPAY_KEY_SECRET` are correctly set
2. **Webhook Signature Verification Failed**: Check `RAZORPAY_WEBHOOK_SECRET` matches your Razorpay dashboard
3. **Payment Links Not Working**: Verify the payment links are correctly configured in Razorpay dashboard

### Logs

The backend logs all Razorpay operations with detailed information:
- Order creation
- Payment verification
- Webhook events
- Error handling

Check the console output for debugging information.

## Security Notes

- Never expose Razorpay Key Secret in frontend code
- Always verify webhook signatures
- Use HTTPS in production
- Implement proper error handling
- Log all payment events for audit trails
