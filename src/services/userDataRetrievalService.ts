// User Data Retrieval Service
// This service handles retrieving saved user data to avoid regenerating content
import { userDataPersistenceService, SavedPlan, DailySchedule, AIActivity, AIInsight, AIGoal, AIRecommendation } from './userDataPersistenceService';
import { supabase } from '@/integrations/supabase/client';

interface UserDataSummary {
  hasExistingPlan: boolean;
  activePlan: SavedPlan | null;
  recentSchedules: DailySchedule[];
  upcomingActivities: AIActivity[];
  recentInsights: AIInsight[];
  activeGoals: AIGoal[];
  pendingRecommendations: AIRecommendation[];
  shouldGenerateNew: boolean;
  reason: string;
}

class UserDataRetrievalService {
  // Check if user has existing data and determine if new generation is needed
  async checkUserDataStatus(userId: string): Promise<UserDataSummary> {
    try {
      // Get user's data summary
      const dataSummary = await userDataPersistenceService.getUserDataSummary(userId);
      
      const hasExistingPlan = !!dataSummary.activePlan;
      const shouldGenerateNew = this.shouldGenerateNewContent(dataSummary);
      
      return {
        hasExistingPlan,
        activePlan: dataSummary.activePlan,
        recentSchedules: dataSummary.recentSchedules,
        upcomingActivities: dataSummary.upcomingActivities,
        recentInsights: dataSummary.recentInsights,
        activeGoals: dataSummary.activeGoals,
        pendingRecommendations: dataSummary.pendingRecommendations,
        shouldGenerateNew,
        reason: this.getReasonForGeneration(shouldGenerateNew, dataSummary)
      };
    } catch (error) {
      console.error('Error checking user data status:', error);
      return {
        hasExistingPlan: false,
        activePlan: null,
        recentSchedules: [],
        upcomingActivities: [],
        recentInsights: [],
        activeGoals: [],
        pendingRecommendations: [],
        shouldGenerateNew: true,
        reason: 'Error checking existing data - generating new content'
      };
    }
  }

  // Get user's saved plan data for display
  async getUserSavedPlanData(userId: string): Promise<{
    plan: SavedPlan | null;
    schedules: DailySchedule[];
    activities: AIActivity[];
    insights: AIInsight[];
    goals: AIGoal[];
    recommendations: AIRecommendation[];
  }> {
    try {
      const [
        plan,
        schedules,
        activities,
        insights,
        goals,
        recommendations
      ] = await Promise.all([
        userDataPersistenceService.getActivePlan(userId),
        userDataPersistenceService.getUserDailySchedules(userId),
        userDataPersistenceService.getUserAIActivities(userId),
        userDataPersistenceService.getUserAIInsights(userId),
        userDataPersistenceService.getUserAIGoals(userId),
        userDataPersistenceService.getUserAIRecommendations(userId)
      ]);

      return {
        plan,
        schedules,
        activities,
        insights,
        goals,
        recommendations
      };
    } catch (error) {
      console.error('Error getting user saved plan data:', error);
      throw new Error(`Failed to get user saved plan data: ${error}`);
    }
  }

  // Get today's schedule for user
  async getTodaySchedule(userId: string): Promise<{
    schedule: DailySchedule | null;
    activities: AIActivity[];
    insights: AIInsight[];
    recommendations: AIRecommendation[];
  }> {
    try {
      const today = new Date().toISOString().split('T')[0];
      
      const [
        schedules,
        activities,
        insights,
        recommendations
      ] = await Promise.all([
        userDataPersistenceService.getUserDailySchedules(userId, today),
        userDataPersistenceService.getUserAIActivities(userId, { date: today }),
        userDataPersistenceService.getUserAIInsights(userId, { isRead: false }),
        userDataPersistenceService.getUserAIRecommendations(userId, { isAccepted: null })
      ]);

      return {
        schedule: schedules[0] || null,
        activities: activities.sort((a, b) => {
          const timeA = a.scheduled_time || '00:00';
          const timeB = b.scheduled_time || '00:00';
          return timeA.localeCompare(timeB);
        }),
        insights: insights.slice(0, 3), // Top 3 unread insights
        recommendations: recommendations.slice(0, 5) // Top 5 pending recommendations
      };
    } catch (error) {
      console.error('Error getting today schedule:', error);
      throw new Error(`Failed to get today schedule: ${error}`);
    }
  }

  // Get user's progress data
  async getUserProgressData(userId: string): Promise<{
    planProgress: number;
    weeklyProgress: number;
    completedActivities: number;
    totalActivities: number;
    insightsCount: number;
    goalsProgress: number;
    recommendationsImplemented: number;
  }> {
    try {
      const [
        plan,
        activities,
        insights,
        goals,
        recommendations
      ] = await Promise.all([
        userDataPersistenceService.getActivePlan(userId),
        userDataPersistenceService.getUserAIActivities(userId),
        userDataPersistenceService.getUserAIInsights(userId),
        userDataPersistenceService.getUserAIGoals(userId),
        userDataPersistenceService.getUserAIRecommendations(userId)
      ]);

      const completedActivities = activities.filter(a => a.is_completed).length;
      const totalActivities = activities.length;
      const planProgress = plan?.overall_progress_percentage || 0;
      
      // Calculate weekly progress (last 7 days)
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      const recentActivities = activities.filter(a => 
        a.scheduled_date && new Date(a.scheduled_date) >= weekAgo
      );
      const weeklyCompleted = recentActivities.filter(a => a.is_completed).length;
      const weeklyProgress = recentActivities.length > 0 ? (weeklyCompleted / recentActivities.length) * 100 : 0;

      const insightsCount = insights.length;
      const goalsProgress = goals.length > 0 ? 
        goals.reduce((sum, goal) => sum + goal.progress_percentage, 0) / goals.length : 0;
      
      const recommendationsImplemented = recommendations.filter(r => r.is_implemented).length;

      return {
        planProgress,
        weeklyProgress,
        completedActivities,
        totalActivities,
        insightsCount,
        goalsProgress,
        recommendationsImplemented
      };
    } catch (error) {
      console.error('Error getting user progress data:', error);
      throw new Error(`Failed to get user progress data: ${error}`);
    }
  }

  // Get user's AI-generated content for specific date range
  async getUserContentByDateRange(
    userId: string, 
    startDate: string, 
    endDate: string
  ): Promise<{
    schedules: DailySchedule[];
    activities: AIActivity[];
    insights: AIInsight[];
    recommendations: AIRecommendation[];
  }> {
    try {
      const [
        schedules,
        activities,
        insights,
        recommendations
      ] = await Promise.all([
        this.getSchedulesByDateRange(userId, startDate, endDate),
        this.getActivitiesByDateRange(userId, startDate, endDate),
        this.getInsightsByDateRange(userId, startDate, endDate),
        this.getRecommendationsByDateRange(userId, startDate, endDate)
      ]);

      return {
        schedules,
        activities,
        insights,
        recommendations
      };
    } catch (error) {
      console.error('Error getting user content by date range:', error);
      throw new Error(`Failed to get user content by date range: ${error}`);
    }
  }

  // Update user's plan progress
  async updatePlanProgress(userId: string, progressData: {
    currentWeek?: number;
    overallProgress?: number;
    weeklyProgress?: number;
    monthlyProgress?: number;
  }): Promise<void> {
    try {
      const activePlan = await userDataPersistenceService.getActivePlan(userId);
      if (!activePlan) {
        throw new Error('No active plan found for user');
      }

      const updateData: any = {};
      if (progressData.currentWeek !== undefined) updateData.current_week = progressData.currentWeek;
      if (progressData.overallProgress !== undefined) updateData.overall_progress_percentage = progressData.overallProgress;
      if (progressData.weeklyProgress !== undefined) updateData.weekly_compliance_rate = progressData.weeklyProgress;
      if (progressData.monthlyProgress !== undefined) updateData.monthly_compliance_rate = progressData.monthlyProgress;

      const { error } = await supabase
        .from('user_saved_plans')
        .update(updateData)
        .eq('id', activePlan.id);

      if (error) {
        throw new Error(`Failed to update plan progress: ${error.message}`);
      }
    } catch (error) {
      console.error('Error updating plan progress:', error);
      throw new Error(`Failed to update plan progress: ${error}`);
    }
  }

  // Mark insight as read
  async markInsightAsRead(insightId: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('user_ai_insights')
        .update({ is_read: true })
        .eq('id', insightId);

      if (error) {
        throw new Error(`Failed to mark insight as read: ${error.message}`);
      }
    } catch (error) {
      console.error('Error marking insight as read:', error);
      throw new Error(`Failed to mark insight as read: ${error}`);
    }
  }

  // Accept recommendation
  async acceptRecommendation(recommendationId: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('user_ai_recommendations')
        .update({ 
          is_accepted: true,
          implementation_date: new Date().toISOString()
        })
        .eq('id', recommendationId);

      if (error) {
        throw new Error(`Failed to accept recommendation: ${error.message}`);
      }
    } catch (error) {
      console.error('Error accepting recommendation:', error);
      throw new Error(`Failed to accept recommendation: ${error}`);
    }
  }

  // Private helper methods
  private shouldGenerateNewContent(dataSummary: any): boolean {
    // Don't generate new content if user has an active plan
    if (dataSummary.activePlan) {
      return false;
    }

    // Don't generate new content if user has recent schedules (within last 7 days)
    const recentSchedules = dataSummary.recentSchedules.filter((schedule: DailySchedule) => {
      const scheduleDate = new Date(schedule.schedule_date);
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      return scheduleDate >= weekAgo;
    });

    if (recentSchedules.length > 0) {
      return false;
    }

    // Generate new content if no existing data
    return true;
  }

  private getReasonForGeneration(shouldGenerate: boolean, dataSummary: any): string {
    if (!shouldGenerate) {
      if (dataSummary.activePlan) {
        return 'User has an active plan - using existing data';
      }
      if (dataSummary.recentSchedules.length > 0) {
        return 'User has recent schedules - using existing data';
      }
    }
    return 'No existing data found - generating new content';
  }

  private async getSchedulesByDateRange(userId: string, startDate: string, endDate: string): Promise<DailySchedule[]> {
    const { data, error } = await supabase
      .from('user_daily_schedules')
      .select('*')
      .eq('user_id', userId)
      .gte('schedule_date', startDate)
      .lte('schedule_date', endDate)
      .order('schedule_date', { ascending: true });

    if (error) {
      throw new Error(`Failed to get schedules by date range: ${error.message}`);
    }

    return data || [];
  }

  private async getActivitiesByDateRange(userId: string, startDate: string, endDate: string): Promise<AIActivity[]> {
    const { data, error } = await supabase
      .from('user_ai_activities')
      .select('*')
      .eq('user_id', userId)
      .gte('scheduled_date', startDate)
      .lte('scheduled_date', endDate)
      .order('scheduled_date', { ascending: true });

    if (error) {
      throw new Error(`Failed to get activities by date range: ${error.message}`);
    }

    return data || [];
  }

  private async getInsightsByDateRange(userId: string, startDate: string, endDate: string): Promise<AIInsight[]> {
    const { data, error } = await supabase
      .from('user_ai_insights')
      .select('*')
      .eq('user_id', userId)
      .gte('created_at', startDate)
      .lte('created_at', endDate)
      .order('created_at', { ascending: false });

    if (error) {
      throw new Error(`Failed to get insights by date range: ${error.message}`);
    }

    return data || [];
  }

  private async getRecommendationsByDateRange(userId: string, startDate: string, endDate: string): Promise<AIRecommendation[]> {
    const { data, error } = await supabase
      .from('user_ai_recommendations')
      .select('*')
      .eq('user_id', userId)
      .gte('created_at', startDate)
      .lte('created_at', endDate)
      .order('created_at', { ascending: false });

    if (error) {
      throw new Error(`Failed to get recommendations by date range: ${error.message}`);
    }

    return data || [];
  }
}

export const userDataRetrievalService = new UserDataRetrievalService();
