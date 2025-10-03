// Enhanced Health Plan Types - Multi-Tier Duration Support
// This replaces the 2-day limitation with realistic, goal-based plan durations

export interface ComprehensiveHealthPlan {
  id: string;
  user_id: string;
  plan_name: string;
  plan_type:
    | "quick_win"
    | "habit_formation"
    | "health_transformation"
    | "disease_management"
    | "lifestyle_change";
  primary_goal: string;
  secondary_goals: string[];
  start_date: string;
  target_end_date: string;
  actual_end_date?: string;
  duration_weeks: number;
  plan_data: PlanData;
  weekly_milestones: WeeklyMilestone[];
  monthly_assessments: MonthlyAssessmentTemplate[];
  overall_progress_percentage: number;
  weekly_compliance_rate: number;
  monthly_compliance_rate: number;
  status:
    | "draft"
    | "active"
    | "paused"
    | "completed"
    | "cancelled"
    | "extended";
  completion_reason?: string;
  timeline_adjustments: TimelineAdjustment[];
  intensity_adjustments: IntensityAdjustment[];
  generated_at: string;
  last_updated_at: string;
  created_at: string;
  updated_at: string;
}

export interface PlanData {
  overview: {
    description: string;
    expected_outcomes: string[];
    key_principles: string[];
    success_metrics: string[];
    safety_considerations: string[];
  };
  weekly_structure: {
    [weekNumber: string]: {
      focus_areas: string[];
      intensity_level: "low" | "moderate" | "high";
      key_activities: string[];
      milestones: string[];
      weekly_goals: string[];
    };
  };
  daily_templates: {
    [dayType: string]: {
      morning_routine: Activity[];
      meals: MealPlan[];
      workouts: WorkoutPlan[];
      evening_routine: Activity[];
      wellness_activities: Activity[];
      hydration_goals: HydrationGoal[];
      sleep_targets: SleepTarget;
    };
  };
  adaptation_rules: {
    compliance_thresholds: {
      excellent: number; // 90%+
      good: number; // 70-89%
      needs_improvement: number; // 50-69%
      poor: number; // <50%
    };
    adjustment_triggers: {
      timeline_extension: string[];
      intensity_increase: string[];
      intensity_decrease: string[];
      plan_modification: string[];
    };
  };
  progression_rules: {
    weekly_progression: {
      intensity_increase_percentage: number;
      volume_increase_percentage: number;
      complexity_increase: boolean;
    };
    plateau_handling: {
      detection_criteria: string[];
      adjustment_strategies: string[];
    };
  };
}

export interface Activity {
  id: string;
  title: string;
  description: string;
  duration: number; // minutes
  type:
    | "exercise"
    | "meal"
    | "wellness"
    | "hydration"
    | "sleep"
    | "medication"
    | "measurement";
  category: string;
  instructions: string[];
  tips: string[];
  required_equipment?: string[];
  alternatives?: string[];
  difficulty_level: "easy" | "moderate" | "hard";
  calories_burned?: number;
  impact_on_goals: {
    [goalType: string]: number; // -1 to 1, impact score
  };
  time_of_day?: "morning" | "afternoon" | "evening" | "anytime";
  frequency: "daily" | "weekly" | "bi-weekly" | "monthly";
  is_required: boolean;
  completion_criteria: string[];
}

export interface MealPlan {
  id: string;
  meal_type: "breakfast" | "lunch" | "dinner" | "snack";
  name: string;
  description: string;
  ingredients: Ingredient[];
  instructions: string[];
  prep_time: number; // minutes
  cook_time: number; // minutes
  servings: number;
  nutrition: NutritionInfo;
  dietary_tags: string[]; // vegetarian, vegan, gluten-free, etc.
  cost_estimate?: number;
  difficulty: "easy" | "moderate" | "hard";
  alternatives: AlternativeMeal[];
  cultural_adaptations: CulturalAdaptation[];
}

export interface Ingredient {
  name: string;
  quantity: number;
  unit: string;
  notes?: string;
  substitutes?: string[];
}

export interface NutritionInfo {
  calories: number;
  protein: number;
  carbohydrates: number;
  fat: number;
  fiber: number;
  sugar: number;
  sodium: number;
  vitamins?: { [vitamin: string]: number };
  minerals?: { [mineral: string]: number };
}

export interface AlternativeMeal {
  name: string;
  reason: string; // dietary restriction, preference, availability
  ingredients: Ingredient[];
  nutrition: NutritionInfo;
}

export interface CulturalAdaptation {
  culture: string;
  adapted_ingredients: Ingredient[];
  cooking_method_changes: string[];
  cultural_notes: string[];
}

export interface WorkoutPlan {
  id: string;
  name: string;
  type:
    | "strength"
    | "cardio"
    | "flexibility"
    | "balance"
    | "sports"
    | "rehabilitation";
  duration: number; // minutes
  exercises: Exercise[];
  warm_up: Exercise[];
  cool_down: Exercise[];
  equipment_needed: string[];
  space_required: "minimal" | "moderate" | "large";
  intensity: "low" | "moderate" | "high";
  difficulty: "beginner" | "intermediate" | "advanced";
  calories_burned_estimate: number;
  muscle_groups_targeted: string[];
  adaptations: WorkoutAdaptation[];
}

export interface Exercise {
  id: string;
  name: string;
  description: string;
  sets?: number;
  reps?: number;
  duration?: number; // seconds for time-based exercises
  rest_between_sets?: number; // seconds
  weight?: number; // kg
  rpe?: number; // Rate of Perceived Exertion (1-10)
  instructions: string[];
  form_cues: string[];
  common_mistakes: string[];
  modifications: ExerciseModification[];
  progression_options: string[];
  equipment?: string[];
  muscle_groups: string[];
}

export interface ExerciseModification {
  type: "easier" | "harder" | "injury" | "equipment_free";
  description: string;
  instructions: string[];
}

export interface WorkoutAdaptation {
  condition: string; // injury, equipment limitation, time constraint
  modifications: ExerciseModification[];
  alternative_exercises: Exercise[];
}

export interface HydrationGoal {
  daily_target: number; // ml
  timing_recommendations: string[];
  quality_guidelines: string[];
  tracking_method: string;
}

export interface SleepTarget {
  target_duration: number; // hours
  bedtime_range: string; // "10:00 PM - 11:00 PM"
  wake_time_range: string; // "6:00 AM - 7:00 AM"
  sleep_hygiene_practices: string[];
  environment_recommendations: string[];
}

export interface WeeklyMilestone {
  week_number: number;
  title: string;
  description: string;
  success_criteria: string[];
  measurement_method: string;
  target_value?: number;
  unit?: string;
  importance: "low" | "medium" | "high" | "critical";
  category: "fitness" | "nutrition" | "wellness" | "medical" | "behavioral";
}

export interface MonthlyAssessmentTemplate {
  month_number: number;
  title: string;
  description: string;
  assessment_areas: AssessmentArea[];
  required_measurements: string[];
  optional_measurements: string[];
  questionnaire: AssessmentQuestion[];
  adjustment_triggers: string[];
}

export interface AssessmentArea {
  name: string;
  description: string;
  metrics: string[];
  weight: number; // importance weight 0-1
}

export interface AssessmentQuestion {
  id: string;
  question: string;
  type: "scale" | "boolean" | "multiple_choice" | "text";
  options?: string[];
  scale_range?: { min: number; max: number; labels: string[] };
  required: boolean;
}

export interface TimelineAdjustment {
  id: string;
  adjustment_date: string;
  reason: string;
  old_duration_weeks: number;
  new_duration_weeks: number;
  impact_description: string;
  user_approved: boolean;
  created_by: "system" | "user" | "ai";
}

export interface IntensityAdjustment {
  id: string;
  adjustment_date: string;
  reason: string;
  adjustment_type: "increase" | "decrease" | "modify";
  affected_areas: string[]; // workouts, nutrition, wellness
  percentage_change: number;
  description: string;
  user_approved: boolean;
  created_by: "system" | "user" | "ai";
}

export interface DailyPlanExecution {
  id: string;
  plan_id: string;
  user_id: string;
  execution_date: string;
  week_number: number;
  day_of_week: number;
  daily_activities: Activity[];
  daily_meals: MealPlan[];
  daily_workouts: WorkoutPlan[];
  daily_wellness: Activity[];
  activities_completed: number;
  total_activities: number;
  completion_percentage: number;
  energy_level?: number;
  difficulty_rating?: number;
  user_notes?: string;
  status: "pending" | "in_progress" | "completed" | "skipped" | "modified";
  created_at: string;
  updated_at: string;
}

export interface WeeklyProgressTracking {
  id: string;
  plan_id: string;
  user_id: string;
  week_number: number;
  week_start_date: string;
  week_end_date: string;
  total_activities: number;
  completed_activities: number;
  compliance_rate: number;
  weight_change?: number;
  body_measurements: BodyMeasurements;
  fitness_metrics: FitnessMetrics;
  health_metrics: HealthMetrics;
  milestones_achieved: string[];
  milestones_missed: string[];
  weekly_rating?: number;
  challenges_faced: string[];
  successes_celebrated: string[];
  adjustments_needed?: string;
  status: "in_progress" | "completed" | "needs_adjustment";
  created_at: string;
  updated_at: string;
}

export interface BodyMeasurements {
  weight?: number;
  body_fat_percentage?: number;
  muscle_mass?: number;
  waist_circumference?: number;
  hip_circumference?: number;
  chest_circumference?: number;
  arm_circumference?: number;
  thigh_circumference?: number;
}

export interface FitnessMetrics {
  resting_heart_rate?: number;
  max_heart_rate?: number;
  vo2_max_estimate?: number;
  steps_daily_average?: number;
  active_minutes_daily_average?: number;
  strength_improvements?: { [exercise: string]: number };
  endurance_improvements?: { [activity: string]: number };
}

export interface HealthMetrics {
  blood_pressure?: { systolic: number; diastolic: number };
  blood_glucose?: number;
  sleep_quality_score?: number;
  stress_level?: number;
  energy_level?: number;
  mood_score?: number;
  pain_levels?: { [bodyPart: string]: number };
  medication_adherence?: number;
}

export interface MonthlyAssessment {
  id: string;
  plan_id: string;
  user_id: string;
  month_number: number;
  assessment_date: string;
  overall_progress: number;
  goal_achievement_rate: number;
  compliance_trend: "improving" | "stable" | "declining" | "inconsistent";
  health_improvements: Record<string, any>;
  health_concerns: Record<string, any>;
  biomarker_changes: Record<string, any>;
  timeline_adjustment_days: number;
  intensity_adjustment_percentage: number;
  new_barriers_identified: string[];
  new_success_factors: string[];
  next_month_focus: string[];
  plan_modifications: Record<string, any>;
  additional_support_needed: string[];
  status: "pending" | "completed" | "requires_attention";
  created_at: string;
  updated_at: string;
}

// Plan Type Definitions
export interface PlanTypeDefinition {
  type: ComprehensiveHealthPlan["plan_type"];
  name: string;
  description: string;
  typical_duration_weeks: { min: number; max: number };
  success_indicators: string[];
  common_goals: string[];
  tracking_frequency: {
    daily: boolean;
    weekly: boolean;
    monthly: boolean;
  };
  adjustment_flexibility: "low" | "moderate" | "high";
}

export const PLAN_TYPE_DEFINITIONS: Record<
  ComprehensiveHealthPlan["plan_type"],
  PlanTypeDefinition
> = {
  quick_win: {
    type: "quick_win",
    name: "Quick Win",
    description: "Short-term interventions for immediate health improvements",
    typical_duration_weeks: { min: 1, max: 2 },
    success_indicators: [
      "immediate_improvement",
      "habit_initiation",
      "motivation_boost",
    ],
    common_goals: [
      "hydration_boost",
      "sleep_reset",
      "stress_relief",
      "energy_boost",
    ],
    tracking_frequency: { daily: true, weekly: false, monthly: false },
    adjustment_flexibility: "low",
  },
  habit_formation: {
    type: "habit_formation",
    name: "Habit Formation",
    description: "Building sustainable healthy habits over 2-8 weeks",
    typical_duration_weeks: { min: 2, max: 8 },
    success_indicators: ["consistency", "automaticity", "reduced_effort"],
    common_goals: [
      "exercise_routine",
      "meal_prep",
      "meditation",
      "sleep_schedule",
    ],
    tracking_frequency: { daily: true, weekly: true, monthly: false },
    adjustment_flexibility: "moderate",
  },
  health_transformation: {
    type: "health_transformation",
    name: "Health Transformation",
    description: "Significant health improvements over 1-6 months",
    typical_duration_weeks: { min: 4, max: 24 },
    success_indicators: [
      "measurable_change",
      "lifestyle_integration",
      "sustained_progress",
    ],
    common_goals: [
      "weight_loss",
      "fitness_improvement",
      "nutrition_overhaul",
      "body_composition",
    ],
    tracking_frequency: { daily: true, weekly: true, monthly: true },
    adjustment_flexibility: "high",
  },
  disease_management: {
    type: "disease_management",
    name: "Disease Management",
    description: "Long-term management and improvement of chronic conditions",
    typical_duration_weeks: { min: 12, max: 52 },
    success_indicators: [
      "symptom_reduction",
      "biomarker_improvement",
      "medication_optimization",
    ],
    common_goals: [
      "diabetes_management",
      "hypertension_control",
      "pcos_management",
      "heart_health",
    ],
    tracking_frequency: { daily: true, weekly: true, monthly: true },
    adjustment_flexibility: "high",
  },
  lifestyle_change: {
    type: "lifestyle_change",
    name: "Lifestyle Change",
    description: "Comprehensive lifestyle overhaul for long-term health",
    typical_duration_weeks: { min: 24, max: 104 },
    success_indicators: [
      "holistic_improvement",
      "sustainable_practices",
      "quality_of_life",
    ],
    common_goals: [
      "complete_health_overhaul",
      "chronic_disease_reversal",
      "longevity_optimization",
    ],
    tracking_frequency: { daily: true, weekly: true, monthly: true },
    adjustment_flexibility: "high",
  },
};
