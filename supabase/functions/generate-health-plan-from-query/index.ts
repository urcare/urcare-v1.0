import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface HealthPlanSearchRequest {
  query: string;
  userProfile?: any;
  maxTokens?: number;
  includeFileContext?: boolean;
  fileContent?: string;
}

interface TokenUsage {
  promptTokens: number;
  completionTokens: number;
  totalTokens: number;
  estimatedCost: number;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const {
      query,
      userProfile,
      maxTokens = 4000,
      includeFileContext = false,
      fileContent,
    } = (await req.json()) as HealthPlanSearchRequest;

    if (!query || query.trim().length === 0) {
      return new Response(
        JSON.stringify({ success: false, error: "Query is required" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Get OpenAI API key
    const OPENAI_API_KEY = Deno.env.get("OPENAI_API_KEY");
    if (!OPENAI_API_KEY) {
      return new Response(
        JSON.stringify({
          success: false,
          error: "OpenAI API key not configured",
        }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Create Supabase client
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? "",
      {
        global: {
          headers: { Authorization: req.headers.get("Authorization")! },
        },
      }
    );

    // Get user from JWT
    const {
      data: { user },
      error: userError,
    } = await supabaseClient.auth.getUser();

    if (userError || !user) {
      return new Response(
        JSON.stringify({ success: false, error: "Unauthorized" }),
        {
          status: 401,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Generate health plan based on query
    const result = await generateHealthPlanFromQuery(
      query,
      userProfile,
      maxTokens,
      includeFileContext,
      fileContent,
      OPENAI_API_KEY
    );

    return new Response(JSON.stringify(result), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error in generate-health-plan-from-query:", error);
    return new Response(
      JSON.stringify({
        success: false,
        error: error instanceof Error ? error.message : "Internal server error",
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});

async function generateHealthPlanFromQuery(
  query: string,
  userProfile: any,
  maxTokens: number,
  includeFileContext: boolean,
  fileContent: string | undefined,
  openaiApiKey: string
): Promise<{
  success: boolean;
  plan?: any;
  error?: string;
  tokenUsage?: TokenUsage;
}> {
  try {
    // Build context from user profile
    const profileContext = userProfile
      ? `
User Profile:
- Name: ${userProfile.full_name || "Not provided"}
- Age: ${userProfile.age || "Not provided"}
- Gender: ${userProfile.gender || "Not provided"}
- Height: ${userProfile.height_cm || "Not provided"} cm
- Weight: ${userProfile.weight_kg || "Not provided"} kg
- Health Conditions: ${userProfile.chronic_conditions?.join(", ") || "None"}
- Diet Type: ${userProfile.diet_type || "Not specified"}
- Workout Time: ${userProfile.workout_time || "Not specified"}
- Sleep Time: ${userProfile.sleep_time || "Not specified"}
- Wake Time: ${userProfile.wake_up_time || "Not specified"}
`
      : "";

    // Build file context if provided
    const fileContext =
      includeFileContext && fileContent
        ? `
Attached File Content:
${fileContent}
`
        : "";

    // Create system prompt
    const systemPrompt = `You are an AI Health Coach specializing in creating personalized health plans. Your role is to:

1. Analyze the user's query and understand their specific health goals or requirements
2. Create a comprehensive, personalized health plan that addresses their needs
3. Consider their profile information and any attached files
4. Provide actionable, science-based recommendations
5. Ensure the plan is safe, achievable, and tailored to their lifestyle

Guidelines:
- Always prioritize safety and consult with healthcare professionals for serious conditions
- Make recommendations evidence-based and practical
- Consider the user's schedule, preferences, and limitations
- Provide specific, actionable steps
- Include both short-term and long-term goals
- Be encouraging and supportive in your tone

Response Format:
Return a JSON object with the following structure:
{
  "summary": "Brief summary of the health plan",
  "goals": ["Goal 1", "Goal 2", "Goal 3"],
  "dailyRoutine": {
    "morning": ["Activity 1", "Activity 2"],
    "afternoon": ["Activity 1", "Activity 2"],
    "evening": ["Activity 1", "Activity 2"]
  },
  "nutritionPlan": {
    "breakfast": "Recommendation",
    "lunch": "Recommendation", 
    "dinner": "Recommendation",
    "snacks": "Recommendation"
  },
  "exercisePlan": {
    "cardio": "Recommendation",
    "strength": "Recommendation",
    "flexibility": "Recommendation"
  },
  "lifestyleChanges": ["Change 1", "Change 2"],
  "timeline": "Expected timeline for results",
  "tips": ["Tip 1", "Tip 2", "Tip 3"],
  "warnings": ["Any important warnings or precautions"]
}`;

    // Create user prompt
    const userPrompt = `${profileContext}${fileContext}

User Query: "${query}"

Please create a personalized health plan based on the above query and user information.`;

    // Call OpenAI API
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${openaiApiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-4o",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        max_tokens: maxTokens,
        temperature: 0.3,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`OpenAI API error: ${errorText}`);
    }

    const data = await response.json();
    const content = data.choices[0].message.content;

    // Parse token usage
    const tokenUsage: TokenUsage = {
      promptTokens: data.usage?.prompt_tokens || 0,
      completionTokens: data.usage?.completion_tokens || 0,
      totalTokens: data.usage?.total_tokens || 0,
      estimatedCost: (data.usage?.total_tokens || 0) * 0.00003, // Approximate cost
    };

    try {
      // Parse the JSON response
      const healthPlan = JSON.parse(content);

      return {
        success: true,
        plan: healthPlan,
        tokenUsage,
      };
    } catch (parseError) {
      console.error("Error parsing AI response:", parseError);
      console.error("AI Response:", content);

      // Return a fallback plan
      return {
        success: true,
        plan: {
          summary: "Health plan generated based on your query",
          goals: [
            "Improve overall health",
            "Follow personalized recommendations",
          ],
          dailyRoutine: {
            morning: [
              "Wake up at consistent time",
              "Drink water",
              "Light exercise",
            ],
            afternoon: ["Healthy lunch", "Take breaks", "Stay hydrated"],
            evening: ["Relaxing activities", "Prepare for sleep", "Review day"],
          },
          nutritionPlan: {
            breakfast: "Balanced meal with protein and fiber",
            lunch: "Nutritious meal with vegetables",
            dinner: "Light, healthy dinner",
            snacks: "Healthy snacks between meals",
          },
          exercisePlan: {
            cardio: "30 minutes of moderate cardio daily",
            strength: "Strength training 2-3 times per week",
            flexibility: "Daily stretching routine",
          },
          lifestyleChanges: [
            "Maintain consistent sleep schedule",
            "Stay hydrated",
            "Manage stress",
          ],
          timeline: "Results may be visible in 2-4 weeks with consistency",
          tips: [
            "Start small and build habits",
            "Track your progress",
            "Stay consistent",
          ],
          warnings: ["Consult healthcare provider for any concerns"],
        },
        tokenUsage,
      };
    }
  } catch (error) {
    console.error("Error generating health plan:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred",
    };
  }
}
