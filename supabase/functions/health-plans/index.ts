import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// Initialize Supabase client
const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type"
};

// Claude-only for health-plans
const CLAUDE_API_KEY = Deno.env.get('claude_api_key');

console.log('🔑 Claude API Key status:', CLAUDE_API_KEY ? 'Present' : 'Missing');
console.log('🔑 API Key length:', CLAUDE_API_KEY ? CLAUDE_API_KEY.length : 0);

// Helper function to get Claude API key only
const getApiKeys = () => {
  const keys = CLAUDE_API_KEY ? [CLAUDE_API_KEY] : [];
  console.log('🔑 Available API keys:', keys.length);
  return keys;
};

serve(async (req) => {
  console.log('🚀 Health-plans function called!', req.method, req.url);
  
  if (req.method === "OPTIONS") {
    console.log('✅ CORS preflight request handled');
    return new Response("ok", { headers: corsHeaders });
  }

  // Parse request data once at the beginning
  let requestData;
  try {
    requestData = await req.json();
    console.log('📥 Request data received:', JSON.stringify(requestData, null, 2));
  } catch (parseError) {
    console.error('❌ JSON parse error:', parseError);
    return new Response(JSON.stringify({
      error: "Invalid JSON in request body"
    }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" }
    });
  }

  const { userProfile, primaryGoal, userInput, healthScore, healthAnalysis } = requestData;

  try {

    // Handle both parameter names for compatibility
    const goal = primaryGoal || userInput || "General wellness";

    if (!userProfile) {
      return new Response(JSON.stringify({
        error: "User profile is required"
      }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    }

    // Calculate severity/urgency based on health data
    const calculateSeverity = () => {
      let severityScore = 0;
      
      // Health score impact
      if (healthScore < 50) severityScore += 3;
      else if (healthScore < 70) severityScore += 2;
      else if (healthScore < 80) severityScore += 1;
      
      // Chronic conditions
      if (userProfile.chronic_conditions?.length > 0) severityScore += 2;
      
      // Age factor
      if (userProfile.age > 50) severityScore += 1;
      
      // BMI if available
      const bmi = userProfile.bmi || 
        (userProfile.weight_kg / Math.pow(userProfile.height_cm / 100, 2));
      if (bmi < 18.5 || bmi > 30) severityScore += 2;
      else if (bmi > 25) severityScore += 1;
      
      return severityScore;
    };

    const severity = calculateSeverity();
    
    // Determine durations based on severity
    let plan1Duration, plan2Duration, plan3Duration;
    if (severity >= 5) {
      plan1Duration = "4-6 weeks";
      plan2Duration = "8-12 weeks";
      plan3Duration = "12-16 weeks";
    } else if (severity >= 3) {
      plan1Duration = "6-8 weeks";
      plan2Duration = "10-14 weeks";
      plan3Duration = "16-20 weeks";
    } else {
      plan1Duration = "8-10 weeks";
      plan2Duration = "12-16 weeks";
      plan3Duration = "20-24 weeks";
    }

    // Build comprehensive prompt incorporating health analysis
    const prompt = `Generate 3 distinct fitness plans for this person based on their comprehensive health analysis.

PRIMARY GOAL: ${goal}
SECONDARY GOALS: ${userProfile.health_goals?.filter(g => g !== goal).join(', ') || 'General wellness'}

USER PROFILE:
- Name: ${userProfile.full_name}, Age: ${userProfile.age}, Gender: ${userProfile.gender}
- Weight: ${userProfile.weight_kg}kg, Height: ${userProfile.height_cm}cm (${userProfile.height_feet}'${userProfile.height_inches}")
- Health Score: ${healthScore}/100
- Diet: ${userProfile.diet_type}, Blood Group: ${userProfile.blood_group || 'Not specified'}
- Workout Preference: ${userProfile.workout_type}, Routine Flexibility: ${userProfile.routine_flexibility}/10
- Fitness Level: ${userProfile.activity_level || 'Moderate'}
- Sleep Schedule: Wake up ${userProfile.wake_up_time}, Sleep ${userProfile.sleep_time}
- Work Schedule: ${userProfile.work_start} - ${userProfile.work_end}
- Meal Times: Breakfast ${userProfile.breakfast_time}, Lunch ${userProfile.lunch_time}, Dinner ${userProfile.dinner_time}
- Workout Time: ${userProfile.workout_time}
- Chronic Conditions: ${userProfile.chronic_conditions?.join(', ') || 'None'}
- Medications: ${userProfile.medications?.join(', ') || 'None'}
- Critical Conditions: ${userProfile.critical_conditions || 'None'}
- Smoking: ${userProfile.smoking || 'None'}, Drinking: ${userProfile.drinking || 'None'}
- Location: ${userProfile.country}, ${userProfile.state}, ${userProfile.district}
- Health Goals: ${userProfile.health_goals?.join(', ') || 'General wellness'}

HEALTH ANALYSIS INSIGHTS (from previous AI assessment):
${healthAnalysis ? `
- Health Concerns: ${healthAnalysis.displayAnalysis?.negativeAnalysis?.join(', ') || 'General health maintenance'}
- Key Recommendations: ${healthAnalysis.displayAnalysis?.lifestyleRecommendations?.join(', ') || 'Focus on overall wellness'}
- Nutritional Profile: ${healthAnalysis.detailedAnalysis?.nutritionalProfile ? JSON.stringify(healthAnalysis.detailedAnalysis.nutritionalProfile) : 'Standard nutritional needs'}
- Exercise Profile: ${healthAnalysis.detailedAnalysis?.exerciseProfile ? JSON.stringify(healthAnalysis.detailedAnalysis.exerciseProfile) : 'General fitness approach'}
- Sleep Profile: ${healthAnalysis.detailedAnalysis?.sleepProfile ? JSON.stringify(healthAnalysis.detailedAnalysis.sleepProfile) : 'Standard sleep needs'}
- Stress Management: ${healthAnalysis.detailedAnalysis?.stressManagement ? JSON.stringify(healthAnalysis.detailedAnalysis.stressManagement) : 'General stress management'}
- Medical Considerations: ${healthAnalysis.detailedAnalysis?.medicalConsiderations ? JSON.stringify(healthAnalysis.detailedAnalysis.medicalConsiderations) : 'No specific medical restrictions'}
` : 'No previous health analysis available'}

SEVERITY LEVEL: ${severity}/7 (${severity >= 5 ? 'High' : severity >= 3 ? 'Moderate' : 'Low'})

Generate 3 DIFFERENT approaches with these durations:
- Plan 1 (Gentle): ${plan1Duration}
- Plan 2 (Balanced): ${plan2Duration}
- Plan 3 (Intensive): ${plan3Duration}

REQUIREMENTS:
1. Creative 2-3 word names based on PRIMARY goal "${primaryGoal}"
   Examples: "Lean Transform", "Power Builder", "Energy Revival", "Vitality Boost"
   
2. Each plan MUST have DIFFERENT:
   - Approach/philosophy
   - Calorie targets
   - Workout frequency
   - Meal complexity
   
3. CRITICAL: Use the health analysis insights to personalize each plan:
   - Address specific health concerns identified in the analysis
   - Incorporate the detailed nutritional, exercise, sleep, and stress management recommendations
   - Consider medical considerations and restrictions
   - Align with the user's specific health profile and risk factors
   
4. Include planScheduleRequirements for activity generation:
   - workoutWindows: available times for exercise (based on user's schedule from analysis)
   - mealPrepComplexity: simple/medium/advanced (based on user's lifestyle from analysis)
   - recoveryNeeds: hours of sleep needed (based on sleep profile from analysis)
   - intensityLevel: low/moderate/high (based on fitness level and health concerns)
   - dietaryFocus: what to emphasize in meals (based on nutritional profile from analysis)

Return ONLY valid JSON:
{
  "plans": [
    {
      "id": "plan_1",
      "name": "Two-Three Words",
      "description": "100 word description explaining approach",
      "duration": "${plan1Duration}",
      "difficulty": "Gentle/Balanced/Intensive",
      "calorieTarget": 1800,
      "macros": {
        "protein": 25,
        "carbs": 45,
        "fats": 30
      },
      "workoutFrequency": "3 days/week",
      "focusAreas": ["area1", "area2", "area3", "area4", "area5"],
      "benefits": ["benefit1", "benefit2", "benefit3", "benefit4"],
      "planScheduleRequirements": {
        "workoutWindows": ["morning/afternoon/evening"],
        "mealPrepComplexity": "simple",
        "recoveryNeeds": "8 hours sleep",
        "intensityLevel": "low",
        "dietaryFocus": "${userProfile.diet_type} meals with focus on ${primaryGoal}"
      }
    }
  ]
}`;

    const apiKeys = getApiKeys();
    console.log('🔑 API Key Priority:', {
      totalKeys: apiKeys.length,
      primary: CLAUDE_API_KEY ? "Claude API" : "No Claude key",
      fallback: `${apiKeys.filter(key => key !== CLAUDE_API_KEY).length} Groq keys available`
    });
    
    if (apiKeys.length === 0) {
      console.log('❌ No API keys available, using fallback');
      throw new Error('No API keys configured');
    }

    let response;
    let usedKey = "none";
    let lastError: string | null = null;
    
    // Use Claude API only
    for (let i = 0; i < apiKeys.length; i++) {
      try {
        const currentKey = apiKeys[i];
        
        console.log(`🔑 Using Claude API key ${i + 1}/${apiKeys.length}...`);
        console.log(`🔑 API Key preview: ${currentKey ? currentKey.substring(0, 10) + '...' : 'null'}`);
        
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
            max_tokens: 3500,
            temperature: 0.8,
            messages: [
              {
                role: "user",
                content: `You are an expert fitness planning AI specializing in creating personalized health plans based on comprehensive health analysis. Generate 3 DISTINCT plans with creative 2-3 word names. Each plan must address the user's specific health concerns, incorporate their detailed health analysis insights, and have different durations, calorie targets, and approaches. Use the health analysis data to create highly personalized and medically appropriate plans. Return ONLY valid JSON.\n\n${prompt}`
              }
            ]
          })
        });
        
        if (response.ok) {
          usedKey = `claude-key-${i + 1}`;
          console.log(`✅ Claude API key ${i + 1} worked! Status: ${response.status}`);
          break;
        } else {
          const errorText = await response.text();
          console.log(`❌ Claude API key ${i + 1} failed: ${response.status}`);
          console.log(`❌ Error response: ${errorText}`);
          lastError = `Status ${response.status}: ${errorText}`;
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
    let responseText = "";
    
    // Handle Claude API response format
    if (data.content && data.content[0]?.text) {
      responseText = data.content[0].text.trim();
      console.log("📝 Claude response format detected");
    } else {
      throw new Error("Claude API response format not recognized");
    }

    // Clean markdown
    if (responseText.includes('```')) {
      const match = responseText.match(/```(?:json)?\s*(\{[\s\S]*\})\s*```/);
      if (match) responseText = match[1];
    }

    const parsedPlans = JSON.parse(responseText);

    // Validate and add IDs
    if (!parsedPlans.plans || !Array.isArray(parsedPlans.plans)) {
      throw new Error('Invalid plans format from AI');
    }

    parsedPlans.plans.forEach((plan, index) => {
      if (!plan.id) plan.id = `plan_${index + 1}`;
      if (!plan.planScheduleRequirements) {
        plan.planScheduleRequirements = {
          workoutWindows: ["morning", "evening"],
          mealPrepComplexity: index === 0 ? "simple" : index === 1 ? "medium" : "advanced",
          recoveryNeeds: "8 hours sleep",
          intensityLevel: index === 0 ? "low" : index === 1 ? "moderate" : "high",
          dietaryFocus: `${userProfile.diet_type} meals supporting ${goal}`
        };
      }
    });

    // Get the latest health analysis for this user
    let healthAnalysisId = null;
    if (healthAnalysis?.id) {
      healthAnalysisId = healthAnalysis.id;
    } else {
      // Try to get the latest health analysis from database
      const { data: latestAnalysis } = await supabase
        .from('health_analysis')
        .select('id')
        .eq('user_id', userProfile.id)
        .eq('is_latest', true)
        .single();
      
      if (latestAnalysis) {
        healthAnalysisId = latestAnalysis.id;
      }
    }

    // Save plans data to database
    try {
      const { error: plansError } = await supabase
        .from('health_plans')
        .insert({
          user_id: userProfile.id,
          plan_name: `${goal} Plans`,
          plan_type: 'health_transformation',
          primary_goal: goal,
          secondary_goals: userProfile.health_goals?.filter(g => g !== goal) || [],
          start_date: new Date().toISOString().split('T')[0],
          target_end_date: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 90 days from now
          duration_weeks: 12,
          health_analysis_id: healthAnalysisId,
          user_input: userInput || null,
          plan_data: {
            plans: parsedPlans.plans,
            user_context: {
              primaryGoal: goal,
              secondaryGoals: userProfile.health_goals?.filter(g => g !== goal) || [],
              severityLevel: severity,
              healthScore
            },
            health_analysis_insights: healthAnalysis ? {
              health_concerns: healthAnalysis.displayAnalysis?.negativeAnalysis || [],
              recommendations: healthAnalysis.displayAnalysis?.lifestyleRecommendations || [],
              detailed_analysis: healthAnalysis.detailedAnalysis || {}
            } : null
          },
          status: 'draft',
          generation_model: usedKey.startsWith('claude') ? 'claude-sonnet-4-20250514' : 'llama-3.3-70b-versatile',
          generation_parameters: {
            ai_provider: usedKey.startsWith('claude') ? 'claude' : 'groq',
            used_key: usedKey,
            severity_level: severity,
            health_score: healthScore,
            health_analysis_used: !!healthAnalysisId
          }
        });

      if (plansError) {
        console.error('❌ Error saving health plans to database:', plansError);
        // Don't fail the request, just log the error
      } else {
        console.log('✅ Health plans saved to database successfully');
      }
    } catch (dbError) {
      console.error('❌ Database error:', dbError);
      // Don't fail the request, just log the error
    }

    return new Response(JSON.stringify({
      success: true,
      plans: parsedPlans.plans,
      userContext: {
        primaryGoal: goal,
        secondaryGoals: userProfile.health_goals?.filter(g => g !== goal) || [],
        severityLevel: severity,
        healthScore
      },
      meta: {
        provider: usedKey.startsWith('claude') ? `Claude-API-${usedKey}` : `Groq-API-${usedKey}`,
        timestamp: new Date().toISOString(),
        model: usedKey.startsWith('claude') ? "claude-sonnet-4-20250514" : "llama-3.3-70b-versatile"
      }
    }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" }
    });

  } catch (error) {
    console.error("Error generating plans:", error);

    // Fallback with dynamic data
    const { userProfile, primaryGoal, userInput, healthScore } = requestData;
    const goal = primaryGoal || userInput || "General wellness";
    
    const severity = healthScore < 60 ? 'high' : healthScore < 75 ? 'moderate' : 'low';
    const durations = severity === 'high' 
      ? ["4-6 weeks", "8-12 weeks", "12-16 weeks"]
      : ["6-8 weeks", "12-16 weeks", "20-24 weeks"];

    const fallbackPlans = [
          {
            id: "plan_1",
        name: `${goal.split(' ')[0]} Start`,
        description: `A gentle introduction to achieving your goal of ${goal.toLowerCase()}. Focuses on building sustainable habits with manageable steps.`,
        duration: durations[0],
        difficulty: "Gentle",
        calorieTarget: 1800,
        macros: { protein: 25, carbs: 45, fats: 30 },
        workoutFrequency: "3 days/week",
        focusAreas: ["Habit Building", "Basic Fitness", "Nutrition Basics", "Consistency", "Recovery"],
        benefits: ["Improved energy", "Better sleep", "Reduced stress", "Healthy foundation"],
        planScheduleRequirements: {
          workoutWindows: ["morning", "evening"],
          mealPrepComplexity: "simple",
          recoveryNeeds: "8 hours sleep",
          intensityLevel: "low",
          dietaryFocus: `${userProfile.diet_type} meals supporting ${goal}`
        }
          },
          {
            id: "plan_2",
        name: `${goal.split(' ')[0]} Progress`,
        description: `A balanced program combining progressive training with optimized nutrition to accelerate your ${goal.toLowerCase()} results.`,
        duration: durations[1],
        difficulty: "Balanced",
        calorieTarget: 2200,
        macros: { protein: 30, carbs: 40, fats: 30 },
        workoutFrequency: "5 days/week",
        focusAreas: ["Strength Building", "Endurance", "Meal Planning", "Active Recovery", "Progress Tracking"],
        benefits: ["Visible results", "Increased strength", "Better performance", "Sustainable progress"],
        planScheduleRequirements: {
          workoutWindows: ["morning", "afternoon", "evening"],
          mealPrepComplexity: "medium",
          recoveryNeeds: "7-8 hours sleep",
          intensityLevel: "moderate",
          dietaryFocus: `Balanced ${userProfile.diet_type} nutrition for ${goal}`
        }
          },
          {
            id: "plan_3",
        name: `${goal.split(' ')[0]} Elite`,
        description: `An intensive program designed for maximum results in ${goal.toLowerCase()} through advanced training and precision nutrition.`,
        duration: durations[2],
        difficulty: "Intensive",
        calorieTarget: 2600,
        macros: { protein: 35, carbs: 35, fats: 30 },
        workoutFrequency: "6 days/week",
        focusAreas: ["Peak Performance", "Advanced Training", "Precision Nutrition", "Recovery Optimization", "Mental Toughness"],
        benefits: ["Maximum results", "Peak conditioning", "Elite performance", "Complete transformation"],
        planScheduleRequirements: {
          workoutWindows: ["morning", "afternoon", "evening"],
          mealPrepComplexity: "advanced",
          recoveryNeeds: "8-9 hours sleep",
          intensityLevel: "high",
          dietaryFocus: `Optimized ${userProfile.diet_type} nutrition for peak ${goal}`
        }
      }
    ];

    return new Response(JSON.stringify({
        success: true,
      plans: fallbackPlans,
      userContext: {
        primaryGoal: goal,
        secondaryGoals: userProfile.health_goals?.filter(g => g !== goal) || [],
        severityLevel: severity,
        healthScore
      },
        meta: {
        provider: "Fallback",
        timestamp: new Date().toISOString(),
        note: "Using fallback due to API error"
      }
    }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" }
    });
  }
});