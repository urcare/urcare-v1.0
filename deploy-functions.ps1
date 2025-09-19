# PowerShell script to deploy Supabase Edge Functions
# This script deploys functions to your remote Supabase project

Write-Host "Deploying Supabase Edge Functions..." -ForegroundColor Green

# Check if we're logged in to Supabase
$loginCheck = npx supabase projects list 2>&1
if ($LASTEXITCODE -ne 0) {
    Write-Host "You need to login to Supabase first:" -ForegroundColor Red
    Write-Host "   npx supabase login" -ForegroundColor Yellow
    exit 1
}

# Deploy individual functions
$functions = @(
    "generate-health-plan",
    "generate-health-plan-simple", 
    "test-basic",
    "generate-ai-health-coach-plan",
    "create-razorpay-order",
    "verify-razorpay-payment"
)

foreach ($func in $functions) {
    Write-Host "Deploying function: $func" -ForegroundColor Blue
    npx supabase functions deploy $func
    if ($LASTEXITCODE -eq 0) {
        Write-Host "Successfully deployed: $func" -ForegroundColor Green
    } else {
        Write-Host "Failed to deploy: $func" -ForegroundColor Red
    }
}

Write-Host "Function deployment completed!" -ForegroundColor Green
Write-Host "Note: Make sure your environment variables are set in your Supabase project:" -ForegroundColor Yellow
Write-Host "   - OPENAI_API_KEY" -ForegroundColor Yellow
Write-Host "   - SUPABASE_URL" -ForegroundColor Yellow  
Write-Host "   - SUPABASE_ANON_KEY" -ForegroundColor Yellow