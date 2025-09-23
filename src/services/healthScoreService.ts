import { supabase } from "@/integrations/supabase/client";

export interface DailyActivity {
  id?: string;
  user_id: string;
  activity_date: string;
  exercise_completed: boolean;
  nutrition_completed: boolean;
  hydration_completed: boolean;
  meals_completed: boolean;
  sleep_completed: boolean;
  exercise_duration?: number;
  water_intake?: number;
  calories_consumed?: number;
  sleep_hours?: number;
  created_at?: string;
  updated_at?: string;
}

export interface HealthScore {
  id?: string;
  user_id: string;
  score: number;
  streak_days: number;
  last_updated: string;
  created_at?: string;
  updated_at?: string;
}

export interface WeeklyView {
  exercise_completed: boolean;
  nutrition_completed: boolean;
  hydration_completed: boolean;
  meals_completed: boolean;
  sleep_completed: boolean;
  activity_date: string;
}

export interface HealthScoreData {
  score: number;
  streak_days: number;
  weekly_view: WeeklyView[];
  streak_bonus: number;
}

export class HealthScoreService {
  /**
   * Get current health score and weekly data for a user
   */
  async getHealthScoreData(userId: string): Promise<HealthScoreData> {
    try {
      // Get current health score
      const { data: healthScore, error: scoreError } = await supabase
        .from("health_scores")
        .select("*")
        .eq("user_id", userId)
        .single();

      if (scoreError && scoreError.code !== "PGRST116") {
        throw scoreError;
      }

      // Get weekly view data
      const { data: weeklyData, error: weeklyError } = await supabase.rpc(
        "get_weekly_view",
        { p_user_id: userId }
      );

      if (weeklyError) {
        throw weeklyError;
      }

      // Calculate streak bonus
      const streakBonus = this.calculateStreakBonus(
        healthScore?.streak_days || 0
      );

      return {
        score: healthScore?.score || 0,
        streak_days: healthScore?.streak_days || 0,
        weekly_view: weeklyData || [],
        streak_bonus: streakBonus,
      };
    } catch (error) {
      console.error("Error getting health score data:", error);
      throw error;
    }
  }

  /**
   * Update daily activity for a user
   */
  async updateDailyActivity(
    userId: string,
    activityDate: string,
    updates: Partial<DailyActivity>
  ): Promise<DailyActivity> {
    try {
      const { data, error } = await supabase
        .from("daily_activities")
        .upsert({
          user_id: userId,
          activity_date: activityDate,
          ...updates,
          updated_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (error) {
        throw error;
      }

      // Update health score after activity update
      await this.updateHealthScore(userId);

      return data;
    } catch (error) {
      console.error("Error updating daily activity:", error);
      throw error;
    }
  }

  /**
   * Update health score based on recent activities
   */
  async updateHealthScore(userId: string): Promise<number> {
    try {
      const { data, error } = await supabase.rpc("update_health_score", {
        p_user_id: userId,
      });

      if (error) {
        throw error;
      }

      return data;
    } catch (error) {
      console.error("Error updating health score:", error);
      throw error;
    }
  }

  /**
   * Get today's activities for a user
   */
  async getTodayActivities(userId: string): Promise<DailyActivity | null> {
    try {
      const today = new Date().toISOString().split("T")[0];

      const { data, error } = await supabase
        .from("daily_activities")
        .select("*")
        .eq("user_id", userId)
        .eq("activity_date", today)
        .single();

      if (error && error.code !== "PGRST116") {
        throw error;
      }

      return data;
    } catch (error) {
      console.error("Error getting today activities:", error);
      throw error;
    }
  }

  /**
   * Mark activity as completed
   */
  async markActivityCompleted(
    userId: string,
    activityType: "exercise" | "nutrition" | "hydration" | "meals" | "sleep",
    completed: boolean = true,
    additionalData?: {
      exercise_duration?: number;
      water_intake?: number;
      calories_consumed?: number;
      sleep_hours?: number;
    }
  ): Promise<void> {
    try {
      const today = new Date().toISOString().split("T")[0];

      const updateData: any = {
        [`${activityType}_completed`]: completed,
        updated_at: new Date().toISOString(),
      };

      if (additionalData) {
        Object.assign(updateData, additionalData);
      }

      await this.updateDailyActivity(userId, today, updateData);
    } catch (error) {
      console.error(`Error marking ${activityType} as completed:`, error);
      throw error;
    }
  }

  /**
   * Calculate streak bonus multiplier
   */
  private calculateStreakBonus(streakDays: number): number {
    if (streakDays >= 7) return 1.2;
    if (streakDays >= 3) return 1.1;
    return 1.0;
  }

  /**
   * Get activity completion percentage for the week
   */
  getWeeklyCompletionPercentage(weeklyView: WeeklyView[]): number {
    if (weeklyView.length === 0) return 0;

    const totalActivities = weeklyView.length * 5; // 5 activities per day
    const completedActivities = weeklyView.reduce((total, day) => {
      return (
        total +
        [
          day.exercise_completed,
          day.nutrition_completed,
          day.hydration_completed,
          day.meals_completed,
          day.sleep_completed,
        ].filter(Boolean).length
      );
    }, 0);

    return Math.round((completedActivities / totalActivities) * 100);
  }

  /**
   * Initialize health score for new user
   */
  async initializeHealthScore(userId: string): Promise<void> {
    try {
      await this.updateHealthScore(userId);
    } catch (error) {
      console.error("Error initializing health score:", error);
      throw error;
    }
  }
}

export const healthScoreService = new HealthScoreService();
