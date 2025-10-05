import { Groq } from 'groq-sdk';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize Groq
const groq = new Groq({
  apiKey: process.env.VITE_GROQ_API_KEY,
});

// Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.VITE_GEMINI_API_KEY);

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  try {
    const { userProfile, primaryGoal } = req.body;

    if (!userProfile) {
      return res.status(400).json({ 
        success: false, 
        error: 'Missing required fields: userProfile' 
      });
    }

    if (!process.env.VITE_GROQ_API_KEY || !process.env.VITE_GEMINI_API_KEY) {
      return res.status(500).json({ 
        success: false, 
        error: 'API keys not configured' 
      });
    }

    console.log('🔄 Starting Sequential Groq -> Gemini Flow');
    console.log(`👤 User: ${userProfile.full_name}`);

    // STEP 1: Groq generates detailed health plans
    console.log('🤖 STEP 1: Groq AI generating health plans...');
    const groqPlans = await generatePlansWithGroq(userProfile, primaryGoal);
    console.log(`✅ Groq generated ${groqPlans.length} plans`);

    // STEP 2: Gemini creates detailed schedule based on Groq's first plan
    console.log('🧠 STEP 2: Gemini AI creating detailed schedule...');
    const geminiSchedule = await generateScheduleWithGemini(groqPlans[0], userProfile);
    console.log('✅ Gemini generated detailed schedule');

    res.json({
      success: true,
      flow: 'sequential',
      step1: {
        provider: 'Groq',
        result: 'Health plans generated',
        plans: groqPlans
      },
      step2: {
        provider: 'Gemini',
        result: 'Detailed schedule generated',
        schedule: geminiSchedule
      },
      userProfile: userProfile,
      generatedAt: new Date().toISOString()
    });

  } catch (error) {
    console.error('Error in sequential flow:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
}

async function generatePlansWithGroq(userProfile, primaryGoal) {
  const prompt = `
You are a professional health coach. Create 3 personalized health plans for this user.

User Profile:
- Name: ${userProfile.full_name || 'User'}
- Age: ${userProfile.age || 'Not specified'}
- Gender: ${userProfile.gender || 'Not specified'}
- Height: ${userProfile.height_cm || userProfile.height_feet || 'Not specified'}
- Weight: ${userProfile.weight_kg || userProfile.weight_lb || 'Not specified'}
- Health Goals: ${userProfile.health_goals?.join(', ') || primaryGoal || 'General wellness'}
- Workout Time: ${userProfile.workout_time || 'Not specified'}
- Sleep Time: ${userProfile.sleep_time || 'Not specified'}
- Wake Up Time: ${userProfile.wake_up_time || 'Not specified'}

Create 3 different health plans with varying difficulty levels:

1. BEGINNER PLAN (4 weeks): Focus on building healthy habits
2. INTERMEDIATE PLAN (8 weeks): Balanced approach with moderate intensity
3. ADVANCED PLAN (12 weeks): Intensive program for maximum results

Each plan should include:
- Title (descriptive and motivating)
- Description (what the plan involves)
- Duration (e.g., "4 weeks", "8 weeks", "12 weeks")
- Difficulty level (Beginner/Intermediate/Advanced)
- Focus areas (3-5 key areas like "Weight Loss", "Muscle Building", "Cardio", "Flexibility", "Nutrition")
- Estimated calories burned per session
- Equipment needed (list of equipment or "No equipment needed")
- Key benefits (3-5 specific benefits)

Respond in JSON format:
{
  "plans": [
    {
      "id": "plan_1",
      "title": "Plan Title",
      "description": "Detailed description of the plan",
      "duration": "4 weeks",
      "difficulty": "Beginner",
      "focusAreas": ["area1", "area2", "area3"],
      "estimatedCalories": 300,
      "equipment": ["equipment1", "equipment2"],
      "benefits": ["benefit1", "benefit2", "benefit3"]
    }
  ]
}
`;

  try {
    const response = await groq.chat.completions.create({
      model: "llama-3.1-8b-instant",
      messages: [
        {
          role: "system",
          content: "You are a professional health coach. Create personalized, practical, and achievable health plans based on user data. Always respond in valid JSON format."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      max_tokens: 2000,
      temperature: 0.8
    });

    const content = response.choices[0].message.content;
    let planData;
    
    try {
      // Try to parse the JSON response
      let contentParsed = content;
      const jsonMatch = contentParsed.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        contentParsed = jsonMatch[0];
      }
      planData = JSON.parse(contentParsed);
    } catch (parseError) {
      console.error('Failed to parse Groq response:', parseError);
      // Return fallback plans
      planData = {
        plans: [
          {
            id: "plan_1",
            title: "Beginner Wellness Journey",
            description: "A gentle introduction to healthy living with focus on building sustainable habits.",
            duration: "4 weeks",
            difficulty: "Beginner",
            focusAreas: ["Basic Fitness", "Nutrition", "Sleep"],
            estimatedCalories: 200,
            equipment: ["No equipment needed"],
            benefits: ["Build healthy habits", "Improve energy levels", "Better sleep quality"]
          },
          {
            id: "plan_2",
            title: "Balanced Health Program",
            description: "A comprehensive approach combining exercise, nutrition, and wellness practices.",
            duration: "8 weeks",
            difficulty: "Intermediate",
            focusAreas: ["Cardio", "Strength Training", "Nutrition", "Stress Management"],
            estimatedCalories: 400,
            equipment: ["Dumbbells", "Yoga mat"],
            benefits: ["Improved fitness", "Better nutrition", "Reduced stress", "Weight management"]
          },
          {
            id: "plan_3",
            title: "Advanced Transformation",
            description: "An intensive program for those ready to commit to significant health improvements.",
            duration: "12 weeks",
            difficulty: "Advanced",
            focusAreas: ["High-Intensity Training", "Precision Nutrition", "Recovery", "Mental Health"],
            estimatedCalories: 600,
            equipment: ["Full gym access", "Heart rate monitor", "Foam roller"],
            benefits: ["Maximum fitness gains", "Optimal nutrition", "Peak performance", "Complete transformation"]
          }
        ]
      };
    }

    return planData.plans || [];
  } catch (error) {
    console.error('Groq API error:', error);
    throw new Error('Failed to generate health plans with Groq');
  }
}

async function generateScheduleWithGemini(plan, userProfile) {
  const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

  const prompt = `
Create a detailed daily schedule for this health plan:

Plan: ${plan.title}
Description: ${plan.description}
Duration: ${plan.duration}
Difficulty: ${plan.difficulty}
Focus Areas: ${plan.focusAreas.join(', ')}

User Profile:
- Name: ${userProfile.full_name || 'User'}
- Age: ${userProfile.age || 'Not specified'}
- Wake Up Time: ${userProfile.wake_up_time || '07:00'}
- Sleep Time: ${userProfile.sleep_time || '22:00'}
- Workout Time: ${userProfile.workout_time || '18:00'}

Create a detailed daily schedule with specific times, activities, meals, and instructions.
Include morning routine, meals, workouts, and evening routine.

Respond in JSON format:
{
  "dailySchedule": {
    "morning": {
      "time": "07:00",
      "activity": "Wake up and hydrate",
      "details": "Drink a glass of water and do light stretching"
    },
    "breakfast": {
      "time": "07:30",
      "meal": "Healthy breakfast",
      "calories": 400,
      "macros": "Protein: 20g, Carbs: 50g, Fats: 15g"
    },
    "workout": {
      "time": "18:00",
      "type": "Strength training",
      "exercises": [
        {
          "name": "Exercise name",
          "sets": 3,
          "reps": 12,
          "duration": "45 minutes"
        }
      ]
    },
    "dinner": {
      "time": "19:30",
      "meal": "Balanced dinner",
      "calories": 500,
      "macros": "Protein: 30g, Carbs: 40g, Fats: 20g"
    },
    "evening": {
      "time": "21:00",
      "activity": "Wind down routine",
      "details": "Relaxation and preparation for sleep"
    },
    "bedtime": {
      "time": "22:00",
      "activity": "Sleep preparation",
      "details": "Final routine before sleep"
    }
  }
}
`;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const content = response.text();
    
    let scheduleData;
    try {
      // Try to parse the JSON response
      let contentParsed = content;
      const jsonMatch = contentParsed.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        contentParsed = jsonMatch[0];
      }
      scheduleData = JSON.parse(contentParsed);
    } catch (parseError) {
      console.error('Failed to parse Gemini response:', parseError);
      // Return fallback schedule
      scheduleData = {
        dailySchedule: {
          morning: {
            time: userProfile.wake_up_time || "07:00",
            activity: "Wake up and hydrate",
            details: "Drink a glass of water and do light stretching"
          },
          breakfast: {
            time: "07:30",
            meal: "Healthy breakfast",
            calories: 400,
            macros: "Protein: 20g, Carbs: 50g, Fats: 15g"
          },
          workout: {
            time: userProfile.workout_time || "18:00",
            type: "Strength training",
            exercises: [
              {
                name: "Bodyweight exercises",
                sets: 3,
                reps: 12,
                duration: "45 minutes"
              }
            ]
          },
          dinner: {
            time: "19:30",
            meal: "Balanced dinner",
            calories: 500,
            macros: "Protein: 30g, Carbs: 40g, Fats: 20g"
          },
          evening: {
            time: "21:00",
            activity: "Wind down routine",
            details: "Relaxation and preparation for sleep"
          },
          bedtime: {
            time: userProfile.sleep_time || "22:00",
            activity: "Sleep preparation",
            details: "Final routine before sleep"
          }
        }
      };
    }

    return scheduleData;
  } catch (error) {
    console.error('Gemini API error:', error);
    throw new Error('Failed to generate schedule with Gemini');
  }
}
