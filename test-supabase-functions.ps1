# PowerShell script to test Supabase Edge Functions
# Make sure to replace YOUR_ANON_KEY with your actual Supabase anon key

param(
    [string]$AnonKey = "YOUR_ANON_KEY",
    [string]$SupabaseUrl = "https://lvnkpserdydhnqbigfbz.supabase.co"
)

Write-Host "🧪 Testing Supabase Edge Functions..." -ForegroundColor Green

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

Write-Host "📤 Sending test data to health-score function..." -ForegroundColor Yellow

try {
    # Test health-score function
    $response = Invoke-RestMethod -Uri "$SupabaseUrl/functions/v1/health-score" `
        -Method POST `
        -Headers @{
            "Authorization" = "Bearer $AnonKey"
            "Content-Type" = "application/json"
        } `
        -Body $testData

    Write-Host "✅ Health Score Response:" -ForegroundColor Green
    $response | ConvertTo-Json -Depth 5 | Write-Host

} catch {
    Write-Host "❌ Error testing health-score function:" -ForegroundColor Red
    Write-Host $_.Exception.Message -ForegroundColor Red
    
    if ($_.Exception.Response) {
        $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
        $responseBody = $reader.ReadToEnd()
        Write-Host "Response Body: $responseBody" -ForegroundColor Red
    }
}

Write-Host "`n🧪 Testing generate-ai-health-plans function..." -ForegroundColor Green

try {
    # Test generate-ai-health-plans function
    $planData = @{
        user_profile = @{
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

    $response = Invoke-RestMethod -Uri "$SupabaseUrl/functions/v1/generate-ai-health-plans" `
        -Method POST `
        -Headers @{
            "Authorization" = "Bearer $AnonKey"
            "Content-Type" = "application/json"
        } `
        -Body $planData

    Write-Host "✅ Health Plans Response:" -ForegroundColor Green
    $response | ConvertTo-Json -Depth 5 | Write-Host

} catch {
    Write-Host "❌ Error testing generate-ai-health-plans function:" -ForegroundColor Red
    Write-Host $_.Exception.Message -ForegroundColor Red
    
    if ($_.Exception.Response) {
        $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
        $responseBody = $reader.ReadToEnd()
        Write-Host "Response Body: $responseBody" -ForegroundColor Red
    }
}

Write-Host "`n🎯 Test completed!" -ForegroundColor Green
