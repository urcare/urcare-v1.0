# PhonePe SDK Integration Setup Script for Windows
Write-Host "🚀 Setting up PhonePe SDK Integration" -ForegroundColor Green
Write-Host "=====================================" -ForegroundColor Green

# Create .env file if it doesn't exist
if (-not (Test-Path ".env")) {
    Write-Host "📝 Creating .env file..." -ForegroundColor Yellow
    Copy-Item "env.example" ".env"
    Write-Host "✅ .env file created. Please edit it with your credentials." -ForegroundColor Green
} else {
    Write-Host "✅ .env file already exists." -ForegroundColor Green
}

# Install dependencies
Write-Host "📦 Installing dependencies..." -ForegroundColor Yellow
npm install

# Check if installation was successful
if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Dependencies installed successfully!" -ForegroundColor Green
} else {
    Write-Host "❌ Failed to install dependencies. Please check your internet connection and try again." -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "🎉 Setup completed successfully!" -ForegroundColor Green
Write-Host ""
Write-Host "📋 Next steps:" -ForegroundColor Cyan
Write-Host "1. Edit .env file with your PhonePe credentials" -ForegroundColor White
Write-Host "2. Run 'npm start' to start the server" -ForegroundColor White
Write-Host "3. Run 'npm test' to test the integration" -ForegroundColor White
Write-Host ""
Write-Host "🔧 Available commands:" -ForegroundColor Cyan
Write-Host "  npm start     - Start the server" -ForegroundColor White
Write-Host "  npm run dev   - Start in development mode" -ForegroundColor White
Write-Host "  npm test      - Run tests" -ForegroundColor White
Write-Host ""
Write-Host "📚 Check README.md for detailed usage instructions." -ForegroundColor Cyan

