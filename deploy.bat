@echo off
echo 🚀 Starting UrCare deployment to Vercel...

REM Check if Vercel CLI is installed
vercel --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Vercel CLI not found. Installing...
    npm install -g vercel
)

REM Check if user is logged in to Vercel
vercel whoami >nul 2>&1
if %errorlevel% neq 0 (
    echo 🔐 Please login to Vercel first:
    vercel login
)

echo 📦 Building frontend...
call npm run build
if %errorlevel% neq 0 (
    echo ❌ Build failed!
    pause
    exit /b 1
)

echo 🚀 Deploying frontend to Vercel...
vercel --prod
if %errorlevel% neq 0 (
    echo ❌ Frontend deployment failed!
    pause
    exit /b 1
)

echo 🚀 Deploying PhonePe server to Vercel...
cd phonepe-server
vercel --prod
if %errorlevel% neq 0 (
    echo ❌ Server deployment failed!
    pause
    exit /b 1
)

cd ..

echo ✅ Deployment complete!
echo 🔗 Your app is now live at: https://urcare-app.vercel.app
echo 📊 PhonePe server: https://urcare-phonepe-server.vercel.app
echo.
echo 📝 Next steps:
echo 1. Set up PhonePe sandbox account
echo 2. Configure environment variables in Vercel dashboard
echo 3. Test payment flow
echo 4. Switch to production credentials when ready
echo.
pause

