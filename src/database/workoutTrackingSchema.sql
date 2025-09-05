-- Workout Tracking Database Schema
-- This schema supports AI-generated workout plans, exercise tracking, and muscle impact visualization

-- User fitness profiles table
CREATE TABLE IF NOT EXISTS user_fitness_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    age INTEGER NOT NULL,
    weight DECIMAL(5,2) NOT NULL, -- in kg
    height DECIMAL(5,2) NOT NULL, -- in cm
    gender VARCHAR(10) NOT NULL CHECK (gender IN ('male', 'female', 'other')),
    fitness_level VARCHAR(20) NOT NULL CHECK (fitness_level IN ('Beginner', 'Intermediate', 'Advanced')),
    goals TEXT[] NOT NULL, -- Array of fitness goals
    available_equipment TEXT[] NOT NULL, -- Array of available equipment
    time_per_session INTEGER NOT NULL, -- in minutes
    days_per_week INTEGER NOT NULL CHECK (days_per_week BETWEEN 1 AND 7),
    injuries TEXT[], -- Array of injuries/limitations
    preferences TEXT[], -- Array of user preferences
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id)
);

-- Workout plans table
CREATE TABLE IF NOT EXISTS workout_plans (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    duration VARCHAR(50) NOT NULL, -- e.g., "45 minutes"
    difficulty VARCHAR(20) NOT NULL CHECK (difficulty IN ('Beginner', 'Intermediate', 'Advanced')),
    frequency VARCHAR(50) NOT NULL, -- e.g., "3x per week"
    goals TEXT[] NOT NULL,
    exercises JSONB NOT NULL, -- Array of exercise objects
    total_duration INTEGER NOT NULL, -- in minutes
    calories_burned INTEGER NOT NULL,
    is_custom BOOLEAN DEFAULT FALSE,
    ai_generated BOOLEAN DEFAULT FALSE,
    user_preferences JSONB, -- User preferences used for generation
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Exercise database table
CREATE TABLE IF NOT EXISTS exercise_database (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    instructions TEXT[] NOT NULL,
    sets INTEGER NOT NULL,
    reps VARCHAR(50) NOT NULL, -- e.g., "8-12" or "30-60 seconds"
    duration VARCHAR(50), -- for time-based exercises
    rest_time VARCHAR(50) NOT NULL,
    difficulty VARCHAR(20) NOT NULL CHECK (difficulty IN ('Beginner', 'Intermediate', 'Advanced')),
    equipment TEXT[] NOT NULL,
    muscle_groups TEXT[] NOT NULL,
    muscle_impact JSONB NOT NULL, -- Primary, secondary muscles and intensity
    image_url TEXT,
    video_url TEXT,
    tips TEXT[],
    variations TEXT[],
    category VARCHAR(20) NOT NULL CHECK (category IN ('strength', 'cardio', 'flexibility', 'balance', 'sports')),
    verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Workout sessions table
CREATE TABLE IF NOT EXISTS workout_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    workout_plan_id UUID REFERENCES workout_plans(id) ON DELETE SET NULL,
    session_name VARCHAR(255),
    start_time TIMESTAMP WITH TIME ZONE NOT NULL,
    end_time TIMESTAMP WITH TIME ZONE,
    duration INTEGER, -- in minutes
    calories_burned INTEGER,
    exercises_completed JSONB, -- Array of completed exercises with details
    notes TEXT,
    rating INTEGER CHECK (rating BETWEEN 1 AND 5),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Exercise performance tracking
CREATE TABLE IF NOT EXISTS exercise_performance (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    workout_session_id UUID REFERENCES workout_sessions(id) ON DELETE CASCADE,
    exercise_id VARCHAR(255) NOT NULL, -- Reference to exercise database
    exercise_name VARCHAR(255) NOT NULL,
    sets_completed INTEGER NOT NULL,
    reps_completed TEXT, -- e.g., "8,10,12" for each set
    weight_used DECIMAL(5,2), -- in kg
    duration_seconds INTEGER, -- for time-based exercises
    rest_time_seconds INTEGER,
    difficulty_rating INTEGER CHECK (difficulty_rating BETWEEN 1 AND 10),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Muscle group tracking for analytics
CREATE TABLE IF NOT EXISTS muscle_group_tracking (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    workout_session_id UUID REFERENCES workout_sessions(id) ON DELETE CASCADE,
    muscle_group VARCHAR(50) NOT NULL,
    total_volume INTEGER, -- Total reps * weight
    total_sets INTEGER,
    total_time_seconds INTEGER,
    intensity_rating INTEGER CHECK (intensity_rating BETWEEN 1 AND 10),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Workout plan favorites
CREATE TABLE IF NOT EXISTS workout_plan_favorites (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    workout_plan_id UUID REFERENCES workout_plans(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, workout_plan_id)
);

-- Exercise favorites
CREATE TABLE IF NOT EXISTS exercise_favorites (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    exercise_id VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, exercise_id)
);

-- Indexes for better performance
CREATE INDEX IF NOT EXISTS idx_workout_plans_user_id ON workout_plans(user_id);
CREATE INDEX IF NOT EXISTS idx_workout_plans_ai_generated ON workout_plans(ai_generated);
CREATE INDEX IF NOT EXISTS idx_workout_sessions_user_id ON workout_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_workout_sessions_date ON workout_sessions(start_time);
CREATE INDEX IF NOT EXISTS idx_exercise_performance_user_id ON exercise_performance(user_id);
CREATE INDEX IF NOT EXISTS idx_exercise_performance_session_id ON exercise_performance(workout_session_id);
CREATE INDEX IF NOT EXISTS idx_muscle_group_tracking_user_id ON muscle_group_tracking(user_id);
CREATE INDEX IF NOT EXISTS idx_exercise_database_category ON exercise_database(category);
CREATE INDEX IF NOT EXISTS idx_exercise_database_difficulty ON exercise_database(difficulty);
CREATE INDEX IF NOT EXISTS idx_exercise_database_muscle_groups ON exercise_database USING GIN(muscle_groups);

-- Row Level Security (RLS) policies
ALTER TABLE user_fitness_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE workout_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE workout_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE exercise_performance ENABLE ROW LEVEL SECURITY;
ALTER TABLE muscle_group_tracking ENABLE ROW LEVEL SECURITY;
ALTER TABLE workout_plan_favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE exercise_favorites ENABLE ROW LEVEL SECURITY;

-- RLS Policies for user_fitness_profiles
CREATE POLICY "Users can view own fitness profile" ON user_fitness_profiles
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own fitness profile" ON user_fitness_profiles
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own fitness profile" ON user_fitness_profiles
    FOR UPDATE USING (auth.uid() = user_id);

-- RLS Policies for workout_plans
CREATE POLICY "Users can view own workout plans" ON workout_plans
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own workout plans" ON workout_plans
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own workout plans" ON workout_plans
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own workout plans" ON workout_plans
    FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for workout_sessions
CREATE POLICY "Users can view own workout sessions" ON workout_sessions
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own workout sessions" ON workout_sessions
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own workout sessions" ON workout_sessions
    FOR UPDATE USING (auth.uid() = user_id);

-- RLS Policies for exercise_performance
CREATE POLICY "Users can view own exercise performance" ON exercise_performance
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own exercise performance" ON exercise_performance
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own exercise performance" ON exercise_performance
    FOR UPDATE USING (auth.uid() = user_id);

-- RLS Policies for muscle_group_tracking
CREATE POLICY "Users can view own muscle group tracking" ON muscle_group_tracking
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own muscle group tracking" ON muscle_group_tracking
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- RLS Policies for favorites
CREATE POLICY "Users can view own favorites" ON workout_plan_favorites
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own favorites" ON workout_plan_favorites
    FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view own exercise favorites" ON exercise_favorites
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own exercise favorites" ON exercise_favorites
    FOR ALL USING (auth.uid() = user_id);

-- Exercise database is public read-only
CREATE POLICY "Anyone can view exercise database" ON exercise_database
    FOR SELECT USING (true);

-- Functions for updating timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers for updating timestamps
CREATE TRIGGER update_user_fitness_profiles_updated_at 
    BEFORE UPDATE ON user_fitness_profiles 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_workout_plans_updated_at 
    BEFORE UPDATE ON workout_plans 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_exercise_database_updated_at 
    BEFORE UPDATE ON exercise_database 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Sample data for exercise database
INSERT INTO exercise_database (name, description, instructions, sets, reps, rest_time, difficulty, equipment, muscle_groups, muscle_impact, image_url, tips, category) VALUES
('Push-ups', 'Classic bodyweight exercise for chest, shoulders, and triceps', 
 ARRAY['Start in a plank position with hands slightly wider than shoulders', 'Lower your body until chest nearly touches the floor', 'Push back up to starting position', 'Keep core tight throughout the movement'],
 3, '8-12', '60 seconds', 'Beginner', ARRAY['Bodyweight'], ARRAY['Chest', 'Shoulders', 'Triceps'],
 '{"primary": ["Chest", "Triceps"], "secondary": ["Shoulders", "Core"], "intensity": {"Chest": 9, "Triceps": 8, "Shoulders": 6, "Core": 5}}',
 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop',
 ARRAY['Keep your body in a straight line', 'Don''t let your hips sag or pike up', 'Breathe out as you push up'],
 'strength'),

('Squats', 'Fundamental lower body exercise targeting legs and glutes',
 ARRAY['Stand with feet shoulder-width apart', 'Lower your body as if sitting back into a chair', 'Keep knees behind toes and chest up', 'Return to starting position'],
 3, '12-15', '90 seconds', 'Beginner', ARRAY['Bodyweight'], ARRAY['Legs', 'Glutes'],
 '{"primary": ["Legs", "Glutes"], "secondary": ["Core"], "intensity": {"Legs": 9, "Glutes": 8, "Core": 4}}',
 'https://images.unsplash.com/photo-1534258936925-c58bed479fcb?w=400&h=300&fit=crop',
 ARRAY['Keep weight on your heels', 'Don''t let knees cave inward', 'Go as low as comfortable'],
 'strength'),

('Plank', 'Isometric core strengthening exercise',
 ARRAY['Start in a push-up position', 'Lower to forearms, keeping body straight', 'Hold position while engaging core', 'Breathe normally throughout'],
 3, '30-60 seconds', '60 seconds', 'Beginner', ARRAY['Bodyweight'], ARRAY['Core', 'Shoulders'],
 '{"primary": ["Core"], "secondary": ["Shoulders", "Back"], "intensity": {"Core": 9, "Shoulders": 6, "Back": 4}}',
 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400&h=300&fit=crop',
 ARRAY['Keep hips level with shoulders', 'Engage your core muscles', 'Don''t hold your breath'],
 'strength');

