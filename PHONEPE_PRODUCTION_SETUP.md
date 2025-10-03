# 🚀 PhonePe Production Integration Setup

## 📋 **Environment Variables Required**

Set these in your **Supabase Dashboard** → **Settings** → **Edge Functions** → **Environment Variables**:

### **Required Environment Variables:**

```bash
# PhonePe Production Credentials
PHONEPE_MERCHANT_ID=M23XRS3XN3QMF
PHONEPE_API_KEY=713219fb-38d0-468d-8268-8b15955468b0
PHONEPE_SALT_INDEX=1
PHONEPE_BASE_URL=https://api.phonepe.com/apis/hermes

# Frontend Configuration
FRONTEND_URL=http://localhost:8081
BACKEND_CALLBACK_URL=http://localhost:8081/api/phonepe/callback
```

## 🔧 **Setup Instructions**

### **Step 1: Set Environment Variables in Supabase**

1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project
3. Go to **Settings** → **Edge Functions**
4. Scroll down to **Environment Variables**
5. Add each variable above with its value

### **Step 2: Deploy Edge Function**

1. Go to **Edge Functions** in Supabase Dashboard
2. Find `phonepe-create-order` function
3. Click **Deploy** to update with new environment variables

### **Step 3: Test the Integration**

1. Start your frontend: `npm run dev`
2. Navigate to `/phonecheckout`
3. Click "Pay with PhonePe"
4. You should be redirected to PhonePe's production payment page

## 🎯 **Production Flow**

### **Frontend Flow:**
1. User clicks "Pay with PhonePe" → `/phonecheckout`
2. Frontend calls `phonepe-create-order` Edge Function
3. Edge Function creates PhonePe payment order
4. User redirected to PhonePe hosted payment page
5. After payment → redirected to `/payment/success`
6. Success page verifies payment and redirects to `/dashboard`

### **Backend Flow:**
1. Edge Function receives `{ orderId, amount, userId, planSlug, billingCycle }`
2. Creates PhonePe payload with production credentials
3. Generates X-VERIFY signature
4. Calls PhonePe production API
5. Returns `redirectUrl` to frontend

## 🔐 **Security Features**

- ✅ **Salt Key Protection**: API key stored securely in Supabase
- ✅ **CORS Compliance**: All PhonePe calls go through backend
- ✅ **Payment Verification**: Status checked after payment
- ✅ **Database Logging**: All payments stored in Supabase
- ✅ **Error Handling**: Comprehensive error management

## 📊 **Payment Methods Supported**

- **UPI**: All UPI apps (PhonePe, Google Pay, Paytm, etc.)
- **Cards**: Credit/Debit cards (Visa, Mastercard, RuPay)
- **Net Banking**: 50+ banks supported
- **QR Code**: Scan and pay functionality

## 🚨 **Important Notes**

1. **Production URL**: Using `https://api.phonepe.com/apis/hermes` (live environment)
2. **Live Credentials**: Using your actual Merchant ID and API Key
3. **Real Payments**: This will process actual money transactions
4. **Test Amount**: Currently set to ₹1 for testing
5. **HTTPS Required**: Production requires HTTPS for callbacks

## 🔍 **Testing Checklist**

- [ ] Environment variables set in Supabase
- [ ] Edge Function deployed successfully
- [ ] Frontend loads without errors
- [ ] Payment button redirects to PhonePe
- [ ] PhonePe payment page loads correctly
- [ ] Payment success redirects to dashboard
- [ ] Payment failure redirects to health assessment

## 📞 **Support**

If you encounter any issues:
1. Check Supabase Edge Function logs
2. Verify environment variables are set correctly
3. Ensure PhonePe credentials are valid
4. Check browser console for errors

---

**🎉 Your PhonePe production integration is ready!**