// Health Plan Generation Service using Supabase Functions
import { supabase } from '@/integrations/supabase/client';

interface HealthPlanRequest {
  userProfile: any;
  healthScore: number;
  userInput?: string;
}

interface HealthPlan {
  id: string;
  title: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  duration: string;
  focusAreas: string[];
  equipment: string[];
  benefits: string[];
  description: string;
  estimatedCalories: number;
}

interface HealthPlanResponse {
  success: boolean;
  plans?: HealthPlan[];
  error?: string;
}

export const generateHealthPlans = async (request: HealthPlanRequest): Promise<HealthPlanResponse> => {
  try {
    console.log('🔍 Generating health plans using Supabase function...');
    
    // Add timeout protection for health plan generation
    const timeoutPromise = new Promise((_, reject) => 
      setTimeout(() => reject(new Error('Health plan generation timeout')), 30000)
    );
    
    const planGenerationPromise = supabase.functions.invoke('health-plans-optimized', {
      body: {
        userProfile: request.userProfile,
        healthScore: request.healthScore,
        userInput: request.userInput
      }
    });

    const { data, error } = await Promise.race([planGenerationPromise, timeoutPromise]) as any;

    if (error) {
      console.error('❌ Supabase function error:', error);
      throw new Error(`Supabase function error: ${error.message}`);
    }

    if (data && data.success && data.plans) {
      console.log(`✅ Health Plans generated: ${data.plans.length} plans`);
      return {
        success: true,
        plans: data.plans
      };
    } else {
      throw new Error(data?.error || 'Health plan generation failed');
    }

  } catch (error) {
    console.error('❌ Health plan generation error:', error);
    
    // No fallback - return error directly
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to generate health plans'
    };
  }
};

// Save selected health plan
export const saveSelectedHealthPlan = async (userId: string, plan: HealthPlan) => {
  try {
    console.log('💾 Saving selected health plan:', plan.title);
    
    // Create selected plan object
    const selectedPlan = {
      id: plan.id,
      title: plan.title,
      difficulty: plan.difficulty,
      duration: plan.duration,
      focusAreas: plan.focusAreas,
      equipment: plan.equipment,
      benefits: plan.benefits,
      description: plan.description,
      estimatedCalories: plan.estimatedCalories,
      selectedAt: new Date().toISOString(),
      userId: userId
    };

    // Save to localStorage for immediate access
    localStorage.setItem('selectedHealthPlan', JSON.stringify(selectedPlan));
    
    // Create today's activities based on the plan
    const todaysActivities = plan.focusAreas.map((area, index) => ({
      id: `activity-${Date.now()}-${index}`,
      name: `${area} Exercise`,
      description: `Complete ${area} workout as part of your ${plan.title}`,
      estimatedDuration: 30,
      completed: false,
      createdAt: new Date().toISOString()
    }));

    localStorage.setItem('todaysActivities', JSON.stringify(todaysActivities));
    
    console.log('✅ Health plan saved successfully');
    return {
      success: true,
      message: 'Health plan saved successfully'
    };
    
  } catch (error) {
    console.error('❌ Error saving health plan:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to save health plan'
    };
  }
};