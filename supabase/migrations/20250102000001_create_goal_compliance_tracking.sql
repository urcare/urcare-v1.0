-- Create goal compliance tracking table
CREATE TABLE IF NOT EXISTS goal_compliance_tracking (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    plan_id UUID NOT NULL REFERENCES two_day_health_plans(id) ON DELETE CASCADE,
    goal_id UUID REFERENCES user_health_goals(id) ON DELETE CASCADE,
    activity_id VARCHAR(100) NOT NULL,
    day_number INTEGER NOT NULL CHECK (day_number IN (1, 2)),
    compliance_status VARCHAR(20) NOT NULL CHECK (compliance_status IN ('completed', 'skipped', 'modified', 'partial')),
    notes TEXT,
    impact_on_goals JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create goal progress history table
CREATE TABLE IF NOT EXISTS goal_progress_history (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    goal_id UUID NOT NULL REFERENCES user_health_goals(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    current_value DECIMAL(10,2),
    progress_percentage DECIMAL(5,2) NOT NULL,
    compliance_rate DECIMAL(5,2) DEFAULT 0,
    timeline_adjustment_days INTEGER DEFAULT 0,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(goal_id, date)
);

-- Create adaptive plan adjustments table
CREATE TABLE IF NOT EXISTS adaptive_plan_adjustments (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    goal_id UUID NOT NULL REFERENCES user_health_goals(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    adjustment_type VARCHAR(50) NOT NULL, -- 'timeline', 'intensity', 'focus'
    adjustment_value DECIMAL(5,2) NOT NULL, -- multiplier or percentage
    reason TEXT NOT NULL,
    compliance_data JSONB DEFAULT '{}',
    applied_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    expires_at TIMESTAMP WITH TIME ZONE,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create goal milestones tracking table
CREATE TABLE IF NOT EXISTS goal_milestones_tracking (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    goal_id UUID NOT NULL REFERENCES user_health_goals(id) ON DELETE CASCADE,
    milestone_id VARCHAR(100) NOT NULL,
    milestone_title VARCHAR(255) NOT NULL,
    target_value DECIMAL(10,2) NOT NULL,
    target_date DATE NOT NULL,
    completed BOOLEAN DEFAULT false,
    completed_date DATE,
    actual_value DECIMAL(10,2),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(goal_id, milestone_id)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_goal_compliance_tracking_plan_id ON goal_compliance_tracking(plan_id);
CREATE INDEX IF NOT EXISTS idx_goal_compliance_tracking_goal_id ON goal_compliance_tracking(goal_id);
CREATE INDEX IF NOT EXISTS idx_goal_compliance_tracking_date ON goal_compliance_tracking(created_at);

CREATE INDEX IF NOT EXISTS idx_goal_progress_history_goal_id ON goal_progress_history(goal_id);
CREATE INDEX IF NOT EXISTS idx_goal_progress_history_user_id ON goal_progress_history(user_id);
CREATE INDEX IF NOT EXISTS idx_goal_progress_history_date ON goal_progress_history(date);

CREATE INDEX IF NOT EXISTS idx_adaptive_plan_adjustments_goal_id ON adaptive_plan_adjustments(goal_id);
CREATE INDEX IF NOT EXISTS idx_adaptive_plan_adjustments_user_id ON adaptive_plan_adjustments(user_id);
CREATE INDEX IF NOT EXISTS idx_adaptive_plan_adjustments_active ON adaptive_plan_adjustments(is_active);

CREATE INDEX IF NOT EXISTS idx_goal_milestones_tracking_goal_id ON goal_milestones_tracking(goal_id);
CREATE INDEX IF NOT EXISTS idx_goal_milestones_tracking_completed ON goal_milestones_tracking(completed);

-- Create triggers for updated_at timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_goal_compliance_tracking_updated_at 
    BEFORE UPDATE ON goal_compliance_tracking 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_goal_milestones_tracking_updated_at 
    BEFORE UPDATE ON goal_milestones_tracking 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Create function to calculate goal progress impact
CREATE OR REPLACE FUNCTION calculate_goal_progress_impact()
RETURNS TRIGGER AS $$
DECLARE
    goal_record RECORD;
    progress_change DECIMAL(5,2);
BEGIN
    -- Get the goal record
    SELECT * INTO goal_record 
    FROM user_health_goals 
    WHERE id = NEW.goal_id;
    
    IF NOT FOUND THEN
        RETURN NEW;
    END IF;
    
    -- Calculate progress change based on compliance status
    CASE NEW.compliance_status
        WHEN 'completed' THEN
            progress_change := 0.5; -- 0.5% progress for completed activity
        WHEN 'partial' THEN
            progress_change := 0.25; -- 0.25% progress for partial completion
        WHEN 'skipped' THEN
            progress_change := -0.1; -- -0.1% progress for skipped activity
        WHEN 'modified' THEN
            progress_change := 0.35; -- 0.35% progress for modified activity
        ELSE
            progress_change := 0;
    END CASE;
    
    -- Update goal progress
    UPDATE user_health_goals 
    SET 
        progress_percentage = GREATEST(0, LEAST(100, progress_percentage + progress_change)),
        updated_at = NOW()
    WHERE id = NEW.goal_id;
    
    -- Record progress history
    INSERT INTO goal_progress_history (
        goal_id, 
        user_id, 
        date, 
        current_value, 
        progress_percentage,
        compliance_rate
    ) VALUES (
        NEW.goal_id,
        goal_record.user_id,
        CURRENT_DATE,
        goal_record.current_value,
        goal_record.progress_percentage + progress_change,
        CASE 
            WHEN NEW.compliance_status = 'completed' THEN 100
            WHEN NEW.compliance_status = 'partial' THEN 50
            WHEN NEW.compliance_status = 'modified' THEN 70
            ELSE 0
        END
    ) ON CONFLICT (goal_id, date) 
    DO UPDATE SET
        progress_percentage = EXCLUDED.progress_percentage,
        compliance_rate = EXCLUDED.compliance_rate;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update goal progress
CREATE TRIGGER trigger_calculate_goal_progress_impact
    AFTER INSERT ON goal_compliance_tracking
    FOR EACH ROW EXECUTE FUNCTION calculate_goal_progress_impact();

-- Enable Row Level Security
ALTER TABLE goal_compliance_tracking ENABLE ROW LEVEL SECURITY;
ALTER TABLE goal_progress_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE adaptive_plan_adjustments ENABLE ROW LEVEL SECURITY;
ALTER TABLE goal_milestones_tracking ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view their own compliance tracking" ON goal_compliance_tracking
    FOR SELECT USING (auth.uid() IN (
        SELECT user_id FROM two_day_health_plans WHERE id = plan_id
    ));

CREATE POLICY "Users can insert their own compliance tracking" ON goal_compliance_tracking
    FOR INSERT WITH CHECK (auth.uid() IN (
        SELECT user_id FROM two_day_health_plans WHERE id = plan_id
    ));

CREATE POLICY "Users can update their own compliance tracking" ON goal_compliance_tracking
    FOR UPDATE USING (auth.uid() IN (
        SELECT user_id FROM two_day_health_plans WHERE id = plan_id
    ));

CREATE POLICY "Users can view their own progress history" ON goal_progress_history
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own progress history" ON goal_progress_history
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own adaptive adjustments" ON adaptive_plan_adjustments
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own adaptive adjustments" ON adaptive_plan_adjustments
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own milestone tracking" ON goal_milestones_tracking
    FOR SELECT USING (auth.uid() IN (
        SELECT user_id FROM user_health_goals WHERE id = goal_id
    ));

CREATE POLICY "Users can insert their own milestone tracking" ON goal_milestones_tracking
    FOR INSERT WITH CHECK (auth.uid() IN (
        SELECT user_id FROM user_health_goals WHERE id = goal_id
    ));

CREATE POLICY "Users can update their own milestone tracking" ON goal_milestones_tracking
    FOR UPDATE USING (auth.uid() IN (
        SELECT user_id FROM user_health_goals WHERE id = goal_id
    ));
