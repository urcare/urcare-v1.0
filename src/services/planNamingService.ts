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

    // Generate name based on difficulty and category, passing original goal
    const planName = this.generateNameByDifficulty(category, difficulty, goal);
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
    difficulty: string,
    originalGoal?: string
  ): string {
    // If we have the original goal, create personalized names
    if (originalGoal) {
      const goalWords = this.extractKeyWords(originalGoal);
      const intensityPrefix = this.getIntensityPrefix(difficulty);

      return `${intensityPrefix} ${goalWords} Protocol`;
    }

    // Fallback to category-based naming
    const namingMatrix = {
      // Easy plans - gentle, approachable
      easy: {
        muscle_gain: "Easy Weight Gain Protocol",
        weight_loss: "Easy Weight Loss Protocol",
        muscle_building: "Easy Muscle Building Protocol",
        strength_training: "Easy Strength Protocol",
        fitness_training: "Easy Fitness Protocol",
        cardiovascular: "Easy Cardio Protocol",
        endurance_training: "Easy Endurance Protocol",
        mental_wellness: "Easy Mental Wellness Protocol",
        mindfulness: "Easy Mindfulness Protocol",
        sleep_optimization: "Easy Sleep Protocol",
        general_health: "Easy Health Protocol",
        nutrition_focus: "Easy Nutrition Protocol",
      },

      // Moderate plans - balanced, professional
      moderate: {
        muscle_gain: "Moderate Weight Gain Protocol",
        weight_loss: "Moderate Weight Loss Protocol",
        muscle_building: "Moderate Muscle Building Protocol",
        strength_training: "Moderate Strength Protocol",
        fitness_training: "Moderate Fitness Protocol",
        cardiovascular: "Moderate Cardio Protocol",
        endurance_training: "Moderate Endurance Protocol",
        mental_wellness: "Moderate Mental Wellness Protocol",
        mindfulness: "Moderate Mindfulness Protocol",
        sleep_optimization: "Moderate Sleep Protocol",
        general_health: "Moderate Health Protocol",
        nutrition_focus: "Moderate Nutrition Protocol",
      },

      // Hard plans - intense, powerful
      hard: {
        muscle_gain: "Ultimate Weight Gain Protocol",
        weight_loss: "Ultimate Weight Loss Protocol",
        muscle_building: "Ultimate Muscle Building Protocol",
        strength_training: "Ultimate Strength Protocol",
        fitness_training: "Ultimate Fitness Protocol",
        cardiovascular: "Ultimate Cardio Protocol",
        endurance_training: "Ultimate Endurance Protocol",
        mental_wellness: "Ultimate Mental Wellness Protocol",
        mindfulness: "Ultimate Mindfulness Protocol",
        sleep_optimization: "Ultimate Sleep Protocol",
        general_health: "Ultimate Health Protocol",
        nutrition_focus: "Ultimate Nutrition Protocol",
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

  /**
   * Extract key words from user goal for personalized naming
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
   * Get intensity prefix based on difficulty
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
