import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface UserProfile {
  id: string;
  full_name: string | null;
  age: number | null;
  date_of_birth: string | null;
  gender: string | null;
  unit_system: string | null;
  height_feet: string | null;
  height_inches: string | null;
  height_cm: string | null;
  weight_lb: string | null;
  weight_kg: string | null;
  wake_up_time: string | null;
  sleep_time: string | null;
  work_start: string | null;
  work_end: string | null;
  chronic_conditions: string[] | null;
  takes_medications: string | null;
  medications: string[] | null;
  has_surgery: string | null;
  surgery_details: string[] | null;
  health_goals: string[] | null;
  diet_type: string | null;
  blood_group: string | null;
  breakfast_time: string | null;
  lunch_time: string | null;
  dinner_time: string | null;
  workout_time: string | null;
  routine_flexibility: string | null;
  uses_wearable: string | null;
  wearable_type: string | null;
  track_family: string | null;
  share_progress: string | null;
  emergency_contact_name: string | null;
  emergency_contact_phone: string | null;
  critical_conditions: string | null;
  has_health_reports: string | null;
  health_reports: string[] | null;
  referral_code: string | null;
  save_progress: string | null;
  status: string;
  preferences: any;
  onboarding_completed: boolean;
  created_at: string;
  updated_at: string;
}

interface HealthPlanActivity {
  id: string;
  type:
    | "workout"
    | "meal"
    | "hydration"
    | "sleep"
    | "meditation"
    | "break"
    | "other";
  title: string;
  description: string;
  startTime: string;
  endTime: string;
  duration: number; // in minutes
  priority: "high" | "medium" | "low";
  category: string;
  instructions?: string[];
  tips?: string[];
}

interface DayPlan {
  date: string;
  activities: HealthPlanActivity[];
  summary: {
    totalActivities: number;
    workoutTime: number;
    mealCount: number;
    sleepHours: number;
    focusAreas: string[];
  };
}

interface TwoDayPlan {
  day1: DayPlan;
  day2: DayPlan;
  overallGoals: string[];
  progressTips: string[];
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  // Only allow POST requests
  if (req.method !== "POST") {
    return new Response(
      JSON.stringify({ success: false, error: "Method not allowed" }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 405,
      }
    );
  }

  try {
    // Check environment variables
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY");

    if (!supabaseUrl || !supabaseAnonKey) {
      throw new Error("Missing required environment variables");
    }

    // Create Supabase client
    const authHeader = req.headers.get("Authorization");

    const supabaseClient = createClient(supabaseUrl, supabaseAnonKey, {
      global: {
        headers: authHeader ? { Authorization: authHeader } : {},
      },
    });

    // Get the current user
    const {
      data: { user },
      error: userError,
    } = await supabaseClient.auth.getUser();

    if (userError || !user) {
      return new Response(
        JSON.stringify({ success: false, error: "Unauthorized" }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 401,
        }
      );
    }

    // Get user profile
    const { data: profile, error: profileError } = await supabaseClient
      .from("user_profiles")
      .select("*")
      .eq("id", user.id)
      .single();

    if (profileError) {
      console.error("❌ Profile fetch error:", profileError);
      return new Response(
        JSON.stringify({
          success: false,
          error: "User profile not found",
          details: profileError.message,
        }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 404,
        }
      );
    }

    if (!profile) {
      console.error("❌ No profile data returned");
      return new Response(
        JSON.stringify({
          success: false,
          error: "User profile not found",
          details: "No profile data returned from database",
        }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 404,
        }
      );
    }

    // Generate health plan using OpenAI
    let healthPlan;
    try {
      healthPlan = await generateHealthPlan(profile, null);
      console.log("✅ Health plan generated successfully");
    } catch (error) {
      console.error("❌ Health plan generation failed:", error);
      throw error;
    }

    // Calculate plan dates (next 2 days)
    const today = new Date();
    const day1 = new Date(today);
    const day2 = new Date(today);
    day2.setDate(day2.getDate() + 1);

    // Deactivate existing plans first
    await supabaseClient
      .from("two_day_health_plans")
      .update({ is_active: false })
      .eq("user_id", user.id)
      .eq("is_active", true);

    // Save the plan to database
    const planData = {
      user_id: user.id,
      plan_start_date: day1.toISOString().split("T")[0],
      plan_end_date: day2.toISOString().split("T")[0],
      day_1_plan: healthPlan.day1,
      day_2_plan: healthPlan.day2,
      day_1_completed: false,
      day_2_completed: false,
      progress_data: {},
      generated_at: new Date().toISOString(),
      is_active: true,
    };

    const { data: savedPlan, error: saveError } = await supabaseClient
      .from("two_day_health_plans")
      .insert(planData)
      .select()
      .single();

    if (saveError) {
      console.error("❌ Error saving plan:", saveError);
      return new Response(
        JSON.stringify({ success: false, error: "Failed to save plan" }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 500,
        }
      );
    }

    return new Response(
      JSON.stringify({
        success: true,
        plan: savedPlan,
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );
  } catch (error) {
    console.error("❌ Error generating health plan:", error);
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message || "Internal server error",
        details: error.stack || "No additional details",
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
});

async function generateHealthPlan(
  profile: UserProfile,
  onboardingDetails?: any
): Promise<TwoDayPlan> {
  const OPENAI_API_KEY = Deno.env.get("OPENAI_API_KEY");

  if (!OPENAI_API_KEY) {
    throw new Error("OpenAI API key not configured");
  }

  // Prepare user data for AI with null checks
  const userData = {
    name: profile.full_name || "User",
    age: profile.age || 30,
    gender: profile.gender || "Not specified",
    height: profile.height_cm || profile.height_feet || "Not specified",
    weight: profile.weight_kg || profile.weight_lb || "Not specified",
    unitSystem: profile.unit_system || "metric",
    healthGoals: profile.health_goals || ["General health"],
    dietType: profile.diet_type || "Balanced",
    chronicConditions: profile.chronic_conditions || [],
    medications: profile.medications || [],
    schedule: {
      wakeUp: profile.wake_up_time || "07:00",
      sleep: profile.sleep_time || "22:00",
      workStart: profile.work_start || "09:00",
      workEnd: profile.work_end || "17:00",
      breakfast: profile.breakfast_time || "08:00",
      lunch: profile.lunch_time || "13:00",
      dinner: profile.dinner_time || "19:00",
      workout: profile.workout_time || "18:00",
    },
    onboarding: onboardingDetails || {},
  };

  // Master AI Health System Prompt
  const systemPrompt = `You are a Master AI Health & Longevity Specialist with expertise in clinical nutrition, exercise physiology, circadian biology, metabolic health, and evidence-based disease reversal protocols. You have access to 50,000+ peer-reviewed studies and specialize in creating hyper-personalized health plans that optimize human performance and extend healthspan.

CORE PRINCIPLES:
- Create scientifically-proven protocols that are safe and effective
- Personalize every recommendation based on individual data
- Focus on root causes, not just symptoms
- Integrate nutrition, movement, sleep, stress, and mindset holistically
- Provide actionable, time-stamped daily protocols

SAFETY MANDATE: Every recommendation must be evidence-based and safe. Never suggest anything that could cause harm.

OUTPUT REQUIREMENT: Return ONLY valid JSON without markdown, explanations, or additional text. The response must be pure JSON that can be parsed directly.

Your specialty areas include diabetes reversal, weight optimization, PCOS management, cardiovascular health, and longevity enhancement using natural, scientifically-proven methods.`;

  const userPrompt = `Create a hyper-personalized 2-day health optimization protocol for:

USER PROFILE:
- Name: ${userData.name}
- Age: ${userData.age}, Gender: ${userData.gender}
- Health Goals: ${
    userData.healthGoals?.join(", ") || "General health and wellness"
  }
- Diet Type: ${userData.dietType}
- Health Conditions: ${
    userData.chronicConditions?.join(", ") || "None reported"
  }
- Medications: ${userData.medications?.join(", ") || "None reported"}

SCHEDULE CONSTRAINTS:
- Wake: ${userData.schedule.wakeUp} | Sleep: ${userData.schedule.sleep}
- Work: ${userData.schedule.workStart}-${userData.schedule.workEnd}
- Meals: Breakfast ${userData.schedule.breakfast}, Lunch ${
    userData.schedule.lunch
  }, Dinner ${userData.schedule.dinner}
- Preferred Workout: ${userData.schedule.workout}

REQUIREMENTS:
1. Create time-stamped daily protocols with specific activities
2. Include evidence-based nutrition with meal sequencing
3. Add movement protocols adapted to their fitness level
4. Integrate circadian optimization and stress management
5. Include small hacks that enhance results (walking after meals, hydration timing, etc.)
6. Make it culturally appropriate and geographically relevant
7. Ensure progressive difficulty and built-in adaptability

Return comprehensive plan in this JSON structure:
{
  "day1": {
    "date": "2025-09-18",
    "activities": [
      {
        "id": "1",
        "type": "meal",
        "title": "Breakfast",
        "description": "Detailed breakfast description with specific foods",
        "startTime": "07:00",
        "endTime": "07:30",
        "duration": 30,
        "priority": "high",
        "category": "nutrition",
        "instructions": ["Step 1", "Step 2"]
      }
    ],
    "summary": {
      "totalActivities": 12,
      "workoutTime": 60,
      "mealCount": 3,
      "sleepHours": 8,
      "focusAreas": ["nutrition", "exercise", "hydration"]
    }
  },
  "day2": {
    "date": "2025-09-19",
    "activities": [/* same structure as day1 */],
    "summary": {/* same structure as day1 */}
  },
  "overallGoals": ["Specific goal 1", "Specific goal 2", "Specific goal 3"],
  "progressTips": ["Detailed tip 1", "Detailed tip 2", "Detailed tip 3"]
}`;

  // Add timeout to OpenAI API call
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 15000); // 15 second timeout

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: "gpt-4o-mini", // Use faster model
      messages: [
        {
          role: "system",
          content: systemPrompt,
        },
        { role: "user", content: userPrompt },
      ],
      max_tokens: 2000, // Further reduced for faster response
      temperature: 0.3,
    }),
    signal: controller.signal,
  });

  clearTimeout(timeoutId);

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`OpenAI API error: ${response.status} ${errorText}`);
  }

  const data = await response.json();
  const content = data.choices[0]?.message?.content;

  if (!content) {
    throw new Error("No content received from OpenAI");
  }

  try {
    // Clean the content - remove markdown code blocks if present
    let cleanContent = content.trim();

    // Remove ```json and ``` markers if present
    if (cleanContent.startsWith("```json")) {
      cleanContent = cleanContent
        .replace(/^```json\s*/, "")
        .replace(/\s*```$/, "");
    } else if (cleanContent.startsWith("```")) {
      cleanContent = cleanContent.replace(/^```\s*/, "").replace(/\s*```$/, "");
    }

    // Try to find JSON object in the content if it's not at the start
    const jsonMatch = cleanContent.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      cleanContent = jsonMatch[0];
    }

    const healthPlan = JSON.parse(cleanContent);
    return healthPlan;
  } catch (parseError) {
    console.error("❌ Failed to parse OpenAI response:", parseError);
    throw new Error(`Invalid response format from AI: ${parseError.message}`);
  }
}
