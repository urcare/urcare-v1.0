/**
 * SYSTEMATIC HEALTH PLAN GENERATION FUNCTION
 *
 * This function uses the new systematic approach to process user data
 * and generate health plans with structured AI prompts.
 */

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

// ============================================================================
// INTERFACES & TYPES
// ============================================================================

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
  workout_type: string | null;
  smoking: string | null;
  drinking: string | null;
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

interface ProcessedUserData {
  basic: {
    name: string;
    age: number;
    gender: string;
    dateOfBirth: string | null;
  };
  physical: {
    height: { value: number; unit: "cm" | "ft"; display: string };
    weight: { value: number; unit: "kg" | "lb"; display: string };
    bmi: number | null;
  };
  health: {
    conditions: string[];
    medications: string[];
    surgeries: string[];
    criticalConditions: string[];
    bloodGroup: string | null;
  };
  goals: {
    primary: string[];
    dietType: string;
    workoutType: string;
    routineFlexibility: number;
  };
  schedule: {
    wakeUp: string;
    sleep: string;
    workStart: string;
    workEnd: string;
    meals: { breakfast: string; lunch: string; dinner: string };
    workout: string;
  };
  lifestyle: {
    smoking: string;
    drinking: string;
    usesWearable: boolean;
    wearableType: string | null;
    trackFamily: boolean;
    shareProgress: boolean;
  };
  safety: {
    emergencyContact: { name: string | null; phone: string | null };
    hasHealthReports: boolean;
    healthReports: string[];
  };
  aiContext: {
    complexityScore: number;
    riskLevel: "low" | "medium" | "high";
    focusAreas: string[];
    contraindications: string[];
    recommendations: string[];
  };
}

// ============================================================================
// MAIN FUNCTION
// ============================================================================

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    console.log("🚀 Starting systematic health plan generation...");

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

    // Get authenticated user
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

    // Get request body
    const { userGoal, userQuery, promptType, forceRegenerate } =
      await req.json();

    // Get user profile
    const { data: profile, error: profileError } = await supabaseClient
      .from("user_profiles")
      .select("*")
      .eq("id", user.id)
      .single();

    if (profileError || !profile) {
      return new Response(
        JSON.stringify({ success: false, error: "User profile not found" }),
        {
          status: 404,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Check if user has completed onboarding
    if (!profile.onboarding_completed) {
      return new Response(
        JSON.stringify({ success: false, error: "Onboarding not completed" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Check for existing active plan (unless force regenerate)
    if (!forceRegenerate) {
      const { data: existingPlan } = await supabaseClient
        .from("two_day_health_plans")
        .select("*")
        .eq("user_id", user.id)
        .eq("is_active", true)
        .single();

      if (existingPlan) {
        return new Response(
          JSON.stringify({
            success: true,
            message: "Active plan already exists",
            plan: existingPlan,
          }),
          {
            status: 200,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      }
    }

    // Step 1: Process user data systematically
    console.log("📊 Step 1: Processing user data...");
    const processedData = processUserData(profile, userGoal);

    // Step 2: Generate AI prompt context
    console.log("🤖 Step 2: Generating AI prompt context...");
    const aiContext = generateAIPromptContext(processedData, userGoal);

    // Step 3: Generate appropriate AI prompt
    console.log("🧠 Step 3: Generating AI prompt...");
    const promptType =
      promptType || determinePromptType(processedData, { userGoal, userQuery });
    const healthPlanPrompt = generatePrompt(
      processedData,
      aiContext,
      promptType,
      userQuery
    );

    // Step 4: Call AI service
    console.log("🔮 Step 4: Calling AI service...");
    const aiResponse = await callAIService(healthPlanPrompt);

    // Step 5: Process and validate response
    console.log("✅ Step 5: Processing AI response...");
    const processedPlan = processAIResponse(aiResponse, processedData);

    // Step 6: Save to database
    console.log("💾 Step 6: Saving to database...");
    const savedPlan = await saveHealthPlan(
      processedPlan,
      user.id,
      supabaseClient
    );

    console.log("🎉 Health plan generated successfully!");

    return new Response(
      JSON.stringify({
        success: true,
        plan: savedPlan,
        message: "Systematic health plan generated successfully",
        metadata: {
          processingTime: Date.now(),
          modelUsed: healthPlanPrompt.model,
          complexityScore: processedData.aiContext.complexityScore,
          riskLevel: processedData.aiContext.riskLevel,
        },
      }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("❌ Error in systematic health plan generation:", error);
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message || "An unexpected error occurred",
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});

// ============================================================================
// DATA PROCESSING FUNCTIONS
// ============================================================================

function processUserData(
  profile: UserProfile,
  userGoal?: string
): ProcessedUserData {
  console.log("🔄 Processing user data systematically...");

  const processed: ProcessedUserData = {
    basic: processBasicInfo(profile),
    physical: processPhysicalMetrics(profile),
    health: processHealthStatus(profile),
    goals: processGoalsAndPreferences(profile, userGoal),
    schedule: processSchedule(profile),
    lifestyle: processLifestyle(profile),
    safety: processSafetyInfo(profile),
    aiContext: processAIContext(profile, userGoal),
  };

  console.log("✅ User data processed successfully");
  return processed;
}

function processBasicInfo(profile: UserProfile) {
  return {
    name: profile.full_name || "User",
    age: profile.age || 30,
    gender: profile.gender || "Not specified",
    dateOfBirth: profile.date_of_birth,
  };
}

function processPhysicalMetrics(profile: UserProfile) {
  const unitSystem = profile.unit_system || "metric";

  let height = { value: 0, unit: "cm" as "cm" | "ft", display: "" };
  let weight = { value: 0, unit: "kg" as "kg" | "lb", display: "" };

  if (unitSystem === "metric") {
    height = {
      value: parseFloat(profile.height_cm || "170"),
      unit: "cm",
      display: `${profile.height_cm} cm`,
    };
    weight = {
      value: parseFloat(profile.weight_kg || "70"),
      unit: "kg",
      display: `${profile.weight_kg} kg`,
    };
  } else {
    const feet = parseFloat(profile.height_feet || "5");
    const inches = parseFloat(profile.height_inches || "6");
    const totalInches = feet * 12 + inches;

    height = {
      value: totalInches,
      unit: "ft",
      display: `${feet}'${inches}"`,
    };
    weight = {
      value: parseFloat(profile.weight_lb || "150"),
      unit: "lb",
      display: `${profile.weight_lb} lbs`,
    };
  }

  // Calculate BMI
  let bmi: number | null = null;
  if (height.value > 0 && weight.value > 0) {
    if (unitSystem === "metric") {
      bmi = weight.value / Math.pow(height.value / 100, 2);
    } else {
      bmi = (weight.value * 703) / Math.pow(height.value, 2);
    }
  }

  return { height, weight, bmi };
}

function processHealthStatus(profile: UserProfile) {
  return {
    conditions: profile.chronic_conditions || [],
    medications: profile.medications || [],
    surgeries: profile.surgery_details || [],
    criticalConditions: profile.critical_conditions
      ? [profile.critical_conditions]
      : [],
    bloodGroup: profile.blood_group,
  };
}

function processGoalsAndPreferences(profile: UserProfile, userGoal?: string) {
  return {
    primary: userGoal ? [userGoal] : profile.health_goals || [],
    dietType: profile.diet_type || "Balanced",
    workoutType: profile.workout_type || "General fitness",
    routineFlexibility: parseInt(profile.routine_flexibility || "5"),
  };
}

function processSchedule(profile: UserProfile) {
  return {
    wakeUp: profile.wake_up_time || "07:00",
    sleep: profile.sleep_time || "22:00",
    workStart: profile.work_start || "09:00",
    workEnd: profile.work_end || "17:00",
    meals: {
      breakfast: profile.breakfast_time || "08:00",
      lunch: profile.lunch_time || "13:00",
      dinner: profile.dinner_time || "19:00",
    },
    workout: profile.workout_time || "18:00",
  };
}

function processLifestyle(profile: UserProfile) {
  return {
    smoking: profile.smoking || "No",
    drinking: profile.drinking || "No",
    usesWearable: profile.uses_wearable === "Yes",
    wearableType: profile.wearable_type,
    trackFamily: profile.track_family === "Yes",
    shareProgress: profile.share_progress === "Yes",
  };
}

function processSafetyInfo(profile: UserProfile) {
  return {
    emergencyContact: {
      name: profile.emergency_contact_name,
      phone: profile.emergency_contact_phone,
    },
    hasHealthReports: profile.has_health_reports === "Yes",
    healthReports: profile.health_reports || [],
  };
}

function processAIContext(profile: UserProfile, userGoal?: string) {
  const complexityScore = calculateComplexityScore(profile, userGoal);
  const riskLevel = assessRiskLevel(profile);
  const focusAreas = identifyFocusAreas(profile, userGoal);
  const contraindications = identifyContraindications(profile);
  const recommendations = generateRecommendations(profile, userGoal);

  return {
    complexityScore,
    riskLevel,
    focusAreas,
    contraindications,
    recommendations,
  };
}

// ============================================================================
// AI CONTEXT FUNCTIONS
// ============================================================================

function calculateComplexityScore(
  profile: UserProfile,
  userGoal?: string
): number {
  let score = 0;

  // Health conditions
  score += (profile.chronic_conditions?.length || 0) * 15;

  // Medications
  score += (profile.medications?.length || 0) * 10;

  // Age factors
  if (profile.age) {
    if (profile.age > 60) score += 20;
    if (profile.age < 25) score += 10;
  }

  // Complex goals
  const complexGoals = [
    "diabetes",
    "pcos",
    "weight loss",
    "muscle gain",
    "longevity",
  ];
  if (
    userGoal &&
    complexGoals.some((goal) => userGoal.toLowerCase().includes(goal))
  ) {
    score += 25;
  }

  return Math.min(score, 100);
}

function assessRiskLevel(profile: UserProfile): "low" | "medium" | "high" {
  const conditions = profile.chronic_conditions || [];
  const medications = profile.medications || [];
  const criticalConditions = profile.critical_conditions;

  if (criticalConditions || conditions.length > 3 || medications.length > 3) {
    return "high";
  }

  if (conditions.length > 0 || medications.length > 0) {
    return "medium";
  }

  return "low";
}

function identifyFocusAreas(profile: UserProfile, userGoal?: string): string[] {
  const areas: string[] = [];

  // Based on health conditions
  const conditions = profile.chronic_conditions || [];
  if (conditions.includes("diabetes")) areas.push("blood sugar management");
  if (conditions.includes("hypertension")) areas.push("cardiovascular health");
  if (conditions.includes("PCOS")) areas.push("hormonal balance");

  // Based on goals
  if (userGoal) {
    if (userGoal.toLowerCase().includes("weight"))
      areas.push("weight management");
    if (userGoal.toLowerCase().includes("muscle"))
      areas.push("strength training");
    if (userGoal.toLowerCase().includes("energy"))
      areas.push("energy optimization");
  }

  // Default areas
  if (areas.length === 0) {
    areas.push("general wellness", "lifestyle optimization");
  }

  return areas;
}

function identifyContraindications(profile: UserProfile): string[] {
  const contraindications: string[] = [];

  const conditions = profile.chronic_conditions || [];
  const medications = profile.medications || [];

  // Condition-based contraindications
  if (conditions.includes("diabetes")) {
    contraindications.push("avoid extreme carb restriction");
    contraindications.push("monitor blood sugar during exercise");
  }

  if (conditions.includes("hypertension")) {
    contraindications.push(
      "avoid high-intensity exercise without medical clearance"
    );
  }

  if (conditions.includes("heart disease")) {
    contraindications.push("avoid high-intensity exercise");
    contraindications.push("avoid sauna and cold plunge");
  }

  // Medication-based contraindications
  if (medications.some((med) => med.toLowerCase().includes("blood thinner"))) {
    contraindications.push("avoid high-impact activities");
  }

  return contraindications;
}

function generateRecommendations(
  profile: UserProfile,
  userGoal?: string
): string[] {
  const recommendations: string[] = [];

  // Age-based recommendations
  if (profile.age && profile.age > 50) {
    recommendations.push("focus on joint health and flexibility");
    recommendations.push("prioritize bone density exercises");
  }

  // Condition-based recommendations
  const conditions = profile.chronic_conditions || [];
  if (conditions.includes("diabetes")) {
    recommendations.push("focus on consistent meal timing");
    recommendations.push("include post-meal walks");
  }

  // Goal-based recommendations
  if (userGoal) {
    if (userGoal.toLowerCase().includes("weight loss")) {
      recommendations.push("create sustainable calorie deficit");
      recommendations.push("focus on whole foods");
    }
    if (userGoal.toLowerCase().includes("muscle gain")) {
      recommendations.push("prioritize protein intake");
      recommendations.push("progressive overload training");
    }
  }

  return recommendations;
}

// ============================================================================
// AI PROMPT GENERATION
// ============================================================================

function generateAIPromptContext(
  processedData: ProcessedUserData,
  userGoal?: string
) {
  return {
    userSummary: generateUserSummary(processedData),
    healthProfile: generateHealthProfile(processedData),
    goalsAndPreferences: generateGoalsAndPreferences(processedData, userGoal),
    scheduleConstraints: generateScheduleConstraints(processedData),
    safetyConsiderations: generateSafetyConsiderations(processedData),
    aiInstructions: generateAIInstructions(processedData),
  };
}

function generateUserSummary(processedData: ProcessedUserData): string {
  const { basic, physical, health } = processedData;

  return `User: ${basic.name}, ${basic.age} years old, ${basic.gender}
Physical: ${physical.height.display}, ${physical.weight.display}${
    physical.bmi ? ` (BMI: ${physical.bmi.toFixed(1)})` : ""
  }
Health Status: ${
    health.conditions.length > 0
      ? health.conditions.join(", ")
      : "No chronic conditions"
  }`;
}

function generateHealthProfile(processedData: ProcessedUserData): string {
  const { health, aiContext } = processedData;

  let profile = `Health Conditions: ${
    health.conditions.length > 0 ? health.conditions.join(", ") : "None"
  }`;

  if (health.medications.length > 0) {
    profile += `\nMedications: ${health.medications.join(", ")}`;
  }

  if (health.surgeries.length > 0) {
    profile += `\nPrevious Surgeries: ${health.surgeries.join(", ")}`;
  }

  if (health.bloodGroup) {
    profile += `\nBlood Group: ${health.bloodGroup}`;
  }

  profile += `\nRisk Level: ${aiContext.riskLevel.toUpperCase()}`;
  profile += `\nFocus Areas: ${aiContext.focusAreas.join(", ")}`;

  return profile;
}

function generateGoalsAndPreferences(
  processedData: ProcessedUserData,
  userGoal?: string
): string {
  const { goals } = processedData;

  let goalsText = `Primary Goals: ${goals.primary.join(", ")}`;
  goalsText += `\nDiet Preference: ${goals.dietType}`;
  goalsText += `\nWorkout Preference: ${goals.workoutType}`;
  goalsText += `\nRoutine Flexibility: ${goals.routineFlexibility}/10`;

  return goalsText;
}

function generateScheduleConstraints(processedData: ProcessedUserData): string {
  const { schedule } = processedData;

  return `Daily Schedule:
- Wake up: ${schedule.wakeUp}
- Sleep: ${schedule.sleep}
- Work: ${schedule.workStart} - ${schedule.workEnd}
- Meals: Breakfast ${schedule.meals.breakfast}, Lunch ${schedule.meals.lunch}, Dinner ${schedule.meals.dinner}
- Workout: ${schedule.workout}`;
}

function generateSafetyConsiderations(
  processedData: ProcessedUserData
): string {
  const { aiContext, safety } = processedData;

  let safetyText = `Safety Considerations:\n`;

  if (aiContext.contraindications.length > 0) {
    safetyText += `Contraindications: ${aiContext.contraindications.join(
      ", "
    )}\n`;
  }

  if (safety.emergencyContact.name) {
    safetyText += `Emergency Contact: ${safety.emergencyContact.name} (${safety.emergencyContact.phone})\n`;
  }

  safetyText += `Risk Level: ${aiContext.riskLevel.toUpperCase()}`;

  return safetyText;
}

function generateAIInstructions(processedData: ProcessedUserData): string {
  const { aiContext } = processedData;

  let instructions = `AI Instructions:
- Complexity Score: ${aiContext.complexityScore}/100
- Risk Level: ${aiContext.riskLevel}
- Focus Areas: ${aiContext.focusAreas.join(", ")}`;

  if (aiContext.recommendations.length > 0) {
    instructions += `\n- Key Recommendations: ${aiContext.recommendations.join(
      ", "
    )}`;
  }

  if (aiContext.contraindications.length > 0) {
    instructions += `\n- Avoid: ${aiContext.contraindications.join(", ")}`;
  }

  return instructions;
}

// ============================================================================
// PROMPT GENERATION
// ============================================================================

function determinePromptType(
  processedData: ProcessedUserData,
  request: any
): "basic" | "comprehensive" | "goalAware" | "queryBased" {
  // If user has a specific query, use query-based
  if (request.userQuery) {
    return "queryBased";
  }

  // If user has specific goals, use goal-aware
  if (request.userGoal || processedData.goals.primary.length > 0) {
    return "goalAware";
  }

  // If high complexity, use comprehensive
  if (processedData.aiContext.complexityScore > 60) {
    return "comprehensive";
  }

  // Default to basic
  return "basic";
}

function generatePrompt(
  processedData: ProcessedUserData,
  aiContext: any,
  promptType: string,
  userQuery?: string
) {
  const model = selectModel(processedData.aiContext.complexityScore);
  const maxTokens = calculateMaxTokens(processedData.aiContext.complexityScore);

  let systemPrompt = "";
  let userPrompt = "";

  switch (promptType) {
    case "comprehensive":
      systemPrompt = `You are Dr. Sarah Chen, a Master Health AI Specialist with 20+ years of experience in clinical nutrition, exercise physiology, and evidence-based health optimization.

CORE PRINCIPLES:
- Create scientifically-proven protocols that are safe and effective
- Personalize every recommendation based on individual data
- Focus on root causes, not just symptoms
- Integrate nutrition, movement, sleep, stress, and mindset holistically
- Provide actionable, time-stamped daily protocols

SAFETY MANDATE: Every recommendation must be evidence-based and safe. Never suggest anything that could cause harm.

OUTPUT REQUIREMENT: Return ONLY valid JSON without markdown, explanations, or additional text.`;

      userPrompt = `Create a hyper-personalized 2-day health optimization protocol for:

USER PROFILE:
${aiContext.userSummary}

HEALTH PROFILE:
${aiContext.healthProfile}

GOALS & PREFERENCES:
${aiContext.goalsAndPreferences}

SCHEDULE CONSTRAINTS:
${aiContext.scheduleConstraints}

SAFETY CONSIDERATIONS:
${aiContext.safetyConsiderations}

REQUIREMENTS:
1. Create time-stamped daily protocols with specific activities
2. Include evidence-based nutrition with meal sequencing
3. Add movement protocols adapted to their fitness level
4. Integrate circadian optimization and stress management
5. Include small hacks that enhance results
6. Make it culturally appropriate and geographically relevant
7. Ensure progressive difficulty and built-in adaptability

Return comprehensive plan in this JSON structure:
{
  "day1": {
    "date": "YYYY-MM-DD",
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
  "day2": { /* same structure as day1 */ },
  "overallGoals": ["Specific goal 1", "Specific goal 2", "Specific goal 3"],
  "progressTips": ["Detailed tip 1", "Detailed tip 2", "Detailed tip 3"]
}`;
      break;

    case "goalAware":
      systemPrompt = `You are Dr. Sarah Chen, a health expert who creates personalized, goal-aware health plans. Always respond with valid JSON in the exact format requested.

GOAL-AWARE PLANNING PRINCIPLES:
1. **Goal Alignment**: Every activity must directly support at least one of the user's health goals
2. **Impact Scoring**: Assign impact scores (0-1) to each activity based on how much it contributes to goal progress
3. **Compliance Weighting**: Assign compliance weights (0-1) based on how critical each activity is for goal success
4. **Timeline Integration**: Consider the user's timeline preferences when setting activity intensity
5. **Barrier Awareness**: Design activities that work around or address the user's identified barriers
6. **Priority-Based Planning**: Focus more activities on higher-priority goals`;

      userPrompt = `Create a comprehensive, goal-aware 2-day health plan that directly supports the user's specific health goals.

USER PROFILE:
${aiContext.userSummary}

HEALTH PROFILE:
${aiContext.healthProfile}

GOALS & PREFERENCES:
${aiContext.goalsAndPreferences}

SCHEDULE CONSTRAINTS:
${aiContext.scheduleConstraints}

SAFETY CONSIDERATIONS:
${aiContext.safetyConsiderations}

AI INSTRUCTIONS:
${aiContext.aiInstructions}

Each activity must include: relatedGoals (array of goal IDs), impactScore (0-1), complianceWeight (0-1)
Activities should be realistic and achievable within the user's schedule
Include specific instructions and tips for each activity
Consider the user's fitness level, health conditions, and lifestyle factors

Return a JSON object with this exact structure:
{
  "day1": {
    "date": "YYYY-MM-DD",
    "activities": [
      {
        "id": "unique-activity-id",
        "type": "workout|meal|hydration|sleep|meditation|break|other",
        "title": "Activity Title",
        "description": "Detailed description",
        "startTime": "HH:MM",
        "endTime": "HH:MM",
        "duration": minutes,
        "priority": "high|medium|low",
        "category": "category name",
        "instructions": ["step 1", "step 2"],
        "tips": ["tip 1", "tip 2"],
        "relatedGoals": ["goal-id-1", "goal-id-2"],
        "impactScore": 0.8,
        "complianceWeight": 0.9
      }
    ],
    "summary": {
      "totalActivities": number,
      "workoutTime": minutes,
      "mealCount": number,
      "sleepHours": number,
      "focusAreas": ["area1", "area2"],
      "goalContributions": {
        "goal-id": {
          "activities": number,
          "totalImpact": number,
          "expectedProgress": number
        }
      }
    }
  },
  "day2": { /* same structure as day1 */ },
  "overallGoals": ["goal summary 1", "goal summary 2"],
  "progressTips": ["tip 1", "tip 2"],
  "goalAlignment": {
    "goal-id": {
      "goal": { /* full goal object */ },
      "activities": number,
      "expectedWeeklyProgress": number,
      "timelineAlignment": "on_track|ahead|behind"
    }
  }
}`;
      break;

    default:
      systemPrompt = `You are a professional health coach and nutritionist. Create personalized, evidence-based health plans that are safe and effective.`;
      userPrompt = `Create a personalized 2-day health plan for this user.`;
  }

  return {
    model,
    maxTokens,
    temperature: 0.3,
    systemPrompt,
    userPrompt,
  };
}

function selectModel(complexityScore: number): string {
  if (complexityScore > 70) return "gpt-4o";
  if (complexityScore > 40) return "gpt-4o-mini";
  return "gpt-3.5-turbo";
}

function calculateMaxTokens(complexityScore: number): number {
  if (complexityScore > 70) return 4000;
  if (complexityScore > 40) return 3000;
  return 2000;
}

// ============================================================================
// AI SERVICE CALL
// ============================================================================

async function callAIService(prompt: any): Promise<any> {
  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${Deno.env.get("OPENAI_API_KEY")}`,
    },
    body: JSON.stringify({
      model: prompt.model,
      messages: [
        { role: "system", content: prompt.systemPrompt },
        { role: "user", content: prompt.userPrompt },
      ],
      max_tokens: prompt.maxTokens,
      temperature: prompt.temperature,
    }),
  });

  if (!response.ok) {
    throw new Error(
      `OpenAI API error: ${response.status} ${response.statusText}`
    );
  }

  return await response.json();
}

// ============================================================================
// RESPONSE PROCESSING
// ============================================================================

function processAIResponse(
  aiResponse: any,
  processedData: ProcessedUserData
): any {
  const content = aiResponse.choices[0]?.message?.content;

  if (!content) {
    throw new Error("No content received from AI");
  }

  try {
    // Clean and parse JSON response
    let cleanContent = content.trim();

    // Remove markdown code blocks if present
    if (cleanContent.startsWith("```json")) {
      cleanContent = cleanContent
        .replace(/^```json\s*/, "")
        .replace(/\s*```$/, "");
    } else if (cleanContent.startsWith("```")) {
      cleanContent = cleanContent.replace(/^```\s*/, "").replace(/\s*```$/, "");
    }

    // Try to find JSON object in the content
    const jsonMatch = cleanContent.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      cleanContent = jsonMatch[0];
    }

    const plan = JSON.parse(cleanContent);

    // Add metadata
    plan._metadata = {
      generatedAt: new Date().toISOString(),
      complexityScore: processedData.aiContext.complexityScore,
      riskLevel: processedData.aiContext.riskLevel,
      focusAreas: processedData.aiContext.focusAreas,
    };

    return plan;
  } catch (parseError) {
    console.error("Failed to parse AI response:", parseError);
    throw new Error(`Invalid response format from AI: ${parseError.message}`);
  }
}

// ============================================================================
// DATABASE OPERATIONS
// ============================================================================

async function saveHealthPlan(
  plan: any,
  userId: string,
  supabaseClient: any
): Promise<any> {
  const today = new Date();
  const day1 = new Date(today);
  const day2 = new Date(today);
  day2.setDate(day2.getDate() + 1);

  const planData = {
    user_id: userId,
    plan_start_date: day1.toISOString().split("T")[0],
    plan_end_date: day2.toISOString().split("T")[0],
    day_1_plan: plan.day1,
    day_2_plan: plan.day2,
    day_1_completed: false,
    day_2_completed: false,
    progress_data: {
      overallGoals: plan.overallGoals || [],
      progressTips: plan.progressTips || [],
      goalAlignment: plan.goalAlignment || {},
      metadata: plan._metadata || {},
    },
    generated_at: new Date().toISOString(),
    is_active: true,
  };

  const { data, error } = await supabaseClient
    .from("two_day_health_plans")
    .insert(planData)
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to save health plan: ${error.message}`);
  }

  return data;
}
