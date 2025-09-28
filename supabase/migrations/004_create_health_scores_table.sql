-- Create health_scores table
-- This table stores calculated health scores and assessments

CREATE TABLE IF NOT EXISTS health_scores (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    
    -- Score metadata
    score_type TEXT NOT NULL CHECK (score_type IN (
        'overall', 'cardiovascular', 'mental', 'fitness', 'sleep', 
        'nutrition', 'stress', 'energy', 'mood', 'pain', 'custom'
    )),
    score DECIMAL(5,2) NOT NULL CHECK (score >= 0 AND score <= 100),
    
    -- Score details
    calculation_date DATE NOT NULL,
    calculation_method TEXT,
    factors_considered TEXT[],
    
    -- Score breakdown (for composite scores)
    sub_scores JSONB DEFAULT '{}',
    
    -- Trend information
    previous_score DECIMAL(5,2),
    score_change DECIMAL(5,2),
    trend_direction TEXT CHECK (trend_direction IN ('improving', 'stable', 'declining')),
    
    -- Recommendations
    recommendations TEXT[],
    priority_level TEXT CHECK (priority_level IN ('low', 'medium', 'high', 'urgent')),
    
    -- System fields
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_health_scores_user_id ON health_scores(user_id);
CREATE INDEX IF NOT EXISTS idx_health_scores_score_type ON health_scores(score_type);
CREATE INDEX IF NOT EXISTS idx_health_scores_calculation_date ON health_scores(calculation_date);
CREATE INDEX IF NOT EXISTS idx_health_scores_user_type_date ON health_scores(user_id, score_type, calculation_date);
CREATE INDEX IF NOT EXISTS idx_health_scores_score ON health_scores(score);

-- Create GIN index for JSONB sub_scores column
CREATE INDEX IF NOT EXISTS idx_health_scores_sub_scores_gin ON health_scores USING GIN (sub_scores);

-- Create updated_at trigger
CREATE TRIGGER update_health_scores_updated_at
    BEFORE UPDATE ON health_scores
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security
ALTER TABLE health_scores ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view their own health scores" ON health_scores
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own health scores" ON health_scores
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own health scores" ON health_scores
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own health scores" ON health_scores
    FOR DELETE USING (auth.uid() = user_id);

-- Add comments for documentation
COMMENT ON TABLE health_scores IS 'Calculated health scores and assessments';
COMMENT ON COLUMN health_scores.user_id IS 'References auth.users.id - the authenticated user ID';
COMMENT ON COLUMN health_scores.score_type IS 'Type of health score being calculated';
COMMENT ON COLUMN health_scores.score IS 'Health score value (0-100)';
COMMENT ON COLUMN health_scores.calculation_date IS 'Date when score was calculated';
COMMENT ON COLUMN health_scores.sub_scores IS 'JSON object containing breakdown of composite scores';
COMMENT ON COLUMN health_scores.trend_direction IS 'Direction of score change over time';
COMMENT ON COLUMN health_scores.recommendations IS 'Array of recommendations based on the score';
