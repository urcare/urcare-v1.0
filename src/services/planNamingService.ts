/**
 * PLAN NAMING SERVICE
 *
 * Systematic plan naming based on user goals and difficulty levels
 * Integrates with the overall AI generator engine
 */

export interface PlanNamingConfig {
  goal: string;
  difficulty: "easy" | "moderate" | "hard";
  duration?: number;
  userPreferences?: string[];
}

export interface PlanNameResult {
  planName: string;
  subtitle: string;
  intensity: "low" | "medium" | "high";
  category: string;
}

export class PlanNamingService {
  /**
   * Generate systematic plan name based on goal and difficulty
   */
  static generatePlanName(config: PlanNamingConfig): PlanNameResult {
    const { goal, difficulty, duration = 12 } = config;
    const goalLower = goal.toLowerCase();

    // Extract goal category
    const category = this.extractGoalCategory(goalLower);

    // Generate name based on difficulty and category
    const planName = this.generateNameByDifficulty(category, difficulty);
    const subtitle = this.generateSubtitle(category, difficulty, duration);
    const intensity = this.getIntensityLevel(difficulty);

    return {
      planName,
      subtitle,
      intensity,
      category,
    };
  }

  /**
   * Extract goal category from user input
   */
  private static extractGoalCategory(goal: string): string {
    // Weight management - check for gain weight first
    if (goal.includes("gain") && goal.includes("weight")) return "muscle_gain";
    if (goal.includes("weight") && goal.includes("gain")) return "muscle_gain";
    if (goal.includes("lose") && goal.includes("weight")) return "weight_loss";
    if (goal.includes("weight") && goal.includes("loss")) return "weight_loss";

    // Muscle and strength
    if (goal.includes("muscle") || goal.includes("bulk"))
      return "muscle_building";
    if (goal.includes("strength") || goal.includes("power"))
      return "strength_training";
    if (
      goal.includes("build") &&
      (goal.includes("muscle") || goal.includes("strength"))
    )
      return "muscle_building";

    // Fitness and endurance
    if (goal.includes("fitness") || goal.includes("endurance"))
      return "fitness_training";
    if (goal.includes("cardio") || goal.includes("running"))
      return "cardiovascular";
    if (goal.includes("stamina") || goal.includes("energy"))
      return "endurance_training";

    // Mental wellness
    if (goal.includes("stress") || goal.includes("mental"))
      return "mental_wellness";
    if (goal.includes("mindfulness") || goal.includes("meditation"))
      return "mindfulness";
    if (goal.includes("sleep") || goal.includes("rest"))
      return "sleep_optimization";

    // General health
    if (goal.includes("health") || goal.includes("wellness"))
      return "general_health";
    if (goal.includes("diet") || goal.includes("nutrition"))
      return "nutrition_focus";

    return "general_health";
  }

  /**
   * Generate plan name based on category and difficulty
   */
  private static generateNameByDifficulty(
    category: string,
    difficulty: string
  ): string {
    const namingMatrix = {
      // Easy plans - gentle, approachable
      easy: {
        muscle_gain: "Muscle Starter",
        weight_loss: "Weight Ease",
        muscle_building: "Strength Start",
        strength_training: "Power Start",
        fitness_training: "Fitness First",
        cardiovascular: "Cardio Start",
        endurance_training: "Stamina Start",
        mental_wellness: "Mind Calm",
        mindfulness: "Zen Start",
        sleep_optimization: "Sleep Ease",
        general_health: "Health Start",
        nutrition_focus: "Nutrition Start",
      },

      // Moderate plans - balanced, professional
      moderate: {
        muscle_gain: "Muscle Builder",
        weight_loss: "Fat Burner",
        muscle_building: "Strength Protocol",
        strength_training: "Power Protocol",
        fitness_training: "Fitness Boost",
        cardiovascular: "Cardio Protocol",
        endurance_training: "Stamina Protocol",
        mental_wellness: "Mind Protocol",
        mindfulness: "Zen Protocol",
        sleep_optimization: "Sleep Protocol",
        general_health: "Health Protocol",
        nutrition_focus: "Nutrition Protocol",
      },

      // Hard plans - intense, powerful
      hard: {
        muscle_gain: "Muscle Mass Protocol",
        weight_loss: "Fat Burn Protocol",
        muscle_building: "Power Builder",
        strength_training: "Elite Strength",
        fitness_training: "Elite Fitness",
        cardiovascular: "Cardio Elite",
        endurance_training: "Stamina Elite",
        mental_wellness: "Zen Master",
        mindfulness: "Mind Master",
        sleep_optimization: "Sleep Master",
        general_health: "Ultimate Protocol",
        nutrition_focus: "Nutrition Elite",
      },
    };

    return namingMatrix[difficulty]?.[category] || "Health Protocol";
  }

  /**
   * Generate descriptive subtitle
   */
  private static generateSubtitle(
    category: string,
    difficulty: string,
    duration: number
  ): string {
    const intensityWords = {
      easy: ["Gentle", "Beginner", "Foundation"],
      moderate: ["Balanced", "Progressive", "Advanced"],
      hard: ["Intense", "Elite", "Ultimate"],
    };

    const categoryDescriptions = {
      muscle_gain: "Muscle Building",
      weight_loss: "Weight Management",
      muscle_building: "Strength Development",
      strength_training: "Power Training",
      fitness_training: "Fitness Enhancement",
      cardiovascular: "Cardiovascular Health",
      endurance_training: "Endurance Building",
      mental_wellness: "Mental Wellness",
      mindfulness: "Mindfulness Practice",
      sleep_optimization: "Sleep Optimization",
      general_health: "Health Improvement",
      nutrition_focus: "Nutritional Health",
    };

    const intensity = intensityWords[difficulty]?.[0] || "Balanced";
    const description = categoryDescriptions[category] || "Health Improvement";

    return `${intensity} ${description} • ${duration} weeks`;
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
   * Generate multiple plan names for comparison
   */
  static generatePlanOptions(goal: string): PlanNameResult[] {
    const difficulties: ("easy" | "moderate" | "hard")[] = [
      "easy",
      "moderate",
      "hard",
    ];

    return difficulties.map((difficulty) =>
      this.generatePlanName({ goal, difficulty })
    );
  }

  /**
   * Get plan name for specific difficulty
   */
  static getPlanNameForDifficulty(goal: string, difficulty: string): string {
    console.log("PlanNamingService.getPlanNameForDifficulty called with:", {
      goal,
      difficulty,
    });

    const result = this.generatePlanName({ goal, difficulty });

    console.log("PlanNamingService result:", result);

    return result.planName;
  }

  /**
   * Validate and clean user goal input
   */
  static cleanUserGoal(goal: string): string {
    if (!goal || goal.trim().length === 0) {
      return "improve overall health";
    }

    // Remove common filler words and clean up
    const cleaned = goal
      .toLowerCase()
      .replace(/\b(i want to|i need to|i would like to|please|help me)\b/g, "")
      .replace(/\b(get|be|have|become|achieve)\b/g, "")
      .trim();

    return cleaned || "improve overall health";
  }
}
