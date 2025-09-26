/**
 * ENHANCED PLAN DETAILS SERVICE
 *
 * Provides goal-specific plan details and week-by-week progression
 * Integrates with existing health planning engine
 */

import { ComprehensiveHealthPlan } from "@/types/comprehensiveHealthPlan";
import { PlanNamingService } from "./planNamingService";

export interface EnhancedPlanDetails {
  planName: string;
  primaryGoal: string;
  expectedImpacts: string[];
  weeklyProgression: WeeklyProgression[];
  goalSpecificTips: string[];
  safetyConsiderations: string[];
  successMetrics: string[];
}

export interface WeeklyProgression {
  week: number;
  focus: string;
  intensity: "low" | "moderate" | "high";
  keyActivities: string[];
  milestones: string[];
  expectedOutcomes: string[];
}

export class EnhancedPlanDetailsService {
  /**
   * Generate enhanced plan details based on user goal
   */
  static generateEnhancedDetails(
    plan: ComprehensiveHealthPlan,
    userGoal: string
  ): EnhancedPlanDetails {
    const goalLower = userGoal.toLowerCase();

    return {
      planName: this.generatePlanName(userGoal),
      primaryGoal: userGoal,
      expectedImpacts: this.getExpectedImpacts(goalLower),
      weeklyProgression: this.generateWeeklyProgression(
        goalLower,
        plan.duration_weeks
      ),
      goalSpecificTips: this.getGoalSpecificTips(goalLower),
      safetyConsiderations: this.getSafetyConsiderations(goalLower),
      successMetrics: this.getSuccessMetrics(goalLower),
    };
  }

  /**
   * Generate dynamic plan name using systematic naming service
   */
  private static generatePlanName(goal: string): string {
    // Use the systematic naming service for consistent naming
    const cleanedGoal = PlanNamingService.cleanUserGoal(goal);
    return PlanNamingService.getPlanNameForDifficulty(cleanedGoal, "moderate");
  }

  /**
   * Get goal-specific expected impacts
   */
  private static getExpectedImpacts(goal: string): string[] {
    if (goal.includes("weight") && goal.includes("gain")) {
      return [
        "Increased muscle mass and strength",
        "Improved body composition",
        "Enhanced appetite and nutrition intake",
        "Better energy levels and recovery",
        "Improved metabolic health",
      ];
    }

    if (goal.includes("weight") && goal.includes("loss")) {
      return [
        "Sustainable weight loss",
        "Improved body composition",
        "Better energy levels",
        "Enhanced self-confidence",
        "Reduced health risks",
      ];
    }

    if (goal.includes("muscle") || goal.includes("build")) {
      return [
        "Increased muscle mass",
        "Enhanced strength and power",
        "Improved body composition",
        "Better metabolic health",
        "Increased bone density",
      ];
    }

    if (goal.includes("fitness") || goal.includes("endurance")) {
      return [
        "Improved cardiovascular health",
        "Enhanced endurance and stamina",
        "Better overall fitness",
        "Increased energy levels",
        "Improved athletic performance",
      ];
    }

    if (goal.includes("stress") || goal.includes("mental")) {
      return [
        "Reduced stress levels",
        "Improved mental clarity",
        "Better sleep quality",
        "Enhanced emotional well-being",
        "Improved focus and concentration",
      ];
    }

    if (goal.includes("sleep")) {
      return [
        "Improved sleep quality",
        "Better sleep duration",
        "Enhanced energy levels",
        "Improved mood and mental health",
        "Better recovery and healing",
      ];
    }

    return [
      "Better energy and focus",
      "Improved fitness and mobility",
      "Consistent meal timing and nutrition",
      "Healthier sleep routine",
      "Enhanced overall well-being",
    ];
  }

  /**
   * Generate week-by-week progression
   */
  private static generateWeeklyProgression(
    goal: string,
    duration: number
  ): WeeklyProgression[] {
    const progressions: WeeklyProgression[] = [];

    for (let week = 1; week <= Math.min(duration, 8); week++) {
      const intensity = this.getWeekIntensity(week);
      const focus = this.getWeekFocus(goal, week);

      progressions.push({
        week,
        focus,
        intensity,
        keyActivities: this.getWeekActivities(goal, week),
        milestones: this.getWeekMilestones(goal, week),
        expectedOutcomes: this.getWeekOutcomes(goal, week),
      });
    }

    return progressions;
  }

  /**
   * Get week intensity based on progression
   */
  private static getWeekIntensity(week: number): "low" | "moderate" | "high" {
    if (week <= 2) return "low";
    if (week <= 4) return "moderate";
    return "high";
  }

  /**
   * Get week focus based on goal and week number
   */
  private static getWeekFocus(goal: string, week: number): string {
    if (goal.includes("weight") && goal.includes("gain")) {
      if (week <= 2) return "Foundation building and habit formation";
      if (week <= 4) return "Progressive overload and nutrition optimization";
      if (week <= 6) return "Intensity increase and advanced techniques";
      return "Peak performance and muscle building";
    }

    if (goal.includes("weight") && goal.includes("loss")) {
      if (week <= 2) return "Calorie deficit establishment and cardio base";
      if (week <= 4) return "Progressive cardio and strength training";
      if (week <= 6) return "High-intensity training and nutrition refinement";
      return "Peak fat loss and body recomposition";
    }

    if (goal.includes("muscle") || goal.includes("build")) {
      if (week <= 2) return "Basic strength training and form mastery";
      if (week <= 4) return "Progressive overload and volume increase";
      if (week <= 6) return "Advanced training techniques and nutrition timing";
      return "Peak strength and muscle mass development";
    }

    if (goal.includes("fitness") || goal.includes("endurance")) {
      if (week <= 2) return "Cardiovascular base building";
      if (week <= 4) return "Endurance progression and interval training";
      if (week <= 6)
        return "High-intensity training and performance optimization";
      return "Peak fitness and athletic performance";
    }

    if (goal.includes("stress") || goal.includes("mental")) {
      if (week <= 2) return "Mindfulness foundation and stress awareness";
      if (week <= 4) return "Advanced meditation and breathing techniques";
      if (week <= 6) return "Stress management and emotional regulation";
      return "Mental resilience and well-being mastery";
    }

    return `Week ${week} focus area`;
  }

  /**
   * Get week-specific activities
   */
  private static getWeekActivities(goal: string, week: number): string[] {
    if (goal.includes("weight") && goal.includes("gain")) {
      if (week <= 2)
        return [
          "Basic strength training",
          "Meal planning",
          "Sleep optimization",
        ];
      if (week <= 4)
        return [
          "Progressive overload",
          "Nutrition timing",
          "Recovery protocols",
        ];
      if (week <= 6)
        return [
          "Advanced training",
          "Macro cycling",
          "Supplement optimization",
        ];
      return [
        "Peak training",
        "Performance nutrition",
        "Competition preparation",
      ];
    }

    if (goal.includes("weight") && goal.includes("loss")) {
      if (week <= 2)
        return ["Cardio base", "Calorie tracking", "Portion control"];
      if (week <= 4) return ["HIIT training", "Macro balancing", "Meal prep"];
      if (week <= 6)
        return [
          "Advanced cardio",
          "Intermittent fasting",
          "Metabolic training",
        ];
      return ["Peak fat loss", "Body recomposition", "Maintenance preparation"];
    }

    if (goal.includes("muscle") || goal.includes("build")) {
      if (week <= 2)
        return ["Form mastery", "Basic exercises", "Recovery focus"];
      if (week <= 4)
        return ["Progressive overload", "Volume increase", "Nutrition timing"];
      if (week <= 6)
        return ["Advanced techniques", "Periodization", "Supplementation"];
      return ["Peak training", "Competition prep", "Performance optimization"];
    }

    if (goal.includes("fitness") || goal.includes("endurance")) {
      if (week <= 2) return ["Cardio base", "Movement patterns", "Recovery"];
      if (week <= 4)
        return ["Interval training", "Strength endurance", "Flexibility"];
      if (week <= 6)
        return [
          "High-intensity training",
          "Sport-specific drills",
          "Performance testing",
        ];
      return [
        "Peak performance",
        "Competition simulation",
        "Recovery optimization",
      ];
    }

    if (goal.includes("stress") || goal.includes("mental")) {
      if (week <= 2)
        return [
          "Mindfulness basics",
          "Breathing exercises",
          "Stress awareness",
        ];
      if (week <= 4)
        return [
          "Advanced meditation",
          "Cognitive techniques",
          "Emotional regulation",
        ];
      if (week <= 6)
        return [
          "Stress management",
          "Resilience building",
          "Performance psychology",
        ];
      return ["Mental mastery", "Peak performance", "Well-being optimization"];
    }

    return [
      "General health activities",
      "Wellness practices",
      "Lifestyle optimization",
    ];
  }

  /**
   * Get week-specific milestones
   */
  private static getWeekMilestones(goal: string, week: number): string[] {
    if (goal.includes("weight") && goal.includes("gain")) {
      if (week <= 2)
        return [
          "Establish workout routine",
          "Track daily calories",
          "Improve sleep quality",
        ];
      if (week <= 4)
        return [
          "Increase training intensity",
          "Optimize protein intake",
          "Measure progress",
        ];
      if (week <= 6)
        return [
          "Advanced training techniques",
          "Fine-tune nutrition",
          "Track body composition",
        ];
      return [
        "Peak performance",
        "Achieve strength goals",
        "Maintain consistency",
      ];
    }

    if (goal.includes("weight") && goal.includes("loss")) {
      if (week <= 2)
        return [
          "Create calorie deficit",
          "Establish cardio routine",
          "Track food intake",
        ];
      if (week <= 4)
        return [
          "Increase training intensity",
          "Optimize meal timing",
          "Measure weight loss",
        ];
      if (week <= 6)
        return [
          "Advanced fat loss techniques",
          "Body composition tracking",
          "Performance metrics",
        ];
      return [
        "Achieve weight goals",
        "Maintain results",
        "Long-term sustainability",
      ];
    }

    return [`Week ${week} milestone`, `Progress tracking`, `Goal advancement`];
  }

  /**
   * Get week-specific expected outcomes
   */
  private static getWeekOutcomes(goal: string, week: number): string[] {
    if (goal.includes("weight") && goal.includes("gain")) {
      if (week <= 2)
        return ["Improved appetite", "Better sleep", "Increased energy"];
      if (week <= 4)
        return ["Strength gains", "Muscle definition", "Better recovery"];
      if (week <= 6)
        return [
          "Significant muscle growth",
          "Enhanced performance",
          "Improved body composition",
        ];
      return ["Peak muscle mass", "Optimal strength", "Maintained gains"];
    }

    if (goal.includes("weight") && goal.includes("loss")) {
      if (week <= 2)
        return ["Initial weight loss", "Improved energy", "Better habits"];
      if (week <= 4)
        return [
          "Visible fat loss",
          "Increased fitness",
          "Better body composition",
        ];
      if (week <= 6)
        return [
          "Significant weight loss",
          "Enhanced performance",
          "Improved health markers",
        ];
      return [
        "Achieved weight goals",
        "Maintained results",
        "Long-term health",
      ];
    }

    return [
      `Week ${week} outcomes`,
      `Progress indicators`,
      `Health improvements`,
    ];
  }

  /**
   * Get goal-specific tips
   */
  private static getGoalSpecificTips(goal: string): string[] {
    if (goal.includes("weight") && goal.includes("gain")) {
      return [
        "Focus on progressive overload in your workouts",
        "Eat in a calorie surplus with quality nutrition",
        "Prioritize protein intake (1.6-2.2g per kg body weight)",
        "Get adequate sleep for muscle recovery (7-9 hours)",
        "Track your progress with measurements and photos",
        "Be patient - muscle building takes time",
      ];
    }

    if (goal.includes("weight") && goal.includes("loss")) {
      return [
        "Create a sustainable calorie deficit (500-750 calories)",
        "Focus on whole, nutrient-dense foods",
        "Include both cardio and strength training",
        "Track your food intake accurately",
        "Stay consistent with your routine",
        "Be patient - healthy weight loss is gradual",
      ];
    }

    if (goal.includes("muscle") || goal.includes("build")) {
      return [
        "Focus on compound exercises for maximum muscle activation",
        "Progressive overload is key to muscle growth",
        "Prioritize protein timing around workouts",
        "Allow adequate rest between training sessions",
        "Track your workouts and progress",
        "Be consistent with your training schedule",
      ];
    }

    if (goal.includes("fitness") || goal.includes("endurance")) {
      return [
        "Start with a solid cardio base",
        "Include both steady-state and interval training",
        "Don't neglect strength training",
        "Focus on proper form and technique",
        "Gradually increase intensity and duration",
        "Listen to your body and rest when needed",
      ];
    }

    if (goal.includes("stress") || goal.includes("mental")) {
      return [
        "Practice mindfulness daily, even for just 5 minutes",
        "Focus on deep breathing exercises",
        "Create a consistent meditation routine",
        "Identify and address stress triggers",
        "Prioritize sleep and recovery",
        "Consider professional help if needed",
      ];
    }

    return [
      "Stay consistent with your routine",
      "Track your progress regularly",
      "Listen to your body and adjust as needed",
      "Focus on sustainable habits",
      "Celebrate small wins along the way",
      "Be patient with the process",
    ];
  }

  /**
   * Get safety considerations based on goal
   */
  private static getSafetyConsiderations(goal: string): string[] {
    if (goal.includes("weight") && goal.includes("gain")) {
      return [
        "Focus on lean muscle gain, not just weight",
        "Avoid excessive calorie surplus to prevent fat gain",
        "Include progressive strength training",
        "Monitor body composition, not just weight",
        "Ensure adequate protein intake",
        "Consult a healthcare provider if you have health conditions",
      ];
    }

    if (goal.includes("weight") && goal.includes("loss")) {
      return [
        "Aim for 1-2 pounds of weight loss per week",
        "Don't restrict calories too severely",
        "Include strength training to preserve muscle",
        "Stay hydrated and get adequate nutrition",
        "Monitor your energy levels and mood",
        "Consult a healthcare provider for significant weight loss",
      ];
    }

    if (goal.includes("muscle") || goal.includes("build")) {
      return [
        "Focus on proper form to prevent injury",
        "Allow adequate rest between training sessions",
        "Don't overtrain - quality over quantity",
        "Include proper warm-up and cool-down",
        "Listen to your body and rest when needed",
        "Consider working with a trainer for proper technique",
      ];
    }

    if (goal.includes("fitness") || goal.includes("endurance")) {
      return [
        "Start gradually and build up intensity",
        "Include proper warm-up and cool-down",
        "Stay hydrated during workouts",
        "Listen to your body and rest when needed",
        "Focus on proper form and technique",
        "Consider your current fitness level",
      ];
    }

    if (goal.includes("stress") || goal.includes("mental")) {
      return [
        "Start with short meditation sessions",
        "Don't force yourself if you're not ready",
        "Consider professional help for severe stress",
        "Focus on sustainable practices",
        "Be patient with the process",
        "Create a supportive environment",
      ];
    }

    return [
      "Start gradually and build up intensity",
      "Listen to your body and rest when needed",
      "Stay hydrated and get adequate nutrition",
      "Focus on proper form and technique",
      "Consult a healthcare provider if you have concerns",
      "Be patient and consistent with your approach",
    ];
  }

  /**
   * Get success metrics based on goal
   */
  private static getSuccessMetrics(goal: string): string[] {
    if (goal.includes("weight") && goal.includes("gain")) {
      return [
        "Weight gain of 0.25-0.5 pounds per week",
        "Increased strength in key exercises",
        "Improved body composition (muscle vs fat)",
        "Better recovery and energy levels",
        "Consistent workout attendance",
        "Improved sleep quality",
      ];
    }

    if (goal.includes("weight") && goal.includes("loss")) {
      return [
        "Weight loss of 1-2 pounds per week",
        "Improved body composition",
        "Increased energy levels",
        "Better fitness performance",
        "Consistent healthy eating habits",
        "Improved sleep quality",
      ];
    }

    if (goal.includes("muscle") || goal.includes("build")) {
      return [
        "Increased muscle mass and definition",
        "Progressive strength gains",
        "Improved body composition",
        "Better workout performance",
        "Consistent training attendance",
        "Improved recovery between sessions",
      ];
    }

    if (goal.includes("fitness") || goal.includes("endurance")) {
      return [
        "Improved cardiovascular fitness",
        "Increased endurance and stamina",
        "Better workout performance",
        "Improved recovery time",
        "Consistent training attendance",
        "Enhanced overall energy levels",
      ];
    }

    if (goal.includes("stress") || goal.includes("mental")) {
      return [
        "Reduced stress levels",
        "Improved mood and mental clarity",
        "Better sleep quality",
        "Enhanced emotional regulation",
        "Consistent mindfulness practice",
        "Improved overall well-being",
      ];
    }

    return [
      "Consistent habit formation",
      "Improved health markers",
      "Better energy levels",
      "Enhanced overall well-being",
      "Achieved personal goals",
      "Sustainable lifestyle changes",
    ];
  }
}
