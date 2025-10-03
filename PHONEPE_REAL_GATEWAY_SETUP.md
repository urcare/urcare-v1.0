# 🎯 PhonePe Real Payment Gateway - Complete Setup

This guide explains how to deploy and use the **REAL PhonePe payment gateway** (no more simulations!).

## 📋 What's Changed

### ❌ Before (Simulated):
- Fake UPI popup with mock processing
- Fake card modal with simulated payment
- No actual payment gateway
- Just UI demonstrations

### ✅ Now (Real PhonePe):
- **Real PhonePe payment page** (mercury.phonepe.com)
- **Actual payment processing** through PhonePe
- **Multiple payment methods**: UPI, Cards, Net Banking, QR Code
- **Real transaction verification**
- **Production-ready architecture**

---

## 🏗️ Architecture Overview

```
User clicks "Pay with PhonePe"
         ↓
PhonePeGateway.tsx (Frontend)
         ↓
Supabase Edge Function: phonepe-create-order
         ↓
PhonePe API (Real Gateway)
         ↓
PhonePe Payment Page (User enters payment details)
         ↓
Payment Success/Failure
         ↓
Redirect to /payment/success
         ↓
PaymentSuccess.tsx verifies payment
         ↓
Supabase Edge Function: phonepe-status
         ↓
PhonePe Status API
         ↓
Dashboard (if success) or Health Assessment (if failed)
```

---

## 🚀 Deployment Instructions

### Option 1: Manual Deployment (Recommended for First Time)

#### Step 1: Deploy Edge Functions via Supabase Dashboard

1. **Login to Supabase Dashboard**: https://supabase.com/dashboard
2. **Go to Edge Functions** in left sidebar
3. **Create Function #1**:
   - Click "Create a new function"
   - Name: `phonepe-create-order`
   - Copy code from `supabase/functions/phonepe-create-order/index.ts`
   - Click "Deploy"

4. **Create Function #2**:
   - Click "Create a new function"
   - Name: `phonepe-status`
   - Copy code from `supabase/functions/phonepe-status/index.ts`
   - Click "Deploy"

#### Step 2: Set Environment Variables

In Supabase Dashboard → Edge Functions → Settings → Environment Variables:

| Variable | Value | Purpose |
|----------|-------|---------|
| `PHONEPE_BASE_URL` | `https://api-preprod.phonepe.com/apis/pg-sandbox` | PhonePe API URL (sandbox for testing) |
| `PHONEPE_MERCHANT_ID` | `PGTESTPAYUAT` | PhonePe Test Merchant ID |
| `PHONEPE_API_KEY` | `099eb0cd-02cf-4e2a-8aca-3e6c6aff0399` | PhonePe Salt Key for signing |
| `PHONEPE_SALT_INDEX` | `1` | Salt Key Index |
| `FRONTEND_URL` | `http://localhost:8080` | Your app URL (for redirects) |

**Important**: Click "Save" after adding each variable!

### Option 2: Using Supabase CLI

If you have Supabase CLI installed:

```bash
# Deploy functions
supabase functions deploy phonepe-create-order
supabase functions deploy phonepe-status

# Set environment variables
supabase secrets set PHONEPE_BASE_URL=https://api-preprod.phonepe.com/apis/pg-sandbox
supabase secrets set PHONEPE_MERCHANT_ID=PGTESTPAYUAT
supabase secrets set PHONEPE_API_KEY=099eb0cd-02cf-4e2a-8aca-3e6c6aff0399
supabase secrets set PHONEPE_SALT_INDEX=1
supabase secrets set FRONTEND_URL=http://localhost:8080
```

---

## 🧪 Testing the Integration

### 1. Start Your App

```bash
npm run dev
```

### 2. Test Payment Flow

1. Go to: `http://localhost:8080/paywall`
2. Click **"Subscribe Now"** on any plan
3. Click **"Pay ₹1.00 with PhonePe"** button
4. You should see:
   - Loading state with "Processing..."
   - Redirect to **PhonePe's actual payment page**
5. On PhonePe page, choose payment method:
   - **UPI**: Enter UPI ID or scan QR
   - **Cards**: Enter card details
   - **Net Banking**: Select bank
   - **QR Code**: Scan and pay

### 3. What to Expect

#### ✅ Success Flow:
1. Complete payment on PhonePe
2. Redirect to `/payment/success`
3. See green tick with "Payment Successful!"
4. Countdown timer (5 seconds)
5. Auto-redirect to `/dashboard`
6. Access to all premium features

#### ❌ Failure Flow:
1. Cancel or fail payment on PhonePe
2. Redirect to `/payment/success` (it checks status)
3. See red X with "Payment Failed"
4. Option to retry or go to health assessment

---

## 🔍 Verification & Debugging

### Check Edge Function Logs

1. **Supabase Dashboard** → **Edge Functions** → `phonepe-create-order` → **Logs**
2. You should see:
   ```
   PhonePe Create Order - Payload: {
     "merchantId": "PGTESTPAYUAT",
     "merchantTransactionId": "ORDER_...",
     "amount": 100,
     ...
   }
   X-VERIFY: abc123...###1
   Calling PhonePe API: https://api-preprod.phonepe.com/apis/pg-sandbox/pg/v1/pay
   PhonePe Response: {
     "success": true,
     "data": {
       "instrumentResponse": {
         "redirectInfo": {
           "url": "https://mercury.phonepe.com/..."
         }
       }
     }
   }
   ```

### Check Browser Console

Press F12 → Console tab:

```javascript
PhonePeGateway mounted/rendered {amount: 1, userId: '...', planSlug: 'basic', billingCycle: 'annual'}
Initiating real PhonePe payment: {...}
Creating PhonePe payment via Supabase Edge Function: {...}
Redirecting to real PhonePe payment page: https://mercury.phonepe.com/...
```

### Test Edge Functions Directly

```bash
# Test create-order
curl -X POST \
  https://[your-project-ref].supabase.co/functions/v1/phonepe-create-order \
  -H 'Authorization: Bearer [your-anon-key]' \
  -H 'Content-Type: application/json' \
  -d '{
    "orderId": "TEST_123",
    "amount": 1,
    "userId": "test-user"
  }'

# Expected response:
# {
#   "success": true,
#   "redirectUrl": "https://mercury.phonepe.com/transact/...",
#   "orderId": "TEST_123"
# }
```

---

## 🐛 Troubleshooting

### Issue 1: "Edge Function returned a non-2xx status code"

**Cause**: Environment variables not set or incorrect

**Fix**:
1. Go to Supabase Dashboard → Edge Functions → Settings
2. Verify all 5 environment variables are set
3. Check for typos in variable names
4. Restart Edge Functions if needed

### Issue 2: "KEY_NOT_CONFIGURED" Error

**Cause**: PhonePe Merchant ID and Salt Key don't match

**Fix**:
1. Verify you're using test credentials:
   - Merchant ID: `PGTESTPAYUAT`
   - Salt Key: `099eb0cd-02cf-4e2a-8aca-3e6c6aff0399`
2. Ensure Salt Index is `1`
3. Check for extra spaces in environment variables

### Issue 3: "404" Error from PhonePe

**Cause**: Using wrong PhonePe API URL

**Fix**:
1. For testing, use: `https://api-preprod.phonepe.com/apis/pg-sandbox`
2. For production, use: `https://api.phonepe.com/apis/hermes`

### Issue 4: Payment Redirects but Shows Error

**Cause**: `FRONTEND_URL` not set correctly

**Fix**:
1. Set `FRONTEND_URL` to your exact app URL
2. For local: `http://localhost:8080`
3. For production: `https://your-domain.com`
4. No trailing slash!

### Issue 5: Page Stays on "Processing..." Forever

**Cause**: 
- Edge Function not deployed
- CORS issue
- Network error

**Fix**:
1. Check Edge Function logs for errors
2. Verify Edge Functions are deployed
3. Check browser console for error messages
4. Ensure Supabase project is active

---

## 📊 Payment Flow Details

### 1. Payment Initiation

**File**: `src/pages/PhonePeCheckout.tsx`

```typescript
// User lands here after clicking "Subscribe Now"
// Gets amount, planSlug, billingCycle from state or URL
```

**File**: `src/components/payment/PhonePeGateway.tsx`

```typescript
// Calls Supabase Edge Function
const result = await createPhonePePayment(orderId, amountInPaise, userId);

// Redirects to PhonePe
window.location.href = result.redirectUrl;
```

### 2. PhonePe Processing

User is on PhonePe's hosted payment page:
- Chooses payment method
- Enters payment details
- Completes payment

### 3. Payment Verification

**File**: `src/pages/PaymentSuccess.tsx`

```typescript
// Verify payment with PhonePe Status API
const result = await checkPhonePeStatus(orderId);

if (result.success && result.data.code === "PAYMENT_SUCCESS") {
  // Show success, redirect to dashboard
} else {
  // Show failure, allow retry
}
```

---

## 🔐 Security Features

✅ **Salt Key Never Exposed**: Stored in Supabase environment variables, never sent to frontend
✅ **Checksum Verification**: Every request signed with SHA-256 hash
✅ **CORS Protection**: Edge Functions handle cross-origin requests safely
✅ **Secure Redirects**: Only whitelisted URLs allowed
✅ **Transaction Verification**: Double-check payment status before granting access

---

## 🚀 Production Deployment

### Before Going Live:

1. **Update Environment Variables**:
   ```
   PHONEPE_BASE_URL=https://api.phonepe.com/apis/hermes
   PHONEPE_MERCHANT_ID=[your-production-merchant-id]
   PHONEPE_API_KEY=[your-production-salt-key]
   PHONEPE_SALT_INDEX=[your-production-salt-index]
   FRONTEND_URL=https://your-domain.com
   ```

2. **Test with Real Money**:
   - Start with ₹1 test payment
   - Verify full flow works
   - Check database records

3. **Enable Production Amounts**:
   - Update plan prices in `subscription_plans` table
   - Test with actual plan prices

4. **Set Up Webhooks**:
   - Configure PhonePe callback URL
   - Handle payment notifications

5. **Monitor Edge Functions**:
   - Set up error alerts
   - Monitor invocation counts
   - Check response times

---

## 📝 Files Modified

### Frontend:
- `src/pages/PhonePeCheckout.tsx` - Entry point for payment
- `src/components/payment/PhonePeGateway.tsx` - Real payment integration
- `src/pages/PaymentSuccess.tsx` - Payment verification and redirect
- `src/services/phonepeBackendService.ts` - API service for Edge Functions
- `src/App.tsx` - Added `/payment/success` route

### Backend (Supabase Edge Functions):
- `supabase/functions/phonepe-create-order/index.ts` - Creates PhonePe payment
- `supabase/functions/phonepe-status/index.ts` - Checks payment status

### Removed (Old Simulations):
- ❌ `src/components/payment/UPIPopup.tsx` - No longer used
- ❌ `src/components/payment/CardModal.tsx` - No longer used
- ❌ `src/components/payment/QRCodeModal.tsx` - No longer used
- ❌ `src/components/payment/NetBankingModal.tsx` - No longer used
- ❌ `backend/server.ts` - Replaced by Edge Functions

---

## ✅ Deployment Checklist

- [ ] Both Edge Functions deployed (`phonepe-create-order`, `phonepe-status`)
- [ ] All 5 environment variables set in Supabase
- [ ] Frontend updated and running
- [ ] Test payment successful (₹1)
- [ ] Payment redirects to PhonePe page
- [ ] Success flow works (redirect to dashboard)
- [ ] Failure flow works (redirect to health assessment)
- [ ] Edge Function logs show correct data
- [ ] Browser console shows no errors
- [ ] Database records payment correctly

---

## 🎉 Success Indicators

When everything is working correctly, you'll see:

1. ✅ Click "Pay with PhonePe" → See "Processing..." for ~2 seconds
2. ✅ Redirect to `https://mercury.phonepe.com/transact/...`
3. ✅ PhonePe page loads with payment options (UPI, Card, etc.)
4. ✅ After payment → Redirect to your app
5. ✅ Green tick + "Payment Successful!" message
6. ✅ Countdown timer (5 seconds)
7. ✅ Auto-redirect to Dashboard
8. ✅ Premium features unlocked

---

## 📚 Additional Resources

- **Quick Setup**: See `QUICK_DEPLOY_GUIDE.md`
- **Manual Deployment**: See `DEPLOY_PHONEPE_MANUAL.md`
- **PhonePe Docs**: https://developer.phonepe.com/v1/docs
- **Supabase Edge Functions**: https://supabase.com/docs/guides/functions

---

## 🆘 Getting Help

If you encounter issues:

1. **Check Edge Function Logs** (Supabase Dashboard)
2. **Check Browser Console** (F12)
3. **Verify Environment Variables**
4. **Test Edge Functions Directly** (using curl)
5. **Read Error Messages Carefully**

Common errors are documented in the Troubleshooting section above.

---

**🎯 You now have a fully functional, production-ready PhonePe payment integration!**

No more simulations - this is the real deal! 🚀



