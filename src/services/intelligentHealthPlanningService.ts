/**
 * INTELLIGENT HEALTH PLANNING SERVICE
 *
 * This service creates three difficulty levels (Easy, Moderate, Hard)
 * with detailed daily schedules, automatic progression, and varied meal plans
 */

import { UserProfile } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { EnhancedDailyScheduleService } from "./enhancedDailyScheduleService";
import { ProcessedUserData, userDataProcessor } from "./userDataProcessor";

// ============================================================================
// INTERFACES & TYPES
// ============================================================================

export interface DifficultyLevel {
  level: "easy" | "moderate" | "hard";
  name: string;
  description: string;
  characteristics: string[];
  estimatedTime: string;
  intensity: number; // 1-10 scale
  estimatedResults: string[];
  timeCommitment: string;
  equipmentNeeded: string[];
  preparationSteps: string[];
  successMetrics: string[];
  warnings: string[];
  alternatives: string[];
}

export interface DetailedActivity {
  id: string;
  type:
    | "wake_up"
    | "morning_routine"
    | "breakfast"
    | "workout"
    | "lunch"
    | "snack"
    | "dinner"
    | "evening_routine"
    | "sleep_prep";
  title: string;
  description: string;
  startTime: string;
  endTime: string;
  duration: number; // in minutes
  priority: "high" | "medium" | "low";
  difficulty: "easy" | "moderate" | "hard";
  instructions: string[];
  tips: string[];
  equipment?: string[];
  alternatives?: string[];
  nutritionDetails?: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    ingredients: string[];
    preparation: string[];
    variations: string[];
  };
  workoutDetails?: {
    exercises: Array<{
      name: string;
      sets: number;
      reps: number;
      weight?: string;
      rest: number;
      form: string[];
    }>;
    warmup: string[];
    cooldown: string[];
  };
}

export interface DailySchedule {
  date: string;
  dayOfWeek: string;
  activities: DetailedActivity[];
  summary: {
    totalActivities: number;
    totalDuration: number;
    calories: number;
    protein: number;
    focusAreas: string[];
    difficulty: "easy" | "moderate" | "hard";
  };
}

export interface WeeklyPlan {
  id: string;
  userId: string;
  difficulty: "easy" | "moderate" | "hard";
  startDate: string;
  endDate: string;
  days: DailySchedule[];
  overallGoals: string[];
  progressTips: string[];
  mealVariations: {
    breakfast: string[];
    lunch: string[];
    dinner: string[];
    snacks: string[];
  };
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface PlanDetails {
  difficulty: DifficultyLevel;
  estimatedResults: string[];
  timeCommitment: string;
  equipmentNeeded: string[];
  preparationSteps: string[];
  successMetrics: string[];
  warnings: string[];
  alternatives: string[];
}

export interface HealthProgress {
  totalPlans: number;
  completedPlans: number;
  currentStreak: number;
  averageCompletion: number;
  totalActivities: number;
  completedActivities: number;
  healthScore: number;
}

// ============================================================================
// MAIN INTELLIGENT HEALTH PLANNING SERVICE
// ============================================================================

export class IntelligentHealthPlanningService {
  /**
   * Generate three difficulty levels for user to choose from
   */
  static async generateDifficultyOptions(
    profile: UserProfile,
    userGoal: string
  ): Promise<{
    easy: PlanDetails;
    moderate: PlanDetails;
    hard: PlanDetails;
  }> {
    console.log("🎯 Generating difficulty options...");

    const { processedData, aiContext } = await userDataProcessor.processForAI(
      profile,
      userGoal
    );

    // Generate AI prompt for difficulty options
    const prompt = this.createDifficultyOptionsPrompt(
      processedData,
      aiContext,
      userGoal
    );

    try {
      const aiResponse = await this.callAIService(prompt);
      const difficultyOptions = this.processDifficultyResponse(aiResponse);

      return {
        easy: this.createPlanDetails("easy", difficultyOptions.easy),
        moderate: this.createPlanDetails(
          "moderate",
          difficultyOptions.moderate
        ),
        hard: this.createPlanDetails("hard", difficultyOptions.hard),
      };
    } catch (error) {
      console.error("Error generating difficulty options:", error);
      return this.createFallbackDifficultyOptions(userGoal);
    }
  }

  /**
   * Generate detailed weekly plan based on selected difficulty
   */
  static async generateWeeklyPlan(
    profile: UserProfile,
    difficulty: "easy" | "moderate" | "hard",
    userGoal: string
  ): Promise<WeeklyPlan> {
    console.log(`📅 Generating ${difficulty} weekly plan...`);

    const { processedData, aiContext } = await userDataProcessor.processForAI(
      profile,
      userGoal
    );

    // Generate AI prompt for weekly plan
    const prompt = this.createWeeklyPlanPrompt(
      processedData,
      aiContext,
      difficulty,
      userGoal
    );

    try {
      const aiResponse = await this.callAIService(prompt);
      const weeklyPlan = this.processWeeklyPlanResponse(aiResponse, difficulty);

      // Save to database
      const savedPlan = await this.saveWeeklyPlan(weeklyPlan, profile.id);

      return savedPlan;
    } catch (error) {
      console.error("Error generating weekly plan:", error);
      return this.createFallbackWeeklyPlan(profile, difficulty, userGoal);
    }
  }

  /**
   * Generate next day's schedule automatically using enhanced service
   */
  static async generateNextDaySchedule(
    userId: string,
    currentDate: string,
    previousDayCompletion: number // 0-100
  ): Promise<DailySchedule> {
    console.log("🔄 Generating next day schedule...");

    // Get user's current plan and preferences
    const { data: currentPlan } = await supabase
      .from("weekly_plans")
      .select("*")
      .eq("user_id", userId)
      .eq("is_active", true)
      .single();

    if (!currentPlan) {
      throw new Error("No active plan found");
    }

    // Get user profile for context
    const { data: profile } = await supabase
      .from("user_profiles")
      .select("*")
      .eq("id", userId)
      .single();

    if (!profile) {
      throw new Error("User profile not found");
    }

    // Adjust difficulty based on completion rate
    const adjustedDifficulty = this.adjustDifficultyBasedOnCompletion(
      currentPlan.difficulty,
      previousDayCompletion
    );

    // Generate next day's schedule using enhanced service
    const nextDate = new Date(currentDate);
    nextDate.setDate(nextDate.getDate() + 1);
    const nextDateStr = nextDate.toISOString().split("T")[0];

    try {
      const enhancedSchedule =
        await EnhancedDailyScheduleService.generatePersonalizedSchedule({
          goal: currentPlan.goal || "improve overall health",
          difficulty: adjustedDifficulty as "easy" | "moderate" | "hard",
          userProfile: profile,
          planData: currentPlan,
          date: nextDateStr,
        });

      // Convert enhanced schedule to legacy format
      const legacySchedule: DailySchedule = {
        date: enhancedSchedule.date,
        dayOfWeek: enhancedSchedule.dayOfWeek,
        activities: enhancedSchedule.activities.map((activity) => ({
          id: activity.id,
          type: activity.type,
          title: activity.title,
          description: activity.description,
          startTime: activity.startTime,
          endTime: activity.endTime,
          duration: activity.duration,
          priority: activity.priority,
          category: activity.category,
          instructions: activity.instructions,
          tips: activity.tips,
          relatedGoals: [enhancedSchedule.goal],
          impactScore: 0.8,
          complianceWeight: 0.9,
        })),
        summary: {
          totalActivities: enhancedSchedule.activities.length,
          workoutTime: enhancedSchedule.summary.workoutTime,
          mealCount: enhancedSchedule.summary.mealCount,
          sleepHours: enhancedSchedule.summary.sleepHours,
          focusAreas: enhancedSchedule.summary.focusAreas,
          goalContributions: enhancedSchedule.summary.goalContributions,
        },
      };

      // Update the weekly plan with new day
      await this.updateWeeklyPlanWithNewDay(currentPlan.id, legacySchedule);

      return legacySchedule;
    } catch (error) {
      console.error("Error generating next day schedule:", error);
      return null;
    }
  }

  /**
   * Track activity completion and update health score
   */
  static async trackActivityCompletion(
    userId: string,
    activityId: string,
    completed: boolean,
    notes?: string
  ): Promise<void> {
    console.log(`📊 Tracking activity completion: ${activityId}`);

    // Update activity completion
    const { error: activityError } = await supabase
      .from("activity_completions")
      .upsert({
        user_id: userId,
        activity_id: activityId,
        completed,
        completed_at: completed ? new Date().toISOString() : null,
        notes,
        updated_at: new Date().toISOString(),
      });

    if (activityError) {
      console.error("Error updating activity completion:", activityError);
      return;
    }

    // Update health score
    await this.updateHealthScore(userId);
  }

  /**
   * Get detailed plan information for plan details page
   */
  static async getPlanDetails(planId: string): Promise<{
    plan: WeeklyPlan;
    details: PlanDetails;
    progress: {
      completedDays: number;
      totalDays: number;
      averageCompletion: number;
      streak: number;
    };
  }> {
    console.log("📋 Getting plan details...");

    const { data: plan } = await supabase
      .from("weekly_plans")
      .select("*")
      .eq("id", planId)
      .single();

    if (!plan) {
      throw new Error("Plan not found");
    }

    // Get progress data
    const { data: completions } = await supabase
      .from("activity_completions")
      .select("*")
      .eq("user_id", plan.user_id)
      .gte("created_at", plan.start_date);

    const progress = this.calculateProgress(completions || [], plan);
    const details = this.createPlanDetails(plan.difficulty, plan);

    return {
      plan,
      details,
      progress,
    };
  }

  /**
   * Get user's health progress
   */
  static async getUserHealthProgress(userId: string): Promise<HealthProgress> {
    console.log("📈 Getting user health progress...");

    const { data, error } = await supabase.rpc("get_user_health_progress", {
      p_user_id: userId,
    });

    if (error) {
      console.error("Error getting health progress:", error);
      return {
        totalPlans: 0,
        completedPlans: 0,
        currentStreak: 0,
        averageCompletion: 0,
        totalActivities: 0,
        completedActivities: 0,
        healthScore: 0,
      };
    }

    return (
      data[0] || {
        totalPlans: 0,
        completedPlans: 0,
        currentStreak: 0,
        averageCompletion: 0,
        totalActivities: 0,
        completedActivities: 0,
        healthScore: 0,
      }
    );
  }

  /**
   * Get today's schedule
   */
  static async getTodaySchedule(
    userId: string,
    date?: string
  ): Promise<DailySchedule | null> {
    console.log("📅 Getting today's schedule...");

    const targetDate = date || new Date().toISOString().split("T")[0];

    const { data, error } = await supabase.rpc("get_today_schedule", {
      p_user_id: userId,
      p_date: targetDate,
    });

    if (error) {
      console.error("Error getting today's schedule:", error);
      return null;
    }

    return data[0]?.schedule || null;
  }

  /**
   * Mark activity as completed
   */
  static async markActivityCompleted(
    userId: string,
    activityId: string,
    completed: boolean = true,
    notes?: string
  ): Promise<boolean> {
    console.log(
      `✅ Marking activity ${activityId} as ${
        completed ? "completed" : "incomplete"
      }`
    );

    const { data, error } = await supabase.rpc("mark_activity_completed", {
      p_user_id: userId,
      p_activity_id: activityId,
      p_completed: completed,
      p_notes: notes,
    });

    if (error) {
      console.error("Error marking activity completed:", error);
      return false;
    }

    return true;
  }

  // ============================================================================
  // PRIVATE HELPER METHODS
  // ============================================================================

  private static createDifficultyOptionsPrompt(
    processedData: ProcessedUserData,
    aiContext: any,
    userGoal: string
  ): any {
    return {
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: `You are URCARE Master Health AI. Create three difficulty levels (Easy, Moderate, Hard) for personalized health plans.

DIFFICULTY LEVELS:
- EASY: Beginner-friendly, 30-45 min/day, simple exercises, basic nutrition
- MODERATE: Intermediate, 60-90 min/day, varied exercises, detailed nutrition
- HARD: Advanced, 90-120 min/day, complex exercises, precise nutrition tracking

For each level, provide:
1. Time commitment per day
2. Exercise intensity and complexity
3. Nutrition tracking requirements
4. Equipment needed
5. Expected results timeline
6. Preparation steps
7. Success metrics
8. Warnings and alternatives

CRITICAL: Each plan must be UNIQUE and tailored to the user's specific goals and profile.`,
        },
        {
          role: "user",
          content: `Create three difficulty options for this user:

USER PROFILE:
${JSON.stringify(processedData, null, 2)}

USER GOAL: ${userGoal}

AI CONTEXT:
${JSON.stringify(aiContext, null, 2)}

Return JSON with easy, moderate, and hard options, each containing:
- name: "Easy/Moderate/Hard Plan"
- description: "Brief description"
- characteristics: ["feature1", "feature2"]
- estimatedTime: "X-Y minutes/day"
- intensity: number (1-10)
- estimatedResults: ["result1", "result2"]
- timeCommitment: "X hours/week"
- equipmentNeeded: ["item1", "item2"]
- preparationSteps: ["step1", "step2"]
- successMetrics: ["metric1", "metric2"]
- warnings: ["warning1", "warning2"]
- alternatives: ["alt1", "alt2"]

IMPORTANT: Make each plan unique and specifically tailored to the user's goal: ${userGoal}`,
        },
      ],
      max_tokens: 2000,
      temperature: 0.3,
    };
  }

  private static createWeeklyPlanPrompt(
    processedData: ProcessedUserData,
    aiContext: any,
    difficulty: string,
    userGoal: string
  ): any {
    return {
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: `You are URCARE Master Health AI. Create a detailed 7-day health plan with ${difficulty} difficulty.

REQUIREMENTS:
1. Create 7 unique days with different meals each day
2. Include specific timings (6:00 AM - 10:00 PM)
3. Provide detailed instructions for each activity
4. Include nutrition details (calories, macros, ingredients)
5. Vary workouts and meals throughout the week
6. Include morning routines, workouts, meals, and evening routines
7. Make it culturally appropriate and geographically relevant
8. Ensure NO meal repetition across the 7 days
9. Each day should have unique exercises and meal combinations

CRITICAL: This plan must be UNIQUE and never repeated. Each day must have different meals, exercises, and activities.`,
        },
        {
          role: "user",
          content: `Create a ${difficulty} difficulty 7-day health plan for:

USER PROFILE:
${JSON.stringify(processedData, null, 2)}

USER GOAL: ${userGoal}

AI CONTEXT:
${JSON.stringify(aiContext, null, 2)}

IMPORTANT:
- Make each day unique with different meals and workouts
- Include specific timings for all activities
- Provide detailed nutrition information
- Include equipment and alternatives
- Make it achievable and motivating
- NO repeated meals across the 7 days
- Each day must have unique exercise combinations
- Vary the meal types and preparation methods daily`,
        },
      ],
      max_tokens: 4000,
      temperature: 0.3,
    };
  }

  private static createNextDayPrompt(
    profile: any,
    currentPlan: any,
    difficulty: string,
    nextDate: Date
  ): any {
    return {
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: `You are URCARE Master Health AI. Generate the next day's schedule based on the user's current plan and previous day's performance.

REQUIREMENTS:
1. Continue the weekly plan progression
2. Adjust difficulty based on previous day's completion
3. Provide varied meals (no repetition from previous days)
4. Include specific timings and detailed instructions
5. Maintain consistency with user's goals and preferences
6. Ensure the new day is UNIQUE and different from previous days

CRITICAL: This day must be completely unique with different meals, exercises, and activities from all previous days.`,
        },
        {
          role: "user",
          content: `Generate next day's schedule for ${
            nextDate.toISOString().split("T")[0]
          }:

CURRENT PLAN: ${JSON.stringify(currentPlan, null, 2)}
USER PROFILE: ${JSON.stringify(profile, null, 2)}
ADJUSTED DIFFICULTY: ${difficulty}

IMPORTANT:
- Continue the weekly plan progression
- Provide varied meals (check previous days to avoid repetition)
- Adjust intensity based on user's progress
- Include specific timings and detailed instructions
- Make this day completely unique from all previous days
- Ensure different meal combinations and exercise routines`,
        },
      ],
      max_tokens: 2000,
      temperature: 0.3,
    };
  }

  private static async callAIService(prompt: any): Promise<any> {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify(prompt),
    });

    if (!response.ok) {
      throw new Error(
        `OpenAI API error: ${response.status} ${response.statusText}`
      );
    }

    return await response.json();
  }

  private static processDifficultyResponse(aiResponse: any): any {
    const content = aiResponse.choices[0]?.message?.content;
    if (!content) throw new Error("No content received from AI");

    try {
      const cleanContent = content
        .trim()
        .replace(/^```json\s*/, "")
        .replace(/\s*```$/, "");
      return JSON.parse(cleanContent);
    } catch (error) {
      console.error("Failed to parse difficulty response:", error);
      throw new Error(`Invalid response format: ${error.message}`);
    }
  }

  private static processWeeklyPlanResponse(
    aiResponse: any,
    difficulty: string
  ): WeeklyPlan {
    const content = aiResponse.choices[0]?.message?.content;
    if (!content) throw new Error("No content received from AI");

    try {
      const cleanContent = content
        .trim()
        .replace(/^```json\s*/, "")
        .replace(/\s*```$/, "");
      const planData = JSON.parse(cleanContent);

      return {
        id: `plan_${Date.now()}`,
        userId: "", // Will be set when saving
        difficulty: difficulty as "easy" | "moderate" | "hard",
        startDate: new Date().toISOString().split("T")[0],
        endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
          .toISOString()
          .split("T")[0],
        days: planData.days,
        overallGoals: planData.overallGoals,
        progressTips: planData.progressTips,
        mealVariations: planData.mealVariations,
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
    } catch (error) {
      console.error("Failed to parse weekly plan response:", error);
      throw new Error(`Invalid response format: ${error.message}`);
    }
  }

  private static processNextDayResponse(
    aiResponse: any,
    nextDate: Date
  ): DailySchedule {
    const content = aiResponse.choices[0]?.message?.content;
    if (!content) throw new Error("No content received from AI");

    try {
      const cleanContent = content
        .trim()
        .replace(/^```json\s*/, "")
        .replace(/\s*```$/, "");
      return JSON.parse(cleanContent);
    } catch (error) {
      console.error("Failed to parse next day response:", error);
      throw new Error(`Invalid response format: ${error.message}`);
    }
  }

  private static createPlanDetails(difficulty: string, data: any): PlanDetails {
    const baseDetails = {
      easy: {
        level: "easy" as const,
        name: "Easy Plan",
        description: "Perfect for beginners with simple, achievable goals",
        characteristics: [
          "30-45 min/day",
          "Basic exercises",
          "Simple nutrition",
        ],
        estimatedTime: "30-45 minutes",
        intensity: 3,
      },
      moderate: {
        level: "moderate" as const,
        name: "Moderate Plan",
        description: "Balanced approach for intermediate users",
        characteristics: [
          "60-90 min/day",
          "Varied exercises",
          "Detailed nutrition",
        ],
        estimatedTime: "60-90 minutes",
        intensity: 6,
      },
      hard: {
        level: "hard" as const,
        name: "Hard Plan",
        description: "Intensive program for advanced users",
        characteristics: [
          "90-120 min/day",
          "Complex exercises",
          "Precise nutrition",
        ],
        estimatedTime: "90-120 minutes",
        intensity: 9,
      },
    };

    return {
      ...baseDetails[difficulty],
      estimatedResults: data.estimatedResults || [
        "Improved fitness",
        "Better nutrition habits",
      ],
      timeCommitment: data.timeCommitment || "3-5 hours/week",
      equipmentNeeded: data.equipmentNeeded || ["Basic home equipment"],
      preparationSteps: data.preparationSteps || [
        "Set up workout space",
        "Plan meals",
      ],
      successMetrics: data.successMetrics || [
        "Consistent completion",
        "Progress tracking",
      ],
      warnings: data.warnings || ["Consult doctor if needed"],
      alternatives: data.alternatives || ["Modify exercises as needed"],
    };
  }

  private static adjustDifficultyBasedOnCompletion(
    currentDifficulty: string,
    completion: number
  ): string {
    if (completion < 50) {
      // Reduce difficulty if completion is low
      return currentDifficulty === "hard" ? "moderate" : "easy";
    } else if (completion > 90) {
      // Increase difficulty if completion is high
      return currentDifficulty === "easy" ? "moderate" : "hard";
    }
    return currentDifficulty;
  }

  private static async saveWeeklyPlan(
    plan: WeeklyPlan,
    userId: string
  ): Promise<WeeklyPlan> {
    const planData = {
      ...plan,
      user_id: userId,
    };

    const { data, error } = await supabase
      .from("weekly_plans")
      .insert(planData)
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to save weekly plan: ${error.message}`);
    }

    return data as WeeklyPlan;
  }

  private static async updateWeeklyPlanWithNewDay(
    planId: string,
    newDay: DailySchedule
  ): Promise<void> {
    // Get current plan
    const { data: currentPlan } = await supabase
      .from("weekly_plans")
      .select("*")
      .eq("id", planId)
      .single();

    if (!currentPlan) return;

    // Add new day to the plan
    const updatedDays = [...currentPlan.days, newDay];

    const { error } = await supabase
      .from("weekly_plans")
      .update({
        days: updatedDays,
        updated_at: new Date().toISOString(),
      })
      .eq("id", planId);

    if (error) {
      console.error("Error updating weekly plan:", error);
    }
  }

  private static async updateHealthScore(userId: string): Promise<void> {
    // Get recent activity completions
    const { data: completions } = await supabase
      .from("activity_completions")
      .select("*")
      .eq("user_id", userId)
      .eq("completed", true)
      .gte(
        "created_at",
        new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
      );

    if (!completions) return;

    // Calculate health score based on completions
    const completionRate = completions.length / 7; // Assuming 7 activities per day
    const healthScore = Math.min(100, Math.floor(completionRate * 100));

    // Update health score
    const { error } = await supabase.from("health_scores").upsert({
      user_id: userId,
      score: healthScore,
      streak_days: this.calculateStreak(completions),
      last_updated: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    });

    if (error) {
      console.error("Error updating health score:", error);
    }
  }

  private static calculateStreak(completions: any[]): number {
    // Calculate consecutive days of completion
    let streak = 0;
    const today = new Date();

    for (let i = 0; i < 30; i++) {
      // Check last 30 days
      const checkDate = new Date(today);
      checkDate.setDate(checkDate.getDate() - i);

      const dayCompletions = completions.filter((c) =>
        c.created_at.startsWith(checkDate.toISOString().split("T")[0])
      );

      if (dayCompletions.length > 0) {
        streak++;
      } else {
        break;
      }
    }

    return streak;
  }

  private static calculateProgress(completions: any[], plan: any): any {
    const totalDays = plan.days?.length || 7;
    const completedDays = completions.filter((c) => c.completed).length;
    const averageCompletion =
      completions.length > 0
        ? (completions.filter((c) => c.completed).length / completions.length) *
          100
        : 0;
    const streak = this.calculateStreak(completions);

    return {
      completedDays,
      totalDays,
      averageCompletion,
      streak,
    };
  }

  // Fallback methods for when AI fails
  private static createFallbackDifficultyOptions(userGoal: string): any {
    return {
      easy: {
        level: "easy",
        name: "Easy Plan",
        description: "Perfect for beginners",
        characteristics: [
          "30-45 min/day",
          "Basic exercises",
          "Simple nutrition",
        ],
        estimatedTime: "30-45 minutes",
        intensity: 3,
        estimatedResults: ["Improved fitness", "Better habits"],
        timeCommitment: "3-4 hours/week",
        equipmentNeeded: ["Basic home equipment"],
        preparationSteps: ["Set up space", "Plan meals"],
        successMetrics: ["Consistent completion"],
        warnings: ["Consult doctor if needed"],
        alternatives: ["Modify as needed"],
      },
      moderate: {
        level: "moderate",
        name: "Moderate Plan",
        description: "Balanced approach",
        characteristics: [
          "60-90 min/day",
          "Varied exercises",
          "Detailed nutrition",
        ],
        estimatedTime: "60-90 minutes",
        intensity: 6,
        estimatedResults: ["Significant fitness gains", "Better nutrition"],
        timeCommitment: "5-7 hours/week",
        equipmentNeeded: ["Home gym equipment"],
        preparationSteps: ["Set up gym", "Plan detailed meals"],
        successMetrics: ["Progress tracking", "Consistent completion"],
        warnings: ["Start gradually"],
        alternatives: ["Adjust intensity"],
      },
      hard: {
        level: "hard",
        name: "Hard Plan",
        description: "Intensive program",
        characteristics: [
          "90-120 min/day",
          "Complex exercises",
          "Precise nutrition",
        ],
        estimatedTime: "90-120 minutes",
        intensity: 9,
        estimatedResults: ["Maximum fitness gains", "Optimal nutrition"],
        timeCommitment: "8-10 hours/week",
        equipmentNeeded: ["Full gym equipment"],
        preparationSteps: ["Set up full gym", "Plan precise meals"],
        successMetrics: ["Detailed tracking", "Maximum completion"],
        warnings: ["High intensity", "Consult doctor"],
        alternatives: ["Reduce intensity if needed"],
      },
    };
  }

  private static createFallbackWeeklyPlan(
    profile: any,
    difficulty: string,
    userGoal: string
  ): WeeklyPlan {
    // Create a basic fallback plan
    const days = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date();
      date.setDate(date.getDate() + i);

      days.push({
        date: date.toISOString().split("T")[0],
        dayOfWeek: date.toLocaleDateString("en-US", { weekday: "long" }),
        activities: [],
        summary: {
          totalActivities: 8,
          totalDuration:
            difficulty === "easy" ? 45 : difficulty === "moderate" ? 75 : 105,
          calories: 2000,
          protein: 150,
          focusAreas: ["fitness", "nutrition"],
          difficulty: difficulty as "easy" | "moderate" | "hard",
        },
      });
    }

    return {
      id: `fallback_${Date.now()}`,
      userId: profile.id,
      difficulty: difficulty as "easy" | "moderate" | "hard",
      startDate: new Date().toISOString().split("T")[0],
      endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
        .toISOString()
        .split("T")[0],
      days,
      overallGoals: [userGoal],
      progressTips: ["Stay consistent", "Track progress"],
      mealVariations: {
        breakfast: ["Oatmeal", "Eggs", "Smoothie"],
        lunch: ["Salad", "Sandwich", "Soup"],
        dinner: ["Chicken", "Fish", "Vegetables"],
        snacks: ["Nuts", "Fruit", "Yogurt"],
      },
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
  }
}

// ============================================================================
// EXPORT UTILITY FUNCTIONS
// ============================================================================

export const intelligentHealthPlanningService = {
  generateDifficultyOptions:
    IntelligentHealthPlanningService.generateDifficultyOptions,
  generateWeeklyPlan: IntelligentHealthPlanningService.generateWeeklyPlan,
  generateNextDaySchedule:
    IntelligentHealthPlanningService.generateNextDaySchedule,
  trackActivityCompletion:
    IntelligentHealthPlanningService.trackActivityCompletion,
  getPlanDetails: IntelligentHealthPlanningService.getPlanDetails,
  getUserHealthProgress: IntelligentHealthPlanningService.getUserHealthProgress,
  getTodaySchedule: IntelligentHealthPlanningService.getTodaySchedule,
  markActivityCompleted: IntelligentHealthPlanningService.markActivityCompleted,
};

export default IntelligentHealthPlanningService;
