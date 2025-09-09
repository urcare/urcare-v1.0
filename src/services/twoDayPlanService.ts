import { UserProfile } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";

export interface DayActivity {
  id: string;
  type:
    | "workout"
    | "meal"
    | "hydration"
    | "sleep"
    | "meditation"
    | "supplement";
  title: string;
  description: string;
  time: string;
  duration?: string;
  instructions: string[];
  completed: boolean;
  notes?: string;
}

export interface DayPlan {
  date: string;
  activities: DayActivity[];
  nutritionGoals: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    water: number;
  };
  fitnessGoals: {
    steps: number;
    activeMinutes: number;
    caloriesBurned: number;
  };
  wellnessGoals: {
    sleepHours: number;
    stressLevel: "low" | "moderate" | "high";
    mindfulnessMinutes: number;
  };
}

export interface TwoDayHealthPlan {
  id: string;
  userId: string;
  planStartDate: string;
  planEndDate: string;
  day1Plan: DayPlan;
  day2Plan: DayPlan;
  day1Completed: boolean;
  day2Completed: boolean;
  progressData: Record<string, any>;
  generatedAt: string;
  completedAt?: string;
  isActive: boolean;
}

export interface PlanGenerationRequest {
  userProfile: UserProfile;
  previousPlanData?: any;
  progressHistory?: any;
  preferences?: {
    workoutIntensity?: "low" | "moderate" | "high";
    dietaryRestrictions?: string[];
    availableTime?: number; // minutes per day
    equipment?: string[];
  };
}

class TwoDayPlanService {
  constructor() {
    console.log("TwoDayPlanService initialized - AI functionality removed");
  }

  /**
   * Generate a new 2-day health plan (without AI)
   */
  async generateTwoDayPlan(
    request: PlanGenerationRequest
  ): Promise<TwoDayHealthPlan> {
    try {
      console.log("Generating 2-day plan for user:", request.userProfile.id);

      // Generate basic plan without AI
      const basicPlan = this.generateBasicPlan(request);

      // Calculate plan dates (next 2 days)
      const startDate = new Date();
      const endDate = new Date();
      endDate.setDate(startDate.getDate() + 1);

      // Create the plan object
      const planData: Omit<TwoDayHealthPlan, "id"> = {
        userId: request.userProfile.id,
        planStartDate: startDate.toISOString().split("T")[0],
        planEndDate: endDate.toISOString().split("T")[0],
        day1Plan: basicPlan.day1,
        day2Plan: basicPlan.day2,
        day1Completed: false,
        day2Completed: false,
        progressData: {},
        generatedAt: new Date().toISOString(),
        isActive: true,
      };

      // Try to save to database (if table exists)
      try {
        const { data, error } = await supabase
          .from("two_day_health_plans")
          .insert({
            user_id: planData.userId,
            plan_start_date: planData.planStartDate,
            plan_end_date: planData.planEndDate,
            day_1_plan: planData.day1Plan,
            day_2_plan: planData.day2Plan,
            day_1_completed: planData.day1Completed,
            day_2_completed: planData.day2Completed,
            progress_data: planData.progressData,
            generated_at: planData.generatedAt,
            is_active: planData.isActive,
          })
          .select()
          .single();

        if (error) {
          console.warn("Database save failed, returning local plan:", error);
          return {
            id: `local_${Date.now()}`,
            ...planData,
          };
        }

        return {
          id: data.id,
          ...planData,
        };
      } catch (dbError) {
        console.warn("Database not available, returning local plan:", dbError);
        return {
          id: `local_${Date.now()}`,
          ...planData,
        };
      }
    } catch (error) {
      console.error("Error generating 2-day plan:", error);
      throw error;
    }
  }

  /**
   * Get the current active 2-day plan for a user
   */
  async getCurrentPlan(userId: string): Promise<TwoDayHealthPlan | null> {
    try {
      const { data, error } = await supabase
        .from("two_day_health_plans")
        .select("*")
        .eq("user_id", userId)
        .eq("is_active", true)
        .order("created_at", { ascending: false })
        .limit(1)
        .single();

      if (error && error.code !== "PGRST116") {
        console.warn("Error fetching current plan:", error);
        return null;
      }

      if (!data) {
        return null;
      }

      return {
        id: data.id,
        userId: data.user_id,
        planStartDate: data.plan_start_date,
        planEndDate: data.plan_end_date,
        day1Plan: data.day_1_plan,
        day2Plan: data.day_2_plan,
        day1Completed: data.day_1_completed,
        day2Completed: data.day_2_completed,
        progressData: data.progress_data,
        generatedAt: data.generated_at,
        completedAt: data.completed_at,
        isActive: data.is_active,
      };
    } catch (error) {
      console.error("Error fetching current plan:", error);
      return null;
    }
  }

  /**
   * Get historical two-day plans for a user
   */
  async getPlanHistory(
    userId: string,
    limit = 10
  ): Promise<TwoDayHealthPlan[]> {
    try {
      const { data, error } = await supabase
        .from("two_day_health_plans")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false })
        .limit(limit);

      if (error || !data) {
        console.warn("Error fetching plan history:", error);
        return [];
      }

      return data.map((row: any) => ({
        id: row.id,
        userId: row.user_id,
        planStartDate: row.plan_start_date,
        planEndDate: row.plan_end_date,
        day1Plan: row.day_1_plan,
        day2Plan: row.day_2_plan,
        day1Completed: row.day_1_completed,
        day2Completed: row.day_2_completed,
        progressData: row.progress_data,
        generatedAt: row.generated_at,
        completedAt: row.completed_at,
        isActive: row.is_active,
      }));
    } catch (err) {
      console.error("Unexpected error fetching plan history:", err);
      return [];
    }
  }

  /**
   * Update activity progress in a plan
   */
  async updateActivityProgress(
    planId: string,
    activityId: string,
    dayNumber: 1 | 2,
    completed: boolean,
    notes?: string
  ): Promise<void> {
    try {
      // Fetch current plan row
      const { data, error } = await supabase
        .from("two_day_health_plans")
        .select("*")
        .eq("id", planId)
        .single();

      if (error || !data) {
        throw new Error(error?.message || "Plan not found");
      }

      const planRow = data as any;
      const dayKey = dayNumber === 1 ? "day_1_plan" : "day_2_plan";
      const dayPlan = { ...(planRow[dayKey] || {}) } as DayPlan;
      const activities = (dayPlan.activities || []).map((act: any) => {
        if (act.id === activityId) {
          return { ...act, completed, notes: notes ?? act.notes };
        }
        return act;
      });

      const updatedDayPlan: DayPlan = { ...dayPlan, activities };

      // Determine completion flags
      const dayCompleted =
        activities.length > 0 && activities.every((a: any) => a.completed);
      const updated = {
        day_1_plan: dayNumber === 1 ? updatedDayPlan : planRow.day_1_plan,
        day_2_plan: dayNumber === 2 ? updatedDayPlan : planRow.day_2_plan,
        day_1_completed:
          dayNumber === 1 ? dayCompleted : planRow.day_1_completed,
        day_2_completed:
          dayNumber === 2 ? dayCompleted : planRow.day_2_completed,
        progress_data: {
          ...(planRow.progress_data || {}),
          [activityId]: { completed, notes: notes ?? null, dayNumber },
        },
      } as any;

      // If both days completed, mark plan inactive and set completed_at
      const bothCompleted =
        (dayNumber === 1 ? dayCompleted : planRow.day_1_completed) &&
        (dayNumber === 2 ? dayCompleted : planRow.day_2_completed);
      if (bothCompleted) {
        updated.is_active = false;
        updated.completed_at = new Date().toISOString();
      }

      const { error: updateError } = await supabase
        .from("two_day_health_plans")
        .update(updated)
        .eq("id", planId);

      if (updateError) {
        throw new Error(updateError.message);
      }

      // Auto-generate a new plan when both completed
      if (bothCompleted) {
        try {
          await this.generateTwoDayPlan({
            userProfile: { id: planRow.user_id } as unknown as UserProfile,
          });
        } catch (genErr) {
          console.warn("Auto-generate next plan failed:", genErr);
        }
      }
    } catch (err) {
      console.error("Error updating activity progress:", err);
      throw err;
    }
  }

  /**
   * Generate basic plan without AI
   */
  private generateBasicPlan(request: PlanGenerationRequest): {
    day1: DayPlan;
    day2: DayPlan;
  } {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const day1Plan: DayPlan = {
      date: today.toISOString().split("T")[0],
      activities: [
        {
          id: "morning_workout",
          type: "workout",
          title: "Morning Workout",
          description: "30-minute cardio session",
          time: "07:00",
          duration: "30 minutes",
          instructions: [
            "Warm up for 5 minutes",
            "Cardio for 20 minutes",
            "Cool down for 5 minutes",
          ],
          completed: false,
        },
        {
          id: "breakfast",
          type: "meal",
          title: "Healthy Breakfast",
          description: "Balanced morning meal",
          time: "08:00",
          instructions: ["Include protein", "Add fruits", "Stay hydrated"],
          completed: false,
        },
        {
          id: "hydration",
          type: "hydration",
          title: "Stay Hydrated",
          description: "Drink water throughout the day",
          time: "09:00",
          instructions: ["Drink 8 glasses of water", "Monitor urine color"],
          completed: false,
        },
      ],
      nutritionGoals: {
        calories: 2000,
        protein: 150,
        carbs: 250,
        fat: 65,
        water: 8,
      },
      fitnessGoals: {
        steps: 10000,
        activeMinutes: 30,
        caloriesBurned: 300,
      },
      wellnessGoals: {
        sleepHours: 8,
        stressLevel: "low",
        mindfulnessMinutes: 10,
      },
    };

    const day2Plan: DayPlan = {
      date: tomorrow.toISOString().split("T")[0],
      activities: [
        {
          id: "strength_training",
          type: "workout",
          title: "Strength Training",
          description: "45-minute strength session",
          time: "07:00",
          duration: "45 minutes",
          instructions: [
            "Warm up",
            "Focus on major muscle groups",
            "Cool down",
          ],
          completed: false,
        },
        {
          id: "lunch",
          type: "meal",
          title: "Nutritious Lunch",
          description: "Balanced midday meal",
          time: "12:00",
          instructions: [
            "Include vegetables",
            "Add lean protein",
            "Limit processed foods",
          ],
          completed: false,
        },
        {
          id: "meditation",
          type: "meditation",
          title: "Mindfulness Session",
          description: "10-minute meditation",
          time: "18:00",
          duration: "10 minutes",
          instructions: [
            "Find quiet space",
            "Focus on breathing",
            "Clear your mind",
          ],
          completed: false,
        },
      ],
      nutritionGoals: {
        calories: 2100,
        protein: 160,
        carbs: 260,
        fat: 70,
        water: 8,
      },
      fitnessGoals: {
        steps: 12000,
        activeMinutes: 45,
        caloriesBurned: 400,
      },
      wellnessGoals: {
        sleepHours: 8,
        stressLevel: "low",
        mindfulnessMinutes: 10,
      },
    };

    return { day1: day1Plan, day2: day2Plan };
  }
}

export const twoDayPlanService = new TwoDayPlanService();
