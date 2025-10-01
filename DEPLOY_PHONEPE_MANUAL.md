# Manual PhonePe Edge Functions Deployment Guide

Since Supabase CLI requires specific package managers, here's how to deploy manually via Supabase Dashboard.

## 📋 Prerequisites

- Supabase project created
- Access to Supabase Dashboard
- Edge Functions code is ready in `supabase/functions/`

## 🚀 Option 1: Deploy via Supabase Dashboard (Recommended)

### Step 1: Login to Supabase Dashboard

1. Go to https://supabase.com/dashboard
2. Login to your account
3. Select your project

### Step 2: Create Edge Functions

#### Create `phonepe-create-order` Function:

1. Go to **Edge Functions** in the left sidebar
2. Click **Create a new function**
3. Name: `phonepe-create-order`
4. Copy the code from `supabase/functions/phonepe-create-order/index.ts`
5. Paste it into the editor
6. Click **Deploy Function**

#### Create `phonepe-status` Function:

1. Click **Create a new function** again
2. Name: `phonepe-status`
3. Copy the code from `supabase/functions/phonepe-status/index.ts`
4. Paste it into the editor
5. Click **Deploy Function**

### Step 3: Set Environment Variables

1. In Supabase Dashboard, go to **Edge Functions** → **Settings**
2. Scroll to **Environment Variables**
3. Add the following variables:

| Variable Name | Value |
|--------------|-------|
| `PHONEPE_BASE_URL` | `https://api-preprod.phonepe.com/apis/pg-sandbox` |
| `PHONEPE_MERCHANT_ID` | `PGTESTPAYUAT` |
| `PHONEPE_API_KEY` | `099eb0cd-02cf-4e2a-8aca-3e6c6aff0399` |
| `PHONEPE_SALT_INDEX` | `1` |
| `FRONTEND_URL` | `http://localhost:8080` |

4. Click **Save** for each variable

### Step 4: Verify Deployment

1. Go to **Edge Functions** → **Logs**
2. You should see both functions listed:
   - `phonepe-create-order`
   - `phonepe-status`
3. Note the function URLs:
   - `https://[your-project-ref].supabase.co/functions/v1/phonepe-create-order`
   - `https://[your-project-ref].supabase.co/functions/v1/phonepe-status`

## 🚀 Option 2: Install Supabase CLI (Alternative Methods)

### Using Homebrew (Mac/Linux):
```bash
brew install supabase/tap/supabase
```

### Using Scoop (Windows):
```bash
scoop bucket add supabase https://github.com/supabase/scoop-bucket.git
scoop install supabase
```

### Using Direct Download:
1. Download from: https://github.com/supabase/cli/releases
2. Extract and add to PATH
3. Run: `supabase login`

### Then Deploy:
```bash
# Login
supabase login

# Link to your project
supabase link --project-ref [your-project-ref]

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

## 🧪 Testing After Deployment

### 1. Test Edge Functions Directly

#### Test `phonepe-create-order`:
```bash
curl -X POST \
  https://[your-project-ref].supabase.co/functions/v1/phonepe-create-order \
  -H 'Authorization: Bearer [your-anon-key]' \
  -H 'Content-Type: application/json' \
  -d '{
    "orderId": "TEST_ORDER_123",
    "amount": 1,
    "userId": "test-user-id"
  }'
```

Expected response:
```json
{
  "success": true,
  "redirectUrl": "https://mercury.phonepe.com/transact/...",
  "orderId": "TEST_ORDER_123"
}
```

#### Test `phonepe-status`:
```bash
curl -X POST \
  https://[your-project-ref].supabase.co/functions/v1/phonepe-status \
  -H 'Authorization: Bearer [your-anon-key]' \
  -H 'Content-Type: application/json' \
  -d '{
    "transactionId": "TEST_ORDER_123"
  }'
```

### 2. Test in Your App

1. Go to `/paywall` in your app
2. Click **"Subscribe Now"**
3. Click **"Pay with PhonePe"**
4. You should see:
   - Console log: "Initiating real PhonePe payment..."
   - Loading state
   - Redirect to PhonePe's payment page

### 3. Check Logs

In Supabase Dashboard:
1. Go to **Edge Functions** → **Logs**
2. Select `phonepe-create-order`
3. You should see logs like:
   ```
   PhonePe Create Order - Payload: {...}
   X-VERIFY: ...
   Calling PhonePe API: ...
   PhonePe Response: {...}
   ```

## 🐛 Troubleshooting

### Error: "Edge Function returned a non-2xx status code"

**Solution**: Check Edge Function logs for specific error. Common issues:
- Environment variables not set
- PhonePe credentials incorrect
- CORS issues (already handled in code)

### Error: "Failed to create payment order"

**Solution**: 
1. Verify environment variables are set correctly
2. Check PhonePe credentials (Merchant ID, API Key, Salt Index)
3. Ensure you're using sandbox URL for testing

### Error: "KEY_NOT_CONFIGURED"

**Solution**: 
- The Merchant ID and API Key don't match
- Using wrong credentials for sandbox/production
- Try using these test credentials:
  - Merchant ID: `PGTESTPAYUAT`
  - API Key: `099eb0cd-02cf-4e2a-8aca-3e6c6aff0399`

### Payment redirects but shows error

**Solution**:
1. Check if `FRONTEND_URL` is set correctly
2. Verify redirect URL matches your app's URL
3. Check browser console for errors

## 📊 Monitoring

### View Function Invocations:
1. Dashboard → Edge Functions → [function-name] → **Invocations**
2. See request/response data
3. Monitor error rates

### View Logs:
1. Dashboard → Edge Functions → [function-name] → **Logs**
2. See console.log outputs
3. Debug issues in real-time

## ✅ Production Checklist

Before going to production:

- [ ] Update `PHONEPE_BASE_URL` to production URL:
  ```
  https://api.phonepe.com/apis/hermes
  ```

- [ ] Update `PHONEPE_MERCHANT_ID` to your production Merchant ID

- [ ] Update `PHONEPE_API_KEY` to your production Salt Key

- [ ] Update `PHONEPE_SALT_INDEX` to your production Salt Index

- [ ] Update `FRONTEND_URL` to your production domain:
  ```
  https://your-domain.com
  ```

- [ ] Test with real payments (start with ₹1)

- [ ] Monitor Edge Function logs

- [ ] Set up error alerts

## 📝 Quick Reference

### Environment Variables (Sandbox):
```
PHONEPE_BASE_URL=https://api-preprod.phonepe.com/apis/pg-sandbox
PHONEPE_MERCHANT_ID=PGTESTPAYUAT
PHONEPE_API_KEY=099eb0cd-02cf-4e2a-8aca-3e6c6aff0399
PHONEPE_SALT_INDEX=1
FRONTEND_URL=http://localhost:8080
```

### Function URLs:
```
Create Order: https://[project-ref].supabase.co/functions/v1/phonepe-create-order
Check Status: https://[project-ref].supabase.co/functions/v1/phonepe-status
```

### Find Your Project Ref:
1. Supabase Dashboard
2. Settings → General
3. Copy **Reference ID**

---

After deployment, your app will use the **REAL PhonePe payment gateway**! 🎉



