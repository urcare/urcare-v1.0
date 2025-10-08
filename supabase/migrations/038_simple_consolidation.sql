-- Simple Database Consolidation - Just Create Tables
-- This creates the essential unified tables without data migration

-- Create unified_health_analysis table
CREATE TABLE IF NOT EXISTS unified_health_analysis (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    health_score INTEGER NOT NULL CHECK (health_score >= 0 AND health_score <= 100),
    analysis_text TEXT,
    display_analysis JSONB DEFAULT '{}',
    detailed_analysis JSONB DEFAULT '{}',
    profile_analysis JSONB DEFAULT '{}',
    recommendations TEXT[] DEFAULT '{}',
    user_input TEXT,
    uploaded_files TEXT[],
    voice_transcript TEXT,
    ai_provider VARCHAR(50),
    ai_model VARCHAR(100),
    calculation_method VARCHAR(50) DEFAULT 'ai_optimized',
    factors_considered JSONB DEFAULT '{}',
    is_latest BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create unified_user_profiles table
CREATE TABLE IF NOT EXISTS unified_user_profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name VARCHAR(255),
    age INTEGER,
    date_of_birth DATE,
    gender VARCHAR(20),
    unit_system VARCHAR(10) DEFAULT 'metric',
    height_feet VARCHAR(10),
    height_inches VARCHAR(10),
    height_cm VARCHAR(10),
    weight_lb VARCHAR(10),
    weight_kg VARCHAR(10),
    wake_up_time TIME,
    sleep_time TIME,
    work_start TIME,
    work_end TIME,
    chronic_conditions TEXT[],
    takes_medications VARCHAR(10),
    medications TEXT[],
    has_surgery VARCHAR(10),
    surgery_details TEXT[],
    health_goals TEXT[],
    diet_type VARCHAR(50),
    blood_group VARCHAR(10),
    breakfast_time TIME,
    lunch_time TIME,
    dinner_time TIME,
    workout_time TIME,
    routine_flexibility VARCHAR(50),
    workout_type VARCHAR(50),
    smoking VARCHAR(20),
    drinking VARCHAR(20),
    track_family VARCHAR(10),
    critical_conditions TEXT,
    has_health_reports VARCHAR(10),
    health_reports TEXT[],
    referral_code VARCHAR(50),
    save_progress VARCHAR(10),
    preferences JSONB DEFAULT '{}',
    onboarding_completed BOOLEAN DEFAULT false,
    onboarding_data JSONB DEFAULT '{}',
    country VARCHAR(100),
    state VARCHAR(100),
    district VARCHAR(100),
    status VARCHAR(20) DEFAULT 'active',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create unified_subscriptions table
CREATE TABLE IF NOT EXISTS unified_subscriptions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    plan_id UUID REFERENCES subscription_plans(id),
    plan_slug VARCHAR(100),
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'trialing', 'past_due', 'canceled', 'unpaid')),
    billing_cycle VARCHAR(20) DEFAULT 'monthly' CHECK (billing_cycle IN ('monthly', 'annual')),
    amount DECIMAL(10,2),
    currency VARCHAR(3) DEFAULT 'USD',
    payment_method VARCHAR(50),
    payment_provider VARCHAR(50) DEFAULT 'stripe' CHECK (payment_provider IN ('stripe', 'razorpay', 'phonepe')),
    current_period_start TIMESTAMP WITH TIME ZONE,
    current_period_end TIMESTAMP WITH TIME ZONE,
    trial_start TIMESTAMP WITH TIME ZONE,
    trial_end TIMESTAMP WITH TIME ZONE,
    provider_subscription_id VARCHAR(255),
    provider_customer_id VARCHAR(255),
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create unified_payments table
CREATE TABLE IF NOT EXISTS unified_payments (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    subscription_id UUID REFERENCES unified_subscriptions(id) ON DELETE CASCADE,
    plan_id UUID REFERENCES subscription_plans(id),
    amount DECIMAL(10,2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'USD',
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'succeeded', 'failed', 'canceled')),
    payment_method VARCHAR(50),
    payment_provider VARCHAR(50) DEFAULT 'stripe' CHECK (payment_provider IN ('stripe', 'razorpay', 'phonepe')),
    provider_transaction_id VARCHAR(255),
    provider_payment_id VARCHAR(255),
    provider_response JSONB DEFAULT '{}',
    billing_cycle VARCHAR(20),
    is_first_time BOOLEAN DEFAULT false,
    failure_reason TEXT,
    processed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE unified_health_analysis ENABLE ROW LEVEL SECURITY;
ALTER TABLE unified_user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE unified_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE unified_payments ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view their own health analysis" ON unified_health_analysis
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own health analysis" ON unified_health_analysis
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own health analysis" ON unified_health_analysis
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own health analysis" ON unified_health_analysis
    FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own profile" ON unified_user_profiles
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile" ON unified_user_profiles
    FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON unified_user_profiles
    FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can delete their own profile" ON unified_user_profiles
    FOR DELETE USING (auth.uid() = id);

CREATE POLICY "Users can view their own subscriptions" ON unified_subscriptions
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own subscriptions" ON unified_subscriptions
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own subscriptions" ON unified_subscriptions
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own subscriptions" ON unified_subscriptions
    FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own payments" ON unified_payments
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own payments" ON unified_payments
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own payments" ON unified_payments
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own payments" ON unified_payments
    FOR DELETE USING (auth.uid() = user_id);

-- Create compatibility views
CREATE OR REPLACE VIEW health_scores_view AS
SELECT 
    id,
    user_id,
    'overall' as score_type,
    health_score as score,
    created_at as calculation_date,
    detailed_analysis as sub_scores,
    recommendations,
    created_at,
    updated_at
FROM unified_health_analysis
WHERE is_latest = true;

CREATE OR REPLACE VIEW user_profiles_view AS
SELECT 
    id,
    full_name,
    age,
    date_of_birth,
    gender,
    unit_system,
    height_feet,
    height_inches,
    height_cm,
    weight_lb,
    weight_kg,
    wake_up_time,
    sleep_time,
    work_start,
    work_end,
    chronic_conditions,
    takes_medications,
    medications,
    has_surgery,
    surgery_details,
    health_goals,
    diet_type,
    blood_group,
    breakfast_time,
    lunch_time,
    dinner_time,
    workout_time,
    routine_flexibility,
    workout_type,
    smoking,
    drinking,
    track_family,
    critical_conditions,
    has_health_reports,
    health_reports,
    referral_code,
    save_progress,
    preferences,
    onboarding_completed,
    status,
    created_at,
    updated_at
FROM unified_user_profiles;

CREATE OR REPLACE VIEW subscriptions_view AS
SELECT 
    id,
    user_id,
    plan_id,
    status,
    billing_cycle,
    current_period_start,
    current_period_end,
    trial_start,
    trial_end,
    provider_customer_id as stripe_customer_id,
    metadata,
    created_at,
    updated_at
FROM unified_subscriptions
WHERE payment_provider = 'stripe';

-- Grant permissions
GRANT SELECT, INSERT, UPDATE, DELETE ON unified_health_analysis TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON unified_user_profiles TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON unified_subscriptions TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON unified_payments TO authenticated;

GRANT SELECT ON health_scores_view TO authenticated;
GRANT SELECT ON user_profiles_view TO authenticated;
GRANT SELECT ON subscriptions_view TO authenticated;
