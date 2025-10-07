import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// Initialize Supabase client
const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, GET, OPTIONS",
  "Access-Control-Max-Age": "86400",
};

// Groq-only configuration
const GROQ_CONFIG = {
  // Groq pricing (per 1M tokens) - much cheaper
  input_cost: 0.27,     // $0.27 per 1M input tokens
  output_cost: 0.27,     // $0.27 per 1M output tokens
  
  // Token limits for cost control
  max_input_tokens: 2000,     // Limit input to 2k tokens
  max_output_tokens: 1000,    // Limit output to 1k tokens
  max_daily_cost: 5.00,       // $5 daily limit
};

// Compress user profile and goal data for Groq
function compressUserData(userProfile: any, goal: string, healthScore: number): string {
  const bmi = userProfile.height_cm && userProfile.weight_kg ? 
    (userProfile.weight_kg / ((userProfile.height_cm / 100) ** 2)).toFixed(1) : 'N/A';
  
  return `N:${userProfile.full_name}|A:${userProfile.age}|G:${userProfile.gender}|BMI:${bmi}|HS:${healthScore}|Goal:${goal}|Diet:${userProfile.diet_type}|Workout:${userProfile.workout_type || 'None'}|C:${userProfile.chronic_conditions?.join(',') || 'None'}|S:${userProfile.workout_time || 'None'}|W:${userProfile.work_start}-${userProfile.work_end}`;
}

// Optimized prompt specifically for Groq
function createGroqOptimizedPrompt(userProfile: any, goal: string, healthScore: number): string {
  const compressed = compressUserData(userProfile, goal, healthScore);
  
  // Determine severity for plan durations
  const severity = healthScore < 50 ? 'high' : healthScore < 70 ? 'medium' : 'low';
  const durations = severity === 'high' ? ['4-6w', '8-12w', '12-16w'] : 
                   severity === 'medium' ? ['6-8w', '10-14w', '16-20w'] : 
                   ['8-10w', '12-16w', '20-24w'];
  
  return `Create 3 personalized health plans for: ${compressed}

Plans: 1)Gentle(${durations[0]},3d/w,1600cal) 2)Balanced(${durations[1]},4d/w,1800cal) 3)Intensive(${durations[2]},5d/w,2000cal)

JSON only:
{"plans":[{"id":"plan_1","name":"Creative 2-3 word name","description":"Brief description","duration":"${durations[0]}","difficulty":"Gentle","calorieTarget":1600,"macros":{"protein":25,"carbs":45,"fats":30},"workoutFrequency":"3 days/week","focusAreas":["area1","area2","area3"],"benefits":["benefit1","benefit2","benefit3"],"planScheduleRequirements":{"workoutWindows":["morning","evening"],"mealPrepComplexity":"simple","recoveryNeeds":"8 hours sleep","intensityLevel":"low","dietaryFocus":"diet focus"}},{"id":"plan_2","name":"Creative 2-3 word name","description":"Brief description","duration":"${durations[1]}","difficulty":"Balanced","calorieTarget":1800,"macros":{"protein":30,"carbs":40,"fats":30},"workoutFrequency":"4 days/week","focusAreas":["area1","area2","area3"],"benefits":["benefit1","benefit2","benefit3"],"planScheduleRequirements":{"workoutWindows":["morning","evening"],"mealPrepComplexity":"medium","recoveryNeeds":"7-8 hours sleep","intensityLevel":"moderate","dietaryFocus":"diet focus"}},{"id":"plan_3","name":"Creative 2-3 word name","description":"Brief description","duration":"${durations[2]}","difficulty":"Intensive","calorieTarget":2000,"macros":{"protein":35,"carbs":35,"fats":30},"workoutFrequency":"5 days/week","focusAreas":["area1","area2","area3"],"benefits":["benefit1","benefit2","benefit3"],"planScheduleRequirements":{"workoutWindows":["morning","afternoon","evening"],"mealPrepComplexity":"advanced","recoveryNeeds":"8-9 hours sleep","intensityLevel":"high","dietaryFocus":"diet focus"}}]}`;
}

// Get and validate Groq API keys
function validateGroqKeys(): string[] {
  const groqKeys = [
    Deno.env.get("GROQ_API_KEY"),
    Deno.env.get("GROQ_API_KEY_2"),
    Deno.env.get("GROQ_API_KEY_3"),
    Deno.env.get("GROQ_API_KEY_4"),
    Deno.env.get("GROQ_API_KEY_5"),
    Deno.env.get("GROQ_API_KEY_6")
  ].filter(Boolean);
  
  if (groqKeys.length === 0) {
    throw new Error("No Groq API keys available");
  }
  
  return groqKeys;
}

// Track token usage and costs
async function trackTokenUsage(usage: any, userProfile: any) {
  try {
    await supabase
      .from('token_usage_log')
      .insert({
        user_id: userProfile.id,
        model: usage.model,
        input_tokens: usage.input_tokens,
        output_tokens: usage.output_tokens,
        total_tokens: usage.total_tokens,
        cost_estimate: usage.cost_estimate,
        timestamp: usage.timestamp,
        function_name: 'health-plans-optimized'
      });
  } catch (error) {
    console.log('Token tracking error:', error);
  }
}

// Check daily cost limits
async function checkDailyCostLimit(userId: string): Promise<boolean> {
  try {
    const today = new Date().toISOString().split('T')[0];
    const { data } = await supabase
      .from('token_usage_log')
      .select('cost_estimate')
      .eq('user_id', userId)
      .gte('timestamp', `${today}T00:00:00.000Z`)
      .lt('timestamp', `${today}T23:59:59.999Z`);
    
    const dailyCost = data?.reduce((sum, row) => sum + (row.cost_estimate || 0), 0) || 0;
    return dailyCost < GROQ_CONFIG.max_daily_cost;
  } catch (error) {
    console.log('Cost limit check error:', error);
    return true; // Allow if check fails
  }
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  // Skip JWT verification for testing
  console.log("🔓 Skipping JWT verification for testing");

  try {
    const { userProfile, primaryGoal, userInput, healthScore, healthAnalysis } = await req.json();
    
    console.log("🔍 Generating Groq-optimized health plans for user:", userProfile?.id);

    // Validate input
    if (!userProfile || !userProfile.id) {
      throw new Error("Invalid user profile provided");
    }

    // Check daily cost limit
    const withinCostLimit = await checkDailyCostLimit(userProfile.id);
    if (!withinCostLimit) {
      throw new Error("Daily cost limit reached. Please try again tomorrow.");
    }

    const goal = primaryGoal || userInput || "General wellness";

    // Get and validate Groq API keys
    const groqKeys = validateGroqKeys();
    console.log(`🔑 Found ${groqKeys.length} Groq API keys`);

    // Create Groq-optimized prompt
    const optimizedPrompt = createGroqOptimizedPrompt(userProfile, goal, healthScore);
    console.log(`📝 Prompt length: ${optimizedPrompt.length} characters (~${Math.ceil(optimizedPrompt.length / 4)} tokens)`);

    let response;
    let usedKey = "none";
    let lastError: string | null = null;
    let tokenUsage: any = null;
    let responseData: any = null;

    // Try Groq API keys only
    for (let i = 0; i < groqKeys.length; i++) {
      try {
        const currentKey = groqKeys[i];
        console.log(`🔑 Trying Groq API key ${i + 1}/${groqKeys.length}...`);
        
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 30000);
        
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
                content: "Create personalized health plans. Respond with valid JSON only."
              },
              {
                role: "user",
                content: optimizedPrompt
              }
            ],
            max_tokens: GROQ_CONFIG.max_output_tokens,
            temperature: 0.7,
            top_p: 0.9
          }),
          signal: controller.signal
        });
        clearTimeout(timeoutId);

        if (response.ok) {
          usedKey = `groq-key-${i + 1}`;
          console.log(`✅ GROQ API key ${i + 1} worked! Status: ${response.status}`);
          
          // Extract token usage from response
          responseData = await response.json();
          console.log("📊 Groq API response structure:", Object.keys(responseData));
          
          if (responseData.usage) {
            tokenUsage = {
              input_tokens: responseData.usage.prompt_tokens || 0,
              output_tokens: responseData.usage.completion_tokens || 0,
              total_tokens: responseData.usage.total_tokens || 0,
              cost_estimate: ((responseData.usage.prompt_tokens || 0) * GROQ_CONFIG.input_cost / 1000000) + 
                           ((responseData.usage.completion_tokens || 0) * GROQ_CONFIG.output_cost / 1000000),
              model: 'llama-3.3-70b-versatile',
              timestamp: new Date().toISOString()
            };
          }
          
          break;
        } else {
          const errorText = await response.text();
          console.log(`❌ GROQ API key ${i + 1} failed: ${response.status} - ${errorText}`);
          lastError = `Status ${response.status}: ${errorText}`;
        }
      } catch (error) {
        console.log(`❌ GROQ API key ${i + 1} error: ${error.message}`);
        lastError = error.message;
      }
    }

    if (!response || !response.ok) {
      throw new Error(`All Groq API keys failed. Last error: ${lastError}`);
    }

    // Response data already parsed above, no need to parse again
    console.log("📊 Groq API response received");

    // Extract and parse health plans with safe JSON parsing
    let plansData;
    try {
      let content = "";
      
      if (responseData.choices && responseData.choices[0]?.message?.content) {
        content = responseData.choices[0].message.content;
      } else {
        console.log("📄 Full Groq response:", JSON.stringify(responseData, null, 2));
        throw new Error("Invalid Groq response format - no content found");
      }
      
      console.log("📄 Groq response content preview:", content.substring(0, 200) + "...");
      
      // Clean markdown if present
      if (content.includes('```')) {
        const match = content.match(/```(?:json)?\s*(\{[\s\S]*\})\s*```/);
        if (match) {
          content = match[1];
          console.log("📄 Extracted JSON from markdown");
        }
      }
      
      // Try to find JSON object in the content
      if (!content.trim().startsWith('{')) {
        const jsonMatch = content.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          content = jsonMatch[0];
          console.log("📄 Extracted JSON from text");
        }
      }
      
      // Parse JSON response with error handling
      plansData = JSON.parse(content);
      
      // Validate required fields
      if (!plansData.plans || !Array.isArray(plansData.plans)) {
        console.log("📄 Parsed data:", JSON.stringify(plansData, null, 2));
        throw new Error("Invalid plans format in response");
      }
      
      if (plansData.plans.length === 0) {
        throw new Error("No plans generated in response");
      }
      
      console.log("✅ Successfully parsed Groq response with", plansData.plans.length, "plans");
      
    } catch (parseError) {
      console.log("⚠️ JSON parse failed:", parseError);
      console.log("📄 Raw content that failed to parse:", content || "No content available");
      throw new Error(`Failed to parse health plans from Groq response: ${parseError.message}`);
    }

    // Track token usage and costs
    if (tokenUsage) {
      await trackTokenUsage(tokenUsage, userProfile);
      console.log(`💰 Cost: $${tokenUsage.cost_estimate.toFixed(4)} | Tokens: ${tokenUsage.total_tokens} | Model: ${tokenUsage.model}`);
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
          target_end_date: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          duration_weeks: 12,
          health_analysis_id: healthAnalysis?.id || null,
          user_input: userInput || null,
          plan_data: {
            plans: plansData.plans,
            user_context: {
              primaryGoal: goal,
              secondaryGoals: userProfile.health_goals?.filter(g => g !== goal) || [],
              healthScore
            }
          },
          status: 'draft',
          generation_model: 'llama-3.3-70b-versatile',
          generation_parameters: {
            ai_provider: 'Groq-API',
            used_key: usedKey,
            health_score: healthScore,
            cost_optimized: true,
            token_usage: tokenUsage
          }
        });

      if (plansError) {
        console.error('❌ Error saving health plans to database:', plansError);
      } else {
        console.log('✅ Health plans saved to database successfully');
      }
    } catch (dbError) {
      console.error('❌ Database error:', dbError);
      // Continue execution even if database save fails
    }

    console.log("✅ Groq health plans generated successfully");

    return new Response(JSON.stringify({
      success: true,
      plans: plansData.plans,
      userContext: {
        primaryGoal: goal,
        secondaryGoals: userProfile.health_goals?.filter(g => g !== goal) || [],
        healthScore
      },
      meta: {
        provider: `Groq-API-${usedKey}`,
        timestamp: new Date().toISOString(),
        model: "llama-3.3-70b-versatile",
        cost_optimized: true,
        token_usage: tokenUsage
      }
    }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" }
    });

  } catch (error) {
    console.error('❌ Groq health plans generation error:', error);
    console.error('❌ Error stack:', error.stack);
    console.error('❌ Error details:', JSON.stringify(error, Object.getOwnPropertyNames(error)));
    
    return new Response(JSON.stringify({
      success: false,
      error: error.message || 'Unknown error occurred',
      errorDetails: error.stack || 'No stack trace available',
      meta: {
        provider: "Groq-API",
        timestamp: new Date().toISOString(),
        note: "Health plans generation failed - no fallback data provided",
        errorType: error.name || 'UnknownError'
      }
    }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" }
    });
  }
});