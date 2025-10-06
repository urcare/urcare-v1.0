// AI Data Integration Service
// This service integrates with existing AI services to automatically save all generated content
import { userDataPersistenceService, SavedPlan, DailySchedule, AIActivity, AIInsight, AIGoal, AIRecommendation, AISession } from './userDataPersistenceService';
import { supabase } from '@/integrations/supabase/client';

interface UserProfile {
  id: string;
  full_name: string;
  age: string;
  gender: string;
  height_cm: string;
  weight_kg: string;
  blood_group: string;
  diet_type: string;
  chronic_conditions: string[];
  health_goals: string[];
  wake_up_time: string;
  sleep_time: string;
  work_start: string;
  work_end: string;
  breakfast_time: string;
  lunch_time: string;
  dinner_time: string;
  workout_time: string;
  workout_type: string;
  routine_flexibility: string;
  smoking: string;
  drinking: string;
  allergies: string[];
}

class AIDataIntegrationService {
  // Save AI-generated health plan with all related data
  async saveGeneratedHealthPlan(
    userId: string,
    planData: any,
    userProfile: UserProfile,
    aiModel: string = 'multi-ai',
    userInput?: string
  ): Promise<SavedPlan> {
    try {
      // Extract plan information
      const planName = planData.title || planData.plan_name || 'AI Generated Health Plan';
      const planType = this.determinePlanType(planData, userInput);
      const planCategory = this.determinePlanCategory(planData, userProfile);
      const difficultyLevel = this.determineDifficultyLevel(planData, userProfile);

      // Prepare plan data for saving
      const savedPlanData: Partial<SavedPlan> = {
        user_id: userId,
        plan_name: planName,
        plan_type: planType,
        plan_category: planCategory,
        difficulty_level: difficultyLevel,
        plan_data: planData,
        weekly_structure: planData.weekly_structure || {},
        daily_schedules: planData.daily_schedules || [],
        nutrition_plan: planData.nutrition_plan || planData.nutrition_guidelines || {},
        exercise_plan: planData.exercise_plan || {},
        wellness_activities: planData.wellness_activities || [],
        duration_weeks: planData.duration_weeks || planData.duration || 4,
        estimated_calories_per_day: planData.estimated_calories_per_day || planData.daily_calories,
        equipment_needed: planData.equipment_needed || planData.equipment || [],
        key_benefits: planData.key_benefits || planData.benefits || [],
        target_audience: planData.target_audience,
        prerequisites: planData.prerequisites || [],
        status: 'active',
        current_week: 1,
        overall_progress_percentage: 0,
        generation_model: aiModel,
        generation_parameters: {
          user_profile: userProfile,
          user_input: userInput,
          generation_timestamp: new Date().toISOString()
        },
        user_input_prompt: userInput
      };

      // Save the plan
      const savedPlan = await userDataPersistenceService.saveHealthPlan(savedPlanData);

      // Save daily schedules if they exist
      if (planData.daily_schedules && Array.isArray(planData.daily_schedules)) {
        for (const schedule of planData.daily_schedules) {
          await this.saveDailyScheduleFromPlan(userId, savedPlan.id, schedule);
        }
      }

      // Save activities if they exist
      if (planData.activities && Array.isArray(planData.activities)) {
        for (const activity of planData.activities) {
          await this.saveActivityFromPlan(userId, savedPlan.id, activity);
        }
      }

      // Generate and save AI insights
      await this.generateAndSaveInsights(userId, savedPlan.id, planData, userProfile);

      // Generate and save AI goals
      await this.generateAndSaveGoals(userId, savedPlan.id, planData, userProfile);

      // Generate and save AI recommendations
      await this.generateAndSaveRecommendations(userId, savedPlan.id, planData, userProfile);

      return savedPlan;
    } catch (error) {
      console.error('Error saving generated health plan:', error);
      throw new Error(`Failed to save generated health plan: ${error}`);
    }
  }

  // Save daily schedule from plan data
  private async saveDailyScheduleFromPlan(
    userId: string,
    planId: string,
    scheduleData: any
  ): Promise<DailySchedule> {
    const scheduleInfo: Partial<DailySchedule> = {
      user_id: userId,
      plan_id: planId,
      schedule_date: scheduleData.date || new Date().toISOString().split('T')[0],
      day_of_week: scheduleData.day_of_week || this.getDayOfWeek(scheduleData.date),
      day_type: scheduleData.day_type || 'workout',
      theme: scheduleData.theme,
      activities: scheduleData.activities || [],
      nutrition_plan: scheduleData.nutrition_plan || {},
      hydration_plan: scheduleData.hydration_plan || {},
      recovery_activities: scheduleData.recovery_activities || [],
      status: 'pending',
      completion_percentage: 0
    };

    return await userDataPersistenceService.saveDailySchedule(scheduleInfo);
  }

  // Save activity from plan data
  private async saveActivityFromPlan(
    userId: string,
    planId: string,
    activityData: any
  ): Promise<AIActivity> {
    const activityInfo: Partial<AIActivity> = {
      user_id: userId,
      plan_id: planId,
      activity_name: activityData.title || activityData.name || 'AI Generated Activity',
      activity_type: activityData.category || activityData.type || 'exercise',
      activity_category: activityData.category,
      template_id: activityData.template_id || activityData.id,
      description: activityData.description,
      instructions: activityData.instructions || [],
      equipment: activityData.equipment || [],
      duration_minutes: activityData.duration_minutes || activityData.duration,
      intensity_level: activityData.intensity || activityData.intensity_level || 'medium',
      scheduled_time: activityData.scheduled_time || activityData.time_slot,
      scheduled_date: activityData.scheduled_date,
      week_number: activityData.week_number,
      day_of_week: activityData.day_of_week,
      activity_data: activityData,
      modifications: activityData.modifications || {},
      benefits: activityData.benefits || [],
      prerequisites: activityData.prerequisites || [],
      alternatives: activityData.alternatives || [],
      is_completed: false,
      completion_percentage: 0,
      metrics: activityData.metrics || {},
      tags: activityData.tags || []
    };

    return await userDataPersistenceService.saveAIActivity(activityInfo);
  }

  // Generate and save AI insights
  private async generateAndSaveInsights(
    userId: string,
    planId: string,
    planData: any,
    userProfile: UserProfile
  ): Promise<void> {
    try {
      // Generate insights based on plan data and user profile
      const insights = this.generateInsightsFromPlan(planData, userProfile);

      for (const insight of insights) {
        const insightData: Partial<AIInsight> = {
          user_id: userId,
          insight_type: insight.type,
          insight_category: insight.category,
          priority_level: insight.priority,
          title: insight.title,
          description: insight.description,
          analysis: insight.analysis,
          recommendations: insight.recommendations,
          supporting_data: insight.supporting_data,
          related_plan_id: planId,
          generated_at: new Date().toISOString(),
          generation_model: 'ai-integration-service',
          confidence_score: insight.confidence
        };

        await userDataPersistenceService.saveAIInsight(insightData);
      }
    } catch (error) {
      console.error('Error generating and saving insights:', error);
    }
  }

  // Generate and save AI goals
  private async generateAndSaveGoals(
    userId: string,
    planId: string,
    planData: any,
    userProfile: UserProfile
  ): Promise<void> {
    try {
      // Generate goals based on plan data and user profile
      const goals = this.generateGoalsFromPlan(planData, userProfile);

      for (const goal of goals) {
        const goalData: Partial<AIGoal> = {
          user_id: userId,
          goal_name: goal.name,
          goal_type: goal.type,
          goal_category: goal.category,
          priority_level: goal.priority,
          description: goal.description,
          target_value: goal.target_value,
          target_unit: goal.target_unit,
          current_value: goal.current_value,
          current_unit: goal.current_unit,
          start_date: new Date().toISOString().split('T')[0],
          target_date: goal.target_date,
          progress_percentage: 0,
          milestones: goal.milestones || [],
          is_ai_generated: true,
          ai_reasoning: goal.reasoning,
          related_plan_id: planId,
          status: 'active'
        };

        await userDataPersistenceService.saveAIGoal(goalData);
      }
    } catch (error) {
      console.error('Error generating and saving goals:', error);
    }
  }

  // Generate and save AI recommendations
  private async generateAndSaveRecommendations(
    userId: string,
    planId: string,
    planData: any,
    userProfile: UserProfile
  ): Promise<void> {
    try {
      // Generate recommendations based on plan data and user profile
      const recommendations = this.generateRecommendationsFromPlan(planData, userProfile);

      for (const recommendation of recommendations) {
        const recommendationData: Partial<AIRecommendation> = {
          user_id: userId,
          recommendation_type: recommendation.type,
          category: recommendation.category,
          priority: recommendation.priority,
          title: recommendation.title,
          description: recommendation.description,
          reasoning: recommendation.reasoning,
          action_items: recommendation.action_items,
          expected_benefits: recommendation.expected_benefits,
          related_plan_id: planId,
          generated_at: new Date().toISOString(),
          generation_model: 'ai-integration-service',
          confidence_score: recommendation.confidence
        };

        await userDataPersistenceService.saveAIRecommendation(recommendationData);
      }
    } catch (error) {
      console.error('Error generating and saving recommendations:', error);
    }
  }

  // Save AI session
  async saveAISession(
    userId: string,
    sessionType: string,
    sessionPurpose: string,
    userInput: string,
    aiResponse: string,
    generatedContent: any,
    aiModel: string,
    relatedPlanId?: string
  ): Promise<AISession> {
    const sessionData: Partial<AISession> = {
      user_id: userId,
      session_type: sessionType,
      session_purpose: sessionPurpose,
      user_input: userInput,
      ai_response: aiResponse,
      conversation_history: [],
      generated_content: generatedContent,
      related_plan_id: relatedPlanId,
      ai_model: aiModel,
      generation_parameters: {},
      status: 'completed'
    };

    return await userDataPersistenceService.saveAISession(sessionData);
  }

  // Check if user has existing plan and return it
  async getExistingUserPlan(userId: string): Promise<SavedPlan | null> {
    return await userDataPersistenceService.getExistingUserPlan(userId);
  }

  // Get user's complete data summary
  async getUserDataSummary(userId: string) {
    return await userDataPersistenceService.getUserDataSummary(userId);
  }

  // Helper methods
  private determinePlanType(planData: any, userInput?: string): string {
    if (planData.plan_type) return planData.plan_type;
    
    const input = (userInput || '').toLowerCase();
    if (input.includes('diabetes') || input.includes('blood sugar')) return 'disease_management';
    if (input.includes('weight') || input.includes('lose')) return 'weight_loss';
    if (input.includes('muscle') || input.includes('strength')) return 'muscle_gain';
    if (input.includes('stress') || input.includes('anxiety')) return 'stress_management';
    if (input.includes('cardio') || input.includes('fitness')) return 'cardio_fitness';
    if (input.includes('flexibility') || input.includes('yoga')) return 'flexibility';
    if (input.includes('energy') || input.includes('tired')) return 'energy_boost';
    
    return 'lifestyle_change';
  }

  private determinePlanCategory(planData: any, userProfile: UserProfile): string {
    if (planData.category) return planData.category;
    
    const conditions = userProfile.chronic_conditions || [];
    if (conditions.includes('diabetes')) return 'diabetes_management';
    if (conditions.includes('hypertension')) return 'cardiovascular_health';
    if (conditions.includes('obesity')) return 'weight_management';
    
    return 'general_health';
  }

  private determineDifficultyLevel(planData: any, userProfile: UserProfile): 'beginner' | 'intermediate' | 'advanced' {
    if (planData.difficulty) return planData.difficulty.toLowerCase();
    
    const age = parseInt(userProfile.age) || 30;
    const conditions = userProfile.chronic_conditions || [];
    
    if (age < 25 && conditions.length === 0) return 'beginner';
    if (age > 50 || conditions.length > 2) return 'advanced';
    
    return 'intermediate';
  }

  private getDayOfWeek(dateString?: string): string {
    if (!dateString) return 'monday';
    
    const date = new Date(dateString);
    const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    return days[date.getDay()];
  }

  private generateInsightsFromPlan(planData: any, userProfile: UserProfile): any[] {
    const insights = [];
    
    // Health analysis insight
    insights.push({
      type: 'health_analysis',
      category: 'plan_analysis',
      priority: 'medium',
      title: 'Plan Health Analysis',
      description: 'Analysis of your health plan and its alignment with your goals',
      analysis: `Your plan focuses on ${planData.focus_areas?.join(', ') || 'general health'} and is designed for ${planData.difficulty || 'intermediate'} level users.`,
      recommendations: [
        'Follow the plan consistently for best results',
        'Monitor your progress weekly',
        'Adjust intensity based on your response'
      ],
      supporting_data: { plan_focus: planData.focus_areas, difficulty: planData.difficulty },
      confidence: 0.8
    });

    return insights;
  }

  private generateGoalsFromPlan(planData: any, userProfile: UserProfile): any[] {
    const goals = [];
    
    // Primary goal from plan
    if (planData.primary_goal) {
      goals.push({
        name: planData.primary_goal,
        type: 'general',
        category: 'health_improvement',
        priority: 'high',
        description: `Primary goal: ${planData.primary_goal}`,
        target_date: new Date(Date.now() + (planData.duration_weeks || 4) * 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        reasoning: 'Generated from your health plan'
      });
    }

    return goals;
  }

  private generateRecommendationsFromPlan(planData: any, userProfile: UserProfile): any[] {
    const recommendations = [];
    
    // Equipment recommendation
    if (planData.equipment_needed && planData.equipment_needed.length > 0) {
      recommendations.push({
        type: 'equipment',
        category: 'preparation',
        priority: 'medium',
        title: 'Equipment Preparation',
        description: 'Prepare the necessary equipment for your health plan',
        reasoning: 'Having the right equipment will help you follow your plan effectively',
        action_items: planData.equipment_needed,
        expected_benefits: ['Better plan adherence', 'Improved results', 'Enhanced safety'],
        confidence: 0.9
      });
    }

    return recommendations;
  }
}

export const aiDataIntegrationService = new AIDataIntegrationService();
