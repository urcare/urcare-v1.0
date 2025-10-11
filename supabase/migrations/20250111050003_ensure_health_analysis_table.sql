-- Ensure health_analysis table exists with correct structure
-- This matches the structure expected by the healthScoreService

CREATE TABLE IF NOT EXISTS health_analysis (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    health_score INTEGER NOT NULL CHECK (health_score >= 0 AND health_score <= 100),
    analysis_text TEXT,
    display_analysis JSONB DEFAULT '{}',
    detailed_analysis JSONB DEFAULT '{}',
    profile_analysis JSONB DEFAULT '{}',
    recommendations TEXT[] DEFAULT '{}',
    user_input TEXT,
    uploaded_files TEXT[],
    voice_transcript TEXT,
    ai_provider VARCHAR(50),
    ai_model VARCHAR(100),
    calculation_method VARCHAR(50) DEFAULT 'ai_optimized',
    factors_considered JSONB DEFAULT '{}',
    is_latest BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes if they don't exist
CREATE INDEX IF NOT EXISTS idx_health_analysis_user_id ON health_analysis(user_id);
CREATE INDEX IF NOT EXISTS idx_health_analysis_is_latest ON health_analysis(is_latest);
CREATE INDEX IF NOT EXISTS idx_health_analysis_created_at ON health_analysis(created_at);

-- Enable RLS if not already enabled
ALTER TABLE health_analysis ENABLE ROW LEVEL SECURITY;

-- Create RLS policies if they don't exist
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'health_analysis' AND policyname = 'Users can view their own health analysis') THEN
        CREATE POLICY "Users can view their own health analysis" ON health_analysis
            FOR SELECT USING (auth.uid() = user_id);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'health_analysis' AND policyname = 'Users can insert their own health analysis') THEN
        CREATE POLICY "Users can insert their own health analysis" ON health_analysis
            FOR INSERT WITH CHECK (auth.uid() = user_id);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'health_analysis' AND policyname = 'Users can update their own health analysis') THEN
        CREATE POLICY "Users can update their own health analysis" ON health_analysis
            FOR UPDATE USING (auth.uid() = user_id);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'health_analysis' AND policyname = 'Users can delete their own health analysis') THEN
        CREATE POLICY "Users can delete their own health analysis" ON health_analysis
            FOR DELETE USING (auth.uid() = user_id);
    END IF;
END $$;

-- Grant permissions
GRANT SELECT, INSERT, UPDATE, DELETE ON health_analysis TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON health_analysis TO service_role;
