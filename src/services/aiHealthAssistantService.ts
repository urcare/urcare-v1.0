import { supabase } from '@/integrations/supabase/client';
import { env } from '@/config/environment';

export interface UserHealthProfile {
  age: number;
  gender: 'male' | 'female' | 'other';
  bodyType: 'ectomorph' | 'mesomorph' | 'endomorph';
  foodPreferences: string[];
  allergies: string[];
  healthConditions: string[];
  medications: {
    name: string;
    timing: string;
    instructions: string;
    interactions?: string[];
  }[];
  workSchedule: {
    start: string;
    end: string;
    type: 'desk' | 'active' | 'mixed';
  };
  sleepPattern: {
    bedtime: string;
    wakeTime: string;
    quality: 'poor' | 'fair' | 'good' | 'excellent';
  };
  stressLevel: 'low' | 'moderate' | 'high' | 'very-high';
  fitnessGoals: string[];
  currentFitnessLevel: 'beginner' | 'intermediate' | 'advanced';
  height: number; // in cm
  weight: number; // in kg
  activityLevel: 'sedentary' | 'lightly-active' | 'moderately-active' | 'very-active' | 'extremely-active';
}

export interface DailyScheduleItem {
  time: string;
  activity: string;
  category: 'nutrition' | 'exercise' | 'detox' | 'medication' | 'lifestyle';
  duration?: string;
  instructions?: string;
  notes?: string;
}

export interface PersonalizedDailyPlan {
  date: string;
  userProfile: UserHealthProfile;
  schedule: DailyScheduleItem[];
  nutritionSummary: {
    totalCalories: number;
    protein: number;
    carbs: number;
    fats: number;
    hydration: number;
  };
  exerciseSummary: {
    totalDuration: number;
    types: string[];
    intensity: string;
  };
  detoxSummary: {
    strategies: string[];
    hydrationTarget: number;
  };
  medicationSchedule: {
    medications: Array<{
      name: string;
      time: string;
      instructions: string;
      taken: boolean;
    }>;
    interactions: string[];
  };
  lifestyleTips: string[];
  keyTakeaways: string[];
  warnings: string[];
}

class AIHealthAssistantService {
  private readonly OPENAI_API_KEY = env.OPENAI_API_KEY;
  private readonly OPENAI_ENDPOINT = 'https://api.openai.com/v1/chat/completions';

  /**
   * Generate personalized daily plan based on user health profile
   */
  async generateDailyPlan(profile: UserHealthProfile): Promise<PersonalizedDailyPlan> {
    try {
      // If OpenAI is available, use it for advanced generation
      if (this.OPENAI_API_KEY) {
        return await this.generateWithAI(profile);
      } else {
        // Fallback to rule-based generation
        return this.generateRuleBased(profile);
      }
    } catch (error) {
      console.error('Error generating daily plan:', error);
      // Always fallback to rule-based generation
      return this.generateRuleBased(profile);
    }
  }

  /**
   * Generate plan using OpenAI API
   */
  private async generateWithAI(profile: UserHealthProfile): Promise<PersonalizedDailyPlan> {
    const prompt = this.buildAIPrompt(profile);
    
    try {
      const response = await fetch(this.OPENAI_ENDPOINT, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.OPENAI_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-4',
          messages: [
            {
              role: 'system',
              content: 'You are an expert AI health assistant for the UrCare app. Generate personalized daily health plans integrating nutrition, exercise, detoxification, medication optimization, and lifestyle factors. Return only valid JSON.'
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          temperature: 0.7,
          max_tokens: 2000
        })
      });

      if (!response.ok) {
        throw new Error(`OpenAI API error: ${response.status}`);
      }

      const data = await response.json();
      const aiResponse = data.choices[0]?.message?.content;
      
      if (!aiResponse) {
        throw new Error('No response from AI');
      }

      // Parse AI response and validate
      const parsedPlan = JSON.parse(aiResponse);
      return this.validateAndEnhancePlan(parsedPlan, profile);
      
    } catch (error) {
      console.error('AI generation failed, falling back to rule-based:', error);
      return this.generateRuleBased(profile);
    }
  }

  /**
   * Build comprehensive AI prompt
   */
  private buildAIPrompt(profile: UserHealthProfile): string {
    return `Generate a personalized daily health plan for the following user profile. Return a JSON response with the exact structure specified.

USER PROFILE:
${JSON.stringify(profile, null, 2)}

REQUIREMENTS:
1. Create a detailed hour-by-hour daily schedule (24 hours)
2. Integrate all 5 health dimensions: nutrition, exercise, detoxification, medication optimization, lifestyle
3. Consider user's work schedule, sleep pattern, and stress level
4. Provide specific, actionable instructions for each activity
5. Include proper meal timing and portion guidance
6. Optimize medication timing based on instructions
7. Include stress management and relaxation techniques
8. Ensure realistic and achievable recommendations

OUTPUT FORMAT (return only valid JSON):
{
  "schedule": [
    {
      "time": "07:00",
      "activity": "Wake up and morning detox",
      "category": "detox",
      "duration": "15 minutes",
      "instructions": "Drink 500ml warm water with lemon",
      "notes": "Stimulates digestion and detoxification"
    }
  ],
  "nutritionSummary": {
    "totalCalories": 2000,
    "protein": 150,
    "carbs": 200,
    "fats": 67,
    "hydration": 2500
  },
  "exerciseSummary": {
    "totalDuration": 45,
    "types": ["cardio", "strength"],
    "intensity": "moderate"
  },
  "detoxSummary": {
    "strategies": ["morning hydration", "herbal teas", "evening wind-down"],
    "hydrationTarget": 2500
  },
  "medicationSchedule": {
    "medications": [
      {
        "name": "Blood pressure medication",
        "time": "08:00",
        "instructions": "Take after breakfast",
        "taken": false
      }
    ],
    "interactions": []
  },
  "lifestyleTips": ["Practice deep breathing", "Take regular breaks"],
  "keyTakeaways": ["Focus on consistent meal timing", "Prioritize stress management"],
  "warnings": ["Consult doctor before starting new exercise routine"]
}

Ensure all times are in 24-hour format (HH:MM) and activities are practical and safe.`;
  }

  /**
   * Generate rule-based plan as fallback
   */
  private generateRuleBased(profile: UserHealthProfile): PersonalizedDailyPlan {
    const schedule = this.generateDailySchedule(profile);
    const nutritionSummary = this.calculateNutrition(profile);
    const exerciseSummary = this.generateExercisePlan(profile);
    const detoxSummary = this.generateDetoxPlan(profile);
    const medicationSchedule = this.optimizeMedicationSchedule(profile);
    const lifestyleTips = this.generateLifestyleTips(profile);
    const keyTakeaways = this.generateKeyTakeaways(profile);
    const warnings = this.generateWarnings(profile);

    return {
      date: new Date().toISOString().split('T')[0],
      userProfile: profile,
      schedule,
      nutritionSummary,
      exerciseSummary,
      detoxSummary,
      medicationSchedule,
      lifestyleTips,
      keyTakeaways,
      warnings
    };
  }

  /**
   * Generate daily schedule based on user profile
   */
  private generateDailySchedule(profile: UserHealthProfile): DailyScheduleItem[] {
    const schedule: DailyScheduleItem[] = [];
    const wakeTime = this.parseTime(profile.sleepPattern.wakeTime);
    const bedtime = this.parseTime(profile.sleepPattern.bedtime);
    const workStart = this.parseTime(profile.workSchedule.start);
    const workEnd = this.parseTime(profile.workSchedule.end);

    // Morning routine (wake up to work start)
    schedule.push({
      time: this.formatTime(wakeTime),
      activity: 'Wake up and morning detox',
      category: 'detox',
      duration: '15 minutes',
      instructions: 'Drink 500ml warm water with lemon for detoxification',
      notes: 'Stimulates digestion and metabolism'
    });

    // Add medication if scheduled for morning
    const morningMeds = profile.medications.filter(m => 
      m.timing.includes('morning') || m.timing.includes('breakfast')
    );
    if (morningMeds.length > 0) {
      schedule.push({
        time: this.formatTime(new Date(wakeTime.getTime() + 30 * 60000)), // 30 min after wake
        activity: 'Take morning medications',
        category: 'medication',
        instructions: morningMeds.map(m => `${m.name}: ${m.instructions}`).join(', '),
        notes: 'Follow medication schedule precisely'
      });
    }

    // Pre-workout (if applicable)
    if (profile.fitnessGoals.includes('weight loss') || profile.fitnessGoals.includes('fitness')) {
      schedule.push({
        time: this.formatTime(new Date(wakeTime.getTime() + 45 * 60000)), // 45 min after wake
        activity: 'Morning exercise session',
        category: 'exercise',
        duration: '30 minutes',
        instructions: 'Light cardio or yoga to boost metabolism',
        notes: 'Start with low intensity, gradually increase'
      });
    }

    // Breakfast
    schedule.push({
      time: this.formatTime(new Date(wakeTime.getTime() + 60 * 60000)), // 1 hour after wake
      activity: 'Breakfast',
      category: 'nutrition',
      duration: '30 minutes',
      instructions: this.generateMealInstructions('breakfast', profile),
      notes: 'Eat mindfully, avoid rushing'
    });

    // Work period with breaks
    if (workStart && workEnd) {
      schedule.push({
        time: this.formatTime(workStart),
        activity: 'Start work',
        category: 'lifestyle',
        notes: 'Maintain good posture, take regular breaks'
      });

      // Mid-morning break
      const midMorning = new Date(workStart.getTime() + 2 * 60 * 60000); // 2 hours after work start
      schedule.push({
        time: this.formatTime(midMorning),
        activity: 'Mid-morning break and snack',
        category: 'nutrition',
        duration: '15 minutes',
        instructions: 'Healthy snack + hydration break',
        notes: 'Step away from desk, stretch'
      });

      // Lunch
      const lunchTime = new Date(workStart.getTime() + 4 * 60 * 60000); // 4 hours after work start
      schedule.push({
        time: this.formatTime(lunchTime),
        activity: 'Lunch break',
        category: 'nutrition',
        duration: '45 minutes',
        instructions: this.generateMealInstructions('lunch', profile),
        notes: 'Eat away from desk, practice mindful eating'
      });

      // Afternoon break
      const afternoonBreak = new Date(workStart.getTime() + 6 * 60 * 60000); // 6 hours after work start
      schedule.push({
        time: this.formatTime(afternoonBreak),
        activity: 'Afternoon break and movement',
        category: 'lifestyle',
        duration: '15 minutes',
        instructions: 'Quick walk or desk stretches',
        notes: 'Reduce sedentary behavior, boost energy'
      });
    }

    // After work activities
    if (workEnd) {
      const postWork = new Date(workEnd.getTime() + 30 * 60000); // 30 min after work
      schedule.push({
        time: this.formatTime(postWork),
        activity: 'Post-work exercise',
        category: 'exercise',
        duration: '45 minutes',
        instructions: this.generateExerciseInstructions(profile),
        notes: 'Release work stress, improve fitness'
      });
    }

    // Dinner
    const dinnerTime = new Date(wakeTime.getTime() + 13 * 60 * 60000); // 13 hours after wake
    schedule.push({
      time: this.formatTime(dinnerTime),
      activity: 'Dinner',
      category: 'nutrition',
      duration: '45 minutes',
      instructions: this.generateMealInstructions('dinner', profile),
      notes: 'Light meal, avoid heavy foods before bed'
    });

    // Evening routine
    const eveningStart = new Date(wakeTime.getTime() + 15 * 60 * 60000); // 15 hours after wake
    schedule.push({
      time: this.formatTime(eveningStart),
      activity: 'Evening wind-down and detox',
      category: 'detox',
      duration: '30 minutes',
      instructions: 'Herbal tea, light stretching, relaxation',
      notes: 'Prepare body and mind for sleep'
    });

    // Stress management
    const stressTime = new Date(wakeTime.getTime() + 16 * 60 * 60000); // 16 hours after wake
    schedule.push({
      time: this.formatTime(stressTime),
      activity: 'Stress management session',
      category: 'lifestyle',
      duration: '20 minutes',
      instructions: this.generateStressManagementInstructions(profile),
      notes: 'Essential for high-stress individuals'
    });

    // Bedtime routine
    const bedRoutine = new Date(bedtime.getTime() - 30 * 60000); // 30 min before bed
    schedule.push({
      time: this.formatTime(bedRoutine),
      activity: 'Bedtime routine',
      category: 'lifestyle',
      duration: '30 minutes',
      instructions: 'Avoid screens, read, practice relaxation',
      notes: 'Improve sleep quality'
    });

    // Sleep
    schedule.push({
      time: this.formatTime(bedtime),
      activity: 'Sleep',
      category: 'lifestyle',
      duration: '8 hours',
      notes: 'Essential for recovery and health'
    });

    return schedule;
  }

  /**
   * Calculate nutrition requirements
   */
  private calculateNutrition(profile: UserHealthProfile) {
    // Calculate BMR using Mifflin-St Jeor Equation
    let bmr: number;
    if (profile.gender === 'male') {
      bmr = 10 * profile.weight + 6.25 * profile.height - 5 * profile.age + 5;
    } else {
      bmr = 10 * profile.weight + 6.25 * profile.height - 5 * profile.age - 161;
    }

    // Apply activity multiplier
    const activityMultipliers = {
      'sedentary': 1.2,
      'lightly-active': 1.375,
      'moderately-active': 1.55,
      'very-active': 1.725,
      'extremely-active': 1.9
    };

    const tdee = bmr * activityMultipliers[profile.activityLevel];

    // Adjust for goals
    let targetCalories = tdee;
    if (profile.fitnessGoals.includes('weight loss')) {
      targetCalories = tdee - 500; // 500 calorie deficit
    } else if (profile.fitnessGoals.includes('muscle gain')) {
      targetCalories = tdee + 300; // 300 calorie surplus
    }

    // Calculate macros
    const protein = profile.weight * 1.6; // 1.6g per kg body weight
    const fats = (targetCalories * 0.25) / 9; // 25% of calories
    const carbs = (targetCalories - (protein * 4) - (fats * 9)) / 4; // Remaining calories

    return {
      totalCalories: Math.round(targetCalories),
      protein: Math.round(protein),
      carbs: Math.round(carbs),
      fats: Math.round(fats),
      hydration: profile.weight * 33 // 33ml per kg body weight
    };
  }

  /**
   * Generate exercise plan
   */
  private generateExercisePlan(profile: UserHealthProfile) {
    const isWeightLoss = profile.fitnessGoals.includes('weight loss');
    const isMuscleGain = profile.fitnessGoals.includes('muscle gain');
    const isFitness = profile.fitnessGoals.includes('fitness');

    let totalDuration = 30;
    let types: string[] = [];
    let intensity = 'moderate';

    if (isWeightLoss) {
      totalDuration = 45;
      types = ['cardio', 'strength', 'hiit'];
      intensity = 'moderate-to-high';
    } else if (isMuscleGain) {
      totalDuration = 60;
      types = ['strength', 'resistance', 'cardio'];
      intensity = 'moderate';
    } else if (isFitness) {
      totalDuration = 40;
      types = ['cardio', 'strength', 'flexibility'];
      intensity = 'moderate';
    }

    // Adjust for age and fitness level
    if (profile.age > 50) {
      totalDuration = Math.min(totalDuration, 45);
      intensity = 'low-to-moderate';
    }

    if (profile.currentFitnessLevel === 'beginner') {
      totalDuration = Math.min(totalDuration, 30);
      intensity = 'low';
    }

    return {
      totalDuration,
      types,
      intensity
    };
  }

  /**
   * Generate detox plan
   */
  private generateDetoxPlan(profile: UserHealthProfile) {
    const strategies = [
      'morning hydration with lemon water',
      'regular water intake throughout day',
      'herbal teas (green tea, chamomile)',
      'evening wind-down routine',
      'stress reduction techniques'
    ];

    if (profile.healthConditions.includes('digestive issues')) {
      strategies.push('probiotic-rich foods');
      strategies.push('fiber-rich meals');
    }

    return {
      strategies,
      hydrationTarget: profile.weight * 33
    };
  }

  /**
   * Optimize medication schedule
   */
  private optimizeMedicationSchedule(profile: UserHealthProfile) {
    const medications = profile.medications.map(med => ({
      name: med.name,
      time: this.optimizeMedicationTiming(med.timing, profile),
      instructions: med.instructions,
      taken: false
    }));

    const interactions = profile.medications
      .filter(med => med.interactions && med.interactions.length > 0)
      .flatMap(med => med.interactions);

    return {
      medications,
      interactions
    };
  }

  /**
   * Generate lifestyle tips
   */
  private generateLifestyleTips(profile: UserHealthProfile): string[] {
    const tips = [
      'Take regular breaks from screen time',
      'Practice deep breathing exercises',
      'Maintain good posture during work',
      'Stay hydrated throughout the day'
    ];

    if (profile.stressLevel === 'high' || profile.stressLevel === 'very-high') {
      tips.push('Schedule stress management sessions');
      tips.push('Practice mindfulness meditation');
      tips.push('Take short walks during breaks');
    }

    if (profile.workSchedule.type === 'desk') {
      tips.push('Use standing desk when possible');
      tips.push('Take stairs instead of elevator');
      tips.push('Walk during phone calls');
    }

    return tips;
  }

  /**
   * Generate key takeaways
   */
  private generateKeyTakeaways(profile: UserHealthProfile): string[] {
    const takeaways = [
      'Consistency is key to health improvement',
      'Listen to your body and adjust accordingly',
      'Small changes lead to big results over time'
    ];

    if (profile.fitnessGoals.includes('weight loss')) {
      takeaways.push('Focus on sustainable lifestyle changes');
      takeaways.push('Combine diet and exercise for best results');
    }

    if (profile.stressLevel === 'high') {
      takeaways.push('Prioritize stress management daily');
      takeaways.push('Quality sleep is essential for recovery');
    }

    return takeaways;
  }

  /**
   * Generate warnings
   */
  private generateWarnings(profile: UserHealthProfile): string[] {
    const warnings = [
      'Consult healthcare provider before starting new exercise routine',
      'Stop any activity that causes pain or discomfort',
      'Monitor blood pressure if you have hypertension'
    ];

    if (profile.healthConditions.length > 0) {
      warnings.push('Follow medical advice for existing conditions');
      warnings.push('Report any unusual symptoms to your doctor');
    }

    if (profile.medications.length > 0) {
      warnings.push('Take medications exactly as prescribed');
      warnings.push('Be aware of potential drug interactions');
    }

    return warnings;
  }

  /**
   * Helper methods
   */
  private parseTime(timeStr: string): Date {
    const [hours, minutes] = timeStr.split(':').map(Number);
    const date = new Date();
    date.setHours(hours, minutes, 0, 0);
    return date;
  }

  private formatTime(date: Date): string {
    return date.toTimeString().slice(0, 5);
  }

  private generateMealInstructions(mealType: string, profile: UserHealthProfile): string {
    const baseInstructions = {
      breakfast: 'Balanced meal with protein, complex carbs, and healthy fats',
      lunch: 'Moderate portion with lean protein, vegetables, and whole grains',
      dinner: 'Light meal focusing on protein and vegetables'
    };

    let instructions = baseInstructions[mealType as keyof typeof baseInstructions];

    if (profile.foodPreferences.includes('vegetarian')) {
      instructions += ' (vegetarian options)';
    }

    if (profile.allergies.length > 0) {
      instructions += ` (avoid: ${profile.allergies.join(', ')})`;
    }

    return instructions;
  }

  private generateExerciseInstructions(profile: UserHealthProfile): string {
    if (profile.fitnessGoals.includes('weight loss')) {
      return 'Cardio + strength training, focus on compound movements';
    } else if (profile.fitnessGoals.includes('muscle gain')) {
      return 'Progressive resistance training with adequate rest periods';
    } else {
      return 'Mix of cardio, strength, and flexibility exercises';
    }
  }

  private generateStressManagementInstructions(profile: UserHealthProfile): string {
    if (profile.stressLevel === 'very-high') {
      return 'Deep breathing, progressive muscle relaxation, guided meditation';
    } else if (profile.stressLevel === 'high') {
      return 'Mindfulness practice, journaling, light stretching';
    } else {
      return 'Relaxation techniques, hobby time, social connection';
    }
  }

  private optimizeMedicationTiming(timing: string, profile: UserHealthProfile): string {
    if (timing.includes('breakfast')) {
      return this.formatTime(new Date(this.parseTime(profile.sleepPattern.wakeTime).getTime() + 60 * 60000));
    } else if (timing.includes('lunch')) {
      return '13:00';
    } else if (timing.includes('dinner')) {
      return '19:00';
    } else if (timing.includes('bedtime')) {
      return this.formatTime(new Date(this.parseTime(profile.sleepPattern.bedtime).getTime() - 30 * 60000));
    }
    return timing;
  }

  /**
   * Validate and enhance AI-generated plan
   */
  private validateAndEnhancePlan(aiPlan: any, profile: UserHealthProfile): PersonalizedDailyPlan {
    // Basic validation and enhancement logic
    // This would include more sophisticated validation in production
    return {
      date: new Date().toISOString().split('T')[0],
      userProfile: profile,
      schedule: aiPlan.schedule || this.generateDailySchedule(profile),
      nutritionSummary: aiPlan.nutritionSummary || this.calculateNutrition(profile),
      exerciseSummary: aiPlan.exerciseSummary || this.generateExercisePlan(profile),
      detoxSummary: aiPlan.detoxSummary || this.generateDetoxPlan(profile),
      medicationSchedule: aiPlan.medicationSchedule || this.optimizeMedicationSchedule(profile),
      lifestyleTips: aiPlan.lifestyleTips || this.generateLifestyleTips(profile),
      keyTakeaways: aiPlan.keyTakeaways || this.generateKeyTakeaways(profile),
      warnings: aiPlan.warnings || this.generateWarnings(profile)
    };
  }

  /**
   * Save generated plan to database
   */
  async savePlan(userId: string, plan: PersonalizedDailyPlan): Promise<void> {
    try {
      const { error } = await supabase
        .from('daily_health_plans')
        .insert({
          user_id: userId,
          plan_data: plan,
          generated_at: new Date().toISOString()
        });

      if (error) throw error;
    } catch (error) {
      console.error('Error saving plan:', error);
      throw error;
    }
  }

  /**
   * Get user's latest plan
   */
  async getLatestPlan(userId: string): Promise<PersonalizedDailyPlan | null> {
    try {
      const { data, error } = await supabase
        .from('daily_health_plans')
        .select('plan_data')
        .eq('user_id', userId)
        .order('generated_at', { ascending: false })
        .limit(1)
        .single();

      if (error) throw error;
      return data?.plan_data || null;
    } catch (error) {
      console.error('Error fetching plan:', error);
      return null;
    }
  }
}

export const aiHealthAssistantService = new AIHealthAssistantService();
export default aiHealthAssistantService;
