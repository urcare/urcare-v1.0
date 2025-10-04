require('dotenv').config();
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

// Initialize Gemini API Key
const GEMINI_API_KEY = process.env.VITE_GEMINI_API_KEY;
console.log('🔑 Gemini API Key status:', GEMINI_API_KEY ? '✅ Configured' : '❌ Missing');

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

    const systemPrompt = `You are a health and wellness AI assistant. Generate 3 personalized health plans based on user data. Each plan should be practical, achievable, and tailored to the user's profile.

CRITICAL: You MUST respond ONLY with valid JSON in this exact format:
{
  "plans": [
    {
      "id": "plan_1",
      "title": "Plan Title",
      "description": "Plan description",
      "activities": [
        {"id": "a1", "label": "Activity Name", "time": "08:30"},
        {"id": "a2", "label": "Activity Name", "time": "09:00"}
      ]
    }
  ]
}

Do not include any text before or after the JSON. Only return the JSON object.`;

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
      // Try to extract JSON from the response if it's wrapped in text
      let jsonResponse = response.trim();
      
      // Look for JSON object in the response
      const jsonMatch = jsonResponse.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        jsonResponse = jsonMatch[0];
      }
      
      planData = JSON.parse(jsonResponse);
      
      // Validate that we have the expected structure
      if (!planData.plans || !Array.isArray(planData.plans)) {
        throw new Error('Invalid plan structure');
      }
      
    } catch (parseError) {
      console.error('❌ Failed to parse Groq response:', parseError);
      console.log('Raw response:', response);
      
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

// Unified Plan Generation API - Phase 1 (Groq)
app.post('/api/generate-complete-plan', async (req, res) => {
  try {
    const { primaryGoal, onboardingData, userProfile } = req.body;

    if (!primaryGoal || !onboardingData || !userProfile) {
      return res.status(400).json({ error: 'Missing required data for plan generation' });
    }

    if (!GROQ_API_KEY) {
      return res.status(500).json({ error: 'Groq API key not configured' });
    }

    const groqPrompt = `You are a fitness planning AI. Generate 3 distinct health plans based on user's goal and profile.

PRIMARY GOAL: ${primaryGoal}

ONBOARDING DATA:
- Name: ${onboardingData.fullName || 'User'}
- Age: ${onboardingData.age}
- Gender: ${onboardingData.gender || 'Not specified'}
- Height: ${onboardingData.heightCm || 'Not specified'} cm
- Weight: ${onboardingData.weightKg || 'Not specified'} kg
- Blood Group: ${onboardingData.bloodGroup || 'Not specified'}

SCHEDULE:
- Wake Up: ${onboardingData.wakeUpTime || '06:00'}
- Sleep: ${onboardingData.sleepTime || '22:00'}
- Work: ${onboardingData.workStart || '09:00'} - ${onboardingData.workEnd || '17:00'}
- Breakfast: ${onboardingData.breakfastTime || '08:00'}
- Lunch: ${onboardingData.lunchTime || '13:00'}
- Dinner: ${onboardingData.dinnerTime || '19:00'}
- Workout Time: ${onboardingData.workoutTime || 'Morning'}

HEALTH:
- Chronic Conditions: ${onboardingData.chronicConditions?.join(', ') || 'None'}
- Medications: ${onboardingData.medications?.join(', ') || 'None'}
- Allergies: ${onboardingData.allergies?.join(', ') || 'None'}

PREFERENCES:
- Diet Type: ${onboardingData.dietType || 'Balanced'}
- Workout Type: ${onboardingData.workoutType || 'General'}
- Routine Flexibility: ${onboardingData.routineFlexibility || 'Moderate'}

HEALTH GOALS: ${onboardingData.healthGoals?.join(', ') || 'General wellness'}

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
8. Workout style based on user preference: ${onboardingData.workoutType || 'General'}
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
- Respect work schedule: ${onboardingData.workStart || '09:00'} - ${onboardingData.workEnd || '17:00'} = NO physical activities
- During work hours, only suggest: focus techniques, posture corrections, breathing exercises
- Respect dietary restrictions: ${onboardingData.dietType || 'Balanced'}
- Account for allergies: ${onboardingData.allergies?.join(', ') || 'None'}
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
      "workoutStyle": "${onboardingData.workoutType || 'General'}",
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
  ]
}`;

    const completion = await groq.chat.completions.create({
      messages: [
        { role: "system", content: "You are a fitness planning expert. Generate 3 DISTINCT plans with different approaches. Return ONLY valid JSON." },
        { role: "user", content: groqPrompt }
      ],
      model: "llama-3.3-70b-versatile",
      temperature: 0.8,
      max_tokens: 4000,
    });

    const response = completion.choices[0]?.message?.content;

    if (!response) {
      throw new Error('No response from Groq API');
    }

    // Extract JSON from markdown if present
    let jsonString = response;
    const jsonMatch = response.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      jsonString = jsonMatch[0];
    }

    const parsed = JSON.parse(jsonString);
    const plans = parsed.plans || [];

    res.status(200).json({
      success: true,
      step: 'plans_ready',
      plans: plans
    });

  } catch (error) {
    console.error('Error in /api/generate-complete-plan:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Unified Schedule Generation API - Phase 2 (Gemini)
app.post('/api/generate-schedule', async (req, res) => {
  try {
    const { selectedPlanId, planDetails, onboardingData, userProfile } = req.body;

    if (!selectedPlanId || !planDetails || !onboardingData || !userProfile) {
      return res.status(400).json({ error: 'Missing required data for schedule generation' });
    }

    const selectedPlan = planDetails.plans.find(p => p.id === selectedPlanId);

    if (!selectedPlan) {
      return res.status(400).json({ error: 'Selected plan not found in provided plan details' });
    }

    if (!GEMINI_API_KEY) {
      return res.status(500).json({ error: 'Gemini API key not configured' });
    }

    const prompt = `You are a schedule optimization AI. Generate a HYPER-PERSONALIZED daily schedule based on the selected plan and user's exact timings.

SELECTED PLAN:
${JSON.stringify(selectedPlan, null, 2)}

USER'S EXACT SCHEDULE:
- Wake Up: ${onboardingData.wakeUpTime || '06:00'}
- Breakfast: ${onboardingData.breakfastTime || '08:00'}
- Work Start: ${onboardingData.workStart || '09:00'}
- Lunch: ${onboardingData.lunchTime || '13:00'}
- Work End: ${onboardingData.workEnd || '17:00'}
- Workout: ${onboardingData.workoutTime || '18:00'}
- Dinner: ${onboardingData.dinnerTime || '19:00'}
- Sleep: ${onboardingData.sleepTime || '22:00'}

WORKOUT TYPE: ${onboardingData.workoutType || 'General'}
DIET TYPE: ${onboardingData.dietType || 'Balanced'}
ALLERGIES: ${onboardingData.allergies?.join(', ') || 'None'}

CRITICAL PERSONALIZATION RULES:
1. USE EXACT USER TIMES - do not suggest different times
2. DURING WORK HOURS (${onboardingData.workStart || '09:00'} - ${onboardingData.workEnd || '17:00'}):
   - NO physical workouts
   - Only suggest: desk stretches, breathing exercises, posture tips, water reminders, eye exercises
   - Keep suggestions under 5 minutes
3. WORKOUT STYLE (${onboardingData.workoutType || 'General'}):
   - If YOGA: Only yoga asanas, pranayama, meditation, flexibility work
   - If GYM: Only gym exercises with weights, machines, strength training
   - If HOME: Only bodyweight exercises, resistance bands, minimal equipment
   - If CARDIO: Only running, cycling, HIIT, jumping exercises
4. MEALS:
   - Follow ${onboardingData.dietType || 'Balanced'} strictly
   - Avoid ${onboardingData.allergies?.join(', ') || 'None'}
   - Match calorie target: ${selectedPlan.calorieTarget || selectedPlan.estimatedCalories || 'N/A'}
   - Match macro split: ${selectedPlan.macros?.protein || 'N/A'}P / ${selectedPlan.macros?.carbs || 'N/A'}C / ${selectedPlan.macros?.fats || 'N/A'}F
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
      "time": "${onboardingData.wakeUpTime || '06:00'}",
      "category": "morning_routine",
      "activity": "Wake Up & Hydration",
      "details": "Drink 500ml water, light stretching (5 min)",
      "duration": "10 min",
      "calories": 0
    }
  ]
}`;

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`,
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
    
    if (!data.candidates || data.candidates.length === 0 || !data.candidates[0].content || !data.candidates[0].content.parts || data.candidates[0].content.parts.length === 0) {
      throw new Error('Invalid response from Gemini API');
    }

    const generatedContent = data.candidates[0].content.parts[0].text;
    const parsedSchedule = JSON.parse(generatedContent);

    res.status(200).json({
      success: true,
      schedule: parsedSchedule.dailySchedule,
      plan: selectedPlan.name || selectedPlan.title,
      generatedAt: new Date().toISOString()
    });

  } catch (error) {
    console.error('Error in /api/generate-schedule:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to generate schedule',
      details: error.message
    });
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
