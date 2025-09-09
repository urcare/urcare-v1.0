-- Adaptive Health Goals System Database Schema
-- This schema supports goal-based planning with timeline calculations and adaptive adjustments

-- Enable UUID extension for PostgreSQL (if not already enabled)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- User health goals table
CREATE TABLE IF NOT EXISTS user_health_goals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    goal_type VARCHAR(50) NOT NULL CHECK (goal_type IN (
        'weight_loss', 'weight_gain', 'muscle_building', 'fitness', 
        'sleep_improvement', 'stress_reduction', 'smoking_cessation', 
        'alcohol_reduction', 'nutrition', 'custom'
    )),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    target_value DECIMAL(10,2), -- e.g., 10 kg, 5 km run time, 8 hours sleep
    current_value DECIMAL(10,2) DEFAULT 0,
    unit VARCHAR(50), -- kg, km, hours, cigarettes/day, etc.
    target_date DATE NOT NULL,
    start_date DATE DEFAULT CURRENT_DATE,
    timeline_preference VARCHAR(20) DEFAULT 'moderate' CHECK (timeline_preference IN ('gradual', 'moderate', 'aggressive')),
    calculated_timeline_weeks INTEGER, -- AI-calculated realistic timeline
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'paused', 'completed', 'cancelled')),
    priority INTEGER DEFAULT 1 CHECK (priority BETWEEN 1 AND 5),
    barriers TEXT[], -- Array of barriers like ['consistency', 'unhealthy_eating', 'busy_schedule']
    milestones JSONB DEFAULT '[]', -- Array of milestone objects
    progress_percentage DECIMAL(5,2) DEFAULT 0.0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Ensure one active goal per type per user
    UNIQUE(user_id, goal_type) DEFERRABLE INITIALLY DEFERRED
);

-- Goal compliance tracking table
CREATE TABLE IF NOT EXISTS goal_compliance_tracking (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    goal_id UUID NOT NULL REFERENCES user_health_goals(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    plan_id UUID REFERENCES two_day_health_plans(id) ON DELETE CASCADE,
    activity_id VARCHAR(100) NOT NULL,
    day_number INTEGER NOT NULL CHECK (day_number IN (1, 2)),
    activity_type VARCHAR(50) NOT NULL, -- 'workout', 'meal', 'sleep', 'hydration', etc.
    compliance_status VARCHAR(20) NOT NULL CHECK (compliance_status IN ('completed', 'skipped', 'modified', 'partial')),
    impact_score DECIMAL(3,2) DEFAULT 0.0, -- -1.0 to 1.0, how this affects goal progress
    notes TEXT,
    completed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Ensure one compliance entry per activity per day
    UNIQUE(goal_id, activity_id, day_number)
);

-- Goal progress history table
CREATE TABLE IF NOT EXISTS goal_progress_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    goal_id UUID NOT NULL REFERENCES user_health_goals(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    current_value DECIMAL(10,2),
    progress_percentage DECIMAL(5,2),
    compliance_rate DECIMAL(5,2), -- Percentage of activities completed
    timeline_adjustment_days INTEGER DEFAULT 0, -- How many days ahead/behind schedule
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Ensure one progress entry per goal per day
    UNIQUE(goal_id, date)
);

-- Adaptive plan adjustments table
CREATE TABLE IF NOT EXISTS adaptive_plan_adjustments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    goal_id UUID NOT NULL REFERENCES user_health_goals(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    plan_id UUID NOT NULL REFERENCES two_day_health_plans(id) ON DELETE CASCADE,
    adjustment_type VARCHAR(50) NOT NULL CHECK (adjustment_type IN (
        'timeline_extension', 'timeline_acceleration', 'intensity_increase', 
        'intensity_decrease', 'goal_modification', 'barrier_addressing'
    )),
    reason TEXT NOT NULL,
    old_timeline_weeks INTEGER,
    new_timeline_weeks INTEGER,
    compliance_threshold DECIMAL(5,2), -- Minimum compliance rate to maintain timeline
    applied_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_user_health_goals_user_id ON user_health_goals(user_id);
CREATE INDEX IF NOT EXISTS idx_user_health_goals_status ON user_health_goals(status);
CREATE INDEX IF NOT EXISTS idx_user_health_goals_target_date ON user_health_goals(target_date);
CREATE INDEX IF NOT EXISTS idx_goal_compliance_tracking_goal_id ON goal_compliance_tracking(goal_id);
CREATE INDEX IF NOT EXISTS idx_goal_compliance_tracking_user_id ON goal_compliance_tracking(user_id);
CREATE INDEX IF NOT EXISTS idx_goal_progress_history_goal_id ON goal_progress_history(goal_id);
CREATE INDEX IF NOT EXISTS idx_goal_progress_history_date ON goal_progress_history(date);
CREATE INDEX IF NOT EXISTS idx_adaptive_plan_adjustments_goal_id ON adaptive_plan_adjustments(goal_id);

-- Enable Row Level Security (RLS)
ALTER TABLE user_health_goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE goal_compliance_tracking ENABLE ROW LEVEL SECURITY;
ALTER TABLE goal_progress_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE adaptive_plan_adjustments ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for user_health_goals
CREATE POLICY "Users can view their own health goals" ON user_health_goals
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own health goals" ON user_health_goals
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own health goals" ON user_health_goals
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own health goals" ON user_health_goals
    FOR DELETE USING (auth.uid() = user_id);

-- Create RLS policies for goal_compliance_tracking
CREATE POLICY "Users can view their own compliance tracking" ON goal_compliance_tracking
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own compliance tracking" ON goal_compliance_tracking
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own compliance tracking" ON goal_compliance_tracking
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own compliance tracking" ON goal_compliance_tracking
    FOR DELETE USING (auth.uid() = user_id);

-- Create RLS policies for goal_progress_history
CREATE POLICY "Users can view their own progress history" ON goal_progress_history
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own progress history" ON goal_progress_history
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own progress history" ON goal_progress_history
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own progress history" ON goal_progress_history
    FOR DELETE USING (auth.uid() = user_id);

-- Create RLS policies for adaptive_plan_adjustments
CREATE POLICY "Users can view their own plan adjustments" ON adaptive_plan_adjustments
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own plan adjustments" ON adaptive_plan_adjustments
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own plan adjustments" ON adaptive_plan_adjustments
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own plan adjustments" ON adaptive_plan_adjustments
    FOR DELETE USING (auth.uid() = user_id);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_health_goals_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_user_health_goals_updated_at
    BEFORE UPDATE ON user_health_goals
    FOR EACH ROW
    EXECUTE FUNCTION update_health_goals_updated_at();

-- Create function to automatically calculate progress percentage
CREATE OR REPLACE FUNCTION calculate_goal_progress()
RETURNS TRIGGER AS $$
BEGIN
    -- Calculate progress percentage based on current vs target values
    IF NEW.target_value > 0 AND NEW.current_value >= 0 THEN
        -- For weight loss goals, progress is calculated differently
        IF NEW.goal_type = 'weight_loss' THEN
            -- For weight loss, we want current_value to be less than start value
            -- Progress = (start_value - current_value) / (start_value - target_value) * 100
            NEW.progress_percentage = LEAST(100.0, GREATEST(0.0, 
                ((NEW.current_value - NEW.target_value) / (NEW.current_value - NEW.target_value + 0.001)) * 100
            ));
        ELSE
            -- For other goals, progress = current_value / target_value * 100
            NEW.progress_percentage = LEAST(100.0, GREATEST(0.0, 
                (NEW.current_value / NEW.target_value) * 100
            ));
        END IF;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically calculate progress
CREATE TRIGGER calculate_user_health_goals_progress
    BEFORE INSERT OR UPDATE ON user_health_goals
    FOR EACH ROW
    EXECUTE FUNCTION calculate_goal_progress();
