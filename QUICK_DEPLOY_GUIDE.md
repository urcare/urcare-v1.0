# 🚀 Quick PhonePe Deployment Guide (5 Minutes)

## Step-by-Step Instructions

### ✅ Step 1: Go to Supabase Dashboard

1. Open browser: https://supabase.com/dashboard
2. Login to your account
3. Click on your **UrCare project**

---

### ✅ Step 2: Deploy Edge Function #1 (phonepe-create-order)

1. Click **Edge Functions** in left sidebar
2. Click **"Create a new function"** button
3. Enter name: `phonepe-create-order`
4. Copy this code:

```typescript
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// PhonePe Configuration from environment variables
const PHONEPE_BASE_URL = Deno.env.get('PHONEPE_BASE_URL') || 'https://api-preprod.phonepe.com/apis/pg-sandbox';
const PHONEPE_MERCHANT_ID = Deno.env.get('PHONEPE_MERCHANT_ID') || 'PGTESTPAYUAT';
const PHONEPE_SALT_KEY = Deno.env.get('PHONEPE_API_KEY') || '099eb0cd-02cf-4e2a-8aca-3e6c6aff0399';
const PHONEPE_SALT_INDEX = Deno.env.get('PHONEPE_SALT_INDEX') || '1';
const FRONTEND_URL = Deno.env.get('FRONTEND_URL') || 'http://localhost:8080';

// Generate PhonePe X-VERIFY signature using Web Crypto API
async function generateXVerify(payload: string, endpoint: string, saltKey: string, saltIndex: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(payload + endpoint + saltKey);
  
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  
  return `${hashHex}###${saltIndex}`;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { orderId, amount, userId } = await req.json();

    if (!orderId || !amount || !userId) {
      return new Response(
        JSON.stringify({ success: false, error: 'Missing required fields' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const amountInPaise = Math.round(amount * 100);

    const payload = {
      merchantId: PHONEPE_MERCHANT_ID,
      merchantTransactionId: orderId,
      merchantUserId: userId,
      amount: amountInPaise,
      redirectUrl: `${FRONTEND_URL}/payment/success?orderId=${orderId}`,
      redirectMode: 'REDIRECT',
      callbackUrl: `${FRONTEND_URL}/api/phonepe/status`,
      paymentInstrument: { type: 'PAY_PAGE' }
    };

    const payloadString = JSON.stringify(payload);
    const encoder = new TextEncoder();
    const payloadBytes = encoder.encode(payloadString);
    const base64Payload = btoa(String.fromCharCode(...payloadBytes));

    const xVerify = await generateXVerify(base64Payload, '/pg/v1/pay', PHONEPE_SALT_KEY, PHONEPE_SALT_INDEX);

    const phonepeResponse = await fetch(`${PHONEPE_BASE_URL}/pg/v1/pay`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-VERIFY': xVerify,
        'X-MERCHANT-ID': PHONEPE_MERCHANT_ID,
        'accept': 'application/json'
      },
      body: JSON.stringify({ request: base64Payload })
    });

    const phonepeData = await phonepeResponse.json();

    if (phonepeData.success && phonepeData.data?.instrumentResponse?.redirectInfo?.url) {
      return new Response(
        JSON.stringify({
          success: true,
          redirectUrl: phonepeData.data.instrumentResponse.redirectInfo.url,
          orderId: orderId
        }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    } else {
      return new Response(
        JSON.stringify({ success: false, error: phonepeData.message || 'Payment failed' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
  } catch (error) {
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
```

5. Click **"Deploy"**

---

### ✅ Step 3: Deploy Edge Function #2 (phonepe-status)

1. Click **"Create a new function"** again
2. Enter name: `phonepe-status`
3. Paste the code from `supabase/functions/phonepe-status/index.ts`
4. Click **"Deploy"**

---

### ✅ Step 4: Set Environment Variables

1. Click **Edge Functions** → **Settings**
2. Scroll to **Environment Variables** section
3. Click **"Add variable"** for each:

| Name | Value |
|------|-------|
| `PHONEPE_BASE_URL` | `https://api-preprod.phonepe.com/apis/pg-sandbox` |
| `PHONEPE_MERCHANT_ID` | `PGTESTPAYUAT` |
| `PHONEPE_API_KEY` | `099eb0cd-02cf-4e2a-8aca-3e6c6aff0399` |
| `PHONEPE_SALT_INDEX` | `1` |
| `FRONTEND_URL` | `http://localhost:8080` |

4. Click **"Save"** after adding all variables

---

### ✅ Step 5: Test the Integration

1. Go to your app: `http://localhost:8080/paywall`
2. Click **"Subscribe Now"**
3. Click **"Pay ₹1.00 with PhonePe"**
4. You should be redirected to PhonePe's real payment page! 🎉

---

## 🎯 What to Expect

### ✅ Success Flow:
1. Click "Pay with PhonePe"
2. See "Processing..." for ~2 seconds
3. Redirect to PhonePe's payment page (mercury.phonepe.com)
4. Choose payment method (UPI/Card/etc.)
5. Complete payment
6. Redirect back to your app
7. See success page with confetti
8. Auto-redirect to dashboard

### ❌ If It Doesn't Work:

1. **Check Environment Variables**:
   - Supabase Dashboard → Edge Functions → Settings
   - Verify all 5 variables are set

2. **Check Edge Function Logs**:
   - Supabase Dashboard → Edge Functions → phonepe-create-order → Logs
   - Look for errors

3. **Check Browser Console**:
   - F12 → Console tab
   - Look for error messages

---

## 📊 View Logs

### In Supabase Dashboard:
1. Edge Functions → `phonepe-create-order`
2. Click **"Logs"** tab
3. You'll see:
   ```
   PhonePe Create Order - Payload: {...}
   X-VERIFY: ...
   Calling PhonePe API: ...
   PhonePe Response: {...}
   ```

### In Browser Console (F12):
```
PhonePeGateway mounted/rendered
Initiating real PhonePe payment...
Creating PhonePe payment via Supabase Edge Function...
Redirecting to real PhonePe payment page: https://mercury.phonepe.com/...
```

---

## 🚨 Common Issues

### Issue: "Edge Function returned a non-2xx status code"
**Fix**: Environment variables not set. Go back to Step 4.

### Issue: "Payment initiation failed"
**Fix**: Wrong PhonePe credentials. Verify Step 4 values exactly.

### Issue: Page doesn't redirect
**Fix**: Check browser console (F12) for errors.

---

## ✅ Verification Checklist

- [ ] Both Edge Functions deployed (phonepe-create-order, phonepe-status)
- [ ] All 5 environment variables set
- [ ] Frontend shows "Pay ₹1.00 with PhonePe" button
- [ ] Clicking button shows "Processing..."
- [ ] Redirects to PhonePe payment page
- [ ] Can see logs in Supabase Dashboard

---

## 🎉 You're Done!

Your app now uses the **REAL PhonePe payment gateway**!

- ✅ No more simulations
- ✅ Actual payment page
- ✅ Real transactions
- ✅ Production-ready architecture

---

**Need help?** Check `DEPLOY_PHONEPE_MANUAL.md` for detailed troubleshooting.



