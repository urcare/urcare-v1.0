-- Simple database cleanup and recreation
-- This script handles the case where tables may or may not exist

-- First, let's drop any existing tables that might exist
-- We'll use CASCADE to handle dependencies

DROP TABLE IF EXISTS monthly_assessments CASCADE;
DROP TABLE IF EXISTS weekly_progress_tracking CASCADE;
DROP TABLE IF EXISTS daily_plan_execution CASCADE;
DROP TABLE IF EXISTS comprehensive_health_plans CASCADE;
DROP TABLE IF EXISTS activity_completions CASCADE;
DROP TABLE IF EXISTS daily_schedules CASCADE;
DROP TABLE IF EXISTS weekly_plans CASCADE;
DROP TABLE IF EXISTS subscription_invoices CASCADE;
DROP TABLE IF EXISTS subscription_usage CASCADE;
DROP TABLE IF EXISTS subscriptions CASCADE;
DROP TABLE IF EXISTS subscription_plans CASCADE;
DROP TABLE IF EXISTS user_trials CASCADE;
DROP TABLE IF EXISTS token_usage CASCADE;
DROP TABLE IF EXISTS user_health_goals CASCADE;
DROP TABLE IF EXISTS food_entries CASCADE;
DROP TABLE IF EXISTS daily_nutrition CASCADE;
DROP TABLE IF EXISTS nutrition_goals CASCADE;
DROP TABLE IF EXISTS food_database CASCADE;
DROP TABLE IF EXISTS health_metrics CASCADE;
DROP TABLE IF EXISTS weekly_summaries CASCADE;
DROP TABLE IF EXISTS daily_activities CASCADE;
DROP TABLE IF EXISTS health_scores CASCADE;
DROP TABLE IF EXISTS two_day_health_plans CASCADE;
DROP TABLE IF EXISTS health_plans CASCADE;
DROP TABLE IF EXISTS plan_progress CASCADE;
DROP TABLE IF EXISTS user_profiles CASCADE;
DROP TABLE IF EXISTS onboarding_profiles CASCADE;

-- Drop any functions that might exist
DROP FUNCTION IF EXISTS update_health_score(UUID);
DROP FUNCTION IF EXISTS get_weekly_view(UUID);
DROP FUNCTION IF EXISTS update_health_scores_updated_at();
DROP FUNCTION IF EXISTS update_daily_activities_updated_at();
DROP FUNCTION IF EXISTS update_weekly_summaries_updated_at();
DROP FUNCTION IF EXISTS update_health_metrics_updated_at();
DROP FUNCTION IF EXISTS get_health_trends(UUID, DATE, DATE);
DROP FUNCTION IF EXISTS calculate_health_score_from_metrics(UUID, DATE);
DROP FUNCTION IF EXISTS get_weekly_health_summary(UUID, DATE);
DROP FUNCTION IF EXISTS update_comprehensive_plans_updated_at();
DROP FUNCTION IF EXISTS update_daily_execution_updated_at();
DROP FUNCTION IF EXISTS update_weekly_progress_updated_at();
DROP FUNCTION IF EXISTS update_monthly_assessments_updated_at();
DROP FUNCTION IF EXISTS calculate_daily_completion();
DROP FUNCTION IF EXISTS calculate_weekly_compliance();
DROP FUNCTION IF EXISTS update_daily_nutrition();
DROP FUNCTION IF EXISTS update_updated_at_column();
DROP FUNCTION IF EXISTS has_active_subscription(UUID);
DROP FUNCTION IF EXISTS get_user_subscription(UUID);

-- Now create the clean schema
-- ============================================================================
-- CORE USER TABLES
-- ============================================================================

-- User profiles table (main user data)
CREATE TABLE user_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    full_name VARCHAR(255),
    age INTEGER,
    date_of_birth DATE,
    gender VARCHAR(50),
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
    diet_type VARCHAR(100),
    blood_group VARCHAR(10),
    breakfast_time TIME,
    lunch_time TIME,
    dinner_time TIME,
    workout_time TIME,
    routine_flexibility VARCHAR(50),
    workout_type VARCHAR(100),
    smoking VARCHAR(10),
    drinking VARCHAR(10),
    uses_wearable VARCHAR(10),
    wearable_type VARCHAR(100),
    track_family VARCHAR(10),
    share_progress VARCHAR(10),
    emergency_contact_name VARCHAR(255),
    emergency_contact_phone VARCHAR(20),
    critical_conditions TEXT,
    has_health_reports VARCHAR(10),
    health_reports TEXT[],
    referral_code VARCHAR(50),
    save_progress VARCHAR(10),
    status VARCHAR(20) DEFAULT 'active',
    preferences JSONB DEFAULT '{}',
    onboarding_completed BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(id)
);

-- ============================================================================
-- HEALTH TRACKING TABLES
-- ============================================================================

-- Health scores table
CREATE TABLE health_scores (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    score INTEGER NOT NULL CHECK (score >= 0 AND score <= 100),
    streak_days INTEGER DEFAULT 0,
    last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Daily activities table
CREATE TABLE daily_activities (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    activity_date DATE NOT NULL,
    exercise_completed BOOLEAN DEFAULT FALSE,
    nutrition_completed BOOLEAN DEFAULT FALSE,
    hydration_completed BOOLEAN DEFAULT FALSE,
    meals_completed BOOLEAN DEFAULT FALSE,
    sleep_completed BOOLEAN DEFAULT FALSE,
    exercise_duration INTEGER DEFAULT 0, -- in minutes
    water_intake INTEGER DEFAULT 0, -- in ml
    calories_consumed INTEGER DEFAULT 0,
    sleep_hours DECIMAL(3,1) DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, activity_date)
);

-- Weekly summaries table
CREATE TABLE weekly_summaries (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    week_start_date DATE NOT NULL,
    week_end_date DATE NOT NULL,
    total_score INTEGER DEFAULT 0,
    exercise_days INTEGER DEFAULT 0,
    nutrition_days INTEGER DEFAULT 0,
    hydration_days INTEGER DEFAULT 0,
    meal_days INTEGER DEFAULT 0,
    sleep_days INTEGER DEFAULT 0,
    streak_bonus DECIMAL(3,2) DEFAULT 1.0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, week_start_date)
);

-- Health metrics table
CREATE TABLE health_metrics (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    weight DECIMAL(5,2), -- in kg
    body_fat DECIMAL(4,2), -- percentage
    muscle_mass DECIMAL(5,2), -- in kg
    blood_pressure_systolic INTEGER,
    blood_pressure_diastolic INTEGER,
    heart_rate INTEGER, -- bpm
    sleep_hours DECIMAL(3,1), -- hours
    sleep_quality INTEGER CHECK (sleep_quality >= 1 AND sleep_quality <= 10),
    energy_level INTEGER CHECK (energy_level >= 1 AND energy_level <= 10),
    mood INTEGER CHECK (mood >= 1 AND mood <= 10),
    stress_level INTEGER CHECK (stress_level >= 1 AND stress_level <= 10),
    water_intake INTEGER, -- in ml
    steps INTEGER,
    calories_burned INTEGER,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, date)
);

-- ============================================================================
-- HEALTH PLANNING TABLES
-- ============================================================================

-- Comprehensive health plans table
CREATE TABLE comprehensive_health_plans (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    plan_name VARCHAR(255) NOT NULL,
    plan_type VARCHAR(50) NOT NULL CHECK (plan_type IN (
        'quick_win', 'habit_formation', 'health_transformation', 
        'disease_management', 'lifestyle_change'
    )),
    primary_goal VARCHAR(255) NOT NULL,
    secondary_goals TEXT[],
    start_date DATE NOT NULL,
    target_end_date DATE NOT NULL,
    actual_end_date DATE,
    duration_weeks INTEGER NOT NULL,
    plan_data JSONB NOT NULL,
    weekly_milestones JSONB DEFAULT '[]',
    monthly_assessments JSONB DEFAULT '[]',
    overall_progress_percentage DECIMAL(5,2) DEFAULT 0.0,
    weekly_compliance_rate DECIMAL(5,2) DEFAULT 0.0,
    monthly_compliance_rate DECIMAL(5,2) DEFAULT 0.0,
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN (
        'draft', 'active', 'paused', 'completed', 'cancelled', 'extended'
    )),
    completion_reason TEXT,
    timeline_adjustments JSONB DEFAULT '[]',
    intensity_adjustments JSONB DEFAULT '[]',
    generated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    CONSTRAINT valid_duration CHECK (duration_weeks > 0 AND duration_weeks <= 104),
    CONSTRAINT valid_dates CHECK (target_end_date > start_date)
);

-- Daily plan execution table
CREATE TABLE daily_plan_execution (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    plan_id UUID NOT NULL REFERENCES comprehensive_health_plans(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    execution_date DATE NOT NULL,
    week_number INTEGER NOT NULL,
    day_of_week INTEGER NOT NULL CHECK (day_of_week BETWEEN 1 AND 7),
    daily_activities JSONB NOT NULL,
    daily_meals JSONB NOT NULL,
    daily_workouts JSONB NOT NULL,
    daily_wellness JSONB NOT NULL,
    activities_completed INTEGER DEFAULT 0,
    total_activities INTEGER NOT NULL,
    completion_percentage DECIMAL(5,2) DEFAULT 0.0,
    energy_level INTEGER CHECK (energy_level BETWEEN 1 AND 10),
    difficulty_rating INTEGER CHECK (difficulty_rating BETWEEN 1 AND 10),
    user_notes TEXT,
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN (
        'pending', 'in_progress', 'completed', 'skipped', 'modified'
    )),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(plan_id, execution_date)
);

-- Weekly progress tracking
CREATE TABLE weekly_progress_tracking (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    plan_id UUID NOT NULL REFERENCES comprehensive_health_plans(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    week_number INTEGER NOT NULL,
    week_start_date DATE NOT NULL,
    week_end_date DATE NOT NULL,
    total_activities INTEGER NOT NULL,
    completed_activities INTEGER DEFAULT 0,
    compliance_rate DECIMAL(5,2) DEFAULT 0.0,
    weight_change DECIMAL(5,2),
    body_measurements JSONB,
    fitness_metrics JSONB,
    health_metrics JSONB,
    milestones_achieved JSONB DEFAULT '[]',
    milestones_missed JSONB DEFAULT '[]',
    weekly_rating INTEGER CHECK (weekly_rating BETWEEN 1 AND 10),
    challenges_faced TEXT[],
    successes_celebrated TEXT[],
    adjustments_needed TEXT,
    status VARCHAR(20) DEFAULT 'in_progress' CHECK (status IN (
        'in_progress', 'completed', 'needs_adjustment'
    )),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(plan_id, week_number)
);

-- Monthly assessment table
CREATE TABLE monthly_assessments (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    plan_id UUID NOT NULL REFERENCES comprehensive_health_plans(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    month_number INTEGER NOT NULL,
    assessment_date DATE NOT NULL,
    overall_progress DECIMAL(5,2) NOT NULL,
    goal_achievement_rate DECIMAL(5,2) NOT NULL,
    compliance_trend VARCHAR(20) CHECK (compliance_trend IN (
        'improving', 'stable', 'declining', 'inconsistent'
    )),
    health_improvements JSONB,
    health_concerns JSONB,
    biomarker_changes JSONB,
    timeline_adjustment_days INTEGER DEFAULT 0,
    intensity_adjustment_percentage DECIMAL(5,2) DEFAULT 0.0,
    new_barriers_identified TEXT[],
    new_success_factors TEXT[],
    next_month_focus TEXT[],
    plan_modifications JSONB,
    additional_support_needed TEXT[],
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN (
        'pending', 'completed', 'requires_attention'
    )),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(plan_id, month_number)
);

-- ============================================================================
-- NUTRITION TRACKING TABLES
-- ============================================================================

-- Daily nutrition tracking table
CREATE TABLE daily_nutrition (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    total_calories DECIMAL(8,2) DEFAULT 0.0,
    protein DECIMAL(8,2) DEFAULT 0.0, -- in grams
    carbs DECIMAL(8,2) DEFAULT 0.0, -- in grams
    fat DECIMAL(8,2) DEFAULT 0.0, -- in grams
    fiber DECIMAL(8,2) DEFAULT 0.0, -- in grams
    sugar DECIMAL(8,2) DEFAULT 0.0, -- in grams
    sodium DECIMAL(8,2) DEFAULT 0.0, -- in mg
    meal_breakdown JSONB, -- breakfast, lunch, dinner, snacks
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, date)
);

-- Food entries table for detailed tracking
CREATE TABLE food_entries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    meal_type VARCHAR(20) NOT NULL CHECK (meal_type IN ('breakfast', 'lunch', 'dinner', 'snack')),
    food_name VARCHAR(255) NOT NULL,
    brand VARCHAR(255),
    quantity DECIMAL(8,2) NOT NULL,
    unit VARCHAR(50) NOT NULL, -- grams, cups, pieces, etc.
    calories_per_unit DECIMAL(8,2) NOT NULL,
    protein_per_unit DECIMAL(8,2) DEFAULT 0.0,
    carbs_per_unit DECIMAL(8,2) DEFAULT 0.0,
    fat_per_unit DECIMAL(8,2) DEFAULT 0.0,
    fiber_per_unit DECIMAL(8,2) DEFAULT 0.0,
    sugar_per_unit DECIMAL(8,2) DEFAULT 0.0,
    sodium_per_unit DECIMAL(8,2) DEFAULT 0.0,
    total_calories DECIMAL(8,2) GENERATED ALWAYS AS (quantity * calories_per_unit) STORED,
    total_protein DECIMAL(8,2) GENERATED ALWAYS AS (quantity * protein_per_unit) STORED,
    total_carbs DECIMAL(8,2) GENERATED ALWAYS AS (quantity * carbs_per_unit) STORED,
    total_fat DECIMAL(8,2) GENERATED ALWAYS AS (quantity * fat_per_unit) STORED,
    barcode VARCHAR(50), -- For barcode scanning
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Nutrition goals table
CREATE TABLE nutrition_goals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    daily_calories INTEGER NOT NULL,
    protein_grams INTEGER NOT NULL,
    carbs_grams INTEGER NOT NULL,
    fat_grams INTEGER NOT NULL,
    fiber_grams INTEGER DEFAULT 25,
    sugar_grams INTEGER DEFAULT 50,
    sodium_mg INTEGER DEFAULT 2300,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id)
);

-- Food database for common foods
CREATE TABLE food_database (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    brand VARCHAR(255),
    category VARCHAR(100),
    serving_size DECIMAL(8,2) NOT NULL,
    serving_unit VARCHAR(50) NOT NULL,
    calories_per_serving DECIMAL(8,2) NOT NULL,
    protein_per_serving DECIMAL(8,2) DEFAULT 0.0,
    carbs_per_serving DECIMAL(8,2) DEFAULT 0.0,
    fat_per_serving DECIMAL(8,2) DEFAULT 0.0,
    fiber_per_serving DECIMAL(8,2) DEFAULT 0.0,
    sugar_per_serving DECIMAL(8,2) DEFAULT 0.0,
    sodium_per_serving DECIMAL(8,2) DEFAULT 0.0,
    barcode VARCHAR(50),
    verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    CONSTRAINT unique_food_brand UNIQUE(name, brand)
);

-- ============================================================================
-- SUBSCRIPTION TABLES
-- ============================================================================

-- Subscription plans table
CREATE TABLE subscription_plans (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    slug VARCHAR(50) UNIQUE NOT NULL,
    description TEXT,
    price_monthly DECIMAL(10,2) NOT NULL,
    price_annual DECIMAL(10,2) NOT NULL,
    features JSONB DEFAULT '[]',
    max_users INTEGER DEFAULT 1,
    max_storage_gb INTEGER DEFAULT 1,
    is_active BOOLEAN DEFAULT true,
    is_popular BOOLEAN DEFAULT false,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Subscriptions table
CREATE TABLE subscriptions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    plan_id UUID REFERENCES subscription_plans(id) ON DELETE RESTRICT,
    status VARCHAR(20) NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'canceled', 'past_due', 'unpaid', 'trialing')),
    billing_cycle VARCHAR(10) NOT NULL CHECK (billing_cycle IN ('monthly', 'annual')),
    current_period_start TIMESTAMP WITH TIME ZONE NOT NULL,
    current_period_end TIMESTAMP WITH TIME ZONE NOT NULL,
    cancel_at_period_end BOOLEAN DEFAULT false,
    canceled_at TIMESTAMP WITH TIME ZONE,
    trial_start TIMESTAMP WITH TIME ZONE,
    trial_end TIMESTAMP WITH TIME ZONE,
    stripe_subscription_id VARCHAR(255),
    stripe_customer_id VARCHAR(255),
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================================
-- TRIAL SYSTEM
-- ============================================================================

-- User trials table
CREATE TABLE user_trials (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    trial_start TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    trial_end TIMESTAMP WITH TIME ZONE NOT NULL,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================================
-- TOKEN USAGE TRACKING
-- ============================================================================

-- Token usage table
CREATE TABLE token_usage (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    total_tokens INTEGER DEFAULT 0,
    estimated_cost DECIMAL(10,4) DEFAULT 0.0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, date)
);

-- ============================================================================
-- HEALTH GOALS
-- ============================================================================

-- User health goals table
CREATE TABLE user_health_goals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    goal_name VARCHAR(255) NOT NULL,
    goal_description TEXT,
    target_date DATE,
    priority VARCHAR(20) DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high')),
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'completed', 'paused', 'cancelled')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================================
-- INDEXES FOR PERFORMANCE
-- ============================================================================

-- User profiles indexes
CREATE INDEX idx_user_profiles_onboarding_completed ON user_profiles(onboarding_completed);
CREATE INDEX idx_user_profiles_status ON user_profiles(status);

-- Health tracking indexes
CREATE INDEX idx_health_scores_user_id ON health_scores(user_id);
CREATE INDEX idx_health_scores_last_updated ON health_scores(last_updated);
CREATE INDEX idx_daily_activities_user_id_date ON daily_activities(user_id, activity_date);
CREATE INDEX idx_weekly_summaries_user_id_week ON weekly_summaries(user_id, week_start_date);
CREATE INDEX idx_health_metrics_user_id ON health_metrics(user_id);
CREATE INDEX idx_health_metrics_date ON health_metrics(date);
CREATE INDEX idx_health_metrics_user_date ON health_metrics(user_id, date);

-- Health planning indexes
CREATE INDEX idx_comprehensive_plans_user_id ON comprehensive_health_plans(user_id);
CREATE INDEX idx_comprehensive_plans_status ON comprehensive_health_plans(status);
CREATE INDEX idx_comprehensive_plans_type ON comprehensive_health_plans(plan_type);
CREATE INDEX idx_comprehensive_plans_dates ON comprehensive_health_plans(start_date, target_end_date);
CREATE INDEX idx_daily_execution_plan_id ON daily_plan_execution(plan_id);
CREATE INDEX idx_daily_execution_date ON daily_plan_execution(execution_date);
CREATE INDEX idx_daily_execution_week ON daily_plan_execution(week_number);
CREATE INDEX idx_weekly_progress_plan_id ON weekly_progress_tracking(plan_id);
CREATE INDEX idx_weekly_progress_week ON weekly_progress_tracking(week_number);
CREATE INDEX idx_monthly_assessments_plan_id ON monthly_assessments(plan_id);
CREATE INDEX idx_monthly_assessments_month ON monthly_assessments(month_number);

-- Nutrition indexes
CREATE INDEX idx_daily_nutrition_user_date ON daily_nutrition(user_id, date);
CREATE INDEX idx_food_entries_user_date ON food_entries(user_id, date);
CREATE INDEX idx_food_entries_meal_type ON food_entries(meal_type);
CREATE INDEX idx_food_database_name ON food_database(name);
CREATE INDEX idx_food_database_barcode ON food_database(barcode);

-- Subscription indexes
CREATE INDEX idx_subscriptions_user_id ON subscriptions(user_id);
CREATE INDEX idx_subscriptions_status ON subscriptions(status);
CREATE INDEX idx_subscriptions_period_end ON subscriptions(current_period_end);

-- Trial indexes
CREATE INDEX idx_user_trials_user_id ON user_trials(user_id);
CREATE INDEX idx_user_trials_active ON user_trials(is_active);

-- Token usage indexes
CREATE INDEX idx_token_usage_user_id ON token_usage(user_id);
CREATE INDEX idx_token_usage_date ON token_usage(date);

-- Health goals indexes
CREATE INDEX idx_user_health_goals_user_id ON user_health_goals(user_id);
CREATE INDEX idx_user_health_goals_status ON user_health_goals(status);

-- ============================================================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================================================

-- Enable RLS on all tables
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE health_scores ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE weekly_summaries ENABLE ROW LEVEL SECURITY;
ALTER TABLE health_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE comprehensive_health_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_plan_execution ENABLE ROW LEVEL SECURITY;
ALTER TABLE weekly_progress_tracking ENABLE ROW LEVEL SECURITY;
ALTER TABLE monthly_assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_nutrition ENABLE ROW LEVEL SECURITY;
ALTER TABLE food_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE nutrition_goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE food_database ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscription_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_trials ENABLE ROW LEVEL SECURITY;
ALTER TABLE token_usage ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_health_goals ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- RLS POLICIES
-- ============================================================================

-- User profiles policies
CREATE POLICY "Users can view their own profile" ON user_profiles
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile" ON user_profiles
    FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON user_profiles
    FOR UPDATE USING (auth.uid() = id);

-- Health scores policies
CREATE POLICY "Users can view their own health scores" ON health_scores
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own health scores" ON health_scores
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own health scores" ON health_scores
    FOR UPDATE USING (auth.uid() = user_id);

-- Daily activities policies
CREATE POLICY "Users can view their own daily activities" ON daily_activities
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own daily activities" ON daily_activities
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own daily activities" ON daily_activities
    FOR UPDATE USING (auth.uid() = user_id);

-- Weekly summaries policies
CREATE POLICY "Users can view their own weekly summaries" ON weekly_summaries
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own weekly summaries" ON weekly_summaries
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own weekly summaries" ON weekly_summaries
    FOR UPDATE USING (auth.uid() = user_id);

-- Health metrics policies
CREATE POLICY "Users can view their own health metrics" ON health_metrics
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own health metrics" ON health_metrics
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own health metrics" ON health_metrics
    FOR UPDATE USING (auth.uid() = user_id);

-- Comprehensive health plans policies
CREATE POLICY "Users can view their own comprehensive plans" ON comprehensive_health_plans
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own comprehensive plans" ON comprehensive_health_plans
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own comprehensive plans" ON comprehensive_health_plans
    FOR UPDATE USING (auth.uid() = user_id);

-- Daily plan execution policies
CREATE POLICY "Users can view their own daily execution" ON daily_plan_execution
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own daily execution" ON daily_plan_execution
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own daily execution" ON daily_plan_execution
    FOR UPDATE USING (auth.uid() = user_id);

-- Weekly progress tracking policies
CREATE POLICY "Users can view their own weekly progress" ON weekly_progress_tracking
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own weekly progress" ON weekly_progress_tracking
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own weekly progress" ON weekly_progress_tracking
    FOR UPDATE USING (auth.uid() = user_id);

-- Monthly assessments policies
CREATE POLICY "Users can view their own monthly assessments" ON monthly_assessments
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own monthly assessments" ON monthly_assessments
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own monthly assessments" ON monthly_assessments
    FOR UPDATE USING (auth.uid() = user_id);

-- Nutrition policies
CREATE POLICY "Users can view their own daily nutrition" ON daily_nutrition
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own daily nutrition" ON daily_nutrition
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own daily nutrition" ON daily_nutrition
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own food entries" ON food_entries
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own food entries" ON food_entries
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own food entries" ON food_entries
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own nutrition goals" ON nutrition_goals
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own nutrition goals" ON nutrition_goals
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own nutrition goals" ON nutrition_goals
    FOR UPDATE USING (auth.uid() = user_id);

-- Food database policies (read-only for all authenticated users)
CREATE POLICY "Authenticated users can view food database" ON food_database
    FOR SELECT USING (auth.role() = 'authenticated');

-- Subscription policies
CREATE POLICY "subscription_plans_select_policy" ON subscription_plans
    FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "subscriptions_select_policy" ON subscriptions
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "subscriptions_insert_policy" ON subscriptions
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "subscriptions_update_policy" ON subscriptions
    FOR UPDATE USING (auth.uid() = user_id);

-- Trial policies
CREATE POLICY "Users can view their own trials" ON user_trials
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own trials" ON user_trials
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own trials" ON user_trials
    FOR UPDATE USING (auth.uid() = user_id);

-- Token usage policies
CREATE POLICY "Users can view their own token usage" ON token_usage
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own token usage" ON token_usage
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own token usage" ON token_usage
    FOR UPDATE USING (auth.uid() = user_id);

-- Health goals policies
CREATE POLICY "Users can view their own health goals" ON user_health_goals
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own health goals" ON user_health_goals
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own health goals" ON user_health_goals
    FOR UPDATE USING (auth.uid() = user_id);

-- ============================================================================
-- FUNCTIONS AND TRIGGERS
-- ============================================================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at on all tables
CREATE TRIGGER update_user_profiles_updated_at
    BEFORE UPDATE ON user_profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_health_scores_updated_at
    BEFORE UPDATE ON health_scores
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_daily_activities_updated_at
    BEFORE UPDATE ON daily_activities
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_weekly_summaries_updated_at
    BEFORE UPDATE ON weekly_summaries
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_health_metrics_updated_at
    BEFORE UPDATE ON health_metrics
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_comprehensive_plans_updated_at
    BEFORE UPDATE ON comprehensive_health_plans
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_daily_execution_updated_at
    BEFORE UPDATE ON daily_plan_execution
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_weekly_progress_updated_at
    BEFORE UPDATE ON weekly_progress_tracking
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_monthly_assessments_updated_at
    BEFORE UPDATE ON monthly_assessments
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_daily_nutrition_updated_at
    BEFORE UPDATE ON daily_nutrition
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_food_entries_updated_at
    BEFORE UPDATE ON food_entries
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_nutrition_goals_updated_at
    BEFORE UPDATE ON nutrition_goals
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_subscription_plans_updated_at
    BEFORE UPDATE ON subscription_plans
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_subscriptions_updated_at
    BEFORE UPDATE ON subscriptions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_trials_updated_at
    BEFORE UPDATE ON user_trials
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_token_usage_updated_at
    BEFORE UPDATE ON token_usage
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_health_goals_updated_at
    BEFORE UPDATE ON user_health_goals
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- INSERT DEFAULT DATA
-- ============================================================================

-- Insert default subscription plans
INSERT INTO subscription_plans (name, slug, description, price_monthly, price_annual, features, max_users, max_storage_gb, is_popular, sort_order) VALUES
(
    'Basic',
    'basic',
    'Perfect for individuals starting their health journey',
    12.00,
    99.99,
    '[
        "AI-powered health insights",
        "Personalized meal plans", 
        "Basic health tracking",
        "24/7 health support",
        "Mobile app access"
    ]',
    1,
    1,
    false,
    1
),
(
    'Family',
    'family', 
    'Ideal for families who want to stay healthy together',
    25.00,
    199.99,
    '[
        "Everything in Basic",
        "Up to 5 family members",
        "Family health dashboard",
        "Shared meal planning", 
        "Family health reports",
        "Priority customer support"
    ]',
    5,
    5,
    true,
    2
),
(
    'Elite',
    'elite',
    'Premium health management for serious wellness enthusiasts',
    40.00,
    399.99,
    '[
        "Everything in Family",
        "Unlimited health consultations",
        "Advanced AI diagnostics",
        "Personal health coach",
        "Premium meal plans",
        "Exclusive wellness content",
        "VIP customer support"
    ]',
    10,
    20,
    false,
    3
);

-- Insert some common foods for testing
INSERT INTO food_database (name, category, serving_size, serving_unit, calories_per_serving, protein_per_serving, carbs_per_serving, fat_per_serving, verified) VALUES
('Apple', 'Fruits', 1, 'medium', 95, 0.5, 25, 0.3, true),
('Banana', 'Fruits', 1, 'medium', 105, 1.3, 27, 0.4, true),
('Chicken Breast', 'Protein', 100, 'grams', 165, 31, 0, 3.6, true),
('Brown Rice', 'Grains', 100, 'grams', 111, 2.6, 23, 0.9, true),
('Broccoli', 'Vegetables', 100, 'grams', 34, 2.8, 7, 0.4, true),
('Greek Yogurt', 'Dairy', 100, 'grams', 59, 10, 3.6, 0.4, true),
('Almonds', 'Nuts', 28, 'grams', 161, 6, 6, 14, true),
('Salmon', 'Protein', 100, 'grams', 208, 20, 0, 12, true),
('Sweet Potato', 'Vegetables', 100, 'grams', 86, 1.6, 20, 0.1, true),
('Oats', 'Grains', 100, 'grams', 389, 16.9, 66, 6.9, true)
ON CONFLICT (name, brand) DO NOTHING;
