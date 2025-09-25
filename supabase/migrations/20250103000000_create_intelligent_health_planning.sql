-- Create intelligent health planning tables
-- This migration creates tables for the new intelligent health planning system

-- Create weekly_plans table
CREATE TABLE IF NOT EXISTS weekly_plans (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  difficulty VARCHAR(20) NOT NULL CHECK (difficulty IN ('easy', 'moderate', 'hard')),
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  days JSONB NOT NULL DEFAULT '[]',
  overall_goals TEXT[] DEFAULT '{}',
  progress_tips TEXT[] DEFAULT '{}',
  meal_variations JSONB DEFAULT '{}',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create activity_completions table
CREATE TABLE IF NOT EXISTS activity_completions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  activity_id VARCHAR(100) NOT NULL,
  completed BOOLEAN DEFAULT false,
  completed_at TIMESTAMP WITH TIME ZONE,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, activity_id, DATE(created_at))
);

-- Create daily_schedules table for next day generation
CREATE TABLE IF NOT EXISTS daily_schedules (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  plan_id UUID REFERENCES weekly_plans(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  schedule JSONB NOT NULL,
  completion_rate DECIMAL(5,2) DEFAULT 0.00,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, date)
);

-- Create plan_details table for storing detailed plan information
CREATE TABLE IF NOT EXISTS plan_details (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  plan_id UUID NOT NULL REFERENCES weekly_plans(id) ON DELETE CASCADE,
  difficulty_level VARCHAR(20) NOT NULL,
  estimated_results TEXT[] DEFAULT '{}',
  time_commitment VARCHAR(50),
  equipment_needed TEXT[] DEFAULT '{}',
  preparation_steps TEXT[] DEFAULT '{}',
  success_metrics TEXT[] DEFAULT '{}',
  warnings TEXT[] DEFAULT '{}',
  alternatives TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_weekly_plans_user_id ON weekly_plans(user_id);
CREATE INDEX IF NOT EXISTS idx_weekly_plans_active ON weekly_plans(is_active) WHERE is_active = true;
CREATE INDEX IF NOT EXISTS idx_weekly_plans_difficulty ON weekly_plans(difficulty);
CREATE INDEX IF NOT EXISTS idx_activity_completions_user_id ON activity_completions(user_id);
CREATE INDEX IF NOT EXISTS idx_activity_completions_date ON activity_completions(DATE(created_at));
CREATE INDEX IF NOT EXISTS idx_activity_completions_completed ON activity_completions(completed);
CREATE INDEX IF NOT EXISTS idx_daily_schedules_user_id ON daily_schedules(user_id);
CREATE INDEX IF NOT EXISTS idx_daily_schedules_date ON daily_schedules(date);
CREATE INDEX IF NOT EXISTS idx_plan_details_plan_id ON plan_details(plan_id);

-- Enable RLS (Row Level Security)
ALTER TABLE weekly_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_completions ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_schedules ENABLE ROW LEVEL SECURITY;
ALTER TABLE plan_details ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for weekly_plans
CREATE POLICY "Users can view their own weekly plans" ON weekly_plans
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own weekly plans" ON weekly_plans
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own weekly plans" ON weekly_plans
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own weekly plans" ON weekly_plans
  FOR DELETE USING (auth.uid() = user_id);

-- Create RLS policies for activity_completions
CREATE POLICY "Users can view their own activity completions" ON activity_completions
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own activity completions" ON activity_completions
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own activity completions" ON activity_completions
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own activity completions" ON activity_completions
  FOR DELETE USING (auth.uid() = user_id);

-- Create RLS policies for daily_schedules
CREATE POLICY "Users can view their own daily schedules" ON daily_schedules
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own daily schedules" ON daily_schedules
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own daily schedules" ON daily_schedules
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own daily schedules" ON daily_schedules
  FOR DELETE USING (auth.uid() = user_id);

-- Create RLS policies for plan_details
CREATE POLICY "Users can view their own plan details" ON plan_details
  FOR SELECT USING (auth.uid() = (SELECT user_id FROM weekly_plans WHERE id = plan_id));

CREATE POLICY "Users can insert their own plan details" ON plan_details
  FOR INSERT WITH CHECK (auth.uid() = (SELECT user_id FROM weekly_plans WHERE id = plan_id));

CREATE POLICY "Users can update their own plan details" ON plan_details
  FOR UPDATE USING (auth.uid() = (SELECT user_id FROM weekly_plans WHERE id = plan_id));

CREATE POLICY "Users can delete their own plan details" ON plan_details
  FOR DELETE USING (auth.uid() = (SELECT user_id FROM weekly_plans WHERE id = plan_id));

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_weekly_plans_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION update_activity_completions_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION update_daily_schedules_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION update_plan_details_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers to automatically update updated_at
CREATE TRIGGER update_weekly_plans_updated_at
  BEFORE UPDATE ON weekly_plans
  FOR EACH ROW
  EXECUTE FUNCTION update_weekly_plans_updated_at();

CREATE TRIGGER update_activity_completions_updated_at
  BEFORE UPDATE ON activity_completions
  FOR EACH ROW
  EXECUTE FUNCTION update_activity_completions_updated_at();

CREATE TRIGGER update_daily_schedules_updated_at
  BEFORE UPDATE ON daily_schedules
  FOR EACH ROW
  EXECUTE FUNCTION update_daily_schedules_updated_at();

CREATE TRIGGER update_plan_details_updated_at
  BEFORE UPDATE ON plan_details
  FOR EACH ROW
  EXECUTE FUNCTION update_plan_details_updated_at();

-- Create function to calculate daily completion rate
CREATE OR REPLACE FUNCTION calculate_daily_completion_rate(p_user_id UUID, p_date DATE)
RETURNS DECIMAL(5,2) AS $$
DECLARE
  total_activities INTEGER;
  completed_activities INTEGER;
  completion_rate DECIMAL(5,2);
BEGIN
  -- Get total activities for the day
  SELECT COUNT(*) INTO total_activities
  FROM activity_completions
  WHERE user_id = p_user_id 
  AND DATE(created_at) = p_date;

  -- Get completed activities for the day
  SELECT COUNT(*) INTO completed_activities
  FROM activity_completions
  WHERE user_id = p_user_id 
  AND DATE(created_at) = p_date
  AND completed = true;

  -- Calculate completion rate
  IF total_activities > 0 THEN
    completion_rate := (completed_activities::DECIMAL / total_activities::DECIMAL) * 100;
  ELSE
    completion_rate := 0;
  END IF;

  RETURN completion_rate;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to get user's current active plan
CREATE OR REPLACE FUNCTION get_active_plan(p_user_id UUID)
RETURNS TABLE (
  id UUID,
  difficulty VARCHAR(20),
  start_date DATE,
  end_date DATE,
  days JSONB,
  overall_goals TEXT[],
  progress_tips TEXT[],
  meal_variations JSONB
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    wp.id,
    wp.difficulty,
    wp.start_date,
    wp.end_date,
    wp.days,
    wp.overall_goals,
    wp.progress_tips,
    wp.meal_variations
  FROM weekly_plans wp
  WHERE wp.user_id = p_user_id 
  AND wp.is_active = true
  ORDER BY wp.created_at DESC
  LIMIT 1;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to get today's schedule
CREATE OR REPLACE FUNCTION get_today_schedule(p_user_id UUID, p_date DATE DEFAULT CURRENT_DATE)
RETURNS TABLE (
  id UUID,
  date DATE,
  schedule JSONB,
  completion_rate DECIMAL(5,2)
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    ds.id,
    ds.date,
    ds.schedule,
    ds.completion_rate
  FROM daily_schedules ds
  WHERE ds.user_id = p_user_id 
  AND ds.date = p_date
  ORDER BY ds.created_at DESC
  LIMIT 1;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to mark activity as completed
CREATE OR REPLACE FUNCTION mark_activity_completed(
  p_user_id UUID,
  p_activity_id VARCHAR(100),
  p_completed BOOLEAN DEFAULT true,
  p_notes TEXT DEFAULT NULL
)
RETURNS BOOLEAN AS $$
DECLARE
  result BOOLEAN;
BEGIN
  INSERT INTO activity_completions (user_id, activity_id, completed, completed_at, notes)
  VALUES (p_user_id, p_activity_id, p_completed, 
          CASE WHEN p_completed THEN NOW() ELSE NULL END, p_notes)
  ON CONFLICT (user_id, activity_id, DATE(created_at))
  DO UPDATE SET 
    completed = p_completed,
    completed_at = CASE WHEN p_completed THEN NOW() ELSE NULL END,
    notes = p_notes,
    updated_at = NOW();
  
  -- Update daily completion rate
  UPDATE daily_schedules 
  SET completion_rate = calculate_daily_completion_rate(p_user_id, CURRENT_DATE)
  WHERE user_id = p_user_id AND date = CURRENT_DATE;
  
  RETURN true;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to get user's health progress
CREATE OR REPLACE FUNCTION get_user_health_progress(p_user_id UUID)
RETURNS TABLE (
  total_plans INTEGER,
  completed_plans INTEGER,
  current_streak INTEGER,
  average_completion DECIMAL(5,2),
  total_activities INTEGER,
  completed_activities INTEGER,
  health_score INTEGER
) AS $$
DECLARE
  total_plans_count INTEGER;
  completed_plans_count INTEGER;
  current_streak_days INTEGER;
  avg_completion DECIMAL(5,2);
  total_activities_count INTEGER;
  completed_activities_count INTEGER;
  user_health_score INTEGER;
BEGIN
  -- Get total plans
  SELECT COUNT(*) INTO total_plans_count
  FROM weekly_plans
  WHERE user_id = p_user_id;

  -- Get completed plans (plans where all days are completed)
  SELECT COUNT(*) INTO completed_plans_count
  FROM weekly_plans wp
  WHERE wp.user_id = p_user_id
  AND wp.is_active = false;

  -- Get current streak
  SELECT COALESCE(MAX(streak_days), 0) INTO current_streak_days
  FROM health_scores
  WHERE user_id = p_user_id;

  -- Get average completion rate
  SELECT COALESCE(AVG(completion_rate), 0) INTO avg_completion
  FROM daily_schedules
  WHERE user_id = p_user_id;

  -- Get total activities
  SELECT COUNT(*) INTO total_activities_count
  FROM activity_completions
  WHERE user_id = p_user_id;

  -- Get completed activities
  SELECT COUNT(*) INTO completed_activities_count
  FROM activity_completions
  WHERE user_id = p_user_id AND completed = true;

  -- Get health score
  SELECT COALESCE(MAX(score), 0) INTO user_health_score
  FROM health_scores
  WHERE user_id = p_user_id;

  RETURN QUERY
  SELECT 
    total_plans_count,
    completed_plans_count,
    current_streak_days,
    avg_completion,
    total_activities_count,
    completed_activities_count,
    user_health_score;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
