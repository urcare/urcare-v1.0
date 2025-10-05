# Simple PowerShell script to test Supabase Edge Functions
param(
    [string]$AnonKey = "YOUR_ANON_KEY"
)

Write-Host "Testing Supabase Edge Functions..." -ForegroundColor Green

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

Write-Host "Sending test data to health-score function..." -ForegroundColor Yellow

try {
    # Test health-score function
    $response = Invoke-RestMethod -Uri "https://lvnkpserdydhnqbigfbz.supabase.co/functions/v1/health-score" `
        -Method POST `
        -Headers @{
            "Authorization" = "Bearer $AnonKey"
            "Content-Type" = "application/json"
        } `
        -Body $testData

    Write-Host "SUCCESS: Health Score Response:" -ForegroundColor Green
    $response | ConvertTo-Json -Depth 5 | Write-Host

} catch {
    Write-Host "ERROR testing health-score function:" -ForegroundColor Red
    Write-Host $_.Exception.Message -ForegroundColor Red
    
    if ($_.Exception.Response) {
        $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
        $responseBody = $reader.ReadToEnd()
        Write-Host "Response Body: $responseBody" -ForegroundColor Red
    }
}

Write-Host "Test completed!" -ForegroundColor Green
