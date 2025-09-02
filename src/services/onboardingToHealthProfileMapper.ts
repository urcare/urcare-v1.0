import { UserProfile } from '@/contexts/AuthContext';
import { UserHealthProfile } from './aiHealthAssistantService';

export class OnboardingToHealthProfileMapper {
  /**
   * Convert UserProfile from database to UserHealthProfile for AI Health Assistant
   */
  static mapToHealthProfile(profile: UserProfile): UserHealthProfile {
    // Calculate age from date of birth if available
    let age = profile.age || 30;
    if (profile.date_of_birth && !profile.age) {
      const birthDate = new Date(profile.date_of_birth);
      const today = new Date();
      age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }
    }

    // Convert height to cm
    let heightCm = profile.height_cm ? parseInt(profile.height_cm) : 170;
    if (!profile.height_cm && profile.height_feet && profile.height_inches) {
      const feet = parseInt(profile.height_feet);
      const inches = parseInt(profile.height_inches);
      heightCm = Math.round((feet * 12 + inches) * 2.54);
    }

    // Convert weight to kg
    let weightKg = profile.weight_kg ? parseInt(profile.weight_kg) : 70;
    if (!profile.weight_kg && profile.weight_lb) {
      weightKg = Math.round(parseInt(profile.weight_lb) * 0.453592);
    }

    // Determine body type based on height and weight
    const bmi = weightKg / Math.pow(heightCm / 100, 2);
    let bodyType: 'ectomorph' | 'mesomorph' | 'endomorph' = 'mesomorph';
    if (bmi < 18.5) bodyType = 'ectomorph';
    else if (bmi > 25) bodyType = 'endomorph';

    // Map food preferences
    const foodPreferences: string[] = [];
    if (profile.diet_type) {
      switch (profile.diet_type.toLowerCase()) {
        case 'vegetarian':
          foodPreferences.push('vegetarian');
          break;
        case 'vegan':
          foodPreferences.push('vegan');
          break;
        case 'keto':
          foodPreferences.push('keto');
          break;
        case 'low-carb':
          foodPreferences.push('low-carb');
          break;
        case 'gluten-free':
          foodPreferences.push('gluten-free');
          break;
        case 'dairy-free':
          foodPreferences.push('dairy-free');
          break;
      }
    }

    // Map health conditions
    const healthConditions: string[] = [];
    if (profile.chronic_conditions && profile.chronic_conditions.length > 0) {
      healthConditions.push(...profile.chronic_conditions);
    }
    if (profile.critical_conditions) {
      healthConditions.push(profile.critical_conditions);
    }

    // Map medications
    const medications = [];
    if (profile.medications && profile.medications.length > 0) {
      profile.medications.forEach(med => {
        medications.push({
          name: med,
          timing: this.determineMedicationTiming(med, profile),
          instructions: `Take as prescribed`,
          interactions: []
        });
      });
    }

    // Map fitness goals
    const fitnessGoals: string[] = [];
    if (profile.health_goals && profile.health_goals.length > 0) {
      profile.health_goals.forEach(goal => {
        const lowerGoal = goal.toLowerCase();
        if (lowerGoal.includes('weight') || lowerGoal.includes('lose')) {
          fitnessGoals.push('weight loss');
        } else if (lowerGoal.includes('muscle') || lowerGoal.includes('gain')) {
          fitnessGoals.push('muscle gain');
        } else if (lowerGoal.includes('fitness') || lowerGoal.includes('health')) {
          fitnessGoals.push('fitness');
        } else if (lowerGoal.includes('flexibility') || lowerGoal.includes('stretch')) {
          fitnessGoals.push('flexibility');
        } else if (lowerGoal.includes('endurance') || lowerGoal.includes('stamina')) {
          fitnessGoals.push('endurance');
        }
      });
    }

    // Determine fitness level based on routine flexibility and workout time
    let currentFitnessLevel: 'beginner' | 'intermediate' | 'advanced' = 'beginner';
    if (profile.routine_flexibility) {
      const flexibility = parseInt(profile.routine_flexibility);
      if (flexibility >= 7) currentFitnessLevel = 'advanced';
      else if (flexibility >= 4) currentFitnessLevel = 'intermediate';
    }

    // Determine activity level based on workout time and routine flexibility
    let activityLevel: 'sedentary' | 'lightly-active' | 'moderately-active' | 'very-active' | 'extremely-active' = 'sedentary';
    if (profile.workout_time && profile.routine_flexibility) {
      const flexibility = parseInt(profile.routine_flexibility);
      if (flexibility >= 8) activityLevel = 'extremely-active';
      else if (flexibility >= 6) activityLevel = 'very-active';
      else if (flexibility >= 4) activityLevel = 'moderately-active';
      else if (flexibility >= 2) activityLevel = 'lightly-active';
    }

    // Determine stress level based on available data
    let stressLevel: 'low' | 'moderate' | 'high' | 'very-high' = 'moderate';
    if (profile.preferences?.stress_level) {
      stressLevel = profile.preferences.stress_level;
    }

    // Determine sleep quality
    let sleepQuality: 'poor' | 'fair' | 'good' | 'excellent' = 'fair';
    if (profile.preferences?.sleep_quality) {
      sleepQuality = profile.preferences.sleep_quality;
    }

    // Map work schedule
    const workSchedule = {
      start: profile.work_start || '09:00',
      end: profile.work_end || '18:00',
      type: this.determineWorkType(profile) as 'desk' | 'active' | 'mixed'
    };

    // Map sleep pattern
    const sleepPattern = {
      bedtime: profile.sleep_time || '22:00',
      wakeTime: profile.wake_up_time || '07:00',
      quality: sleepQuality
    };

    // Map allergies from preferences
    const allergies: string[] = [];
    if (profile.preferences?.allergies) {
      if (Array.isArray(profile.preferences.allergies)) {
        allergies.push(...profile.preferences.allergies);
      } else if (typeof profile.preferences.allergies === 'string') {
        allergies.push(...profile.preferences.allergies.split(',').map(a => a.trim()));
      }
    }

    return {
      age,
      gender: (profile.gender as 'male' | 'female' | 'other') || 'other',
      bodyType,
      foodPreferences,
      allergies,
      healthConditions,
      medications,
      workSchedule,
      sleepPattern,
      stressLevel,
      fitnessGoals,
      currentFitnessLevel,
      height: heightCm,
      weight: weightKg,
      activityLevel
    };
  }

  /**
   * Determine medication timing based on medication name and user schedule
   */
  private static determineMedicationTiming(medication: string, profile: UserProfile): string {
    const medLower = medication.toLowerCase();
    
    // Common medication timing patterns
    if (medLower.includes('blood pressure') || medLower.includes('bp')) {
      return 'morning after breakfast';
    }
    if (medLower.includes('diabetes') || medLower.includes('insulin')) {
      return 'before meals';
    }
    if (medLower.includes('thyroid')) {
      return 'morning on empty stomach';
    }
    if (medLower.includes('sleep') || medLower.includes('melatonin')) {
      return 'bedtime';
    }
    if (medLower.includes('vitamin') || medLower.includes('supplement')) {
      return 'morning with breakfast';
    }
    
    // Default timing
    return 'morning after breakfast';
  }

  /**
   * Determine work type based on user profile data
   */
  private static determineWorkType(profile: UserProfile): string {
    // Check if user has any physical activity indicators
    if (profile.workout_time && profile.workout_time.includes('Morning')) {
      return 'mixed'; // Likely has some physical activity
    }
    
    if (profile.routine_flexibility && parseInt(profile.routine_flexibility) >= 6) {
      return 'mixed'; // High flexibility suggests active lifestyle
    }
    
    // Default to desk job for most users
    return 'desk';
  }

  /**
   * Validate if the mapped profile has sufficient data for AI analysis
   */
  static validateProfileCompleteness(profile: UserHealthProfile): {
    isValid: boolean;
    missingFields: string[];
    completeness: number;
  } {
    const requiredFields = [
      'age', 'gender', 'height', 'weight', 'workSchedule', 'sleepPattern'
    ];
    
    const missingFields: string[] = [];
    
    requiredFields.forEach(field => {
      if (!profile[field as keyof UserHealthProfile]) {
        missingFields.push(field);
      }
    });
    
    // Check nested objects
    if (!profile.workSchedule.start || !profile.workSchedule.end) {
      missingFields.push('workSchedule');
    }
    if (!profile.sleepPattern.bedtime || !profile.sleepPattern.wakeTime) {
      missingFields.push('sleepPattern');
    }
    
    const totalFields = requiredFields.length + 2; // +2 for nested objects
    const completedFields = totalFields - missingFields.length;
    const completeness = Math.round((completedFields / totalFields) * 100);
    
    return {
      isValid: missingFields.length === 0,
      missingFields,
      completeness
    };
  }

  /**
   * Get profile insights for dashboard display
   */
  static getProfileInsights(profile: UserHealthProfile): {
    healthScore: number;
    recommendations: string[];
    nextSteps: string[];
  } {
    let healthScore = 50; // Base score
    
    // Age factor
    if (profile.age >= 18 && profile.age <= 35) healthScore += 10;
    else if (profile.age >= 36 && profile.age <= 50) healthScore += 5;
    
    // Activity level factor
    switch (profile.activityLevel) {
      case 'extremely-active': healthScore += 15; break;
      case 'very-active': healthScore += 12; break;
      case 'moderately-active': healthScore += 8; break;
      case 'lightly-active': healthScore += 5; break;
      case 'sedentary': healthScore += 0; break;
    }
    
    // Stress level factor
    switch (profile.stressLevel) {
      case 'low': healthScore += 10; break;
      case 'moderate': healthScore += 5; break;
      case 'high': healthScore += 0; break;
      case 'very-high': healthScore -= 5; break;
    }
    
    // Health conditions factor
    if (profile.healthConditions.length === 0) healthScore += 10;
    else if (profile.healthConditions.length <= 2) healthScore += 5;
    else healthScore -= 5;
    
    // Cap score at 100
    healthScore = Math.min(100, Math.max(0, healthScore));
    
    // Generate recommendations
    const recommendations: string[] = [];
    if (profile.activityLevel === 'sedentary') {
      recommendations.push('Start with daily walks to increase activity level');
    }
    if (profile.stressLevel === 'high' || profile.stressLevel === 'very-high') {
      recommendations.push('Consider stress management techniques like meditation');
    }
    if (profile.healthConditions.length > 0) {
      recommendations.push('Regular health checkups recommended');
    }
    if (profile.fitnessGoals.length === 0) {
      recommendations.push('Set specific health goals to improve motivation');
    }
    
    // Generate next steps
    const nextSteps: string[] = [
      'Complete your daily health plan',
      'Track your progress regularly',
      'Stay consistent with your routine'
    ];
    
    if (profile.medications.length > 0) {
      nextSteps.push('Follow medication schedule precisely');
    }
    
    return {
      healthScore,
      recommendations,
      nextSteps
    };
  }
}

export default OnboardingToHealthProfileMapper;
