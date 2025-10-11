// Unified Health Analysis Service
// Replaces: healthScoreService.ts, health_analysis, health_insights, user_health_scores
import { supabase } from '@/integrations/supabase/client';

interface HealthAnalysisRequest {
  userProfile: any;
  userInput?: string;
  uploadedFiles?: string[];
  voiceTranscript?: string;
}

interface HealthAnalysisResponse {
  success: boolean;
  healthScore?: number;
  analysis?: string;
  recommendations?: string[];
  displayAnalysis?: any;
  detailedAnalysis?: any;
  error?: string;
}

interface HealthAnalysisData {
  id: string;
  user_id: string;
  health_score: number;
  display_analysis: any;
  detailed_analysis: any;
  analysis: string;
  recommendations: string[];
  user_input?: string;
  uploaded_files?: string[];
  voice_transcript?: string;
  ai_provider: string;
  ai_model: string;
  calculation_method?: string;
  factors_considered?: string[];
  analysis_date: string;
  is_latest: boolean;
  created_at: string;
  updated_at: string;
}

class UnifiedHealthAnalysisService {
  /**
   * Calculate health score using Supabase Functions (with fallback)
   */
  async calculateHealthScore(request: HealthAnalysisRequest): Promise<HealthAnalysisResponse> {
    try {
      console.log('🔍 Calculating health score using Supabase function...');
      
      // Add timeout to prevent hanging
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Health score calculation timeout')), 15000)
      );
      
      const healthScorePromise = supabase.functions.invoke('health-score', {
        body: {
          userProfile: request.userProfile,
          userInput: request.userInput,
          uploadedFiles: request.uploadedFiles,
          voiceTranscript: request.voiceTranscript
        }
      });
      
      const result = await Promise.race([healthScorePromise, timeoutPromise]) as any;
      const { data, error } = result;

      if (error) {
        console.error('❌ Supabase function error:', error);
        
        // Handle CORS errors specifically
        if (error.message.includes('CORS') || error.message.includes('Failed to send a request')) {
          console.warn('⚠️ CORS error detected, using fallback calculation');
          return await this.calculateFallbackHealthScore(request);
        } else {
          throw new Error(`Supabase function error: ${error.message}`);
        }
      }

      if (data && data.success) {
        console.log(`✅ Health Score calculated: ${data.healthScore}`);
        console.log('📊 Analysis data:', data.displayAnalysis);
        return {
          success: true,
          healthScore: data.healthScore,
          displayAnalysis: data.displayAnalysis,
          analysis: data.analysis,
          recommendations: data.recommendations,
          detailedAnalysis: data.detailedAnalysis
        };
      } else {
        throw new Error(data?.error || 'Health score calculation failed');
      }

    } catch (error) {
      console.warn('⚠️ Health score calculation failed, using fallback:', error);
      return await this.calculateFallbackHealthScore(request);
    }
  }

  /**
   * Fallback health score calculation when API is not available
   */
  private async calculateFallbackHealthScore(request: HealthAnalysisRequest): Promise<HealthAnalysisResponse> {
    const userProfile = request.userProfile;
    let score = 50; // Base score
    const analysis = [];
    const recommendations = [];

    // Age factor
    const age = parseInt(userProfile.age) || 30;
    if (age < 30) score += 10;
    else if (age < 50) score += 5;
    else if (age < 70) score -= 5;
    else score -= 10;

    // Weight factor (BMI calculation) - using height_cm and weight_kg from onboarding_profiles
    const height = parseFloat(userProfile.height_cm) || 170;
    const weight = parseFloat(userProfile.weight_kg) || 70;
    const bmi = weight / ((height / 100) ** 2);
    
    if (bmi >= 18.5 && bmi <= 24.9) {
      score += 15;
      analysis.push("Your BMI is in the healthy range.");
    } else if (bmi < 18.5) {
      score += 5;
      analysis.push("Your BMI suggests you may be underweight.");
      recommendations.push("Consider consulting a nutritionist for healthy weight gain strategies");
    } else if (bmi > 24.9 && bmi < 30) {
      score += 5;
      analysis.push("Your BMI is slightly above the healthy range.");
      recommendations.push("Focus on maintaining a balanced diet and regular exercise");
    } else {
      score -= 10;
      analysis.push("Your BMI indicates you may be overweight.");
      recommendations.push("Consider a structured weight management program with professional guidance");
    }

    // Health goals factor - using health_goals from onboarding_profiles
    if (userProfile.health_goals && Array.isArray(userProfile.health_goals) && userProfile.health_goals.length > 0) {
      score += 10;
      analysis.push("Having specific health goals is excellent for motivation.");
    } else {
      recommendations.push("Set specific, measurable health goals to improve your wellness journey");
    }

    // Diet type factor - using diet_type from onboarding_profiles
    const dietType = userProfile.diet_type?.toLowerCase() || '';
    if (dietType.includes('balanced') || dietType.includes('mediterranean')) {
      score += 10;
      analysis.push("Your diet choice supports good health.");
    } else if (dietType.includes('vegetarian') || dietType.includes('vegan')) {
      score += 8;
      analysis.push("Plant-based diets can be very healthy with proper planning.");
      recommendations.push("Ensure adequate protein and B12 intake with your plant-based diet");
    } else {
      recommendations.push("Consider adopting a more balanced, nutrient-rich diet");
    }

    // Exercise factor - using workout_time from onboarding_profiles
    if (userProfile.workout_time) {
      score += 10;
      analysis.push("Having a regular workout schedule is great for your health.");
    } else {
      score -= 5;
      recommendations.push("Establish a regular exercise routine, even if it's just 30 minutes daily");
    }

    // Sleep factor - using sleep_time and wake_up_time from onboarding_profiles
    if (userProfile.sleep_time && userProfile.wake_up_time) {
      const sleepTime = new Date(`2000-01-01 ${userProfile.sleep_time}`);
      const wakeTime = new Date(`2000-01-02 ${userProfile.wake_up_time}`);
      const sleepHours = (wakeTime.getTime() - sleepTime.getTime()) / (1000 * 60 * 60);
      
      if (sleepHours >= 7 && sleepHours <= 9) {
        score += 10;
        analysis.push("Your sleep schedule appears to provide adequate rest.");
      } else if (sleepHours < 7) {
        score -= 5;
        recommendations.push("Aim for 7-9 hours of quality sleep each night");
      }
    } else {
      recommendations.push("Establish a consistent sleep schedule for better health");
    }

    // Chronic conditions factor - using chronic_conditions from onboarding_profiles
    if (userProfile.chronic_conditions && Array.isArray(userProfile.chronic_conditions) && userProfile.chronic_conditions.length > 0) {
      score -= 15;
      analysis.push("Managing chronic conditions requires careful attention to your health.");
      recommendations.push("Work closely with healthcare providers to manage your conditions effectively");
    }

    // Medications factor - using medications from onboarding_profiles
    if (userProfile.medications && Array.isArray(userProfile.medications) && userProfile.medications.length > 0) {
      score -= 5;
      analysis.push("Taking medications as prescribed is important for your health.");
      recommendations.push("Continue taking medications as prescribed and discuss any concerns with your doctor");
    }

    // Ensure score is within bounds
    score = Math.max(0, Math.min(100, score));

    // Generate analysis summary
    const scoreLevel = score >= 80 ? 'excellent' : score >= 60 ? 'good' : score >= 40 ? 'fair' : 'needs improvement';
    analysis.unshift(`Your overall health score is ${score}/100, which indicates ${scoreLevel} health.`);

    // Add general recommendations if none specific
    if (recommendations.length === 0) {
      recommendations.push(
        "Maintain regular physical activity",
        "Eat a variety of fruits and vegetables",
        "Stay hydrated throughout the day",
        "Get adequate sleep each night",
        "Manage stress through relaxation techniques"
      );
    }

    return {
      success: true,
      healthScore: Math.round(score),
      analysis: analysis.join(' '),
      recommendations: recommendations.slice(0, 7), // Limit to 7 recommendations
      displayAnalysis: {
        greeting: `Hi ${userProfile?.full_name?.split(' ')[0] || 'there'}, based on your health profile analysis:`,
        negativeAnalysis: ["🚨 Your current lifestyle may be impacting your health", "🚨 There are signs of potential health risks", "🚨 Your stress levels appear elevated", "🚨 Sleep patterns need improvement", "🚨 Dietary habits could be optimized"],
        lifestyleRecommendations: ["💚 Increase daily water intake to 8 glasses", "💚 Establish a consistent sleep schedule", "💚 Incorporate 30 minutes of daily exercise", "💚 Practice stress management techniques", "💚 Focus on whole foods and balanced nutrition"]
      },
      detailedAnalysis: this.generateDetailedProfileAnalysis(userProfile)
    };
  }

  /**
   * Generate detailed profile analysis based on user profile
   */
  private generateDetailedProfileAnalysis(userProfile: any) {
    const analysis = {
      healthRisks: [],
      nutritionalProfile: {
        mealTimings: [],
        dietaryNeeds: [],
        foodPreferences: []
      },
      exerciseProfile: {
        workoutSchedule: [],
        exerciseTypes: [],
        intensityLevels: []
      },
      sleepProfile: {
        bedtimeRoutine: [],
        wakeUpRoutine: [],
        sleepOptimization: []
      },
      stressManagement: {
        stressTriggers: [],
        relaxationTechniques: [],
        mindfulnessPractices: []
      },
      medicalConsiderations: {
        medicationInteractions: [],
        conditionManagement: [],
        preventiveMeasures: []
      }
    };

    // Analyze health risks based on profile
    if (userProfile?.chronic_conditions && userProfile.chronic_conditions.length > 0) {
      analysis.healthRisks.push(`Managing ${userProfile.chronic_conditions.join(', ')} requires careful monitoring`);
    }
    
    if (userProfile?.age && userProfile.age > 50) {
      analysis.healthRisks.push('Age-related health considerations require attention');
    }

    // Analyze nutritional profile
    if (userProfile?.diet_type) {
      analysis.nutritionalProfile.dietaryNeeds.push(userProfile.diet_type);
    }
    
    if (userProfile?.health_goals && userProfile.health_goals.includes('weight loss')) {
      analysis.nutritionalProfile.dietaryNeeds.push('Calorie deficit management');
    }

    // Analyze exercise profile
    if (userProfile?.workout_time) {
      analysis.exerciseProfile.workoutSchedule.push(`Regular workouts at ${userProfile.workout_time}`);
    }
    
    if (userProfile?.health_goals && userProfile.health_goals.includes('fitness')) {
      analysis.exerciseProfile.exerciseTypes.push('Strength training', 'Cardiovascular exercise');
    }

    // Analyze sleep profile
    if (userProfile?.sleep_time && userProfile?.wake_up_time) {
      analysis.sleepProfile.bedtimeRoutine.push(`Bedtime: ${userProfile.sleep_time}`);
      analysis.sleepProfile.wakeUpRoutine.push(`Wake up: ${userProfile.wake_up_time}`);
    }

    // Analyze stress management
    if (userProfile?.chronic_conditions && userProfile.chronic_conditions.includes('anxiety')) {
      analysis.stressManagement.stressTriggers.push('Chronic condition management');
      analysis.stressManagement.relaxationTechniques.push('Deep breathing', 'Meditation');
    }

    // Analyze medical considerations
    if (userProfile?.medications && userProfile.medications.length > 0) {
      analysis.medicalConsiderations.medicationInteractions.push('Monitor medication interactions');
    }
    
    if (userProfile?.chronic_conditions && userProfile.chronic_conditions.length > 0) {
      analysis.medicalConsiderations.conditionManagement.push('Regular health monitoring required');
    }

    return analysis;
  }

  /**
   * Get user profile data for health score calculation
   */
  async getUserProfileForHealthScore(userId: string) {
    try {
      const { data: profile, error } = await supabase
        .from('onboarding_profiles')
        .select('id, user_id, health_score, display_analysis, ai_provider, ai_model, calculation_method, user_input, uploaded_files, voice_transcript, factors_considered, generation_parameters, analysis_date, is_latest, created_at, updated_at')
        .eq('user_id', userId)
        .single();

      if (error) throw error;

      return {
        success: true,
        profile
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch user profile for health score calculation'
      };
    }
  }

  /**
   * Check if health analysis exists for user
   */
  async checkHealthAnalysisExist(userId: string) {
    try {
      const { data, error } = await supabase
        .from('health_analysis')
        .select('id, user_id, health_score, display_analysis, ai_provider, ai_model, calculation_method, user_input, uploaded_files, voice_transcript, factors_considered, generation_parameters, analysis_date, is_latest, created_at, updated_at')
        .eq('user_id', userId)
        .eq('is_latest', true)
        .single();

      if (error && error.code !== 'PGRST116') { // PGRST116 is "no rows returned"
        throw error;
      }

      // Check if the analysis is complete (has score and display_analysis)
      const isComplete = data && data.health_score !== null && data.display_analysis && data.display_analysis.lifestyleRecommendations && data.display_analysis.lifestyleRecommendations.length > 0;

      return {
        success: true,
        exists: !!data,
        isComplete: isComplete,
        lastGenerated: data ? data.created_at : null
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to check health analysis'
      };
    }
  }

  /**
   * Fetch existing health analysis from database
   */
  async fetchHealthAnalysis(userId: string) {
    try {
      const { data, error } = await supabase
        .from('health_analysis')
        .select('id, user_id, health_score, display_analysis, ai_provider, ai_model, calculation_method, user_input, uploaded_files, voice_transcript, factors_considered, generation_parameters, analysis_date, is_latest, created_at, updated_at')
        .eq('user_id', userId)
        .eq('is_latest', true)
        .single();

      if (error) {
        if (error.code === 'PGRST116') { // No rows returned
          return {
            success: true,
            data: null
          };
        }
        throw error;
      }

      if (!data) {
        return {
          success: true,
          data: null
        };
      }

      return {
        success: true,
        data: {
          healthScore: data.health_score || 75,
          analysis: `Health score: ${data.health_score}/100`,
          recommendations: data.display_analysis?.lifestyleRecommendations || ['Maintain current routine', 'Stay hydrated', 'Get adequate sleep'],
          displayAnalysis: data.display_analysis || {
            greeting: `Hi there, based on your health profile analysis:`,
            negativeAnalysis: ["🚨 Your current lifestyle may be impacting your health", "🚨 There are signs of potential health risks", "🚨 Your stress levels appear elevated", "🚨 Sleep patterns need improvement", "🚨 Dietary habits could be optimized"],
            lifestyleRecommendations: ["💚 Increase daily water intake to 8 glasses", "💚 Establish a consistent sleep schedule", "💚 Incorporate 30 minutes of daily exercise", "💚 Practice stress management techniques", "💚 Focus on whole foods and balanced nutrition"]
          },
          detailedAnalysis: data.generation_parameters || {},
          profileAnalysis: data.factors_considered || [],
          createdAt: data.created_at,
          aiProvider: data.ai_provider,
          aiModel: data.ai_model
        }
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch health analysis'
      };
    }
  }

  /**
   * Save health analysis to database
   */
  async saveHealthAnalysis(
    userId: string, 
    healthScore: number, 
    analysis: string, 
    recommendations: string[], 
    displayAnalysis?: any,
    detailedAnalysis?: any,
    profileAnalysis?: any
  ) {
    try {
      // First, mark all existing analyses as not latest
      await supabase
        .from('health_analysis')
        .update({ is_latest: false })
        .eq('user_id', userId);

      // Insert new analysis
      const { data, error } = await supabase
        .from('health_analysis')
        .insert({
          user_id: userId,
          health_score: healthScore,
          display_analysis: displayAnalysis || {},
          ai_provider: 'groq',
          ai_model: 'llama-3.3-70b-versatile',
          calculation_method: 'groq_ai_analysis',
          factors_considered: profileAnalysis || [],
          generation_parameters: detailedAnalysis || {},
          is_latest: true
        })
        .select()
        .single();

      if (error) throw error;

      return {
        success: true,
        data
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to save health analysis'
      };
    }
  }

  /**
   * Get or calculate health analysis (checks database first, then calculates if needed)
   */
  async getOrCalculateHealthAnalysis(userId: string, userProfile?: any) {
    try {
      console.log('🔍 Checking for existing health analysis for user:', userId);
      
      // First, check if health analysis exists in database
      const analysisCheck = await this.checkHealthAnalysisExist(userId);
      
      if (analysisCheck.success && analysisCheck.exists && analysisCheck.isComplete) {
        console.log('✅ Complete health analysis already exists in database, fetching...');
        
        // Fetch existing analysis from database
        const existingAnalysis = await this.fetchHealthAnalysis(userId);
        
        if (existingAnalysis.success && existingAnalysis.data) {
          console.log('✅ Successfully loaded existing health analysis from database');
          return {
            success: true,
            data: existingAnalysis.data,
            source: 'database'
          };
        } else {
          console.warn('⚠️ Failed to fetch existing analysis, will recalculate');
        }
      } else if (analysisCheck.success && analysisCheck.exists && !analysisCheck.isComplete) {
        console.log('⚠️ Incomplete health analysis found, will recalculate...');
      } else {
        console.log('🔄 No existing health analysis found, calculating new ones...');
      }

      // Only calculate new analysis if none exist in database
      if (!userProfile) {
        console.log('📋 Fetching user profile for analysis...');
        const profileResult = await this.getUserProfileForHealthScore(userId);
        if (!profileResult.success || !profileResult.profile) {
          return {
            success: false,
            error: 'Failed to fetch user profile for health score calculation'
          };
        }
        userProfile = profileResult.profile;
      }

      console.log('🧠 Starting health score calculation (API call)...');
      const healthScoreResult = await this.calculateHealthScore({
        userProfile,
        userInput: '',
        uploadedFiles: [],
        voiceTranscript: ''
      });

      if (healthScoreResult.success) {
        console.log('✅ Health score calculated successfully, generating detailed analysis...');
        
        // Generate detailed profile analysis
        const detailedAnalysis = this.generateDetailedProfileAnalysis(userProfile);
        
        console.log('💾 Saving health analysis to database...');
        // Save the new analysis to database
        const saveResult = await this.saveHealthAnalysis(
          userId,
          healthScoreResult.healthScore!,
          healthScoreResult.analysis!,
          healthScoreResult.recommendations!,
          healthScoreResult.displayAnalysis,
          detailedAnalysis,
          detailedAnalysis // Using detailedAnalysis as profileAnalysis for now
        );

        if (saveResult.success) {
          console.log('✅ Health analysis successfully saved to database');
          return {
            success: true,
            data: {
              healthScore: healthScoreResult.healthScore,
              analysis: healthScoreResult.analysis,
              recommendations: healthScoreResult.recommendations,
              displayAnalysis: healthScoreResult.displayAnalysis,
              detailedAnalysis: detailedAnalysis,
              profileAnalysis: detailedAnalysis,
              createdAt: new Date().toISOString()
            },
            source: 'calculated'
          };
        } else {
          console.error('❌ Failed to save health analysis to database:', saveResult.error);
          return {
            success: false,
            error: 'Failed to save health analysis to database'
          };
        }
      } else {
        console.error('❌ Health score calculation failed:', healthScoreResult.error);
        return {
          success: false,
          error: healthScoreResult.error || 'Failed to calculate health score'
        };
      }

    } catch (error) {
      console.error('❌ Error in getOrCalculateHealthAnalysis:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to get or calculate health analysis'
      };
    }
  }
}

export const unifiedHealthAnalysisService = new UnifiedHealthAnalysisService();

// Export individual functions for backward compatibility
export const calculateHealthScore = unifiedHealthAnalysisService.calculateHealthScore.bind(unifiedHealthAnalysisService);
export const getUserProfileForHealthScore = unifiedHealthAnalysisService.getUserProfileForHealthScore.bind(unifiedHealthAnalysisService);
export const checkHealthAnalysisExist = unifiedHealthAnalysisService.checkHealthAnalysisExist.bind(unifiedHealthAnalysisService);
export const fetchHealthAnalysis = unifiedHealthAnalysisService.fetchHealthAnalysis.bind(unifiedHealthAnalysisService);
export const saveHealthAnalysis = unifiedHealthAnalysisService.saveHealthAnalysis.bind(unifiedHealthAnalysisService);
export const getOrCalculateHealthAnalysis = unifiedHealthAnalysisService.getOrCalculateHealthAnalysis.bind(unifiedHealthAnalysisService);
