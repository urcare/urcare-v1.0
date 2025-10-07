import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// Initialize Supabase client
const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type"
};

// Claude-only for plan-activities
const CLAUDE_API_KEY = Deno.env.get('claude_api_key');

console.log('🔑 Claude API Key status:', CLAUDE_API_KEY ? 'Present' : 'Missing');
console.log('🔑 API Key length:', CLAUDE_API_KEY ? CLAUDE_API_KEY.length : 0);

// Helper function to get Claude API key only
const getApiKeys = () => {
  const keys = CLAUDE_API_KEY ? [CLAUDE_API_KEY] : [];
  console.log('🔑 Available API keys:', keys.length);
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

  const { userProfile, selectedPlan, healthScore, primaryGoal, healthAnalysis, userInput, uploadedFiles, voiceTranscript } = requestData;

  try {

    if (!userProfile || !selectedPlan) {
      return new Response(JSON.stringify({
        error: "User profile and selected plan are required"
      }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    }

    // Build comprehensive health-focused prompt
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
   
   DETAILED MEAL SPECIFICATIONS:
   - BREAKFAST (30% of calories): ${userProfile.diet_type?.toLowerCase().includes('vegetarian') || userProfile.diet_type?.toLowerCase().includes('vegan') ? 'Indian breakfast items like poha, upma, idli, dosa, paratha with specific recipes' : 'Balanced breakfast with protein, carbs, and healthy fats'}
   - LUNCH (35% of calories): ${userProfile.diet_type?.toLowerCase().includes('vegetarian') || userProfile.diet_type?.toLowerCase().includes('vegan') ? 'Complete thali with dal, sabzi, roti, rice, salad, curd with exact portions' : 'Main meal with protein, vegetables, grains'}
   - DINNER (30% of calories): ${userProfile.diet_type?.toLowerCase().includes('vegetarian') || userProfile.diet_type?.toLowerCase().includes('vegan') ? 'Light dinner with khichdi, soup, or light curry with specific ingredients' : 'Light dinner with protein and vegetables'}
   - SNACKS (5% of calories): ${userProfile.diet_type?.toLowerCase().includes('vegetarian') || userProfile.diet_type?.toLowerCase().includes('vegan') ? 'Fruits, nuts, roasted chana, sprouts, buttermilk' : 'Healthy snacks between meals'}
   
   COOKING INSTRUCTIONS:
   - Include specific cooking methods (boiled, steamed, roasted, grilled)
   - Mention exact quantities in grams/cups
   - Provide spice combinations and seasoning
   - Include preparation time and cooking time

4. SCHEDULE FORMAT:
Generate 10-15 activities covering wake to sleep. For each:

MEAL EXAMPLE:
{
  "time": "10:30 AM",
  "activity": "Breakfast - ${userProfile.diet_type?.toLowerCase().includes('vegetarian') || userProfile.diet_type?.toLowerCase().includes('vegan') ? 'North Indian Vegetarian' : 'Balanced'}",
  "duration": "25 min",
  "category": "meal",
  "calories": 450,
  "detailedInstructions": [
    {
      "step": 1,
      "action": "Main Dish",
      "items": [
        {"food": "${userProfile.diet_type?.toLowerCase().includes('vegetarian') || userProfile.diet_type?.toLowerCase().includes('vegan') ? 'Whole wheat paratha' : 'Whole grain toast'}", "quantity": "2 medium", "calories": 200, "protein": 6, "carbs": 36, "fats": 6, "cookingMethod": "pan-fried", "prepTime": "10 minutes", "cookTime": "5 minutes"},
        {"food": "${userProfile.diet_type?.toLowerCase().includes('vegetarian') || userProfile.diet_type?.toLowerCase().includes('vegan') ? 'Paneer bhurji' : 'Scrambled eggs'}", "quantity": "100g", "calories": 180, "protein": 14, "carbs": 4, "fats": 12, "cookingMethod": "stir-fried", "prepTime": "5 minutes", "cookTime": "8 minutes"}
      ],
      "description": "High protein main dish for sustained energy",
      "instructions": "Heat oil in pan, add spices, cook paneer/eggs until done, serve hot"
    }
  ],
  "why": "High protein ${userProfile.diet_type?.toLowerCase().includes('vegetarian') || userProfile.diet_type?.toLowerCase().includes('vegan') ? 'vegetarian' : 'balanced'} breakfast supports energy levels for work day",
  "healthNote": "Eating at scheduled time supports consistent energy levels"
}

EXERCISE EXAMPLE:
{
  "time": "6:00 PM",
  "activity": "${selectedPlan.difficulty} Workout - ${selectedPlan.difficulty === 'Gentle' ? 'Yoga & Light Cardio' : selectedPlan.difficulty === 'Balanced' ? 'Strength & Cardio' : 'High-Intensity Training'}",
  "duration": "${selectedPlan.difficulty === 'Gentle' ? '20 min' : selectedPlan.difficulty === 'Balanced' ? '30 min' : '45 min'}",
  "category": "exercise",
  "calories": ${selectedPlan.difficulty === 'Gentle' ? '150' : selectedPlan.difficulty === 'Balanced' ? '250' : '400'},
  "detailedInstructions": [
    {
      "step": 1,
      "action": "Warm-up",
      "items": [
        {"exercise": "Dynamic stretching", "duration": "3 min", "sets": 1, "reps": "10 each", "rest": "0 min"},
        {"exercise": "Light cardio", "duration": "2 min", "sets": 1, "reps": "continuous", "rest": "0 min"}
      ],
      "description": "Prepares body for workout and prevents injury",
      "instructions": "Start with arm circles, leg swings, then light jogging in place"
    },
    {
      "step": 2,
      "action": "Main Workout",
      "items": [
        {"exercise": "${selectedPlan.difficulty === 'Gentle' ? 'Yoga poses' : selectedPlan.difficulty === 'Balanced' ? 'Push-ups' : 'Burpees'}", "duration": "${selectedPlan.difficulty === 'Gentle' ? '10 min' : selectedPlan.difficulty === 'Balanced' ? '15 min' : '25 min'}", "sets": "${selectedPlan.difficulty === 'Gentle' ? '1' : selectedPlan.difficulty === 'Balanced' ? '3' : '4'}", "reps": "${selectedPlan.difficulty === 'Gentle' ? '5 poses' : selectedPlan.difficulty === 'Balanced' ? '10-15' : '15-20'}", "rest": "${selectedPlan.difficulty === 'Gentle' ? '30 sec' : selectedPlan.difficulty === 'Balanced' ? '60 sec' : '45 sec'}"}
      ],
      "description": "Main exercise component for fitness goals",
      "instructions": "Follow proper form, maintain steady breathing, complete all sets"
    }
  ],
  "why": "Builds ${selectedPlan.difficulty === 'Gentle' ? 'flexibility and basic strength' : selectedPlan.difficulty === 'Balanced' ? 'balanced fitness' : 'intensive strength and endurance'}",
  "healthNote": "Listen to your body, modify intensity as needed"
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
   
   SPECIFIC EXERCISES BY DIFFICULTY:
   - GENTLE: Yoga poses, walking, light stretching, breathing exercises, basic bodyweight movements
   - BALANCED: Push-ups, squats, lunges, planks, moderate cardio, resistance bands, light weights
   - INTENSIVE: High-intensity intervals, heavy lifting, advanced calisthenics, plyometrics, complex movements
   
   WORKOUT STRUCTURE:
   - Warm-up: 3-5 minutes (dynamic stretching, light movement)
   - Main workout: ${selectedPlan.difficulty === 'Gentle' ? '10-15 minutes' : selectedPlan.difficulty === 'Balanced' ? '15-25 minutes' : '25-40 minutes'}
   - Cool-down: 3-5 minutes (static stretching, breathing)
   - Include specific exercise names, sets, reps, and rest periods

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

    // Call API with Claude priority
    const apiKeys = getApiKeys();
    console.log('🔑 API Key Priority:', {
      totalKeys: apiKeys.length,
      primary: CLAUDE_API_KEY ? "Claude API" : "No Claude key",
      fallback: `${apiKeys.filter(key => key !== CLAUDE_API_KEY).length} Groq keys available`
    });
    
    if (apiKeys.length === 0) {
      throw new Error('No API keys configured');
    }

    let response;
    let usedKey = "none";
    let lastError = null;
    
    // Try Claude first (primary), then Groq keys (fallback)
    for (let i = 0; i < apiKeys.length; i++) {
      try {
        const currentKey = apiKeys[i];
        const isClaudeKey = currentKey === CLAUDE_API_KEY;
        const attemptType = isClaudeKey ? 'PRIMARY (Claude)' : 'FALLBACK (Groq)';
        
        console.log(`🔑 Trying ${attemptType} API key ${i + 1}/${apiKeys.length}...`);
        
        if (isClaudeKey) {
          // Claude API call
          response = await fetch("https://api.anthropic.com/v1/messages", {
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
        } else {
          // Groq API call
          response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${currentKey}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              model: "llama-3.3-70b-versatile",
              messages: [
                {
                  role: "system",
                  content: "You are a fitness scheduling AI. Generate detailed daily schedules with specific meal plans and exercises. Return ONLY valid JSON, no markdown."
                },
                {
                  role: "user",
                  content: prompt
                }
              ],
              temperature: 0.7,
              max_tokens: 8000,
              response_format: { type: "json_object" }
            })
          });
        }
        
        if (response.ok) {
          usedKey = `${isClaudeKey ? 'claude' : 'groq'}-key-${i + 1}`;
          console.log(`✅ ${attemptType} API key ${i + 1} worked! Status: ${response.status}`);
          break;
        } else {
          console.log(`❌ ${attemptType} API key ${i + 1} failed: ${response.status}`);
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
    let scheduleText = "";
    
    // Handle different API response formats
    if (data.choices && data.choices[0]?.message?.content) {
      // Groq API format
      scheduleText = data.choices[0].message.content.trim();
      console.log("📝 Groq response format detected");
    } else if (data.content && data.content[0]?.text) {
      // Claude API format
      scheduleText = data.content[0].text.trim();
      console.log("📝 Claude response format detected");
    } else {
      throw new Error("Unknown API response format");
    }

    // Clean markdown if present
    if (scheduleText.includes('```')) {
      const match = scheduleText.match(/```(?:json)?\s*(\{[\s\S]*\})\s*```/);
      if (match) scheduleText = match[1];
    }

    const parsedSchedule = JSON.parse(scheduleText);

    // Validate and ensure we have a schedule
    if (!parsedSchedule.dailySchedule || !Array.isArray(parsedSchedule.dailySchedule)) {
      throw new Error('Invalid schedule format from AI');
    }

    // Extract health warnings and schedule conflicts if present
    const healthWarnings = parsedSchedule.healthWarnings || [];
    const scheduleConflicts = parsedSchedule.scheduleConflicts || [];
    const disclaimer = parsedSchedule.disclaimer || "This is a general fitness guide. Consult your healthcare provider before starting any new exercise or nutrition program.";

    // Get the latest health analysis for this user
    let healthAnalysisId = null;
    const { data: latestAnalysis } = await supabase
      .from('health_analysis')
      .select('id')
      .eq('user_id', userProfile.id)
      .eq('is_latest', true)
      .single();
    
    if (latestAnalysis) {
      healthAnalysisId = latestAnalysis.id;
    }

    // Save daily schedule to database
    try {
      const today = new Date().toISOString().split('T')[0];
      const dayNumber = requestData.dayNumber || 1; // Default to day 1 if not provided
      
      const { error: scheduleError } = await supabase
        .from('daily_schedules')
        .insert({
          user_id: userProfile.id,
          plan_id: selectedPlan.id || null,
          health_analysis_id: healthAnalysisId,
          schedule_date: today,
          day_number: dayNumber,
          schedule_data: {
            dailySchedule: parsedSchedule.dailySchedule,
            plan_info: {
              name: selectedPlan.name || selectedPlan.title,
              difficulty: selectedPlan.difficulty
            },
            disclaimer: "This is a general fitness guide. Consult your healthcare provider before starting any new exercise or nutrition program."
          },
          ai_provider: usedKey.startsWith('claude') ? 'claude' : 'groq',
          ai_model: usedKey.startsWith('claude') ? 'claude-sonnet-4-20250514' : 'llama-3.3-70b-versatile',
          generation_parameters: {
            used_key: usedKey,
            plan_name: selectedPlan.name || selectedPlan.title,
            difficulty: selectedPlan.difficulty,
            user_profile: {
              age: userProfile.age,
              gender: userProfile.gender,
              diet_type: userProfile.diet_type
            },
            health_analysis_used: !!healthAnalysisId
          },
          is_generated: true,
          is_completed: false,
          completion_status: 'pending'
        });

      if (scheduleError) {
        console.error('❌ Error saving daily schedule to database:', scheduleError);
        // Don't fail the request, just log the error
      } else {
        console.log('✅ Daily schedule saved to database successfully');
      }
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
        provider: usedKey.startsWith('claude') ? `Claude-API-${usedKey}` : `Groq-API-${usedKey}`,
        timestamp: new Date().toISOString(),
        model: usedKey.startsWith('claude') ? "claude-sonnet-4-20250514" : "llama-3.3-70b-versatile",
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

    return new Response(JSON.stringify(response), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" }
    });

  } catch (error) {
    console.error("Error generating schedule:", error);

    // Fallback: Generate basic schedule from user data
    const { userProfile, selectedPlan } = requestData;
    
    const fallbackSchedule = [
      {
        time: formatTime(userProfile.wake_up_time || '07:00'),
        activity: "Morning Hydration",
        duration: "10 min",
        category: "hydration",
        calories: 0,
        instructions: [
          "Drink 500ml room temperature water",
          "Take morning supplements if prescribed",
          "Do 5 minutes of light stretching"
        ]
      },
      {
        time: formatTime(userProfile.breakfast_time || '08:00'),
        activity: "Breakfast",
        duration: "25 min",
        category: "meal",
        calories: Math.floor((selectedPlan.calorieTarget || 2000) * 0.3),
        instructions: [
          "2-3 eggs with vegetables",
          "1-2 slices whole grain toast",
          "1 cup fresh fruit",
          "Green tea or coffee"
        ]
      },
      {
        time: formatTime(addMinutes(userProfile.work_start || '09:00', 120)),
        activity: "Mid-Morning Break",
        duration: "10 min",
        category: "productivity",
        calories: 0,
        instructions: [
          "Stand and stretch for 2 minutes",
          "Drink 200ml water",
          "Walk around for 5 minutes",
          "Deep breathing exercises"
        ]
      },
      {
        time: formatTime(userProfile.lunch_time || '13:00'),
        activity: "Lunch",
        duration: "35 min",
        category: "meal",
        calories: Math.floor((selectedPlan.calorieTarget || 2000) * 0.35),
        instructions: [
          `4-6 oz lean protein (chicken, fish, tofu)`,
          "1 cup cooked grains (rice, quinoa)",
          "2 cups mixed vegetables",
          "Healthy fat source (olive oil, avocado)"
        ]
      },
      {
        time: formatTime(userProfile.workout_time || '18:00'),
        activity: `${userProfile.workout_type || 'Workout'} Session`,
        duration: "45 min",
        category: "exercise",
        calories: 350,
        instructions: [
          "5 min warm-up (light cardio)",
          "30 min main workout",
          "5 min cool-down stretching",
          "Hydrate throughout"
        ]
      },
      {
        time: formatTime(userProfile.dinner_time || '19:00'),
        activity: "Dinner",
        duration: "30 min",
        category: "meal",
        calories: Math.floor((selectedPlan.calorieTarget || 2000) * 0.3),
        instructions: [
          "4-5 oz lean protein",
          "2 cups vegetables (roasted or steamed)",
          "1/2 cup complex carbs",
          "Herbal tea"
        ]
      },
      {
        time: formatTime(addMinutes(userProfile.sleep_time || '23:00', -60)),
        activity: "Evening Wind-Down",
        duration: "30 min",
        category: "sleep",
        calories: 0,
        instructions: [
          "Turn off screens",
          "Light stretching or meditation",
          "Prepare for next day",
          "Deep breathing exercises"
        ]
      }
    ];

    return new Response(JSON.stringify({
        success: true,
      dailySchedule: fallbackSchedule,
      healthWarnings: [
        "⚠️ Using fallback schedule due to API error",
        "⚠️ Consult your healthcare provider before starting any fitness program",
        "⚠️ This is a basic schedule and may not address your specific health needs"
      ],
      scheduleConflicts: [],
      disclaimer: "This is a general fitness guide. Consult your healthcare provider before starting any new exercise or nutrition program.",
        meta: {
        provider: "Fallback",
        timestamp: new Date().toISOString(),
        note: "Using fallback due to API error",
        healthFocused: false
      }
    }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" }
    });
  }
});