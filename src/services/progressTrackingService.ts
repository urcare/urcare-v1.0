import { supabase } from "@/integrations/supabase/client";
import {
  DailyPlanExecution,
  MonthlyAssessment,
  WeeklyProgressTracking,
} from "@/types/comprehensiveHealthPlan";

export class ProgressTrackingService {
  /**
   * Update daily activity completion
   */
  async updateDailyActivityCompletion(
    planId: string,
    executionDate: string,
    activityId: string,
    isCompleted: boolean
  ): Promise<void> {
    try {
      // Get current daily execution
      const { data: dailyExecution, error: fetchError } = await supabase
        .from("daily_plan_execution")
        .select("*")
        .eq("plan_id", planId)
        .eq("execution_date", executionDate)
        .single();

      if (fetchError) {
        throw new Error(
          `Failed to fetch daily execution: ${fetchError.message}`
        );
      }

      // Update the specific activity in the JSONB data
      const updatedActivities = dailyExecution.daily_activities.map(
        (activity: any) => {
          if (activity.id === activityId) {
            return { ...activity, is_completed: isCompleted };
          }
          return activity;
        }
      );

      // Calculate new completion percentage
      const completedCount = updatedActivities.filter(
        (activity: any) => activity.is_completed
      ).length;
      const newCompletionPercentage =
        (completedCount / updatedActivities.length) * 100;

      // Update the daily execution
      const { error: updateError } = await supabase
        .from("daily_plan_execution")
        .update({
          daily_activities: updatedActivities,
          activities_completed: completedCount,
          completion_percentage: newCompletionPercentage,
          status:
            newCompletionPercentage === 100
              ? "completed"
              : newCompletionPercentage > 0
              ? "in_progress"
              : "pending",
        })
        .eq("id", dailyExecution.id);

      if (updateError) {
        throw new Error(
          `Failed to update daily execution: ${updateError.message}`
        );
      }

      // Update weekly progress if needed
      await this.updateWeeklyProgress(planId, dailyExecution.week_number);
    } catch (error) {
      console.error("Error updating daily activity completion:", error);
      throw error;
    }
  }

  /**
   * Update weekly progress tracking
   */
  async updateWeeklyProgress(
    planId: string,
    weekNumber: number
  ): Promise<void> {
    try {
      // Get all daily executions for the week
      const { data: dailyExecutions, error: fetchError } = await supabase
        .from("daily_plan_execution")
        .select("*")
        .eq("plan_id", planId)
        .eq("week_number", weekNumber);

      if (fetchError) {
        throw new Error(
          `Failed to fetch daily executions: ${fetchError.message}`
        );
      }

      // Calculate weekly metrics
      const totalActivities = dailyExecutions.reduce(
        (sum, day) => sum + day.total_activities,
        0
      );
      const completedActivities = dailyExecutions.reduce(
        (sum, day) => sum + day.activities_completed,
        0
      );
      const complianceRate =
        totalActivities > 0 ? (completedActivities / totalActivities) * 100 : 0;

      // Get or create weekly progress record
      const { data: existingWeekly, error: weeklyFetchError } = await supabase
        .from("weekly_progress_tracking")
        .select("*")
        .eq("plan_id", planId)
        .eq("week_number", weekNumber)
        .single();

      const weekStartDate = new Date();
      weekStartDate.setDate(
        weekStartDate.getDate() - ((weekStartDate.getDay() + 6) % 7)
      );
      const weekEndDate = new Date(weekStartDate);
      weekEndDate.setDate(weekStartDate.getDate() + 6);

      if (weeklyFetchError && weeklyFetchError.code === "PGRST116") {
        // Create new weekly progress record
        const { error: createError } = await supabase
          .from("weekly_progress_tracking")
          .insert({
            plan_id: planId,
            user_id: dailyExecutions[0]?.user_id,
            week_number: weekNumber,
            week_start_date: weekStartDate.toISOString().split("T")[0],
            week_end_date: weekEndDate.toISOString().split("T")[0],
            total_activities: totalActivities,
            completed_activities: completedActivities,
            compliance_rate: complianceRate,
            status:
              complianceRate >= 70
                ? "completed"
                : complianceRate >= 50
                ? "in_progress"
                : "needs_adjustment",
          });

        if (createError) {
          throw new Error(
            `Failed to create weekly progress: ${createError.message}`
          );
        }
      } else if (!weeklyFetchError) {
        // Update existing weekly progress record
        const { error: updateError } = await supabase
          .from("weekly_progress_tracking")
          .update({
            total_activities: totalActivities,
            completed_activities: completedActivities,
            compliance_rate: complianceRate,
            status:
              complianceRate >= 70
                ? "completed"
                : complianceRate >= 50
                ? "in_progress"
                : "needs_adjustment",
          })
          .eq("id", existingWeekly.id);

        if (updateError) {
          throw new Error(
            `Failed to update weekly progress: ${updateError.message}`
          );
        }
      }

      // Update overall plan progress
      await this.updateOverallPlanProgress(planId);
    } catch (error) {
      console.error("Error updating weekly progress:", error);
      throw error;
    }
  }

  /**
   * Update overall plan progress
   */
  async updateOverallPlanProgress(planId: string): Promise<void> {
    try {
      // Get all weekly progress records
      const { data: weeklyProgress, error: fetchError } = await supabase
        .from("weekly_progress_tracking")
        .select("*")
        .eq("plan_id", planId);

      if (fetchError) {
        throw new Error(
          `Failed to fetch weekly progress: ${fetchError.message}`
        );
      }

      // Calculate overall metrics
      const totalActivities = weeklyProgress.reduce(
        (sum, week) => sum + week.total_activities,
        0
      );
      const completedActivities = weeklyProgress.reduce(
        (sum, week) => sum + week.completed_activities,
        0
      );
      const overallProgress =
        totalActivities > 0 ? (completedActivities / totalActivities) * 100 : 0;
      const weeklyComplianceRate =
        weeklyProgress.length > 0
          ? weeklyProgress.reduce(
              (sum, week) => sum + week.compliance_rate,
              0
            ) / weeklyProgress.length
          : 0;

      // Update the comprehensive plan
      const { error: updateError } = await supabase
        .from("comprehensive_health_plans")
        .update({
          overall_progress_percentage: overallProgress,
          weekly_compliance_rate: weeklyComplianceRate,
          last_updated_at: new Date().toISOString(),
        })
        .eq("id", planId);

      if (updateError) {
        throw new Error(
          `Failed to update overall plan progress: ${updateError.message}`
        );
      }
    } catch (error) {
      console.error("Error updating overall plan progress:", error);
      throw error;
    }
  }

  /**
   * Get daily plan for specific date
   */
  async getDailyPlan(
    planId: string,
    date: string
  ): Promise<DailyPlanExecution | null> {
    try {
      const { data, error } = await supabase
        .from("daily_plan_execution")
        .select("*")
        .eq("plan_id", planId)
        .eq("execution_date", date)
        .single();

      if (error && error.code !== "PGRST116") {
        throw new Error(`Failed to fetch daily plan: ${error.message}`);
      }

      return data;
    } catch (error) {
      console.error("Error fetching daily plan:", error);
      throw error;
    }
  }

  /**
   * Get weekly progress for specific week
   */
  async getWeeklyProgress(
    planId: string,
    weekNumber: number
  ): Promise<WeeklyProgressTracking | null> {
    try {
      const { data, error } = await supabase
        .from("weekly_progress_tracking")
        .select("*")
        .eq("plan_id", planId)
        .eq("week_number", weekNumber)
        .single();

      if (error && error.code !== "PGRST116") {
        throw new Error(`Failed to fetch weekly progress: ${error.message}`);
      }

      return data;
    } catch (error) {
      console.error("Error fetching weekly progress:", error);
      throw error;
    }
  }

  /**
   * Get monthly assessment for specific month
   */
  async getMonthlyAssessment(
    planId: string,
    monthNumber: number
  ): Promise<MonthlyAssessment | null> {
    try {
      const { data, error } = await supabase
        .from("monthly_assessments")
        .select("*")
        .eq("plan_id", planId)
        .eq("month_number", monthNumber)
        .single();

      if (error && error.code !== "PGRST116") {
        throw new Error(`Failed to fetch monthly assessment: ${error.message}`);
      }

      return data;
    } catch (error) {
      console.error("Error fetching monthly assessment:", error);
      throw error;
    }
  }

  /**
   * Submit monthly assessment
   */
  async submitMonthlyAssessment(
    planId: string,
    monthNumber: number,
    assessmentData: Partial<MonthlyAssessment>
  ): Promise<void> {
    try {
      const { error } = await supabase.from("monthly_assessments").upsert({
        plan_id: planId,
        month_number: monthNumber,
        assessment_date: new Date().toISOString().split("T")[0],
        status: "completed",
        ...assessmentData,
      });

      if (error) {
        throw new Error(
          `Failed to submit monthly assessment: ${error.message}`
        );
      }
    } catch (error) {
      console.error("Error submitting monthly assessment:", error);
      throw error;
    }
  }

  /**
   * Get plan progress summary
   */
  async getPlanProgressSummary(planId: string): Promise<{
    overallProgress: number;
    weeklyCompliance: number;
    currentWeek: number;
    daysRemaining: number;
    milestonesAchieved: number;
    totalMilestones: number;
  }> {
    try {
      // Get plan details
      const { data: plan, error: planError } = await supabase
        .from("comprehensive_health_plans")
        .select("*")
        .eq("id", planId)
        .single();

      if (planError) {
        throw new Error(`Failed to fetch plan: ${planError.message}`);
      }

      // Get weekly progress
      const { data: weeklyProgress, error: weeklyError } = await supabase
        .from("weekly_progress_tracking")
        .select("*")
        .eq("plan_id", planId);

      if (weeklyError) {
        throw new Error(
          `Failed to fetch weekly progress: ${weeklyError.message}`
        );
      }

      // Calculate current week
      const startDate = new Date(plan.start_date);
      const currentDate = new Date();
      const diffTime = Math.abs(currentDate.getTime() - startDate.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      const currentWeek = Math.min(
        Math.ceil(diffDays / 7),
        plan.duration_weeks
      );

      // Calculate days remaining
      const endDate = new Date(plan.target_end_date);
      const daysRemaining = Math.max(
        0,
        Math.ceil(
          (endDate.getTime() - currentDate.getTime()) / (1000 * 60 * 60 * 24)
        )
      );

      // Calculate milestones achieved
      const milestonesAchieved = weeklyProgress.reduce(
        (sum, week) => sum + (week.milestones_achieved?.length || 0),
        0
      );
      const totalMilestones = plan.weekly_milestones?.length || 0;

      return {
        overallProgress: plan.overall_progress_percentage,
        weeklyCompliance: plan.weekly_compliance_rate,
        currentWeek,
        daysRemaining,
        milestonesAchieved,
        totalMilestones,
      };
    } catch (error) {
      console.error("Error getting plan progress summary:", error);
      throw error;
    }
  }

  /**
   * Get real-time progress updates
   */
  async subscribeToProgressUpdates(
    planId: string,
    onUpdate: (progress: any) => void
  ): Promise<() => void> {
    try {
      const subscription = supabase
        .channel(`plan-progress-${planId}`)
        .on(
          "postgres_changes",
          {
            event: "*",
            schema: "public",
            table: "daily_plan_execution",
            filter: `plan_id=eq.${planId}`,
          },
          async () => {
            try {
              // Fetch updated progress when changes occur
              const summary = await this.getPlanProgressSummary(planId);
              onUpdate(summary);
            } catch (error) {
              console.warn("Error fetching progress summary in subscription:", error);
              // Provide fallback progress data
              onUpdate({
                overallProgress: 0,
                weeklyCompliance: 0,
                currentWeek: 1,
                daysRemaining: 28,
                milestonesAchieved: 0,
                totalMilestones: 4,
              });
            }
          }
        )
        .on(
          "postgres_changes",
          {
            event: "*",
            schema: "public",
            table: "weekly_progress_tracking",
            filter: `plan_id=eq.${planId}`,
          },
          async () => {
            try {
              // Fetch updated progress when changes occur
              const summary = await this.getPlanProgressSummary(planId);
              onUpdate(summary);
            } catch (error) {
              console.warn("Error fetching progress summary in subscription:", error);
              // Provide fallback progress data
              onUpdate({
                overallProgress: 0,
                weeklyCompliance: 0,
                currentWeek: 1,
                daysRemaining: 28,
                milestonesAchieved: 0,
                totalMilestones: 4,
              });
            }
          }
        )
        .subscribe();

      return () => {
        try {
          subscription.unsubscribe();
        } catch (error) {
          console.warn("Error unsubscribing from progress updates:", error);
        }
      };
    } catch (error) {
      console.error("Error subscribing to progress updates:", error);
      // Return a no-op unsubscribe function as fallback
      return () => {
        console.warn("No-op unsubscribe called due to subscription error");
      };
    }
  }
}

export const progressTrackingService = new ProgressTrackingService();
