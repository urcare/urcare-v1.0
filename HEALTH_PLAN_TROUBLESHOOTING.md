# Health Plan Troubleshooting Guide

## Quick Debug Steps

1. **Open the Planner page** in your app
2. **Click the "🐛 Debug" button** - this will run comprehensive diagnostics
3. **Check the browser console** for detailed error messages
4. **Follow the solutions below** based on the error messages

## Common Errors & Solutions

### 1. "Function not found" Error

**Error Message:** `Function not found: generate-health-plan`

**Solution:** Deploy the Supabase function

```bash
# Install Supabase CLI if not installed
npm install -g supabase

# Login to Supabase
supabase login

# Link your project
supabase link --project-ref YOUR_PROJECT_REF

# Deploy the function
supabase functions deploy generate-health-plan
```

### 2. "OpenAI not configured" Error

**Error Message:** `OpenAI API key not configured`

**Solution:** Add OpenAI API key to Supabase secrets

```bash
# Add the secret to your Supabase project
supabase secrets set OPENAI_API_KEY=your_openai_api_key_here
```

### 3. "User profile not found" Error

**Error Message:** `User profile not found`

**Solution:** Complete the onboarding process first

- Go to the onboarding page
- Fill out all required information
- Complete the onboarding flow

### 4. "Onboarding not completed" Error

**Error Message:** `Onboarding not completed`

**Solution:** Complete the onboarding process

- Ensure all onboarding steps are completed
- Check that `onboarding_completed` is set to `true` in the database

### 5. "Failed to save health plan" Error

**Error Message:** `Failed to save health plan`

**Solution:** Check database tables exist

```sql
-- Run these in your Supabase SQL editor
-- Check if tables exist
SELECT * FROM information_schema.tables
WHERE table_name IN ('two_day_health_plans', 'plan_progress', 'user_profiles');

-- If tables don't exist, run the migrations
-- The migration files are in supabase/migrations/
```

### 6. "Unauthorized" Error

**Error Message:** `Unauthorized`

**Solution:** Check authentication

- Ensure user is logged in
- Check if Supabase auth is properly configured
- Verify RLS policies are set up correctly

### 7. Database Connection Issues

**Error Message:** Connection timeouts or database errors

**Solution:** Check Supabase configuration

```typescript
// Verify these environment variables are set
VITE_SUPABASE_URL = your_supabase_url;
VITE_SUPABASE_ANON_KEY = your_supabase_anon_key;
```

## Step-by-Step Setup Verification

### 1. Verify Environment Variables

```bash
# Check if these are set in your deployment platform
echo $VITE_SUPABASE_URL
echo $VITE_SUPABASE_ANON_KEY
echo $OPENAI_API_KEY  # This should be set in Supabase secrets, not client env
```

### 2. Verify Database Tables

Run this in your Supabase SQL editor:

```sql
-- Check if all required tables exist
SELECT table_name FROM information_schema.tables
WHERE table_schema = 'public'
AND table_name IN ('user_profiles', 'two_day_health_plans', 'plan_progress');
```

### 3. Verify RLS Policies

```sql
-- Check RLS is enabled
SELECT schemaname, tablename, rowsecurity
FROM pg_tables
WHERE tablename IN ('user_profiles', 'two_day_health_plans', 'plan_progress');
```

### 4. Verify Supabase Functions

```bash
# List deployed functions
supabase functions list
```

### 5. Test the Function Manually

```bash
# Test the function directly
supabase functions invoke generate-health-plan --method POST
```

## Manual Testing Steps

### 1. Test Database Access

```typescript
// Run this in browser console
const { data, error } = await supabase
  .from("user_profiles")
  .select("*")
  .limit(1);
console.log("Database test:", data, error);
```

### 2. Test Authentication

```typescript
// Run this in browser console
const {
  data: { user },
} = await supabase.auth.getUser();
console.log("Auth test:", user);
```

### 3. Test Function Invocation

```typescript
// Run this in browser console
const { data, error } = await supabase.functions.invoke(
  "generate-health-plan",
  {
    method: "POST",
    body: {},
  }
);
console.log("Function test:", data, error);
```

## Development vs Production Issues

### Development Issues

- **Local Supabase**: Make sure you're running `supabase start`
- **Environment Variables**: Check `.env.local` file
- **Function Deployment**: Deploy to local instance with `supabase functions deploy`

### Production Issues

- **Vercel/Netlify**: Check environment variables in deployment settings
- **Supabase Project**: Ensure you're using the correct project URL and keys
- **Function Deployment**: Deploy to production with `supabase functions deploy --project-ref YOUR_PROJECT_REF`

## Getting Help

If you're still experiencing issues:

1. **Run the debug function** (click the 🐛 Debug button)
2. **Copy the console output**
3. **Check the browser network tab** for failed requests
4. **Verify all setup steps** in the main setup guide

## Common Fixes Summary

| Error                  | Quick Fix                                                         |
| ---------------------- | ----------------------------------------------------------------- |
| Function not found     | Deploy function: `supabase functions deploy generate-health-plan` |
| OpenAI not configured  | Set secret: `supabase secrets set OPENAI_API_KEY=your_key`        |
| User profile not found | Complete onboarding first                                         |
| Database errors        | Run migrations in Supabase SQL editor                             |
| Auth errors            | Check user login status                                           |
| RLS errors             | Verify RLS policies are enabled                                   |

## Testing Checklist

- [ ] User is authenticated
- [ ] User profile exists and onboarding is completed
- [ ] Database tables exist (`user_profiles`, `two_day_health_plans`, `plan_progress`)
- [ ] RLS policies are enabled
- [ ] Supabase function is deployed
- [ ] OpenAI API key is set in Supabase secrets
- [ ] Environment variables are configured
- [ ] No console errors in browser
- [ ] Network requests are successful
