import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
// Temporarily disable Supabase client to fix authentication issue
// import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// Initialize Supabase client (temporarily disabled)
// const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
// const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
// const supabase = createClient(supabaseUrl, supabaseServiceKey);

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, GET, OPTIONS",
};

// Claude-only for plan-activities
const CLAUDE_API_KEY = Deno.env.get('claude_api_key');

console.log('🔑 Claude API Key status:', CLAUDE_API_KEY ? 'Present' : 'Missing');
console.log('🔑 API Key length:', CLAUDE_API_KEY ? CLAUDE_API_KEY.length : 0);

// Helper function to get Claude API key only
const getApiKeys = () => {
  const keys = CLAUDE_API_KEY ? [CLAUDE_API_KEY] : [];
  console.log('🔑 Available Claude API keys:', keys.length);
  return keys;
};

// Helper function to convert 24-hour time to 12-hour AM/PM format
const formatTime = (time24: string): string => {
  const [hours, minutes] = time24.split(':').map(Number);
  const period = hours >= 12 ? 'PM' : 'AM';
  const hours12 = hours === 0 ? 12 : hours > 12 ? hours - 12 : hours;
  return `${hours12}:${minutes.toString().padStart(2, '0')} ${period}`;
};

// Calculate time offsets
const addMinutes = (time: string, minutes: number): string => {
  const [h, m] = time.split(':').map(Number);
  const date = new Date();
  date.setHours(h, m + minutes, 0, 0);
  return date.toTimeString().slice(0, 5);
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  // Parse request data once at the beginning
  let requestData;
  try {
    requestData = await req.json();
  } catch (parseError) {
    return new Response(JSON.stringify({
      error: "Invalid JSON in request body"
    }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" }
    });
  }

  try {
    const { selectedPlan, userProfile, healthScore, healthAnalysis, primaryGoal, userInput, uploadedFiles, voiceTranscript } = requestData;

    if (!selectedPlan || !userProfile) {
      return new Response(JSON.stringify({
        error: "Missing required fields: selectedPlan and userProfile are required"
      }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    }

    console.log('🎯 Generating schedule for plan:', selectedPlan.name || selectedPlan.title);
    console.log('👤 User profile:', userProfile.full_name, userProfile.age, userProfile.gender);

    // Create comprehensive prompt with all available data
    const prompt = `You are a wellness advisor creating a realistic daily schedule. CRITICAL: This person has concerning health patterns that need medical attention.

USER PROFILE - ${userProfile.country || 'INDIA'}, ${userProfile.state || 'UNKNOWN STATE'}:
- Name: ${userProfile.full_name}, Age: ${userProfile.age}, Gender: ${userProfile.gender}
- Location: ${userProfile.district || 'Unknown'}, ${userProfile.state || 'Unknown'}, ${userProfile.country || 'Unknown'}
- Height: ${userProfile.height_cm || userProfile.height}cm, Weight: ${userProfile.weight_kg || userProfile.weight}kg
- Blood Group: ${userProfile.blood_group || 'Not specified'}

CRITICAL HEALTH CONCERNS:
- Sleep: ${userProfile.sleep_hours || 'Unknown'} hours (${userProfile.sleep_time || 'Unknown'} to ${userProfile.wake_up_time || 'Unknown'})
- Chronic conditions: ${userProfile.chronic_conditions?.join(', ') || 'None'}
- Work hours: ${userProfile.work_start || 'Unknown'} to ${userProfile.work_end || 'Unknown'}
- Critical condition: ${userProfile.critical_conditions || 'None'}
- Medications: ${userProfile.medications?.join(', ') || 'None'}
- Allergies: ${userProfile.allergies?.join(', ') || 'None'}

SCHEDULE CONSTRAINTS:
- Wake: ${userProfile.wake_up_time || '07:00'}
- Work: ${userProfile.work_start || '09:00'} - ${userProfile.work_end || '17:00'}
- Breakfast: ${userProfile.breakfast_time || '08:00'}
- Lunch: ${userProfile.lunch_time || '13:00'}
- Dinner: ${userProfile.dinner_time || '19:00'}
- Workout: ${userProfile.workout_time || '18:00'}
- Sleep: ${userProfile.sleep_time || '23:00'}

LIFESTYLE:
- Diet: ${userProfile.diet_type || 'Balanced'} (${userProfile.diet_type?.toLowerCase().includes('vegetarian') || userProfile.diet_type?.toLowerCase().includes('vegan') ? 'Indian vegetarian cuisine' : 'Mixed diet'})
- Workout: ${userProfile.workout_type || 'General'}
- Smoking: ${userProfile.smoking || 'None'}
- Drinking: ${userProfile.drinking || 'None'}
- Flexibility: ${userProfile.routine_flexibility || 3}/5
- Activity Level: ${userProfile.activity_level || 'Moderate'}

PRIMARY GOAL: ${primaryGoal || userProfile.health_goals?.join(', ') || 'General wellness'}
SECONDARY GOALS: ${userProfile.health_goals?.filter(g => g !== primaryGoal).join(', ') || 'None'}

HEALTH ANALYSIS FROM PREVIOUS AI ASSESSMENT:
${healthAnalysis ? `
- Health Score: ${healthScore}/100
- Health Concerns: ${healthAnalysis.displayAnalysis?.negativeAnalysis?.join(', ') || 'General health maintenance'}
- Key Recommendations: ${healthAnalysis.displayAnalysis?.lifestyleRecommendations?.join(', ') || 'Focus on overall wellness'}
- Nutritional Profile: ${healthAnalysis.detailedAnalysis?.nutritionalProfile ? JSON.stringify(healthAnalysis.detailedAnalysis.nutritionalProfile) : 'Standard nutritional needs'}
- Exercise Profile: ${healthAnalysis.detailedAnalysis?.exerciseProfile ? JSON.stringify(healthAnalysis.detailedAnalysis.exerciseProfile) : 'General fitness approach'}
- Sleep Profile: ${healthAnalysis.detailedAnalysis?.sleepProfile ? JSON.stringify(healthAnalysis.detailedAnalysis.sleepProfile) : 'Standard sleep needs'}
- Stress Management: ${healthAnalysis.detailedAnalysis?.stressManagement ? JSON.stringify(healthAnalysis.detailedAnalysis.stressManagement) : 'General stress management'}
- Medical Considerations: ${healthAnalysis.detailedAnalysis?.medicalConsiderations ? JSON.stringify(healthAnalysis.detailedAnalysis.medicalConsiderations) : 'No specific medical restrictions'}
` : 'No previous health analysis available'}

ADDITIONAL USER INPUT:
- User Input: ${userInput || 'None'}
- Uploaded Files: ${uploadedFiles ? 'Files uploaded' : 'None'}
- Voice Transcript: ${voiceTranscript || 'None'}

PLAN SELECTED: ${selectedPlan.name || selectedPlan.title}
- Difficulty: ${selectedPlan.difficulty}
- Calories: ${selectedPlan.calorieTarget || 2000}/day
- Macros: ${selectedPlan.macros?.protein || 30}% protein, ${selectedPlan.macros?.carbs || 40}% carbs, ${selectedPlan.macros?.fats || 30}% fats
- Duration: ${selectedPlan.duration || '8-12 weeks'}

TASK: Create a detailed daily schedule with these MANDATORY requirements:

1. HEALTH WARNINGS:
   - Start response with: "⚠️ MEDICAL CONSULTATION REQUIRED"
   - Explain: Sleep deprivation + long work days + chronic stress is dangerous
   - Recommend: Consult doctor before starting any program
   - Note: This schedule is a SUGGESTION, not medical advice

2. REALISTIC CONSTRAINTS:
   - Person works ${userProfile.work_start || '09:00'} to ${userProfile.work_end || '17:00'} (acknowledge if this is unsustainable)
   - Limited time for activities
   - High stress environment
   - Sleep deprivation present (if applicable)

3. SPECIFIC DIETARY REQUIREMENTS (${userProfile.diet_type || 'Balanced'}):
   - Use foods from ${userProfile.country || 'India'} region
   - Examples: ${userProfile.diet_type?.toLowerCase().includes('vegetarian') || userProfile.diet_type?.toLowerCase().includes('vegan') ? 'dal, roti, sabzi, paneer, dahi, rajma, chole, sambar, rasam, idli, dosa, upma, poha, khichdi' : 'balanced meals with local ingredients'}
   - Include specific dishes with quantities and cooking methods
   - Respect ${userProfile.diet_type || 'diet'} strictly

4. SCHEDULE FORMAT:
Generate 10-15 activities covering wake to sleep. For each:

{
  "time": "string",
  "activity": "string",
  "duration": "string",
  "category": "meal/exercise/work/hydration/sleep",
  "calories": number,
  "detailedInstructions": [
    {
      "step": number,
      "action": "string",
      "items": [
        {"food": "dish name", "quantity": "amount", "calories": num, "protein": num, "carbs": num, "fats": num, "cookingMethod": "boiled/steamed/roasted/grilled", "prepTime": "X minutes", "cookTime": "X minutes"}
      ],
      "description": "why this helps",
      "instructions": "step-by-step cooking/exercise instructions"
    }
  ],
  "why": "explanation",
  "healthNote": "any concerns or tips"
}

5. CRITICAL SCHEDULE NOTES:
   - ${userProfile.work_start || '09:00'} - ${userProfile.work_end || '17:00'}: Work block (note if dangerously long, seek work-life balance)
   - During work: Only micro-breaks (2-3 min desk stretches, eye exercises)
   - ${userProfile.workout_time || '18:00'} workout: Check if this conflicts with wake/sleep times
   - Evening: Acknowledge limited free time due to work schedule

6. SPECIFIC WORKOUT MODIFICATIONS (${selectedPlan.difficulty} difficulty):
   - ${selectedPlan.difficulty === 'Gentle' ? 'Light exercises suitable for beginners' : selectedPlan.difficulty === 'Balanced' ? 'Moderate intensity exercises' : 'Intensive exercises for advanced users'}
   - Home gym exercises suitable for small space
   - ${selectedPlan.difficulty === 'Gentle' ? '15-20 min routines' : selectedPlan.difficulty === 'Balanced' ? '20-30 min routines' : '30-45 min routines'} (person has limited time)
   - Focus on ${selectedPlan.difficulty === 'Gentle' ? 'stress relief and basic fitness' : selectedPlan.difficulty === 'Balanced' ? 'balanced strength and cardio' : 'intensive strength and conditioning'}

7. STRESS MANAGEMENT:
   - Breathing exercises during work breaks
   - Brief meditation (5 min max - they have limited time)
   - Realistic suggestions for someone with busy schedule

8. SLEEP PRIORITY:
   - Emphasize: ${userProfile.sleep_hours || 'Unknown'} hours may be insufficient
   - Suggest: Gradually improve sleep schedule if needed
   - Impact: Current schedule may be causing health issues

Return this JSON structure:

{
  "healthWarnings": [
    "⚠️ Sleep pattern analysis: ${userProfile.sleep_hours || 'Unknown'} hours vs recommended 7-8 hours",
    "⚠️ Work schedule: ${userProfile.work_start || '09:00'} to ${userProfile.work_end || '17:00'} may be unsustainable",
    "⚠️ Consult doctor before starting any fitness program",
    "⚠️ Current schedule may worsen existing stress and health conditions"
  ],
  "scheduleConflicts": [
    "Check for time conflicts between wake, work, workout, and sleep times"
  ],
  "dailySchedule": [
    {
      "time": "string",
      "activity": "string",
      "duration": "string",
      "category": "meal/exercise/work/hydration/sleep",
      "calories": number,
      "detailedInstructions": [
        {
          "step": number,
          "action": "string",
          "items": [
            {"food": "dish name", "quantity": "amount", "calories": num, "protein": num, "carbs": num, "fats": num, "cookingMethod": "boiled/steamed/roasted/grilled", "prepTime": "X minutes", "cookTime": "X minutes"}
          ],
          "description": "why this helps",
          "instructions": "step-by-step cooking/exercise instructions"
        }
      ],
      "why": "explanation",
      "healthNote": "any concerns or tips"
    }
  ],
  "disclaimer": "This is educational information only. Given your health conditions, work schedule, and lifestyle constraints, please consult a healthcare provider before making changes. This schedule is tailored for ${selectedPlan.difficulty} difficulty level and may need adjustment based on your specific health needs."
}

BE REALISTIC. Don't create an idealistic schedule they can't follow. Acknowledge the constraints and dangers of their current lifestyle. Adjust intensity based on selected plan difficulty: ${selectedPlan.difficulty}.`;

    // Call Claude API only
    const apiKeys = getApiKeys();
    console.log('🔑 Claude API Key Status:', {
      totalKeys: apiKeys.length,
      claudeKey: CLAUDE_API_KEY ? "Present" : "Missing"
    });
    
    if (apiKeys.length === 0) {
      throw new Error('No Claude API key configured');
    }

    let apiResponse;
    let usedKey = "claude-key-1";
    let lastError = null;
    
    // Use Claude API only
    try {
      const currentKey = apiKeys[0];
      console.log(`🔑 Using Claude API key...`);
      
      apiResponse = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "x-api-key": currentKey,
          "Content-Type": "application/json",
          "anthropic-version": "2023-06-01"
        },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 8000,
          temperature: 0.7,
          messages: [
            {
              role: "user",
              content: `You are a fitness scheduling AI. Generate detailed daily schedules with specific meal plans and exercises. Return ONLY valid JSON, no markdown.\n\n${prompt}`
            }
          ]
        })
      });
      
      if (apiResponse.ok) {
        console.log(`✅ Claude API worked! Status: ${apiResponse.status}`);
      } else {
        console.log(`❌ Claude API failed: ${apiResponse.status}`);
        lastError = `Status ${apiResponse.status}`;
      }
    } catch (error) {
      console.log(`❌ Claude API error: ${error.message}`);
      lastError = error.message;
    }
    
    if (!apiResponse || !apiResponse.ok) {
      throw new Error(`Claude API failed. Error: ${lastError}`);
    }

    const data = await apiResponse.json();
    let scheduleText = "";
    
    // Handle Claude API response format
    if (data.content && data.content[0]?.text) {
      scheduleText = data.content[0].text.trim();
      console.log("📝 Claude response format detected");
    } else {
      throw new Error("Unexpected Claude API response format");
    }

    // Parse the AI response
    let parsedSchedule;
    try {
      // Clean up the response text
      const cleanedText = scheduleText.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      parsedSchedule = JSON.parse(cleanedText);
    } catch (parseError) {
      console.error('❌ Failed to parse AI response as JSON:', parseError);
      console.log('📝 Raw response:', scheduleText);
      
      // Fallback: create a basic schedule
      parsedSchedule = {
        healthWarnings: ["⚠️ AI response parsing failed - using fallback schedule"],
        scheduleConflicts: ["⚠️ Generated fallback schedule may not be optimal"],
        dailySchedule: [
          {
            time: "07:00 AM",
            activity: "Morning Hydration",
            duration: "10 min",
            category: "hydration",
            calories: 0,
            detailedInstructions: [
              {
                step: 1,
                action: "Drink Water",
                items: [
                  {
                    food: "Water",
                    quantity: "500ml",
                    calories: 0,
                    protein: 0,
                    carbs: 0,
                    fats: 0,
                    cookingMethod: "none",
                    prepTime: "0 minutes",
                    cookTime: "0 minutes"
                  }
                ],
                description: "Start your day with hydration",
                instructions: "Drink 500ml of room temperature water"
              }
            ],
            why: "Hydration is essential for optimal body function",
            healthNote: "Drink slowly to avoid discomfort"
          }
        ],
        disclaimer: "This is a fallback schedule due to AI parsing error. Please try again or consult a healthcare provider."
      };
    }

    // Validate and ensure we have a schedule
    if (!parsedSchedule.dailySchedule || !Array.isArray(parsedSchedule.dailySchedule)) {
      throw new Error('Invalid schedule format from AI');
    }

    // Extract health warnings and schedule conflicts if present
    const healthWarnings = parsedSchedule.healthWarnings || [];
    const scheduleConflicts = parsedSchedule.scheduleConflicts || [];
    const disclaimer = parsedSchedule.disclaimer || "This is a general fitness guide. Consult your healthcare provider before starting any new exercise or nutrition program.";

    // Get the latest health analysis for this user (temporarily disabled)
    let healthAnalysisId = null;
    // const { data: latestAnalysis } = await supabase
    //   .from('health_analysis')
    //   .select('id')
    //   .eq('user_id', userProfile.id)
    //   .eq('is_latest', true)
    //   .single();
    
    // if (latestAnalysis) {
    //   healthAnalysisId = latestAnalysis.id;
    // }

    // Save daily schedule to database (temporarily disabled)
    try {
      const today = new Date().toISOString().split('T')[0];
      const dayNumber = requestData.dayNumber || 1; // Default to day 1 if not provided
      
      console.log('✅ Daily schedule generated successfully (database save disabled)');
    } catch (dbError) {
      console.error('❌ Database error:', dbError);
      // Don't fail the request, just log the error
    }

    // Add comprehensive health-focused response
    const response = {
      success: true,
      dailySchedule: parsedSchedule.dailySchedule,
      healthWarnings: healthWarnings,
      scheduleConflicts: scheduleConflicts,
      disclaimer: disclaimer,
      meta: {
        provider: `Claude-API-${usedKey}`,
        timestamp: new Date().toISOString(),
        model: "claude-sonnet-4-20250514",
        planName: selectedPlan.name || selectedPlan.title,
        difficulty: selectedPlan.difficulty,
        healthFocused: true,
        userProfile: {
          age: userProfile.age,
          gender: userProfile.gender,
          dietType: userProfile.diet_type,
          workHours: `${userProfile.work_start || '09:00'} - ${userProfile.work_end || '17:00'}`,
          sleepHours: userProfile.sleep_hours || 'Unknown'
        }
      }
    };

    console.log('✅ Schedule generation completed successfully');
    console.log('📋 Generated activities count:', response.dailySchedule.length);

    return new Response(JSON.stringify(response), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" }
    });

  } catch (error) {
    console.error("Error generating schedule:", error);

    return new Response(JSON.stringify({
      success: false,
      error: error.message,
      dailySchedule: [],
      healthWarnings: ["⚠️ Error occurred while generating schedule"],
      scheduleConflicts: [],
      disclaimer: "Error occurred while generating schedule. Please try again."
    }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" }
    });
  }
});
