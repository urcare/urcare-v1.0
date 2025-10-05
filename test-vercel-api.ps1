# PowerShell script to test Vercel API endpoints
# Make sure to replace YOUR_VERCEL_URL with your actual Vercel app URL

param(
    [string]$VercelUrl = "https://your-app.vercel.app"
)

Write-Host "🧪 Testing Vercel API Endpoints..." -ForegroundColor Green

# Test data
$testData = @{
    userProfile = @{
        age = "28"
        gender = "Male"
        height_cm = "175"
        weight_kg = "70"
        health_goals = @("weight_loss", "muscle_gain")
    }
    userInput = "I want to improve my overall health"
} | ConvertTo-Json -Depth 3

Write-Host "📤 Sending test data to Vercel health-score endpoint..." -ForegroundColor Yellow

try {
    # Test health-score endpoint
    $response = Invoke-RestMethod -Uri "$VercelUrl/api/health-score" `
        -Method POST `
        -Headers @{
            "Content-Type" = "application/json"
        } `
        -Body $testData

    Write-Host "✅ Health Score Response:" -ForegroundColor Green
    $response | ConvertTo-Json -Depth 5 | Write-Host

} catch {
    Write-Host "❌ Error testing health-score endpoint:" -ForegroundColor Red
    Write-Host $_.Exception.Message -ForegroundColor Red
    
    if ($_.Exception.Response) {
        $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
        $responseBody = $reader.ReadToEnd()
        Write-Host "Response Body: $responseBody" -ForegroundColor Red
    }
}

Write-Host "`n🧪 Testing health-plans endpoint..." -ForegroundColor Green

try {
    # Test health-plans endpoint
    $planData = @{
        userProfile = @{
            id = "test-user-123"
            full_name = "Test User"
            age = "28"
            gender = "Male"
            height_cm = "175"
            weight_kg = "70"
            health_goals = @("weight_loss", "muscle_gain")
            wake_up_time = "07:00"
            sleep_time = "23:00"
            work_start = "09:00"
            work_end = "17:00"
            breakfast_time = "08:00"
            lunch_time = "13:00"
            dinner_time = "19:00"
            workout_time = "18:00"
            workout_type = "strength_training"
            smoking = "no"
            drinking = "occasionally"
        }
    } | ConvertTo-Json -Depth 3

    $response = Invoke-RestMethod -Uri "$VercelUrl/api/health-plans" `
        -Method POST `
        -Headers @{
            "Content-Type" = "application/json"
        } `
        -Body $planData

    Write-Host "✅ Health Plans Response:" -ForegroundColor Green
    $response | ConvertTo-Json -Depth 5 | Write-Host

} catch {
    Write-Host "❌ Error testing health-plans endpoint:" -ForegroundColor Red
    Write-Host $_.Exception.Message -ForegroundColor Red
    
    if ($_.Exception.Response) {
        $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
        $responseBody = $reader.ReadToEnd()
        Write-Host "Response Body: $responseBody" -ForegroundColor Red
    }
}

Write-Host "`n🎯 Test completed!" -ForegroundColor Green
