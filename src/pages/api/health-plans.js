const { Groq } = require('groq-sdk');

// Initialize Groq with primary API key
const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

// Initialize Groq with secondary API key for load balancing
const groq2 = new Groq({
  apiKey: process.env.GROQ_API_KEY_2,
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
    const { 
      userProfile, 
      healthScore, 
      analysis, 
      recommendations, 
      userInput, 
      uploadedFiles, 
      voiceTranscript 
    } = req.body;

    console.log('🔍 Generating health plans for user:', userProfile?.id);

    if (!process.env.GROQ_API_KEY) {
      return res.status(500).json({
        success: false,
        error: 'Groq API key not configured'
      });
    }

    // Prepare the prompt for health plan generation (matching your current system)
    const prompt = `
You are a health plan generation AI. Based on the following user data and health analysis, create 3 personalized health plans.

User Profile:
- Age: ${userProfile?.age || 'Not provided'}
- Gender: ${userProfile?.gender || 'Not provided'}
- Height: ${userProfile?.height_cm || userProfile?.height_feet || 'Not provided'}
- Weight: ${userProfile?.weight_kg || userProfile?.weight_lb || 'Not provided'}
- Blood Group: ${userProfile?.blood_group || 'Not provided'}
- Chronic Conditions: ${userProfile?.chronic_conditions?.join(', ') || 'None'}
- Medications: ${userProfile?.medications?.join(', ') || 'None'}
- Health Goals: ${userProfile?.health_goals?.join(', ') || 'Not specified'}
- Diet Type: ${userProfile?.diet_type || 'Not specified'}
- Workout Time: ${userProfile?.workout_time || 'Not specified'}
- Sleep Time: ${userProfile?.sleep_time || 'Not specified'}
- Wake Up Time: ${userProfile?.wake_up_time || 'Not specified'}

Health Score: ${healthScore}/100
Health Analysis: ${analysis}
Recommendations: ${recommendations?.join(', ') || 'None'}

User Input: ${userInput || 'None'}
Voice Transcript: ${voiceTranscript || 'None'}
Uploaded Files: ${uploadedFiles?.map(file => file.name).join(', ') || 'None'}

Create 3 different health plans with varying difficulty levels and focus areas:

1. A beginner-friendly plan (focus on building habits)
2. An intermediate plan (balanced approach)
3. An advanced plan (intensive and comprehensive)

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
    },
    {
      "id": "plan_2",
      "title": "Plan Title",
      "description": "Detailed description of the plan",
      "duration": "8 weeks",
      "difficulty": "Intermediate",
      "focusAreas": ["area1", "area2", "area3"],
      "estimatedCalories": 500,
      "equipment": ["equipment1", "equipment2"],
      "benefits": ["benefit1", "benefit2", "benefit3"]
    },
    {
      "id": "plan_3",
      "title": "Plan Title",
      "description": "Detailed description of the plan",
      "duration": "12 weeks",
      "difficulty": "Advanced",
      "focusAreas": ["area1", "area2", "area3"],
      "estimatedCalories": 700,
      "equipment": ["equipment1", "equipment2"],
      "benefits": ["benefit1", "benefit2", "benefit3"]
    }
  ]
}
`;

    // Try both Groq API keys for load balancing
    let planData;
    let usedProvider = 'Groq-Primary';

    try {
      // Try primary API key first
      const chatCompletion = await groq.chat.completions.create({
        model: "llama-3.1-8b-instant",
        messages: [
          {
            role: "system",
            content: "You are a professional health plan generation AI. Create personalized, practical, and achievable health plans based on user data. Always respond in valid JSON format."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        max_tokens: 2000,
        temperature: 0.8
      });

      const response = chatCompletion.choices[0].message.content;
      console.log('📨 Groq Response:', response);

      // Parse the JSON response
      let content = response;
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        content = jsonMatch[0];
      }
      
      planData = JSON.parse(content);
    } catch (primaryError) {
      console.log('⚠️ Primary Groq API failed, trying secondary...');
      
      // Try secondary API key if primary fails
      if (process.env.GROQ_API_KEY_2) {
        try {
          const chatCompletion2 = await groq2.chat.completions.create({
            model: "llama-3.3-70b-versatile",
            messages: [
              {
                role: "system",
                content: "You are a professional health plan generation AI. Create personalized, practical, and achievable health plans based on user data. Always respond in valid JSON format."
              },
              {
                role: "user",
                content: prompt
              }
            ],
            max_tokens: 2000,
            temperature: 0.8
          });

          const response2 = chatCompletion2.choices[0].message.content;
          console.log('📨 Groq Secondary Response:', response2);

          let content2 = response2;
          const jsonMatch2 = content2.match(/\{[\s\S]*\}/);
          if (jsonMatch2) {
            content2 = jsonMatch2[0];
          }
          
          planData = JSON.parse(content2);
          usedProvider = 'Groq-Secondary';
        } catch (secondaryError) {
          console.error('❌ Both Groq APIs failed:', secondaryError);
          throw new Error('All Groq API calls failed');
        }
      } else {
        throw primaryError;
      }
    }

    // Fallback response if parsing fails
    if (!planData || !planData.plans) {
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

    res.status(200).json({
      success: true,
      plans: planData.plans,
      meta: {
        provider: usedProvider,
        timestamp: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('❌ Health plan generation error:', error);
    
    res.status(500).json({ 
      success: false, 
      error: 'Failed to generate health plans', 
      details: error.message 
    });
  }
}
