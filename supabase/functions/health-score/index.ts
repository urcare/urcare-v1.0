import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// Initialize Supabase client
const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface UserProfile {
  id: string;
  age: number;
  gender: string;
  height: number;
  weight: number;
  activity_level: string;
  health_goals: string[];
  medical_conditions: string[];
  medications: string[];
  allergies: string[];
  sleep_hours: number;
  stress_level: number;
  diet_type: string;
  exercise_frequency: number;
  chronic_conditions: string[];
  family_history: string[];
  lifestyle_factors: string[];
  wake_up_time: string;
  sleep_time: string;
  workout_time: string;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { userProfile, userInput, uploadedFiles, voiceTranscript } = await req.json();

    console.log("🔍 Generating health score for user:", userProfile?.id);

    // Health-score uses Claude as primary, Groq as fallback
    const claudeKey = Deno.env.get("claude_api_key");
    const groqKeys = [
      Deno.env.get("GROQ_API_KEY"),
      Deno.env.get("GROQ_API_KEY_2"),
      Deno.env.get("GROQ_API_KEY_3"),
      Deno.env.get("GROQ_API_KEY_4"),
      Deno.env.get("GROQ_API_KEY_5"),
      Deno.env.get("GROQ_API_KEY_6")
    ].filter(Boolean);

    // Claude first, then Groq keys as fallback
    const allApiKeys = [...(claudeKey ? [claudeKey] : []), ...groqKeys];

    console.log("🔑 API Key Priority:", {
      totalKeys: allApiKeys.length,
      primary: claudeKey ? "Claude API" : "No Claude key",
      fallback: `${groqKeys.length} Groq keys available`,
      keyOrder: allApiKeys.map((key, i) => 
        key === claudeKey ? `Claude-${i + 1}` : `Groq-${i + 1}`
      )
    });

    if (allApiKeys.length === 0) {
      console.log("❌ No API keys available, using fallback");
      
      // Calculate fallback health score based on user profile
      const calculateFallbackScore = (profile) => {
        let score = 50; // Base score
        
        // Age factor
        const age = parseInt(profile?.age) || 30;
        if (age < 30) score += 10;
        else if (age < 50) score += 5;
        else if (age < 70) score -= 5;
        else score -= 10;
        
        // BMI factor
        const height = parseFloat(profile?.height) || 170;
        const weight = parseFloat(profile?.weight) || 70;
        const bmi = weight / ((height / 100) ** 2);
        if (bmi >= 18.5 && bmi <= 24.9) score += 20;
        else if (bmi < 18.5) score -= 5;
        else if (bmi > 24.9 && bmi < 30) score -= 5;
        else score -= 10;
        
        // Exercise factor
        const exerciseFreq = parseInt(profile?.exercise_frequency) || 0;
        if (exerciseFreq >= 5) score += 15;
        else if (exerciseFreq >= 3) score += 10;
        else if (exerciseFreq >= 1) score += 5;
        else score -= 10;
        
        // Sleep factor
        const sleepHours = parseFloat(profile?.sleep_hours) || 7;
        if (sleepHours >= 7 && sleepHours <= 9) score += 15;
        else if (sleepHours >= 6 && sleepHours < 7) score += 5;
        else score -= 15;
        
        // Stress factor
        const stressLevel = parseInt(profile?.stress_level) || 5;
        if (stressLevel <= 3) score += 10;
        else if (stressLevel >= 7) score -= 15;
        
        // Diet factor
        const dietType = profile?.diet_type?.toLowerCase() || '';
        if (dietType.includes('balanced') || dietType.includes('mediterranean')) score += 15;
        else if (dietType.includes('vegetarian') || dietType.includes('vegan')) score += 10;
        else score -= 10;
        
        // Medical conditions factor
        if (profile?.chronic_conditions?.length > 0) score -= profile.chronic_conditions.length * 10;
        if (profile?.medications?.length > 0) score -= profile.medications.length * 5;
        
        // Health goals factor
        if (profile?.health_goals?.length > 0) score += 10;
        else score -= 5;
        
        return Math.max(0, Math.min(100, Math.round(score)));
      };
      
      const calculatedScore = calculateFallbackScore(userProfile);
      
      const fallbackResponse = {
        success: true,
        healthScore: calculatedScore,
        displayAnalysis: {
          greeting: "Hi there, based on your health profile analysis:",
          negativeAnalysis: ["Your current lifestyle may be impacting your health", "There are signs of potential health risks", "Your stress levels appear elevated", "Sleep patterns need improvement", "Dietary habits could be optimized"],
          lifestyleRecommendations: ["Change lifestyle: Increase daily water intake to 8 glasses", "Change lifestyle: Establish a consistent sleep schedule", "Change lifestyle: Incorporate 30 minutes of daily exercise", "Change lifestyle: Practice stress management techniques", "Change lifestyle: Focus on whole foods and balanced nutrition"]
        },
        detailedAnalysis: {
          healthRisks: ["General health risk assessment"],
          nutritionalProfile: {
            mealTimings: ["Breakfast: 7:00 AM", "Lunch: 12:30 PM", "Dinner: 7:00 PM"],
            dietaryNeeds: ["Balanced macronutrients", "Adequate hydration"],
            foodPreferences: ["Based on current diet type"]
          },
          exerciseProfile: {
            workoutSchedule: ["Morning: 6:00 AM - Cardio", "Evening: 6:00 PM - Strength"],
            exerciseTypes: ["Cardiovascular exercises", "Strength training"],
            intensityLevels: ["Beginner level recommended"]
          },
          sleepProfile: {
            bedtimeRoutine: ["Wind down 1 hour before bed", "Avoid screens 30 minutes before sleep"],
            wakeUpRoutine: ["Consistent wake time", "Morning hydration"],
            sleepOptimization: ["7-9 hours of quality sleep"]
          },
          stressManagement: {
            stressTriggers: ["Work-related stress", "Lifestyle factors"],
            relaxationTechniques: ["Deep breathing", "Meditation"],
            mindfulnessPractices: ["Daily mindfulness exercises"]
          },
          healthGoalsAlignment: {
            goalProgress: ["Assess current goal progress"],
            goalModifications: ["Adjust goals based on current status"],
            timelineRecommendations: ["Realistic goal timelines"]
          },
          medicalConsiderations: {
            medicationInteractions: ["Review current medications"],
            conditionManagement: ["Manage any existing conditions"],
            preventiveMeasures: ["Focus on prevention strategies"]
          }
        },
        meta: {
          provider: "Fallback-Response",
          timestamp: new Date().toISOString(),
          note: "Using fallback response due to API unavailability"
        }
      };
      
      return new Response(
        JSON.stringify(fallbackResponse),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Prepare the prompt for health risk analysis and causes
    const prompt = `You are a medical risk assessment AI specializing in analyzing onboarding data to identify health risks and their root causes. Focus on risk factors, potential health issues, and underlying causes based on the user's comprehensive health profile.

CRITICAL: Analyze the user's onboarding data to identify specific health risks, potential medical conditions, and the root causes behind their current health status.

User Profile Data:
- Age: ${userProfile?.age || 'Not specified'}
- Gender: ${userProfile?.gender || 'Not specified'}
- Height: ${userProfile?.height || 'Not specified'} cm
- Weight: ${userProfile?.weight || 'Not specified'} kg
- Activity Level: ${userProfile?.activity_level || 'Not specified'}
- Health Goals: ${userProfile?.health_goals?.join(', ') || 'Not specified'}
- Medical Conditions: ${userProfile?.medical_conditions?.join(', ') || 'None'}
- Medications: ${userProfile?.medications?.join(', ') || 'None'}
- Allergies: ${userProfile?.allergies?.join(', ') || 'None'}
- Sleep Hours: ${userProfile?.sleep_hours || 'Not specified'} hours
- Stress Level: ${userProfile?.stress_level || 'Not specified'}/10
- Diet Type: ${userProfile?.diet_type || 'Not specified'}
- Exercise Frequency: ${userProfile?.exercise_frequency || 'Not specified'} times/week
- Chronic Conditions: ${userProfile?.chronic_conditions?.join(', ') || 'None'}
- Family History: ${userProfile?.family_history?.join(', ') || 'None'}
- Lifestyle Factors: ${userProfile?.lifestyle_factors?.join(', ') || 'None'}

Additional Input: ${userInput || 'None'}
Uploaded Files: ${uploadedFiles ? 'Files uploaded' : 'None'}
Voice Transcript: ${voiceTranscript || 'None'}

ANALYSIS REQUIREMENTS:
1. Calculate a comprehensive health score (0-100) based on:
   - Age factor: Younger = higher score, older = lower score
   - BMI: Healthy range (18.5-24.9) = +20 points, overweight = -10 points, underweight = -5 points
   - Exercise frequency: 5+ times/week = +15 points, 3-4 times = +10 points, 1-2 times = +5 points, none = -10 points
   - Sleep quality: 7-9 hours = +15 points, 6-7 hours = +5 points, <6 hours = -15 points
   - Stress level: Low (1-3) = +10 points, Medium (4-6) = 0 points, High (7-10) = -15 points
   - Diet quality: Balanced/Mediterranean = +15 points, Vegetarian/Vegan = +10 points, Poor = -10 points
   - Medical conditions: Each chronic condition = -10 points, medications = -5 points
   - Health goals: Having goals = +10 points, no goals = -5 points
2. Identify specific health risks and their severity levels
3. Analyze root causes of identified risks
4. Provide evidence-based recommendations
5. Highlight critical areas requiring immediate attention
6. Suggest preventive measures

RESPONSE FORMAT (JSON):
{
  "healthScore": number (0-100),
  "displayAnalysis": {
    "greeting": "Hi [user's first name], based on your health profile analysis:",
    "negativeAnalysis": [
      "🚨 Specific health concern 1 based on profile data",
      "🚨 Specific health concern 2 based on profile data", 
      "🚨 Specific health concern 3 based on profile data",
      "🚨 Specific health concern 4 based on profile data",
      "🚨 Specific health concern 5 based on profile data"
    ],
    "lifestyleRecommendations": [
      "💚 Change lifestyle: Do this specific action",
      "💚 Change lifestyle: Do that specific action",
      "💚 Change lifestyle: Do another specific action",
      "💚 Change lifestyle: Do this to significantly improve health",
      "💚 Change lifestyle: Do that to significantly improve health"
    ]
  },
  "detailedAnalysis": {
    "healthRisks": ["Detailed risk analysis for internal use"],
    "nutritionalProfile": {
      "mealTimings": ["Breakfast: 7:00 AM", "Lunch: 12:30 PM", "Dinner: 7:00 PM"],
      "dietaryNeeds": ["Specific nutritional requirements"],
      "foodPreferences": ["Based on diet type and restrictions"]
    },
    "exerciseProfile": {
      "workoutSchedule": ["Morning: 6:00 AM - Cardio", "Evening: 6:00 PM - Strength"],
      "exerciseTypes": ["Recommended exercise types"],
      "intensityLevels": ["Beginner/Intermediate/Advanced recommendations"]
    },
    "sleepProfile": {
      "bedtimeRoutine": ["Specific sleep recommendations"],
      "wakeUpRoutine": ["Morning routine suggestions"],
      "sleepOptimization": ["Sleep quality improvements"]
    },
    "stressManagement": {
      "stressTriggers": ["Identified stress sources"],
      "relaxationTechniques": ["Specific stress relief methods"],
      "mindfulnessPractices": ["Meditation and mindfulness suggestions"]
    },
    "healthGoalsAlignment": {
      "goalProgress": ["Current progress towards goals"],
      "goalModifications": ["Suggested goal adjustments"],
      "timelineRecommendations": ["Realistic timelines for goals"]
    },
    "medicalConsiderations": {
      "medicationInteractions": ["Any medication considerations"],
      "conditionManagement": ["Chronic condition management"],
      "preventiveMeasures": ["Disease prevention strategies"]
    }
  },
  "meta": {
    "provider": "Groq-API",
    "timestamp": "ISO string",
    "model": "llama-3.3-70b-versatile"
  }
}`;

    let response;
    let usedKey = "none";
    let lastError = null;
    
    // Try Claude first (primary), then Groq keys (fallback)
    for (let i = 0; i < allApiKeys.length; i++) {
      try {
        const currentKey = allApiKeys[i];
        const isClaudeKey = currentKey === claudeKey;
        const attemptType = isClaudeKey ? 'PRIMARY (Claude)' : 'FALLBACK (Groq)';
        
        console.log(`🔑 Trying ${attemptType} API key ${i + 1}/${allApiKeys.length}...`);
        
        if (isClaudeKey) {
          // Claude API call
          response = await fetch("https://api.anthropic.com/v1/messages", {
            method: "POST",
            headers: {
              "x-api-key": currentKey,
              "Content-Type": "application/json",
              "anthropic-version": "2023-06-01"
            },
            body: JSON.stringify({
              model: "claude-sonnet-4-20250514",
              max_tokens: 8000,
              temperature: 0.9,
              messages: [
                {
                  role: "user",
                  content: `You are Dr. Marcus Chen, a world-renowned integrative medicine physician and certified functional medicine practitioner with 20+ years of experience. You specialize in comprehensive health assessment and root cause analysis. Provide detailed, accurate, and helpful health analysis based on user data. Always respond in valid JSON format with comprehensive details.\n\n${prompt}`
                }
              ]
            })
          });
        } else {
          // Groq API call
        response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
          method: "POST",
          headers: {
              "Authorization": `Bearer ${currentKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model: "llama-3.3-70b-versatile",
            messages: [
              {
                role: "system",
                content: "You are Dr. Marcus Chen, a world-renowned integrative medicine physician and certified functional medicine practitioner with 20+ years of experience. You specialize in comprehensive health assessment and root cause analysis. Provide detailed, accurate, and helpful health analysis based on user data. Always respond in valid JSON format with comprehensive details."
              },
              {
                role: "user",
                content: prompt
              }
            ],
            max_tokens: 8000,
            temperature: 0.9,
            top_p: 0.95,
            frequency_penalty: 0.1,
            presence_penalty: 0.1
          })
        });
        }
        
        if (response.ok) {
          usedKey = `${isClaudeKey ? 'claude' : 'groq'}-key-${i + 1}`;
          console.log(`✅ ${attemptType} API key ${i + 1} worked! Status: ${response.status}`);
          break;
        } else {
          console.log(`❌ ${attemptType} API key ${i + 1} failed: ${response.status}`);
          lastError = `Status ${response.status}`;
        }
      } catch (error) {
        console.log(`❌ API key ${i + 1} error: ${error.message}`);
        lastError = error.message;
      }
    }
    
    if (!response || !response.ok) {
      throw new Error(`All API keys failed. Last error: ${lastError}`);
    }

    const data = await response.json();
    console.log("📊 API response received");

    // Extract JSON from response (handle both Groq and Claude formats)
    let healthData;
    try {
      let content = "";
      
      // Handle different API response formats
      if (data.choices && data.choices[0]?.message?.content) {
        // Groq API format
        content = data.choices[0].message.content;
        console.log("📝 Groq response format detected");
      } else if (data.content && data.content[0]?.text) {
        // Claude API format
        content = data.content[0].text;
        console.log("📝 Claude response format detected");
      } else {
        throw new Error("Unknown API response format");
      }
      
      console.log("📝 Raw response:", content.substring(0, 200) + "...");
      
      // Try to parse as JSON directly
      healthData = JSON.parse(content);
    } catch (parseError) {
      console.log("⚠️ Direct JSON parse failed, trying to extract JSON...");
      try {
        // Try to extract JSON from the response
        const jsonMatch = content.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          healthData = JSON.parse(jsonMatch[0]);
        } else {
          throw new Error("No JSON found in response");
        }
      } catch (extractError) {
        console.log("❌ JSON extraction failed, using fallback");
        healthData = {
          healthScore: 75,
          analysis: {
            overall: "Good health with room for improvement",
            strengths: ["Regular exercise routine", "Balanced diet", "Good sleep habits"],
            areasForImprovement: ["Stress management", "Hydration levels", "Regular health checkups"],
            recommendations: ["Increase water intake to 8 glasses daily", "Practice stress-reduction techniques", "Schedule annual health checkup"]
          },
          recommendations: ["Focus on stress management", "Maintain current exercise routine", "Improve hydration habits"]
        };
      }
    }

    // Ensure required fields exist
    const result = {
      success: true,
      healthScore: healthData.healthScore || 75,
      // Display data for UI
      displayAnalysis: healthData.displayAnalysis || {
        greeting: `Hi ${userProfile?.full_name?.split(' ')[0] || 'there'}, based on your health profile analysis:`,
        negativeAnalysis: ["🚨 Your current lifestyle may be impacting your health", "🚨 There are signs of potential health risks", "🚨 Your stress levels appear elevated", "🚨 Sleep patterns need improvement", "🚨 Dietary habits could be optimized"],
        lifestyleRecommendations: ["💚 Change lifestyle: Increase daily water intake to 8 glasses", "💚 Change lifestyle: Establish a consistent sleep schedule", "💚 Change lifestyle: Incorporate 30 minutes of daily exercise", "💚 Change lifestyle: Practice stress management techniques", "💚 Change lifestyle: Focus on whole foods and balanced nutrition"]
      },
      // Detailed data for other functions (saved to DB)
      detailedAnalysis: healthData.detailedAnalysis || {
        healthRisks: ["General health risk assessment"],
        nutritionalProfile: {
          mealTimings: ["Breakfast: 7:00 AM", "Lunch: 12:30 PM", "Dinner: 7:00 PM"],
          dietaryNeeds: ["Balanced macronutrients", "Adequate hydration"],
          foodPreferences: ["Based on current diet type"]
        },
        exerciseProfile: {
          workoutSchedule: ["Morning: 6:00 AM - Cardio", "Evening: 6:00 PM - Strength"],
          exerciseTypes: ["Cardiovascular exercises", "Strength training"],
          intensityLevels: ["Beginner level recommended"]
        },
        sleepProfile: {
          bedtimeRoutine: ["Wind down 1 hour before bed", "Avoid screens 30 minutes before sleep"],
          wakeUpRoutine: ["Consistent wake time", "Morning hydration"],
          sleepOptimization: ["7-9 hours of quality sleep"]
        },
        stressManagement: {
          stressTriggers: ["Work-related stress", "Lifestyle factors"],
          relaxationTechniques: ["Deep breathing", "Meditation"],
          mindfulnessPractices: ["Daily mindfulness exercises"]
        },
        healthGoalsAlignment: {
          goalProgress: ["Assess current goal progress"],
          goalModifications: ["Adjust goals based on current status"],
          timelineRecommendations: ["Realistic goal timelines"]
        },
        medicalConsiderations: {
          medicationInteractions: ["Review current medications"],
          conditionManagement: ["Manage any existing conditions"],
          preventiveMeasures: ["Focus on prevention strategies"]
        }
      },
      meta: {
        provider: usedKey.startsWith('claude') ? `Claude-API-${usedKey}` : `Groq-API-${usedKey}`,
        timestamp: new Date().toISOString(),
        model: usedKey.startsWith('claude') ? "claude-sonnet-4-20250514" : "llama-3.3-70b-versatile"
      }
    };

    console.log("✅ Health score generated successfully");

    // Save analysis data to database (upsert to prevent duplicates)
    try {
      // First, set all existing records for this user to is_latest = false
      await supabase
        .from('health_analysis')
        .update({ is_latest: false })
        .eq('user_id', userProfile.id);

      // Then insert the new analysis
      const { error: analysisError } = await supabase
        .from('health_analysis')
        .insert({
          user_id: userProfile.id,
          health_score: result.healthScore,
          display_analysis: result.displayAnalysis,
          detailed_analysis: result.detailedAnalysis,
          ai_provider: usedKey.startsWith('claude') ? 'claude' : 'groq',
          ai_model: usedKey.startsWith('claude') ? 'claude-sonnet-4-20250514' : 'llama-3.3-70b-versatile',
          user_input: userInput || null,
          uploaded_files: uploadedFiles || null,
          voice_transcript: voiceTranscript || null,
          calculation_method: 'ai_analysis',
          factors_considered: [
            'age', 'bmi', 'exercise_frequency', 'sleep_quality', 'stress_level',
            'diet_quality', 'medical_conditions', 'health_goals', 'lifestyle_factors'
          ],
          generation_parameters: {
            used_key: usedKey,
            prompt_version: '2.0',
            analysis_type: 'comprehensive_health_assessment'
          },
          analysis_date: new Date().toISOString().split('T')[0],
          is_latest: true
        });

      if (analysisError) {
        console.error('❌ Error saving health analysis to database:', analysisError);
        // Don't fail the request, just log the error
      } else {
        console.log('✅ Health analysis saved to database successfully');
      }
    } catch (dbError) {
      console.error('❌ Database error:', dbError);
      // Don't fail the request, just log the error
    }

    return new Response(
      JSON.stringify(result),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error('❌ Health score generation error:', error);
    
    // Calculate fallback health score based on user profile
    const calculateFallbackScore = (profile) => {
      let score = 50; // Base score
      
      // Age factor
      const age = parseInt(profile?.age) || 30;
      if (age < 30) score += 10;
      else if (age < 50) score += 5;
      else if (age < 70) score -= 5;
      else score -= 10;
      
      // BMI factor
      const height = parseFloat(profile?.height) || 170;
      const weight = parseFloat(profile?.weight) || 70;
      const bmi = weight / ((height / 100) ** 2);
      if (bmi >= 18.5 && bmi <= 24.9) score += 20;
      else if (bmi < 18.5) score -= 5;
      else if (bmi > 24.9 && bmi < 30) score -= 5;
      else score -= 10;
      
      // Exercise factor
      const exerciseFreq = parseInt(profile?.exercise_frequency) || 0;
      if (exerciseFreq >= 5) score += 15;
      else if (exerciseFreq >= 3) score += 10;
      else if (exerciseFreq >= 1) score += 5;
      else score -= 10;
      
      // Sleep factor
      const sleepHours = parseFloat(profile?.sleep_hours) || 7;
      if (sleepHours >= 7 && sleepHours <= 9) score += 15;
      else if (sleepHours >= 6 && sleepHours < 7) score += 5;
      else score -= 15;
      
      // Stress factor
      const stressLevel = parseInt(profile?.stress_level) || 5;
      if (stressLevel <= 3) score += 10;
      else if (stressLevel >= 7) score -= 15;
      
      // Diet factor
      const dietType = profile?.diet_type?.toLowerCase() || '';
      if (dietType.includes('balanced') || dietType.includes('mediterranean')) score += 15;
      else if (dietType.includes('vegetarian') || dietType.includes('vegan')) score += 10;
      else score -= 10;
      
      // Medical conditions factor
      if (profile?.chronic_conditions?.length > 0) score -= profile.chronic_conditions.length * 10;
      if (profile?.medications?.length > 0) score -= profile.medications.length * 5;
      
      // Health goals factor
      if (profile?.health_goals?.length > 0) score += 10;
      else score -= 5;
      
      return Math.max(0, Math.min(100, Math.round(score)));
    };
    
    const calculatedScore = calculateFallbackScore(userProfile);
    
    // Provide a fallback health score response
    const fallbackResponse = {
      success: true,
      healthScore: calculatedScore,
      displayAnalysis: {
        greeting: "Hi there, based on your health profile analysis:",
        negativeAnalysis: ["Your current lifestyle may be impacting your health", "There are signs of potential health risks", "Your stress levels appear elevated", "Sleep patterns need improvement", "Dietary habits could be optimized"],
        lifestyleRecommendations: ["Change lifestyle: Increase daily water intake to 8 glasses", "Change lifestyle: Establish a consistent sleep schedule", "Change lifestyle: Incorporate 30 minutes of daily exercise", "Change lifestyle: Practice stress management techniques", "Change lifestyle: Focus on whole foods and balanced nutrition"]
      },
      detailedAnalysis: {
        healthRisks: ["General health risk assessment"],
        nutritionalProfile: {
          mealTimings: ["Breakfast: 7:00 AM", "Lunch: 12:30 PM", "Dinner: 7:00 PM"],
          dietaryNeeds: ["Balanced macronutrients", "Adequate hydration"],
          foodPreferences: ["Based on current diet type"]
        },
        exerciseProfile: {
          workoutSchedule: ["Morning: 6:00 AM - Cardio", "Evening: 6:00 PM - Strength"],
          exerciseTypes: ["Cardiovascular exercises", "Strength training"],
          intensityLevels: ["Beginner level recommended"]
        },
        sleepProfile: {
          bedtimeRoutine: ["Wind down 1 hour before bed", "Avoid screens 30 minutes before sleep"],
          wakeUpRoutine: ["Consistent wake time", "Morning hydration"],
          sleepOptimization: ["7-9 hours of quality sleep"]
        },
        stressManagement: {
          stressTriggers: ["Work-related stress", "Lifestyle factors"],
          relaxationTechniques: ["Deep breathing", "Meditation"],
          mindfulnessPractices: ["Daily mindfulness exercises"]
        },
        healthGoalsAlignment: {
          goalProgress: ["Assess current goal progress"],
          goalModifications: ["Adjust goals based on current status"],
          timelineRecommendations: ["Realistic goal timelines"]
        },
        medicalConsiderations: {
          medicationInteractions: ["Review current medications"],
          conditionManagement: ["Manage any existing conditions"],
          preventiveMeasures: ["Focus on prevention strategies"]
        }
      },
      meta: {
        provider: "Fallback-Response",
        timestamp: new Date().toISOString(),
        note: "Using fallback response due to API unavailability"
      }
    };
    
    return new Response(
      JSON.stringify(fallbackResponse),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});