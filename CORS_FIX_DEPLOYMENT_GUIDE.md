# CORS Fix Deployment Guide

## ✅ Issues Fixed

### 1. Backend CORS Configuration
- **Fixed**: Updated `server.js` to explicitly allow production frontend domain
- **Added**: Proper CORS headers for `https://urcare.vercel.app`
- **Added**: Preflight OPTIONS request handling

### 2. Frontend API URLs
- **Fixed**: Replaced all hardcoded `localhost:3000` URLs with environment variables
- **Updated**: All services now use `VITE_API_BASE_URL` environment variable
- **Files Updated**:
  - `src/services/healthScoreService.ts`
  - `src/services/planActivitiesService.ts`
  - `src/services/healthPlanService.ts`
  - `src/pages/Dashboard.tsx`
  - `src/components/VoiceRecorder.tsx`
  - `src/config/index.ts`

### 3. PhonePe CORS Proxy
- **Created**: `/api/phonepe/create` proxy route in frontend
- **Fixed**: PhonePe service now uses proxy instead of direct external calls
- **Updated**: `src/services/phonepeBackendService.ts` to use proxy

### 4. Environment Configuration
- **Updated**: `env.example` with production URLs
- **Created**: `env.production` for production deployment
- **Updated**: `vercel.json` to handle API routes properly

## 🚀 Deployment Steps

### Step 1: Deploy Backend Server
```bash
# Deploy your Express server to Vercel
# Make sure it's deployed to: https://urcare-server.vercel.app
```

### Step 2: Set Environment Variables in Vercel

#### Frontend Environment Variables:
```bash
VITE_API_BASE_URL=https://urcare-server.vercel.app
VITE_PHONEPE_API_URL=https://phonepe-server-25jew6ja6-urcares-projects.vercel.app
VITE_SUPABASE_URL=https://lvnkpserdydhnqbigfbz.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx2bmtwc2VyZHlkaG5xYmlnZmJ6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTMzMzY5NjYsImV4cCI6MjA2ODkxMjk2Nn0.Y2NfbA7K9efpFHB6FFmCtgti3udX5wbOoQVkDndtkBc
VITE_GROQ_API_KEY=your_groq_api_key_here
```

#### Backend Environment Variables:
```bash
VITE_GROQ_API_KEY=your_groq_api_key_here
SUPABASE_URL=https://lvnkpserdydhnqbigfbz.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx2bmtwc2VyZHlkaG5xYmlnZmJ6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTMzMzY5NjYsImV4cCI6MjA2ODkxMjk2Nn0.Y2NfbA7K9efpFHB6FFmCtgti3udX5wbOoQVkDndtkBc
```

### Step 3: Deploy Frontend
```bash
# Deploy your frontend to Vercel
# Make sure it's deployed to: https://urcare.vercel.app
```

### Step 4: Test the Fix

#### Test Health Score API:
```bash
curl -X POST https://urcare-server.vercel.app/api/health-score \
  -H "Content-Type: application/json" \
  -H "Origin: https://urcare.vercel.app" \
  -d '{"userProfile": {"age": 30, "gender": "Male"}}'
```

#### Test CORS Headers:
```bash
curl -I -X OPTIONS https://urcare-server.vercel.app/api/health-score \
  -H "Origin: https://urcare.vercel.app" \
  -H "Access-Control-Request-Method: POST"
```

Expected response headers:
```
HTTP/2 200
access-control-allow-origin: https://urcare.vercel.app
access-control-allow-methods: GET, POST, OPTIONS
access-control-allow-headers: Content-Type, Authorization, X-Requested-With
```

#### Test PhonePe Proxy:
```bash
curl -X POST https://urcare.vercel.app/api/phonepe/create \
  -H "Content-Type: application/json" \
  -d '{"amount": 100, "orderId": "test123"}'
```

## 🔧 Configuration Details

### CORS Configuration in server.js
```javascript
app.use(cors({ 
  origin: [
    'https://urcare.vercel.app', // Production frontend
    'http://localhost:5173', // Local development
    'http://localhost:3000', // Local development
    'http://127.0.0.1:5173', // Local development
    'http://127.0.0.1:3000' // Local development
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  credentials: true
}));

// Handle preflight requests
app.options('*', cors());
```

### Environment Variable Usage
All API calls now use:
```javascript
const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || 'https://urcare-server.vercel.app';
```

### PhonePe Proxy Route
The proxy at `/api/phonepe/create` forwards requests to the PhonePe server to avoid CORS issues.

## 🐛 Troubleshooting

### If you still get CORS errors:
1. Check that your backend is deployed to the correct URL
2. Verify environment variables are set correctly
3. Check browser developer tools for the exact error message
4. Ensure the frontend is making requests to the correct backend URL

### If PhonePe payments fail:
1. Check that the PhonePe server is running
2. Verify the proxy route is working
3. Check the PhonePe server logs for errors

### If health score generation fails:
1. Verify the Groq API key is set correctly
2. Check the backend logs for API errors
3. Ensure the health score endpoint is accessible

## 📝 Notes

- The fix maintains backward compatibility with localhost development
- All hardcoded URLs have been replaced with environment variables
- CORS is properly configured for production domains
- PhonePe integration now uses a proxy to avoid CORS issues
- The solution is scalable and maintainable

## ✅ Verification Checklist

- [ ] Backend deployed to `https://urcare-server.vercel.app`
- [ ] Frontend deployed to `https://urcare.vercel.app`
- [ ] Environment variables set correctly
- [ ] CORS headers working (test with curl)
- [ ] Health score API working in production
- [ ] PhonePe proxy working
- [ ] No more CORS errors in browser console
- [ ] All API calls using environment variables

