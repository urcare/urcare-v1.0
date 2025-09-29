import { supabase } from "@/integrations/supabase/client";

interface UserProfile {
  id: string;
  full_name: string;
  age: string;
  gender: string;
  height_cm: string;
  weight_kg: string;
  blood_group: string;
  diet_type: string;
  chronic_conditions: string[];
  health_goals: string[];
  wake_up_time: string;
  sleep_time: string;
  work_start: string;
  work_end: string;
  breakfast_time: string;
  lunch_time: string;
  dinner_time: string;
  workout_time: string;
  workout_type: string;
  routine_flexibility: string;
  smoking: string;
  drinking: string;
  allergies: string[];
  family_history: string[];
  lifestyle: string;
  stress_levels: string;
  mental_health: string;
  hydration_habits: string;
  occupation: string;
}

interface HealthPlanActivity {
  id: string;
  title: string;
  description: string;
  type: 'nutrition' | 'exercise' | 'sleep' | 'hydration' | 'meditation' | 'other';
  scheduled_time: string;
  duration: number; // in minutes
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

interface AIHealthPlanResponse {
  success: boolean;
  plans: HealthPlan[];
  health_score: {
    current: number;
    projected: number;
    improvements: string[];
  };
  personalized_insights: string[];
}

export class AIHealthPlanService {
  async generatePersonalizedHealthPlans(userProfile: UserProfile): Promise<AIHealthPlanResponse> {
    try {
      const { data, error } = await supabase.functions.invoke('generate-ai-health-plans', {
        body: {
          user_profile: userProfile,
          timestamp: new Date().toISOString()
        },
        headers: {
          Authorization: `Bearer ${
            (await supabase.auth.getSession()).data.session?.access_token
          }`,
        },
      });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error generating health plans:', error);
      throw error;
    }
  }

  async saveHealthPlan(userId: string, plan: HealthPlan): Promise<void> {
    try {
      const { error } = await supabase
        .from('comprehensive_health_plans')
        .insert({
          user_id: userId,
          plan_data: plan,
          status: 'active'
        });

      if (error) throw error;
    } catch (error) {
      console.error('Error saving health plan:', error);
      throw error;
    }
  }

  async getUserHealthPlans(userId: string): Promise<HealthPlan[]> {
    try {
      const { data, error } = await supabase
        .from('comprehensive_health_plans')
        .select('plan_data')
        .eq('user_id', userId)
        .eq('status', 'active')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data?.map(item => item.plan_data) || [];
    } catch (error) {
      console.error('Error fetching health plans:', error);
      throw error;
    }
  }
}

export const aiHealthPlanService = new AIHealthPlanService();


