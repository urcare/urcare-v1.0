# PhonePe Edge Functions Deployment Script
# This script deploys the PhonePe integration Edge Functions to Supabase

Write-Host "🚀 Deploying PhonePe Edge Functions..." -ForegroundColor Green

# Check if Supabase CLI is installed
try {
    $supabaseVersion = supabase --version
    Write-Host "✅ Supabase CLI found: $supabaseVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Supabase CLI not found. Please install it first:" -ForegroundColor Red
    Write-Host "npm install -g supabase" -ForegroundColor Yellow
    exit 1
}

# Deploy phonepe-create-order function
Write-Host "📦 Deploying phonepe-create-order function..." -ForegroundColor Blue
try {
    supabase functions deploy phonepe-create-order
    Write-Host "✅ phonepe-create-order deployed successfully" -ForegroundColor Green
} catch {
    Write-Host "❌ Failed to deploy phonepe-create-order" -ForegroundColor Red
    Write-Host $_.Exception.Message -ForegroundColor Red
}

# Deploy phonepe-payment-status function
Write-Host "📦 Deploying phonepe-payment-status function..." -ForegroundColor Blue
try {
    supabase functions deploy phonepe-payment-status
    Write-Host "✅ phonepe-payment-status deployed successfully" -ForegroundColor Green
} catch {
    Write-Host "❌ Failed to deploy phonepe-payment-status" -ForegroundColor Red
    Write-Host $_.Exception.Message -ForegroundColor Red
}

# Deploy phonepe-payment-callback function
Write-Host "📦 Deploying phonepe-payment-callback function..." -ForegroundColor Blue
try {
    supabase functions deploy phonepe-payment-callback
    Write-Host "✅ phonepe-payment-callback deployed successfully" -ForegroundColor Green
} catch {
    Write-Host "❌ Failed to deploy phonepe-payment-callback" -ForegroundColor Red
    Write-Host $_.Exception.Message -ForegroundColor Red
}

Write-Host "🎉 PhonePe Edge Functions deployment completed!" -ForegroundColor Green
Write-Host ""
Write-Host "📋 Next Steps:" -ForegroundColor Yellow
Write-Host "1. Set environment variables in Supabase Dashboard:" -ForegroundColor White
Write-Host "   - Go to Edge Functions > Settings > Environment Variables" -ForegroundColor White
Write-Host "   - Add the following variables:" -ForegroundColor White
Write-Host ""
Write-Host "   PHONEPE_MERCHANT_ID = M23XRS3XN3QMF" -ForegroundColor Cyan
Write-Host "   PHONEPE_CLIENT_ID = SU2509291721337653559173" -ForegroundColor Cyan
Write-Host "   PHONEPE_CLIENT_SECRET = 713219fb-38d0-468d-8268-8b15955468b0" -ForegroundColor Cyan
Write-Host "   PHONEPE_CLIENT_VERSION = 1" -ForegroundColor Cyan
Write-Host "   PHONEPE_KEY_INDEX = 1" -ForegroundColor Cyan
Write-Host "   PHONEPE_API_KEY = 713219fb-38d0-468d-8268-8b15955468b0" -ForegroundColor Cyan
Write-Host "   PHONEPE_BASE_URL = https://api-preprod.phonepe.com/apis/pg-sandbox" -ForegroundColor Cyan
Write-Host "   PHONEPE_ENV = SANDBOX" -ForegroundColor Cyan
Write-Host "   FRONTEND_URL = http://localhost:8080" -ForegroundColor Cyan
Write-Host "   MERCHANT_USERNAME = M23XRS3XN3QMF" -ForegroundColor Cyan
Write-Host "   MERCHANT_PASSWORD = 713219fb-38d0-468d-8268-8b15955468b0" -ForegroundColor Cyan
Write-Host ""
Write-Host "2. Test the integration:" -ForegroundColor White
Write-Host "   - Run your app and try the payment flow" -ForegroundColor White
Write-Host "   - Check the Edge Function logs for any errors" -ForegroundColor White
Write-Host ""
Write-Host "3. For production:" -ForegroundColor White
Write-Host "   - Change PHONEPE_ENV to PRODUCTION" -ForegroundColor White
Write-Host "   - Update all credentials to production values" -ForegroundColor White
Write-Host "   - Update FRONTEND_URL to your production domain" -ForegroundColor White