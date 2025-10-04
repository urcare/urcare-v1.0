import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer } from 'vite';
import Groq from 'groq-sdk';
import { createClient } from '@supabase/supabase-js';
import multer from 'multer';
import dotenv from 'dotenv';
import axios from 'axios';

// Load environment variables
dotenv.config();

// ES module __dirname equivalent
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 8080;

// Middleware
app.use(cors({ 
  origin: [
    'http://localhost:8080',
    'http://localhost:3000',
    'http://127.0.0.1:8080',
    'http://127.0.0.1:3000'
  ],
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

// Initialize AI Services
const GROQ_API_KEY = process.env.VITE_GROQ_API_KEY;
const GROQ_API_KEY_2 = process.env.VITE_GROQ_API_KEY_2 || GROQ_API_KEY; // Use second key or fallback to first
const OPENAI_API_KEY = process.env.VITE_OPENAI_API_KEY;
const GEMINI_API_KEY = process.env.VITE_GEMINI_API_KEY;

console.log('🔑 AI API Keys status:');
console.log('  ├── Groq (Primary):', GROQ_API_KEY ? '✅ Configured' : '❌ Missing');
console.log('  ├── Groq (Schedule):', GROQ_API_KEY_2 ? '✅ Configured' : '❌ Missing');
console.log('  ├── OpenAI:', OPENAI_API_KEY ? '✅ Configured' : '❌ Missing');
console.log('  └── Gemini:', GEMINI_API_KEY ? '✅ Configured' : '❌ Missing');

const groq = GROQ_API_KEY ? new Groq({
  apiKey: GROQ_API_KEY,
}) : null;

const groq2 = GROQ_API_KEY_2 ? new Groq({
  apiKey: GROQ_API_KEY_2,
}) : null;

// Initialize Supabase
const supabase = createClient(
  process.env.VITE_SUPABASE_URL || "https://lvnkpserdydhnqbigfbz.supabase.co",
  process.env.VITE_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx2bmtwc2VyZHlkaG5xYmlnZmJ6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTMzMzY5NjYsImV4cCI6MjA2ODkxMjk2Nn0.Y2NfbA7K9efpFHB6FFmCtgti3udX5wbOoQVkDndtkBc"
);

// ============================================================================
// AI SERVICE FUNCTIONS
// ============================================================================

// OpenAI API call
async function callOpenAI(systemPrompt, userPrompt) {
  const startTime = Date.now();
  
  if (!OPENAI_API_KEY) {
    return {
      success: false,
      error: 'OpenAI API key not configured',
      provider: 'OpenAI',
      processingTime: Date.now() - startTime
    };
  }

  try {
    const response = await axios.post('https://api.openai.com/v1/chat/completions', {
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ],
      temperature: 0.7,
      max_tokens: 2000
    }, {
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      timeout: 30000
    });

    const content = response.data.choices[0].message.content;
    
    return {
      success: true,
      content: content,
      provider: 'OpenAI',
      processingTime: Date.now() - startTime
    };
  } catch (error) {
    console.error('OpenAI API Error:', error.message);
    return {
      success: false,
      error: error.message,
      provider: 'OpenAI',
      processingTime: Date.now() - startTime
    };
  }
}

// Gemini API call
async function callGemini(systemPrompt, userPrompt) {
  const startTime = Date.now();
  
  if (!GEMINI_API_KEY) {
    return {
      success: false,
      error: 'Gemini API key not configured',
      provider: 'Gemini',
      processingTime: Date.now() - startTime
    };
  }

  try {
    const { GoogleGenerativeAI } = await import('@google/generative-ai');
    const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    const prompt = `${systemPrompt}\n\nUser: ${userPrompt}`;
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const content = response.text();

    return {
      success: true,
      content: content,
      provider: 'Gemini',
      processingTime: Date.now() - startTime
    };
  } catch (error) {
    console.error('Gemini API Error:', error.message);
    return {
      success: false,
      error: error.message,
      provider: 'Gemini',
      processingTime: Date.now() - startTime
    };
  }
}

// Groq API call
async function callGroq(systemPrompt, userPrompt) {
  const startTime = Date.now();
  
  if (!groq) {
    return {
      success: false,
      error: 'Groq API key not configured',
      provider: 'Groq',
      processingTime: Date.now() - startTime
    };
  }

  try {
    const completion = await groq.chat.completions.create({
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt }
      ],
      model: "llama-3.3-70b-versatile",
      temperature: 0.8,
      max_tokens: 4000,
    });

    const content = completion.choices[0]?.message?.content;
    
    return {
      success: true,
      content: content,
      provider: 'Groq',
      processingTime: Date.now() - startTime
    };
  } catch (error) {
    console.error('Groq API Error:', error.message);
    return {
      success: false,
      error: error.message,
      provider: 'Groq',
      processingTime: Date.now() - startTime
    };
  }
}

// Groq API call for schedule generation (using second key)
async function callGroqSchedule(systemPrompt, userPrompt) {
  const startTime = Date.now();
  
  if (!groq2) {
    return {
      success: false,
      error: 'Groq Schedule API key not configured',
      provider: 'Groq-Schedule',
      processingTime: Date.now() - startTime
    };
  }

  try {
    const completion = await groq2.chat.completions.create({
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt }
      ],
      model: "llama-3.3-70b-versatile",
      temperature: 0.7,
      max_tokens: 6000, // Higher token limit for detailed schedules with meals and workouts
    });

    const content = completion.choices[0]?.message?.content;
    
    return {
      success: true,
      content: content,
      provider: 'Groq-Schedule',
      processingTime: Date.now() - startTime
    };
  } catch (error) {
    console.error('Groq Schedule API Error:', error.message);
    return {
      success: false,
      error: error.message,
      provider: 'Groq-Schedule',
      processingTime: Date.now() - startTime
    };
  }
}

// ============================================================================
// API ROUTES
// ============================================================================

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    message: 'Unified AI server running on port 8080'
  });
});

// Health Score Generation API
app.post('/api/health-score', async (req, res) => {
  try {
    const { userProfile, userInput, uploadedFiles, voiceTranscript } = req.body;
    
    console.log('🔍 Generating health score for user:', userProfile?.id || 'unknown');
    console.log('🤖 Multi-AI Processing: OpenAI, Gemini, Groq');

    const systemPrompt = `You are a comprehensive health assessment AI. Analyze the user's profile and provide a health score from 0-100, along with recommendations, strengths, and areas for improvement.`;
    
    const userPrompt = `
    User Profile:
    - Name: ${userProfile?.full_name || 'Not provided'}
    - Age: ${userProfile?.age || 'Not provided'}
    - Gender: ${userProfile?.gender || 'Not provided'}
    - Height: ${userProfile?.height_cm || 'Not provided'} cm
    - Weight: ${userProfile?.weight_kg || 'Not provided'} kg
    - Blood Group: ${userProfile?.blood_group || 'Not provided'}
    - Chronic Conditions: ${userProfile?.chronic_conditions?.join(', ') || 'None'}
    - Medications: ${userProfile?.medications?.join(', ') || 'None'}
    - Health Goals: ${userProfile?.health_goals?.join(', ') || 'General wellness'}
    - Diet Type: ${userProfile?.diet_type || 'Not specified'}
    - Workout Time: ${userProfile?.workout_time || 'Not specified'}
    - Sleep Time: ${userProfile?.sleep_time || 'Not specified'}
    - Wake Up Time: ${userProfile?.wake_up_time || 'Not specified'}

    User Input: ${userInput || 'No specific input provided'}
    Voice Transcript: ${voiceTranscript || 'None'}
    Uploaded Files: ${uploadedFiles?.length || 0} files

    Provide a JSON response with:
    {
      "healthScore": number (0-100),
      "recommendations": ["rec1", "rec2", ...],
      "strengths": ["strength1", "strength2", ...],
      "improvements": ["improvement1", "improvement2", ...]
    }
    `;

    // Call all AI services in parallel with timeout
    const [openaiResult, geminiResult, groqResult] = await Promise.allSettled([
      callOpenAI(systemPrompt, userPrompt),
      callGemini(systemPrompt, userPrompt),
      callGroq(systemPrompt, userPrompt)
    ]).then(results => results.map(result => 
      result.status === 'fulfilled' ? result.value : { success: false, error: result.reason?.message || 'Unknown error', provider: 'Unknown' }
    ));

    // Process results
    const validResults = [openaiResult, geminiResult, groqResult].filter(r => r.success);
    console.log(`📊 Aggregating ${validResults.length}/3 valid responses for healthScore`);

    if (validResults.length === 0) {
      console.warn('⚠️ All AI services failed, using fallback response');
      // Fallback response when all AI services fail
      res.status(200).json({
        success: true,
        healthScore: 75,
        recommendations: [
          'Maintain a balanced diet with fruits and vegetables',
          'Exercise for at least 30 minutes daily',
          'Get 7-9 hours of quality sleep',
          'Stay hydrated by drinking 8 glasses of water',
          'Manage stress through meditation or relaxation'
        ],
        strengths: [
          'Good health awareness',
          'Proactive approach to wellness',
          'Willingness to improve'
        ],
        improvements: [
          'Regular exercise routine',
          'Balanced nutrition',
          'Consistent sleep schedule',
          'Stress management',
          'Regular health checkups'
        ],
        providers: ['Fallback'],
        processingTime: 0
      });
      return;
    }

    // Aggregate results
    let totalScore = 0;
    let allRecommendations = [];
    let allStrengths = [];
    let allImprovements = [];

    validResults.forEach(result => {
      try {
        const content = result.content;
        const jsonMatch = content.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          const data = JSON.parse(jsonMatch[0]);
          if (data.healthScore) totalScore += data.healthScore;
          if (data.recommendations) allRecommendations.push(...data.recommendations);
          if (data.strengths) allStrengths.push(...data.strengths);
          if (data.improvements) allImprovements.push(...data.improvements);
        }
      } catch (parseError) {
        console.warn(`Failed to parse ${result.provider} response:`, parseError.message);
      }
    });

    const avgScore = Math.round(totalScore / validResults.length);
    const uniqueRecommendations = [...new Set(allRecommendations)].slice(0, 10);
    const uniqueStrengths = [...new Set(allStrengths)].slice(0, 7);
    const uniqueImprovements = [...new Set(allImprovements)].slice(0, 7);

    console.log(`✅ Aggregated: Score=${avgScore}, Recs=${uniqueRecommendations.length}, Strengths=${uniqueStrengths.length}, Improvements=${uniqueImprovements.length}`);
    console.log(`✅ Multi-AI Health Score calculated in ${Math.max(...validResults.map(r => r.processingTime))}ms`);
    console.log(`📊 Consensus Score: ${avgScore}`);
    console.log(`🤖 AI Responses: ${validResults.length}/3 successful`);

    res.status(200).json({
      success: true,
      healthScore: avgScore,
      recommendations: uniqueRecommendations,
      strengths: uniqueStrengths,
      improvements: uniqueImprovements,
      providers: validResults.map(r => r.provider),
      processingTime: Math.max(...validResults.map(r => r.processingTime))
    });

  } catch (error) {
    console.error('Health score generation error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Groq-Gemini Sequential API
app.post('/api/groq-gemini-sequential', async (req, res) => {
  try {
    const { userProfile, primaryGoal } = req.body;

    if (!userProfile || !primaryGoal) {
      return res.status(400).json({ error: 'User profile and primary goal are required' });
    }

    console.log('🔄 Starting Sequential Groq -> Gemini Flow');
    console.log('👤 User:', userProfile.full_name);

    // Step 1: Generate health plans using Groq
    console.log('🤖 STEP 1: Groq AI generating health plans...');
    const groqPrompt = `You are a fitness planning AI. Generate 3 distinct health plans based on user's goal and profile.

PRIMARY GOAL: ${primaryGoal}

ONBOARDING DATA:
- Name: ${userProfile.full_name}
- Age: ${userProfile.age}
- Gender: ${userProfile.gender}
- Height: ${userProfile.height_cm}cm
- Weight: ${userProfile.weight_kg}kg
- Blood Group: ${userProfile.blood_group}

SCHEDULE:
- Wake Up: ${userProfile.wake_up_time}
- Sleep: ${userProfile.sleep_time}
- Work: ${userProfile.work_start || '09:00'} - ${userProfile.work_end || '17:00'}
- Breakfast: ${userProfile.breakfast_time || '08:00'}
- Lunch: ${userProfile.lunch_time || '13:00'}
- Dinner: ${userProfile.dinner_time || '19:00'}
- Workout Time: ${userProfile.workout_time}

HEALTH:
- Chronic Conditions: ${userProfile.chronic_conditions?.join(', ') || 'None'}
- Medications: ${userProfile.medications?.join(', ') || 'None'}
- Surgeries: ${userProfile.surgery_history?.join(', ') || 'None'}
- Allergies: ${userProfile.allergies?.join(', ') || 'None'}

PREFERENCES:
- Diet Type: ${userProfile.diet_type}
- Workout Type: ${userProfile.workout_type || 'balanced'} (yoga/gym/home/cardio)
- Smoking: ${userProfile.smoking || 'No'}
- Drinking: ${userProfile.drinking || 'No'}
- Routine Flexibility: ${userProfile.routine_flexibility || 'Medium'}

HEALTH GOALS: ${userProfile.health_goals?.join(', ') || 'General wellness'}

Generate 3 plans with DIFFERENT approaches in this EXACT order:

PLAN 1 (BEGINNER): Gentle, foundational approach - MUST be first
PLAN 2 (INTERMEDIATE): Balanced, progressive approach - MUST be second  
PLAN 3 (ADVANCED): Intensive, results-focused approach - MUST be third

For each plan provide:
1. Creative goal-specific name (e.g., "Diabetes Reversal Foundation", "Ultimate Weight Gainer Pro")
2. Description (100 words)
3. Duration (4-6 weeks / 8-10 weeks / 12+ weeks)
4. Difficulty level
5. Daily calorie target
6. Macro split (protein/carbs/fats percentages)
7. Workout frequency (days per week)
8. Workout style based on user preference: ${userProfile.workout_type || 'balanced'}
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
- Respect work schedule: ${userProfile.work_start || '09:00'} - ${userProfile.work_end || '17:00'} = NO physical activities
- During work hours, only suggest: focus techniques, posture corrections, breathing exercises
- Respect dietary restrictions: ${userProfile.diet_type}
- Account for allergies: ${userProfile.allergies?.join(', ') || 'None'}
- Consider chronic conditions for exercise modifications

CRITICAL: You MUST include ALL the detailed information for each plan. Do not skip any fields.

Return ONLY valid JSON with this EXACT structure:
{
  "plans": [
    {
      "id": "plan_1",
      "name": "Creative Goal-Specific Name",
      "description": "Detailed 100-word description of the plan",
      "duration": "4-6 weeks",
      "difficulty": "Beginner",
      "calorieTarget": 1800,
      "macros": {"protein": 30, "carbs": 40, "fats": 30},
      "workoutFrequency": "3 days/week",
      "workoutStyle": "${userProfile.workout_type || 'balanced'}",
      "focusAreas": ["area1", "area2", "area3", "area4", "area5"],
      "timeline": {
        "week1-2": "Specific changes expected in weeks 1-2",
        "week3-4": "Specific changes expected in weeks 3-4", 
        "month2": "Specific changes expected in month 2",
        "month3": "Specific changes expected in month 3"
      },
      "impacts": {
        "primaryGoal": "How this plan impacts the primary goal",
        "energy": "Energy level improvements",
        "physical": "Physical changes expected",
        "mental": "Mental health benefits",
        "sleep": "Sleep quality improvements"
      },
      "scheduleConstraints": {
        "workoutWindows": ["06:00-07:30", "18:00-20:00"],
        "mealPrepComplexity": "medium",
        "recoveryTime": "8 hours sleep minimum"
      }
    },
    {
      "id": "plan_2", 
      "name": "Creative Goal-Specific Name",
      "description": "Detailed 100-word description of the plan",
      "duration": "8-10 weeks",
      "difficulty": "Intermediate",
      "calorieTarget": 2200,
      "macros": {"protein": 35, "carbs": 35, "fats": 30},
      "workoutFrequency": "4 days/week",
      "workoutStyle": "${userProfile.workout_type || 'balanced'}",
      "focusAreas": ["area1", "area2", "area3", "area4", "area5"],
      "timeline": {
        "week1-2": "Specific changes expected in weeks 1-2",
        "week3-4": "Specific changes expected in weeks 3-4",
        "month2": "Specific changes expected in month 2", 
        "month3": "Specific changes expected in month 3"
      },
      "impacts": {
        "primaryGoal": "How this plan impacts the primary goal",
        "energy": "Energy level improvements",
        "physical": "Physical changes expected",
        "mental": "Mental health benefits",
        "sleep": "Sleep quality improvements"
      },
      "scheduleConstraints": {
        "workoutWindows": ["06:00-07:30", "18:00-20:00"],
        "mealPrepComplexity": "high",
        "recoveryTime": "8 hours sleep minimum"
      }
    },
    {
      "id": "plan_3",
      "name": "Creative Goal-Specific Name", 
      "description": "Detailed 100-word description of the plan",
      "duration": "12+ weeks",
      "difficulty": "Advanced",
      "calorieTarget": 2500,
      "macros": {"protein": 40, "carbs": 30, "fats": 30},
      "workoutFrequency": "5 days/week",
      "workoutStyle": "${userProfile.workout_type || 'balanced'}",
      "focusAreas": ["area1", "area2", "area3", "area4", "area5"],
      "timeline": {
        "week1-2": "Specific changes expected in weeks 1-2",
        "week3-4": "Specific changes expected in weeks 3-4",
        "month2": "Specific changes expected in month 2",
        "month3": "Specific changes expected in month 3"
      },
      "impacts": {
        "primaryGoal": "How this plan impacts the primary goal",
        "energy": "Energy level improvements", 
        "physical": "Physical changes expected",
        "mental": "Mental health benefits",
        "sleep": "Sleep quality improvements"
      },
      "scheduleConstraints": {
        "workoutWindows": ["06:00-07:30", "18:00-20:00"],
        "mealPrepComplexity": "high",
        "recoveryTime": "8 hours sleep minimum"
      }
    }
  ]
}`;

    const groqResult = await callGroq(
      "You are a fitness planning expert. Generate 3 DISTINCT plans in EXACT order: Beginner, Intermediate, Advanced. Include ALL detailed information: impacts, timeline, focus areas, macros, workout frequency. Return ONLY valid JSON.",
      groqPrompt
    );

    if (!groqResult.success) {
      throw new Error(`Groq failed: ${groqResult.error}`);
    }

    let plans = [];
    try {
      const jsonMatch = groqResult.content.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        plans = JSON.parse(jsonMatch[0]);
      } else {
        plans = JSON.parse(groqResult.content);
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

    console.log('✅ Groq generated 3 plans');

    // Step 2: Generate detailed daily schedule using Groq
    console.log('🧠 STEP 2: Groq AI creating detailed schedule...');
    const selectedPlan = plans[0];
    
    const groqSchedulePrompt = `You are a schedule optimization AI. Generate a HYPER-PERSONALIZED daily schedule based on the selected plan and user's exact timings.

SELECTED PLAN:
${JSON.stringify(selectedPlan, null, 2)}

USER'S EXACT SCHEDULE:
- Wake Up: ${userProfile.wake_up_time}
- Breakfast: ${userProfile.breakfast_time || '08:00'}
- Work Start: ${userProfile.work_start || '09:00'}
- Lunch: ${userProfile.lunch_time || '13:00'}
- Work End: ${userProfile.work_end || '17:00'}
- Workout: ${userProfile.workout_time}
- Dinner: ${userProfile.dinner_time || '19:00'}
- Sleep: ${userProfile.sleep_time}

WORKOUT TYPE: ${userProfile.workout_type || 'balanced'}
DIET TYPE: ${userProfile.diet_type}
ALLERGIES: ${userProfile.allergies?.join(', ') || 'None'}

CRITICAL PERSONALIZATION RULES:
1. START THE SCHEDULE AT THE USER'S EXACT WAKE-UP TIME: ${userProfile.wake_up_time}
2. USE ONLY THE USER'S PROVIDED TIMES - do not suggest different times
3. DURING WORK HOURS (${userProfile.work_start || '09:00'} - ${userProfile.work_end || '17:00'}):
   - NO physical workouts
   - Only suggest: desk stretches, breathing exercises, posture tips, water reminders, eye exercises
   - Keep suggestions under 5 minutes
4. WORKOUT STYLE (${userProfile.workout_type || 'balanced'}):
   - If YOGA: Only yoga asanas, pranayama, meditation, flexibility work
   - If GYM: Only gym exercises with weights, machines, strength training
   - If HOME: Only bodyweight exercises, resistance bands, minimal equipment
   - If CARDIO: Only running, cycling, HIIT, jumping exercises
5. MEALS - PROVIDE DETAILED INFORMATION:
   - Follow ${userProfile.diet_type} strictly
   - Avoid ${userProfile.allergies?.join(', ') || 'None'}
   - Match calorie target: ${selectedPlan.calorieTarget || 2000}
   - Match macro split: ${selectedPlan.macros?.protein || 30}P / ${selectedPlan.macros?.carbs || 40}C / ${selectedPlan.macros?.fats || 30}F
   - Include specific foods, exact quantities, cooking methods, and preparation time
6. DIFFICULTY ADAPTATION:
   - ${selectedPlan.difficulty} level exercises only
   - Scale intensity appropriately

Generate COMPLETE daily schedule from ${userProfile.wake_up_time} to ${userProfile.sleep_time} with:
- Exact timestamps (use user's times exactly)
- Specific activities (no generic placeholders)
- Detailed exercise lists (with sets/reps/equipment)
- Specific meal plans (with ingredients, quantities, cooking instructions)
- Calorie and macro breakdown for each meal
- Detailed workout routines with specific exercises

Return ONLY valid JSON with this structure:
{
  "dailySchedule": [
    {
      "time": "${userProfile.wake_up_time}",
      "category": "morning_routine",
      "activity": "Wake Up & Hydration",
      "details": "Drink 500ml water, light stretching (5 min), prepare for the day",
      "duration": "10 min",
      "calories": 0
    },
    {
      "time": "${userProfile.breakfast_time || '08:00'}",
      "category": "meal",
      "activity": "Breakfast",
      "meal": {
        "name": "Protein-Rich ${userProfile.diet_type} Breakfast",
        "items": [
          {"food": "Oats", "quantity": "50g", "calories": 190, "protein": 7, "carbs": 34, "fats": 3, "preparation": "Cook with water, add cinnamon"},
          {"food": "Banana", "quantity": "1 medium", "calories": 105, "protein": 1, "carbs": 27, "fats": 0, "preparation": "Slice and add to oats"},
          {"food": "Almonds", "quantity": "10 pieces", "calories": 70, "protein": 3, "carbs": 3, "fats": 6, "preparation": "Chop and sprinkle on top"}
        ],
        "totalCalories": 365,
        "totalMacros": {"protein": 11, "carbs": 64, "fats": 9},
        "prepTime": "15 min",
        "cookingInstructions": "1. Boil water, add oats and cook for 5 min. 2. Slice banana and add to oats. 3. Top with chopped almonds and cinnamon.",
        "alternatives": ["Eggs and whole wheat toast", "Greek yogurt with fruits"]
      },
      "duration": "20 min"
    },
    {
      "time": "${userProfile.work_start || '09:00'}",
      "category": "work",
      "activity": "Work Start - Focus Session",
      "details": "Begin work. Stay hydrated. Maintain good posture. Set up workspace for productivity.",
      "duration": "Until ${userProfile.work_end || '17:00'}"
    },
    {
      "time": "10:30",
      "category": "work_break",
      "activity": "Desk Stretch Break",
      "details": "Neck rolls (10 reps each direction), Shoulder shrugs (10 reps), Wrist circles (10 each direction), Stand and stretch (2 min)",
      "duration": "5 min",
      "calories": 5
    },
    {
      "time": "${userProfile.lunch_time || '13:00'}",
      "category": "meal",
      "activity": "Lunch",
      "meal": {
        "name": "${userProfile.diet_type} Balanced Lunch",
        "items": [
          {"food": "Grilled Chicken Breast", "quantity": "150g", "calories": 250, "protein": 45, "carbs": 0, "fats": 5, "preparation": "Season with herbs, grill 6-8 min each side"},
          {"food": "Brown Rice", "quantity": "100g cooked", "calories": 110, "protein": 2, "carbs": 23, "fats": 1, "preparation": "Cook 1:2 ratio rice to water for 20 min"},
          {"food": "Mixed Vegetables", "quantity": "150g", "calories": 50, "protein": 3, "carbs": 10, "fats": 0, "preparation": "Steam for 5-7 min, season with salt and pepper"}
        ],
        "totalCalories": 410,
        "totalMacros": {"protein": 50, "carbs": 33, "fats": 6},
        "prepTime": "25 min",
        "cookingInstructions": "1. Season chicken and grill. 2. Cook rice separately. 3. Steam vegetables. 4. Plate together.",
        "alternatives": ["Quinoa bowl with vegetables", "Lentil curry with rice"]
      },
      "duration": "30 min"
    },
    {
      "time": "${userProfile.workout_time}",
      "category": "workout",
      "activity": "${userProfile.workout_type || 'balanced'} Workout - ${selectedPlan.difficulty} Level",
      "workout": {
        "type": "${userProfile.workout_type || 'balanced'}",
        "warmup": [
          {"exercise": "Dynamic stretching", "duration": "5 min", "details": "Arm circles, leg swings, hip circles"}
        ],
        "mainExercises": [
          {"exercise": "Push-ups", "sets": "3", "reps": "12-15", "duration": "3 min", "details": "Keep core tight, full range of motion"},
          {"exercise": "Squats", "sets": "3", "reps": "15-20", "duration": "4 min", "details": "Feet shoulder-width apart, lower until thighs parallel"},
          {"exercise": "Plank", "sets": "3", "reps": "30-45 sec", "duration": "3 min", "details": "Straight line from head to heels"}
        ],
        "cooldown": [
          {"exercise": "Static stretching", "duration": "5 min", "details": "Hold each stretch for 30 seconds"}
        ],
        "totalDuration": "45 min",
        "caloriesBurned": 300,
        "intensity": "${selectedPlan.difficulty}",
        "equipment": ["None - bodyweight only"]
      }
    },
    {
      "time": "${userProfile.dinner_time || '19:00'}",
      "category": "meal",
      "activity": "Dinner",
      "meal": {
        "name": "${userProfile.diet_type} Light Dinner",
        "items": [
          {"food": "Salmon Fillet", "quantity": "120g", "calories": 200, "protein": 35, "carbs": 0, "fats": 8, "preparation": "Season with lemon, herbs, bake 12-15 min at 400°F"},
          {"food": "Sweet Potato", "quantity": "1 medium", "calories": 100, "protein": 2, "carbs": 24, "fats": 0, "preparation": "Bake for 45 min at 400°F, season with cinnamon"},
          {"food": "Steamed Broccoli", "quantity": "100g", "calories": 35, "protein": 3, "carbs": 7, "fats": 0, "preparation": "Steam for 5 min, add garlic and olive oil"}
        ],
        "totalCalories": 335,
        "totalMacros": {"protein": 40, "carbs": 31, "fats": 8},
        "prepTime": "45 min",
        "cookingInstructions": "1. Preheat oven to 400°F. 2. Bake sweet potato for 45 min. 3. Season salmon and bake last 12-15 min. 4. Steam broccoli separately.",
        "alternatives": ["Grilled fish with quinoa", "Vegetable stir-fry with tofu"]
      },
      "duration": "30 min"
    },
    {
      "time": "${userProfile.sleep_time}",
      "category": "sleep",
      "activity": "Bedtime Routine",
      "details": "Wind down activities: light reading, meditation, prepare for sleep, avoid screens 1 hour before bed",
      "duration": "30 min"
    }
  ]
}`;

    const groqScheduleResult = await callGroqSchedule(
      "You are a schedule optimization AI. Generate HYPER-PERSONALIZED daily schedules based on user's exact timings and preferences. Return ONLY valid JSON.",
      groqSchedulePrompt
    );

    if (!groqScheduleResult.success) {
      throw new Error(`Groq Schedule failed: ${groqScheduleResult.error}`);
    }

    let schedule = { dailySchedule: [] };
    try {
      const jsonMatch = groqScheduleResult.content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        schedule = JSON.parse(jsonMatch[0]);
      } else {
        schedule = JSON.parse(groqScheduleResult.content);
      }
    } catch (parseError) {
      console.error('Failed to parse Groq Schedule response:', parseError);
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

    console.log('✅ Groq generated detailed schedule');

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
});

// Generate Schedule API
app.post('/api/generate-schedule', async (req, res) => {
  try {
    const { selectedPlanId, planDetails, onboardingData, userProfile } = req.body;

    console.log('🔍 Generating schedule for plan:', selectedPlanId);

    if (!selectedPlanId || !planDetails || !planDetails.plans) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: selectedPlanId, planDetails'
      });
    }

    // Find the selected plan
    const selectedPlan = planDetails.plans.find(plan => plan.id === selectedPlanId);
    if (!selectedPlan) {
      return res.status(404).json({
        success: false,
        error: 'Selected plan not found'
      });
    }

    // Generate detailed schedule using Groq
    const groqScheduleResult = await callGroqSchedule(
      "You are a detailed health and fitness scheduling expert. Create comprehensive daily schedules for health plans. Return ONLY valid JSON.",
      `Generate a detailed daily schedule for the health plan: "${selectedPlan.title || selectedPlan.name}".

      Plan Details:
      - Description: ${selectedPlan.description || 'Health plan'}
      - Duration: ${selectedPlan.duration || '4-6 weeks'}
      - Difficulty: ${selectedPlan.difficulty || 'Beginner'}
      - Focus Areas: ${selectedPlan.focusAreas?.join(', ') || 'General wellness'}
      - Equipment: ${selectedPlan.equipment?.join(', ') || 'Basic equipment'}
      - Benefits: ${selectedPlan.benefits?.join(', ') || 'Improved health'}

      User Profile:
      - Age: ${userProfile?.age || 'Not specified'}
      - Health Goals: ${userProfile?.health_goals?.join(', ') || 'General wellness'}
      - Workout Time: ${userProfile?.workout_time || 'Morning'}
      - Sleep Time: ${userProfile?.sleep_time || '22:00'}
      - Wake Up Time: ${userProfile?.wake_up_time || '06:00'}

      Generate a complete daily schedule from 6:00 AM to 10:00 PM with:
      1. Specific activities with exact times
      2. Duration for each activity
      3. Detailed instructions
      4. Equipment needed for each activity
      5. Difficulty level for each activity
      6. Estimated calories burned
      7. Activity type (exercise, meal, rest, work, mindfulness)

      Format as JSON with activities array containing: id, title, time, duration, type, details, instructions, equipment, difficulty, calories`
    );

    if (!groqScheduleResult.success) {
      console.warn('⚠️ Groq Schedule failed, using fallback schedule');
      // Fallback schedule
      const fallbackSchedule = {
        activities: [
          {
            id: 'morning-routine',
            title: 'Morning Wake-up Routine',
            time: '06:00',
            duration: '30 minutes',
            type: 'exercise',
            details: 'Start your day with energy and focus',
            instructions: 'Drink water, light stretching, breathing exercises',
            equipment: ['Water bottle', 'Yoga mat'],
            difficulty: 'Beginner',
            calories: 50
          },
          {
            id: 'breakfast',
            title: 'Healthy Breakfast',
            time: '07:00',
            duration: '20 minutes',
            type: 'meal',
            details: 'Nutritious breakfast to fuel your day',
            instructions: 'Prepare a balanced meal with protein and complex carbs',
            equipment: ['Kitchen utensils'],
            difficulty: 'Beginner',
            calories: 300
          },
          {
            id: 'workout',
            title: 'Workout Session',
            time: '08:00',
            duration: '45 minutes',
            type: 'exercise',
            details: `Follow your ${selectedPlan.difficulty || 'Beginner'} level plan`,
            instructions: 'Complete your personalized workout routine',
            equipment: selectedPlan.equipment || ['Basic equipment'],
            difficulty: selectedPlan.difficulty || 'Beginner',
            calories: 200
          },
          {
            id: 'lunch',
            title: 'Lunch Break',
            time: '13:00',
            duration: '30 minutes',
            type: 'meal',
            details: 'Balanced lunch for sustained energy',
            instructions: 'Eat a nutritious meal with vegetables and lean protein',
            equipment: ['Kitchen utensils'],
            difficulty: 'Beginner',
            calories: 400
          },
          {
            id: 'evening-routine',
            title: 'Evening Wind-down',
            time: '21:00',
            duration: '30 minutes',
            type: 'mindfulness',
            details: 'Relax and prepare for tomorrow',
            instructions: 'Practice relaxation techniques and prepare for sleep',
            equipment: ['Comfortable clothes'],
            difficulty: 'Beginner',
            calories: 0
          }
        ]
      };

      res.status(200).json({
        success: true,
        activities: fallbackSchedule.activities,
        generatedAt: new Date().toISOString()
      });
      return;
    }

    let scheduleData;
    try {
      const jsonMatch = groqScheduleResult.content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        scheduleData = JSON.parse(jsonMatch[0]);
      } else {
        scheduleData = JSON.parse(groqScheduleResult.content);
      }
    } catch (parseError) {
      console.error('Failed to parse Groq Schedule response:', parseError);
      // Fallback schedule
      const fallbackSchedule = {
        activities: [
          {
            id: 'morning-routine',
            title: 'Morning Wake-up Routine',
            time: '06:00',
            duration: '30 minutes',
            type: 'exercise',
            details: 'Start your day with energy and focus',
            instructions: 'Drink water, light stretching, breathing exercises',
            equipment: ['Water bottle', 'Yoga mat'],
            difficulty: 'Beginner',
            calories: 50
          }
        ]
      };
      scheduleData = fallbackSchedule;
    }

    console.log('✅ Schedule generated successfully');

    res.status(200).json({
      success: true,
      activities: scheduleData.activities || [],
      generatedAt: new Date().toISOString()
    });

  } catch (error) {
    console.error('Schedule generation error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Complete Plan Generation API
app.post('/api/generate-complete-plan', async (req, res) => {
  try {
    const { primaryGoal, onboardingData, userProfile } = req.body;

    console.log('🚀 Generating complete health plan...');

    const systemPrompt = `You are a comprehensive health and fitness planning expert. Generate detailed health plans based on user profiles and goals.`;
    
    const userPrompt = `
    Primary Goal: ${primaryGoal}
    User Profile: ${JSON.stringify(userProfile, null, 2)}
    Onboarding Data: ${JSON.stringify(onboardingData, null, 2)}

    Generate 3 comprehensive health plans with detailed daily schedules. Each plan should include:
    - Plan name and description
    - Duration and difficulty level
    - Focus areas and benefits
    - Equipment needed
    - Detailed daily schedule with activities, times, and instructions
    - Estimated calories and health impacts

    Return as JSON with plans array containing all details.
    `;

    const geminiResult = await callGemini(systemPrompt, userPrompt);

    if (!geminiResult.success) {
      console.warn('⚠️ Gemini failed, using fallback plans');
      // Fallback plans when Gemini fails
      res.status(200).json({
        success: true,
        plans: [
          {
            id: 'plan_1',
            title: 'Morning Wellness Routine',
            description: 'Start your day with energy and focus through structured morning activities',
            duration: '4 weeks',
            difficulty: 'Beginner',
            focusAreas: ['Morning routine', 'Energy boost', 'Mental clarity'],
            estimatedCalories: 200,
            equipment: ['Yoga mat', 'Water bottle', 'Timer'],
            benefits: ['Increased energy', 'Better focus', 'Improved mood']
          },
          {
            id: 'plan_2',
            title: 'Afternoon Productivity',
            description: 'Maximize your afternoon potential with targeted activities',
            duration: '6 weeks',
            difficulty: 'Intermediate',
            focusAreas: ['Productivity', 'Focus', 'Energy management'],
            estimatedCalories: 150,
            equipment: ['Desk setup', 'Timer', 'Notebook'],
            benefits: ['Higher productivity', 'Better focus', 'Reduced fatigue']
          },
          {
            id: 'plan_3',
            title: 'Evening Wind-down',
            description: 'Relax and prepare for tomorrow with calming evening routines',
            duration: '3 weeks',
            difficulty: 'Beginner',
            focusAreas: ['Relaxation', 'Sleep preparation', 'Stress relief'],
            estimatedCalories: 100,
            equipment: ['Comfortable clothes', 'Dim lighting', 'Journal'],
            benefits: ['Better sleep', 'Reduced stress', 'Improved recovery']
          }
        ],
        generatedAt: new Date().toISOString()
      });
      return;
    }

    let plans = [];
    try {
      const jsonMatch = geminiResult.content.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        plans = JSON.parse(jsonMatch[0]);
      } else {
        plans = JSON.parse(geminiResult.content);
      }
    } catch (parseError) {
      console.error('Failed to parse plan response:', parseError);
      // Fallback plans
      plans = [
        {
          id: 'plan_1',
          title: 'Morning Wellness Routine',
          description: 'Start your day with energy and focus through structured morning activities',
          duration: '4 weeks',
          difficulty: 'Beginner',
          focusAreas: ['Morning routine', 'Energy boost', 'Mental clarity'],
          estimatedCalories: 200,
          equipment: ['Yoga mat', 'Water bottle', 'Timer'],
          benefits: ['Increased energy', 'Better focus', 'Improved mood']
        },
        {
          id: 'plan_2',
          title: 'Afternoon Productivity',
          description: 'Maximize your afternoon potential with targeted activities',
          duration: '6 weeks',
          difficulty: 'Intermediate',
          focusAreas: ['Productivity', 'Focus', 'Energy management'],
          estimatedCalories: 150,
          equipment: ['Desk setup', 'Timer', 'Notebook'],
          benefits: ['Higher productivity', 'Better focus', 'Reduced fatigue']
        },
        {
          id: 'plan_3',
          title: 'Evening Wind-down',
          description: 'Relax and prepare for tomorrow with calming evening routines',
          duration: '3 weeks',
          difficulty: 'Beginner',
          focusAreas: ['Relaxation', 'Sleep preparation', 'Stress relief'],
          estimatedCalories: 100,
          equipment: ['Comfortable clothes', 'Dim lighting', 'Journal'],
          benefits: ['Better sleep', 'Reduced stress', 'Improved recovery']
        }
      ];
    }

    console.log('✅ Gemini generated detailed schedule');

    res.status(200).json({
      success: true,
      plans: plans,
      generatedAt: new Date().toISOString()
    });

  } catch (error) {
    console.error('Complete plan generation error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// ============================================================================
// VITE INTEGRATION
// ============================================================================

async function createViteServer() {
  const vite = await createServer({
    server: { middlewareMode: true },
    appType: 'spa'
  });

  // Use vite's connect instance as middleware
  app.use(vite.middlewares);

  return vite;
}

// ============================================================================
// SERVER STARTUP
// ============================================================================

async function startServer() {
  try {
    // Create Vite server
    const vite = await createViteServer();
    
    // Start the server
    app.listen(PORT, () => {
      console.log(`🚀 Unified AI Server running on port ${PORT}`);
      console.log(`📱 Frontend: http://localhost:${PORT}/`);
      console.log(`🔧 API: http://localhost:${PORT}/api/`);
      console.log(`❤️  Health: http://localhost:${PORT}/api/health`);
      console.log(`🤖 AI Services: Health Score, Sequential AI, Complete Plans`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

startServer();
