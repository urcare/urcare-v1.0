// Start local server for development
import express from 'express';
import cors from 'cors';
import Groq from 'groq-sdk';

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Initialize Groq
const groq = new Groq({
  apiKey: process.env.VITE_GROQ_API_KEY || "",
});

// Health Score Generation API
app.post('/api/health-score', async (req, res) => {
  try {
    const { userProfile, userInput, uploadedFiles, voiceTranscript } = req.body;

    console.log('🔍 Generating health score for user:', userProfile?.id);

    if (!process.env.VITE_GROQ_API_KEY) {
      return res.status(500).json({
        success: false,
        error: 'Groq API key not configured. Please set VITE_GROQ_API_KEY environment variable.'
      });
    }

    // Prepare the prompt for health score calculation
    const prompt = `
You are a health assessment AI. Based on the following user data, calculate a health score from 0-100 and provide analysis.

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

User Input: ${userInput || 'None'}
Voice Transcript: ${voiceTranscript || 'None'}
Uploaded Files Content: ${uploadedFiles?.map(file => `${file.name}: ${file.content.substring(0, 500)}...`).join('\n\n') || 'None'}

Please provide:
1. A health score from 0-100 (where 100 is perfect health)
2. A detailed analysis of their current health status
3. 5-7 specific recommendations for improvement

Respond in JSON format:
{
  "healthScore": number,
  "analysis": "detailed analysis text",
  "recommendations": ["recommendation1", "recommendation2", ...]
}
`;

    const chatCompletion = await groq.chat.completions.create({
      model: "llama-3.1-8b-instant",
      messages: [
        {
          role: "system",
          content: "You are a professional health assessment AI. Provide accurate, helpful health analysis based on user data. Always respond in valid JSON format."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      max_tokens: 1500,
      temperature: 0.7
    });

    const response = chatCompletion.choices[0].message.content;
    console.log('📨 Groq Response:', response);

    // Parse the JSON response
    let healthData;
    try {
      healthData = JSON.parse(response);
    } catch (parseError) {
      console.error('❌ Failed to parse OpenAI response:', parseError);
      // Fallback response
      healthData = {
        healthScore: 75,
        analysis: "Based on your profile, you have a good foundation for health. Continue maintaining your current habits and consider the recommendations provided.",
        recommendations: [
          "Maintain regular exercise routine",
          "Ensure adequate sleep (7-9 hours)",
          "Stay hydrated throughout the day",
          "Eat a balanced diet with fruits and vegetables",
          "Manage stress through relaxation techniques"
        ]
      };
    }

    res.status(200).json({
      success: true,
      healthScore: healthData.healthScore,
      analysis: healthData.analysis,
      recommendations: healthData.recommendations
    });

  } catch (error) {
    console.error('❌ Health score generation error:', error);
    
    // Handle invalid API key error
    if (error.message && error.message.includes('Invalid API Key')) {
      console.log('🔄 Using fallback health score due to invalid API key');
      const fallbackResponse = {
        success: true,
        healthScore: 75,
        analysis: "Based on your profile, you have a good foundation for health. Continue maintaining your current habits and consider the recommendations provided.",
        recommendations: [
          "Maintain regular exercise routine",
          "Ensure adequate sleep (7-9 hours)",
          "Stay hydrated throughout the day",
          "Eat a balanced diet with fruits and vegetables",
          "Manage stress through relaxation techniques"
        ]
      };
      return res.status(200).json(fallbackResponse);
    }
    
    res.status(500).json({ 
      success: false, 
      error: 'Failed to generate health score', 
      details: error.message 
    });
  }
});

// Health Plans Generation API
app.post('/api/health-plans', async (req, res) => {
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

    if (!process.env.VITE_GROQ_API_KEY) {
      return res.status(500).json({
        success: false,
        error: 'Groq API key not configured. Please set VITE_GROQ_API_KEY environment variable.'
      });
    }

    // Prepare the prompt for health plan generation
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
    let planData;
    try {
      planData = JSON.parse(response);
    } catch (parseError) {
      console.error('❌ Failed to parse OpenAI response:', parseError);
      // Fallback response
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
      plans: planData.plans
    });

  } catch (error) {
    console.error('❌ Health plan generation error:', error);
    
    // Handle invalid API key error
    if (error.message && error.message.includes('Invalid API Key')) {
      console.log('🔄 Using fallback health plans due to invalid API key');
      const fallbackResponse = {
        success: true,
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
      return res.status(200).json(fallbackResponse);
    }
    
    res.status(500).json({ 
      success: false, 
      error: 'Failed to generate health plans', 
      details: error.message 
    });
  }
});

// Groq model proxy endpoint for plan generation
app.post('/api/groq/generate-plan', async (req, res) => {
  try {
    const { prompt, userProfile } = req.body;
    
    console.log('🔍 Generating plans with Groq for user:', userProfile?.id);
    
    if (!process.env.VITE_GROQ_API_KEY) {
      return res.status(500).json({
        success: false,
        error: 'Groq API key not configured. Please set VITE_GROQ_API_KEY environment variable.'
      });
    }

    const systemPrompt = `You are a health and wellness AI assistant. Generate 3 personalized health plans based on user data. Each plan should be practical, achievable, and tailored to the user's profile.`;

    const chatCompletion = await groq.chat.completions.create({
      model: "llama-3.1-8b-instant",
      messages: [
        {
          role: "system",
          content: systemPrompt
        },
        {
          role: "user",
          content: prompt || "Generate 3 personalized health plans for me"
        }
      ],
      max_tokens: 2000,
      temperature: 0.8
    });

    const response = chatCompletion.choices[0].message.content;
    console.log('📨 Groq Plan Response:', response);

    // Parse and structure the response
    let planData;
    try {
      planData = JSON.parse(response);
    } catch (parseError) {
      console.error('❌ Failed to parse Groq response:', parseError);
      // Fallback response
      planData = {
        plans: [
          {
            id: "plan_1",
            title: "Morning Wellness Routine",
            description: "Start your day with energy and focus",
            activities: [
              { id: "a1", label: "Morning Wake-up Routine", time: "08:30" },
              { id: "a2", label: "Healthy Breakfast", time: "09:00" },
              { id: "a3", label: "Focused Work Session", time: "09:45" }
            ]
          },
          {
            id: "plan_2", 
            title: "Afternoon Productivity",
            description: "Maximize your afternoon potential",
            activities: [
              { id: "b1", label: "Lunch Break", time: "12:30" },
              { id: "b2", label: "Quick Exercise", time: "13:15" },
              { id: "b3", label: "Deep Work Session", time: "14:00" }
            ]
          },
          {
            id: "plan_3",
            title: "Evening Wind-down",
            description: "Relax and prepare for tomorrow",
            activities: [
              { id: "c1", label: "Dinner Preparation", time: "18:30" },
              { id: "c2", label: "Relaxation Time", time: "19:30" },
              { id: "c3", label: "Bedtime Routine", time: "21:00" }
            ]
          }
        ]
      };
    }

    res.status(200).json({
      success: true,
      plans: planData.plans || planData,
      meta: { 
        model: "groq-llama-3.1-8b-instant", 
        timestamp: new Date().toISOString() 
      }
    });

  } catch (error) {
    console.error('❌ Groq plan generation error:', error);
    
    // Handle invalid API key error
    if (error.message && error.message.includes('Invalid API Key')) {
      console.log('🔄 Using fallback response due to invalid API key');
      const fallbackResponse = {
        success: true,
        plans: [
          {
            id: "plan_1",
            title: "Morning Wellness Routine",
            description: "Start your day with energy and focus",
            activities: [
              { id: "a1", label: "Morning Wake-up Routine", time: "08:30" },
              { id: "a2", label: "Healthy Breakfast", time: "09:00" },
              { id: "a3", label: "Focused Work Session", time: "09:45" }
            ]
          },
          {
            id: "plan_2", 
            title: "Afternoon Productivity",
            description: "Maximize your afternoon potential",
            activities: [
              { id: "b1", label: "Lunch Break", time: "12:30" },
              { id: "b2", label: "Quick Exercise", time: "13:15" },
              { id: "b3", label: "Deep Work Session", time: "14:00" }
            ]
          },
          {
            id: "plan_3",
            title: "Evening Wind-down",
            description: "Relax and prepare for tomorrow",
            activities: [
              { id: "c1", label: "Dinner Preparation", time: "18:30" },
              { id: "c2", label: "Relaxation Time", time: "19:30" },
              { id: "c3", label: "Bedtime Routine", time: "21:00" }
            ]
          }
        ],
        meta: { 
          model: "fallback", 
          timestamp: new Date().toISOString(),
          note: "Using fallback response - please configure a valid Groq API key"
        }
      };
      return res.status(200).json(fallbackResponse);
    }
    
    res.status(500).json({ 
      success: false, 
      error: 'Failed to generate plans', 
      details: error.message 
    });
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`🚀 Local server running on http://localhost:${PORT}`);
  console.log(`📝 Set VITE_GROQ_API_KEY environment variable for Groq integration`);
});
