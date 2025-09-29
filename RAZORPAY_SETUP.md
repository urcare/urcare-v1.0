# Razorpay Payment Integration Setup

This document provides instructions for setting up Razorpay payment integration in your UrCare health app.

## Prerequisites

1. Razorpay account (https://razorpay.com/)
2. Supabase project with Edge Functions enabled

## Environment Variables

Add the following environment variables to your `.env` file:

```bash
# Supabase Configuration
VITE_SUPABASE_URL=your_supabase_url_here
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key_here

# Razorpay Configuration
VITE_RAZORPAY_KEY_ID=your_razorpay_key_id_here
VITE_RAZORPAY_KEY_SECRET=your_razorpay_key_secret_here

# Environment
NODE_ENV=development
VITE_DEBUG=true
```

## Razorpay Setup

1. **Create Razorpay Account**
   - Go to https://razorpay.com/ and create an account
   - Complete the KYC process

2. **Get API Keys**
   - Go to Razorpay Dashboard > Settings > API Keys
   - Generate new API keys for your environment
   - Copy the Key ID and Key Secret

3. **Configure Webhook (Optional)**
   - Go to Razorpay Dashboard > Settings > Webhooks
   - Add webhook URL: `https://your-project.supabase.co/functions/v1/razorpay-webhook`
   - Select events: `payment.captured`, `payment.failed`

## Supabase Setup

1. **Deploy Edge Functions**
   ```bash
   supabase functions deploy create-razorpay-order
   supabase functions deploy verify-razorpay-payment
   ```

2. **Set Environment Variables in Supabase**
   ```bash
   supabase secrets set RAZORPAY_KEY_ID=your_razorpay_key_id
   supabase secrets set RAZORPAY_KEY_SECRET=your_razorpay_key_secret
   supabase secrets set RAZORPAY_WEBHOOK_SECRET=your_webhook_secret
   ```

3. **Run Database Migration**
   ```bash
   supabase db push
   ```

## Database Schema

The integration creates two new tables:

### payment_orders
- Stores Razorpay order details
- Tracks payment status
- Links orders to users

### user_subscriptions
- Manages user subscription status
- Tracks billing cycles
- Handles subscription expiration

## Payment Flow

1. User clicks "Generate My Personalized Health Plan"
2. Redirects to PaymentWall page
3. User selects billing cycle (monthly/annual)
4. User clicks "Subscribe Now"
5. Razorpay payment modal opens
6. User completes payment
7. Payment is verified on backend
8. User subscription is activated
9. User is redirected to dashboard

## Testing

### Test Mode
- Use Razorpay test mode for development
- Test cards: https://razorpay.com/docs/payment-gateway/test-card-details/

### Test Cards
- Success: 4111 1111 1111 1111
- Failure: 4000 0000 0000 0002
- CVV: Any 3 digits
- Expiry: Any future date

## Security Notes

1. Never expose Razorpay Key Secret in frontend code
2. Always verify payments on backend
3. Use HTTPS in production
4. Implement proper error handling
5. Log payment events for debugging

## Troubleshooting

### Common Issues

1. **Payment not processing**
   - Check Razorpay API keys
   - Verify webhook configuration
   - Check browser console for errors

2. **Signature verification failed**
   - Ensure webhook secret is correct
   - Check if payment data is being tampered with

3. **Database errors**
   - Verify RLS policies
   - Check user authentication
   - Ensure tables exist

### Debug Mode

Enable debug mode by setting `VITE_DEBUG=true` in your environment variables to see detailed logs.

## Support

For issues related to:
- Razorpay: Contact Razorpay support
- Supabase: Check Supabase documentation
- This integration: Check the code comments and error logs
