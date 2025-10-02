# UrCare Vercel Deployment Script for Windows PowerShell
Write-Host "🚀 Starting UrCare deployment to Vercel..." -ForegroundColor Green

# Check if Vercel CLI is installed
try {
    $vercelVersion = vercel --version
    Write-Host "✅ Vercel CLI found: $vercelVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Vercel CLI not found. Installing..." -ForegroundColor Red
    npm install -g vercel
}

# Check if user is logged in to Vercel
try {
    $user = vercel whoami
    Write-Host "✅ Logged in as: $user" -ForegroundColor Green
} catch {
    Write-Host "🔐 Please login to Vercel first:" -ForegroundColor Yellow
    vercel login
}

Write-Host "📦 Building frontend..." -ForegroundColor Blue
npm run build

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Build failed!" -ForegroundColor Red
    exit 1
}

Write-Host "🚀 Deploying to Vercel..." -ForegroundColor Blue
vercel --prod

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Deployment complete!" -ForegroundColor Green
    Write-Host "🔗 Your app is now live at: https://urcare-app.vercel.app" -ForegroundColor Cyan
    Write-Host "📊 PhonePe server: https://urcare-phonepe-server.vercel.app" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "📝 Next steps:" -ForegroundColor Yellow
    Write-Host "1. Set up PhonePe sandbox account" -ForegroundColor White
    Write-Host "2. Configure environment variables in Vercel dashboard" -ForegroundColor White
    Write-Host "3. Test payment flow" -ForegroundColor White
    Write-Host "4. Switch to production credentials when ready" -ForegroundColor White
} else {
    Write-Host "❌ Deployment failed!" -ForegroundColor Red
    exit 1
}

