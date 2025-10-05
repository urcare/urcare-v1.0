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

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? "",
      { global: { headers: { Authorization: authHeader } } }
    );

    const { userProfile, userInput, uploadedFiles, voiceTranscript } = await req.json();

    console.log("🔍 Generating health score for user:", userProfile?.id);

    // Get Groq API keys
    const GROQ_API_KEY = Deno.env.get("GROQ_API_KEY");
    const GROQ_API_KEY_2 = Deno.env.get("GROQ_API_KEY_2");

    if (!GROQ_API_KEY) {
      return new Response(
        JSON.stringify({ success: false, error: "Groq API key not configured" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Prepare the prompt for health risk analysis and causes
    const prompt = `You are a medical risk assessment AI specializing in analyzing onboarding data to identify health risks and their root causes. Focus on risk factors, potential health issues, and underlying causes based on the user's comprehensive health profile.

CRITICAL: Analyze the user's onboarding data to identify specific health risks, potential medical conditions, and the root causes behind their current health status.

User Profile Analysis:
- Age: ${userProfile?.age || 'Not provided'} (Risk factor analysis)
- Gender: ${userProfile?.gender || 'Not provided'} (Gender-specific risk factors)
- Height: ${userProfile?.height_cm || 'Not provided'}cm
- Weight: ${userProfile?.weight_kg || 'Not provided'}kg (BMI risk assessment)
- Blood Group: ${userProfile?.blood_group || 'Not provided'} (Blood type health implications)
- Chronic Conditions: ${userProfile?.chronic_conditions?.join(', ') || 'None'} (Existing health risks)
- Health Goals: ${userProfile?.health_goals?.join(', ') || 'Not specified'} (Target health improvements)
- Diet Type: ${userProfile?.diet_type || 'Not specified'} (Nutritional risk factors)
- Workout Schedule: ${userProfile?.workout_time || 'Not specified'} (Physical activity levels)
- Sleep Pattern: ${userProfile?.wake_up_time || 'Not provided'} to ${userProfile?.sleep_time || 'Not provided'} (Sleep quality risks)
- Work Schedule: ${userProfile?.work_start || 'Not provided'} to ${userProfile?.work_end || 'Not provided'} (Work-life balance risks)
- Meal Times: Breakfast ${userProfile?.breakfast_time || 'Not provided'}, Lunch ${userProfile?.lunch_time || 'Not provided'}, Dinner ${userProfile?.dinner_time || 'Not provided'} (Eating pattern risks)
- Smoking: ${userProfile?.smoking || 'Not provided'} (Major health risk factor)
- Drinking: ${userProfile?.drinking || 'Not provided'} (Alcohol consumption risks)
- Allergies: ${userProfile?.allergies?.join(', ') || 'None'} (Allergic reaction risks)
- Family History: ${userProfile?.family_history?.join(', ') || 'None'} (Genetic predisposition risks)
- Lifestyle: ${userProfile?.lifestyle || 'Not provided'} (Lifestyle-related risks)
- Stress Levels: ${userProfile?.stress_levels || 'Not provided'} (Mental health risks)
- Mental Health: ${userProfile?.mental_health || 'Not provided'} (Psychological risk factors)
- Hydration: ${userProfile?.hydration_habits || 'Not provided'} (Dehydration risks)
- Occupation: ${userProfile?.occupation || 'Not provided'} (Occupational health risks)

Additional Health Data:
- User Input: ${userInput || 'None'}
- Voice Transcript: ${voiceTranscript || 'None'}
- Health Reports: ${uploadedFiles?.map(file => `${file.name}: ${file.content?.substring(0, 500)}...`).join('\n\n') || 'None'}

RISK ANALYSIS FOCUS:
1. Identify specific health risks based on user's profile
2. Analyze root causes of potential health issues
3. Assess lifestyle factors contributing to health risks
4. Evaluate genetic and environmental risk factors
5. Determine immediate vs long-term health concerns

Provide a comprehensive risk analysis in this EXACT JSON format:
{
  "healthScore": [number between 0-100 based on risk assessment],
  "riskAnalysis": "[Detailed analysis of specific health risks identified from user's profile, including potential medical conditions and their likelihood]",
  "rootCauses": ["[Root cause 1: Specific lifestyle or genetic factor causing health risk]", "[Root cause 2: Environmental or behavioral factor]", "[Root cause 3: Medical or physiological factor]"],
  "immediateConcerns": ["[Immediate health concern 1]", "[Immediate health concern 2]", "[Immediate health concern 3]"],
  "longTermRisks": ["[Long-term health risk 1]", "[Long-term health risk 2]", "[Long-term health risk 3]"],
  "preventiveMeasures": ["[Specific preventive action 1]", "[Specific preventive action 2]", "[Specific preventive action 3]"]
}`;

    // Try both Groq API keys for load balancing
    let healthData;
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
              content: "You are a professional health assessment AI. Provide accurate, helpful health analysis based on user data. Always respond in valid JSON format."
            },
            {
              role: "user",
              content: prompt
            }
          ],
          max_tokens: 1500,
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
      
      healthData = JSON.parse(content);
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
                  content: "You are a professional health assessment AI. Provide accurate, helpful health analysis based on user data. Always respond in valid JSON format."
                },
                {
                  role: "user",
                  content: prompt
                }
              ],
              max_tokens: 1500,
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
          
          healthData = JSON.parse(content2);
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
    if (!healthData) {
      healthData = {
        healthScore: 75,
        analysis: "Based on your profile, you have a good foundation for health. Continue maintaining your current habits and consider the recommendations provided.",
        recommendations: [
          "Maintain regular exercise routine",
          "Ensure adequate sleep (7-9 hours)",
          "Stay hydrated throughout the day",
          "Eat a balanced diet with fruits and vegetables",
          "Manage stress through relaxation techniques"
        ]
      };
    }

    return new Response(
      JSON.stringify({
        success: true,
        healthScore: healthData.healthScore,
        analysis: healthData.analysis,
        recommendations: healthData.recommendations,
        meta: {
          provider: usedProvider,
          timestamp: new Date().toISOString()
        }
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error('❌ Health score generation error:', error);
    
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: 'Failed to generate health score', 
        details: error.message 
      }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});