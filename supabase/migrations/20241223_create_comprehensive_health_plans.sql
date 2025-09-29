-- Create comprehensive_health_plans table if it doesn't exist
CREATE TABLE IF NOT EXISTS comprehensive_health_plans (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  plan_data JSONB NOT NULL,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'completed', 'paused')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_comprehensive_health_plans_user_id ON comprehensive_health_plans(user_id);
CREATE INDEX IF NOT EXISTS idx_comprehensive_health_plans_status ON comprehensive_health_plans(status);
CREATE INDEX IF NOT EXISTS idx_comprehensive_health_plans_created_at ON comprehensive_health_plans(created_at);

-- Enable RLS (Row Level Security)
ALTER TABLE comprehensive_health_plans ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view their own comprehensive health plans" ON comprehensive_health_plans
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own comprehensive health plans" ON comprehensive_health_plans
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own comprehensive health plans" ON comprehensive_health_plans
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own comprehensive health plans" ON comprehensive_health_plans
  FOR DELETE USING (auth.uid() = user_id);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_comprehensive_health_plans_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for updated_at
CREATE TRIGGER update_comprehensive_health_plans_updated_at
  BEFORE UPDATE ON comprehensive_health_plans
  FOR EACH ROW
  EXECUTE FUNCTION update_comprehensive_health_plans_updated_at();

