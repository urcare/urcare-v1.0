// Unified Health Plan Service
// Replaces: healthPlanService.ts, health_plans, user_health_plans, user_selected_health_plans
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

interface HealthPlanData {
  id: string;
  user_id: string;
  plan_name: string;
  plan_type: string;
  primary_goal: string;
  secondary_goals: string[];
  plan_data: any;
  status: string;
  duration_weeks: number;
  start_date: string;
  end_date?: string;
  actual_end_date?: string;
  progress_percentage: number;
  weekly_compliance_rate?: number;
  monthly_compliance_rate?: number;
  is_selected: boolean;
  is_active: boolean;
  selected_plan_id?: string;
  health_analysis_id?: string;
  user_input?: string;
  ai_provider: string;
  generation_timestamp?: string;
  processing_time_ms?: number;
  generation_model?: string;
  generation_parameters?: any;
  timeline_adjustments?: any;
  intensity_adjustments?: any;
  completion_reason?: string;
  created_at: string;
  updated_at: string;
}

class UnifiedHealthPlanService {
  /**
   * Generate health plans using Supabase Functions
   */
  async generateHealthPlans(request: HealthPlanRequest): Promise<HealthPlanResponse> {
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
  }

  /**
   * Save selected health plan
   */
  async saveSelectedHealthPlan(userId: string, plan: HealthPlan) {
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
  }

  /**
   * Get user's health plans
   */
  async getUserHealthPlans(userId: string): Promise<HealthPlanData[]> {
    try {
      const { data, error } = await supabase
        .from('health_plans_unified')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;

      return data || [];
    } catch (error) {
      console.error('Error fetching user health plans:', error);
      return [];
    }
  }

  /**
   * Get user's active health plan
   */
  async getActiveHealthPlan(userId: string): Promise<HealthPlanData | null> {
    try {
      const { data, error } = await supabase
        .from('health_plans_unified')
        .select('*')
        .eq('user_id', userId)
        .eq('is_active', true)
        .eq('status', 'active')
        .single();

      if (error && error.code !== 'PGRST116') { // PGRST116 is "no rows returned"
        throw error;
      }

      return data || null;
    } catch (error) {
      console.error('Error fetching active health plan:', error);
      return null;
    }
  }

  /**
   * Get user's selected health plan
   */
  async getSelectedHealthPlan(userId: string): Promise<HealthPlanData | null> {
    try {
      const { data, error } = await supabase
        .from('health_plans_unified')
        .select('*')
        .eq('user_id', userId)
        .eq('is_selected', true)
        .single();

      if (error && error.code !== 'PGRST116') { // PGRST116 is "no rows returned"
        throw error;
      }

      return data || null;
    } catch (error) {
      console.error('Error fetching selected health plan:', error);
      return null;
    }
  }

  /**
   * Create a new health plan
   */
  async createHealthPlan(userId: string, planData: Partial<HealthPlanData>): Promise<HealthPlanData | null> {
    try {
      const { data, error } = await supabase
        .from('health_plans_unified')
        .insert({
          user_id: userId,
          plan_name: planData.plan_name || 'Custom Health Plan',
          plan_type: planData.plan_type || 'custom',
          primary_goal: planData.primary_goal || 'General Health',
          secondary_goals: planData.secondary_goals || [],
          plan_data: planData.plan_data || {},
          status: planData.status || 'active',
          duration_weeks: planData.duration_weeks || 4,
          start_date: planData.start_date || new Date().toISOString().split('T')[0],
          progress_percentage: planData.progress_percentage || 0,
          is_selected: planData.is_selected || false,
          is_active: planData.is_active || true,
          ai_provider: planData.ai_provider || 'unified_service',
          ...planData
        })
        .select()
        .single();

      if (error) throw error;

      return data;
    } catch (error) {
      console.error('Error creating health plan:', error);
      return null;
    }
  }

  /**
   * Update a health plan
   */
  async updateHealthPlan(planId: string, updates: Partial<HealthPlanData>): Promise<HealthPlanData | null> {
    try {
      const { data, error } = await supabase
        .from('health_plans_unified')
        .update(updates)
        .eq('id', planId)
        .select()
        .single();

      if (error) throw error;

      return data;
    } catch (error) {
      console.error('Error updating health plan:', error);
      return null;
    }
  }

  /**
   * Delete a health plan
   */
  async deleteHealthPlan(planId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('health_plans_unified')
        .delete()
        .eq('id', planId);

      if (error) throw error;

      return true;
    } catch (error) {
      console.error('Error deleting health plan:', error);
      return false;
    }
  }

  /**
   * Set a plan as selected (deselects others)
   */
  async selectHealthPlan(userId: string, planId: string): Promise<boolean> {
    try {
      // First, deselect all other plans for this user
      await supabase
        .from('health_plans_unified')
        .update({ is_selected: false })
        .eq('user_id', userId);

      // Then select the specified plan
      const { error } = await supabase
        .from('health_plans_unified')
        .update({ is_selected: true })
        .eq('id', planId)
        .eq('user_id', userId);

      if (error) throw error;

      return true;
    } catch (error) {
      console.error('Error selecting health plan:', error);
      return false;
    }
  }

  /**
   * Set a plan as active (deactivates others)
   */
  async activateHealthPlan(userId: string, planId: string): Promise<boolean> {
    try {
      // First, deactivate all other plans for this user
      await supabase
        .from('health_plans_unified')
        .update({ is_active: false })
        .eq('user_id', userId);

      // Then activate the specified plan
      const { error } = await supabase
        .from('health_plans_unified')
        .update({ 
          is_active: true,
          status: 'active'
        })
        .eq('id', planId)
        .eq('user_id', userId);

      if (error) throw error;

      return true;
    } catch (error) {
      console.error('Error activating health plan:', error);
      return false;
    }
  }

  /**
   * Get plan progress statistics
   */
  async getPlanProgress(planId: string) {
    try {
      const { data: plan, error: planError } = await supabase
        .from('health_plans_unified')
        .select('*')
        .eq('id', planId)
        .single();

      if (planError) throw planError;

      // Get related activities count
      const { data: activities, error: activitiesError } = await supabase
        .from('plan_activities_unified')
        .select('id, is_completed')
        .eq('plan_id', planId);

      if (activitiesError) throw activitiesError;

      const totalActivities = activities?.length || 0;
      const completedActivities = activities?.filter(a => a.is_completed).length || 0;
      const completionRate = totalActivities > 0 ? (completedActivities / totalActivities) * 100 : 0;

      return {
        plan,
        totalActivities,
        completedActivities,
        completionRate: Math.round(completionRate),
        progressPercentage: plan.progress_percentage || 0
      };
    } catch (error) {
      console.error('Error getting plan progress:', error);
      return null;
    }
  }
}

export const unifiedHealthPlanService = new UnifiedHealthPlanService();

// Export individual functions for backward compatibility
export const generateHealthPlans = unifiedHealthPlanService.generateHealthPlans.bind(unifiedHealthPlanService);
export const saveSelectedHealthPlan = unifiedHealthPlanService.saveSelectedHealthPlan.bind(unifiedHealthPlanService);
