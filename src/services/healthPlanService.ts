import { supabase } from '../integrations/supabase/client';

export interface HealthMetrics {
  bmi: number;
  bmr: number;
  tdee: number;
  healthScore: number;
  weightStatus: string;
}

export interface NutritionPlan {
  dailyCalories: number;
  protein: {
    grams: number;
    percentage: number;
    sources: string[];
  };
  carbohydrates: {
    grams: number;
    percentage: number;
    sources: string[];
  };
  fats: {
    grams: number;
    percentage: number;
    sources: string[];
  };
  mealTiming: {
    breakfast: string;
    lunch: string;
    dinner: string;
    snacks: string[];
  };
  hydration: number; // liters per day
  sampleMeals: {
    breakfast: string[];
    lunch: string[];
    dinner: string[];
    snacks: string[];
  };
}

export interface WorkoutPlan {
  frequency: number; // days per week
  duration: number; // minutes per session
  types: {
    cardio: string[];
    strength: string[];
    flexibility: string[];
    recovery: string[];
  };
  schedule: {
    [key: string]: {
      type: string;
      exercises: string[];
      duration: number;
      intensity: string;
    };
  };
  progression: {
    week1: string[];
    week2: string[];
    week3: string[];
    week4: string[];
  };
}

export interface LifestylePlan {
  sleep: {
    recommendedHours: number;
    schedule: string;
    tips: string[];
  };
  stressManagement: string[];
  dailyRoutine: {
    morning: string[];
    afternoon: string[];
    evening: string[];
  };
  habits: string[];
}

export interface HealthPlan {
  userProfile: any;
  metrics: HealthMetrics;
  nutrition: NutritionPlan;
  workout: WorkoutPlan;
  lifestyle: LifestylePlan;
  monitoring: {
    keyMetrics: string[];
    frequency: string;
    warningSigns: string[];
  };
  nextSteps: {
    immediate: string[];
    weekly: string[];
    monthly: string[];
  };
  generatedAt: string;
}

class HealthPlanService {
  /**
   * Generate comprehensive health plan based on user onboarding data
   */
  async generateHealthPlan(userId: string): Promise<HealthPlan> {
    try {
      // Get user profile and onboarding data
      const { data: profile, error: profileError } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (profileError || !profile) {
        throw new Error('User profile not found');
      }

      // Calculate health metrics
      const metrics = this.calculateHealthMetrics(profile);
      
      // Generate nutrition plan
      const nutrition = this.generateNutritionPlan(profile, metrics);
      
      // Generate workout plan
      const workout = this.generateWorkoutPlan(profile, metrics);
      
      // Generate lifestyle plan
      const lifestyle = this.generateLifestylePlan(profile);
      
      // Generate monitoring and next steps
      const monitoring = this.generateMonitoringPlan(profile, metrics);
      const nextSteps = this.generateNextSteps(profile, metrics);

      const healthPlan: HealthPlan = {
        userProfile: profile,
        metrics,
        nutrition,
        workout,
        lifestyle,
        monitoring,
        nextSteps,
        generatedAt: new Date().toISOString()
      };

      // Save the generated plan to database
      await this.saveHealthPlan(userId, healthPlan);

      return healthPlan;
    } catch (error) {
      console.error('Error generating health plan:', error);
      throw error;
    }
  }

  /**
   * Calculate real health metrics based on user data
   */
  private calculateHealthMetrics(profile: any): HealthMetrics {
    const age = profile.age || 30;
    const gender = (profile.gender || 'male').toLowerCase();
    const heightCm = profile.height_cm || 170;
    const weightKg = profile.weight_kg || 70;
    
    // Calculate BMI
    const heightM = heightCm / 100;
    const bmi = weightKg / (heightM * heightM);
    
    // Calculate BMR using Mifflin-St Jeor Equation
    let bmr: number;
    if (gender === 'male') {
      bmr = 10 * weightKg + 6.25 * heightCm - 5 * age + 5;
    } else {
      bmr = 10 * weightKg + 6.25 * heightCm - 5 * age - 161;
    }
    
    // Calculate TDEE (Total Daily Energy Expenditure)
    // Using moderate activity level (1.55) as default
    const tdee = Math.round(bmr * 1.55);
    
    // Calculate health score (0-100)
    let healthScore = 50; // Base score
    
    // BMI scoring
    if (bmi >= 18.5 && bmi <= 24.9) {
      healthScore += 20; // Normal BMI
    } else if (bmi >= 17 && bmi < 18.5 || bmi > 24.9 && bmi <= 29.9) {
      healthScore += 10; // Slightly underweight or overweight
    } else if (bmi < 17 || bmi > 29.9) {
      healthScore += 5; // Very underweight or obese
    }
    
    // Age scoring
    if (age >= 18 && age <= 65) {
      healthScore += 15; // Prime age range
    } else if (age > 65) {
      healthScore += 10; // Senior but healthy
    }
    
    // Health conditions scoring
    if (!profile.chronic_conditions || profile.chronic_conditions.length === 0) {
      healthScore += 10;
    }
    
    // Lifestyle scoring
    if (profile.sleep_quality === 'good' || profile.sleep_quality === 'excellent') {
      healthScore += 5;
    }
    
    // Cap score at 100
    healthScore = Math.min(healthScore, 100);
    
    // Determine weight status
    let weightStatus: string;
    if (bmi < 18.5) {
      weightStatus = 'Underweight';
    } else if (bmi >= 18.5 && bmi < 25) {
      weightStatus = 'Normal Weight';
    } else if (bmi >= 25 && bmi < 30) {
      weightStatus = 'Overweight';
    } else {
      weightStatus = 'Obese';
    }

    return {
      bmi: Math.round(bmi * 10) / 10,
      bmr: Math.round(bmr),
      tdee,
      healthScore,
      weightStatus
    };
  }

  /**
   * Generate personalized nutrition plan
   */
  private generateNutritionPlan(profile: any, metrics: HealthMetrics): NutritionPlan {
    const { tdee, weightStatus } = metrics;
    const dietType = profile.diet_type || 'Balanced';
    const healthGoals = profile.health_goals || [];
    
    // Adjust calories based on goals
    let dailyCalories = tdee;
    if (healthGoals.includes('Lose Weight')) {
      dailyCalories = Math.round(tdee * 0.85); // 15% deficit
    } else if (healthGoals.includes('Gain Weight')) {
      dailyCalories = Math.round(tdee * 1.15); // 15% surplus
    }
    
    // Calculate macronutrients
    const proteinGrams = Math.round(profile.weight_kg * 1.6); // 1.6g per kg body weight
    const proteinCalories = proteinGrams * 4;
    const proteinPercentage = Math.round((proteinCalories / dailyCalories) * 100);
    
    const fatPercentage = 25; // 25% of calories
    const fatCalories = Math.round((dailyCalories * fatPercentage) / 100);
    const fatGrams = Math.round(fatCalories / 9);
    
    const carbCalories = dailyCalories - proteinCalories - fatCalories;
    const carbGrams = Math.round(carbCalories / 4);
    const carbPercentage = Math.round((carbCalories / dailyCalories) * 100);
    
    // Generate meal timing based on user preferences
    const mealTiming = {
      breakfast: profile.breakfast_time || '07:00',
      lunch: profile.lunch_time || '12:00',
      dinner: profile.dinner_time || '19:00',
      snacks: ['10:00', '15:00', '21:00']
    };
    
    // Generate sample meals based on diet type and goals
    const sampleMeals = this.generateSampleMeals(dietType, healthGoals, dailyCalories);
    
    return {
      dailyCalories,
      protein: {
        grams: proteinGrams,
        percentage: proteinPercentage,
        sources: this.getProteinSources(dietType)
      },
      carbohydrates: {
        grams: carbGrams,
        percentage: carbPercentage,
        sources: this.getCarbSources(dietType)
      },
      fats: {
        grams: fatGrams,
        percentage: fatPercentage,
        sources: this.getFatSources(dietType)
      },
      mealTiming,
      hydration: Math.round((profile.weight_kg * 0.033) * 10) / 10, // 33ml per kg body weight
      sampleMeals
    };
  }

  /**
   * Generate personalized workout plan
   */
  private generateWorkoutPlan(profile: any, metrics: HealthMetrics): WorkoutPlan {
    const healthGoals = profile.health_goals || [];
    const workoutTime = profile.workout_time || 'Morning (06:00-10:00)';
    const routineFlexibility = parseInt(profile.routine_flexibility || '5');
    const age = profile.age || 30;
    
    // Determine workout frequency based on goals and flexibility
    let frequency = 3; // Default 3 days per week
    if (healthGoals.includes('Build Muscle') || healthGoals.includes('Improve Fitness')) {
      frequency = 4;
    } else if (healthGoals.includes('Weight Loss')) {
      frequency = 5;
    }
    
    // Adjust for age and flexibility
    if (age > 50) {
      frequency = Math.min(frequency, 4); // Reduce frequency for older adults
    }
    
    if (routineFlexibility < 3) {
      frequency = Math.min(frequency, 3); // Reduce frequency for less flexible routines
    }
    
    // Determine workout duration
    let duration = 45; // Default 45 minutes
    if (frequency >= 5) {
      duration = 30; // Shorter sessions for more frequent workouts
    } else if (frequency <= 2) {
      duration = 60; // Longer sessions for fewer workouts
    }
    
    // Generate exercise types based on goals
    const types = this.generateExerciseTypes(healthGoals, age);
    
    // Generate weekly schedule
    const schedule = this.generateWorkoutSchedule(frequency, types, workoutTime);
    
    // Generate progression plan
    const progression = this.generateWorkoutProgression(healthGoals, frequency);
    
    return {
      frequency,
      duration,
      types,
      schedule,
      progression
    };
  }

  /**
   * Generate lifestyle optimization plan
   */
  private generateLifestylePlan(profile: any): LifestylePlan {
    const sleepQuality = profile.sleep_quality || 'moderate';
    const stressLevel = profile.stress_level || 'moderate';
    const workStart = profile.work_start || '09:00';
    const workEnd = profile.work_end || '18:00';
    
    // Sleep recommendations
    const sleep = {
      recommendedHours: 8,
      schedule: `${profile.wake_up_time || '06:00'} - ${profile.sleep_time || '22:00'}`,
      tips: this.generateSleepTips(sleepQuality)
    };
    
    // Stress management
    const stressManagement = this.generateStressManagementTips(stressLevel);
    
    // Daily routine
    const dailyRoutine = this.generateDailyRoutine(workStart, workEnd, profile);
    
    // Habit formation
    const habits = this.generateHabits(profile.health_goals || []);
    
    return {
      sleep,
      stressManagement,
      dailyRoutine,
      habits
    };
  }

  /**
   * Generate monitoring plan
   */
  private generateMonitoringPlan(profile: any, metrics: HealthMetrics): any {
    const healthGoals = profile.health_goals || [];
    
    let keyMetrics = ['Weight', 'BMI', 'Energy Levels'];
    
    if (healthGoals.includes('Lose Weight') || healthGoals.includes('Gain Weight')) {
      keyMetrics.push('Body Measurements', 'Progress Photos');
    }
    
    if (healthGoals.includes('Build Muscle')) {
      keyMetrics.push('Strength Progress', 'Body Composition');
    }
    
    if (healthGoals.includes('Improve Fitness')) {
      keyMetrics.push('Cardiovascular Endurance', 'Workout Performance');
    }
    
    const warningSigns = [
      'Sudden weight loss/gain',
      'Persistent fatigue',
      'Unusual pain or discomfort',
      'Changes in appetite or sleep'
    ];
    
    return {
      keyMetrics,
      frequency: 'Weekly',
      warningSigns
    };
  }

  /**
   * Generate actionable next steps
   */
  private generateNextSteps(profile: any, metrics: HealthMetrics): any {
    const healthGoals = profile.health_goals || [];
    
    const immediate = [
      'Start tracking your daily food intake',
      'Schedule your first workout session',
      'Set up a sleep schedule reminder',
      'Download a water tracking app',
      'Take your "before" measurements and photos'
    ];
    
    const weekly = [
      'Weigh yourself and record progress',
      'Complete 3-4 workout sessions',
      'Review and adjust your meal plan',
      'Track your energy levels and mood',
      'Plan meals for the upcoming week'
    ];
    
    const monthly = [
      'Take progress photos and measurements',
      'Reassess your goals and adjust plans',
      'Schedule a health checkup',
      'Review your overall progress',
      'Set new monthly targets'
    ];
    
    return { immediate, weekly, monthly };
  }

  /**
   * Helper methods for generating specific plan components
   */
  private getProteinSources(dietType: string): string[] {
    if (dietType === 'Vegetarian') {
      return ['Legumes', 'Greek Yogurt', 'Quinoa', 'Tofu', 'Nuts', 'Seeds'];
    } else if (dietType === 'Vegan') {
      return ['Legumes', 'Tofu', 'Tempeh', 'Seitan', 'Nuts', 'Seeds', 'Quinoa'];
    } else {
      return ['Lean Chicken', 'Fish', 'Eggs', 'Greek Yogurt', 'Legumes', 'Lean Beef'];
    }
  }

  private getCarbSources(dietType: string): string[] {
    if (dietType === 'Low Carb') {
      return ['Leafy Greens', 'Broccoli', 'Cauliflower', 'Zucchini', 'Berries'];
    } else {
      return ['Whole Grains', 'Sweet Potatoes', 'Quinoa', 'Brown Rice', 'Oats', 'Fruits'];
    }
  }

  private getFatSources(dietType: string): string[] {
    if (dietType === 'Low Fat') {
      return ['Avocado', 'Nuts', 'Olive Oil', 'Fatty Fish'];
    } else {
      return ['Avocado', 'Nuts', 'Seeds', 'Olive Oil', 'Coconut Oil', 'Fatty Fish'];
    }
  }

  private generateSampleMeals(dietType: string, healthGoals: string[], calories: number): any {
    // This would be expanded with real meal suggestions based on diet type and goals
    const baseMeals = {
      breakfast: ['Oatmeal with berries and nuts', 'Greek yogurt with honey', 'Whole grain toast with avocado'],
      lunch: ['Grilled chicken salad', 'Quinoa bowl with vegetables', 'Turkey and vegetable wrap'],
      dinner: ['Salmon with roasted vegetables', 'Lean beef stir-fry', 'Vegetarian lentil curry'],
      snacks: ['Apple with almond butter', 'Carrot sticks with hummus', 'Greek yogurt with berries']
    };
    
    return baseMeals;
  }

  private generateExerciseTypes(healthGoals: string[], age: number): any {
    const cardio = ['Walking', 'Jogging', 'Cycling', 'Swimming', 'Rowing'];
    const strength = ['Bodyweight exercises', 'Resistance bands', 'Dumbbells', 'Kettlebells'];
    const flexibility = ['Stretching', 'Yoga', 'Pilates', 'Mobility exercises'];
    const recovery = ['Light walking', 'Stretching', 'Foam rolling', 'Rest'];
    
    // Adjust for age
    if (age > 50) {
      strength.push('Chair exercises', 'Balance training');
      cardio.push('Water aerobics', 'Low-impact cardio');
    }
    
    return { cardio, strength, flexibility, recovery };
  }

  private generateWorkoutSchedule(frequency: number, types: any, workoutTime: string): any {
    const schedule: any = {};
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    
    for (let i = 0; i < frequency; i++) {
      const day = days[i];
      if (day === 'Sunday' && frequency < 7) continue;
      
      if (i % 2 === 0) {
        schedule[day] = {
          type: 'Strength + Cardio',
          exercises: [...types.strength.slice(0, 3), ...types.cardio.slice(0, 2)],
          duration: 45,
          intensity: 'Moderate'
        };
      } else {
        schedule[day] = {
          type: 'Cardio + Flexibility',
          exercises: [...types.cardio.slice(0, 3), ...types.flexibility.slice(0, 2)],
          duration: 30,
          intensity: 'Light to Moderate'
        };
      }
    }
    
    return schedule;
  }

  private generateWorkoutProgression(healthGoals: string[], frequency: number): any {
    const progression = {
      week1: ['Focus on form and technique', 'Start with 60% intensity', 'Establish routine'],
      week2: ['Increase intensity to 70%', 'Add 1-2 exercises', 'Improve endurance'],
      week3: ['Increase intensity to 80%', 'Add resistance/weight', 'Challenge yourself'],
      week4: ['Maintain 80-85% intensity', 'Perfect form', 'Assess progress']
    };
    
    return progression;
  }

  private generateSleepTips(sleepQuality: string): string[] {
    if (sleepQuality === 'poor') {
      return [
        'Establish a consistent sleep schedule',
        'Create a relaxing bedtime routine',
        'Avoid screens 1 hour before bed',
        'Keep bedroom cool and dark',
        'Limit caffeine after 2 PM'
      ];
    } else {
      return [
        'Maintain your current sleep schedule',
        'Continue your bedtime routine',
        'Monitor sleep quality regularly'
      ];
    }
  }

  private generateStressManagementTips(stressLevel: string): string[] {
    if (stressLevel === 'high') {
      return [
        'Practice daily meditation (10-15 minutes)',
        'Take regular breaks during work',
        'Engage in physical activity',
        'Practice deep breathing exercises',
        'Consider professional help if needed'
      ];
    } else {
      return [
        'Maintain stress management practices',
        'Regular exercise and relaxation',
        'Monitor stress levels'
      ];
    }
  }

  private generateDailyRoutine(workStart: string, workEnd: string, profile: any): any {
    const wakeUp = profile.wake_up_time || '06:00';
    const sleep = profile.sleep_time || '22:00';
    
    return {
      morning: [
        `${wakeUp} - Wake up and hydrate`,
        `${profile.breakfast_time || '07:00'} - Breakfast`,
        'Morning exercise or stretching',
        `${workStart} - Start work`
      ],
      afternoon: [
        `${profile.lunch_time || '12:00'} - Lunch break`,
        'Take a short walk or stretch',
        'Stay hydrated throughout the day'
      ],
      evening: [
        `${workEnd} - End work`,
        `${profile.dinner_time || '19:00'} - Dinner`,
        'Evening workout or relaxation',
        `${sleep} - Prepare for bed`
      ]
    };
  }

  private generateHabits(healthGoals: string[]): string[] {
    const baseHabits = [
      'Drink water first thing in the morning',
      'Take the stairs instead of elevator',
      'Park further from destinations',
      'Stand up and move every hour',
      'Prepare meals in advance'
    ];
    
    if (healthGoals.includes('Lose Weight')) {
      baseHabits.push('Track all food intake', 'Weigh yourself daily');
    }
    
    if (healthGoals.includes('Build Muscle')) {
      baseHabits.push('Eat protein with every meal', 'Track workout progress');
    }
    
    return baseHabits;
  }

  /**
   * Save generated health plan to database
   */
  private async saveHealthPlan(userId: string, plan: HealthPlan): Promise<void> {
    try {
      const { error } = await supabase
        .from('health_plans')
        .upsert({
          user_id: userId,
          plan_data: plan,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }, {
          onConflict: 'user_id'
        });

      if (error) {
        console.error('Error saving health plan:', error);
      }
    } catch (error) {
      console.error('Error saving health plan:', error);
    }
  }

  /**
   * Get user's current health plan
   */
  async getUserHealthPlan(userId: string): Promise<HealthPlan | null> {
    try {
      const { data, error } = await supabase
        .from('health_plans')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (error || !data) {
        return null;
      }

      return data.plan_data;
    } catch (error) {
      console.error('Error getting user health plan:', error);
      return null;
    }
  }

  /**
   * Update health plan
   */
  async updateHealthPlan(userId: string, updates: Partial<HealthPlan>): Promise<boolean> {
    try {
      const currentPlan = await this.getUserHealthPlan(userId);
      if (!currentPlan) {
        return false;
      }

      const updatedPlan = { ...currentPlan, ...updates, updatedAt: new Date().toISOString() };

      const { error } = await supabase
        .from('health_plans')
        .update({
          plan_data: updatedPlan,
          updated_at: new Date().toISOString()
        })
        .eq('user_id', userId);

      return !error;
    } catch (error) {
      console.error('Error updating health plan:', error);
      return false;
    }
  }
}

export const healthPlanService = new HealthPlanService();
