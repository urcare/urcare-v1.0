-- Create unified health analysis table
-- Merges: health_analysis, health_insights, user_health_scores

CREATE TABLE IF NOT EXISTS health_analysis_unified (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    
    -- Health score and analysis data
    health_score INTEGER NOT NULL,
    display_analysis JSONB NOT NULL,
    detailed_analysis JSONB NOT NULL,
    analysis TEXT NOT NULL,
    recommendations TEXT[] NOT NULL DEFAULT '{}',
    
    -- User input and files
    user_input TEXT,
    uploaded_files TEXT[],
    voice_transcript TEXT,
    
    -- AI generation metadata
    ai_provider TEXT NOT NULL,
    ai_model TEXT NOT NULL,
    generation_parameters JSONB,
    
    -- Analysis metadata
    calculation_method TEXT,
    factors_considered TEXT[],
    analysis_date DATE NOT NULL DEFAULT CURRENT_DATE,
    is_latest BOOLEAN DEFAULT true,
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_health_analysis_unified_user_id ON health_analysis_unified(user_id);
CREATE INDEX IF NOT EXISTS idx_health_analysis_unified_analysis_date ON health_analysis_unified(analysis_date);
CREATE INDEX IF NOT EXISTS idx_health_analysis_unified_is_latest ON health_analysis_unified(is_latest);
CREATE INDEX IF NOT EXISTS idx_health_analysis_unified_ai_provider ON health_analysis_unified(ai_provider);

-- Enable Row Level Security
ALTER TABLE health_analysis_unified ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view their own health analysis" ON health_analysis_unified
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own health analysis" ON health_analysis_unified
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own health analysis" ON health_analysis_unified
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own health analysis" ON health_analysis_unified
    FOR DELETE USING (auth.uid() = user_id);

-- Create function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_health_analysis_unified_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for updated_at
CREATE TRIGGER trigger_update_health_analysis_unified_updated_at
    BEFORE UPDATE ON health_analysis_unified
    FOR EACH ROW
    EXECUTE FUNCTION update_health_analysis_unified_updated_at();

-- Create function to ensure only one latest analysis per user
CREATE OR REPLACE FUNCTION ensure_single_latest_health_analysis()
RETURNS TRIGGER AS $$
BEGIN
    -- If this is being set as latest, unset all others for this user
    IF NEW.is_latest = true THEN
        UPDATE health_analysis_unified 
        SET is_latest = false 
        WHERE user_id = NEW.user_id 
        AND id != NEW.id;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to ensure single latest analysis
CREATE TRIGGER trigger_ensure_single_latest_health_analysis
    BEFORE INSERT OR UPDATE ON health_analysis_unified
    FOR EACH ROW
    EXECUTE FUNCTION ensure_single_latest_health_analysis();
