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
    const GROQ_API_KEY = Deno.env.get("VITE_GROQ_API_KEY");
    const GROQ_API_KEY_2 = Deno.env.get("VITE_GROQ_API_KEY_2");

    if (!GROQ_API_KEY) {
      return new Response(
        JSON.stringify({ success: false, error: "Groq API key not configured" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Prepare the prompt for activity generation
    const prompt = `You are a fitness activity generation AI. Create detailed weekly activities for the selected health plan.

Selected Plan:
- Title: ${selectedPlan?.title}
- Description: ${selectedPlan?.description}
- Duration: ${selectedPlan?.duration}
- Difficulty: ${selectedPlan?.difficulty}
- Focus Areas: ${selectedPlan?.focusAreas?.join(', ')}
- Equipment: ${selectedPlan?.equipment?.join(', ')}

User Profile:
- Age: ${userProfile?.age || 'Not provided'}
- Gender: ${userProfile?.gender || 'Not provided'}
- Health Goals: ${userProfile?.health_goals?.join(', ') || 'Not specified'}
- Workout Time: ${userProfile?.workout_time || 'Not specified'}

Create detailed activities for each week of the plan. Each activity should include:
- Activity name
- Duration
- Instructions
- Equipment needed
- Difficulty level
- Calories burned (estimated)

Respond in JSON format:
{
  "activities": [
    {
      "week": 1,
      "day": 1,
      "activities": [
        {
          "name": "Activity Name",
          "duration": "30 minutes",
          "instructions": "Detailed step-by-step instructions",
          "equipment": ["equipment1", "equipment2"],
          "difficulty": "Beginner",
          "calories": 200
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