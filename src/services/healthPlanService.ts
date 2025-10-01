// Health Plan Generation Service using OpenAI
import { supabase } from '@/integrations/supabase/client';

// Fallback health plan generation when API is not available
const generateFallbackHealthPlans = (userProfile: any, healthScore: number) => {
  const age = parseInt(userProfile.age) || 30;
  const isBeginner = age < 25 || healthScore < 60;
  const isAdvanced = age > 40 && healthScore > 80;
  
  const plans = [
    {
      id: 'beginner-wellness',
      title: 'Beginner Wellness Journey',
      difficulty: 'Beginner' as const,
      duration: '4 weeks',
      focusAreas: ['Cardio', 'Flexibility', 'Basic Strength'],
      equipment: ['Yoga Mat', 'Resistance Bands', 'Water Bottle'],
      benefits: ['Improved energy', 'Better sleep', 'Reduced stress', 'Weight management'],
      description: 'A gentle introduction to fitness with low-impact exercises perfect for beginners. Focus on building healthy habits and basic movement patterns.',
      estimatedCalories: 200,
      equipment: ['Yoga Mat', 'Resistance Bands', 'Water Bottle']
    },
    {
      id: 'intermediate-fitness',
      title: 'Intermediate Fitness Challenge',
      difficulty: 'Intermediate' as const,
      duration: '6 weeks',
      focusAreas: ['Strength Training', 'Cardio', 'Core Stability'],
      equipment: ['Dumbbells', 'Yoga Mat', 'Resistance Bands', 'Timer'],
      benefits: ['Increased muscle mass', 'Better endurance', 'Improved posture', 'Enhanced metabolism'],
      description: 'A balanced program combining strength and cardio training. Perfect for those ready to take their fitness to the next level.',
      estimatedCalories: 350,
      equipment: ['Dumbbells', 'Yoga Mat', 'Resistance Bands', 'Timer']
    },
    {
      id: 'advanced-performance',
      title: 'Advanced Performance Program',
      difficulty: 'Advanced' as const,
      duration: '8 weeks',
      focusAreas: ['High-Intensity Training', 'Advanced Strength', 'Athletic Performance'],
      equipment: ['Dumbbells', 'Kettlebell', 'Pull-up Bar', 'Timer', 'Heart Rate Monitor'],
      benefits: ['Peak physical performance', 'Maximum strength gains', 'Elite endurance', 'Athletic conditioning'],
      description: 'An intensive program designed for experienced individuals seeking maximum results. High-intensity workouts with advanced techniques.',
      estimatedCalories: 500,
      equipment: ['Dumbbells', 'Kettlebell', 'Pull-up Bar', 'Timer', 'Heart Rate Monitor']
    }
  ];

  // Adjust plans based on user profile
  if (userProfile.health_goals?.includes('weight loss')) {
    plans[0].title = 'Weight Loss Starter';
    plans[0].description = 'A beginner-friendly program focused on sustainable weight loss through cardio and light strength training.';
    plans[1].title = 'Weight Loss Accelerator';
    plans[1].description = 'An intermediate program combining HIIT and strength training for effective weight management.';
  }

  if (userProfile.health_goals?.includes('muscle gain')) {
    plans[1].title = 'Muscle Building Foundation';
    plans[1].description = 'A strength-focused program designed to build lean muscle mass with progressive overload.';
    plans[2].title = 'Advanced Muscle Building';
    plans[2].description = 'An intensive program for experienced lifters seeking maximum muscle growth and strength.';
  }

  if (userProfile.health_goals?.includes('flexibility')) {
    plans[0].focusAreas = ['Flexibility', 'Mobility', 'Balance'];
    plans[0].equipment = ['Yoga Mat', 'Yoga Blocks', 'Stretching Strap'];
    plans[1].focusAreas = ['Flexibility', 'Core Strength', 'Balance'];
  }

  return plans;
};

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
    
    // Fallback: Generate basic health plans based on user profile
    console.log('🔄 Using fallback health plan generation');
    
    try {
      const fallbackPlans = generateFallbackHealthPlans(request.userProfile, request.healthScore);
      return {
        success: true,
        plans: fallbackPlans
      };
    } catch (fallbackError) {
      console.error('❌ Fallback health plan generation failed:', fallbackError);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to generate health plans'
      };
    }
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