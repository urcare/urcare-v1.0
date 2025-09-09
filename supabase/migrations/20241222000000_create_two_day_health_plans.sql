-- Create 2-day health plans table for personalized health and fitness plans
CREATE TABLE IF NOT EXISTS two_day_health_plans (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  plan_start_date DATE NOT NULL,
  plan_end_date DATE NOT NULL,
  day_1_plan JSONB NOT NULL, -- Day 1 activities, meals, workouts
  day_2_plan JSONB NOT NULL, -- Day 2 activities, meals, workouts
  day_1_completed BOOLEAN DEFAULT false,
  day_2_completed BOOLEAN DEFAULT false,
  progress_data JSONB DEFAULT '{}', -- Track completion of individual activities
  generated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  completed_at TIMESTAMP WITH TIME ZONE,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Ensure one active plan per user at a time
  UNIQUE(user_id, is_active) DEFERRABLE INITIALLY DEFERRED
);

-- Create plan progress tracking table
CREATE TABLE IF NOT EXISTS plan_progress (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  plan_id UUID NOT NULL REFERENCES two_day_health_plans(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  activity_type VARCHAR(50) NOT NULL, -- 'workout', 'meal', 'hydration', 'sleep', etc.
  activity_id VARCHAR(100) NOT NULL, -- Unique identifier for the specific activity
  day_number INTEGER NOT NULL CHECK (day_number IN (1, 2)),
  completed BOOLEAN DEFAULT false,
  completed_at TIMESTAMP WITH TIME ZONE,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Ensure one progress entry per activity per plan
  UNIQUE(plan_id, activity_id, day_number)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_two_day_plans_user_id ON two_day_health_plans(user_id);
CREATE INDEX IF NOT EXISTS idx_two_day_plans_start_date ON two_day_health_plans(plan_start_date);
CREATE INDEX IF NOT EXISTS idx_two_day_plans_active ON two_day_health_plans(is_active) WHERE is_active = true;
CREATE INDEX IF NOT EXISTS idx_plan_progress_plan_id ON plan_progress(plan_id);
CREATE INDEX IF NOT EXISTS idx_plan_progress_user_id ON plan_progress(user_id);

-- Enable RLS (Row Level Security)
ALTER TABLE two_day_health_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE plan_progress ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for two_day_health_plans
CREATE POLICY "Users can view their own 2-day plans" ON two_day_health_plans
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own 2-day plans" ON two_day_health_plans
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own 2-day plans" ON two_day_health_plans
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own 2-day plans" ON two_day_health_plans
  FOR DELETE USING (auth.uid() = user_id);

-- Create RLS policies for plan_progress
CREATE POLICY "Users can view their own plan progress" ON plan_progress
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own plan progress" ON plan_progress
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own plan progress" ON plan_progress
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own plan progress" ON plan_progress
  FOR DELETE USING (auth.uid() = user_id);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_two_day_plans_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION update_plan_progress_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers to automatically update updated_at
CREATE TRIGGER update_two_day_health_plans_updated_at
  BEFORE UPDATE ON two_day_health_plans
  FOR EACH ROW
  EXECUTE FUNCTION update_two_day_plans_updated_at();

CREATE TRIGGER update_plan_progress_updated_at
  BEFORE UPDATE ON plan_progress
  FOR EACH ROW
  EXECUTE FUNCTION update_plan_progress_updated_at();

-- Create function to automatically mark plan as completed when both days are done
CREATE OR REPLACE FUNCTION check_plan_completion()
RETURNS TRIGGER AS $$
BEGIN
  -- If both days are completed, mark the plan as completed
  IF NEW.day_1_completed = true AND NEW.day_2_completed = true THEN
    NEW.completed_at = NOW();
    NEW.is_active = false;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to check plan completion
CREATE TRIGGER check_two_day_plan_completion
  BEFORE UPDATE ON two_day_health_plans
  FOR EACH ROW
  EXECUTE FUNCTION check_plan_completion();
