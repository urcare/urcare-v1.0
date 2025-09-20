import { supabase } from "@/integrations/supabase/client";
import {
  Activity,
  ComprehensiveHealthPlan,
  DailyPlanExecution,
  MealPlan,
  PLAN_TYPE_DEFINITIONS,
  PlanData,
  WeeklyProgressTracking,
  WorkoutPlan,
} from "@/types/comprehensiveHealthPlan";

// Plan Duration Calculator
export class PlanDurationCalculator {
  static calculateDuration(
    goal: string,
    userProfile: any
  ): {
    duration_weeks: number;
    plan_type: ComprehensiveHealthPlan["plan_type"];
    timeline_preference: "gradual" | "moderate" | "aggressive";
    expected_outcomes: string[];
    key_milestones: string[];
  } {
    const goalLower = goal.toLowerCase();

    // Disease management and reversal (3-12 months)
    if (
      goalLower.includes("diabetes") ||
      goalLower.includes("hypertension") ||
      goalLower.includes("pcos") ||
      goalLower.includes("revers")
    ) {
      return {
        duration_weeks: this.calculateDiseaseManagementDuration(
          goal,
          userProfile
        ),
        plan_type: "disease_management",
        timeline_preference: "moderate",
        expected_outcomes: [
          "Improved biomarkers",
          "Reduced symptoms",
          "Better medication management",
          "Enhanced quality of life",
          "Reduced disease progression",
        ],
        key_milestones: [
          "2 weeks: Initial symptom improvement",
          "1 month: First biomarker assessment",
          "3 months: Significant improvement",
          "6 months: Lifestyle integration",
          "12 months: Long-term sustainability",
        ],
      };
    }

    // Weight loss (1-6 months)
    if (goalLower.includes("weight") || goalLower.includes("lose")) {
      const targetWeight = this.extractWeight(goal);
      const duration = this.calculateWeightLossDuration(
        targetWeight,
        userProfile
      );
      return {
        duration_weeks: duration,
        plan_type: "health_transformation",
        timeline_preference: targetWeight > 20 ? "gradual" : "moderate",
        expected_outcomes: [
          "Sustainable weight loss",
          "Improved body composition",
          "Better energy levels",
          "Enhanced self-confidence",
          "Reduced health risks",
        ],
        key_milestones: [
          "2 weeks: Initial water weight loss",
          "1 month: 5-10% progress toward goal",
          "3 months: 50% progress toward goal",
          "6 months: Goal achievement or maintenance phase",
        ],
      };
    }

    // Muscle building (2-6 months)
    if (
      goalLower.includes("muscle") ||
      goalLower.includes("build") ||
      goalLower.includes("strength")
    ) {
      return {
        duration_weeks: 16, // 4 months
        plan_type: "health_transformation",
        timeline_preference: "moderate",
        expected_outcomes: [
          "Increased muscle mass",
          "Enhanced strength",
          "Improved body composition",
          "Better metabolic health",
          "Increased bone density",
        ],
        key_milestones: [
          "2 weeks: Strength adaptation begins",
          "1 month: Visible muscle tone improvement",
          "2 months: Measurable strength gains",
          "4 months: Significant muscle mass increase",
        ],
      };
    }

    // Fitness improvement (1-3 months)
    if (
      goalLower.includes("fitness") ||
      goalLower.includes("endurance") ||
      goalLower.includes("cardio")
    ) {
      return {
        duration_weeks: 8, // 2 months
        plan_type: "habit_formation",
        timeline_preference: "moderate",
        expected_outcomes: [
          "Improved cardiovascular health",
          "Enhanced endurance",
          "Better recovery",
          "Increased daily energy",
          "Established exercise routine",
        ],
        key_milestones: [
          "1 week: Routine establishment",
          "2 weeks: Initial fitness improvements",
          "1 month: Measurable endurance gains",
          "2 months: Fitness goals achieved",
        ],
      };
    }

    // Sleep improvement (2-8 weeks)
    if (goalLower.includes("sleep")) {
      return {
        duration_weeks: 6, // 6 weeks
        plan_type: "habit_formation",
        timeline_preference: "moderate",
        expected_outcomes: [
          "Consistent sleep schedule",
          "Improved sleep quality",
          "Better daytime energy",
          "Enhanced cognitive function",
          "Reduced sleep-related issues",
        ],
        key_milestones: [
          "1 week: Sleep hygiene establishment",
          "2 weeks: Schedule consistency",
          "4 weeks: Quality improvements",
          "6 weeks: Long-term habit formation",
        ],
      };
    }

    // Stress management (2-6 weeks)
    if (goalLower.includes("stress") || goalLower.includes("anxiety")) {
      return {
        duration_weeks: 4, // 4 weeks
        plan_type: "habit_formation",
        timeline_preference: "moderate",
        expected_outcomes: [
          "Reduced stress levels",
          "Better coping mechanisms",
          "Improved emotional regulation",
          "Enhanced mental clarity",
          "Better work-life balance",
        ],
        key_milestones: [
          "1 week: Stress awareness improvement",
          "2 weeks: Coping strategies implementation",
          "3 weeks: Measurable stress reduction",
          "4 weeks: Sustainable practices",
        ],
      };
    }

    // Quick wins (1-3 days)
    if (
      goalLower.includes("hydration") ||
      goalLower.includes("quick") ||
      goalLower.includes("reset")
    ) {
      return {
        duration_weeks: 1, // 1 week
        plan_type: "quick_win",
        timeline_preference: "aggressive",
        expected_outcomes: [
          "Immediate improvement",
          "Motivation boost",
          "Habit initiation",
          "Quick results",
          "Foundation for larger changes",
        ],
        key_milestones: [
          "1 day: Implementation begins",
          "3 days: Initial benefits noticed",
          "1 week: Habit established",
        ],
      };
    }

    // Default for general wellness
    return {
      duration_weeks: 8, // 2 months
      plan_type: "habit_formation",
      timeline_preference: "moderate",
      expected_outcomes: [
        "Overall health improvement",
        "Better lifestyle habits",
        "Increased energy",
        "Enhanced well-being",
        "Foundation for long-term health",
      ],
      key_milestones: [
        "2 weeks: Initial habit formation",
        "1 month: Routine establishment",
        "6 weeks: Measurable improvements",
        "2 months: Sustainable practices",
      ],
    };
  }

  private static extractWeight(goal: string): number {
    const match = goal.match(/(\d+)\s*(kg|pounds?|lbs?)/i);
    return match ? parseInt(match[1]) : 10; // default 10kg if not specified
  }

  private static calculateWeightLossDuration(
    targetWeight: number,
    userProfile: any
  ): number {
    // Safe weight loss: 0.5-1kg per week
    // More conservative for larger amounts
    if (targetWeight <= 5) return 8; // 2 months
    if (targetWeight <= 10) return 12; // 3 months
    if (targetWeight <= 20) return 20; // 5 months
    return 24; // 6 months for significant weight loss
  }

  private static calculateDiseaseManagementDuration(
    goal: string,
    userProfile: any
  ): number {
    const goalLower = goal.toLowerCase();

    if (goalLower.includes("revers")) {
      return 52; // 1 year for reversal goals
    }
    if (goalLower.includes("diabetes") || goalLower.includes("pcos")) {
      return 24; // 6 months for diabetes/PCOS management
    }
    if (
      goalLower.includes("hypertension") ||
      goalLower.includes("blood pressure")
    ) {
      return 16; // 4 months for blood pressure management
    }

    return 24; // Default 6 months for disease management
  }
}

export class ComprehensiveHealthPlanService {
  /**
   * Generate a comprehensive health plan with realistic duration
   */
  async generateComprehensivePlan(
    userGoal: string,
    userProfile: any
  ): Promise<ComprehensiveHealthPlan> {
    try {
      // Calculate appropriate duration and plan type
      const planCalculation = PlanDurationCalculator.calculateDuration(
        userGoal,
        userProfile
      );

      // Get user ID
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error("User not authenticated");

      // Generate plan data using AI
      const planData = await this.generatePlanDataWithAI(
        userGoal,
        userProfile,
        planCalculation
      );

      // Create comprehensive plan
      const startDate = new Date();
      const targetEndDate = new Date();
      targetEndDate.setDate(
        startDate.getDate() + planCalculation.duration_weeks * 7
      );

      const comprehensivePlan: Omit<
        ComprehensiveHealthPlan,
        "id" | "created_at" | "updated_at" | "generated_at" | "last_updated_at"
      > = {
        user_id: user.id,
        plan_name: this.generatePlanName(userGoal, planCalculation.plan_type),
        plan_type: planCalculation.plan_type,
        primary_goal: userGoal,
        secondary_goals: this.generateSecondaryGoals(userGoal, userProfile),
        start_date: startDate.toISOString().split("T")[0],
        target_end_date: targetEndDate.toISOString().split("T")[0],
        duration_weeks: planCalculation.duration_weeks,
        plan_data: planData,
        weekly_milestones: this.generateWeeklyMilestones(planCalculation),
        monthly_assessments:
          this.generateMonthlyAssessmentTemplates(planCalculation),
        overall_progress_percentage: 0,
        weekly_compliance_rate: 0,
        monthly_compliance_rate: 0,
        status: "active",
        timeline_adjustments: [],
        intensity_adjustments: [],
      };

      // Save to database
      const { data: savedPlan, error } = await supabase
        .from("comprehensive_health_plans")
        .insert(comprehensivePlan)
        .select()
        .single();

      if (error) throw error;

      // Initialize daily plan executions for the first week
      await this.initializeDailyPlanExecutions(savedPlan);

      return savedPlan;
    } catch (error) {
      console.error("Error generating comprehensive health plan:", error);
      throw error;
    }
  }

  /**
   * Generate plan data using AI with proper structure
   */
  private async generatePlanDataWithAI(
    userGoal: string,
    userProfile: any,
    planCalculation: any
  ): Promise<PlanData> {
    try {
      // Call the new comprehensive health plan AI function
      const { data, error } = await supabase.functions.invoke(
        "generate-comprehensive-health-plan",
        {
          body: {
            user_goal: userGoal,
            user_profile: userProfile,
            plan_calculation: planCalculation,
          },
        }
      );

      if (error) {
        console.error("Error calling AI function:", error);
        throw error;
      }

      if (data.success && data.plan) {
        return data.plan.plan_data;
      } else {
        throw new Error(data.error || "Failed to generate plan");
      }
    } catch (error) {
      console.error("Error generating plan with AI:", error);
      // Fallback to template generation
      return this.generateFallbackPlanData(
        userGoal,
        userProfile,
        planCalculation
      );
    }
  }

  /**
   * Generate fallback plan data when AI is unavailable
   */
  private generateFallbackPlanData(
    userGoal: string,
    userProfile: any,
    planCalculation: any
  ): PlanData {
    const planTypeInfo = PLAN_TYPE_DEFINITIONS[planCalculation.plan_type];

    return {
      overview: {
        description: `A comprehensive ${
          planCalculation.duration_weeks
        }-week ${planTypeInfo.name.toLowerCase()} plan focused on ${userGoal}`,
        expected_outcomes: planCalculation.expected_outcomes,
        key_principles: [
          "Gradual progression",
          "Sustainable practices",
          "Evidence-based approaches",
          "Personalized adaptation",
          "Safety first",
        ],
        success_metrics: [
          "Weekly compliance rate > 70%",
          "Progressive milestone achievement",
          "Sustained behavior change",
          "Measurable health improvements",
          "User satisfaction and engagement",
        ],
        safety_considerations: [
          "Monitor for adverse reactions",
          "Adjust intensity based on feedback",
          "Regular progress assessments",
          "Professional consultation when needed",
          "Emergency protocols in place",
        ],
      },
      weekly_structure: this.generateWeeklyStructure(planCalculation),
      daily_templates: this.generateDailyTemplates(userGoal, userProfile),
      adaptation_rules: {
        compliance_thresholds: {
          excellent: 90,
          good: 70,
          needs_improvement: 50,
          poor: 30,
        },
        adjustment_triggers: {
          timeline_extension: [
            "Compliance rate < 50% for 2 consecutive weeks",
            "User reports excessive difficulty",
            "Health concerns arise",
            "Life circumstances change",
          ],
          intensity_increase: [
            "Compliance rate > 90% for 2 consecutive weeks",
            "User reports exercises too easy",
            "Faster than expected progress",
            "User requests more challenge",
          ],
          intensity_decrease: [
            "User reports excessive fatigue",
            "Compliance rate declining",
            "Health issues arise",
            "User feedback indicates difficulty",
          ],
          plan_modification: [
            "Goal changes",
            "Lifestyle changes",
            "Health status changes",
            "User preferences change",
          ],
        },
      },
      progression_rules: {
        weekly_progression: {
          intensity_increase_percentage: 5,
          volume_increase_percentage: 10,
          complexity_increase: true,
        },
        plateau_handling: {
          detection_criteria: [
            "No progress for 2 consecutive weeks",
            "Declining motivation",
            "Stagnant measurements",
          ],
          adjustment_strategies: [
            "Increase variety",
            "Adjust intensity",
            "Add new challenges",
            "Review and modify goals",
          ],
        },
      },
    };
  }

  private generatePlanName(
    userGoal: string,
    planType: ComprehensiveHealthPlan["plan_type"]
  ): string {
    const typeNames = {
      quick_win: "Quick Win",
      habit_formation: "Habit Builder",
      health_transformation: "Health Transformation",
      disease_management: "Health Management",
      lifestyle_change: "Lifestyle Overhaul",
    };

    return `${typeNames[planType]}: ${userGoal}`;
  }

  private generateSecondaryGoals(
    primaryGoal: string,
    userProfile: any
  ): string[] {
    // Generate complementary goals based on primary goal
    const goalLower = primaryGoal.toLowerCase();

    if (goalLower.includes("weight")) {
      return [
        "Improve nutrition",
        "Increase physical activity",
        "Better sleep",
        "Stress management",
      ];
    }
    if (goalLower.includes("fitness")) {
      return [
        "Build strength",
        "Improve flexibility",
        "Better recovery",
        "Nutrition optimization",
      ];
    }
    if (goalLower.includes("diabetes") || goalLower.includes("disease")) {
      return [
        "Blood sugar control",
        "Weight management",
        "Medication adherence",
        "Lifestyle modification",
      ];
    }

    return [
      "Overall wellness",
      "Energy improvement",
      "Better habits",
      "Health maintenance",
    ];
  }

  private generateWeeklyStructure(
    planCalculation: any
  ): PlanData["weekly_structure"] {
    const structure: PlanData["weekly_structure"] = {};

    for (let week = 1; week <= planCalculation.duration_weeks; week++) {
      const phase = this.getPhase(week, planCalculation.duration_weeks);
      structure[week.toString()] = {
        focus_areas: this.getFocusAreas(week, phase, planCalculation.plan_type),
        intensity_level: this.getIntensityLevel(
          week,
          planCalculation.duration_weeks
        ),
        key_activities: this.getKeyActivities(week, phase),
        milestones: this.getWeeklyMilestones(week, phase),
        weekly_goals: this.getWeeklyGoals(
          week,
          phase,
          planCalculation.plan_type
        ),
      };
    }

    return structure;
  }

  private getPhase(
    week: number,
    totalWeeks: number
  ): "introduction" | "building" | "optimization" | "maintenance" {
    const percentage = week / totalWeeks;
    if (percentage <= 0.25) return "introduction";
    if (percentage <= 0.75) return "building";
    if (percentage <= 0.9) return "optimization";
    return "maintenance";
  }

  private getFocusAreas(
    week: number,
    phase: string,
    planType: ComprehensiveHealthPlan["plan_type"]
  ): string[] {
    const baseFocus = {
      introduction: ["Habit establishment", "Baseline assessment", "Education"],
      building: ["Progressive improvement", "Skill development", "Consistency"],
      optimization: [
        "Performance enhancement",
        "Fine-tuning",
        "Advanced techniques",
      ],
      maintenance: [
        "Sustainability",
        "Long-term planning",
        "Lifestyle integration",
      ],
    };

    return baseFocus[phase as keyof typeof baseFocus] || ["General wellness"];
  }

  private getIntensityLevel(
    week: number,
    totalWeeks: number
  ): "low" | "moderate" | "high" {
    if (week <= 2) return "low";
    if (week >= totalWeeks - 2) return "moderate";
    return "moderate"; // Most weeks are moderate intensity
  }

  private getKeyActivities(week: number, phase: string): string[] {
    const activities = {
      introduction: ["Assessment", "Goal setting", "Basic routines"],
      building: [
        "Progressive exercises",
        "Skill practice",
        "Habit reinforcement",
      ],
      optimization: [
        "Advanced techniques",
        "Performance testing",
        "Refinement",
      ],
      maintenance: ["Routine maintenance", "Long-term planning", "Adaptation"],
    };

    return (
      activities[phase as keyof typeof activities] || ["General activities"]
    );
  }

  private getWeeklyMilestones(week: number, phase: string): string[] {
    return [`Week ${week} milestone`, `${phase} phase progress`];
  }

  private getWeeklyGoals(
    week: number,
    phase: string,
    planType: ComprehensiveHealthPlan["plan_type"]
  ): string[] {
    return [
      `Complete all daily activities`,
      `Maintain ${phase} phase standards`,
      `Progress toward overall goal`,
    ];
  }

  private generateDailyTemplates(
    userGoal: string,
    userProfile: any
  ): PlanData["daily_templates"] {
    // Generate daily templates based on goal and profile
    // This is a simplified version - would be more sophisticated in practice

    return {
      weekday: {
        morning_routine: this.generateMorningRoutine(),
        meals: this.generateMealPlans("weekday"),
        workouts: this.generateWorkoutPlans("weekday", userGoal),
        evening_routine: this.generateEveningRoutine(),
        wellness_activities: this.generateWellnessActivities(),
        hydration_goals: [
          {
            daily_target: 2500,
            timing_recommendations: ["Morning", "Pre-meals", "Post-workout"],
            quality_guidelines: ["Filtered water", "Room temperature"],
            tracking_method: "Water bottle tracking",
          },
        ],
        sleep_targets: {
          target_duration: 8,
          bedtime_range: "10:00 PM - 11:00 PM",
          wake_time_range: "6:00 AM - 7:00 AM",
          sleep_hygiene_practices: [
            "No screens 1h before bed",
            "Cool room",
            "Dark environment",
          ],
          environment_recommendations: [
            "Comfortable mattress",
            "Blackout curtains",
            "White noise",
          ],
        },
      },
      weekend: {
        morning_routine: this.generateMorningRoutine(),
        meals: this.generateMealPlans("weekend"),
        workouts: this.generateWorkoutPlans("weekend", userGoal),
        evening_routine: this.generateEveningRoutine(),
        wellness_activities: this.generateWellnessActivities(),
        hydration_goals: [
          {
            daily_target: 2500,
            timing_recommendations: [
              "Morning",
              "Pre-meals",
              "During activities",
            ],
            quality_guidelines: [
              "Filtered water",
              "Add electrolytes if active",
            ],
            tracking_method: "Water bottle tracking",
          },
        ],
        sleep_targets: {
          target_duration: 8,
          bedtime_range: "10:30 PM - 11:30 PM",
          wake_time_range: "7:00 AM - 8:00 AM",
          sleep_hygiene_practices: [
            "Consistent schedule",
            "Relaxation time",
            "No late meals",
          ],
          environment_recommendations: [
            "Comfortable temperature",
            "Good ventilation",
            "Minimal noise",
          ],
        },
      },
    };
  }

  private generateMorningRoutine(): Activity[] {
    return [
      {
        id: "morning-hydration",
        title: "Morning Hydration",
        description: "Drink 500ml of water upon waking",
        duration: 5,
        type: "hydration",
        category: "wellness",
        instructions: [
          "Keep water by bedside",
          "Drink immediately upon waking",
          "Add lemon if desired",
        ],
        tips: [
          "Helps kickstart metabolism",
          "Rehydrates after sleep",
          "Improves alertness",
        ],
        difficulty_level: "easy",
        impact_on_goals: { hydration: 1, energy: 0.5, wellness: 0.3 },
        time_of_day: "morning",
        frequency: "daily",
        is_required: true,
        completion_criteria: ["500ml water consumed"],
      },
      {
        id: "morning-movement",
        title: "Morning Movement",
        description: "10-minute gentle stretching or light movement",
        duration: 10,
        type: "exercise",
        category: "movement",
        instructions: [
          "Light stretching",
          "Joint mobility",
          "Gentle activation",
        ],
        tips: ["Improves circulation", "Reduces stiffness", "Energizes body"],
        difficulty_level: "easy",
        impact_on_goals: { fitness: 0.3, energy: 0.5, wellness: 0.4 },
        time_of_day: "morning",
        frequency: "daily",
        is_required: false,
        completion_criteria: ["10 minutes of movement completed"],
      },
    ];
  }

  private generateEveningRoutine(): Activity[] {
    return [
      {
        id: "evening-reflection",
        title: "Daily Reflection",
        description: "5-minute reflection on the day",
        duration: 5,
        type: "wellness",
        category: "mental_health",
        instructions: [
          "Review daily achievements",
          "Note challenges",
          "Set tomorrow intentions",
        ],
        tips: [
          "Improves self-awareness",
          "Tracks progress",
          "Prepares for tomorrow",
        ],
        difficulty_level: "easy",
        impact_on_goals: { wellness: 0.5, mental_health: 0.7 },
        time_of_day: "evening",
        frequency: "daily",
        is_required: false,
        completion_criteria: ["5 minutes of reflection completed"],
      },
    ];
  }

  private generateMealPlans(dayType: string): MealPlan[] {
    // Simplified meal plan generation
    return [
      {
        id: `${dayType}-breakfast`,
        meal_type: "breakfast",
        name: "Healthy Breakfast",
        description: "Balanced morning meal",
        ingredients: [
          { name: "Oats", quantity: 50, unit: "g" },
          { name: "Banana", quantity: 1, unit: "medium" },
          { name: "Almonds", quantity: 10, unit: "pieces" },
        ],
        instructions: ["Prepare oats", "Add banana", "Top with almonds"],
        prep_time: 10,
        cook_time: 5,
        servings: 1,
        nutrition: {
          calories: 350,
          protein: 12,
          carbohydrates: 55,
          fat: 10,
          fiber: 8,
          sugar: 15,
          sodium: 100,
        },
        dietary_tags: ["vegetarian", "gluten-free-option"],
        difficulty: "easy",
        alternatives: [],
        cultural_adaptations: [],
      },
    ];
  }

  private generateWorkoutPlans(
    dayType: string,
    userGoal: string
  ): WorkoutPlan[] {
    return [
      {
        id: `${dayType}-workout`,
        name: `${dayType} Workout`,
        type: "strength",
        duration: 30,
        exercises: [],
        warm_up: [],
        cool_down: [],
        equipment_needed: ["bodyweight"],
        space_required: "minimal",
        intensity: "moderate",
        difficulty: "beginner",
        calories_burned_estimate: 200,
        muscle_groups_targeted: ["full_body"],
        adaptations: [],
      },
    ];
  }

  private generateWellnessActivities(): Activity[] {
    return [
      {
        id: "mindfulness",
        title: "Mindfulness Practice",
        description: "10-minute mindfulness or meditation",
        duration: 10,
        type: "wellness",
        category: "mental_health",
        instructions: [
          "Find quiet space",
          "Focus on breathing",
          "Observe thoughts without judgment",
        ],
        tips: ["Reduces stress", "Improves focus", "Enhances well-being"],
        difficulty_level: "easy",
        impact_on_goals: { stress: -0.5, wellness: 0.6, mental_health: 0.8 },
        time_of_day: "anytime",
        frequency: "daily",
        is_required: false,
        completion_criteria: ["10 minutes of practice completed"],
      },
    ];
  }

  private generateWeeklyMilestones(planCalculation: any): any[] {
    const milestones = [];

    for (let week = 1; week <= planCalculation.duration_weeks; week++) {
      milestones.push({
        week_number: week,
        title: `Week ${week} Milestone`,
        description: `Key achievements for week ${week}`,
        success_criteria: [
          "Complete 70% of activities",
          "Maintain consistency",
        ],
        measurement_method: "Compliance tracking",
        importance: week % 4 === 0 ? "high" : "medium",
        category: "behavioral",
      });
    }

    return milestones;
  }

  private generateMonthlyAssessmentTemplates(planCalculation: any): any[] {
    const assessments = [];
    const monthsNeeded = Math.ceil(planCalculation.duration_weeks / 4);

    for (let month = 1; month <= monthsNeeded; month++) {
      assessments.push({
        month_number: month,
        title: `Month ${month} Assessment`,
        description: `Comprehensive review of progress`,
        assessment_areas: [
          {
            name: "Goal Progress",
            description: "Progress toward primary goal",
            metrics: ["percentage_complete"],
            weight: 0.4,
          },
          {
            name: "Compliance",
            description: "Activity completion rate",
            metrics: ["compliance_rate"],
            weight: 0.3,
          },
          {
            name: "Health Metrics",
            description: "Physical health improvements",
            metrics: ["measurements"],
            weight: 0.3,
          },
        ],
        required_measurements: ["weight", "energy_level", "satisfaction"],
        optional_measurements: ["body_measurements", "fitness_tests"],
        questionnaire: [
          {
            id: "satisfaction",
            question: "How satisfied are you with your progress?",
            type: "scale",
            scale_range: {
              min: 1,
              max: 10,
              labels: ["Very Unsatisfied", "Very Satisfied"],
            },
            required: true,
          },
          {
            id: "difficulty",
            question: "How would you rate the difficulty level?",
            type: "scale",
            scale_range: { min: 1, max: 10, labels: ["Too Easy", "Too Hard"] },
            required: true,
          },
        ],
        adjustment_triggers: [
          "Low compliance",
          "User feedback",
          "Goal changes",
        ],
      });
    }

    return assessments;
  }

  private async initializeDailyPlanExecutions(
    plan: ComprehensiveHealthPlan
  ): Promise<void> {
    // Initialize daily plan executions for the first week
    const startDate = new Date(plan.start_date);
    const dailyExecutions = [];

    for (let day = 0; day < 7; day++) {
      const executionDate = new Date(startDate);
      executionDate.setDate(startDate.getDate() + day);

      const dayOfWeek = executionDate.getDay() + 1; // 1-7 for Monday-Sunday
      const isWeekend = dayOfWeek === 6 || dayOfWeek === 7;
      const templateType = isWeekend ? "weekend" : "weekday";
      const template = plan.plan_data.daily_templates[templateType];

      const totalActivities =
        template.morning_routine.length +
        template.meals.length +
        template.workouts.length +
        template.evening_routine.length +
        template.wellness_activities.length;

      dailyExecutions.push({
        plan_id: plan.id,
        user_id: plan.user_id,
        execution_date: executionDate.toISOString().split("T")[0],
        week_number: 1,
        day_of_week: dayOfWeek,
        daily_activities: template.morning_routine.concat(
          template.evening_routine
        ),
        daily_meals: template.meals,
        daily_workouts: template.workouts,
        daily_wellness: template.wellness_activities,
        activities_completed: 0,
        total_activities: totalActivities,
        status: "pending",
      });
    }

    const { error } = await supabase
      .from("daily_plan_execution")
      .insert(dailyExecutions);

    if (error) {
      console.error("Error initializing daily plan executions:", error);
    }
  }

  /**
   * Get user's active comprehensive plan
   */
  async getActivePlan(userId: string): Promise<ComprehensiveHealthPlan | null> {
    try {
      const { data, error } = await supabase
        .from("comprehensive_health_plans")
        .select("*")
        .eq("user_id", userId)
        .eq("status", "active")
        .order("created_at", { ascending: false })
        .limit(1);

      if (error) {
        // Log the error for debugging but don't throw
        console.warn("Error fetching active plan:", error);
        return null;
      }

      // Return the most recent active plan, or null if none found
      return data && data.length > 0 ? data[0] : null;
    } catch (error) {
      // Handle any unexpected errors gracefully
      console.warn("Unexpected error fetching active plan:", error);
      return null;
    }
  }

  /**
   * Update plan progress
   */
  async updatePlanProgress(
    planId: string,
    progressData: Partial<ComprehensiveHealthPlan>
  ): Promise<void> {
    const { error } = await supabase
      .from("comprehensive_health_plans")
      .update(progressData)
      .eq("id", planId);

    if (error) throw error;
  }

  /**
   * Complete daily activity
   */
  async completeDailyActivity(
    executionId: string,
    activityId: string
  ): Promise<void> {
    // This would update the specific activity completion
    // Implementation would depend on how activities are stored
  }

  /**
   * Get daily plan for specific date
   */
  async getDailyPlan(
    planId: string,
    date: string
  ): Promise<DailyPlanExecution | null> {
    const { data, error } = await supabase
      .from("daily_plan_execution")
      .select("*")
      .eq("plan_id", planId)
      .eq("execution_date", date)
      .single();

    if (error || !data) return null;
    return data;
  }

  /**
   * Get weekly progress
   */
  async getWeeklyProgress(
    planId: string,
    weekNumber: number
  ): Promise<WeeklyProgressTracking | null> {
    const { data, error } = await supabase
      .from("weekly_progress_tracking")
      .select("*")
      .eq("plan_id", planId)
      .eq("week_number", weekNumber)
      .single();

    if (error || !data) return null;
    return data;
  }
}

export const comprehensiveHealthPlanService =
  new ComprehensiveHealthPlanService();
