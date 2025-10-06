-- Add demographics fields to both user_profiles and onboarding_profiles tables
-- This migration adds country, state, and district fields to both tables
-- without resetting the database or affecting existing data

-- Add demographics columns to user_profiles table (main user profile table)
ALTER TABLE user_profiles 
ADD COLUMN IF NOT EXISTS country TEXT,
ADD COLUMN IF NOT EXISTS state TEXT,
ADD COLUMN IF NOT EXISTS district TEXT;

-- Add demographics columns to onboarding_profiles table (raw onboarding data)
ALTER TABLE onboarding_profiles 
ADD COLUMN IF NOT EXISTS country TEXT,
ADD COLUMN IF NOT EXISTS state TEXT,
ADD COLUMN IF NOT EXISTS district TEXT;

-- Add comments for documentation
COMMENT ON COLUMN user_profiles.country IS 'User selected country from demographics step';
COMMENT ON COLUMN user_profiles.state IS 'User selected state/province from demographics step';
COMMENT ON COLUMN user_profiles.district IS 'User selected district/city from demographics step';

COMMENT ON COLUMN onboarding_profiles.country IS 'User selected country from demographics step';
COMMENT ON COLUMN onboarding_profiles.state IS 'User selected state/province from demographics step';
COMMENT ON COLUMN onboarding_profiles.district IS 'User selected district/city from demographics step';

-- Create indexes for better query performance on demographics fields
CREATE INDEX IF NOT EXISTS idx_user_profiles_country ON user_profiles(country);
CREATE INDEX IF NOT EXISTS idx_user_profiles_state ON user_profiles(state);
CREATE INDEX IF NOT EXISTS idx_user_profiles_district ON user_profiles(district);

CREATE INDEX IF NOT EXISTS idx_onboarding_profiles_country ON onboarding_profiles(country);
CREATE INDEX IF NOT EXISTS idx_onboarding_profiles_state ON onboarding_profiles(state);
CREATE INDEX IF NOT EXISTS idx_onboarding_profiles_district ON onboarding_profiles(district);

-- Create composite indexes for location-based queries
CREATE INDEX IF NOT EXISTS idx_user_profiles_location ON user_profiles(country, state, district);
CREATE INDEX IF NOT EXISTS idx_onboarding_profiles_location ON onboarding_profiles(country, state, district);

-- Update existing records to have empty demographics fields (they will be filled when users update their profiles)
UPDATE user_profiles 
SET 
  country = COALESCE(country, ''),
  state = COALESCE(state, ''),
  district = COALESCE(district, '')
WHERE country IS NULL OR state IS NULL OR district IS NULL;

UPDATE onboarding_profiles 
SET 
  country = COALESCE(country, ''),
  state = COALESCE(state, ''),
  district = COALESCE(district, '')
WHERE country IS NULL OR state IS NULL OR district IS NULL;

-- Add constraints to ensure data integrity for user_profiles
-- Drop constraints first if they exist to avoid errors
DO $$ 
BEGIN
    -- Drop user_profiles constraints if they exist
    IF EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name = 'check_user_profiles_country_not_empty' AND table_name = 'user_profiles') THEN
        ALTER TABLE user_profiles DROP CONSTRAINT check_user_profiles_country_not_empty;
    END IF;
    
    IF EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name = 'check_user_profiles_state_not_empty' AND table_name = 'user_profiles') THEN
        ALTER TABLE user_profiles DROP CONSTRAINT check_user_profiles_state_not_empty;
    END IF;
    
    IF EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name = 'check_user_profiles_district_not_empty' AND table_name = 'user_profiles') THEN
        ALTER TABLE user_profiles DROP CONSTRAINT check_user_profiles_district_not_empty;
    END IF;
    
    -- Drop onboarding_profiles constraints if they exist
    IF EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name = 'check_onboarding_profiles_country_not_empty' AND table_name = 'onboarding_profiles') THEN
        ALTER TABLE onboarding_profiles DROP CONSTRAINT check_onboarding_profiles_country_not_empty;
    END IF;
    
    IF EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name = 'check_onboarding_profiles_state_not_empty' AND table_name = 'onboarding_profiles') THEN
        ALTER TABLE onboarding_profiles DROP CONSTRAINT check_onboarding_profiles_state_not_empty;
    END IF;
    
    IF EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name = 'check_onboarding_profiles_district_not_empty' AND table_name = 'onboarding_profiles') THEN
        ALTER TABLE onboarding_profiles DROP CONSTRAINT check_onboarding_profiles_district_not_empty;
    END IF;
END $$;

-- Add constraints to ensure data integrity for user_profiles
ALTER TABLE user_profiles 
ADD CONSTRAINT check_user_profiles_country_not_empty 
CHECK (country = '' OR length(trim(country)) > 0);

ALTER TABLE user_profiles 
ADD CONSTRAINT check_user_profiles_state_not_empty 
CHECK (state = '' OR length(trim(state)) > 0);

ALTER TABLE user_profiles 
ADD CONSTRAINT check_user_profiles_district_not_empty 
CHECK (district = '' OR length(trim(district)) > 0);

-- Add constraints to ensure data integrity for onboarding_profiles
ALTER TABLE onboarding_profiles 
ADD CONSTRAINT check_onboarding_profiles_country_not_empty 
CHECK (country = '' OR length(trim(country)) > 0);

ALTER TABLE onboarding_profiles 
ADD CONSTRAINT check_onboarding_profiles_state_not_empty 
CHECK (state = '' OR length(trim(state)) > 0);

ALTER TABLE onboarding_profiles 
ADD CONSTRAINT check_onboarding_profiles_district_not_empty 
CHECK (district = '' OR length(trim(district)) > 0);

-- Create a function to update demographics in the details JSONB column
CREATE OR REPLACE FUNCTION update_demographics_in_details()
RETURNS TRIGGER AS $$
BEGIN
  -- Update the details JSONB column with demographics information
  NEW.details = jsonb_set(
    COALESCE(NEW.details, '{}'::jsonb),
    '{demographics}',
    jsonb_build_object(
      'country', COALESCE(NEW.country, ''),
      'state', COALESCE(NEW.state, ''),
      'district', COALESCE(NEW.district, '')
    )
  );
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update demographics in details JSONB
DROP TRIGGER IF EXISTS trigger_update_demographics_in_details ON onboarding_profiles;
CREATE TRIGGER trigger_update_demographics_in_details
  BEFORE INSERT OR UPDATE ON onboarding_profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_demographics_in_details();

-- Update existing records to include demographics in their details JSONB
UPDATE onboarding_profiles 
SET details = jsonb_set(
  COALESCE(details, '{}'::jsonb),
  '{demographics}',
  jsonb_build_object(
    'country', COALESCE(country, ''),
    'state', COALESCE(state, ''),
    'district', COALESCE(district, '')
  )
)
WHERE details->'demographics' IS NULL;

-- Grant necessary permissions
GRANT SELECT, INSERT, UPDATE ON onboarding_profiles TO anon, authenticated;

-- Add helpful comments
COMMENT ON FUNCTION update_demographics_in_details() IS 'Automatically updates demographics information in the details JSONB column when country, state, or district fields are updated';
