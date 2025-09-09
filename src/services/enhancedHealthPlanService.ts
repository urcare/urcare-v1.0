import { supabase } from "@/integrations/supabase/client";
import { HealthGoal } from "./goalTimelineCalculator";

export interface GoalAwareActivity {
  id: string;
  type:
    | "workout"
    | "meal"
    | "hydration"
    | "sleep"
    | "meditation"
    | "break"
    | "other";
  title: string;
  description: string;
  startTime: string;
  endTime: string;
  duration: number;
  priority: "high" | "medium" | "low";
  category: string;
  instructions?: string[];
  tips?: string[];
  relatedGoals: string[]; // Array of goal IDs this activity supports
  impactScore: number; // How much this activity contributes to goal progress (0-1)
  complianceWeight: number; // How important this activity is for goal success (0-1)
}

export interface GoalAwareDayPlan {
  date: string;
  activities: GoalAwareActivity[];
  summary: {
    totalActivities: number;
    workoutTime: number;
    mealCount: number;
    sleepHours: number;
    focusAreas: string[];
    goalContributions: {
      [goalId: string]: {
        activities: number;
        totalImpact: number;
        expectedProgress: number;
      };
    };
  };
}

export interface GoalAwareTwoDayPlan {
  day1: GoalAwareDayPlan;
  day2: GoalAwareDayPlan;
  overallGoals: string[];
  progressTips: string[];
  goalAlignment: {
    [goalId: string]: {
      goal: HealthGoal;
      activities: number;
      expectedWeeklyProgress: number;
      timelineAlignment: "on_track" | "ahead" | "behind";
    };
  };
}

export interface GoalAwareHealthPlanRecord {
  id: string;
  user_id: string;
  plan_start_date: string;
  plan_end_date: string;
  day_1_plan: GoalAwareDayPlan;
  day_2_plan: GoalAwareDayPlan;
  day_1_completed: boolean;
  day_2_completed: boolean;
  progress_data: any;
  goal_progress_data: {
    [goalId: string]: {
      expectedProgress: number;
      actualProgress: number;
      complianceRate: number;
      timelineAdjustment: number;
    };
  };
  generated_at: string;
  completed_at?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

class EnhancedHealthPlanService {
  /**
   * Generate a goal-aware health plan
   */
  async generateGoalAwareHealthPlan(): Promise<GoalAwareHealthPlanRecord> {
    try {
      // Get user's active goals
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error("User not authenticated");

      const { data: goals, error: goalsError } = await supabase
        .from("user_health_goals")
        .select("*")
        .eq("user_id", user.id)
        .eq("status", "active");

      if (goalsError) throw goalsError;

      // Get user profile
      const { data: profile, error: profileError } = await supabase
        .from("user_profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      if (profileError) throw profileError;

      // Generate goal-aware plan using enhanced AI prompt
      const { data, error } = await supabase.functions.invoke(
        "generate-goal-aware-health-plan",
        {
          method: "POST",
          body: {
            goals: goals || [],
            profile: profile,
            user_id: user.id,
          },
        }
      );

      if (error) {
        throw new Error(
          `Failed to generate goal-aware health plan: ${error.message}`
        );
      }

      if (!data.success) {
        throw new Error(
          data.error || "Failed to generate goal-aware health plan"
        );
      }

      return data.plan;
    } catch (error) {
      console.error("Error generating goal-aware health plan:", error);
      throw error;
    }
  }

  /**
   * Track activity compliance and update goal progress
   */
  async trackActivityCompliance(
    planId: string,
    activityId: string,
    dayNumber: number,
    complianceStatus: "completed" | "skipped" | "modified" | "partial",
    notes?: string
  ): Promise<void> {
    try {
      const { data, error } = await supabase
        .from("goal_compliance_tracking")
        .insert({
          plan_id: planId,
          activity_id: activityId,
          day_number: dayNumber,
          compliance_status: complianceStatus,
          notes: notes,
        });

      if (error) throw error;

      // Update goal progress based on compliance
      await this.updateGoalProgressFromCompliance(
        planId,
        activityId,
        complianceStatus
      );
    } catch (error) {
      console.error("Error tracking activity compliance:", error);
      throw error;
    }
  }

  /**
   * Update goal progress based on activity compliance
   */
  private async updateGoalProgressFromCompliance(
    planId: string,
    activityId: string,
    complianceStatus: string
  ): Promise<void> {
    try {
      // Get the plan to find related goals
      const { data: plan, error: planError } = await supabase
        .from("two_day_health_plans")
        .select("day_1_plan, day_2_plan")
        .eq("id", planId)
        .single();

      if (planError) throw planError;

      // Find the activity and its goal contributions
      const day1Activities = plan.day_1_plan.activities || [];
      const day2Activities = plan.day_2_plan.activities || [];
      const allActivities = [...day1Activities, ...day2Activities];

      const activity = allActivities.find((a) => a.id === activityId);
      if (!activity || !activity.relatedGoals) return;

      // Update progress for each related goal
      for (const goalId of activity.relatedGoals) {
        const impactScore = activity.impactScore || 0.1;
        const complianceWeight = activity.complianceWeight || 0.5;

        let progressChange = 0;
        switch (complianceStatus) {
          case "completed":
            progressChange = impactScore * complianceWeight;
            break;
          case "partial":
            progressChange = impactScore * complianceWeight * 0.5;
            break;
          case "skipped":
            progressChange = -impactScore * complianceWeight * 0.3; // Negative impact
            break;
          case "modified":
            progressChange = impactScore * complianceWeight * 0.7;
            break;
        }

        // Update goal progress
        await this.updateGoalProgress(goalId, progressChange);
      }
    } catch (error) {
      console.error("Error updating goal progress from compliance:", error);
    }
  }

  /**
   * Update individual goal progress
   */
  private async updateGoalProgress(
    goalId: string,
    progressChange: number
  ): Promise<void> {
    try {
      // Get current goal
      const { data: goal, error: goalError } = await supabase
        .from("user_health_goals")
        .select("*")
        .eq("id", goalId)
        .single();

      if (goalError) throw goalError;

      // Calculate new progress
      const newProgress = Math.max(
        0,
        Math.min(100, goal.progress_percentage + progressChange)
      );

      // Update goal
      const { error: updateError } = await supabase
        .from("user_health_goals")
        .update({
          progress_percentage: newProgress,
          updated_at: new Date().toISOString(),
        })
        .eq("id", goalId);

      if (updateError) throw updateError;

      // Record progress history
      await supabase.from("goal_progress_history").insert({
        goal_id: goalId,
        user_id: goal.user_id,
        date: new Date().toISOString().split("T")[0],
        current_value: goal.current_value,
        progress_percentage: newProgress,
        compliance_rate: 0, // This would be calculated from recent compliance data
        timeline_adjustment_days: 0, // This would be calculated based on progress vs expected
      });
    } catch (error) {
      console.error("Error updating goal progress:", error);
    }
  }

  /**
   * Get goal progress summary
   */
  async getGoalProgressSummary(userId: string): Promise<{
    totalGoals: number;
    activeGoals: number;
    completedGoals: number;
    averageProgress: number;
    timelineStatus: {
      onTrack: number;
      ahead: number;
      behind: number;
    };
  }> {
    try {
      const { data: goals, error } = await supabase
        .from("user_health_goals")
        .select("*")
        .eq("user_id", userId);

      if (error) throw error;

      const activeGoals = goals?.filter((g) => g.status === "active") || [];
      const completedGoals =
        goals?.filter((g) => g.status === "completed") || [];

      const averageProgress =
        activeGoals.length > 0
          ? activeGoals.reduce(
              (sum, goal) => sum + goal.progress_percentage,
              0
            ) / activeGoals.length
          : 0;

      // Calculate timeline status (simplified)
      const timelineStatus = {
        onTrack: 0,
        ahead: 0,
        behind: 0,
      };

      activeGoals.forEach((goal) => {
        const expectedProgress = this.calculateExpectedProgress(goal);
        const actualProgress = goal.progress_percentage;

        if (actualProgress >= expectedProgress * 1.1) {
          timelineStatus.ahead++;
        } else if (actualProgress < expectedProgress * 0.9) {
          timelineStatus.behind++;
        } else {
          timelineStatus.onTrack++;
        }
      });

      return {
        totalGoals: goals?.length || 0,
        activeGoals: activeGoals.length,
        completedGoals: completedGoals.length,
        averageProgress: Math.round(averageProgress),
        timelineStatus,
      };
    } catch (error) {
      console.error("Error getting goal progress summary:", error);
      throw error;
    }
  }

  /**
   * Calculate expected progress for a goal based on timeline
   */
  private calculateExpectedProgress(goal: HealthGoal): number {
    const startDate = new Date(goal.start_date);
    const targetDate = new Date(goal.target_date);
    const today = new Date();

    const totalDays = Math.ceil(
      (targetDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)
    );
    const daysElapsed = Math.ceil(
      (today.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)
    );

    if (daysElapsed <= 0) return 0;
    if (daysElapsed >= totalDays) return 100;

    return (daysElapsed / totalDays) * 100;
  }

  /**
   * Get adaptive plan adjustments based on compliance
   */
  async getAdaptiveAdjustments(goalId: string): Promise<{
    timelineAdjustment: number;
    intensityAdjustment: number;
    recommendations: string[];
  }> {
    try {
      // Get recent compliance data
      const { data: compliance, error } = await supabase
        .from("goal_compliance_tracking")
        .select("*")
        .eq("goal_id", goalId)
        .gte(
          "created_at",
          new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
        ) // Last 7 days
        .order("created_at", { ascending: false });

      if (error) throw error;

      // Calculate compliance rate
      const totalActivities = compliance?.length || 0;
      const completedActivities =
        compliance?.filter((c) => c.compliance_status === "completed").length ||
        0;
      const complianceRate =
        totalActivities > 0 ? completedActivities / totalActivities : 0;

      // Calculate adjustments
      let timelineAdjustment = 0;
      let intensityAdjustment = 0;
      const recommendations: string[] = [];

      if (complianceRate < 0.5) {
        // Low compliance - extend timeline and reduce intensity
        timelineAdjustment = 1.2; // 20% longer
        intensityAdjustment = 0.8; // 20% less intense
        recommendations.push(
          "Consider reducing the intensity of your activities"
        );
        recommendations.push(
          "Focus on building consistency rather than perfection"
        );
      } else if (complianceRate > 0.8) {
        // High compliance - can accelerate timeline
        timelineAdjustment = 0.9; // 10% shorter
        intensityAdjustment = 1.1; // 10% more intense
        recommendations.push(
          "Great job! You can consider increasing the intensity"
        );
        recommendations.push(
          "You're ahead of schedule - keep up the excellent work!"
        );
      } else {
        // Moderate compliance - maintain current pace
        timelineAdjustment = 1.0;
        intensityAdjustment = 1.0;
        recommendations.push("You're making steady progress - keep it up!");
      }

      return {
        timelineAdjustment,
        intensityAdjustment,
        recommendations,
      };
    } catch (error) {
      console.error("Error getting adaptive adjustments:", error);
      throw error;
    }
  }
}

export const enhancedHealthPlanService = new EnhancedHealthPlanService();
