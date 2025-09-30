# PhonePe Payment Integration - Deployment Guide

## 🚀 Quick Setup (Without Supabase CLI)

Since the Supabase CLI is not installed, you can deploy the Edge Functions manually through the Supabase Dashboard:

### 1. Deploy Edge Functions via Supabase Dashboard

1. **Go to Supabase Dashboard:**
   - Navigate to your project dashboard
   - Go to **Edge Functions** section

2. **Create `phonepe-create-order` function:**
   - Click **"Create a new function"**
   - Name: `phonepe-create-order`
   - Copy the content from `supabase/functions/phonepe-create-order/index.ts`
   - Deploy the function

3. **Create `phonepe-payment-status` function:**
   - Click **"Create a new function"**
   - Name: `phonepe-payment-status`
   - Copy the content from `supabase/functions/phonepe-payment-status/index.ts`
   - Deploy the function

### 2. Set Environment Variables

Go to **Edge Functions > Settings > Environment Variables** and add:

```
PHONEPE_MERCHANT_ID=M23XRS3XN3QMF
PHONEPE_CLIENT_ID=SU2509291721337653559173
PHONEPE_KEY_INDEX=1
PHONEPE_API_KEY=713219fb-38d0-468d-8268-8b15955468b0
PHONEPE_BASE_URL=https://api-preprod.phonepe.com/apis/pg-sandbox
FRONTEND_URL=http://localhost:8080
```

### 3. Test the Integration

1. **Start the development server:**
   ```bash
   npm run dev
   ```

2. **Test the payment flow:**
   - Go to `/paywall`
   - Click "Pay with PhonePe"
   - You should see the PhonePe checkout page
   - Complete the payment flow

## 🔧 Current Fallback Mode

The system is currently running in **fallback mode** which means:

- ✅ **PhonePe checkout page works** (`/phonecheckout`)
- ✅ **Payment result page works** (`/phonecheckout/result`)
- ✅ **Success/failure handling works**
- ✅ **Auto-redirect to dashboard works**
- ⚠️ **Uses mock payment flow** (for testing)

### To Enable Real PhonePe Integration:

1. Deploy the Edge Functions (steps above)
2. Set the environment variables
3. The system will automatically use the real PhonePe API

## 🎯 Payment Flow

```
Paywall → Click "Pay with PhonePe" → /phonecheckout → Payment Result → Dashboard
```

### Success Flow:
1. User clicks "Pay with PhonePe"
2. Redirects to `/phonecheckout` (payment summary)
3. Auto-creates payment order
4. Redirects to `/phonecheckout/result`
5. Shows success screen with 5-second countdown
6. Auto-redirects to `/dashboard`

### Failure Flow:
1. User clicks "Pay with PhonePe"
2. Redirects to `/phonecheckout` (payment summary)
3. If payment fails, shows error screen
4. User can retry or go to health assessment

## 🐛 Troubleshooting

### CORS Errors:
- Make sure Edge Functions are deployed
- Check environment variables are set correctly

### Function Not Found:
- Verify function names match exactly
- Check function deployment status

### Payment Not Working:
- Check browser console for errors
- Verify Supabase connection
- Check payment records in database

## 📱 Testing

The system currently works in **test mode** which:
- Creates payment records in database
- Simulates successful payments
- Redirects to result page immediately
- Shows success screen with countdown

This allows you to test the complete UI flow without needing actual PhonePe integration.
