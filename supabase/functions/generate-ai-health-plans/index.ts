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

    const prompt = `
You are an expert health coach and nutritionist. Generate 3 personalized health plans for the following user profile:

USER PROFILE:
- Name: ${user_profile.full_name}
- Age: ${user_profile.age}
- Gender: ${user_profile.gender}
- Height: ${user_profile.height_cm}cm
- Weight: ${user_profile.weight_kg}kg
- Blood Group: ${user_profile.blood_group}
- Diet Type: ${user_profile.diet_type}
- Health Goals: ${user_profile.health_goals.join(', ')}
- Chronic Conditions: ${user_profile.chronic_conditions.join(', ')}
- Daily Schedule:
  - Wake up: ${user_profile.wake_up_time}
  - Sleep: ${user_profile.sleep_time}
  - Work: ${user_profile.work_start} - ${user_profile.work_end}
  - Meals: Breakfast ${user_profile.breakfast_time}, Lunch ${user_profile.lunch_time}, Dinner ${user_profile.dinner_time}
  - Workout: ${user_profile.workout_time} (${user_profile.workout_type})
- Lifestyle: ${user_profile.smoking}, ${user_profile.drinking}
- Routine Flexibility: ${user_profile.routine_flexibility}/10

Generate 3 health plans with different difficulty levels:

1. BEGINNER PLAN (12 weeks):
   - Focus on building healthy habits
   - Gentle introduction to exercise and nutrition
   - Emphasis on consistency over intensity

2. INTERMEDIATE PLAN (16 weeks):
   - Balanced approach with moderate intensity
   - More structured workout routines
   - Advanced nutrition strategies

3. ADVANCED PLAN (20 weeks):
   - High-intensity training and strict nutrition
   - Advanced techniques and optimization
   - Maximum results in shortest time

For each plan, provide:
- Detailed daily activities with specific timestamps
- Nutritional guidelines with macro breakdowns
- Exercise routines with sets/reps/duration
- Sleep optimization strategies
- Hydration schedules
- Stress management techniques
- Weekly progress metrics
- Expected health score improvements

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
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content: "You are an expert health coach and nutritionist with 20+ years of experience. Provide detailed, personalized health plans based on user data."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        max_tokens: 4000,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.statusText}`);
    }

    const aiResponse = await response.json();
    const content = aiResponse.choices[0].message.content;
    
    // Parse the JSON response
    const healthPlans = JSON.parse(content);

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


