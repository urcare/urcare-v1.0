# 🔑 OpenAI API Key Setup Guide

## 🎯 **Issue Identified**

The AI health plan generation is failing because the **OpenAI API key is not configured** in Supabase Edge Functions.

## ✅ **Changes Committed & Pushed**

- Fixed 406 error handling for development users
- Added proper authentication checks
- Created database setup scripts
- Deployed Edge Functions

## 🚀 **Next Steps to Fix API Key**

### **Step 1: Add OpenAI API Key to Supabase**

1. Go to [Supabase Dashboard](https://supabase.com/dashboard/project/lvnkpserdydhnqbigfbz)
2. Navigate to **Settings** → **Edge Functions**
3. Scroll to **Environment Variables**
4. Add new variable:
   - **Name**: `OPENAI_API_KEY`
   - **Value**: `sk-your-actual-openai-api-key-here`
5. Click **Save**

### **Step 2: Get OpenAI API Key**

If you don't have one:

1. Go to [OpenAI Platform](https://platform.openai.com/api-keys)
2. Sign in or create account
3. Click **Create new secret key**
4. Copy the key (starts with `sk-`)

### **Step 3: Test the Fix**

After adding the API key:

1. Refresh your app
2. Try generating a health plan
3. You should see GPT-4 generated plans instead of fallback data

## 🔍 **How to Verify It's Working**

### **Success Indicators:**

```javascript
// Console should show:
✅ Successfully generated AI health plan
🎉 Comprehensive 16-week plan generated successfully!
📊 Plan type: health_transformation
```

### **Error Indicators:**

```javascript
// If you still see:
❌ Edge Function error: 401 Unauthorized
// The API key is still not configured
```

## 💰 **OpenAI API Costs**

- **GPT-4**: ~$0.03 per 1K input tokens, ~$0.06 per 1K output tokens
- **Typical health plan**: ~$0.10-0.50 per generation
- **Monitor usage** in OpenAI dashboard

## 🛠️ **Alternative: Test Without API Key**

If you want to test without setting up the API key:

1. The app will use fallback/mock data
2. All features work except AI-generated plans
3. You can still test the UI and database functionality

## 📊 **Current Status**

- ✅ Database tables created
- ✅ RLS policies configured
- ✅ Development user handling fixed
- ✅ Edge Functions deployed
- ⚠️ **API key needs to be added** (this is the only remaining step)

## 🎯 **Expected Results After API Key Setup**

- Real GPT-4 generated health plans
- Personalized recommendations
- Evidence-based timelines
- Comprehensive daily/weekly/monthly structures
- No more fallback to mock data
