# AI Health Plan Generation System Setup

This guide will help you set up the complete AI-powered health plan generation system for your UrCare app.

## 🎯 **What's Been Created**

### **Frontend Components**
1. **HealthPlanGeneration** - Main page for generating and selecting health plans
2. **HealthPlanComparison** - Beautiful comparison UI for 3 health plans
3. **HealthScoreDisplay** - Health score visualization with metrics
4. **AIHealthPlanService** - Service for AI integration

### **Backend Functions**
1. **generate-ai-health-plans** - Supabase Edge Function for OpenAI integration
2. **Database migrations** - Tables for storing health plans and user data

### **Features**
- ✅ AI-generated personalized health plans (3 difficulty levels)
- ✅ Health score calculation and projection
- ✅ Beautiful materialistic UI with comparison tables
- ✅ Timestamp-based activity scheduling
- ✅ Health metrics tracking
- ✅ Personalized insights based on user data

## 🚀 **Setup Instructions**

### **1. Database Setup**

Run these SQL commands in your Supabase Dashboard → SQL Editor:

```sql
-- Create comprehensive_health_plans table
CREATE TABLE IF NOT EXISTS comprehensive_health_plans (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  plan_data JSONB NOT NULL,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'completed', 'paused')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create user_profiles table (if not exists)
CREATE TABLE IF NOT EXISTS user_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  age TEXT,
  date_of_birth DATE,
  gender TEXT,
  height_cm TEXT,
  weight_kg TEXT,
  blood_group TEXT,
  diet_type TEXT,
  chronic_conditions TEXT[],
  health_goals TEXT[],
  wake_up_time TIME,
  sleep_time TIME,
  work_start TIME,
  work_end TIME,
  breakfast_time TIME,
  lunch_time TIME,
  dinner_time TIME,
  workout_time TIME,
  workout_type TEXT,
  routine_flexibility TEXT,
  smoking TEXT,
  drinking TEXT,
  allergies TEXT[],
  family_history TEXT[],
  lifestyle TEXT,
  stress_levels TEXT,
  mental_health TEXT,
  hydration_habits TEXT,
  occupation TEXT,
  onboarding_completed BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create onboarding_profiles table
CREATE TABLE IF NOT EXISTS onboarding_profiles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  details JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id)
);

-- Enable RLS
ALTER TABLE comprehensive_health_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE onboarding_profiles ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view their own comprehensive health plans" ON comprehensive_health_plans
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own comprehensive health plans" ON comprehensive_health_plans
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own comprehensive health plans" ON comprehensive_health_plans
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own comprehensive health plans" ON comprehensive_health_plans
  FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own profile" ON user_profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile" ON user_profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON user_profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can view their own onboarding data" ON onboarding_profiles
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own onboarding data" ON onboarding_profiles
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own onboarding data" ON onboarding_profiles
  FOR UPDATE USING (auth.uid() = user_id);
```

### **2. Deploy Supabase Edge Function**

```bash
# Deploy the AI health plan generation function
npx supabase functions deploy generate-ai-health-plans
```

### **3. Set Environment Variables**

In your Supabase Dashboard → Settings → Edge Functions, add:

```bash
OPENAI_API_KEY=your_openai_api_key_here
```

### **4. Install Missing Dependencies**

```bash
npm install @radix-ui/react-progress class-variance-authority
```

## 🔄 **User Flow**

1. **User completes onboarding** → Profile data saved
2. **Redirects to Health Plan Generation** → AI analyzes profile
3. **Shows 3 personalized plans** → Beginner, Intermediate, Advanced
4. **User selects plan** → Plan saved to database
5. **Redirects to Dashboard** → Shows selected plan in Health Insights

## 🎨 **UI Features**

### **Health Plan Comparison**
- Materialistic design with cards
- Difficulty badges (🟢 Beginner, 🟡 Intermediate, 🔴 Advanced)
- Health metrics with progress bars
- Activity previews with timestamps
- Comparison table

### **Health Score Display**
- Circular progress indicators
- Current vs Projected scores
- Color-coded health levels
- Improvement percentage
- Key improvements list

### **Personalized Insights**
- AI-generated insights based on user data
- Focus areas and expected outcomes
- Lifestyle-specific recommendations

## 🧠 **AI Integration**

The system uses OpenAI GPT-4 to:
- Analyze user health profile
- Generate 3 difficulty-based plans
- Create detailed daily activities with timestamps
- Calculate health score improvements
- Provide personalized insights

## 📊 **Data Structure**

### **Health Plan Structure**
```typescript
interface HealthPlan {
  id: string;
  name: string;
  description: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  duration_weeks: number;
  focus_areas: string[];
  expected_outcomes: string[];
  activities: HealthPlanActivity[];
  health_metrics: {
    weight_loss_goal: number;
    muscle_gain_goal: number;
    fitness_improvement: number;
    energy_level: number;
    sleep_quality: number;
    stress_reduction: number;
  };
  weekly_schedule: {
    [key: string]: HealthPlanActivity[];
  };
}
```

### **Activity Structure**
```typescript
interface HealthPlanActivity {
  id: string;
  title: string;
  description: string;
  type: 'nutrition' | 'exercise' | 'sleep' | 'hydration' | 'meditation' | 'other';
  scheduled_time: string;
  duration: number;
  priority: 'high' | 'medium' | 'low';
  category: string;
  instructions: string[];
  benefits: string[];
  tips: string[];
  metrics?: {
    calories?: number;
    protein?: number;
    carbs?: number;
    fat?: number;
    steps?: number;
    heart_rate?: number;
    water_intake?: number;
  };
}
```

## 🚨 **Troubleshooting**

### **Common Issues**

1. **OpenAI API Error**
   - Check if API key is set correctly
   - Verify API key has sufficient credits
   - Check rate limits

2. **Database Errors**
   - Ensure all tables are created
   - Check RLS policies
   - Verify user authentication

3. **UI Not Loading**
   - Check if all dependencies are installed
   - Verify component imports
   - Check browser console for errors

### **Testing**

1. Complete onboarding with test data
2. Check if health plan generation works
3. Verify plan selection and saving
4. Test dashboard display

## 🎉 **Success!**

Your AI-powered health plan generation system is now ready! Users will get personalized, timestamp-based health plans with beautiful UI and comprehensive health metrics.

**Next Steps:**
- Test the complete flow
- Customize the AI prompts if needed
- Add more health metrics
- Implement plan progress tracking


