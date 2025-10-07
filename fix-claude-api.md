# Claude API Key Fix Guide

## Issue Identified
The Claude API key in your Supabase secrets is invalid or expired, causing 401 authentication errors. Additionally, the functions were requesting the wrong model (`claude-3-5-sonnet-20241022`) instead of your available model (`claude-sonnet-4-20250514`).

## Current Status
- ✅ Claude API key is configured in Supabase secrets
- ✅ Model names updated to use `claude-sonnet-4-20250514`
- ❌ API key returns 401 authentication error
- ❌ Supabase functions fall back to Groq API instead of using Claude

## Solution Steps

### 1. Get a New Claude API Key
1. Go to [Anthropic Console](https://console.anthropic.com/)
2. Sign in to your account
3. Navigate to API Keys section
4. Create a new API key
5. Copy the key (it should start with `sk-ant-api03-`)

### 2. Update Supabase Secret
Run this command with your new API key:
```bash
npx supabase secrets set claude_api_key=YOUR_NEW_API_KEY_HERE
```

### 3. Test the Fix
Run the test script to verify:
```bash
node test-claude-api.js
```

### 4. Verify in Supabase Functions
The functions will automatically use the new key and you should see:
- "Claude API Key status: Present" in logs
- Successful Claude API calls instead of fallbacks

## Expected Behavior After Fix
- Health score function will use Claude as primary API
- Plan activities function will use Claude exclusively  
- Health plans function will use Claude exclusively
- Better response quality and consistency

## Troubleshooting
If you still get 401 errors:
1. Verify the API key format (should start with `sk-ant-api03-`)
2. Check if the key has proper permissions
3. Ensure the key is not expired
4. Try creating a new key if needed
