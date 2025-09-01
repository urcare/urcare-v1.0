-- Create health_plans table to store generated health plans
CREATE TABLE IF NOT EXISTS health_plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  plan_data JSONB NOT NULL,
  status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'archived', 'draft')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_health_plans_user_id ON health_plans(user_id);
CREATE INDEX IF NOT EXISTS idx_health_plans_status ON health_plans(status);
CREATE INDEX IF NOT EXISTS idx_health_plans_created_at ON health_plans(created_at);

-- Enable RLS
ALTER TABLE health_plans ENABLE ROW LEVEL SECURITY;

-- RLS Policies for health_plans (users can only see their own plans)
CREATE POLICY "health_plans_select_policy" ON health_plans
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "health_plans_insert_policy" ON health_plans
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "health_plans_update_policy" ON health_plans
  FOR UPDATE USING (auth.uid() = user_id);

-- Create trigger for updated_at
CREATE TRIGGER update_health_plans_updated_at 
  BEFORE UPDATE ON health_plans 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
