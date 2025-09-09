import { supabase } from "@/integrations/supabase/client";

export interface HealthGoal {
  id?: string;
  user_id: string;
  goal_type:
    | "weight_loss"
    | "weight_gain"
    | "muscle_building"
    | "fitness"
    | "sleep_improvement"
    | "stress_reduction"
    | "smoking_cessation"
    | "alcohol_reduction"
    | "nutrition"
    | "custom";
  title: string;
  description?: string;
  target_value: number;
  current_value: number;
  unit: string;
  target_date: string;
  start_date: string;
  timeline_preference: "gradual" | "moderate" | "aggressive";
  calculated_timeline_weeks?: number;
  status: "active" | "paused" | "completed" | "cancelled";
  priority: number;
  barriers: string[];
  milestones: Milestone[];
  progress_percentage: number;
  created_at?: string;
  updated_at?: string;
}

export interface Milestone {
  id: string;
  title: string;
  target_value: number;
  target_date: string;
  completed: boolean;
  completed_date?: string;
}

export interface TimelineCalculation {
  realistic_weeks: number;
  realistic_months: number;
  weekly_target: number;
  daily_target: number;
  milestones: Milestone[];
  timeline_preference_impact: string;
  safety_considerations: string[];
  success_probability: number; // 0-100
}

export interface UserProfile {
  age: number;
  gender: string;
  height_cm: number;
  weight_kg: number;
  fitness_level: "beginner" | "intermediate" | "advanced";
  health_conditions: string[];
  lifestyle_factors: {
    smoking_status: string;
    alcohol_consumption: string;
    exercise_frequency: string;
    sleep_hours: number;
    stress_level: string;
  };
}

class GoalTimelineCalculator {
  /**
   * Calculate realistic timeline for a health goal
   */
  async calculateTimeline(
    goal: Omit<
      HealthGoal,
      | "id"
      | "user_id"
      | "calculated_timeline_weeks"
      | "progress_percentage"
      | "created_at"
      | "updated_at"
    >,
    userProfile: UserProfile
  ): Promise<TimelineCalculation> {
    const baseCalculation = this.getBaseTimelineCalculation(goal, userProfile);
    const adjustedCalculation = this.adjustForTimelinePreference(
      baseCalculation,
      goal.timeline_preference
    );
    const finalCalculation = this.adjustForUserFactors(
      adjustedCalculation,
      userProfile
    );

    return finalCalculation;
  }

  /**
   * Get base timeline calculation based on goal type and target
   */
  private getBaseTimelineCalculation(
    goal: any,
    userProfile: UserProfile
  ): TimelineCalculation {
    switch (goal.goal_type) {
      case "weight_loss":
        return this.calculateWeightLossTimeline(goal, userProfile);
      case "weight_gain":
        return this.calculateWeightGainTimeline(goal, userProfile);
      case "muscle_building":
        return this.calculateMuscleBuildingTimeline(goal, userProfile);
      case "fitness":
        return this.calculateFitnessTimeline(goal, userProfile);
      case "sleep_improvement":
        return this.calculateSleepImprovementTimeline(goal, userProfile);
      case "stress_reduction":
        return this.calculateStressReductionTimeline(goal, userProfile);
      case "smoking_cessation":
        return this.calculateSmokingCessationTimeline(goal, userProfile);
      case "alcohol_reduction":
        return this.calculateAlcoholReductionTimeline(goal, userProfile);
      default:
        return this.calculateCustomTimeline(goal, userProfile);
    }
  }

  /**
   * Calculate weight loss timeline
   */
  private calculateWeightLossTimeline(
    goal: any,
    userProfile: UserProfile
  ): TimelineCalculation {
    const weightToLose = goal.current_value - goal.target_value;

    // Safe weight loss: 0.5-1 kg per week (0.5-2 lbs per week)
    const safeWeeklyLoss =
      userProfile.fitness_level === "beginner" ? 0.5 : 0.75;
    const realisticWeeks = Math.ceil(weightToLose / safeWeeklyLoss);

    // Create milestones every 25% of the way
    const milestones = this.createWeightLossMilestones(goal, realisticWeeks);

    return {
      realistic_weeks: realisticWeeks,
      realistic_months: Math.ceil(realisticWeeks / 4.33),
      weekly_target: safeWeeklyLoss,
      daily_target: safeWeeklyLoss / 7,
      milestones,
      timeline_preference_impact:
        "Weight loss timeline is primarily based on safe, sustainable rates",
      safety_considerations: [
        "Rapid weight loss can lead to muscle loss and metabolic slowdown",
        "Aim for 0.5-1kg per week for sustainable results",
        "Include strength training to preserve muscle mass",
        "Monitor energy levels and adjust if feeling fatigued",
      ],
      success_probability: this.calculateWeightLossSuccessProbability(
        userProfile,
        realisticWeeks
      ),
    };
  }

  /**
   * Calculate weight gain timeline
   */
  private calculateWeightGainTimeline(
    goal: any,
    userProfile: UserProfile
  ): TimelineCalculation {
    const weightToGain = goal.target_value - goal.current_value;

    // Healthy weight gain: 0.25-0.5 kg per week
    const safeWeeklyGain = 0.35;
    const realisticWeeks = Math.ceil(weightToGain / safeWeeklyGain);

    const milestones = this.createWeightGainMilestones(goal, realisticWeeks);

    return {
      realistic_weeks: realisticWeeks,
      realistic_months: Math.ceil(realisticWeeks / 4.33),
      weekly_target: safeWeeklyGain,
      daily_target: safeWeeklyGain / 7,
      milestones,
      timeline_preference_impact:
        "Weight gain should be gradual to ensure it's mostly muscle, not fat",
      safety_considerations: [
        "Focus on lean muscle gain rather than rapid weight increase",
        "Include progressive strength training",
        "Monitor body composition, not just weight",
        "Ensure adequate protein intake (1.6-2.2g per kg body weight)",
      ],
      success_probability: this.calculateWeightGainSuccessProbability(
        userProfile,
        realisticWeeks
      ),
    };
  }

  /**
   * Calculate muscle building timeline
   */
  private calculateMuscleBuildingTimeline(
    goal: any,
    userProfile: UserProfile
  ): TimelineCalculation {
    // Muscle building: 0.5-1 kg per month for beginners, 0.25-0.5 kg for intermediate/advanced
    const monthlyGain = userProfile.fitness_level === "beginner" ? 0.75 : 0.4;
    const targetWeight = goal.target_value - goal.current_value;
    const realisticWeeks = Math.ceil((targetWeight / monthlyGain) * 4.33);

    const milestones = this.createMuscleBuildingMilestones(
      goal,
      realisticWeeks
    );

    return {
      realistic_weeks: realisticWeeks,
      realistic_months: Math.ceil(realisticWeeks / 4.33),
      weekly_target: monthlyGain / 4.33,
      daily_target: monthlyGain / (4.33 * 7),
      milestones,
      timeline_preference_impact:
        "Muscle building is inherently gradual and cannot be rushed safely",
      safety_considerations: [
        "Muscle building requires progressive overload and adequate recovery",
        "Nutrition is crucial - aim for 1.6-2.2g protein per kg body weight",
        "Allow 48-72 hours between training the same muscle groups",
        "Track strength gains as well as weight changes",
      ],
      success_probability: this.calculateMuscleBuildingSuccessProbability(
        userProfile,
        realisticWeeks
      ),
    };
  }

  /**
   * Calculate fitness timeline
   */
  private calculateFitnessTimeline(
    goal: any,
    userProfile: UserProfile
  ): TimelineCalculation {
    // Fitness improvements: 4-8 weeks for beginners, 8-12 weeks for intermediate/advanced
    const baseWeeks = userProfile.fitness_level === "beginner" ? 6 : 10;
    const realisticWeeks = Math.max(
      baseWeeks,
      Math.ceil(goal.target_value / 10)
    ); // Adjust based on target

    const milestones = this.createFitnessMilestones(goal, realisticWeeks);

    return {
      realistic_weeks: realisticWeeks,
      realistic_months: Math.ceil(realisticWeeks / 4.33),
      weekly_target: goal.target_value / realisticWeeks,
      daily_target: goal.target_value / (realisticWeeks * 7),
      milestones,
      timeline_preference_impact:
        "Fitness improvements require consistent training and proper progression",
      safety_considerations: [
        "Start with proper form before increasing intensity",
        "Include both cardiovascular and strength training",
        "Allow adequate rest and recovery between sessions",
        "Progress gradually to avoid injury",
      ],
      success_probability: this.calculateFitnessSuccessProbability(
        userProfile,
        realisticWeeks
      ),
    };
  }

  /**
   * Calculate sleep improvement timeline
   */
  private calculateSleepImprovementTimeline(
    goal: any,
    userProfile: UserProfile
  ): TimelineCalculation {
    // Sleep improvements: 2-4 weeks for habits, 4-8 weeks for significant changes
    const realisticWeeks = 6;

    const milestones = this.createSleepMilestones(goal, realisticWeeks);

    return {
      realistic_weeks: realisticWeeks,
      realistic_months: Math.ceil(realisticWeeks / 4.33),
      weekly_target:
        (goal.target_value - userProfile.lifestyle_factors.sleep_hours) /
        realisticWeeks,
      daily_target:
        (goal.target_value - userProfile.lifestyle_factors.sleep_hours) /
        (realisticWeeks * 7),
      milestones,
      timeline_preference_impact:
        "Sleep habits take time to establish and show benefits",
      safety_considerations: [
        "Maintain consistent sleep and wake times",
        "Create a relaxing bedtime routine",
        "Limit screen time before bed",
        "Ensure bedroom is cool, dark, and quiet",
      ],
      success_probability: this.calculateSleepSuccessProbability(
        userProfile,
        realisticWeeks
      ),
    };
  }

  /**
   * Calculate stress reduction timeline
   */
  private calculateStressReductionTimeline(
    goal: any,
    userProfile: UserProfile
  ): TimelineCalculation {
    // Stress reduction: 2-6 weeks for initial improvements, 8-12 weeks for significant changes
    const realisticWeeks = 8;

    const milestones = this.createStressReductionMilestones(
      goal,
      realisticWeeks
    );

    return {
      realistic_weeks: realisticWeeks,
      realistic_months: Math.ceil(realisticWeeks / 4.33),
      weekly_target: 1, // Stress level reduction per week
      daily_target: 1 / 7,
      milestones,
      timeline_preference_impact:
        "Stress management requires consistent practice and lifestyle changes",
      safety_considerations: [
        "Practice stress management techniques daily",
        "Identify and address stress triggers",
        "Maintain healthy lifestyle habits",
        "Consider professional help if stress is severe",
      ],
      success_probability: this.calculateStressReductionSuccessProbability(
        userProfile,
        realisticWeeks
      ),
    };
  }

  /**
   * Calculate smoking cessation timeline
   */
  private calculateSmokingCessationTimeline(
    goal: any,
    userProfile: UserProfile
  ): TimelineCalculation {
    // Smoking cessation: 3-6 months for complete cessation, with milestones along the way
    const realisticWeeks = 20; // ~5 months

    const milestones = this.createSmokingCessationMilestones(
      goal,
      realisticWeeks
    );

    return {
      realistic_weeks: realisticWeeks,
      realistic_months: Math.ceil(realisticWeeks / 4.33),
      weekly_target: goal.current_value / realisticWeeks, // Reduce cigarettes per week
      daily_target: goal.current_value / (realisticWeeks * 7),
      milestones,
      timeline_preference_impact:
        "Smoking cessation is a complex process that requires gradual reduction and support",
      safety_considerations: [
        "Consider nicotine replacement therapy or medications",
        "Identify triggers and develop coping strategies",
        "Seek support from healthcare providers or support groups",
        "Be patient with setbacks and focus on progress",
      ],
      success_probability: this.calculateSmokingCessationSuccessProbability(
        userProfile,
        realisticWeeks
      ),
    };
  }

  /**
   * Calculate alcohol reduction timeline
   */
  private calculateAlcoholReductionTimeline(
    goal: any,
    userProfile: UserProfile
  ): TimelineCalculation {
    // Alcohol reduction: 4-8 weeks for significant reduction
    const realisticWeeks = 6;

    const milestones = this.createAlcoholReductionMilestones(
      goal,
      realisticWeeks
    );

    return {
      realistic_weeks: realisticWeeks,
      realistic_months: Math.ceil(realisticWeeks / 4.33),
      weekly_target: (goal.current_value - goal.target_value) / realisticWeeks,
      daily_target:
        (goal.current_value - goal.target_value) / (realisticWeeks * 7),
      milestones,
      timeline_preference_impact:
        "Alcohol reduction should be gradual to avoid withdrawal symptoms",
      safety_considerations: [
        "Reduce alcohol consumption gradually",
        "Identify triggers and develop alternative activities",
        "Seek professional help if experiencing withdrawal symptoms",
        "Focus on building healthy coping mechanisms",
      ],
      success_probability: this.calculateAlcoholReductionSuccessProbability(
        userProfile,
        realisticWeeks
      ),
    };
  }

  /**
   * Calculate custom timeline
   */
  private calculateCustomTimeline(
    goal: any,
    userProfile: UserProfile
  ): TimelineCalculation {
    // Default to 8 weeks for custom goals
    const realisticWeeks = 8;

    const milestones = this.createCustomMilestones(goal, realisticWeeks);

    return {
      realistic_weeks: realisticWeeks,
      realistic_months: Math.ceil(realisticWeeks / 4.33),
      weekly_target: goal.target_value / realisticWeeks,
      daily_target: goal.target_value / (realisticWeeks * 7),
      milestones,
      timeline_preference_impact:
        "Custom goals require personalized assessment and monitoring",
      safety_considerations: [
        "Set realistic and measurable targets",
        "Monitor progress regularly",
        "Adjust timeline based on actual progress",
        "Seek professional guidance if needed",
      ],
      success_probability: 70, // Default moderate success probability
    };
  }

  /**
   * Adjust timeline based on user's preference
   */
  private adjustForTimelinePreference(
    calculation: TimelineCalculation,
    preference: string
  ): TimelineCalculation {
    let adjustmentFactor = 1.0;

    switch (preference) {
      case "gradual":
        adjustmentFactor = 1.3; // 30% longer timeline
        break;
      case "moderate":
        adjustmentFactor = 1.0; // No change
        break;
      case "aggressive":
        adjustmentFactor = 0.8; // 20% shorter timeline
        break;
    }

    const adjustedWeeks = Math.ceil(
      calculation.realistic_weeks * adjustmentFactor
    );

    return {
      ...calculation,
      realistic_weeks: adjustedWeeks,
      realistic_months: Math.ceil(adjustedWeeks / 4.33),
      weekly_target: calculation.weekly_target / adjustmentFactor,
      daily_target: calculation.daily_target / adjustmentFactor,
      success_probability: Math.max(
        30,
        calculation.success_probability - (preference === "aggressive" ? 15 : 0)
      ),
    };
  }

  /**
   * Adjust timeline based on user factors
   */
  private adjustForUserFactors(
    calculation: TimelineCalculation,
    userProfile: UserProfile
  ): TimelineCalculation {
    let adjustmentFactor = 1.0;
    let successAdjustment = 0;

    // Adjust based on fitness level
    if (userProfile.fitness_level === "beginner") {
      adjustmentFactor *= 1.2; // 20% longer for beginners
      successAdjustment -= 10;
    } else if (userProfile.fitness_level === "advanced") {
      adjustmentFactor *= 0.9; // 10% shorter for advanced
      successAdjustment += 10;
    }

    // Adjust based on health conditions
    if (userProfile.health_conditions.length > 0) {
      adjustmentFactor *= 1.15; // 15% longer if health conditions
      successAdjustment -= 5;
    }

    // Adjust based on lifestyle factors
    if (userProfile.lifestyle_factors.smoking_status === "current") {
      adjustmentFactor *= 1.1;
      successAdjustment -= 5;
    }

    if (userProfile.lifestyle_factors.exercise_frequency === "none") {
      adjustmentFactor *= 1.2;
      successAdjustment -= 10;
    }

    const finalWeeks = Math.ceil(
      calculation.realistic_weeks * adjustmentFactor
    );

    return {
      ...calculation,
      realistic_weeks: finalWeeks,
      realistic_months: Math.ceil(finalWeeks / 4.33),
      weekly_target: calculation.weekly_target / adjustmentFactor,
      daily_target: calculation.daily_target / adjustmentFactor,
      success_probability: Math.max(
        20,
        Math.min(95, calculation.success_probability + successAdjustment)
      ),
    };
  }

  // Milestone creation methods
  private createWeightLossMilestones(goal: any, weeks: number): Milestone[] {
    const milestones: Milestone[] = [];
    const totalLoss = goal.current_value - goal.target_value;

    for (let i = 1; i <= 4; i++) {
      const milestoneValue = goal.current_value - totalLoss * (i * 0.25);
      const milestoneDate = new Date();
      milestoneDate.setDate(milestoneDate.getDate() + weeks * 7 * i * 0.25);

      milestones.push({
        id: `weight-loss-${i}`,
        title: `${Math.round(totalLoss * (i * 0.25))}kg lost`,
        target_value: milestoneValue,
        target_date: milestoneDate.toISOString().split("T")[0],
        completed: false,
      });
    }

    return milestones;
  }

  private createWeightGainMilestones(goal: any, weeks: number): Milestone[] {
    const milestones: Milestone[] = [];
    const totalGain = goal.target_value - goal.current_value;

    for (let i = 1; i <= 4; i++) {
      const milestoneValue = goal.current_value + totalGain * (i * 0.25);
      const milestoneDate = new Date();
      milestoneDate.setDate(milestoneDate.getDate() + weeks * 7 * i * 0.25);

      milestones.push({
        id: `weight-gain-${i}`,
        title: `${Math.round(totalGain * (i * 0.25))}kg gained`,
        target_value: milestoneValue,
        target_date: milestoneDate.toISOString().split("T")[0],
        completed: false,
      });
    }

    return milestones;
  }

  private createMuscleBuildingMilestones(
    goal: any,
    weeks: number
  ): Milestone[] {
    const milestones: Milestone[] = [];
    const totalGain = goal.target_value - goal.current_value;

    for (let i = 1; i <= 4; i++) {
      const milestoneValue = goal.current_value + totalGain * (i * 0.25);
      const milestoneDate = new Date();
      milestoneDate.setDate(milestoneDate.getDate() + weeks * 7 * i * 0.25);

      milestones.push({
        id: `muscle-building-${i}`,
        title: `${Math.round(totalGain * (i * 0.25))}kg muscle gained`,
        target_value: milestoneValue,
        target_date: milestoneDate.toISOString().split("T")[0],
        completed: false,
      });
    }

    return milestones;
  }

  private createFitnessMilestones(goal: any, weeks: number): Milestone[] {
    const milestones: Milestone[] = [];

    for (let i = 1; i <= 4; i++) {
      const milestoneValue = goal.target_value * (i * 0.25);
      const milestoneDate = new Date();
      milestoneDate.setDate(milestoneDate.getDate() + weeks * 7 * i * 0.25);

      milestones.push({
        id: `fitness-${i}`,
        title: `${Math.round(milestoneValue)}% fitness improvement`,
        target_value: milestoneValue,
        target_date: milestoneDate.toISOString().split("T")[0],
        completed: false,
      });
    }

    return milestones;
  }

  private createSleepMilestones(goal: any, weeks: number): Milestone[] {
    const milestones: Milestone[] = [];

    for (let i = 1; i <= 3; i++) {
      const milestoneDate = new Date();
      milestoneDate.setDate(milestoneDate.getDate() + weeks * 7 * i * 0.33);

      milestones.push({
        id: `sleep-${i}`,
        title: `Week ${i * 2} sleep habit`,
        target_value: goal.target_value,
        target_date: milestoneDate.toISOString().split("T")[0],
        completed: false,
      });
    }

    return milestones;
  }

  private createStressReductionMilestones(
    goal: any,
    weeks: number
  ): Milestone[] {
    const milestones: Milestone[] = [];

    for (let i = 1; i <= 4; i++) {
      const milestoneDate = new Date();
      milestoneDate.setDate(milestoneDate.getDate() + weeks * 7 * i * 0.25);

      milestones.push({
        id: `stress-${i}`,
        title: `Stress level ${i}`,
        target_value: goal.target_value,
        target_date: milestoneDate.toISOString().split("T")[0],
        completed: false,
      });
    }

    return milestones;
  }

  private createSmokingCessationMilestones(
    goal: any,
    weeks: number
  ): Milestone[] {
    const milestones: Milestone[] = [];

    const milestoneTitles = [
      "Reduce by 50%",
      "Reduce by 75%",
      "Reduce by 90%",
      "Complete cessation",
    ];

    for (let i = 0; i < 4; i++) {
      const milestoneDate = new Date();
      milestoneDate.setDate(
        milestoneDate.getDate() + weeks * 7 * (i + 1) * 0.25
      );

      milestones.push({
        id: `smoking-${i + 1}`,
        title: milestoneTitles[i],
        target_value: goal.target_value,
        target_date: milestoneDate.toISOString().split("T")[0],
        completed: false,
      });
    }

    return milestones;
  }

  private createAlcoholReductionMilestones(
    goal: any,
    weeks: number
  ): Milestone[] {
    const milestones: Milestone[] = [];

    for (let i = 1; i <= 3; i++) {
      const milestoneValue =
        goal.current_value -
        (goal.current_value - goal.target_value) * (i * 0.33);
      const milestoneDate = new Date();
      milestoneDate.setDate(milestoneDate.getDate() + weeks * 7 * i * 0.33);

      milestones.push({
        id: `alcohol-${i}`,
        title: `Reduce to ${Math.round(milestoneValue)} drinks/week`,
        target_value: milestoneValue,
        target_date: milestoneDate.toISOString().split("T")[0],
        completed: false,
      });
    }

    return milestones;
  }

  private createCustomMilestones(goal: any, weeks: number): Milestone[] {
    const milestones: Milestone[] = [];

    for (let i = 1; i <= 4; i++) {
      const milestoneValue = goal.target_value * (i * 0.25);
      const milestoneDate = new Date();
      milestoneDate.setDate(milestoneDate.getDate() + weeks * 7 * i * 0.25);

      milestones.push({
        id: `custom-${i}`,
        title: `${Math.round(milestoneValue)}% progress`,
        target_value: milestoneValue,
        target_date: milestoneDate.toISOString().split("T")[0],
        completed: false,
      });
    }

    return milestones;
  }

  // Success probability calculation methods
  private calculateWeightLossSuccessProbability(
    userProfile: UserProfile,
    weeks: number
  ): number {
    let probability = 70; // Base probability

    if (userProfile.fitness_level === "beginner") probability -= 10;
    if (userProfile.health_conditions.length > 0) probability -= 5;
    if (userProfile.lifestyle_factors.exercise_frequency === "none")
      probability -= 15;
    if (weeks > 20) probability -= 10; // Longer timelines are harder to maintain

    return Math.max(20, Math.min(95, probability));
  }

  private calculateWeightGainSuccessProbability(
    userProfile: UserProfile,
    weeks: number
  ): number {
    let probability = 65; // Base probability

    if (userProfile.fitness_level === "advanced") probability += 10;
    if (userProfile.lifestyle_factors.exercise_frequency === "daily")
      probability += 10;
    if (weeks > 16) probability -= 5;

    return Math.max(20, Math.min(95, probability));
  }

  private calculateMuscleBuildingSuccessProbability(
    userProfile: UserProfile,
    weeks: number
  ): number {
    let probability = 60; // Base probability

    if (userProfile.fitness_level === "advanced") probability += 15;
    if (userProfile.lifestyle_factors.exercise_frequency === "daily")
      probability += 10;
    if (userProfile.age < 30) probability += 5;
    if (weeks > 24) probability -= 10;

    return Math.max(20, Math.min(95, probability));
  }

  private calculateFitnessSuccessProbability(
    userProfile: UserProfile,
    weeks: number
  ): number {
    let probability = 75; // Base probability

    if (userProfile.fitness_level === "beginner") probability += 10;
    if (userProfile.lifestyle_factors.exercise_frequency === "none")
      probability -= 15;
    if (weeks <= 8) probability += 5;

    return Math.max(20, Math.min(95, probability));
  }

  private calculateSleepSuccessProbability(
    userProfile: UserProfile,
    weeks: number
  ): number {
    let probability = 80; // Base probability

    if (userProfile.lifestyle_factors.stress_level === "high")
      probability -= 10;
    if (userProfile.lifestyle_factors.sleep_hours < 6) probability -= 5;

    return Math.max(20, Math.min(95, probability));
  }

  private calculateStressReductionSuccessProbability(
    userProfile: UserProfile,
    weeks: number
  ): number {
    let probability = 70; // Base probability

    if (userProfile.lifestyle_factors.stress_level === "high")
      probability -= 15;
    if (userProfile.lifestyle_factors.exercise_frequency === "daily")
      probability += 10;
    if (userProfile.health_conditions.length > 0) probability -= 5;

    return Math.max(20, Math.min(95, probability));
  }

  private calculateSmokingCessationSuccessProbability(
    userProfile: UserProfile,
    weeks: number
  ): number {
    let probability = 50; // Base probability (smoking cessation is challenging)

    if (userProfile.lifestyle_factors.stress_level === "low") probability += 10;
    if (userProfile.lifestyle_factors.exercise_frequency === "daily")
      probability += 10;
    if (weeks > 16) probability += 5; // Longer timeline can be better

    return Math.max(20, Math.min(95, probability));
  }

  private calculateAlcoholReductionSuccessProbability(
    userProfile: UserProfile,
    weeks: number
  ): number {
    let probability = 70; // Base probability

    if (userProfile.lifestyle_factors.stress_level === "high")
      probability -= 10;
    if (userProfile.lifestyle_factors.exercise_frequency === "daily")
      probability += 5;

    return Math.max(20, Math.min(95, probability));
  }

  /**
   * Save a health goal to the database
   */
  async saveHealthGoal(
    goal: Omit<HealthGoal, "id" | "created_at" | "updated_at">
  ): Promise<HealthGoal | null> {
    try {
      const { data, error } = await supabase
        .from("user_health_goals")
        .insert(goal)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error("Error saving health goal:", error);
      return null;
    }
  }

  /**
   * Get user's health goals
   */
  async getUserHealthGoals(userId: string): Promise<HealthGoal[]> {
    try {
      const { data, error } = await supabase
        .from("user_health_goals")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error("Error fetching health goals:", error);
      return [];
    }
  }

  /**
   * Update a health goal
   */
  async updateHealthGoal(
    goalId: string,
    updates: Partial<HealthGoal>
  ): Promise<HealthGoal | null> {
    try {
      const { data, error } = await supabase
        .from("user_health_goals")
        .update(updates)
        .eq("id", goalId)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error("Error updating health goal:", error);
      return null;
    }
  }
}

export const goalTimelineCalculator = new GoalTimelineCalculator();
