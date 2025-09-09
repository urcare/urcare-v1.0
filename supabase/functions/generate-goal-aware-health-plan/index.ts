import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface HealthGoal {
  id: string;
  goal_type: string;
  title: string;
  description?: string;
  target_value: number;
  current_value: number;
  unit: string;
  target_date: string;
  start_date: string;
  timeline_preference: "gradual" | "moderate" | "aggressive";
  calculated_timeline_weeks?: number;
  status: string;
  priority: number;
  barriers: string[];
  milestones: any[];
  progress_percentage: number;
}

interface UserProfile {
  id: string;
  full_name: string;
  age: number;
  gender: string;
  height_cm: string;
  weight_kg: string;
  unit_system: string;
  health_goals: string[];
  diet_type: string;
  chronic_conditions: string[];
  medications: string[];
  wake_up_time: string;
  sleep_time: string;
  work_start: string;
  work_end: string;
  breakfast_time: string;
  lunch_time: string;
  dinner_time: string;
  workout_time: string;
  routine_flexibility: string;
  uses_wearable: string;
  wearable_type: string;
  track_family: string;
  share_progress: string;
  emergency_contact_name: string;
  emergency_contact_phone: string;
  critical_conditions: string;
  has_health_reports: string;
  health_reports: string[];
  referral_code: string;
  onboarding_completed: boolean;
}

interface GoalAwareActivity {
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
  duration: number;
  priority: "high" | "medium" | "low";
  category: string;
  instructions?: string[];
  tips?: string[];
  relatedGoals: string[];
  impactScore: number;
  complianceWeight: number;
}

interface GoalAwareDayPlan {
  date: string;
  activities: GoalAwareActivity[];
  summary: {
    totalActivities: number;
    workoutTime: number;
    mealCount: number;
    sleepHours: number;
    focusAreas: string[];
    goalContributions: {
      [goalId: string]: {
        activities: number;
        totalImpact: number;
        expectedProgress: number;
      };
    };
  };
}

interface GoalAwareTwoDayPlan {
  day1: GoalAwareDayPlan;
  day2: GoalAwareDayPlan;
  overallGoals: string[];
  progressTips: string[];
  goalAlignment: {
    [goalId: string]: {
      goal: HealthGoal;
      activities: number;
      expectedWeeklyProgress: number;
      timelineAlignment: "on_track" | "ahead" | "behind";
    };
  };
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? "",
      {
        global: {
          headers: { Authorization: req.headers.get("Authorization")! },
        },
      }
    );

    const { goals, profile, user_id } = await req.json();

    if (!goals || !profile || !user_id) {
      return new Response(
        JSON.stringify({ success: false, error: "Missing required data" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Generate goal-aware health plan using OpenAI
    const goalAwarePlan = await generateGoalAwareHealthPlan(
      goals,
      profile,
      user_id
    );

    // Save the plan to database
    const { data: planData, error: planError } = await supabaseClient
      .from("two_day_health_plans")
      .insert({
        user_id: user_id,
        plan_start_date: new Date().toISOString().split("T")[0],
        plan_end_date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000)
          .toISOString()
          .split("T")[0],
        day_1_plan: goalAwarePlan.day1,
        day_2_plan: goalAwarePlan.day2,
        day_1_completed: false,
        day_2_completed: false,
        progress_data: {
          goalAlignment: goalAwarePlan.goalAlignment,
          overallGoals: goalAwarePlan.overallGoals,
          progressTips: goalAwarePlan.progressTips,
        },
        is_active: true,
      })
      .select()
      .single();

    if (planError) {
      console.error("Error saving goal-aware plan:", planError);
      return new Response(
        JSON.stringify({ success: false, error: "Failed to save plan" }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    return new Response(
      JSON.stringify({
        success: true,
        plan: planData,
        goalAlignment: goalAwarePlan.goalAlignment,
        overallGoals: goalAwarePlan.overallGoals,
        progressTips: goalAwarePlan.progressTips,
      }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error in generate-goal-aware-health-plan:", error);
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});

async function generateGoalAwareHealthPlan(
  goals: HealthGoal[],
  profile: UserProfile,
  userId: string
): Promise<GoalAwareTwoDayPlan> {
  const openaiApiKey = Deno.env.get("OPENAI_API_KEY");
  if (!openaiApiKey) {
    throw new Error("OpenAI API key not found");
  }

  // Create user data object
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
    preferences: {
      routineFlexibility: profile.routine_flexibility,
      usesWearable: profile.uses_wearable,
      wearableType: profile.wearable_type,
    },
    goals: goals.map((goal) => ({
      id: goal.id,
      type: goal.goal_type,
      title: goal.title,
      description: goal.description,
      currentValue: goal.current_value,
      targetValue: goal.target_value,
      unit: goal.unit,
      timelinePreference: goal.timeline_preference,
      calculatedTimelineWeeks: goal.calculated_timeline_weeks,
      priority: goal.priority,
      barriers: goal.barriers,
      progressPercentage: goal.progress_percentage,
    })),
  };

  const prompt = `You are Dr. Sarah Chen, a certified health coach, nutritionist, and fitness expert with 15+ years of experience. You specialize in creating personalized, goal-aware health plans that adapt to user progress and specific health objectives.

## USER PROFILE & GOALS ANALYSIS
${JSON.stringify(userData, null, 2)}

## YOUR TASK
Create a comprehensive, goal-aware 2-day health plan that directly supports the user's specific health goals. Each activity should be designed to contribute to their goal progress with measurable impact.

## GOAL-AWARE PLANNING PRINCIPLES
1. **Goal Alignment**: Every activity must directly support at least one of the user's health goals
2. **Impact Scoring**: Assign impact scores (0-1) to each activity based on how much it contributes to goal progress
3. **Compliance Weighting**: Assign compliance weights (0-1) based on how critical each activity is for goal success
4. **Timeline Integration**: Consider the user's timeline preferences (gradual/moderate/aggressive) when setting activity intensity
5. **Barrier Awareness**: Design activities that work around or address the user's identified barriers
6. **Priority-Based Planning**: Focus more activities on higher-priority goals

## ACTIVITY REQUIREMENTS
- Each activity must include: relatedGoals (array of goal IDs), impactScore (0-1), complianceWeight (0-1)
- Activities should be realistic and achievable within the user's schedule
- Include specific instructions and tips for each activity
- Consider the user's fitness level, health conditions, and lifestyle factors

## RESPONSE FORMAT
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
}

## SAFETY GUIDELINES
- Always prioritize safety and gradual progression
- Consider any chronic conditions or medications
- Ensure activities are appropriate for the user's fitness level
- Include adequate rest and recovery time
- Provide clear instructions to prevent injury

Generate a comprehensive, goal-aware health plan that will help the user make measurable progress toward their specific health objectives.`;

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${openaiApiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content:
            "You are Dr. Sarah Chen, a health expert who creates personalized, goal-aware health plans. Always respond with valid JSON in the exact format requested.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.7,
      max_tokens: 4000,
    }),
  });

  if (!response.ok) {
    throw new Error(`OpenAI API error: ${response.statusText}`);
  }

  const data = await response.json();
  const content = data.choices[0]?.message?.content;

  if (!content) {
    throw new Error("No content received from OpenAI");
  }

  try {
    const plan = JSON.parse(content);
    return plan;
  } catch (parseError) {
    console.error("Error parsing OpenAI response:", parseError);
    console.error("Raw response:", content);
    throw new Error("Failed to parse health plan response");
  }
}
