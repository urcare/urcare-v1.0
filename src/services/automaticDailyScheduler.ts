/**
 * AUTOMATIC DAILY SCHEDULER SERVICE
 *
 * Service for automatically generating next day schedules
 * and managing daily progression
 */

import { supabase } from "@/integrations/supabase/client";
import {
  DailySchedule,
  IntelligentHealthPlanningService,
} from "./intelligentHealthPlanningService";

export interface SchedulerConfig {
  autoGenerateNextDay: boolean;
  adjustDifficultyBasedOnCompletion: boolean;
  maxDifficultyAdjustment: number; // 0-1 scale
  completionThresholdForIncrease: number; // 0-100
  completionThresholdForDecrease: number; // 0-100
}

export interface DailyProgress {
  date: string;
  totalActivities: number;
  completedActivities: number;
  completionRate: number;
  difficulty: string;
  adjustedDifficulty?: string;
  notes?: string;
}

export class AutomaticDailyScheduler {
  private static defaultConfig: SchedulerConfig = {
    autoGenerateNextDay: true,
    adjustDifficultyBasedOnCompletion: true,
    maxDifficultyAdjustment: 0.3,
    completionThresholdForIncrease: 85,
    completionThresholdForDecrease: 50,
  };

  /**
   * Check if next day schedule needs to be generated
   */
  static async checkAndGenerateNextDay(
    userId: string,
    config: SchedulerConfig = this.defaultConfig
  ): Promise<DailySchedule | null> {
    console.log("🔄 Checking if next day schedule needs to be generated...");

    try {
      // Get current date and next date
      const today = new Date();
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);

      const todayStr = today.toISOString().split("T")[0];
      const tomorrowStr = tomorrow.toISOString().split("T")[0];

      // Check if tomorrow's schedule already exists
      const { data: existingSchedule } = await supabase
        .from("daily_schedules")
        .select("*")
        .eq("user_id", userId)
        .eq("date", tomorrowStr)
        .single();

      if (existingSchedule) {
        console.log("✅ Tomorrow's schedule already exists");
        return existingSchedule.schedule as DailySchedule;
      }

      // Get today's completion rate
      const todayProgress = await this.getDailyProgress(userId, todayStr);

      if (!todayProgress) {
        console.log("⚠️ No progress data for today, cannot generate schedule");
        return null;
      }

      // Generate next day schedule based on today's performance
      const nextDaySchedule = await this.generateNextDaySchedule(
        userId,
        tomorrowStr,
        todayProgress.completionRate
      );

      // Save the generated schedule
      if (nextDaySchedule) {
        await this.saveDailySchedule(userId, tomorrowStr, nextDaySchedule);
      }

      return nextDaySchedule;
    } catch (error) {
      console.error("Error checking and generating next day:", error);
      return null;
    }
  }

  /**
   * Generate next day schedule based on user's current plan and performance
   */
  private static async generateNextDaySchedule(
    userId: string,
    date: string,
    previousDayCompletion: number
  ): Promise<DailySchedule | null> {
    console.log(`📅 Generating next day schedule for ${date}...`);

    try {
      // Get user's current active plan
      const { data: currentPlan } = await supabase
        .from("weekly_plans")
        .select("*")
        .eq("user_id", userId)
        .eq("is_active", true)
        .single();

      if (!currentPlan) {
        console.log("⚠️ No active plan found for user");
        return null;
      }

      // Generate the next day schedule using the intelligent planning service
      const nextDaySchedule =
        await IntelligentHealthPlanningService.generateNextDaySchedule(
          userId,
          new Date(date).toISOString().split("T")[0],
          previousDayCompletion
        );

      return nextDaySchedule;
    } catch (error) {
      console.error("Error generating next day schedule:", error);
      return null;
    }
  }

  /**
   * Get daily progress for a specific date
   */
  static async getDailyProgress(
    userId: string,
    date: string
  ): Promise<DailyProgress | null> {
    console.log(`📊 Getting daily progress for ${date}...`);

    try {
      // Get activity completions for the date
      const { data: completions } = await supabase
        .from("activity_completions")
        .select("*")
        .eq("user_id", userId)
        .gte("created_at", `${date}T00:00:00`)
        .lt("created_at", `${date}T23:59:59`);

      if (!completions || completions.length === 0) {
        return null;
      }

      const totalActivities = completions.length;
      const completedActivities = completions.filter((c) => c.completed).length;
      const completionRate =
        totalActivities > 0 ? (completedActivities / totalActivities) * 100 : 0;

      // Get current plan difficulty
      const { data: currentPlan } = await supabase
        .from("weekly_plans")
        .select("difficulty")
        .eq("user_id", userId)
        .eq("is_active", true)
        .single();

      return {
        date,
        totalActivities,
        completedActivities,
        completionRate,
        difficulty: currentPlan?.difficulty || "moderate",
      };
    } catch (error) {
      console.error("Error getting daily progress:", error);
      return null;
    }
  }

  /**
   * Adjust difficulty based on completion rate
   */
  static adjustDifficulty(
    currentDifficulty: string,
    completionRate: number,
    config: SchedulerConfig = this.defaultConfig
  ): string {
    if (!config.adjustDifficultyBasedOnCompletion) {
      return currentDifficulty;
    }

    const difficultyLevels = ["easy", "moderate", "hard"];
    const currentIndex = difficultyLevels.indexOf(currentDifficulty);

    if (currentIndex === -1) {
      return currentDifficulty; // Unknown difficulty, return as is
    }

    let newIndex = currentIndex;

    // Increase difficulty if completion is high
    if (
      completionRate >= config.completionThresholdForIncrease &&
      currentIndex < difficultyLevels.length - 1
    ) {
      newIndex = Math.min(currentIndex + 1, difficultyLevels.length - 1);
    }
    // Decrease difficulty if completion is low
    else if (
      completionRate <= config.completionThresholdForDecrease &&
      currentIndex > 0
    ) {
      newIndex = Math.max(currentIndex - 1, 0);
    }

    return difficultyLevels[newIndex];
  }

  /**
   * Save daily schedule to database
   */
  private static async saveDailySchedule(
    userId: string,
    date: string,
    schedule: DailySchedule
  ): Promise<void> {
    console.log(`💾 Saving daily schedule for ${date}...`);

    try {
      const { error } = await supabase.from("daily_schedules").upsert({
        user_id: userId,
        date,
        schedule,
        completion_rate: 0, // Will be updated as activities are completed
        updated_at: new Date().toISOString(),
      });

      if (error) {
        throw new Error(`Failed to save daily schedule: ${error.message}`);
      }

      console.log("✅ Daily schedule saved successfully");
    } catch (error) {
      console.error("Error saving daily schedule:", error);
      throw error;
    }
  }

  /**
   * Get user's schedule for a specific date
   */
  static async getUserSchedule(
    userId: string,
    date: string
  ): Promise<DailySchedule | null> {
    console.log(`📅 Getting user schedule for ${date}...`);

    try {
      const { data, error } = await supabase
        .from("daily_schedules")
        .select("schedule")
        .eq("user_id", userId)
        .eq("date", date)
        .single();

      if (error) {
        if (error.code === "PGRST116") {
          // No schedule found, try to generate one
          console.log("No schedule found, generating...");
          return await this.checkAndGenerateNextDay(userId);
        }
        throw new Error(`Failed to get user schedule: ${error.message}`);
      }

      return (data?.schedule as DailySchedule) || null;
    } catch (error) {
      console.error("Error getting user schedule:", error);
      return null;
    }
  }

  /**
   * Update daily completion rate
   */
  static async updateDailyCompletionRate(
    userId: string,
    date: string
  ): Promise<void> {
    console.log(`📊 Updating daily completion rate for ${date}...`);

    try {
      // Get all activities for the date
      const { data: completions } = await supabase
        .from("activity_completions")
        .select("*")
        .eq("user_id", userId)
        .gte("created_at", `${date}T00:00:00`)
        .lt("created_at", `${date}T23:59:59`);

      if (!completions || completions.length === 0) {
        return;
      }

      const totalActivities = completions.length;
      const completedActivities = completions.filter((c) => c.completed).length;
      const completionRate =
        totalActivities > 0 ? (completedActivities / totalActivities) * 100 : 0;

      // Update the daily schedule with new completion rate
      const { error } = await supabase
        .from("daily_schedules")
        .update({
          completion_rate: completionRate,
          updated_at: new Date().toISOString(),
        })
        .eq("user_id", userId)
        .eq("date", date);

      if (error) {
        console.error("Error updating completion rate:", error);
      } else {
        console.log(
          `✅ Updated completion rate to ${completionRate.toFixed(1)}%`
        );
      }
    } catch (error) {
      console.error("Error updating daily completion rate:", error);
    }
  }

  /**
   * Get user's weekly progress summary
   */
  static async getWeeklyProgressSummary(
    userId: string,
    weekStart: string
  ): Promise<{
    weekStart: string;
    weekEnd: string;
    totalDays: number;
    completedDays: number;
    averageCompletion: number;
    difficultyProgression: string[];
    recommendations: string[];
  }> {
    console.log(
      `📈 Getting weekly progress summary for week starting ${weekStart}...`
    );

    try {
      const weekStartDate = new Date(weekStart);
      const weekEndDate = new Date(weekStartDate);
      weekEndDate.setDate(weekEndDate.getDate() + 6);

      // Get all daily schedules for the week
      const { data: schedules } = await supabase
        .from("daily_schedules")
        .select("*")
        .eq("user_id", userId)
        .gte("date", weekStart)
        .lte("date", weekEndDate.toISOString().split("T")[0])
        .order("date");

      if (!schedules || schedules.length === 0) {
        return {
          weekStart,
          weekEnd: weekEndDate.toISOString().split("T")[0],
          totalDays: 0,
          completedDays: 0,
          averageCompletion: 0,
          difficultyProgression: [],
          recommendations: [],
        };
      }

      const totalDays = schedules.length;
      const completedDays = schedules.filter(
        (s) => s.completion_rate >= 80
      ).length;
      const averageCompletion =
        schedules.reduce((sum, s) => sum + (s.completion_rate || 0), 0) /
        totalDays;

      // Get difficulty progression from the schedules
      const difficultyProgression = schedules.map((s) => {
        const schedule = s.schedule as DailySchedule;
        return schedule.summary.difficulty;
      });

      // Generate recommendations based on performance
      const recommendations = this.generateRecommendations(
        averageCompletion,
        completedDays,
        totalDays
      );

      return {
        weekStart,
        weekEnd: weekEndDate.toISOString().split("T")[0],
        totalDays,
        completedDays,
        averageCompletion,
        difficultyProgression,
        recommendations,
      };
    } catch (error) {
      console.error("Error getting weekly progress summary:", error);
      return {
        weekStart,
        weekEnd: new Date(
          new Date(weekStart).getTime() + 6 * 24 * 60 * 60 * 1000
        )
          .toISOString()
          .split("T")[0],
        totalDays: 0,
        completedDays: 0,
        averageCompletion: 0,
        difficultyProgression: [],
        recommendations: [],
      };
    }
  }

  /**
   * Generate recommendations based on performance
   */
  private static generateRecommendations(
    averageCompletion: number,
    completedDays: number,
    totalDays: number
  ): string[] {
    const recommendations: string[] = [];

    if (averageCompletion >= 90) {
      recommendations.push(
        "Excellent progress! Consider increasing difficulty for next week."
      );
      recommendations.push(
        "You're ready for more challenging workouts and nutrition goals."
      );
    } else if (averageCompletion >= 70) {
      recommendations.push("Good progress! Keep up the consistency.");
      recommendations.push(
        "Consider adding one extra activity per day to boost results."
      );
    } else if (averageCompletion >= 50) {
      recommendations.push(
        "You're making progress! Try to complete at least 70% of activities daily."
      );
      recommendations.push(
        "Consider adjusting your schedule to better fit your lifestyle."
      );
    } else {
      recommendations.push(
        "Let's focus on building consistency. Start with easier activities."
      );
      recommendations.push(
        "Consider reducing the number of activities per day to build habits."
      );
    }

    if (completedDays < totalDays * 0.5) {
      recommendations.push(
        "Try to complete at least 4 days per week for better results."
      );
    }

    return recommendations;
  }

  /**
   * Schedule automatic next day generation
   */
  static scheduleAutomaticGeneration(
    userId: string,
    config: SchedulerConfig = this.defaultConfig
  ): void {
    if (!config.autoGenerateNextDay) {
      return;
    }

    // Schedule to run at 11 PM every day
    const now = new Date();
    const scheduledTime = new Date(now);
    scheduledTime.setHours(23, 0, 0, 0); // 11 PM

    // If it's already past 11 PM, schedule for tomorrow
    if (now >= scheduledTime) {
      scheduledTime.setDate(scheduledTime.getDate() + 1);
    }

    const timeUntilScheduled = scheduledTime.getTime() - now.getTime();

    setTimeout(async () => {
      console.log("🕚 Running scheduled next day generation...");
      await this.checkAndGenerateNextDay(userId, config);

      // Schedule the next day
      this.scheduleAutomaticGeneration(userId, config);
    }, timeUntilScheduled);

    console.log(
      `⏰ Next day generation scheduled for ${scheduledTime.toLocaleString()}`
    );
  }
}

// ============================================================================
// EXPORT UTILITY FUNCTIONS
// ============================================================================

export const automaticDailyScheduler = {
  checkAndGenerateNextDay: AutomaticDailyScheduler.checkAndGenerateNextDay,
  getDailyProgress: AutomaticDailyScheduler.getDailyProgress,
  adjustDifficulty: AutomaticDailyScheduler.adjustDifficulty,
  getUserSchedule: AutomaticDailyScheduler.getUserSchedule,
  updateDailyCompletionRate: AutomaticDailyScheduler.updateDailyCompletionRate,
  getWeeklyProgressSummary: AutomaticDailyScheduler.getWeeklyProgressSummary,
  scheduleAutomaticGeneration:
    AutomaticDailyScheduler.scheduleAutomaticGeneration,
};

export default AutomaticDailyScheduler;
