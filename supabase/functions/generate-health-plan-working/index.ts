import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    // Environment setup
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY");
    const openaiApiKey = Deno.env.get("OPENAI_API_KEY");

    if (!supabaseUrl || !supabaseAnonKey || !openaiApiKey) {
      throw new Error("Missing environment variables");
    }

    // Create Supabase client
    const authHeader = req.headers.get("Authorization");
    const supabaseClient = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: authHeader ? { Authorization: authHeader } : {} },
    });

    // Get authenticated user
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

    if (profileError || !profile) {
      console.error("❌ Profile error:", profileError);
      return new Response(
        JSON.stringify({ success: false, error: "Profile not found" }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 404,
        }
      );
    }

    // Generate plan with OpenAI
    const healthPlan = await generateWithOpenAI(profile, openaiApiKey);

    // Save to database
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const planData = {
      user_id: user.id,
      plan_start_date: today.toISOString().split("T")[0],
      plan_end_date: tomorrow.toISOString().split("T")[0],
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
      console.error("❌ Save error:", saveError);
      return new Response(
        JSON.stringify({ success: false, error: "Failed to save plan" }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 500,
        }
      );
    }

    console.log("✅ Plan generated and saved successfully");
    return new Response(JSON.stringify({ success: true, plan: savedPlan }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    console.error("❌ Function error:", error);
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
});

async function generateWithOpenAI(profile: any, apiKey: string) {
  const prompt = `Create a 2-day health plan for ${
    profile.full_name || "User"
  } (${profile.age || 30} years old).
Goals: ${profile.health_goals?.join(", ") || "General health"}
Return only valid JSON in this format:
{
  "day1": {
    "date": "2025-09-18",
    "activities": [
      {
        "id": "1",
        "type": "meal",
        "title": "Healthy Breakfast",
        "description": "Nutritious morning meal",
        "startTime": "07:00",
        "endTime": "07:30",
        "duration": 30,
        "priority": "high",
        "category": "nutrition"
      }
    ],
    "summary": {
      "totalActivities": 8,
      "workoutTime": 60,
      "mealCount": 3,
      "sleepHours": 8,
      "focusAreas": ["nutrition", "exercise"]
    }
  },
  "day2": {
    "date": "2025-09-19",
    "activities": [
      {
        "id": "1",
        "type": "meal",
        "title": "Healthy Breakfast",
        "description": "Nutritious morning meal",
        "startTime": "07:00",
        "endTime": "07:30",
        "duration": 30,
        "priority": "high",
        "category": "nutrition"
      }
    ],
    "summary": {
      "totalActivities": 8,
      "workoutTime": 60,
      "mealCount": 3,
      "sleepHours": 8,
      "focusAreas": ["nutrition", "exercise"]
    }
  },
  "overallGoals": ["Improve energy", "Better nutrition"],
  "progressTips": ["Stay consistent", "Track progress"]
}`;

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: "You are a health coach. Return only valid JSON.",
        },
        { role: "user", content: prompt },
      ],
      max_tokens: 1500,
      temperature: 0.3,
    }),
  });

  if (!response.ok) {
    throw new Error(`OpenAI API error: ${response.status}`);
  }

  const data = await response.json();
  const content = data.choices[0]?.message?.content;

  if (!content) {
    throw new Error("No content from OpenAI");
  }

  // Clean and parse JSON
  let cleanContent = content.trim();
  if (cleanContent.startsWith("```json")) {
    cleanContent = cleanContent
      .replace(/^```json\s*/, "")
      .replace(/\s*```$/, "");
  }

  return JSON.parse(cleanContent);
}
