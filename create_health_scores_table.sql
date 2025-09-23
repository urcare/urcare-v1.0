-- Create health_scores table
CREATE TABLE IF NOT EXISTS public.health_scores (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    score INTEGER DEFAULT 0 CHECK (score >= 0 AND score <= 100),
    streak_days INTEGER DEFAULT 0,
    weekly_view JSONB DEFAULT '[]'::jsonb,
    streak_bonus DECIMAL(3,2) DEFAULT 1.0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create daily_activities table
CREATE TABLE IF NOT EXISTS public.daily_activities (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    activity_id TEXT NOT NULL,
    activity_name TEXT NOT NULL,
    completed BOOLEAN DEFAULT FALSE,
    completed_at TIMESTAMP WITH TIME ZONE,
    score_earned INTEGER DEFAULT 0,
    date DATE DEFAULT CURRENT_DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create weekly_summaries table
CREATE TABLE IF NOT EXISTS public.weekly_summaries (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    week_start DATE NOT NULL,
    week_end DATE NOT NULL,
    total_score INTEGER DEFAULT 0,
    activities_completed INTEGER DEFAULT 0,
    streak_days INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.health_scores ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.daily_activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.weekly_summaries ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view their own health scores" ON public.health_scores
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own health scores" ON public.health_scores
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own health scores" ON public.health_scores
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own daily activities" ON public.daily_activities
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own daily activities" ON public.daily_activities
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own daily activities" ON public.daily_activities
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own weekly summaries" ON public.weekly_summaries
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own weekly summaries" ON public.weekly_summaries
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own weekly summaries" ON public.weekly_summaries
    FOR UPDATE USING (auth.uid() = user_id);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_health_scores_user_id ON public.health_scores(user_id);
CREATE INDEX IF NOT EXISTS idx_daily_activities_user_id ON public.daily_activities(user_id);
CREATE INDEX IF NOT EXISTS idx_daily_activities_date ON public.daily_activities(date);
CREATE INDEX IF NOT EXISTS idx_weekly_summaries_user_id ON public.weekly_summaries(user_id);
CREATE INDEX IF NOT EXISTS idx_weekly_summaries_week_start ON public.weekly_summaries(week_start);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_health_scores_updated_at 
    BEFORE UPDATE ON public.health_scores 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
