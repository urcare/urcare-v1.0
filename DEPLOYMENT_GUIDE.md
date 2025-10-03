# 🚀 UrCare v2.0 - Complete Vercel Deployment Guide

## 📋 Prerequisites

1. **Node.js** (v16 or higher)
2. **Vercel CLI** (`npm install -g vercel`)
3. **PhonePe Sandbox Account** (for testing)
4. **Groq API Key** (for AI features)

## 🔧 Step 1: PhonePe Sandbox Setup

### 1.1 Create PhonePe Developer Account
1. Visit [https://developer.phonepe.com](https://developer.phonepe.com)
2. Click "Get Started" or "Sign Up"
3. Complete registration process
4. Navigate to "Sandbox" section

### 1.2 Get Sandbox Credentials
Note down these credentials from your PhonePe dashboard:
- **Merchant ID** (e.g., `MERCURCARE`)
- **Salt Key** (e.g., `your-salt-key-here`)
- **Salt Index** (usually `1`)
- **Webhook Secret** (create a strong secret)

### 1.3 Configure Webhook URL
Set webhook URL in PhonePe dashboard:
```
https://urcare-phonepe-server.vercel.app/api/phonepe/webhook
```

## 🚀 Step 2: Deploy to Vercel

### 2.1 Install Vercel CLI
```bash
npm install -g vercel
```

### 2.2 Login to Vercel
```bash
vercel login
```

### 2.3 Deploy Frontend
```bash
cd urcare-v1.0
vercel --prod
```

### 2.4 Deploy PhonePe Server
```bash
cd urcare-v1.0/phonepe-server
vercel --prod
```

## ⚙️ Step 3: Configure Environment Variables

### 3.1 Frontend Environment Variables (Vercel Dashboard)
Go to your project settings → Environment Variables and add:

```env
# Supabase (if using)
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

# Groq AI
VITE_GROQ_API_KEY=your_groq_api_key

# PhonePe Integration
VITE_PHONEPE_MERCHANT_ID=your_phonepe_merchant_id
VITE_PHONEPE_SALT_KEY=your_phonepe_salt_key
VITE_PHONEPE_SALT_INDEX=1
VITE_PHONEPE_BASE_URL=https://api-preprod.phonepe.com/apis/pg-sandbox
VITE_PHONEPE_ENV=sandbox

# API Configuration
VITE_API_BASE_URL=https://urcare-phonepe-server.vercel.app
VITE_WEBHOOK_SECRET=your_webhook_secret

# Base URL
VITE_BASE_URL=https://urcare-app.vercel.app
```

### 3.2 PhonePe Server Environment Variables
Go to your PhonePe server project settings → Environment Variables:

```env
# PhonePe Configuration
PHONEPE_MERCHANT_ID=your_phonepe_merchant_id
PHONEPE_SALT_KEY=your_phonepe_salt_key
PHONEPE_SALT_INDEX=1
PHONEPE_BASE_URL=https://api-preprod.phonepe.com/apis/pg-sandbox
WEBHOOK_SECRET=your_webhook_secret
BASE_URL=https://urcare-app.vercel.app

# CORS Configuration
ALLOWED_ORIGINS=https://urcare-app.vercel.app,http://localhost:3000,http://localhost:5173

# Environment
NODE_ENV=production
```

## 🧪 Step 4: Test the Application

### 4.1 Test Authentication Flow
1. Visit your deployed app: `https://urcare-app.vercel.app`
2. Click "Sign up with Email"
3. Use `admin`/`admin` for demo mode
4. Complete onboarding process

### 4.2 Test Health Assessment
1. Navigate to health assessment screen
2. Verify health score calculation
3. Click "I'll pay by QR"
4. Test QR modal functionality

### 4.3 Test Payment Flow
1. Click "I'll pay by QR" button
2. Verify QR code displays
3. Test download functionality
4. Click "I've Paid - Complete"
5. Verify success message

### 4.4 Test Admin Panel
1. Navigate to `/my-admin` (admin access required)
2. Verify live user metrics
3. Test user management actions
4. Test WhatsApp messaging

## 🔍 Step 5: Verify Deployment

### 5.1 Check Frontend
- ✅ App loads without errors
- ✅ Authentication works
- ✅ Health assessment displays
- ✅ QR payment button shows
- ✅ Admin panel accessible

### 5.2 Check PhonePe Server
- ✅ Health check: `https://urcare-phonepe-server.vercel.app/health`
- ✅ Payment creation works
- ✅ Webhook endpoint accessible
- ✅ CORS configured correctly

### 5.3 Test Payment Integration
- ✅ QR code generates
- ✅ Payment modal displays
- ✅ Download functionality works
- ✅ Success flow completes

## 🐛 Troubleshooting

### Common Issues

#### 1. QR Payment Button Not Showing
**Problem**: Payment button not visible
**Solution**: 
- Check if you're on the health assessment screen
- Verify environment variables are set
- Check browser console for errors

#### 2. PhonePe Server Not Responding
**Problem**: 404 or 500 errors from server
**Solution**:
- Verify server deployment
- Check environment variables
- Review Vercel function logs

#### 3. CORS Errors
**Problem**: Cross-origin requests blocked
**Solution**:
- Update `ALLOWED_ORIGINS` in server env vars
- Include your frontend domain
- Redeploy server

#### 4. Environment Variables Not Loading
**Problem**: Variables undefined in app
**Solution**:
- Ensure variables start with `VITE_` for frontend
- Redeploy after adding variables
- Check Vercel dashboard for typos

### Debug Commands

```bash
# Check Vercel deployment status
vercel ls

# View function logs
vercel logs

# Check environment variables
vercel env ls

# Redeploy with debug info
vercel --debug
```

## 📊 Monitoring

### Health Checks
- **Frontend**: `https://urcare-app.vercel.app`
- **PhonePe Server**: `https://urcare-phonepe-server.vercel.app/health`

### Vercel Analytics
- Monitor performance in Vercel dashboard
- Check function execution times
- Review error rates

## 🔄 Production Migration

### When Ready for Production:

1. **Switch PhonePe to Production**
   - Update `PHONEPE_ENV=production`
   - Use production credentials
   - Update webhook URLs

2. **Update Environment Variables**
   - Replace sandbox URLs with production
   - Use production API keys
   - Update CORS origins

3. **Test Production Flow**
   - Test with real payments
   - Verify webhook processing
   - Monitor error rates

## 📞 Support

### Getting Help
1. Check this deployment guide
2. Review Vercel documentation
3. Check PhonePe developer docs
4. Review application logs

### Useful Links
- [Vercel Documentation](https://vercel.com/docs)
- [PhonePe Developer Portal](https://developer.phonepe.com)
- [Groq API Documentation](https://console.groq.com)

---

**🎉 Your UrCare app is now live and ready for users!**

**Frontend**: `https://urcare-app.vercel.app`  
**PhonePe Server**: `https://urcare-phonepe-server.vercel.app`  
**Health Check**: `https://urcare-phonepe-server.vercel.app/health`