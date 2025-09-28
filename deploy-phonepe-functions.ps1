# PhonePe Integration Deployment Script for Windows PowerShell
# This script deploys all PhonePe-related Supabase Edge Functions

Write-Host "🚀 Starting PhonePe Integration Deployment..." -ForegroundColor Green

# Check if Supabase CLI is installed
try {
    $supabaseVersion = supabase --version
    Write-Host "✅ Supabase CLI found: $supabaseVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Supabase CLI is not installed. Please install it first:" -ForegroundColor Red
    Write-Host "npm install -g supabase" -ForegroundColor Yellow
    exit 1
}

# Check if user is logged in to Supabase
try {
    supabase status | Out-Null
    Write-Host "✅ Logged in to Supabase" -ForegroundColor Green
} catch {
    Write-Host "❌ Not logged in to Supabase. Please run: supabase login" -ForegroundColor Red
    exit 1
}

Write-Host "📦 Deploying Supabase Edge Functions..." -ForegroundColor Blue

# Deploy each function
$functions = @(
    "phonepe-payment-initiate",
    "phonepe-payment-callback",
    "phonepe-payment-status",
    "phonepe-refund",
    "phonepe-refund-callback",
    "phonepe-vpa-validate",
    "phonepe-payment-options"
)

foreach ($func in $functions) {
    Write-Host "Deploying $func..." -ForegroundColor Yellow
    try {
        supabase functions deploy $func
        Write-Host "✅ $func deployed successfully" -ForegroundColor Green
    } catch {
        Write-Host "❌ Failed to deploy $func" -ForegroundColor Red
        exit 1
    }
}

Write-Host "🗄️ Running database migrations..." -ForegroundColor Blue

# Run the PhonePe functions migration
try {
    supabase db push
    Write-Host "✅ Database migrations completed successfully" -ForegroundColor Green
} catch {
    Write-Host "❌ Database migration failed" -ForegroundColor Red
    exit 1
}

Write-Host "🔧 Setting up environment variables..." -ForegroundColor Blue

# Check if .env.local file exists
if (!(Test-Path ".env.local")) {
    Write-Host "Creating .env.local file..." -ForegroundColor Yellow
    $envContent = @"
# PhonePe Configuration
VITE_PHONEPE_MERCHANT_ID=PHONEPEPGUAT
VITE_PHONEPE_KEY_INDEX=1
VITE_PHONEPE_SALT_KEY=c817ffaf-8471-48b5-a7e2-a27e5b7efbd3
VITE_PHONEPE_BASE_URL=https://api-preprod.phonepe.com/apis/pg-sandbox

# Supabase Configuration
VITE_SUPABASE_URL=your_supabase_url_here
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key_here
VITE_FRONTEND_URL=http://localhost:3000
"@
    $envContent | Out-File -FilePath ".env.local" -Encoding UTF8
    Write-Host "📝 Please update .env.local with your actual Supabase credentials" -ForegroundColor Yellow
}

Write-Host "📋 Next steps:" -ForegroundColor Cyan
Write-Host "1. Update your .env.local file with correct Supabase credentials" -ForegroundColor White
Write-Host "2. Set environment variables in Supabase dashboard:" -ForegroundColor White
Write-Host "   - PHONEPE_MERCHANT_ID=PHONEPEPGUAT" -ForegroundColor White
Write-Host "   - PHONEPE_KEY_INDEX=1" -ForegroundColor White
Write-Host "   - PHONEPE_SALT_KEY=c817ffaf-8471-48b5-a7e2-a27e5b7efbd3" -ForegroundColor White
Write-Host "   - PHONEPE_BASE_URL=https://api-preprod.phonepe.com/apis/pg-sandbox" -ForegroundColor White
Write-Host "   - FRONTEND_URL=your_frontend_url" -ForegroundColor White
Write-Host "3. Test the integration using the test credentials provided in the documentation" -ForegroundColor White
Write-Host "4. Update to production credentials when ready to go live" -ForegroundColor White

Write-Host ""
Write-Host "🎉 PhonePe integration deployment completed!" -ForegroundColor Green
Write-Host "📖 Check PHONEPE_INTEGRATION_GUIDE.md for detailed usage instructions" -ForegroundColor Cyan
