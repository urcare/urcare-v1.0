-- Create onboarding_profiles table to store detailed onboarding data separate from user_profiles
-- This table stores the raw onboarding answers in JSONB and links to the user via user_id

-- Table
CREATE TABLE IF NOT EXISTS public.onboarding_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  details JSONB NOT NULL DEFAULT '{}', -- raw onboarding answers
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id)
);

-- Updated_at trigger function (re-use if exists, else create)
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger
DROP TRIGGER IF EXISTS trg_onboarding_profiles_updated_at ON public.onboarding_profiles;
CREATE TRIGGER trg_onboarding_profiles_updated_at
BEFORE UPDATE ON public.onboarding_profiles
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- RLS
ALTER TABLE public.onboarding_profiles ENABLE ROW LEVEL SECURITY;

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

-- Auto-create rows on signup: insert into user_profiles and onboarding_profiles
-- Function
CREATE OR REPLACE FUNCTION public.handle_new_user_defaults()
RETURNS TRIGGER AS $$
BEGIN
  -- create minimal user_profiles row if not exists
  INSERT INTO public.user_profiles (id, full_name, onboarding_completed)
  VALUES (NEW.id, COALESCE(NEW.email, ''), false)
  ON CONFLICT (id) DO NOTHING;

  -- create empty onboarding_profiles row if not exists
  INSERT INTO public.onboarding_profiles (user_id, details)
  VALUES (NEW.id, '{}')
  ON CONFLICT (user_id) DO NOTHING;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger on auth.users
DROP TRIGGER IF EXISTS trg_handle_new_user_defaults ON auth.users;
CREATE TRIGGER trg_handle_new_user_defaults
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_new_user_defaults();


