# 🚀 Quick Fix for AI Plan Generation

## 🔍 **Current Issue**

The `comprehensive_health_plans` table doesn't exist, causing 406 errors when trying to query it.

## ⚡ **Immediate Fix (2 minutes)**

### **Step 1: Create Database Tables**

1. Go to your Supabase project dashboard: https://supabase.com/dashboard
2. Navigate to **SQL Editor**
3. Copy and paste the entire contents of `create-tables.sql`
4. Click **Run** to execute the script

### **Step 2: Add OpenAI API Key**

1. In Supabase dashboard, go to **Settings** → **Edge Functions**
2. Add environment variable:
   - **Name**: `OPENAI_API_KEY`
   - **Value**: Your OpenAI API key (starts with `sk-`)

### **Step 3: Test**

1. Refresh your app
2. Try generating a health plan
3. You should see GPT-4 generated plans instead of fallback data

## 🎯 **Expected Results**

After these steps:

- ✅ No more 406 errors
- ✅ GPT-4 generates real health plans
- ✅ Plans are saved to database
- ✅ Progress tracking works

## 🔧 **Alternative: Manual Table Creation**

If the SQL script doesn't work, create these tables manually in Supabase:

1. **comprehensive_health_plans**
2. **daily_plan_execution**
3. **weekly_progress_tracking**
4. **monthly_assessments**

Use the schema from `create-tables.sql` for each table.

## 🚨 **Important**

- Make sure to enable Row Level Security (RLS) on all tables
- Add the RLS policies from the SQL script
- The OpenAI API key must be added to Edge Functions, not the main project settings
