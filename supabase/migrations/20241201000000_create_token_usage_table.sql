-- Create token_usage table for tracking AI API usage
CREATE TABLE IF NOT EXISTS token_usage (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  total_tokens INTEGER NOT NULL DEFAULT 0,
  prompt_tokens INTEGER NOT NULL DEFAULT 0,
  completion_tokens INTEGER NOT NULL DEFAULT 0,
  estimated_cost DECIMAL(10, 6) NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Ensure one record per user per day
  UNIQUE(user_id, date)
);

-- Create index for efficient queries
CREATE INDEX IF NOT EXISTS idx_token_usage_user_date ON token_usage(user_id, date);
CREATE INDEX IF NOT EXISTS idx_token_usage_date ON token_usage(date);

-- Enable RLS
ALTER TABLE token_usage ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view their own token usage" ON token_usage
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own token usage" ON token_usage
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own token usage" ON token_usage
  FOR UPDATE USING (auth.uid() = user_id);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for updated_at
CREATE TRIGGER update_token_usage_updated_at
  BEFORE UPDATE ON token_usage
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
