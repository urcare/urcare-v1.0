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
    console.log("🔍 Plan-activities function called");
    
    const authHeader = req.headers.get("Authorization");
    console.log("🔍 Auth header:", authHeader ? "Present" : "Missing");

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? "",
      { global: { headers: { Authorization: authHeader } } }
    );

    const { selectedPlan, userProfile } = await req.json();
    console.log("🔍 Request data:", { selectedPlan: selectedPlan?.title, userProfile: userProfile?.age });

    console.log("🔍 Generating activities for plan:", selectedPlan?.title);

    // Get Groq API keys
    const GROQ_API_KEY = Deno.env.get("GROQ_API_KEY");
    const GROQ_API_KEY_2 = Deno.env.get("GROQ_API_KEY_2");
    const GROQ_API_KEY_3 = Deno.env.get("GROQ_API_KEY_3");

    console.log("🔍 API Keys:", { 
      primary: GROQ_API_KEY ? "Present" : "Missing",
      secondary: GROQ_API_KEY_2 ? "Present" : "Missing",
      tertiary: GROQ_API_KEY_3 ? "Present" : "Missing"
    });

    if (!GROQ_API_KEY) {
      console.log("❌ No GROQ_API_KEY found");
      return new Response(
        JSON.stringify({ success: false, error: "Groq API key not configured" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Create hyper-personalized prompt based on user's exact schedule and preferences
    const prompt = `
You are a schedule optimization AI. Generate a HYPER-PERSONALIZED daily schedule based on the selected plan and user's exact timings.

SELECTED PLAN:
${JSON.stringify(selectedPlan, null, 2)}

USER'S EXACT SCHEDULE:
- Wake Up: ${userProfile.wake_up_time}
- Breakfast: ${userProfile.breakfast_time}
- Work Start: ${userProfile.work_start}
- Lunch: ${userProfile.lunch_time}
- Work End: ${userProfile.work_end}
- Workout: ${userProfile.workout_time}
- Dinner: ${userProfile.dinner_time}
- Sleep: ${userProfile.sleep_time}

WORKOUT TYPE: ${userProfile.workout_type}
DIET TYPE: ${userProfile.diet_type}
ALLERGIES: ${userProfile.allergies?.join(', ') || 'None'}
CHRONIC CONDITIONS: ${userProfile.chronic_conditions?.join(', ') || 'None'}
HEALTH GOALS: ${userProfile.health_goals?.join(', ') || 'Not specified'}

CRITICAL: Generate activities SPECIFIC to the user's health goals and conditions. Do NOT use generic activities like "Outdoor Activities" or "Rest Day". Create detailed, specific activities that directly address their health goals.

CRITICAL PERSONALIZATION RULES:
1. USE EXACT USER TIMES - do not suggest different times
2. DURING WORK HOURS (${userProfile.work_start} - ${userProfile.work_end}):
   - NO physical workouts
   - Only suggest: desk stretches, breathing exercises, posture tips, water reminders, eye exercises
   - Keep suggestions under 5 minutes
3. WORKOUT STYLE (${userProfile.workout_type}):
   - If YOGA: Only yoga asanas, pranayama, meditation, flexibility work
   - If GYM: Only gym exercises with weights, machines, strength training
   - If HOME: Only bodyweight exercises, resistance bands, minimal equipment
   - If CARDIO: Only running, cycling, HIIT, jumping exercises
4. MEALS:
   - Follow ${userProfile.diet_type} strictly
   - Avoid ${userProfile.allergies?.join(', ') || 'None'}
   - Match calorie target: ${selectedPlan.estimatedCalories || 2000}
5. DIFFICULTY ADAPTATION:
   - ${selectedPlan.difficulty} level exercises only
   - Scale intensity appropriately
6. CHRONIC CONDITIONS CONSIDERATION:
   - ${userProfile.chronic_conditions?.join(', ') || 'None'} - adapt activities accordingly
7. HEALTH GOALS FOCUS:
   - ${userProfile.health_goals?.join(', ') || 'Not specified'} - prioritize these in activities

SPECIFIC HEALTH GOAL ACTIVITIES:
${userProfile.health_goals?.includes('better_sleep_recovery') ? `
- SLEEP RECOVERY: Include sleep hygiene activities, relaxation techniques, blue light reduction, sleep supplements timing
- NO caffeine after 2 PM, screen-free hour before bed, sleep environment optimization
` : ''}
${userProfile.health_goals?.includes('reduce_stress_anxiety') ? `
- STRESS REDUCTION: Include meditation, breathing exercises, stress management techniques, anxiety-reducing activities
- Mindfulness practices, progressive muscle relaxation, stress-relief exercises
` : ''}
${userProfile.health_goals?.includes('boost_energy_vitality') ? `
- ENERGY BOOST: Include energizing exercises, nutrition timing, energy management techniques
- Morning energizing routines, energy-boosting snacks, vitality-enhancing activities
` : ''}
${userProfile.chronic_conditions?.includes('sleep_disorders_poor_sleep') ? `
- SLEEP DISORDER MANAGEMENT: Include sleep disorder-specific activities, sleep hygiene, circadian rhythm optimization
- Sleep restriction therapy, sleep consolidation, sleep environment modifications
` : ''}

AVOID GENERIC ACTIVITIES:
- NO "Outdoor Activities for Cardiovascular Health"
- NO "Rest Day" 
- NO generic "Cardio" or "Strength Training"
- NO vague "Wellness Activities"
- Create SPECIFIC, DETAILED activities that directly address the user's goals

Generate COMPLETE daily schedule from wake to sleep with:
- Exact timestamps (use user's times) - MUST be in chronological order
- Specific activities (no generic placeholders)
- Detailed exercise lists (with sets/reps)
- Specific meal plans (with ingredients and portions)
- Calorie and macro breakdown for each meal
- Detailed instructions for each activity
- Equipment requirements
- Duration and difficulty level

CRITICAL: Return activities in CHRONOLOGICAL ORDER from earliest to latest time

FINAL INSTRUCTION: Create activities that are UNIQUE to this user's specific health goals, conditions, and preferences. Each activity should have a specific name and purpose that directly addresses their needs. Do not use generic templates.

Return ONLY valid JSON:
{
  "dailySchedule": [
    {
      "time": "${userProfile.wake_up_time}",
      "category": "morning_routine",
      "activity": "Wake Up & Hydration",
      "details": "Drink 500ml water, light stretching (5 min)",
      "duration": "10 min",
      "calories": 0,
      "instructions": "Start your day with hydration and light stretching",
      "equipment": [],
      "difficulty": "Easy"
    },
    {
      "time": "${userProfile.breakfast_time}",
      "category": "meal",
      "activity": "Breakfast",
      "meal": {
        "name": "Protein-Rich Breakfast",
        "items": [
          {"food": "Oats", "quantity": "50g", "calories": 190, "protein": 7, "carbs": 34, "fats": 3},
          {"food": "Banana", "quantity": "1 medium", "calories": 105, "protein": 1, "carbs": 27, "fats": 0},
          {"food": "Almonds", "quantity": "10 pieces", "calories": 70, "protein": 3, "carbs": 3, "fats": 6}
        ],
        "totalCalories": 365,
        "totalMacros": {"protein": 11, "carbs": 64, "fats": 9},
        "prepTime": "15 min",
        "alternatives": ["Eggs and whole wheat toast", "Greek yogurt with fruits"]
      },
      "duration": "20 min",
      "instructions": "Eat mindfully, chew thoroughly, no distractions",
      "equipment": [],
      "difficulty": "Easy"
    },
    {
      "time": "${userProfile.work_start}",
      "category": "work",
      "activity": "Work Start - Focus Session",
      "details": "Begin work. Stay hydrated. Maintain good posture.",
      "duration": "Until ${userProfile.work_end}",
      "instructions": "Set up standing desk if possible, take movement breaks every 30 minutes",
      "equipment": [],
      "difficulty": "Easy"
    },
    {
      "time": "${userProfile.lunch_time}",
      "category": "meal",
      "activity": "Lunch",
      "meal": {
        "name": "${userProfile.diet_type} Balanced Lunch",
        "items": [
          // Generate based on diet type and macros
        ],
        "totalCalories": ${Math.floor((selectedPlan.estimatedCalories || 2000) * 0.35)},
        "totalMacros": {/* calculated */},
        "prepTime": "25 min",
        "alternatives": []
      },
      "duration": "30 min",
      "instructions": "Eat in sequence: vegetables first, then protein, then carbs last",
      "equipment": [],
      "difficulty": "Easy"
    },
    {
      "time": "${userProfile.workout_time}",
      "category": "workout",
      "activity": "Specific workout name based on health goals and workout type",
      "workout": {
        "type": "${userProfile.workout_type}",
        "warmup": [
          {"exercise": "Specific warmup exercise", "duration": "5 min", "instructions": "Detailed instructions"}
        ],
        "mainExercises": [
          // Generate SPECIFIC exercises based on:
          // 1. User's health goals (sleep, stress, energy)
          // 2. Workout type (yoga, gym, home, cardio)
          // 3. Chronic conditions (sleep disorders, etc.)
          // 4. Plan difficulty level
          // Example: "Sleep-Enhancing Yoga Sequence" or "Stress-Relief Breathing Practice"
        ],
        "cooldown": [
          {"exercise": "Specific cooldown exercise", "duration": "5 min", "instructions": "Detailed instructions"}
        ],
        "totalDuration": "45 min",
        "caloriesBurned": 300,
        "intensity": "${selectedPlan.difficulty}",
        "healthGoalFocus": "Specific to user's goals"
      },
      "duration": "45 min",
      "instructions": "Detailed, specific instructions for this exact activity",
      "equipment": ["Specific equipment needed"],
      "difficulty": "${selectedPlan.difficulty}"
    },
    {
      "time": "${userProfile.dinner_time}",
      "category": "meal",
      "activity": "Dinner",
      "meal": {
        "name": "Evening Meal",
        "items": [
          // Generate based on diet type and remaining calories
        ],
        "totalCalories": ${Math.floor((selectedPlan.estimatedCalories || 2000) * 0.25)},
        "totalMacros": {/* calculated */},
        "prepTime": "30 min",
        "alternatives": []
      },
      "duration": "30 min",
      "instructions": "Eat slowly, stop at 80% full, no screens during meal",
      "equipment": [],
      "difficulty": "Easy"
    },
    {
      "time": "${userProfile.sleep_time}",
      "category": "sleep",
      "activity": "Bedtime Routine",
      "details": "Wind down activities, prepare for sleep",
      "duration": "30 min",
      "instructions": "No screens 1 hour before bed, dim lights, practice relaxation",
      "equipment": [],
      "difficulty": "Easy"
    }
  ]
}`;

    // Try to call Groq API
    let activityData;
    let usedProvider = 'Groq-Primary';

    try {
      console.log("🔍 Calling Groq API...");
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
          max_tokens: 2000,
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
        console.log("✅ Successfully parsed Groq response");
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
              max_tokens: 2000,
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
            usedProvider = 'Groq-Secondary';
            console.log("✅ Successfully parsed Groq secondary response");
          } catch (parseError) {
            console.error('❌ JSON parsing error (secondary):', parseError);
            throw new Error('Failed to parse Groq secondary response');
          }
        } catch (secondaryError) {
          console.log('⚠️ Secondary Groq API failed, trying third...');
          
          // Try third API key if secondary fails
          if (GROQ_API_KEY_3) {
            try {
              const response3 = await fetch("https://api.groq.com/openai/v1/chat/completions", {
                method: "POST",
                headers: {
                  "Authorization": `Bearer ${GROQ_API_KEY_3}`,
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
                  max_tokens: 2000,
                  temperature: 0.7
                })
              });

              if (!response3.ok) {
                throw new Error(`Groq Third API error: ${response3.status}`);
              }

              const data3 = await response3.json();
              const responseText3 = data3.choices[0].message.content;
              console.log('📨 Groq Third Response:', responseText3);

              let content3 = responseText3;
              const jsonMatch3 = content3.match(/\{[\s\S]*\}/);
              if (jsonMatch3) {
                content3 = jsonMatch3[0];
              }
              
              try {
                activityData = JSON.parse(content3);
                usedProvider = 'Groq-Third';
                console.log("✅ Successfully parsed Groq third response");
              } catch (parseError) {
                console.error('❌ JSON parsing error (third):', parseError);
                throw new Error('Failed to parse Groq third response');
              }
            } catch (thirdError) {
              console.error('❌ All Groq APIs failed:', thirdError);
              throw new Error('All Groq API calls failed');
            }
          } else {
            throw primaryError;
          }
        }
      } else {
        throw primaryError;
      }
    }

    // Convert AI response to activities format
    let activities: any[] = [];
    
    if (activityData && activityData.dailySchedule) {
      // Sort daily schedule by time to ensure chronological order
      const sortedSchedule = activityData.dailySchedule.sort((a, b) => {
        // Convert time to minutes for proper sorting
        const timeToMinutes = (timeStr) => {
          const [hours, minutes] = timeStr.split(':').map(Number);
          return hours * 60 + minutes;
        };
        return timeToMinutes(a.time) - timeToMinutes(b.time);
      });
      
      console.log("📅 Sorted schedule times:", sortedSchedule.map(item => item.time));
      
      // Convert daily schedule to activities format
      activities = [
        {
          week: 1,
          day: "Monday",
          activities: sortedSchedule.map(scheduleItem => ({
            name: scheduleItem.activity,
            time: scheduleItem.time,
            duration: scheduleItem.duration,
            instructions: scheduleItem.instructions,
            equipment: scheduleItem.equipment || [],
            difficulty: scheduleItem.difficulty,
            calories: scheduleItem.calories || 0,
            category: scheduleItem.category,
            details: scheduleItem.details,
            meal: scheduleItem.meal || null,
            workout: scheduleItem.workout || null
          }))
        }
      ];
    } else if (activityData && activityData.activities) {
      activities = activityData.activities;
    } else {
      // Fallback to basic activities if AI fails
      activities = [
        {
          week: 1,
          day: "Monday",
          activities: [
            {
              name: "Morning Routine",
              time: userProfile?.wake_up_time || "06:00",
              duration: "20 minutes",
              instructions: "Start your day with hydration and light stretching",
              equipment: [],
              difficulty: "Easy",
              calories: 50,
              category: "morning_routine",
              details: "Wake up and hydrate",
              meal: null,
              workout: null
            }
          ]
        }
      ];
    }

    console.log("✅ Returning activities:", activities.length, "weeks");

    return new Response(
      JSON.stringify({
        success: true,
        activities: activities,
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