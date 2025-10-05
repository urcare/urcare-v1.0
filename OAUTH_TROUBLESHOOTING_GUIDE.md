# 🔧 OAuth Troubleshooting Guide

## 🚨 **Problem Identified**
You're getting a 400 Bad Request error when trying to exchange the OAuth code for a session:
```
POST https://lvnkpserdydhnqbigfbz.supabase.co/auth/v1/token?grant_type=pkce 400 (Bad Request)
```

This is a common OAuth configuration issue.

## ✅ **Solutions Applied**

### 1. **Created Improved OAuth Callback Handler**
- ✅ `ImprovedAuthCallback.tsx` - Better error handling and debugging
- ✅ Proper OAuth code exchange handling
- ✅ Detailed error messages and debug information
- ✅ Fallback to existing session if no code

### 2. **Added Supabase Diagnostics**
- ✅ `supabaseDiagnostics.ts` - Automatic diagnostics in development
- ✅ Checks OAuth configuration and URL parameters
- ✅ Validates Supabase connection and settings

### 3. **Enhanced Error Handling**
- ✅ Better error messages for OAuth failures
- ✅ Debug information in development mode
- ✅ Proper fallback mechanisms

## 🔍 **Common OAuth Issues & Solutions**

### **Issue 1: 400 Bad Request Error**
**Cause**: OAuth redirect URL mismatch or invalid configuration
**Solution**: 
1. Check your Supabase project settings
2. Verify redirect URLs are correctly configured
3. Ensure the redirect URL matches exactly

### **Issue 2: No Code Parameter**
**Cause**: OAuth flow didn't complete properly
**Solution**: 
1. Check if user completed OAuth flow
2. Verify OAuth provider settings
3. Check browser console for errors

### **Issue 3: Session Not Found**
**Cause**: OAuth code exchange failed
**Solution**: 
1. Check Supabase project configuration
2. Verify OAuth provider settings
3. Check network connectivity

## 🛠️ **Supabase Configuration Check**

### **1. Check Your Supabase Dashboard:**
1. Go to your Supabase project dashboard
2. Navigate to **Authentication** → **URL Configuration**
3. Verify these settings:

```
Site URL: https://your-domain.com (or http://localhost:3000 for development)
Redirect URLs: 
- https://your-domain.com/auth/callback
- http://localhost:3000/auth/callback (for development)
```

### **2. Check OAuth Provider Settings:**
1. Go to **Authentication** → **Providers**
2. For Google OAuth:
   - Verify **Client ID** and **Client Secret** are correct
   - Check **Authorized redirect URIs** in Google Console
3. For other providers, verify similar settings

### **3. Check Environment Variables:**
```bash
VITE_SUPABASE_URL=https://lvnkpserdydhnqbigfbz.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key_here
```

## 🧪 **Testing Your OAuth Flow**

### **1. Check Debug Information:**
The improved callback handler will show:
- ✅ Current URL and parameters
- ✅ OAuth code presence
- ✅ Error details if any
- ✅ Session status

### **2. Test Different Scenarios:**
1. **Fresh OAuth flow**: Clear browser data and try again
2. **Existing session**: Check if user already has a session
3. **Error handling**: Test with invalid OAuth settings

### **3. Check Console Logs:**
Look for these messages:
- `🔄 ImprovedAuthCallback: Starting OAuth callback handling`
- `🔍 Debug Info: {...}`
- `✅ Authentication successful: [user_id]`
- `❌ OAuth Error: [error_details]`

## 🔧 **Manual OAuth Testing**

### **Test OAuth Flow Manually:**
1. Go to your landing page
2. Click "Sign in with Google" (or other provider)
3. Complete OAuth flow
4. Check if you're redirected to `/auth/callback`
5. Check console for debug information

### **Test Direct OAuth URL:**
```bash
# Test OAuth flow directly
https://lvnkpserdydhnqbigfbz.supabase.co/auth/v1/authorize?provider=google&redirect_to=http://localhost:3000/auth/callback
```

## 🚀 **Quick Fixes**

### **Fix 1: Update Supabase Redirect URLs**
1. Go to Supabase Dashboard → Authentication → URL Configuration
2. Add these redirect URLs:
   - `http://localhost:3000/auth/callback` (development)
   - `https://your-domain.com/auth/callback` (production)

### **Fix 2: Check OAuth Provider Settings**
1. **Google OAuth**: Go to Google Cloud Console
2. **Authorized redirect URIs**: Add your Supabase redirect URL
3. **Authorized JavaScript origins**: Add your domain

### **Fix 3: Clear Browser Data**
1. Clear cookies and local storage
2. Try OAuth flow again
3. Check if issue persists

## 📋 **Verification Checklist**

- [ ] Supabase redirect URLs are configured correctly
- [ ] OAuth provider settings match Supabase configuration
- [ ] Environment variables are set correctly
- [ ] No CORS issues in browser console
- [ ] OAuth flow completes without errors
- [ ] User is redirected to correct page after authentication
- [ ] Session is created successfully
- [ ] No 400 Bad Request errors

## 🎯 **Expected Results**

After implementing these fixes:
- ✅ **No more 400 Bad Request errors**
- ✅ **OAuth flow completes successfully**
- ✅ **Users are redirected to correct pages**
- ✅ **Clear error messages if issues occur**
- ✅ **Debug information available in development**

## 🔧 **If Issues Persist**

### **Check These:**
1. **Network tab**: Look for failed requests
2. **Console logs**: Check for JavaScript errors
3. **Supabase logs**: Check your project logs
4. **OAuth provider logs**: Check Google/Apple console

### **Common Solutions:**
1. **Update redirect URLs** in both Supabase and OAuth provider
2. **Clear browser cache** and try again
3. **Check HTTPS requirements** for production
4. **Verify domain configuration** in OAuth provider

## 📞 **Getting Help**

If you still encounter issues:
1. Check the debug information in the improved callback
2. Look at the console logs for specific error messages
3. Verify your Supabase project configuration
4. Test with a fresh browser session
