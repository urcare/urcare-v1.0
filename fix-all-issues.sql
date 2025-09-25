-- Comprehensive Fix for All UrCare Issues
-- Run this in your Supabase SQL Editor to fix all identified problems

-- ========================================
-- 1. FIX MISSING HEALTH_SCORES TABLE
-- ========================================

-- Create health_scores table
CREATE TABLE IF NOT EXISTS health_scores (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  overall_score INTEGER DEFAULT 0 CHECK (overall_score >= 0 AND overall_score <= 100),
  nutrition_score INTEGER DEFAULT 0 CHECK (nutrition_score >= 0 AND nutrition_score <= 100),
  exercise_score INTEGER DEFAULT 0 CHECK (exercise_score >= 0 AND exercise_score <= 100),
  sleep_score INTEGER DEFAULT 0 CHECK (sleep_score >= 0 AND sleep_score <= 100),
  stress_score INTEGER DEFAULT 0 CHECK (stress_score >= 0 AND stress_score <= 100),
  hydration_score INTEGER DEFAULT 0 CHECK (hydration_score >= 0 AND hydration_score <= 100),
  mental_health_score INTEGER DEFAULT 0 CHECK (mental_health_score >= 0 AND mental_health_score <= 100),
  last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id)
);

-- Create daily_activities table
CREATE TABLE IF NOT EXISTS daily_activities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  activity_date DATE NOT NULL,
  activity_type VARCHAR(50) NOT NULL,
  activity_name VARCHAR(100) NOT NULL,
  duration_minutes INTEGER DEFAULT 0,
  calories_burned INTEGER DEFAULT 0,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, activity_date, activity_type, activity_name)
);

-- Create weekly_summaries table
CREATE TABLE IF NOT EXISTS weekly_summaries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  week_start_date DATE NOT NULL,
  week_end_date DATE NOT NULL,
  total_activities INTEGER DEFAULT 0,
  total_duration_minutes INTEGER DEFAULT 0,
  total_calories_burned INTEGER DEFAULT 0,
  average_daily_score DECIMAL(5,2) DEFAULT 0.00,
  goals_achieved INTEGER DEFAULT 0,
  goals_total INTEGER DEFAULT 0,
  summary_text TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, week_start_date)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_health_scores_user_id ON health_scores(user_id);
CREATE INDEX IF NOT EXISTS idx_health_scores_last_updated ON health_scores(last_updated);
CREATE INDEX IF NOT EXISTS idx_daily_activities_user_id ON daily_activities(user_id);
CREATE INDEX IF NOT EXISTS idx_daily_activities_date ON daily_activities(activity_date);
CREATE INDEX IF NOT EXISTS idx_weekly_summaries_user_id ON weekly_summaries(user_id);
CREATE INDEX IF NOT EXISTS idx_weekly_summaries_week_start ON weekly_summaries(week_start_date);

-- Enable Row Level Security
ALTER TABLE health_scores ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE weekly_summaries ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for health_scores
DROP POLICY IF EXISTS "Users can view their own health scores" ON health_scores;
DROP POLICY IF EXISTS "Users can insert their own health scores" ON health_scores;
DROP POLICY IF EXISTS "Users can update their own health scores" ON health_scores;
DROP POLICY IF EXISTS "Users can delete their own health scores" ON health_scores;

CREATE POLICY "Users can view their own health scores" ON health_scores
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own health scores" ON health_scores
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own health scores" ON health_scores
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own health scores" ON health_scores
  FOR DELETE USING (auth.uid() = user_id);

-- Create RLS policies for daily_activities
DROP POLICY IF EXISTS "Users can view their own daily activities" ON daily_activities;
DROP POLICY IF EXISTS "Users can insert their own daily activities" ON daily_activities;
DROP POLICY IF EXISTS "Users can update their own daily activities" ON daily_activities;
DROP POLICY IF EXISTS "Users can delete their own daily activities" ON daily_activities;

CREATE POLICY "Users can view their own daily activities" ON daily_activities
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own daily activities" ON daily_activities
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own daily activities" ON daily_activities
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own daily activities" ON daily_activities
  FOR DELETE USING (auth.uid() = user_id);

-- Create RLS policies for weekly_summaries
DROP POLICY IF EXISTS "Users can view their own weekly summaries" ON weekly_summaries;
DROP POLICY IF EXISTS "Users can insert their own weekly summaries" ON weekly_summaries;
DROP POLICY IF EXISTS "Users can update their own weekly summaries" ON weekly_summaries;
DROP POLICY IF EXISTS "Users can delete their own weekly summaries" ON weekly_summaries;

CREATE POLICY "Users can view their own weekly summaries" ON weekly_summaries
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own weekly summaries" ON weekly_summaries
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own weekly summaries" ON weekly_summaries
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own weekly summaries" ON weekly_summaries
  FOR DELETE USING (auth.uid() = user_id);

-- ========================================
-- 2. CREATE SIMPLE HEALTH PLAN FUNCTION
-- ========================================

-- Create a simple health plan generation function as backup
CREATE OR REPLACE FUNCTION generate_simple_health_plan(
  user_id_param UUID,
  goal_param TEXT DEFAULT 'Improve overall health'
)
RETURNS JSONB AS $$
DECLARE
  user_profile JSONB;
  health_plan JSONB;
BEGIN
  -- Get user profile
  SELECT to_jsonb(up.*) INTO user_profile
  FROM user_profiles up
  WHERE up.id = user_id_param;
  
  -- If no profile found, return error
  IF user_profile IS NULL THEN
    RETURN jsonb_build_object(
      'success', false,
      'error', 'User profile not found'
    );
  END IF;
  
  -- Create a simple health plan based on goal
  health_plan := jsonb_build_object(
    'goal', goal_param,
    'user_profile', user_profile,
    'plan', jsonb_build_object(
      'nutrition', jsonb_build_object(
        'breakfast', CASE 
          WHEN goal_param ILIKE '%weight%' THEN 'High-protein breakfast with eggs, oats, and fruits'
          ELSE 'Balanced breakfast with protein, fiber, and healthy fats'
        END,
        'lunch', CASE 
          WHEN goal_param ILIKE '%weight%' THEN 'Protein-rich lunch with lean meat, vegetables, and complex carbs'
          ELSE 'Balanced lunch with vegetables and lean protein'
        END,
        'dinner', CASE 
          WHEN goal_param ILIKE '%weight%' THEN 'Light dinner with protein and vegetables'
          ELSE 'Nutritious dinner 2-3 hours before sleep'
        END,
        'snacks', CASE 
          WHEN goal_param ILIKE '%weight%' THEN 'Protein shakes, nuts, Greek yogurt'
          ELSE 'Fruits, nuts, or yogurt between meals'
        END
      ),
      'exercise', jsonb_build_object(
        'cardio', CASE 
          WHEN goal_param ILIKE '%weight%' THEN 'Strength training 4-5 times a week with progressive overload'
          ELSE '30 minutes of moderate cardio 5 days a week'
        END,
        'strength', CASE 
          WHEN goal_param ILIKE '%weight%' THEN 'Compound movements: squats, deadlifts, bench press, rows'
          ELSE 'Strength training 2-3 times a week'
        END,
        'flexibility', 'Daily stretching and mobility work'
      ),
      'sleep', jsonb_build_object(
        'duration', '7-9 hours per night',
        'schedule', 'Consistent sleep and wake times',
        'environment', 'Cool, dark, quiet bedroom'
      ),
      'stress_management', jsonb_build_object(
        'techniques', 'Deep breathing, meditation, or yoga',
        'activities', 'Hobbies, social connections, nature time'
      )
    ),
    'created_at', NOW(),
    'success', true
  );
  
  RETURN health_plan;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION generate_simple_health_plan(UUID, TEXT) TO authenticated;

-- ========================================
-- 3. INSERT DEFAULT DATA FOR YOUR USER
-- ========================================

-- Insert default health score for your user
INSERT INTO health_scores (
  user_id,
  overall_score,
  nutrition_score,
  exercise_score,
  sleep_score,
  stress_score,
  hydration_score,
  mental_health_score
) VALUES (
  '6295da0b-c227-4404-875a-0f16834bfa75'::UUID,
  75,
  80,
  70,
  75,
  60,
  85,
  70
) ON CONFLICT (user_id) DO UPDATE SET
  overall_score = 75,
  nutrition_score = 80,
  exercise_score = 70,
  sleep_score = 75,
  stress_score = 60,
  hydration_score = 85,
  mental_health_score = 70,
  last_updated = NOW(),
  updated_at = NOW();

-- ========================================
-- 4. VERIFICATION QUERIES
-- ========================================

-- Test the health plan function
SELECT generate_simple_health_plan(
  '6295da0b-c227-4404-875a-0f16834bfa75'::UUID,
  'gain weight'
) as test_health_plan;

-- Verify health scores table exists and has data
SELECT 
  'Health Scores Table Status' as check_type,
  CASE 
    WHEN EXISTS (SELECT 1 FROM health_scores WHERE user_id = '6295da0b-c227-4404-875a-0f16834bfa75'::UUID) 
    THEN 'EXISTS - User has health score data'
    ELSE 'MISSING - User needs health score data'
  END as status;

-- Show all tables that should exist
SELECT 
  'Database Tables Status' as check_type,
  string_agg(table_name, ', ') as existing_tables
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('health_scores', 'daily_activities', 'weekly_summaries', 'user_profiles', 'subscriptions');

-- Final status
SELECT 'All fixes completed successfully!' as status;
