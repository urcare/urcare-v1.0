# PhonePe Integration - Deployment Checklist

## ✅ **Pre-Deployment Checklist**

### **1. Supabase Project Setup**
- [ ] Supabase project is active
- [ ] You have admin access to the project
- [ ] Edge Functions are enabled in your project

### **2. PhonePe Credentials Ready**
- [ ] Merchant ID: `M23XRS3XN3QMF`
- [ ] Client ID: `SU2509291721337653559173`
- [ ] Key Index: `1`
- [ ] API Key: `713219fb-38d0-468d-8268-8b15955468b0`
- [ ] Base URL: `https://api-preprod.phonepe.com/apis/pg-sandbox`

## 🚀 **Deployment Steps**

### **Step 1: Deploy Edge Functions**

#### **1.1 Create `phonepe-create-order` Function**
- [ ] Go to Supabase Dashboard > Edge Functions
- [ ] Click "Create a new function"
- [ ] Name: `phonepe-create-order`
- [ ] Copy code from `supabase/functions/phonepe-create-order/index.ts`
- [ ] Paste into function editor
- [ ] Click "Deploy"
- [ ] Wait for deployment to complete
- [ ] Verify status shows "Active"

#### **1.2 Create `phonepe-payment-status` Function**
- [ ] Click "Create a new function"
- [ ] Name: `phonepe-payment-status`
- [ ] Copy code from `supabase/functions/phonepe-payment-status/index.ts`
- [ ] Paste into function editor
- [ ] Click "Deploy"
- [ ] Wait for deployment to complete
- [ ] Verify status shows "Active"

### **Step 2: Set Environment Variables**

Go to Edge Functions > Settings > Environment Variables and add:

- [ ] `PHONEPE_MERCHANT_ID` = `M23XRS3XN3QMF`
- [ ] `PHONEPE_CLIENT_ID` = `SU2509291721337653559173`
- [ ] `PHONEPE_KEY_INDEX` = `1`
- [ ] `PHONEPE_API_KEY` = `713219fb-38d0-468d-8268-8b15955468b0`
- [ ] `PHONEPE_BASE_URL` = `https://api-preprod.phonepe.com/apis/pg-sandbox`
- [ ] `FRONTEND_URL` = `http://localhost:8080`

### **Step 3: Test the Integration**

#### **3.1 Test Edge Functions**
- [ ] Open browser console on your app
- [ ] Run the test script from `test-phonepe-functions.js`
- [ ] Verify functions return success responses

#### **3.2 Test Payment Flow**
- [ ] Start development server: `npm run dev`
- [ ] Go to `/paywall`
- [ ] Click "Pay with PhonePe"
- [ ] Verify redirect to `/phonecheckout`
- [ ] Verify payment order creation
- [ ] Verify redirect to `/phonecheckout/result`
- [ ] Verify success screen with countdown
- [ ] Verify auto-redirect to `/dashboard`

## 🔧 **Post-Deployment Configuration**

### **Enable Real PhonePe Integration**

After successful deployment, update the checkout component:

1. **Open `src/pages/PhonePeCheckout.tsx`**
2. **Find this section (around line 141-146):**
   ```typescript
   // For testing: Direct redirect to result page
   // In production with real PhonePe, uncomment the line below:
   // window.location.href = mockPhonePeUrl;
   
   // For testing: Direct redirect to result page
   window.location.href = `/phonecheckout/result?transactionId=${transactionId}&plan=${finalPlan}&cycle=${finalCycle}`;
   ```

3. **Replace with:**
   ```typescript
   // Redirect to real PhonePe PayPage
   window.location.href = mockPhonePeUrl;
   ```

### **Production Environment Variables**

For production deployment, update `FRONTEND_URL`:
- [ ] Change `FRONTEND_URL` to your production domain
- [ ] Example: `https://yourdomain.com`

## 🐛 **Troubleshooting**

### **Common Issues:**

#### **CORS Errors**
- [ ] Verify Edge Functions are deployed
- [ ] Check function names are exact matches
- [ ] Verify environment variables are set

#### **Function Not Found (404)**
- [ ] Check function names in Supabase Dashboard
- [ ] Verify functions are in "Active" status
- [ ] Check function URLs in browser network tab

#### **Payment Not Working**
- [ ] Check browser console for errors
- [ ] Verify Supabase connection
- [ ] Check payment records in database
- [ ] Verify PhonePe credentials are correct

#### **Environment Variables Not Working**
- [ ] Check variable names are exact matches
- [ ] Verify no extra spaces in values
- [ ] Redeploy functions after adding variables

## ✅ **Success Indicators**

When everything is working correctly, you should see:

- [ ] No CORS errors in browser console
- [ ] Edge Functions return success responses
- [ ] Payment flow redirects to PhonePe PayPage
- [ ] PhonePe PayPage loads successfully
- [ ] Payment completion redirects back to your app
- [ ] Success screen shows with countdown
- [ ] Auto-redirect to dashboard works

## 📞 **Support**

If you encounter issues:

1. **Check Supabase Logs:**
   - Go to Edge Functions > Logs
   - Look for error messages

2. **Check Browser Console:**
   - Look for JavaScript errors
   - Check network requests

3. **Verify PhonePe Credentials:**
   - Double-check all credentials
   - Ensure no typos in environment variables

4. **Test with Fallback Mode:**
   - The system will automatically fall back to test mode
   - This allows you to test the UI flow

## 🎉 **Completion**

Once all checklist items are completed:
- [ ] Real PhonePe integration is active
- [ ] Users can make actual payments
- [ ] Payment flow works end-to-end
- [ ] Success/failure handling works correctly
