// Enhanced Plan and Schedule Types for UrCare Health Platform

export interface UserOnboardingData {
  id: string;
  full_name: string;
  age: number;
  gender: string;
  height_cm: number;
  weight_kg: number;
  blood_group: string;
  chronic_conditions: string[];
  medications: string[];
  health_goals: string[];
  diet_type: string;
  workout_time: string;
  sleep_time: string;
  wake_up_time: string;
  timeline_preferences: {
    start_date: string;
    duration_weeks: number;
    preferred_workout_days: string[];
    preferred_rest_days: string[];
    intensity_preference: 'low' | 'medium' | 'high';
  };
  lifestyle_factors: {
    work_schedule: string;
    commute_time: number;
    family_obligations: string[];
    social_activities: string[];
    stress_level: number;
  };
}

export interface DetailedPlan {
  id: string;
  title: string;
  description: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  duration_weeks: number;
  focus_areas: string[];
  estimated_calories_per_day: number;
  equipment_needed: string[];
  key_benefits: string[];
  target_audience: string;
  prerequisites: string[];
  progression_milestones: {
    week: number;
    milestone: string;
    expected_outcome: string;
  }[];
  weekly_structure: {
    monday: DailyPlanTemplate;
    tuesday: DailyPlanTemplate;
    wednesday: DailyPlanTemplate;
    thursday: DailyPlanTemplate;
    friday: DailyPlanTemplate;
    saturday: DailyPlanTemplate;
    sunday: DailyPlanTemplate;
  };
  nutrition_guidelines: {
    daily_calories: number;
    macronutrient_breakdown: {
      protein_percentage: number;
      carbs_percentage: number;
      fat_percentage: number;
    };
    meal_timing: {
      breakfast: string;
      lunch: string;
      dinner: string;
      snacks: string[];
    };
    hydration_goals: {
      daily_water_intake: number;
      timing_recommendations: string[];
    };
  };
  recovery_protocols: {
    sleep_requirements: {
      hours: number;
      bedtime: string;
      wake_time: string;
    };
    rest_day_activities: string[];
    stress_management: string[];
    injury_prevention: string[];
  };
  adaptation_rules: {
    beginner_modifications: string[];
    advanced_progressions: string[];
    injury_adaptations: string[];
    time_constraints: string[];
  };
}

export interface DailyPlanTemplate {
  day_type: 'workout' | 'rest' | 'active_recovery' | 'flexible';
  theme: string;
  activities: ActivityTemplate[];
  nutrition_focus: string;
  recovery_emphasis: string;
}

export interface ActivityTemplate {
  id: string;
  title: string;
  category: 'wake_up' | 'exercise' | 'nutrition' | 'work' | 'recovery' | 'sleep' | 'hydration' | 'mindfulness';
  time_slot: string;
  duration_minutes: number;
  intensity: 'low' | 'medium' | 'high';
  description: string;
  instructions: string[];
  equipment: string[];
  modifications: {
    beginner: string;
    intermediate: string;
    advanced: string;
  };
  benefits: string[];
  prerequisites: string[];
  alternatives: string[];
}

export interface DailySchedule {
  id: string;
  user_id: string;
  plan_id: string;
  date: string;
  day_of_week: string;
  day_type: 'workout' | 'rest' | 'active_recovery' | 'flexible';
  activities: ScheduledActivity[];
  nutrition_plan: DailyNutritionPlan;
  recovery_focus: string[];
  progress_notes: string;
  completion_status: 'pending' | 'in_progress' | 'completed' | 'skipped';
  created_at: string;
  updated_at: string;
}

export interface ScheduledActivity {
  id: string;
  template_id: string;
  title: string;
  category: string;
  scheduled_time: string;
  duration_minutes: number;
  intensity: string;
  description: string;
  instructions: string[];
  equipment: string[];
  status: 'pending' | 'in_progress' | 'completed' | 'skipped';
  completion_notes: string;
  actual_duration: number;
  difficulty_rating: number;
  satisfaction_rating: number;
}

export interface DailyNutritionPlan {
  date: string;
  total_calories: number;
  meals: {
    breakfast: MealPlan;
    lunch: MealPlan;
    dinner: MealPlan;
    snacks: MealPlan[];
  };
  hydration: {
    target_water_intake: number;
    timing_schedule: string[];
    current_intake: number;
  };
  supplements: {
    name: string;
    timing: string;
    dosage: string;
    notes: string;
  }[];
}

export interface MealPlan {
  name: string;
  time: string;
  calories: number;
  macronutrients: {
    protein: number;
    carbs: number;
    fat: number;
  };
  ingredients: string[];
  preparation_time: number;
  instructions: string[];
  alternatives: string[];
  dietary_restrictions: string[];
}

export interface PlanGenerationRequest {
  user_profile: UserOnboardingData;
  health_score: number;
  health_analysis: string;
  recommendations: string[];
  selected_plan_type?: string;
  customization_preferences?: {
    workout_intensity: 'low' | 'medium' | 'high';
    time_availability: number;
    equipment_access: string[];
    dietary_preferences: string[];
  };
}

export interface ScheduleGenerationRequest {
  plan_data: DetailedPlan;
  user_profile: UserOnboardingData;
  target_date: string;
  previous_day_performance?: {
    completion_rate: number;
    difficulty_feedback: number;
    energy_levels: number;
    notes: string;
  };
  weather_conditions?: {
    temperature: number;
    conditions: string;
    outdoor_suitable: boolean;
  };
  special_events?: {
    type: string;
    time: string;
    impact_on_schedule: 'low' | 'medium' | 'high';
  }[];
}

export interface MidnightUpdateRequest {
  user_id: string;
  plan_id: string;
  current_date: string;
  previous_day_data: {
    completion_rate: number;
    activities_completed: number;
    total_activities: number;
    user_feedback: {
      difficulty_rating: number;
      energy_levels: number;
      satisfaction: number;
      notes: string;
    };
  };
  adaptation_needed: boolean;
  reason_for_adaptation?: string;
}

export interface PlanProgress {
  user_id: string;
  plan_id: string;
  current_week: number;
  total_weeks: number;
  overall_completion_rate: number;
  weekly_completion_rates: {
    week: number;
    completion_rate: number;
    activities_completed: number;
    total_activities: number;
  }[];
  milestone_achievements: {
    milestone: string;
    achieved_date: string;
    notes: string;
  }[];
  adaptation_history: {
    date: string;
    reason: string;
    changes_made: string[];
    impact: string;
  }[];
  next_milestone: {
    week: number;
    milestone: string;
    requirements: string[];
    estimated_achievement_date: string;
  };
}
