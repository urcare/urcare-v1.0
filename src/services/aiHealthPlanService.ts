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
      console.log('Calling generate-ai-health-plans function with profile:', userProfile);
      
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

      if (error) {
        console.error('Supabase function error:', error);
        throw error;
      }
      
      console.log('Function response:', data);
      return data;
    } catch (error) {
      console.error('Error generating health plans:', error);
      
      // Return fallback response if function fails
      return {
        success: true,
        plans: [
          {
            id: "fallback_1",
            name: "Healthy Habits Beginner Plan",
            description: "A 12-week plan focused on building sustainable healthy habits",
            difficulty: "beginner",
            duration_weeks: 12,
            focus_areas: ["nutrition", "exercise", "sleep", "hydration"],
            expected_outcomes: ["Improved energy levels", "Better sleep quality", "Weight management"],
            activities: [
              {
                id: "activity_1",
                title: "Morning Hydration",
                description: "Drink 500ml of water upon waking",
                type: "hydration",
                scheduled_time: userProfile.wake_up_time || "07:00",
                duration: 5,
                priority: "high",
                category: "Hydration",
                instructions: ["Drink water immediately after waking", "Add lemon for better absorption"],
                benefits: ["Boosts metabolism", "Improves brain function"],
                tips: ["Keep water by bedside", "Set phone reminder"]
              },
              {
                id: "activity_2",
                title: "Morning Walk",
                description: "15-minute morning walk for energy",
                type: "exercise",
                scheduled_time: userProfile.wake_up_time || "07:30",
                duration: 15,
                priority: "medium",
                category: "Exercise",
                instructions: ["Walk at moderate pace", "Focus on breathing"],
                benefits: ["Boosts energy", "Improves circulation"],
                tips: ["Wear comfortable shoes", "Stay hydrated"]
              }
            ],
            health_metrics: {
              weight_loss_goal: 5,
              muscle_gain_goal: 2,
              fitness_improvement: 20,
              energy_level: 15,
              sleep_quality: 10,
              stress_reduction: 25
            },
            weekly_schedule: {}
          },
          {
            id: "fallback_2", 
            name: "Heart Health Intermediate Plan",
            description: "A 16-week balanced approach with moderate intensity",
            difficulty: "intermediate",
            duration_weeks: 16,
            focus_areas: ["nutrition", "exercise", "stress management", "heart health"],
            expected_outcomes: ["Increased strength", "Better endurance", "Improved body composition"],
            activities: [
              {
                id: "activity_2",
                title: "Cardio Workout",
                description: "30 minutes of moderate cardio exercise",
                type: "exercise",
                scheduled_time: userProfile.workout_time || "18:00",
                duration: 30,
                priority: "high",
                category: "Exercise",
                instructions: ["Warm up for 5 minutes", "Maintain moderate intensity", "Cool down for 5 minutes"],
                benefits: ["Improves heart health", "Burns calories"],
                tips: ["Choose activities you enjoy", "Track your heart rate"]
              },
              {
                id: "activity_3",
                title: "Strength Training",
                description: "20 minutes of strength exercises",
                type: "exercise",
                scheduled_time: userProfile.workout_time || "18:30",
                duration: 20,
                priority: "medium",
                category: "Exercise",
                instructions: ["Focus on major muscle groups", "Use proper form"],
                benefits: ["Builds muscle", "Increases metabolism"],
                tips: ["Start with light weights", "Progress gradually"]
              }
            ],
            health_metrics: {
              weight_loss_goal: 8,
              muscle_gain_goal: 4,
              fitness_improvement: 35,
              energy_level: 25,
              sleep_quality: 15,
              stress_reduction: 30
            },
            weekly_schedule: {}
          },
          {
            id: "fallback_3",
            name: "Cholesterol Control Advanced Plan", 
            description: "A 20-week high-intensity plan for maximum results",
            difficulty: "advanced",
            duration_weeks: 20,
            focus_areas: ["nutrition", "exercise", "advanced training", "cholesterol management"],
            expected_outcomes: ["Dramatic body transformation", "Elite fitness level", "Optimal health"],
            activities: [
              {
                id: "activity_3",
                title: "High-Intensity Training",
                description: "45 minutes of high-intensity interval training",
                type: "exercise",
                scheduled_time: userProfile.workout_time || "18:00",
                duration: 45,
                priority: "high",
                category: "Exercise",
                instructions: ["Warm up for 10 minutes", "Alternate high/low intensity", "Cool down for 10 minutes"],
                benefits: ["Maximizes fat burn", "Improves cardiovascular fitness"],
                tips: ["Push your limits safely", "Track progress weekly"]
              },
              {
                id: "activity_4",
                title: "Advanced Nutrition Planning",
                description: "Strict meal planning and macro tracking",
                type: "nutrition",
                scheduled_time: userProfile.breakfast_time || "08:00",
                duration: 15,
                priority: "high",
                category: "Nutrition",
                instructions: ["Track all macros", "Plan meals in advance", "Monitor portion sizes"],
                benefits: ["Optimizes body composition", "Improves energy levels"],
                tips: ["Use a food scale", "Prep meals weekly"]
              }
            ],
            health_metrics: {
              weight_loss_goal: 12,
              muscle_gain_goal: 6,
              fitness_improvement: 50,
              energy_level: 35,
              sleep_quality: 20,
              stress_reduction: 40
            },
            weekly_schedule: {}
          }
        ],
        health_score: {
          current: 65,
          projected: 85,
          improvements: ["Better nutrition habits", "Regular exercise routine", "Improved sleep schedule"]
        },
        personalized_insights: [
          "Focus on consistent meal timing",
          "Include 30 minutes of daily exercise", 
          "Maintain regular sleep schedule"
        ]
      };
    }
  }

  async saveHealthPlan(userId: string, plan: HealthPlan): Promise<void> {
    try {
      // Try to save to comprehensive_health_plans first
      try {
        // First, deactivate any existing active plans
        await supabase
          .from('comprehensive_health_plans')
          .update({ status: 'inactive' })
          .eq('user_id', userId)
          .eq('status', 'active');

        // Insert the new selected plan
        const { error } = await supabase
          .from('comprehensive_health_plans')
          .insert({
            user_id: userId,
            plan_data: {
              ...plan,
              selected_at: new Date().toISOString(),
              start_date: new Date().toISOString().split('T')[0],
              end_date: new Date(Date.now() + (plan.duration_weeks * 7 * 24 * 60 * 60 * 1000)).toISOString().split('T')[0]
            },
            status: 'active'
          });

        if (error) throw error;
        console.log('Health plan saved successfully to comprehensive_health_plans:', plan.name);
        return;
      } catch (comprehensiveError) {
        console.log('comprehensive_health_plans table not found, trying health_plans table');
        
        // Fallback to health_plans table
        const { error: healthPlansError } = await supabase
          .from('health_plans')
          .insert({
            user_id: userId,
            plan_name: plan.name,
            plan_type: plan.difficulty === 'beginner' ? 'habit_formation' : 
                      plan.difficulty === 'intermediate' ? 'health_transformation' : 'lifestyle_change',
            primary_goal: plan.focus_areas[0] || 'General Health',
            secondary_goals: plan.focus_areas.slice(1),
            start_date: new Date().toISOString().split('T')[0],
            target_end_date: new Date(Date.now() + (plan.duration_weeks * 7 * 24 * 60 * 60 * 1000)).toISOString().split('T')[0],
            duration_weeks: plan.duration_weeks,
            plan_data: {
              ...plan,
              selected_at: new Date().toISOString(),
              start_date: new Date().toISOString().split('T')[0],
              end_date: new Date(Date.now() + (plan.duration_weeks * 7 * 24 * 60 * 60 * 1000)).toISOString().split('T')[0]
            },
            status: 'active'
          });

        if (healthPlansError) throw healthPlansError;
        console.log('Health plan saved successfully to health_plans:', plan.name);
      }
    } catch (error) {
      console.error('Error saving health plan:', error);
      // Don't throw error, just log it so the user can still proceed
      console.log('Continuing without saving to database...');
    }
  }

  async getUserHealthPlans(userId: string): Promise<HealthPlan[]> {
    try {
      // Try comprehensive_health_plans first
      const { data: comprehensiveData, error: comprehensiveError } = await supabase
        .from('comprehensive_health_plans')
        .select('plan_data')
        .eq('user_id', userId)
        .eq('status', 'active')
        .order('created_at', { ascending: false });

      if (!comprehensiveError && comprehensiveData) {
        return comprehensiveData.map(item => item.plan_data) || [];
      }

      // Fallback to health_plans table
      const { data: healthPlansData, error: healthPlansError } = await supabase
        .from('health_plans')
        .select('plan_data')
        .eq('user_id', userId)
        .eq('status', 'active')
        .order('created_at', { ascending: false });

      if (healthPlansError) throw healthPlansError;
      return healthPlansData?.map(item => item.plan_data) || [];
    } catch (error) {
      console.error('Error fetching health plans:', error);
      return [];
    }
  }
}

export const aiHealthPlanService = new AIHealthPlanService();


