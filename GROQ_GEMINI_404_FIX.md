# 🔧 Groq-Gemini Sequential 404 Error Fix

## Problem Summary
The endpoint `/api/groq-gemini-sequential` was returning a 404 error because:
1. **Vercel configuration** was pointing to wrong API directory (`src/pages/api/` instead of `api/`)
2. **Environment variables** were using wrong names (`VITE_*` instead of production names)

## ✅ Fixes Applied

### 1. Fixed Vercel Configuration
**File:** `vercel.json`
```json
// BEFORE (incorrect)
{
  "src": "src/pages/api/**/*.js",
  "use": "@vercel/node"
}

// AFTER (correct)
{
  "src": "api/**/*.js",
  "use": "@vercel/node"
}
```

### 2. Fixed Environment Variables
**Files:** All API files in `/api/` directory
```javascript
// BEFORE (incorrect)
apiKey: process.env.VITE_GROQ_API_KEY
apiKey: process.env.VITE_GEMINI_API_KEY

// AFTER (correct)
apiKey: process.env.GROQ_API_KEY
apiKey: process.env.GEMINI_API_KEY
```

**Files Updated:**
- `api/groq-gemini-sequential.js`
- `api/generate-schedule.js`
- `api/plan-activities.js`
- `api/health-plans.js`
- `api/health-score.js`
- `api/generate-complete-plan.js`

## 🚀 Deployment Steps

### Step 1: Set Environment Variables in Vercel
```bash
# Using Vercel CLI
vercel env add GROQ_API_KEY
vercel env add GROQ_API_KEY_2
vercel env add GEMINI_API_KEY

# Or set them in Vercel Dashboard:
# https://vercel.com/dashboard → Your Project → Settings → Environment Variables
```

### Step 2: Deploy to Vercel
```bash
# Option 1: Using Vercel CLI
vercel --prod

# Option 2: Push to GitHub (if auto-deploy is enabled)
git add .
git commit -m "Fix groq-gemini-sequential 404 error"
git push origin main
```

### Step 3: Verify Deployment
```bash
# Test the endpoint
node test-groq-gemini-endpoint.js
```

## 🧪 Testing

### Local Testing
```bash
# Start your local server
npm run server

# Test in another terminal
node test-groq-gemini-endpoint.js
```

### Production Testing
```bash
# Test production endpoint
curl -X POST https://urrcare.vercel.app/api/groq-gemini-sequential \
  -H "Content-Type: application/json" \
  -d '{
    "userProfile": {
      "full_name": "Test User",
      "age": 30,
      "gender": "Male",
      "height_cm": 175,
      "weight_kg": 70,
      "health_goals": ["Weight Loss"],
      "workout_time": "18:00",
      "sleep_time": "22:00",
      "wake_up_time": "06:00"
    },
    "primaryGoal": "Weight Loss"
  }'
```

## 📋 Environment Variables Checklist

Make sure these are set in Vercel:
- [ ] `GROQ_API_KEY` - Your Groq API key
- [ ] `GROQ_API_KEY_2` - Backup Groq API key (optional)
- [ ] `GEMINI_API_KEY` - Your Google Gemini API key

## 🔍 Troubleshooting

### If still getting 404:
1. **Check Vercel deployment logs** in dashboard
2. **Verify environment variables** are set correctly
3. **Clear Vercel cache** and redeploy
4. **Check file structure** - ensure `api/groq-gemini-sequential.js` exists

### If getting 500 errors:
1. **Check API keys** are valid and have sufficient quota
2. **Check Vercel function logs** for specific error messages
3. **Test locally first** to isolate the issue

## 📁 File Structure
```
urcare-v1.0/
├── api/
│   ├── groq-gemini-sequential.js ✅
│   ├── generate-schedule.js ✅
│   ├── health-plans.js ✅
│   └── ... (other API files)
├── vercel.json ✅
└── test-groq-gemini-endpoint.js ✅
```

## 🎯 Expected Result
After deployment, the endpoint should:
- ✅ Return 200 status code
- ✅ Generate health plans using Groq AI
- ✅ Create detailed schedules using Gemini AI
- ✅ Return structured JSON response

## 📞 Support
If you still encounter issues:
1. Check Vercel function logs
2. Verify all environment variables
3. Test with the provided test script
4. Ensure all dependencies are installed

