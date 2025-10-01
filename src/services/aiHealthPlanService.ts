import { supabase } from "@/integrations/supabase/client";

interface UserProfile {
  id: string;
  full_name: string;
  age: string;
  gender: string;
  height_cm: string;
  weight_kg: string;
  blood_group: string;
  diet_type: string;
  chronic_conditions: string[];
  health_goals: string[];
  wake_up_time: string;
  sleep_time: string;
  work_start: string;
  work_end: string;
  breakfast_time: string;
  lunch_time: string;
  dinner_time: string;
  workout_time: string;
  workout_type: string;
  routine_flexibility: string;
  smoking: string;
  drinking: string;
  allergies: string[];
  family_history: string[];
  lifestyle: string;
  stress_levels: string;
  mental_health: string;
  hydration_habits: string;
  occupation: string;
}

interface HealthPlanActivity {
  id: string;
  title: string;
  description: string;
  type: 'nutrition' | 'exercise' | 'sleep' | 'hydration' | 'meditation' | 'other';
  scheduled_time: string;
  duration: number; // in minutes
  priority: 'high' | 'medium' | 'low';
  category: string;
  instructions: string[];
  benefits: string[];
  tips: string[];
  metrics?: {
    calories?: number;
    protein?: number;
    carbs?: number;
    fat?: number;
    steps?: number;
    heart_rate?: number;
    water_intake?: number;
  };
}

interface HealthPlan {
  id: string;
  name: string;
  description: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  duration_weeks: number;
  focus_areas: string[];
  expected_outcomes: string[];
  activities: HealthPlanActivity[];
  health_metrics: {
    weight_loss_goal: number;
    muscle_gain_goal: number;
    fitness_improvement: number;
    energy_level: number;
    sleep_quality: number;
    stress_reduction: number;
  };
  weekly_schedule: {
    [key: string]: HealthPlanActivity[];
  };
}

interface AIHealthPlanResponse {
  success: boolean;
  plans: HealthPlan[];
  health_score: {
    current: number;
    projected: number;
    improvements: string[];
  };
  personalized_insights: string[];
}

export class AIHealthPlanService {
  private generateDynamicHealthPlans(userProfile: UserProfile): AIHealthPlanResponse {
    const { health_goals, chronic_conditions, age, gender, weight_kg, height_cm, workout_type, stress_levels, sleep_time, wake_up_time } = userProfile;
    
    // Calculate BMI for personalized recommendations
    const weight = parseFloat(weight_kg) || 70;
    const height = parseFloat(height_cm) || 170;
    const bmi = weight / Math.pow(height / 100, 2);
    
    // Generate expected outcomes based on health goals
    const getExpectedOutcomes = (goals: string[], conditions: string[]) => {
      const outcomes: string[] = [];
      
      goals.forEach(goal => {
        switch(goal) {
          case 'control_high_blood_pressure':
            outcomes.push('Reduced high blood pressure', 'Improved cardiovascular health', 'Lower stress levels');
            break;
          case 'manage_diabetes':
            outcomes.push('Better blood sugar control', 'Reduced HbA1c levels', 'Improved insulin sensitivity');
            break;
          case 'lose_weight':
            outcomes.push('Sustainable weight loss', 'Improved body composition', 'Increased energy levels');
            break;
          case 'build_muscle':
            outcomes.push('Increased muscle mass', 'Improved strength', 'Better body definition');
            break;
          case 'improve_sleep':
            outcomes.push('Better sleep quality', 'Faster sleep onset', 'Reduced sleep disturbances');
            break;
          case 'reduce_stress':
            outcomes.push('Lower stress levels', 'Improved mental clarity', 'Better emotional regulation');
            break;
          case 'improve_heart_health':
            outcomes.push('Stronger cardiovascular system', 'Lower resting heart rate', 'Improved circulation');
            break;
          case 'manage_cholesterol':
            outcomes.push('Lower cholesterol levels', 'Improved lipid profile', 'Reduced cardiovascular risk');
            break;
          default:
            outcomes.push('Improved overall health', 'Better quality of life', 'Enhanced well-being');
        }
      });
      
      conditions.forEach(condition => {
        switch(condition) {
          case 'high_blood_pressure_hypertension':
            outcomes.push('Reduced blood pressure readings', 'Lower medication dependency');
            break;
          case 'sleep_disorders_poor_sleep':
            outcomes.push('Improved sleep patterns', 'Better sleep quality');
            break;
          case 'diabetes_type_2':
            outcomes.push('Better glucose control', 'Reduced diabetes complications');
            break;
          case 'high_cholesterol':
            outcomes.push('Lower cholesterol levels', 'Improved heart health');
            break;
        }
      });
      
      return [...new Set(outcomes)]; // Remove duplicates
    };

    // Generate focus areas based on health goals and conditions
    const getFocusAreas = (goals: string[], conditions: string[]) => {
      const areas: string[] = [];
      
      goals.forEach(goal => {
        switch(goal) {
          case 'control_high_blood_pressure':
            areas.push('heart health', 'stress management', 'nutrition');
            break;
          case 'manage_diabetes':
            areas.push('nutrition', 'blood sugar control', 'exercise');
            break;
          case 'lose_weight':
            areas.push('nutrition', 'exercise', 'metabolism');
            break;
          case 'build_muscle':
            areas.push('strength training', 'nutrition', 'recovery');
            break;
          case 'improve_sleep':
            areas.push('sleep hygiene', 'stress management', 'circadian rhythm');
            break;
          case 'reduce_stress':
            areas.push('stress management', 'meditation', 'mindfulness');
            break;
          case 'improve_heart_health':
            areas.push('cardiovascular fitness', 'nutrition', 'stress management');
            break;
          case 'manage_cholesterol':
            areas.push('heart health', 'nutrition', 'exercise');
            break;
        }
      });
      
      conditions.forEach(condition => {
        switch(condition) {
          case 'high_blood_pressure_hypertension':
            areas.push('blood pressure control', 'sodium management');
            break;
          case 'sleep_disorders_poor_sleep':
            areas.push('sleep optimization', 'circadian rhythm');
            break;
          case 'diabetes_type_2':
            areas.push('glucose management', 'carbohydrate control');
            break;
          case 'high_cholesterol':
            areas.push('lipid management', 'heart health');
            break;
        }
      });
      
      return [...new Set(areas)]; // Remove duplicates
    };

    const expectedOutcomes = getExpectedOutcomes(health_goals, chronic_conditions);
    const focusAreas = getFocusAreas(health_goals, chronic_conditions);
    
    // Generate personalized plan names and descriptions
    const getPlanDetails = (difficulty: 'beginner' | 'intermediate' | 'advanced', index: number) => {
      const baseNames = {
        beginner: ['Healthy Habits Foundation Plan', 'Gentle Wellness Journey', 'Sustainable Health Start'],
        intermediate: ['Balanced Health Transformation', 'Progressive Wellness Plan', 'Comprehensive Health Protocol'],
        advanced: ['Elite Performance Plan', 'Advanced Health Mastery', 'Optimal Wellness Protocol']
      };
      
      const durations = {
        beginner: 12,
        intermediate: 16,
        advanced: 20
      };
      
      const activityCounts = {
        beginner: 3,
        intermediate: 4,
        advanced: 5
      };
      
      const baseDescriptions = {
        beginner: [
          `A gentle ${durations.beginner}-week plan focused on building sustainable healthy habits`,
          `An introductory ${durations.beginner}-week wellness journey designed for gradual improvement`,
          `A foundational ${durations.beginner}-week program to establish healthy lifestyle patterns`
        ],
        intermediate: [
          `A balanced ${durations.intermediate}-week approach with moderate intensity for steady progress`,
          `A comprehensive ${durations.intermediate}-week transformation plan with structured activities`,
          `A progressive ${durations.intermediate}-week protocol combining multiple health strategies`
        ],
        advanced: [
          `A high-intensity ${durations.advanced}-week plan for maximum results and transformation`,
          `An elite-level ${durations.advanced}-week protocol for advanced health optimization`,
          `A comprehensive ${durations.advanced}-week mastery program for peak performance`
        ]
      };
      
      return {
        name: baseNames[difficulty][index] || baseNames[difficulty][0],
        description: baseDescriptions[difficulty][index] || baseDescriptions[difficulty][0],
        duration_weeks: durations[difficulty],
        activity_count: activityCounts[difficulty]
      };
    };

    // Generate condition-specific activities based on chronic conditions
    const generateConditionSpecificActivities = (difficulty: 'beginner' | 'intermediate' | 'advanced', conditions: string[], goals: string[]) => {
      const activities: HealthPlanActivity[] = [];
      let activityCount = 0;

      // High Blood Pressure Activities
      if (conditions.includes('high_blood_pressure_hypertension') || goals.includes('control_high_blood_pressure')) {
        activities.push({
          id: `bp_breathing_${difficulty}`,
          title: "Blood Pressure Breathing Exercise",
          description: `${difficulty === 'beginner' ? 'Gentle' : difficulty === 'intermediate' ? 'Moderate' : 'Advanced'} breathing techniques to lower blood pressure`,
          type: "meditation",
          scheduled_time: wake_up_time || "07:00",
          duration: difficulty === 'beginner' ? 10 : difficulty === 'intermediate' ? 15 : 20,
          priority: "high",
          category: "Blood Pressure Management",
          instructions: [
            "Sit comfortably with spine straight",
            "Breathe in for 4 counts, hold for 4, exhale for 6",
            "Focus on slow, deep diaphragmatic breathing"
          ],
          benefits: ["Lowers blood pressure", "Reduces stress hormones", "Improves heart rate variability"],
          tips: ["Practice twice daily", "Use a timer", "Stay consistent"]
        });
        activityCount++;

        activities.push({
          id: `bp_cardio_${difficulty}`,
          title: "Low-Impact Cardio for Blood Pressure",
          description: `${difficulty === 'beginner' ? 'Gentle' : difficulty === 'intermediate' ? 'Moderate' : 'Intense'} cardiovascular exercise to improve heart health`,
          type: "exercise",
          scheduled_time: userProfile.workout_time || "18:00",
          duration: difficulty === 'beginner' ? 20 : difficulty === 'intermediate' ? 30 : 45,
          priority: "high",
          category: "Cardiovascular Health",
          instructions: [
            "Start with 5-minute warm-up",
            "Maintain moderate intensity (can talk but not sing)",
            "Include 5-minute cool-down"
          ],
          benefits: ["Strengthens heart muscle", "Lowers resting blood pressure", "Improves circulation"],
          tips: ["Monitor heart rate", "Stop if dizzy", "Stay hydrated"]
        });
        activityCount++;
      }

      // Sleep Disorders Activities
      if (conditions.includes('sleep_disorders_poor_sleep') || goals.includes('improve_sleep')) {
        activities.push({
          id: `sleep_hygiene_${difficulty}`,
          title: "Sleep Hygiene Routine",
          description: `${difficulty === 'beginner' ? 'Basic' : difficulty === 'intermediate' ? 'Comprehensive' : 'Advanced'} sleep optimization practices`,
          type: "sleep",
          scheduled_time: sleep_time || "22:00",
          duration: difficulty === 'beginner' ? 20 : difficulty === 'intermediate' ? 30 : 45,
          priority: "high",
          category: "Sleep Optimization",
          instructions: [
            "Turn off all screens 1 hour before bed",
            "Practice relaxation techniques",
            "Create optimal sleep environment (cool, dark, quiet)"
          ],
          benefits: ["Improves sleep quality", "Reduces sleep onset time", "Enhances deep sleep"],
          tips: ["Be consistent with bedtime", "Avoid caffeine after 2 PM", "Use blackout curtains"]
        });
        activityCount++;

        activities.push({
          id: `sleep_meditation_${difficulty}`,
          title: "Pre-Sleep Meditation",
          description: `${difficulty === 'beginner' ? 'Guided' : difficulty === 'intermediate' ? 'Self-guided' : 'Advanced'} meditation for better sleep`,
          type: "meditation",
          scheduled_time: (parseInt(sleep_time?.split(':')[0] || '22') - 1).toString().padStart(2, '0') + ':00',
          duration: difficulty === 'beginner' ? 10 : difficulty === 'intermediate' ? 15 : 20,
          priority: "high",
          category: "Sleep Preparation",
          instructions: [
            "Lie down in comfortable position",
            "Focus on body scan relaxation",
            "Use guided sleep meditation if needed"
          ],
          benefits: ["Calms nervous system", "Reduces racing thoughts", "Promotes natural sleep"],
          tips: ["Use sleep apps", "Practice daily", "Create bedtime ritual"]
        });
        activityCount++;
      }

      // Swimming-specific activities if user prefers swimming
      if (workout_type === 'Swimming') {
        activities.push({
          id: `swimming_${difficulty}`,
          title: `${difficulty === 'beginner' ? 'Gentle' : difficulty === 'intermediate' ? 'Moderate' : 'Intense'} Swimming Session`,
          description: `${difficulty === 'beginner' ? 'Low-impact' : difficulty === 'intermediate' ? 'Balanced' : 'High-intensity'} swimming workout for overall health`,
          type: "exercise",
          scheduled_time: userProfile.workout_time || "18:00",
          duration: difficulty === 'beginner' ? 20 : difficulty === 'intermediate' ? 30 : 45,
          priority: "high",
          category: "Swimming Workout",
          instructions: [
            "Warm up with 5 minutes easy swimming",
            `Maintain ${difficulty === 'beginner' ? 'moderate' : difficulty === 'intermediate' ? 'steady' : 'high'} intensity`,
            "Cool down with 5 minutes easy swimming"
          ],
          benefits: ["Full body workout", "Low impact on joints", "Improves cardiovascular health"],
          tips: ["Focus on technique", "Stay hydrated", "Listen to your body"]
        });
        activityCount++;
      }

      // Add stress management if high stress levels
      if (stress_levels === 'high' || goals.includes('reduce_stress')) {
        activities.push({
          id: `stress_management_${difficulty}`,
          title: "Stress Relief Session",
          description: `${difficulty === 'beginner' ? 'Basic' : difficulty === 'intermediate' ? 'Intermediate' : 'Advanced'} stress management techniques`,
          type: "meditation",
          scheduled_time: "21:00",
          duration: difficulty === 'beginner' ? 10 : difficulty === 'intermediate' ? 15 : 20,
          priority: "medium",
          category: "Stress Management",
          instructions: [
            "Find quiet, comfortable space",
            "Practice deep breathing exercises",
            "Use progressive muscle relaxation"
          ],
          benefits: ["Reduces cortisol levels", "Improves mood", "Enhances mental clarity"],
          tips: ["Practice daily", "Use guided meditations", "Be patient with progress"]
        });
        activityCount++;
      }

      // Add nutrition activities if needed
      if (goals.includes('manage_diabetes') || goals.includes('manage_cholesterol')) {
        activities.push({
          id: `nutrition_${difficulty}`,
          title: "Meal Planning & Nutrition",
          description: `${difficulty === 'beginner' ? 'Basic' : difficulty === 'intermediate' ? 'Detailed' : 'Advanced'} nutrition planning for health conditions`,
          type: "nutrition",
          scheduled_time: userProfile.breakfast_time || "08:00",
          duration: difficulty === 'beginner' ? 15 : difficulty === 'intermediate' ? 20 : 30,
          priority: "high",
          category: "Nutrition Management",
          instructions: [
            "Plan meals for the day",
            "Focus on condition-specific nutrition",
            "Track key nutrients and portions"
          ],
          benefits: ["Supports health conditions", "Improves energy levels", "Aids in medication effectiveness"],
          tips: ["Use meal prep", "Consult nutritionist", "Track consistently"]
        });
        activityCount++;
      }

      // Ensure we have at least 3 activities, add generic ones if needed
      while (activityCount < 3) {
        activities.push({
          id: `generic_${difficulty}_${activityCount}`,
          title: `${difficulty === 'beginner' ? 'Gentle' : difficulty === 'intermediate' ? 'Moderate' : 'Intense'} Health Activity`,
          description: `General health improvement activity for ${difficulty} level`,
          type: "exercise",
          scheduled_time: userProfile.workout_time || "18:00",
          duration: difficulty === 'beginner' ? 15 : difficulty === 'intermediate' ? 25 : 35,
          priority: "medium",
          category: "General Health",
          instructions: [
            "Choose any physical activity you enjoy",
            "Maintain moderate intensity",
            "Focus on consistency over intensity"
          ],
          benefits: ["Improves overall health", "Boosts energy", "Enhances mood"],
          tips: ["Find activities you enjoy", "Stay consistent", "Listen to your body"]
        });
        activityCount++;
      }

      return activities;
    };

    // Generate 3 plans with different difficulty levels and condition-specific activities
    const plans: HealthPlan[] = [
      {
        id: "plan_beginner",
        ...getPlanDetails('beginner', 0),
        difficulty: "beginner",
        focus_areas: focusAreas.slice(0, 4),
        expected_outcomes: expectedOutcomes.slice(0, 3),
        activities: generateConditionSpecificActivities('beginner', chronic_conditions, health_goals),
        health_metrics: {
          weight_loss_goal: bmi > 25 ? Math.round(bmi * 0.5) : 3,
          muscle_gain_goal: 2,
          fitness_improvement: 20,
          energy_level: 15,
          sleep_quality: 10,
          stress_reduction: 25
        },
        weekly_schedule: {}
      },
      {
        id: "plan_intermediate",
        ...getPlanDetails('intermediate', 1),
        difficulty: "intermediate",
        focus_areas: focusAreas.slice(0, 5),
        expected_outcomes: expectedOutcomes.slice(0, 4),
        activities: generateConditionSpecificActivities('intermediate', chronic_conditions, health_goals),
        health_metrics: {
          weight_loss_goal: bmi > 25 ? Math.round(bmi * 0.8) : 5,
          muscle_gain_goal: 4,
          fitness_improvement: 35,
          energy_level: 25,
          sleep_quality: 15,
          stress_reduction: 30
        },
        weekly_schedule: {}
      },
      {
        id: "plan_advanced",
        ...getPlanDetails('advanced', 2),
        difficulty: "advanced",
        focus_areas: focusAreas.slice(0, 6),
        expected_outcomes: expectedOutcomes.slice(0, 5),
        activities: generateConditionSpecificActivities('advanced', chronic_conditions, health_goals),
        health_metrics: {
          weight_loss_goal: bmi > 25 ? Math.round(bmi * 1.2) : 8,
          muscle_gain_goal: 6,
          fitness_improvement: 50,
          energy_level: 35,
          sleep_quality: 20,
          stress_reduction: 40
        },
        weekly_schedule: {}
      }
    ];

    return {
      success: true,
      plans,
      health_score: {
        current: 65,
        projected: 85,
        improvements: [
          "Personalized nutrition plan based on your goals",
          "Structured exercise routine matching your preferences",
          "Optimized sleep and stress management strategies"
        ]
      },
      personalized_insights: [
        `Based on your health goals: ${health_goals.join(', ')}`,
        `Addressing your conditions: ${chronic_conditions.join(', ')}`,
        `Optimized for your ${workout_type} preference and ${stress_levels} stress levels`
      ]
    };
  }

  async generatePersonalizedHealthPlans(userProfile: UserProfile): Promise<AIHealthPlanResponse> {
    try {
      console.log('Calling generate-ai-health-plans function with profile:', userProfile);
      
      const { data, error } = await supabase.functions.invoke('generate-ai-health-plans', {
        body: {
          user_profile: userProfile,
          timestamp: new Date().toISOString()
        },
        headers: {
          Authorization: `Bearer ${
            (await supabase.auth.getSession()).data.session?.access_token
          }`,
        },
      });

      if (error) {
        console.log('Supabase function not available, using fallback:', error.message);
        throw error;
      }
      
      console.log('Function response:', data);
      return data;
    } catch (error) {
      console.log('Using dynamic plan generation fallback...');
      
      // Generate dynamic plans based on user health data
      const dynamicPlans = this.generateDynamicHealthPlans(userProfile);
      console.log('Generated dynamic plans successfully');
      return dynamicPlans;
    }
  }

  async saveHealthPlan(userId: string, plan: HealthPlan): Promise<void> {
    try {
      // Try to save to comprehensive_health_plans first
      try {
        // First, deactivate any existing active plans
        await supabase
          .from('comprehensive_health_plans')
          .update({ status: 'inactive' })
          .eq('user_id', userId)
          .eq('status', 'active');

        // Insert the new selected plan
        const { error } = await supabase
          .from('comprehensive_health_plans')
          .insert({
            user_id: userId,
            plan_data: {
              ...plan,
              selected_at: new Date().toISOString(),
              start_date: new Date().toISOString().split('T')[0],
              end_date: new Date(Date.now() + (plan.duration_weeks * 7 * 24 * 60 * 60 * 1000)).toISOString().split('T')[0]
            },
            status: 'active'
          });

        if (error) throw error;
        console.log('Health plan saved successfully to comprehensive_health_plans:', plan.name);
        return;
      } catch (comprehensiveError) {
        // Table doesn't exist, silently fall back to health_plans table
      }
        
        // Fallback to health_plans table
        const { error: healthPlansError } = await supabase
          .from('health_plans')
          .insert({
            user_id: userId,
            plan_name: plan.name,
            plan_type: plan.difficulty === 'beginner' ? 'habit_formation' : 
                      plan.difficulty === 'intermediate' ? 'health_transformation' : 'lifestyle_change',
            primary_goal: plan.focus_areas[0] || 'General Health',
            secondary_goals: plan.focus_areas.slice(1),
            start_date: new Date().toISOString().split('T')[0],
            target_end_date: new Date(Date.now() + (plan.duration_weeks * 7 * 24 * 60 * 60 * 1000)).toISOString().split('T')[0],
            duration_weeks: plan.duration_weeks,
            plan_data: {
              ...plan,
              selected_at: new Date().toISOString(),
              start_date: new Date().toISOString().split('T')[0],
              end_date: new Date(Date.now() + (plan.duration_weeks * 7 * 24 * 60 * 60 * 1000)).toISOString().split('T')[0]
            },
            status: 'active'
          });

      if (healthPlansError) {
        console.error('Error saving to health_plans table:', healthPlansError);
        throw healthPlansError;
      }
      console.log('Health plan saved successfully to health_plans table:', plan.name);
    } catch (error) {
      console.error('Error saving health plan:', error);
      // Don't throw error, just log it so the user can still proceed
      console.log('Continuing without saving to database...');
    }
  }

  async getUserHealthPlans(userId: string): Promise<HealthPlan[]> {
    try {
      // Try comprehensive_health_plans first (if it exists)
      try {
      const { data: comprehensiveData, error: comprehensiveError } = await supabase
        .from('comprehensive_health_plans')
        .select('plan_data')
        .eq('user_id', userId)
        .eq('status', 'active')
        .order('created_at', { ascending: false });

        if (!comprehensiveError && comprehensiveData && comprehensiveData.length > 0) {
          console.log('Found health plans in comprehensive_health_plans table');
        return comprehensiveData.map(item => item.plan_data) || [];
        }
      } catch (comprehensiveError) {
        // Table doesn't exist, silently fall back to health_plans table
      }

      // Fallback to health_plans table
      const { data: healthPlansData, error: healthPlansError } = await supabase
        .from('health_plans')
        .select('plan_data')
        .eq('user_id', userId)
        .eq('status', 'active')
        .order('created_at', { ascending: false });

      if (healthPlansError) {
        console.error('Error fetching from health_plans table:', healthPlansError);
        return [];
      }
      
      console.log('Found health plans in health_plans table:', healthPlansData?.length || 0);
      return healthPlansData?.map(item => item.plan_data) || [];
    } catch (error) {
      console.error('Error fetching health plans:', error);
      return [];
    }
  }
}

export const aiHealthPlanService = new AIHealthPlanService();


