# Environment Setup Guide

## 🚨 Critical: Supabase Environment Variables Missing

Your onboarding data is not being saved because the Supabase environment variables are not configured.

### Step 1: Create .env file

Create a `.env` file in your project root with the following content:

```env
# Supabase Configuration
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key_here
```

### Step 2: Get Your Supabase Credentials

1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project
3. Go to **Settings** → **API**
4. Copy the **Project URL** and **anon public** key
5. Replace the placeholders in your `.env` file

### Step 3: Restart Development Server

```bash
npm run dev
```

### Step 4: Verify Configuration

Check your browser console - you should see:
```
Supabase Environment Check: {
  SUPABASE_URL: 'Set',
  SUPABASE_ANON_KEY: 'Set',
  hasUrl: true,
  hasKey: true
}
```

### Step 5: Test Onboarding

1. Complete the onboarding flow
2. Check your Supabase dashboard → Table Editor → user_profiles
3. You should see the user's data saved

### Database Schema Requirements

Make sure your `user_profiles` table has these columns:
- `id` (uuid, primary key)
- `full_name` (text)
- `age` (integer)
- `date_of_birth` (date)
- `gender` (text)
- `unit_system` (text)
- `height_feet` (text)
- `height_inches` (text)
- `height_cm` (text)
- `weight_lb` (text)
- `weight_kg` (text)
- `wake_up_time` (text)
- `sleep_time` (text)
- `work_start` (text)
- `work_end` (text)
- `chronic_conditions` (jsonb)
- `takes_medications` (text)
- `medications` (jsonb)
- `has_surgery` (text)
- `surgery_details` (jsonb)
- `health_goals` (jsonb)
- `diet_type` (text)
- `blood_group` (text)
- `breakfast_time` (text)
- `lunch_time` (text)
- `dinner_time` (text)
- `workout_time` (text)
- `routine_flexibility` (text)
- `uses_wearable` (text)
- `wearable_type` (text)
- `track_family` (text)
- `share_progress` (text)
- `emergency_contact_name` (text)
- `emergency_contact_phone` (text)
- `critical_conditions` (text)
- `has_health_reports` (text)
- `health_reports` (jsonb)
- `referral_code` (text)
- `save_progress` (text)
- `status` (text)
- `preferences` (jsonb)
- `onboarding_completed` (boolean)
- `created_at` (timestamp)
- `updated_at` (timestamp)

### Troubleshooting

If you still have issues:

1. **Check console errors** - Look for specific error messages
2. **Verify Supabase connection** - Test with a simple query
3. **Check RLS policies** - Ensure your table has proper permissions
4. **Verify table exists** - Make sure the `user_profiles` table exists

### Quick Test

Add this to your browser console to test Supabase connection:

```javascript
// Test Supabase connection
const { data, error } = await supabase.from('user_profiles').select('count').limit(1);
console.log('Supabase test:', { data, error });
``` 