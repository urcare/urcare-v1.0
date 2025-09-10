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

  try {
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

    // Get user profile (basic) and onboarding details (separate table)
    const { data: profile, error: profileError } = await supabaseClient
      .from("user_profiles")
      .select("*")
      .eq("id", user.id)
      .single();

    if (profileError || !profile) {
      return new Response(
        JSON.stringify({ success: false, error: "User profile not found" }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 404,
        }
      );
    }

    const { data: onboarding, error: onboardingError } = await supabaseClient
      .from("onboarding_profiles")
      .select("details")
      .eq("user_id", user.id)
      .single();

    if (onboardingError) {
      console.warn(
        "No onboarding_profiles row found; proceeding with profile only"
      );
    }

    // Check if user has completed onboarding
    if (!profile.onboarding_completed) {
      return new Response(
        JSON.stringify({ success: false, error: "Onboarding not completed" }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 400,
        }
      );
    }

    // Check if user already has an active plan
    const { data: existingPlan, error: existingPlanError } =
      await supabaseClient
        .from("two_day_health_plans")
        .select("*")
        .eq("user_id", user.id)
        .eq("is_active", true)
        .single();

    if (existingPlan && !existingPlanError) {
      return new Response(
        JSON.stringify({
          success: true,
          message: "Active plan already exists",
          plan: existingPlan,
        }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 200,
        }
      );
    }

    // Generate health plan using optimized AI generation
    const healthPlan = await generateHealthPlanOptimized(
      profile,
      onboarding?.details
    );

    // Calculate plan dates (next 2 days)
    const today = new Date();
    const day1 = new Date(today);
    const day2 = new Date(today);
    day2.setDate(day2.getDate() + 1);

    // Save the plan to database
    const { data: savedPlan, error: saveError } = await supabaseClient
      .from("two_day_health_plans")
      .insert({
        user_id: user.id,
        plan_start_date: day1.toISOString().split("T")[0],
        plan_end_date: day2.toISOString().split("T")[0],
        day_1_plan: healthPlan.day1,
        day_2_plan: healthPlan.day2,
        is_active: true,
      })
      .select()
      .single();

    if (saveError) {
      console.error("Error saving plan:", saveError);
      return new Response(
        JSON.stringify({ success: false, error: "Failed to save health plan" }),
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
        message: "Health plan generated successfully",
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );
  } catch (error) {
    console.error("Error generating health plan:", error);

    return new Response(
      JSON.stringify({
        success: false,
        error: error.message || "An unexpected error occurred",
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
});

// Optimized AI generation with faster model and reduced prompt
async function generateHealthPlanOptimized(
  profile: UserProfile,
  onboardingDetails?: any
): Promise<TwoDayPlan> {
  const OPENAI_API_KEY = Deno.env.get("OPENAI_API_KEY");

  if (!OPENAI_API_KEY) {
    throw new Error("OpenAI API key not configured");
  }

  // Prepare minimal user data for faster processing
  const userData = {
    name: profile.full_name || "User",
    age: profile.age,
    gender: profile.gender,
    healthGoals: profile.health_goals || [],
    dietType: profile.diet_type,
    schedule: {
      wakeUp: profile.wake_up_time,
      sleep: profile.sleep_time,
      workStart: profile.work_start,
      workEnd: profile.work_end,
      breakfast: profile.breakfast_time,
      lunch: profile.lunch_time,
      dinner: profile.dinner_time,
      workout: profile.workout_time,
    },
  };

  // Simplified, faster system prompt
  const systemPrompt = `You are an AI Health Coach. Create personalized 2-day health plans that are safe, achievable, and tailored to the user's goals and schedule.

Key principles:
- Safety first: No medical advice, encourage professional consultation
- Realistic activities: 3-5 activities per day maximum
- Personal timing: Use the user's actual schedule
- Cultural adaptation: Respect dietary preferences and cultural context
- Gradual progression: Focus on building sustainable habits

Return ONLY valid JSON in this exact format:
{
  "day1": {
    "date": "YYYY-MM-DD",
    "activities": [
      {
        "id": "morning-routine-1",
        "type": "other",
        "title": "Morning Energy Boost",
        "description": "Start your day with intention and energy",
        "startTime": "07:00",
        "endTime": "07:30",
        "duration": 30,
        "priority": "high",
        "category": "wellness",
        "instructions": ["Wake up at 7:00 AM", "Drink water", "Light stretching"],
        "tips": ["Keep phone away from bed", "Open curtains"]
      }
    ],
    "summary": {
      "totalActivities": 4,
      "workoutTime": 30,
      "mealCount": 3,
      "sleepHours": 8,
      "focusAreas": ["fitness", "nutrition", "wellness"]
    }
  },
  "day2": { /* same structure */ },
  "overallGoals": ["Goal 1", "Goal 2"],
  "progressTips": ["Tip 1", "Tip 2"]
}`;

  const prompt = `Create a 2-day health plan for this user:

${JSON.stringify(userData, null, 2)}

Requirements:
- Use their actual wake-up time and schedule
- Include 3-5 activities per day
- Make Day 2 slightly different from Day 1
- Focus on their health goals: ${userData.healthGoals.join(", ")}
- Respect their diet: ${userData.dietType || "no restrictions"}
- Keep activities realistic and achievable

Return ONLY the JSON object.`;

  // Use faster model and reduced parameters for speed
  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: "gpt-3.5-turbo", // Faster model
      messages: [
        {
          role: "system",
          content: systemPrompt,
        },
        { role: "user", content: prompt },
      ],
      max_tokens: 3000, // Reduced for faster response
      temperature: 0.3,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`OpenAI API error: ${errorText}`);
  }

  const data = await response.json();
  const content = data.choices[0].message.content;

  try {
    // Parse the JSON response
    const healthPlan = JSON.parse(content);

    // Validate the structure
    if (!healthPlan.day1 || !healthPlan.day2) {
      throw new Error("Invalid plan structure");
    }

    // Set proper dates
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    healthPlan.day1.date = today.toISOString().split("T")[0];
    healthPlan.day2.date = tomorrow.toISOString().split("T")[0];

    return healthPlan;
  } catch (parseError) {
    console.error("Error parsing AI response:", parseError);
    console.error("AI Response:", content);

    // Fallback: Create a basic plan structure
    return createFallbackPlan(profile);
  }
}

function createFallbackPlan(profile: UserProfile): TwoDayPlan {
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const wakeUpTime = profile.wake_up_time || "07:00";
  const sleepTime = profile.sleep_time || "22:00";
  const workoutTime = profile.workout_time || "18:00";

  const createBasicDay = (date: Date, isWorkoutDay: boolean) => ({
    date: date.toISOString().split("T")[0],
    activities: [
      {
        id: `wake-up-${date.getDate()}`,
        type: "other" as const,
        title: "Morning Routine",
        description: "Start your day with a healthy morning routine",
        startTime: wakeUpTime,
        endTime: addMinutes(wakeUpTime, 30),
        duration: 30,
        priority: "high" as const,
        category: "wellness",
        instructions: [
          "Wake up at scheduled time",
          "Drink a glass of water",
          "Do light stretching",
        ],
        tips: [
          "Keep your phone away from bed",
          "Open curtains for natural light",
        ],
      },
      {
        id: `breakfast-${date.getDate()}`,
        type: "meal" as const,
        title: "Healthy Breakfast",
        description: "Nutritious breakfast to fuel your day",
        startTime: profile.breakfast_time || addMinutes(wakeUpTime, 30),
        endTime: addMinutes(
          profile.breakfast_time || addMinutes(wakeUpTime, 30),
          30
        ),
        duration: 30,
        priority: "high" as const,
        category: "nutrition",
        instructions: [
          "Eat a balanced breakfast",
          "Include protein and fiber",
          "Stay hydrated",
        ],
        tips: ["Prepare breakfast the night before", "Avoid processed foods"],
      },
      ...(isWorkoutDay
        ? [
            {
              id: `workout-${date.getDate()}`,
              type: "workout" as const,
              title: "Daily Workout",
              description: "Exercise session based on your fitness goals",
              startTime: workoutTime,
              endTime: addMinutes(workoutTime, 30),
              duration: 30,
              priority: "high" as const,
              category: "fitness",
              instructions: [
                "Warm up for 5 minutes",
                "Main workout for 20 minutes",
                "Cool down for 5 minutes",
              ],
              tips: [
                "Listen to your body",
                "Stay hydrated during workout",
                "Track your progress",
              ],
            },
          ]
        : []),
      {
        id: `lunch-${date.getDate()}`,
        type: "meal" as const,
        title: "Balanced Lunch",
        description: "Nutritious lunch to maintain energy",
        startTime: profile.lunch_time || "13:00",
        endTime: addMinutes(profile.lunch_time || "13:00", 30),
        duration: 30,
        priority: "high" as const,
        category: "nutrition",
        instructions: [
          "Eat a balanced meal",
          "Include vegetables and protein",
          "Avoid overeating",
        ],
        tips: [
          "Take time to enjoy your meal",
          "Avoid distractions while eating",
        ],
      },
      {
        id: `dinner-${date.getDate()}`,
        type: "meal" as const,
        title: "Light Dinner",
        description: "Evening meal to end the day well",
        startTime: profile.dinner_time || "19:00",
        endTime: addMinutes(profile.dinner_time || "19:00", 30),
        duration: 30,
        priority: "high" as const,
        category: "nutrition",
        instructions: [
          "Eat a lighter dinner",
          "Include vegetables",
          "Finish 2-3 hours before sleep",
        ],
        tips: ["Avoid heavy foods", "Limit screen time during dinner"],
      },
      {
        id: `sleep-${date.getDate()}`,
        type: "sleep" as const,
        title: "Bedtime Routine",
        description: "Prepare for a good night's sleep",
        startTime: addMinutes(sleepTime, -30),
        endTime: sleepTime,
        duration: 30,
        priority: "high" as const,
        category: "wellness",
        instructions: [
          "Wind down activities",
          "Avoid screens",
          "Prepare for sleep",
        ],
        tips: ["Keep bedroom cool and dark", "Use relaxation techniques"],
      },
    ],
    summary: {
      totalActivities: isWorkoutDay ? 6 : 5,
      workoutTime: isWorkoutDay ? 30 : 0,
      mealCount: 3,
      sleepHours: 8,
      focusAreas: isWorkoutDay
        ? ["fitness", "nutrition", "wellness"]
        : ["nutrition", "wellness"],
    },
  });

  return {
    day1: createBasicDay(today, true),
    day2: createBasicDay(tomorrow, false),
    overallGoals: profile.health_goals || [
      "Improve overall health",
      "Build healthy habits",
      "Maintain consistency",
    ],
    progressTips: [
      "Track your daily activities",
      "Stay consistent with your schedule",
      "Listen to your body and adjust as needed",
      "Celebrate small wins",
      "Stay hydrated throughout the day",
    ],
  };
}

function addMinutes(time: string, minutes: number): string {
  const [hours, mins] = time.split(":").map(Number);
  const totalMinutes = hours * 60 + mins + minutes;
  const newHours = Math.floor(totalMinutes / 60);
  const newMins = totalMinutes % 60;
  return `${newHours.toString().padStart(2, "0")}:${newMins
    .toString()
    .padStart(2, "0")}`;
}
