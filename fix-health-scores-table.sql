-- Fix Missing Health Scores Table
-- Run this in your Supabase SQL Editor to create the missing health_scores table

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
CREATE POLICY "Users can view their own health scores" ON health_scores
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own health scores" ON health_scores
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own health scores" ON health_scores
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own health scores" ON health_scores
  FOR DELETE USING (auth.uid() = user_id);

-- Create RLS policies for daily_activities
CREATE POLICY "Users can view their own daily activities" ON daily_activities
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own daily activities" ON daily_activities
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own daily activities" ON daily_activities
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own daily activities" ON daily_activities
  FOR DELETE USING (auth.uid() = user_id);

-- Create RLS policies for weekly_summaries
CREATE POLICY "Users can view their own weekly summaries" ON weekly_summaries
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own weekly summaries" ON weekly_summaries
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own weekly summaries" ON weekly_summaries
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own weekly summaries" ON weekly_summaries
  FOR DELETE USING (auth.uid() = user_id);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
CREATE TRIGGER update_health_scores_updated_at 
  BEFORE UPDATE ON health_scores 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_weekly_summaries_updated_at 
  BEFORE UPDATE ON weekly_summaries 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

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

-- Verify the tables were created
SELECT 'Health scores table created successfully!' as status;
