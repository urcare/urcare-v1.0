-- Create health metrics table for tracking user health data
-- This migration creates tables for health metrics tracking

-- Create health_metrics table
CREATE TABLE IF NOT EXISTS health_metrics (
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

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_health_metrics_user_id ON health_metrics(user_id);
CREATE INDEX IF NOT EXISTS idx_health_metrics_date ON health_metrics(date);
CREATE INDEX IF NOT EXISTS idx_health_metrics_user_date ON health_metrics(user_id, date);

-- Enable RLS (Row Level Security)
ALTER TABLE health_metrics ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for health_metrics
CREATE POLICY "Users can view their own health metrics" ON health_metrics
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own health metrics" ON health_metrics
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own health metrics" ON health_metrics
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own health metrics" ON health_metrics
  FOR DELETE USING (auth.uid() = user_id);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_health_metrics_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_health_metrics_updated_at
  BEFORE UPDATE ON health_metrics
  FOR EACH ROW
  EXECUTE FUNCTION update_health_metrics_updated_at();

-- Create function to get health trends
CREATE OR REPLACE FUNCTION get_health_trends(
  p_user_id UUID,
  p_start_date DATE,
  p_end_date DATE
)
RETURNS TABLE (
  date DATE,
  weight DECIMAL(5,2),
  body_fat DECIMAL(4,2),
  muscle_mass DECIMAL(5,2),
  sleep_hours DECIMAL(3,1),
  sleep_quality INTEGER,
  energy_level INTEGER,
  mood INTEGER,
  stress_level INTEGER,
  water_intake INTEGER,
  steps INTEGER,
  calories_burned INTEGER
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    hm.date,
    hm.weight,
    hm.body_fat,
    hm.muscle_mass,
    hm.sleep_hours,
    hm.sleep_quality,
    hm.energy_level,
    hm.mood,
    hm.stress_level,
    hm.water_intake,
    hm.steps,
    hm.calories_burned
  FROM health_metrics hm
  WHERE hm.user_id = p_user_id
  AND hm.date >= p_start_date
  AND hm.date <= p_end_date
  ORDER BY hm.date;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to calculate health score from metrics
CREATE OR REPLACE FUNCTION calculate_health_score_from_metrics(
  p_user_id UUID,
  p_date DATE
)
RETURNS INTEGER AS $$
DECLARE
  base_score INTEGER := 50;
  bonus_score INTEGER := 0;
  metrics RECORD;
BEGIN
  -- Get the most recent health metrics for the user
  SELECT * INTO metrics
  FROM health_metrics
  WHERE user_id = p_user_id
  AND date <= p_date
  ORDER BY date DESC
  LIMIT 1;

  IF NOT FOUND THEN
    RETURN base_score;
  END IF;

  -- Sleep quality bonus
  IF metrics.sleep_quality >= 8 THEN
    bonus_score := bonus_score + 15;
  ELSIF metrics.sleep_quality >= 6 THEN
    bonus_score := bonus_score + 10;
  ELSIF metrics.sleep_quality >= 4 THEN
    bonus_score := bonus_score + 5;
  END IF;

  -- Energy level bonus
  IF metrics.energy_level >= 8 THEN
    bonus_score := bonus_score + 15;
  ELSIF metrics.energy_level >= 6 THEN
    bonus_score := bonus_score + 10;
  ELSIF metrics.energy_level >= 4 THEN
    bonus_score := bonus_score + 5;
  END IF;

  -- Mood bonus
  IF metrics.mood >= 8 THEN
    bonus_score := bonus_score + 15;
  ELSIF metrics.mood >= 6 THEN
    bonus_score := bonus_score + 10;
  ELSIF metrics.mood >= 4 THEN
    bonus_score := bonus_score + 5;
  END IF;

  -- Stress level bonus (inverse)
  IF metrics.stress_level <= 2 THEN
    bonus_score := bonus_score + 15;
  ELSIF metrics.stress_level <= 4 THEN
    bonus_score := bonus_score + 10;
  ELSIF metrics.stress_level <= 6 THEN
    bonus_score := bonus_score + 5;
  END IF;

  -- Water intake bonus
  IF metrics.water_intake >= 2500 THEN
    bonus_score := bonus_score + 10;
  ELSIF metrics.water_intake >= 2000 THEN
    bonus_score := bonus_score + 5;
  END IF;

  -- Steps bonus
  IF metrics.steps >= 12000 THEN
    bonus_score := bonus_score + 10;
  ELSIF metrics.steps >= 8000 THEN
    bonus_score := bonus_score + 5;
  END IF;

  -- Sleep hours bonus
  IF metrics.sleep_hours >= 8 AND metrics.sleep_hours <= 9 THEN
    bonus_score := bonus_score + 10;
  ELSIF metrics.sleep_hours >= 7 AND metrics.sleep_hours <= 10 THEN
    bonus_score := bonus_score + 5;
  END IF;

  -- Return capped score (0-100)
  RETURN LEAST(100, GREATEST(0, base_score + bonus_score));
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to get weekly health summary
CREATE OR REPLACE FUNCTION get_weekly_health_summary(
  p_user_id UUID,
  p_week_start DATE
)
RETURNS TABLE (
  week_start DATE,
  week_end DATE,
  avg_weight DECIMAL(5,2),
  avg_body_fat DECIMAL(4,2),
  avg_muscle_mass DECIMAL(5,2),
  avg_sleep_hours DECIMAL(3,1),
  avg_sleep_quality DECIMAL(3,1),
  avg_energy_level DECIMAL(3,1),
  avg_mood DECIMAL(3,1),
  avg_stress_level DECIMAL(3,1),
  avg_water_intake DECIMAL(6,1),
  avg_steps DECIMAL(8,1),
  total_calories_burned INTEGER,
  health_score INTEGER
) AS $$
DECLARE
  week_end_date DATE;
BEGIN
  week_end_date := p_week_start + INTERVAL '6 days';
  
  RETURN QUERY
  SELECT 
    p_week_start,
    week_end_date,
    AVG(hm.weight)::DECIMAL(5,2),
    AVG(hm.body_fat)::DECIMAL(4,2),
    AVG(hm.muscle_mass)::DECIMAL(5,2),
    AVG(hm.sleep_hours)::DECIMAL(3,1),
    AVG(hm.sleep_quality)::DECIMAL(3,1),
    AVG(hm.energy_level)::DECIMAL(3,1),
    AVG(hm.mood)::DECIMAL(3,1),
    AVG(hm.stress_level)::DECIMAL(3,1),
    AVG(hm.water_intake)::DECIMAL(6,1),
    AVG(hm.steps)::DECIMAL(8,1),
    SUM(hm.calories_burned)::INTEGER,
    calculate_health_score_from_metrics(p_user_id, week_end_date)
  FROM health_metrics hm
  WHERE hm.user_id = p_user_id
  AND hm.date >= p_week_start
  AND hm.date <= week_end_date;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
