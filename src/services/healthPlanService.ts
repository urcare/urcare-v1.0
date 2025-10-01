// Health Plan Generation Service using OpenAI
import { supabase } from '@/integrations/supabase/client';

interface HealthPlanRequest {
  userProfile: any;
  healthScore: number;
  analysis: string;
  recommendations: string[];
  userInput?: string;
  uploadedFiles?: string[];
  voiceTranscript?: string;
}

interface HealthPlan {
  id: string;
  title: string;
  description: string;
  duration: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  focusAreas: string[];
  estimatedCalories: number;
  equipment: string[];
  benefits: string[];
}

interface HealthPlanResponse {
  success: boolean;
  plans?: HealthPlan[];
  error?: string;
}

export const generateHealthPlans = async (request: HealthPlanRequest): Promise<HealthPlanResponse> => {
  try {
    console.log('🔍 Generating health plans with data:', request);

    // Prepare the data for OpenAI
    const planData = {
      userProfile: request.userProfile,
      healthScore: request.healthScore,
      analysis: request.analysis,
      recommendations: request.recommendations,
      userInput: request.userInput || '',
      uploadedFiles: request.uploadedFiles || [],
      voiceTranscript: request.voiceTranscript || '',
      timestamp: new Date().toISOString()
    };

    // Call the health plan generation API
    const response = await fetch('/api/generate-health-plans', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(planData)
    });

    if (!response.ok) {
      throw new Error(`Health plan API error: ${response.status}`);
    }

    const result = await response.json();
    console.log('✅ Health plans generated:', result);

    return {
      success: true,
      plans: result.plans
    };

  } catch (error) {
    console.error('❌ Health plan generation error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to generate health plans'
    };
  }
};

// Save selected health plan
export const saveSelectedHealthPlan = async (userId: string, plan: HealthPlan) => {
  try {
    const { data, error } = await supabase
      .from('user_health_plans')
      .insert({
        user_id: userId,
        plan_id: plan.id,
        plan_title: plan.title,
        plan_description: plan.description,
        duration: plan.duration,
        difficulty: plan.difficulty,
        focus_areas: plan.focusAreas,
        estimated_calories: plan.estimatedCalories,
        equipment: plan.equipment,
        benefits: plan.benefits,
        selected_at: new Date().toISOString(),
        status: 'active'
      })
      .select()
      .single();

    if (error) throw error;

    return {
      success: true,
      plan: data
    };
  } catch (error) {
    console.error('❌ Error saving health plan:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to save health plan'
    };
  }
};