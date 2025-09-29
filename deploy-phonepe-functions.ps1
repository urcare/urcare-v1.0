# PhonePe Functions Deployment Script for Windows PowerShell
# This script deploys all PhonePe-related Edge Functions to Supabase

Write-Host "🚀 Starting PhonePe Functions Deployment..." -ForegroundColor Green

# Check if supabase CLI is installed
try {
    supabase --version | Out-Null
} catch {
    Write-Host "❌ Supabase CLI is not installed. Please install it first." -ForegroundColor Red
    Write-Host "   Visit: https://supabase.com/docs/guides/cli" -ForegroundColor Yellow
    exit 1
}

# Check if user is logged in
try {
    supabase projects list | Out-Null
} catch {
    Write-Host "❌ Please login to Supabase CLI first:" -ForegroundColor Red
    Write-Host "   supabase login" -ForegroundColor Yellow
    exit 1
}

Write-Host "📦 Deploying PhonePe Edge Functions..." -ForegroundColor Blue

# Deploy payment initiation function
Write-Host "  📤 Deploying phonepe-payment-initiate..." -ForegroundColor Cyan
supabase functions deploy phonepe-payment-initiate

# Deploy payment callback function
Write-Host "  📤 Deploying phonepe-payment-callback..." -ForegroundColor Cyan
supabase functions deploy phonepe-payment-callback

# Deploy payment status function
Write-Host "  📤 Deploying phonepe-payment-status..." -ForegroundColor Cyan
supabase functions deploy phonepe-payment-status

# Deploy refund function
Write-Host "  📤 Deploying phonepe-refund..." -ForegroundColor Cyan
supabase functions deploy phonepe-refund

# Deploy refund callback function
Write-Host "  📤 Deploying phonepe-refund-callback..." -ForegroundColor Cyan
supabase functions deploy phonepe-refund-callback

# Deploy VPA validation function
Write-Host "  📤 Deploying phonepe-vpa-validate..." -ForegroundColor Cyan
supabase functions deploy phonepe-vpa-validate

# Deploy payment options function
Write-Host "  📤 Deploying phonepe-payment-options..." -ForegroundColor Cyan
supabase functions deploy phonepe-payment-options

Write-Host "✅ All PhonePe functions deployed successfully!" -ForegroundColor Green

Write-Host ""
Write-Host "🔧 Next Steps:" -ForegroundColor Yellow
Write-Host "1. Set environment variables in your Supabase project:" -ForegroundColor White
Write-Host "   - Go to Settings > Edge Functions" -ForegroundColor Gray
Write-Host "   - Add the required environment variables" -ForegroundColor Gray
Write-Host ""
Write-Host "2. Test the integration:" -ForegroundColor White
Write-Host "   - Start your development server: npm run dev" -ForegroundColor Gray
Write-Host "   - Navigate to the subscription page" -ForegroundColor Gray
Write-Host "   - Test with UAT credentials" -ForegroundColor Gray
Write-Host ""
Write-Host "3. For production:" -ForegroundColor White
Write-Host "   - Update environment variables with production credentials" -ForegroundColor Gray
Write-Host "   - Set PHONEPE_ENVIRONMENT=production" -ForegroundColor Gray
Write-Host ""
Write-Host "📚 Documentation:" -ForegroundColor Yellow
Write-Host "   - Setup Guide: PHONEPE_SETUP_GUIDE.md" -ForegroundColor Gray
Write-Host "   - Integration Guide: PHONEPE_INTEGRATION_GUIDE.md" -ForegroundColor Gray
Write-Host ""
Write-Host "🎉 PhonePe integration is ready!" -ForegroundColor Green