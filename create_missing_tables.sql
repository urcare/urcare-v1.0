-- Run this script in your Supabase SQL Editor to create the missing tables

-- Enable UUID extension for PostgreSQL (if not already enabled)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Daily nutrition tracking table
CREATE TABLE IF NOT EXISTS daily_nutrition (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
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
    
    -- Ensure one record per user per day
    UNIQUE(user_id, date)
);

-- Daily fitness statistics table
CREATE TABLE IF NOT EXISTS daily_fitness_stats (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    total_steps INTEGER DEFAULT 0,
    total_distance DECIMAL(10,2) DEFAULT 0.0, -- in meters
    total_calories DECIMAL(8,2) DEFAULT 0.0,
    average_pace DECIMAL(8,2) DEFAULT 0.0, -- in m/s
    active_time INTEGER DEFAULT 0, -- in seconds
    gps_route JSONB, -- GPS coordinates array
    step_history JSONB, -- Step data history
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Ensure one record per user per day
    UNIQUE(user_id, date)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_daily_nutrition_user_date ON daily_nutrition(user_id, date);
CREATE INDEX IF NOT EXISTS idx_daily_fitness_stats_user_date ON daily_fitness_stats(user_id, date);

-- Enable Row Level Security (RLS) on tables
ALTER TABLE daily_nutrition ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_fitness_stats ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for daily_nutrition
CREATE POLICY "Users can view their own daily nutrition" ON daily_nutrition
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own daily nutrition" ON daily_nutrition
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own daily nutrition" ON daily_nutrition
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own daily nutrition" ON daily_nutrition
    FOR DELETE USING (auth.uid() = user_id);

-- Create RLS policies for daily_fitness_stats
CREATE POLICY "Users can view their own daily fitness stats" ON daily_fitness_stats
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own daily fitness stats" ON daily_fitness_stats
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own daily fitness stats" ON daily_fitness_stats
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own daily fitness stats" ON daily_fitness_stats
    FOR DELETE USING (auth.uid() = user_id);

-- Insert sample data for testing (optional - remove if not needed)
INSERT INTO daily_nutrition (user_id, date, total_calories, protein, carbs, fat)
SELECT 
    auth.uid(),
    CURRENT_DATE,
    1280,
    88,
    120,
    32
WHERE auth.uid() IS NOT NULL
ON CONFLICT (user_id, date) DO NOTHING;

INSERT INTO daily_fitness_stats (user_id, date, total_steps, total_distance, total_calories, active_time)
SELECT 
    auth.uid(),
    CURRENT_DATE,
    8500,
    6.2,
    420,
    3600
WHERE auth.uid() IS NOT NULL
ON CONFLICT (user_id, date) DO NOTHING;
