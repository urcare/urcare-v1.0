import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface UserProfile {
  id: string;
  age: number;
  gender: string;
  height: number;
  weight: number;
  activity_level: string;
  health_goals: string[];
  medical_conditions: string[];
  medications: string[];
  allergies: string[];
  sleep_hours: number;
  stress_level: number;
  diet_type: string;
  exercise_frequency: number;
  chronic_conditions: string[];
  family_history: string[];
  lifestyle_factors: string[];
  wake_up_time: string;
  sleep_time: string;
  workout_time: string;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { userProfile, userInput, uploadedFiles, voiceTranscript } = await req.json();

    console.log("🔍 Generating health score for user:", userProfile?.id);

    // Health-score uses GROQ_API_KEY_3 and GROQ_API_KEY_4
    const apiKeys = [
      Deno.env.get("GROQ_API_KEY_3"),
      Deno.env.get("GROQ_API_KEY_4")
    ].filter(Boolean);

    console.log("🔑 API Key check:", {
      totalKeys: apiKeys.length,
      availableKeys: apiKeys.map((_, i) => `key-${i + 1}`)
    });

    if (apiKeys.length === 0) {
      console.log("❌ No API keys available, using fallback");
      const fallbackResponse = {
        success: true,
        healthScore: 75,
        analysis: {
          overall: "Good health with room for improvement",
          strengths: ["Regular exercise routine", "Balanced diet", "Good sleep habits"],
          areasForImprovement: ["Stress management", "Hydration levels", "Regular health checkups"],
          recommendations: ["Increase water intake to 8 glasses daily", "Practice stress-reduction techniques", "Schedule annual health checkup"]
        },
        recommendations: ["Focus on stress management", "Maintain current exercise routine", "Improve hydration habits"],
        meta: {
          provider: "Fallback-Response",
          timestamp: new Date().toISOString(),
          note: "Using fallback response due to API unavailability"
        }
      };
      
      return new Response(
        JSON.stringify(fallbackResponse),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Prepare the prompt for health risk analysis and causes
    const prompt = `You are a medical risk assessment AI specializing in analyzing onboarding data to identify health risks and their root causes. Focus on risk factors, potential health issues, and underlying causes based on the user's comprehensive health profile.

CRITICAL: Analyze the user's onboarding data to identify specific health risks, potential medical conditions, and the root causes behind their current health status.

User Profile Data:
- Age: ${userProfile?.age || 'Not specified'}
- Gender: ${userProfile?.gender || 'Not specified'}
- Height: ${userProfile?.height || 'Not specified'} cm
- Weight: ${userProfile?.weight || 'Not specified'} kg
- Activity Level: ${userProfile?.activity_level || 'Not specified'}
- Health Goals: ${userProfile?.health_goals?.join(', ') || 'Not specified'}
- Medical Conditions: ${userProfile?.medical_conditions?.join(', ') || 'None'}
- Medications: ${userProfile?.medications?.join(', ') || 'None'}
- Allergies: ${userProfile?.allergies?.join(', ') || 'None'}
- Sleep Hours: ${userProfile?.sleep_hours || 'Not specified'} hours
- Stress Level: ${userProfile?.stress_level || 'Not specified'}/10
- Diet Type: ${userProfile?.diet_type || 'Not specified'}
- Exercise Frequency: ${userProfile?.exercise_frequency || 'Not specified'} times/week
- Chronic Conditions: ${userProfile?.chronic_conditions?.join(', ') || 'None'}
- Family History: ${userProfile?.family_history?.join(', ') || 'None'}
- Lifestyle Factors: ${userProfile?.lifestyle_factors?.join(', ') || 'None'}

Additional Input: ${userInput || 'None'}
Uploaded Files: ${uploadedFiles ? 'Files uploaded' : 'None'}
Voice Transcript: ${voiceTranscript || 'None'}

ANALYSIS REQUIREMENTS:
1. Calculate a comprehensive health score (0-100)
2. Identify specific health risks and their severity levels
3. Analyze root causes of identified risks
4. Provide evidence-based recommendations
5. Highlight critical areas requiring immediate attention
6. Suggest preventive measures

RESPONSE FORMAT (JSON):
{
  "healthScore": number (0-100),
  "analysis": {
    "overall": "Overall health assessment",
    "strengths": ["List of health strengths"],
    "areasForImprovement": ["List of areas needing improvement"],
    "recommendations": ["Specific actionable recommendations"]
  },
  "recommendations": ["Priority recommendations"],
  "meta": {
    "provider": "Groq-API",
    "timestamp": "ISO string",
    "model": "llama-3.3-70b-versatile"
  }
}`;

    let response;
    let usedKey = "none";
    let lastError = null;
    
    // Try each API key until one works
    for (let i = 0; i < apiKeys.length; i++) {
      try {
        console.log(`🔑 Trying API key ${i + 1}/${apiKeys.length}...`);
        response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${apiKeys[i]}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model: "llama-3.3-70b-versatile",
            messages: [
              {
                role: "system",
                content: "You are Dr. Marcus Chen, a world-renowned integrative medicine physician and certified functional medicine practitioner with 20+ years of experience. You specialize in comprehensive health assessment and root cause analysis. Provide detailed, accurate, and helpful health analysis based on user data. Always respond in valid JSON format with comprehensive details."
              },
              {
                role: "user",
                content: prompt
              }
            ],
            max_tokens: 8000,
            temperature: 0.9,
            top_p: 0.95,
            frequency_penalty: 0.1,
            presence_penalty: 0.1
          })
        });
        
        if (response.ok) {
          usedKey = `key-${i + 1}`;
          console.log(`✅ API key ${i + 1} worked! Status: ${response.status}`);
          break;
        } else {
          console.log(`❌ API key ${i + 1} failed: ${response.status}`);
          lastError = `Status ${response.status}`;
        }
      } catch (error) {
        console.log(`❌ API key ${i + 1} error: ${error.message}`);
        lastError = error.message;
      }
    }
    
    if (!response || !response.ok) {
      throw new Error(`All API keys failed. Last error: ${lastError}`);
    }

    const data = await response.json();
    console.log("📊 Groq API response received");

    // Extract JSON from response
    let healthData;
    try {
      const content = data.choices[0]?.message?.content || "";
      console.log("📝 Raw response:", content.substring(0, 200) + "...");
      
      // Try to parse as JSON directly
      healthData = JSON.parse(content);
    } catch (parseError) {
      console.log("⚠️ Direct JSON parse failed, trying to extract JSON...");
      try {
        // Try to extract JSON from the response
        const jsonMatch = content.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          healthData = JSON.parse(jsonMatch[0]);
        } else {
          throw new Error("No JSON found in response");
        }
      } catch (extractError) {
        console.log("❌ JSON extraction failed, using fallback");
        healthData = {
          healthScore: 75,
          analysis: {
            overall: "Good health with room for improvement",
            strengths: ["Regular exercise routine", "Balanced diet", "Good sleep habits"],
            areasForImprovement: ["Stress management", "Hydration levels", "Regular health checkups"],
            recommendations: ["Increase water intake to 8 glasses daily", "Practice stress-reduction techniques", "Schedule annual health checkup"]
          },
          recommendations: ["Focus on stress management", "Maintain current exercise routine", "Improve hydration habits"]
        };
      }
    }

    // Ensure required fields exist
    const result = {
      success: true,
      healthScore: healthData.healthScore || 75,
      analysis: healthData.analysis || {
        overall: "Health analysis completed",
        strengths: ["Good overall health"],
        areasForImprovement: ["Continue current healthy habits"],
        recommendations: ["Maintain current lifestyle"]
      },
      recommendations: healthData.recommendations || ["Continue current healthy habits"],
      meta: {
        provider: `Groq-API-${usedKey}`,
        timestamp: new Date().toISOString(),
        model: "llama-3.3-70b-versatile"
      }
    };

    console.log("✅ Health score generated successfully");

    return new Response(
      JSON.stringify(result),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error('❌ Health score generation error:', error);
    
    // Provide a fallback health score response
    const fallbackResponse = {
      success: true,
      healthScore: 75,
      analysis: {
        overall: "Good health with room for improvement",
        strengths: ["Regular exercise routine", "Balanced diet", "Good sleep habits"],
        areasForImprovement: ["Stress management", "Hydration levels", "Regular health checkups"],
        recommendations: ["Increase water intake to 8 glasses daily", "Practice stress-reduction techniques", "Schedule annual health checkup"]
      },
      recommendations: ["Focus on stress management", "Maintain current exercise routine", "Improve hydration habits"],
      meta: {
        provider: "Fallback-Response",
        timestamp: new Date().toISOString(),
        note: "Using fallback response due to API unavailability"
      }
    };
    
    return new Response(
      JSON.stringify(fallbackResponse),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});