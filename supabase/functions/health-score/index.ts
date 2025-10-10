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

// Token usage tracking
interface TokenUsage {
  input_tokens: number;
  output_tokens: number;
  total_tokens: number;
  cost_estimate: number;
  model: string;
  timestamp: string;
}

// Groq-only configuration
const GROQ_CONFIG = {
  // Groq pricing (per 1M tokens) - much cheaper
  input_cost: 0.27,     // $0.27 per 1M input tokens
  output_cost: 0.27,     // $0.27 per 1M output tokens
  
  // Token limits for cost control
  max_input_tokens: 2000,     // Limit input to 2k tokens
  max_output_tokens: 500,      // Limit output to 500 tokens
  max_daily_cost: 5.00,       // $5 daily limit
};

// Compress user profile data to minimal essential info
function compressUserProfile(profile: UserProfile): string {
  const bmi = profile.height && profile.weight ? 
    (profile.weight / ((profile.height / 100) ** 2)).toFixed(1) : 'N/A';
  
  return `A:${profile.age}|G:${profile.gender}|BMI:${bmi}|E:${profile.exercise_frequency}|S:${profile.sleep_hours}|St:${profile.stress_level}|D:${profile.diet_type}|C:${profile.chronic_conditions?.join(',') || 'None'}|M:${profile.medications?.join(',') || 'None'}`;
}

// Ultra-compressed prompt (reduced from ~2000 to ~200 tokens)
function createOptimizedPrompt(userProfile: UserProfile, userInput?: string): string {
  const compressed = compressUserProfile(userProfile);
  const input = userInput ? `|I:${userInput.substring(0, 100)}` : '';
  
  return `Health score (0-100) for: ${compressed}${input}

Score factors: BMI(18.5-24.9=+20), Exercise(5+=+15,3-4=+10,1-2=+5,0=-10), Sleep(7-9h=+15,6-7h=+5,<6h=-15), Stress(1-3=+10,4-6=0,7-10=-15), Diet(balanced=+15,veg=+10,poor=-10), Conditions(each=-10), Meds(each=-5), Goals(+10)

JSON only:
{"healthScore":number,"displayAnalysis":{"greeting":"Hi [name], based on your health profile:","negativeAnalysis":["🚨 concern1","🚨 concern2","🚨 concern3","🚨 concern4","🚨 concern5"],"lifestyleRecommendations":["💚 action1","💚 action2","💚 action3","💚 action4","💚 action5"]}}`;
}

// Track token usage and costs
async function trackTokenUsage(usage: TokenUsage, userProfile: UserProfile) {
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
        function_name: 'health-score-optimized'
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

// Always use Groq for cost optimization
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

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { userProfile, userInput, uploadedFiles, voiceTranscript } = await req.json();

    console.log("🔍 Generating Groq-optimized health score for user:", userProfile?.id);

    // Validate input
    if (!userProfile || !userProfile.id) {
      throw new Error("Invalid user profile provided");
    }

    // Check daily cost limit
    const withinCostLimit = await checkDailyCostLimit(userProfile.id);
    if (!withinCostLimit) {
      throw new Error("Daily cost limit reached. Please try again tomorrow.");
    }

    // Get and validate Groq API keys
    const groqKeys = validateGroqKeys();
    console.log(`🔑 Found ${groqKeys.length} Groq API keys`);

    // Create ultra-compressed prompt
    const optimizedPrompt = createOptimizedPrompt(userProfile, userInput);
    console.log(`📝 Prompt length: ${optimizedPrompt.length} characters (~${Math.ceil(optimizedPrompt.length / 4)} tokens)`);

    let response;
    let usedKey = "none";
    let lastError: string | null = null;
    let tokenUsage: TokenUsage | null = null;

    // Try Groq API keys only
    for (let i = 0; i < groqKeys.length; i++) {
      try {
        const currentKey = groqKeys[i];
        console.log(`🔑 Trying Groq API key ${i + 1}/${groqKeys.length}...`);
        
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 20000);
        
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
                content: "Medical AI. Respond with valid JSON only."
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
          console.log(`✅ Groq API key ${i + 1} worked! Status: ${response.status}`);
          
          // Extract token usage from response headers with safe JSON parsing
          const usageHeader = response.headers.get('x-ratelimit-remaining-tokens');
          if (usageHeader) {
            try {
              const usageData = JSON.parse(usageHeader);
              tokenUsage = {
                input_tokens: usageData.input_tokens || 0,
                output_tokens: usageData.output_tokens || 0,
                total_tokens: (usageData.input_tokens || 0) + (usageData.output_tokens || 0),
                cost_estimate: ((usageData.input_tokens || 0) * GROQ_CONFIG.input_cost / 1000000) + 
                             ((usageData.output_tokens || 0) * GROQ_CONFIG.output_cost / 1000000),
                model: 'llama-3.3-70b',
                timestamp: new Date().toISOString()
              };
            } catch (parseError) {
              console.log('⚠️ Usage header parse error:', parseError);
              // Continue without token usage tracking
            }
          }
          
          break;
        } else {
          console.log(`❌ Groq API key ${i + 1} failed: ${response.status}`);
          lastError = `Status ${response.status}`;
        }
      } catch (error) {
        console.log(`❌ Groq API key ${i + 1} error: ${error.message}`);
        lastError = error.message;
      }
    }
    
    if (!response || !response.ok) {
      throw new Error(`All Groq API keys failed. Last error: ${lastError}`);
    }

    // Safe JSON parsing for response
    let data;
    try {
      data = await response.json();
      console.log("📊 Groq API response received");
    } catch (jsonError) {
      throw new Error(`Failed to parse Groq response: ${jsonError.message}`);
    }

    // Extract and parse health data with safe JSON parsing
    let healthData;
    try {
      let content = "";
      
      if (data.choices && data.choices[0]?.message?.content) {
        content = data.choices[0].message.content;
      } else {
        throw new Error("Invalid Groq response format - no content found");
      }
      
      // Clean markdown if present
      if (content.includes('```')) {
        const match = content.match(/```(?:json)?\s*(\{[\s\S]*\})\s*```/);
        if (match) content = match[1];
      }
      
      // Parse JSON response with error handling
      healthData = JSON.parse(content);
      
      // Validate required fields
      if (typeof healthData.healthScore !== 'number' || healthData.healthScore < 0 || healthData.healthScore > 100) {
        throw new Error("Invalid health score in response");
      }
      
      if (!healthData.displayAnalysis || !Array.isArray(healthData.displayAnalysis.negativeAnalysis) || !Array.isArray(healthData.displayAnalysis.lifestyleRecommendations)) {
        throw new Error("Invalid display analysis format in response");
      }
      
    } catch (parseError) {
      console.log("⚠️ JSON parse failed:", parseError);
      throw new Error(`Failed to parse health data from Groq response: ${parseError.message}`);
    }

    // Track token usage and costs
    if (tokenUsage) {
      await trackTokenUsage(tokenUsage, userProfile);
      console.log(`💰 Cost: $${tokenUsage.cost_estimate.toFixed(4)} | Tokens: ${tokenUsage.total_tokens} | Model: ${tokenUsage.model}`);
    }

    // Build result with validated data
    const result = {
      success: true,
      healthScore: Math.max(0, Math.min(100, healthData.healthScore)),
      displayAnalysis: {
        greeting: healthData.displayAnalysis.greeting || `Hi ${userProfile?.full_name?.split(' ')[0] || 'there'}, based on your health profile analysis:`,
        negativeAnalysis: healthData.displayAnalysis.negativeAnalysis,
        lifestyleRecommendations: healthData.displayAnalysis.lifestyleRecommendations
      },
      meta: {
        provider: `Groq-API-${usedKey}`,
        timestamp: new Date().toISOString(),
        model: "llama-3.3-70b-versatile",
        cost_optimized: true,
        token_usage: tokenUsage
      }
    };

    console.log("✅ Groq-optimized health score generated successfully");

    // Save analysis data to database
    try {
      await supabase
        .from('health_analysis')
        .update({ is_latest: false })
        .eq('user_id', userProfile.id);

      await supabase
        .from('health_analysis')
        .insert({
          user_id: userProfile.id,
          health_score: result.healthScore,
          display_analysis: result.displayAnalysis,
          ai_provider: 'groq',
          ai_model: 'llama-3.3-70b-versatile',
          user_input: userInput || null,
          uploaded_files: uploadedFiles ? JSON.stringify(uploadedFiles) : null,
          voice_transcript: voiceTranscript || null,
          calculation_method: 'groq_ai_analysis',
          factors_considered: [
            'age', 'bmi', 'exercise_frequency', 'sleep_quality', 'stress_level',
            'diet_quality', 'medical_conditions', 'health_goals', 'lifestyle_factors'
          ],
          generation_parameters: {
            used_key: usedKey,
            prompt_version: '5.0-groq-optimized',
            analysis_type: 'groq_health_assessment',
            token_usage: tokenUsage,
            cost_estimate: tokenUsage?.cost_estimate || 0
          },
          analysis_date: new Date().toISOString().split('T')[0],
          is_latest: true
        });

      console.log('✅ Health analysis saved to database successfully');
    } catch (dbError) {
      console.error('❌ Database error:', dbError);
      // Continue execution even if database save fails
    }

    return new Response(
      JSON.stringify(result),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error('❌ Groq health score generation error:', error);
    
    // Return error response instead of fallback
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message,
        meta: {
          provider: "Groq-Error",
          timestamp: new Date().toISOString(),
          note: "Groq API failed or invalid response"
        }
      }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
