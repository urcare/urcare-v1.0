const express = require('express');
const cors = require('cors');
const Groq = require('groq-sdk');
const { createClient } = require('@supabase/supabase-js');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors({ 
  origin: true, // Allow all origins in development
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Request logging middleware
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
});

// Initialize Groq
const GROQ_API_KEY = process.env.VITE_GROQ_API_KEY;
console.log('🔑 Groq API Key status:', GROQ_API_KEY ? '✅ Configured' : '❌ Missing');
const groq = new Groq({
  apiKey: GROQ_API_KEY,
});

// Initialize Supabase
const supabase = createClient(
  process.env.SUPABASE_URL || "https://lvnkpserdydhnqbigfbz.supabase.co",
  process.env.SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx2bmtwc2VyZHlkaG5xYmlnZmJ6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTMzMzY5NjYsImV4cCI6MjA2ODkxMjk2Nn0.Y2NfbA7K9efpFHB6FFmCtgti3udX5wbOoQVkDndtkBc"
);

// Health Score Generation API - GET endpoint for health check
app.get('/api/health-score', (req, res) => {
  res.status(200).json({ 
    status: 'ok', 
    message: 'Health score endpoint is working',
    timestamp: new Date().toISOString(),
    method: 'GET'
  });
});

// Health Score Generation API - POST endpoint for actual health score calculation
app.post('/api/health-score', async (req, res) => {
  try {
    const { userProfile, userInput, uploadedFiles, voiceTranscript } = req.body;

    console.log('🔍 Generating health score for user:', userProfile?.id);
    console.log('🔑 Groq API Key available:', !!GROQ_API_KEY);

    if (!GROQ_API_KEY) {
      return res.status(500).json({
        success: false,
        error: 'Groq API key not configured'
      });
    }

    // Prepare the prompt for health score calculation
    const prompt = `
You are a professional health assessment AI. Analyze the following comprehensive user data and provide an accurate health score (0-100) with detailed analysis.

CRITICAL: Base your assessment on actual medical and health data provided. Consider all factors including age, lifestyle, medical conditions, and user-specific inputs.

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
- Activity Level: ${userProfile?.activity_level || 'Not provided'}
- Sleep Hours: ${userProfile?.sleep_hours || 'Not provided'}
- Stress Level: ${userProfile?.stress_level || 'Not provided'}
- Water Intake: ${userProfile?.water_intake_liters || 'Not provided'}
- Smoking: ${userProfile?.smoking || 'Not provided'}
- Alcohol Consumption: ${userProfile?.alcohol_consumption || 'Not provided'}
- BMI: ${userProfile?.bmi || 'Not provided'}
- Blood Pressure: ${userProfile?.blood_pressure || 'Not provided'}
- Heart Rate: ${userProfile?.heart_rate || 'Not provided'}

Additional User Input: ${userInput || 'None'}
Voice Transcript: ${voiceTranscript || 'None'}
Uploaded Files Content: ${uploadedFiles?.map(file => `${file.name}: ${file.content.substring(0, 500)}...`).join('\n\n') || 'None'}

SCORING CRITERIA:
- 90-100: Excellent health with optimal lifestyle
- 80-89: Good health with minor improvements needed
- 70-79: Average health with moderate improvements needed
- 60-69: Below average health requiring attention
- 50-59: Poor health requiring significant changes
- Below 50: Critical health issues requiring immediate attention

Provide a detailed, medically-informed response in this EXACT JSON format:
{
  "healthScore": [number between 0-100],
  "analysis": "[Detailed analysis of current health status, specific to user's data and conditions]",
  "recommendations": ["[Specific, actionable recommendation 1]", "[Specific, actionable recommendation 2]", "[Specific, actionable recommendation 3]"]
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
    
    // Handle specific OpenAI errors
    if (error.code === 'insufficient_quota') {
      return res.status(429).json({ 
        success: false, 
        error: 'Groq quota exceeded. Please check your billing details.',
        details: 'You have exceeded your current Groq usage limit. Please upgrade your plan or wait for quota reset.'
      });
    }
    
    if (error.code === 'model_not_found') {
      return res.status(400).json({ 
        success: false, 
        error: 'Groq model not available',
        details: 'The requested model is not available with your current Groq plan.'
      });
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

    if (!GROQ_API_KEY) {
      return res.status(500).json({
        success: false,
        error: 'Groq API key not configured'
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
    
    // Handle specific OpenAI errors
    if (error.code === 'insufficient_quota') {
      return res.status(429).json({ 
        success: false, 
        error: 'Groq quota exceeded. Please check your billing details.',
        details: 'You have exceeded your current Groq usage limit. Please upgrade your plan or wait for quota reset.'
      });
    }
    
    if (error.code === 'model_not_found') {
      return res.status(400).json({ 
        success: false, 
        error: 'Groq model not available',
        details: 'The requested model is not available with your current Groq plan.'
      });
    }
    
    res.status(500).json({ 
      success: false, 
      error: 'Failed to generate health plans', 
      details: error.message 
    });
  }
});

// Plan Activities Generation API
app.post('/api/plan-activities', async (req, res) => {
  try {
    const { selectedPlan, userProfile } = req.body;

    console.log('🔍 Generating activities for plan:', selectedPlan?.title);

    if (!GROQ_API_KEY) {
      return res.status(500).json({
        success: false,
        error: 'Groq API key not configured'
      });
    }

    // Prepare the prompt for activity generation
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
      activityData = JSON.parse(response);
    } catch (parseError) {
      console.error('❌ Failed to parse OpenAI response:', parseError);
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
});

// Groq model proxy endpoint for plan generation
app.post('/api/groq/generate-plan', async (req, res) => {
  try {
    const { prompt, userProfile } = req.body;
    
    console.log('🔍 Generating plans with Groq for user:', userProfile?.id);
    
    if (!GROQ_API_KEY) {
      return res.status(500).json({
        success: false,
        error: 'Groq API key not configured'
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
    res.status(500).json({ 
      success: false, 
      error: 'Failed to generate plans', 
      details: error.message 
    });
  }
});

// Voice recording processing endpoint
app.post('/api/groq/audio-process', async (req, res) => {
  try {
    // Handle multipart/form-data for audio files
    const multer = require('multer');
    const upload = multer({ storage: multer.memoryStorage() });
    
    upload.single('audio')(req, res, async (err) => {
      if (err) {
        return res.status(400).json({ error: 'File upload error' });
      }
      
      const audioFile = req.file;
      if (!audioFile) {
        return res.status(400).json({ error: 'No audio file provided' });
      }

      // For now, return a mock response
      // In production, you'd process the audio file here
      res.status(200).json({
        success: true,
        transcript: "This is a mock transcript of your voice input. In production, this would be processed by a speech-to-text service.",
        timestamp: new Date().toISOString()
      });
    });

  } catch (error) {
    console.error('❌ Audio processing error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to process audio', 
      details: error.message 
    });
  }
});

// User profile endpoint
app.get('/api/user/profile', (req, res) => {
  // Mock user profile for testing
  res.status(200).json({
    success: true,
    profile: {
      id: "user_123",
      name: "Test User",
      email: "test@example.com",
      age: 30,
      gender: "Male",
      health_goals: ["Weight Loss", "Better Sleep"],
      activity_level: "Moderate"
    }
  });
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
