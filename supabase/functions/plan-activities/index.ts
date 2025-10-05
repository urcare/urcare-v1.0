import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

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

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? "",
      { global: { headers: { Authorization: authHeader } } }
    );

    const { selectedPlan, userProfile } = await req.json();

    console.log("🔍 Generating activities for plan:", selectedPlan?.title);

    // Get Groq API keys
    const GROQ_API_KEY = Deno.env.get("GROQ_API_KEY");
    const GROQ_API_KEY_2 = Deno.env.get("GROQ_API_KEY_2");

    if (!GROQ_API_KEY) {
      return new Response(
        JSON.stringify({ success: false, error: "Groq API key not configured" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Prepare the prompt for detailed daily schedule generation
    const prompt = `You are a personalized daily schedule architect AI. Create comprehensive, detailed daily schedules with specific food recommendations, meal timings, exercise routines, and lifestyle activities based on the user's complete profile and selected health plan.

Selected Health Plan:
- Title: ${selectedPlan?.title}
- Description: ${selectedPlan?.description}
- Duration: ${selectedPlan?.duration}
- Difficulty: ${selectedPlan?.difficulty}
- Focus Areas: ${selectedPlan?.focusAreas?.join(', ')}
- Equipment: ${selectedPlan?.equipment?.join(', ')}

User Profile:
- Age: ${userProfile?.age || 'Not provided'} years old
- Gender: ${userProfile?.gender || 'Not provided'}
- Height: ${userProfile?.height_cm || 'Not provided'}cm
- Weight: ${userProfile?.weight_kg || 'Not provided'}kg
- Blood Group: ${userProfile?.blood_group || 'Not provided'}
- Health Goals: ${userProfile?.health_goals?.join(', ') || 'Not specified'}
- Diet Type: ${userProfile?.diet_type || 'Not specified'}
- Allergies: ${userProfile?.allergies?.join(', ') || 'None'}
- Workout Time: ${userProfile?.workout_time || 'Not specified'}
- Sleep Schedule: ${userProfile?.wake_up_time || 'Not provided'} to ${userProfile?.sleep_time || 'Not provided'}
- Work Schedule: ${userProfile?.work_start || 'Not provided'} to ${userProfile?.work_end || 'Not provided'}
- Meal Times: Breakfast ${userProfile?.breakfast_time || 'Not provided'}, Lunch ${userProfile?.lunch_time || 'Not provided'}, Dinner ${userProfile?.dinner_time || 'Not provided'}
- Lifestyle: ${userProfile?.lifestyle || 'Not provided'}
- Stress Levels: ${userProfile?.stress_levels || 'Not provided'}
- Occupation: ${userProfile?.occupation || 'Not provided'}

Create detailed daily schedules for each week of the plan. Each day should include:

1. SPECIFIC FOOD RECOMMENDATIONS:
   - Exact breakfast items with quantities and nutritional info
   - Detailed lunch menu with macro breakdown
   - Precise dinner recommendations with cooking methods
   - Snack suggestions with timing
   - Hydration schedule with specific amounts

2. EXERCISE ROUTINES:
   - Warm-up exercises with duration
   - Main workout with sets, reps, and rest periods
   - Cool-down and stretching routine
   - Exercise modifications for different fitness levels

3. LIFESTYLE ACTIVITIES:
   - Sleep hygiene practices
   - Stress management techniques
   - Work productivity tips
   - Recovery and relaxation activities

4. TIMING AND SCHEDULING:
   - Exact times for all activities
   - Meal prep schedules
   - Workout timing optimization
   - Sleep and wake routines

Respond in JSON format:
{
  "weeklySchedules": [
    {
      "week": 1,
      "dailySchedules": [
        {
          "day": "Monday",
          "date": "Week 1, Day 1",
          "morningRoutine": {
            "wakeUpTime": "06:00",
            "hydration": "500ml water with lemon",
            "breakfast": {
              "time": "07:00",
              "menu": "Oatmeal with berries and nuts",
              "calories": 350,
              "macros": "Carbs: 45g, Protein: 12g, Fat: 8g",
              "prepTime": "10 minutes"
            }
          },
          "workout": {
            "time": "18:00",
            "duration": "45 minutes",
            "exercises": [
              {
                "name": "Warm-up",
                "duration": "10 minutes",
                "instructions": "Light cardio and dynamic stretching"
              },
              {
                "name": "Strength Training",
                "duration": "25 minutes",
                "sets": 3,
                "reps": "12-15",
                "exercises": ["Squats", "Push-ups", "Lunges"],
                "rest": "60 seconds between sets"
              },
              {
                "name": "Cool-down",
                "duration": "10 minutes",
                "instructions": "Static stretching and deep breathing"
              }
            ],
            "caloriesBurned": 300
          },
          "meals": {
            "lunch": {
              "time": "13:00",
              "menu": "Grilled chicken salad with quinoa",
              "calories": 450,
              "macros": "Protein: 35g, Carbs: 30g, Fat: 15g"
            },
            "dinner": {
              "time": "19:30",
              "menu": "Baked salmon with roasted vegetables",
              "calories": 400,
              "macros": "Protein: 40g, Carbs: 25g, Fat: 18g"
            },
            "snacks": [
              {
                "time": "10:00",
                "item": "Greek yogurt with almonds",
                "calories": 150
              },
              {
                "time": "15:30",
                "item": "Apple with peanut butter",
                "calories": 200
              }
            ]
          },
          "eveningRoutine": {
            "sleepTime": "22:00",
            "preparation": "No screens 1 hour before bed, meditation",
            "hydration": "Herbal tea or warm water"
          }
        }
      ]
    }
  ]
}`;

    // Try both Groq API keys for load balancing
    let activityData;
    let usedProvider = 'Groq-Primary';

    try {
      // Try primary API key first
      const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${GROQ_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "llama-3.1-8b-instant",
          messages: [
            {
              role: "system",
              content: "You are a professional fitness activity generation AI. Create detailed, safe, and effective activities based on the selected plan and user profile. Always respond in valid JSON format."
            },
            {
              role: "user",
              content: prompt
            }
          ],
          max_tokens: 3000,
          temperature: 0.7
        })
      });

      if (!response.ok) {
        throw new Error(`Groq API error: ${response.status}`);
      }

      const data = await response.json();
      const responseText = data.choices[0].message.content;
      console.log('📨 Groq Response:', responseText);

      // Parse the JSON response
      let content = responseText;
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        content = jsonMatch[0];
      }
      
      try {
        activityData = JSON.parse(content);
      } catch (parseError) {
        console.error('❌ JSON parsing error:', parseError);
        throw new Error('Failed to parse Groq response');
      }
    } catch (primaryError) {
      console.log('⚠️ Primary Groq API failed, trying secondary...');
      
      // Try secondary API key if primary fails
      if (GROQ_API_KEY_2) {
        try {
          const response2 = await fetch("https://api.groq.com/openai/v1/chat/completions", {
            method: "POST",
            headers: {
              "Authorization": `Bearer ${GROQ_API_KEY_2}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              model: "llama-3.3-70b-versatile",
              messages: [
                {
                  role: "system",
                  content: "You are a professional fitness activity generation AI. Create detailed, safe, and effective activities based on the selected plan and user profile. Always respond in valid JSON format."
                },
                {
                  role: "user",
                  content: prompt
                }
              ],
              max_tokens: 3000,
              temperature: 0.7
            })
          });

          if (!response2.ok) {
            throw new Error(`Groq Secondary API error: ${response2.status}`);
          }

          const data2 = await response2.json();
          const responseText2 = data2.choices[0].message.content;
          console.log('📨 Groq Secondary Response:', responseText2);

          let content2 = responseText2;
          const jsonMatch2 = content2.match(/\{[\s\S]*\}/);
          if (jsonMatch2) {
            content2 = jsonMatch2[0];
          }
          
          try {
            activityData = JSON.parse(content2);
          } catch (parseError) {
            console.error('❌ JSON parsing error (secondary):', parseError);
            throw new Error('Failed to parse Groq secondary response');
          }
          usedProvider = 'Groq-Secondary';
        } catch (secondaryError) {
          console.error('❌ Both Groq APIs failed:', secondaryError);
          throw new Error('All Groq API calls failed');
        }
      } else {
        throw primaryError;
      }
    }

    // Fallback response if parsing fails
    if (!activityData || !activityData.activities) {
      activityData = {
        activities: [
          {
            week: 1,
            day: 1,
            activities: [
              {
                name: "Morning Stretch",
                duration: "15 minutes",
                instructions: "Start with gentle stretching exercises to warm up your body",
                equipment: ["Yoga mat"],
                difficulty: "Beginner",
                calories: 50
              }
            ]
          }
        ]
      };
    }

    return new Response(
      JSON.stringify({
        success: true,
        activities: activityData.activities,
        meta: {
          provider: usedProvider,
          timestamp: new Date().toISOString()
        }
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error('❌ Activity generation error:', error);
    
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: 'Failed to generate activities', 
        details: error.message 
      }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});