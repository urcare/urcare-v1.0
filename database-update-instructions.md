# Database Update Instructions

## Quick Update for New Onboarding Fields

To update your database with the new onboarding fields, follow these steps:

### Step 1: Run the Migration SQL

Copy and paste the following SQL into your Supabase SQL Editor and run it:

```sql
-- Add new onboarding fields to user_profiles table
-- These fields were added in the updated onboarding flow

-- Add new columns for the updated onboarding steps
ALTER TABLE user_profiles
ADD COLUMN IF NOT EXISTS workout_type VARCHAR(100),
ADD COLUMN IF NOT EXISTS smoking VARCHAR(50),
ADD COLUMN IF NOT EXISTS drinking VARCHAR(50);

-- Update the existing columns that were removed from the onboarding flow
-- Remove columns that are no longer used in the new onboarding flow
ALTER TABLE user_profiles
DROP COLUMN IF EXISTS uses_wearable,
DROP COLUMN IF EXISTS wearable_type,
DROP COLUMN IF EXISTS share_progress,
DROP COLUMN IF EXISTS emergency_contact_name,
DROP COLUMN IF EXISTS emergency_contact_phone;

-- Add indexes for the new fields for better query performance
CREATE INDEX IF NOT EXISTS idx_user_profiles_workout_type ON user_profiles(workout_type);
CREATE INDEX IF NOT EXISTS idx_user_profiles_smoking ON user_profiles(smoking);
CREATE INDEX IF NOT EXISTS idx_user_profiles_drinking ON user_profiles(drinking);

-- Add comments for documentation
COMMENT ON COLUMN user_profiles.workout_type IS 'Preferred workout type (Yoga, Home Gym, Gym, Swimming, Cardio, HIIT)';
COMMENT ON COLUMN user_profiles.smoking IS 'Smoking status (Never smoked, Former smoker, Occasional smoker, Regular smoker)';
COMMENT ON COLUMN user_profiles.drinking IS 'Alcohol consumption level (Never drink, Occasionally, Moderately, Regularly, Heavily)';
```

### Step 2: Verify the Changes

After running the SQL, verify the changes with this query:

```sql
-- Check if new columns exist
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'user_profiles'
AND column_name IN ('workout_type', 'smoking', 'drinking');

-- Check if old columns are removed
SELECT column_name
FROM information_schema.columns
WHERE table_name = 'user_profiles'
AND column_name IN ('uses_wearable', 'wearable_type', 'share_progress', 'emergency_contact_name', 'emergency_contact_phone');
```

### Step 3: Test the Application

1. **Start the application**: `npm run dev`
2. **Go through the onboarding flow** to test the new fields
3. **Check the database** to ensure the new fields are being saved correctly

## What This Update Does

### ✅ Adds New Fields:

- `workout_type`: Stores the user's preferred workout type
- `smoking`: Stores the user's smoking status
- `drinking`: Stores the user's alcohol consumption level

### ❌ Removes Old Fields:

- `uses_wearable`: No longer needed
- `wearable_type`: No longer needed
- `share_progress`: No longer needed
- `emergency_contact_name`: No longer needed
- `emergency_contact_phone`: No longer needed

### 📊 Performance Improvements:

- Adds database indexes for the new fields
- Adds column documentation

## Troubleshooting

If you encounter any issues:

1. **Check Supabase logs** for any error messages
2. **Verify permissions** - ensure you have admin access to the database
3. **Test with a small dataset** first if you have production data
4. **Backup your database** before making changes

## Rollback (if needed)

If you need to rollback the changes:

```sql
-- Restore old columns
ALTER TABLE user_profiles
ADD COLUMN uses_wearable VARCHAR(10),
ADD COLUMN wearable_type VARCHAR(100),
ADD COLUMN share_progress VARCHAR(10),
ADD COLUMN emergency_contact_name VARCHAR(255),
ADD COLUMN emergency_contact_phone VARCHAR(20);

-- Remove new columns
ALTER TABLE user_profiles
DROP COLUMN workout_type,
DROP COLUMN smoking,
DROP COLUMN drinking;
```

## Next Steps

After updating the database:

1. **Deploy the updated code** to your production environment
2. **Test the onboarding flow** thoroughly
3. **Monitor database performance** with the new indexes
4. **Update any existing queries** that might reference the old fields

The application code has already been updated to work with the new database schema!
