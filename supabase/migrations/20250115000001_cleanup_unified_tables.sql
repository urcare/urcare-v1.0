-- Clean up unified tables that are causing conflicts
-- Keep only the profiles table and remove all unified tables

-- Drop all unified tables that are causing issues
DROP TABLE IF EXISTS public.user_profiles_unified CASCADE;
DROP TABLE IF EXISTS public.unified_user_profiles CASCADE;
DROP TABLE IF EXISTS public.onboarding_profiles CASCADE;
DROP TABLE IF EXISTS public.user_profiles CASCADE;

-- Drop any related functions and triggers
DROP FUNCTION IF EXISTS public.update_user_profiles_unified_updated_at() CASCADE;
DROP FUNCTION IF EXISTS public.calculate_onboarding_completion() CASCADE;
DROP FUNCTION IF EXISTS public.handle_new_user() CASCADE;
DROP FUNCTION IF EXISTS public.handle_user_sign_in() CASCADE;
DROP FUNCTION IF EXISTS public.handle_user_metadata_update() CASCADE;

-- Drop any triggers on auth.users
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP TRIGGER IF EXISTS on_auth_user_sign_in ON auth.users;
DROP TRIGGER IF EXISTS on_auth_user_metadata_update ON auth.users;

-- Ensure profiles table exists with correct structure (it should already exist)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID NOT NULL,
    email TEXT NOT NULL,
    full_name TEXT NULL,
    avatar_url TEXT NULL,
    provider TEXT NULL,
    last_sign_in TIMESTAMP WITH TIME ZONE NULL DEFAULT NOW(),
    sign_in_count INTEGER NULL DEFAULT 1,
    created_at TIMESTAMP WITH TIME ZONE NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NULL DEFAULT NOW(),
    CONSTRAINT profiles_pkey PRIMARY KEY (id),
    CONSTRAINT profiles_email_key UNIQUE (email),
    CONSTRAINT profiles_id_fkey FOREIGN KEY (id) REFERENCES auth.users (id) ON DELETE CASCADE
) TABLESPACE pg_default;

-- Enable RLS on profiles table
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for profiles table
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can delete their own profile" ON public.profiles;

CREATE POLICY "Users can view their own profile" ON public.profiles
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile" ON public.profiles
    FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON public.profiles
    FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can delete their own profile" ON public.profiles
    FOR DELETE USING (auth.uid() = id);

-- Create function to handle new user profile creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, email, full_name, avatar_url, provider, last_sign_in, sign_in_count, created_at, updated_at)
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', ''),
        COALESCE(NEW.raw_user_meta_data->>'avatar_url', ''),
        COALESCE(NEW.app_metadata->>'provider', 'email'),
        NOW(),
        1,
        NOW(),
        NOW()
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to automatically create profile when user signs up
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create function to update profile on sign in
CREATE OR REPLACE FUNCTION public.handle_user_sign_in()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE public.profiles 
    SET 
        last_sign_in = NOW(),
        sign_in_count = COALESCE(sign_in_count, 0) + 1,
        updated_at = NOW()
    WHERE id = NEW.id;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to update profile on sign in
DROP TRIGGER IF EXISTS on_auth_user_sign_in ON auth.users;
CREATE TRIGGER on_auth_user_sign_in
    AFTER UPDATE ON auth.users
    FOR EACH ROW 
    WHEN (OLD.last_sign_in IS DISTINCT FROM NEW.last_sign_in)
    EXECUTE FUNCTION public.handle_user_sign_in();

-- Create function to update profile when user metadata changes
CREATE OR REPLACE FUNCTION public.handle_user_metadata_update()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE public.profiles 
    SET 
        full_name = COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', full_name),
        avatar_url = COALESCE(NEW.raw_user_meta_data->>'avatar_url', avatar_url),
        provider = COALESCE(NEW.app_metadata->>'provider', provider),
        updated_at = NOW()
    WHERE id = NEW.id;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to update profile when user metadata changes
DROP TRIGGER IF EXISTS on_auth_user_metadata_update ON auth.users;
CREATE TRIGGER on_auth_user_metadata_update
    AFTER UPDATE ON auth.users
    FOR EACH ROW 
    WHEN (OLD.raw_user_meta_data IS DISTINCT FROM NEW.raw_user_meta_data OR OLD.app_metadata IS DISTINCT FROM NEW.app_metadata)
    EXECUTE FUNCTION public.handle_user_metadata_update();

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_profiles_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for updated_at
DROP TRIGGER IF EXISTS update_profiles_updated_at ON public.profiles;
CREATE TRIGGER update_profiles_updated_at
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW
    EXECUTE FUNCTION public.update_profiles_updated_at();

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_profiles_email ON public.profiles(email);
CREATE INDEX IF NOT EXISTS idx_profiles_provider ON public.profiles(provider);
CREATE INDEX IF NOT EXISTS idx_profiles_last_sign_in ON public.profiles(last_sign_in);

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON public.profiles TO anon, authenticated;
GRANT ALL ON public.profiles TO service_role;
