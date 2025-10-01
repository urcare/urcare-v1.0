// Plan Activities Service - Generate activities for selected health plans
interface PlanActivity {
  id: string;
  title: string;
  duration: string;
  type: string;
  time: string;
  description: string;
  instructions: string[];
  benefits: string[];
  equipment: string[];
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  calories: number;
}

interface PlanActivitiesRequest {
  selectedPlan: any;
  userProfile: any;
  weeks?: number;
}

interface PlanActivitiesResponse {
  success: boolean;
  activities?: PlanActivity[];
  error?: string;
}

export const generatePlanActivities = async (request: PlanActivitiesRequest): Promise<PlanActivitiesResponse> => {
  try {
    const { selectedPlan, userProfile, weeks = 4 } = request;

    // Try production server first, then localhost
    const apiUrls = [
      'https://urcare-server.vercel.app/api/plan-activities',
      'http://localhost:3000/api/plan-activities'
    ];

    for (const apiUrl of apiUrls) {
      try {
        const response = await fetch(apiUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            selectedPlan,
            userProfile,
            weeks
          })
        });

        if (!response.ok) {
          throw new Error(`Plan activities API error: ${response.status}`);
        }

        const result = await response.json();

        return {
          success: true,
          activities: result.activities
        };
      } catch (apiError) {
        continue; // Try next URL
      }
    }

    // If all APIs fail, use fallback
    throw new Error('All API endpoints failed');

  } catch (error) {
    // Fallback: Generate basic activities based on selected plan
    try {
      const fallbackActivities = generateFallbackActivities(request.selectedPlan, request.userProfile, request.weeks);
      return {
        success: true,
        activities: fallbackActivities
      };
    } catch (fallbackError) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to generate plan activities'
      };
    }
  }
};

const generateFallbackActivities = (selectedPlan: any, userProfile: any, weeks: number): PlanActivity[] => {
  const activities: PlanActivity[] = [];
  const planFocus = selectedPlan?.focusAreas || ['General Fitness'];
  const difficulty = selectedPlan?.difficulty || 'Beginner';
  const planTitle = selectedPlan?.title || 'Health Plan';

  // Generate activities based on plan focus areas
  if (planFocus.includes('Cardio') || planFocus.includes('Weight Loss')) {
    activities.push({
      id: 'cardio-1',
      title: 'Morning Cardio Blast',
      duration: '30 minutes',
      type: 'Cardio',
      time: '07:00',
      description: 'High-intensity cardio workout to boost metabolism',
      instructions: [
        'Start with 5-minute warm-up',
        'Perform 20 minutes of high-intensity intervals',
        'Finish with 5-minute cool-down'
      ],
      benefits: ['Improved cardiovascular health', 'Increased calorie burn', 'Enhanced endurance'],
      equipment: ['Running shoes', 'Water bottle'],
      difficulty: difficulty as 'Beginner' | 'Intermediate' | 'Advanced',
      calories: 250
    });
  }

  if (planFocus.includes('Strength') || planFocus.includes('Muscle')) {
    activities.push({
      id: 'strength-1',
      title: 'Strength Training Session',
      duration: '45 minutes',
      type: 'Strength',
      time: '18:00',
      description: 'Full-body strength training workout',
      instructions: [
        'Warm up for 10 minutes',
        'Perform 3 sets of 8-12 reps for each exercise',
        'Focus on proper form and controlled movements'
      ],
      benefits: ['Increased muscle mass', 'Improved bone density', 'Enhanced metabolism'],
      equipment: ['Dumbbells', 'Resistance bands', 'Yoga mat'],
      difficulty: difficulty as 'Beginner' | 'Intermediate' | 'Advanced',
      calories: 300
    });
  }

  if (planFocus.includes('Flexibility') || planFocus.includes('Yoga')) {
    activities.push({
      id: 'flexibility-1',
      title: 'Flexibility & Mobility',
      duration: '25 minutes',
      type: 'Flexibility',
      time: '19:30',
      description: 'Gentle stretching and mobility exercises',
      instructions: [
        'Start with gentle neck and shoulder rolls',
        'Hold each stretch for 30-60 seconds',
        'Focus on deep breathing throughout'
      ],
      benefits: ['Improved flexibility', 'Reduced muscle tension', 'Better posture'],
      equipment: ['Yoga mat', 'Yoga blocks'],
      difficulty: difficulty as 'Beginner' | 'Intermediate' | 'Advanced',
      calories: 100
    });
  }

  if (planFocus.includes('Stress') || planFocus.includes('Mindfulness')) {
    activities.push({
      id: 'mindfulness-1',
      title: 'Mindfulness & Meditation',
      duration: '15 minutes',
      type: 'Mindfulness',
      time: '20:00',
      description: 'Guided meditation and stress relief',
      instructions: [
        'Find a quiet, comfortable space',
        'Focus on your breathing for 5 minutes',
        'Practice gratitude and positive affirmations'
      ],
      benefits: ['Reduced stress', 'Improved mental clarity', 'Better sleep quality'],
      equipment: ['Meditation cushion', 'Timer'],
      difficulty: difficulty as 'Beginner' | 'Intermediate' | 'Advanced',
      calories: 50
    });
  }

  // Add nutrition activities
  activities.push({
    id: 'nutrition-1',
    title: 'Meal Planning & Prep',
    duration: '60 minutes',
    type: 'Nutrition',
    time: '10:00',
    description: 'Plan and prepare healthy meals for the week',
    instructions: [
      'Plan meals based on your health goals',
      'Prepare ingredients in advance',
      'Store meals in portion-controlled containers'
    ],
    benefits: ['Better nutrition', 'Time savings', 'Consistent healthy eating'],
    equipment: ['Meal prep containers', 'Food scale'],
    difficulty: difficulty as 'Beginner' | 'Intermediate' | 'Advanced',
    calories: 100
  });

  return activities;
};

export const savePlanActivities = async (planId: string, activities: PlanActivity[]) => {
  try {
    const planActivities = {
      planId,
      activities,
      generatedAt: new Date().toISOString(),
      status: 'active'
    };
    
    localStorage.setItem(`planActivities_${planId}`, JSON.stringify(planActivities));
    
    return {
      success: true,
      activities: planActivities
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to save plan activities'
    };
  }
};

export const getPlanActivities = async (planId: string) => {
  try {
    const stored = localStorage.getItem(`planActivities_${planId}`);
    if (stored) {
      const planActivities = JSON.parse(stored);
      return {
        success: true,
        activities: planActivities.activities
      };
    }
    
    return {
      success: false,
      error: 'No activities found for this plan'
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to load plan activities'
    };
  }
};
