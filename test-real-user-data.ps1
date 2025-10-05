# Test Supabase Edge Functions with Real User Data
param(
    [string]$AnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx2bmtwc2VyZHlkaG5xYmlnZmJ6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTMzMzY5NjYsImV4cCI6MjA2ODkxMjk2Nn0.Y2NfbA7K9efpFHB6FFmCtgti3udX5wbOoQVkDndtkBc"
)

Write-Host "Testing Supabase Edge Functions with Real User Data..." -ForegroundColor Green
Write-Host "User: Sarthak Sharma, Age: 23, Goal: Gain Weight" -ForegroundColor Cyan

# Real user data from your request
$realUserData = @{
    userProfile = @{
        id = "5938a520-c407-4655-b820-d012ed06f9ea"
        full_name = "Sarthak Sharma"
        age = "23"
        date_of_birth = "2001-11-04"
        gender = "Male"
        unit_system = "metric"
        height_feet = "5"
        height_inches = "11"
        height_cm = "180"
        weight_kg = "80"
        wake_up_time = "07:30"
        sleep_time = "01:00"
        work_start = "09:00"
        work_end = "23:30"
        breakfast_time = "11:00"
        lunch_time = "14:30"
        dinner_time = "20:30"
        workout_time = "08:00"
        chronic_conditions = @("sleep_disorders_poor_sleep")
        takes_medications = "No"
        medications = @()
        has_surgery = "No"
        surgery_details = @()
        health_goals = @("better_sleep_recovery", "reduce_stress_anxiety", "boost_energy_vitality")
        diet_type = "Vegetarian"
        blood_group = "B+"
        routine_flexibility = "9"
        workout_type = "Home Gym"
        smoking = "Former smoker"
        drinking = "Occasionally"
        critical_conditions = "Sinus"
        has_health_reports = "No"
        health_reports = @()
        status = "active"
        onboarding_completed = $true
        allergies = $null
    }
    userInput = "I want to gain weight as my primary goal. I have sleep disorders and poor sleep quality. I work long hours (9 AM to 11:30 PM) and need help with better sleep recovery, reducing stress and anxiety, and boosting energy and vitality."
} | ConvertTo-Json -Depth 5

Write-Host "`n=== TESTING HEALTH SCORE FUNCTION ===" -ForegroundColor Yellow
Write-Host "Sending real user data to health-score function..." -ForegroundColor White

try {
    $healthScoreResponse = Invoke-RestMethod -Uri "https://lvnkpserdydhnqbigfbz.supabase.co/functions/v1/health-score" `
        -Method POST `
        -Headers @{
            "Authorization" = "Bearer $AnonKey"
            "Content-Type" = "application/json"
        } `
        -Body $realUserData

    Write-Host "✅ HEALTH SCORE RESPONSE:" -ForegroundColor Green
    Write-Host "Health Score: $($healthScoreResponse.healthScore)" -ForegroundColor Cyan
    Write-Host "Provider: $($healthScoreResponse.meta.provider)" -ForegroundColor Cyan
    Write-Host "Timestamp: $($healthScoreResponse.meta.timestamp)" -ForegroundColor Cyan
    Write-Host "`nAnalysis:" -ForegroundColor Yellow
    Write-Host $healthScoreResponse.analysis -ForegroundColor White
    Write-Host "`nRecommendations:" -ForegroundColor Yellow
    foreach ($rec in $healthScoreResponse.recommendations) {
        Write-Host "• $rec" -ForegroundColor White
    }

} catch {
    Write-Host "❌ HEALTH SCORE FAILED: $($_.Exception.Message)" -ForegroundColor Red
    if ($_.Exception.Response) {
        $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
        $responseBody = $reader.ReadToEnd()
        Write-Host "Response: $responseBody" -ForegroundColor Red
    }
}

Write-Host "`n=== TESTING PLAN ACTIVITIES FUNCTION ===" -ForegroundColor Yellow
Write-Host "Sending real user data to plan-activities function..." -ForegroundColor White

$planActivitiesData = @{
    selectedPlan = @{
        id = "weight_gain_plan"
        name = "Weight Gain & Sleep Recovery Plan"
        difficulty = "intermediate"
        focus_areas = @("weight_gain", "sleep_recovery", "stress_management")
    }
    userProfile = $realUserData.userProfile
} | ConvertTo-Json -Depth 5

try {
    $planActivitiesResponse = Invoke-RestMethod -Uri "https://lvnkpserdydhnqbigfbz.supabase.co/functions/v1/plan-activities" `
        -Method POST `
        -Headers @{
            "Authorization" = "Bearer $AnonKey"
            "Content-Type" = "application/json"
        } `
        -Body $planActivitiesData

    Write-Host "✅ PLAN ACTIVITIES RESPONSE:" -ForegroundColor Green
    Write-Host "Activities Generated: $($planActivitiesResponse.activities.Count)" -ForegroundColor Cyan
    Write-Host "Plan Focus: $($planActivitiesResponse.plan_focus)" -ForegroundColor Cyan
    Write-Host "`nActivities:" -ForegroundColor Yellow
    foreach ($activity in $planActivitiesResponse.activities) {
        Write-Host "• $($activity.title) - $($activity.type) at $($activity.scheduled_time)" -ForegroundColor White
        Write-Host "  Description: $($activity.description)" -ForegroundColor Gray
        Write-Host "  Duration: $($activity.duration) minutes" -ForegroundColor Gray
        Write-Host ""
    }

} catch {
    Write-Host "❌ PLAN ACTIVITIES FAILED: $($_.Exception.Message)" -ForegroundColor Red
    if ($_.Exception.Response) {
        $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
        $responseBody = $reader.ReadToEnd()
        Write-Host "Response: $responseBody" -ForegroundColor Red
    }
}

Write-Host "`n=== TESTING GENERATE AI HEALTH PLANS FUNCTION ===" -ForegroundColor Yellow
Write-Host "Sending real user data to generate-ai-health-plans function..." -ForegroundColor White

$healthPlansData = @{
    user_profile = $realUserData.userProfile
} | ConvertTo-Json -Depth 5

try {
    $healthPlansResponse = Invoke-RestMethod -Uri "https://lvnkpserdydhnqbigfbz.supabase.co/functions/v1/generate-ai-health-plans" `
        -Method POST `
        -Headers @{
            "Authorization" = "Bearer $AnonKey"
            "Content-Type" = "application/json"
        } `
        -Body $healthPlansData

    Write-Host "✅ HEALTH PLANS RESPONSE:" -ForegroundColor Green
    Write-Host "Plans Generated: $($healthPlansResponse.plans.Count)" -ForegroundColor Cyan
    Write-Host "`nHealth Plans:" -ForegroundColor Yellow
    foreach ($plan in $healthPlansResponse.plans) {
        Write-Host "• $($plan.name) ($($plan.difficulty) - $($plan.duration_weeks) weeks)" -ForegroundColor White
        Write-Host "  Description: $($plan.description)" -ForegroundColor Gray
        Write-Host "  Focus Areas: $($plan.focus_areas -join ', ')" -ForegroundColor Gray
        Write-Host "  Activities: $($plan.activities.Count)" -ForegroundColor Gray
        Write-Host ""
    }

} catch {
    Write-Host "❌ HEALTH PLANS FAILED: $($_.Exception.Message)" -ForegroundColor Red
    if ($_.Exception.Response) {
        $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
        $responseBody = $reader.ReadToEnd()
        Write-Host "Response: $responseBody" -ForegroundColor Red
    }
}

Write-Host "`n🎯 REAL USER DATA TEST COMPLETED!" -ForegroundColor Green
Write-Host "All functions tested with Sarthak Sharma's actual profile data" -ForegroundColor Cyan
