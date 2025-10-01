// Health Score Calculation Service using OpenAI
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
  error?: string;
}

export const calculateHealthScore = async (request: HealthScoreRequest): Promise<HealthScoreResponse> => {
  try {
    console.log('🔍 Calculating health score with data:', request);

    // Prepare the data for OpenAI
    const healthData = {
      userProfile: request.userProfile,
      userInput: request.userInput || '',
      uploadedFiles: request.uploadedFiles || [],
      voiceTranscript: request.voiceTranscript || '',
      timestamp: new Date().toISOString()
    };

          // Try production server first, then localhost
          const apiUrls = [
            'https://urcare-server.vercel.app/api/health-score',
            'http://localhost:3000/api/health-score'
          ];

    for (const apiUrl of apiUrls) {
      try {
        console.log(`🔍 Trying API: ${apiUrl}`);
        const response = await fetch(apiUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(healthData)
        });

        if (!response.ok) {
          throw new Error(`Health score API error: ${response.status}`);
        }

        const result = await response.json();
        console.log('✅ Health score calculated via API:', result);

        return {
          success: true,
          healthScore: result.healthScore,
          analysis: result.analysis,
          recommendations: result.recommendations
        };
      } catch (apiError) {
        console.log(`❌ API failed: ${apiUrl}`, apiError.message);
        continue; // Try next URL
      }
    }

    // If all APIs fail, throw error to trigger fallback
    throw new Error('All API endpoints failed');

  } catch (error) {
    console.error('❌ Health score calculation error:', error);
    
    // Fallback: Generate a basic health score based on user profile
    console.log('🔄 Using fallback health score calculation');
    
    try {
      const fallbackScore = calculateFallbackHealthScore(request.userProfile);
      return {
        success: true,
        healthScore: fallbackScore.score,
        analysis: fallbackScore.analysis,
        recommendations: fallbackScore.recommendations
      };
    } catch (fallbackError) {
      console.error('❌ Fallback health score calculation failed:', fallbackError);
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
      .from('profiles')
      .select('*')
      .eq('id', userId)
        .single();

    if (error) throw error;

    return {
      success: true,
      profile
    };
    } catch (error) {
    console.error('❌ Error fetching user profile:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch user profile'
    };
  }
};