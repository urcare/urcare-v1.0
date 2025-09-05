-- =====================================================
-- SUPABASE DATABASE TABLE CREATION SCRIPT
-- Run this in your Supabase SQL Editor
-- =====================================================

-- Enable UUID extension for PostgreSQL (if not already enabled)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- DAILY NUTRITION TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS daily_nutrition (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    total_calories DECIMAL(8,2) DEFAULT 0.0,
    protein DECIMAL(8,2) DEFAULT 0.0, -- in grams
    carbs DECIMAL(8,2) DEFAULT 0.0, -- in grams
    fat DECIMAL(8,2) DEFAULT 0.0, -- in grams
    fiber DECIMAL(8,2) DEFAULT 0.0, -- in grams
    sugar DECIMAL(8,2) DEFAULT 0.0, -- in grams
    sodium DECIMAL(8,2) DEFAULT 0.0, -- in mg
    meal_breakdown JSONB, -- breakfast, lunch, dinner, snacks
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Ensure one record per user per day
    UNIQUE(user_id, date)
);

-- =====================================================
-- DAILY FITNESS STATS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS daily_fitness_stats (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    total_steps INTEGER DEFAULT 0,
    total_distance DECIMAL(10,2) DEFAULT 0.0, -- in meters
    total_calories DECIMAL(8,2) DEFAULT 0.0,
    average_pace DECIMAL(8,2) DEFAULT 0.0, -- in m/s
    active_time INTEGER DEFAULT 0, -- in seconds
    gps_route JSONB, -- GPS coordinates array
    step_history JSONB, -- Step data history
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Ensure one record per user per day
    UNIQUE(user_id, date)
);

-- =====================================================
-- FOOD ENTRIES TABLE (for detailed tracking)
-- =====================================================
CREATE TABLE IF NOT EXISTS food_entries (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    meal_type VARCHAR(20) NOT NULL CHECK (meal_type IN ('breakfast', 'lunch', 'dinner', 'snack')),
    food_name VARCHAR(255) NOT NULL,
    brand VARCHAR(255),
    quantity DECIMAL(8,2) NOT NULL,
    unit VARCHAR(50) NOT NULL, -- grams, cups, pieces, etc.
    calories_per_unit DECIMAL(8,2) NOT NULL,
    protein_per_unit DECIMAL(8,2) DEFAULT 0.0,
    carbs_per_unit DECIMAL(8,2) DEFAULT 0.0,
    fat_per_unit DECIMAL(8,2) DEFAULT 0.0,
    fiber_per_unit DECIMAL(8,2) DEFAULT 0.0,
    sugar_per_unit DECIMAL(8,2) DEFAULT 0.0,
    sodium_per_unit DECIMAL(8,2) DEFAULT 0.0,
    total_calories DECIMAL(8,2) GENERATED ALWAYS AS (quantity * calories_per_unit) STORED,
    total_protein DECIMAL(8,2) GENERATED ALWAYS AS (quantity * protein_per_unit) STORED,
    total_carbs DECIMAL(8,2) GENERATED ALWAYS AS (quantity * carbs_per_unit) STORED,
    total_fat DECIMAL(8,2) GENERATED ALWAYS AS (quantity * fat_per_unit) STORED,
    barcode VARCHAR(50), -- For barcode scanning
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- FOOD DATABASE TABLE (common foods)
-- =====================================================
CREATE TABLE IF NOT EXISTS food_database (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    brand VARCHAR(255),
    category VARCHAR(100),
    serving_size DECIMAL(8,2) NOT NULL,
    serving_unit VARCHAR(50) NOT NULL,
    calories_per_serving DECIMAL(8,2) NOT NULL,
    protein_per_serving DECIMAL(8,2) DEFAULT 0.0,
    carbs_per_serving DECIMAL(8,2) DEFAULT 0.0,
    fat_per_serving DECIMAL(8,2) DEFAULT 0.0,
    fiber_per_serving DECIMAL(8,2) DEFAULT 0.0,
    sugar_per_serving DECIMAL(8,2) DEFAULT 0.0,
    sodium_per_serving DECIMAL(8,2) DEFAULT 0.0,
    barcode VARCHAR(50),
    verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Index for searching
    CONSTRAINT unique_food_brand UNIQUE(name, brand)
);

-- =====================================================
-- CREATE INDEXES FOR PERFORMANCE
-- =====================================================
CREATE INDEX IF NOT EXISTS idx_daily_nutrition_user_date ON daily_nutrition(user_id, date);
CREATE INDEX IF NOT EXISTS idx_daily_fitness_stats_user_date ON daily_fitness_stats(user_id, date);
CREATE INDEX IF NOT EXISTS idx_food_entries_user_date ON food_entries(user_id, date);
CREATE INDEX IF NOT EXISTS idx_food_entries_meal_type ON food_entries(meal_type);
CREATE INDEX IF NOT EXISTS idx_food_database_name ON food_database(name);
CREATE INDEX IF NOT EXISTS idx_food_database_barcode ON food_database(barcode);

-- =====================================================
-- ENABLE ROW LEVEL SECURITY (RLS)
-- =====================================================
ALTER TABLE daily_nutrition ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_fitness_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE food_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE food_database ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- CREATE RLS POLICIES FOR DAILY_NUTRITION
-- =====================================================
CREATE POLICY "Users can view their own daily nutrition" ON daily_nutrition
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own daily nutrition" ON daily_nutrition
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own daily nutrition" ON daily_nutrition
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own daily nutrition" ON daily_nutrition
    FOR DELETE USING (auth.uid() = user_id);

-- =====================================================
-- CREATE RLS POLICIES FOR DAILY_FITNESS_STATS
-- =====================================================
CREATE POLICY "Users can view their own daily fitness stats" ON daily_fitness_stats
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own daily fitness stats" ON daily_fitness_stats
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own daily fitness stats" ON daily_fitness_stats
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own daily fitness stats" ON daily_fitness_stats
    FOR DELETE USING (auth.uid() = user_id);

-- =====================================================
-- CREATE RLS POLICIES FOR FOOD_ENTRIES
-- =====================================================
CREATE POLICY "Users can view their own food entries" ON food_entries
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own food entries" ON food_entries
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own food entries" ON food_entries
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own food entries" ON food_entries
    FOR DELETE USING (auth.uid() = user_id);

-- =====================================================
-- CREATE RLS POLICIES FOR FOOD_DATABASE (read-only for all authenticated users)
-- =====================================================
CREATE POLICY "Authenticated users can view food database" ON food_database
    FOR SELECT USING (auth.role() = 'authenticated');

-- =====================================================
-- INSERT SAMPLE FOOD DATA
-- =====================================================
INSERT INTO food_database (name, category, serving_size, serving_unit, calories_per_serving, protein_per_serving, carbs_per_serving, fat_per_serving, verified) VALUES
('Apple', 'Fruits', 1, 'medium', 95, 0.5, 25, 0.3, true),
('Banana', 'Fruits', 1, 'medium', 105, 1.3, 27, 0.4, true),
('Chicken Breast', 'Protein', 100, 'grams', 165, 31, 0, 3.6, true),
('Brown Rice', 'Grains', 100, 'grams', 111, 2.6, 23, 0.9, true),
('Broccoli', 'Vegetables', 100, 'grams', 34, 2.8, 7, 0.4, true),
('Greek Yogurt', 'Dairy', 100, 'grams', 59, 10, 3.6, 0.4, true),
('Almonds', 'Nuts', 28, 'grams', 161, 6, 6, 14, true),
('Salmon', 'Protein', 100, 'grams', 208, 20, 0, 12, true),
('Sweet Potato', 'Vegetables', 100, 'grams', 86, 1.6, 20, 0.1, true),
('Oats', 'Grains', 100, 'grams', 389, 16.9, 66, 6.9, true)
ON CONFLICT (name, brand) DO NOTHING;

-- =====================================================
-- CREATE FUNCTION TO UPDATE DAILY NUTRITION TOTALS
-- =====================================================
CREATE OR REPLACE FUNCTION update_daily_nutrition()
RETURNS TRIGGER AS $$
BEGIN
    -- Update or insert daily nutrition totals
    INSERT INTO daily_nutrition (user_id, date, total_calories, protein, carbs, fat, fiber, sugar, sodium)
    SELECT 
        fe.user_id,
        fe.date,
        SUM(fe.total_calories),
        SUM(fe.total_protein),
        SUM(fe.total_carbs),
        SUM(fe.total_fat),
        SUM(fe.quantity * fe.fiber_per_unit),
        SUM(fe.quantity * fe.sugar_per_unit),
        SUM(fe.quantity * fe.sodium_per_unit)
    FROM food_entries fe
    WHERE fe.user_id = COALESCE(NEW.user_id, OLD.user_id)
      AND fe.date = COALESCE(NEW.date, OLD.date)
    GROUP BY fe.user_id, fe.date
    ON CONFLICT (user_id, date) 
    DO UPDATE SET
        total_calories = EXCLUDED.total_calories,
        protein = EXCLUDED.protein,
        carbs = EXCLUDED.carbs,
        fat = EXCLUDED.fat,
        fiber = EXCLUDED.fiber,
        sugar = EXCLUDED.sugar,
        sodium = EXCLUDED.sodium,
        updated_at = NOW();
    
    RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- CREATE TRIGGERS TO AUTOMATICALLY UPDATE DAILY TOTALS
-- =====================================================
CREATE TRIGGER trigger_update_daily_nutrition_insert
    AFTER INSERT ON food_entries
    FOR EACH ROW EXECUTE FUNCTION update_daily_nutrition();

CREATE TRIGGER trigger_update_daily_nutrition_update
    AFTER UPDATE ON food_entries
    FOR EACH ROW EXECUTE FUNCTION update_daily_nutrition();

CREATE TRIGGER trigger_update_daily_nutrition_delete
    AFTER DELETE ON food_entries
    FOR EACH ROW EXECUTE FUNCTION update_daily_nutrition();

-- =====================================================
-- SUCCESS MESSAGE
-- =====================================================
SELECT 'Database tables created successfully! Your fitness dashboard should now work without errors.' as message;
