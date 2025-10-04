const { Groq } = require('groq-sdk');

// Initialize Groq with primary API key
const groq = new Groq({
  apiKey: process.env.VITE_GROQ_API_KEY,
});

// Initialize Groq with secondary API key for load balancing
const groq2 = new Groq({
  apiKey: process.env.VITE_GROQ_API_KEY_2,
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

  if (req.method === 'GET') {
    return res.status(200).json({ 
      status: 'ok', 
      message: 'Health score endpoint is working',
      timestamp: new Date().toISOString(),
      method: 'GET'
    });
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { userProfile, userInput, uploadedFiles, voiceTranscript } = req.body;

    console.log('🔍 Generating health score for user:', userProfile?.id);
    console.log('🔑 Groq API Key available:', !!process.env.VITE_GROQ_API_KEY);

    if (!process.env.VITE_GROQ_API_KEY) {
      return res.status(500).json({
        success: false,
        error: 'Groq API key not configured'
      });
    }

    // Prepare the prompt for health score calculation (matching your current system)
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
Uploaded Files Content: ${uploadedFiles?.map(file => `${file.name}: ${file.content?.substring(0, 500)}...`).join('\n\n') || 'None'}

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

    // Try both Groq API keys for load balancing
    let healthData;
    let usedProvider = 'Groq-Primary';

    try {
      // Try primary API key first
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
      let content = response;
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        content = jsonMatch[0];
      }
      
      healthData = JSON.parse(content);
    } catch (primaryError) {
      console.log('⚠️ Primary Groq API failed, trying secondary...');
      
      // Try secondary API key if primary fails
      if (process.env.VITE_GROQ_API_KEY_2) {
        try {
          const chatCompletion2 = await groq2.chat.completions.create({
            model: "llama-3.3-70b-versatile",
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

          const response2 = chatCompletion2.choices[0].message.content;
          console.log('📨 Groq Secondary Response:', response2);

          let content2 = response2;
          const jsonMatch2 = content2.match(/\{[\s\S]*\}/);
          if (jsonMatch2) {
            content2 = jsonMatch2[0];
          }
          
          healthData = JSON.parse(content2);
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
    if (!healthData) {
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
      recommendations: healthData.recommendations,
      meta: {
        provider: usedProvider,
        timestamp: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('❌ Health score generation error:', error);
    
    res.status(500).json({ 
      success: false, 
      error: 'Failed to generate health score', 
      details: error.message 
    });
  }
}
