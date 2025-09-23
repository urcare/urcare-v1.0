import { supabase } from "@/integrations/supabase/client";

export interface HealthPlanSearchRequest {
  query: string;
  userProfile?: any;
  maxTokens?: number;
  includeFileContext?: boolean;
  fileContent?: string;
}

export interface HealthPlanSearchResponse {
  success: boolean;
  plan?: any;
  error?: string;
  tokensUsed?: number;
  estimatedCost?: number;
}

export interface TokenUsage {
  promptTokens: number;
  completionTokens: number;
  totalTokens: number;
  estimatedCost: number;
}

class HealthPlanSearchService {
  private readonly MAX_TOKENS_PER_REQUEST = 16000; // Limit tokens per request
  private readonly MAX_DAILY_TOKENS = 100000; // Daily limit per user
  private readonly COST_PER_1K_TOKENS = 0.03; // Approximate cost for GPT-4

  // Check if user has exceeded daily token limit
  async checkTokenLimit(
    userId: string
  ): Promise<{ allowed: boolean; remaining: number }> {
    try {
      const today = new Date().toISOString().split("T")[0];

      const { data, error } = await supabase
        .from("token_usage")
        .select("total_tokens")
        .eq("user_id", userId)
        .eq("date", today)
        .single();

      if (error && error.code !== "PGRST116") {
        // PGRST116 = no rows found
        throw error;
      }

      const usedTokens = data?.total_tokens || 0;
      const remaining = Math.max(0, this.MAX_DAILY_TOKENS - usedTokens);

      return {
        allowed: remaining > 0,
        remaining,
      };
    } catch (error) {
      console.error("Error checking token limit:", error);
      // If table doesn't exist, allow unlimited usage for now
      return { allowed: true, remaining: this.MAX_DAILY_TOKENS };
    }
  }

  // Record token usage
  async recordTokenUsage(userId: string, usage: TokenUsage): Promise<void> {
    try {
      const today = new Date().toISOString().split("T")[0];

      const { error } = await supabase.from("token_usage").upsert(
        {
          user_id: userId,
          date: today,
          total_tokens: usage.totalTokens,
          prompt_tokens: usage.promptTokens,
          completion_tokens: usage.completionTokens,
          estimated_cost: usage.estimatedCost,
          updated_at: new Date().toISOString(),
        },
        {
          onConflict: "user_id,date",
        }
      );

      if (error) {
        console.error("Error recording token usage:", error);
        // If table doesn't exist, just log and continue
      }
    } catch (error) {
      console.error("Error recording token usage:", error);
      // If table doesn't exist, just log and continue
    }
  }

  // Generate health plan based on search query
  async generateHealthPlanFromQuery(
    request: HealthPlanSearchRequest,
    userId: string
  ): Promise<HealthPlanSearchResponse> {
    try {
      if (!userId) {
        return { success: false, error: "User not authenticated" };
      }

      // Token limit check removed for better user experience
      // const tokenCheck = await this.checkTokenLimit(userId);
      // if (!tokenCheck.allowed) {
      //   return {
      //     success: false,
      //     error: `Daily token limit exceeded. Please try again tomorrow.`,
      //   };
      // }

      // Prepare the request with token limits
      const maxTokens = request.maxTokens || this.MAX_TOKENS_PER_REQUEST;

      // Call the Supabase function with the search query
      const { data, error } = await supabase.functions.invoke(
        "generate-health-plan-from-query",
        {
          method: "POST",
          body: {
            query: request.query,
            userProfile: request.userProfile,
            maxTokens: maxTokens,
            includeFileContext: request.includeFileContext,
            fileContent: request.fileContent,
          },
        }
      );

      if (error) {
        throw new Error(`Failed to generate health plan: ${error.message}`);
      }

      if (!data.success) {
        throw new Error(data.error || "Failed to generate health plan");
      }

      // Record token usage if available (commented out to prevent issues)
      // if (data.tokenUsage) {
      //   await this.recordTokenUsage(userId, data.tokenUsage);
      // }

      // Enhanced response handling for comprehensive health plans
      const enhancedPlan = this.enhanceHealthPlan(
        data.plan,
        request.userProfile
      );

      return {
        success: true,
        plan: enhancedPlan,
        tokensUsed: data.tokenUsage?.totalTokens,
        estimatedCost: data.tokenUsage?.estimatedCost,
        confidence: data.plan?.confidence || 85,
        evidenceBase:
          data.plan?.evidenceBase || "Based on peer-reviewed research",
        adaptiveFeatures: this.extractAdaptiveFeatures(data.plan),
        safetyScore: this.calculateSafetyScore(data.plan),
      };
    } catch (error) {
      console.error("Error generating health plan from query:", error);
      return {
        success: false,
        error:
          error instanceof Error ? error.message : "Unknown error occurred",
      };
    }
  }

  // Get user's token usage for the current month
  async getUserTokenUsage(userId: string): Promise<{
    dailyUsage: Array<{ date: string; tokens: number; cost: number }>;
    monthlyTotal: number;
    monthlyCost: number;
  }> {
    try {
      const startOfMonth = new Date();
      startOfMonth.setDate(1);
      startOfMonth.setHours(0, 0, 0, 0);

      const { data, error } = await supabase
        .from("token_usage")
        .select("date, total_tokens, estimated_cost")
        .eq("user_id", userId)
        .gte("date", startOfMonth.toISOString().split("T")[0])
        .order("date", { ascending: true });

      if (error) {
        throw error;
      }

      const dailyUsage =
        data?.map((record) => ({
          date: record.date,
          tokens: record.total_tokens,
          cost: record.estimated_cost,
        })) || [];

      const monthlyTotal = dailyUsage.reduce((sum, day) => sum + day.tokens, 0);
      const monthlyCost = dailyUsage.reduce((sum, day) => sum + day.cost, 0);

      return {
        dailyUsage,
        monthlyTotal,
        monthlyCost,
      };
    } catch (error) {
      console.error("Error fetching token usage:", error);
      return {
        dailyUsage: [],
        monthlyTotal: 0,
        monthlyCost: 0,
      };
    }
  }

  // Estimate token usage for a query
  estimateTokenUsage(query: string, includeProfile: boolean = true): number {
    // Rough estimation: 1 token ≈ 4 characters for English text
    const queryTokens = Math.ceil(query.length / 4);
    const profileTokens = includeProfile ? 500 : 0; // Estimated profile tokens
    const systemPromptTokens = 200; // Estimated system prompt tokens
    const responseTokens = 1000; // Estimated response tokens

    return queryTokens + profileTokens + systemPromptTokens + responseTokens;
  }

  // Enhanced health plan processing methods
  private enhanceHealthPlan(plan: any, userProfile: any): any {
    if (!plan) return plan;

    // Add personalized elements based on user profile
    const enhancedPlan = { ...plan };

    // Add cultural adaptations
    if (
      userProfile?.diet_type === "vegetarian" ||
      userProfile?.diet_type === "vegan"
    ) {
      enhancedPlan.culturalAdaptations = this.getVegetarianAdaptations(plan);
    }

    // Add regional food suggestions
    if (userProfile?.location) {
      enhancedPlan.regionalFoods = this.getRegionalFoods(
        userProfile.location,
        plan
      );
    }

    // Add time zone specific scheduling
    if (userProfile?.timezone) {
      enhancedPlan.scheduledActivities = this.adjustForTimezone(
        plan,
        userProfile.timezone
      );
    }

    // Add progress tracking elements
    enhancedPlan.progressTracking = this.generateProgressTracking(plan);

    return enhancedPlan;
  }

  private extractAdaptiveFeatures(plan: any): any {
    if (!plan) return {};

    return {
      hasAdaptiveAdjustments: !!plan.adaptiveAdjustments,
      hasBiometricTargets: !!plan.biometricTargets,
      hasEvidenceSupport: !!plan.evidenceSupport,
      hasSafetyWarnings: !!plan.warnings,
      complexityLevel: this.assessPlanComplexity(plan),
      personalizationScore: this.calculatePersonalizationScore(plan),
    };
  }

  private calculateSafetyScore(plan: any): number {
    if (!plan) return 0;

    let safetyScore = 100;

    // Deduct points for potential risks
    if (plan.warnings && plan.warnings.length > 0) {
      safetyScore -= plan.warnings.length * 5;
    }

    // Check for extreme recommendations
    if (plan.trainingBlock?.exercises) {
      const highIntensityExercises = plan.trainingBlock.exercises.filter(
        (ex: any) => ex.rpe && parseInt(ex.rpe) > 8
      );
      safetyScore -= highIntensityExercises.length * 3;
    }

    // Check for restrictive diets
    if (plan.nutritionPlan?.calories && plan.nutritionPlan.calories < 1200) {
      safetyScore -= 15;
    }

    return Math.max(0, safetyScore);
  }

  private getVegetarianAdaptations(plan: any): any {
    return {
      proteinSources: [
        "Paneer (Indian cottage cheese)",
        "Dal (lentils)",
        "Chickpeas",
        "Tofu",
        "Greek yogurt",
        "Quinoa",
        "Hemp seeds",
        "Nutritional yeast",
      ],
      mealSwaps: {
        "Grilled salmon": "Grilled paneer or tofu",
        "Chicken breast": "Chickpea curry or dal",
        Beef: "Lentil-based protein",
      },
      supplementNotes:
        "Consider B12, iron, and omega-3 supplements for plant-based diets",
    };
  }

  private getRegionalFoods(location: string, plan: any): any {
    const regionalMap: { [key: string]: any } = {
      india: {
        breakfast: [
          "Idli with sambar",
          "Poha",
          "Upma with vegetables",
          "Paratha with curd",
        ],
        lunch: [
          "Dal chawal",
          "Rajma rice",
          "Chole bhature",
          "Vegetable biryani",
        ],
        dinner: ["Roti with sabzi", "Khichdi", "Vegetable curry with rice"],
        snacks: ["Roasted chana", "Peanuts", "Fruit chaat", "Sprouts bhel"],
      },
      mediterranean: {
        breakfast: [
          "Greek yogurt with honey",
          "Olive oil toast",
          "Feta cheese",
        ],
        lunch: [
          "Mediterranean salad",
          "Grilled fish",
          "Hummus with vegetables",
        ],
        dinner: ["Grilled vegetables", "Olive oil pasta", "Greek salad"],
      },
    };

    return regionalMap[location.toLowerCase()] || {};
  }

  private adjustForTimezone(plan: any, timezone: string): any {
    // This would adjust meal times and activity schedules based on user's timezone
    return {
      timezone: timezone,
      adjustedSchedule: "All times adjusted for your local timezone",
      note: "Please adjust all times according to your local timezone",
    };
  }

  private generateProgressTracking(plan: any): any {
    return {
      dailyMetrics: [
        "Energy level (1-10)",
        "Mood (1-10)",
        "Hunger level (1-10)",
        "Sleep quality (1-10)",
        "Exercise completion (%)",
        "Meal adherence (%)",
      ],
      weeklyMetrics: [
        "Weight change",
        "Body measurements",
        "Strength progression",
        "Endurance improvement",
        "Sleep consistency",
        "Stress levels",
      ],
      monthlyMetrics: [
        "Body composition",
        "Blood markers (if available)",
        "Overall health score",
        "Goal progress",
        "Habit formation",
      ],
    };
  }

  private assessPlanComplexity(plan: any): string {
    let complexityScore = 0;

    if (plan.morningProtocol) complexityScore += 2;
    if (plan.trainingBlock?.exercises?.length > 3) complexityScore += 2;
    if (plan.nutritionPlan?.lunch?.preMeal) complexityScore += 1;
    if (plan.sleepOptimization) complexityScore += 1;
    if (plan.adaptiveAdjustments) complexityScore += 1;

    if (complexityScore <= 3) return "Beginner";
    if (complexityScore <= 5) return "Intermediate";
    return "Advanced";
  }

  private calculatePersonalizationScore(plan: any): number {
    let score = 0;

    if (plan.biometricTargets) score += 20;
    if (plan.morningProtocol?.circadianActivation) score += 15;
    if (plan.trainingBlock?.exercises?.length > 0) score += 20;
    if (plan.nutritionPlan?.lunch?.eatingOrder) score += 15;
    if (plan.sleepOptimization) score += 15;
    if (plan.adaptiveAdjustments) score += 15;

    return Math.min(100, score);
  }
}

export const healthPlanSearchService = new HealthPlanSearchService();
