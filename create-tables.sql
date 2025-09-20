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
  
  -- Assessment data
  assessment_data JSONB NOT NULL,
  overall_score DECIMAL(5,2),
  goal_progress_score DECIMAL(5,2),
  compliance_score DECIMAL(5,2),
  health_metrics_score DECIMAL(5,2),
  
  -- User feedback
  user_satisfaction INTEGER CHECK (user_satisfaction BETWEEN 1 AND 10),
  difficulty_rating INTEGER CHECK (difficulty_rating BETWEEN 1 AND 10),
  user_feedback TEXT,
  adjustments_requested TEXT,
  
  -- Status
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN (
    'pending', 'in_progress', 'completed', 'overdue'
  )),
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Ensure one assessment per plan per month
  UNIQUE(plan_id, month_number)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_comprehensive_health_plans_user_id ON comprehensive_health_plans(user_id);
CREATE INDEX IF NOT EXISTS idx_comprehensive_health_plans_status ON comprehensive_health_plans(status);
CREATE INDEX IF NOT EXISTS idx_daily_plan_execution_plan_id ON daily_plan_execution(plan_id);
CREATE INDEX IF NOT EXISTS idx_daily_plan_execution_user_id ON daily_plan_execution(user_id);
CREATE INDEX IF NOT EXISTS idx_weekly_progress_tracking_plan_id ON weekly_progress_tracking(plan_id);
CREATE INDEX IF NOT EXISTS idx_monthly_assessments_plan_id ON monthly_assessments(plan_id);

-- Enable Row Level Security
ALTER TABLE comprehensive_health_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_plan_execution ENABLE ROW LEVEL SECURITY;
ALTER TABLE weekly_progress_tracking ENABLE ROW LEVEL SECURITY;
ALTER TABLE monthly_assessments ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view their own comprehensive health plans" ON comprehensive_health_plans
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own comprehensive health plans" ON comprehensive_health_plans
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own comprehensive health plans" ON comprehensive_health_plans
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own daily plan executions" ON daily_plan_execution
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own daily plan executions" ON daily_plan_execution
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own daily plan executions" ON daily_plan_execution
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own weekly progress tracking" ON weekly_progress_tracking
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own weekly progress tracking" ON weekly_progress_tracking
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own weekly progress tracking" ON weekly_progress_tracking
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own monthly assessments" ON monthly_assessments
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own monthly assessments" ON monthly_assessments
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own monthly assessments" ON monthly_assessments
  FOR UPDATE USING (auth.uid() = user_id);
