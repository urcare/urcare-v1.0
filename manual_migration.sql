-- Comprehensive Health Plan System Migration
-- Run this in your Supabase SQL Editor

-- Create comprehensive health plans table
CREATE TABLE IF NOT EXISTS comprehensive_health_plans (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Plan metadata
  plan_name VARCHAR(255) NOT NULL,
  plan_type VARCHAR(50) NOT NULL CHECK (plan_type IN (
    'quick_win', 'habit_formation', 'health_transformation', 
    'disease_management', 'lifestyle_change'
  )),
  primary_goal VARCHAR(255) NOT NULL,
  secondary_goals TEXT[],
  
  -- Timeline
  start_date DATE NOT NULL,
  target_end_date DATE NOT NULL,
  actual_end_date DATE,
  duration_weeks INTEGER NOT NULL,
  
  -- Plan structure
  plan_data JSONB NOT NULL,
  weekly_milestones JSONB DEFAULT '[]',
  monthly_assessments JSONB DEFAULT '[]',
  
  -- Progress tracking
  overall_progress_percentage DECIMAL(5,2) DEFAULT 0.0,
  weekly_compliance_rate DECIMAL(5,2) DEFAULT 0.0,
  monthly_compliance_rate DECIMAL(5,2) DEFAULT 0.0,
  
  -- Status and lifecycle
  status VARCHAR(20) DEFAULT 'active' CHECK (status IN (
    'draft', 'active', 'paused', 'completed', 'cancelled', 'extended'
  )),
  completion_reason TEXT,
  
  -- Adaptive adjustments
  timeline_adjustments JSONB DEFAULT '[]',
  intensity_adjustments JSONB DEFAULT '[]',
  
  -- Metadata
  generated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Constraints
  CONSTRAINT valid_duration CHECK (duration_weeks > 0 AND duration_weeks <= 104),
  CONSTRAINT valid_dates CHECK (target_end_date > start_date)
);

-- Create daily plan execution table
CREATE TABLE IF NOT EXISTS daily_plan_execution (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  plan_id UUID NOT NULL REFERENCES comprehensive_health_plans(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Day information
  execution_date DATE NOT NULL,
  week_number INTEGER NOT NULL,
  day_of_week INTEGER NOT NULL CHECK (day_of_week BETWEEN 1 AND 7),
  
  -- Daily plan data
  daily_activities JSONB NOT NULL,
  daily_meals JSONB NOT NULL,
  daily_workouts JSONB NOT NULL,
  daily_wellness JSONB NOT NULL,
  
  -- Completion tracking
  activities_completed INTEGER DEFAULT 0,
  total_activities INTEGER NOT NULL,
  completion_percentage DECIMAL(5,2) DEFAULT 0.0,
  
  -- User feedback
  energy_level INTEGER CHECK (energy_level BETWEEN 1 AND 10),
  difficulty_rating INTEGER CHECK (difficulty_rating BETWEEN 1 AND 10),
  user_notes TEXT,
  
  -- Status
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN (
    'pending', 'in_progress', 'completed', 'skipped', 'modified'
  )),
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Ensure one execution per plan per day
  UNIQUE(plan_id, execution_date)
);

-- Create weekly progress tracking
CREATE TABLE IF NOT EXISTS weekly_progress_tracking (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  plan_id UUID NOT NULL REFERENCES comprehensive_health_plans(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Week information
  week_number INTEGER NOT NULL,
  week_start_date DATE NOT NULL,
  week_end_date DATE NOT NULL,
  
  -- Weekly metrics
  total_activities INTEGER NOT NULL,
  completed_activities INTEGER DEFAULT 0,
  compliance_rate DECIMAL(5,2) DEFAULT 0.0,
  
  -- Goal-specific metrics
  weight_change DECIMAL(5,2),
  body_measurements JSONB,
  fitness_metrics JSONB,
  health_metrics JSONB,
  
  -- Milestone tracking
  milestones_achieved JSONB DEFAULT '[]',
  milestones_missed JSONB DEFAULT '[]',
  
  -- User feedback
  weekly_rating INTEGER CHECK (weekly_rating BETWEEN 1 AND 10),
  challenges_faced TEXT[],
  successes_celebrated TEXT[],
  adjustments_needed TEXT,
  
  -- Status
  status VARCHAR(20) DEFAULT 'in_progress' CHECK (status IN (
    'in_progress', 'completed', 'needs_adjustment'
  )),
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Ensure one tracking per plan per week
  UNIQUE(plan_id, week_number)
);

-- Create monthly assessment table
CREATE TABLE IF NOT EXISTS monthly_assessments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  plan_id UUID NOT NULL REFERENCES comprehensive_health_plans(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Month information
  month_number INTEGER NOT NULL,
  assessment_date DATE NOT NULL,
  
  -- Comprehensive assessment
  overall_progress DECIMAL(5,2) NOT NULL,
  goal_achievement_rate DECIMAL(5,2) NOT NULL,
  compliance_trend VARCHAR(20) CHECK (compliance_trend IN (
    'improving', 'stable', 'declining', 'inconsistent'
  )),
  
  -- Health metrics
  health_improvements JSONB,
  health_concerns JSONB,
  biomarker_changes JSONB,
  
  -- Plan adjustments
  timeline_adjustment_days INTEGER DEFAULT 0,
  intensity_adjustment_percentage DECIMAL(5,2) DEFAULT 0.0,
  new_barriers_identified TEXT[],
  new_success_factors TEXT[],
  
  -- Recommendations
  next_month_focus TEXT[],
  plan_modifications JSONB,
  additional_support_needed TEXT[],
  
  -- Status
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN (
    'pending', 'completed', 'requires_attention'
  )),
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Ensure one assessment per plan per month
  UNIQUE(plan_id, month_number)
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_comprehensive_plans_user_id ON comprehensive_health_plans(user_id);
CREATE INDEX IF NOT EXISTS idx_comprehensive_plans_status ON comprehensive_health_plans(status);
CREATE INDEX IF NOT EXISTS idx_comprehensive_plans_type ON comprehensive_health_plans(plan_type);
CREATE INDEX IF NOT EXISTS idx_comprehensive_plans_dates ON comprehensive_health_plans(start_date, target_end_date);

CREATE INDEX IF NOT EXISTS idx_daily_execution_plan_id ON daily_plan_execution(plan_id);
CREATE INDEX IF NOT EXISTS idx_daily_execution_date ON daily_plan_execution(execution_date);
CREATE INDEX IF NOT EXISTS idx_daily_execution_week ON daily_plan_execution(week_number);

CREATE INDEX IF NOT EXISTS idx_weekly_progress_plan_id ON weekly_progress_tracking(plan_id);
CREATE INDEX IF NOT EXISTS idx_weekly_progress_week ON weekly_progress_tracking(week_number);

CREATE INDEX IF NOT EXISTS idx_monthly_assessments_plan_id ON monthly_assessments(plan_id);
CREATE INDEX IF NOT EXISTS idx_monthly_assessments_month ON monthly_assessments(month_number);

-- Enable RLS
ALTER TABLE comprehensive_health_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_plan_execution ENABLE ROW LEVEL SECURITY;
ALTER TABLE weekly_progress_tracking ENABLE ROW LEVEL SECURITY;
ALTER TABLE monthly_assessments ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view their own comprehensive plans" ON comprehensive_health_plans
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own comprehensive plans" ON comprehensive_health_plans
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own comprehensive plans" ON comprehensive_health_plans
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own comprehensive plans" ON comprehensive_health_plans
  FOR DELETE USING (auth.uid() = user_id);

-- Similar policies for other tables
CREATE POLICY "Users can view their own daily execution" ON daily_plan_execution
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own daily execution" ON daily_plan_execution
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own daily execution" ON daily_plan_execution
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own weekly progress" ON weekly_progress_tracking
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own weekly progress" ON weekly_progress_tracking
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own weekly progress" ON weekly_progress_tracking
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own monthly assessments" ON monthly_assessments
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own monthly assessments" ON monthly_assessments
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own monthly assessments" ON monthly_assessments
  FOR UPDATE USING (auth.uid() = user_id);

-- Create functions for automatic updates
CREATE OR REPLACE FUNCTION update_comprehensive_plans_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  NEW.last_updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION update_daily_execution_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION update_weekly_progress_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION update_monthly_assessments_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers
CREATE TRIGGER update_comprehensive_plans_updated_at
  BEFORE UPDATE ON comprehensive_health_plans
  FOR EACH ROW
  EXECUTE FUNCTION update_comprehensive_plans_updated_at();

CREATE TRIGGER update_daily_execution_updated_at
  BEFORE UPDATE ON daily_plan_execution
  FOR EACH ROW
  EXECUTE FUNCTION update_daily_execution_updated_at();

CREATE TRIGGER update_weekly_progress_updated_at
  BEFORE UPDATE ON weekly_progress_tracking
  FOR EACH ROW
  EXECUTE FUNCTION update_weekly_progress_updated_at();

CREATE TRIGGER update_monthly_assessments_updated_at
  BEFORE UPDATE ON monthly_assessments
  FOR EACH ROW
  EXECUTE FUNCTION update_monthly_assessments_updated_at();

-- Create function to automatically calculate daily completion percentage
CREATE OR REPLACE FUNCTION calculate_daily_completion()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.total_activities > 0 THEN
    NEW.completion_percentage = (NEW.activities_completed::DECIMAL / NEW.total_activities::DECIMAL) * 100;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER calculate_daily_completion_trigger
  BEFORE INSERT OR UPDATE ON daily_plan_execution
  FOR EACH ROW
  EXECUTE FUNCTION calculate_daily_completion();

-- Create function to automatically calculate weekly compliance rate
CREATE OR REPLACE FUNCTION calculate_weekly_compliance()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.total_activities > 0 THEN
    NEW.compliance_rate = (NEW.completed_activities::DECIMAL / NEW.total_activities::DECIMAL) * 100;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER calculate_weekly_compliance_trigger
  BEFORE INSERT OR UPDATE ON weekly_progress_tracking
  FOR EACH ROW
  EXECUTE FUNCTION calculate_weekly_compliance();
