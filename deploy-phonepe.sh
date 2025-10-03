#!/bin/bash

echo "🚀 Deploying PhonePe Edge Functions to Supabase..."
echo ""

# Check if Supabase CLI is installed
if ! command -v supabase &> /dev/null; then
    echo "❌ Supabase CLI not found!"
    echo "📦 Install it with: npm install -g supabase"
    exit 1
fi

echo "✅ Supabase CLI found"
echo ""

# Check if logged in
echo "🔐 Checking Supabase authentication..."
if ! supabase projects list &> /dev/null; then
    echo "❌ Not logged in to Supabase"
    echo "🔑 Please login with: supabase login"
    exit 1
fi

echo "✅ Authenticated with Supabase"
echo ""

# Deploy phonepe-create-order function
echo "📦 Deploying phonepe-create-order function..."
if supabase functions deploy phonepe-create-order; then
    echo "✅ phonepe-create-order deployed successfully"
else
    echo "❌ Failed to deploy phonepe-create-order"
    exit 1
fi
echo ""

# Deploy phonepe-status function
echo "📦 Deploying phonepe-status function..."
if supabase functions deploy phonepe-status; then
    echo "✅ phonepe-status deployed successfully"
else
    echo "❌ Failed to deploy phonepe-status"
    exit 1
fi
echo ""

# Set environment variables
echo "🔧 Setting environment variables..."
echo ""

echo "Setting PHONEPE_BASE_URL..."
supabase secrets set PHONEPE_BASE_URL=https://api-preprod.phonepe.com/apis/pg-sandbox

echo "Setting PHONEPE_MERCHANT_ID..."
supabase secrets set PHONEPE_MERCHANT_ID=PGTESTPAYUAT

echo "Setting PHONEPE_API_KEY..."
supabase secrets set PHONEPE_API_KEY=099eb0cd-02cf-4e2a-8aca-3e6c6aff0399

echo "Setting PHONEPE_SALT_INDEX..."
supabase secrets set PHONEPE_SALT_INDEX=1

echo "Setting FRONTEND_URL..."
supabase secrets set FRONTEND_URL=http://localhost:8080

echo ""
echo "✅ Environment variables set successfully"
echo ""

# List all secrets to verify
echo "📋 Verifying environment variables..."
supabase secrets list

echo ""
echo "🎉 PhonePe Edge Functions deployment completed!"
echo ""
echo "📝 Next steps:"
echo "1. Test the payment flow in your app"
echo "2. Check Edge Function logs: supabase functions logs phonepe-create-order"
echo "3. For production, update credentials with production values"
echo ""



