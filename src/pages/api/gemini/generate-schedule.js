export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { plan, userProfile, healthScore, selectedPlanId } = req.body;

  if (!plan) {
    return res.status(400).json({ error: 'Plan data is required' });
  }

  if (!process.env.VITE_GEMINI_API_KEY) {
    return res.status(500).json({ error: 'Gemini API key not configured' });
  }

  try {
    // Find the selected plan from the plans array
    const selectedPlan = plan.plans ? plan.plans.find(p => p.id === selectedPlanId) : plan;
    
    const prompt = `You are a schedule optimization AI. Generate a HYPER-PERSONALIZED daily schedule based on the selected plan and user's exact timings.

SELECTED PLAN:
${JSON.stringify(selectedPlan, null, 2)}

USER'S EXACT SCHEDULE:
- Wake Up: ${userProfile.wake_up_time || '06:00'}
- Breakfast: ${userProfile.breakfast_time || '08:00'}
- Work Start: ${userProfile.work_start || '09:00'}
- Lunch: ${userProfile.lunch_time || '13:00'}
- Work End: ${userProfile.work_end || '17:00'}
- Workout: ${userProfile.workout_time || '18:00'}
- Dinner: ${userProfile.dinner_time || '19:00'}
- Sleep: ${userProfile.sleep_time || '22:00'}

WORKOUT TYPE: ${userProfile.workout_type || 'General'}
DIET TYPE: ${userProfile.diet_type || 'Balanced'}
ALLERGIES: ${userProfile.allergies?.join(', ') || 'None'}

CRITICAL PERSONALIZATION RULES:
1. USE EXACT USER TIMES - do not suggest different times
2. DURING WORK HOURS (${userProfile.work_start || '09:00'} - ${userProfile.work_end || '17:00'}):
   - NO physical workouts
   - Only suggest: desk stretches, breathing exercises, posture tips, water reminders, eye exercises
   - Keep suggestions under 5 minutes
3. WORKOUT STYLE (${userProfile.workout_type || 'General'}):
   - If YOGA: Only yoga asanas, pranayama, meditation, flexibility work
   - If GYM: Only gym exercises with weights, machines, strength training
   - If HOME: Only bodyweight exercises, resistance bands, minimal equipment
   - If CARDIO: Only running, cycling, HIIT, jumping exercises
4. MEALS:
   - Follow ${userProfile.diet_type || 'Balanced'} strictly
   - Avoid ${userProfile.allergies?.join(', ') || 'None'}
   - Match calorie target: ${selectedPlan.calorieTarget || selectedPlan.estimatedCalories || 2000}
   - Match macro split: ${selectedPlan.macros?.protein || 30}P / ${selectedPlan.macros?.carbs || 40}C / ${selectedPlan.macros?.fats || 30}F
5. DIFFICULTY ADAPTATION:
   - ${selectedPlan.difficulty || 'Beginner'} level exercises only
   - Scale intensity appropriately

Generate COMPLETE daily schedule from wake to sleep with CATEGORIZED activities:
- Group related activities into main categories (Wakeup Routine, Breakfast, Morning Exercise, etc.)
- Each category should have a main time and duration
- Include detailed sub-activities within each category
- Use exact user timestamps for main categories
- Specific activities with detailed instructions
- Detailed exercise lists (with sets/reps)
- Specific meal plans (with ingredients and portions)
- Calorie and macro breakdown for each meal

Return ONLY valid JSON with this structure:
{
  "dailySchedule": [
    {
      "time": "${userProfile.wake_up_time || '06:00'}",
      "category": "wakeup_routine",
      "activity": "Wakeup Routine",
      "details": "Start your day with energy and focus",
      "duration": "30 min",
      "calories": 0,
      "subActivities": [
        {
          "time": "${userProfile.wake_up_time || '06:00'}",
          "activity": "Drink 500ml water immediately upon waking",
          "duration": "2 min"
        },
        {
          "time": "06:05",
          "activity": "5 minutes of light stretching",
          "duration": "5 min"
        },
        {
          "time": "06:10",
          "activity": "Open curtains for natural light",
          "duration": "1 min"
        },
        {
          "time": "06:11",
          "activity": "Set daily intention",
          "duration": "2 min"
        },
        {
          "time": "06:15",
          "activity": "5 minutes of deep breathing exercises",
          "duration": "5 min"
        }
      ]
    },
    {
      "time": "${userProfile.breakfast_time || '07:00'}",
      "category": "breakfast",
      "activity": "Breakfast",
      "details": "Nutritious morning meal to fuel your day",
      "duration": "30 min",
      "calories": 365,
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
      "subActivities": [
        {
          "time": "${userProfile.breakfast_time || '07:00'}",
          "activity": "Prepare breakfast ingredients",
          "duration": "5 min"
        },
        {
          "time": "07:05",
          "activity": "Cook and serve meal",
          "duration": "15 min"
        },
        {
          "time": "07:20",
          "activity": "Eat mindfully and enjoy",
          "duration": "10 min"
        }
      ]
    },
    {
      "time": "${userProfile.work_start || '09:00'}",
      "category": "work_session",
      "activity": "Work Session",
      "details": "Focused work time with productivity breaks",
      "duration": "8 hours",
      "calories": 0,
      "subActivities": [
        {
          "time": "${userProfile.work_start || '09:00'}",
          "activity": "Start work - check emails and prioritize tasks",
          "duration": "30 min"
        },
        {
          "time": "10:30",
          "activity": "Desk Stretch Break - Neck rolls, shoulder shrugs, wrist circles",
          "duration": "5 min"
        },
        {
          "time": "12:00",
          "activity": "Deep work session - focus on important tasks",
          "duration": "60 min"
        },
        {
          "time": "15:00",
          "activity": "Eye rest break - look at distant objects for 2 minutes",
          "duration": "5 min"
        }
      ]
    },
    {
      "time": "${userProfile.lunch_time || '13:00'}",
      "category": "lunch",
      "activity": "Lunch",
      "details": "Balanced midday meal for sustained energy",
      "duration": "45 min",
      "calories": ${Math.floor((selectedPlan.calorieTarget || selectedPlan.estimatedCalories || 2000) * 0.35)},
      "meal": {
        "name": "${userProfile.diet_type || 'Balanced'} Balanced Lunch",
        "items": [
          {"food": "Grilled chicken breast", "quantity": "150g", "calories": 250, "protein": 46, "carbs": 0, "fats": 5},
          {"food": "Brown rice", "quantity": "100g cooked", "calories": 110, "protein": 3, "carbs": 23, "fats": 1},
          {"food": "Mixed vegetables", "quantity": "150g", "calories": 50, "protein": 3, "carbs": 10, "fats": 0}
        ],
        "totalCalories": ${Math.floor((selectedPlan.calorieTarget || selectedPlan.estimatedCalories || 2000) * 0.35)},
        "totalMacros": {"protein": 52, "carbs": 33, "fats": 6},
        "prepTime": "25 min",
        "alternatives": ["Quinoa bowl with vegetables", "Salad with protein"]
      },
      "subActivities": [
        {
          "time": "${userProfile.lunch_time || '13:00'}",
          "activity": "Prepare lunch ingredients",
          "duration": "10 min"
        },
        {
          "time": "13:10",
          "activity": "Cook and serve meal",
          "duration": "20 min"
        },
        {
          "time": "13:30",
          "activity": "Eat mindfully and take a short walk",
          "duration": "15 min"
        }
      ]
    },
    {
      "time": "${userProfile.workout_time || '18:00'}",
      "category": "evening_exercise",
      "activity": "Evening Exercise",
      "details": "${userProfile.workout_type || 'General'} workout for strength and energy",
      "duration": "45 min",
      "calories": 300,
      "workout": {
        "type": "${userProfile.workout_type || 'General'}",
        "warmup": [
          {"exercise": "Dynamic stretching", "duration": "5 min"}
        ],
        "mainExercises": [
          {"exercise": "Push-ups", "sets": 3, "reps": 12, "duration": "10 min"},
          {"exercise": "Squats", "sets": 3, "reps": 15, "duration": "10 min"},
          {"exercise": "Plank", "sets": 3, "reps": "30 sec", "duration": "5 min"}
        ],
        "cooldown": [
          {"exercise": "Static stretching", "duration": "5 min"}
        ],
        "totalDuration": "45 min",
        "caloriesBurned": 300,
        "intensity": "${selectedPlan.difficulty || 'Beginner'}"
      },
      "subActivities": [
        {
          "time": "${userProfile.workout_time || '18:00'}",
          "activity": "Warm-up and prepare equipment",
          "duration": "5 min"
        },
        {
          "time": "18:05",
          "activity": "Main workout routine",
          "duration": "30 min"
        },
        {
          "time": "18:35",
          "activity": "Cool-down and stretching",
          "duration": "10 min"
        }
      ]
    },
    {
      "time": "${userProfile.dinner_time || '19:00'}",
      "category": "dinner",
      "activity": "Dinner",
      "details": "Light evening meal for recovery and sleep preparation",
      "duration": "30 min",
      "calories": 400,
      "meal": {
        "name": "Light Dinner",
        "items": [
          {"food": "Salmon fillet", "quantity": "120g", "calories": 200, "protein": 22, "carbs": 0, "fats": 12},
          {"food": "Steamed broccoli", "quantity": "100g", "calories": 35, "protein": 3, "carbs": 7, "fats": 0},
          {"food": "Sweet potato", "quantity": "100g", "calories": 86, "protein": 2, "carbs": 20, "fats": 0}
        ],
        "totalCalories": 400,
        "totalMacros": {"protein": 27, "carbs": 27, "fats": 12},
        "prepTime": "20 min",
        "alternatives": ["Grilled fish with vegetables", "Vegetable stir-fry"]
      },
      "subActivities": [
        {
          "time": "${userProfile.dinner_time || '19:00'}",
          "activity": "Prepare dinner ingredients",
          "duration": "10 min"
        },
        {
          "time": "19:10",
          "activity": "Cook and serve meal",
          "duration": "15 min"
        },
        {
          "time": "19:25",
          "activity": "Eat mindfully and clean up",
          "duration": "5 min"
        }
      ]
    },
    {
      "time": "${userProfile.sleep_time || '22:00'}",
      "category": "bedtime_routine",
      "activity": "Bedtime Routine",
      "details": "Wind down activities to prepare for restful sleep",
      "duration": "30 min",
      "calories": 0,
      "subActivities": [
        {
          "time": "${userProfile.sleep_time || '22:00'}",
          "activity": "Turn off screens and dim lights",
          "duration": "5 min"
        },
        {
          "time": "22:05",
          "activity": "Gentle stretching or meditation",
          "duration": "10 min"
        },
        {
          "time": "22:15",
          "activity": "Prepare for bed and read",
          "duration": "15 min"
        }
      ]
    }
  ]
}`;

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${process.env.VITE_GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 8192,
            responseMimeType: "application/json",
            responseSchema: {
              type: "object",
              properties: {
                dailySchedule: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      time: { type: "string" },
                      category: { type: "string" },
                      activity: { type: "string" },
                      details: { type: "string" },
                      duration: { type: "string" },
                      calories: { type: "number" },
                      subActivities: { type: "array" },
                      meal: { type: "object" },
                      workout: { type: "object" }
                    }
                  }
                }
              }
            }
          }
        })
      }
    );

    const data = await response.json();
    const text = data.candidates[0].content.parts[0].text;

    // Try to parse the JSON response
    let dailySchedule = [];
    try {
      // First, try to parse as JSON directly
      const parsed = JSON.parse(text);
      dailySchedule = parsed.dailySchedule || [];
    } catch (parseError) {
      console.error('Failed to parse Gemini response as JSON:', parseError);
      console.log('Raw response:', text);
      
      // If JSON parsing fails, try to extract JSON from HTML or other formats
      try {
        // Remove HTML tags and extract JSON
        const cleanText = text
          .replace(/<[^>]*>/g, '') // Remove HTML tags
          .replace(/&lt;/g, '<')
          .replace(/&gt;/g, '>')
          .replace(/&amp;/g, '&')
          .replace(/&quot;/g, '"')
          .replace(/&#39;/g, "'");
        
        // Try to find JSON array or object in the cleaned text
        const jsonMatch = cleanText.match(/\{[\s\S]*\}/) || cleanText.match(/\[[\s\S]*\]/);
        if (jsonMatch) {
          const parsed = JSON.parse(jsonMatch[0]);
          dailySchedule = parsed.dailySchedule || parsed || [];
        } else {
          throw new Error('No valid JSON found in response');
        }
      } catch (htmlParseError) {
        console.error('Failed to parse HTML response:', htmlParseError);
        console.log('Cleaned text:', text.replace(/<[^>]*>/g, ''));
      
      // Fallback: create a basic schedule structure
      dailySchedule = [
        {
          time: userProfile.wake_up_time || '06:00',
          category: 'morning_routine',
          activity: 'Wake Up & Hydration',
          details: 'Drink 500ml water, light stretching (5 min)',
          duration: '10 min',
          calories: 0
        },
        {
          time: userProfile.workout_time || '18:00',
          category: 'workout',
          activity: `${userProfile.workout_type || 'General'} Workout`,
          details: `Follow your ${selectedPlan.difficulty || 'Beginner'} level plan`,
          duration: '45 min',
          calories: 300
        },
        {
          time: userProfile.sleep_time || '22:00',
          category: 'sleep',
          activity: 'Bedtime Routine',
          details: 'Wind down activities, prepare for sleep',
          duration: '30 min',
          calories: 0
        }
      ];
    }

    // Convert dailySchedule to activities format for compatibility
    const activities = dailySchedule.map((item, index) => ({
      id: `activity_${index}`,
      title: item.activity,
      time: item.time,
      duration: item.duration,
      type: item.category,
      details: item.details,
      instructions: item.workout?.mainExercises?.map(ex => ex.exercise) || [item.details],
      equipment: item.workout?.equipment || [],
      difficulty: selectedPlan.difficulty || 'Beginner',
      calories: item.calories || 0,
      meal: item.meal || null,
      workout: item.workout || null
    }));

    res.status(200).json({
      success: true,
      activities: activities,
      dailySchedule: dailySchedule,
      plan: selectedPlan.name || selectedPlan.title,
      generatedAt: new Date().toISOString()
    });

  } catch (error) {
    console.error('Error generating schedule with Gemini:', error);
    res.status(500).json({
      error: 'Failed to generate schedule',
      details: error.message
    });
  }
}