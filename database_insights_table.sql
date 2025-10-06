-- Create health_insights table to store AI-generated health insights
CREATE TABLE IF NOT EXISTS health_insights (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  health_score INTEGER NOT NULL,
  analysis TEXT NOT NULL,
  recommendations TEXT[] NOT NULL,
  generated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_health_insights_user_id ON health_insights(user_id);
CREATE INDEX IF NOT EXISTS idx_health_insights_generated_at ON health_insights(generated_at);

-- Enable RLS (Row Level Security)
ALTER TABLE health_insights ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view their own insights" ON health_insights
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own insights" ON health_insights
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own insights" ON health_insights
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own insights" ON health_insights
  FOR DELETE USING (auth.uid() = user_id);
