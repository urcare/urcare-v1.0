# Google OAuth Setup & Troubleshooting Guide

## 🔧 **Supabase Project Settings**

### **1. Configure OAuth in Supabase Dashboard**

1. Go to your Supabase project dashboard
2. Navigate to **Authentication** → **Settings** → **Auth**
3. Scroll down to **External OAuth Providers**
4. Enable **Google** provider

### **2. Set Correct Redirect URLs**

In your Supabase Auth settings, add these redirect URLs:

**For Development:**
```
http://localhost:5173/auth/callback
http://127.0.0.1:5173/auth/callback
```

**For Production:**
```
https://yourdomain.com/auth/callback
```

### **3. Google Cloud Console Setup**

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create/Select your project
3. Enable **Google+ API** and **OAuth2 API**
4. Go to **Credentials** → **Create Credentials** → **OAuth 2.0 Client IDs**
5. Set **Application type** to **Web application**
6. Add **Authorized redirect URIs**:
   ```
   https://wpvfktvutyaymdrmvyqu.supabase.co/auth/v1/callback
   ```

## 🐛 **Common Issues & Solutions**

### **Issue 1: "redirect_uri_mismatch" Error**
**Solution:** 
- Ensure the redirect URI in Google Console matches your Supabase project
- Format: `https://[YOUR-SUPABASE-REF].supabase.co/auth/v1/callback`

### **Issue 2: "OAuth Error" or "Access Denied"**
**Solution:**
- Check that Google OAuth client is properly configured
- Verify that the correct Client ID and Secret are in Supabase
- Ensure your domain is added to Google Console authorized domains

### **Issue 3: Callback Route Not Found**
**Solution:**
- Verify the `/auth/callback` route exists in your app routing
- Check that AuthCallback component is properly imported

### **Issue 4: Session Not Established**
**Solution:**
- Check browser console for detailed error messages
- Verify Supabase URL and anon key are correct
- Clear browser cookies/localStorage and try again

## 🔍 **Debug Steps**

### **1. Check Browser Console**
Look for these console messages:
```
AuthCallback: Starting OAuth callback handling...
AuthCallback: Current URL: [URL]
Google OAuth redirect URL: [URL]
```

### **2. Verify Current Configuration**
Run this in browser console on your app:
```javascript
console.log('Origin:', window.location.origin);
console.log('Callback URL:', window.location.origin + '/auth/callback');
```

### **3. Test OAuth Flow**
1. Open browser dev tools → Network tab
2. Click "Sign in with Google"
3. Check for failed network requests
4. Look for 400/500 status codes

## ✅ **Quick Fix Checklist**

- [ ] Google OAuth client created in Google Console
- [ ] Correct redirect URI in Google Console
- [ ] Google provider enabled in Supabase
- [ ] Client ID and Secret added to Supabase
- [ ] Correct site URL in Supabase settings
- [ ] `/auth/callback` route exists in app
- [ ] No browser console errors

## 🚨 **Emergency Reset**

If all else fails:
1. Delete OAuth client in Google Console
2. Create new OAuth client with correct settings
3. Update Supabase with new credentials
4. Clear all browser data for your app
5. Test in incognito mode

## 📞 **Need Help?**

Check these resources:
- [Supabase Auth Documentation](https://supabase.com/docs/guides/auth)
- [Google OAuth 2.0 Documentation](https://developers.google.com/identity/protocols/oauth2) 