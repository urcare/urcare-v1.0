// Health Plan Generation Service
import { supabase } from '@/integrations/supabase/client';

interface HealthPlanRequest {
  userProfile: any;
  primaryGoal: string;
  userInput?: string;
  healthScore?: number;
  healthAnalysis?: any;
}

interface HealthPlanResponse {
  success: boolean;
  plans?: any[];
  userContext?: any;
  meta?: any;
  error?: string;
}

// Generate health plans using Supabase function (doesn't save to database)
export const generateHealthPlans = async (request: HealthPlanRequest): Promise<HealthPlanResponse> => {
  try {
    console.log('🔍 Generating health plans using Supabase function...');
    
    // Add timeout to prevent hanging
    const timeoutPromise = new Promise((_, reject) => 
      setTimeout(() => reject(new Error('Health plan generation timeout')), 30000)
    );
    
    const healthPlanPromise = supabase.functions.invoke('health-plans', {
      body: {
        userProfile: request.userProfile,
        primaryGoal: request.primaryGoal,
        userInput: request.userInput,
        healthScore: request.healthScore,
        healthAnalysis: request.healthAnalysis,
        saveToDatabase: false // Don't save all plans, only the selected one
      }
    });
    
    const response = await Promise.race([healthPlanPromise, timeoutPromise]) as any;
    
    console.log('📊 Health plan response:', response);
    
    if (response.error) {
      console.error('❌ Health plan response error:', response.error);
      throw new Error(response.error.message || 'Health plan generation failed');
    }
    
    const data = response.data;
    console.log('📊 Health plan data:', data);
    
    if (!data.success) {
      console.error('❌ Health plan generation failed:', data.error);
      throw new Error(data.error || 'Health plan generation failed');
    }
    
    console.log('✅ Health plans generated successfully');
    
    return {
      success: true,
      plans: data.plans,
      userContext: data.userContext,
      meta: data.meta
    };
    
  } catch (error) {
    console.error('❌ Health plan generation error:', error);
    
    // Return fallback plans if API fails
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to generate health plans',
      plans: generateFallbackPlans(request.userProfile, request.primaryGoal)
    };
  }
};

// Fallback health plans when API is not available
const generateFallbackPlans = (userProfile: any, primaryGoal: string) => {
  const basePlans = [
    {
      id: "fallback_gentle",
      name: "Gentle Start",
      description: "A gentle approach to improving your health and wellness",
      duration: "4-6 weeks",
      difficulty: "Gentle",
      calorieTarget: 1600,
      macros: { protein: 25, carbs: 45, fats: 30 },
      workoutFrequency: "3 days/week",
      focusAreas: ["Basic fitness", "Healthy eating", "Stress management"],
      benefits: ["Improved energy", "Better sleep", "Reduced stress"],
      planScheduleRequirements: {
        workoutWindows: ["morning", "evening"],
        mealPrepComplexity: "simple",
        recoveryNeeds: "8 hours sleep",
        intensityLevel: "low",
        dietaryFocus: "balanced nutrition"
      }
    },
    {
      id: "fallback_balanced",
      name: "Balanced Progress",
      description: "A balanced approach to achieving your health goals",
      duration: "8-12 weeks",
      difficulty: "Balanced",
      calorieTarget: 1800,
      macros: { protein: 30, carbs: 40, fats: 30 },
      workoutFrequency: "4 days/week",
      focusAreas: ["Cardio fitness", "Strength training", "Nutrition optimization"],
      benefits: ["Increased strength", "Better endurance", "Improved body composition"],
      planScheduleRequirements: {
        workoutWindows: ["morning", "afternoon", "evening"],
        mealPrepComplexity: "medium",
        recoveryNeeds: "7-8 hours sleep",
        intensityLevel: "moderate",
        dietaryFocus: "macro tracking"
      }
    },
    {
      id: "fallback_intensive",
      name: "Intensive Transformation",
      description: "An intensive program for maximum health transformation",
      duration: "12-16 weeks",
      difficulty: "Intensive",
      calorieTarget: 2000,
      macros: { protein: 35, carbs: 35, fats: 30 },
      workoutFrequency: "5 days/week",
      focusAreas: ["Advanced fitness", "Precision nutrition", "Performance optimization"],
      benefits: ["Peak physical condition", "Optimal body composition", "Enhanced performance"],
      planScheduleRequirements: {
        workoutWindows: ["morning", "afternoon", "evening"],
        mealPrepComplexity: "advanced",
        recoveryNeeds: "8-9 hours sleep",
        intensityLevel: "high",
        dietaryFocus: "performance nutrition"
      }
    }
  ];
  
  // Customize plans based on user profile
  return basePlans.map(plan => ({
    ...plan,
    focusAreas: plan.focusAreas.map(area => 
      area.replace("fitness", userProfile.workout_type || "fitness")
    ),
    dietaryFocus: plan.dietaryFocus.replace("nutrition", userProfile.diet_type || "nutrition")
  }));
};

// Get user's health plans from database
export const getUserHealthPlans = async (userId: string) => {
  try {
    const { data, error } = await supabase
      .from('health_plans')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;

    return {
      success: true,
      plans: data || []
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch health plans'
    };
  }
};

// Save selected health plan to database
export const saveSelectedHealthPlan = async (
  userId: string, 
  selectedPlan: any, 
  userContext: any, 
  generationMeta: any
) => {
  try {
    console.log('💾 Saving selected health plan to database...');
    
    const { error } = await supabase
      .from('health_plans')
      .insert({
        user_id: userId,
        plan_name: `${userContext.primaryGoal} Plan`,
        plan_type: 'health_transformation',
        primary_goal: userContext.primaryGoal,
        secondary_goals: userContext.secondaryGoals || [],
        start_date: new Date().toISOString().split('T')[0],
        target_end_date: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        duration_weeks: parseInt(selectedPlan.duration?.split('-')[1]?.replace('w', '')) || 12,
        user_input: userContext.userInput || null,
        plan_data: {
          selected_plan: selectedPlan,
          user_context: userContext,
          all_generated_plans: [selectedPlan] // Only store the selected plan
        },
        plan_data_json: {
          selected_plan: selectedPlan,
          user_context: userContext,
          all_generated_plans: [selectedPlan],
          generation_meta: {
            ai_provider: generationMeta?.ai_provider || 'Groq-API',
            model: generationMeta?.model || 'llama-3.3-70b-versatile',
            health_score: userContext.healthScore,
            generated_at: new Date().toISOString(),
            token_usage: generationMeta?.token_usage || null
          }
        },
        status: 'selected',
        generation_model: generationMeta?.model || 'llama-3.3-70b-versatile',
        generation_parameters: generationMeta || {}
      });

    if (error) throw error;

    console.log('✅ Selected health plan saved to database');
    return {
      success: true
    };
  } catch (error) {
    console.error('❌ Error saving selected plan:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to save selected plan'
    };
  }
};

// Save health plan selection (legacy function for updating existing plans)
export const saveHealthPlanSelection = async (userId: string, planId: string, planData: any) => {
  try {
    const { error } = await supabase
      .from('health_plans')
      .update({
        status: 'selected',
        updated_at: new Date().toISOString()
      })
      .eq('id', planId)
      .eq('user_id', userId);

    if (error) throw error;

    return {
      success: true
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to save plan selection'
    };
  }
};

// Get user's selected health plan
export const getSelectedHealthPlan = async (userId: string) => {
  try {
    const { data, error } = await supabase
      .from('health_plans')
      .select('*')
      .eq('user_id', userId)
      .eq('status', 'selected')
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (error && error.code !== 'PGRST116') throw error;

    return {
      success: true,
      plan: data || null
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch selected plan'
    };
  }
};