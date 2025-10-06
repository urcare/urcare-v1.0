import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type"
};

// Multiple API keys for load balancing and fallback
const GROQ_API_KEY_1 = Deno.env.get('GROQ_API_KEY');
const GROQ_API_KEY_2 = Deno.env.get('GROQ_API_KEY_2');
const GROQ_API_KEY_3 = Deno.env.get('GROQ_API_KEY_3');
const GROQ_API_KEY_4 = Deno.env.get('GROQ_API_KEY_4');
const GROQ_API_KEY_5 = Deno.env.get('GROQ_API_KEY_5');
const GROQ_API_KEY_6 = Deno.env.get('GROQ_API_KEY_6');

// Helper function to get API key with fallback for plan-activities
const getApiKey = () => {
  // Plan-activities uses GROQ_API_KEY_3 and GROQ_API_KEY_4 (working keys)
  const keys = [GROQ_API_KEY_3, GROQ_API_KEY_4];
  return keys.find(key => key && key.trim() !== '') || null;
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

  const { userProfile, selectedPlan, healthScore, primaryGoal } = requestData;

  try {

    if (!userProfile || !selectedPlan) {
      return new Response(JSON.stringify({
        error: "User profile and selected plan are required"
      }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    }

    // Build focused prompt for Groq
    const prompt = `Generate a detailed daily schedule for this fitness plan.

USER INFO:
- Age: ${userProfile.age}, Gender: ${userProfile.gender}
- Goal: ${primaryGoal || userProfile.health_goals?.join(', ')}
- Health Score: ${healthScore}/100
- Diet: ${userProfile.diet_type || 'Balanced'}
- Workout: ${userProfile.workout_type || 'General'}
- Conditions: ${userProfile.chronic_conditions?.join(', ') || 'None'}

PLAN SELECTED: ${selectedPlan.name || selectedPlan.title}
- Difficulty: ${selectedPlan.difficulty}
- Calories: ${selectedPlan.calorieTarget || 2000}/day
- Macros: ${selectedPlan.macros?.protein || 30}% protein, ${selectedPlan.macros?.carbs || 40}% carbs, ${selectedPlan.macros?.fats || 30}% fats

USER SCHEDULE (USE EXACT TIMES):
- Wake: ${userProfile.wake_up_time || '07:00'}
- Breakfast: ${userProfile.breakfast_time || '08:00'}
- Work: ${userProfile.work_start || '09:00'} - ${userProfile.work_end || '17:00'}
- Lunch: ${userProfile.lunch_time || '13:00'}
- Workout: ${userProfile.workout_time || '18:00'}
- Dinner: ${userProfile.dinner_time || '19:00'}
- Sleep: ${userProfile.sleep_time || '23:00'}

RULES:
1. Use EXACT user times provided
2. During work hours: ONLY desk stretches, posture tips, water reminders
3. For ${userProfile.workout_type}: give specific exercises
4. For ${userProfile.diet_type}: appropriate food choices
5. Respect ${userProfile.chronic_conditions?.join(', ') || 'general health'}
6. Split ${selectedPlan.calorieTarget || 2000} calories: 30% breakfast, 35% lunch, 30% dinner, 5% snacks

Generate 8-12 activities from wake to sleep. For each activity include:
- Exact time (use user's schedule)
- Activity name
- Duration
- Category (meal/exercise/hydration/productivity/sleep)
- Calories (if meal/exercise)
- 3-5 specific instructions (for meals: exact foods with quantities)

Return ONLY valid JSON:
{
  "dailySchedule": [
    {
      "time": "07:00 AM",
      "activity": "Morning Hydration",
      "duration": "10 min",
      "category": "hydration",
      "calories": 0,
      "instructions": ["specific instruction 1", "instruction 2", "instruction 3"]
    }
  ]
}`;

    // Call Groq API
    const apiKey = getApiKey();
    if (!apiKey) {
      throw new Error('No GROQ API keys configured');
    }

    const groqResponse = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
            headers: {
        'Authorization': `Bearer ${apiKey}`,
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
        max_tokens: 3000, // Limited to prevent timeout
        response_format: { type: "json_object" }
            })
          });

    if (!groqResponse.ok) {
      throw new Error(`Groq API error: ${groqResponse.statusText}`);
    }

    const groqData = await groqResponse.json();
    let scheduleText = groqData.choices[0].message.content.trim();

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

    // Add safety disclaimer
    const response = {
      success: true,
      dailySchedule: parsedSchedule.dailySchedule,
      disclaimer: "This is a general fitness guide. Consult your healthcare provider before starting any new exercise or nutrition program.",
      meta: {
        provider: "Groq-llama-3.3-70b",
        timestamp: new Date().toISOString(),
        planName: selectedPlan.name || selectedPlan.title,
        difficulty: selectedPlan.difficulty
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
      disclaimer: "This is a general fitness guide. Consult your healthcare provider before starting any new exercise or nutrition program.",
        meta: {
        provider: "Fallback",
        timestamp: new Date().toISOString(),
        note: "Using fallback due to API error"
      }
    }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" }
    });
  }
});