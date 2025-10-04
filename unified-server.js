import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
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
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors({ 
  origin: [
    'http://localhost:3000', // Local development
    'http://localhost:5173', // Vite dev server
    'http://127.0.0.1:3000', // Local development
    'http://127.0.0.1:5173'  // Vite dev server
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  credentials: true
}));

// Handle preflight requests - CORS middleware already handles this

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Request logging middleware
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
});

// Initialize AI Services
const GROQ_API_KEY = process.env.VITE_GROQ_API_KEY;
const OPENAI_API_KEY = process.env.VITE_OPENAI_API_KEY;
const GEMINI_API_KEY = process.env.VITE_GEMINI_API_KEY;

console.log('🔑 AI API Keys status:');
console.log('  ├── Groq:', GROQ_API_KEY ? '✅ Configured' : '❌ Missing');
console.log('  ├── OpenAI:', OPENAI_API_KEY ? '✅ Configured' : '❌ Missing');
console.log('  └── Gemini:', GEMINI_API_KEY ? '✅ Configured' : '❌ Missing');

const groq = GROQ_API_KEY ? new Groq({
  apiKey: GROQ_API_KEY,
}) : null;

// Initialize Supabase
const supabase = createClient(
  process.env.SUPABASE_URL || "https://lvnkpserdydhnqbigfbz.supabase.co",
  process.env.SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx2bmtwc2VyZHlkaG5xYmlnZmJ6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTMzMzY5NjYsImV4cCI6MjA2ODkxMjk2Nn0.Y2NfbA7K9efpFHB6FFmCtgti3udX5wbOoQVkDndtkBc"
);

// ============================================================================
// MULTI-AI SERVICE FUNCTIONS
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
      data: parseJSONResponse(content),
      provider: 'OpenAI',
      processingTime: Date.now() - startTime
    };
  } catch (error) {
    return {
      success: false,
      error: error.message || 'OpenAI API error',
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
    const response = await axios.post(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent`, {
      contents: [{
        parts: [{
          text: `${systemPrompt}\n\n${userPrompt}`
        }]
      }],
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 2000
      }
    }, {
      headers: {
        'Content-Type': 'application/json',
        'X-goog-api-key': GEMINI_API_KEY
      },
      timeout: 30000
    });

    const content = response.data.candidates[0].content.parts[0].text;
    
    return {
      success: true,
      data: parseJSONResponse(content),
      provider: 'Gemini',
      processingTime: Date.now() - startTime
    };
  } catch (error) {
    return {
      success: false,
      error: error.message || 'Gemini API error',
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
    const chatCompletion = await groq.chat.completions.create({
      model: "llama-3.1-8b-instant",
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ],
      temperature: 0.7,
      max_tokens: 2000
    });

    const content = chatCompletion.choices[0].message.content;
    
    return {
      success: true,
      data: parseJSONResponse(content),
      provider: 'Groq',
      processingTime: Date.now() - startTime
    };
  } catch (error) {
    return {
      success: false,
      error: error.message || 'Groq API error',
      provider: 'Groq',
      processingTime: Date.now() - startTime
    };
  }
}

// Parse JSON response with fallback
function parseJSONResponse(content) {
  try {
    // Clean the response - remove any text before or after JSON
    let cleanContent = content.trim();
    
    // Remove markdown code blocks if present
    cleanContent = cleanContent.replace(/```json\n?/g, '').replace(/```\n?/g, '');
    
    // Find the first { and last } to extract JSON
    const firstBrace = cleanContent.indexOf('{');
    const lastBrace = cleanContent.lastIndexOf('}');
    
    if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
      cleanContent = cleanContent.substring(firstBrace, lastBrace + 1);
    }
    
    const parsed = JSON.parse(cleanContent);
    
    // Validate the response structure
    if (typeof parsed === 'object' && parsed !== null) {
      return parsed;
    } else {
      return { content: content, error: 'Invalid JSON structure' };
    }
  } catch (error) {
    console.log('JSON Parse Error:', error.message);
    console.log('Raw Content:', content);
    return { content: content, error: 'JSON parse failed' };
  }
}

// Calculate consensus score from multiple AI responses
function calculateConsensusScore(responses) {
  const validScores = responses
    .filter(r => r.success && r.data && typeof r.data.healthScore === 'number')
    .map(r => r.data.healthScore);
  
  if (validScores.length === 0) return 0;
  
  const sum = validScores.reduce((a, b) => a + b, 0);
  return Math.round(sum / validScores.length);
}

// Aggregate responses from multiple AI models
function aggregateResponses(responses, type) {
  const validResponses = responses.filter(r => r.success && r.data && !r.data.error);
  
  console.log(`📊 Aggregating ${validResponses.length}/${responses.length} valid responses for ${type}`);
  
  if (validResponses.length === 0) {
    console.log('❌ No valid responses to aggregate');
    return null;
  }

  if (type === 'healthScore') {
    const consensusScore = calculateConsensusScore(responses);
    
    // Safely extract recommendations
    const allRecommendations = validResponses
      .flatMap(r => {
        const recs = r.data.recommendations;
        return Array.isArray(recs) ? recs : [];
      })
      .filter(rec => typeof rec === 'string' && rec.trim().length > 0)
      .filter((rec, index, arr) => arr.indexOf(rec) === index); // Remove duplicates
    
    // Safely extract strengths
    const allStrengths = validResponses
      .flatMap(r => {
        const strengths = r.data.strengths;
        return Array.isArray(strengths) ? strengths : [];
      })
      .filter(str => typeof str === 'string' && str.trim().length > 0)
      .filter((str, index, arr) => arr.indexOf(str) === index);
    
    // Safely extract improvements
    const allImprovements = validResponses
      .flatMap(r => {
        const improvements = r.data.improvements;
        return Array.isArray(improvements) ? improvements : [];
      })
      .filter(imp => typeof imp === 'string' && imp.trim().length > 0)
      .filter((imp, index, arr) => arr.indexOf(imp) === index);

    // Combine analyses
    const analyses = validResponses
      .map(r => r.data.analysis || '')
      .filter(a => typeof a === 'string' && a.trim().length > 0);
    
    const combinedAnalysis = analyses.length > 0 
      ? analyses.join(' ') 
      : 'Based on your health profile, here are our recommendations.';

    console.log(`✅ Aggregated: Score=${consensusScore}, Recs=${allRecommendations.length}, Strengths=${allStrengths.length}, Improvements=${allImprovements.length}`);

    return {
      healthScore: consensusScore,
      analysis: combinedAnalysis,
      recommendations: allRecommendations.slice(0, 5),
      strengths: allStrengths.slice(0, 3),
      improvements: allImprovements.slice(0, 3)
    };
  }

  if (type === 'healthPlans') {
    // For health plans, use the most comprehensive response
    const bestResponse = validResponses.reduce((best, current) => {
      const currentPlans = current.data.plans;
      const bestPlans = best.data.plans;
      
      if (Array.isArray(currentPlans) && Array.isArray(bestPlans)) {
        return currentPlans.length > bestPlans.length ? current : best;
      } else if (Array.isArray(currentPlans)) {
        return current;
      } else {
        return best;
      }
    });
    
    console.log(`✅ Using best health plans response from ${bestResponse.provider}`);
    return bestResponse.data;
  }

  return validResponses[0]?.data || null;
}

// Create specialized prompts for each AI model
function createHealthScorePrompt(userProfile, userInput, uploadedFiles, voiceTranscript, provider) {
  const baseSystem = `You are an expert health and wellness AI assistant for UrCare. Your role is to calculate a comprehensive health score (0-100) based on user data and provide detailed analysis and recommendations.

Key Guidelines:
- Health score should be 0-100 (0 = poor health, 100 = excellent health)
- Consider all provided data: user profile, health goals, lifestyle factors, medical conditions
- Provide specific, actionable recommendations
- Be encouraging but honest about health status
- Consider age, BMI, sleep patterns, exercise habits, diet, stress levels
- Factor in chronic conditions and medications appropriately`;

  const baseUser = `
Calculate a comprehensive health score for this user and provide detailed analysis.

USER PROFILE:
- Name: ${userProfile?.full_name || 'Not provided'}
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
- Wake Up Time: ${userProfile?.wake_up_time || 'Not provided'}

USER INPUT: ${userInput || 'No specific input provided'}
UPLOADED FILES: ${uploadedFiles?.length > 0 ? uploadedFiles.map(f => f.name).join('\n') : 'No files uploaded'}
VOICE TRANSCRIPT: ${voiceTranscript || 'No voice input provided'}`;

  if (provider === 'openai') {
    return {
      system: baseSystem + '\n\nFocus on clinical accuracy and evidence-based recommendations.',
      user: baseUser + '\n\nPlease provide:\n1. Health Score (0-100)\n2. Detailed Analysis (2-3 paragraphs explaining the score)\n3. Top 5 Recommendations (specific, actionable advice)\n4. Areas of Strength (what they\'re doing well)\n5. Priority Areas for Improvement (what needs most attention)\n\nFormat your response as JSON:\n{\n  "healthScore": number,\n  "analysis": "detailed analysis text",\n  "recommendations": ["recommendation1", "recommendation2", "recommendation3", "recommendation4", "recommendation5"],\n  "strengths": ["strength1", "strength2", "strength3"],\n  "improvements": ["improvement1", "improvement2", "improvement3"]\n}'
    };
  }

  if (provider === 'gemini') {
    return {
      system: baseSystem + '\n\nFocus on holistic health approach and lifestyle integration.',
      user: baseUser + '\n\nPlease provide:\n1. Health Score (0-100)\n2. Detailed Analysis (2-3 paragraphs explaining the score)\n3. Top 5 Recommendations (specific, actionable advice)\n4. Areas of Strength (what they\'re doing well)\n5. Priority Areas for Improvement (what needs most attention)\n\nFormat your response as JSON:\n{\n  "healthScore": number,\n  "analysis": "detailed analysis text",\n  "recommendations": ["recommendation1", "recommendation2", "recommendation3", "recommendation4", "recommendation5"],\n  "strengths": ["strength1", "strength2", "strength3"],\n  "improvements": ["improvement1", "improvement2", "improvement3"]\n}'
    };
  }

  if (provider === 'groq') {
    return {
      system: baseSystem + '\n\nFocus on practical implementation and user motivation.',
      user: baseUser + '\n\nPlease provide:\n1. Health Score (0-100)\n2. Detailed Analysis (2-3 paragraphs explaining the score)\n3. Top 5 Recommendations (specific, actionable advice)\n4. Areas of Strength (what they\'re doing well)\n5. Priority Areas for Improvement (what needs most attention)\n\nFormat your response as JSON:\n{\n  "healthScore": number,\n  "analysis": "detailed analysis text",\n  "recommendations": ["recommendation1", "recommendation2", "recommendation3", "recommendation4", "recommendation5"],\n  "strengths": ["strength1", "strength2", "strength3"],\n  "improvements": ["improvement1", "improvement2", "improvement3"]\n}'
    };
  }

  return { system: baseSystem, user: baseUser };
}

// Create specialized prompts for health plans
function createHealthPlansPrompt(userProfile, healthScore, analysis, recommendations, userInput, provider) {
  const baseSystem = `You are an expert health and wellness AI assistant for UrCare. Your role is to generate 3 personalized health plans based on user data, health score, and analysis.

Key Guidelines:
- Create 3 distinct plans: Beginner, Intermediate, and Advanced
- Each plan should be comprehensive with specific activities and timestamps
- Include wake-up routines, hydration, exercise, meals, work sessions, and sleep
- Make plans realistic and achievable
- Consider the user's health score and current lifestyle
- Provide specific times and durations for each activity
- Include dietary recommendations where relevant`;

  const baseUser = `
Generate 3 personalized health plans for this user based on their profile and health analysis.

USER PROFILE:
- Name: ${userProfile?.full_name || 'User'}
- Age: ${userProfile?.age || 'Not specified'}
- Health Score: ${healthScore}/100
- Health Goals: ${userProfile?.health_goals?.join(', ') || 'General wellness'}
- Diet Type: ${userProfile?.diet_type || 'Balanced'}
- Workout Time Preference: ${userProfile?.workout_time || 'Morning'}
- Sleep Schedule: ${userProfile?.sleep_time || '22:00'} - ${userProfile?.wake_up_time || '06:00'}

HEALTH ANALYSIS: ${analysis}
RECOMMENDATIONS: ${recommendations?.join(', ') || 'None'}
USER INPUT: ${userInput || 'No specific input provided'}`;

  if (provider === 'openai') {
    return {
      system: baseSystem + '\n\nFocus on evidence-based exercise science and nutrition principles.',
      user: baseUser + '\n\nCreate 3 plans: BEGINNER, INTERMEDIATE, and ADVANCED. Each should include wake-up routine, hydration, exercise, meals, work sessions, breaks, evening wind-down, and sleep schedule. Format as JSON with detailed activities array.'
    };
  }

  if (provider === 'gemini') {
    return {
      system: baseSystem + '\n\nFocus on holistic wellness and sustainable lifestyle changes.',
      user: baseUser + '\n\nCreate 3 plans: BEGINNER, INTERMEDIATE, and ADVANCED. Each should include wake-up routine, hydration, exercise, meals, work sessions, breaks, evening wind-down, and sleep schedule. Format as JSON with detailed activities array.'
    };
  }

  if (provider === 'groq') {
    return {
      system: baseSystem + '\n\nFocus on practical implementation and user-friendly scheduling.',
      user: baseUser + '\n\nCreate 3 plans: BEGINNER, INTERMEDIATE, and ADVANCED. Each should include wake-up routine, hydration, exercise, meals, work sessions, breaks, evening wind-down, and sleep schedule. Format as JSON with detailed activities array.'
    };
  }

  return { system: baseSystem, user: baseUser };
}

// ============================================================================
// API ROUTES - All backend logic moved here
// ============================================================================

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
    console.log('🤖 Multi-AI Processing: OpenAI, Gemini, Groq');

    // Create specialized prompts for each AI model
    const openaiPrompt = createHealthScorePrompt(userProfile, userInput, uploadedFiles, voiceTranscript, 'openai');
    const geminiPrompt = createHealthScorePrompt(userProfile, userInput, uploadedFiles, voiceTranscript, 'gemini');
    const groqPrompt = createHealthScorePrompt(userProfile, userInput, uploadedFiles, voiceTranscript, 'groq');

    // Execute all AI calls in parallel
    const [openaiResponse, geminiResponse, groqResponse] = await Promise.allSettled([
      callOpenAI(openaiPrompt.system, openaiPrompt.user),
      callGemini(geminiPrompt.system, geminiPrompt.user),
      callGroq(groqPrompt.system, groqPrompt.user)
    ]);

    const responses = [
      openaiResponse.status === 'fulfilled' ? openaiResponse.value : {
        success: false,
        error: 'OpenAI request failed',
        provider: 'OpenAI',
        processingTime: 0
      },
      geminiResponse.status === 'fulfilled' ? geminiResponse.value : {
        success: false,
        error: 'Gemini request failed',
        provider: 'Gemini',
        processingTime: 0
      },
      groqResponse.status === 'fulfilled' ? groqResponse.value : {
        success: false,
        error: 'Groq request failed',
        provider: 'Groq',
        processingTime: 0
      }
    ];

    const aggregatedData = aggregateResponses(responses, 'healthScore');
    const consensusScore = calculateConsensusScore(responses);

    if (aggregatedData) {
      console.log(`✅ Multi-AI Health Score calculated in ${Math.max(...responses.map(r => r.processingTime))}ms`);
      console.log(`📊 Consensus Score: ${consensusScore}`);
      console.log(`🤖 AI Responses: ${responses.filter(r => r.success).length}/3 successful`);

      res.status(200).json({
        success: true,
        healthScore: aggregatedData.healthScore,
        analysis: aggregatedData.analysis,
        recommendations: aggregatedData.recommendations,
        strengths: aggregatedData.strengths,
        improvements: aggregatedData.improvements,
        meta: {
          processingTime: Math.max(...responses.map(r => r.processingTime)),
          consensusScore: consensusScore,
          aiResponses: responses.filter(r => r.success).length,
          providers: responses.filter(r => r.success).map(r => r.provider)
        }
      });
    } else {
      // Fallback response if all AI services fail
      console.log('⚠️ All AI services failed, using fallback response');
      res.status(200).json({
        success: true,
        healthScore: 75,
        analysis: "Based on your profile, you have a good foundation for health. Continue maintaining your current habits and consider the recommendations provided.",
        recommendations: [
          "Maintain regular exercise routine",
          "Ensure adequate sleep (7-9 hours)",
          "Stay hydrated throughout the day",
          "Eat a balanced diet with fruits and vegetables",
          "Manage stress through relaxation techniques"
        ],
        strengths: ["You're taking steps to improve your health", "You have access to health resources"],
        improvements: ["Focus on consistent daily habits", "Set specific health goals"],
        meta: {
          processingTime: 0,
          consensusScore: 75,
          aiResponses: 0,
          providers: [],
          fallback: true
        }
      });
    }

  } catch (error) {
    console.error('❌ Health score generation error:', error);
    
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
    console.log('🤖 Multi-AI Processing: OpenAI, Gemini, Groq');

    // Create specialized prompts for each AI model
    const openaiPrompt = createHealthPlansPrompt(userProfile, healthScore, analysis, recommendations, userInput, 'openai');
    const geminiPrompt = createHealthPlansPrompt(userProfile, healthScore, analysis, recommendations, userInput, 'gemini');
    const groqPrompt = createHealthPlansPrompt(userProfile, healthScore, analysis, recommendations, userInput, 'groq');

    // Execute all AI calls in parallel
    const [openaiResponse, geminiResponse, groqResponse] = await Promise.allSettled([
      callOpenAI(openaiPrompt.system, openaiPrompt.user),
      callGemini(geminiPrompt.system, geminiPrompt.user),
      callGroq(groqPrompt.system, groqPrompt.user)
    ]);

    const responses = [
      openaiResponse.status === 'fulfilled' ? openaiResponse.value : {
        success: false,
        error: 'OpenAI request failed',
        provider: 'OpenAI',
        processingTime: 0
      },
      geminiResponse.status === 'fulfilled' ? geminiResponse.value : {
        success: false,
        error: 'Gemini request failed',
        provider: 'Gemini',
        processingTime: 0
      },
      groqResponse.status === 'fulfilled' ? groqResponse.value : {
        success: false,
        error: 'Groq request failed',
        provider: 'Groq',
        processingTime: 0
      }
    ];

    const aggregatedData = aggregateResponses(responses, 'healthPlans');

    if (aggregatedData && aggregatedData.plans) {
      console.log(`✅ Multi-AI Health Plans generated in ${Math.max(...responses.map(r => r.processingTime))}ms`);
      console.log(`🤖 AI Responses: ${responses.filter(r => r.success).length}/3 successful`);

      res.status(200).json({
        success: true,
        plans: aggregatedData.plans,
        meta: {
          processingTime: Math.max(...responses.map(r => r.processingTime)),
          aiResponses: responses.filter(r => r.success).length,
          providers: responses.filter(r => r.success).map(r => r.provider)
        }
      });
    } else {
      // Fallback to original Groq-only implementation if multi-AI fails
      console.log('⚠️ Multi-AI failed, falling back to Groq-only implementation');

    if (!groq) {
      return res.status(500).json({
        success: false,
          error: 'No AI services available'
      });
    }

      // Fallback to original Groq implementation
    const prompt = `
You are an expert fitness and nutrition AI that creates highly personalized, comprehensive health plans. Based on the user's complete profile and health analysis, generate 3 distinct, goal-specific fitness plans with detailed personalization including daily schedules.

## USER PROFILE DATA
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
- Available Equipment: ${userProfile?.available_equipment?.join(', ') || 'Not specified'}
- Allergies: ${userProfile?.allergies?.join(', ') || 'None'}
- Dietary Restrictions: ${userProfile?.dietary_restrictions?.join(', ') || 'None'}

## HEALTH ANALYSIS
Health Score: ${healthScore}/100
Health Analysis: ${analysis}
Recommendations: ${recommendations?.join(', ') || 'None'}

## ADDITIONAL INPUTS
User Input: ${userInput || 'None'}
Voice Transcript: ${voiceTranscript || 'None'}
Uploaded Files: ${uploadedFiles?.map(file => file.name).join(', ') || 'None'}

## PLAN GENERATION REQUIREMENTS

### 1. PLAN NAMING SYSTEM
Generate 3 DISTINCT, creative, goal-specific plan names based on the user's PRIMARY health goal. Each plan must have a UNIQUE approach and difficulty level:

**For Diabetes Reversal:**
- Plan 1: "Diabetes Reversal Foundation" (Beginner - 4-6 weeks)
- Plan 2: "Blood Sugar Mastery" (Intermediate - 8-10 weeks) 
- Plan 3: "Insulin Optimization Elite" (Advanced - 12+ weeks)

**For Weight Loss:**
- Plan 1: "Fat Burn Accelerator" (Beginner - 4-6 weeks)
- Plan 2: "Lean Body Transformation" (Intermediate - 8-10 weeks)
- Plan 3: "Elite Body Sculpting" (Advanced - 12+ weeks)

**For Weight Gain:**
- Plan 1: "Muscle Mass Foundation" (Beginner - 4-6 weeks)
- Plan 2: "Power Bulk Program" (Intermediate - 8-10 weeks)
- Plan 3: "Ultimate Weight Gainer" (Advanced - 12+ weeks)

**CRITICAL: Each plan must have DIFFERENT:**
- Difficulty levels (Beginner/Intermediate/Advanced)
- Duration (4-6 weeks, 8-10 weeks, 12+ weeks)
- Focus areas and approaches
- Exercise intensities and types
- Meal complexity and calorie targets

### 2. DETAILED DAILY SCHEDULE
Generate complete day schedule with EXACT timestamps using user's provided times. Each plan must have DIFFERENT daily schedules:

**Plan 1 (Beginner):** Simple, gentle routines with basic exercises
**Plan 2 (Intermediate):** Moderate intensity with varied workout types
**Plan 3 (Advanced):** Complex, intensive routines with advanced exercises

- Morning Routine (from wake-up time)
- Meal times (breakfast, lunch, dinner at user's specified times)
- Workout sessions (at user's preferred workout times)
- Evening routine (leading to user's sleep time)
- Include specific activities, meals, and exercises for each time slot
- Vary workout times, meal complexity, and activity intensity across plans

### 3. PERSONALIZATION REQUIREMENTS
Incorporate ALL onboarding data:
- Use exact meal times user provided
- Use wake-up and sleep times for scheduling
- Include preferred workout times and types
- Respect dietary restrictions and allergies
- Adjust intensity based on fitness level
- Modify exercises for health conditions
- Only suggest exercises for available equipment
- Fit workouts within user's available time blocks

### 4. SPECIFIC MEAL PLANNING
For each meal, provide:
- Specific food items (respecting dietary preferences)
- Portion sizes
- Calorie count
- Macro breakdown
- Preparation time
- Alternative options

### 5. WORKOUT DETAILS
For each workout session:
- Specific exercises (3-5 exercises)
- Sets and reps
- Rest periods
- Duration
- Intensity level
- Form tips
- Modifications based on fitness level

## RESPONSE FORMAT
Respond in this EXACT JSON format:
{
  "plans": [
    {
      "id": "plan_1",
      "title": "Creative Goal-Specific Plan Name",
      "description": "Comprehensive description of what the plan involves",
      "duration": "4-12 weeks",
      "difficulty": "Beginner/Intermediate/Advanced",
      "focusAreas": ["area1", "area2", "area3", "area4", "area5"],
      "estimatedCalories": 300,
      "equipment": ["equipment1", "equipment2"],
      "benefits": ["benefit1", "benefit2", "benefit3", "benefit4", "benefit5"],
      "dailySchedule": {
        "morning": {
          "time": "07:00",
          "activity": "Wake up ritual (drink water, stretching)",
          "details": "Specific morning routine based on user's wake-up time"
        },
        "breakfast": {
          "time": "08:00",
          "meal": "Specific breakfast meal plan",
          "calories": 400,
          "macros": "Protein: 25g, Carbs: 45g, Fats: 15g"
        },
        "workout": {
          "time": "09:00",
          "type": "Morning workout session",
          "exercises": [
            {
              "name": "Exercise Name",
              "sets": 3,
              "reps": 12,
              "rest": "60 seconds",
              "duration": "45 minutes"
            }
          ]
        },
        "lunch": {
          "time": "13:00",
          "meal": "Specific lunch meal plan",
          "calories": 500,
          "macros": "Protein: 30g, Carbs: 50g, Fats: 20g"
        },
        "dinner": {
          "time": "19:00",
          "meal": "Specific dinner meal plan",
          "calories": 600,
          "macros": "Protein: 35g, Carbs: 40g, Fats: 25g"
        },
        "evening": {
          "time": "21:00",
          "activity": "Evening wind-down routine",
          "details": "Specific evening activities leading to sleep"
        },
        "bedtime": {
          "time": "22:00",
          "activity": "Bedtime routine",
          "details": "Specific bedtime activities based on user's sleep time"
        }
      }
    }
  ]
}
`;

    const chatCompletion = await groq.chat.completions.create({
      model: "llama-3.1-8b-instant",
      messages: [
        {
          role: "system",
          content: "You are an expert fitness and nutrition AI that creates highly personalized, comprehensive health plans. Generate 3 distinct, goal-specific fitness plans with detailed personalization including creative naming, comprehensive impact analysis, detailed daily schedules, specific meal planning, and workout details. Always respond in valid JSON format with the exact structure specified in the prompt."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      max_tokens: 6000,
      temperature: 0.8
    });

    const response = chatCompletion.choices[0].message.content;
    console.log('📨 Groq Response:', response);

    // Parse the JSON response
    let planData;
    try {
      // Clean the response - remove any text before or after JSON
      let cleanResponse = response.trim();
      
      // Remove markdown code blocks if present
      cleanResponse = cleanResponse.replace(/```json\n?/g, '').replace(/```\n?/g, '');
      
      // Find the first { and last } to extract JSON
      const firstBrace = cleanResponse.indexOf('{');
      const lastBrace = cleanResponse.lastIndexOf('}');
      
      if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
        cleanResponse = cleanResponse.substring(firstBrace, lastBrace + 1);
      }
      
      planData = JSON.parse(cleanResponse);
      console.log('✅ Successfully parsed Groq response');
      
      // Ensure we have 3 different plans
      if (planData.plans && planData.plans.length >= 3) {
        // Add unique identifiers and ensure variety
        planData.plans.forEach((plan, index) => {
          if (!plan.id) plan.id = `plan_${index + 1}`;
          if (!plan.title) plan.title = `Health Plan ${index + 1}`;
          
          // Ensure different focus areas for each plan
          if (index === 0) {
            plan.focusAreas = ["Cardiovascular Health", "Weight Management", "Blood Sugar Control", "Nutrition", "Exercise"];
            plan.difficulty = "Beginner";
            plan.duration = "4-6 weeks";
          } else if (index === 1) {
            plan.focusAreas = ["Advanced Fitness", "Muscle Building", "Metabolic Health", "Stress Management", "Recovery"];
            plan.difficulty = "Intermediate";
            plan.duration = "8-10 weeks";
          } else if (index === 2) {
            plan.focusAreas = ["Elite Performance", "Body Composition", "Long-term Health", "Lifestyle Integration", "Maintenance"];
            plan.difficulty = "Advanced";
            plan.duration = "12+ weeks";
          }
        });
      }
    } catch (parseError) {
      console.error('❌ Failed to parse Groq response:', parseError);
      console.error('Raw response:', response);
      // Fallback response with comprehensive structure
      planData = {
        plans: [
          {
            id: "plan_1",
            title: "Beginner Wellness Journey",
            description: "A gentle introduction to healthy living with focus on building sustainable habits.",
            duration: "4 weeks",
            difficulty: "Beginner",
            focusAreas: ["Basic Fitness", "Nutrition", "Sleep", "Stress Management", "Habit Building"],
            estimatedCalories: 200,
            equipment: ["No equipment needed"],
            benefits: ["Build healthy habits", "Improve energy levels", "Better sleep quality", "Reduce stress", "Foundation for health"],
            impactAnalysis: {
              primaryGoalImpact: "Addresses primary health goals through gradual, sustainable changes",
              secondaryGoalsImpact: "Builds foundation for fitness level improvement and dietary habit formation",
              timeline: "4-week progressive program with weekly milestones",
              physicalChanges: "Improved energy, better sleep quality, increased daily activity",
              energyImprovements: "Steady energy levels throughout the day",
              mentalHealthBenefits: "Reduced stress, improved mood, better focus",
              sleepImprovements: "Better sleep quality and duration",
              stressReduction: "Daily stress management techniques"
            },
            planOverview: {
              dailyCalorieTarget: 1800,
              macronutrientBreakdown: {
                protein: "25%",
                carbs: "45%",
                fats: "30%"
              },
              workoutFrequency: "3 days per week",
              workoutTypes: ["Light Cardio", "Basic Strength", "Flexibility"],
              mealFrequency: "3 meals + 1 snack",
              keyFocusAreas: ["Habit Formation", "Basic Fitness", "Nutrition Education"],
              equipmentNeeded: ["None"],
              timeCommitment: "30 minutes daily"
            },
            dailySchedule: {
              morning: {
                time: "07:00",
                activity: "Wake up ritual (drink water, light stretching)",
                details: "Gentle morning routine to start the day"
              },
              breakfast: {
                time: "08:00",
                meal: "Balanced breakfast with protein and complex carbs",
                calories: 400,
                macros: "Protein: 20g, Carbs: 50g, Fats: 15g"
              },
              workout: {
                time: "09:00",
                type: "Light morning activity",
                exercises: [
                  {
                    name: "Morning Walk",
                    sets: 1,
                    reps: "20 minutes",
                    rest: "N/A",
                    duration: "20 minutes"
                  }
                ]
              },
              lunch: {
                time: "13:00",
                meal: "Nutritious lunch with vegetables and lean protein",
                calories: 500,
                macros: "Protein: 25g, Carbs: 60g, Fats: 20g"
              },
              dinner: {
                time: "19:00",
                meal: "Light dinner with focus on vegetables",
                calories: 400,
                macros: "Protein: 20g, Carbs: 40g, Fats: 18g"
              },
              evening: {
                time: "21:00",
                activity: "Evening wind-down routine",
                details: "Relaxation activities and preparation for sleep"
              },
              bedtime: {
                time: "22:00",
                activity: "Bedtime routine",
                details: "Consistent bedtime routine for better sleep"
              }
            }
          },
          {
            id: "plan_2",
            title: "Balanced Health Program",
            description: "A comprehensive approach combining exercise, nutrition, and wellness practices.",
            duration: "8 weeks",
            difficulty: "Intermediate",
            focusAreas: ["Cardio", "Strength Training", "Nutrition", "Stress Management", "Recovery"],
            estimatedCalories: 400,
            equipment: ["Dumbbells", "Yoga mat"],
            benefits: ["Improved fitness", "Better nutrition", "Reduced stress", "Weight management", "Enhanced performance"],
            impactAnalysis: {
              primaryGoalImpact: "Comprehensive approach to achieving health goals through balanced training and nutrition",
              secondaryGoalsImpact: "Addresses fitness level progression and dietary optimization",
              timeline: "8-week progressive program with bi-weekly assessments",
              physicalChanges: "Improved strength, cardiovascular fitness, and body composition",
              energyImprovements: "Sustained energy levels and improved endurance",
              mentalHealthBenefits: "Better stress management, improved confidence, enhanced focus",
              sleepImprovements: "Deeper, more restorative sleep",
              stressReduction: "Effective stress management techniques and recovery practices"
            },
            planOverview: {
              dailyCalorieTarget: 2200,
              macronutrientBreakdown: {
                protein: "30%",
                carbs: "40%",
                fats: "30%"
              },
              workoutFrequency: "5 days per week",
              workoutTypes: ["Strength Training", "Cardio", "Flexibility", "Recovery"],
              mealFrequency: "3 meals + 2 snacks",
              keyFocusAreas: ["Strength Building", "Cardiovascular Health", "Nutrition Optimization"],
              equipmentNeeded: ["Dumbbells", "Yoga Mat"],
              timeCommitment: "60 minutes daily"
            },
            dailySchedule: {
              morning: {
                time: "07:00",
                activity: "Wake up ritual (hydration, dynamic stretching)",
                details: "Active morning routine to prepare for the day"
              },
              breakfast: {
                time: "08:00",
                meal: "High-protein breakfast with complex carbohydrates",
                calories: 500,
                macros: "Protein: 30g, Carbs: 55g, Fats: 18g"
              },
              workout: {
                time: "09:00",
                type: "Morning strength training",
                exercises: [
                  {
                    name: "Squats",
                    sets: 3,
                    reps: 12,
                    rest: "60 seconds",
                    duration: "45 minutes"
                  },
                  {
                    name: "Push-ups",
                    sets: 3,
                    reps: 10,
                    rest: "60 seconds",
                    duration: "45 minutes"
                  }
                ]
              },
              lunch: {
                time: "13:00",
                meal: "Balanced lunch with lean protein and vegetables",
                calories: 600,
                macros: "Protein: 35g, Carbs: 65g, Fats: 22g"
              },
              dinner: {
                time: "19:00",
                meal: "Nutrient-dense dinner with focus on recovery",
                calories: 550,
                macros: "Protein: 40g, Carbs: 45g, Fats: 25g"
              },
              evening: {
                time: "21:00",
                activity: "Evening recovery routine",
                details: "Stretching, meditation, and preparation for sleep"
              },
              bedtime: {
                time: "22:00",
                activity: "Bedtime routine",
                details: "Consistent bedtime routine for optimal recovery"
              }
            }
          },
          {
            id: "plan_3",
            title: "Advanced Transformation",
            description: "An intensive program for those ready to commit to significant health improvements.",
            duration: "12 weeks",
            difficulty: "Advanced",
            focusAreas: ["High-Intensity Training", "Precision Nutrition", "Recovery", "Mental Health", "Performance"],
            estimatedCalories: 600,
            equipment: ["Full gym access", "Heart rate monitor", "Foam roller"],
            benefits: ["Maximum fitness gains", "Optimal nutrition", "Peak performance", "Complete transformation", "Elite conditioning"],
            impactAnalysis: {
              primaryGoalImpact: "Maximum impact on health goals through intensive, science-based approach",
              secondaryGoalsImpact: "Elite-level fitness development and precision nutrition optimization",
              timeline: "12-week intensive program with monthly assessments and adjustments",
              physicalChanges: "Significant strength gains, body composition changes, and performance improvements",
              energyImprovements: "Peak energy levels and exceptional endurance",
              mentalHealthBenefits: "Enhanced mental toughness, focus, and stress resilience",
              sleepImprovements: "Optimized sleep for maximum recovery and performance",
              stressReduction: "Advanced stress management and mental conditioning"
            },
            planOverview: {
              dailyCalorieTarget: 2800,
              macronutrientBreakdown: {
                protein: "35%",
                carbs: "35%",
                fats: "30%"
              },
              workoutFrequency: "6 days per week",
              workoutTypes: ["High-Intensity Training", "Strength Training", "Cardio", "Recovery", "Flexibility"],
              mealFrequency: "3 meals + 3 snacks",
              keyFocusAreas: ["Peak Performance", "Elite Conditioning", "Precision Nutrition"],
              equipmentNeeded: ["Full Gym Access", "Heart Rate Monitor", "Foam Roller"],
              timeCommitment: "90 minutes daily"
            },
            dailySchedule: {
              morning: {
                time: "06:00",
                activity: "Early morning preparation (hydration, mobility work)",
                details: "Intensive morning routine for peak performance"
              },
              breakfast: {
                time: "07:00",
                meal: "High-performance breakfast with optimal macronutrients",
                calories: 600,
                macros: "Protein: 45g, Carbs: 70g, Fats: 22g"
              },
              workout: {
                time: "08:00",
                type: "High-intensity morning training",
                exercises: [
                  {
                    name: "Deadlifts",
                    sets: 4,
                    reps: 8,
                    rest: "90 seconds",
                    duration: "60 minutes"
                  },
                  {
                    name: "Burpees",
                    sets: 4,
                    reps: 15,
                    rest: "60 seconds",
                    duration: "60 minutes"
                  }
                ]
              },
              lunch: {
                time: "13:00",
                meal: "Performance-optimized lunch for recovery and fuel",
                calories: 700,
                macros: "Protein: 50g, Carbs: 80g, Fats: 28g"
              },
              dinner: {
                time: "19:00",
                meal: "Recovery-focused dinner with premium nutrition",
                calories: 650,
                macros: "Protein: 55g, Carbs: 60g, Fats: 30g"
              },
              evening: {
                time: "21:00",
                activity: "Advanced recovery routine",
                details: "Comprehensive recovery including stretching, meditation, and preparation"
              },
              bedtime: {
                time: "22:00",
                activity: "Optimized bedtime routine",
                details: "Elite-level sleep preparation for maximum recovery"
              }
            }
          }
        ]
      };
    }

    res.status(200).json({
      success: true,
        plans: planData.plans,
        meta: {
          processingTime: 0,
          aiResponses: 1,
          providers: ['Groq'],
          fallback: true
        }
      });
    }

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

    if (!groq) {
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
    
    if (!groq) {
      return res.status(500).json({
        success: false,
        error: 'Groq API key not configured'
      });
    }

    const systemPrompt = `You are a health and wellness AI assistant. Generate 3 personalized health plans based on user data. Each plan should be practical, achievable, and tailored to the user's profile. 

IMPORTANT: You MUST respond with ONLY valid JSON format. Do not include any text before or after the JSON. The response should start with { and end with }.

Format your response as:
{
  "plans": [
    {
      "id": "plan_1",
      "title": "Plan Title",
      "description": "Plan description",
      "activities": [
        {
          "id": "a1",
          "label": "Activity Name",
          "time": "08:30"
        }
      ]
    }
  ]
}`;

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
      // Clean the response - remove any text before or after JSON
      let cleanResponse = response.trim();
      
      // Find the first { and last } to extract JSON
      const firstBrace = cleanResponse.indexOf('{');
      const lastBrace = cleanResponse.lastIndexOf('}');
      
      if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
        cleanResponse = cleanResponse.substring(firstBrace, lastBrace + 1);
      }
      
      planData = JSON.parse(cleanResponse);
    } catch (parseError) {
      console.error('❌ Failed to parse Groq response:', parseError);
      console.error('❌ Raw response:', response);
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

// Helper functions for sequential Groq -> Gemini flow
async function generatePlansWithGroq(userProfile, primaryGoal) {
  const prompt = `You are a health and fitness expert. Generate 3 comprehensive health plans for this user.

USER PROFILE:
- Name: ${userProfile.full_name}, Age: ${userProfile.age}, Gender: ${userProfile.gender}
- Height: ${userProfile.height_cm}cm, Weight: ${userProfile.weight_kg}kg, Blood Group: ${userProfile.blood_group}
- Work Schedule: ${userProfile.work_start} - ${userProfile.work_end} (12.5 hours)
- Daily Schedule: Wake ${userProfile.wake_up_time}, Sleep ${userProfile.sleep_time}, Workout ${userProfile.workout_time}
- Diet: ${userProfile.diet_type}, Workout: ${userProfile.workout_type}
- Health Goals: ${userProfile.health_goals?.join(', ')}
- Chronic Conditions: ${userProfile.chronic_conditions?.join(', ')}
- Critical Conditions: ${userProfile.critical_conditions}

PRIMARY GOAL: ${primaryGoal || 'Boost energy, improve sleep, reduce stress'}

Generate 3 DISTINCT plans:

PLAN 1 (FOUNDATION): Gentle, stress-reduction focused
PLAN 2 (BALANCED): Moderate intensity, comprehensive wellness  
PLAN 3 (INTENSIVE): Advanced, results-focused

For each plan provide:
1. Creative name
2. Description (100+ words)
3. Duration (4-8 weeks)
4. Difficulty level
5. Daily calorie target
6. Macro split (protein/carbs/fats %)
7. Workout frequency
8. Focus areas (6-8 items)
9. Timeline (week1-2, week3-4, month2, month3)
10. Impacts (primaryGoal, energy, physical, mental, sleep, stress)
11. Schedule constraints
12. Special considerations
13. Equipment needed
14. Time commitment

CRITICAL RULES:
- Work hours ${userProfile.work_start}-${userProfile.work_end}: NO physical activities
- During work: only desk stretches, breathing, posture, water, eye exercises
- Diet: ${userProfile.diet_type} strictly
- Allergies: ${userProfile.allergies?.join(', ') || 'None'}
- Conditions: ${userProfile.chronic_conditions?.join(', ')}
- Workout: ${userProfile.workout_type}
- Goals: ${userProfile.health_goals?.join(', ')}

Return ONLY valid JSON:
{
  "plans": [
    {
      "id": "plan_1",
      "name": "Plan Name",
      "description": "Description...",
      "duration": "4-6 weeks",
      "difficulty": "Beginner",
      "calorieTarget": 2000,
      "macros": {"protein": 30, "carbs": 40, "fats": 30},
      "workoutFrequency": "3 days/week",
      "workoutStyle": "${userProfile.workout_type}",
      "focusAreas": ["area1", "area2", "area3", "area4", "area5", "area6"],
      "timeline": {
        "week1-2": "Changes...",
        "week3-4": "Improvements...",
        "month2": "Transformations...",
        "month3": "Maintenance..."
      },
      "impacts": {
        "primaryGoal": "Impact...",
        "energy": "Energy...",
        "physical": "Physical...",
        "mental": "Mental...",
        "sleep": "Sleep...",
        "stress": "Stress..."
      },
      "scheduleConstraints": {
        "workoutWindows": ["07:30-08:00", "18:00-20:00"],
        "mealPrepComplexity": "medium",
        "recoveryTime": "8 hours sleep minimum"
      },
      "specialConsiderations": "Considerations...",
      "equipment": ["item1", "item2", "item3"],
      "timeCommitment": "60-90 minutes daily"
    }
  ]
}`;

  const completion = await groq.chat.completions.create({
    messages: [
      {
        role: "system",
        content: "You are a health and fitness expert. Generate 3 DISTINCT, comprehensive health plans. Return ONLY valid JSON."
      },
      {
        role: "user",
        content: prompt
      }
    ],
    model: "llama-3.3-70b-versatile",
    temperature: 0.8,
    max_tokens: 6000,
  });

  const response = completion.choices[0]?.message?.content;
  
  if (!response) {
    throw new Error('No response from Groq API');
  }

  // Parse Groq response
  let plans = [];
  try {
    const jsonMatch = response.match(/\[[\s\S]*\]/);
    if (jsonMatch) {
      plans = JSON.parse(jsonMatch[0]);
    } else {
      plans = JSON.parse(response);
    }
  } catch (parseError) {
    console.error('Failed to parse Groq response:', parseError);
    // Fallback plans
    plans = generateFallbackPlans(userProfile, primaryGoal);
  }

  return plans;
}

async function generateScheduleWithGemini(selectedPlan, userProfile) {
  const prompt = `You are a schedule optimization AI. Create a detailed daily schedule based on Groq's health plan.

GROQ PLAN: ${selectedPlan.name || selectedPlan.title}
- Difficulty: ${selectedPlan.difficulty || 'Beginner'}
- Focus: ${selectedPlan.focusAreas?.join(', ') || 'General wellness'}
- Calories: ${selectedPlan.calorieTarget || 2000}
- Equipment: ${selectedPlan.equipment?.join(', ') || 'Basic equipment'}
- Description: ${selectedPlan.description || 'Health plan'}

USER PROFILE:
- Name: ${userProfile.full_name}, Age: ${userProfile.age}
- Work: ${userProfile.work_start} - ${userProfile.work_end} (12.5 hours)
- Schedule: Wake ${userProfile.wake_up_time}, Sleep ${userProfile.sleep_time}
- Meals: Breakfast ${userProfile.breakfast_time}, Lunch ${userProfile.lunch_time}, Dinner ${userProfile.dinner_time}
- Workout: ${userProfile.workout_time} (${userProfile.workout_type})
- Diet: ${userProfile.diet_type}
- Goals: ${userProfile.health_goals?.join(', ')}
- Conditions: ${userProfile.chronic_conditions?.join(', ')}

TASK: Create detailed daily schedule that:
1. Uses EXACT user timings
2. Incorporates Groq's plan details
3. Addresses health conditions and goals
4. Includes specific exercises, meals, stress management
5. Respects work schedule (NO physical activities during work)
6. Provides detailed instructions
7. Includes calorie/macro info for meals
8. Addresses stress reduction and sleep improvement

CRITICAL RULES:
- USE EXACT TIMES - no different times
- WORK HOURS (${userProfile.work_start}-${userProfile.work_end}): Only desk stretches, breathing, posture, water, eye exercises
- WORKOUT: ${userProfile.workout_type} style
- DIET: ${userProfile.diet_type} strictly
- DIFFICULTY: ${selectedPlan.difficulty || 'Beginner'} level only

Return JSON:
{
  "dailySchedule": [
    {
      "time": "${userProfile.wake_up_time}",
      "category": "wakeup_routine",
      "activity": "Morning Energy Boost",
      "details": "Start your day with energy and focus",
      "duration": "30 min",
      "calories": 0,
      "subActivities": [
        {
          "time": "${userProfile.wake_up_time}",
          "activity": "Drink 500ml water immediately upon waking",
          "duration": "2 min"
        }
      ]
    }
  ]
}`;

  const response = await axios.post(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`, {
    contents: [{ parts: [{ text: prompt }] }],
    generationConfig: {
      temperature: 0.7,
      maxOutputTokens: 8192,
      responseMimeType: "application/json"
    }
  }, {
    headers: {
      'Content-Type': 'application/json',
      'X-goog-api-key': GEMINI_API_KEY
    }
  });

  const data = response.data;
  
  if (!data.candidates || !data.candidates[0] || !data.candidates[0].content) {
    throw new Error('Invalid response from Gemini API');
  }
  
  const text = data.candidates[0].content.parts[0].text;

  // Parse Gemini response
  let dailySchedule = [];
  try {
    const parsed = JSON.parse(text);
    dailySchedule = parsed.dailySchedule || [];
  } catch (parseError) {
    console.error('Failed to parse Gemini response:', parseError);
    // Fallback schedule
    dailySchedule = generateFallbackSchedule(userProfile, selectedPlan);
  }

  return {
    dailySchedule,
    selectedPlan
  };
}

function generateFallbackPlans(userProfile, primaryGoal) {
  return [
    {
      id: 'plan_1',
      name: 'Stress Relief Foundation',
      description: 'A gentle approach focused on reducing stress, improving sleep, and boosting energy through mindful practices and balanced nutrition.',
      duration: '4 weeks',
      difficulty: 'Beginner',
      focusAreas: ['Stress reduction', 'Sleep improvement', 'Energy boost', 'Mindfulness', 'Gentle movement'],
      calorieTarget: 2000,
      macros: { protein: 25, carbs: 45, fats: 30 },
      workoutFrequency: '3 days/week',
      workoutStyle: userProfile.workout_type,
      equipment: ['Yoga mat', 'Water bottle', 'Timer'],
      timeCommitment: '45-60 minutes daily'
    }
  ];
}

function generateFallbackSchedule(userProfile, selectedPlan) {
  return [
    {
      time: userProfile.wake_up_time,
      category: 'morning_routine',
      activity: 'Wake Up & Hydration',
      details: 'Drink 500ml water, light stretching (5 min)',
      duration: '10 min',
      calories: 0
    },
    {
      time: userProfile.workout_time,
      category: 'workout',
      activity: `${userProfile.workout_type} Workout`,
      details: `Follow your ${selectedPlan.difficulty || 'Beginner'} level plan`,
      duration: '45 min',
      calories: 300
    },
    {
      time: userProfile.sleep_time,
      category: 'sleep',
      activity: 'Bedtime Routine',
      details: 'Wind down activities, prepare for sleep',
      duration: '30 min',
      calories: 0
    }
  ];
}

// Sequential Groq -> Gemini API endpoint
app.post('/api/groq-gemini-sequential', async (req, res) => {
  try {
    const { userProfile, primaryGoal } = req.body;

    if (!userProfile) {
      return res.status(400).json({ 
        success: false, 
        error: 'Missing required fields: userProfile' 
      });
    }

    if (!GROQ_API_KEY || !GEMINI_API_KEY) {
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
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', timestamp: new Date().toISOString() });
});

// ============================================================================
// FRONTEND SERVING - Serve the React build
// ============================================================================

// Only serve static files and React app for non-API routes
app.use((req, res, next) => {
  // Skip static file serving for API routes
  if (req.path.startsWith('/api/')) {
    return next();
  }
  next();
});

// Serve static files from the React app build folder
app.use(express.static(path.join(__dirname, 'dist')));

// Handle React routing, return all requests to React app (except API routes)
app.use((req, res) => {
  // Don't serve React app for API routes
  if (req.path.startsWith('/api/')) {
    return res.status(404).json({ error: 'API endpoint not found' });
  }
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

// ============================================================================
// SERVER STARTUP
// ============================================================================

app.listen(PORT, () => {
  console.log(`🚀 Unified server running on port ${PORT}`);
  console.log(`📱 Frontend: http://localhost:${PORT}`);
  console.log(`🔧 API: http://localhost:${PORT}/api`);
  console.log(`❤️  Health: http://localhost:${PORT}/health`);
});
