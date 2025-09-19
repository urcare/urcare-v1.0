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
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const wakeUpTime = profile.wake_up_time || "07:00";
  const sleepTime = profile.sleep_time || "22:00";
  const workoutTime = profile.workout_time || "18:00";

  const createBasicDay = (date: Date, isWorkoutDay: boolean): DailyPlan => ({
    date: date.toISOString().split("T")[0],
    timezone: "User's local timezone",
    focus: isWorkoutDay
      ? "Strength training and balanced nutrition"
      : "Active recovery and mindful eating",
    movement: {
      type: "home",
      duration_min: isWorkoutDay ? 45 : 20,
      exercises: isWorkoutDay
        ? [
            {
              name: "Bodyweight Squats",
              sets: 3,
              reps: "12-15",
              rpe: "6-7",
              rest_s: 90,
              tempo: "2-1-2",
              cues: ["chest up", "knees track over toes"],
              alt: ["Chair squats"],
            },
            {
              name: "Push-ups",
              sets: 3,
              reps: "8-12",
              rpe: "7-8",
              rest_s: 90,
              tempo: "2-1-2",
              cues: ["straight line", "full range of motion"],
              alt: ["Incline push-ups"],
            },
          ]
        : [
            {
              name: "Walking",
              sets: 1,
              reps: "20-30 min",
              rpe: "3-4",
              rest_s: 0,
              tempo: "steady",
              cues: ["brisk pace", "upright posture"],
              alt: ["Light stretching"],
            },
          ],
      warmup: ["5 min light movement", "joint mobility"],
      cooldown: ["5 min walking", "breathing exercises"],
    },
    steps: {
      target: 8000,
      post_meal_walk_min: 10,
    },
    nutrition: {
      calories: 1800,
      protein_g: 120,
      carbs_g: 180,
      fat_g: 60,
      fiber_g: 30,
      meals: [
        {
          name: "Breakfast",
          time: profile.breakfast_time || addMinutes(wakeUpTime, 30),
          items: [
            { food: "Oatmeal", qty_g: 50, hand_portion: "1 cupped hand" },
            { food: "Berries", qty_g: 100, hand_portion: "1 fist" },
            { food: "Nuts", qty_g: 20, hand_portion: "1 thumb" },
          ],
          macros: { p: 25, c: 60, f: 15, fiber: 8 },
          order: ["fiber", "protein", "carbs"],
          tips: ["eat slowly", "stay hydrated"],
          swaps: ["quinoa for oatmeal", "banana for berries"],
        },
        {
          name: "Lunch",
          time: profile.lunch_time || "13:00",
          items: [
            { food: "Grilled chicken", qty_g: 120, hand_portion: "1 palm" },
            { food: "Brown rice", qty_g: 100, hand_portion: "1 cupped hand" },
            { food: "Mixed vegetables", qty_g: 150, hand_portion: "2 fists" },
          ],
          macros: { p: 35, c: 50, f: 20, fiber: 6 },
          order: ["vegetables", "protein", "carbs"],
          tips: ["chew thoroughly", "take breaks"],
          swaps: ["fish for chicken", "quinoa for rice"],
        },
        {
          name: "Dinner",
          time: profile.dinner_time || "19:00",
          items: [
            { food: "Salmon", qty_g: 100, hand_portion: "1 palm" },
            { food: "Sweet potato", qty_g: 120, hand_portion: "1 fist" },
            { food: "Green salad", qty_g: 100, hand_portion: "2 fists" },
          ],
          macros: { p: 30, c: 40, f: 25, fiber: 8 },
          order: ["salad", "protein", "carbs"],
          tips: ["finish 2-3 hours before sleep", "avoid screens"],
          swaps: ["tofu for salmon", "regular potato for sweet potato"],
        },
      ],
      snacks: ["Greek yogurt", "Apple with almond butter", "Herbal tea"],
      hacks: ["10-min walk after meals", "drink water before eating"],
    },
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
      reflection_prompt: "What went well today? One thing you're grateful for.",
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
  });

  return {
    day1: createBasicDay(today, true),
    day2: createBasicDay(tomorrow, false),
    overall_goals: profile.health_goals || [
      "Improve overall health",
      "Build healthy habits",
      "Maintain consistency",
    ],
    progress_tips: [
      "Track your daily activities",
      "Stay consistent with your schedule",
      "Listen to your body and adjust as needed",
      "Celebrate small wins",
      "Stay hydrated throughout the day",
    ],
    safety_notes: [
      "If you experience any concerning symptoms, consult your healthcare provider",
      "Start slowly and progress gradually",
      "Listen to your body and rest when needed",
    ],
    cultural_adaptations: [
      "Plan adapted to your schedule and preferences",
      "Flexible meal options provided",
      "Exercise modifications available",
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
