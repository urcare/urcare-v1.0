#!/bin/bash

echo "🚀 Deploying UrCare to Production..."

# Add all changes
echo "📦 Adding changes to git..."
git add -A

# Commit changes
echo "💾 Committing changes..."
git commit -m "feat: Complete PhonePe integration with live QR payment testing

- Fixed port redirect issues (8080/8081)
- Added PhonePe test page
- Fixed browser compatibility issues
- Added comprehensive deployment guide
- Ready for production deployment"

# Push to GitHub
echo "🌐 Pushing to GitHub..."
git push origin main

echo "✅ Deployment complete!"
echo ""
echo "🔗 Next steps:"
echo "1. Go to https://vercel.com"
echo "2. Import your GitHub repository"
echo "3. Set environment variables (see DEPLOYMENT_GUIDE.md)"
echo "4. Configure PhonePe webhooks"
echo "5. Test live payment at: https://your-app.vercel.app/pay"
echo ""
echo "📋 Environment variables needed:"
echo "- PHONEPE_MERCHANT_ID=M23XRS3XN3QMF"
echo "- PHONEPE_API_KEY=713219fb-38d0-468d-8268-8b15955468b0"
echo "- PHONEPE_SALT_INDEX=1"
echo "- PHONEPE_ENVIRONMENT=production"
echo "- BUSINESS_NAME=UrCare org"
echo "- PAYMENT_AMOUNT_IN_PAISE=100"

