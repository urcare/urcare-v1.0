# OpenAI API Setup Guide

## 🔑 Setting up OpenAI API Key

### Step 1: Get OpenAI API Key
1. Go to [OpenAI Platform](https://platform.openai.com/)
2. Sign up or log in to your account
3. Navigate to [API Keys](https://platform.openai.com/api-keys)
4. Click "Create new secret key"
5. Give it a name (e.g., "UrCare Health Plans")
6. Copy the API key (starts with `sk-`)

### Step 2: Add to Supabase Edge Functions
1. Go to your [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project
3. Navigate to **Settings** → **Edge Functions**
4. Click on **Environment Variables**
5. Add a new environment variable:
   - **Name**: `OPENAI_API_KEY`
   - **Value**: Your OpenAI API key (e.g., `sk-...`)
6. Click **Save**

### Step 3: Deploy the Edge Function
Run this command in your terminal:
```bash
npx supabase functions deploy generate-ai-health-plans
```

### Step 4: Test the Integration
1. Complete the onboarding process
2. Go to health assessment page
3. Click "Get My Personalized Health Plan"
4. The system should now generate 3 AI-powered health plans

## 🧪 Testing the API

### Check if OpenAI is working:
1. Open browser developer tools (F12)
2. Go to Network tab
3. Complete the health plan generation flow
4. Look for requests to `generate-ai-health-plans`
5. Check the response for AI-generated content

### Expected Response Format:
```json
{
  "success": true,
  "plans": [
    {
      "id": "plan_1",
      "name": "Beginner Wellness Plan",
      "description": "A gentle introduction to healthy living...",
      "difficulty": "beginner",
      "duration_weeks": 12,
      "focus_areas": ["Weight Management", "Energy Boost"],
      "expected_outcomes": ["Improved energy", "Better sleep"],
      "activities": [...],
      "health_metrics": {...},
      "weekly_schedule": {...}
    }
  ],
  "health_score": {
    "current": 65,
    "projected": 85,
    "improvements": ["Better nutrition", "Regular exercise"]
  },
  "personalized_insights": ["Focus on consistency", "Include cardio"]
}
```

## 🚨 Troubleshooting

### Common Issues:

1. **"OpenAI API key not configured"**
   - Make sure you added `OPENAI_API_KEY` to Supabase Edge Functions environment variables
   - Redeploy the function after adding the key

2. **"OpenAI API error: 401"**
   - Check if your API key is correct
   - Make sure you have credits in your OpenAI account

3. **"OpenAI API error: 429"**
   - You've hit the rate limit
   - Wait a few minutes and try again
   - Consider upgrading your OpenAI plan

4. **"Failed to generate health plans"**
   - Check the browser console for detailed error messages
   - Verify the Edge Function is deployed correctly

### Debug Steps:
1. Check Supabase logs in the dashboard
2. Look at browser console for errors
3. Verify the Edge Function is deployed
4. Test with a simple API call

## 💰 OpenAI Pricing

- **GPT-4**: ~$0.03 per 1K input tokens, ~$0.06 per 1K output tokens
- **Estimated cost per health plan generation**: $0.10 - $0.50
- **Free tier**: $5 credit for new accounts

## 🔒 Security Notes

- Never commit your API key to version control
- Use environment variables only
- Consider using Supabase Vault for sensitive keys
- Monitor your API usage regularly

## 📞 Support

If you're still having issues:
1. Check the [OpenAI Documentation](https://platform.openai.com/docs)
2. Review [Supabase Edge Functions Guide](https://supabase.com/docs/guides/functions)
3. Check the project's GitHub issues
