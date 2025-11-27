import { supabase } from '@/integrations/supabase/client';

interface PlanActivitiesRequest {
  selectedPlan: any;
  userProfile: any;
  primaryGoal: string;
  healthScore?: number;
  activityDate?: string;
}

interface PlanActivitiesResponse {
  success: boolean;
  data?: any;
  meta?: any;
  error?: string;
  activities?: any[];
}

// Generate daily activities for selected plan
export const generatePlanActivities = async (request: PlanActivitiesRequest): Promise<PlanActivitiesResponse> => {
  try {
    console.log('🔍 Generating daily activities for selected plan...');
    const userId = request.userProfile?.id;
    if (!userId) {
      throw new Error('User profile missing id');
    }

    const activityDate = request.activityDate || new Date().toISOString().split('T')[0];
    
    // Add timeout to prevent hanging
    const timeoutPromise = new Promise((_, reject) => 
      setTimeout(() => reject(new Error('Plan activities generation timeout')), 60000)
    );
    
    const activitiesPromise = supabase.functions.invoke('plan-activities', {
      body: {
        selectedPlan: request.selectedPlan,
        userProfile: request.userProfile,
        primaryGoal: request.primaryGoal
      }
    });
    
    const response = await Promise.race([activitiesPromise, timeoutPromise]) as any;
    
    console.log('📊 Plan activities response:', response);
    
    if (response.error) {
      console.error('❌ Plan activities response error:', response.error);
      throw new Error(response.error.message || 'Plan activities generation failed');
    }
    
    const data = response.data;
    console.log('📊 Plan activities data:', data);
    
    if (!data.success) {
      console.error('❌ Plan activities generation failed:', data.error);
      throw new Error(data.error || 'Plan activities generation failed');
    }
    
    console.log('✅ Daily activities generated successfully');
    
    // Save activities to database
    if (data.data && data.data.schedule) {
      try {
        // Archive any previously selected plans so the new one becomes active
        const { error: archiveError } = await supabase
          .from('health_plans')
          .update({ status: 'archived' })
          .eq('user_id', userId)
          .eq('status', 'selected');

        if (archiveError) {
          console.warn('⚠️ Failed to archive previous plans:', archiveError);
        }

        // First, save the selected plan with complete JSON data
        console.log('💾 Saving selected plan to health_plans table:', request.selectedPlan.name);
        const { data: planData, error: planError } = await supabase
          .from('health_plans')
          .insert({
            user_id: userId,
            plan_name: `${request.selectedPlan.name} Plan`,
            plan_type: 'health_transformation',
            primary_goal: request.primaryGoal,
            start_date: new Date().toISOString().split('T')[0],
            target_end_date: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            duration_weeks: parseInt(request.selectedPlan.duration?.split('-')[1]?.replace('w', '')) || 12,
            plan_data: {
              selected_plan: request.selectedPlan,
              user_context: {
                primaryGoal: request.primaryGoal,
                healthScore: request.healthScore
              }
            },
            plan_data_json: {
              selected_plan: request.selectedPlan,
              user_context: {
                primaryGoal: request.primaryGoal,
                healthScore: request.healthScore
              },
              generation_meta: {
                ai_provider: 'Groq-API',
                model: 'llama-3.3-70b-versatile',
                generated_at: new Date().toISOString()
              }
            },
            status: 'selected',
            generation_model: 'llama-3.3-70b-versatile'
          })
          .select('id')
          .single();

        let planId: string | null = null;
        if (planError) {
          console.error('❌ Error saving plan to database:', planError);
        } else {
          planId = planData?.id;
          console.log('✅ Plan saved to database successfully');
        }

        // Then save the daily activities
        console.log('💾 Saving daily activities to daily_activities table:', data.data.schedule.length, 'activities');
        const { error: saveError } = await supabase.rpc('save_daily_activities', {
          p_user_id: userId,
          p_plan_id: planId,
          p_activity_date: activityDate,
          p_activities: data.data.schedule
        });
        
        if (saveError) {
          console.error('❌ Error saving activities to database:', saveError);
        } else {
          console.log('✅ Activities saved to database successfully');
        }
      } catch (dbError) {
        console.error('❌ Database save error:', dbError);
      }
    }
    
    // Load persisted activities so the UI gets IDs/is_completed flags
    const persistedActivities = await fetchDailyActivities(userId, activityDate);
    if (!persistedActivities.success) {
      console.warn('⚠️ Activities saved but could not be reloaded:', persistedActivities.error);
    }
    
    return {
      success: true,
      data: persistedActivities.data || data.data,
      meta: {
        ...(data.meta || {}),
        activityDate
      },
      activities: persistedActivities.data?.schedule || data.data?.schedule
    };
    
  } catch (error) {
    console.error('❌ Plan activities generation error:', error);
    
    // Return fallback activities if API fails
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to generate plan activities',
      data: generateFallbackActivities(request.selectedPlan, request.userProfile)
    };
  }
};

// Fetch saved daily activities from database
export const fetchDailyActivities = async (userId: string, activityDate?: string): Promise<PlanActivitiesResponse> => {
  try {
    console.log('🔍 Fetching daily activities from database...');
    
    const date = activityDate || new Date().toISOString().split('T')[0];
    
    console.log('🔍 Function call parameters:', {
      userId,
      date,
      userIdType: typeof userId,
      dateType: typeof date
    });
    
    const { data, error } = await supabase.rpc('get_user_daily_activities', {
      p_user_id: userId,
      p_activity_date: date
    });
    
    if (error) {
      console.error('❌ Error fetching activities from database:', error);
      console.error('❌ Error details:', {
        code: error.code,
        message: error.message,
        details: error.details,
        hint: error.hint
      });
      throw new Error(error.message || 'Failed to fetch daily activities');
    }
    
    console.log('✅ Daily activities fetched from database:', data?.length);
    console.log('📊 Activities data structure:', data);
    
    return {
      success: true,
      data: { schedule: data || [] },
      meta: {
        source: 'database',
        timestamp: new Date().toISOString()
      },
      activities: data || []
    };
    
  } catch (error) {
    console.error('❌ Error fetching daily activities:', error);
    
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch daily activities'
    };
  }
};

// Mark activity as completed
export const markActivityCompleted = async (activityId: string, userId: string, notes?: string): Promise<boolean> => {
  try {
    console.log('🔍 Marking activity as completed:', activityId);
    
    const { data, error } = await supabase.rpc('mark_activity_completed', {
      p_activity_id: activityId,
      p_user_id: userId,
      p_notes: notes || null
    });
    
    if (error) {
      console.error('❌ Error marking activity as completed:', error);
      return false;
    }
    
    console.log('✅ Activity marked as completed');
    return true;
    
  } catch (error) {
    console.error('❌ Error marking activity as completed:', error);
    return false;
  }
};

// Fallback activities when API is not available
const generateFallbackActivities = (selectedPlan: any, userProfile: any) => {
  const wakeTime = userProfile.wake_up_time || '07:00';
  const workStart = userProfile.work_start || '09:00';
  const workEnd = userProfile.work_end || '17:00';
  const sleepTime = userProfile.sleep_time || '23:00';
  
  return {
    schedule: [
      {
        time: wakeTime,
        activity: "Morning Routine",
        duration: "30min",
        category: "morning",
        food: "Oatmeal 50g + Banana 1 medium + Almonds 10g",
        instructions: ["Step 1: Boil water", "Step 2: Add oats", "Step 3: Cook 5 minutes"],
        exercise: "10 pushups, 15 squats",
        health_tip: "Start slow to avoid stress"
      },
      {
        time: "08:00",
        activity: "Workout Session",
        duration: "45min",
        category: "exercise",
        food: "Water 500ml",
        instructions: ["Step 1: Warm up 5 minutes", "Step 2: Main workout 30 minutes", "Step 3: Cool down 10 minutes"],
        exercise: selectedPlan.workoutFrequency || "3 days/week",
        health_tip: "Listen to your body and adjust intensity"
      },
      {
        time: "09:00",
        activity: "Breakfast",
        duration: "20min",
        category: "meal",
        food: selectedPlan.calorieTarget ? `${selectedPlan.calorieTarget} calories` : "Balanced meal",
        instructions: ["Step 1: Prepare ingredients", "Step 2: Cook according to plan", "Step 3: Enjoy mindfully"],
        exercise: "Light stretching",
        health_tip: "Eat slowly and mindfully"
      },
      {
        time: workStart,
        activity: "Work Session",
        duration: "8 hours",
        category: "work",
        food: "Healthy snacks every 2 hours",
        instructions: ["Step 1: Set up workspace", "Step 2: Focus on tasks", "Step 3: Take regular breaks"],
        exercise: "Desk stretches every hour",
        health_tip: "Take breaks to maintain productivity"
      },
      {
        time: workEnd,
        activity: "Evening Routine",
        duration: "60min",
        category: "evening",
        food: "Dinner according to plan",
        instructions: ["Step 1: Wind down from work", "Step 2: Prepare dinner", "Step 3: Relax and unwind"],
        exercise: "Light yoga or stretching",
        health_tip: "Create a relaxing environment"
      },
      {
        time: sleepTime,
        activity: "Sleep Preparation",
        duration: "30min",
        category: "sleep",
        food: "Herbal tea or warm milk",
        instructions: ["Step 1: Turn off screens", "Step 2: Prepare for bed", "Step 3: Practice relaxation"],
        exercise: "Gentle breathing exercises",
        health_tip: "Maintain consistent sleep schedule"
      }
    ]
  };
};