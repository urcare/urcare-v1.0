# 🚀 UrCare Production Deployment Guide

## **Deployment Steps**

### **1. GitHub Push**
```bash
git add -A
git commit -m "feat: Complete PhonePe integration with live QR payment testing"
git push origin main
```

### **2. Vercel Deployment**

#### **Option A: Automatic Deployment (Recommended)**
1. Go to [vercel.com](https://vercel.com)
2. Import your GitHub repository
3. Vercel will automatically deploy from the main branch

#### **Option B: Vercel CLI**
```bash
npm i -g vercel
vercel login
vercel --prod
```

### **3. Environment Variables Setup**

Set these in Vercel Dashboard → Settings → Environment Variables:

```bash
# Supabase (Already configured)
VITE_SUPABASE_URL=https://lvnkpserdydhnqbigfbz.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx2bmtwc2VyZHlkaG5xYmlnZmJ6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTMzMzY5NjYsImV4cCI6MjA2ODkxMjk2Nn0.Y2NfbA7K9efpFHB6FFmCtgti3udX5wbOoQVkDndtkBc

# PhonePe Configuration
PHONEPE_MERCHANT_ID=M23XRS3XN3QMF
PHONEPE_API_KEY=713219fb-38d0-468d-8268-8b15955468b0
PHONEPE_SALT_INDEX=1
PHONEPE_ENVIRONMENT=production
BUSINESS_NAME=UrCare org
PAYMENT_AMOUNT_IN_PAISE=100

# Groq AI (Optional - for health features)
GROQ_API_KEY=your_groq_api_key_here

# Razorpay (Backup payment)
VITE_RAZORPAY_KEY_ID=your_razorpay_key_id
VITE_RAZORPAY_KEY_SECRET=your_razorpay_key_secret
```

### **4. PhonePe Merchant Console Setup**

1. **Login to PhonePe Merchant Console**
2. **Configure Webhooks:**
   - Return URL: `https://your-app.vercel.app/api/phonepe/callback`
   - Webhook URL: `https://your-app.vercel.app/api/phonepe/notify`

3. **Test Credentials:**
   - Use PhonePe test credentials for testing
   - Switch to live credentials for production

### **5. Production URLs**

After deployment, your app will be available at:
- **Main App**: `https://your-app.vercel.app`
- **PhonePe Test**: `https://your-app.vercel.app/phonepe-test`
- **Payment Page**: `https://your-app.vercel.app/pay`
- **Admin Panel**: `https://your-app.vercel.app/my-admin`

### **6. Testing Live Payment**

1. **Visit**: `https://your-app.vercel.app/pay`
2. **Click "PAY ₹1"**
3. **Test QR Generation**: Should generate live PhonePe QR
4. **Test Payment Flow**: Complete end-to-end payment

### **7. PhonePe Test Credentials**

For testing, use these PhonePe test credentials:
- **UPI ID**: `success@upi` (for successful payments)
- **UPI ID**: `failure@upi` (for failed payments)
- **Amount**: ₹1 (100 paise)

### **8. Monitoring & Debugging**

1. **Vercel Logs**: Check function logs in Vercel dashboard
2. **Browser Console**: Check for client-side errors
3. **Network Tab**: Monitor API calls and responses
4. **PhonePe Logs**: Check merchant console for transaction logs

### **9. Security Checklist**

- ✅ Environment variables are set
- ✅ PhonePe webhooks are configured
- ✅ HTTPS is enabled (automatic with Vercel)
- ✅ API endpoints are protected
- ✅ Error handling is in place

### **10. Go Live Checklist**

- [ ] Deploy to Vercel
- [ ] Set environment variables
- [ ] Configure PhonePe webhooks
- [ ] Test payment flow
- [ ] Verify QR generation
- [ ] Test admin panel
- [ ] Monitor logs
- [ ] Switch to live PhonePe credentials

## **🔧 Troubleshooting**

### **Common Issues:**

1. **QR Not Generating**: Check PhonePe API key and merchant ID
2. **Payment Failing**: Verify webhook URLs and signatures
3. **Redirect Issues**: Check environment variables
4. **CORS Errors**: Ensure proper domain configuration

### **Support:**
- Check Vercel function logs
- Monitor browser console
- Verify PhonePe merchant console
- Test with PhonePe test credentials first

---

**Ready to deploy? Run the commands above and your live PhonePe integration will be ready! 🚀**
