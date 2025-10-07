# PowerShell script to set Claude API key in Supabase
param(
    [Parameter(Mandatory=$true)]
    [string]$ApiKey
)

Write-Host "🔑 Setting Claude API key in Supabase secrets..." -ForegroundColor Yellow

# Validate API key format
if (-not $ApiKey.StartsWith("sk-ant-api03-")) {
    Write-Host "❌ Invalid API key format. Claude API keys should start with 'sk-ant-api03-'" -ForegroundColor Red
    exit 1
}

try {
    # Set the secret
    $result = npx supabase secrets set "claude_api_key=$ApiKey" 2>&1
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Claude API key set successfully!" -ForegroundColor Green
        Write-Host "🔍 Testing the API key..." -ForegroundColor Yellow
        
        # Test the API key
        $env:CLAUDE_API_KEY = $ApiKey
        node test-claude-api.js
        
    } else {
        Write-Host "❌ Failed to set API key:" -ForegroundColor Red
        Write-Host $result -ForegroundColor Red
    }
} catch {
    Write-Host "❌ Error setting API key: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "`n📝 Usage: .\set-claude-key.ps1 -ApiKey 'your-claude-api-key-here'" -ForegroundColor Cyan
