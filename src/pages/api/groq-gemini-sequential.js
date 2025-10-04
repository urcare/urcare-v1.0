import { Groq } from 'groq-sdk';
import { GoogleGenerativeAI } from '@google/generative-ai';

const groq = new Groq({
  apiKey: process.env.VITE_GROQ_API_KEY,
});

const genAI = new GoogleGenerativeAI(process.env.VITE_GEMINI_API_KEY);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { userProfile, primaryGoal } = req.body;

    if (!userProfile || !primaryGoal) {
      return res.status(400).json({ error: 'User profile and primary goal are required' });
    }

    if (!process.env.VITE_GROQ_API_KEY) {
      return res.status(500).json({ error: 'Groq API key not configured' });
    }

    if (!process.env.VITE_GEMINI_API_KEY) {
      return res.status(500).json({ error: 'Gemini API key not configured' });
    }

    // Step 1: Generate health plans using Groq
    const groqPrompt = `Generate 3 personalized health plans for a user with the following profile:
    
    Name: ${userProfile.full_name}
    Age: ${userProfile.age}
    Gender: ${userProfile.gender}
    Height: ${userProfile.height_cm}cm
    Weight: ${userProfile.weight_kg}kg
    Blood Group: ${userProfile.blood_group}
    Chronic Conditions: ${userProfile.chronic_conditions?.join(', ') || 'None'}
    Medications: ${userProfile.medications?.join(', ') || 'None'}
    Health Goals: ${userProfile.health_goals?.join(', ') || 'General wellness'}
    Diet Type: ${userProfile.diet_type}
    Workout Time: ${userProfile.workout_time}
    Sleep Time: ${userProfile.sleep_time}
    Wake Up Time: ${userProfile.wake_up_time}
    
    Primary Goal: ${primaryGoal}
    
    Generate 3 distinct health plans with the following structure:
    - id: unique identifier
    - name: plan title
    - description: detailed description
    - duration: plan duration (e.g., "4 weeks", "6 weeks")
    - difficulty: Beginner/Intermediate/Advanced
    - focusAreas: array of focus areas
    - calorieTarget: estimated daily calories
    - equipment: array of required equipment
    - impacts: object with health impact areas
    
    Return ONLY valid JSON array with 3 plans.`;

    const groqCompletion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: "You are a comprehensive health and fitness planning expert. Generate personalized health plans based on user profiles. Return ONLY valid JSON."
        },
        {
          role: "user",
          content: groqPrompt
        }
      ],
      model: "llama-3.3-70b-versatile",
      temperature: 0.8,
      max_tokens: 4000,
    });

    const groqResponse = groqCompletion.choices[0]?.message?.content;
    
    if (!groqResponse) {
      throw new Error('No response from Groq API');
    }

    // Parse Groq response
    let plans = [];
    try {
      const jsonMatch = groqResponse.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        plans = JSON.parse(jsonMatch[0]);
      } else {
        plans = JSON.parse(groqResponse);
      }
    } catch (parseError) {
      console.error('Failed to parse Groq response:', parseError);
      // Fallback plans
      plans = [
        {
          id: 'plan_1',
          name: 'Morning Wellness Routine',
          description: 'Start your day with energy and focus through structured morning activities',
          duration: '4 weeks',
          difficulty: 'Beginner',
          focusAreas: ['Morning routine', 'Energy boost', 'Mental clarity'],
          calorieTarget: 200,
          equipment: ['Yoga mat', 'Water bottle', 'Timer'],
          impacts: {
            energy: 'Increased energy levels',
            focus: 'Better mental clarity',
            mood: 'Improved mood'
          }
        },
        {
          id: 'plan_2',
          name: 'Afternoon Productivity',
          description: 'Maximize your afternoon potential with targeted activities',
          duration: '6 weeks',
          difficulty: 'Intermediate',
          focusAreas: ['Productivity', 'Focus', 'Energy management'],
          calorieTarget: 150,
          equipment: ['Desk setup', 'Timer', 'Notebook'],
          impacts: {
            productivity: 'Higher work productivity',
            focus: 'Better concentration',
            energy: 'Reduced afternoon fatigue'
          }
        },
        {
          id: 'plan_3',
          name: 'Evening Wind-down',
          description: 'Relax and prepare for tomorrow with calming evening routines',
          duration: '3 weeks',
          difficulty: 'Beginner',
          focusAreas: ['Relaxation', 'Sleep preparation', 'Stress relief'],
          calorieTarget: 100,
          equipment: ['Comfortable clothes', 'Dim lighting', 'Journal'],
          impacts: {
            sleep: 'Better sleep quality',
            stress: 'Reduced stress levels',
            recovery: 'Improved recovery'
          }
        }
      ];
    }

    // Step 2: Generate detailed daily schedule using Gemini
    const selectedPlan = plans[0]; // Use first plan for schedule generation
    
    const geminiPrompt = `Generate a detailed daily schedule for the health plan: "${selectedPlan.name}".

    Plan Details:
    - Description: ${selectedPlan.description}
    - Duration: ${selectedPlan.duration}
    - Difficulty: ${selectedPlan.difficulty}
    - Focus Areas: ${selectedPlan.focusAreas?.join(', ')}
    - Equipment: ${selectedPlan.equipment?.join(', ')}
    - Impacts: ${Object.values(selectedPlan.impacts || {}).join(', ')}

    User Profile:
    - Age: ${userProfile.age}
    - Health Goals: ${primaryGoal}
    - Workout Time: ${userProfile.workout_time}
    - Sleep Time: ${userProfile.sleep_time}
    - Wake Up Time: ${userProfile.wake_up_time}

    Generate a complete daily schedule from 6:00 AM to 10:00 PM with:
    1. Specific activities with exact times
    2. Duration for each activity
    3. Detailed instructions
    4. Equipment needed for each activity
    5. Difficulty level for each activity
    6. Estimated calories burned
    7. Activity type (exercise, meal, rest, work, mindfulness)

    Format as JSON with this structure:
    {
      "dailySchedule": [
        {
          "id": "activity_1",
          "time": "06:00",
          "activity": "Morning Wake-up Routine",
          "duration": "30 minutes",
          "type": "exercise",
          "difficulty": "Beginner",
          "calories": 50,
          "equipment": ["Yoga mat", "Water bottle"],
          "instructions": "Start with gentle stretching and breathing exercises"
        }
      ]
    }`;

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const geminiResult = await model.generateContent(geminiPrompt);
    const geminiResponse = await geminiResult.response;
    const geminiText = geminiResponse.text();

    // Parse Gemini response
    let schedule = { dailySchedule: [] };
    try {
      const jsonMatch = geminiText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        schedule = JSON.parse(jsonMatch[0]);
      } else {
        schedule = JSON.parse(geminiText);
      }
    } catch (parseError) {
      console.error('Failed to parse Gemini response:', parseError);
      // Fallback schedule
      schedule = {
        dailySchedule: [
          {
            id: 'activity_1',
            time: '06:00',
            activity: 'Morning Wake-up Routine',
            duration: '30 minutes',
            type: 'exercise',
            difficulty: 'Beginner',
            calories: 50,
            equipment: ['Yoga mat', 'Water bottle'],
            instructions: 'Start with gentle stretching and breathing exercises'
          },
          {
            id: 'activity_2',
            time: '07:00',
            activity: 'Healthy Breakfast',
            duration: '20 minutes',
            type: 'meal',
            difficulty: 'Beginner',
            calories: 300,
            equipment: ['Kitchen utensils'],
            instructions: 'Prepare a nutritious breakfast with protein and fiber'
          },
          {
            id: 'activity_3',
            time: '08:00',
            activity: 'Workout Session',
            duration: '45 minutes',
            type: 'exercise',
            difficulty: selectedPlan.difficulty,
            calories: 200,
            equipment: selectedPlan.equipment,
            instructions: 'Follow your personalized workout routine'
          }
        ]
      };
    }

    res.status(200).json({
      success: true,
      step1: {
        plans: plans,
        generatedAt: new Date().toISOString()
      },
      step2: {
        schedule: schedule,
        generatedAt: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('Error in groq-gemini-sequential:', error);
    res.status(500).json({
      error: 'Failed to generate sequential AI plans',
      details: error.message
    });
  }
}
