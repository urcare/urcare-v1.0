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
      displayAnalysis: this.generateAccurateAnalysis(userProfile),
      detailedAnalysis: this.generateDetailedProfileAnalysis(userProfile)
    };
  }

  /**
   * Generate accurate analysis based on user's actual responses
   */
  private generateAccurateAnalysis(userProfile: any) {
    const negativeAnalysis = [];
    const lifestyleRecommendations = [];
    
    // Check alcohol consumption
    const alcoholConsumption = userProfile.alcohol_consumption?.toLowerCase() || '';
    if (alcoholConsumption === 'non-drinker' || alcoholConsumption === 'never') {
      // Positive for non-drinkers
      lifestyleRecommendations.push("✅ Excellent choice to avoid alcohol - this supports liver health and overall wellness");
    } else if (alcoholConsumption === 'occasionally' || alcoholConsumption === 'rarely') {
      lifestyleRecommendations.push("💚 Moderate alcohol consumption is acceptable - continue to limit intake");
    } else if (alcoholConsumption === 'daily' || alcoholConsumption === 'frequently') {
      negativeAnalysis.push("🚨 High alcohol consumption detected - consider reducing intake for better health");
      lifestyleRecommendations.push("💚 Consider reducing alcohol consumption to improve liver health and sleep quality");
    }
    
    // Check smoking status
    const smokingStatus = userProfile.smoking_status?.toLowerCase() || '';
    if (smokingStatus === 'non-smoker' || smokingStatus === 'never') {
      lifestyleRecommendations.push("✅ Great job staying smoke-free - this significantly benefits your lung and heart health");
    } else if (smokingStatus === 'former' || smokingStatus === 'quit') {
      lifestyleRecommendations.push("✅ Congratulations on quitting smoking - continue to maintain this healthy choice");
    } else if (smokingStatus === 'current' || smokingStatus === 'smoker') {
      negativeAnalysis.push("🚨 Smoking detected - this is a major health risk factor");
      lifestyleRecommendations.push("💚 Consider smoking cessation programs and support groups for better health");
    }
    
    // Check exercise frequency
    const exerciseFrequency = userProfile.exercise_frequency?.toLowerCase() || '';
    if (exerciseFrequency === 'daily' || exerciseFrequency === '5-6 times per week') {
      lifestyleRecommendations.push("✅ Excellent exercise routine - regular physical activity is key to good health");
    } else if (exerciseFrequency === '3-4 times per week' || exerciseFrequency === 'moderate') {
      lifestyleRecommendations.push("💚 Good exercise frequency - consider adding more variety to your routine");
    } else if (exerciseFrequency === 'rarely' || exerciseFrequency === 'never' || exerciseFrequency === '1-2 times per week') {
      negativeAnalysis.push("🚨 Low exercise frequency detected - regular physical activity is essential");
      lifestyleRecommendations.push("💚 Start with 30 minutes of daily walking and gradually increase activity");
    }
    
    // Check diet quality
    const dietType = userProfile.diet_type?.toLowerCase() || '';
    if (dietType.includes('balanced') || dietType.includes('mediterranean')) {
      lifestyleRecommendations.push("✅ Your diet choice supports excellent health outcomes");
    } else if (dietType.includes('vegetarian') || dietType.includes('vegan')) {
      lifestyleRecommendations.push("💚 Plant-based diet is healthy - ensure adequate protein and B12 intake");
    } else if (dietType.includes('fast food') || dietType.includes('processed')) {
      negativeAnalysis.push("🚨 Diet may include too many processed foods - focus on whole foods");
      lifestyleRecommendations.push("💚 Transition to whole foods, fruits, vegetables, and lean proteins");
    }
    
    // Check sleep quality
    if (userProfile.sleep_time && userProfile.wake_up_time) {
      const sleepTime = new Date(`2000-01-01 ${userProfile.sleep_time}`);
      const wakeTime = new Date(`2000-01-02 ${userProfile.wake_up_time}`);
      const sleepHours = (wakeTime.getTime() - sleepTime.getTime()) / (1000 * 60 * 60);
      
      if (sleepHours >= 7 && sleepHours <= 9) {
        lifestyleRecommendations.push("✅ Your sleep schedule provides adequate rest for optimal health");
      } else if (sleepHours < 7) {
        negativeAnalysis.push("🚨 Insufficient sleep detected - aim for 7-9 hours nightly");
        lifestyleRecommendations.push("💚 Establish a consistent bedtime routine for better sleep quality");
      } else if (sleepHours > 9) {
        lifestyleRecommendations.push("💚 Consider if excessive sleep indicates underlying health issues");
      }
    }
    
    // Check stress levels
    const stressLevel = userProfile.stress_level?.toLowerCase() || '';
    if (stressLevel === 'low' || stressLevel === 'minimal') {
      lifestyleRecommendations.push("✅ Excellent stress management - low stress supports overall health");
    } else if (stressLevel === 'moderate') {
      lifestyleRecommendations.push("💚 Moderate stress levels - continue practicing stress management techniques");
    } else if (stressLevel === 'high' || stressLevel === 'severe') {
      negativeAnalysis.push("🚨 High stress levels detected - chronic stress impacts health");
      lifestyleRecommendations.push("💚 Practice meditation, deep breathing, and consider professional stress management support");
    }
    
    // Check chronic conditions
    if (userProfile.chronic_conditions && Array.isArray(userProfile.chronic_conditions) && userProfile.chronic_conditions.length > 0) {
      negativeAnalysis.push("🚨 Chronic conditions require careful management");
      lifestyleRecommendations.push("💚 Work closely with healthcare providers to manage your conditions effectively");
    } else {
      lifestyleRecommendations.push("✅ No chronic conditions reported - maintain preventive health measures");
    }
    
    // If no specific issues found, provide general positive feedback
    if (negativeAnalysis.length === 0) {
      negativeAnalysis.push("✅ Your health profile shows good lifestyle choices");
      negativeAnalysis.push("✅ Continue maintaining your current healthy habits");
    }
    
    // Add general recommendations if none specific
    if (lifestyleRecommendations.length === 0) {
      lifestyleRecommendations.push("💚 Maintain regular physical activity", "💚 Eat a variety of fruits and vegetables", "💚 Stay hydrated throughout the day");
    }
    
    return {
      greeting: `Hi ${userProfile?.full_name?.split(' ')[0] || userProfile?.name?.split(' ')[0] || 'there'}, based on your health profile analysis:`,
      negativeAnalysis: negativeAnalysis.slice(0, 5), // Limit to 5 items
      lifestyleRecommendations: lifestyleRecommendations.slice(0, 5) // Limit to 5 items
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
        .select('id, user_id, full_name, age, birth_month, birth_day, birth_year, gender, height_feet, height_inches, height_cm, weight_kg, country, state, district, wake_up_time, sleep_time, work_start, work_end, blood_group, critical_conditions, diet_type, breakfast_time, lunch_time, dinner_time, workout_time, routine_flexibility, workout_type, smoking, drinking, track_family, referral_code, medications, chronic_conditions, surgery_details, health_goals, onboarding_completed, health_assessment_completed, completion_percentage, created_at, updated_at')
        .eq('user_id', userId)
        .maybeSingle(); // Use maybeSingle to handle no data gracefully

      if (error) throw error;

      if (!profile) {
        return {
          success: false,
          error: 'No onboarding profile found for user'
        };
      }

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
        .select('id, user_id, health_score, analysis_text, recommendations, display_analysis, detailed_analysis, profile_analysis, ai_provider, ai_model, calculation_method, user_input, uploaded_files, voice_transcript, factors_considered, is_latest, created_at, updated_at')
        .eq('user_id', userId)
        .eq('is_latest', true)
        .maybeSingle(); // Use maybeSingle instead of single to handle no data gracefully

      if (error) {
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
        .select('id, user_id, health_score, analysis_text, recommendations, display_analysis, detailed_analysis, profile_analysis, ai_provider, ai_model, calculation_method, user_input, uploaded_files, voice_transcript, factors_considered, is_latest, created_at, updated_at')
        .eq('user_id', userId)
        .eq('is_latest', true)
        .maybeSingle(); // Use maybeSingle instead of single to handle no data gracefully

      if (error) {
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
          analysis: data.analysis_text || `Health score: ${data.health_score}/100`,
          recommendations: data.recommendations || data.display_analysis?.lifestyleRecommendations || ['Maintain current routine', 'Stay hydrated', 'Get adequate sleep'],
          displayAnalysis: data.display_analysis || {
            greeting: `Hi there, based on your health profile analysis:`,
            negativeAnalysis: ["🚨 Your current lifestyle may be impacting your health", "🚨 There are signs of potential health risks", "🚨 Your stress levels appear elevated", "🚨 Sleep patterns need improvement", "🚨 Dietary habits could be optimized"],
            lifestyleRecommendations: ["💚 Increase daily water intake to 8 glasses", "💚 Establish a consistent sleep schedule", "💚 Incorporate 30 minutes of daily exercise", "💚 Practice stress management techniques", "💚 Focus on whole foods and balanced nutrition"]
          },
          detailedAnalysis: data.detailed_analysis || {},
          profileAnalysis: data.profile_analysis || data.factors_considered || [],
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

      // Prepare insert data
      const insertData = {
        user_id: userId,
        health_score: healthScore,
        analysis_text: analysis,
        recommendations: Array.isArray(recommendations) ? recommendations : [],
        display_analysis: displayAnalysis || {},
        detailed_analysis: detailedAnalysis || {},
        profile_analysis: profileAnalysis || {},
        ai_provider: 'groq',
        ai_model: 'llama-3.3-70b-versatile',
        calculation_method: 'groq_ai_analysis',
        factors_considered: Array.isArray(profileAnalysis) ? profileAnalysis : [],
        is_latest: true
      };

      console.log('🔍 Inserting health analysis data:', insertData);

      // Insert new analysis
      const { data, error } = await supabase
        .from('health_analysis')
        .insert(insertData)
        .select()
        .maybeSingle();

      if (error) {
        console.error('❌ Health analysis insert error:', error);
        console.error('❌ Error details:', {
          message: error.message,
          details: error.details,
          hint: error.hint,
          code: error.code
        });
        throw error;
      }

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
      console.log('🔍 Analysis check result:', analysisCheck);
      
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
          healthScoreResult.analysis || `Health score: ${healthScoreResult.healthScore}/100`,
          healthScoreResult.recommendations || [],
          healthScoreResult.displayAnalysis,
          detailedAnalysis,
          detailedAnalysis // Using detailedAnalysis as profileAnalysis for now
        );

        if (saveResult.success) {
          console.log('✅ Health analysis successfully saved to database');
          console.log('📊 Saved analysis data:', saveResult.data);
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
