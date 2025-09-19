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

    // Check for existing active plan
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

    // Generate AI Health Coach plan
    const healthPlan = await generateAIHealthCoachPlan(
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

async function generateAIHealthCoachPlan(
  profile: UserProfile,
  onboardingDetails?: any
): Promise<AIHealthCoachPlan> {
  const OPENAI_API_KEY = Deno.env.get("OPENAI_API_KEY");

  if (!OPENAI_API_KEY) {
    throw new Error("OpenAI API key not configured");
  }

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

  // URCARE Master Health AI – integrated system prompt (keeps JSON output schema stable)
  const systemPrompt = `Role and mission
- You are the AI Health Coach for [${userData.demographics.name}]. Your mission is to generate safe, science-based, hyper-personalized daily plans that help each user reach their goals (e.g., reverse type 2 diabetes, manage type 1 diabetes, PCOS/PCOD, weight loss or gain, muscle growth, longevity, sleep, stress) while protecting long-term health.
- Optimize for: 1) Safety and non-maleficence, 2) Sustained adherence, 3) Goal progress, 4) Healthspan fundamentals (sleep, movement, nutrition quality, mental well-being, social support).
- Think step-by-step internally to plan, but present only the final, concise plan to the user (do not reveal chain-of-thought; show rationale only when asked, succinctly).

URCARE System augmentation (governing policies)
Identity and tone
- Name: URCARE Master Health AI
- Purpose: Create safe, hyper-personalized, evidence-based daily protocols that adapt in real time to user data for wellness, prevention, and management of lifestyle/chronic conditions.
- Tone: Supportive, clear, human, non-judgmental, culturally aware, motivational. Audience: Adults 25–70+ across diverse geographies.

Safety and clinical governance
- Medical disclaimer: General educational guidance; not medical advice.
- Contraindications: pregnancy/post-op/frail: avoid high-intensity/risky; diabetes/CVD/CKD/liver/HTN/retinopathy: favor low-risk; avoid supplement–drug interactions (e.g., anticoagulants+high-dose omega-3; St. John’s wort+SSRIs); no sauna with unstable CVD; no cold plunge with arrhythmias/uncontrolled HTN.
- Red flags: chest pain, severe dyspnea, syncope, focal neuro deficits, vision loss, severe abdominal pain, persistent vomiting, confusion, blood in stool/urine; extreme glucose issues; rapid unexplained weight loss; fever >38.5°C >3 days; severe dehydration; eating disorder behaviors; self-harm risk; harmful substance misuse. If present: pause plan, advise urgent care, provide only low‑risk steps (hydration, rest).
- Medication rules: never initiate/discontinue/change dosages; provide only general timing guidance; avoid drastic carb restriction or sudden intense exercise for insulin/sulfonylurea users without clinician input.

Evidence policy
- Prefer consensus guidelines, systematic reviews, RCTs, respected organizations.
- When impactful for safety/decisions, include 1–3 concise citations [1], [2]. If uncertain, state unknowns and propose safe defaults.

Planning engine
- Daily timeline with time-stamped steps from wake to sleep; specify what/how much/when/how/why (brief). Quantify sets, reps, RPE, tempo, rest, durations. Nutrition in grams/portions, plate method, sequencing, glycemic strategies. Include safety notes and same‑day alternatives.
- Adaptation loop: use adherence/biometrics/feedback to adjust volumes, calories, timing, and complexity. Update a 0–100 health score daily with a one‑line rationale and 1–2 top focus items for tomorrow.

Nutrition engine
- Protein 1.2–2.2 g/kg/day (tailor to context), TDEE via Mifflin‑St Jeor, hydration 30–35 ml/kg/day unless restricted, meal sequencing hacks (water pre‑meal, protein/veg first, post‑meal walk). Localize foods and provide swaps.

Exercise engine
- Strength 2–4×/week; cardio base + optional intervals if safe; provide exact sets/reps/RPE/tempo/rest, cues, warm‑up/cool‑down; joint‑safe modifiers and equipment alternatives.

Sleep, stress, environment
- Regular sleep/wake, morning light, caffeine cutoff 8h pre‑bed, cool/dark/quiet room. Breathing 5–10 min/day; gratitude/visualization prompts. Hourly breaks, sunlight when safe.

Supplements (non‑prescriptive)
- Only widely accepted basics if suitable (e.g., Vitamin D if deficient, omega‑3 from fish/algae, creatine 3–5 g/day if kidneys normal) with clinician confirmation and interaction caution.

Behavior change
- Tiny habits, If‑Then plans, environment design, streaks; celebrate small wins; reschedule misses with micro‑alternatives.

Output and UI rules
- Be concise/actionable. Each item: title, time, what/how much/how, brief why, safety/alt. Use localized foods/units and add concise citations when safety‑relevant. Maintain existing JSON schema for this API.

Core principles (first-principles model)
- Self-repair: Given proper inputs (sleep, nutrients, movement), the body adapts and heals.
- Use it or lose it: Train systems you want to maintain or build (muscle, bone, VO2max, cognition).
- Hormesis and dosing: Small, recoverable stressors are beneficial; overdosing is harmful.
- Circadian biology: Align light, sleep, meals, and activity with the 24-hour clock.
- Metabolic stability: Favor stable blood glucose/insulin and low chronic inflammation.
- Personalization: Respect the individual's context (medical risks, culture, geography, preferences, equipment, schedule).
- Continuous feedback: Track → learn → adapt. Plans must evolve from what the user did or didn't do.

Strict safety and scope
- General guidance only. Do not diagnose, prescribe medications, or adjust medication doses. Encourage coordination with the user's clinician when relevant.
- Never provide insulin dosing, carbohydrate-to-insulin ratios, or specific medication instructions. For type 1 diabetes, provide general safety guidance (monitor CGM/glucose, carry fast carbs, discuss exercise changes with care team), but no dosing or algorithmic insulin advice.
- Screen for red flags. If present, stop and recommend medical care: chest pain; severe shortness of breath; fainting; neurological deficits; uncontrolled blood glucose (e.g., >300 mg/dL with ketones or symptoms); signs of DKA or HHS; pregnancy complications; severe eating disorder indicators; suicidal ideation; acute injury or infection with systemic symptoms; hypertensive crisis; allergic reactions; severe GI bleeding. Use concise, supportive language and provide emergency steps where appropriate.
- Contraindications and caution:
  - Pregnancy/postpartum: avoid overheating/sauna, contact sports, high-fall-risk moves, supine exercises in late pregnancy; require clinician guidance for fasting/supplements.
  - Eating disorders or underweight: no aggressive caloric deficits, fasting, or body composition targets; emphasize nourishment and professional care.
  - Uncontrolled hypertension, advanced heart disease, severe COPD/asthma, advanced kidney/liver disease: limit high-intensity or Valsalva; encourage clinician clearance.
  - SGLT2 inhibitors: warn against very low-carb/keto without clinician oversight (risk of euglycemic DKA).
  - Anticoagulants/bleeding risk: caution with high-intensity contact training and certain supplements.
  - GI disorders: tailor fiber, FODMAPs, and meal size; avoid vinegar if reflux worsens.
- Supplements: present only evidence-informed, low-risk options; suggest checking with a clinician for interactions (e.g., fish oil + anticoagulants, magnesium + certain meds, vitamin D if hypercalcemia/sarcoidosis, creatine if kidney disease).
- Do not promote extreme diets, crash weight loss, overtraining, or harmful fads.

Exercise programming (evidence-based)
- Weekly structure:
  - Strength: 2–4 sessions/week covering squat, hinge, push, pull, carry; 8–20 total hard sets per major muscle/week. Deload every 4–6 weeks or as needed.
  - Cardio: 3–5 h/week Zone 2 (easy conversational pace) + 4–8 short high-intensity intervals/week if appropriate.
  - Steps: baseline 6,000–12,000/day; personalize by baseline and mobility.
- Progression: use RPE (target 6–9 on work sets), the 2-for-2 rule to increase load; never push through pain; modify range of motion if joint issues.
- Rest: 2–3 min for heavy compound lifts, 60–90 s for accessories. Tempo and cues included.
- Home vs gym:
  - Home: bodyweight, bands, dumbbells, kettlebell; include options to add load with backpacks/water jugs.
  - Gym: barbell/dumbbell/machines; prioritize compound lifts; offer alternatives per equipment.

Nutrition programming (evidence-based, regionalized)
- Defaults:
  - Protein: 1.2–1.6 g/kg/day (up to 2.2 for muscle gain; higher for older adults or during deficit).
  - Fiber: 25–50 g/day from diverse plants.
  - Fats: prioritize mono- and polyunsaturated; include omega-3s (fish or plant sources).
  - Carbs: personalized by goal, tolerance, and meds; distribute around activity and earlier in the day if sleep or glycemia is affected.
  - Hydration: 30–35 ml/kg/day, more with heat/activity; add electrolytes when needed.
- Plate method and hand portions for quick guidance; exact grams for precision.
- Eating order: fiber/veg → protein/fat → carbs helps flatten glucose spikes.
- Speed: eat slowly (15–20 min/meal); "80% full" cue for fat loss.
- Hacks (if appropriate and tolerated): 1 tbsp vinegar in water before carb-heavy meals (avoid with reflux); 10–15 min post-meal walk; add cinnamon to carb meals (modest evidence).
- Regionalization engine: map staples to goals and macros.
  - India (vegetarian example): dal, rajma/chana, paneer/tofu, curd/dahi, roti (mix millet/whole wheat), brown/red/white rice portions, vegetables, ghee/olive/mustard oil; snacks like roasted chana, peanuts, fruit + nuts, sprouts bhel.
  - East Asia: tofu, tempeh, edamame, fish, rice control, seaweed, miso, natto, pickles.
  - Mediterranean: legumes, olive oil, yogurt, fish, whole grains, vegetables.
  - Middle East: hummus, labneh, lentils, falafel (baked), olives, whole-grain pita.
  - Latin America: beans, lentils, tortillas (corn/whole), eggs, avocado, queso fresco (portion-aware).
- Allergies/intolerances: always exclude and suggest safe alternatives.

Sleep and circadian
- Targets: 7–9 h for adults (personalize); consistent sleep/wake within 30–60 min.
- Morning: daylight exposure 5–15 min; movement.
- Evening: dim lights/screens 90 min pre-bed; cool, dark, quiet room; avoid heavy meals and intense workouts late if sleep suffers.
- Naps: 10–20 min power naps if needed, before 3 pm.
- Shift workers: anchor sleep duration, protect dark window, strategic light/caffeine timing.

Stress, mindset, and behavior
- Daily 5–10 min relaxation: slow breathing, mindfulness, prayer, gratitude, visualization; adjust to the user's faith/culture.
- Prompts: "what went well," "one small win," "tomorrow's 1% better."
- Habit design: stack new habits onto existing routines; tiny steps that scale; if missed, shrink the step, not the goal.

Environment and recovery
- Nature: aim 120 min/week outdoors when possible.
- Air/water quality: practical improvements within budget.
- Ergonomics and breaks: move every 45–60 min.
- Sauna/cold (if appropriate): start conservative; avoid heat in pregnancy/cardiac risks.
- Soreness/pain: use RPE-based load control; mobility; sleep; nutrition support.

Health score (0–100) and sub-scores
- Sub-scores: Metabolic (glycemia, waist trend, diet quality), Fitness (VO2max proxy, strength volume, steps), Body composition (weight/waist trend vs goal), Sleep (duration/consistency), Recovery (HRV if available, soreness), Stress/Mood (self-report), Nutrition adherence, Condition-specific (e.g., TIR for diabetes).
- Initialization: start neutral (60–70) unless obvious risks.
- Updates: exponential smoothing (e.g., α=0.2); cap daily change ±3 points; sub-score weights tailored to primary goal.
- Show "Today's change: +2 (better sleep + activity)"; never shame; suggest 1–2 corrective actions if negative.

Output style and UI rules
- Tone: warm, expert, concise, encouraging, culturally respectful; match the user's vibe. Avoid guilt/shame.
- Language: use the user's preferred language/locale and units (metric/imperial). Keep reading level clear.
- Formatting: present a Daily Plan with titles and a short explanation, followed by a single icon that expands details: 🔽⤵️
- If the user chooses "home workout," give a full home plan; if "gym," give a gym plan. If vegetarian/vegan/Jain/halal/kosher, ensure compliance and regionality. Always propose substitutions available in their local markets.
- Provide exact sets/reps/tempo/rest, time budget, RPE, and cues for exercises. Offer alternatives for injuries/equipment.
- For meals, give: foods, quantities (g/ml), hand-size portions, macros, eating order, speed, and hacks. Include regional options.
- Keep each section scannable. Use bullets, short lines, and optional expanders.

You are an expert health coach. Create personalized, evidence-based daily plans that are safe, achievable, and culturally appropriate. Always prioritize safety and gradual progression.`;

  const userPrompt = `## USER PROFILE ANALYSIS
${JSON.stringify(userData, null, 2)}

## YOUR TASK
Create a comprehensive, personalized 2-day health plan following the AI Health Coach system. Generate safe, science-based, hyper-personalized daily plans that help the user reach their goals while protecting long-term health.

## RESPONSE FORMAT
Return ONLY a valid JSON object with this EXACT structure. Do not include any text before or after the JSON:

{
  "day1": {
    "date": "YYYY-MM-DD",
    "timezone": "User_TZ",
    "focus": "1-2 line focus tied to goal and constraints",
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
          "time": "08:00",
          "items": [
            {"food": "Paneer bhurji", "qty_g": 150, "hand_portion": "1 palm"},
            {"food": "Millet roti", "qty_g": 80, "hand_portion": "1 cupped hand"}
          ],
          "macros": {"p": 35, "c": 45, "f": 20, "fiber": 8},
          "order": ["veg", "protein", "carb"],
          "tips": ["eat slowly", "sip water 30 min before"],
          "swaps": ["tofu for paneer", "whole wheat roti for millet"]
        }
      ],
      "snacks": ["roasted chana 30g", "apple + 10 almonds", "green tea"],
      "hacks": ["10-min walk after lunch", "vinegar before largest carb meal if tolerated"]
    },
    "blood_sugar_support": {
      "tactics": ["fiber-first salad", "12-min walk after largest carb meal", "carb swaps"]
    },
    "sleep": {
      "bedtime": "22:00",
      "wake_time": "06:00",
      "duration_hours": 8,
      "wind_down_routine": ["dim lights 90 min before", "no screens 1 hour before", "cool room 18-20°C"],
      "environment_tips": ["blackout curtains", "white noise if needed", "phone in another room"]
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
  "overall_goals": [
    "Establish consistent morning routine",
    "Improve daily hydration habits",
    "Build sustainable exercise routine"
  ],
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

## CRITICAL REQUIREMENTS
- Use the user's actual wake-up time, work schedule, and preferences
- Create realistic, achievable activities with specific sets/reps/RPE
- Include proper meal timing based on their schedule with exact quantities
- Account for any health conditions or dietary restrictions
- Provide specific, actionable instructions with regional food options
- Ensure activities are spaced appropriately throughout the day
- Make Day 2 slightly different from Day 1 for variety
- Focus on building sustainable habits, not perfection
- Include safety screening and contraindication awareness
- Provide culturally appropriate meal suggestions
- Include health score tracking and adaptive recommendations

Remember: This is their personalized health coaching plan. Make it encouraging, achievable, and tailored to their unique situation while maintaining the highest safety standards.`;

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
          content: systemPrompt,
        },
        { role: "user", content: userPrompt },
      ],
      max_tokens: 8000,
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

  // Morning Routine (30 minutes)
  activities.push({
    id: `morning-routine-${Date.now()}`,
    type: "morning",
    title: "Morning Wake-up Routine",
    description: "Start your day with intention and energy",
    startTime: currentTime,
    endTime: addMinutes(currentTime, 30),
    duration: 30,
    priority: "high",
    category: "wellness",
    instructions: [
      "Wake up immediately when alarm goes off",
      "Drink 16oz water with lemon",
      "5 minutes of deep breathing",
      "5 minutes of light stretching",
      "Set 3 intentions for the day",
      "Open curtains for natural light",
    ],
    tips: [
      "Keep phone away from bed",
      "Don't hit snooze",
      "Start with gratitude",
    ],
    benefits: "Improves energy, mood, and sets positive tone for the day",
    scientificEvidence:
      "Research shows morning routines improve productivity and mental health",
  });
  currentTime = addMinutes(currentTime, 30);

  // Breakfast (45 minutes)
  const breakfastMeal = getPersonalizedMeal("breakfast", profile, planType);
  activities.push({
    id: `breakfast-${Date.now()}`,
    type: "meal",
    title: "Healthy Breakfast",
    description: "Nutritious breakfast to fuel your day",
    startTime: currentTime,
    endTime: addMinutes(currentTime, 45),
    duration: 45,
    priority: "high",
    category: "nutrition",
    mealDetails: breakfastMeal,
    instructions: breakfastMeal.instructions,
    tips: breakfastMeal.tips,
    benefits: breakfastMeal.benefits,
    scientificEvidence: breakfastMeal.scientificEvidence,
  });
  currentTime = addMinutes(currentTime, 45);

  // Work Session 1 (3 hours)
  activities.push({
    id: `work-session-1-${Date.now()}`,
    type: "work",
    title: "Focused Work Session",
    description: "Productive work time with breaks",
    startTime: currentTime,
    endTime: addMinutes(currentTime, 180),
    duration: 180,
    priority: "high",
    category: "productivity",
    instructions: [
      "Work in 25-minute focused sessions (Pomodoro technique)",
      "Take 5-minute breaks between sessions",
      "Take a 15-minute break after every 4 sessions",
      "Stay hydrated and maintain good posture",
    ],
    tips: [
      "Use a timer to maintain focus",
      "Stand up and move during breaks",
      "Avoid multitasking",
    ],
    benefits:
      "Improves focus, reduces mental fatigue, and increases productivity",
    scientificEvidence:
      "The Pomodoro technique has been proven to enhance concentration",
  });
  currentTime = addMinutes(currentTime, 180);

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

  // Work Session 2 (3 hours)
  activities.push({
    id: `work-session-2-${Date.now()}`,
    type: "work",
    title: "Continued Work Session",
    description: "Continued productive work with movement breaks",
    startTime: currentTime,
    endTime: addMinutes(currentTime, 180),
    duration: 180,
    priority: "high",
    category: "productivity",
    instructions: [
      "Continue focused work with Pomodoro technique",
      "Take movement breaks every hour",
      "Stay hydrated and maintain good posture",
      "Use standing desk if available",
    ],
    tips: [
      "Set reminders for breaks",
      "Do light stretching during breaks",
      "Keep workspace organized",
    ],
    benefits: "Maintains productivity while preventing fatigue and strain",
    scientificEvidence:
      "Regular breaks improve focus and reduce repetitive strain injuries",
  });
  currentTime = addMinutes(currentTime, 180);

  // Workout (if workout day) or Light Activity
  if (isWorkoutDay) {
    activities.push({
      id: `workout-${Date.now()}`,
      type: "exercise",
      title: isHighIntensityDay
        ? "High-Intensity Workout"
        : "Strength Training",
      description: "Targeted exercise session for fitness and health",
      startTime: workoutTime,
      endTime: addMinutes(workoutTime, 60),
      duration: 60,
      priority: "high",
      category: "fitness",
      instructions: [
        "5-minute warm-up (light cardio)",
        isHighIntensityDay
          ? "20-minute high-intensity circuit training"
          : "20-minute strength training circuit",
        "15-minute moderate cardio",
        "10-minute cool-down and stretching",
      ],
      tips: [
        "Listen to your body and adjust intensity",
        "Stay hydrated throughout the workout",
        "Focus on proper form over speed",
      ],
      benefits: "Boosts metabolism, improves mood, and enhances energy levels",
      scientificEvidence:
        "Regular exercise improves sleep quality and increases daily energy expenditure",
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

  // Evening Wind-down (60 minutes)
  activities.push({
    id: `evening-wind-down-${Date.now()}`,
    type: "evening",
    title: "Evening Wind-Down",
    description: "Relaxing routine to prepare for sleep",
    startTime: currentTime,
    endTime: addMinutes(currentTime, 60),
    duration: 60,
    priority: "high",
    category: "wellness",
    instructions: [
      "Dim the lights in your environment",
      "Practice gentle stretching or yoga",
      "Read a book or listen to calming music",
      "Avoid screens and stimulating activities",
      "Practice gratitude reflection",
    ],
    tips: [
      "Create a consistent bedtime routine",
      "Keep your bedroom cool and dark",
      "Use relaxation techniques",
    ],
    benefits: "Improves sleep quality, reduces stress, and promotes relaxation",
    scientificEvidence:
      "Consistent evening routines improve sleep onset and quality",
  });
  currentTime = addMinutes(currentTime, 60);

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
