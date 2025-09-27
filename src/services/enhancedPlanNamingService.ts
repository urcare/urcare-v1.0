/**
 * ENHANCED PLAN NAMING SERVICE
 *
 * This service uses AI to generate truly personalized plan names
 * based on user goals and creates goal-specific summaries
 */

import { UserProfile } from "@/contexts/AuthContext";

export interface EnhancedPlanNameResult {
  planName: string;
  subtitle: string;
  description: string;
  intensity: "low" | "medium" | "high";
  category: string;
  goalSpecificSummary: string;
  expectedOutcomes: string[];
  keyFeatures: string[];
}

export interface PlanNamingConfig {
  goal: string;
  difficulty: "easy" | "moderate" | "hard";
  duration?: number;
  userProfile?: UserProfile;
}

export class EnhancedPlanNamingService {
  /**
   * Generate AI-powered personalized plan name
   */
  static async generatePersonalizedPlanName(
    config: PlanNamingConfig
  ): Promise<EnhancedPlanNameResult> {
    const { goal, difficulty, duration = 12, userProfile } = config;

    // Create AI prompt for personalized naming
    const prompt = this.createPersonalizedNamingPrompt(
      goal,
      difficulty,
      duration,
      userProfile
    );

    try {
      // Call AI service to generate personalized name
      const aiResponse = await this.callAIService(prompt);
      return this.processAIResponse(aiResponse, goal, difficulty);
    } catch (error) {
      console.error("Error generating personalized plan name:", error);
      console.log("Falling back to enhanced naming without AI...");
      // Fallback to enhanced naming without AI
      return this.generateEnhancedFallbackName(goal, difficulty, duration, userProfile);
    }
  }

  /**
   * Create AI prompt for personalized plan naming
   */
  private static createPersonalizedNamingPrompt(
    goal: string,
    difficulty: string,
    duration: number,
    userProfile?: UserProfile
  ): string {
    const userContext = userProfile
      ? `
USER PROFILE:
- Name: ${userProfile.full_name || "User"}
- Age: ${userProfile.age || "Not specified"}
- Gender: ${userProfile.gender || "Not specified"}
- Health Goals: ${userProfile.health_goals?.join(", ") || "General health"}
- Diet Type: ${userProfile.diet_type || "Balanced"}
- Workout Type: ${userProfile.workout_type || "General fitness"}
- Chronic Conditions: ${userProfile.chronic_conditions?.join(", ") || "None"}
- Medications: ${userProfile.medications?.join(", ") || "None"}
`
      : "";

    return `You are a health and wellness expert. Create a personalized, motivational plan name and description for a user.

${userContext}

USER GOAL: "${goal}"
DIFFICULTY LEVEL: ${difficulty}
DURATION: ${duration} weeks

Create a plan name that:
1. Is specific to the user's goal (not generic)
2. Reflects the difficulty level appropriately
3. Is motivational and inspiring
4. Uses the user's actual goal words when possible
5. Sounds professional but approachable

Return ONLY a JSON object with this exact structure:
{
  "planName": "Personalized plan name based on user's specific goal",
  "subtitle": "Brief motivational subtitle",
  "description": "Detailed description of what this plan will help achieve",
  "intensity": "low|medium|high",
  "category": "goal category",
  "goalSpecificSummary": "2-3 sentence summary of how this plan specifically addresses the user's goal",
  "expectedOutcomes": ["outcome 1", "outcome 2", "outcome 3"],
  "keyFeatures": ["feature 1", "feature 2", "feature 3"]
}`;
  }

  /**
   * Call AI service for personalized naming via Supabase Edge Function
   */
  private static async callAIService(prompt: string): Promise<any> {
    try {
      const response = await fetch("/api/generate-personalized-plan-name", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt }),
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.statusText}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error calling AI service:", error);
      throw error;
    }
  }

  /**
   * Process AI response into structured format
   */
  private static processAIResponse(
    aiResponse: any,
    goal: string,
    difficulty: string
  ): EnhancedPlanNameResult {
    return {
      planName:
        aiResponse.planName ||
        this.generateFallbackName(goal, difficulty).planName,
      subtitle: aiResponse.subtitle || "Personalized health plan",
      description:
        aiResponse.description ||
        "A customized health plan tailored to your goals",
      intensity: aiResponse.intensity || this.getIntensityLevel(difficulty),
      category: aiResponse.category || this.extractGoalCategory(goal),
      goalSpecificSummary:
        aiResponse.goalSpecificSummary ||
        "This plan is designed to help you achieve your health goals",
      expectedOutcomes: aiResponse.expectedOutcomes || [
        "Improved health",
        "Better habits",
        "Goal achievement",
      ],
      keyFeatures: aiResponse.keyFeatures || [
        "Personalized approach",
        "Evidence-based",
        "Sustainable",
      ],
    };
  }

  /**
   * Generate enhanced fallback name when AI fails
   */
  private static generateEnhancedFallbackName(
    goal: string,
    difficulty: string,
    duration: number = 12,
    userProfile?: UserProfile
  ): EnhancedPlanNameResult {
    const goalWords = this.extractKeyWords(goal);
    const intensityPrefix = this.getIntensityPrefix(difficulty);
    const userContext = userProfile ? ` for ${userProfile.full_name || "you"}` : "";

    return {
      planName: `${intensityPrefix} ${goalWords} Transformation`,
      subtitle: `Your personalized ${duration}-week journey`,
      description: `A ${difficulty} intensity plan specifically designed to help you ${goal.toLowerCase()}${userContext}.`,
      intensity: this.getIntensityLevel(difficulty),
      category: this.extractGoalCategory(goal),
      goalSpecificSummary: `This ${difficulty} intensity plan is specifically crafted to help you ${goal.toLowerCase()} over ${duration} weeks, taking into account your personal goals and preferences.`,
      expectedOutcomes: [
        `Measurable progress toward ${goal.toLowerCase()}`,
        "Improved health and wellness habits",
        "Increased motivation and consistency"
      ],
      keyFeatures: [
        "Personalized to your specific goal",
        "Adapts to your schedule and lifestyle",
        "Evidence-based approach with proven results"
      ]
    };
  }

  /**
   * Generate basic fallback name when AI fails
   */
  private static generateFallbackName(
    goal: string,
    difficulty: string,
    duration: number = 12
  ): EnhancedPlanNameResult {
    const goalWords = this.extractKeyWords(goal);
    const intensityPrefix = this.getIntensityPrefix(difficulty);

    return {
      planName: `${intensityPrefix} ${goalWords} Protocol`,
      subtitle: `${duration}-week personalized plan`,
      description: `A ${difficulty} intensity plan designed to help you ${goal.toLowerCase()}`,
      intensity: this.getIntensityLevel(difficulty),
      category: this.extractGoalCategory(goal),
      goalSpecificSummary: `This ${difficulty} intensity plan is specifically designed to help you ${goal.toLowerCase()} over ${duration} weeks.`,
      expectedOutcomes: [
        `Progress toward ${goal.toLowerCase()}`,
        "Improved health habits",
        "Increased motivation",
      ],
      keyFeatures: [
        "Personalized to your goal",
        "Evidence-based approach",
        "Flexible and adaptable",
      ],
    };
  }

  /**
   * Extract key words from user goal
   */
  private static extractKeyWords(goal: string): string {
    const goalLower = goal.toLowerCase();

    // Weight-related goals
    if (goalLower.includes("gain") && goalLower.includes("weight")) {
      return "Weight Gain";
    }
    if (goalLower.includes("lose") && goalLower.includes("weight")) {
      return "Weight Loss";
    }
    if (goalLower.includes("weight") && goalLower.includes("loss")) {
      return "Weight Loss";
    }

    // Muscle and strength goals
    if (goalLower.includes("muscle") && goalLower.includes("build")) {
      return "Muscle Building";
    }
    if (goalLower.includes("build") && goalLower.includes("muscle")) {
      return "Muscle Building";
    }
    if (goalLower.includes("muscle") || goalLower.includes("bulk")) {
      return "Muscle Building";
    }
    if (goalLower.includes("strength") || goalLower.includes("power")) {
      return "Strength Training";
    }

    // Fitness goals
    if (goalLower.includes("fitness") || goalLower.includes("endurance")) {
      return "Fitness Training";
    }
    if (goalLower.includes("cardio") || goalLower.includes("running")) {
      return "Cardio Training";
    }
    if (goalLower.includes("stamina") || goalLower.includes("energy")) {
      return "Endurance Training";
    }

    // Mental wellness goals
    if (goalLower.includes("stress") || goalLower.includes("mental")) {
      return "Mental Wellness";
    }
    if (goalLower.includes("mindfulness") || goalLower.includes("meditation")) {
      return "Mindfulness";
    }
    if (goalLower.includes("sleep") || goalLower.includes("rest")) {
      return "Sleep Optimization";
    }

    // General health goals
    if (goalLower.includes("health") || goalLower.includes("wellness")) {
      return "Health Improvement";
    }
    if (goalLower.includes("diet") || goalLower.includes("nutrition")) {
      return "Nutrition Focus";
    }

    // Default fallback - capitalize first letter of each word
    return goal
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  }

  /**
   * Extract goal category
   */
  private static extractGoalCategory(goal: string): string {
    const goalLower = goal.toLowerCase();

    if (goalLower.includes("gain") && goalLower.includes("weight"))
      return "muscle_gain";
    if (goalLower.includes("lose") && goalLower.includes("weight"))
      return "weight_loss";
    if (goalLower.includes("weight") && goalLower.includes("loss"))
      return "weight_loss";
    if (goalLower.includes("muscle") && goalLower.includes("build"))
      return "muscle_building";
    if (goalLower.includes("build") && goalLower.includes("muscle"))
      return "muscle_building";
    if (goalLower.includes("muscle") || goalLower.includes("bulk"))
      return "muscle_building";
    if (goalLower.includes("strength") || goalLower.includes("power"))
      return "strength_training";
    if (goalLower.includes("fitness") || goalLower.includes("endurance"))
      return "fitness_training";
    if (goalLower.includes("cardio") || goalLower.includes("running"))
      return "cardiovascular";
    if (goalLower.includes("stamina") || goalLower.includes("energy"))
      return "endurance_training";
    if (goalLower.includes("stress") || goalLower.includes("mental"))
      return "mental_wellness";
    if (goalLower.includes("mindfulness") || goalLower.includes("meditation"))
      return "mindfulness";
    if (goalLower.includes("sleep") || goalLower.includes("rest"))
      return "sleep_optimization";
    if (goalLower.includes("diet") || goalLower.includes("nutrition"))
      return "nutrition_focus";

    return "general_health";
  }

  /**
   * Get intensity level
   */
  private static getIntensityLevel(
    difficulty: string
  ): "low" | "medium" | "high" {
    switch (difficulty) {
      case "easy":
        return "low";
      case "moderate":
        return "medium";
      case "hard":
        return "high";
      default:
        return "medium";
    }
  }

  /**
   * Get intensity prefix
   */
  private static getIntensityPrefix(difficulty: string): string {
    switch (difficulty) {
      case "easy":
        return "Easy";
      case "moderate":
        return "Moderate";
      case "hard":
        return "Ultimate";
      default:
        return "Moderate";
    }
  }
}
