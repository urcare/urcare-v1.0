// Health Score Calculation Service using Supabase Functions
import { supabase } from '@/integrations/supabase/client';

// Fallback health score calculation when API is not available
const calculateFallbackHealthScore = (userProfile: any) => {
  let score = 50; // Base score
  const analysis = [];
  const recommendations = [];

  // Age factor
  const age = parseInt(userProfile.age) || 30;
  if (age < 30) score += 10;
  else if (age < 50) score += 5;
  else if (age < 70) score -= 5;
  else score -= 10;

  // Weight factor (BMI calculation)
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

  // Health goals factor
  if (userProfile.health_goals && userProfile.health_goals.length > 0) {
    score += 10;
    analysis.push("Having specific health goals is excellent for motivation.");
  } else {
    recommendations.push("Set specific, measurable health goals to improve your wellness journey");
  }

  // Diet type factor
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

  // Exercise factor
  if (userProfile.workout_time) {
    score += 10;
    analysis.push("Having a regular workout schedule is great for your health.");
        } else {
    score -= 5;
    recommendations.push("Establish a regular exercise routine, even if it's just 30 minutes daily");
  }

  // Sleep factor
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

  // Chronic conditions factor
  if (userProfile.chronic_conditions && userProfile.chronic_conditions.length > 0) {
    score -= 15;
    analysis.push("Managing chronic conditions requires careful attention to your health.");
    recommendations.push("Work closely with healthcare providers to manage your conditions effectively");
  }

  // Medications factor
  if (userProfile.medications && userProfile.medications.length > 0) {
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
    score: Math.round(score),
    analysis: analysis.join(' '),
    recommendations: recommendations.slice(0, 7) // Limit to 7 recommendations
  };
};

interface HealthScoreRequest {
  userProfile: any;
  userInput?: string;
  uploadedFiles?: string[];
  voiceTranscript?: string;
}

interface HealthScoreResponse {
  success: boolean;
  healthScore?: number;
  analysis?: string;
  recommendations?: string[];
  displayAnalysis?: any;
  error?: string;
}

export const calculateHealthScore = async (request: HealthScoreRequest): Promise<HealthScoreResponse> => {
  try {
    console.log('🔍 Calculating health score using Supabase function...');
    
    // Add timeout to prevent hanging
    const timeoutPromise = new Promise((_, reject) => 
      setTimeout(() => reject(new Error('Health score calculation timeout')), 15000)
    );
    
    const healthScorePromise = supabase.functions.invoke('health-score-optimized', {
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
        // Don't throw error, let it fall through to fallback
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
        analysis: data.analysis, // Keep for backward compatibility
        recommendations: data.recommendations
      };
    } else {
      throw new Error(data?.error || 'Health score calculation failed');
    }

  } catch (error) {
    console.warn('⚠️ Health score calculation failed, using fallback:', error);
    
    // Fallback: Use local calculation
    try {
      const fallbackScore = calculateFallbackHealthScore(request.userProfile);
      return {
        success: true,
        healthScore: fallbackScore.score,
        displayAnalysis: {
          greeting: `Hi ${request.userProfile?.full_name?.split(' ')[0] || 'there'}, based on your health profile analysis:`,
          negativeAnalysis: ["🚨 Your current lifestyle may be impacting your health", "🚨 There are signs of potential health risks", "🚨 Your stress levels appear elevated", "🚨 Sleep patterns need improvement", "🚨 Dietary habits could be optimized"],
          lifestyleRecommendations: ["💚 Increase daily water intake to 8 glasses", "💚 Establish a consistent sleep schedule", "💚 Incorporate 30 minutes of daily exercise", "💚 Practice stress management techniques", "💚 Focus on whole foods and balanced nutrition"]
        },
        analysis: fallbackScore.analysis,
        recommendations: fallbackScore.recommendations
      };
    } catch (fallbackError) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to calculate health score'
      };
    }
  }
};

// Get user profile data for health score calculation
export const getUserProfileForHealthScore = async (userId: string) => {
  try {
    const { data: profile, error } = await supabase
      .from('unified_user_profiles')
      .select('*')
      .eq('id', userId)
        .single();

    if (error) throw error;

    return {
      success: true,
      profile
    };
    } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch user profile'
    };
  }
};

// Check if health analysis exists for user
export const checkHealthAnalysisExist = async (userId: string) => {
  try {
    const { data, error } = await supabase
      .from('unified_health_analysis')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(1);

    if (error && error.code !== 'PGRST116') { // PGRST116 is "no rows returned"
      throw error;
    }

    // Check if the analysis is complete (has score and recommendations)
    const isComplete = data && data.length > 0 && data[0].health_score !== null && data[0].recommendations && data[0].recommendations.length > 0;

    return {
      success: true,
      exists: data && data.length > 0,
      isComplete: isComplete,
      lastGenerated: data && data.length > 0 ? data[0].created_at : null
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to check health analysis'
    };
  }
};

// Fetch existing health analysis from database
export const fetchHealthAnalysis = async (userId: string) => {
  try {
    const { data, error } = await supabase
      .from('unified_health_analysis')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(1);

    if (error) {
      if (error.code === 'PGRST116') { // No rows returned
        return {
          success: true,
          data: null
        };
      }
      throw error;
    }

    // Handle array response
    const healthScoreData = data && data.length > 0 ? data[0] : null;
    
    if (!healthScoreData) {
      return {
        success: true,
        data: null
      };
    }

    return {
      success: true,
      data: {
        healthScore: healthScoreData.health_score || 75,
        analysis: `Health score: ${healthScoreData.health_score}/100`,
        recommendations: healthScoreData.recommendations || ['Maintain current routine', 'Stay hydrated', 'Get adequate sleep'],
        displayAnalysis: {
          greeting: `Hi there, based on your health profile analysis:`,
          negativeAnalysis: ["🚨 Your current lifestyle may be impacting your health", "🚨 There are signs of potential health risks", "🚨 Your stress levels appear elevated", "🚨 Sleep patterns need improvement", "🚨 Dietary habits could be optimized"],
          lifestyleRecommendations: healthScoreData.recommendations || ["💚 Increase daily water intake to 8 glasses", "💚 Establish a consistent sleep schedule", "💚 Incorporate 30 minutes of daily exercise", "💚 Practice stress management techniques", "💚 Focus on whole foods and balanced nutrition"]
        },
        detailedAnalysis: healthScoreData.detailed_analysis || {},
        profileAnalysis: healthScoreData.profile_analysis || {},
        createdAt: healthScoreData.created_at
      }
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch health analysis'
    };
  }
};

// Save health analysis to database
export const saveHealthAnalysis = async (
  userId: string, 
  healthScore: number, 
  analysis: string, 
  recommendations: string[], 
  displayAnalysis?: any,
  detailedAnalysis?: any,
  profileAnalysis?: any
) => {
  try {
    const { data, error } = await supabase
      .from('unified_health_analysis')
      .insert({
        user_id: userId,
        health_score: healthScore,
        analysis_text: analysis,
        display_analysis: displayAnalysis || {},
        detailed_analysis: detailedAnalysis || {},
        profile_analysis: profileAnalysis || {},
        recommendations: recommendations,
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
};

// Generate detailed profile analysis based on user profile
const generateDetailedProfileAnalysis = (userProfile: any) => {
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
};

// Check if analysis is already in progress to prevent duplicates
const analysisInProgress = new Set<string>();
const analysisTimeouts = new Map<string, NodeJS.Timeout>();

// Clear any stale analysis flags on service initialization
const clearStaleAnalysisFlags = () => {
  const now = Date.now();
  const staleThreshold = 60000; // 1 minute
  
  // Clear any analysis flags that have been in progress for too long
  for (const userId of analysisInProgress) {
    const timeoutId = analysisTimeouts.get(userId);
    if (timeoutId) {
      // If timeout exists, it means analysis started recently, keep it
      continue;
    }
    // If no timeout exists, it might be stale, remove it
    analysisInProgress.delete(userId);
    console.log('🧹 Cleared stale analysis flag for user:', userId);
  }
};

// Clear stale flags every 30 seconds
setInterval(clearStaleAnalysisFlags, 30000);

// Get or calculate health analysis (checks database first, then calculates if needed)
export const getOrCalculateHealthAnalysis = async (userId: string, userProfile?: any) => {
  try {
    console.log('🔍 Checking for existing health analysis for user:', userId);
    
    // Prevent duplicate analysis for the same user
    if (analysisInProgress.has(userId)) {
      console.log('⏳ Analysis already in progress for this user, returning existing data...');
      // Instead of waiting, return a timeout error to prevent infinite loops
      return {
        success: false,
        error: 'Analysis already in progress, please try again in a moment'
      };
    }
    
    analysisInProgress.add(userId);
    
    // Set a timeout to clear the in-progress flag after 30 seconds
    const timeoutId = setTimeout(() => {
      analysisInProgress.delete(userId);
      analysisTimeouts.delete(userId);
      console.log('⏰ Analysis timeout - clearing in-progress flag for user:', userId);
    }, 30000);
    
    analysisTimeouts.set(userId, timeoutId);
    
    // First, check if health analysis exists in database
    const analysisCheck = await checkHealthAnalysisExist(userId);
    
    if (analysisCheck.success && analysisCheck.exists && analysisCheck.isComplete) {
      console.log('✅ Complete health analysis already exists in database, fetching...');
      
      // Fetch existing analysis from database
      const existingAnalysis = await fetchHealthAnalysis(userId);
      
      if (existingAnalysis.success && existingAnalysis.data) {
        console.log('✅ Successfully loaded existing health analysis from database');
        // Clear timeout and in-progress flag
        const timeoutId = analysisTimeouts.get(userId);
        if (timeoutId) {
          clearTimeout(timeoutId);
          analysisTimeouts.delete(userId);
        }
        analysisInProgress.delete(userId);
        return {
          success: true,
          data: existingAnalysis.data,
          source: 'database'
        };
      } else {
        console.warn('⚠️ Failed to fetch existing analysis, will recalculate');
        // Clear the in-progress flag since we're going to recalculate
        analysisInProgress.delete(userId);
        const timeoutId = analysisTimeouts.get(userId);
        if (timeoutId) {
          clearTimeout(timeoutId);
          analysisTimeouts.delete(userId);
        }
      }
    } else if (analysisCheck.success && analysisCheck.exists && !analysisCheck.isComplete) {
      console.log('⚠️ Incomplete health analysis found, will recalculate...');
      // Clear the in-progress flag since we're going to recalculate
      analysisInProgress.delete(userId);
      const timeoutId = analysisTimeouts.get(userId);
      if (timeoutId) {
        clearTimeout(timeoutId);
        analysisTimeouts.delete(userId);
      }
    } else {
      // No analysis exists, clear the in-progress flag
      analysisInProgress.delete(userId);
      const timeoutId = analysisTimeouts.get(userId);
      if (timeoutId) {
        clearTimeout(timeoutId);
        analysisTimeouts.delete(userId);
      }
    }

    // Only calculate new analysis if none exist in database
    console.log('🔄 No existing health analysis found, calculating new ones...');
    
    if (!userProfile) {
      console.log('📋 Fetching user profile for analysis...');
      const profileResult = await getUserProfileForHealthScore(userId);
      if (!profileResult.success || !profileResult.profile) {
        return {
          success: false,
          error: 'Failed to fetch user profile for health score calculation'
        };
      }
      userProfile = profileResult.profile;
    }

    console.log('🧠 Starting health score calculation (API call)...');
    const healthScoreResult = await calculateHealthScore({
      userProfile,
      userInput: '',
      uploadedFiles: [],
      voiceTranscript: ''
    });

    if (healthScoreResult.success) {
      console.log('✅ Health score calculated successfully, generating detailed analysis...');
      
      // Generate detailed profile analysis
      const detailedAnalysis = generateDetailedProfileAnalysis(userProfile);
      
      console.log('💾 Saving health analysis to database...');
      // Save the new analysis to database
      const saveResult = await saveHealthAnalysis(
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
        // Clear timeout and in-progress flag
        const timeoutId = analysisTimeouts.get(userId);
        if (timeoutId) {
          clearTimeout(timeoutId);
          analysisTimeouts.delete(userId);
        }
        analysisInProgress.delete(userId);
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
        // Clear timeout and in-progress flag
        const timeoutId = analysisTimeouts.get(userId);
        if (timeoutId) {
          clearTimeout(timeoutId);
          analysisTimeouts.delete(userId);
        }
        analysisInProgress.delete(userId);
        return {
          success: false,
          error: 'Failed to save health analysis to database'
        };
      }
    } else {
      console.error('❌ Health score calculation failed:', healthScoreResult.error);
      // Clear timeout and in-progress flag
      const timeoutId = analysisTimeouts.get(userId);
      if (timeoutId) {
        clearTimeout(timeoutId);
        analysisTimeouts.delete(userId);
      }
      analysisInProgress.delete(userId);
      return {
        success: false,
        error: healthScoreResult.error || 'Failed to calculate health score'
      };
    }

  } catch (error) {
    console.error('❌ Error in getOrCalculateHealthAnalysis:', error);
    // Clear timeout and in-progress flag
    const timeoutId = analysisTimeouts.get(userId);
    if (timeoutId) {
      clearTimeout(timeoutId);
      analysisTimeouts.delete(userId);
    }
    analysisInProgress.delete(userId);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to get or calculate health analysis'
    };
  }
};