# 🔍 Supabase 500 Error Debug Guide

## 🎯 **Current Status**

### ✅ **Working:**
- **Health Score Function**: ✅ Working (scores 68, 65)
- **Frontend Integration**: ✅ AI responses displayed
- **Basic Supabase Connection**: ✅ Connected

### ❌ **Issues:**
- **generate-ai-health-plans**: 500 Internal Server Error
- **api/generate-unified-plan**: 500 Internal Server Error
- **Some Supabase functions**: 500 errors

## 🔧 **Debug Steps**

### **1. Test Simple Function First**
I've created a simple test function (`test-simple`) to verify basic Supabase function deployment:

```typescript
// supabase/functions/test-simple/index.ts
serve(async (req) => {
  return new Response(JSON.stringify({
    success: true,
    message: "Simple test function is working!",
    timestamp: new Date().toISOString()
  }), { status: 200, headers: corsHeaders });
});
```

### **2. Check Function Deployment**
The 500 errors suggest:
- **Function not deployed** properly
- **Syntax errors** in function code
- **Missing dependencies** or imports
- **API key configuration** issues

### **3. Debug Components Added**
I've added debug components to your Dashboard:

1. **SupabaseFunctionDebug**: Tests all functions with detailed error reporting
2. **AITestComponent**: Tests AI functions with real data
3. **AIResponseDisplay**: Shows AI responses in UI

## 🚀 **Next Steps to Fix**

### **Step 1: Test Simple Function**
1. Go to Dashboard
2. Click "Test Simple" button
3. If this works → Supabase functions are deployed
4. If this fails → Supabase deployment issue

### **Step 2: Check Health Score Function**
1. Click "Test Health Score" button
2. This should work (we saw scores 68, 65 in logs)
3. If this fails → Function-specific issue

### **Step 3: Debug Health Plans Function**
1. Click "Test Health Plans" button
2. Check the detailed error message
3. Look for specific error details

### **Step 4: Check API Keys**
The 500 errors might be due to missing API keys:
- `OPENAI_API_KEY` - for health plans
- `GROQ_API_KEY` - for health score
- `GROQ_API_KEY_2` - backup key

## 🔑 **Potential Issues & Solutions**

### **Issue 1: Function Not Deployed**
**Solution**: Redeploy Supabase functions
```bash
supabase functions deploy
```

### **Issue 2: Missing API Keys**
**Solution**: Set environment variables in Supabase
```bash
supabase secrets set OPENAI_API_KEY="your_key_here"
supabase secrets set GROQ_API_KEY="your_key_here"
```

### **Issue 3: Function Syntax Errors**
**Solution**: Check function code for syntax errors
- Missing imports
- Incorrect TypeScript syntax
- Missing error handling

### **Issue 4: CORS Issues**
**Solution**: Ensure CORS headers are correct
```typescript
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};
```

## 🧪 **Testing Your Functions**

### **Use the Debug Components:**
1. **Go to Dashboard**
2. **Scroll down to "Supabase Functions Debug"**
3. **Click each test button**:
   - Test Simple (should work)
   - Test Health Score (should work - we saw it working)
   - Test Health Plans (might fail - this is the issue)
   - Test Plan Activities (might fail)

### **Check Console Logs:**
- Look for detailed error messages
- Check network tab for 500 errors
- Verify API key configuration

## 🎯 **Expected Results**

### **If Simple Test Works:**
- Supabase functions are deployed
- Issue is with specific function code
- Need to fix function syntax/API keys

### **If Simple Test Fails:**
- Supabase functions not deployed
- Need to redeploy functions
- Check Supabase project configuration

### **If Health Score Works but Health Plans Fails:**
- Health Score function is working (Groq API)
- Health Plans function has issues (OpenAI API)
- Check OpenAI API key configuration

## 🚀 **Quick Fixes**

### **1. Redeploy Functions**
```bash
supabase functions deploy --no-verify-jwt
```

### **2. Check API Keys**
```bash
supabase secrets list
```

### **3. Set Missing Keys**
```bash
supabase secrets set OPENAI_API_KEY="sk-your-key-here"
supabase secrets set GROQ_API_KEY="gsk_your-key-here"
```

### **4. Check Function Logs**
```bash
supabase functions logs generate-ai-health-plans
```

## 🎉 **Current Status**

**Your AI system is partially working:**
- ✅ **Health Score**: Working (68, 65 scores)
- ✅ **Frontend Display**: Working (AI responses visible)
- ❌ **Health Plans**: 500 error (needs debugging)
- ❌ **Some Functions**: 500 errors (needs debugging)

**Next step**: Use the debug components to identify the exact issue and fix it! 🚀
