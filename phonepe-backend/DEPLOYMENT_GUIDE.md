# PhonePe Production Deployment Guide

## 🚀 **Step-by-Step Setup for urcarebyarsh.vercel.app**

### 1. **PhonePe Dashboard Configuration**

1. **Login to PhonePe Business Dashboard**
   - Go to: https://business.phonepe.com
   - Login with your merchant credentials

2. **Add Redirect URLs**
   - Go to: Developer Settings → Redirect URL
   - Add: `https://urcarebyarsh.vercel.app/payment/success`
   - Add: `https://www.urcarebyarsh.vercel.app/payment/success`

3. **Add Webhook URLs**
   - Go to: Developer Settings → Webhook URL
   - Add: `https://urcarebyarsh.vercel.app/api/phonepe/callback`
   - Add: `https://www.urcarebyarsh.vercel.app/api/phonepe/callback`

4. **Verify API Keys**
   - Go to: Developer Settings → API Keys
   - Confirm your Merchant ID: `M23XRS3XN3QMF`
   - Confirm your API Key: `713219fb-38d0-468d-8268-8b15955468b0`
   - Confirm Salt Index: `1`

### 2. **Deploy Backend to urcarebyarsh.vercel.app**

1. **Upload the production server**
   ```bash
   # Upload phonepe-backend/production-ready-server.js to your server
   # Make sure it's accessible at: https://urcarebyarsh.vercel.app/api/phonepe/
   ```

2. **Set Environment Variables**
   ```bash
   PHONEPE_MERCHANT_ID=M23XRS3XN3QMF
   PHONEPE_API_KEY=713219fb-38d0-468d-8268-8b15955468b0
   PHONEPE_SALT_INDEX=1
   PHONEPE_BASE_URL=https://api.phonepe.com/apis/hermes
   FRONTEND_URL=https://urcarebyarsh.vercel.app
   BACKEND_CALLBACK_URL=https://urcarebyarsh.vercel.app/api/phonepe/callback
   NODE_ENV=production
   ```

3. **Install Dependencies**
   ```bash
   npm install express cors crypto node-fetch dotenv
   ```

4. **Start the Server**
   ```bash
   node production-ready-server.js
   ```

### 3. **Update Frontend Configuration**

1. **Update phonepeBackendService.ts**
   ```typescript
   const PHONEPE_BACKEND_URL = 'https://urcare.vercep.app/api/phonepe';
   ```

2. **Deploy Frontend**
   - Make sure your React app is deployed to `https://urcare.vercep.app`
   - Test the payment flow

### 4. **Test the Integration**

1. **Health Check**
   ```bash
   curl https://urcare.vercep.app/api/phonepe/health
   ```

2. **Test Payment**
   - Go to: `https://urcare.vercep.app/paywall`
   - Click "Pay with PhonePe"
   - Should redirect to real PhonePe payment page

### 5. **For Local Development (Optional)**

If you want to test locally, use ngrok:

1. **Install ngrok**
   ```bash
   npm install -g ngrok
   ```

2. **Expose local server**
   ```bash
   ngrok http 5000
   ```

3. **Update PhonePe Dashboard**
   - Add ngrok URL to redirect URLs
   - Example: `https://abc123.ngrok.io/payment/success`

## 🔧 **Environment Variables**

Create a `.env` file on your production server:

```env
# PhonePe Configuration
PHONEPE_MERCHANT_ID=M23XRS3XN3QMF
PHONEPE_API_KEY=713219fb-38d0-468d-8268-8b15955468b0
PHONEPE_SALT_INDEX=1
PHONEPE_BASE_URL=https://api.phonepe.com/apis/hermes

# Server Configuration
PORT=5000
FRONTEND_URL=https://urcare.vercep.app
BACKEND_CALLBACK_URL=https://urcare.vercep.app/api/phonepe/callback
NODE_ENV=production
```

## 🚨 **Important Notes**

1. **HTTPS Required**: PhonePe only works with HTTPS URLs
2. **URL Whitelisting**: All URLs must be added to PhonePe dashboard
3. **Merchant Activation**: Your account must be fully activated
4. **Webhook Verification**: Implement proper webhook signature verification

## 🎯 **Expected Flow**

1. User clicks "Pay with PhonePe" on `urcare.vercep.app`
2. Frontend calls `https://urcare.vercep.app/api/phonepe/pay`
3. Backend calls PhonePe API with correct headers
4. PhonePe returns payment page URL
5. User completes payment on PhonePe
6. PhonePe redirects to `https://urcare.vercep.app/payment/success`
7. PhonePe sends webhook to `https://urcare.vercep.app/api/phonepe/callback`

## ✅ **Success Indicators**

- No 401 Unauthorized errors
- Real PhonePe payment page loads
- Successful redirects after payment
- Webhook callbacks received
- Payment status updates in your database
