# Database Schema Update for New Onboarding Fields

## Overview

This update modifies the database schema to support the new onboarding flow that includes workout type, smoking habits, and alcohol consumption preferences.

## Changes Made

### ✅ Added New Fields

| Field          | Type         | Description               | Options                                                        |
| -------------- | ------------ | ------------------------- | -------------------------------------------------------------- |
| `workout_type` | VARCHAR(100) | Preferred workout type    | Yoga, Home Gym, Gym, Swimming, Cardio, HIIT                    |
| `smoking`      | VARCHAR(50)  | Smoking status            | Never smoked, Former smoker, Occasional smoker, Regular smoker |
| `drinking`     | VARCHAR(50)  | Alcohol consumption level | Never drink, Occasionally, Moderately, Regularly, Heavily      |

### ❌ Removed Old Fields

| Field                     | Reason                            |
| ------------------------- | --------------------------------- |
| `uses_wearable`           | No longer part of onboarding flow |
| `wearable_type`           | No longer part of onboarding flow |
| `share_progress`          | No longer part of onboarding flow |
| `emergency_contact_name`  | No longer part of onboarding flow |
| `emergency_contact_phone` | No longer part of onboarding flow |

### 📊 Performance Improvements

- Added indexes for new fields for better query performance
- Added column comments for documentation

## Migration Files

### 1. Database Migration

- **File**: `supabase/migrations/20250102000000_add_new_onboarding_fields.sql`
- **Purpose**: Updates the `user_profiles` table schema
- **Status**: Ready to run

### 2. Update Script

- **File**: `scripts/update-database-schema.js`
- **Purpose**: Automated script to run the migration
- **Usage**: `node scripts/update-database-schema.js`

## Code Changes

### 1. TypeScript Interfaces Updated

- **File**: `src/contexts/AuthContext.tsx`
- **Change**: Updated `UserProfile` interface to include new fields

### 2. Onboarding Data Mapping Updated

- **File**: `src/pages/Onboarding.tsx`
- **Change**: Updated profile data mapping to save new fields

## How to Apply Changes

### Option 1: Manual Database Update

```sql
-- Run the migration SQL directly in your Supabase dashboard
-- File: supabase/migrations/20250102000000_add_new_onboarding_fields.sql
```

### Option 2: Automated Script

```bash
# Make sure you have the required environment variables
export VITE_SUPABASE_URL="your-supabase-url"
export SUPABASE_SERVICE_ROLE_KEY="your-service-role-key"

# Run the update script
node scripts/update-database-schema.js
```

## Verification

After running the migration, verify the changes:

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

## Impact on Existing Data

- **Existing users**: No data loss, old fields will be removed safely
- **New users**: Will have the new onboarding flow with updated fields
- **Backward compatibility**: The `onboarding_profiles` table stores raw JSON data, so no data is lost

## Testing

After applying the changes:

1. **Test new onboarding flow** - Verify all new fields are saved correctly
2. **Test existing user profiles** - Ensure no data corruption
3. **Test data retrieval** - Verify new fields are accessible in the application

## Rollback Plan

If you need to rollback:

1. Restore the old column definitions
2. Revert the TypeScript interfaces
3. Update the onboarding data mapping

```sql
-- Rollback SQL (if needed)
ALTER TABLE user_profiles
ADD COLUMN uses_wearable VARCHAR(10),
ADD COLUMN wearable_type VARCHAR(100),
ADD COLUMN share_progress VARCHAR(10),
ADD COLUMN emergency_contact_name VARCHAR(255),
ADD COLUMN emergency_contact_phone VARCHAR(20);

ALTER TABLE user_profiles
DROP COLUMN workout_type,
DROP COLUMN smoking,
DROP COLUMN drinking;
```

## Support

If you encounter any issues:

1. Check the migration logs
2. Verify environment variables are set correctly
3. Ensure you have the necessary database permissions
4. Check the Supabase dashboard for any error messages
