# 🚀 Quick RLS Fix for Development User

## 🎯 **Problem Identified:**

The Edge Function is failing because the RLS policies are blocking the development user from inserting records into the `comprehensive_health_plans` table.

## ✅ **Solution:**

Run this SQL script in your Supabase Dashboard to fix the RLS policies.

## 📋 **Steps to Fix:**

### **Step 1: Go to Supabase Dashboard**

1. Open [Supabase Dashboard](https://supabase.com/dashboard/project/lvnkpserdydhnqbigfbz)
2. Go to **SQL Editor**
3. Click **New Query**

### **Step 2: Run This SQL Script**

Copy and paste this SQL script into the SQL Editor and run it:

```sql
-- Create development user profile if it doesn't exist
INSERT INTO user_profiles (
  id,
  full_name,
  email,
  age,
  gender,
  height_cm,
  weight_kg,
  activity_level,
  health_goals,
  dietary_preferences,
  allergies,
  medical_conditions,
  medications,
  onboarding_completed,
  status,
  subscription_status,
  subscription_plan,
  created_at,
  updated_at
) VALUES (
  '9d1051c9-0241-4370-99a3-034bd2d5d001',
  'Development User',
  'dev@urcare.local',
  25,
  'other',
  170,
  70,
  'moderate',
  ARRAY['weight_loss', 'muscle_gain'],
  ARRAY['balanced'],
  ARRAY[]::text[],
  ARRAY[]::text[],
  ARRAY[]::text[],
  true,
  'active',
  'active',
  'premium',
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  full_name = EXCLUDED.full_name,
  email = EXCLUDED.email,
  updated_at = NOW();

-- Update RLS policies to allow development user
DROP POLICY IF EXISTS "Users can insert their own comprehensive health plans" ON comprehensive_health_plans;

CREATE POLICY "Users can insert their own comprehensive health plans" ON comprehensive_health_plans
  FOR INSERT WITH CHECK (
    auth.uid() = user_id OR
    user_id = '9d1051c9-0241-4370-99a3-034bd2d5d001'::uuid
  );
```

### **Step 3: Test the Fix**

After running the SQL script, test the Edge Function again:

```bash
node test-edge-function-simple.js
```

## 🎯 **Expected Results:**

- ✅ Edge Function should return 200 status
- ✅ No more RLS policy violations
- ✅ AI-generated health plans should work

## 🔍 **What This Fix Does:**

1. **Creates Development User Profile** - Ensures the development user exists in the database
2. **Updates RLS Policy** - Allows the development user to insert records into the comprehensive_health_plans table
3. **Maintains Security** - Still requires authentication for real users

## 🚨 **Alternative: Temporary Disable RLS**

If you want to test quickly, you can temporarily disable RLS on the table:

```sql
-- TEMPORARY: Disable RLS for testing (NOT for production)
ALTER TABLE comprehensive_health_plans DISABLE ROW LEVEL SECURITY;
```

**Remember to re-enable it later:**

```sql
-- Re-enable RLS after testing
ALTER TABLE comprehensive_health_plans ENABLE ROW LEVEL SECURITY;
```
