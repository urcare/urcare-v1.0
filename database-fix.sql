-- Comprehensive Database Fix for UrCare Onboarding Issues
-- Run this in your Supabase SQL Editor to fix all identified issues

-- 1. Ensure all required columns exist in user_profiles table
ALTER TABLE user_profiles 
ADD COLUMN IF NOT EXISTS workout_type VARCHAR(100),
ADD COLUMN IF NOT EXISTS smoking VARCHAR(50),
ADD COLUMN IF NOT EXISTS drinking VARCHAR(50);

-- 2. Remove old columns that are no longer needed
ALTER TABLE user_profiles 
DROP COLUMN IF EXISTS uses_wearable,
DROP COLUMN IF EXISTS wearable_type,
DROP COLUMN IF EXISTS share_progress,
DROP COLUMN IF EXISTS emergency_contact_name,
DROP COLUMN IF EXISTS emergency_contact_phone;

-- 3. Ensure date_of_birth column exists and is properly typed
ALTER TABLE user_profiles 
ALTER COLUMN date_of_birth TYPE DATE;

-- 4. Create missing indexes for better performance
CREATE INDEX IF NOT EXISTS idx_user_profiles_workout_type ON user_profiles(workout_type);
CREATE INDEX IF NOT EXISTS idx_user_profiles_smoking ON user_profiles(smoking);
CREATE INDEX IF NOT EXISTS idx_user_profiles_drinking ON user_profiles(drinking);
CREATE INDEX IF NOT EXISTS idx_user_profiles_date_of_birth ON user_profiles(date_of_birth);

-- 5. Ensure onboarding_profiles table exists
CREATE TABLE IF NOT EXISTS public.onboarding_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  details JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id)
);

-- 6. Create or update the updated_at trigger function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 7. Create trigger for user_profiles updated_at
DROP TRIGGER IF EXISTS update_user_profiles_updated_at ON user_profiles;
CREATE TRIGGER update_user_profiles_updated_at 
    BEFORE UPDATE ON user_profiles 
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- 8. Create trigger for onboarding_profiles updated_at
DROP TRIGGER IF EXISTS trg_onboarding_profiles_updated_at ON public.onboarding_profiles;
CREATE TRIGGER trg_onboarding_profiles_updated_at
BEFORE UPDATE ON public.onboarding_profiles
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- 9. Ensure RLS is enabled and policies exist
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE onboarding_profiles ENABLE ROW LEVEL SECURITY;

-- 10. Create/Update RLS policies for user_profiles
DROP POLICY IF EXISTS "Users can view their own profile" ON user_profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON user_profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON user_profiles;
DROP POLICY IF EXISTS "Users can delete their own profile" ON user_profiles;

CREATE POLICY "Users can view their own profile" ON user_profiles
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile" ON user_profiles
    FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON user_profiles
    FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can delete their own profile" ON user_profiles
    FOR DELETE USING (auth.uid() = id);

-- 11. Create/Update RLS policies for onboarding_profiles
DROP POLICY IF EXISTS onboarding_profiles_select ON public.onboarding_profiles;
DROP POLICY IF EXISTS onboarding_profiles_insert ON public.onboarding_profiles;
DROP POLICY IF EXISTS onboarding_profiles_update ON public.onboarding_profiles;
DROP POLICY IF EXISTS onboarding_profiles_delete ON public.onboarding_profiles;

CREATE POLICY onboarding_profiles_select ON public.onboarding_profiles
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY onboarding_profiles_insert ON public.onboarding_profiles
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY onboarding_profiles_update ON public.onboarding_profiles
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY onboarding_profiles_delete ON public.onboarding_profiles
  FOR DELETE USING (auth.uid() = user_id);

-- 12. Create or update the new user handler function
CREATE OR REPLACE FUNCTION public.handle_new_user_defaults()
RETURNS TRIGGER AS $$
BEGIN
  -- Create minimal user_profiles row if not exists
  INSERT INTO public.user_profiles (id, full_name, onboarding_completed)
  VALUES (NEW.id, COALESCE(NEW.email, ''), false)
  ON CONFLICT (id) DO NOTHING;

  -- Create empty onboarding_profiles row if not exists
  INSERT INTO public.onboarding_profiles (user_id, details)
  VALUES (NEW.id, '{}')
  ON CONFLICT (user_id) DO NOTHING;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 13. Create trigger for new user creation
DROP TRIGGER IF EXISTS trg_handle_new_user_defaults ON auth.users;
CREATE TRIGGER trg_handle_new_user_defaults
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_new_user_defaults();

-- 14. Add column comments for documentation
COMMENT ON COLUMN user_profiles.workout_type IS 'Preferred workout type (Yoga, Home Gym, Gym, Swimming, Cardio, HIIT)';
COMMENT ON COLUMN user_profiles.smoking IS 'Smoking status (Never smoked, Former smoker, Occasional smoker, Regular smoker)';
COMMENT ON COLUMN user_profiles.drinking IS 'Alcohol consumption level (Never drink, Occasionally, Moderately, Regularly, Heavily)';
COMMENT ON COLUMN user_profiles.date_of_birth IS 'User date of birth in YYYY-MM-DD format';

-- 15. Verify the fix worked
SELECT 'Database fix completed successfully!' as status;
