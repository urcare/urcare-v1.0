# Demographics Update for UrCare Onboarding

This update adds a demographics step to the onboarding flow, allowing users to select their country, state/province, and district/city from dropdown lists.

## Changes Made

### 1. New Demographics Step Component
- **File**: `src/components/onboarding/steps/DemographicsStep.tsx`
- **Features**:
  - Country selection dropdown with comprehensive country list
  - State/Province selection (populated based on selected country)
  - District/City selection (populated based on selected state)
  - Cascading dropdowns (state resets when country changes, district resets when state changes)
  - Includes data for India, United States, United Kingdom, and Canada
  - Follows the same design theme as other onboarding steps

### 2. Updated Onboarding Flow
- **File**: `src/components/onboarding/SerialOnboarding.tsx`
- **Changes**:
  - Added demographics step after height/weight step and before sleep schedule
  - Added `country`, `state`, and `district` fields to `OnboardingData` interface
  - Added validation for demographics step (all three fields required)
  - Added demographics step to the steps array with proper icon and title

### 3. Database Migration
- **File**: `supabase/migrations/016_add_demographics_fields.sql`
- **File**: `run_demographics_migration.sql` (standalone script)
- **Changes**:
  - Adds `country`, `state`, and `district` columns to **both** `user_profiles` and `onboarding_profiles` tables
  - Creates indexes for better query performance on both tables
  - Adds constraints for data integrity on both tables
  - Creates a trigger to automatically update demographics in the JSONB details column
  - Updates existing records to include empty demographics fields
  - **No data loss** - existing records are preserved

## How to Apply the Changes

### 1. Database Migration
Run the SQL migration in your Supabase SQL Editor:
```sql
-- Copy and paste the contents of run_demographics_migration.sql
-- into your Supabase SQL Editor and execute
```

### 2. Code Changes
The code changes are already applied to the following files:
- `src/components/onboarding/steps/DemographicsStep.tsx` (new file)
- `src/components/onboarding/SerialOnboarding.tsx` (updated)

### 3. Testing
1. Start the development server
2. Navigate to the onboarding flow
3. The demographics step should appear after the height/weight step
4. Test the cascading dropdowns (country → state → district)
5. Verify that validation works correctly
6. Check that data is saved to the database

## Database Schema Changes

### New Columns in `user_profiles`:
- `country` (TEXT) - User's selected country
- `state` (TEXT) - User's selected state/province  
- `district` (TEXT) - User's selected district/city

### New Columns in `onboarding_profiles`:
- `country` (TEXT) - User's selected country
- `state` (TEXT) - User's selected state/province  
- `district` (TEXT) - User's selected district/city

### New Indexes:
**For user_profiles:**
- `idx_user_profiles_country`
- `idx_user_profiles_state`
- `idx_user_profiles_district`
- `idx_user_profiles_location` (composite index)

**For onboarding_profiles:**
- `idx_onboarding_profiles_country`
- `idx_onboarding_profiles_state`
- `idx_onboarding_profiles_district`
- `idx_onboarding_profiles_location` (composite index)

### New Trigger:
- `trigger_update_demographics_in_details` - Automatically updates demographics in the JSONB details column

## Data Structure

The demographics data is stored in two places:
1. **Dedicated columns**: `country`, `state`, `district` for easy querying
2. **JSONB details column**: `details.demographics` for backward compatibility

Example JSONB structure:
```json
{
  "demographics": {
    "country": "India",
    "state": "Maharashtra", 
    "district": "Mumbai"
  }
}
```

## Supported Countries and Regions

Currently includes comprehensive data for:
- **India**: All states and districts
- **United States**: Major states with counties
- **United Kingdom**: England, Scotland, Wales, Northern Ireland with counties
- **Canada**: Major provinces with regions

## Validation Rules

- All three fields (country, state, district) are required
- Country must be selected before state
- State must be selected before district
- Empty strings are not allowed (validation prevents submission)

## Backward Compatibility

- Existing users will see empty demographics fields
- No existing data is lost or modified
- The system gracefully handles missing demographics data
- JSONB details column is automatically updated when demographics are saved

## Future Enhancements

Potential improvements for the future:
1. Add more countries and regions
2. Add postal code/ZIP code field
3. Add timezone detection based on location
4. Add location-based health recommendations
5. Add demographic analytics and reporting
