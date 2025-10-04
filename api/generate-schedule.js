export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { selectedPlanId, planDetails, onboardingData, userProfile } = req.body;

    if (!selectedPlanId || !planDetails || !onboardingData) {
      return res.status(400).json({ 
        success: false, 
        error: 'Missing required fields: selectedPlanId, planDetails, onboardingData' 
      });
    }

    if (!process.env.VITE_GEMINI_API_KEY) {
      return res.status(500).json({ 
        success: false, 
        error: 'Gemini API key not configured' 
      });
    }

    // STEP 2: Generate personalized schedule with Gemini (detailed)
    console.log('Step 2: Generating personalized schedule...');
    const schedule = await generateDailySchedule(planDetails, onboardingData, selectedPlanId, userProfile);

    res.json({
      success: true,
      step: 'schedule_ready',
      schedule: schedule.dailySchedule,
      selectedPlan: schedule.selectedPlan,
      generatedAt: new Date().toISOString()
    });

  } catch (error) {
    console.error('Error in generate-schedule:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
}

async function generateDailySchedule(planDetails, onboardingData, selectedPlanId, userProfile) {
  // Find the selected plan from the plans array
  const selectedPlan = planDetails.plans ? planDetails.plans.find(p => p.id === selectedPlanId) : planDetails;
  
  if (!selectedPlan) {
    throw new Error(`Plan with ID ${selectedPlanId} not found`);
  }

  const prompt = `You are a schedule optimization AI. Generate a HYPER-PERSONALIZED daily schedule based on the selected plan and user's exact timings.

SELECTED PLAN:
${JSON.stringify(selectedPlan, null, 2)}

USER'S EXACT SCHEDULE:
- Wake Up: ${onboardingData.wakeUpTime || userProfile?.wake_up_time || '06:00'}
- Breakfast: ${onboardingData.breakfastTime || userProfile?.breakfast_time || '08:00'}
- Work Start: ${onboardingData.workStart || userProfile?.work_start || '09:00'}
- Lunch: ${onboardingData.lunchTime || userProfile?.lunch_time || '13:00'}
- Work End: ${onboardingData.workEnd || userProfile?.work_end || '17:00'}
- Workout: ${onboardingData.workoutTime || userProfile?.workout_time || '18:00'}
- Dinner: ${onboardingData.dinnerTime || userProfile?.dinner_time || '19:00'}
- Sleep: ${onboardingData.sleepTime || userProfile?.sleep_time || '22:00'}

WORKOUT TYPE: ${onboardingData.workoutType || userProfile?.workout_type || 'General'}
DIET TYPE: ${onboardingData.dietType || userProfile?.diet_type || 'Balanced'}
ALLERGIES: ${onboardingData.allergies?.join(', ') || userProfile?.allergies?.join(', ') || 'None'}

CRITICAL PERSONALIZATION RULES:
1. USE EXACT USER TIMES - do not suggest different times
2. DURING WORK HOURS (${onboardingData.workStart || userProfile?.work_start || '09:00'} - ${onboardingData.workEnd || userProfile?.work_end || '17:00'}):
   - NO physical workouts
   - Only suggest: desk stretches, breathing exercises, posture tips, water reminders, eye exercises
   - Keep suggestions under 5 minutes
3. WORKOUT STYLE (${onboardingData.workoutType || userProfile?.workout_type || 'General'}):
   - If YOGA: Only yoga asanas, pranayama, meditation, flexibility work
   - If GYM: Only gym exercises with weights, machines, strength training
   - If HOME: Only bodyweight exercises, resistance bands, minimal equipment
   - If CARDIO: Only running, cycling, HIIT, jumping exercises
4. MEALS:
   - Follow ${onboardingData.dietType || userProfile?.diet_type || 'Balanced'} strictly
   - Avoid ${onboardingData.allergies?.join(', ') || userProfile?.allergies?.join(', ') || 'None'}
   - Match calorie target: ${selectedPlan.calorieTarget || selectedPlan.estimatedCalories || 2000}
   - Match macro split: ${selectedPlan.macros?.protein || 30}P / ${selectedPlan.macros?.carbs || 40}C / ${selectedPlan.macros?.fats || 30}F
5. DIFFICULTY ADAPTATION:
   - ${selectedPlan.difficulty || 'Beginner'} level exercises only
   - Scale intensity appropriately

Generate COMPLETE daily schedule from wake to sleep with:
- Exact timestamps (use user's times)
- Specific activities (no generic placeholders)
- Detailed exercise lists (with sets/reps)
- Specific meal plans (with ingredients and portions)
- Calorie and macro breakdown for each meal

Return ONLY valid JSON:
{
  "dailySchedule": [
    {
      "time": "${onboardingData.wakeUpTime || userProfile?.wake_up_time || '06:00'}",
      "category": "morning_routine",
      "activity": "Wake Up & Hydration",
      "details": "Drink 500ml water, light stretching (5 min)",
      "duration": "10 min",
      "calories": 0
    },
    {
      "time": "${onboardingData.breakfastTime || userProfile?.breakfast_time || '08:00'}",
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
      "duration": "20 min"
    },
    {
      "time": "${onboardingData.workStart || userProfile?.work_start || '09:00'}",
      "category": "work",
      "activity": "Work Start - Focus Session",
      "details": "Begin work. Stay hydrated. Maintain good posture.",
      "duration": "Until ${onboardingData.workEnd || userProfile?.work_end || '17:00'}"
    },
    {
      "time": "10:30",
      "category": "work_break",
      "activity": "Desk Stretch Break",
      "details": "Neck rolls (10 reps), Shoulder shrugs (10 reps), Wrist circles (10 each), Stand and stretch",
      "duration": "5 min",
      "calories": 5
    },
    {
      "time": "${onboardingData.lunchTime || userProfile?.lunch_time || '13:00'}",
      "category": "meal",
      "activity": "Lunch",
      "meal": {
        "name": "${onboardingData.dietType || userProfile?.diet_type || 'Balanced'} Balanced Lunch",
        "items": [
          // Generate based on diet type and macros
        ],
        "totalCalories": ${Math.floor((selectedPlan.calorieTarget || selectedPlan.estimatedCalories || 2000) * 0.35)},
        "totalMacros": {/* calculated */},
        "prepTime": "25 min",
        "alternatives": []
      },
      "duration": "30 min"
    },
    {
      "time": "${onboardingData.workoutTime || userProfile?.workout_time || '18:00'}",
      "category": "workout",
      "activity": "${onboardingData.workoutType || userProfile?.workout_type || 'General'} Workout - ${selectedPlan.difficulty || 'Beginner'} Level",
      "workout": {
        "type": "${onboardingData.workoutType || userProfile?.workout_type || 'General'}",
        "warmup": [
          {"exercise": "Dynamic stretching", "duration": "5 min"}
        ],
        "mainExercises": [
          // Generate based on workout type:
          // YOGA: specific asanas with Sanskrit names and benefits
          // GYM: specific exercises with equipment, sets, reps
          // HOME: bodyweight exercises with progressions
          // CARDIO: specific cardio routines with intervals
        ],
        "cooldown": [
          {"exercise": "Static stretching", "duration": "5 min"}
        ],
        "totalDuration": "45 min",
        "caloriesBurned": 300,
        "intensity": "${selectedPlan.difficulty || 'Beginner'}"
      }
    },
    {
      "time": "${onboardingData.dinnerTime || userProfile?.dinner_time || '19:00'}",
      "category": "meal",
      "activity": "Dinner",
      "meal": {/* similar structure */}
    },
    {
      "time": "${onboardingData.sleepTime || userProfile?.sleep_time || '22:00'}",
      "category": "sleep",
      "activity": "Bedtime Routine",
      "details": "Wind down activities, prepare for sleep",
      "duration": "30 min"
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
          responseMimeType: "application/json"
        }
      })
    }
  );

  const data = await response.json();
  const text = data.candidates[0].content.parts[0].text;

  // Try to parse the JSON response
  let dailySchedule = [];
  try {
    const parsed = JSON.parse(text);
    dailySchedule = parsed.dailySchedule || [];
  } catch (parseError) {
    console.error('Failed to parse Gemini response:', parseError);
    console.log('Raw response:', text);
    
    // Fallback: create a basic schedule structure
    dailySchedule = [
      {
        time: onboardingData.wakeUpTime || userProfile?.wake_up_time || '06:00',
        category: 'morning_routine',
        activity: 'Wake Up & Hydration',
        details: 'Drink 500ml water, light stretching (5 min)',
        duration: '10 min',
        calories: 0
      },
      {
        time: onboardingData.workoutTime || userProfile?.workout_time || '18:00',
        category: 'workout',
        activity: `${onboardingData.workoutType || userProfile?.workout_type || 'General'} Workout`,
        details: `Follow your ${selectedPlan.difficulty || 'Beginner'} level plan`,
        duration: '45 min',
        calories: 300
      },
      {
        time: onboardingData.sleepTime || userProfile?.sleep_time || '22:00',
        category: 'sleep',
        activity: 'Bedtime Routine',
        details: 'Wind down activities, prepare for sleep',
        duration: '30 min',
        calories: 0
      }
    ];
  }

  return {
    dailySchedule,
    selectedPlan
  };
}
