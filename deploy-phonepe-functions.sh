#!/bin/bash

# PhonePe Functions Deployment Script
# This script deploys all PhonePe-related Edge Functions to Supabase

set -e

echo "🚀 Starting PhonePe Functions Deployment..."

# Check if supabase CLI is installed
if ! command -v supabase &> /dev/null; then
    echo "❌ Supabase CLI is not installed. Please install it first."
    echo "   Visit: https://supabase.com/docs/guides/cli"
    exit 1
fi

# Check if user is logged in
if ! supabase projects list &> /dev/null; then
    echo "❌ Please login to Supabase CLI first:"
    echo "   supabase login"
    exit 1
fi

echo "📦 Deploying PhonePe Edge Functions..."

# Deploy payment initiation function
echo "  📤 Deploying phonepe-payment-initiate..."
supabase functions deploy phonepe-payment-initiate

# Deploy payment callback function
echo "  📤 Deploying phonepe-payment-callback..."
supabase functions deploy phonepe-payment-callback

# Deploy payment status function
echo "  📤 Deploying phonepe-payment-status..."
supabase functions deploy phonepe-payment-status

# Deploy refund function
echo "  📤 Deploying phonepe-refund..."
supabase functions deploy phonepe-refund

# Deploy refund callback function
echo "  📤 Deploying phonepe-refund-callback..."
supabase functions deploy phonepe-refund-callback

# Deploy VPA validation function
echo "  📤 Deploying phonepe-vpa-validate..."
supabase functions deploy phonepe-vpa-validate

# Deploy payment options function
echo "  📤 Deploying phonepe-payment-options..."
supabase functions deploy phonepe-payment-options

echo "✅ All PhonePe functions deployed successfully!"

echo ""
echo "🔧 Next Steps:"
echo "1. Set environment variables in your Supabase project:"
echo "   - Go to Settings > Edge Functions"
echo "   - Add the required environment variables"
echo ""
echo "2. Test the integration:"
echo "   - Start your development server: npm run dev"
echo "   - Navigate to the subscription page"
echo "   - Test with UAT credentials"
echo ""
echo "3. For production:"
echo "   - Update environment variables with production credentials"
echo "   - Set PHONEPE_ENVIRONMENT=production"
echo ""
echo "📚 Documentation:"
echo "   - Setup Guide: PHONEPE_SETUP_GUIDE.md"
echo "   - Integration Guide: PHONEPE_INTEGRATION_GUIDE.md"
echo ""
echo "🎉 PhonePe integration is ready!"