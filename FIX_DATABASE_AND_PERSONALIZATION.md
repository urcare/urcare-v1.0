# Fix Database and Personalization Issues

## Issues Fixed:
1. **404 errors for `health_scores` table** - Table was missing
2. **Same plan for everyone** - AI was not personalizing based on user goals

## Solution:

### 1. Create Missing Database Tables
Run this SQL script in your Supabase dashboard:

1. Go to your Supabase dashboard
2. Navigate to SQL Editor
3. Copy and paste the contents of `create_health_scores_table.sql`
4. Click "Run" to execute the script

This will create:
- `health_scores` table
- `daily_activities` table  
- `weekly_summaries` table
- Proper RLS policies
- Indexes for performance

### 2. AI Personalization Fixed
The AI plan generation has been updated to:
- ✅ Use the user's specific goal as the primary focus
- ✅ Create goal-specific meal plans and exercises
- ✅ Personalize based on "GAIN WEIGHT", "LOSE WEIGHT", "BUILD MUSCLE", etc.
- ✅ No more generic plans for everyone

## Expected Results:
- ✅ No more 404 errors in console
- ✅ Health scores will work properly
- ✅ AI plans will be personalized based on user goals
- ✅ "GAIN WEIGHT" goal will create weight-gain focused plans
- ✅ "LOSE WEIGHT" goal will create weight-loss focused plans
- ✅ Each user gets a unique, goal-specific plan

## Files Updated:
- `create_health_scores_table.sql` - Database schema
- `supabase/functions/generate-ai-health-coach-plan/index.ts` - AI personalization
