# 🔑 API Keys Deployment Guide

## 🚨 **Problem Identified**
Your API keys work locally but fail when deployed to Supabase Edge Functions and Vercel because:

1. **Wrong Environment Variable Names**: Using `VITE_GROQ_API_KEY` (client-side) instead of `GROQ_API_KEY` (server-side)
2. **Missing Environment Variables**: API keys not configured in deployment environments
3. **Inconsistent Naming**: Different services use different variable naming conventions

## ✅ **Solutions Applied**

### 1. **Fixed Code Changes**
- ✅ Updated all Supabase Edge Functions to use `GROQ_API_KEY` instead of `VITE_GROQ_API_KEY`
- ✅ Updated all Vercel API functions to use `GROQ_API_KEY` instead of `VITE_GROQ_API_KEY`
- ✅ Fixed environment variable references in all API endpoints

### 2. **Environment Variable Setup**

#### **For Supabase Edge Functions:**
```bash
# Method 1: Using Supabase CLI
supabase secrets set GROQ_API_KEY="your_actual_groq_api_key_here"
supabase secrets set GROQ_API_KEY_2="your_second_groq_api_key_here"
supabase secrets set OPENAI_API_KEY="your_openai_api_key_here"
supabase secrets set GEMINI_API_KEY="your_gemini_api_key_here"

# Method 2: Using Supabase Dashboard
# Go to: Project Settings → Edge Functions → Environment Variables
```

#### **For Vercel:**
```bash
# Method 1: Using Vercel CLI
vercel env add GROQ_API_KEY
vercel env add GROQ_API_KEY_2
vercel env add OPENAI_API_KEY
vercel env add GEMINI_API_KEY

# Method 2: Using Vercel Dashboard
# Go to: Project Settings → Environment Variables
```

## 🚀 **Deployment Steps**

### **Step 1: Set Up Supabase Environment Variables**
1. Go to your Supabase Dashboard
2. Navigate to **Settings** → **Edge Functions**
3. Add these environment variables:
   - `GROQ_API_KEY` = your actual Groq API key
   - `GROQ_API_KEY_2` = your second Groq API key (optional)
   - `OPENAI_API_KEY` = your OpenAI API key
   - `GEMINI_API_KEY` = your Gemini API key

### **Step 2: Deploy Supabase Edge Functions**
```bash
# Deploy all functions
supabase functions deploy

# Or deploy specific functions
supabase functions deploy health-score
supabase functions deploy generate-ai-health-plans
supabase functions deploy plan-activities
```

### **Step 3: Set Up Vercel Environment Variables**
1. Go to your Vercel Dashboard
2. Navigate to **Settings** → **Environment Variables**
3. Add the same environment variables as above

### **Step 4: Deploy to Vercel**
```bash
# Deploy to production
vercel --prod

# Or deploy to preview
vercel
```

## 🧪 **Testing Your Deployment**

### **Test Supabase Edge Functions:**

#### **Using PowerShell (Windows):**
```powershell
# Test health score function
$testData = @{
    userProfile = @{
        age = "28"
        gender = "Male"
        height_cm = "175"
        weight_kg = "70"
    }
} | ConvertTo-Json -Depth 3

Invoke-RestMethod -Uri "https://lvnkpserdydhnqbigfbz.supabase.co/functions/v1/health-score" `
    -Method POST `
    -Headers @{
        "Authorization" = "Bearer YOUR_ANON_KEY"
        "Content-Type" = "application/json"
    } `
    -Body $testData
```

#### **Using curl (Linux/Mac):**
```bash
# Test health score function
curl -X POST https://lvnkpserdydhnqbigfbz.supabase.co/functions/v1/health-score \
  -H "Authorization: Bearer YOUR_ANON_KEY" \
  -H "Content-Type: application/json" \
  -d '{"userProfile":{"age":"28","gender":"Male"}}'
```

#### **Using Test Script:**
```powershell
# Run the automated test script
.\test-supabase-functions.ps1 -AnonKey "YOUR_ANON_KEY"
```

### **Test Vercel API:**

#### **Using PowerShell (Windows):**
```powershell
# Test health score endpoint
$testData = @{
    userProfile = @{
        age = "28"
        gender = "Male"
        height_cm = "175"
        weight_kg = "70"
    }
} | ConvertTo-Json -Depth 3

Invoke-RestMethod -Uri "https://your-app.vercel.app/api/health-score" `
    -Method POST `
    -Headers @{
        "Content-Type" = "application/json"
    } `
    -Body $testData
```

#### **Using curl (Linux/Mac):**
```bash
# Test health score endpoint
curl -X POST https://your-app.vercel.app/api/health-score \
  -H "Content-Type: application/json" \
  -d '{"userProfile":{"age":"28","gender":"Male"}}'
```

#### **Using Test Script:**
```powershell
# Run the automated test script
.\test-vercel-api.ps1 -VercelUrl "https://your-app.vercel.app"
```

## 🔍 **Troubleshooting**

### **Common Issues:**

1. **"API key not configured" error:**
   - ✅ **Fixed**: Updated all code to use correct environment variable names
   - ✅ **Action**: Ensure environment variables are set in deployment platform

2. **"Unauthorized" error:**
   - Check if API keys are valid and active
   - Verify API key permissions and quotas

3. **"Function timeout" error:**
   - Check if API keys have sufficient quota
   - Verify network connectivity from deployment platform

### **Debug Commands:**
```bash
# Check environment variables
supabase secrets list
vercel env ls

# Test API keys locally
node test-ai-system.js
```

## 📋 **Environment Variable Reference**

| Service | Local (.env) | Supabase | Vercel |
|---------|---------------|----------|---------|
| Groq Primary | `VITE_GROQ_API_KEY` | `GROQ_API_KEY` | `GROQ_API_KEY` |
| Groq Secondary | `VITE_GROQ_API_KEY_2` | `GROQ_API_KEY_2` | `GROQ_API_KEY_2` |
| OpenAI | `VITE_OPENAI_API_KEY` | `OPENAI_API_KEY` | `OPENAI_API_KEY` |
| Gemini | `VITE_GEMINI_API_KEY` | `GEMINI_API_KEY` | `GEMINI_API_KEY` |

## ✅ **Verification Checklist**

- [ ] All code updated to use correct environment variable names
- [ ] Supabase environment variables configured
- [ ] Vercel environment variables configured
- [ ] Supabase Edge Functions deployed
- [ ] Vercel deployment successful
- [ ] API endpoints tested and working
- [ ] No "API key not configured" errors
- [ ] Health score generation working
- [ ] Health plans generation working

## 🎯 **Expected Results**

After implementing these fixes:
- ✅ API keys will work in both Supabase Edge Functions and Vercel
- ✅ No more "API key not configured" errors
- ✅ All AI-powered features will work online
- ✅ Consistent behavior between local and production environments

## 📞 **Support**

If you still encounter issues:
1. Check the deployment logs for specific error messages
2. Verify API keys are active and have sufficient quota
3. Test individual API keys using the test scripts
4. Check network connectivity from deployment platforms
