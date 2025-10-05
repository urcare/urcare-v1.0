# Test all Supabase Edge Functions
param(
    [string]$AnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx2bmtwc2VyZHlkaG5xYmlnZmJ6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTMzMzY5NjYsImV4cCI6MjA2ODkxMjk2Nn0.Y2NfbA7K9efpFHB6FFmCtgti3udX5wbOoQVkDndtkBc"
)

Write-Host "Testing all Supabase Edge Functions..." -ForegroundColor Green

# Test 1: Health Score Function
Write-Host "`n1. Testing health-score function..." -ForegroundColor Yellow
$healthScoreData = @{
    userProfile = @{
        age = "28"
        gender = "Male"
        height_cm = "175"
        weight_kg = "70"
        health_goals = @("weight_loss", "muscle_gain")
    }
    userInput = "I want to improve my overall health"
} | ConvertTo-Json -Depth 3

try {
    $response1 = Invoke-RestMethod -Uri "https://lvnkpserdydhnqbigfbz.supabase.co/functions/v1/health-score" `
        -Method POST `
        -Headers @{
            "Authorization" = "Bearer $AnonKey"
            "Content-Type" = "application/json"
        } `
        -Body $healthScoreData

    Write-Host "✅ health-score: SUCCESS" -ForegroundColor Green
    Write-Host "   Health Score: $($response1.healthScore)" -ForegroundColor Cyan
    Write-Host "   Provider: $($response1.meta.provider)" -ForegroundColor Cyan
} catch {
    Write-Host "❌ health-score: FAILED - $($_.Exception.Message)" -ForegroundColor Red
}

# Test 2: Generate AI Health Plans Function
Write-Host "`n2. Testing generate-ai-health-plans function..." -ForegroundColor Yellow
$healthPlansData = @{
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

try {
    $response2 = Invoke-RestMethod -Uri "https://lvnkpserdydhnqbigfbz.supabase.co/functions/v1/generate-ai-health-plans" `
        -Method POST `
        -Headers @{
            "Authorization" = "Bearer $AnonKey"
            "Content-Type" = "application/json"
        } `
        -Body $healthPlansData

    Write-Host "✅ generate-ai-health-plans: SUCCESS" -ForegroundColor Green
    Write-Host "   Plans Generated: $($response2.plans.Count)" -ForegroundColor Cyan
    Write-Host "   First Plan: $($response2.plans[0].name)" -ForegroundColor Cyan
} catch {
    Write-Host "❌ generate-ai-health-plans: FAILED - $($_.Exception.Message)" -ForegroundColor Red
}

# Test 3: Plan Activities Function
Write-Host "`n3. Testing plan-activities function..." -ForegroundColor Yellow
$planActivitiesData = @{
    selectedPlan = @{
        id = "plan_1"
        name = "Test Plan"
        difficulty = "beginner"
    }
    userProfile = @{
        age = "28"
        gender = "Male"
        height_cm = "175"
        weight_kg = "70"
    }
} | ConvertTo-Json -Depth 3

try {
    $response3 = Invoke-RestMethod -Uri "https://lvnkpserdydhnqbigfbz.supabase.co/functions/v1/plan-activities" `
        -Method POST `
        -Headers @{
            "Authorization" = "Bearer $AnonKey"
            "Content-Type" = "application/json"
        } `
        -Body $planActivitiesData

    Write-Host "✅ plan-activities: SUCCESS" -ForegroundColor Green
    Write-Host "   Activities Generated: $($response3.activities.Count)" -ForegroundColor Cyan
} catch {
    Write-Host "❌ plan-activities: FAILED - $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "`n🎯 All Supabase Edge Functions tested!" -ForegroundColor Green
