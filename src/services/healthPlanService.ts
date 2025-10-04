// Health Plan Generation Service using Multi-AI (OpenAI, Gemini, Groq)
import { supabase } from '@/integrations/supabase/client';
import { multiAIService } from './multiAIService';

// Fallback health plan generation when API is not available
const generateFallbackHealthPlans = (userProfile: any, healthScore: number, userInput?: string) => {
  
  const age = parseInt(userProfile.age) || 30;
  const isBeginner = age < 25 || healthScore < 60;
  const isAdvanced = age > 40 && healthScore > 80;
  
  // Analyze user input to determine focus area
  const input = (userInput || '').toLowerCase();
  let focusArea = 'general';
  
  
  if (input.includes('stress') || input.includes('anxiety') || input.includes('relax')) {
    focusArea = 'stress';
  } else if (input.includes('weight') || input.includes('lose') || input.includes('fat')) {
    focusArea = 'weight';
  } else if (input.includes('muscle') || input.includes('strength') || input.includes('build')) {
    focusArea = 'muscle';
  } else if (input.includes('cardio') || input.includes('endurance') || input.includes('fitness')) {
    focusArea = 'cardio';
  } else if (input.includes('flexibility') || input.includes('yoga') || input.includes('stretch')) {
    focusArea = 'flexibility';
  } else if (input.includes('energy') || input.includes('tired') || input.includes('fatigue')) {
    focusArea = 'energy';
  }
  
  
  let plans = [];
  
  if (focusArea === 'stress') {
    plans = [
      {
        id: 'stress-relief-beginner',
        title: 'Stress Relief Starter',
        difficulty: 'Beginner' as const,
        duration: '4 weeks',
        focusAreas: ['Meditation', 'Breathing', 'Gentle Yoga'],
        equipment: ['Yoga Mat', 'Cushion', 'Timer'],
        benefits: ['Reduced anxiety', 'Better sleep', 'Calm mind'],
        description: 'Gentle stress relief techniques for beginners. Learn meditation and breathing exercises.',
        estimatedCalories: 150
      },
      {
        id: 'stress-relief-intermediate',
        title: 'Mindfulness Mastery',
        difficulty: 'Intermediate' as const,
        duration: '6 weeks',
        focusAreas: ['Advanced Meditation', 'Yoga Flow', 'Stress Management'],
        equipment: ['Yoga Mat', 'Blocks', 'Meditation App'],
        benefits: ['Deep relaxation', 'Mental clarity', 'Emotional balance'],
        description: 'Advanced mindfulness practices for stress management and mental wellness.',
        estimatedCalories: 250
      },
      {
        id: 'stress-relief-advanced',
        title: 'Zen Master Program',
        difficulty: 'Advanced' as const,
        duration: '8 weeks',
        focusAreas: ['Deep Meditation', 'Advanced Yoga', 'Mental Training'],
        equipment: ['Yoga Mat', 'Meditation Cushion', 'Journal'],
        benefits: ['Inner peace', 'Stress immunity', 'Mental strength'],
        description: 'Master-level stress management and mindfulness training for complete mental wellness.',
        estimatedCalories: 300
      }
    ];
  } else if (focusArea === 'weight') {
    plans = [
      {
        id: 'weight-loss-beginner',
        title: 'Weight Loss Starter',
        difficulty: 'Beginner' as const,
        duration: '4 weeks',
        focusAreas: ['Cardio', 'Light Strength', 'Diet'],
        equipment: ['Treadmill', 'Dumbbells', 'Scale'],
        benefits: ['Fat loss', 'Better energy', 'Healthier habits'],
        description: 'Beginner-friendly weight loss program with cardio and light strength training.',
        estimatedCalories: 400
      },
      {
        id: 'weight-loss-intermediate',
        title: 'Fat Burn Challenge',
        difficulty: 'Intermediate' as const,
        duration: '6 weeks',
        focusAreas: ['HIIT', 'Strength', 'Nutrition'],
        equipment: ['Weights', 'Timer', 'Food Scale'],
        benefits: ['Rapid fat loss', 'Muscle tone', 'Metabolism boost'],
        description: 'Intensive fat burning program with HIIT and strength training.',
        estimatedCalories: 500
      },
      {
        id: 'weight-loss-advanced',
        title: 'Transformation Program',
        difficulty: 'Advanced' as const,
        duration: '8 weeks',
        focusAreas: ['Advanced HIIT', 'Heavy Lifting', 'Strict Diet'],
        equipment: ['Full Gym', 'Supplements', 'Tracker'],
        benefits: ['Dramatic results', 'Muscle definition', 'Peak fitness'],
        description: 'Advanced transformation program for maximum weight loss and body recomposition.',
        estimatedCalories: 600
      }
    ];
  } else {
    // Default general plans
    plans = [
      {
        id: 'beginner-wellness',
        title: 'Beginner Wellness Journey',
        difficulty: 'Beginner' as const,
        duration: '4 weeks',
      focusAreas: ['Cardio', 'Flexibility', 'Basic Strength'],
      equipment: ['Yoga Mat', 'Resistance Bands', 'Water Bottle'],
      benefits: ['Improved energy', 'Better sleep', 'Reduced stress', 'Weight management'],
      description: 'A gentle introduction to fitness with low-impact exercises perfect for beginners. Focus on building healthy habits and basic movement patterns.',
      estimatedCalories: 200
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
      estimatedCalories: 350
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
      estimatedCalories: 500
    }
  ];
  }

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
  focusAreas?: string[];
  estimatedCalories?: number;
  equipment?: string[];
  benefits?: string[];
  activities?: {
    time: string;
    title: string;
    description: string;
    duration: string;
    category: string;
  }[];
}

interface HealthPlanResponse {
  success: boolean;
  plans?: HealthPlan[];
  error?: string;
}

export const generateHealthPlans = async (request: HealthPlanRequest): Promise<HealthPlanResponse> => {
  try {
    console.log('🔍 Generating health plans using Supabase function...');
    
    // Call Supabase Edge Function for health plan generation
    const { data, error } = await supabase.functions.invoke('generate-ai-health-plans', {
      body: {
        user_profile: request.userProfile
      }
    });

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
    
    // Fallback: Use local fallback calculation
    console.log('🔄 Using fallback health plan generation');
    
    try {
      const fallbackPlans = generateFallbackHealthPlans(
        request.userProfile, 
        request.healthScore, 
        request.userInput
      );
      console.log('✅ Fallback plans generated:', fallbackPlans);
      
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
    // Create a comprehensive plan structure
    const selectedPlan = {
      ...plan,
      userId,
      selectedAt: new Date().toISOString(),
      status: 'active',
      startDate: new Date().toISOString().split('T')[0], // Today's date
      activities: plan.activities || [
        {
          time: '07:00',
          title: 'Morning Routine',
          description: `Start your ${plan.title} - ${plan.description}`,
          duration: '30 minutes',
          category: 'Wake up'
        },
        {
          time: '08:00',
          title: 'Workout Session',
          description: `Follow your ${plan.difficulty} level plan`,
          duration: '45 minutes',
          category: 'Exercise'
        },
        {
          time: '09:00',
          title: 'Healthy Breakfast',
          description: 'Nutritious meal to fuel your day',
          duration: '20 minutes',
          category: 'Meals'
        }
      ]
    };
    
    // Save to localStorage
    localStorage.setItem('selectedHealthPlan', JSON.stringify(selectedPlan));
    
    // Also save to a separate key for today's activities
    const todaysActivities = selectedPlan.activities.map(activity => ({
      ...activity,
      id: Math.random().toString(36).substr(2, 9),
      completed: false,
      timestamp: new Date().toISOString()
    }));
    
    localStorage.setItem('todaysActivities', JSON.stringify(todaysActivities));
    
    console.log('✅ Health plan saved to localStorage:', selectedPlan);
    console.log('✅ Today\'s activities created:', todaysActivities);
    
    return {
      success: true,
      plan: selectedPlan
    };
  } catch (error) {
    console.error('❌ Error saving health plan:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to save health plan'
    };
  }
};
