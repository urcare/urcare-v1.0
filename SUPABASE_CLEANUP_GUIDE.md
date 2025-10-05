# 🧹 Supabase Functions Cleanup Guide

## 🗑️ **Functions to Remove from Supabase:**

Since we deleted these functions locally, you need to remove them from Supabase as well:

### **❌ Delete These Functions:**
1. **`generate-ai-health-plans`** - OpenAI function (500 error)
2. **`generate-ai-health-coach-plan`** - OpenAI function  
3. **`generate-workout-schedule`** - OpenAI function
4. **`test-simple`** - Test function (CORS error)

### **✅ Keep These Functions:**
1. **`health-score`** - Groq AI (working)
2. **`health-plans`** - Groq AI (working)
3. **`plan-activities`** - Groq AI (working)
4. **Payment functions** - PhonePe, Razorpay (working)

## 🚀 **How to Remove Functions from Supabase:**

### **Option 1: Using Supabase CLI (if installed)**
```bash
# Install Supabase CLI first
npm install -g supabase

# Login to Supabase
supabase login

# Link to your project
supabase link --project-ref lvnkpserdydhnqbigfbz

# Delete the functions
supabase functions delete generate-ai-health-plans
supabase functions delete generate-ai-health-coach-plan
supabase functions delete generate-workout-schedule
supabase functions delete test-simple
```

### **Option 2: Using Supabase Dashboard**
1. **Go to**: https://supabase.com/dashboard
2. **Select your project**: lvnkpserdydhnqbigfbz
3. **Go to**: Edge Functions section
4. **Delete these functions**:
   - `generate-ai-health-plans`
   - `generate-ai-health-coach-plan`
   - `generate-workout-schedule`
   - `test-simple`

### **Option 3: Using Supabase API**
```bash
# Get your project API key from Supabase dashboard
# Then use curl to delete functions

curl -X DELETE \
  "https://api.supabase.com/v1/projects/lvnkpserdydhnqbigfbz/functions/generate-ai-health-plans" \
  -H "Authorization: Bearer YOUR_SUPABASE_ACCESS_TOKEN"

curl -X DELETE \
  "https://api.supabase.com/v1/projects/lvnkpserdydhnqbigfbz/functions/generate-ai-health-coach-plan" \
  -H "Authorization: Bearer YOUR_SUPABASE_ACCESS_TOKEN"

curl -X DELETE \
  "https://api.supabase.com/v1/projects/lvnkpserdydhnqbigfbz/functions/generate-workout-schedule" \
  -H "Authorization: Bearer YOUR_SUPABASE_ACCESS_TOKEN"

curl -X DELETE \
  "https://api.supabase.com/v1/projects/lvnkpserdydhnqbigfbz/functions/test-simple" \
  -H "Authorization: Bearer YOUR_SUPABASE_ACCESS_TOKEN"
```

## 🎯 **After Cleanup:**

### **Remaining Functions (Should be 15-16 total):**
- ✅ `health-score` - Groq AI
- ✅ `health-plans` - Groq AI  
- ✅ `plan-activities` - Groq AI
- ✅ `phonepe-create-order` - Payment
- ✅ `phonepe-payment-callback` - Payment
- ✅ `phonepe-payment-initiate` - Payment
- ✅ `phonepe-payment-status` - Payment
- ✅ `phonepe-payment-options` - Payment
- ✅ `phonepe-refund` - Payment
- ✅ `phonepe-refund-callback` - Payment
- ✅ `phonepe-sandbox-pay` - Payment
- ✅ `phonepe-status` - Payment
- ✅ `phonepe-vpa-validate` - Payment
- ✅ `create-razorpay-order` - Payment
- ✅ `verify-razorpay-payment` - Payment

### **Benefits of Cleanup:**
- ✅ **No 500 errors** from deleted functions
- ✅ **Cleaner function list** in Supabase
- ✅ **Reduced deployment size**
- ✅ **Only working functions** remain

## 🧪 **Test After Cleanup:**

1. **Go to your Dashboard**
2. **Use the debug components**:
   - Test Health Score (should work)
   - Test Health Plans (should work - now uses Groq)
   - Test Plan Activities (should work)
3. **Check for errors** - should be no 500 errors

## 🎉 **Result:**

**After cleanup, you'll have a clean, working Groq-only AI system with no OpenAI dependencies and no 500 errors!** 🚀
