# Manual PhonePe Functions Deployment Script
# Run this after logging into Supabase CLI

Write-Host "🚀 Deploying PhonePe Edge Functions..." -ForegroundColor Green

# Check if Supabase CLI is available
try {
    $version = npx supabase --version
    Write-Host "✅ Supabase CLI found: $version" -ForegroundColor Green
} catch {
    Write-Host "❌ Supabase CLI not found. Please install it first." -ForegroundColor Red
    exit 1
}

# Deploy each function
$functions = @(
    "phonepe-payment-initiate",
    "phonepe-payment-callback", 
    "phonepe-payment-status",
    "phonepe-refund",
    "phonepe-vpa-validate",
    "phonepe-payment-options"
)

foreach ($function in $functions) {
    Write-Host "📦 Deploying $function..." -ForegroundColor Yellow
    
    try {
        npx supabase functions deploy $function
        Write-Host "✅ $function deployed successfully!" -ForegroundColor Green
    } catch {
        Write-Host "❌ Failed to deploy $function" -ForegroundColor Red
        Write-Host "Error: $_" -ForegroundColor Red
    }
}

Write-Host "🎉 Deployment complete!" -ForegroundColor Green
Write-Host "📋 Next steps:" -ForegroundColor Cyan
Write-Host "1. Set environment variables in Supabase Dashboard" -ForegroundColor White
Write-Host "2. Test the functions" -ForegroundColor White
Write-Host "3. Go live with your PhonePe integration!" -ForegroundColor White