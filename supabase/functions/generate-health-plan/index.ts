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
      return new Response(JSON.stringify({ success: false, error: "Unauthorized" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 401,
      });
    }

    // Get user profile (basic) and onboarding details (separate table)
    const { data: profile, error: profileError } = await supabaseClient
      .from("user_profiles")
      .select("*")
      .eq("id", user.id)
      .single();

    if (profileError || !profile) {
      return new Response(JSON.stringify({ success: false, error: "User profile not found" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 404,
      });
    }

    const { data: onboarding, error: onboardingError } = await supabaseClient
      .from("onboarding_profiles")
      .select("details")
      .eq("user_id", user.id)
      .single();

    if (onboardingError) {
      console.warn("No onboarding_profiles row found; proceeding with profile only");
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

    // Generate health plan using OpenAI
    const healthPlan = await generateHealthPlan(profile, onboarding?.details);

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

    return new Response(JSON.stringify({ success: false, error: error.message || "An unexpected error occurred" }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});

async function generateHealthPlan(profile: UserProfile, onboardingDetails?: any): Promise<TwoDayPlan> {
  const OPENAI_API_KEY = Deno.env.get("OPENAI_API_KEY");

  if (!OPENAI_API_KEY) {
    throw new Error("OpenAI API key not configured");
  }

  // Prepare user data for AI
  const userData = {
    name: profile.full_name || "User",
    age: profile.age,
    gender: profile.gender,
    height: profile.height_cm || profile.height_feet,
    weight: profile.weight_kg || profile.weight_lb,
    unitSystem: profile.unit_system || "metric",
    healthGoals: profile.health_goals || [],
    dietType: profile.diet_type,
    chronicConditions: profile.chronic_conditions || [],
    medications: profile.medications || [],
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
    onboarding: onboardingDetails || {},
  };

  const prompt = `You are Dr. Sarah Chen, a certified health coach, nutritionist, and fitness expert with 15+ years of experience. You specialize in creating personalized, evidence-based health plans that are sustainable and achievable.

## USER PROFILE ANALYSIS
${JSON.stringify(userData, null, 2)}

## YOUR TASK
Create a comprehensive, personalized 2-day health plan that addresses the user's specific needs, goals, and constraints. This plan should be their first step toward a healthier lifestyle.

## PLANNING PRINCIPLES
1. **Personalization**: Tailor every aspect to their profile, schedule, and preferences
2. **Realism**: Create achievable goals that fit their lifestyle
3. **Progression**: Start with manageable activities and build gradually
4. **Balance**: Include fitness, nutrition, sleep, and wellness components
5. **Flexibility**: Account for their work schedule and time constraints
6. **Safety**: Consider any health conditions or limitations

## ACTIVITY GUIDELINES

### WORKOUT ACTIVITIES
- **Beginner**: 20-30 min light cardio, bodyweight exercises, walking
- **Intermediate**: 30-45 min mixed cardio/strength, moderate intensity
- **Advanced**: 45-60 min varied workouts, higher intensity
- Include proper warm-up (5 min) and cool-down (5-10 min)
- Consider their workout time preference and available equipment

### NUTRITION ACTIVITIES
- **Meal Planning**: Based on their diet type (vegetarian, vegan, etc.)
- **Hydration**: 8-10 glasses of water, spaced throughout the day
- **Meal Timing**: Align with their schedule and preferences
- **Portion Control**: Appropriate serving sizes for their goals
- **Nutrient Balance**: Include protein, carbs, healthy fats, fiber

### WELLNESS ACTIVITIES
- **Sleep Optimization**: Wind-down routine, optimal sleep environment
- **Stress Management**: Meditation, deep breathing, relaxation
- **Recovery**: Rest periods, stretching, self-care
- **Medication Reminders**: If applicable, include proper timing

## SCHEDULE OPTIMIZATION
- **Work Schedule**: Respect their work hours and commute time
- **Energy Levels**: Schedule demanding activities when they have most energy
- **Meal Timing**: Space meals 3-4 hours apart
- **Sleep Schedule**: Maintain consistent sleep/wake times
- **Recovery**: Include adequate rest between intense activities

## ACTIVITY REQUIREMENTS
Each activity must include:
- **Realistic Timing**: Based on their actual schedule
- **Clear Instructions**: Step-by-step, actionable guidance
- **Helpful Tips**: Practical advice for success
- **Appropriate Duration**: Realistic time allocation
- **Priority Level**: High for essential activities, medium/low for optional

## RESPONSE FORMAT
Return ONLY a valid JSON object with this EXACT structure. Do not include any text before or after the JSON:

{
  "day1": {
    "date": "2024-01-15",
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
        "instructions": [
          "Wake up at 7:00 AM",
          "Drink a large glass of water",
          "Do 5 minutes of light stretching",
          "Take 3 deep breaths and set your intention for the day"
        ],
        "tips": [
          "Keep your phone away from your bed",
          "Open curtains to let in natural light",
          "Have your water bottle ready the night before"
        ]
      }
    ],
    "summary": {
      "totalActivities": 8,
      "workoutTime": 45,
      "mealCount": 3,
      "sleepHours": 8,
      "focusAreas": ["cardio", "nutrition", "stress-management"]
    }
  },
  "day2": {
    "date": "2024-01-16",
    "activities": [
      {
        "id": "morning-routine-2",
        "type": "other",
        "title": "Morning Energy Boost",
        "description": "Start your day with intention and energy",
        "startTime": "07:00",
        "endTime": "07:30",
        "duration": 30,
        "priority": "high",
        "category": "wellness",
        "instructions": [
          "Wake up at 7:00 AM",
          "Drink a large glass of water",
          "Do 5 minutes of light stretching",
          "Take 3 deep breaths and set your intention for the day"
        ],
        "tips": [
          "Keep your phone away from your bed",
          "Open curtains to let in natural light",
          "Have your water bottle ready the night before"
        ]
      }
    ],
    "summary": {
      "totalActivities": 8,
      "workoutTime": 30,
      "mealCount": 3,
      "sleepHours": 8,
      "focusAreas": ["strength", "nutrition", "recovery"]
    }
  },
  "overallGoals": [
    "Establish consistent morning routine",
    "Improve daily hydration habits",
    "Build sustainable exercise routine"
  ],
  "progressTips": [
    "Track your activities in a journal or app",
    "Celebrate small wins daily",
    "Adjust the plan based on how you feel",
    "Stay consistent rather than perfect",
    "Listen to your body and rest when needed"
  ]
}

## CRITICAL REQUIREMENTS
- Use the user's actual wake-up time, work schedule, and preferences
- Create realistic, achievable activities
- Include proper meal timing based on their schedule
- Account for any health conditions or dietary restrictions
- Provide specific, actionable instructions
- Ensure activities are spaced appropriately throughout the day
- Make Day 2 slightly different from Day 1 for variety
- Focus on building sustainable habits, not perfection

Remember: This is their starting point. Make it encouraging, achievable, and personalized to their unique situation.`;

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content:
            "You are Dr. Sarah Chen, a certified health coach, nutritionist, and fitness expert. You create personalized, evidence-based health plans that are sustainable and achievable. You always respond with valid JSON format only, never including any text before or after the JSON. You are empathetic, encouraging, and focus on building healthy habits gradually. You consider the user's unique circumstances, schedule, and limitations when creating plans.",
        },
        { role: "user", content: prompt },
      ],
      max_tokens: 6000,
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
        title: "Wake Up & Morning Routine",
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
              endTime: addMinutes(workoutTime, 45),
              duration: 45,
              priority: "high" as const,
              category: "fitness",
              instructions: [
                "Warm up for 5 minutes",
                "Main workout for 30 minutes",
                "Cool down for 10 minutes",
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
      workoutTime: isWorkoutDay ? 45 : 0,
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
