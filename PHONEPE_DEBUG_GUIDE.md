# 🔍 PhonePe 400 Error Debug Guide

## **Current Issue: 400 Bad Request from Edge Function**

The Edge Function is returning a 400 error. Here's how to debug and fix it:

## **Step 1: Check Edge Function Logs**

1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project
3. Go to **Edge Functions** → **phonepe-create-order**
4. Click on **Logs** tab
5. Look for the latest error logs

## **Step 2: Common Causes of 400 Error**

### **A. Missing Environment Variables**
Check if these are set in Supabase Dashboard → Settings → Edge Functions → Environment Variables:

```bash
PHONEPE_MERCHANT_ID=M23XRS3XN3QMF
PHONEPE_API_KEY=713219fb-38d0-468d-8268-8b15955468b0
PHONEPE_SALT_INDEX=1
PHONEPE_BASE_URL=https://api.phonepe.com/apis/hermes
FRONTEND_URL=http://localhost:8081
```

### **B. Invalid Request Data**
The Edge Function now has detailed validation. Check the logs for:
- Missing `orderId`
- Missing or invalid `amount` (must be > 0)
- Missing `userId`

### **C. PhonePe API Issues**
- Wrong API endpoint
- Invalid credentials
- Incorrect payload format

## **Step 3: Test the Edge Function**

1. **Deploy the updated Edge Function** (with better error logging)
2. **Try the payment again** and check the logs
3. **Look for these specific log messages:**
   - `📥 Raw request body:` - Shows what data was received
   - `📥 PhonePe Production Payment Request:` - Shows parsed data
   - `📨 PhonePe Production Response:` - Shows PhonePe API response

## **Step 4: Quick Fixes**

### **If Environment Variables Missing:**
1. Set them in Supabase Dashboard
2. Redeploy the Edge Function

### **If Request Data Invalid:**
1. Check browser console for frontend errors
2. Verify user is logged in
3. Check if amount is being passed correctly

### **If PhonePe API Failing:**
1. Verify credentials are correct
2. Check if using production URL with live credentials
3. Verify payload format matches PhonePe requirements

## **Step 5: Test Script**

Run this in browser console to test the Edge Function directly:

```javascript
// Test PhonePe Edge Function
(async () => {
  const testData = {
    orderId: `TEST_ORDER_${Date.now()}`,
    amount: 100,
    userId: "test_user_123",
    planSlug: "basic",
    billingCycle: "annual"
  };
  
  try {
    const response = await fetch('https://lvnkpserdydhnqbigfbz.supabase.co/functions/v1/phonepe-create-order', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer YOUR_ANON_KEY' // Replace with your anon key
      },
      body: JSON.stringify(testData)
    });
    
    const result = await response.json();
    console.log("Response:", result);
  } catch (error) {
    console.error("Error:", error);
  }
})();
```

## **Next Steps:**

1. **Deploy the updated Edge Function** (with better logging)
2. **Set environment variables** if missing
3. **Try payment again** and check logs
4. **Share the log output** so I can help debug further

The updated Edge Function now provides much more detailed error information to help identify the exact issue.

