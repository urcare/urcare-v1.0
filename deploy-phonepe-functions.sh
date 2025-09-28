#!/bin/bash

# PhonePe Integration Deployment Script
# This script deploys all PhonePe-related Supabase Edge Functions

echo "🚀 Starting PhonePe Integration Deployment..."

# Check if Supabase CLI is installed
if ! command -v supabase &> /dev/null; then
    echo "❌ Supabase CLI is not installed. Please install it first:"
    echo "npm install -g supabase"
    exit 1
fi

# Check if user is logged in to Supabase
if ! supabase status &> /dev/null; then
    echo "❌ Not logged in to Supabase. Please run: supabase login"
    exit 1
fi

echo "📦 Deploying Supabase Edge Functions..."

# Deploy each function
functions=(
    "phonepe-payment-initiate"
    "phonepe-payment-callback"
    "phonepe-payment-status"
    "phonepe-refund"
    "phonepe-refund-callback"
    "phonepe-vpa-validate"
    "phonepe-payment-options"
)

for func in "${functions[@]}"; do
    echo "Deploying $func..."
    if supabase functions deploy $func; then
        echo "✅ $func deployed successfully"
    else
        echo "❌ Failed to deploy $func"
        exit 1
    fi
done

echo "🗄️ Running database migrations..."

# Run the PhonePe functions migration
if supabase db push; then
    echo "✅ Database migrations completed successfully"
else
    echo "❌ Database migration failed"
    exit 1
fi

echo "🔧 Setting up environment variables..."

# Check if .env file exists
if [ ! -f ".env.local" ]; then
    echo "Creating .env.local file..."
    cat > .env.local << EOF
# PhonePe Configuration
VITE_PHONEPE_MERCHANT_ID=PHONEPEPGUAT
VITE_PHONEPE_KEY_INDEX=1
VITE_PHONEPE_SALT_KEY=c817ffaf-8471-48b5-a7e2-a27e5b7efbd3
VITE_PHONEPE_BASE_URL=https://api-preprod.phonepe.com/apis/pg-sandbox

# Supabase Configuration
VITE_SUPABASE_URL=your_supabase_url_here
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key_here
VITE_FRONTEND_URL=http://localhost:3000
EOF
    echo "📝 Please update .env.local with your actual Supabase credentials"
fi

echo "📋 Next steps:"
echo "1. Update your .env.local file with correct Supabase credentials"
echo "2. Set environment variables in Supabase dashboard:"
echo "   - PHONEPE_MERCHANT_ID=PHONEPEPGUAT"
echo "   - PHONEPE_KEY_INDEX=1"
echo "   - PHONEPE_SALT_KEY=c817ffaf-8471-48b5-a7e2-a27e5b7efbd3"
echo "   - PHONEPE_BASE_URL=https://api-preprod.phonepe.com/apis/pg-sandbox"
echo "   - FRONTEND_URL=your_frontend_url"
echo "3. Test the integration using the test credentials provided in the documentation"
echo "4. Update to production credentials when ready to go live"

echo ""
echo "🎉 PhonePe integration deployment completed!"
echo "📖 Check PHONEPE_INTEGRATION_GUIDE.md for detailed usage instructions"
