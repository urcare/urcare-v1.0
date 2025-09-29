# PhonePe Integration Setup Guide

## Your PhonePe Integration is Already Complete! 🎉

You have a fully functional PhonePe integration with all the necessary components:

### ✅ What's Already Implemented:
- **6 Supabase Edge Functions** for PhonePe operations
- **Frontend Components** for payment forms
- **Database Schema** with all required tables
- **Service Layer** for payment processing
- **Webhook Handling** for payment callbacks

## 🔧 Setup Steps

### 1. Update Supabase Environment Variables

Go to your Supabase Dashboard → Settings → Edge Functions → Environment Variables and add:

```
PHONEPE_MERCHANT_ID=your_actual_merchant_id
PHONEPE_KEY_INDEX=your_key_index  
PHONEPE_SALT_KEY=your_actual_salt_key
PHONEPE_BASE_URL=https://api.phonepe.com/apis/pg
FRONTEND_URL=https://your-domain.com
```

### 2. Deploy Functions (if needed)

Run these commands in your terminal:

```bash
# Deploy all PhonePe functions
supabase functions deploy phonepe-payment-initiate
supabase functions deploy phonepe-payment-callback  
supabase functions deploy phonepe-payment-status
supabase functions deploy phonepe-refund
supabase functions deploy phonepe-refund-callback
supabase functions deploy phonepe-vpa-validate
supabase functions deploy phonepe-payment-options
```

### 3. Update Frontend Environment

Create/update `.env.local`:

```bash
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_FRONTEND_URL=http://localhost:3000
```

## 🧪 Testing

### Test Credentials (for development):
- **Card Number:** 4622943126146407
- **Card Type:** DEBIT_CARD  
- **Expiry:** 12/2023
- **CVV:** 936
- **OTP:** 123456

### Test UPI:
- **VPA:** test@upi
- **Apps:** phonepe, gpay, paytm, bhim

## 📱 Usage

### Basic Payment Flow:
```typescript
import { PhonePeService } from './services/phonepeService';

// Initiate payment
const payment = await PhonePeService.initiatePayment({
  user_id: "user-uuid",
  plan_id: "plan-uuid", 
  billing_cycle: "monthly",
  amount: 99.0,
  payment_method: "card"
});

// Redirect to payment
window.location.href = payment.payment_url;
```

### Using the Payment Form Component:
```tsx
import PhonePePaymentForm from './components/PhonePePaymentForm';

<PhonePePaymentForm
  planId="plan-id"
  planName="Premium Plan"
  amount={99}
  billingCycle="monthly"
  onPaymentSuccess={(data) => console.log('Payment successful!', data)}
  onPaymentError={(error) => console.error('Payment failed:', error)}
/>
```

## 🔒 Security Notes

- Never commit your actual PhonePe credentials to version control
- Use environment variables for all sensitive data
- Test thoroughly in sandbox before going live
- Monitor webhook endpoints for security

## 📞 Support

- **PhonePe Docs:** https://developer.phonepe.com/
- **UAT Simulator:** https://developer.phonepe.com/v1/docs/uat-simulator-1
- **Integration Guide:** Check `PHONEPE_INTEGRATION_GUIDE.md`

## 🚀 Going Live

1. Update to production PhonePe credentials
2. Change `PHONEPE_BASE_URL` to production URL
3. Update webhook URLs to your production domain
4. Test with real payment methods
5. Monitor payment success rates

Your integration is ready to use! Just update the credentials and you're good to go! 🎉
