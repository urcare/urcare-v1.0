// User Data Persistence Service
// This service handles saving and retrieving all AI-generated user data
import { supabase } from '@/integrations/supabase/client';

export interface SavedPlan {
  id: string;
  user_id: string;
  plan_name: string;
  plan_type: string;
  plan_category: string;
  difficulty_level: 'beginner' | 'intermediate' | 'advanced';
  plan_data: any;
  weekly_structure: any;
  daily_schedules: any[];
  nutrition_plan: any;
  exercise_plan: any;
  wellness_activities: any[];
  duration_weeks: number;
  estimated_calories_per_day?: number;
  equipment_needed: string[];
  key_benefits: string[];
  target_audience?: string;
  prerequisites: string[];
  status: 'draft' | 'active' | 'paused' | 'completed' | 'cancelled' | 'archived';
  current_week: number;
  overall_progress_percentage: number;
  generated_at: string;
  generation_model?: string;
  generation_parameters: any;
  user_input_prompt?: string;
  created_at: string;
  updated_at: string;
}

export interface DailySchedule {
  id: string;
  user_id: string;
  plan_id?: string;
  schedule_date: string;
  day_of_week: string;
  day_type: string;
  theme?: string;
  activities: any[];
  nutrition_plan: any;
  hydration_plan: any;
  recovery_activities: any[];
  status: 'pending' | 'in_progress' | 'completed' | 'skipped' | 'modified';
  completion_percentage: number;
  energy_level?: number;
  difficulty_rating?: number;
  satisfaction_rating?: number;
  user_notes?: string;
  created_at: string;
  updated_at: string;
}

export interface AIActivity {
  id: string;
  user_id: string;
  plan_id?: string;
  schedule_id?: string;
  activity_name: string;
  activity_type: string;
  activity_category?: string;
  template_id?: string;
  description?: string;
  instructions: any[];
  equipment: string[];
  duration_minutes?: number;
  intensity_level?: 'low' | 'medium' | 'high';
  scheduled_time?: string;
  scheduled_date?: string;
  week_number?: number;
  day_of_week?: number;
  activity_data: any;
  modifications: any;
  benefits: string[];
  prerequisites: string[];
  alternatives: string[];
  is_completed: boolean;
  completion_percentage: number;
  completed_at?: string;
  actual_duration?: number;
  difficulty_rating?: number;
  satisfaction_rating?: number;
  energy_level_before?: number;
  energy_level_after?: number;
  user_notes?: string;
  metrics: any;
  tags: string[];
  created_at: string;
  updated_at: string;
}

export interface AIInsight {
  id: string;
  user_id: string;
  insight_type: string;
  insight_category: string;
  priority_level: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  description: string;
  analysis: string;
  recommendations: string[];
  supporting_data: any;
  related_plan_id?: string;
  related_activities?: string[];
  time_period_start?: string;
  time_period_end?: string;
  is_read: boolean;
  is_acknowledged: boolean;
  user_feedback?: string;
  action_taken?: string;
  generated_at: string;
  generation_model?: string;
  confidence_score?: number;
  created_at: string;
  updated_at: string;
}

export interface AIGoal {
  id: string;
  user_id: string;
  goal_name: string;
  goal_type: string;
  goal_category: string;
  priority_level: 'low' | 'medium' | 'high';
  description: string;
  target_value?: number;
  target_unit?: string;
  current_value?: number;
  current_unit?: string;
  start_date: string;
  target_date: string;
  achieved_date?: string;
  progress_percentage: number;
  milestones: any[];
  is_ai_generated: boolean;
  ai_reasoning?: string;
  related_plan_id?: string;
  status: 'active' | 'paused' | 'completed' | 'cancelled' | 'archived';
  created_at: string;
  updated_at: string;
}

export interface AIRecommendation {
  id: string;
  user_id: string;
  recommendation_type: string;
  category: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  title: string;
  description: string;
  reasoning: string;
  action_items: string[];
  expected_benefits: string[];
  valid_from: string;
  valid_until?: string;
  related_plan_id?: string;
  related_goal_id?: string;
  is_accepted?: boolean;
  is_implemented: boolean;
  implementation_date?: string;
  user_feedback?: string;
  generated_at: string;
  generation_model?: string;
  confidence_score?: number;
  created_at: string;
  updated_at: string;
}

export interface AISession {
  id: string;
  user_id: string;
  session_type: string;
  session_purpose: string;
  user_input: string;
  ai_response: string;
  conversation_history: any[];
  generated_content: any;
  related_plan_id?: string;
  related_goal_id?: string;
  ai_model: string;
  generation_parameters: any;
  processing_time_ms?: number;
  tokens_used?: number;
  status: 'active' | 'completed' | 'failed' | 'cancelled';
  user_satisfaction?: number;
  created_at: string;
  updated_at: string;
}

class UserDataPersistenceService {
  // Save AI-generated health plan
  async saveHealthPlan(planData: Partial<SavedPlan>): Promise<SavedPlan> {
    const { data, error } = await supabase
      .from('user_saved_plans')
      .insert([planData])
      .select()
      .single();

    if (error) {
      console.error('Error saving health plan:', error);
      throw new Error(`Failed to save health plan: ${error.message}`);
    }

    return data;
  }

  // Get user's saved plans
  async getUserSavedPlans(userId: string): Promise<SavedPlan[]> {
    const { data, error } = await supabase
      .from('user_saved_plans')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching saved plans:', error);
      throw new Error(`Failed to fetch saved plans: ${error.message}`);
    }

    return data || [];
  }

  // Get active plan for user
  async getActivePlan(userId: string): Promise<SavedPlan | null> {
    const { data, error } = await supabase
      .from('user_saved_plans')
      .select('*')
      .eq('user_id', userId)
      .eq('status', 'active')
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (error && error.code !== 'PGRST116') {
      console.error('Error fetching active plan:', error);
      throw new Error(`Failed to fetch active plan: ${error.message}`);
    }

    return data;
  }

  // Update plan status
  async updatePlanStatus(planId: string, status: string, progress?: number): Promise<void> {
    const updateData: any = { status };
    if (progress !== undefined) {
      updateData.overall_progress_percentage = progress;
    }

    const { error } = await supabase
      .from('user_saved_plans')
      .update(updateData)
      .eq('id', planId);

    if (error) {
      console.error('Error updating plan status:', error);
      throw new Error(`Failed to update plan status: ${error.message}`);
    }
  }

  // Save daily schedule
  async saveDailySchedule(scheduleData: Partial<DailySchedule>): Promise<DailySchedule> {
    const { data, error } = await supabase
      .from('user_daily_schedules')
      .insert([scheduleData])
      .select()
      .single();

    if (error) {
      console.error('Error saving daily schedule:', error);
      throw new Error(`Failed to save daily schedule: ${error.message}`);
    }

    return data;
  }

  // Get user's daily schedules
  async getUserDailySchedules(userId: string, date?: string): Promise<DailySchedule[]> {
    let query = supabase
      .from('user_daily_schedules')
      .select('*')
      .eq('user_id', userId);

    if (date) {
      query = query.eq('schedule_date', date);
    }

    const { data, error } = await query.order('schedule_date', { ascending: false });

    if (error) {
      console.error('Error fetching daily schedules:', error);
      throw new Error(`Failed to fetch daily schedules: ${error.message}`);
    }

    return data || [];
  }

  // Save AI activity
  async saveAIActivity(activityData: Partial<AIActivity>): Promise<AIActivity> {
    const { data, error } = await supabase
      .from('user_ai_activities')
      .insert([activityData])
      .select()
      .single();

    if (error) {
      console.error('Error saving AI activity:', error);
      throw new Error(`Failed to save AI activity: ${error.message}`);
    }

    return data;
  }

  // Get user's AI activities
  async getUserAIActivities(userId: string, filters?: {
    planId?: string;
    scheduleId?: string;
    activityType?: string;
    date?: string;
    completed?: boolean;
  }): Promise<AIActivity[]> {
    let query = supabase
      .from('user_ai_activities')
      .select('*')
      .eq('user_id', userId);

    if (filters?.planId) {
      query = query.eq('plan_id', filters.planId);
    }
    if (filters?.scheduleId) {
      query = query.eq('schedule_id', filters.scheduleId);
    }
    if (filters?.activityType) {
      query = query.eq('activity_type', filters.activityType);
    }
    if (filters?.date) {
      query = query.eq('scheduled_date', filters.date);
    }
    if (filters?.completed !== undefined) {
      query = query.eq('is_completed', filters.completed);
    }

    const { data, error } = await query.order('scheduled_time', { ascending: true });

    if (error) {
      console.error('Error fetching AI activities:', error);
      throw new Error(`Failed to fetch AI activities: ${error.message}`);
    }

    return data || [];
  }

  // Update activity completion
  async updateActivityCompletion(activityId: string, completionData: {
    is_completed?: boolean;
    completion_percentage?: number;
    completed_at?: string;
    actual_duration?: number;
    difficulty_rating?: number;
    satisfaction_rating?: number;
    energy_level_before?: number;
    energy_level_after?: number;
    user_notes?: string;
    metrics?: any;
  }): Promise<void> {
    const { error } = await supabase
      .from('user_ai_activities')
      .update(completionData)
      .eq('id', activityId);

    if (error) {
      console.error('Error updating activity completion:', error);
      throw new Error(`Failed to update activity completion: ${error.message}`);
    }
  }

  // Save AI insight
  async saveAIInsight(insightData: Partial<AIInsight>): Promise<AIInsight> {
    const { data, error } = await supabase
      .from('user_ai_insights')
      .insert([insightData])
      .select()
      .single();

    if (error) {
      console.error('Error saving AI insight:', error);
      throw new Error(`Failed to save AI insight: ${error.message}`);
    }

    return data;
  }

  // Get user's AI insights
  async getUserAIInsights(userId: string, filters?: {
    insightType?: string;
    priorityLevel?: string;
    isRead?: boolean;
    isAcknowledged?: boolean;
  }): Promise<AIInsight[]> {
    let query = supabase
      .from('user_ai_insights')
      .select('*')
      .eq('user_id', userId);

    if (filters?.insightType) {
      query = query.eq('insight_type', filters.insightType);
    }
    if (filters?.priorityLevel) {
      query = query.eq('priority_level', filters.priorityLevel);
    }
    if (filters?.isRead !== undefined) {
      query = query.eq('is_read', filters.isRead);
    }
    if (filters?.isAcknowledged !== undefined) {
      query = query.eq('is_acknowledged', filters.isAcknowledged);
    }

    const { data, error } = await query.order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching AI insights:', error);
      throw new Error(`Failed to fetch AI insights: ${error.message}`);
    }

    return data || [];
  }

  // Save AI goal
  async saveAIGoal(goalData: Partial<AIGoal>): Promise<AIGoal> {
    const { data, error } = await supabase
      .from('user_ai_goals')
      .insert([goalData])
      .select()
      .single();

    if (error) {
      console.error('Error saving AI goal:', error);
      throw new Error(`Failed to save AI goal: ${error.message}`);
    }

    return data;
  }

  // Get user's AI goals
  async getUserAIGoals(userId: string, filters?: {
    goalType?: string;
    status?: string;
    isAIGenerated?: boolean;
  }): Promise<AIGoal[]> {
    let query = supabase
      .from('user_ai_goals')
      .select('*')
      .eq('user_id', userId);

    if (filters?.goalType) {
      query = query.eq('goal_type', filters.goalType);
    }
    if (filters?.status) {
      query = query.eq('status', filters.status);
    }
    if (filters?.isAIGenerated !== undefined) {
      query = query.eq('is_ai_generated', filters.isAIGenerated);
    }

    const { data, error } = await query.order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching AI goals:', error);
      throw new Error(`Failed to fetch AI goals: ${error.message}`);
    }

    return data || [];
  }

  // Save AI recommendation
  async saveAIRecommendation(recommendationData: Partial<AIRecommendation>): Promise<AIRecommendation> {
    const { data, error } = await supabase
      .from('user_ai_recommendations')
      .insert([recommendationData])
      .select()
      .single();

    if (error) {
      console.error('Error saving AI recommendation:', error);
      throw new Error(`Failed to save AI recommendation: ${error.message}`);
    }

    return data;
  }

  // Get user's AI recommendations
  async getUserAIRecommendations(userId: string, filters?: {
    recommendationType?: string;
    priority?: string;
    isAccepted?: boolean;
    isImplemented?: boolean;
  }): Promise<AIRecommendation[]> {
    let query = supabase
      .from('user_ai_recommendations')
      .select('*')
      .eq('user_id', userId);

    if (filters?.recommendationType) {
      query = query.eq('recommendation_type', filters.recommendationType);
    }
    if (filters?.priority) {
      query = query.eq('priority', filters.priority);
    }
    if (filters?.isAccepted !== undefined) {
      query = query.eq('is_accepted', filters.isAccepted);
    }
    if (filters?.isImplemented !== undefined) {
      query = query.eq('is_implemented', filters.isImplemented);
    }

    const { data, error } = await query.order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching AI recommendations:', error);
      throw new Error(`Failed to fetch AI recommendations: ${error.message}`);
    }

    return data || [];
  }

  // Save AI session
  async saveAISession(sessionData: Partial<AISession>): Promise<AISession> {
    const { data, error } = await supabase
      .from('user_ai_sessions')
      .insert([sessionData])
      .select()
      .single();

    if (error) {
      console.error('Error saving AI session:', error);
      throw new Error(`Failed to save AI session: ${error.message}`);
    }

    return data;
  }

  // Get user's AI sessions
  async getUserAISessions(userId: string, filters?: {
    sessionType?: string;
    status?: string;
    relatedPlanId?: string;
  }): Promise<AISession[]> {
    let query = supabase
      .from('user_ai_sessions')
      .select('*')
      .eq('user_id', userId);

    if (filters?.sessionType) {
      query = query.eq('session_type', filters.sessionType);
    }
    if (filters?.status) {
      query = query.eq('status', filters.status);
    }
    if (filters?.relatedPlanId) {
      query = query.eq('related_plan_id', filters.relatedPlanId);
    }

    const { data, error } = await query.order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching AI sessions:', error);
      throw new Error(`Failed to fetch AI sessions: ${error.message}`);
    }

    return data || [];
  }

  // Get user's complete data summary
  async getUserDataSummary(userId: string): Promise<{
    savedPlans: SavedPlan[];
    activePlan: SavedPlan | null;
    recentSchedules: DailySchedule[];
    upcomingActivities: AIActivity[];
    recentInsights: AIInsight[];
    activeGoals: AIGoal[];
    pendingRecommendations: AIRecommendation[];
    recentSessions: AISession[];
  }> {
    try {
      const [
        savedPlans,
        activePlan,
        recentSchedules,
        upcomingActivities,
        recentInsights,
        activeGoals,
        pendingRecommendations,
        recentSessions
      ] = await Promise.all([
        this.getUserSavedPlans(userId),
        this.getActivePlan(userId),
        this.getUserDailySchedules(userId),
        this.getUserAIActivities(userId, { completed: false }),
        this.getUserAIInsights(userId, { isRead: false }),
        this.getUserAIGoals(userId, { status: 'active' }),
        this.getUserAIRecommendations(userId, { isAccepted: null }),
        this.getUserAISessions(userId)
      ]);

      return {
        savedPlans,
        activePlan,
        recentSchedules: recentSchedules.slice(0, 7), // Last 7 days
        upcomingActivities: upcomingActivities.slice(0, 10), // Next 10 activities
        recentInsights: recentInsights.slice(0, 5), // Last 5 insights
        activeGoals,
        pendingRecommendations: pendingRecommendations.slice(0, 5), // Top 5 pending
        recentSessions: recentSessions.slice(0, 10) // Last 10 sessions
      };
    } catch (error) {
      console.error('Error fetching user data summary:', error);
      throw new Error(`Failed to fetch user data summary: ${error}`);
    }
  }

  // Check if user has existing plan and return it
  async getExistingUserPlan(userId: string): Promise<SavedPlan | null> {
    try {
      // First check for active plan
      const activePlan = await this.getActivePlan(userId);
      if (activePlan) {
        return activePlan;
      }

      // If no active plan, get the most recent plan
      const { data, error } = await supabase
        .from('user_saved_plans')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching existing plan:', error);
        throw new Error(`Failed to fetch existing plan: ${error.message}`);
      }

      return data;
    } catch (error) {
      console.error('Error checking existing user plan:', error);
      return null;
    }
  }
}

export const userDataPersistenceService = new UserDataPersistenceService();
