import { supabase } from "@/integrations/supabase/client";

// Cache for health plans to avoid repeated API calls
const planCache = new Map<string, { plan: any; timestamp: number }>();
const progressCache = new Map<string, { progress: any; timestamp: number }>();
const CACHE_DURATION = 2 * 60 * 1000; // 2 minutes for plans, shorter for faster updates

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
  // Generate health plan using AI API with fallback
  async generateHealthPlan(): Promise<HealthPlanRecord> {
    try {
      console.log("🚀 Generating AI health plan...");

      // First try the main AI health coach plan function
      const { data, error } = await supabase.functions.invoke(
        "generate-ai-health-coach-plan",
        {
          method: "POST",
          body: {},
          headers: {
            Authorization: `Bearer ${
              (
                await supabase.auth.getSession()
              ).data.session?.access_token
            }`,
          },
        }
      );

      if (error) {
        console.warn("❌ AI health coach plan failed:", error.message);
        throw new Error(
          `Failed to generate AI Health Coach plan: ${error.message}`
        );
      }

      if (!data.success) {
        console.warn("❌ AI health coach plan returned error:", data.error);
        throw new Error(
          data.error || "Failed to generate AI Health Coach plan"
        );
      }

      console.log("✅ Successfully generated AI health plan");
      return data.plan;
    } catch (error) {
      console.error("❌ Error generating AI Health Coach plan:", error);

      // Try the simple health plan function as backup
      try {
        console.log("🔄 Trying simple health plan as fallback...");

        const { data: simpleData, error: simpleError } =
          await supabase.functions.invoke("generate-health-plan-simple", {
            method: "POST",
            body: {},
            headers: {
              Authorization: `Bearer ${
                (
                  await supabase.auth.getSession()
                ).data.session?.access_token
              }`,
            },
          });

        if (!simpleError && simpleData?.success) {
          console.log("✅ Successfully generated simple health plan");
          return simpleData.plan;
        }
      } catch (simpleError) {
        console.error("❌ Simple health plan also failed:", simpleError);
      }

      // Final fallback to client-side plan
      console.warn("⚠️ Using client-side fallback plan");
      return this.createFallbackPlan();
    }
  }

  // Optimized current plan fetching with caching
  async getCurrentPlan(): Promise<HealthPlanRecord | null> {
    try {
      const cacheKey = "current_plan";
      const cached = planCache.get(cacheKey);
      if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
        return cached.plan;
      }

      const { data, error } = await supabase
        .from("two_day_health_plans")
        .select("*")
        .eq("is_active", true)
        .single();

      if (error && error.code !== "PGRST116") {
        throw new Error(`Failed to fetch current plan: ${error.message}`);
      }

      if (data) {
        planCache.set(cacheKey, { plan: data, timestamp: Date.now() });
      }

      return data;
    } catch (error) {
      console.error("Error fetching current plan:", error);
      return null; // Return null instead of throwing to allow app to continue
    }
  }

  // Optimized activity completion with optimistic updates
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

      // Clear progress cache to force refresh
      progressCache.delete(`${planId}-${dayNumber}`);

      return data;
    } catch (error) {
      console.error("Error marking activity completed:", error);
      throw error;
    }
  }

  // Optimized progress fetching with caching
  async getDayProgress(planId: string, dayNumber: number) {
    try {
      const cacheKey = `${planId}-${dayNumber}`;
      const cached = progressCache.get(cacheKey);
      if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
        return cached.progress;
      }

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

      // Cache the result
      progressCache.set(cacheKey, {
        progress: completionMap,
        timestamp: Date.now(),
      });

      return completionMap;
    } catch (error) {
      console.error("Error getting day progress:", error);
      return {};
    }
  }

  // Optimized next plan generation
  async generateNextPlan(): Promise<HealthPlanRecord> {
    try {
      const currentPlan = await this.getCurrentPlan();
      if (currentPlan) {
        await supabase
          .from("two_day_health_plans")
          .update({ is_active: false })
          .eq("id", currentPlan.id);
      }

      // Clear cache before generating new plan
      planCache.clear();
      progressCache.clear();

      return await this.generateHealthPlan();
    } catch (error) {
      console.error("Error generating next plan:", error);
      throw error;
    }
  }

  // Optimized plan checking with faster timeout
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

  // Optimized day completion marking
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

      // Clear cache to force refresh
      planCache.clear();

      return data;
    } catch (error) {
      console.error("Error marking day completed:", error);
      throw error;
    }
  }

  // Optimized completion percentage calculation
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

  // Create a fast fallback plan when AI generation fails
  private createFallbackPlan(): HealthPlanRecord {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const fallbackPlan: HealthPlanRecord = {
      id: `fallback-${Date.now()}`,
      user_id: "fallback-user",
      plan_start_date: today.toISOString().split("T")[0],
      plan_end_date: tomorrow.toISOString().split("T")[0],
      day_1_plan: {
        date: today.toISOString().split("T")[0],
        activities: [
          {
            id: "morning-routine-1",
            type: "other",
            title: "Morning Routine",
            description: "Start your day with a healthy morning routine",
            startTime: "07:00",
            endTime: "07:30",
            duration: 30,
            priority: "high",
            category: "wellness",
            instructions: [
              "Wake up at 7:00 AM",
              "Drink a glass of water",
              "Do light stretching",
            ],
            tips: [
              "Keep your phone away from bed",
              "Open curtains for natural light",
            ],
          },
          {
            id: "breakfast-1",
            type: "meal",
            title: "Healthy Breakfast",
            description: "Nutritious breakfast to fuel your day",
            startTime: "08:00",
            endTime: "08:30",
            duration: 30,
            priority: "high",
            category: "nutrition",
            instructions: [
              "Eat a balanced breakfast",
              "Include protein and fiber",
              "Stay hydrated",
            ],
            tips: [
              "Prepare breakfast the night before",
              "Avoid processed foods",
            ],
          },
          {
            id: "workout-1",
            type: "workout",
            title: "Daily Workout",
            description: "Exercise session based on your fitness goals",
            startTime: "18:00",
            endTime: "18:45",
            duration: 45,
            priority: "high",
            category: "fitness",
            instructions: [
              "Warm up for 5 minutes",
              "Main workout for 30 minutes",
              "Cool down for 10 minutes",
            ],
            tips: [
              "Listen to your body",
              "Stay hydrated during workout",
              "Track your progress",
            ],
          },
        ],
        summary: {
          totalActivities: 3,
          workoutTime: 45,
          mealCount: 1,
          sleepHours: 8,
          focusAreas: ["fitness", "nutrition", "wellness"],
        },
      },
      day_2_plan: {
        date: tomorrow.toISOString().split("T")[0],
        activities: [
          {
            id: "morning-routine-2",
            type: "other",
            title: "Morning Routine",
            description: "Start your day with a healthy morning routine",
            startTime: "07:00",
            endTime: "07:30",
            duration: 30,
            priority: "high",
            category: "wellness",
            instructions: [
              "Wake up at 7:00 AM",
              "Drink a glass of water",
              "Do light stretching",
            ],
            tips: [
              "Keep your phone away from bed",
              "Open curtains for natural light",
            ],
          },
          {
            id: "breakfast-2",
            type: "meal",
            title: "Healthy Breakfast",
            description: "Nutritious breakfast to fuel your day",
            startTime: "08:00",
            endTime: "08:30",
            duration: 30,
            priority: "high",
            category: "nutrition",
            instructions: [
              "Eat a balanced breakfast",
              "Include protein and fiber",
              "Stay hydrated",
            ],
            tips: [
              "Prepare breakfast the night before",
              "Avoid processed foods",
            ],
          },
        ],
        summary: {
          totalActivities: 2,
          workoutTime: 0,
          mealCount: 1,
          sleepHours: 8,
          focusAreas: ["nutrition", "wellness"],
        },
      },
      day_1_completed: false,
      day_2_completed: false,
      progress_data: {},
      generated_at: new Date().toISOString(),
      is_active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    return fallbackPlan;
  }

  // Clear all caches (useful for logout or data refresh)
  clearCache(): void {
    planCache.clear();
    progressCache.clear();
  }
}

export const healthPlanService = new HealthPlanService();
