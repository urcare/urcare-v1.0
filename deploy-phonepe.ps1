# PhonePe Edge Functions Deployment Script for Windows
# This script deploys PhonePe Edge Functions and sets environment variables

Write-Host "🚀 Deploying PhonePe Edge Functions to Supabase..." -ForegroundColor Green
Write-Host ""

# Check if Supabase CLI is installed
try {
    $supabaseVersion = supabase --version 2>$null
    Write-Host "✅ Supabase CLI found: $supabaseVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Supabase CLI not found!" -ForegroundColor Red
    Write-Host "📦 Install it with: npm install -g supabase" -ForegroundColor Yellow
    exit 1
}

Write-Host ""

# Check if logged in
Write-Host "🔐 Checking Supabase authentication..." -ForegroundColor Cyan
try {
    $projects = supabase projects list 2>$null
    Write-Host "✅ Authenticated with Supabase" -ForegroundColor Green
} catch {
    Write-Host "❌ Not logged in to Supabase" -ForegroundColor Red
    Write-Host "🔑 Please login with: supabase login" -ForegroundColor Yellow
    exit 1
}

Write-Host ""

# Deploy phonepe-create-order function
Write-Host "📦 Deploying phonepe-create-order function..." -ForegroundColor Blue
try {
    supabase functions deploy phonepe-create-order
    Write-Host "✅ phonepe-create-order deployed successfully" -ForegroundColor Green
} catch {
    Write-Host "❌ Failed to deploy phonepe-create-order" -ForegroundColor Red
    Write-Host $_.Exception.Message -ForegroundColor Red
    exit 1
}

Write-Host ""

# Deploy phonepe-status function
Write-Host "📦 Deploying phonepe-status function..." -ForegroundColor Blue
try {
    supabase functions deploy phonepe-status
    Write-Host "✅ phonepe-status deployed successfully" -ForegroundColor Green
} catch {
    Write-Host "❌ Failed to deploy phonepe-status" -ForegroundColor Red
    Write-Host $_.Exception.Message -ForegroundColor Red
    exit 1
}

Write-Host ""

# Set environment variables
Write-Host "🔧 Setting environment variables..." -ForegroundColor Cyan
Write-Host ""

Write-Host "Setting PHONEPE_BASE_URL..." -ForegroundColor Yellow
supabase secrets set PHONEPE_BASE_URL=https://api-preprod.phonepe.com/apis/pg-sandbox

Write-Host "Setting PHONEPE_MERCHANT_ID..." -ForegroundColor Yellow
supabase secrets set PHONEPE_MERCHANT_ID=PGTESTPAYUAT

Write-Host "Setting PHONEPE_API_KEY..." -ForegroundColor Yellow
supabase secrets set PHONEPE_API_KEY=099eb0cd-02cf-4e2a-8aca-3e6c6aff0399

Write-Host "Setting PHONEPE_SALT_INDEX..." -ForegroundColor Yellow
supabase secrets set PHONEPE_SALT_INDEX=1

Write-Host "Setting FRONTEND_URL..." -ForegroundColor Yellow
supabase secrets set FRONTEND_URL=http://localhost:8080

Write-Host ""
Write-Host "✅ Environment variables set successfully" -ForegroundColor Green
Write-Host ""

# List all secrets to verify
Write-Host "📋 Verifying environment variables..." -ForegroundColor Cyan
supabase secrets list

Write-Host ""
Write-Host "🎉 PhonePe Edge Functions deployment completed!" -ForegroundColor Green
Write-Host ""
Write-Host "📝 Next steps:" -ForegroundColor Yellow
Write-Host "1. Test the payment flow in your app" -ForegroundColor White
Write-Host "2. Check Edge Function logs: supabase functions logs phonepe-create-order" -ForegroundColor White
Write-Host "3. For production, update credentials with production values" -ForegroundColor White
Write-Host ""
Write-Host "🧪 To test:" -ForegroundColor Cyan
Write-Host "   - Go to /paywall in your app" -ForegroundColor White
Write-Host "   - Click 'Subscribe Now'" -ForegroundColor White
Write-Host "   - Click 'Pay with PhonePe'" -ForegroundColor White
Write-Host "   - You should be redirected to PhonePe's payment page" -ForegroundColor White
Write-Host ""



