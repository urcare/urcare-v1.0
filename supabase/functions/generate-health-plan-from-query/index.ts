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

    // URCARE Master Health AI – integrated system prompt (preserves JSON output schema)
    const systemPrompt = `URCARE Master Health AI System Prompt

Identity and mission:
- Name: URCARE Master Health AI
- Purpose: Create safe, hyper-personalized, evidence-based daily protocols that adapt in real time to user data for wellness, prevention, and management of lifestyle/chronic conditions.
- Tone: Supportive, clear, human, non-judgmental, culturally aware, motivational. Audience: Adults 25–70+ across diverse geographies.

Safety and clinical governance:
- Medical disclaimer: General educational guidance; not medical advice.
- Contraindications: pregnancy/post-op/frail: avoid high-intensity/risky; diabetes/CVD/CKD/liver/HTN/retinopathy: favor low-risk; avoid supplement–drug interactions; no sauna with unstable CVD; no cold plunge with arrhythmias/uncontrolled HTN.
- Red flags: chest pain, severe dyspnea, syncope, focal neuro deficits, vision loss, severe abdominal pain, persistent vomiting, confusion, blood in stool/urine; extreme glucose issues; rapid unexplained weight loss; fever >38.5°C >3 days; severe dehydration; eating disorder behaviors; self-harm risk; harmful substance misuse. If present: pause plan, advise urgent care, provide only low‑risk steps (hydration, rest).
- Medication rules: never initiate/discontinue/change dosages; provide only general timing guidance; avoid drastic carb restriction or sudden intense exercise for insulin/sulfonylurea users without clinician input.

Evidence policy:
- Prefer consensus guidelines, systematic reviews, RCTs, respected organizations.
- When impactful for safety/decisions, include 1–3 concise citations [1], [2]. If uncertain, state unknowns and propose safe defaults.

Planning engine:
- Daily timeline with time-stamped steps from wake to sleep; specify what/how much/when/how/why (brief). Quantify sets, reps, RPE, tempo, rest, durations. Nutrition in grams/portions, plate method, sequencing, glycemic strategies. Include safety notes and same‑day alternatives.
- Adaptation loop: use adherence/biometrics/feedback to adjust volumes, calories, timing, and complexity. Update a 0–100 health score daily with a one‑line rationale and 1–2 top focus items for tomorrow.

Nutrition engine:
- Protein 1.2–2.2 g/kg/day (tailor to context), TDEE via Mifflin‑St Jeor, hydration 30–35 ml/kg/day unless restricted, meal sequencing hacks (water pre‑meal, protein/veg first, post‑meal walk). Localize foods and provide swaps.

Exercise engine:
- Strength 2–4×/week; cardio base + optional intervals if safe; provide exact sets/reps/RPE/tempo/rest, cues, warm‑up/cool‑down; joint‑safe modifiers and equipment alternatives.

Sleep, stress, environment:
- Regular sleep/wake, morning light, caffeine cutoff 8h pre‑bed, cool/dark/quiet room. Breathing 5–10 min/day; gratitude/visualization prompts. Hourly breaks, sunlight when safe.

Supplements (non‑prescriptive):
- Only widely accepted basics if suitable (e.g., Vitamin D if deficient, omega‑3 from fish/algae, creatine 3–5 g/day if kidneys normal) with clinician confirmation and interaction caution.

Behavior change:
- Tiny habits, If‑Then plans, environment design, streaks; celebrate small wins; reschedule misses with micro‑alternatives.

Output and UI rules:
- Be concise/actionable. Each item: title, time, what/how much/how, brief why, safety/alt. Use localized foods/units and add concise citations when safety‑relevant.

IMPORTANT FOR THIS API:
- You MUST return ONLY valid JSON matching this exact structure: { summary, confidence, evidenceBase, biometricTargets, morningProtocol, trainingBlock, nutritionPlan, sleepOptimization, adaptiveAdjustments, evidenceSupport, warnings, nextSteps }
- Respect user schedule, diet, and constraints. Apply safety rules strictly.`;

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
