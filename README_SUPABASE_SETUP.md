# Supabase Functions Setup Guide

## Current Issues and Solutions

### 1. Docker Not Installed

**Problem**: Supabase CLI requires Docker for local development, but Docker is not installed on your system.

**Solutions**:

- **Option A (Recommended)**: Install Docker Desktop for Windows from https://docs.docker.com/desktop/install/windows/
- **Option B**: Work directly with remote Supabase project (deploy functions to production)

### 2. Functions Not Working

**Problem**: Your Supabase Edge Functions are not accessible because they're not deployed.

**Solution**: Deploy functions to your remote Supabase project.

## Quick Setup Steps

### Step 1: Login to Supabase

```powershell
npx supabase login
```

### Step 2: Link Your Project

```powershell
npx supabase link --project-ref lvnkpserdydhnqbigfbz
```

### Step 3: Set Environment Variables

Go to your Supabase Dashboard → Settings → Edge Functions and add:

- `OPENAI_API_KEY`: Your OpenAI API key
- `SUPABASE_URL`: https://lvnkpserdydhnqbigfbz.supabase.co
- `SUPABASE_ANON_KEY`: Your anon key

### Step 4: Deploy Functions

```powershell
.\deploy-functions.ps1
```

Or manually:

```powershell
npx supabase functions deploy generate-health-plan
npx supabase functions deploy generate-health-plan-simple
npx supabase functions deploy test-basic
```

### Step 5: Test Functions

After deployment, test in your app or using the Supabase Dashboard.

## Environment Variables Needed

Create a `.env.local` file with:

```env
VITE_SUPABASE_URL=https://lvnkpserdydhnqbigfbz.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx2bmtwc2VyZHlkaG5xYmlnZmJ6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTMzMzY5NjYsImV4cCI6MjA2ODkxMjk2Nn0.Y2NfbA7K9efpFHB6FFmCtgti3udX5wbOoQVkDndtkBc
VITE_OPENAI_API_KEY=your_openai_api_key_here
VITE_RAZORPAY_KEY_ID=your_razorpay_key_here
```

## Troubleshooting

### If functions still don't work:

1. Check Supabase Dashboard → Edge Functions → Logs
2. Verify environment variables are set
3. Check function deployment status
4. Test with simple function first (`test-basic`)

### Common Issues:

- **CORS errors**: Functions handle CORS automatically
- **Authentication errors**: Make sure user is logged in
- **Timeout errors**: Functions have 20-second timeout
- **OpenAI errors**: Check API key and quotas

## Alternative: Client-Side Fallback

If functions continue to fail, the app has client-side fallback plans that work without functions.
