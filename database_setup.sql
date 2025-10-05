-- Database Setup for UrCare Health App
-- Run these SQL commands in your Supabase SQL Editor

-- 1. Create user_profiles table with all necessary columns
CREATE TABLE IF NOT EXISTS user_profiles (
    id UUID REFERENCES auth.users(id) PRIMARY KEY,
    full_name TEXT,
    age INTEGER,
    date_of_birth DATE,
    gender TEXT,
    unit_system TEXT DEFAULT 'metric',
    height_feet INTEGER,
    height_inches INTEGER,
    height_cm INTEGER,
    weight_lb DECIMAL(5,2),
    weight_kg DECIMAL(5,2),
    wake_up_time TIME,
    sleep_time TIME,
    work_start TIME,
    work_end TIME,
    breakfast_time TIME,
    lunch_time TIME,
    dinner_time TIME,
    workout_time TIME,
    chronic_conditions TEXT[],
    takes_medications BOOLEAN DEFAULT FALSE,
    medications TEXT[],
    has_surgery BOOLEAN DEFAULT FALSE,
    surgery_details TEXT[],
    health_goals TEXT[],
    diet_type TEXT,
    blood_group TEXT,
    routine_flexibility INTEGER DEFAULT 5,
    workout_type TEXT,
    smoking TEXT,
    drinking TEXT,
    uses_wearable BOOLEAN DEFAULT FALSE,
    wearable_type TEXT,
    track_family BOOLEAN DEFAULT FALSE,
    share_progress BOOLEAN DEFAULT FALSE,
    emergency_contact_name TEXT,
    emergency_contact_phone TEXT,
    critical_conditions TEXT,
    has_health_reports BOOLEAN DEFAULT FALSE,
    health_reports TEXT[],
    referral_code TEXT,
    save_progress BOOLEAN DEFAULT FALSE,
    status TEXT DEFAULT 'active',
    preferences JSONB DEFAULT '{}',
    onboarding_completed BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    allergies TEXT[]
);

-- 2. Create subscription_status and subscription_expires_at columns
ALTER TABLE user_profiles 
ADD COLUMN IF NOT EXISTS subscription_status TEXT DEFAULT 'inactive',
ADD COLUMN IF NOT EXISTS subscription_expires_at TIMESTAMP WITH TIME ZONE;

-- 3. Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_user_profiles_onboarding ON user_profiles(onboarding_completed);
CREATE INDEX IF NOT EXISTS idx_user_profiles_subscription ON user_profiles(subscription_status);
CREATE INDEX IF NOT EXISTS idx_user_profiles_created_at ON user_profiles(created_at);

-- 4. Create RLS (Row Level Security) policies
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- Policy for users to read their own profile
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'user_profiles' AND policyname = 'Users can read their own profile'
    ) THEN
        CREATE POLICY "Users can read their own profile" ON user_profiles
            FOR SELECT USING (auth.uid() = id);
    END IF;
END $$;

-- Policy for users to update their own profile
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'user_profiles' AND policyname = 'Users can update their own profile'
    ) THEN
        CREATE POLICY "Users can update their own profile" ON user_profiles
            FOR UPDATE USING (auth.uid() = id);
    END IF;
END $$;

-- Policy for users to insert their own profile
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'user_profiles' AND policyname = 'Users can insert their own profile'
    ) THEN
        CREATE POLICY "Users can insert their own profile" ON user_profiles
            FOR INSERT WITH CHECK (auth.uid() = id);
    END IF;
END $$;

-- 5. Create a function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- 6. Create trigger to automatically update updated_at (only if it doesn't exist)
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_trigger 
        WHERE tgname = 'update_user_profiles_updated_at'
    ) THEN
        CREATE TRIGGER update_user_profiles_updated_at 
            BEFORE UPDATE ON user_profiles 
            FOR EACH ROW 
            EXECUTE FUNCTION update_updated_at_column();
    END IF;
END $$;

-- 7. Create health_assessments table (if needed)
CREATE TABLE IF NOT EXISTS health_assessments (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    assessment_data JSONB NOT NULL,
    completed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 8. Create health_plans table (if needed)
CREATE TABLE IF NOT EXISTS health_plans (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    plan_data JSONB NOT NULL,
    generated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 9. Enable RLS for new tables
ALTER TABLE health_assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE health_plans ENABLE ROW LEVEL SECURITY;

-- 10. Create RLS policies for new tables
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'health_assessments' AND policyname = 'Users can read their own health assessments'
    ) THEN
        CREATE POLICY "Users can read their own health assessments" ON health_assessments
            FOR SELECT USING (auth.uid() = user_id);
    END IF;
END $$;

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'health_assessments' AND policyname = 'Users can insert their own health assessments'
    ) THEN
        CREATE POLICY "Users can insert their own health assessments" ON health_assessments
            FOR INSERT WITH CHECK (auth.uid() = user_id);
    END IF;
END $$;

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'health_plans' AND policyname = 'Users can read their own health plans'
    ) THEN
        CREATE POLICY "Users can read their own health plans" ON health_plans
            FOR SELECT USING (auth.uid() = user_id);
    END IF;
END $$;

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'health_plans' AND policyname = 'Users can insert their own health plans'
    ) THEN
        CREATE POLICY "Users can insert their own health plans" ON health_plans
            FOR INSERT WITH CHECK (auth.uid() = user_id);
    END IF;
END $$;

-- 11. Grant necessary permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated;
