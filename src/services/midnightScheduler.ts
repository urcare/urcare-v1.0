// Midnight Scheduler Service for Automatic Plan Updates
// Handles automatic daily schedule generation and updates at midnight

import { 
  DetailedPlan, 
  DailySchedule, 
  MidnightUpdateRequest,
  UserOnboardingData,
  PlanProgress
} from '@/types/planTypes';
// Removed unused AI service imports

interface SchedulerResponse {
  success: boolean;
  data?: any;
  error?: string;
  processingTime: number;
}

interface UserPlanData {
  user_id: string;
  plan_id: string;
  plan_data: DetailedPlan;
  user_profile: UserOnboardingData;
  current_week: number;
  total_weeks: number;
  last_update: string;
  progress_data: PlanProgress;
}

class MidnightScheduler {
  private isRunning: boolean = false;
  private intervalId: NodeJS.Timeout | null = null;
  private userPlans: Map<string, UserPlanData> = new Map();

  constructor() {
    this.startScheduler();
  }

  // Start the midnight scheduler
  startScheduler(): void {
    if (this.isRunning) {
      console.log('Midnight scheduler is already running');
      return;
    }

    console.log('Starting midnight scheduler...');
    this.isRunning = true;

    // Check every minute for midnight
    this.intervalId = setInterval(() => {
      this.checkForMidnight();
    }, 60000); // Check every minute

    // Also check immediately
    this.checkForMidnight();
  }

  // Stop the midnight scheduler
  stopScheduler(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
    this.isRunning = false;
    console.log('Midnight scheduler stopped');
  }

  // Register a user plan for automatic updates
  registerUserPlan(userId: string, planData: DetailedPlan, userProfile: UserOnboardingData): void {
    const userPlanData: UserPlanData = {
      user_id: userId,
      plan_id: planData.id,
      plan_data: planData,
      user_profile: userProfile,
      current_week: 1,
      total_weeks: planData.duration_weeks,
      last_update: new Date().toISOString(),
      progress_data: {
        user_id: userId,
        plan_id: planData.id,
        current_week: 1,
        total_weeks: planData.duration_weeks,
        overall_completion_rate: 0,
        weekly_completion_rates: [],
        milestone_achievements: [],
        adaptation_history: [],
        next_milestone: {
          week: 1,
          milestone: planData.progression_milestones[0]?.milestone || 'Start your journey',
          requirements: planData.progression_milestones[0]?.expected_outcome?.split(', ') || ['Complete daily activities'],
          estimated_achievement_date: this.calculateMilestoneDate(1, planData.duration_weeks)
        }
      }
    };

    this.userPlans.set(userId, userPlanData);
    console.log(`Registered user plan for ${userId}: ${planData.title}`);
  }

  // Unregister a user plan
  unregisterUserPlan(userId: string): void {
    this.userPlans.delete(userId);
    console.log(`Unregistered user plan for ${userId}`);
  }

  // Update user plan data
  updateUserPlan(userId: string, updates: Partial<UserPlanData>): void {
    const existingPlan = this.userPlans.get(userId);
    if (existingPlan) {
      const updatedPlan = { ...existingPlan, ...updates };
      this.userPlans.set(userId, updatedPlan);
      console.log(`Updated user plan for ${userId}`);
    }
  }

  // Check if it's midnight and trigger updates
  private async checkForMidnight(): Promise<void> {
    const now = new Date();
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();

    // Check if it's between 00:00 and 00:05 (5-minute window)
    if (currentHour === 0 && currentMinute <= 5) {
      console.log('Midnight detected, triggering plan updates...');
      await this.processMidnightUpdates();
    }
  }

  // Process all midnight updates
  private async processMidnightUpdates(): Promise<void> {
    const today = new Date().toISOString().split('T')[0];
    const promises: Promise<void>[] = [];

    for (const [userId, userPlan] of this.userPlans) {
      // Check if we already updated today
      const lastUpdate = new Date(userPlan.last_update).toISOString().split('T')[0];
      if (lastUpdate === today) {
        continue; // Already updated today
      }

      promises.push(this.updateUserSchedule(userId, userPlan, today));
    }

    try {
      await Promise.all(promises);
      console.log(`Processed midnight updates for ${promises.length} users`);
    } catch (error) {
      console.error('Error processing midnight updates:', error);
    }
  }

  // Update a specific user's schedule
  private async updateUserSchedule(userId: string, userPlan: UserPlanData, targetDate: string): Promise<void> {
    try {
      console.log(`Updating schedule for user ${userId} for date ${targetDate}`);

      // Get previous day's performance data
      const previousDayPerformance = await this.getPreviousDayPerformance(userId, targetDate);

      // Create midnight update request
      const midnightRequest: MidnightUpdateRequest = {
        user_id: userId,
        plan_id: userPlan.plan_id,
        current_date: targetDate,
        previous_day_data: previousDayPerformance,
        adaptation_needed: this.shouldAdaptPlan(previousDayPerformance),
        reason_for_adaptation: this.getAdaptationReason(previousDayPerformance)
      };

      // Generate new schedule using Gemini
      // Fallback: Generate basic schedule update
      const scheduleResponse = { success: true, data: this.generateFallbackMidnightUpdate(midnightRequest) };

      if (scheduleResponse.success && scheduleResponse.data) {
        // Save the new schedule
        await this.saveDailySchedule(scheduleResponse.data);

        // Update user plan data
        this.updateUserPlan(userId, {
          last_update: new Date().toISOString(),
          current_week: this.calculateCurrentWeek(userPlan, targetDate),
          progress_data: await this.updateProgressData(userPlan, previousDayPerformance)
        });

        console.log(`Successfully updated schedule for user ${userId}`);
      } else {
        console.error(`Failed to generate schedule for user ${userId}:`, scheduleResponse.error);
        // Fallback to basic schedule
        await this.generateFallbackSchedule(userId, userPlan, targetDate);
      }
    } catch (error) {
      console.error(`Error updating schedule for user ${userId}:`, error);
    }
  }

  // Get previous day's performance data
  private async getPreviousDayPerformance(userId: string, currentDate: string): Promise<any> {
    // This would typically fetch from your database
    // For now, return mock data
    return {
      completion_rate: Math.floor(Math.random() * 40) + 60, // 60-100%
      activities_completed: Math.floor(Math.random() * 5) + 3, // 3-8 activities
      total_activities: 8,
      user_feedback: {
        difficulty_rating: Math.floor(Math.random() * 5) + 3, // 3-8
        energy_levels: Math.floor(Math.random() * 5) + 4, // 4-9
        satisfaction: Math.floor(Math.random() * 5) + 4, // 4-9
        notes: "Good day overall, felt energized"
      }
    };
  }

  // Determine if plan should be adapted
  private shouldAdaptPlan(performance: any): boolean {
    return performance.completion_rate < 70 || 
           performance.user_feedback.difficulty_rating > 7 ||
           performance.user_feedback.satisfaction < 6;
  }

  // Get reason for adaptation
  private getAdaptationReason(performance: any): string {
    if (performance.completion_rate < 70) {
      return "Low completion rate - reducing difficulty";
    }
    if (performance.user_feedback.difficulty_rating > 7) {
      return "High difficulty rating - simplifying activities";
    }
    if (performance.user_feedback.satisfaction < 6) {
      return "Low satisfaction - adding variety and adjusting approach";
    }
    return "Performance-based optimization";
  }

  // Calculate current week
  private calculateCurrentWeek(userPlan: UserPlanData, currentDate: string): number {
    const startDate = new Date(userPlan.progress_data.next_milestone.estimated_achievement_date);
    const current = new Date(currentDate);
    const diffTime = current.getTime() - startDate.getTime();
    const diffWeeks = Math.ceil(diffTime / (1000 * 60 * 60 * 24 * 7));
    return Math.max(1, Math.min(diffWeeks, userPlan.total_weeks));
  }

  // Update progress data
  private async updateProgressData(userPlan: UserPlanData, performance: any): Promise<PlanProgress> {
    const currentWeek = this.calculateCurrentWeek(userPlan, new Date().toISOString().split('T')[0]);
    
    // Update weekly completion rates
    const weeklyRates = [...userPlan.progress_data.weekly_completion_rates];
    const existingWeekIndex = weeklyRates.findIndex(w => w.week === currentWeek);
    
    if (existingWeekIndex >= 0) {
      weeklyRates[existingWeekIndex] = {
        week: currentWeek,
        completion_rate: performance.completion_rate,
        activities_completed: performance.activities_completed,
        total_activities: performance.total_activities
      };
    } else {
      weeklyRates.push({
        week: currentWeek,
        completion_rate: performance.completion_rate,
        activities_completed: performance.activities_completed,
        total_activities: performance.total_activities
      });
    }

    // Calculate overall completion rate
    const overallCompletionRate = weeklyRates.length > 0 
      ? weeklyRates.reduce((sum, week) => sum + week.completion_rate, 0) / weeklyRates.length
      : 0;

    // Check for milestone achievements
    const milestoneAchievements = [...userPlan.progress_data.milestone_achievements];
    const currentMilestone = userPlan.plan_data.progression_milestones.find(m => m.week === currentWeek);
    
    if (currentMilestone && performance.completion_rate >= 80) {
      milestoneAchievements.push({
        milestone: currentMilestone.milestone,
        achieved_date: new Date().toISOString(),
        notes: `Achieved with ${performance.completion_rate}% completion rate`
      });
    }

    // Update next milestone
    const nextMilestoneWeek = Math.min(currentWeek + 1, userPlan.total_weeks);
    const nextMilestone = userPlan.plan_data.progression_milestones.find(m => m.week === nextMilestoneWeek);

    return {
      ...userPlan.progress_data,
      current_week: currentWeek,
      overall_completion_rate: overallCompletionRate,
      weekly_completion_rates: weeklyRates,
      milestone_achievements: milestoneAchievements,
      next_milestone: nextMilestone ? {
        week: nextMilestoneWeek,
        milestone: nextMilestone.milestone,
        requirements: nextMilestone.expected_outcome.split(', '),
        estimated_achievement_date: this.calculateMilestoneDate(nextMilestoneWeek, userPlan.total_weeks)
      } : userPlan.progress_data.next_milestone
    };
  }

  // Calculate milestone date
  private calculateMilestoneDate(week: number, totalWeeks: number): string {
    const startDate = new Date();
    const milestoneDate = new Date(startDate.getTime() + (week * 7 * 24 * 60 * 60 * 1000));
    return milestoneDate.toISOString().split('T')[0];
  }

  // Save daily schedule to database
  private async saveDailySchedule(scheduleData: DailySchedule): Promise<void> {
    // This would typically save to your database
    console.log(`Saving daily schedule for user ${scheduleData.user_id} on ${scheduleData.date}`);
    // Implementation would depend on your database setup
  }

  // Generate fallback schedule when AI fails
  private async generateFallbackSchedule(userId: string, userPlan: UserPlanData, targetDate: string): Promise<void> {
    console.log(`Generating fallback schedule for user ${userId}`);
    
    // Use the plan's weekly structure as fallback
    const dayOfWeek = new Date(targetDate).toLocaleDateString('en-US', { weekday: 'lowercase' });
    const dayTemplate = userPlan.plan_data.weekly_structure[dayOfWeek as keyof typeof userPlan.plan_data.weekly_structure];
    
    // Create basic schedule from template
    const fallbackSchedule = {
      id: `schedule_${userId}_${targetDate}`,
      user_id: userId,
      plan_id: userPlan.plan_id,
      date: targetDate,
      day_of_week: dayOfWeek,
      day_type: dayTemplate.day_type,
      activities: dayTemplate.activities.map((activity, index) => ({
        id: `activity_${index}_${targetDate}`,
        template_id: activity.id,
        title: activity.title,
        category: activity.category,
        scheduled_time: activity.time_slot,
        duration_minutes: activity.duration_minutes,
        intensity: activity.intensity,
        description: activity.description,
        instructions: activity.instructions,
        equipment: activity.equipment,
        status: 'pending',
        completion_notes: '',
        actual_duration: 0,
        difficulty_rating: 0,
        satisfaction_rating: 0
      })),
      nutrition_plan: {
        date: targetDate,
        total_calories: userPlan.plan_data.nutrition_guidelines.daily_calories,
        meals: {
          breakfast: { name: "Healthy Breakfast", time: "07:00", calories: 400, macronutrients: { protein: 20, carbs: 50, fat: 15 }, ingredients: ["Oatmeal", "Berries"], preparation_time: 10, instructions: ["Cook oatmeal", "Add berries"], alternatives: ["Toast with avocado"], dietary_restrictions: [] },
          lunch: { name: "Balanced Lunch", time: "12:00", calories: 500, macronutrients: { protein: 25, carbs: 60, fat: 20 }, ingredients: ["Grilled chicken", "Quinoa"], preparation_time: 20, instructions: ["Grill chicken", "Cook quinoa"], alternatives: ["Salad bowl"], dietary_restrictions: [] },
          dinner: { name: "Light Dinner", time: "18:00", calories: 400, macronutrients: { protein: 30, carbs: 40, fat: 15 }, ingredients: ["Fish", "Vegetables"], preparation_time: 25, instructions: ["Bake fish", "Steam vegetables"], alternatives: ["Vegetarian option"], dietary_restrictions: [] },
          snacks: []
        },
        hydration: {
          target_water_intake: userPlan.plan_data.nutrition_guidelines.hydration_goals.daily_water_intake,
          timing_schedule: userPlan.plan_data.nutrition_guidelines.hydration_goals.timing_recommendations,
          current_intake: 0
        },
        supplements: []
      },
      recovery_focus: ["Proper sleep", "Stress management"],
      progress_notes: "Fallback schedule generated",
      completion_status: 'pending',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    await this.saveDailySchedule(fallbackSchedule);
  }

  // Get scheduler status
  getStatus(): { isRunning: boolean; registeredUsers: number; nextCheck: string } {
    return {
      isRunning: this.isRunning,
      registeredUsers: this.userPlans.size,
      nextCheck: new Date(Date.now() + 60000).toISOString()
    };
  }

  // Get user plan data
  getUserPlan(userId: string): UserPlanData | undefined {
    return this.userPlans.get(userId);
  }

  // Force update for a specific user (for testing)
  async forceUpdate(userId: string): Promise<void> {
    const userPlan = this.userPlans.get(userId);
    if (userPlan) {
      const today = new Date().toISOString().split('T')[0];
      await this.updateUserSchedule(userId, userPlan, today);
    }
  }

  // Fallback method for generating midnight updates
  private generateFallbackMidnightUpdate(request: MidnightUpdateRequest): any {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowStr = tomorrow.toISOString().split('T')[0];
    
    return {
      id: `schedule_${request.user_id}_${tomorrowStr}`,
      user_id: request.user_id,
      plan_id: request.plan_id,
      date: tomorrowStr,
      day_of_week: tomorrow.toLocaleDateString('en-US', { weekday: 'lowercase' }),
      day_type: "workout",
      activities: [
        {
          id: "morning_routine",
          title: "Morning Routine",
          category: "wellness",
          scheduled_time: "07:00",
          duration_minutes: 30,
          intensity: "low",
          description: "Start your day with a healthy morning routine",
          instructions: ["Wake up at scheduled time", "Drink water", "Light stretching", "Plan your day"],
          equipment: ["None"],
          status: "pending"
        },
        {
          id: "workout_session",
          title: "Workout Session",
          category: "exercise",
          scheduled_time: "18:00",
          duration_minutes: 45,
          intensity: "medium",
          description: "Your daily workout session",
          instructions: ["Warm up for 5 minutes", "Main workout for 35 minutes", "Cool down for 5 minutes"],
          equipment: ["Basic equipment"],
          status: "pending"
        }
      ],
      nutrition_plan: {
        total_calories: 2000,
        meals: {
          breakfast: { name: "Healthy Breakfast", time: "07:30", calories: 400 },
          lunch: { name: "Balanced Lunch", time: "13:00", calories: 600 },
          dinner: { name: "Light Dinner", time: "19:00", calories: 500 }
        }
      },
      completion_status: "pending",
      created_at: new Date().toISOString()
    };
  }
}

// Export singleton instance
export const midnightScheduler = new MidnightScheduler();
export default midnightScheduler;
