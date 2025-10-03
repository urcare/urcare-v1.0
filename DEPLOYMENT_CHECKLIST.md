# ✅ PhonePe Real Gateway Deployment Checklist

## 📋 Pre-Deployment

- [ ] Supabase account created
- [ ] UrCare project exists in Supabase
- [ ] Have Supabase Dashboard access
- [ ] Frontend app is running locally

---

## 🔧 Deployment Steps

### 1️⃣ Set Environment Variables (Supabase Dashboard)

**Path**: Project Settings → Edge Functions → Environment Variables

- [ ] `PHONEPE_BASE_URL` = `https://api-preprod.phonepe.com/apis/pg-sandbox`
- [ ] `PHONEPE_MERCHANT_ID` = `PGTESTPAYUAT`
- [ ] `PHONEPE_API_KEY` = `099eb0cd-02cf-4e2a-8aca-3e6c6aff0399`
- [ ] `PHONEPE_SALT_INDEX` = `1`
- [ ] `FRONTEND_URL` = `http://localhost:8080`
- [ ] Clicked "Save" button

---

### 2️⃣ Deploy Edge Function: phonepe-create-order

**Path**: Edge Functions → New Function

- [ ] Function name: `phonepe-create-order`
- [ ] Code copied from `supabase/functions/phonepe-create-order/index.ts`
- [ ] Clicked "Deploy"
- [ ] Function shows "Deployed" status

---

### 3️⃣ Deploy Edge Function: phonepe-status

**Path**: Edge Functions → New Function

- [ ] Function name: `phonepe-status`
- [ ] Code copied from `supabase/functions/phonepe-status/index.ts`
- [ ] Clicked "Deploy"
- [ ] Function shows "Deployed" status

---

## 🧪 Testing

### 4️⃣ Test Payment Flow

- [ ] App running: `npm run dev`
- [ ] Navigate to: `http://localhost:8080/paywall`
- [ ] Click "Subscribe Now" button
- [ ] Click "Pay ₹1.00 with PhonePe" button
- [ ] See "Processing..." message
- [ ] Redirect to PhonePe payment page (mercury.phonepe.com)
- [ ] PhonePe page loads successfully

---

### 5️⃣ Verify Edge Functions

- [ ] Go to Supabase Dashboard → Edge Functions
- [ ] Click on `phonepe-create-order` → Logs
- [ ] See logs showing:
  - "PhonePe Create Order: ..."
  - "X-VERIFY: ..."
  - "PhonePe Response: ..."
- [ ] No error messages in logs

---

### 6️⃣ Test Success Flow

- [ ] Complete payment on PhonePe (test)
- [ ] Redirect to `/payment/success` page
- [ ] See green tick + "Payment Successful!"
- [ ] Countdown timer appears (5 seconds)
- [ ] Auto-redirect to `/dashboard`
- [ ] Dashboard loads successfully

---

### 7️⃣ Test Failure Flow

- [ ] Cancel payment on PhonePe
- [ ] Redirect to `/payment/success` page
- [ ] See red X + "Payment Failed"
- [ ] Options to retry or go to health assessment
- [ ] Retry button works

---

## 🔍 Verification

### 8️⃣ Browser Console Checks

Press F12 → Console:

- [ ] No CORS errors
- [ ] See: "PhonePeGateway mounted/rendered"
- [ ] See: "Initiating real PhonePe payment..."
- [ ] See: "Redirecting to real PhonePe payment page..."
- [ ] No red error messages

---

### 9️⃣ Database Checks

Supabase Dashboard → Table Editor → `payments`:

- [ ] Payment record created with status "processing"
- [ ] After success, status updated to "completed"
- [ ] `phonepe_merchant_transaction_id` is set
- [ ] Amount matches (in rupees, e.g., 1.00)

---

## 🚀 Production Readiness

### 🔟 Pre-Production Checklist

- [ ] All test payments successful
- [ ] No errors in Edge Function logs
- [ ] No errors in browser console
- [ ] Database records correct
- [ ] Redirects working properly

---

### 1️⃣1️⃣ Production Environment Variables

**⚠️ Update these before going live:**

- [ ] `PHONEPE_BASE_URL` = `https://api.phonepe.com/apis/hermes`
- [ ] `PHONEPE_MERCHANT_ID` = [Your Production Merchant ID]
- [ ] `PHONEPE_API_KEY` = [Your Production Salt Key]
- [ ] `PHONEPE_SALT_INDEX` = [Your Production Salt Index]
- [ ] `FRONTEND_URL` = `https://your-domain.com`

---

### 1️⃣2️⃣ Production Testing

- [ ] Test with ₹1 in production
- [ ] Verify real money transaction
- [ ] Check payment confirmation
- [ ] Verify subscription activation
- [ ] Monitor Edge Function performance

---

## 📊 Monitoring

### 1️⃣3️⃣ Set Up Monitoring

- [ ] Enable Edge Function error alerts
- [ ] Set up uptime monitoring
- [ ] Configure payment notification emails
- [ ] Set up dashboard for metrics

---

## 🎯 Success Indicators

### ✅ All Systems Working When:

- [x] **Edge Functions deployed** (2 functions visible)
- [x] **Environment variables set** (5 variables)
- [x] **Payment redirects** to PhonePe page
- [x] **PhonePe page loads** with payment options
- [x] **Success flow works** (payment → dashboard)
- [x] **Failure flow works** (cancel → retry)
- [x] **Logs show no errors**
- [x] **Database records payments**

---

## 🆘 If Something's Wrong

### Common Issues:

1. **"KEY_NOT_CONFIGURED"**
   - Fix: Double-check `PHONEPE_API_KEY` value
   - Ensure Merchant ID matches Salt Key

2. **"Edge Function error"**
   - Fix: Check environment variables are saved
   - Re-deploy Edge Functions

3. **"Payment not redirecting"**
   - Fix: Check `FRONTEND_URL` is correct
   - Verify no typos in URL

4. **"CORS error"**
   - Fix: This should NOT happen (Edge Functions handle CORS)
   - If you see this, Edge Functions might not be deployed

---

## 📚 Documentation

- **Quick Guide**: `DASHBOARD_DEPLOYMENT.md`
- **Detailed Setup**: `PHONEPE_REAL_GATEWAY_SETUP.md`
- **Manual Deploy**: `DEPLOY_PHONEPE_MANUAL.md`
- **This Checklist**: `DEPLOYMENT_CHECKLIST.md`

---

## 🎉 Completion

When all checkboxes are ✅, your PhonePe integration is **LIVE** and **PRODUCTION-READY**!

---

**Last Updated**: October 1, 2025
**Status**: ✅ Ready for Deployment
**Integration**: Real PhonePe Payment Gateway (No Simulations)


