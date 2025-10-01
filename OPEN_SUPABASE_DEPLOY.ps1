# Quick Deploy Script - Opens Supabase Dashboard for Easy Deployment

Write-Host "🚀 PhonePe Edge Functions Deployment Helper" -ForegroundColor Green
Write-Host ""
Write-Host "This script will open your Supabase Dashboard in your browser." -ForegroundColor Cyan
Write-Host "Follow the simple steps to deploy!" -ForegroundColor Cyan
Write-Host ""

# Open Supabase Dashboard
Write-Host "📂 Opening Supabase Dashboard..." -ForegroundColor Yellow
Start-Process "https://supabase.com/dashboard"

Start-Sleep -Seconds 2

Write-Host ""
Write-Host "✅ STEP 1: Set Environment Variables" -ForegroundColor Green
Write-Host "   1. Login to Supabase Dashboard (opened in browser)" -ForegroundColor White
Write-Host "   2. Click on your UrCare project" -ForegroundColor White
Write-Host "   3. Go to: Project Settings → Edge Functions → Environment Variables" -ForegroundColor White
Write-Host ""
Write-Host "   Add these 5 variables:" -ForegroundColor Yellow
Write-Host "   - PHONEPE_BASE_URL = https://api-preprod.phonepe.com/apis/pg-sandbox" -ForegroundColor White
Write-Host "   - PHONEPE_MERCHANT_ID = PGTESTPAYUAT" -ForegroundColor White
Write-Host "   - PHONEPE_API_KEY = 099eb0cd-02cf-4e2a-8aca-3e6c6aff0399" -ForegroundColor White
Write-Host "   - PHONEPE_SALT_INDEX = 1" -ForegroundColor White
Write-Host "   - FRONTEND_URL = http://localhost:8080" -ForegroundColor White
Write-Host ""

$response = Read-Host "Have you set all 5 environment variables? (y/n)"

if ($response -eq 'y' -or $response -eq 'Y') {
    Write-Host ""
    Write-Host "✅ STEP 2: Deploy Edge Functions" -ForegroundColor Green
    Write-Host ""
    Write-Host "📝 Opening DASHBOARD_DEPLOYMENT.md for copy-paste code..." -ForegroundColor Yellow
    
    # Open the deployment guide
    $deployGuide = Join-Path $PSScriptRoot "DASHBOARD_DEPLOYMENT.md"
    if (Test-Path $deployGuide) {
        Start-Process notepad $deployGuide
        Write-Host "✅ Deployment guide opened!" -ForegroundColor Green
    }
    
    Write-Host ""
    Write-Host "Next steps:" -ForegroundColor Cyan
    Write-Host "1. In Supabase Dashboard, go to Edge Functions" -ForegroundColor White
    Write-Host "2. Click 'New Function'" -ForegroundColor White
    Write-Host "3. Name: phonepe-create-order" -ForegroundColor White
    Write-Host "4. Copy code from DASHBOARD_DEPLOYMENT.md (lines 64-158)" -ForegroundColor White
    Write-Host "5. Click 'Deploy'" -ForegroundColor White
    Write-Host "6. Repeat for phonepe-status function (lines 172-241)" -ForegroundColor White
    Write-Host ""
    Write-Host "✅ Full instructions are in the opened DASHBOARD_DEPLOYMENT.md file!" -ForegroundColor Green
    
} else {
    Write-Host ""
    Write-Host "⚠️  Please set the environment variables first!" -ForegroundColor Yellow
    Write-Host "   See DASHBOARD_DEPLOYMENT.md for detailed instructions." -ForegroundColor White
}

Write-Host ""
Write-Host "📚 Documentation files:" -ForegroundColor Cyan
Write-Host "   - DASHBOARD_DEPLOYMENT.md (Step-by-step with code)" -ForegroundColor White
Write-Host "   - DEPLOYMENT_CHECKLIST.md (Verification checklist)" -ForegroundColor White
Write-Host "   - README_PHONEPE.md (Quick reference)" -ForegroundColor White
Write-Host ""
Write-Host "🆘 Need help? Check DASHBOARD_DEPLOYMENT.md for troubleshooting!" -ForegroundColor Yellow
Write-Host ""


