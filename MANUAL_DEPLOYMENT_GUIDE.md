# Manual PhonePe Edge Functions Deployment Guide

## 🚀 **Step-by-Step Deployment Instructions**

### **Step 1: Access Supabase Dashboard**

1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your URCare project
3. Navigate to **Edge Functions** in the left sidebar
4. Click **"Create a new function"**

### **Step 2: Deploy Each Function**

#### **Function 1: phonepe-payment-initiate**

**Function Name:** `phonepe-payment-initiate`

**Code:** Copy the entire content from `supabase/functions/phonepe-payment-initiate/index.ts`

**Steps:**
1. Click **"Create a new function"**
2. Enter function name: `phonepe-payment-initiate`
3. Copy and paste the code from the file
4. Click **"Deploy"**

#### **Function 2: phonepe-payment-callback**

**Function Name:** `phonepe-payment-callback`

**Code:** Copy the entire content from `supabase/functions/phonepe-payment-callback/index.ts`

#### **Function 3: phonepe-payment-status**

**Function Name:** `phonepe-payment-status`

**Code:** Copy the entire content from `supabase/functions/phonepe-payment-status/index.ts`

#### **Function 4: phonepe-refund**

**Function Name:** `phonepe-refund`

**Code:** Copy the entire content from `supabase/functions/phonepe-refund/index.ts`

#### **Function 5: phonepe-vpa-validate**

**Function Name:** `phonepe-vpa-validate`

**Code:** Copy the entire content from `supabase/functions/phonepe-vpa-validate/index.ts`

#### **Function 6: phonepe-payment-options**

**Function Name:** `phonepe-payment-options`

**Code:** Copy the entire content from `supabase/functions/phonepe-payment-options/index.ts`

### **Step 3: Set Environment Variables**

In Supabase Dashboard → Settings → Edge Functions → Environment Variables:

```bash
# Your live PhonePe credentials
PHONEPE_MID=your_live_merchant_id
PHONEPE_KEY=your_live_client_id
PHONEPE_KEY_INDEX=1
PHONEPE_API_KEY=your_live_api_key
PHONEPE_BASE_URL=https://api.phonepe.com/apis/pg
PHONEPE_ENVIRONMENT=production

# Supabase credentials (should already be set)
SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
FRONTEND_URL=your_frontend_url
```

### **Step 4: Test the Functions**

1. Go to **Edge Functions** in Supabase Dashboard
2. Click on each function
3. Use the **"Test"** tab to test the functions
4. Check the **"Logs"** tab for any errors

### **Step 5: Verify Deployment**

Test each function with a simple request:

```json
{
  "user_id": "test-user",
  "plan_id": "test-plan",
  "billing_cycle": "monthly",
  "amount": 1,
  "currency": "INR",
  "payment_method": "card"
}
```

## 🎯 **Quick Deployment Checklist**

- [ ] Deploy `phonepe-payment-initiate`
- [ ] Deploy `phonepe-payment-callback`
- [ ] Deploy `phonepe-payment-status`
- [ ] Deploy `phonepe-refund`
- [ ] Deploy `phonepe-vpa-validate`
- [ ] Deploy `phonepe-payment-options`
- [ ] Set environment variables
- [ ] Test all functions
- [ ] Verify logs for errors

## 🚨 **Common Issues & Solutions**

### **Issue 1: Function Deployment Fails**
**Solution:** Check the code syntax and ensure all imports are correct

### **Issue 2: Environment Variables Not Working**
**Solution:** Verify the variable names match exactly (case-sensitive)

### **Issue 3: CORS Errors**
**Solution:** Ensure `corsHeaders` are properly imported and used

### **Issue 4: PhonePe API Errors**
**Solution:** Check your credentials and API endpoints

## 🎉 **After Deployment**

Once all functions are deployed:

1. **Test with UAT credentials first**
2. **Test with live credentials (small amount)**
3. **Verify webhook processing**
4. **Check subscription creation**
5. **Go live with confidence!**

## 📞 **Need Help?**

If you encounter any issues:

1. Check the Supabase function logs
2. Verify environment variables
3. Test with the official PhonePe test credentials
4. Contact support if needed

Your PhonePe integration will be live once all functions are deployed! 🚀
