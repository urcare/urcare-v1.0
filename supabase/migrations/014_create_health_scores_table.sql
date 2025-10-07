-- Create health_scores table for storing health analysis results

CREATE TABLE IF NOT EXISTS health_scores (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    score_type TEXT NOT NULL DEFAULT 'overall',
    score DECIMAL(5,2) NOT NULL CHECK (score >= 0 AND score <= 100),
    calculation_date DATE NOT NULL DEFAULT CURRENT_DATE,
    sub_scores JSONB,
    recommendations TEXT[],
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_health_scores_user_id ON health_scores(user_id);
CREATE INDEX IF NOT EXISTS idx_health_scores_calculation_date ON health_scores(calculation_date);
CREATE INDEX IF NOT EXISTS idx_health_scores_score_type ON health_scores(score_type);

-- Enable Row Level Security
ALTER TABLE health_scores ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for health_scores
CREATE POLICY "Users can view their own health scores" ON health_scores
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own health scores" ON health_scores
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own health scores" ON health_scores
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own health scores" ON health_scores
    FOR DELETE USING (auth.uid() = user_id);

-- Create trigger for updated_at
CREATE TRIGGER update_health_scores_updated_at 
    BEFORE UPDATE ON health_scores 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

