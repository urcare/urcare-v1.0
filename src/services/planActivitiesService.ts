// Plan Activities Service using Supabase Edge Functions
import { supabase } from '@/integrations/supabase/client';

export interface Activity {
  id: string;
  name: string;
  duration: string;
  instructions: string;
  equipment: string[];
  difficulty: string;
  calories: number;
}

export interface WeekActivity {
  week: number;
  day: number;
  activities: Activity[];
}

export interface PlanActivitiesRequest {
  selectedPlan: {
    title: string;
    description?: string;
    duration?: string;
    difficulty?: string;
    focusAreas?: string[];
    equipment?: string[];
  };
  userProfile: {
    age?: string;
    gender?: string;
    health_goals?: string[];
    workout_time?: string;
  };
}

export interface PlanActivitiesResponse {
  success: boolean;
  activities?: WeekActivity[];
  error?: string;
}

export const generatePlanActivities = async (request: PlanActivitiesRequest): Promise<PlanActivitiesResponse> => {
  try {
    console.log('🔍 Generating plan activities using Supabase function...');
    
    // Call Supabase Edge Function for plan activities generation
    const { data, error } = await supabase.functions.invoke('plan-activities', {
      body: {
        selectedPlan: request.selectedPlan,
        userProfile: request.userProfile
      }
    });

    if (error) {
      console.error('❌ Supabase function error:', error);
      throw new Error(`Supabase function error: ${error.message}`);
    }

    if (data && data.success && data.activities) {
      console.log(`✅ Plan Activities generated: ${data.activities.length} weeks`);
      return {
        success: true,
        activities: data.activities
      };
    } else {
      throw new Error(data?.error || 'Plan activities generation failed');
    }

  } catch (error) {
    console.error('❌ Plan activities generation error:', error);
    
    // Fallback: Return basic activities
    console.log('🔄 Using fallback plan activities generation');
    
    const fallbackActivities: WeekActivity[] = [
      {
        week: 1,
        day: 1,
        activities: [
          {
            id: 'morning-stretch',
            name: 'Morning Stretch',
            duration: '15 minutes',
            instructions: 'Start with gentle stretching exercises to warm up your body',
            equipment: ['Yoga mat'],
            difficulty: 'Beginner',
            calories: 50
          },
          {
            id: 'cardio-walk',
            name: 'Cardio Walk',
            duration: '30 minutes',
            instructions: 'Take a brisk walk around your neighborhood or on a treadmill',
            equipment: ['Comfortable shoes'],
            difficulty: 'Beginner',
            calories: 150
          }
        ]
      }
    ];

    return {
      success: true,
      activities: fallbackActivities
    };
  }
};