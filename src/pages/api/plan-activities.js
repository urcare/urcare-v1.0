const { Groq } = require('groq-sdk');

const groq = new Groq({
  apiKey: process.env.VITE_GROQ_API_KEY,
});

module.exports = async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { selectedPlan, userProfile } = req.body;

    console.log('🔍 Generating activities for plan:', selectedPlan?.title);

    if (!process.env.VITE_GROQ_API_KEY) {
      return res.status(500).json({
        success: false,
        error: 'Groq API key not configured'
      });
    }

    // Prepare the prompt for activity generation (matching your current system)
    const prompt = `
You are a fitness activity generation AI. Create detailed weekly activities for the selected health plan.

Selected Plan:
- Title: ${selectedPlan?.title}
- Description: ${selectedPlan?.description}
- Duration: ${selectedPlan?.duration}
- Difficulty: ${selectedPlan?.difficulty}
- Focus Areas: ${selectedPlan?.focusAreas?.join(', ')}
- Equipment: ${selectedPlan?.equipment?.join(', ')}

User Profile:
- Age: ${userProfile?.age || 'Not provided'}
- Gender: ${userProfile?.gender || 'Not provided'}
- Height: ${userProfile?.height_cm || userProfile?.height_feet || 'Not provided'}
- Weight: ${userProfile?.weight_kg || userProfile?.weight_lb || 'Not provided'}
- Health Goals: ${userProfile?.health_goals?.join(', ') || 'Not specified'}
- Workout Time: ${userProfile?.workout_time || 'Not specified'}

Create detailed activities for each week of the plan. Each activity should include:
- Activity name
- Duration
- Instructions
- Equipment needed
- Difficulty level
- Calories burned (estimated)

Respond in JSON format:
{
  "activities": [
    {
      "week": 1,
      "day": 1,
      "activities": [
        {
          "name": "Activity Name",
          "duration": "30 minutes",
          "instructions": "Detailed step-by-step instructions",
          "equipment": ["equipment1", "equipment2"],
          "difficulty": "Beginner",
          "calories": 200
        }
      ]
    }
  ]
}
`;

    const chatCompletion = await groq.chat.completions.create({
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
      max_tokens: 3000,
      temperature: 0.7
    });

    const response = chatCompletion.choices[0].message.content;
    console.log('📨 Groq Response:', response);

    // Parse the JSON response
    let activityData;
    try {
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        activityData = JSON.parse(jsonMatch[0]);
      } else {
        activityData = JSON.parse(response);
      }
    } catch (parseError) {
      console.error('❌ Failed to parse Groq response:', parseError);
      // Fallback response
      activityData = {
        activities: [
          {
            week: 1,
            day: 1,
            activities: [
              {
                name: "Morning Stretch",
                duration: "15 minutes",
                instructions: "Start with gentle stretching exercises to warm up your body",
                equipment: ["Yoga mat"],
                difficulty: "Beginner",
                calories: 50
              }
            ]
          }
        ]
      };
    }

    res.status(200).json({
      success: true,
      activities: activityData.activities
    });

  } catch (error) {
    console.error('❌ Activity generation error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to generate activities', 
      details: error.message 
    });
  }
}
