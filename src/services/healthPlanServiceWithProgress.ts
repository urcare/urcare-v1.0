import { supabase } from "../integrations/supabase/client";

export interface ProgressCallback {
  (step: string, progress: number, message?: string): void;
}

export interface HealthPlanRecord {
  id: string;
  user_id: string;
  plan_start_date: string;
  plan_end_date: string;
  day_1_plan: any;
  day_2_plan?: any;
  day_3_plan?: any;
  day_4_plan?: any;
  day_5_plan?: any;
  day_6_plan?: any;
  day_7_plan?: any;
  overall_goals: string[];
  progress_tracking?: any;
  progress_tips: string[];
  safety_notes: string[];
  cultural_adaptations: string[];
  plan_metadata?: any;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

class HealthPlanServiceWithProgress {
  private progressCallback?: ProgressCallback;

  setProgressCallback(callback: ProgressCallback) {
    this.progressCallback = callback;
  }

  private updateProgress(step: string, progress: number, message?: string) {
    if (this.progressCallback) {
      this.progressCallback(step, progress, message);
    }
  }

  // Generate health plan using AI API with progress tracking
  async generateHealthPlan(): Promise<HealthPlanRecord> {
    try {
      this.updateProgress("analyzing", 5, "Starting plan generation...");

      // Small delay to show initial progress
      await new Promise((resolve) => setTimeout(resolve, 500));

      this.updateProgress("analyzing", 15, "Analyzing your health profile...");

      console.log("🚀 Generating AI health plan...");

      this.updateProgress("analyzing", 25, "Connecting to AI service...");

      // Add timeout to prevent hanging at 25%
      const timeoutPromise = new Promise<never>((_, reject) => {
        setTimeout(
          () =>
            reject(
              new Error("Health plan generation timeout - trying fallback")
            ),
          60000 // Increased to 60 seconds
        );
      });

      // First try the main AI health coach plan function
      const generatePromise = supabase.functions.invoke(
        "generate-ai-health-coach-plan",
        {
          method: "POST",
          body: {},
          headers: {
            Authorization: `Bearer ${
              (await supabase.auth.getSession()).data.session?.access_token
            }`,
          },
        }
      );

      let data, error;
      try {
        const result = await Promise.race([generatePromise, timeoutPromise]);
        data = result.data;
        error = result.error;
      } catch (timeoutError) {
        console.warn("⚠️ AI service timeout, using fallback plan");
        this.updateProgress("analyzing", 60, "Using fallback plan...");
        await new Promise((resolve) => setTimeout(resolve, 1000));
        this.updateProgress("analyzing", 100, "Fallback plan ready!");
        return this.createFallbackPlan();
      }

      this.updateProgress("analyzing", 45, "Processing AI response...");

      if (error) {
        console.warn("❌ AI health coach plan failed:", error.message);
        // Don't throw error, use fallback instead
        this.updateProgress("analyzing", 60, "Using fallback plan...");
        await new Promise((resolve) => setTimeout(resolve, 1000));
        this.updateProgress("analyzing", 100, "Fallback plan ready!");
        return this.createFallbackPlan();
      }

      if (!data || !data.success) {
        console.warn(
          "❌ AI health coach plan returned error:",
          data?.error || "No data received"
        );
        // Don't throw error, use fallback instead
        this.updateProgress("analyzing", 60, "Using fallback plan...");
        await new Promise((resolve) => setTimeout(resolve, 1000));
        this.updateProgress("analyzing", 100, "Fallback plan ready!");
        return this.createFallbackPlan();
      }

      this.updateProgress("analyzing", 70, "Validating plan data...");

      console.log("✅ Successfully generated AI health plan");

      this.updateProgress("analyzing", 90, "Preparing your plan...");

      this.updateProgress("analyzing", 100, "Plan generation complete!");

      return data.plan;
    } catch (error) {
      console.error("❌ Error generating AI Health Coach plan:", error);

      this.updateProgress("analyzing", 30, "Trying alternative method...");

      // Try the simple health plan function as backup
      try {
        console.log("🔄 Trying simple health plan as fallback...");

        this.updateProgress("analyzing", 50, "Using backup system...");

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

        this.updateProgress("analyzing", 80, "Processing backup plan...");

        if (!simpleError && simpleData?.success) {
          console.log("✅ Successfully generated simple health plan");
          this.updateProgress("analyzing", 100, "Backup plan ready!");
          return simpleData.plan;
        }
      } catch (simpleError) {
        console.error("❌ Simple health plan also failed:", simpleError);
      }

      // Final fallback to client-side plan
      console.warn("⚠️ Using enhanced client-side fallback plan");
      this.updateProgress("analyzing", 60, "Creating comprehensive plan...");

      // Small delay to show progress
      await new Promise((resolve) => setTimeout(resolve, 1000));

      this.updateProgress("analyzing", 100, "Fallback plan ready!");

      return this.createFallbackPlan();
    }
  }

  // Optimized current plan fetching with caching
  async getCurrentPlan(): Promise<HealthPlanRecord | null> {
    try {
      const { data: session } = await supabase.auth.getSession();
      if (!session.session) {
        throw new Error("No active session");
      }

      const { data, error } = await supabase
        .from("health_plans")
        .select("*")
        .eq("user_id", session.session.user.id)
        .eq("is_active", true)
        .order("created_at", { ascending: false })
        .limit(1)
        .single();

      if (error) {
        if (error.code === "PGRST116") {
          // No rows returned
          return null;
        }
        throw error;
      }

      return data;
    } catch (error) {
      console.error("Error fetching current plan:", error);
      return null;
    }
  }

  // Get user's health plan by user ID
  async getUserHealthPlan(userId: string): Promise<HealthPlanRecord | null> {
    try {
      const { data, error } = await supabase
        .from("health_plans")
        .select("*")
        .eq("user_id", userId)
        .eq("is_active", true)
        .order("created_at", { ascending: false })
        .limit(1)
        .single();

      if (error) {
        if (error.code === "PGRST116") {
          return null;
        }
        throw error;
      }

      return data;
    } catch (error) {
      console.error("Error fetching user health plan:", error);
      return null;
    }
  }

  // Save health plan to database
  async saveHealthPlan(
    plan: Partial<HealthPlanRecord>
  ): Promise<HealthPlanRecord> {
    try {
      const { data: session } = await supabase.auth.getSession();
      if (!session.session) {
        throw new Error("No active session");
      }

      const { data, error } = await supabase
        .from("health_plans")
        .insert({
          ...plan,
          user_id: session.session.user.id,
          is_active: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (error) {
        throw error;
      }

      return data;
    } catch (error) {
      console.error("Error saving health plan:", error);
      throw error;
    }
  }

  // Update existing health plan
  async updateHealthPlan(
    planId: string,
    updates: Partial<HealthPlanRecord>
  ): Promise<HealthPlanRecord> {
    try {
      const { data, error } = await supabase
        .from("health_plans")
        .update({
          ...updates,
          updated_at: new Date().toISOString(),
        })
        .eq("id", planId)
        .select()
        .single();

      if (error) {
        throw error;
      }

      return data;
    } catch (error) {
      console.error("Error updating health plan:", error);
      throw error;
    }
  }

  // Create a comprehensive fallback plan
  private createFallbackPlan(): HealthPlanRecord {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    return {
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
            startTime: "06:00",
            endTime: "06:30",
            duration: 30,
            priority: "high",
            category: "wellness",
            instructions: [
              "Wake up at 6:00 AM",
              "Drink a glass of water with lemon",
              "Do 5 minutes of light stretching",
              "Practice 5 minutes of meditation or deep breathing",
            ],
            tips: [
              "Keep your phone away from bed",
              "Open curtains for natural light",
              "Set positive intentions for the day",
            ],
            benefits:
              "Improves energy, mood, and sets a positive tone for the day",
            scientificEvidence:
              "Research shows morning routines improve productivity and mental health",
          },
          {
            id: "breakfast-1",
            type: "meal",
            title: "Healthy Breakfast",
            description: "Nutritious breakfast to fuel your day",
            startTime: "07:00",
            endTime: "07:30",
            duration: 30,
            priority: "high",
            category: "nutrition",
            instructions: [
              "Prepare overnight oats with berries and nuts",
              "Include protein source (Greek yogurt or eggs)",
              "Add healthy fats (avocado or nut butter)",
              "Stay hydrated with water or herbal tea",
            ],
            tips: [
              "Prepare breakfast the night before",
              "Avoid processed foods and added sugars",
              "Eat mindfully without distractions",
            ],
            benefits:
              "Provides sustained energy, improves concentration, and supports metabolism",
            scientificEvidence:
              "Studies show that a protein-rich breakfast improves cognitive function and reduces cravings",
          },
          {
            id: "workout-1",
            type: "workout",
            title: "Morning Exercise",
            description: "Energizing workout to start your day",
            startTime: "08:00",
            endTime: "08:45",
            duration: 45,
            priority: "high",
            category: "fitness",
            instructions: [
              "5-minute warm-up (light cardio)",
              "20-minute strength training circuit",
              "15-minute cardio (walking, jogging, or cycling)",
              "5-minute cool-down and stretching",
            ],
            tips: [
              "Listen to your body and adjust intensity",
              "Stay hydrated throughout the workout",
              "Focus on proper form over speed",
            ],
            benefits:
              "Boosts metabolism, improves mood, and enhances energy levels",
            scientificEvidence:
              "Morning exercise has been shown to improve sleep quality and increase daily energy expenditure",
          },
          {
            id: "work-session-1",
            type: "work",
            title: "Focused Work Session",
            description: "Productive work time with breaks",
            startTime: "09:00",
            endTime: "12:00",
            duration: 180,
            priority: "high",
            category: "productivity",
            instructions: [
              "Work in 25-minute focused sessions (Pomodoro technique)",
              "Take 5-minute breaks between sessions",
              "Take a 15-minute break after every 4 sessions",
              "Stay hydrated and maintain good posture",
            ],
            tips: [
              "Use a timer to maintain focus",
              "Stand up and move during breaks",
              "Avoid multitasking",
            ],
            benefits:
              "Improves focus, reduces mental fatigue, and increases productivity",
            scientificEvidence:
              "The Pomodoro technique has been proven to enhance concentration and reduce burnout",
          },
          {
            id: "lunch-1",
            type: "meal",
            title: "Balanced Lunch",
            description: "Nutritious lunch to refuel",
            startTime: "12:30",
            endTime: "13:00",
            duration: 30,
            priority: "high",
            category: "nutrition",
            instructions: [
              "Include lean protein (chicken, fish, or legumes)",
              "Add plenty of colorful vegetables",
              "Include complex carbohydrates (brown rice, quinoa)",
              "Add healthy fats (olive oil, avocado)",
            ],
            tips: [
              "Prepare lunch the night before",
              "Eat slowly and mindfully",
              "Avoid heavy, processed foods",
            ],
            benefits:
              "Provides sustained energy, supports muscle recovery, and maintains blood sugar levels",
            scientificEvidence:
              "Balanced meals with protein, fiber, and healthy fats provide sustained energy and prevent blood sugar spikes",
          },
          {
            id: "afternoon-walk-1",
            type: "exercise",
            title: "Afternoon Walk",
            description: "Gentle movement to boost energy",
            startTime: "15:00",
            endTime: "15:15",
            duration: 15,
            priority: "medium",
            category: "fitness",
            instructions: [
              "Take a brisk 15-minute walk",
              "Get fresh air and natural light",
              "Practice deep breathing",
              "Stretch your legs and back",
            ],
            tips: [
              "Walk outdoors when possible",
              "Maintain good posture",
              "Use this time to clear your mind",
            ],
            benefits:
              "Reduces afternoon fatigue, improves circulation, and boosts mood",
            scientificEvidence:
              "Short walks have been shown to improve alertness and reduce afternoon energy dips",
          },
          {
            id: "dinner-1",
            type: "meal",
            title: "Light Dinner",
            description: "Nutritious dinner to end the day",
            startTime: "18:30",
            endTime: "19:00",
            duration: 30,
            priority: "high",
            category: "nutrition",
            instructions: [
              "Focus on vegetables and lean protein",
              "Keep portions moderate",
              "Include anti-inflammatory foods",
              "Finish eating 3 hours before bedtime",
            ],
            tips: [
              "Avoid heavy, spicy, or acidic foods",
              "Eat slowly and mindfully",
              "Stay hydrated with water",
            ],
            benefits:
              "Supports recovery, promotes better sleep, and maintains healthy digestion",
            scientificEvidence:
              "Light dinners improve sleep quality and support overnight recovery processes",
          },
          {
            id: "evening-routine-1",
            type: "other",
            title: "Evening Wind-Down",
            description: "Relaxing routine to prepare for sleep",
            startTime: "20:00",
            endTime: "21:00",
            duration: 60,
            priority: "high",
            category: "wellness",
            instructions: [
              "Dim the lights in your environment",
              "Practice gentle stretching or yoga",
              "Read a book or listen to calming music",
              "Avoid screens and stimulating activities",
            ],
            tips: [
              "Create a consistent bedtime routine",
              "Keep your bedroom cool and dark",
              "Use relaxation techniques",
            ],
            benefits:
              "Improves sleep quality, reduces stress, and promotes relaxation",
            scientificEvidence:
              "Consistent evening routines have been shown to improve sleep onset and quality",
          },
          {
            id: "sleep-1",
            type: "sleep",
            title: "Quality Sleep",
            description: "Restorative sleep for optimal health",
            startTime: "22:00",
            endTime: "06:00",
            duration: 480,
            priority: "high",
            category: "recovery",
            instructions: [
              "Aim for 7-9 hours of sleep",
              "Keep bedroom cool (65-68°F)",
              "Use blackout curtains or eye mask",
              "Remove electronic devices from bedroom",
            ],
            tips: [
              "Maintain consistent sleep schedule",
              "Avoid caffeine after 2 PM",
              "Create a comfortable sleep environment",
            ],
            benefits:
              "Supports immune function, memory consolidation, and physical recovery",
            scientificEvidence:
              "Quality sleep is essential for hormone regulation, immune function, and cognitive performance",
          },
        ],
        focus: "Establishing healthy daily routines and habits",
        goals: [
          "Complete all planned activities",
          "Stay hydrated throughout the day",
          "Maintain consistent sleep schedule",
          "Practice mindful eating",
          "Include movement in daily routine",
        ],
        tips: [
          "Start each day with intention",
          "Listen to your body and adjust as needed",
          "Celebrate small wins",
          "Stay consistent with your routine",
          "Be patient with the process",
        ],
      },
      overall_goals: [
        "Improve overall health and wellbeing",
        "Build sustainable healthy habits",
        "Increase energy levels naturally",
        "Optimize sleep quality",
        "Reduce stress and improve mood",
        "Maintain consistency in daily routines",
      ],
      progress_tracking: {
        daily_tracking: [
          "Complete all planned activities",
          "Rate energy levels (1-10)",
          "Track mood and motivation",
          "Record sleep quality",
          "Monitor hunger and satiety",
          "Note any challenges or barriers",
        ],
        weekly_assessments: [
          "Weight and body measurements",
          "Progress photos",
          "Energy and mood trends",
          "Sleep quality patterns",
          "Adherence percentage",
          "Goal progress evaluation",
        ],
        monthly_evaluations: [
          "Comprehensive health markers",
          "Body composition analysis",
          "Lifestyle habit assessment",
          "Goal achievement review",
          "Plan adjustments needed",
          "Long-term sustainability check",
        ],
      },
      progress_tips: [
        "Track your daily activities and progress",
        "Stay consistent with your schedule",
        "Listen to your body and adjust as needed",
        "Celebrate small wins and milestones",
        "Stay hydrated throughout the day",
        "Get adequate sleep for recovery",
        "Practice stress management techniques",
        "Focus on progress, not perfection",
        "Be patient with the process",
        "Seek support when needed",
      ],
      safety_notes: [
        "If you experience any concerning symptoms, consult your healthcare provider immediately",
        "Start slowly and progress gradually",
        "Listen to your body and rest when needed",
        "Stop any activity that causes pain or discomfort",
        "Stay hydrated and well-nourished",
        "Get medical clearance before starting if you have health concerns",
        "Adjust the plan based on your individual needs and limitations",
        "Don't push through pain or excessive fatigue",
      ],
      cultural_adaptations: [
        "Plan adapted to your schedule and preferences",
        "Flexible meal options provided",
        "Exercise modifications available",
        "Cultural food preferences accommodated",
        "Flexible timing based on your routine",
        "Alternative activities for different fitness levels",
        "Adaptable to various work schedules",
        "Respects individual preferences and limitations",
      ],
      plan_metadata: {
        plan_type: "wellness_optimization",
        duration_days: 30,
        difficulty_level: "Beginner",
        estimated_completion_time: "30 days",
        primary_focus: "Overall health and lifestyle optimization",
        target_outcomes: [
          "Improved energy levels",
          "Better sleep quality",
          "Reduced stress levels",
          "Enhanced mental clarity",
          "Better immune function",
          "Overall health optimization",
        ],
      },
      is_active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
  }
}

export const healthPlanServiceWithProgress =
  new HealthPlanServiceWithProgress();
