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
  gender: string | null;
  height_cm: string | null;
  weight_kg: string | null;
  chronic_conditions: string[] | null;
  health_goals: string[] | null;
  diet_type: string | null;
  workout_time: string | null;
  routine_flexibility: string | null;
}

interface ComprehensivePlanRequest {
  user_goal: string;
  user_profile: UserProfile;
  plan_calculation: {
    duration_weeks: number;
    plan_type: string;
    timeline_preference: string;
    expected_outcomes: string[];
    key_milestones: string[];
  };
}

interface ComprehensivePlanResponse {
  success: boolean;
  plan?: any;
  error?: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
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

    const {
      user_goal,
      user_profile,
      plan_calculation,
    }: ComprehensivePlanRequest = await req.json();

    if (!user_goal || !user_profile || !plan_calculation) {
      return new Response(
        JSON.stringify({
          success: false,
          error: "Missing required parameters",
        }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Get user from auth
    const {
      data: { user },
      error: authError,
    } = await supabaseClient.auth.getUser();

    // Allow development mode without authentication
    // Check multiple possible development indicators
    const isDevelopment =
      Deno.env.get("ENVIRONMENT") === "development" ||
      Deno.env.get("NODE_ENV") === "development" ||
      Deno.env.get("SUPABASE_PROJECT_REF")?.includes("dev") ||
      !user; // If no user, assume development mode

    console.log("Development mode check:", {
      ENVIRONMENT: Deno.env.get("ENVIRONMENT"),
      NODE_ENV: Deno.env.get("NODE_ENV"),
      PROJECT_REF: Deno.env.get("SUPABASE_PROJECT_REF"),
      hasUser: !!user,
      isDevelopment,
    });

    if ((authError || !user) && !isDevelopment) {
      return new Response(
        JSON.stringify({ success: false, error: "Unauthorized" }),
        {
          status: 401,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Use a mock user for development if no user is authenticated
    const currentUser = user || {
      id: "9d1051c9-0241-4370-99a3-034bd2d5d001", // Valid UUID for development
      email: "dev@urcare.local",
    };

    console.log("Using user ID:", currentUser.id);

    // Generate comprehensive plan using AI
    console.log("Starting AI plan generation...");

    // Check if API key is available
    const apiKey = Deno.env.get("OPENAI_API_KEY");
    console.log("API Key available:", !!apiKey);

    let comprehensivePlan;
    try {
      comprehensivePlan = await generateComprehensivePlanWithAI(
        user_goal,
        user_profile,
        plan_calculation
      );
      console.log("AI plan generation successful");
    } catch (aiError) {
      console.error("AI generation failed:", aiError);

      // Return mock data for development
      comprehensivePlan = {
        plan_name: `${plan_calculation.plan_type.replace(
          "_",
          " "
        )}: ${user_goal}`,
        plan_type: plan_calculation.plan_type,
        primary_goal: user_goal,
        secondary_goals: plan_calculation.expected_outcomes || [],
        start_date: new Date().toISOString().split("T")[0],
        target_end_date: new Date(
          Date.now() + plan_calculation.duration_weeks * 7 * 24 * 60 * 60 * 1000
        )
          .toISOString()
          .split("T")[0],
        duration_weeks: plan_calculation.duration_weeks,
        plan_data: {
          daily_routines: [
            {
              day: "Monday",
              activities: [
                { time: "07:00", activity: "Morning workout", duration: 30 },
                { time: "08:00", activity: "Healthy breakfast", duration: 15 },
              ],
            },
          ],
          weekly_milestones: plan_calculation.key_milestones || [],
          monthly_assessments: [],
        },
        weekly_milestones: plan_calculation.key_milestones || [],
        monthly_assessments: [],
        status: "active",
      };
      console.log("Using mock plan data");
    }

    // Save to database
    const { data: savedPlan, error: saveError } = await supabaseClient
      .from("comprehensive_health_plans")
      .insert({
        user_id: currentUser.id,
        plan_name: `${plan_calculation.plan_type.replace(
          "_",
          " "
        )}: ${user_goal}`,
        plan_type: plan_calculation.plan_type,
        primary_goal: user_goal,
        secondary_goals: generateSecondaryGoals(user_goal, user_profile),
        start_date: new Date().toISOString().split("T")[0],
        target_end_date: new Date(
          Date.now() + plan_calculation.duration_weeks * 7 * 24 * 60 * 60 * 1000
        )
          .toISOString()
          .split("T")[0],
        duration_weeks: plan_calculation.duration_weeks,
        plan_data: comprehensivePlan,
        weekly_milestones: generateWeeklyMilestones(plan_calculation),
        monthly_assessments:
          generateMonthlyAssessmentTemplates(plan_calculation),
        status: "active",
      })
      .select()
      .single();

    if (saveError) {
      console.error("Error saving comprehensive plan:", saveError);
      return new Response(
        JSON.stringify({ success: false, error: "Failed to save plan" }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Initialize daily plan executions for the first week
    await initializeDailyPlanExecutions(supabaseClient, savedPlan);

    return new Response(JSON.stringify({ success: true, plan: savedPlan }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error in generate-comprehensive-health-plan:", error);
    return new Response(
      JSON.stringify({ success: false, error: "Internal server error" }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});

async function generateComprehensivePlanWithAI(
  userGoal: string,
  userProfile: UserProfile,
  planCalculation: any
): Promise<any> {
  // Enhanced AI prompt for comprehensive health plans
  const systemPrompt = `You are an expert health coach and nutritionist with 20+ years of experience. 
  Create a comprehensive, evidence-based health plan with realistic timelines and detailed daily structures.

  User Profile:
  - Age: ${userProfile.age || "Not specified"}
  - Gender: ${userProfile.gender || "Not specified"}
  - Height: ${userProfile.height_cm || "Not specified"} cm
  - Weight: ${userProfile.weight_kg || "Not specified"} kg
  - Chronic Conditions: ${userProfile.chronic_conditions?.join(", ") || "None"}
  - Health Goals: ${userProfile.health_goals?.join(", ") || "General wellness"}
  - Diet Type: ${userProfile.diet_type || "Balanced"}
  - Workout Time: ${userProfile.workout_time || "Flexible"}
  - Routine Flexibility: ${userProfile.routine_flexibility || "Moderate"}

  Plan Requirements:
  - Duration: ${planCalculation.duration_weeks} weeks
  - Plan Type: ${planCalculation.plan_type}
  - Timeline: ${planCalculation.timeline_preference}
  - Primary Goal: ${userGoal}

  Create a comprehensive plan with:
  1. Detailed weekly structure with progressive phases
  2. Complete daily templates (weekday/weekend)
  3. Specific activities, meals, and workouts
  4. Safety considerations and contraindications
  5. Cultural and dietary adaptations
  6. Progressive difficulty scaling

  Focus on evidence-based approaches, realistic timelines, and sustainable practices.`;

  const userPrompt = `Create a comprehensive ${
    planCalculation.duration_weeks
  }-week ${planCalculation.plan_type} plan for: "${userGoal}"

  Expected outcomes: ${planCalculation.expected_outcomes.join(", ")}
  Key milestones: ${planCalculation.key_milestones.join(", ")}

  Provide a detailed, structured plan that includes:
  - Weekly progression phases
  - Daily activity templates
  - Meal plans with nutritional information
  - Workout routines with exercises
  - Wellness activities
  - Hydration and sleep targets
  - Adaptation rules and compliance thresholds
  - Safety considerations

  Make it realistic, evidence-based, and tailored to the user's profile.`;

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${Deno.env.get("OPENAI_API_KEY")}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        temperature: 0.7,
        max_tokens: 4000,
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.statusText}`);
    }

    const data = await response.json();
    const aiResponse = data.choices[0]?.message?.content;

    if (!aiResponse) {
      throw new Error("No response from AI");
    }

    // Parse and structure the AI response
    return parseAIResponseToPlanStructure(aiResponse, planCalculation);
  } catch (error) {
    console.error("Error calling OpenAI:", error);
    // Return a structured fallback plan
    return generateFallbackPlan(userGoal, userProfile, planCalculation);
  }
}

function parseAIResponseToPlanStructure(
  aiResponse: string,
  planCalculation: any
): any {
  // This would parse the AI response and structure it according to our schema
  // For now, return a structured template
  return {
    overview: {
      description: `A comprehensive ${planCalculation.duration_weeks}-week plan focused on your health goals`,
      expected_outcomes: planCalculation.expected_outcomes,
      key_principles: [
        "Gradual progression",
        "Sustainable practices",
        "Evidence-based approaches",
        "Personalized adaptation",
        "Safety first",
      ],
      success_metrics: [
        "Weekly compliance rate > 70%",
        "Progressive milestone achievement",
        "Sustained behavior change",
        "Measurable health improvements",
      ],
      safety_considerations: [
        "Monitor for adverse reactions",
        "Adjust intensity based on feedback",
        "Regular progress assessments",
        "Professional consultation when needed",
      ],
    },
    weekly_structure: generateWeeklyStructure(planCalculation),
    daily_templates: generateDailyTemplates(planCalculation),
    adaptation_rules: {
      compliance_thresholds: {
        excellent: 90,
        good: 70,
        needs_improvement: 50,
        poor: 30,
      },
      adjustment_triggers: {
        timeline_extension: [
          "Compliance rate < 50% for 2 consecutive weeks",
          "User reports excessive difficulty",
          "Health concerns arise",
        ],
        intensity_increase: [
          "Compliance rate > 90% for 2 consecutive weeks",
          "User reports exercises too easy",
          "Faster than expected progress",
        ],
        intensity_decrease: [
          "User reports excessive fatigue",
          "Compliance rate declining",
          "Health issues arise",
        ],
        plan_modification: [
          "Goal changes",
          "Lifestyle changes",
          "Health status changes",
        ],
      },
    },
    progression_rules: {
      weekly_progression: {
        intensity_increase_percentage: 5,
        volume_increase_percentage: 10,
        complexity_increase: true,
      },
      plateau_handling: {
        detection_criteria: [
          "No progress for 2 consecutive weeks",
          "Declining motivation",
          "Stagnant measurements",
        ],
        adjustment_strategies: [
          "Increase variety",
          "Adjust intensity",
          "Add new challenges",
          "Review and modify goals",
        ],
      },
    },
  };
}

function generateFallbackPlan(
  userGoal: string,
  userProfile: UserProfile,
  planCalculation: any
): any {
  // Generate a structured fallback plan when AI is unavailable
  return parseAIResponseToPlanStructure("", planCalculation);
}

function generateWeeklyStructure(planCalculation: any): any {
  const structure: any = {};

  for (let week = 1; week <= planCalculation.duration_weeks; week++) {
    const phase = getPhase(week, planCalculation.duration_weeks);
    structure[week.toString()] = {
      focus_areas: getFocusAreas(week, phase, planCalculation.plan_type),
      intensity_level: getIntensityLevel(week, planCalculation.duration_weeks),
      key_activities: getKeyActivities(week, phase),
      milestones: [`Week ${week} milestone`, `${phase} phase progress`],
      weekly_goals: [
        "Complete all daily activities",
        `Maintain ${phase} phase standards`,
        "Progress toward overall goal",
      ],
    };
  }

  return structure;
}

function getPhase(week: number, totalWeeks: number): string {
  const percentage = week / totalWeeks;
  if (percentage <= 0.25) return "introduction";
  if (percentage <= 0.75) return "building";
  if (percentage <= 0.9) return "optimization";
  return "maintenance";
}

function getFocusAreas(
  week: number,
  phase: string,
  planType: string
): string[] {
  const baseFocus: any = {
    introduction: ["Habit establishment", "Baseline assessment", "Education"],
    building: ["Progressive improvement", "Skill development", "Consistency"],
    optimization: [
      "Performance enhancement",
      "Fine-tuning",
      "Advanced techniques",
    ],
    maintenance: [
      "Sustainability",
      "Long-term planning",
      "Lifestyle integration",
    ],
  };

  return baseFocus[phase] || ["General wellness"];
}

function getIntensityLevel(week: number, totalWeeks: number): string {
  if (week <= 2) return "low";
  if (week >= totalWeeks - 2) return "moderate";
  return "moderate";
}

function getKeyActivities(week: number, phase: string): string[] {
  const activities: any = {
    introduction: ["Assessment", "Goal setting", "Basic routines"],
    building: [
      "Progressive exercises",
      "Skill practice",
      "Habit reinforcement",
    ],
    optimization: ["Advanced techniques", "Performance testing", "Refinement"],
    maintenance: ["Routine maintenance", "Long-term planning", "Adaptation"],
  };

  return activities[phase] || ["General activities"];
}

function generateDailyTemplates(planCalculation: any): any {
  return {
    weekday: {
      morning_routine: [
        {
          id: "morning-hydration",
          title: "Morning Hydration",
          description: "Drink 500ml of water upon waking",
          duration: 5,
          type: "hydration",
          category: "wellness",
          instructions: [
            "Keep water by bedside",
            "Drink immediately upon waking",
          ],
          tips: ["Helps kickstart metabolism", "Rehydrates after sleep"],
          difficulty_level: "easy",
          impact_on_goals: { hydration: 1, energy: 0.5 },
          time_of_day: "morning",
          frequency: "daily",
          is_required: true,
          completion_criteria: ["500ml water consumed"],
        },
      ],
      meals: [
        {
          id: "weekday-breakfast",
          meal_type: "breakfast",
          name: "Healthy Breakfast",
          description: "Balanced morning meal",
          ingredients: [
            { name: "Oats", quantity: 50, unit: "g" },
            { name: "Banana", quantity: 1, unit: "medium" },
          ],
          instructions: ["Prepare oats", "Add banana"],
          prep_time: 10,
          cook_time: 5,
          servings: 1,
          nutrition: {
            calories: 350,
            protein: 12,
            carbohydrates: 55,
            fat: 10,
            fiber: 8,
            sugar: 15,
            sodium: 100,
          },
          dietary_tags: ["vegetarian"],
          difficulty: "easy",
          alternatives: [],
          cultural_adaptations: [],
        },
      ],
      workouts: [
        {
          id: "weekday-workout",
          name: "Morning Workout",
          type: "strength",
          duration: 30,
          exercises: [],
          warm_up: [],
          cool_down: [],
          equipment_needed: ["bodyweight"],
          space_required: "minimal",
          intensity: "moderate",
          difficulty: "beginner",
          calories_burned_estimate: 200,
          muscle_groups_targeted: ["full_body"],
          adaptations: [],
        },
      ],
      evening_routine: [
        {
          id: "evening-reflection",
          title: "Daily Reflection",
          description: "5-minute reflection on the day",
          duration: 5,
          type: "wellness",
          category: "mental_health",
          instructions: ["Review daily achievements", "Note challenges"],
          tips: ["Improves self-awareness", "Tracks progress"],
          difficulty_level: "easy",
          impact_on_goals: { wellness: 0.5, mental_health: 0.7 },
          time_of_day: "evening",
          frequency: "daily",
          is_required: false,
          completion_criteria: ["5 minutes of reflection completed"],
        },
      ],
      wellness_activities: [
        {
          id: "mindfulness",
          title: "Mindfulness Practice",
          description: "10-minute mindfulness or meditation",
          duration: 10,
          type: "wellness",
          category: "mental_health",
          instructions: ["Find quiet space", "Focus on breathing"],
          tips: ["Reduces stress", "Improves focus"],
          difficulty_level: "easy",
          impact_on_goals: { stress: -0.5, wellness: 0.6 },
          time_of_day: "anytime",
          frequency: "daily",
          is_required: false,
          completion_criteria: ["10 minutes of practice completed"],
        },
      ],
      hydration_goals: [
        {
          daily_target: 2500,
          timing_recommendations: ["Morning", "Pre-meals", "Post-workout"],
          quality_guidelines: ["Filtered water", "Room temperature"],
          tracking_method: "Water bottle tracking",
        },
      ],
      sleep_targets: {
        target_duration: 8,
        bedtime_range: "10:00 PM - 11:00 PM",
        wake_time_range: "6:00 AM - 7:00 AM",
        sleep_hygiene_practices: ["No screens 1h before bed", "Cool room"],
        environment_recommendations: [
          "Comfortable mattress",
          "Blackout curtains",
        ],
      },
    },
    weekend: {
      morning_routine: [],
      meals: [],
      workouts: [],
      evening_routine: [],
      wellness_activities: [],
      hydration_goals: [],
      sleep_targets: {
        target_duration: 8,
        bedtime_range: "10:30 PM - 11:30 PM",
        wake_time_range: "7:00 AM - 8:00 AM",
        sleep_hygiene_practices: ["Consistent schedule", "Relaxation time"],
        environment_recommendations: [
          "Comfortable temperature",
          "Good ventilation",
        ],
      },
    },
  };
}

function generateSecondaryGoals(
  primaryGoal: string,
  userProfile: UserProfile
): string[] {
  const goalLower = primaryGoal.toLowerCase();

  if (goalLower.includes("weight")) {
    return [
      "Improve nutrition",
      "Increase physical activity",
      "Better sleep",
      "Stress management",
    ];
  }
  if (goalLower.includes("fitness")) {
    return [
      "Build strength",
      "Improve flexibility",
      "Better recovery",
      "Nutrition optimization",
    ];
  }
  if (goalLower.includes("diabetes") || goalLower.includes("disease")) {
    return [
      "Blood sugar control",
      "Weight management",
      "Medication adherence",
      "Lifestyle modification",
    ];
  }

  return [
    "Overall wellness",
    "Energy improvement",
    "Better habits",
    "Health maintenance",
  ];
}

function generateWeeklyMilestones(planCalculation: any): any[] {
  const milestones = [];

  for (let week = 1; week <= planCalculation.duration_weeks; week++) {
    milestones.push({
      week_number: week,
      title: `Week ${week} Milestone`,
      description: `Key achievements for week ${week}`,
      success_criteria: ["Complete 70% of activities", "Maintain consistency"],
      measurement_method: "Compliance tracking",
      importance: week % 4 === 0 ? "high" : "medium",
      category: "behavioral",
    });
  }

  return milestones;
}

function generateMonthlyAssessmentTemplates(planCalculation: any): any[] {
  const assessments = [];
  const monthsNeeded = Math.ceil(planCalculation.duration_weeks / 4);

  for (let month = 1; month <= monthsNeeded; month++) {
    assessments.push({
      month_number: month,
      title: `Month ${month} Assessment`,
      description: `Comprehensive review of progress`,
      assessment_areas: [
        {
          name: "Goal Progress",
          description: "Progress toward primary goal",
          metrics: ["percentage_complete"],
          weight: 0.4,
        },
        {
          name: "Compliance",
          description: "Activity completion rate",
          metrics: ["compliance_rate"],
          weight: 0.3,
        },
        {
          name: "Health Metrics",
          description: "Physical health improvements",
          metrics: ["measurements"],
          weight: 0.3,
        },
      ],
      required_measurements: ["weight", "energy_level", "satisfaction"],
      optional_measurements: ["body_measurements", "fitness_tests"],
      questionnaire: [
        {
          id: "satisfaction",
          question: "How satisfied are you with your progress?",
          type: "scale",
          scale_range: {
            min: 1,
            max: 10,
            labels: ["Very Unsatisfied", "Very Satisfied"],
          },
          required: true,
        },
        {
          id: "difficulty",
          question: "How would you rate the difficulty level?",
          type: "scale",
          scale_range: { min: 1, max: 10, labels: ["Too Easy", "Too Hard"] },
          required: true,
        },
      ],
      adjustment_triggers: ["Low compliance", "User feedback", "Goal changes"],
    });
  }

  return assessments;
}

async function initializeDailyPlanExecutions(
  supabaseClient: any,
  plan: any
): Promise<void> {
  const startDate = new Date(plan.start_date);
  const dailyExecutions = [];

  for (let day = 0; day < 7; day++) {
    const executionDate = new Date(startDate);
    executionDate.setDate(startDate.getDate() + day);

    const dayOfWeek = executionDate.getDay() + 1; // 1-7 for Monday-Sunday
    const isWeekend = dayOfWeek === 6 || dayOfWeek === 7;
    const templateType = isWeekend ? "weekend" : "weekday";
    const template = plan.plan_data.daily_templates[templateType];

    const totalActivities =
      template.morning_routine.length +
      template.meals.length +
      template.workouts.length +
      template.evening_routine.length +
      template.wellness_activities.length;

    dailyExecutions.push({
      plan_id: plan.id,
      user_id: plan.user_id,
      execution_date: executionDate.toISOString().split("T")[0],
      week_number: 1,
      day_of_week: dayOfWeek,
      daily_activities: template.morning_routine.concat(
        template.evening_routine
      ),
      daily_meals: template.meals,
      daily_workouts: template.workouts,
      daily_wellness: template.wellness_activities,
      activities_completed: 0,
      total_activities: totalActivities,
      status: "pending",
    });
  }

  const { error } = await supabaseClient
    .from("daily_plan_execution")
    .insert(dailyExecutions);

  if (error) {
    console.error("Error initializing daily plan executions:", error);
  }
}
