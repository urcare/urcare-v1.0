-- Create health_metrics table
-- This table stores various health measurements and metrics over time

CREATE TABLE IF NOT EXISTS health_metrics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    
    -- Measurement metadata
    metric_type TEXT NOT NULL CHECK (metric_type IN (
        'weight', 'height', 'bmi', 'body_fat_percentage', 'muscle_mass',
        'blood_pressure_systolic', 'blood_pressure_diastolic', 'heart_rate',
        'blood_glucose', 'cholesterol', 'steps', 'calories_burned',
        'sleep_duration', 'sleep_quality', 'mood_score', 'energy_level',
        'stress_level', 'pain_level', 'waist_circumference', 'hip_circumference',
        'chest_circumference', 'arm_circumference', 'thigh_circumference'
    )),
    value DECIMAL(10,2) NOT NULL,
    unit TEXT NOT NULL,
    
    -- Measurement details
    measurement_date DATE NOT NULL,
    measurement_time TIME,
    notes TEXT,
    
    -- Source information
    source TEXT CHECK (source IN ('manual', 'wearable', 'app', 'healthcare_provider', 'lab')) DEFAULT 'manual',
    device_name TEXT,
    
    -- Validation
    is_validated BOOLEAN DEFAULT FALSE,
    validated_by UUID REFERENCES auth.users(id),
    validated_at TIMESTAMP WITH TIME ZONE,
    
    -- System fields
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_health_metrics_user_id ON health_metrics(user_id);
CREATE INDEX IF NOT EXISTS idx_health_metrics_metric_type ON health_metrics(metric_type);
CREATE INDEX IF NOT EXISTS idx_health_metrics_measurement_date ON health_metrics(measurement_date);
CREATE INDEX IF NOT EXISTS idx_health_metrics_user_metric_date ON health_metrics(user_id, metric_type, measurement_date);
CREATE INDEX IF NOT EXISTS idx_health_metrics_source ON health_metrics(source);

-- Create updated_at trigger
CREATE TRIGGER update_health_metrics_updated_at
    BEFORE UPDATE ON health_metrics
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security
ALTER TABLE health_metrics ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view their own health metrics" ON health_metrics
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own health metrics" ON health_metrics
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own health metrics" ON health_metrics
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own health metrics" ON health_metrics
    FOR DELETE USING (auth.uid() = user_id);

-- Add comments for documentation
COMMENT ON TABLE health_metrics IS 'Health measurements and metrics collected over time';
COMMENT ON COLUMN health_metrics.user_id IS 'References auth.users.id - the authenticated user ID';
COMMENT ON COLUMN health_metrics.metric_type IS 'Type of health metric being measured';
COMMENT ON COLUMN health_metrics.value IS 'Numeric value of the measurement';
COMMENT ON COLUMN health_metrics.unit IS 'Unit of measurement (kg, cm, bpm, etc.)';
COMMENT ON COLUMN health_metrics.measurement_date IS 'Date when measurement was taken';
COMMENT ON COLUMN health_metrics.source IS 'Source of the measurement data';
COMMENT ON COLUMN health_metrics.is_validated IS 'Whether the measurement has been validated by a healthcare provider';
