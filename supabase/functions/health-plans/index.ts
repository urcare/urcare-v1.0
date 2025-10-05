import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface UserProfile {
  id: string;
  full_name: string;
  age: number;
  gender: string;
  height_cm: number;
  weight_kg: number;
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
    const { userProfile, healthScore, analysis, recommendations, userInput } = await req.json();

    if (!userProfile) {
      return new Response(
        JSON.stringify({ error: "User profile is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Get Groq API keys from environment
    const GROQ_API_KEY = Deno.env.get("GROQ_API_KEY");
    const GROQ_API_KEY_2 = Deno.env.get("GROQ_API_KEY_2");

    if (!GROQ_API_KEY) {
      throw new Error("Groq API key not configured");
    }

    const prompt = `
You are a health plan generation AI. Based on the following user data and health analysis, create 3 personalized health plans.

User Profile:
- Age: ${userProfile.age || 'Not provided'}
- Gender: ${userProfile.gender || 'Not provided'}
- Height: ${userProfile.height_cm || userProfile.height_feet || 'Not provided'}
- Weight: ${userProfile.weight_kg || userProfile.weight_lb || 'Not provided'}
- Blood Group: ${userProfile.blood_group || 'Not provided'}
- Chronic Conditions: ${userProfile.chronic_conditions?.join(', ') || 'None'}
- Medications: ${userProfile.medications?.join(', ') || 'None'}
- Health Goals: ${userProfile.health_goals?.join(', ') || 'Not specified'}
- Diet Type: ${userProfile.diet_type || 'Not specified'}
- Workout Time: ${userProfile.workout_time || 'Not specified'}
- Sleep Time: ${userProfile.sleep_time || 'Not specified'}
- Wake Up Time: ${userProfile.wake_up_time || 'Not specified'}

Health Score: ${healthScore}/100
Health Analysis: ${analysis}
Recommendations: ${recommendations?.join(', ') || 'None'}

User Input: ${userInput || 'None'}

Create 3 different health plans with varying difficulty levels and focus areas:

1. A beginner-friendly plan (focus on building habits)
2. An intermediate plan (balanced approach)
3. An advanced plan (intensive and comprehensive)

Each plan should include:
- Title (descriptive and motivating)
- Description (what the plan involves)
- Duration (e.g., "4 weeks", "8 weeks", "12 weeks")
- Difficulty level (Beginner/Intermediate/Advanced)
- Focus areas (3-5 key areas like "Weight Loss", "Muscle Building", "Cardio", "Flexibility", "Nutrition")
- Estimated calories burned per session
- Equipment needed (list of equipment or "No equipment needed")
- Key benefits (3-5 specific benefits)

Respond in JSON format:
{
  "plans": [
    {
      "id": "plan_1",
      "title": "Plan Title",
      "description": "Detailed description of the plan",
      "duration": "4 weeks",
      "difficulty": "Beginner",
      "focusAreas": ["area1", "area2", "area3"],
      "estimatedCalories": 300,
      "equipment": ["equipment1", "equipment2"],
      "benefits": ["benefit1", "benefit2", "benefit3"]
    },
    {
      "id": "plan_2",
      "title": "Plan Title",
      "description": "Detailed description of the plan",
      "duration": "8 weeks",
      "difficulty": "Intermediate",
      "focusAreas": ["area1", "area2", "area3"],
      "estimatedCalories": 500,
      "equipment": ["equipment1", "equipment2"],
      "benefits": ["benefit1", "benefit2", "benefit3"]
    },
    {
      "id": "plan_3",
      "title": "Plan Title",
      "description": "Detailed description of the plan",
      "duration": "12 weeks",
      "difficulty": "Advanced",
      "focusAreas": ["area1", "area2", "area3"],
      "estimatedCalories": 700,
      "equipment": ["equipment1", "equipment2"],
      "benefits": ["benefit1", "benefit2", "benefit3"]
    }
  ]
}
`;

    // Try both Groq API keys for load balancing
    let planData;
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
              content: "You are a professional health plan generation AI. Create personalized, practical, and achievable health plans based on user data. Always respond in valid JSON format."
            },
            {
              role: "user",
              content: prompt
            }
          ],
          max_tokens: 2000,
          temperature: 0.8
        })
      });

      if (!response.ok) {
        throw new Error(`Groq API error: ${response.statusText}`);
      }

      const data = await response.json();
      const content = data.choices[0].message.content;
      
      // Parse the JSON response
      let contentParsed = content;
      const jsonMatch = contentParsed.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        contentParsed = jsonMatch[0];
      }
      
      planData = JSON.parse(contentParsed);
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
                  content: "You are a professional health plan generation AI. Create personalized, practical, and achievable health plans based on user data. Always respond in valid JSON format."
                },
                {
                  role: "user",
                  content: prompt
                }
              ],
              max_tokens: 2000,
              temperature: 0.8
            })
          });

          if (!response2.ok) {
            throw new Error(`Groq Secondary API error: ${response2.statusText}`);
          }

          const data2 = await response2.json();
          const content2 = data2.choices[0].message.content;
          
          let content2Parsed = content2;
          const jsonMatch2 = content2Parsed.match(/\{[\s\S]*\}/);
          if (jsonMatch2) {
            content2Parsed = jsonMatch2[0];
          }
          
          planData = JSON.parse(content2Parsed);
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
    if (!planData || !planData.plans) {
      planData = {
        plans: [
          {
            id: "plan_1",
            title: "Beginner Wellness Journey",
            description: "A gentle introduction to healthy living with focus on building sustainable habits.",
            duration: "4 weeks",
            difficulty: "Beginner",
            focusAreas: ["Basic Fitness", "Nutrition", "Sleep"],
            estimatedCalories: 200,
            equipment: ["No equipment needed"],
            benefits: ["Build healthy habits", "Improve energy levels", "Better sleep quality"]
          },
          {
            id: "plan_2",
            title: "Balanced Health Program",
            description: "A comprehensive approach combining exercise, nutrition, and wellness practices.",
            duration: "8 weeks",
            difficulty: "Intermediate",
            focusAreas: ["Cardio", "Strength Training", "Nutrition", "Stress Management"],
            estimatedCalories: 400,
            equipment: ["Dumbbells", "Yoga mat"],
            benefits: ["Improved fitness", "Better nutrition", "Reduced stress", "Weight management"]
          },
          {
            id: "plan_3",
            title: "Advanced Transformation",
            description: "An intensive program for those ready to commit to significant health improvements.",
            duration: "12 weeks",
            difficulty: "Advanced",
            focusAreas: ["High-Intensity Training", "Precision Nutrition", "Recovery", "Mental Health"],
            estimatedCalories: 600,
            equipment: ["Full gym access", "Heart rate monitor", "Foam roller"],
            benefits: ["Maximum fitness gains", "Optimal nutrition", "Peak performance", "Complete transformation"]
          }
        ]
      };
    }

    return new Response(
      JSON.stringify({
        success: true,
        plans: planData.plans,
        meta: {
          provider: usedProvider,
          timestamp: new Date().toISOString()
        }
      }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error('❌ Health plan generation error:', error);
    
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: 'Failed to generate health plans', 
        details: error instanceof Error ? error.message : 'Unknown error'
      }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
