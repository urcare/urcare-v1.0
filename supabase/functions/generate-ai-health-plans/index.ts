import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface UserProfile {
  id: string;
  full_name: string;
  age: string;
  gender: string;
  height_cm: string;
  weight_kg: string;
  blood_group: string;
  diet_type: string;
  chronic_conditions: string[];
  health_goals: string[];
  wake_up_time: string;
  sleep_time: string;
  work_start: string;
  work_end: string;
  breakfast_time: string;
  lunch_time: string;
  dinner_time: string;
  workout_time: string;
  workout_type: string;
  routine_flexibility: string;
  smoking: string;
  drinking: string;
  allergies: string[];
  family_history: string[];
  lifestyle: string;
  stress_levels: string;
  mental_health: string;
  hydration_habits: string;
  occupation: string;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: "Missing authorization header" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? "",
      { global: { headers: { Authorization: authHeader } } }
    );

    const { data: { user }, error: userError } = await supabaseClient.auth.getUser();
    if (userError || !user) {
      return new Response(
        JSON.stringify({ error: "Unauthorized" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const { user_profile }: { user_profile: UserProfile } = await req.json();

    // Generate AI health plans using OpenAI
    const openaiApiKey = Deno.env.get("OPENAI_API_KEY");
    if (!openaiApiKey) {
      throw new Error("OpenAI API key not configured");
    }

    const prompt = `Generate 3 personalized health plans for this user:

Name: ${user_profile.full_name}
Age: ${user_profile.age}
Gender: ${user_profile.gender}
Height: ${user_profile.height_cm}cm
Weight: ${user_profile.weight_kg}kg
Health Goals: ${user_profile.health_goals.join(', ')}
Daily Schedule: Wake ${user_profile.wake_up_time}, Sleep ${user_profile.sleep_time}, Work ${user_profile.work_start}-${user_profile.work_end}
Meals: Breakfast ${user_profile.breakfast_time}, Lunch ${user_profile.lunch_time}, Dinner ${user_profile.dinner_time}
Workout: ${user_profile.workout_time} (${user_profile.workout_type})
Lifestyle: ${user_profile.smoking}, ${user_profile.drinking}

Create 3 plans:
1. BEGINNER (12 weeks): "Healthy Habits Beginner Plan" - gentle introduction, focus on consistency
2. INTERMEDIATE (16 weeks): "Heart Health Intermediate Plan" - balanced approach, moderate intensity  
3. ADVANCED (20 weeks): "Cholesterol Control Advanced Plan" - high intensity, maximum results

For each plan include:
- Daily activities with specific timestamps
- Exercise routines with sets/reps
- Nutrition guidelines with macros
- Sleep and hydration schedules
- Expected health improvements

Format the response as JSON with this exact structure:
{
  "success": true,
  "plans": [
    {
      "id": "plan_1",
      "name": "Plan Name",
      "description": "Plan description",
      "difficulty": "beginner|intermediate|advanced",
      "duration_weeks": 12,
      "focus_areas": ["area1", "area2"],
      "expected_outcomes": ["outcome1", "outcome2"],
      "activities": [
        {
          "id": "activity_1",
          "title": "Activity Title",
          "description": "Detailed description",
          "type": "nutrition|exercise|sleep|hydration|meditation|other",
          "scheduled_time": "HH:MM",
          "duration": 30,
          "priority": "high|medium|low",
          "category": "Category",
          "instructions": ["instruction1", "instruction2"],
          "benefits": ["benefit1", "benefit2"],
          "tips": ["tip1", "tip2"],
          "metrics": {
            "calories": 500,
            "protein": 25,
            "carbs": 50,
            "fat": 15,
            "steps": 1000,
            "heart_rate": 120,
            "water_intake": 500
          }
        }
      ],
      "health_metrics": {
        "weight_loss_goal": 5,
        "muscle_gain_goal": 2,
        "fitness_improvement": 20,
        "energy_level": 15,
        "sleep_quality": 10,
        "stress_reduction": 25
      },
      "weekly_schedule": {
        "monday": [/* activities */],
        "tuesday": [/* activities */],
        "wednesday": [/* activities */],
        "thursday": [/* activities */],
        "friday": [/* activities */],
        "saturday": [/* activities */],
        "sunday": [/* activities */]
      }
    }
  ],
  "health_score": {
    "current": 65,
    "projected": 85,
    "improvements": ["improvement1", "improvement2"]
  },
  "personalized_insights": ["insight1", "insight2"]
}

Make sure to:
- Use the user's actual schedule times
- Consider their health goals and conditions
- Provide realistic and achievable activities
- Include specific metrics and measurements
- Make each plan unique and progressively challenging
- Focus on sustainable lifestyle changes
`;

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${openaiApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: "You are an expert health coach. Generate 3 health plans in JSON format."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        max_tokens: 3000,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      console.error("OpenAI API error:", response.status, response.statusText);
      throw new Error(`OpenAI API error: ${response.statusText}`);
    }

    const aiResponse = await response.json();
    const content = aiResponse.choices[0].message.content;
    
    console.log("OpenAI response content:", content);
    
    // Parse the JSON response
    let healthPlans;
    try {
      healthPlans = JSON.parse(content);
    } catch (parseError) {
      console.error("Failed to parse OpenAI response:", parseError);
      console.log("Raw content:", content);
      
      // Return fallback plans if parsing fails
      healthPlans = {
        success: true,
        plans: [
          {
            id: "plan_1",
            name: "Healthy Habits Beginner Plan",
            description: "A 12-week plan focused on building sustainable healthy habits",
            difficulty: "beginner",
            duration_weeks: 12,
            focus_areas: ["nutrition", "exercise", "sleep", "hydration"],
            expected_outcomes: ["Improved energy levels", "Better sleep quality", "Weight management"],
            activities: [
              {
                id: "activity_1",
                title: "Morning Hydration",
                description: "Drink 500ml of water upon waking",
                type: "hydration",
                scheduled_time: user_profile.wake_up_time || "07:00",
                duration: 5,
                priority: "high",
                category: "Hydration",
                instructions: ["Drink water immediately after waking", "Add lemon for better absorption"],
                benefits: ["Boosts metabolism", "Improves brain function"],
                tips: ["Keep water by bedside", "Set phone reminder"]
              }
            ],
            health_metrics: {
              weight_loss_goal: 5,
              muscle_gain_goal: 2,
              fitness_improvement: 20,
              energy_level: 15,
              sleep_quality: 10,
              stress_reduction: 25
            },
            weekly_schedule: {}
          },
          {
            id: "plan_2", 
            name: "Heart Health Intermediate Plan",
            description: "A 16-week balanced approach with moderate intensity",
            difficulty: "intermediate",
            duration_weeks: 16,
            focus_areas: ["nutrition", "exercise", "stress management", "heart health"],
            expected_outcomes: ["Increased strength", "Better endurance", "Improved body composition"],
            activities: [
              {
                id: "activity_2",
                title: "Cardio Workout",
                description: "30 minutes of moderate cardio exercise",
                type: "exercise",
                scheduled_time: user_profile.workout_time || "18:00",
                duration: 30,
                priority: "high",
                category: "Exercise",
                instructions: ["Warm up for 5 minutes", "Maintain moderate intensity", "Cool down for 5 minutes"],
                benefits: ["Improves heart health", "Burns calories"],
                tips: ["Choose activities you enjoy", "Track your heart rate"]
              }
            ],
            health_metrics: {
              weight_loss_goal: 8,
              muscle_gain_goal: 4,
              fitness_improvement: 35,
              energy_level: 25,
              sleep_quality: 15,
              stress_reduction: 30
            },
            weekly_schedule: {}
          },
          {
            id: "plan_3",
            name: "Cholesterol Control Advanced Plan", 
            description: "A 20-week high-intensity plan for maximum results",
            difficulty: "advanced",
            duration_weeks: 20,
            focus_areas: ["nutrition", "exercise", "advanced training", "cholesterol management"],
            expected_outcomes: ["Dramatic body transformation", "Elite fitness level", "Optimal health"],
            activities: [
              {
                id: "activity_3",
                title: "High-Intensity Training",
                description: "45 minutes of high-intensity interval training",
                type: "exercise",
                scheduled_time: user_profile.workout_time || "18:00",
                duration: 45,
                priority: "high",
                category: "Exercise",
                instructions: ["Warm up for 10 minutes", "Alternate high/low intensity", "Cool down for 10 minutes"],
                benefits: ["Maximizes fat burn", "Improves cardiovascular fitness"],
                tips: ["Push your limits safely", "Track progress weekly"]
              }
            ],
            health_metrics: {
              weight_loss_goal: 12,
              muscle_gain_goal: 6,
              fitness_improvement: 50,
              energy_level: 35,
              sleep_quality: 20,
              stress_reduction: 40
            },
            weekly_schedule: {}
          }
        ],
        health_score: {
          current: 65,
          projected: 85,
          improvements: ["Better nutrition habits", "Regular exercise routine", "Improved sleep schedule"]
        },
        personalized_insights: [
          "Focus on consistent meal timing",
          "Include 30 minutes of daily exercise", 
          "Maintain regular sleep schedule"
        ]
      };
    }

    return new Response(
      JSON.stringify(healthPlans),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error("Error generating health plans:", error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error instanceof Error ? error.message : "Failed to generate health plans" 
      }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});


