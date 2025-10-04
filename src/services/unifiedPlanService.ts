// Unified Plan Service - Integrates Groq, Gemini, and Midnight Scheduler
// Complete solution for plan generation, schedule creation, and automatic updates

import { 
  DetailedPlan, 
  DailySchedule, 
  PlanGenerationRequest,
  ScheduleGenerationRequest,
  UserOnboardingData,
  PlanProgress
} from '@/types/planTypes';
import { enhancedGroqService } from './enhancedGroqService';
import { geminiScheduleService } from './geminiScheduleService';
import { midnightScheduler } from './midnightScheduler';

interface UnifiedResponse {
  success: boolean;
  data?: any;
  error?: string;
  processingTime: number;
  provider?: string;
}

interface PlanGenerationResult {
  plans: DetailedPlan[];
  selected_plan: DetailedPlan;
  initial_schedule: DailySchedule;
  progress_tracking: PlanProgress;
}

class UnifiedPlanService {
  private isInitialized: boolean = false;

  constructor() {
    this.initialize();
  }

  private initialize(): void {
    if (!this.isInitialized) {
      console.log('Initializing Unified Plan Service...');
      this.isInitialized = true;
    }
  }

  // Main method: Generate complete plan and schedule from onboarding data
  async generateCompletePlan(request: PlanGenerationRequest): Promise<UnifiedResponse> {
    const startTime = Date.now();
    
    try {
      console.log(`Generating complete plan for user: ${request.user_profile.full_name}`);

      // Step 1: Generate detailed plans using Groq
      const plansResponse = await this.generateDetailedPlans(request);
      if (!plansResponse.success) {
        throw new Error(`Failed to generate plans: ${plansResponse.error}`);
      }

      // Step 2: Select the most appropriate plan
      const selectedPlan = this.selectOptimalPlan(plansResponse.data, request);
      
      // Step 3: Generate initial daily schedule using Gemini
      const scheduleRequest: ScheduleGenerationRequest = {
        plan_data: selectedPlan,
        user_profile: request.user_profile,
        target_date: new Date().toISOString().split('T')[0],
        previous_day_performance: undefined,
        weather_conditions: await this.getWeatherConditions(),
        special_events: await this.getSpecialEvents(request.user_profile)
      };

      const scheduleResponse = await geminiScheduleService.generateDailySchedule(scheduleRequest);
      if (!scheduleResponse.success) {
        throw new Error(`Failed to generate schedule: ${scheduleResponse.error}`);
      }

      // Step 4: Register user with midnight scheduler
      midnightScheduler.registerUserPlan(request.user_profile.id, selectedPlan, request.user_profile);

      // Step 5: Create progress tracking
      const progressTracking = this.createInitialProgress(selectedPlan, request.user_profile);

      const result: PlanGenerationResult = {
        plans: plansResponse.data,
        selected_plan: selectedPlan,
        initial_schedule: scheduleResponse.data,
        progress_tracking: progressTracking
      };

      return {
        success: true,
        data: result,
        processingTime: Date.now() - startTime,
        provider: 'Unified (Groq + Gemini)'
      };

    } catch (error) {
      console.error('Error generating complete plan:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
        processingTime: Date.now() - startTime
      };
    }
  }

  // Generate detailed plans using Groq
  private async generateDetailedPlans(request: PlanGenerationRequest): Promise<UnifiedResponse> {
    const startTime = Date.now();
    
    try {
      const response = await enhancedGroqService.generateDetailedPlans(request);
      
      if (response.success && response.data) {
        // Ensure we have 3 plans
        const plans = Array.isArray(response.data) ? response.data : response.data.plans || [];
        
        if (plans.length < 3) {
          // Use fallback plans if not enough generated
          const fallbackPlans = enhancedGroqService.generateFallbackDetailedPlans(request);
          return {
            success: true,
            data: fallbackPlans,
            processingTime: Date.now() - startTime,
            provider: 'Groq (with fallback)'
          };
        }

        return {
          success: true,
          data: plans,
          processingTime: response.processingTime,
          provider: 'Groq'
        };
      } else {
        // Use fallback plans
        const fallbackPlans = enhancedGroqService.generateFallbackDetailedPlans(request);
        return {
          success: true,
          data: fallbackPlans,
          processingTime: Date.now() - startTime,
          provider: 'Fallback'
        };
      }
    } catch (error) {
      console.error('Error generating detailed plans:', error);
      const fallbackPlans = enhancedGroqService.generateFallbackDetailedPlans(request);
      return {
        success: true,
        data: fallbackPlans,
        processingTime: Date.now() - startTime,
        provider: 'Fallback'
      };
    }
  }

  // Select the most appropriate plan based on user profile and preferences
  private selectOptimalPlan(plans: DetailedPlan[], request: PlanGenerationRequest): DetailedPlan {
    const { user_profile, customization_preferences } = request;
    
    // Score each plan based on user preferences
    const planScores = plans.map(plan => {
      let score = 0;
      
      // Health score alignment
      if (request.health_score < 40 && plan.difficulty === 'Beginner') score += 3;
      else if (request.health_score >= 40 && request.health_score < 70 && plan.difficulty === 'Intermediate') score += 3;
      else if (request.health_score >= 70 && plan.difficulty === 'Advanced') score += 3;
      
      // Timeline alignment
      if (plan.duration_weeks <= user_profile.timeline_preferences.duration_weeks) score += 2;
      
      // Intensity preference
      if (customization_preferences?.workout_intensity) {
        const intensityMap = { low: 'Beginner', medium: 'Intermediate', high: 'Advanced' };
        if (plan.difficulty === intensityMap[customization_preferences.workout_intensity]) score += 2;
      }
      
      // Equipment availability
      if (customization_preferences?.equipment_access) {
        const hasRequiredEquipment = plan.equipment_needed.every(equipment => 
          equipment === 'No equipment needed' || 
          customization_preferences.equipment_access.includes(equipment)
        );
        if (hasRequiredEquipment) score += 2;
      }
      
      // Focus areas alignment
      const matchingFocusAreas = plan.focus_areas.filter(area => 
        user_profile.health_goals.some(goal => 
          goal.toLowerCase().includes(area.toLowerCase()) || 
          area.toLowerCase().includes(goal.toLowerCase())
        )
      ).length;
      score += matchingFocusAreas;
      
      return { plan, score };
    });
    
    // Sort by score and return the best plan
    planScores.sort((a, b) => b.score - a.score);
    return planScores[0].plan;
  }

  // Create initial progress tracking
  private createInitialProgress(plan: DetailedPlan, userProfile: UserOnboardingData): PlanProgress {
    return {
      user_id: userProfile.id,
      plan_id: plan.id,
      current_week: 1,
      total_weeks: plan.duration_weeks,
      overall_completion_rate: 0,
      weekly_completion_rates: [],
      milestone_achievements: [],
      adaptation_history: [],
      next_milestone: {
        week: 1,
        milestone: plan.progression_milestones[0]?.milestone || 'Start your journey',
        requirements: plan.progression_milestones[0]?.expected_outcome?.split(', ') || ['Complete daily activities'],
        estimated_achievement_date: this.calculateMilestoneDate(1, plan.duration_weeks)
      }
    };
  }

  // Calculate milestone date
  private calculateMilestoneDate(week: number, totalWeeks: number): string {
    const startDate = new Date();
    const milestoneDate = new Date(startDate.getTime() + (week * 7 * 24 * 60 * 60 * 1000));
    return milestoneDate.toISOString().split('T')[0];
  }

  // Get weather conditions (mock implementation)
  private async getWeatherConditions(): Promise<any> {
    // In a real implementation, this would call a weather API
    return {
      temperature: 22,
      conditions: 'sunny',
      outdoor_suitable: true
    };
  }

  // Get special events (mock implementation)
  private async getSpecialEvents(userProfile: UserOnboardingData): Promise<any[]> {
    // In a real implementation, this would check user's calendar or events
    return [];
  }

  // Generate daily schedule for a specific date
  async generateDailySchedule(userId: string, targetDate: string): Promise<UnifiedResponse> {
    const startTime = Date.now();
    
    try {
      const userPlan = midnightScheduler.getUserPlan(userId);
      if (!userPlan) {
        throw new Error('User plan not found');
      }

      const scheduleRequest: ScheduleGenerationRequest = {
        plan_data: userPlan.plan_data,
        user_profile: userPlan.user_profile,
        target_date: targetDate,
        previous_day_performance: await this.getPreviousDayPerformance(userId, targetDate),
        weather_conditions: await this.getWeatherConditions(),
        special_events: await this.getSpecialEvents(userPlan.user_profile)
      };

      const response = await geminiScheduleService.generateDailySchedule(scheduleRequest);
      
      return {
        success: response.success,
        data: response.data,
        error: response.error,
        processingTime: Date.now() - startTime,
        provider: 'Gemini'
      };
    } catch (error) {
      console.error('Error generating daily schedule:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
        processingTime: Date.now() - startTime
      };
    }
  }

  // Get previous day's performance
  private async getPreviousDayPerformance(userId: string, currentDate: string): Promise<any> {
    // This would typically fetch from your database
    // For now, return mock data
    return {
      completion_rate: Math.floor(Math.random() * 40) + 60,
      difficulty_feedback: Math.floor(Math.random() * 5) + 3,
      energy_levels: Math.floor(Math.random() * 5) + 4,
      notes: "Good day overall"
    };
  }

  // Update user plan preferences
  async updateUserPlan(userId: string, updates: Partial<UserOnboardingData>): Promise<UnifiedResponse> {
    const startTime = Date.now();
    
    try {
      const userPlan = midnightScheduler.getUserPlan(userId);
      if (!userPlan) {
        throw new Error('User plan not found');
      }

      // Update user profile
      const updatedProfile = { ...userPlan.user_profile, ...updates };
      
      // Update the plan in the scheduler
      midnightScheduler.updateUserPlan(userId, {
        user_profile: updatedProfile
      });

      return {
        success: true,
        data: { message: 'User plan updated successfully' },
        processingTime: Date.now() - startTime,
        provider: 'Unified'
      };
    } catch (error) {
      console.error('Error updating user plan:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
        processingTime: Date.now() - startTime
      };
    }
  }

  // Get user progress
  async getUserProgress(userId: string): Promise<UnifiedResponse> {
    const startTime = Date.now();
    
    try {
      const userPlan = midnightScheduler.getUserPlan(userId);
      if (!userPlan) {
        throw new Error('User plan not found');
      }

      return {
        success: true,
        data: userPlan.progress_data,
        processingTime: Date.now() - startTime,
        provider: 'Unified'
      };
    } catch (error) {
      console.error('Error getting user progress:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
        processingTime: Date.now() - startTime
      };
    }
  }

  // Force update user schedule (for testing)
  async forceUpdateUserSchedule(userId: string): Promise<UnifiedResponse> {
    const startTime = Date.now();
    
    try {
      await midnightScheduler.forceUpdate(userId);
      
      return {
        success: true,
        data: { message: 'User schedule updated successfully' },
        processingTime: Date.now() - startTime,
        provider: 'Unified'
      };
    } catch (error) {
      console.error('Error forcing update:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
        processingTime: Date.now() - startTime
      };
    }
  }

  // Get scheduler status
  getSchedulerStatus(): any {
    return midnightScheduler.getStatus();
  }

  // Stop scheduler (for cleanup)
  stopScheduler(): void {
    midnightScheduler.stopScheduler();
  }
}

// Export singleton instance
export const unifiedPlanService = new UnifiedPlanService();
export default unifiedPlanService;
