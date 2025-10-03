#!/bin/bash

# UrCare Vercel Deployment Script
echo "🚀 Starting UrCare deployment to Vercel..."

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "❌ Vercel CLI not found. Installing..."
    npm install -g vercel
fi

# Check if user is logged in to Vercel
if ! vercel whoami &> /dev/null; then
    echo "🔐 Please login to Vercel first:"
    vercel login
fi

echo "📦 Building frontend..."
npm run build

echo "🚀 Deploying to Vercel..."
vercel --prod

echo "✅ Deployment complete!"
echo "🔗 Your app is now live at: https://urcare-app.vercel.app"
echo "📊 PhonePe server: https://urcare-phonepe-server.vercel.app"
echo ""
echo "📝 Next steps:"
echo "1. Set up PhonePe sandbox account"
echo "2. Configure environment variables in Vercel dashboard"
echo "3. Test payment flow"
echo "4. Switch to production credentials when ready"




