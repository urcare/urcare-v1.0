import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

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

    if (userError) {
      console.error("User auth error:", userError);
      return new Response(
        JSON.stringify({
          success: false,
          error: "Unauthorized",
          details: userError.message,
        }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 401,
        }
      );
    }

    if (!user) {
      console.error("No user found");
      return new Response(
        JSON.stringify({
          success: false,
          error: "Unauthorized",
          details: "No user found in session",
        }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 401,
        }
      );
    }

    // Create a simple fallback plan
    const today = new Date();
    const day1 = new Date(today);
    const day2 = new Date(today);
    day2.setDate(day2.getDate() + 1);

    const simplePlan = {
      day1: {
        date: day1.toISOString().split("T")[0],
        activities: [
          {
            id: "1",
            type: "meal",
            title: "Breakfast",
            description: "Healthy breakfast to start your day",
            startTime: "08:00",
            endTime: "08:30",
            duration: 30,
            priority: "high",
            category: "nutrition",
            instructions: [
              "Eat a balanced breakfast",
              "Include protein and fiber",
            ],
            tips: ["Prepare the night before", "Avoid processed foods"],
          },
          {
            id: "2",
            type: "workout",
            title: "Morning Exercise",
            description: "Light exercise to energize your day",
            startTime: "09:00",
            endTime: "09:30",
            duration: 30,
            priority: "medium",
            category: "exercise",
            instructions: [
              "Warm up for 5 minutes",
              "Do light cardio",
              "Cool down",
            ],
            tips: ["Start slow", "Listen to your body"],
          },
          {
            id: "3",
            type: "meal",
            title: "Lunch",
            description: "Nutritious lunch for sustained energy",
            startTime: "13:00",
            endTime: "13:30",
            duration: 30,
            priority: "high",
            category: "nutrition",
            instructions: [
              "Include vegetables",
              "Add lean protein",
              "Stay hydrated",
            ],
            tips: ["Meal prep in advance", "Avoid heavy foods"],
          },
          {
            id: "4",
            type: "meal",
            title: "Dinner",
            description: "Light dinner to end the day",
            startTime: "19:00",
            endTime: "19:30",
            duration: 30,
            priority: "high",
            category: "nutrition",
            instructions: [
              "Keep it light",
              "Include vegetables",
              "Avoid late eating",
            ],
            tips: ["Eat 3 hours before bed", "Focus on whole foods"],
          },
        ],
        summary: {
          totalActivities: 4,
          workoutTime: 30,
          mealCount: 3,
          sleepHours: 8,
          focusAreas: ["nutrition", "exercise", "hydration"],
        },
      },
      day2: {
        date: day2.toISOString().split("T")[0],
        activities: [
          {
            id: "1",
            type: "meal",
            title: "Breakfast",
            description: "Healthy breakfast to start your day",
            startTime: "08:00",
            endTime: "08:30",
            duration: 30,
            priority: "high",
            category: "nutrition",
            instructions: [
              "Eat a balanced breakfast",
              "Include protein and fiber",
            ],
            tips: ["Prepare the night before", "Avoid processed foods"],
          },
          {
            id: "2",
            type: "workout",
            title: "Morning Walk",
            description: "Gentle walk to start your day",
            startTime: "09:00",
            endTime: "09:30",
            duration: 30,
            priority: "medium",
            category: "exercise",
            instructions: ["Walk at a comfortable pace", "Enjoy the outdoors"],
            tips: ["Wear comfortable shoes", "Stay hydrated"],
          },
          {
            id: "3",
            type: "meal",
            title: "Lunch",
            description: "Nutritious lunch for sustained energy",
            startTime: "13:00",
            endTime: "13:30",
            duration: 30,
            priority: "high",
            category: "nutrition",
            instructions: [
              "Include vegetables",
              "Add lean protein",
              "Stay hydrated",
            ],
            tips: ["Meal prep in advance", "Avoid heavy foods"],
          },
          {
            id: "4",
            type: "meal",
            title: "Dinner",
            description: "Light dinner to end the day",
            startTime: "19:00",
            endTime: "19:30",
            duration: 30,
            priority: "high",
            category: "nutrition",
            instructions: [
              "Keep it light",
              "Include vegetables",
              "Avoid late eating",
            ],
            tips: ["Eat 3 hours before bed", "Focus on whole foods"],
          },
        ],
        summary: {
          totalActivities: 4,
          workoutTime: 30,
          mealCount: 3,
          sleepHours: 8,
          focusAreas: ["nutrition", "exercise", "hydration"],
        },
      },
      overallGoals: [
        "Maintain a healthy diet",
        "Stay active with light exercise",
        "Get adequate sleep",
      ],
      progressTips: [
        "Start with small changes",
        "Stay consistent with your routine",
        "Listen to your body's needs",
      ],
    };

    // Deactivate existing plans first
    console.log("🔄 Deactivating existing plans...");
    await supabaseClient
      .from("two_day_health_plans")
      .update({ is_active: false })
      .eq("user_id", user.id)
      .eq("is_active", true);

    // Save the plan to database
    console.log("💾 Saving simple plan to database...");
    const planData = {
      user_id: user.id,
      plan_start_date: day1.toISOString().split("T")[0],
      plan_end_date: day2.toISOString().split("T")[0],
      day_1_plan: simplePlan.day1,
      day_2_plan: simplePlan.day2,
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
      console.error("Error saving simple plan:", saveError);
      return new Response(
        JSON.stringify({
          success: false,
          error: "Failed to save plan",
          details: saveError.message,
        }),
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
    console.error("Error generating simple health plan:", error);
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message || "Internal server error",
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
});
