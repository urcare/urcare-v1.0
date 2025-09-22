-- Enhanced token usage tracking table
CREATE TABLE IF NOT EXISTS token_usage_detailed (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    function_name TEXT NOT NULL,
    model_used TEXT NOT NULL,
    prompt_tokens INTEGER NOT NULL,
    completion_tokens INTEGER NOT NULL,
    total_tokens INTEGER NOT NULL,
    cost_usd DECIMAL(10,6) NOT NULL,
    request_type TEXT NOT NULL, -- 'generation', 'cache_hit', 'fallback'
    user_goal TEXT,
    complexity_score INTEGER,
    cached BOOLEAN DEFAULT FALSE,
    response_time_ms INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Plan caching table
CREATE TABLE IF NOT EXISTS cached_health_plans (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    profile_hash TEXT NOT NULL,
    plan_data JSONB NOT NULL,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    hit_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    expires_at TIMESTAMP WITH TIME ZONE DEFAULT (NOW() + INTERVAL '24 hours')
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_token_usage_user_date ON token_usage_detailed(user_id, created_at);
CREATE INDEX IF NOT EXISTS idx_token_usage_function ON token_usage_detailed(function_name);
CREATE INDEX IF NOT EXISTS idx_cached_plans_hash ON cached_health_plans(profile_hash);
CREATE INDEX IF NOT EXISTS idx_cached_plans_expires ON cached_health_plans(expires_at);

-- User monthly usage summary view
CREATE OR REPLACE VIEW user_monthly_usage AS
SELECT 
    user_id,
    DATE_TRUNC('month', created_at) as month,
    COUNT(*) as total_requests,
    SUM(total_tokens) as total_tokens,
    SUM(cost_usd) as total_cost,
    AVG(complexity_score) as avg_complexity,
    SUM(CASE WHEN cached THEN 1 ELSE 0 END) as cache_hits,
    SUM(CASE WHEN model_used = 'gpt-4o' THEN 1 ELSE 0 END) as gpt4_requests,
    SUM(CASE WHEN model_used = 'gpt-3.5-turbo' THEN 1 ELSE 0 END) as gpt35_requests
FROM token_usage_detailed 
GROUP BY user_id, DATE_TRUNC('month', created_at);

-- Cleanup function for expired cache
CREATE OR REPLACE FUNCTION cleanup_expired_cache() 
RETURNS void AS $$
BEGIN
    DELETE FROM cached_health_plans WHERE expires_at < NOW();
END;
$$ LANGUAGE plpgsql;
