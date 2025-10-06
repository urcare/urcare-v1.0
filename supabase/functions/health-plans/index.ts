import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type"
};

// Multiple API keys for load balancing and fallback
const GROQ_API_KEY_1 = Deno.env.get('GROQ_API_KEY');
const GROQ_API_KEY_2 = Deno.env.get('GROQ_API_KEY_2');
const GROQ_API_KEY_3 = Deno.env.get('GROQ_API_KEY_3');
const GROQ_API_KEY_4 = Deno.env.get('GROQ_API_KEY_4');
const GROQ_API_KEY_5 = Deno.env.get('GROQ_API_KEY_5');
const GROQ_API_KEY_6 = Deno.env.get('GROQ_API_KEY_6');

// Helper function to get API key with fallback for health-plans
const getApiKey = () => {
  // Health-plans uses GROQ_API_KEY_3 and GROQ_API_KEY_4 (working keys)
  const keys = [GROQ_API_KEY_3, GROQ_API_KEY_4];
  return keys.find(key => key && key.trim() !== '') || null;
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  // Parse request data once at the beginning
  let requestData;
  try {
    requestData = await req.json();
  } catch (parseError) {
    return new Response(JSON.stringify({
      error: "Invalid JSON in request body"
    }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" }
    });
  }

  const { userProfile, primaryGoal, userInput, healthScore } = requestData;

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

    // Build comprehensive prompt for Groq
    const prompt = `Generate 3 distinct fitness plans for this person.

PRIMARY GOAL: ${goal}
SECONDARY GOALS: ${userProfile.health_goals?.filter(g => g !== goal).join(', ') || 'General wellness'}

USER PROFILE:
- Age: ${userProfile.age}, Gender: ${userProfile.gender}
- Weight: ${userProfile.weight_kg}kg, Height: ${userProfile.height_cm}cm
- Health Score: ${healthScore}/100
- Diet: ${userProfile.diet_type}
- Workout Preference: ${userProfile.workout_type}
- Fitness Level: ${userProfile.activity_level || 'Moderate'}
- Conditions: ${userProfile.chronic_conditions?.join(', ') || 'None'}
- Medications: ${userProfile.medications?.join(', ') || 'None'}
- Available Equipment: ${userProfile.available_equipment?.join(', ') || 'Basic'}

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
   
3. Include planScheduleRequirements for activity generation:
   - workoutWindows: available times for exercise
   - mealPrepComplexity: simple/medium/advanced
   - recoveryNeeds: hours of sleep needed
   - intensityLevel: low/moderate/high
   - dietaryFocus: what to emphasize in meals

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

    const apiKey = getApiKey();
    console.log('🔑 API Key Check:', {
      hasApiKey: !!apiKey,
      keyLength: apiKey ? apiKey.length : 0,
      keyPrefix: apiKey ? apiKey.substring(0, 10) + '...' : 'None'
    });
    
    if (!apiKey) {
      console.log('❌ No API keys available, using fallback');
      throw new Error('No GROQ API keys configured');
    }

    const groqResponse = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
            headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              model: "llama-3.3-70b-versatile",
              messages: [
                {
                  role: "system",
            content: "You are a fitness planning AI. Generate 3 DISTINCT plans with creative 2-3 word names. Each plan must have different durations, calorie targets, and approaches. Return ONLY valid JSON."
                },
                {
                  role: "user",
                  content: prompt
                }
              ],
        temperature: 0.8,
        max_tokens: 3500,
        response_format: { type: "json_object" }
            })
          });

    if (!groqResponse.ok) {
      console.log('❌ Groq API Error:', {
        status: groqResponse.status,
        statusText: groqResponse.statusText
      });
      throw new Error(`Groq API error: ${groqResponse.statusText}`);
    }

    const groqData = await groqResponse.json();
    let responseText = groqData.choices[0].message.content.trim();

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
        provider: "Groq-llama-3.3-70b",
        timestamp: new Date().toISOString()
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