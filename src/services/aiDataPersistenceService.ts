// AI Data Persistence Service
// Integrates with actual AI functions: health-score, health-plans, plan-activities
import { supabase } from '@/integrations/supabase/client';

// Types based on your actual AI function responses
export interface HealthScoreData {
  healthScore: number;
  analysis: string;
  recommendations: string[];
  meta?: {
    provider: string;
    timestamp: string;
  };
}

export interface HealthPlanData {
  id: string;
  title: string;
  description: string;
  duration: string;
  difficulty: string;
  focusAreas: string[];
  estimatedCalories: number;
  equipment: string[];
  benefits: string[];
}

export interface PlanActivitiesData {
  week: number;
  day: number;
  activities: {
    id: string;
    name: string;
    duration: string;
    instructions: string;
    equipment: string[];
    difficulty: string;
    calories: number;
  }[];
}

export interface UserProfile {
  id: string;
  age?: string;
  gender?: string;
  height_cm?: string;
  weight_kg?: string;
  blood_group?: string;
  chronic_conditions?: string[];
  medications?: string[];
  health_goals?: string[];
  diet_type?: string;
  workout_time?: string;
  sleep_time?: string;
  wake_up_time?: string;
  [key: string]: any;
}

class AIDataPersistenceService {
  // Save health score data
  async saveHealthScore(
    userId: string,
    healthScoreData: HealthScoreData,
    userInput?: string,
    uploadedFiles?: any[],
    voiceTranscript?: string
  ): Promise<any> {
    try {
      const { data, error } = await supabase
        .from('user_health_scores')
        .insert([{
          user_id: userId,
          health_score: healthScoreData.healthScore,
          analysis: healthScoreData.analysis,
          recommendations: healthScoreData.recommendations,
          user_input: userInput,
          uploaded_files: uploadedFiles || [],
          voice_transcript: voiceTranscript,
          ai_provider: healthScoreData.meta?.provider || 'Unknown',
          generation_timestamp: healthScoreData.meta?.timestamp || new Date().toISOString()
        }])
        .select()
        .single();

      if (error) {
        console.error('Error saving health score:', error);
        throw new Error(`Failed to save health score: ${error.message}`);
      }

      console.log('✅ Health score saved:', data.id);
      return data;
    } catch (error) {
      console.error('Error in saveHealthScore:', error);
      throw error;
    }
  }

  // Save health plans data
  async saveHealthPlans(
    userId: string,
    plans: HealthPlanData[],
    aiProvider: string = 'Unknown'
  ): Promise<any[]> {
    try {
      const savedPlans = [];
      
      for (const plan of plans) {
        // Calculate total weeks from duration string
        const totalWeeks = this.extractWeeksFromDuration(plan.duration);
        
        const { data, error } = await supabase
          .from('user_health_plans')
          .insert([{
            user_id: userId,
            plan_id: plan.id,
            title: plan.title,
            description: plan.description,
            duration: plan.duration,
            difficulty: plan.difficulty,
            focus_areas: plan.focusAreas,
            estimated_calories: plan.estimatedCalories,
            equipment: plan.equipment,
            benefits: plan.benefits,
            total_weeks: totalWeeks,
            ai_provider: aiProvider,
            generation_timestamp: new Date().toISOString()
          }])
          .select()
          .single();

        if (error) {
          console.error('Error saving health plan:', error);
          throw new Error(`Failed to save health plan: ${error.message}`);
        }

        savedPlans.push(data);
        console.log('✅ Health plan saved:', data.id);
      }

      return savedPlans;
    } catch (error) {
      console.error('Error in saveHealthPlans:', error);
      throw error;
    }
  }

  // Save plan activities data
  async savePlanActivities(
    userId: string,
    planId: string,
    activities: PlanActivitiesData[],
    aiProvider: string = 'Unknown'
  ): Promise<any[]> {
    try {
      const savedActivities = [];
      
      for (const weekData of activities) {
        for (const activity of weekData.activities) {
          const { data, error } = await supabase
            .from('user_plan_activities')
            .insert([{
              user_id: userId,
              plan_id: planId,
              activity_id: activity.id,
              name: activity.name,
              duration: activity.duration,
              instructions: activity.instructions,
              equipment: activity.equipment,
              difficulty: activity.difficulty,
              calories: activity.calories,
              week_number: weekData.week,
              day_number: weekData.day,
              ai_provider: aiProvider,
              generation_timestamp: new Date().toISOString()
            }])
            .select()
            .single();

          if (error) {
            console.error('Error saving plan activity:', error);
            throw new Error(`Failed to save plan activity: ${error.message}`);
          }

          savedActivities.push(data);
        }
      }

      console.log(`✅ Saved ${savedActivities.length} plan activities`);
      return savedActivities;
    } catch (error) {
      console.error('Error in savePlanActivities:', error);
      throw error;
    }
  }

  // Save AI session data
  async saveAISession(
    userId: string,
    sessionType: string,
    sessionPurpose: string,
    userInput: string,
    aiResponse: string,
    generatedContent: any,
    aiProvider: string,
    relatedPlanId?: string,
    relatedHealthScoreId?: string
  ): Promise<any> {
    try {
      const { data, error } = await supabase
        .from('user_ai_sessions')
        .insert([{
          user_id: userId,
          session_type: sessionType,
          session_purpose: sessionPurpose,
          user_input: userInput,
          ai_response: aiResponse,
          generated_content: generatedContent,
          related_plan_id: relatedPlanId,
          related_health_score_id: relatedHealthScoreId,
          ai_provider: aiProvider,
          generation_timestamp: new Date().toISOString()
        }])
        .select()
        .single();

      if (error) {
        console.error('Error saving AI session:', error);
        throw new Error(`Failed to save AI session: ${error.message}`);
      }

      console.log('✅ AI session saved:', data.id);
      return data;
    } catch (error) {
      console.error('Error in saveAISession:', error);
      throw error;
    }
  }

  // Get user's latest health score
  async getLatestHealthScore(userId: string): Promise<any | null> {
    try {
      const { data, error } = await supabase
        .from('user_health_scores')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching latest health score:', error);
        throw new Error(`Failed to fetch latest health score: ${error.message}`);
      }

      return data;
    } catch (error) {
      console.error('Error in getLatestHealthScore:', error);
      return null;
    }
  }

  // Get user's active health plan
  async getActiveHealthPlan(userId: string): Promise<any | null> {
    try {
      const { data, error } = await supabase
        .from('user_health_plans')
        .select('*')
        .eq('user_id', userId)
        .eq('is_active', true)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching active health plan:', error);
        throw new Error(`Failed to fetch active health plan: ${error.message}`);
      }

      return data;
    } catch (error) {
      console.error('Error in getActiveHealthPlan:', error);
      return null;
    }
  }

  // Get user's health plans
  async getUserHealthPlans(userId: string): Promise<any[]> {
    try {
      const { data, error } = await supabase
        .from('user_health_plans')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching user health plans:', error);
        throw new Error(`Failed to fetch user health plans: ${error.message}`);
      }

      return data || [];
    } catch (error) {
      console.error('Error in getUserHealthPlans:', error);
      return [];
    }
  }

  // Get plan activities for a specific plan
  async getPlanActivities(userId: string, planId: string): Promise<any[]> {
    try {
      const { data, error } = await supabase
        .from('user_plan_activities')
        .select('*')
        .eq('user_id', userId)
        .eq('plan_id', planId)
        .order('week_number', { ascending: true })
        .order('day_number', { ascending: true });

      if (error) {
        console.error('Error fetching plan activities:', error);
        throw new Error(`Failed to fetch plan activities: ${error.message}`);
      }

      return data || [];
    } catch (error) {
      console.error('Error in getPlanActivities:', error);
      return [];
    }
  }

  // Get today's activities for user
  async getTodayActivities(userId: string): Promise<any[]> {
    try {
      const today = new Date().toISOString().split('T')[0];
      
      const { data, error } = await supabase
        .from('user_plan_activities')
        .select('*')
        .eq('user_id', userId)
        .eq('scheduled_date', today)
        .order('scheduled_time', { ascending: true });

      if (error) {
        console.error('Error fetching today activities:', error);
        throw new Error(`Failed to fetch today activities: ${error.message}`);
      }

      return data || [];
    } catch (error) {
      console.error('Error in getTodayActivities:', error);
      return [];
    }
  }

  // Update activity completion
  async updateActivityCompletion(
    activityId: string,
    completionData: {
      is_completed?: boolean;
      completion_percentage?: number;
      completed_at?: string;
      actual_duration?: number;
      actual_calories?: number;
      difficulty_rating?: number;
      satisfaction_rating?: number;
      energy_level_before?: number;
      energy_level_after?: number;
      user_notes?: string;
    }
  ): Promise<void> {
    try {
      const { error } = await supabase
        .from('user_plan_activities')
        .update(completionData)
        .eq('id', activityId);

      if (error) {
        console.error('Error updating activity completion:', error);
        throw new Error(`Failed to update activity completion: ${error.message}`);
      }

      console.log('✅ Activity completion updated');
    } catch (error) {
      console.error('Error in updateActivityCompletion:', error);
      throw error;
    }
  }

  // Set active plan
  async setActivePlan(userId: string, planId: string): Promise<void> {
    try {
      // First, deactivate all other plans
      await supabase
        .from('user_health_plans')
        .update({ is_active: false })
        .eq('user_id', userId);

      // Then activate the selected plan
      const { error } = await supabase
        .from('user_health_plans')
        .update({ is_active: true, status: 'active' })
        .eq('id', planId)
        .eq('user_id', userId);

      if (error) {
        console.error('Error setting active plan:', error);
        throw new Error(`Failed to set active plan: ${error.message}`);
      }

      console.log('✅ Active plan set:', planId);
    } catch (error) {
      console.error('Error in setActivePlan:', error);
      throw error;
    }
  }

  // Get user's complete data summary
  async getUserDataSummary(userId: string): Promise<{
    healthScore: any | null;
    activePlan: any | null;
    allPlans: any[];
    todayActivities: any[];
    recentSessions: any[];
  }> {
    try {
      const [
        healthScore,
        activePlan,
        allPlans,
        todayActivities,
        recentSessions
      ] = await Promise.all([
        this.getLatestHealthScore(userId),
        this.getActiveHealthPlan(userId),
        this.getUserHealthPlans(userId),
        this.getTodayActivities(userId),
        this.getRecentAISessions(userId)
      ]);

      return {
        healthScore,
        activePlan,
        allPlans,
        todayActivities,
        recentSessions
      };
    } catch (error) {
      console.error('Error in getUserDataSummary:', error);
      throw error;
    }
  }

  // Check if user has existing data
  async hasExistingData(userId: string): Promise<boolean> {
    try {
      const { data, error } = await supabase
        .from('user_health_plans')
        .select('id')
        .eq('user_id', userId)
        .limit(1);

      if (error) {
        console.error('Error checking existing data:', error);
        return false;
      }

      return data && data.length > 0;
    } catch (error) {
      console.error('Error in hasExistingData:', error);
      return false;
    }
  }

  // Private helper methods
  private extractWeeksFromDuration(duration: string): number {
    const match = duration.match(/(\d+)\s*weeks?/i);
    return match ? parseInt(match[1]) : 4; // Default to 4 weeks
  }

  private async getRecentAISessions(userId: string): Promise<any[]> {
    try {
      const { data, error } = await supabase
        .from('user_ai_sessions')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(10);

      if (error) {
        console.error('Error fetching recent AI sessions:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Error in getRecentAISessions:', error);
      return [];
    }
  }
}

export const aiDataPersistenceService = new AIDataPersistenceService();
