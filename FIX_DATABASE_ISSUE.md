# Fix Health Scores Database Issue

## Problem

The application is showing 404 errors because the `health_scores` table doesn't exist in your Supabase database.

## Solution

### Option 1: Run SQL Script in Supabase Dashboard (Recommended)

1. Go to your Supabase Dashboard
2. Navigate to the SQL Editor
3. Copy and paste the contents of `create_health_tables.sql`
4. Click "Run" to execute the script

This will create:

- `health_scores` table
- `daily_activities` table
- `weekly_summaries` table
- All necessary indexes and RLS policies
- Helper functions for health score calculations

### Option 2: Use Supabase CLI (if configured)

If you have Supabase CLI configured and linked to your project:

```bash
npx supabase db push
```

## What This Fixes

- ✅ Eliminates 404 errors for health_scores table
- ✅ Enables health score tracking functionality
- ✅ Allows daily activity tracking
- ✅ Provides weekly health summaries
- ✅ Sets up proper Row Level Security (RLS) policies

## After Running the Script

The application will:

- Stop showing 404 errors in the console
- Display default health scores (0) until user starts tracking activities
- Allow users to track daily activities and see their health score improve
- Show weekly health progress charts

## Verification

After running the script, you should see:

- No more 404 errors in the browser console
- Health score components loading properly
- Ability to track daily activities
- Health score calculations working

The application is now enhanced with detailed schedule information and will work properly once the database tables are created.
