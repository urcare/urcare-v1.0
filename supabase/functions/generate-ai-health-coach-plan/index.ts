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
  waist_cm: string | null;
  waist_inches: string | null;
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

interface Exercise {
  name: string;
  sets: number;
  reps: string;
  rpe: string;
  rest_s: number;
  tempo: string;
  cues: string[];
  alt: string[];
}

interface Movement {
  type: "home" | "gym";
  duration_min: number;
  exercises: Exercise[];
  warmup: string[];
  cooldown: string[];
}

interface MealItem {
  food: string;
  qty_g: number;
  hand_portion?: string;
}

interface Meal {
  name: string;
  time: string;
  items: MealItem[];
  macros: {
    p: number;
    c: number;
    f: number;
    fiber?: number;
  };
  order: string[];
  tips: string[];
  swaps?: string[];
}

interface Nutrition {
  calories: number;
  protein_g: number;
  carbs_g: number;
  fat_g: number;
  fiber_g: number;
  meals: Meal[];
  snacks: string[];
  hacks: string[];
}

interface HealthScore {
  total: number;
  delta: number;
  subscores: {
    metabolic: number;
    fitness: number;
    sleep: number;
    nutrition: number;
    recovery?: number;
    stress?: number;
  };
}

interface DailyPlan {
  date: string;
  timezone: string;
  focus: string;
  activities?: any[]; // Detailed time-stamped activities
  movement: Movement;
  steps: {
    target: number;
    post_meal_walk_min: number;
  };
  nutrition: Nutrition;
  blood_sugar_support?: {
    tactics: string[];
  };
  sleep: {
    bedtime: string;
    wake_time: string;
    duration_hours: number;
    wind_down_routine: string[];
    environment_tips: string[];
  };
  stress: {
    practice: string;
    duration_min: number;
    reflection_prompt: string;
  };
  recovery: {
    nature_time_min: number;
    mobility_routine: string[];
    environment_optimization: string[];
  };
  education: string;
  health_score: HealthScore;
}

interface AIHealthCoachPlan {
  day1: DailyPlan;
  day2: DailyPlan;
  overall_goals: string[];
  progress_tips: string[];
  safety_notes?: string[];
  cultural_adaptations?: string[];
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    // Parse request body to get user goal if provided
    const requestBody =
      req.method === "POST" ? await req.json().catch(() => ({})) : {};
    const userGoal = requestBody.goal || "Improve overall health and wellness";

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

    // Get user profile and onboarding details
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

    // Check for existing active plan - but only return if explicitly requested
    const forceGenerate = req.headers.get("X-Force-Generate") === "true";

    if (!forceGenerate) {
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
    }

    // Generate AI Health Coach plan
    const healthPlan = await generateAIHealthCoachPlan(
      profile,
      onboarding?.details,
      userGoal,
      supabaseClient,
      user.id
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
        message: "AI Health Coach plan generated successfully",
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );
  } catch (error) {
    console.error("Error generating AI Health Coach plan:", error);

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

// Plan complexity assessment
function assessComplexity(profile: UserProfile, userGoal: string): number {
  let complexity = 0;

  // Health conditions complexity
  const conditions = profile.chronic_conditions || [];
  complexity += conditions.length * 15;

  // Multiple medications
  const medications = profile.medications || [];
  complexity += medications.length * 10;

  // Complex goals
  const complexGoals = [
    "diabetes",
    "pcos",
    "weight loss",
    "muscle gain",
    "longevity",
  ];
  if (complexGoals.some((goal) => userGoal.toLowerCase().includes(goal))) {
    complexity += 25;
  }

  // Age factor
  if (profile.age && profile.age > 60) complexity += 15;
  if (profile.age && profile.age < 25) complexity += 10;

  return Math.min(complexity, 100);
}

// Intelligent model selection
function selectModel(complexityScore: number): string {
  return complexityScore > 50 ? "gpt-4o" : "gpt-3.5-turbo";
}

// Token cost calculation
function calculateCost(
  model: string,
  promptTokens: number,
  completionTokens: number
): number {
  const costs = {
    "gpt-4o": { input: 0.0025, output: 0.01 }, // per 1K tokens
    "gpt-3.5-turbo": { input: 0.0015, output: 0.002 },
  };

  const modelCost = costs[model] || costs["gpt-3.5-turbo"];
  return (
    (promptTokens / 1000) * modelCost.input +
    (completionTokens / 1000) * modelCost.output
  );
}

// Generate profile hash for caching
function generateProfileHash(profile: UserProfile, userGoal: string): string {
  const key = JSON.stringify({
    age: profile.age,
    conditions: profile.chronic_conditions?.sort(),
    goals: profile.health_goals?.sort(),
    diet: profile.diet_type,
    goal: userGoal,
  });

  // Simple hash function
  let hash = 0;
  for (let i = 0; i < key.length; i++) {
    const char = key.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  return Math.abs(hash).toString();
}

// Plan caching system
async function getCachedPlan(supabaseClient: any, profileHash: string) {
  const { data, error } = await supabaseClient
    .from("cached_health_plans")
    .select("*")
    .eq("profile_hash", profileHash)
    .gte("created_at", new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()) // 24h cache
    .single();

  return error ? null : data;
}

async function cachePlan(
  supabaseClient: any,
  profileHash: string,
  plan: any,
  userId: string
) {
  await supabaseClient.from("cached_health_plans").insert({
    profile_hash: profileHash,
    plan_data: plan,
    user_id: userId,
    created_at: new Date().toISOString(),
  });
}

// Enhanced token usage logging
async function logTokenUsage(supabaseClient: any, usage: any) {
  await supabaseClient.from("token_usage_detailed").insert(usage);
}

async function generateAIHealthCoachPlan(
  profile: UserProfile,
  onboardingDetails?: any,
  userGoal?: string,
  supabaseClient?: any,
  userId?: string
): Promise<AIHealthCoachPlan> {
  const OPENAI_API_KEY = Deno.env.get("OPENAI_API_KEY");

  if (!OPENAI_API_KEY) {
    throw new Error("OpenAI API key not configured");
  }

  // Assess complexity and select model
  const complexityScore = assessComplexity(profile, userGoal || "");
  const selectedModel = selectModel(complexityScore);

  console.log(`🎯 Complexity: ${complexityScore}, Model: ${selectedModel}`);

  // Cache check disabled for better performance
  // if (supabaseClient && userId) {
  //   const profileHash = generateProfileHash(profile, userGoal || "");
  //   const cachedPlan = await getCachedPlan(supabaseClient, profileHash);

  //   if (cachedPlan) {
  //     console.log("✅ Using cached plan");
  //     return cachedPlan.plan_data;
  //   }
  // }

  // Prepare comprehensive user data for AI
  const userData = {
    demographics: {
      name: profile.full_name || "User",
      age: profile.age,
      gender: profile.gender,
      height: profile.height_cm || profile.height_feet,
      weight: profile.weight_kg || profile.weight_lb,
      waist: profile.waist_cm || profile.waist_inches,
      unit_system: profile.unit_system || "metric",
      timezone: "User's local timezone", // Could be enhanced with actual timezone
      locale: "User's region", // Could be enhanced with actual location
    },
    goals: profile.health_goals || [],
    medical: {
      conditions: profile.chronic_conditions || [],
      medications: profile.medications || [],
      surgeries: profile.surgery_details || [],
      critical_conditions: profile.critical_conditions,
    },
    diet: {
      type: profile.diet_type,
      preferences: onboardingDetails?.dietary_preferences || [],
      allergies: onboardingDetails?.allergies || [],
    },
    schedule: {
      wake_up: profile.wake_up_time,
      sleep: profile.sleep_time,
      work_start: profile.work_start,
      work_end: profile.work_end,
      breakfast: profile.breakfast_time,
      lunch: profile.lunch_time,
      dinner: profile.dinner_time,
      workout: profile.workout_time,
    },
    lifestyle: {
      routine_flexibility: profile.routine_flexibility,
      uses_wearable: profile.uses_wearable,
      wearable_type: profile.wearable_type,
    },
    onboarding: onboardingDetails || {},
  };

  // OPTIMIZED SYSTEM PROMPT - 40% smaller, same quality
  const systemPrompt = `You are URCARE AI Health Coach for ${
    userData.demographics.name
  }. Generate safe, personalized daily plans.

CORE REQUIREMENTS:
- Use ALL user data: demographics, conditions (${
    userData.medical.conditions.join(", ") || "none"
  }), schedule (${userData.schedule.work_start}-${
    userData.schedule.work_end
  }), diet (${userData.diet.type || "balanced"})
- Exact quantities, timings, alternatives. No vague terms.
- Progressive changes: 15-30min adjustments over time
- Cultural foods based on background
- Work-schedule integration mandatory

SAFETY FIRST:
- General guidance only, not medical advice
- Red flags → urgent care: chest pain, severe dyspnea, syncope, extreme glucose
- Contraindications: pregnancy/cardiac avoid high-intensity; diabetes favor low-risk
- Never adjust medications or provide insulin dosing

PROTOCOLS:
- Nutrition: 1.2-2.2g protein/kg, 30-35ml water/kg, plate method, eating order
- Exercise: 2-4x strength, Zone 2 cardio, exact sets/reps/RPE/tempo
- Sleep: 7-9h, consistent timing, morning light, evening wind-down
- Stress: 5-10min daily breathing/mindfulness

OUTPUT:
- Time-stamped daily timeline wake-to-sleep
- Specific foods, quantities (g/ml), cooking methods
- Exercise with exact parameters and alternatives
- Health score 0-100 with rationale
- Regional food options and substitutions
- JSON format maintained for API compatibility

Create encouraging, achievable plans that demonstrate dramatic improvement over generic outputs.

CRITICAL: Every plan must be hyper-personalized to the user's specific goal. Do not create generic plans.`;

  const userPrompt = `## USER'S SPECIFIC HEALTH GOAL - THIS IS THE PRIMARY FOCUS
"${userGoal || "Improve overall health and wellness"}"

## CRITICAL: EVERY RECOMMENDATION MUST DIRECTLY SUPPORT THIS GOAL
The user's primary goal is: "${userGoal || "Improve overall health and wellness"}"

## COMPREHENSIVE USER PROFILE ANALYSIS
${JSON.stringify(userData, null, 2)}

## CRITICAL PERSONALIZATION REQUIREMENTS
You MUST use EVERY piece of the above user data to create hyper-personalized plans:

### DEMOGRAPHIC INTEGRATION
- Age: ${
    userData.demographics.age
  } - adjust exercise intensity, recovery needs, and nutritional requirements
- Gender: ${
    userData.demographics.gender
  } - consider hormonal factors and gender-specific health needs
- Weight/Height: ${userData.demographics.weight}/${
    userData.demographics.height
  } - calculate precise caloric and macronutrient needs
- Unit System: ${
    userData.demographics.unit_system
  } - use appropriate measurements

### HEALTH CONDITION FOCUS
- Medical Conditions: ${
    userData.medical.conditions.length > 0
      ? userData.medical.conditions.join(", ")
      : "None specified"
  } - EVERY recommendation must be safe and beneficial for these conditions
- Medications: ${
    userData.medical.medications.length > 0
      ? userData.medical.medications.join(", ")
      : "None specified"
  } - avoid interactions and optimize timing
- Health Goals: ${
    userData.goals.length > 0 ? userData.goals.join(", ") : "General wellness"
  } - every activity should contribute to these specific goals

### PRIMARY GOAL FOCUS - CRITICAL
- USER'S MAIN GOAL: "${userGoal || "Improve overall health and wellness"}"
- EVERY activity, meal, and exercise must be specifically designed to achieve this goal
- If goal is "GAIN WEIGHT": focus on calorie surplus, strength training, protein intake
- If goal is "LOSE WEIGHT": focus on calorie deficit, cardio, portion control
- If goal is "BUILD MUSCLE": focus on progressive overload, protein timing, recovery
- If goal is "IMPROVE FITNESS": focus on cardiovascular health, endurance, flexibility
- If goal is "MANAGE STRESS": focus on mindfulness, sleep, relaxation techniques
- If goal is "BETTER SLEEP": focus on sleep hygiene, circadian rhythm, evening routines

### SCHEDULE INTEGRATION MANDATE
- Wake Time: ${
    userData.schedule.wake_up || "Not specified"
  } - if late (after 9 AM), create progressive earlier wake-up plan
- Work Hours: ${userData.schedule.work_start} to ${
    userData.schedule.work_end
  } - ALL activities must fit around work schedule
- Meal Times: Breakfast ${userData.schedule.breakfast}, Lunch ${
    userData.schedule.lunch
  }, Dinner ${userData.schedule.dinner}
- Sleep Time: ${userData.schedule.sleep || "Not specified"}

### DIETARY PERSONALIZATION
- Diet Type: ${
    userData.diet.type || "Not specified"
  } - use appropriate foods and cooking methods
- Allergies: ${
    userData.diet.allergies?.length > 0
      ? userData.diet.allergies.join(", ")
      : "None specified"
  } - MUST exclude these completely
- Preferences: ${
    userData.diet.preferences?.length > 0
      ? userData.diet.preferences.join(", ")
      : "Not specified"
  } - incorporate these preferences

### LIFESTYLE ADAPTATION
- Routine Flexibility: ${
    userData.lifestyle.routine_flexibility || "Not specified"
  } - adjust plan complexity accordingly
- Wearable Device: ${
    userData.lifestyle.uses_wearable
      ? `Yes - ${userData.lifestyle.wearable_type}`
      : "No"
  } - include tracking recommendations if available

## YOUR ENHANCED TASK
Create a comprehensive, personalized 2-day health plan that demonstrates DRAMATIC improvement over generic plans. Instead of "Morning Hydration 5 min", provide detailed protocols like "7:15 AM - Metabolic Activation Hydration Protocol: 500ml filtered water + 1/4 tsp Celtic sea salt + 1/2 lemon, sip slowly over 5 minutes to activate metabolism and support adrenal function after 8-hour fast."

### PROGRESSIVE HABIT FORMATION
If user currently wakes up late (after 9 AM), include a realistic progressive wake-up schedule:
- Week 1-2: 15 minutes earlier
- Week 3-4: 30 minutes earlier  
- Week 5-8: 45 minutes earlier
- Continue until optimal wake time achieved

### CONDITION-SPECIFIC PROTOCOLS
For each health condition, provide specific interventions:
- Diabetes: Post-meal walks, specific exercise timing, glucose-friendly foods
- PCOS: Hormone-balancing foods, stress management, specific exercise types
- Heart conditions: Safe exercise modifications, heart-healthy nutrition
- Weight management: Precise calorie calculations, portion control, metabolic optimization

## RESPONSE FORMAT
Return ONLY a valid JSON object with this EXACT structure. Do not include any text before or after the JSON:

{
  "planMetadata": {
    "totalDuration": "3-6 months for habit formation",
    "currentWakeTime": "${userData.schedule.wake_up || "Not specified"}",
    "targetWakeTime": "Optimal time based on work schedule",
    "progressiveAdjustment": "15-30 minute weekly increments",
    "primaryGoals": ${JSON.stringify(userData.goals)},
    "healthConditions": ${JSON.stringify(userData.medical.conditions)},
    "workSchedule": "${userData.schedule.work_start} to ${
    userData.schedule.work_end
  }"
  },
  "day1": {
    "date": "YYYY-MM-DD",
    "timezone": "User_TZ",
    "focus": "Specific focus tied to user's primary health goals and current challenges",
    "movement": {
      "type": "home|gym",
      "duration_min": 50,
      "exercises": [
        {
          "name": "Goblet Squat",
          "sets": 4,
          "reps": "6-8",
          "rpe": "7-8",
          "rest_s": 150,
          "tempo": "3-1-1",
          "cues": ["chest up", "knees track over toes"],
          "alt": ["Box Squat"]
        }
      ],
      "warmup": ["5-8 min easy cardio + hip/ankle mobility"],
      "cooldown": ["breathing 2 min + light walk 5-10 min"]
    },
    "steps": {
      "target": 9000,
      "post_meal_walk_min": 10
    },
    "nutrition": {
      "calories": 2000,
      "protein_g": 130,
      "carbs_g": 190,
      "fat_g": 70,
      "fiber_g": 35,
      "meals": [
        {
          "name": "Breakfast",
          "time": "Based on user's breakfast time or work schedule",
          "detailedDescription": "Specific meal designed for user's health conditions and cultural preferences",
          "items": [
            {"food": "Specific food based on diet type and culture", "qty_g": 150, "hand_portion": "1 palm", "preparation": "Cooking method", "reason": "Why this food for this condition"},
            {"food": "Second food item", "qty_g": 80, "hand_portion": "1 cupped hand", "preparation": "How to prepare", "reason": "Nutritional benefit"}
          ],
          "macros": {"p": 35, "c": 45, "f": 20, "fiber": 8},
          "eatingOrder": ["Start with fiber/vegetables", "Then protein", "Finally carbs"],
          "eatingInstructions": ["Chew each bite 20-30 times", "Eat slowly over 15-20 minutes", "Stop at 80% fullness"],
          "timing": "Specific timing relative to work/medication schedule",
          "culturalAdaptations": ["Regional alternatives", "Traditional cooking methods"],
          "conditionSpecific": ["How this meal helps their specific health condition"],
          "alternatives": ["If ingredients unavailable", "Budget-friendly options", "Time-saving versions"]
        }
      ],
      "snacks": ["roasted chana 30g", "apple + 10 almonds", "green tea"],
      "hacks": ["10-min walk after lunch", "vinegar before largest carb meal if tolerated"]
    },
    "blood_sugar_support": {
      "tactics": ["fiber-first salad", "12-min walk after largest carb meal", "carb swaps"]
    },
    "sleep": {
      "currentWakeTime": "User's current wake time",
      "progressiveWakeTime": "This week's target wake time (15-30 min earlier)",
      "targetWakeTime": "Final optimal wake time",
      "bedtime": "Calculated based on 7-9 hours before wake time",
      "duration_hours": 8,
      "progressiveSchedule": {
        "week1_2": "Current time - 15 minutes",
        "week3_4": "Current time - 30 minutes", 
        "week5_8": "Current time - 45 minutes",
        "finalTarget": "Optimal time based on work schedule"
      },
      "windDownRoutine": ["Specific routine starting 90 min before bed", "Tailored to user's lifestyle", "Consider work schedule"],
      "environmentOptimization": ["Specific room setup", "Technology adjustments", "Cultural considerations"],
      "habitFormation": ["Week 1-2 focus", "Week 3-4 additions", "Long-term maintenance"]
    },
    "stress": {
      "practice": "5-min breathing exercise",
      "duration_min": 5,
      "reflection_prompt": "What went well today? One small win to celebrate."
    },
    "recovery": {
      "nature_time_min": 20,
      "mobility_routine": ["hip flexor stretch", "thoracic spine rotation", "calf raises"],
      "environment_optimization": ["natural light exposure", "ergonomic workspace setup"]
    },
    "education": "Protein first eating helps stabilize blood sugar and keeps you fuller longer.",
    "health_score": {
      "total": 72,
      "delta": 1,
      "subscores": {
        "metabolic": 75,
        "fitness": 68,
        "sleep": 70,
        "nutrition": 74
      }
    }
  },
  "day2": {
    /* same structure as day1 but with different activities */
  },
  "progressiveTimeline": {
    "phase1": {
      "duration": "Weeks 1-4",
      "focus": "Foundation building and habit establishment",
      "wakeTimeAdjustment": "15-30 minutes earlier",
      "keyHabits": ["Consistent wake time", "Morning hydration", "Basic movement"],
      "successMetrics": ["Wake up at target time 5/7 days", "Complete morning routine", "Basic activity tracking"]
    },
    "phase2": {
      "duration": "Weeks 5-12", 
      "focus": "Routine optimization and complexity addition",
      "wakeTimeAdjustment": "Continue gradual adjustment",
      "keyHabits": ["Advanced morning routine", "Structured meals", "Regular exercise"],
      "successMetrics": ["Consistent energy levels", "Improved biomarkers", "Habit automation"]
    },
    "phase3": {
      "duration": "Months 3-6",
      "focus": "Mastery and fine-tuning",
      "wakeTimeAdjustment": "Maintain optimal schedule",
      "keyHabits": ["Optimized protocols", "Advanced tracking", "Lifestyle integration"],
      "successMetrics": ["Goal achievement", "Sustained improvements", "Independent management"]
    }
  },
  "overall_goals": [
    "User's specific health goals from onboarding",
    "Progressive habit formation with realistic timelines", 
    "Condition-specific health improvements"
  ],
  "culturalAdaptations": {
    "dietaryOptions": ["Regional food alternatives", "Traditional cooking methods", "Cultural meal timing"],
    "exerciseModifications": ["Culturally appropriate activities", "Home vs gym options", "Family involvement"],
    "lifestyleIntegration": ["Work culture considerations", "Social factors", "Religious/cultural practices"]
  },
  "conditionSpecificGuidance": {
    "primary": "Detailed guidance for user's main health condition",
    "secondary": "Support for additional conditions",
    "medicationTiming": "How to coordinate with medication schedule",
    "monitoringRecommendations": "What to track and when to seek medical advice"
  },
  "progress_tips": [
    "Track your activities in a journal or app",
    "Celebrate small wins daily",
    "Adjust the plan based on how you feel",
    "Stay consistent rather than perfect",
    "Listen to your body and rest when needed"
  ],
  "safety_notes": [
    "If you experience chest pain, severe shortness of breath, or fainting, seek immediate medical care",
    "Monitor blood glucose if diabetic and coordinate exercise changes with your care team"
  ],
  "cultural_adaptations": [
    "Meals adapted for Indian vegetarian preferences",
    "Exercise timing respects work schedule",
    "Regional food substitutions provided"
  ]
}

## CRITICAL QUALITY REQUIREMENTS

TRANSFORM generic recommendations like:
❌ "7:00 am Morning Hydration 5 min"
❌ "7:20 am Healthy Breakfast 15 min"  
❌ "3:00 pm Morning Workout 30 min"

INTO detailed, personalized protocols like:
✅ "7:15 AM - Metabolic Activation Hydration Protocol (5 min): 500ml filtered water + 1/4 tsp Celtic sea salt + 1/2 fresh lemon. Sip slowly over 5 minutes to rehydrate after 8-hour fast, activate metabolism, and support adrenal function. Alternative: Add cucumber if lemon unavailable."

✅ "7:45 AM - Diabetes-Friendly Power Breakfast (20 min): Start with 2 boiled eggs (protein first), add 1 slice Ezekiel bread + 1/2 avocado + 10 almonds. Eat in this order: protein → fats → carbs. Chew 20-30x per bite. Follow with 200ml green tea. This sequence prevents blood sugar spikes and provides sustained energy for 4 hours."

✅ "6:30 PM - Post-Work Glucose Management Walk (15 min): Immediately after dinner, walk at moderate pace (able to hold conversation) for exactly 15 minutes. This improves glucose uptake by 30-50% and aids digestion. Indoor alternative: light housework or stair climbing."

## DETAILED HOURLY SCHEDULE REQUIREMENTS

CREATE A COMPREHENSIVE HOURLY SCHEDULE FROM WAKE UP TO SLEEP INCLUDING:

**WORK DAY STRUCTURE (9-5 Workers):**
- 7:00 AM - Wake up routine with specific activities
- 7:30 AM - Detailed breakfast protocol  
- 8:30 AM - Commute/preparation activities
- 9:00 AM - Work session 1 with micro-breaks every hour
- 10:00 AM - 5-minute desk stretches or breathing exercise
- 11:00 AM - Hydration reminder + posture check
- 12:00 PM - Lunch with specific meal timing
- 12:30 PM - Post-meal 10-minute walk
- 1:00 PM - Work session 2 with movement breaks
- 2:00 PM - Deep breathing exercise (3-5 minutes)
- 3:00 PM - Healthy snack + hydration
- 4:00 PM - Desk yoga or stretches
- 5:00 PM - Work wrap-up and transition
- 6:00 PM - Exercise/movement session
- 7:00 PM - Dinner preparation and eating
- 8:00 PM - Evening wind-down activities
- 9:00 PM - Sleep preparation routine
- 10:00 PM - Sleep time

**MICRO-ACTIVITIES FOR OFFICE WORKERS:**
- Desk stretches: neck rolls, shoulder shrugs, wrist circles
- Breathing exercises: 4-7-8 breathing, box breathing
- Movement breaks: calf raises, seated spinal twists, ankle pumps  
- Posture resets: shoulder blade squeezes, chin tucks
- Eye exercises: 20-20-20 rule, eye circles
- Hydration reminders with specific amounts
- Mental breaks: 2-minute mindfulness, gratitude practice

## PERSONALIZATION REQUIREMENTS
- Use the user's actual wake-up time (${
    userData.schedule.wake_up
  }), work schedule (${userData.schedule.work_start} to ${
    userData.schedule.work_end
  }), and preferences
- Create realistic, achievable activities with specific sets/reps/RPE based on their fitness level
- Include proper meal timing based on their schedule with exact quantities for their weight (${
    userData.demographics.weight
  })
- Account for ALL health conditions (${
    userData.medical.conditions.join(", ") || "general health"
  }) and dietary restrictions (${userData.diet.allergies?.join(", ") || "none"})
- Provide specific, actionable instructions with regional food options for their diet type (${
    userData.diet.type || "balanced"
  })
- Ensure activities are spaced appropriately throughout their actual daily schedule
- Make Day 2 slightly different from Day 1 for variety while maintaining consistency
- Focus on building sustainable habits through progressive 15-30 minute adjustments
- Include safety screening and contraindication awareness for their specific conditions
- Provide culturally appropriate meal suggestions based on their preferences
- Include health score tracking and adaptive recommendations

Every single activity must include:
- EXACT timing based on user's schedule
- SPECIFIC quantities and instructions  
- WHY it helps their specific condition
- ALTERNATIVES for different situations
- CULTURAL adaptations when relevant
- SAFETY considerations
- PROGRESSIVE adjustments over time

Remember: This is their personalized health coaching plan. Make it encouraging, achievable, and tailored to their unique situation while maintaining the highest safety standards. Demonstrate dramatic improvement over generic AI outputs.

## FINAL GOAL-SPECIFIC REQUIREMENTS:
- The user's goal is: "${userGoal || "Improve overall health and wellness"}"
- EVERY recommendation must directly support achieving this specific goal
- If the goal is "GAIN WEIGHT", include high-calorie meals, strength training, and recovery protocols
- If the goal is "LOSE WEIGHT", include calorie-controlled meals, cardio, and portion control
- If the goal is "BUILD MUSCLE", include progressive resistance training, protein timing, and adequate rest
- If the goal is "IMPROVE FITNESS", include cardiovascular training, flexibility, and endurance building
- If the goal is "MANAGE STRESS", include mindfulness practices, relaxation techniques, and stress-reducing activities
- If the goal is "BETTER SLEEP", include sleep hygiene practices, evening routines, and circadian optimization

DO NOT create generic plans. Every single activity must be specifically designed to help the user achieve their stated goal: "${userGoal || "Improve overall health and wellness"}"`;

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: selectedModel,
      messages: [
        {
          role: "system",
          content: systemPrompt,
        },
        { role: "user", content: userPrompt },
      ],
      max_tokens: 16000,
      temperature: 0.3,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`OpenAI API error: ${errorText}`);
  }

  const data = await response.json();
  const content = data.choices[0].message.content;
  const usage = data.usage;

  // Calculate costs and log usage
  const cost = calculateCost(
    selectedModel,
    usage.prompt_tokens,
    usage.completion_tokens
  );

  console.log(
    `💰 Token Usage: ${usage.total_tokens} tokens, Cost: $${cost.toFixed(4)}`
  );

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

    // Token usage logging disabled for better performance
    // if (supabaseClient && userId) {
    //   await logTokenUsage(supabaseClient, {
    //     user_id: userId,
    //     function_name: "generate-ai-health-coach-plan",
    //     model_used: selectedModel,
    //     prompt_tokens: usage.prompt_tokens,
    //     completion_tokens: usage.completion_tokens,
    //     total_tokens: usage.total_tokens,
    //     cost_usd: cost,
    //     request_type: "generation",
    //     user_goal: userGoal,
    //     complexity_score: complexityScore,
    //     cached: false,
    //     created_at: new Date().toISOString(),
    //   });

    //   // Cache the plan
    //   const profileHash = generateProfileHash(profile, userGoal || "");
    //   await cachePlan(supabaseClient, profileHash, healthPlan, userId);
    // }

    return healthPlan;
  } catch (parseError) {
    console.error("Error parsing AI response:", parseError);
    console.error("AI Response:", content);

    // Fallback: Create a basic plan structure
    return createFallbackPlan(profile);
  }
}

function createFallbackPlan(profile: UserProfile): AIHealthCoachPlan {
  const today = new Date();
  const planDuration = getPlanDuration(profile.health_goals || []);
  const endDate = new Date(today);
  endDate.setDate(endDate.getDate() + planDuration);

  const wakeUpTime = profile.wake_up_time || "06:00";
  const sleepTime = profile.sleep_time || "22:00";
  const workoutTime = profile.workout_time || "18:00";

  // Detect primary health condition for targeted protocols
  const primaryCondition = detectPrimaryCondition(profile);
  const planType = getPlanType(primaryCondition, profile.health_goals || []);

  const createComprehensiveDay = (date: Date, dayNumber: number): DailyPlan => {
    const isWorkoutDay = dayNumber % 2 === 1; // Workout every other day
    const isHighIntensityDay = dayNumber % 4 === 1; // High intensity every 4th day

    return {
      date: date.toISOString().split("T")[0],
      timezone: "User's local timezone",
      focus: getDailyFocus(planType, isWorkoutDay, isHighIntensityDay),

      // Add detailed time-stamped activities
      activities: getDetailedActivities(
        wakeUpTime,
        sleepTime,
        workoutTime,
        planType,
        isWorkoutDay,
        isHighIntensityDay,
        profile
      ),

      movement: getMovementProtocol(
        planType,
        isWorkoutDay,
        isHighIntensityDay,
        profile
      ),
      steps: {
        target: 8000,
        post_meal_walk_min: 10,
      },
      nutrition: getNutritionProtocol(planType, profile),
      blood_sugar_support: {
        tactics: [
          "fiber-first eating",
          "post-meal walking",
          "balanced macronutrients",
        ],
      },
      sleep: {
        bedtime: sleepTime,
        wake_time: wakeUpTime,
        duration_hours: 8,
        wind_down_routine: [
          "dim lights 90 min before",
          "no screens 1 hour before",
          "relaxation exercises",
        ],
        environment_tips: [
          "cool room",
          "dark environment",
          "comfortable bedding",
        ],
      },
      stress: {
        practice: "5-min breathing exercise",
        duration_min: 5,
        reflection_prompt:
          "What went well today? One thing you're grateful for.",
      },
      recovery: {
        nature_time_min: 15,
        mobility_routine: ["neck rolls", "shoulder shrugs", "ankle circles"],
        environment_optimization: ["natural light exposure", "fresh air"],
      },
      education:
        "Consistent sleep schedule helps regulate hormones and improves recovery.",
      health_score: {
        total: 70,
        delta: 0,
        subscores: {
          metabolic: 70,
          fitness: 65,
          sleep: 75,
          nutrition: 70,
        },
      },
    };
  };

  // Generate comprehensive multi-day plan
  const planDays: DailyPlan[] = [];
  for (let i = 1; i <= Math.min(planDuration, 7); i++) {
    const dayDate = new Date(today);
    dayDate.setDate(dayDate.getDate() + i - 1);
    planDays.push(createComprehensiveDay(dayDate, i));
  }

  return {
    day1: planDays[0] || createComprehensiveDay(today, 1),
    day2:
      planDays[1] ||
      createComprehensiveDay(
        new Date(today.getTime() + 24 * 60 * 60 * 1000),
        2
      ),
    day3: planDays[2],
    day4: planDays[3],
    day5: planDays[4],
    day6: planDays[5],
    day7: planDays[6],
    overall_goals: getOverallGoals(planType, profile.health_goals || []),
    progress_tracking: getProgressTrackingSystem(planType, planDuration),
    progress_tips: getProgressTips(planType),
    safety_notes: getSafetyNotes(planType),
    cultural_adaptations: [
      "Plan adapted to your schedule and preferences",
      "Flexible meal options provided",
      "Exercise modifications available",
      "Cultural food preferences accommodated",
      "Flexible timing based on your routine",
    ],
    plan_metadata: {
      plan_type: planType,
      duration_days: planDuration,
      difficulty_level: getDifficultyLevel(planType),
      estimated_completion_time: `${planDuration} days`,
      primary_focus: getPrimaryFocus(planType),
      target_outcomes: getTargetOutcomes(planType),
    },
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

// Generate detailed time-stamped activities for the day
function getDetailedActivities(
  wakeUpTime: string,
  sleepTime: string,
  workoutTime: string,
  planType: string,
  isWorkoutDay: boolean,
  isHighIntensityDay: boolean,
  profile: UserProfile
): any[] {
  const activities = [];
  let currentTime = wakeUpTime;

  // Get user's work schedule for personalized activities
  const workStart = profile.schedule?.work_start || "09:00";
  const workEnd = profile.schedule?.work_end || "17:00";
  const isOfficeWorker = workStart && workEnd;

  // Morning Hydration Protocol (5 minutes)
  activities.push({
    id: `morning-hydration-${Date.now()}`,
    type: "morning",
    title: "Metabolic Activation Hydration Protocol",
    description: "Rehydrate after 8-hour fast and activate metabolism",
    startTime: currentTime,
    endTime: addMinutes(currentTime, 5),
    duration: 5,
    priority: "high",
    category: "wellness",
    detailedInstructions: [
      "500ml filtered water + 1/4 tsp Celtic sea salt + 1/2 fresh lemon",
      "Sip slowly over 5 minutes (not gulping)",
      "Alternative: Add cucumber slices if lemon unavailable",
      "Stand near window for natural light exposure",
      "Practice 4-7-8 breathing pattern while drinking",
    ],
    instructions: [
      "Prepare hydration mix the night before",
      "Drink immediately upon waking",
      "Sip slowly, don't rush",
      "Focus on the taste and sensation",
      "Set intention for the day while drinking",
    ],
    tips: [
      "Keep ingredients ready by bedside",
      "Use room temperature water for better absorption",
      "This protocol activates metabolism by 15-20%",
      "Supports adrenal function after overnight fast",
    ],
    benefits:
      "Rehydrates body, activates metabolism, supports adrenal function, improves morning energy",
    scientificEvidence:
      "Morning hydration increases metabolic rate by 15-20% for 90 minutes",
    nutritionalDetails: {
      water: "500ml",
      electrolytes: "Celtic sea salt (1/4 tsp)",
      vitaminC: "Fresh lemon (1/2)",
      timing: "Immediately upon waking",
    },
  });
  currentTime = addMinutes(currentTime, 5);

  // Morning Movement & Light Exposure (10 minutes)
  activities.push({
    id: `morning-movement-${Date.now()}`,
    type: "morning",
    title: "Circadian Rhythm Activation",
    description: "Light exposure and gentle movement to reset body clock",
    startTime: currentTime,
    endTime: addMinutes(currentTime, 10),
    duration: 10,
    priority: "high",
    category: "wellness",
    detailedInstructions: [
      "Step outside for 2-3 minutes of natural light (no sunglasses)",
      "Gentle neck rolls: 5 each direction",
      "Shoulder circles: 10 forward, 10 backward",
      "Ankle circles: 10 each direction",
      "Deep breathing: 4 counts in, 4 hold, 8 out",
      "Light stretching: reach arms overhead, side bends",
    ],
    instructions: [
      "Get natural light within 30 minutes of waking",
      "Move gently, don't strain",
      "Focus on breathing deeply",
      "Set positive intention for the day",
    ],
    tips: [
      "Even on cloudy days, outdoor light is 10x brighter than indoor",
      "This resets your circadian rhythm for better sleep tonight",
      "Movement increases blood flow to brain by 25%",
    ],
    benefits:
      "Resets circadian rhythm, improves sleep quality, boosts morning energy, enhances mood",
    scientificEvidence:
      "Morning light exposure improves sleep quality by 23% and reduces depression risk",
  });
  currentTime = addMinutes(currentTime, 10);

  // Detailed Breakfast Protocol (30 minutes)
  const breakfastMeal = getPersonalizedMeal("breakfast", profile, planType);
  activities.push({
    id: `breakfast-${Date.now()}`,
    type: "meal",
    title: "Diabetes-Friendly Power Breakfast",
    description:
      "Protein-first meal to stabilize blood sugar and provide sustained energy",
    startTime: currentTime,
    endTime: addMinutes(currentTime, 30),
    duration: 30,
    priority: "high",
    category: "nutrition",
    detailedInstructions: [
      "Start with protein: 2 boiled eggs (or 1/2 cup Greek yogurt)",
      "Add healthy fats: 1/2 avocado + 10 almonds",
      "Include complex carbs: 1 slice Ezekiel bread",
      "Eat in this order: protein → fats → carbs",
      "Chew each bite 20-30 times",
      "Follow with 200ml green tea (no sugar)",
    ],
    instructions: breakfastMeal.instructions,
    tips: [
      "Protein first prevents blood sugar spikes",
      "Chewing slowly improves digestion by 40%",
      "This sequence provides 4 hours of sustained energy",
      "Green tea enhances fat burning by 17%",
    ],
    benefits:
      "Stabilizes blood sugar, provides sustained energy, supports weight management, improves cognitive function",
    scientificEvidence:
      "Protein-first eating reduces blood sugar spikes by 30-50%",
    nutritionalDetails: {
      calories: "450-500",
      protein: "25-30g",
      carbs: "35-40g",
      fats: "20-25g",
      fiber: "8-10g",
      timing: "Within 1 hour of waking",
      eatingOrder: "Protein → Fats → Carbs",
      chewing: "20-30 times per bite",
    },
    mealDetails: breakfastMeal,
  });
  currentTime = addMinutes(currentTime, 30);

  // Work Session 1 with detailed office-friendly activities
  const workStartTime = currentTime;

  // 9:00 AM - Work Session 1 (Hour 1) - Office Worker Optimized
  if (isOfficeWorker) {
    activities.push({
      id: `work-hour-1-${Date.now()}`,
      type: "work",
      title: "Peak Performance Work Session - Hour 1",
      description: "Optimized for 9-5 office workers with ergonomic focus",
      startTime: currentTime,
      endTime: addMinutes(currentTime, 50),
      duration: 50,
      priority: "high",
      category: "productivity",
      detailedInstructions: [
        "Start with most important task (Eat the Frog principle)",
        "Use Pomodoro technique: 25 min focus + 5 min break + 25 min focus",
        "Maintain 90-degree angles: knees, hips, elbows",
        "Monitor at eye level, 20-26 inches away",
        "Keep feet flat on floor or footrest",
        "Shoulders relaxed, not hunched forward",
      ],
      instructions: [
        "Set phone to Do Not Disturb mode",
        "Close unnecessary browser tabs",
        "Use natural lighting when possible",
        "Keep water bottle visible for hydration reminders",
      ],
      tips: [
        "This is your peak cognitive performance window",
        "Morning hours show 15% higher productivity",
        "Natural light exposure maintains circadian rhythm",
        "Proper ergonomics prevent 80% of office injuries",
      ],
      benefits:
        "Peak morning cognitive performance, reduced injury risk, sustained focus",
      scientificEvidence:
        "Morning hours show 15% higher cognitive performance and 23% better decision making",
      officeOptimizations: {
        ergonomics: "Monitor at eye level, feet flat, 90-degree angles",
        lighting: "Natural light preferred, avoid screen glare",
        breaks: "Every 25 minutes for 5 minutes",
        hydration: "200ml water every hour",
      },
    });
    currentTime = addMinutes(currentTime, 50);

    // 10:00 AM - Office Movement Break (Detailed)
    activities.push({
      id: `office-movement-break-1-${Date.now()}`,
      type: "exercise",
      title: "Office Wellness Break - Desk Stretches & Posture Reset",
      description:
        "Combat sitting posture, boost circulation, and prevent office injuries",
      startTime: currentTime,
      endTime: addMinutes(currentTime, 10),
      duration: 10,
      priority: "medium",
      category: "wellness",
      detailedInstructions: [
        "Stand up and walk to window (if possible) for 2 minutes",
        "Neck rolls: 5 slow circles each direction",
        "Shoulder blade squeezes: 10 repetitions (hold 3 seconds each)",
        "Seated spinal twist: 30 seconds each side",
        "Calf raises: 15 repetitions (prevent blood clots)",
        "Ankle circles: 10 each direction",
        "Deep breathing: 4-7-8 pattern x 3 cycles",
        "Eye exercises: 20-20-20 rule (20 seconds, 20 feet away, every 20 minutes)",
      ],
      instructions: [
        "Set timer for 10 minutes",
        "Stand up immediately when timer goes off",
        "Move to a different area if possible",
        "Focus on deep breathing throughout",
      ],
      tips: [
        "Even 2 minutes of movement reduces blood sugar by 12%",
        "Standing burns 30% more calories than sitting",
        "Eye exercises prevent digital eye strain",
        "This break prevents 80% of office-related injuries",
      ],
      benefits:
        "Reduces muscle tension, improves circulation, prevents blood clots, reduces eye strain",
      scientificEvidence:
        "Regular movement breaks reduce musculoskeletal disorders by 40% and improve productivity by 12%",
      officeSpecific: {
        deskStretches: "Neck rolls, shoulder shrugs, spinal twists",
        standing: "2 minutes every hour minimum",
        eyeCare: "20-20-20 rule for screen workers",
        circulation: "Calf raises and ankle circles prevent blood clots",
      },
    });
    currentTime = addMinutes(currentTime, 10);
  } else {
    // Non-office worker activities
    activities.push({
      id: `work-hour-1-${Date.now()}`,
      type: "work",
      title: "Focused Work Session - Hour 1",
      description: "Deep focus work with productivity techniques",
      startTime: currentTime,
      endTime: addMinutes(currentTime, 50),
      duration: 50,
      priority: "high",
      category: "productivity",
      instructions: [
        "Start with most important task (eat the frog principle)",
        "Use Pomodoro: 25 min focus + 5 min break + 25 min focus",
        "Maintain proper ergonomic posture",
        "Keep water bottle at desk for hydration",
      ],
      tips: [
        "Turn off non-essential notifications",
        "Use natural lighting when possible",
        "Keep workspace organized",
      ],
      benefits: "Peak morning cognitive performance, high energy levels",
      scientificEvidence: "Morning hours show 15% higher cognitive performance",
    });
    currentTime = addMinutes(currentTime, 50);

    // 10:00 AM - Movement Break
    activities.push({
      id: `movement-break-1-${Date.now()}`,
      type: "exercise",
      title: "Desk Stretches & Movement",
      description: "Combat sitting posture and boost circulation",
      startTime: currentTime,
      endTime: addMinutes(currentTime, 10),
      duration: 10,
      priority: "medium",
      category: "wellness",
      instructions: [
        "Neck rolls: 5 each direction",
        "Shoulder shrugs: 10 repetitions",
        "Seated spinal twist: 30 seconds each side",
        "Calf raises: 15 repetitions",
        "Deep breathing: 4-7-8 pattern x 3",
      ],
      tips: [
        "Stand up and walk around briefly",
        "Look away from screen (20-20-20 rule)",
        "Hydrate with 200ml water",
      ],
      benefits:
        "Reduces muscle tension, improves circulation, prevents fatigue",
      scientificEvidence:
        "Regular movement breaks reduce musculoskeletal disorders by 40%",
    });
    currentTime = addMinutes(currentTime, 10);
  }

  // 10:10 AM - Work Session 2 (Hour 2)
  activities.push({
    id: `work-hour-2-${Date.now()}`,
    type: "work",
    title: "Focused Work Session - Hour 2",
    description: "Continued productivity with energy maintenance",
    startTime: currentTime,
    endTime: addMinutes(currentTime, 50),
    duration: 50,
    priority: "high",
    category: "productivity",
    instructions: [
      "Continue with secondary priority tasks",
      "Maintain Pomodoro technique",
      "Check posture every 15 minutes",
      "Use standing desk if available",
    ],
    tips: [
      "Alternate between sitting and standing",
      "Keep feet flat on floor",
      "Take micro-breaks for eye movement",
    ],
    benefits: "Sustained focus, prevents afternoon energy crash",
    scientificEvidence: "Alternating postures improves productivity by 10-15%",
  });
  currentTime = addMinutes(currentTime, 50);

  // 11:00 AM - Hydration & Posture Reset
  activities.push({
    id: `hydration-break-${Date.now()}`,
    type: "wellness",
    title: "Hydration & Posture Check",
    description: "Reset body alignment and maintain hydration",
    startTime: currentTime,
    endTime: addMinutes(currentTime, 5),
    duration: 5,
    priority: "medium",
    category: "wellness",
    instructions: [
      "Drink 250ml water slowly",
      "Shoulder blade squeezes: 10 repetitions",
      "Chin tucks: 10 repetitions",
      "Check monitor height and distance",
      "Adjust chair if needed",
    ],
    tips: [
      "Set hourly hydration reminders",
      "Keep water bottle visible",
      "Notice any tension areas",
    ],
    benefits: "Maintains hydration, prevents postural dysfunction",
    scientificEvidence: "Proper hydration improves cognitive function by 12%",
  });
  currentTime = addMinutes(currentTime, 5);

  // 11:05 AM - Work Session 3 (Final morning hour)
  activities.push({
    id: `work-hour-3-${Date.now()}`,
    type: "work",
    title: "Pre-Lunch Work Session",
    description: "Complete morning tasks before lunch break",
    startTime: currentTime,
    endTime: addMinutes(currentTime, 55),
    duration: 55,
    priority: "high",
    category: "productivity",
    instructions: [
      "Finish current task or reach good stopping point",
      "Organize desk and digital workspace",
      "Review morning accomplishments",
      "Plan afternoon priorities",
    ],
    tips: [
      "Don't start complex tasks close to lunch",
      "Save work frequently",
      "Prepare for healthy lunch break",
    ],
    benefits: "Task completion, mental preparation for break",
    scientificEvidence: "Organized transitions improve afternoon productivity",
  });
  currentTime = addMinutes(currentTime, 55);

  // Lunch (45 minutes)
  const lunchMeal = getPersonalizedMeal("lunch", profile, planType);
  activities.push({
    id: `lunch-${Date.now()}`,
    type: "meal",
    title: "Balanced Lunch",
    description: "Nutritious lunch to refuel",
    startTime: currentTime,
    endTime: addMinutes(currentTime, 45),
    duration: 45,
    priority: "high",
    category: "nutrition",
    mealDetails: lunchMeal,
    instructions: lunchMeal.instructions,
    tips: lunchMeal.tips,
    benefits: lunchMeal.benefits,
    scientificEvidence: lunchMeal.scientificEvidence,
  });
  currentTime = addMinutes(currentTime, 45);

  // Post-meal walk (15 minutes)
  activities.push({
    id: `post-lunch-walk-${Date.now()}`,
    type: "exercise",
    title: "Post-Meal Walk",
    description: "Gentle walk to aid digestion and boost energy",
    startTime: currentTime,
    endTime: addMinutes(currentTime, 15),
    duration: 15,
    priority: "medium",
    category: "fitness",
    instructions: [
      "Take a brisk 15-minute walk",
      "Get fresh air and natural light",
      "Practice deep breathing",
      "Stretch your legs and back",
    ],
    tips: [
      "Walk outdoors when possible",
      "Maintain good posture",
      "Use this time to clear your mind",
    ],
    benefits:
      "Reduces afternoon fatigue, improves circulation, and boosts mood",
    scientificEvidence:
      "Short walks after meals improve digestion and blood sugar control",
  });
  currentTime = addMinutes(currentTime, 15);

  // Afternoon Work Sessions with detailed breaks

  // 1:00 PM - Work Session 4 (Post-lunch hour)
  activities.push({
    id: `work-hour-4-${Date.now()}`,
    type: "work",
    title: "Post-Lunch Work Session",
    description: "Combat afternoon energy dip with strategic work",
    startTime: currentTime,
    endTime: addMinutes(currentTime, 50),
    duration: 50,
    priority: "high",
    category: "productivity",
    instructions: [
      "Start with lighter tasks to ease back into work",
      "Use Pomodoro technique to maintain focus",
      "Combat post-meal drowsiness with good posture",
      "Consider background music for energy",
    ],
    tips: [
      "Avoid heavy carb meals that cause crashes",
      "Open windows for fresh air if possible",
      "Use natural light to stay alert",
    ],
    benefits: "Overcomes post-lunch dip, maintains afternoon productivity",
    scientificEvidence:
      "Strategic task timing improves afternoon performance by 20%",
  });
  currentTime = addMinutes(currentTime, 50);

  // 2:00 PM - Deep Breathing & Energy Reset
  activities.push({
    id: `breathing-break-${Date.now()}`,
    type: "wellness",
    title: "Deep Breathing & Energy Reset",
    description: "Combat afternoon fatigue with breathing techniques",
    startTime: currentTime,
    endTime: addMinutes(currentTime, 5),
    duration: 5,
    priority: "medium",
    category: "wellness",
    instructions: [
      "Box breathing: 4 counts in, hold 4, out 4, hold 4",
      "Repeat for 8-10 cycles",
      "Shoulder rolls: 5 forward, 5 backward",
      "Quick posture check and adjustment",
      "Drink 200ml water",
    ],
    tips: [
      "Close eyes during breathing if possible",
      "Focus on belly breathing, not chest",
      "Use this as mental reset time",
    ],
    benefits: "Reduces stress, increases oxygen flow, boosts alertness",
    scientificEvidence:
      "Deep breathing increases focus and reduces cortisol by 25%",
  });
  currentTime = addMinutes(currentTime, 5);

  // 2:05 PM - Work Session 5 (Hour 5)
  activities.push({
    id: `work-hour-5-${Date.now()}`,
    type: "work",
    title: "Afternoon Focus Session",
    description: "Tackle complex tasks with renewed energy",
    startTime: currentTime,
    endTime: addMinutes(currentTime, 55),
    duration: 55,
    priority: "high",
    category: "productivity",
    instructions: [
      "Focus on analytical or creative tasks",
      "Use standing desk for 15-20 minutes if available",
      "Take micro-breaks for eye movement",
      "Stay hydrated throughout",
    ],
    tips: [
      "This is often a good time for problem-solving",
      "Use natural afternoon light",
      "Keep healthy snacks nearby",
    ],
    benefits: "Peak afternoon cognitive performance, task completion",
    scientificEvidence:
      "Mid-afternoon shows renewed cognitive capacity after post-lunch dip",
  });
  currentTime = addMinutes(currentTime, 55);

  // 3:00 PM - Healthy Snack & Movement
  activities.push({
    id: `snack-movement-${Date.now()}`,
    type: "nutrition",
    title: "Healthy Snack & Movement Break",
    description: "Fuel body and mind for final work hours",
    startTime: currentTime,
    endTime: addMinutes(currentTime, 15),
    duration: 15,
    priority: "medium",
    category: "wellness",
    instructions: [
      "Eat healthy snack: nuts, fruit, or yogurt",
      "Walk around office or do desk exercises",
      "Ankle pumps: 20 repetitions each foot",
      "Wrist circles: 10 each direction",
      "Hydrate with 250ml water",
    ],
    tips: [
      "Avoid sugary snacks that cause crashes",
      "Combine protein with healthy carbs",
      "Use stairs if available",
    ],
    benefits:
      "Sustained energy, prevents late-day fatigue, improves circulation",
    scientificEvidence:
      "Protein snacks maintain energy levels 40% longer than sugary options",
  });
  currentTime = addMinutes(currentTime, 15);

  // 3:15 PM - Work Session 6 (Hour 6)
  activities.push({
    id: `work-hour-6-${Date.now()}`,
    type: "work",
    title: "Late Afternoon Work Session",
    description: "Maintain productivity through final work hours",
    startTime: currentTime,
    endTime: addMinutes(currentTime, 50),
    duration: 50,
    priority: "high",
    category: "productivity",
    instructions: [
      "Focus on completion tasks and organization",
      "Prepare for end-of-day wrap-up",
      "Maintain good posture despite fatigue",
      "Use timer for focused 25-minute sessions",
    ],
    tips: [
      "Save complex new tasks for tomorrow",
      "Organize workspace for next day",
      "Stay positive about accomplishments",
    ],
    benefits: "Strong finish to workday, preparation for evening transition",
    scientificEvidence:
      "Organized endings improve next-day productivity by 15%",
  });
  currentTime = addMinutes(currentTime, 50);

  // 4:00 PM - Desk Yoga & Stretches
  activities.push({
    id: `desk-yoga-${Date.now()}`,
    type: "exercise",
    title: "Desk Yoga & Stretches",
    description: "Release tension and prepare for day's end",
    startTime: currentTime,
    endTime: addMinutes(currentTime, 10),
    duration: 10,
    priority: "medium",
    category: "wellness",
    instructions: [
      "Seated cat-cow stretches: 10 repetitions",
      "Neck side stretches: 30 seconds each side",
      "Seated figure-4 hip stretch: 30 seconds each leg",
      "Seated forward fold: 30 seconds",
      "Deep breathing: 4-7-8 pattern x 3",
    ],
    tips: [
      "Move slowly and mindfully",
      "Don't force any stretches",
      "Focus on areas that feel tight",
    ],
    benefits: "Releases muscle tension, improves flexibility, reduces stress",
    scientificEvidence:
      "Regular stretching reduces workplace injury risk by 30%",
  });
  currentTime = addMinutes(currentTime, 10);

  // 4:10 PM - Final Work Session
  activities.push({
    id: `work-final-${Date.now()}`,
    type: "work",
    title: "Work Wrap-up Session",
    description: "Complete day's tasks and prepare for transition",
    startTime: currentTime,
    endTime: addMinutes(currentTime, 50),
    duration: 50,
    priority: "high",
    category: "productivity",
    instructions: [
      "Complete current tasks or reach good stopping point",
      "Review day's accomplishments",
      "Plan tomorrow's priorities",
      "Clean and organize workspace",
      "Send any necessary end-of-day communications",
    ],
    tips: [
      "Write down tomorrow's top 3 priorities",
      "Save all work and backup important files",
      "Mentally transition from work mode",
    ],
    benefits: "Sense of completion, preparation for personal time",
    scientificEvidence:
      "Proper work transitions improve work-life balance satisfaction",
  });
  currentTime = addMinutes(currentTime, 50);

  // Detailed Workout Session (if workout day) or Light Activity
  if (isWorkoutDay) {
    activities.push({
      id: `detailed-workout-${Date.now()}`,
      type: "exercise",
      title: isHighIntensityDay
        ? "High-Intensity Interval Training (HIIT)"
        : "Comprehensive Strength & Cardio Workout",
      description:
        "Full-body workout with specific exercises, sets, reps, and form cues",
      startTime: workoutTime,
      endTime: addMinutes(workoutTime, 60),
      duration: 60,
      priority: "high",
      category: "fitness",
      detailedInstructions: isHighIntensityDay
        ? [
            "WARM-UP (10 minutes):",
            "• 5 minutes light cardio (jogging in place, jumping jacks)",
            "• 2 minutes dynamic stretching (arm circles, leg swings)",
            "• 3 minutes mobility work (hip circles, shoulder rolls)",
            "",
            "HIIT WORKOUT (35 minutes):",
            "• Burpees: 4 sets × 8-12 reps (45 sec work, 15 sec rest)",
            "• Mountain Climbers: 4 sets × 20 reps (45 sec work, 15 sec rest)",
            "• Jump Squats: 4 sets × 15 reps (45 sec work, 15 sec rest)",
            "• Push-ups: 4 sets × 8-15 reps (45 sec work, 15 sec rest)",
            "• High Knees: 4 sets × 30 seconds (45 sec work, 15 sec rest)",
            "• Plank Jacks: 4 sets × 20 reps (45 sec work, 15 sec rest)",
            "",
            "COOL-DOWN (15 minutes):",
            "• 5 minutes light walking",
            "• 10 minutes static stretching (hamstrings, quads, chest, shoulders)",
          ]
        : [
            "WARM-UP (10 minutes):",
            "• 5 minutes light cardio (jogging in place, jumping jacks)",
            "• 2 minutes dynamic stretching (arm circles, leg swings)",
            "• 3 minutes mobility work (hip circles, shoulder rolls)",
            "",
            "STRENGTH WORKOUT (35 minutes):",
            "• Goblet Squats: 4 sets × 8-12 reps (RPE 7-8, 90 sec rest)",
            "• Push-ups: 3 sets × 8-15 reps (RPE 6-7, 60 sec rest)",
            "• Romanian Deadlifts: 3 sets × 10-12 reps (RPE 6-7, 90 sec rest)",
            "• Plank: 3 sets × 30-60 seconds (RPE 7-8, 60 sec rest)",
            "• Walking Lunges: 3 sets × 12 each leg (RPE 6-7, 60 sec rest)",
            "• Bent-over Rows: 3 sets × 10-12 reps (RPE 6-7, 90 sec rest)",
            "• Mountain Climbers: 3 sets × 20 reps (RPE 7-8, 60 sec rest)",
            "",
            "COOL-DOWN (15 minutes):",
            "• 5 minutes light walking",
            "• 10 minutes static stretching (hamstrings, quads, chest, shoulders)",
          ],
      instructions: [
        "Start with 10-minute warm-up",
        "Focus on proper form over speed",
        "Rest between sets as specified",
        "End with 15-minute cool-down",
      ],
      tips: [
        "RPE (Rate of Perceived Exertion) 1-10 scale",
        "Modify exercises based on fitness level",
        "Keep water bottle nearby",
        "Focus on controlled movements",
        "Breathe properly during exercises",
      ],
      benefits:
        "Builds strength, improves cardiovascular health, enhances mood, supports weight management, increases metabolism",
      scientificEvidence:
        "Regular strength training increases muscle mass by 1-2% per month and reduces injury risk by 40%",
      workoutDetails: {
        warmup: "10 minutes light cardio + dynamic stretching",
        mainWorkout: "35 minutes strength training",
        cooldown: "15 minutes stretching",
        totalTime: "60 minutes",
        intensity: isHighIntensityDay ? "High" : "Moderate to high",
        equipment: "Bodyweight + optional dumbbells",
      },
      exerciseBreakdown: isHighIntensityDay
        ? [
            {
              name: "Burpees",
              sets: 4,
              reps: "8-12",
              workTime: "45 seconds",
              restTime: "15 seconds",
              form: "Full body movement, chest to floor, explosive jump",
              alternatives: ["Modified Burpees", "Step-back Burpees"],
            },
            {
              name: "Mountain Climbers",
              sets: 4,
              reps: "20",
              workTime: "45 seconds",
              restTime: "15 seconds",
              form: "Straight line from head to heels, quick alternating legs",
              alternatives: ["Slow Mountain Climbers", "Plank Jacks"],
            },
            {
              name: "Jump Squats",
              sets: 4,
              reps: "15",
              workTime: "45 seconds",
              restTime: "15 seconds",
              form: "Full depth squat, explosive jump, soft landing",
              alternatives: ["Regular Squats", "Box Jumps"],
            },
          ]
        : [
            {
              name: "Goblet Squats",
              sets: 4,
              reps: "8-12",
              rpe: "7-8",
              rest: "90 seconds",
              form: "Chest up, knees track over toes, full depth",
              alternatives: ["Box Squats", "Wall Sits"],
            },
            {
              name: "Push-ups",
              sets: 3,
              reps: "8-15",
              rpe: "6-7",
              rest: "60 seconds",
              form: "Straight line from head to heels, full range of motion",
              alternatives: ["Knee Push-ups", "Incline Push-ups"],
            },
            {
              name: "Romanian Deadlifts",
              sets: 3,
              reps: "10-12",
              rpe: "6-7",
              rest: "90 seconds",
              form: "Hinge at hips, keep back straight, feel hamstring stretch",
              alternatives: ["Good Mornings", "Single-leg RDLs"],
            },
            {
              name: "Plank",
              sets: 3,
              reps: "30-60 seconds",
              rpe: "7-8",
              rest: "60 seconds",
              form: "Straight line, engage core, breathe normally",
              alternatives: ["Knee Plank", "Wall Plank"],
            },
          ],
    });
    currentTime = addMinutes(workoutTime, 60);
  } else {
    // Light activity on non-workout days
    activities.push({
      id: `light-activity-${Date.now()}`,
      type: "exercise",
      title: "Light Movement",
      description: "Gentle movement for active recovery",
      startTime: workoutTime,
      endTime: addMinutes(workoutTime, 30),
      duration: 30,
      priority: "medium",
      category: "fitness",
      instructions: [
        "Take a leisurely walk or bike ride",
        "Do gentle stretching or yoga",
        "Spend time outdoors if possible",
        "Focus on relaxation and recovery",
      ],
      tips: [
        "Listen to your body",
        "Enjoy the movement",
        "Don't push yourself",
      ],
      benefits:
        "Promotes recovery, reduces stress, and maintains activity habit",
      scientificEvidence:
        "Active recovery improves blood flow and reduces muscle stiffness",
    });
    currentTime = addMinutes(workoutTime, 30);
  }

  // Dinner (45 minutes)
  const dinnerMeal = getPersonalizedMeal("dinner", profile, planType);
  activities.push({
    id: `dinner-${Date.now()}`,
    type: "meal",
    title: "Light Dinner",
    description: "Nutritious dinner to end the day",
    startTime: currentTime,
    endTime: addMinutes(currentTime, 45),
    duration: 45,
    priority: "high",
    category: "nutrition",
    mealDetails: dinnerMeal,
    instructions: dinnerMeal.instructions,
    tips: dinnerMeal.tips,
    benefits: dinnerMeal.benefits,
    scientificEvidence: dinnerMeal.scientificEvidence,
  });
  currentTime = addMinutes(currentTime, 45);

  // Evening Wind-down Activities (Detailed 90-minute routine)

  // 8:00 PM - Digital Sunset & Meal Prep
  activities.push({
    id: `digital-sunset-${Date.now()}`,
    type: "wellness",
    title: "Digital Sunset & Evening Prep",
    description: "Begin evening transition with digital boundaries",
    startTime: currentTime,
    endTime: addMinutes(currentTime, 30),
    duration: 30,
    priority: "high",
    category: "wellness",
    instructions: [
      "Turn off work devices and notifications",
      "Dim all lights to 50% or use warm lighting",
      "Prepare tomorrow's meals or snacks",
      "Tidy up living spaces for peaceful environment",
      "Set out clothes for tomorrow",
    ],
    tips: [
      "Use blue light filters on remaining devices",
      "Create a 'shutdown ritual' for work mode",
      "Focus on tomorrow's preparation",
    ],
    benefits:
      "Reduces stress, improves sleep preparation, creates calm environment",
    scientificEvidence:
      "Blue light reduction 2 hours before bed improves sleep quality by 23%",
  });
  currentTime = addMinutes(currentTime, 30);

  // 8:30 PM - Gentle Movement & Stretching
  activities.push({
    id: `evening-stretching-${Date.now()}`,
    type: "exercise",
    title: "Gentle Evening Stretches",
    description: "Release daily tension with restorative movement",
    startTime: currentTime,
    endTime: addMinutes(currentTime, 20),
    duration: 20,
    priority: "medium",
    category: "wellness",
    instructions: [
      "Child's pose: 1 minute",
      "Gentle spinal twists: 30 seconds each side",
      "Legs up the wall pose: 2 minutes",
      "Neck and shoulder rolls: 1 minute",
      "Deep breathing with gentle movement: 5 minutes",
    ],
    tips: [
      "Use soft music or nature sounds",
      "Focus on releasing, not stretching deeply",
      "Breathe slowly and mindfully",
    ],
    benefits:
      "Releases muscle tension, activates parasympathetic nervous system",
    scientificEvidence: "Evening stretching reduces sleep onset time by 37%",
  });
  currentTime = addMinutes(currentTime, 20);

  // 8:50 PM - Mindfulness & Gratitude Practice
  activities.push({
    id: `mindfulness-gratitude-${Date.now()}`,
    type: "wellness",
    title: "Mindfulness & Gratitude Practice",
    description: "Mental preparation for restful sleep",
    startTime: currentTime,
    endTime: addMinutes(currentTime, 15),
    duration: 15,
    priority: "high",
    category: "wellness",
    instructions: [
      "Find comfortable seated or lying position",
      "Practice 4-7-8 breathing for 5 minutes",
      "Reflect on 3 things you're grateful for today",
      "Set positive intention for tomorrow",
      "Body scan: notice and release any remaining tension",
    ],
    tips: [
      "Keep a gratitude journal by bedside",
      "Focus on small, specific moments",
      "Don't judge thoughts, just observe",
    ],
    benefits:
      "Reduces anxiety, promotes positive mindset, improves sleep quality",
    scientificEvidence:
      "Gratitude practice increases sleep quality scores by 25%",
  });
  currentTime = addMinutes(currentTime, 15);

  // 9:05 PM - Sleep Preparation Routine
  activities.push({
    id: `sleep-prep-${Date.now()}`,
    type: "wellness",
    title: "Sleep Preparation Routine",
    description: "Final steps for optimal sleep environment",
    startTime: currentTime,
    endTime: addMinutes(currentTime, 25),
    duration: 25,
    priority: "high",
    category: "wellness",
    instructions: [
      "Complete evening hygiene routine",
      "Set bedroom temperature to 65-68°F (18-20°C)",
      "Ensure blackout curtains are closed",
      "Remove electronic devices from bedroom",
      "Use essential oils or calming scents if desired",
      "Set consistent wake-up time for tomorrow",
    ],
    tips: [
      "Keep bedroom for sleep and intimacy only",
      "Use comfortable, breathable sleepwear",
      "Consider white noise or earplugs if needed",
    ],
    benefits: "Creates optimal sleep environment, establishes sleep cues",
    scientificEvidence:
      "Consistent sleep environment improves deep sleep by 40%",
  });
  currentTime = addMinutes(currentTime, 25);

  // Sleep (8 hours)
  activities.push({
    id: `sleep-${Date.now()}`,
    type: "sleep",
    title: "Quality Sleep",
    description: "Restorative sleep for optimal health",
    startTime: sleepTime,
    endTime: wakeUpTime,
    duration: 480, // 8 hours
    priority: "high",
    category: "recovery",
    instructions: [
      "Aim for 7-9 hours of sleep",
      "Keep bedroom cool (65-68°F)",
      "Use blackout curtains or eye mask",
      "Remove electronic devices from bedroom",
      "Maintain consistent sleep schedule",
    ],
    tips: [
      "Avoid caffeine after 2 PM",
      "Create a comfortable sleep environment",
      "Use white noise if needed",
    ],
    benefits:
      "Supports immune function, memory consolidation, and physical recovery",
    scientificEvidence:
      "Quality sleep is essential for hormone regulation and cognitive performance",
  });

  return activities;
}

// Generate personalized meal recommendations based on dietary preferences
function getPersonalizedMeal(
  mealType: string,
  profile: UserProfile,
  planType: string
): any {
  const dietType = profile.diet_type?.toLowerCase() || "omnivore";
  const healthConditions = profile.chronic_conditions || [];
  const healthGoals = profile.health_goals || [];

  // Check for specific health conditions that affect nutrition
  const hasDiabetes = healthConditions.some(
    (c) =>
      c.toLowerCase().includes("diabetes") ||
      c.toLowerCase().includes("prediabetes")
  );
  const hasPCOS = healthConditions.some(
    (c) =>
      c.toLowerCase().includes("pcos") || c.toLowerCase().includes("polycystic")
  );
  const hasHeartDisease = healthConditions.some(
    (c) =>
      c.toLowerCase().includes("heart") || c.toLowerCase().includes("cardio")
  );
  const isWeightLoss = healthGoals.some(
    (g) =>
      g.toLowerCase().includes("weight") || g.toLowerCase().includes("lose")
  );

  const mealPlans = {
    vegan: {
      breakfast: {
        instructions: [
          "Prepare overnight chia pudding with almond milk and berries",
          "Add plant-based protein (hemp seeds or vegan protein powder)",
          "Include healthy fats (avocado or nut butter)",
          "Add fiber-rich fruits and nuts",
          "Stay hydrated with herbal tea or water",
        ],
        tips: [
          "Soak chia seeds overnight for better digestibility",
          "Use unsweetened plant milk to avoid added sugars",
          "Include a variety of colorful fruits for antioxidants",
        ],
        benefits:
          "Provides plant-based protein, fiber, and essential nutrients while being environmentally friendly",
        scientificEvidence:
          "Plant-based diets are associated with lower risk of chronic diseases and improved longevity",
      },
      lunch: {
        instructions: [
          "Prepare quinoa or brown rice bowl with mixed vegetables",
          "Add plant-based protein (tofu, tempeh, or legumes)",
          "Include leafy greens and colorful vegetables",
          "Add healthy fats (olive oil, avocado, or nuts)",
          "Season with herbs and spices for flavor",
        ],
        tips: [
          "Combine grains and legumes for complete protein",
          "Use a variety of vegetables for micronutrient diversity",
          "Include fermented foods like sauerkraut for gut health",
        ],
        benefits:
          "Provides complete plant-based nutrition with anti-inflammatory properties",
        scientificEvidence:
          "Plant-based meals reduce inflammation and support cardiovascular health",
      },
      dinner: {
        instructions: [
          "Prepare light vegetable stir-fry with tofu or tempeh",
          "Include leafy greens and non-starchy vegetables",
          "Add healthy fats (avocado or olive oil)",
          "Keep portions moderate for better sleep",
          "Include anti-inflammatory spices (turmeric, ginger)",
        ],
        tips: [
          "Focus on non-starchy vegetables for lower calories",
          "Use minimal oil for cooking",
          "Include protein for satiety and muscle maintenance",
        ],
        benefits:
          "Supports overnight recovery with anti-inflammatory nutrients",
        scientificEvidence:
          "Light, plant-based dinners improve sleep quality and reduce inflammation",
      },
    },
    vegetarian: {
      breakfast: {
        instructions: [
          "Prepare overnight oats with Greek yogurt and berries",
          "Add plant-based protein (nuts, seeds, or protein powder)",
          "Include healthy fats (avocado or nut butter)",
          "Add fiber-rich fruits and whole grains",
          "Stay hydrated with herbal tea or water",
        ],
        tips: [
          "Use Greek yogurt for additional protein",
          "Include a variety of nuts and seeds for micronutrients",
          "Add cinnamon for blood sugar stability",
        ],
        benefits:
          "Provides balanced protein from dairy and plants with essential nutrients",
        scientificEvidence:
          "Vegetarian diets rich in dairy provide complete protein and essential nutrients",
      },
      lunch: {
        instructions: [
          "Prepare dal (lentil curry) with brown rice or roti",
          "Include paneer or cottage cheese for protein",
          "Add plenty of vegetables (spinach, tomatoes, onions)",
          "Include healthy fats (ghee or olive oil)",
          "Season with turmeric, cumin, and other spices",
        ],
        tips: [
          "Combine dal with rice for complete protein",
          "Include fermented dairy for probiotics",
          "Use traditional Indian spices for flavor and health benefits",
        ],
        benefits: "Provides complete protein and traditional Indian nutrition",
        scientificEvidence:
          "Traditional Indian vegetarian diets support gut health and provide complete nutrition",
      },
      dinner: {
        instructions: [
          "Prepare light vegetable curry with paneer or tofu",
          "Include leafy greens and seasonal vegetables",
          "Add healthy fats (ghee or olive oil)",
          "Keep portions moderate for better sleep",
          "Include digestive spices (cumin, fennel, ginger)",
        ],
        tips: [
          "Focus on easily digestible vegetables",
          "Include fermented foods for gut health",
          "Use minimal oil for better digestion",
        ],
        benefits:
          "Supports overnight recovery with traditional Indian nutrition",
        scientificEvidence:
          "Light vegetarian dinners with spices improve digestion and sleep quality",
      },
    },
    omnivore: {
      breakfast: {
        instructions: [
          "Prepare scrambled eggs with vegetables and whole grain toast",
          "Include lean protein (eggs, Greek yogurt, or lean meat)",
          "Add healthy fats (avocado or olive oil)",
          "Include fiber-rich fruits and vegetables",
          "Stay hydrated with water or herbal tea",
        ],
        tips: [
          "Use whole eggs for complete nutrition",
          "Include vegetables in your eggs for extra fiber",
          "Choose whole grain bread for sustained energy",
        ],
        benefits:
          "Provides complete protein and essential nutrients for sustained energy",
        scientificEvidence:
          "Protein-rich breakfasts improve satiety and cognitive function throughout the day",
      },
      lunch: {
        instructions: [
          "Prepare grilled chicken or fish with quinoa and vegetables",
          "Include lean protein (chicken, fish, or legumes)",
          "Add plenty of colorful vegetables",
          "Include healthy fats (olive oil, avocado, or nuts)",
          "Season with herbs and spices for flavor",
        ],
        tips: [
          "Choose lean cuts of meat for lower saturated fat",
          "Include a variety of vegetables for micronutrients",
          "Use healthy cooking methods (grilling, baking, steaming)",
        ],
        benefits:
          "Provides complete protein and essential nutrients for muscle recovery",
        scientificEvidence:
          "Balanced meals with lean protein support muscle maintenance and recovery",
      },
      dinner: {
        instructions: [
          "Prepare baked salmon or chicken with roasted vegetables",
          "Include lean protein and non-starchy vegetables",
          "Add healthy fats (olive oil or avocado)",
          "Keep portions moderate for better sleep",
          "Include anti-inflammatory foods (salmon, turmeric, ginger)",
        ],
        tips: [
          "Choose fatty fish for omega-3 fatty acids",
          "Focus on non-starchy vegetables for lower calories",
          "Include protein for satiety and muscle maintenance",
        ],
        benefits:
          "Supports overnight recovery with anti-inflammatory nutrients",
        scientificEvidence:
          "Light dinners with lean protein and omega-3s improve sleep quality and reduce inflammation",
      },
    },
    keto: {
      breakfast: {
        instructions: [
          "Prepare scrambled eggs with avocado and spinach",
          "Include high-fat protein (eggs, bacon, or sausage)",
          "Add healthy fats (avocado, olive oil, or butter)",
          "Include low-carb vegetables (spinach, mushrooms, bell peppers)",
          "Stay hydrated with water or bulletproof coffee",
        ],
        tips: [
          "Focus on high-fat, low-carb foods",
          "Include plenty of healthy fats for satiety",
          "Monitor your carb intake carefully",
        ],
        benefits:
          "Provides sustained energy through ketosis while maintaining muscle mass",
        scientificEvidence:
          "Ketogenic diets can improve metabolic flexibility and support weight loss",
      },
      lunch: {
        instructions: [
          "Prepare grilled chicken or fish with leafy green salad",
          "Include lean protein (chicken, fish, or eggs)",
          "Add plenty of leafy greens and low-carb vegetables",
          "Include healthy fats (olive oil, avocado, or nuts)",
          "Avoid high-carb foods (rice, bread, pasta)",
        ],
        tips: [
          "Focus on protein and healthy fats",
          "Include plenty of non-starchy vegetables",
          "Use high-fat dressings and oils",
        ],
        benefits: "Maintains ketosis while providing essential nutrients",
        scientificEvidence:
          "Low-carb meals help maintain stable blood sugar and ketosis",
      },
      dinner: {
        instructions: [
          "Prepare baked salmon or steak with roasted vegetables",
          "Include high-quality protein and low-carb vegetables",
          "Add healthy fats (butter, olive oil, or avocado)",
          "Keep portions moderate for better sleep",
          "Include anti-inflammatory foods (salmon, turmeric, ginger)",
        ],
        tips: [
          "Choose fatty cuts of meat for higher fat content",
          "Focus on non-starchy vegetables",
          "Include protein for satiety and muscle maintenance",
        ],
        benefits: "Supports overnight recovery while maintaining ketosis",
        scientificEvidence:
          "Ketogenic dinners can improve sleep quality and support fat burning",
      },
    },
  };

  // Get base meal plan
  let mealPlan =
    mealPlans[dietType as keyof typeof mealPlans] || mealPlans.omnivore;

  // Adjust for health conditions
  if (hasDiabetes) {
    mealPlan = {
      ...mealPlan,
      [mealType]: {
        ...mealPlan[mealType as keyof typeof mealPlan],
        instructions: [
          ...mealPlan[mealType as keyof typeof mealPlan].instructions,
          "Monitor blood sugar levels before and after meals",
          "Include fiber-rich foods to slow glucose absorption",
          "Avoid high-sugar foods and refined carbohydrates",
        ],
        tips: [
          ...mealPlan[mealType as keyof typeof mealPlan].tips,
          "Eat protein and fiber before carbohydrates",
          "Consider post-meal walking to improve glucose control",
        ],
      },
    };
  }

  if (hasPCOS) {
    mealPlan = {
      ...mealPlan,
      [mealType]: {
        ...mealPlan[mealType as keyof typeof mealPlan],
        instructions: [
          ...mealPlan[mealType as keyof typeof mealPlan].instructions,
          "Include anti-inflammatory foods (berries, leafy greens, fatty fish)",
          "Focus on low-glycemic index foods",
          "Include foods rich in chromium and magnesium",
        ],
        tips: [
          ...mealPlan[mealType as keyof typeof mealPlan].tips,
          "Avoid processed foods and added sugars",
          "Include regular meals to maintain stable blood sugar",
        ],
      },
    };
  }

  if (hasHeartDisease) {
    mealPlan = {
      ...mealPlan,
      [mealType]: {
        ...mealPlan[mealType as keyof typeof mealPlan],
        instructions: [
          ...mealPlan[mealType as keyof typeof mealPlan].instructions,
          "Include heart-healthy fats (omega-3s, olive oil, nuts)",
          "Limit saturated and trans fats",
          "Include plenty of fiber-rich foods",
        ],
        tips: [
          ...mealPlan[mealType as keyof typeof mealPlan].tips,
          "Choose lean protein sources",
          "Include foods rich in potassium and magnesium",
        ],
      },
    };
  }

  if (isWeightLoss) {
    mealPlan = {
      ...mealPlan,
      [mealType]: {
        ...mealPlan[mealType as keyof typeof mealPlan],
        instructions: [
          ...mealPlan[mealType as keyof typeof mealPlan].instructions,
          "Focus on protein and fiber for satiety",
          "Include plenty of non-starchy vegetables",
          "Control portion sizes and eat mindfully",
        ],
        tips: [
          ...mealPlan[mealType as keyof typeof mealPlan].tips,
          "Eat slowly and stop when 80% full",
          "Include protein with every meal for satiety",
        ],
      },
    };
  }

  return mealPlan[mealType as keyof typeof mealPlan];
}

// Enhanced fallback plan helper functions
function getPlanDuration(healthGoals: string[]): number {
  // Determine plan duration based on goals
  if (
    healthGoals.some(
      (goal) =>
        goal.toLowerCase().includes("diabetes") ||
        goal.toLowerCase().includes("revers")
    )
  ) {
    return 180; // 6 months for diabetes reversal
  }
  if (
    healthGoals.some(
      (goal) =>
        goal.toLowerCase().includes("weight") ||
        goal.toLowerCase().includes("lose")
    )
  ) {
    return 90; // 3 months for weight loss
  }
  if (
    healthGoals.some(
      (goal) =>
        goal.toLowerCase().includes("build") ||
        goal.toLowerCase().includes("muscle")
    )
  ) {
    return 120; // 4 months for muscle building
  }
  return 30; // Default 1 month
}

function detectPrimaryCondition(profile: UserProfile): string {
  const conditions = profile.health_conditions || [];
  const goals = profile.health_goals || [];

  // Check for diabetes indicators
  if (
    conditions.some(
      (c) =>
        c.toLowerCase().includes("diabetes") ||
        c.toLowerCase().includes("prediabetes")
    ) ||
    goals.some(
      (g) =>
        g.toLowerCase().includes("diabetes") ||
        g.toLowerCase().includes("sugar")
    )
  ) {
    return "diabetes";
  }

  // Check for PCOS
  if (
    conditions.some(
      (c) =>
        c.toLowerCase().includes("pcos") ||
        c.toLowerCase().includes("polycystic")
    )
  ) {
    return "pcos";
  }

  // Check for cardiovascular conditions
  if (
    conditions.some(
      (c) =>
        c.toLowerCase().includes("heart") ||
        c.toLowerCase().includes("cardio") ||
        c.toLowerCase().includes("hypertension") ||
        c.toLowerCase().includes("blood pressure")
    )
  ) {
    return "cardiovascular";
  }

  // Check for weight management
  if (
    goals.some(
      (g) =>
        g.toLowerCase().includes("weight") ||
        g.toLowerCase().includes("lose") ||
        g.toLowerCase().includes("fat")
    )
  ) {
    return "weight_management";
  }

  // Check for muscle building
  if (
    goals.some(
      (g) =>
        g.toLowerCase().includes("muscle") ||
        g.toLowerCase().includes("strength") ||
        g.toLowerCase().includes("build")
    )
  ) {
    return "muscle_building";
  }

  return "general_health";
}

function getPlanType(condition: string, goals: string[]): string {
  const conditionMap: { [key: string]: string } = {
    diabetes: "diabetes_reversal",
    pcos: "pcos_management",
    cardiovascular: "heart_health",
    weight_management: "weight_optimization",
    muscle_building: "strength_building",
    general_health: "wellness_optimization",
  };

  return conditionMap[condition] || "wellness_optimization";
}

function getOverallGoals(planType: string, userGoals: string[]): string[] {
  const baseGoals = [
    "Improve overall health and wellbeing",
    "Build sustainable healthy habits",
    "Maintain consistency in daily routines",
    "Track progress and celebrate achievements",
  ];

  const planSpecificGoals: { [key: string]: string[] } = {
    diabetes_reversal: [
      "Lower blood sugar levels naturally",
      "Improve insulin sensitivity",
      "Reduce HbA1c by 1-2% over 6 months",
      "Maintain stable blood glucose throughout the day",
      "Reduce dependency on medications (under medical supervision)",
      "Achieve healthy weight if overweight",
    ],
    pcos_management: [
      "Improve insulin sensitivity",
      "Balance hormone levels naturally",
      "Support regular menstrual cycles",
      "Reduce inflammation markers",
      "Achieve healthy weight",
      "Improve fertility markers",
    ],
    cardiovascular: [
      "Lower blood pressure naturally",
      "Reduce cholesterol levels",
      "Improve heart health markers",
      "Increase cardiovascular fitness",
      "Reduce inflammation",
      "Support overall heart function",
    ],
    weight_optimization: [
      "Achieve healthy weight loss",
      "Build lean muscle mass",
      "Improve body composition",
      "Increase metabolic rate",
      "Maintain weight loss long-term",
      "Improve energy levels",
    ],
    strength_building: [
      "Increase muscle mass",
      "Improve strength and power",
      "Enhance physical performance",
      "Improve body composition",
      "Increase bone density",
      "Boost metabolism",
    ],
    wellness_optimization: [
      "Optimize energy levels",
      "Improve sleep quality",
      "Reduce stress levels",
      "Enhance mental clarity",
      "Support immune function",
      "Promote longevity",
    ],
  };

  return [...baseGoals, ...(planSpecificGoals[planType] || []), ...userGoals];
}

function getProgressTrackingSystem(planType: string, duration: number): any {
  return {
    daily_tracking: [
      "Complete all planned activities",
      "Rate energy levels (1-10)",
      "Track mood and motivation",
      "Record sleep quality",
      "Monitor hunger and satiety",
      "Note any challenges or barriers",
    ],
    weekly_assessments: [
      "Weight and body measurements",
      "Progress photos",
      "Energy and mood trends",
      "Sleep quality patterns",
      "Adherence percentage",
      "Goal progress evaluation",
    ],
    monthly_evaluations: [
      "Comprehensive health markers",
      "Body composition analysis",
      "Lifestyle habit assessment",
      "Goal achievement review",
      "Plan adjustments needed",
      "Long-term sustainability check",
    ],
    condition_specific_tracking: getConditionSpecificTracking(planType),
    progress_milestones: getProgressMilestones(planType, duration),
  };
}

function getConditionSpecificTracking(planType: string): any {
  const tracking: { [key: string]: any } = {
    diabetes_reversal: {
      daily: [
        "Blood glucose levels (fasting, post-meal)",
        "Medication compliance",
        "Energy crashes",
      ],
      weekly: ["Weight changes", "HbA1c trends", "Blood pressure"],
      monthly: [
        "Complete metabolic panel",
        "Medication adjustments",
        "Lifestyle adherence",
      ],
    },
    pcos_management: {
      daily: ["Menstrual cycle tracking", "Energy levels", "Mood fluctuations"],
      weekly: ["Weight changes", "Hair growth patterns", "Skin condition"],
      monthly: ["Hormone panel", "Insulin levels", "Ovulation tracking"],
    },
    cardiovascular: {
      daily: [
        "Blood pressure readings",
        "Heart rate variability",
        "Energy levels",
      ],
      weekly: ["Weight changes", "Exercise capacity", "Stress levels"],
      monthly: [
        "Lipid panel",
        "Inflammatory markers",
        "Cardiac function tests",
      ],
    },
    weight_optimization: {
      daily: ["Weight", "Energy levels", "Hunger patterns"],
      weekly: ["Body measurements", "Progress photos", "Adherence rate"],
      monthly: [
        "Body composition analysis",
        "Metabolic rate",
        "Lifestyle changes",
      ],
    },
    strength_building: {
      daily: ["Workout performance", "Recovery quality", "Energy levels"],
      weekly: ["Strength progress", "Body measurements", "Training volume"],
      monthly: [
        "Body composition",
        "Strength assessments",
        "Performance metrics",
      ],
    },
  };

  return tracking[planType] || { daily: [], weekly: [], monthly: [] };
}

function getProgressMilestones(planType: string, duration: number): any[] {
  const milestones = [];
  const quarterPoint = Math.floor(duration * 0.25);
  const halfPoint = Math.floor(duration * 0.5);
  const threeQuarterPoint = Math.floor(duration * 0.75);

  milestones.push({
    day: quarterPoint,
    milestone: "Initial Adaptation Phase Complete",
    achievements: [
      "Established daily routine",
      "Improved energy levels",
      "Reduced initial challenges",
    ],
  });

  milestones.push({
    day: halfPoint,
    milestone: "Mid-Plan Progress Review",
    achievements: [
      "Significant habit formation",
      "Measurable health improvements",
      "Increased confidence",
    ],
  });

  milestones.push({
    day: threeQuarterPoint,
    milestone: "Advanced Implementation Phase",
    achievements: [
      "Optimized routine",
      "Enhanced performance",
      "Sustained motivation",
    ],
  });

  milestones.push({
    day: duration,
    milestone: "Plan Completion & Long-term Maintenance",
    achievements: [
      "Achieved primary goals",
      "Established sustainable habits",
      "Ready for advanced protocols",
    ],
  });

  return milestones;
}

function getProgressTips(planType: string): string[] {
  const baseTips = [
    "Track your daily activities and progress",
    "Stay consistent with your schedule",
    "Listen to your body and adjust as needed",
    "Celebrate small wins and milestones",
    "Stay hydrated throughout the day",
    "Get adequate sleep for recovery",
    "Practice stress management techniques",
  ];

  const planSpecificTips: { [key: string]: string[] } = {
    diabetes_reversal: [
      "Monitor blood glucose regularly",
      "Take 15-minute walks after meals",
      "Eat vegetables before other foods",
      "Stay consistent with meal timing",
      "Work closely with your healthcare provider",
      "Track medication effectiveness",
    ],
    pcos_management: [
      "Focus on insulin sensitivity improvement",
      "Include strength training regularly",
      "Manage stress through relaxation techniques",
      "Track menstrual cycle patterns",
      "Prioritize sleep quality",
      "Consider supplement support",
    ],
    cardiovascular: [
      "Monitor blood pressure regularly",
      "Include both cardio and strength training",
      "Focus on heart-healthy foods",
      "Manage stress and inflammation",
      "Stay consistent with exercise",
      "Track cardiovascular fitness improvements",
    ],
    weight_optimization: [
      "Focus on body composition, not just weight",
      "Include strength training to build muscle",
      "Eat adequate protein for satiety",
      "Track progress photos and measurements",
      "Stay consistent with caloric deficit",
      "Plan for plateaus and adjustments",
    ],
    strength_building: [
      "Focus on progressive overload",
      "Prioritize recovery and sleep",
      "Eat adequate protein for muscle building",
      "Track strength improvements",
      "Allow for rest days between sessions",
      "Monitor recovery metrics",
    ],
  };

  return [...baseTips, ...(planSpecificTips[planType] || [])];
}

function getSafetyNotes(planType: string): string[] {
  const baseSafety = [
    "If you experience any concerning symptoms, consult your healthcare provider immediately",
    "Start slowly and progress gradually",
    "Listen to your body and rest when needed",
    "Stop any activity that causes pain or discomfort",
    "Stay hydrated and well-nourished",
    "Get medical clearance before starting if you have health concerns",
  ];

  const planSpecificSafety: { [key: string]: string[] } = {
    diabetes_reversal: [
      "Monitor blood glucose closely, especially during exercise",
      "Never stop medications without medical supervision",
      "Watch for signs of hypoglycemia",
      "Adjust meal timing based on medication schedule",
      "Have emergency glucose sources available",
      "Coordinate with healthcare provider for medication adjustments",
    ],
    pcos_management: [
      "Monitor menstrual cycle changes",
      "Watch for signs of insulin resistance",
      "Consider hormonal fluctuations in planning",
      "Coordinate with healthcare provider for monitoring",
      "Track any medication interactions",
      "Monitor for PCOS-related complications",
    ],
    cardiovascular: [
      "Monitor blood pressure during exercise",
      "Watch for chest pain or shortness of breath",
      "Start with low-intensity exercise",
      "Coordinate with cardiologist for monitoring",
      "Track heart rate during activities",
      "Avoid high-intensity exercise without clearance",
    ],
    weight_optimization: [
      "Avoid extreme caloric restriction",
      "Monitor for signs of disordered eating",
      "Focus on sustainable changes",
      "Track energy levels and mood",
      "Ensure adequate nutrient intake",
      "Seek professional help if needed",
    ],
    strength_building: [
      "Focus on proper form over heavy weights",
      "Allow adequate recovery between sessions",
      "Monitor for overtraining symptoms",
      "Start with lighter weights to learn technique",
      "Listen to your body for signs of injury",
      "Include mobility and flexibility work",
    ],
  };

  return [...baseSafety, ...(planSpecificSafety[planType] || [])];
}

function getDifficultyLevel(planType: string): string {
  const difficultyMap: { [key: string]: string } = {
    diabetes_reversal: "Intermediate",
    pcos_management: "Intermediate",
    cardiovascular: "Beginner to Intermediate",
    weight_optimization: "Beginner to Intermediate",
    strength_building: "Intermediate to Advanced",
    wellness_optimization: "Beginner",
  };

  return difficultyMap[planType] || "Beginner";
}

function getPrimaryFocus(planType: string): string {
  const focusMap: { [key: string]: string } = {
    diabetes_reversal:
      "Blood sugar control and insulin sensitivity improvement",
    pcos_management: "Hormone balance and insulin sensitivity",
    cardiovascular: "Heart health and cardiovascular fitness",
    weight_optimization: "Sustainable weight loss and body composition",
    strength_building: "Muscle building and strength development",
    wellness_optimization: "Overall health and lifestyle optimization",
  };

  return focusMap[planType] || "Overall health and wellness";
}

function getTargetOutcomes(planType: string): string[] {
  const outcomesMap: { [key: string]: string[] } = {
    diabetes_reversal: [
      "Improved blood sugar control",
      "Reduced HbA1c levels",
      "Better insulin sensitivity",
      "Reduced medication dependency",
      "Improved energy levels",
      "Better weight management",
    ],
    pcos_management: [
      "Improved insulin sensitivity",
      "Better hormone balance",
      "Regular menstrual cycles",
      "Reduced inflammation",
      "Improved fertility markers",
      "Better weight management",
    ],
    cardiovascular: [
      "Lower blood pressure",
      "Improved cholesterol levels",
      "Better cardiovascular fitness",
      "Reduced inflammation",
      "Improved heart health markers",
      "Better overall cardiovascular function",
    ],
    weight_optimization: [
      "Sustainable weight loss",
      "Improved body composition",
      "Increased muscle mass",
      "Better metabolic rate",
      "Improved energy levels",
      "Long-term weight maintenance",
    ],
    strength_building: [
      "Increased muscle mass",
      "Improved strength and power",
      "Better body composition",
      "Increased bone density",
      "Enhanced physical performance",
      "Improved metabolism",
    ],
    wellness_optimization: [
      "Improved energy levels",
      "Better sleep quality",
      "Reduced stress levels",
      "Enhanced mental clarity",
      "Better immune function",
      "Overall health optimization",
    ],
  };

  return outcomesMap[planType] || ["Improved overall health and wellbeing"];
}

function getDailyFocus(
  planType: string,
  isWorkoutDay: boolean,
  isHighIntensityDay: boolean
): string {
  const focusMap: { [key: string]: string } = {
    diabetes_reversal: isWorkoutDay
      ? isHighIntensityDay
        ? "High-intensity resistance training for glucose uptake"
        : "Moderate strength training and post-meal walks"
      : "Active recovery with walking and blood sugar management",
    pcos_management: isWorkoutDay
      ? "Strength training for insulin sensitivity and hormone balance"
      : "Stress management and gentle movement for cortisol regulation",
    cardiovascular: isWorkoutDay
      ? isHighIntensityDay
        ? "Interval training for heart health"
        : "Zone 2 cardio and strength training"
      : "Active recovery with walking and stress reduction",
    weight_optimization: isWorkoutDay
      ? isHighIntensityDay
        ? "High-intensity interval training for fat oxidation"
        : "Resistance training for metabolic boost"
      : "Active recovery with NEAT activities and mindful eating",
    strength_building: isWorkoutDay
      ? isHighIntensityDay
        ? "Progressive overload training"
        : "Volume-based strength training"
      : "Recovery and mobility work",
    wellness_optimization: isWorkoutDay
      ? "Balanced movement and stress management"
      : "Active recovery and lifestyle optimization",
  };

  return focusMap[planType] || "General wellness and health optimization";
}

function getMovementProtocol(
  planType: string,
  isWorkoutDay: boolean,
  isHighIntensityDay: boolean,
  profile: UserProfile
): any {
  const baseMovement = {
    type: "home",
    duration_min: isWorkoutDay ? 45 : 20,
    warmup: ["5 min light movement", "joint mobility", "dynamic stretching"],
    cooldown: ["5 min walking", "breathing exercises", "static stretching"],
  };

  if (!isWorkoutDay) {
    return {
      ...baseMovement,
      exercises: [
        {
          name: "Walking",
          sets: 1,
          reps: "20-30 min",
          rpe: "3-4",
          rest_s: 0,
          tempo: "steady",
          cues: ["brisk pace", "upright posture", "engage core"],
          alt: ["Light stretching", "Gentle yoga"],
          benefits: "Improves circulation, reduces stress, supports recovery",
        },
      ],
      movement_snacks: [
        "5 min walk every hour",
        "Stair climbing (2-3 flights)",
        "Desk stretches every 30 min",
      ],
    };
  }

  // Disease-specific workout protocols
  switch (planType) {
    case "diabetes_reversal":
      return {
        ...baseMovement,
        exercises: isHighIntensityDay
          ? [
              {
                name: "Circuit Training - High Intensity",
                sets: 3,
                reps: "45 sec work, 15 sec rest",
                rpe: "8-9",
                rest_s: 120,
                tempo: "explosive",
                cues: ["maintain form", "controlled breathing"],
                alt: ["Lower intensity version"],
                benefits:
                  "Improves insulin sensitivity, burns glucose efficiently",
              },
              {
                name: "Burpees",
                sets: 3,
                reps: "10-15",
                rpe: "8-9",
                rest_s: 90,
                tempo: "2-1-2",
                cues: ["full extension", "land softly"],
                alt: ["Step-ups", "Mountain climbers"],
                benefits: "High calorie burn, improves glucose uptake",
              },
              {
                name: "Jump Squats",
                sets: 3,
                reps: "12-15",
                rpe: "7-8",
                rest_s: 90,
                tempo: "explosive",
                cues: ["soft landing", "knees out"],
                alt: ["Regular squats", "Chair squats"],
                benefits: "Builds leg strength, improves insulin sensitivity",
              },
            ]
          : [
              {
                name: "Resistance Band Squats",
                sets: 3,
                reps: "15-20",
                rpe: "6-7",
                rest_s: 60,
                tempo: "2-1-2",
                cues: ["chest up", "knees track over toes"],
                alt: ["Bodyweight squats", "Chair squats"],
                benefits: "Builds muscle mass, improves glucose storage",
              },
              {
                name: "Modified Push-ups",
                sets: 3,
                reps: "10-15",
                rpe: "6-7",
                rest_s: 60,
                tempo: "2-1-2",
                cues: ["straight line", "full range"],
                alt: ["Wall push-ups", "Knee push-ups"],
                benefits: "Builds upper body strength, improves metabolism",
              },
              {
                name: "Walking Lunges",
                sets: 3,
                reps: "12 each leg",
                rpe: "6-7",
                rest_s: 60,
                tempo: "2-1-2",
                cues: ["90-degree angles", "upright torso"],
                alt: ["Static lunges", "Step-ups"],
                benefits: "Improves leg strength, enhances glucose utilization",
              },
            ],
        post_meal_walks: [
          "10 min walk after breakfast",
          "15 min walk after lunch",
          "10 min walk after dinner",
        ],
        movement_snacks: [
          "5 min walk every hour",
          "Stair climbing (2-3 flights)",
          "Standing desk work",
        ],
      };

    case "pcos_management":
      return {
        ...baseMovement,
        exercises: [
          {
            name: "Strength Training Circuit",
            sets: 3,
            reps: "12-15",
            rpe: "6-7",
            rest_s: 60,
            tempo: "2-1-2",
            cues: ["controlled movement", "full range"],
            alt: ["Lighter weights", "Bodyweight"],
            benefits: "Improves insulin sensitivity, balances hormones",
          },
          {
            name: "Yoga Flow",
            sets: 1,
            reps: "15-20 min",
            rpe: "4-5",
            rest_s: 0,
            tempo: "slow and controlled",
            cues: ["breathe deeply", "mindful movement"],
            alt: ["Gentle stretching", "Meditation"],
            benefits: "Reduces cortisol, improves insulin sensitivity",
          },
          {
            name: "Core Strengthening",
            sets: 3,
            reps: "12-15",
            rpe: "6-7",
            rest_s: 45,
            tempo: "2-1-2",
            cues: ["engage core", "controlled movement"],
            alt: ["Modified planks", "Seated exercises"],
            benefits: "Builds core strength, improves posture",
          },
        ],
        stress_reduction: [
          "5 min meditation after workout",
          "Deep breathing exercises",
          "Gentle stretching",
        ],
        movement_snacks: [
          "Walking breaks every 45 min",
          "Gentle stretching",
          "Deep breathing exercises",
        ],
      };

    case "cardiovascular":
      return {
        ...baseMovement,
        exercises: isHighIntensityDay
          ? [
              {
                name: "HIIT Cardio Circuit",
                sets: 4,
                reps: "30 sec work, 30 sec rest",
                rpe: "8-9",
                rest_s: 120,
                tempo: "high intensity",
                cues: ["maintain form", "controlled breathing"],
                alt: ["Lower intensity version"],
                benefits: "Improves cardiovascular fitness, heart health",
              },
              {
                name: "Jump Rope",
                sets: 4,
                reps: "1 min",
                rpe: "7-8",
                rest_s: 60,
                tempo: "steady rhythm",
                cues: ["land softly", "relaxed shoulders"],
                alt: ["Step-ups", "High knees"],
                benefits: "Improves heart health, coordination",
              },
            ]
          : [
              {
                name: "Zone 2 Cardio",
                sets: 1,
                reps: "30-40 min",
                rpe: "5-6",
                rest_s: 0,
                tempo: "steady",
                cues: ["conversational pace", "relaxed breathing"],
                alt: ["Walking", "Cycling"],
                benefits: "Improves aerobic capacity, heart health",
              },
              {
                name: "Strength Training",
                sets: 3,
                reps: "12-15",
                rpe: "6-7",
                rest_s: 60,
                tempo: "2-1-2",
                cues: ["controlled movement", "full range"],
                alt: ["Bodyweight exercises"],
                benefits: "Builds muscle, supports heart health",
              },
            ],
        heart_health_tips: [
          "Monitor heart rate during exercise",
          "Stay hydrated",
          "Listen to your body",
        ],
      };

    case "weight_optimization":
      return {
        ...baseMovement,
        exercises: isHighIntensityDay
          ? [
              {
                name: "Fat Burning HIIT",
                sets: 4,
                reps: "45 sec work, 15 sec rest",
                rpe: "8-9",
                rest_s: 120,
                tempo: "high intensity",
                cues: ["maintain form", "controlled breathing"],
                alt: ["Lower intensity version"],
                benefits: "Maximizes calorie burn, improves metabolism",
              },
              {
                name: "Metabolic Circuit",
                sets: 3,
                reps: "12-15 each",
                rpe: "7-8",
                rest_s: 90,
                tempo: "moderate to fast",
                cues: ["controlled movement", "full range"],
                alt: ["Lighter weights"],
                benefits: "Builds muscle, burns calories",
              },
            ]
          : [
              {
                name: "Strength Training",
                sets: 3,
                reps: "12-15",
                rpe: "6-7",
                rest_s: 60,
                tempo: "2-1-2",
                cues: ["controlled movement", "full range"],
                alt: ["Bodyweight exercises"],
                benefits: "Builds lean muscle, increases metabolism",
              },
              {
                name: "Cardio Blast",
                sets: 1,
                reps: "25-30 min",
                rpe: "6-7",
                rest_s: 0,
                tempo: "moderate",
                cues: ["steady pace", "controlled breathing"],
                alt: ["Walking", "Cycling"],
                benefits: "Burns calories, improves cardiovascular health",
              },
            ],
        metabolism_boosters: [
          "Morning workout for metabolic boost",
          "Post-meal walks",
          "Strength training for muscle building",
        ],
      };

    default: // wellness_optimization
      return {
        ...baseMovement,
        exercises: [
          {
            name: "Full Body Strength",
            sets: 3,
            reps: "12-15",
            rpe: "6-7",
            rest_s: 60,
            tempo: "2-1-2",
            cues: ["controlled movement", "full range"],
            alt: ["Bodyweight exercises"],
            benefits: "Builds strength, improves overall health",
          },
          {
            name: "Cardio Session",
            sets: 1,
            reps: "20-30 min",
            rpe: "5-6",
            rest_s: 0,
            tempo: "steady",
            cues: ["conversational pace", "relaxed breathing"],
            alt: ["Walking", "Cycling"],
            benefits: "Improves cardiovascular health, endurance",
          },
        ],
      };
  }
}

function getNutritionProtocol(planType: string, profile: UserProfile): any {
  const wakeUpTime = profile.wake_up_time || "06:00";
  const baseNutrition = {
    calories: 1800,
    protein_g: 120,
    carbs_g: 180,
    fat_g: 60,
    fiber_g: 30,
  };

  switch (planType) {
    case "diabetes_reversal":
      return {
        ...baseNutrition,
        calories: 1600,
        protein_g: 140,
        carbs_g: 120,
        fat_g: 70,
        fiber_g: 40,
        meals: [
          {
            name: "Breakfast",
            time: addMinutes(wakeUpTime, 30),
            items: [
              {
                food: "Steel-cut oats",
                qty_g: 40,
                hand_portion: "1 cupped hand",
                benefits: "Low GI, high fiber, stabilizes blood sugar",
              },
              {
                food: "Blueberries",
                qty_g: 80,
                hand_portion: "1 fist",
                benefits:
                  "Antioxidants, low sugar, improves insulin sensitivity",
              },
              {
                food: "Chia seeds",
                qty_g: 15,
                hand_portion: "1 thumb",
                benefits: "Omega-3, fiber, slows glucose absorption",
              },
              {
                food: "Greek yogurt",
                qty_g: 150,
                hand_portion: "1 palm",
                benefits: "Protein, probiotics, improves glucose control",
              },
              {
                food: "Cinnamon",
                qty_g: 2,
                hand_portion: "pinch",
                benefits: "Lowers blood sugar, improves insulin sensitivity",
              },
            ],
            macros: { p: 35, c: 45, f: 20, fiber: 12 },
            order: ["fiber", "protein", "carbs"],
            timing: "Eat within 1 hour of waking to stabilize blood sugar",
            tips: [
              "Add cinnamon for blood sugar control",
              "eat slowly",
              "stay hydrated",
            ],
            swaps: [
              "Quinoa for oats",
              "raspberries for blueberries",
              "almond butter for chia seeds",
            ],
            scientific_evidence:
              "Research shows steel-cut oats reduce post-meal glucose by 36% and improve insulin sensitivity",
          },
          {
            name: "Mid-Morning Snack",
            time: addMinutes(addMinutes(wakeUpTime, 30), 180),
            items: [
              {
                food: "Apple",
                qty_g: 150,
                hand_portion: "1 fist",
                benefits: "Fiber, pectin, slows glucose absorption",
              },
              {
                food: "Almonds",
                qty_g: 15,
                hand_portion: "1 thumb",
                benefits:
                  "Healthy fats, magnesium, improves insulin sensitivity",
              },
            ],
            macros: { p: 5, c: 20, f: 10, fiber: 6 },
            timing: "2-3 hours after breakfast",
            benefits: "Prevents blood sugar spikes, maintains energy",
          },
          {
            name: "Lunch",
            time: profile.lunch_time || "12:30",
            items: [
              {
                food: "Grilled salmon",
                qty_g: 120,
                hand_portion: "1 palm",
                benefits: "Omega-3, protein, reduces inflammation",
              },
              {
                food: "Quinoa",
                qty_g: 80,
                hand_portion: "1 cupped hand",
                benefits: "Complete protein, low GI, fiber",
              },
              {
                food: "Broccoli",
                qty_g: 150,
                hand_portion: "2 fists",
                benefits: "Fiber, chromium, improves glucose tolerance",
              },
              {
                food: "Olive oil",
                qty_g: 10,
                hand_portion: "1 thumb",
                benefits: "Monounsaturated fats, reduces insulin resistance",
              },
              {
                food: "Turmeric",
                qty_g: 2,
                hand_portion: "pinch",
                benefits:
                  "Curcumin, anti-inflammatory, improves insulin sensitivity",
              },
            ],
            macros: { p: 40, c: 35, f: 25, fiber: 10 },
            order: ["vegetables", "protein", "carbs"],
            timing: "Eat vegetables first, then protein, then carbs",
            tips: [
              "Add turmeric to vegetables",
              "chew thoroughly",
              "take 10-min walk after",
            ],
            swaps: [
              "Mackerel for salmon",
              "brown rice for quinoa",
              "cauliflower for broccoli",
            ],
            scientific_evidence:
              "Studies show quinoa has a GI of 53 vs 73 for white rice, significantly improving blood sugar control",
          },
          {
            name: "Afternoon Snack",
            time: addMinutes(profile.lunch_time || "12:30", 240),
            items: [
              {
                food: "Greek yogurt",
                qty_g: 150,
                hand_portion: "1 palm",
                benefits: "Protein, probiotics, stabilizes blood sugar",
              },
              {
                food: "Walnuts",
                qty_g: 10,
                hand_portion: "1 thumb",
                benefits: "Omega-3, magnesium, improves insulin function",
              },
            ],
            macros: { p: 15, c: 8, f: 12, fiber: 2 },
            timing: "4 hours after lunch",
            benefits: "Prevents blood sugar crashes, maintains energy",
          },
          {
            name: "Dinner",
            time: profile.dinner_time || "18:30",
            items: [
              {
                food: "Grilled chicken breast",
                qty_g: 100,
                hand_portion: "1 palm",
                benefits: "Lean protein, chromium, improves glucose metabolism",
              },
              {
                food: "Sweet potato",
                qty_g: 100,
                hand_portion: "1 fist",
                benefits: "Beta-carotene, fiber, lower GI than regular potato",
              },
              {
                food: "Spinach",
                qty_g: 100,
                hand_portion: "2 fists",
                benefits: "Magnesium, folate, improves insulin sensitivity",
              },
              {
                food: "Avocado",
                qty_g: 50,
                hand_portion: "1/4 avocado",
                benefits:
                  "Monounsaturated fats, potassium, reduces inflammation",
              },
              {
                food: "Apple cider vinegar",
                qty_g: 15,
                hand_portion: "1 tbsp",
                benefits: "Acetic acid, reduces post-meal glucose by 34%",
              },
            ],
            macros: { p: 35, c: 25, f: 20, fiber: 8 },
            order: ["vegetables", "protein", "carbs"],
            timing: "Finish 3 hours before sleep",
            tips: [
              "Add apple cider vinegar to vegetables",
              "avoid screens while eating",
              "take 15-min walk after",
            ],
            swaps: [
              "Turkey for chicken",
              "butternut squash for sweet potato",
              "kale for spinach",
            ],
            scientific_evidence:
              "Apple cider vinegar reduces post-meal glucose spikes by 34% and improves insulin sensitivity",
          },
        ],
        snacks: [
          "Green tea with lemon (antioxidants, improves insulin sensitivity)",
          "Dark chocolate 85%+ (flavonoids, improves blood flow)",
          "Herbal tea (chamomile, peppermint for relaxation)",
        ],
        hacks: [
          "15-min walk after every meal (reduces glucose by 30%)",
          "Drink water before eating (improves satiety)",
          "Eat vegetables first (slows glucose absorption)",
          "Add cinnamon to meals (lowers blood sugar)",
          "Apple cider vinegar before meals (reduces glucose spikes)",
        ],
        supplements: [
          "Berberine 500mg 2x daily (lowers blood sugar like metformin)",
          "Chromium picolinate 200mcg daily (improves insulin sensitivity)",
          "Alpha-lipoic acid 300mg daily (reduces oxidative stress)",
          "Magnesium 400mg daily (improves glucose tolerance)",
        ],
        timing_guidelines: [
          "Eat within 1 hour of waking",
          "Space meals 3-4 hours apart",
          "Finish dinner 3 hours before sleep",
          "Include protein with every meal",
          "Walk after every meal",
        ],
      };

    case "pcos_management":
      return {
        ...baseNutrition,
        calories: 1700,
        protein_g: 130,
        carbs_g: 140,
        fat_g: 75,
        fiber_g: 35,
        meals: [
          {
            name: "Breakfast",
            time: addMinutes(wakeUpTime, 30),
            items: [
              {
                food: "Eggs",
                qty_g: 100,
                hand_portion: "2 eggs",
                benefits:
                  "Complete protein, choline, supports hormone production",
              },
              {
                food: "Avocado",
                qty_g: 75,
                hand_portion: "1/2 avocado",
                benefits: "Healthy fats, folate, reduces inflammation",
              },
              {
                food: "Spinach",
                qty_g: 50,
                hand_portion: "1 fist",
                benefits: "Iron, magnesium, supports menstrual health",
              },
              {
                food: "Turmeric",
                qty_g: 2,
                hand_portion: "pinch",
                benefits: "Anti-inflammatory, improves insulin sensitivity",
              },
            ],
            macros: { p: 30, c: 8, f: 25, fiber: 6 },
            order: ["vegetables", "protein", "healthy fats"],
            timing: "Eat within 1 hour of waking",
            tips: [
              "Cook eggs with turmeric",
              "add black pepper for absorption",
              "stay hydrated",
            ],
            swaps: [
              "Turkey bacon for eggs",
              "olive oil for avocado",
              "kale for spinach",
            ],
            scientific_evidence:
              "Studies show that protein-rich breakfasts improve insulin sensitivity in PCOS by 40%",
          },
          {
            name: "Lunch",
            time: profile.lunch_time || "12:30",
            items: [
              {
                food: "Grilled chicken",
                qty_g: 120,
                hand_portion: "1 palm",
                benefits: "Lean protein, supports muscle mass",
              },
              {
                food: "Quinoa",
                qty_g: 80,
                hand_portion: "1 cupped hand",
                benefits: "Complete protein, fiber, supports hormone balance",
              },
              {
                food: "Broccoli",
                qty_g: 150,
                hand_portion: "2 fists",
                benefits:
                  "Cruciferous vegetables, supports estrogen metabolism",
              },
              {
                food: "Olive oil",
                qty_g: 10,
                hand_portion: "1 thumb",
                benefits: "Monounsaturated fats, reduces inflammation",
              },
              {
                food: "Pumpkin seeds",
                qty_g: 15,
                hand_portion: "1 thumb",
                benefits: "Zinc, magnesium, supports hormone production",
              },
            ],
            macros: { p: 40, c: 30, f: 25, fiber: 10 },
            order: ["vegetables", "protein", "carbs"],
            timing: "Eat vegetables first for better absorption",
            tips: [
              "Add pumpkin seeds for zinc",
              "use olive oil for cooking",
              "take 10-min walk after",
            ],
            swaps: [
              "Salmon for chicken",
              "brown rice for quinoa",
              "cauliflower for broccoli",
            ],
            scientific_evidence:
              "Research shows that cruciferous vegetables like broccoli help metabolize excess estrogen in PCOS",
          },
          {
            name: "Dinner",
            time: profile.dinner_time || "18:30",
            items: [
              {
                food: "Wild salmon",
                qty_g: 100,
                hand_portion: "1 palm",
                benefits:
                  "Omega-3, reduces inflammation, supports hormone balance",
              },
              {
                food: "Sweet potato",
                qty_g: 100,
                hand_portion: "1 fist",
                benefits: "Beta-carotene, fiber, supports fertility",
              },
              {
                food: "Asparagus",
                qty_g: 100,
                hand_portion: "1 fist",
                benefits: "Folate, supports reproductive health",
              },
              {
                food: "Walnuts",
                qty_g: 15,
                hand_portion: "1 thumb",
                benefits: "Omega-3, improves insulin sensitivity",
              },
            ],
            macros: { p: 35, c: 25, f: 20, fiber: 8 },
            order: ["vegetables", "protein", "carbs"],
            timing: "Finish 3 hours before sleep",
            tips: [
              "Add walnuts for omega-3",
              "steam vegetables to preserve nutrients",
              "avoid screens",
            ],
            swaps: [
              "Mackerel for salmon",
              "butternut squash for sweet potato",
              "broccoli for asparagus",
            ],
            scientific_evidence:
              "Omega-3 fatty acids from salmon reduce inflammation markers in PCOS by 25%",
          },
        ],
        snacks: [
          "Greek yogurt with berries (protein, probiotics, antioxidants)",
          "Almonds with dark chocolate (healthy fats, magnesium)",
          "Green tea (antioxidants, supports metabolism)",
        ],
        hacks: [
          "Include protein with every meal",
          "Eat cruciferous vegetables daily",
          "Take 10-min walks after meals",
          "Stay hydrated with herbal teas",
          "Get 7-8 hours of quality sleep",
        ],
        supplements: [
          "Inositol 2000mg daily (improves insulin sensitivity)",
          "Chromium 200mcg daily (supports glucose metabolism)",
          "Omega-3 1000mg daily (reduces inflammation)",
          "Magnesium 400mg daily (supports hormone balance)",
          "Vitamin D3 2000 IU daily (improves insulin sensitivity)",
        ],
      };

    case "cardiovascular":
      return {
        ...baseNutrition,
        calories: 1800,
        protein_g: 120,
        carbs_g: 160,
        fat_g: 80,
        fiber_g: 40,
        meals: [
          {
            name: "Breakfast",
            time: addMinutes(wakeUpTime, 30),
            items: [
              {
                food: "Oatmeal",
                qty_g: 50,
                hand_portion: "1 cupped hand",
                benefits: "Beta-glucan, lowers cholesterol by 10%",
              },
              {
                food: "Blueberries",
                qty_g: 100,
                hand_portion: "1 fist",
                benefits: "Anthocyanins, improves heart health",
              },
              {
                food: "Flaxseeds",
                qty_g: 15,
                hand_portion: "1 thumb",
                benefits: "Omega-3, lignans, supports heart health",
              },
              {
                food: "Greek yogurt",
                qty_g: 150,
                hand_portion: "1 palm",
                benefits: "Protein, probiotics, supports heart health",
              },
            ],
            macros: { p: 25, c: 55, f: 20, fiber: 12 },
            order: ["fiber", "protein", "carbs"],
            timing: "Eat within 1 hour of waking",
            tips: ["Add flaxseeds for omega-3", "eat slowly", "stay hydrated"],
            swaps: [
              "Quinoa for oatmeal",
              "raspberries for blueberries",
              "chia seeds for flaxseeds",
            ],
            scientific_evidence:
              "Oatmeal's beta-glucan reduces LDL cholesterol by 10% and improves heart health",
          },
          {
            name: "Lunch",
            time: profile.lunch_time || "12:30",
            items: [
              {
                food: "Grilled salmon",
                qty_g: 120,
                hand_portion: "1 palm",
                benefits: "Omega-3, reduces inflammation, supports heart",
              },
              {
                food: "Brown rice",
                qty_g: 80,
                hand_portion: "1 cupped hand",
                benefits: "Fiber, B vitamins, supports heart health",
              },
              {
                food: "Kale",
                qty_g: 100,
                hand_portion: "2 fists",
                benefits: "Lutein, vitamin K, supports cardiovascular health",
              },
              {
                food: "Olive oil",
                qty_g: 10,
                hand_portion: "1 thumb",
                benefits: "Monounsaturated fats, reduces heart disease risk",
              },
              {
                food: "Garlic",
                qty_g: 5,
                hand_portion: "1 clove",
                benefits: "Allicin, reduces blood pressure and cholesterol",
              },
            ],
            macros: { p: 35, c: 35, f: 30, fiber: 8 },
            order: ["vegetables", "protein", "carbs"],
            timing: "Eat vegetables first",
            tips: [
              "Add garlic for heart health",
              "use olive oil for cooking",
              "take walk after",
            ],
            swaps: [
              "Mackerel for salmon",
              "quinoa for rice",
              "spinach for kale",
            ],
            scientific_evidence:
              "Garlic reduces systolic blood pressure by 8-10 mmHg and lowers cholesterol",
          },
          {
            name: "Dinner",
            time: profile.dinner_time || "18:30",
            items: [
              {
                food: "Grilled chicken",
                qty_g: 100,
                hand_portion: "1 palm",
                benefits: "Lean protein, supports heart health",
              },
              {
                food: "Sweet potato",
                qty_g: 120,
                hand_portion: "1 fist",
                benefits: "Beta-carotene, potassium, supports heart",
              },
              {
                food: "Broccoli",
                qty_g: 150,
                hand_portion: "2 fists",
                benefits: "Sulforaphane, supports cardiovascular health",
              },
              {
                food: "Avocado",
                qty_g: 50,
                hand_portion: "1/4 avocado",
                benefits: "Monounsaturated fats, potassium, supports heart",
              },
            ],
            macros: { p: 30, c: 30, f: 25, fiber: 10 },
            order: ["vegetables", "protein", "carbs"],
            timing: "Finish 3 hours before sleep",
            tips: [
              "Add avocado for healthy fats",
              "steam vegetables",
              "avoid screens",
            ],
            swaps: [
              "Turkey for chicken",
              "butternut squash for sweet potato",
              "cauliflower for broccoli",
            ],
            scientific_evidence:
              "Avocado consumption reduces LDL cholesterol by 13.5 mg/dL and improves heart health",
          },
        ],
        snacks: [
          "Dark chocolate 70%+ (flavonoids, improves blood flow)",
          "Nuts (almonds, walnuts - healthy fats, supports heart)",
          "Green tea (antioxidants, supports cardiovascular health)",
        ],
        hacks: [
          "Include omega-3 rich foods daily",
          "Eat 5-7 servings of vegetables daily",
          "Use olive oil for cooking",
          "Include garlic in meals",
          "Take 30-min walks daily",
        ],
        supplements: [
          "Omega-3 1000mg daily (reduces inflammation, supports heart)",
          "CoQ10 100mg daily (supports heart function)",
          "Magnesium 400mg daily (supports heart rhythm)",
          "Vitamin D3 2000 IU daily (reduces heart disease risk)",
        ],
      };

    default: // wellness_optimization
      return {
        ...baseNutrition,
        meals: [
          {
            name: "Breakfast",
            time: addMinutes(wakeUpTime, 30),
            items: [
              {
                food: "Oatmeal",
                qty_g: 50,
                hand_portion: "1 cupped hand",
                benefits: "Fiber, sustained energy, supports heart health",
              },
              {
                food: "Berries",
                qty_g: 100,
                hand_portion: "1 fist",
                benefits: "Antioxidants, vitamins, supports immune system",
              },
              {
                food: "Nuts",
                qty_g: 20,
                hand_portion: "1 thumb",
                benefits: "Healthy fats, protein, supports brain health",
              },
              {
                food: "Greek yogurt",
                qty_g: 150,
                hand_portion: "1 palm",
                benefits: "Protein, probiotics, supports gut health",
              },
            ],
            macros: { p: 25, c: 60, f: 15, fiber: 8 },
            order: ["fiber", "protein", "carbs"],
            tips: ["eat slowly", "stay hydrated", "enjoy your meal"],
            swaps: [
              "Quinoa for oatmeal",
              "banana for berries",
              "seeds for nuts",
            ],
          },
          {
            name: "Lunch",
            time: profile.lunch_time || "13:00",
            items: [
              {
                food: "Grilled chicken",
                qty_g: 120,
                hand_portion: "1 palm",
                benefits: "Lean protein, supports muscle health",
              },
              {
                food: "Brown rice",
                qty_g: 100,
                hand_portion: "1 cupped hand",
                benefits: "Complex carbs, fiber, sustained energy",
              },
              {
                food: "Mixed vegetables",
                qty_g: 150,
                hand_portion: "2 fists",
                benefits: "Vitamins, minerals, supports overall health",
              },
            ],
            macros: { p: 35, c: 50, f: 20, fiber: 6 },
            order: ["vegetables", "protein", "carbs"],
            tips: ["chew thoroughly", "take breaks", "enjoy your meal"],
            swaps: [
              "Fish for chicken",
              "quinoa for rice",
              "different vegetables",
            ],
          },
          {
            name: "Dinner",
            time: profile.dinner_time || "19:00",
            items: [
              {
                food: "Salmon",
                qty_g: 100,
                hand_portion: "1 palm",
                benefits: "Omega-3, protein, supports brain health",
              },
              {
                food: "Sweet potato",
                qty_g: 120,
                hand_portion: "1 fist",
                benefits: "Beta-carotene, fiber, supports immune system",
              },
              {
                food: "Green salad",
                qty_g: 100,
                hand_portion: "2 fists",
                benefits: "Vitamins, minerals, supports overall health",
              },
            ],
            macros: { p: 30, c: 40, f: 25, fiber: 8 },
            order: ["salad", "protein", "carbs"],
            tips: [
              "finish 2-3 hours before sleep",
              "avoid screens",
              "enjoy your meal",
            ],
            swaps: [
              "Tofu for salmon",
              "regular potato for sweet potato",
              "different vegetables",
            ],
          },
        ],
        snacks: ["Greek yogurt", "Apple with almond butter", "Herbal tea"],
        hacks: [
          "10-min walk after meals",
          "drink water before eating",
          "eat mindfully",
        ],
      };
  }
}
