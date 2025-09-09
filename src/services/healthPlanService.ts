import { supabase } from "@/integrations/supabase/client";

export interface HealthPlanActivity {
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
}

export interface DayPlan {
  date: string;
  activities: HealthPlanActivity[];
  summary: {
    totalActivities: number;
    workoutTime: number;
    mealCount: number;
    sleepHours: number;
    focusAreas: string[];
  };
}

export interface TwoDayPlan {
  day1: DayPlan;
  day2: DayPlan;
  overallGoals: string[];
  progressTips: string[];
}

export interface HealthPlanRecord {
  id: string;
  user_id: string;
  plan_start_date: string;
  plan_end_date: string;
  day_1_plan: DayPlan;
  day_2_plan: DayPlan;
  day_1_completed: boolean;
  day_2_completed: boolean;
  progress_data: any;
  generated_at: string;
  completed_at?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

class HealthPlanService {
  async generateHealthPlan(): Promise<HealthPlanRecord> {
    try {
      const { data, error } = await supabase.functions.invoke(
        "generate-ai-health-coach-plan",
        {
          method: "POST",
          body: {},
        }
      );

      if (error) {
        throw new Error(
          `Failed to generate AI Health Coach plan: ${error.message}`
        );
      }

      if (!data.success) {
        throw new Error(
          data.error || "Failed to generate AI Health Coach plan"
        );
      }

      return data.plan;
    } catch (error) {
      console.error("Error generating AI Health Coach plan:", error);
      throw error;
    }
  }

  async getCurrentPlan(): Promise<HealthPlanRecord | null> {
    try {
      const { data, error } = await supabase
        .from("two_day_health_plans")
        .select("*")
        .eq("is_active", true)
        .single();

      if (error && error.code !== "PGRST116") {
        throw new Error(`Failed to fetch current plan: ${error.message}`);
      }

      return data;
    } catch (error) {
      console.error("Error fetching current plan:", error);
      throw error;
    }
  }

  async markActivityCompleted(
    planId: string,
    activityId: string,
    dayNumber: number,
    notes?: string
  ) {
    try {
      const { data, error } = await supabase
        .from("plan_progress")
        .upsert(
          {
            plan_id: planId,
            activity_id: activityId,
            day_number: dayNumber,
            completed: true,
            completed_at: new Date().toISOString(),
            notes,
          },
          {
            onConflict: "plan_id,activity_id,day_number",
          }
        )
        .select()
        .single();

      if (error) {
        throw new Error(`Failed to update activity progress: ${error.message}`);
      }

      return data;
    } catch (error) {
      console.error("Error marking activity completed:", error);
      throw error;
    }
  }

  async getDayProgress(planId: string, dayNumber: number) {
    try {
      const { data, error } = await supabase
        .from("plan_progress")
        .select("*")
        .eq("plan_id", planId)
        .eq("day_number", dayNumber);

      if (error) {
        throw new Error(`Failed to fetch day progress: ${error.message}`);
      }

      const completionMap: { [activityId: string]: boolean } = {};
      data?.forEach((p) => {
        completionMap[p.activity_id] = p.completed;
      });

      return completionMap;
    } catch (error) {
      console.error("Error getting day progress:", error);
      return {};
    }
  }

  async generateNextPlan(): Promise<HealthPlanRecord> {
    try {
      const currentPlan = await this.getCurrentPlan();
      if (currentPlan) {
        await supabase
          .from("two_day_health_plans")
          .update({ is_active: false })
          .eq("id", currentPlan.id);
      }

      return await this.generateHealthPlan();
    } catch (error) {
      console.error("Error generating next plan:", error);
      throw error;
    }
  }

  async checkAndGenerateNextPlan(): Promise<HealthPlanRecord | null> {
    try {
      const currentPlan = await this.getCurrentPlan();
      if (!currentPlan) return null;

      const today = new Date().toISOString().split("T")[0];
      const planEndDate = currentPlan.plan_end_date;

      // If today is past the plan end date, generate a new plan
      if (today > planEndDate) {
        return await this.generateNextPlan();
      }

      return null;
    } catch (error) {
      console.error("Error checking for next plan:", error);
      return null;
    }
  }

  async markDayCompleted(
    planId: string,
    dayNumber: 1 | 2
  ): Promise<HealthPlanRecord> {
    try {
      const updateField =
        dayNumber === 1 ? "day_1_completed" : "day_2_completed";

      const { data, error } = await supabase
        .from("two_day_health_plans")
        .update({
          [updateField]: true,
        })
        .eq("id", planId)
        .select()
        .single();

      if (error) {
        throw new Error(
          `Failed to mark day ${dayNumber} as completed: ${error.message}`
        );
      }

      return data;
    } catch (error) {
      console.error("Error marking day completed:", error);
      throw error;
    }
  }

  async getCompletionPercentage(
    planId: string,
    dayNumber: number
  ): Promise<number> {
    try {
      const plan = await this.getCurrentPlan();
      if (!plan) return 0;

      const dayPlan = dayNumber === 1 ? plan.day_1_plan : plan.day_2_plan;
      const totalActivities = dayPlan.activities.length;

      if (totalActivities === 0) return 100;

      const progress = await this.getDayProgress(planId, dayNumber);
      const completedActivities =
        Object.values(progress).filter(Boolean).length;

      return Math.round((completedActivities / totalActivities) * 100);
    } catch (error) {
      console.error("Error calculating completion percentage:", error);
      return 0;
    }
  }
}

export const healthPlanService = new HealthPlanService();
