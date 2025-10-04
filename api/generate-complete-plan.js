import { Groq } from 'groq-sdk';

const groq = new Groq({
  apiKey: process.env.VITE_GROQ_API_KEY,
});

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { primaryGoal, onboardingData, userProfile } = req.body;

    if (!primaryGoal || !onboardingData || !userProfile) {
      return res.status(400).json({ 
        success: false, 
        error: 'Missing required fields: primaryGoal, onboardingData, userProfile' 
      });
    }

    if (!process.env.VITE_GROQ_API_KEY) {
      return res.status(500).json({ 
        success: false, 
        error: 'Groq API key not configured' 
      });
    }

    // STEP 1: Generate plan details with Groq (fast)
    console.log('Step 1: Generating plan details...');
    const planDetails = await generatePlanDetails(userProfile, primaryGoal, onboardingData);

    // Return plans first so user can select
    res.json({
      success: true,
      step: 'plans_ready',
      plans: planDetails.plans,
      generatedAt: new Date().toISOString()
    });

  } catch (error) {
    console.error('Error in generate-complete-plan:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
}

async function generatePlanDetails(userProfile, primaryGoal, onboardingData) {
  const prompt = `You are a fitness planning AI. Generate 3 distinct health plans based on user's goal and profile.

PRIMARY GOAL: ${primaryGoal}

ONBOARDING DATA:
- Name: ${onboardingData.fullName || userProfile.full_name || 'User'}
- Age: ${onboardingData.age || userProfile.age}
- Gender: ${onboardingData.gender || userProfile.gender || 'Not specified'}
- Height: ${onboardingData.heightCm || userProfile.height_cm || 'Not specified'} cm
- Weight: ${onboardingData.weightKg || userProfile.weight_kg || 'Not specified'} kg
- Blood Group: ${onboardingData.bloodGroup || userProfile.blood_group || 'Not specified'}

SCHEDULE:
- Wake Up: ${onboardingData.wakeUpTime || userProfile.wake_up_time || '06:00'}
- Sleep: ${onboardingData.sleepTime || userProfile.sleep_time || '22:00'}
- Work: ${onboardingData.workStart || userProfile.work_start || '09:00'} - ${onboardingData.workEnd || userProfile.work_end || '17:00'}
- Breakfast: ${onboardingData.breakfastTime || userProfile.breakfast_time || '08:00'}
- Lunch: ${onboardingData.lunchTime || userProfile.lunch_time || '13:00'}
- Dinner: ${onboardingData.dinnerTime || userProfile.dinner_time || '19:00'}
- Workout Time: ${onboardingData.workoutTime || userProfile.workout_time || 'Morning'}

HEALTH:
- Chronic Conditions: ${onboardingData.chronicConditions?.join(', ') || userProfile.chronic_conditions?.join(', ') || 'None'}
- Medications: ${onboardingData.medications?.join(', ') || userProfile.medications?.join(', ') || 'None'}
- Allergies: ${onboardingData.allergies?.join(', ') || userProfile.allergies?.join(', ') || 'None'}

PREFERENCES:
- Diet Type: ${onboardingData.dietType || userProfile.diet_type || 'Balanced'}
- Workout Type: ${onboardingData.workoutType || userProfile.workout_type || 'General'}
- Routine Flexibility: ${onboardingData.routineFlexibility || userProfile.routine_flexibility || 'Moderate'}

HEALTH GOALS: ${onboardingData.healthGoals?.join(', ') || userProfile.health_goals?.join(', ') || 'General wellness'}

Generate 3 plans with DIFFERENT approaches:

PLAN 1 (BEGINNER): Gentle, foundational approach
PLAN 2 (INTERMEDIATE): Balanced, progressive approach  
PLAN 3 (ADVANCED): Intensive, results-focused approach

For each plan provide:
1. Creative goal-specific name (e.g., "Diabetes Reversal Foundation", "Ultimate Weight Gainer Pro")
2. Description (100 words)
3. Duration (4-6 weeks / 8-10 weeks / 12+ weeks)
4. Difficulty level
5. Daily calorie target
6. Macro split (protein/carbs/fats percentages)
7. Workout frequency (days per week)
8. Workout style based on user preference: ${onboardingData.workoutType || userProfile.workout_type || 'General'}
9. Key focus areas (5 items)
10. Expected outcomes timeline:
    - Week 1-2: [specific changes]
    - Week 3-4: [specific changes]
    - Month 2: [specific changes]
    - Month 3: [specific changes]
11. Impact analysis:
    - Primary goal impact
    - Energy improvements
    - Physical changes
    - Mental health benefits
    - Sleep quality improvements
12. Schedule constraints:
    - Available workout windows: [calculate from work schedule]
    - Meal prep complexity: [based on work schedule]
    - Recovery time needed: [based on workout intensity]

CRITICAL REQUIREMENTS:
- If workout type is YOGA: focus on yoga asanas, pranayama, flexibility
- If workout type is GYM: focus on strength training, weights, machines
- If workout type is HOME: focus on bodyweight exercises, minimal equipment
- If workout type is CARDIO: focus on running, cycling, HIIT
- Respect work schedule: ${onboardingData.workStart || userProfile.work_start || '09:00'} - ${onboardingData.workEnd || userProfile.work_end || '17:00'} = NO physical activities
- During work hours, only suggest: focus techniques, posture corrections, breathing exercises
- Respect dietary restrictions: ${onboardingData.dietType || userProfile.diet_type || 'Balanced'}
- Account for allergies: ${onboardingData.allergies?.join(', ') || userProfile.allergies?.join(', ') || 'None'}
- Consider chronic conditions for exercise modifications

Return ONLY valid JSON:
{
  "plans": [
    {
      "id": "plan_1",
      "name": "Creative Plan Name",
      "description": "...",
      "duration": "4-6 weeks",
      "difficulty": "Beginner",
      "calorieTarget": 1800,
      "macros": {"protein": 30, "carbs": 40, "fats": 30},
      "workoutFrequency": "3 days/week",
      "workoutStyle": "${onboardingData.workoutType || userProfile.workout_type || 'General'}",
      "focusAreas": ["area1", "area2", "area3", "area4", "area5"],
      "timeline": {
        "week1-2": "...",
        "week3-4": "...",
        "month2": "...",
        "month3": "..."
      },
      "impacts": {
        "primaryGoal": "...",
        "energy": "...",
        "physical": "...",
        "mental": "...",
        "sleep": "..."
      },
      "scheduleConstraints": {
        "workoutWindows": ["06:00-07:30", "18:00-20:00"],
        "mealPrepComplexity": "medium",
        "recoveryTime": "8 hours sleep minimum"
      }
    }
    // 2 more plans with DIFFERENT values
  ]
}`;

  const completion = await groq.chat.completions.create({
    messages: [
      {
        role: "system",
        content: "You are a fitness planning expert. Generate 3 DISTINCT plans with different approaches. Return ONLY valid JSON."
      },
      {
        role: "user",
        content: prompt
      }
    ],
    model: "llama-3.3-70b-versatile",
    temperature: 0.8,
    max_tokens: 4000,
  });

  const response = completion.choices[0]?.message?.content;
  
  if (!response) {
    throw new Error('No response from Groq API');
  }

  // Try to parse the JSON response
  let plans = [];
  try {
    // Extract JSON from the response (handle cases where there might be extra text)
    const jsonMatch = response.match(/\[[\s\S]*\]/);
    if (jsonMatch) {
      plans = JSON.parse(jsonMatch[0]);
    } else {
      // Fallback: try to parse the entire response
      plans = JSON.parse(response);
    }
  } catch (parseError) {
    console.error('Failed to parse Groq response:', parseError);
    console.log('Raw response:', response);
    
    // Fallback: create plans based on the prompt
    const promptLower = primaryGoal.toLowerCase();
    plans = [
      {
        id: 'plan_1',
        name: 'Personalized Wellness Plan',
        description: 'A comprehensive approach to achieving your health goals',
        duration: '4 weeks',
        difficulty: 'Beginner',
        focusAreas: ['General wellness', 'Habit building', 'Lifestyle improvement'],
        calorieTarget: 2000,
        macros: { protein: 30, carbs: 40, fats: 30 },
        workoutFrequency: '3 days/week',
        workoutStyle: onboardingData.workoutType || userProfile.workout_type || 'General',
        timeline: {
          'week1-2': 'Establishing healthy habits',
          'week3-4': 'Building consistency',
          'month2': 'Seeing initial results',
          'month3': 'Maintaining progress'
        },
        impacts: {
          primaryGoal: 'Steady progress toward your goal',
          energy: 'Improved daily energy levels',
          physical: 'Better physical condition',
          mental: 'Enhanced mental clarity',
          sleep: 'Improved sleep quality'
        },
        scheduleConstraints: {
          workoutWindows: ['06:00-07:30', '18:00-20:00'],
          mealPrepComplexity: 'medium',
          recoveryTime: '8 hours sleep minimum'
        }
      },
      {
        id: 'plan_2',
        name: 'Advanced Health Optimization',
        description: 'Intensive program for maximum health improvements',
        duration: '6 weeks',
        difficulty: 'Intermediate',
        focusAreas: ['Fitness', 'Nutrition', 'Recovery'],
        calorieTarget: 2200,
        macros: { protein: 35, carbs: 35, fats: 30 },
        workoutFrequency: '4 days/week',
        workoutStyle: onboardingData.workoutType || userProfile.workout_type || 'General',
        timeline: {
          'week1-2': 'Building foundation',
          'week3-4': 'Increasing intensity',
          'month2': 'Peak performance',
          'month3': 'Optimizing results'
        },
        impacts: {
          primaryGoal: 'Significant progress toward your goal',
          energy: 'High energy levels',
          physical: 'Strong physical improvements',
          mental: 'Sharp mental focus',
          sleep: 'Deep, restorative sleep'
        },
        scheduleConstraints: {
          workoutWindows: ['06:00-08:00', '17:00-19:00'],
          mealPrepComplexity: 'high',
          recoveryTime: '8-9 hours sleep'
        }
      },
      {
        id: 'plan_3',
        name: 'Sustainable Lifestyle Change',
        description: 'Long-term approach to lasting health improvements',
        duration: '8 weeks',
        difficulty: 'Advanced',
        focusAreas: ['Mindfulness', 'Nutrition', 'Exercise', 'Recovery'],
        calorieTarget: 2400,
        macros: { protein: 40, carbs: 30, fats: 30 },
        workoutFrequency: '5 days/week',
        workoutStyle: onboardingData.workoutType || userProfile.workout_type || 'General',
        timeline: {
          'week1-2': 'Establishing routines',
          'week3-4': 'Building momentum',
          'month2': 'Peak transformation',
          'month3': 'Long-term maintenance'
        },
        impacts: {
          primaryGoal: 'Complete transformation toward your goal',
          energy: 'Optimal energy levels',
          physical: 'Peak physical condition',
          mental: 'Mental mastery',
          sleep: 'Perfect sleep quality'
        },
        scheduleConstraints: {
          workoutWindows: ['05:30-07:30', '17:00-19:30'],
          mealPrepComplexity: 'very high',
          recoveryTime: '9 hours sleep'
        }
      }
    ];
  }

  // Ensure all plans have required fields
  const processedPlans = plans.map((plan, index) => ({
    id: plan.id || `plan_${index + 1}`,
    name: plan.name || 'Health Plan',
    description: plan.description || 'A personalized health plan',
    duration: plan.duration || '4 weeks',
    difficulty: plan.difficulty || 'Beginner',
    focusAreas: plan.focusAreas || ['General wellness'],
    calorieTarget: plan.calorieTarget || 2000,
    macros: plan.macros || { protein: 30, carbs: 40, fats: 30 },
    workoutFrequency: plan.workoutFrequency || '3 days/week',
    workoutStyle: plan.workoutStyle || onboardingData.workoutType || userProfile.workout_type || 'General',
    timeline: plan.timeline || {
      'week1-2': 'Initial adaptation',
      'week3-4': 'Building habits',
      'month2': 'Seeing results',
      'month3': 'Maintaining progress'
    },
    impacts: plan.impacts || {
      primaryGoal: 'Progress toward your goal',
      energy: 'Improved energy',
      physical: 'Better physical health',
      mental: 'Enhanced mental clarity',
      sleep: 'Better sleep quality'
    },
    scheduleConstraints: plan.scheduleConstraints || {
      workoutWindows: ['06:00-07:30', '18:00-20:00'],
      mealPrepComplexity: 'medium',
      recoveryTime: '8 hours sleep minimum'
    }
  }));

  return { plans: processedPlans };
}
