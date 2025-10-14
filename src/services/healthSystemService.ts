// Comprehensive Health System Service
import { supabase } from '@/integrations/supabase/client';

// Check if user has an existing health plan
export const checkExistingUserPlan = async (userId: string): Promise<HealthPlan | null> => {
  try {
    console.log('🔍 Checking for existing user plan for user:', userId);
    
    const { data, error } = await supabase
      .from('user_selected_health_plans')
      .select('*')
      .eq('user_id', userId)
      .eq('status', 'active')
      .order('selected_at', { ascending: false })
      .limit(1)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        console.log('📋 No existing plan found for user');
        return null;
      }
      throw error;
    }

    console.log('✅ Found existing plan:', data.plan_name);
    return data;
  } catch (error) {
    console.error('❌ Error checking existing user plan:', error);
    return null;
  }
};

// Load existing user plan with activities
export const loadExistingUserPlan = async (userId: string): Promise<{
  plan: HealthPlan;
  activities: any[];
} | null> => {
  try {
    console.log('🔄 Loading existing user plan and activities for user:', userId);
    
    // Get the user's active plan
    const plan = await checkExistingUserPlan(userId);
    if (!plan) {
      console.log('📋 No active plan found');
      return null;
    }

    // Extract activities from plan_data JSON
    let activities: any[] = [];
    if (plan.plan_data && typeof plan.plan_data === 'object') {
      if (plan.plan_data.activities && Array.isArray(plan.plan_data.activities)) {
        activities = plan.plan_data.activities;
        console.log(`✅ Extracted ${activities.length} activities from plan_data`);
      } else {
        console.log('📋 No activities found in plan_data');
      }
    } else {
      console.log('📋 plan_data is not a valid object');
    }

    console.log(`✅ Loaded ${activities.length} activities for plan: ${plan.plan_name}`);
    return { plan, activities };
  } catch (error) {
    console.error('❌ Error loading existing user plan:', error);
    return null;
  }
};

// Types for the health system
export interface HealthPlan {
  id: string;
  plan_name: string;
  plan_type: string;
  primary_goal: string;
  plan_data: any;
  status: 'active' | 'completed' | 'paused';
  selected_at: string;
}

export interface DailyActivity {
  id: string;
  user_id: string;
  plan_id: string;
  activity_date: string;
  activity_type: 'workout' | 'meal' | 'sleep' | 'meditation' | 'hydration' | 'other';
  activity_title: string;
  activity_description: string;
  scheduled_time: string;
  duration_minutes: number;
  activity_data: any;
  status: 'pending' | 'completed' | 'skipped' | 'in_progress';
  completed_at?: string;
  user_notes?: string;
}

export interface ActivityCompletion {
  id: string;
  user_id: string;
  activity_id: string;
  completed_at: string;
  completion_notes?: string;
  user_rating?: number;
}

export interface DailyProgress {
  id: string;
  user_id: string;
  progress_date: string;
  total_activities: number;
  completed_activities: number;
  skipped_activities: number;
  completion_percentage: number;
  daily_notes?: string;
  energy_level?: number;
  mood_rating?: number;
}

// Step 1: Save user's selected health plan
export const saveSelectedHealthPlan = async (
  userId: string,
  planName: string,
  planType: string,
  primaryGoal: string,
  planData: any
) => {
  try {
    console.log('💾 Saving selected health plan for user:', userId);
    
    // First, try to deactivate any existing active plans
    try {
      const { error: updateError } = await supabase
        .from('user_selected_health_plans')
        .update({ status: 'paused' })
        .eq('user_id', userId)
        .eq('status', 'active');
      
      if (updateError && (updateError.status === 404 || updateError.code === 'PGRST116')) {
        console.warn('⚠️ Could not update existing plans (table might not exist):', updateError);
      }
    } catch (updateError) {
      console.warn('⚠️ Could not update existing plans (table might not exist):', updateError);
    }

    // Insert new selected plan
    const { data, error } = await supabase
      .from('user_selected_health_plans')
      .insert({
        user_id: userId,
        plan_name: planName,
        plan_type: planType,
        primary_goal: primaryGoal,
        plan_data: planData,
        status: 'active'
      })
      .select()
      .single();

    if (error) {
      if (error.code === 'PGRST301' || error.code === 'PGRST116' || error.status === 404 || 
          error.message?.includes('relation') || error.message?.includes('does not exist') ||
          error.message?.includes('404') || error.message?.includes('Not Found')) {
        console.warn('⚠️ user_selected_health_plans table does not exist. Plan selection will be stored in localStorage as fallback.');
        // Store in localStorage as fallback
        const planData = {
          userId,
          planName,
          planType,
          primaryGoal,
          planData,
          status: 'active',
          selectedAt: new Date().toISOString()
        };
        localStorage.setItem('selectedHealthPlan', JSON.stringify(planData));
        
        return {
          success: true,
          data: planData,
          fallback: true
        };
      }
      throw error;
    }

    console.log('✅ Health plan saved successfully');
    return {
      success: true,
      data
    };
  } catch (error) {
    console.error('❌ Failed to save health plan:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to save health plan'
    };
  }
};

// Step 2: Generate daily activities for a specific date
export const generateDailyActivities = async (
  userId: string,
  targetDate: string,
  previousDayData?: any
) => {
  try {
    console.log('📅 Generating daily activities for:', targetDate);
    
    // Get user's active plan
    const { data: activePlan, error: planError } = await supabase
      .from('user_selected_health_plans')
      .select('*')
      .eq('user_id', userId)
      .eq('status', 'active')
      .single();

    if (planError || !activePlan) {
      return {
        success: false,
        error: 'No active health plan found'
      };
    }

    // Get previous day's activities to avoid repetition
    const { data: previousActivities } = await supabase
      .from('daily_health_activities')
      .select('activity_type, activity_title, activity_data')
      .eq('user_id', userId)
      .eq('activity_date', previousDayData?.date || new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString().split('T')[0])
      .order('scheduled_time');

    // Generate fresh activities (this would call your AI service)
    const generatedActivities = await generateFreshDailyActivities(
      activePlan,
      targetDate,
      previousActivities || []
    );

    // Save activities to database
    const activitiesToInsert = generatedActivities.map(activity => ({
      user_id: userId,
      plan_id: activePlan.id,
      activity_date: targetDate,
      ...activity
    }));

    const { data: savedActivities, error: saveError } = await supabase
      .from('daily_health_activities')
      .insert(activitiesToInsert)
      .select();

    if (saveError) throw saveError;

    console.log('✅ Daily activities generated and saved');
    return {
      success: true,
      data: savedActivities
    };
  } catch (error) {
    console.error('❌ Failed to generate daily activities:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to generate daily activities'
    };
  }
};

// Step 3: Mark activity as completed
export const markActivityCompleted = async (
  userId: string,
  activityId: string,
  completionNotes?: string,
  userRating?: number
) => {
  try {
    console.log('✅ Marking activity as completed:', activityId);
    
    // Update activity status
    const { error: updateError } = await supabase
      .from('daily_health_activities')
      .update({
        status: 'completed',
        completed_at: new Date().toISOString(),
        user_notes: completionNotes
      })
      .eq('id', activityId)
      .eq('user_id', userId);

    if (updateError) throw updateError;

    // Record completion
    const { error: completionError } = await supabase
      .from('activity_completions')
      .insert({
        user_id: userId,
        activity_id: activityId,
        completion_notes: completionNotes,
        user_rating: userRating
      });

    if (completionError) throw completionError;

    // Update daily progress
    await updateDailyProgress(userId, new Date().toISOString().split('T')[0]);

    console.log('✅ Activity marked as completed');

    // Auto-trigger next day's generation if we just completed yesterday's or day-before's final activity
    try {
      const today = new Date().toISOString().split('T')[0];
      const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString().split('T')[0];
      const dayBefore = new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

      // Get the activity we marked to identify its date
      const { data: updatedActivity } = await supabase
        .from('daily_health_activities')
        .select('activity_date, activity_type')
        .eq('id', activityId)
        .eq('user_id', userId)
        .maybeSingle();

      const activityDate = updatedActivity?.activity_date as string | undefined;

      if (activityDate === yesterday || activityDate === dayBefore) {
        // If this was a sleep activity or the last pending activity, generate for the next day
        const nextDate = new Date(new Date(activityDate).getTime() + 24 * 60 * 60 * 1000)
          .toISOString()
          .split('T')[0];

        // Check if next day already exists
        const { data: nextDayExisting } = await supabase
          .from('daily_health_activities')
          .select('id')
          .eq('user_id', userId)
          .eq('activity_date', nextDate)
          .limit(1);

        if (!nextDayExisting || nextDayExisting.length === 0) {
          // Fetch previous day activities for variation
          const { data: prevDayActivities } = await supabase
            .from('daily_health_activities')
            .select('activity_type, activity_title, activity_data')
            .eq('user_id', userId)
            .eq('activity_date', activityDate)
            .order('scheduled_time');

          // Generate next day's activities with context
          await generateDailyActivities(userId, nextDate, {
            date: activityDate,
            activities: prevDayActivities || []
          });
        }
      }
    } catch (autoGenError) {
      console.warn('⚠️ Auto-generation for next day failed:', autoGenError);
    }
    return {
      success: true
    };
  } catch (error) {
    console.error('❌ Failed to mark activity as completed:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to mark activity as completed'
    };
  }
};

// Step 4: Get today's activities
export const getTodaysActivities = async (userId: string) => {
  try {
    const today = new Date().toISOString().split('T')[0];
    
    const { data: activities, error } = await supabase
      .from('daily_health_activities')
      .select('*')
      .eq('user_id', userId)
      .eq('activity_date', today)
      .order('scheduled_time');

    if (error) throw error;

    return {
      success: true,
      data: activities || []
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to get today\'s activities'
    };
  }
};

// Step 5: Check if next day generation is needed
export const checkAndGenerateNextDay = async (userId: string) => {
  try {
    const today = new Date().toISOString().split('T')[0];
    const tomorrow = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    
    // Check if today's last activity (sleep) is completed
    const { data: lastActivity } = await supabase
      .from('daily_health_activities')
      .select('*')
      .eq('user_id', userId)
      .eq('activity_date', today)
      .eq('activity_type', 'sleep')
      .single();

    if (lastActivity && lastActivity.status === 'completed') {
      // Check if tomorrow's activities already exist
      const { data: tomorrowActivities } = await supabase
        .from('daily_health_activities')
        .select('id')
        .eq('user_id', userId)
        .eq('activity_date', tomorrow)
        .limit(1);

      if (!tomorrowActivities || tomorrowActivities.length === 0) {
        console.log('🔄 Generating next day activities...');
        
        // Get today's progress data for context
        const { data: todayProgress } = await supabase
          .from('daily_progress_summary')
          .select('*')
          .eq('user_id', userId)
          .eq('progress_date', today)
          .single();

        // Generate tomorrow's activities
        const result = await generateDailyActivities(userId, tomorrow, {
          date: today,
          progress: todayProgress
        });

        if (result.success) {
          console.log('✅ Next day activities generated successfully');
        }
      }
    }

    return {
      success: true
    };
  } catch (error) {
    console.error('❌ Failed to check and generate next day:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to check and generate next day'
    };
  }
};

// Helper function to generate fresh daily activities (AI integration)
const generateFreshDailyActivities = async (
  activePlan: HealthPlan,
  targetDate: string,
  previousActivities: any[]
) => {
  try {
    console.log('🤖 Generating fresh daily activities via AI...');
    
    // Get user profile for context
    const { data: userProfile } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('id', activePlan.user_id)
      .single();

    // Get previous day's progress for context
    const previousDate = new Date(new Date(targetDate).getTime() - 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    const { data: previousProgress } = await supabase
      .from('daily_progress_summary')
      .select('*')
      .eq('user_id', activePlan.user_id)
      .eq('progress_date', previousDate)
      .single();

    // Call your existing AI service to generate fresh activities
    const { data, error } = await supabase.functions.invoke('plan-activities', {
      body: {
        userProfile: userProfile,
        selectedPlan: activePlan.plan_data,
        targetDate: targetDate,
        previousActivities: previousActivities,
        previousProgress: previousProgress,
        requirements: {
          avoidRepetition: true,
          freshContent: true,
          personalizedToUser: true,
          considerPreviousDay: true
        }
      }
    });

    if (error) {
      console.error('❌ AI service error:', error);
      throw new Error(`AI service error: ${error.message}`);
    }

    if (data && data.activities) {
      console.log('✅ Fresh activities generated by AI');
      
      // Transform AI response to our activity format
      return data.activities.map((activity: any, index: number) => ({
        activity_type: activity.type || 'other',
        activity_title: activity.title || `Activity ${index + 1}`,
        activity_description: activity.description || 'Daily health activity',
        scheduled_time: activity.scheduled_time || '09:00',
        duration_minutes: activity.duration_minutes || 30,
        activity_data: {
          ...activity.details,
          generated_by: 'ai',
          target_date: targetDate,
          plan_id: activePlan.id
        }
      }));
    } else {
      throw new Error('No activities generated from AI service');
    }
  } catch (error) {
    console.error('❌ Failed to generate fresh activities:', error);
    
    // Fallback to basic activities if AI fails
    return [
      {
        activity_type: 'workout',
        activity_title: 'Morning Exercise',
        activity_description: 'Daily workout routine',
        scheduled_time: '07:00',
        duration_minutes: 30,
        activity_data: {
          exercise_type: 'general',
          intensity: 'moderate',
          equipment: 'none',
          generated_by: 'fallback'
        }
      },
      {
        activity_type: 'meal',
        activity_title: 'Healthy Meal',
        activity_description: 'Balanced nutrition',
        scheduled_time: '08:00',
        duration_minutes: 20,
        activity_data: {
          meal_type: 'breakfast',
          calories: 400,
          nutrients: ['protein', 'fiber'],
          generated_by: 'fallback'
        }
      },
      {
        activity_type: 'sleep',
        activity_title: 'Quality Sleep',
        activity_description: 'Restorative sleep',
        scheduled_time: '22:00',
        duration_minutes: 480,
        activity_data: {
          sleep_duration: 8,
          sleep_quality: 'good',
          generated_by: 'fallback'
        }
      }
    ];
  }
};

// Helper function to update daily progress
const updateDailyProgress = async (userId: string, date: string) => {
  try {
    const { data: activities } = await supabase
      .from('daily_health_activities')
      .select('status')
      .eq('user_id', userId)
      .eq('activity_date', date);

    if (activities) {
      const total = activities.length;
      const completed = activities.filter(a => a.status === 'completed').length;
      const skipped = activities.filter(a => a.status === 'skipped').length;
      const completionPercentage = total > 0 ? (completed / total) * 100 : 0;

      await supabase
        .from('daily_progress_summary')
        .upsert({
          user_id: userId,
          progress_date: date,
          total_activities: total,
          completed_activities: completed,
          skipped_activities: skipped,
          completion_percentage: completionPercentage
        });
    }
  } catch (error) {
    console.error('Failed to update daily progress:', error);
  }
};

// Get user's active health plan
export const getActiveHealthPlan = async (userId: string) => {
  try {
    const { data: plan, error } = await supabase
      .from('user_selected_health_plans')
      .select('*')
      .eq('user_id', userId)
      .eq('status', 'active')
      .single();

    if (error && error.code !== 'PGRST116') throw error;

    return {
      success: true,
      data: plan
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to get active health plan'
    };
  }
};

// Get daily progress summary
export const getDailyProgress = async (userId: string, date: string) => {
  try {
    const { data: progress, error } = await supabase
      .from('daily_progress_summary')
      .select('*')
      .eq('user_id', userId)
      .eq('progress_date', date)
      .single();

    if (error && error.code !== 'PGRST116') throw error;

    return {
      success: true,
      data: progress
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to get daily progress'
    };
  }
};
