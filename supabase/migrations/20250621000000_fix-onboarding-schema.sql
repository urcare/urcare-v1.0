-- Fix user_profiles table schema for onboarding data
-- Add missing columns and ensure proper data types

-- First, let's ensure the user_profiles table has all necessary columns
ALTER TABLE public.user_profiles 
ADD COLUMN IF NOT EXISTS emergency_phone TEXT,
ADD COLUMN IF NOT EXISTS blood_type TEXT,
ADD COLUMN IF NOT EXISTS height TEXT,
ADD COLUMN IF NOT EXISTS weight TEXT,
ADD COLUMN IF NOT EXISTS age INTEGER;

-- Update the preferences JSONB structure to include all onboarding fields
-- This ensures backward compatibility while storing data properly
CREATE OR REPLACE FUNCTION public.update_user_preferences(
  user_id UUID,
  new_preferences JSONB
)
RETURNS JSONB AS $$
DECLARE
  current_preferences JSONB;
  merged_preferences JSONB;
BEGIN
  -- Get current preferences
  SELECT preferences INTO current_preferences 
  FROM public.user_profiles 
  WHERE id = user_id;
  
  -- Merge with new preferences
  merged_preferences = COALESCE(current_preferences, '{}'::JSONB) || new_preferences;
  
  -- Update the user profile
  UPDATE public.user_profiles 
  SET preferences = merged_preferences,
      updated_at = NOW()
  WHERE id = user_id;
  
  RETURN merged_preferences;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create a function to handle onboarding completion
CREATE OR REPLACE FUNCTION public.complete_user_onboarding(
  user_id UUID,
  onboarding_data JSONB
)
RETURNS BOOLEAN AS $$
DECLARE
  success BOOLEAN := FALSE;
BEGIN
  -- Update user profile with onboarding data
  UPDATE public.user_profiles 
  SET 
    full_name = COALESCE(onboarding_data->>'full_name', full_name),
    phone = COALESCE(onboarding_data->>'phone', phone),
    date_of_birth = COALESCE((onboarding_data->>'date_of_birth')::DATE, date_of_birth),
    gender = COALESCE(onboarding_data->>'gender', gender),
    address = COALESCE(onboarding_data->>'address', address),
    emergency_contact = COALESCE(onboarding_data->>'emergency_contact', emergency_contact),
    emergency_phone = COALESCE(onboarding_data->>'emergency_phone', emergency_phone),
    blood_type = COALESCE(onboarding_data->>'blood_type', blood_type),
    height = COALESCE(onboarding_data->>'height', height),
    weight = COALESCE(onboarding_data->>'weight', weight),
    age = COALESCE((onboarding_data->>'age')::INTEGER, age),
    preferences = COALESCE(preferences, '{}'::JSONB) || jsonb_build_object(
      'allergies', onboarding_data->>'allergies',
      'medical_conditions', onboarding_data->>'medical_conditions',
      'medications', onboarding_data->>'medications',
      'insurance_provider', onboarding_data->>'insurance_provider',
      'insurance_number', onboarding_data->>'insurance_number',
      'insurance_group', onboarding_data->>'insurance_group',
      'insurance_phone', onboarding_data->>'insurance_phone'
    ),
    onboarding_completed = TRUE,
    updated_at = NOW()
  WHERE id = user_id;
  
  -- Check if update was successful
  GET DIAGNOSTICS success = ROW_COUNT;
  
  RETURN success > 0;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant necessary permissions
GRANT EXECUTE ON FUNCTION public.update_user_preferences(UUID, JSONB) TO authenticated;
GRANT EXECUTE ON FUNCTION public.complete_user_onboarding(UUID, JSONB) TO authenticated;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_user_profiles_onboarding_completed ON public.user_profiles(onboarding_completed);
CREATE INDEX IF NOT EXISTS idx_user_profiles_role ON public.user_profiles(role);
CREATE INDEX IF NOT EXISTS idx_user_profiles_status ON public.user_profiles(status);

-- Update RLS policies to ensure users can update their own profiles
DROP POLICY IF EXISTS "Users can update own profile" ON public.user_profiles;
CREATE POLICY "Users can update own profile" ON public.user_profiles
  FOR UPDATE USING (auth.uid() = id);

-- Ensure the trigger function properly handles new users
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.user_profiles (
    id, 
    full_name, 
    role, 
    status, 
    onboarding_completed,
    preferences
  )
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', 'User'),
    COALESCE(NEW.raw_user_meta_data->>'role', 'patient')::TEXT,
    'active',
    FALSE,
    '{}'::JSONB
  )
  ON CONFLICT (id) DO NOTHING;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Ensure the trigger exists
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user(); 