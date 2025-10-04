// Multi-AI Service for UrCare Health Platform
// Integrates OpenAI, Gemini, and Groq for parallel processing and enhanced responses

interface AIResponse {
  success: boolean;
  data?: any;
  error?: string;
  provider: string;
  processingTime: number;
}

interface HealthScoreRequest {
  userProfile: any;
  userInput: string;
  uploadedFiles: string[];
  voiceTranscript: string;
}

interface HealthPlansRequest {
  userProfile: any;
  healthScore: number;
  analysis: string;
  recommendations: string[];
  userInput: string;
}

interface ActivityDetailsRequest {
  activityTitle: string;
  activityCategory: string;
  userProfile: any;
}

interface HealthRecommendationsRequest {
  userProfile: any;
  healthScore: number;
  analysis: string;
  selectedPlan: any;
}

interface MultiAIResponse {
  success: boolean;
  data?: any;
  error?: string;
  responses: AIResponse[];
  processingTime: number;
  consensusScore?: number;
}

class MultiAIService {
  private openaiApiKey: string;
  private geminiApiKey: string;
  private groqApiKey: string;

  constructor() {
    this.openaiApiKey = import.meta.env.VITE_OPENAI_API_KEY || '';
    this.geminiApiKey = import.meta.env.VITE_GEMINI_API_KEY || '';
    this.groqApiKey = import.meta.env.VITE_GROQ_API_KEY || '';
  }

  // OpenAI API call
  private async callOpenAI(systemPrompt: string, userPrompt: string): Promise<AIResponse> {
    const startTime = Date.now();
    
    if (!this.openaiApiKey) {
      return {
        success: false,
        error: 'OpenAI API key not configured',
        provider: 'OpenAI',
        processingTime: Date.now() - startTime
      };
    }

    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.openaiApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userPrompt }
          ],
          temperature: 0.7,
          max_tokens: 2000
        })
      });

      if (!response.ok) {
        throw new Error(`OpenAI API error: ${response.status}`);
      }

      const data = await response.json();
      const content = data.choices[0].message.content;
      
      return {
        success: true,
        data: this.parseJSONResponse(content),
        provider: 'OpenAI',
        processingTime: Date.now() - startTime
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'OpenAI API error',
        provider: 'OpenAI',
        processingTime: Date.now() - startTime
      };
    }
  }

  // Gemini API call
  private async callGemini(systemPrompt: string, userPrompt: string): Promise<AIResponse> {
    const startTime = Date.now();
    
    if (!this.geminiApiKey) {
      return {
        success: false,
        error: 'Gemini API key not configured',
        provider: 'Gemini',
        processingTime: Date.now() - startTime
      };
    }

    try {
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${this.geminiApiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: `${systemPrompt}\n\n${userPrompt}`
            }]
          }],
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 2000
          }
        })
      });

      if (!response.ok) {
        throw new Error(`Gemini API error: ${response.status}`);
      }

      const data = await response.json();
      const content = data.candidates[0].content.parts[0].text;
      
      return {
        success: true,
        data: this.parseJSONResponse(content),
        provider: 'Gemini',
        processingTime: Date.now() - startTime
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Gemini API error',
        provider: 'Gemini',
        processingTime: Date.now() - startTime
      };
    }
  }

  // Groq API call
  private async callGroq(systemPrompt: string, userPrompt: string): Promise<AIResponse> {
    const startTime = Date.now();
    
    if (!this.groqApiKey) {
      return {
        success: false,
        error: 'Groq API key not configured',
        provider: 'Groq',
        processingTime: Date.now() - startTime
      };
    }

    try {
      const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.groqApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'llama3-8b-8192',
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userPrompt }
          ],
          temperature: 0.7,
          max_tokens: 2000
        })
      });

      if (!response.ok) {
        throw new Error(`Groq API error: ${response.status}`);
      }

      const data = await response.json();
      const content = data.choices[0].message.content;
      
      return {
        success: true,
        data: this.parseJSONResponse(content),
        provider: 'Groq',
        processingTime: Date.now() - startTime
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Groq API error',
        provider: 'Groq',
        processingTime: Date.now() - startTime
      };
    }
  }

  // Parse JSON response with fallback
  private parseJSONResponse(content: string): any {
    try {
      return JSON.parse(content);
    } catch {
      return { content };
    }
  }

  // Calculate consensus score from multiple AI responses
  private calculateConsensusScore(responses: AIResponse[]): number {
    const validScores = responses
      .filter(r => r.success && r.data && typeof r.data.healthScore === 'number')
      .map(r => r.data.healthScore);
    
    if (validScores.length === 0) return 0;
    
    const sum = validScores.reduce((a, b) => a + b, 0);
    return Math.round(sum / validScores.length);
  }

  // Aggregate responses from multiple AI models
  private aggregateResponses(responses: AIResponse[], type: string): any {
    const validResponses = responses.filter(r => r.success && r.data);
    
    if (validResponses.length === 0) {
      return null;
    }

    if (type === 'healthScore') {
      const consensusScore = this.calculateConsensusScore(responses);
      const allRecommendations = validResponses
        .flatMap(r => r.data.recommendations || [])
        .filter((rec, index, arr) => arr.indexOf(rec) === index); // Remove duplicates
      
      const allStrengths = validResponses
        .flatMap(r => r.data.strengths || [])
        .filter((str, index, arr) => arr.indexOf(str) === index);
      
      const allImprovements = validResponses
        .flatMap(r => r.data.improvements || [])
        .filter((imp, index, arr) => arr.indexOf(imp) === index);

      // Combine analyses
      const analyses = validResponses
        .map(r => r.data.analysis || '')
        .filter(a => a.trim().length > 0);
      
      const combinedAnalysis = analyses.length > 0 
        ? analyses.join(' ') 
        : 'Based on your health profile, here are our recommendations.';

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
      const bestResponse = validResponses.reduce((best, current) => 
        (current.data.plans?.length || 0) > (best.data.plans?.length || 0) ? current : best
      );
      
      return bestResponse.data;
    }

    if (type === 'activityDetails') {
      // For activity details, combine the best information from all responses
      const combined = validResponses.reduce((acc, response) => {
        const data = response.data;
        if (!acc) return data;
        
        return {
          ...acc,
          ...data,
          instructions: data.instructions || acc.instructions,
          technique: data.technique || acc.technique,
          benefits: [...(acc.benefits || []), ...(data.benefits || [])].filter((b, i, arr) => arr.indexOf(b) === i),
          modifications: { ...acc.modifications, ...data.modifications }
        };
      }, null);
      
      return combined;
    }

    if (type === 'healthRecommendations') {
      // Combine recommendations from all AI models
      const allImmediate = validResponses
        .flatMap(r => r.data.immediate || [])
        .filter((rec, index, arr) => arr.indexOf(rec) === index);
      
      const allThisWeek = validResponses
        .flatMap(r => r.data.thisWeek || [])
        .filter((rec, index, arr) => arr.indexOf(rec) === index);
      
      const allThisMonth = validResponses
        .flatMap(r => r.data.thisMonth || [])
        .filter((rec, index, arr) => arr.indexOf(rec) === index);

      return {
        immediate: allImmediate.slice(0, 3),
        thisWeek: allThisWeek.slice(0, 3),
        thisMonth: allThisMonth.slice(0, 3),
        longTerm: validResponses[0]?.data.longTerm || 'Focus on consistent health improvements',
        planTips: validResponses.flatMap(r => r.data.planTips || []).slice(0, 3),
        warningSigns: validResponses.flatMap(r => r.data.warningSigns || []).slice(0, 3),
        professionalHelp: validResponses[0]?.data.professionalHelp || 'Consult healthcare providers when needed'
      };
    }

    return validResponses[0]?.data || null;
  }

  // Health Score Calculation with Multi-AI
  async calculateHealthScore(request: HealthScoreRequest): Promise<MultiAIResponse> {
    const startTime = Date.now();
    
    // Create specialized prompts for each AI model
    const openaiPrompt = this.createHealthScorePrompt(request, 'openai');
    const geminiPrompt = this.createHealthScorePrompt(request, 'gemini');
    const groqPrompt = this.createHealthScorePrompt(request, 'groq');

    // Execute all AI calls in parallel
    const [openaiResponse, geminiResponse, groqResponse] = await Promise.allSettled([
      this.callOpenAI(openaiPrompt.system, openaiPrompt.user),
      this.callGemini(geminiPrompt.system, geminiPrompt.user),
      this.callGroq(groqPrompt.system, groqPrompt.user)
    ]);

    const responses: AIResponse[] = [
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

    const aggregatedData = this.aggregateResponses(responses, 'healthScore');
    const consensusScore = this.calculateConsensusScore(responses);

    return {
      success: aggregatedData !== null,
      data: aggregatedData,
      error: aggregatedData === null ? 'All AI services failed' : undefined,
      responses,
      processingTime: Date.now() - startTime,
      consensusScore
    };
  }

  // Health Plans Generation with Multi-AI
  async generateHealthPlans(request: HealthPlansRequest): Promise<MultiAIResponse> {
    const startTime = Date.now();
    
    const openaiPrompt = this.createHealthPlansPrompt(request, 'openai');
    const geminiPrompt = this.createHealthPlansPrompt(request, 'gemini');
    const groqPrompt = this.createHealthPlansPrompt(request, 'groq');

    const [openaiResponse, geminiResponse, groqResponse] = await Promise.allSettled([
      this.callOpenAI(openaiPrompt.system, openaiPrompt.user),
      this.callGemini(geminiPrompt.system, geminiPrompt.user),
      this.callGroq(groqPrompt.system, groqPrompt.user)
    ]);

    const responses: AIResponse[] = [
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

    const aggregatedData = this.aggregateResponses(responses, 'healthPlans');

    return {
      success: aggregatedData !== null,
      data: aggregatedData,
      error: aggregatedData === null ? 'All AI services failed' : undefined,
      responses,
      processingTime: Date.now() - startTime
    };
  }

  // Activity Details with Multi-AI
  async getActivityDetails(request: ActivityDetailsRequest): Promise<MultiAIResponse> {
    const startTime = Date.now();
    
    const openaiPrompt = this.createActivityDetailsPrompt(request, 'openai');
    const geminiPrompt = this.createActivityDetailsPrompt(request, 'gemini');
    const groqPrompt = this.createActivityDetailsPrompt(request, 'groq');

    const [openaiResponse, geminiResponse, groqResponse] = await Promise.allSettled([
      this.callOpenAI(openaiPrompt.system, openaiPrompt.user),
      this.callGemini(geminiPrompt.system, geminiPrompt.user),
      this.callGroq(groqPrompt.system, groqPrompt.user)
    ]);

    const responses: AIResponse[] = [
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

    const aggregatedData = this.aggregateResponses(responses, 'activityDetails');

    return {
      success: aggregatedData !== null,
      data: aggregatedData,
      error: aggregatedData === null ? 'All AI services failed' : undefined,
      responses,
      processingTime: Date.now() - startTime
    };
  }

  // Health Recommendations with Multi-AI
  async getHealthRecommendations(request: HealthRecommendationsRequest): Promise<MultiAIResponse> {
    const startTime = Date.now();
    
    const openaiPrompt = this.createHealthRecommendationsPrompt(request, 'openai');
    const geminiPrompt = this.createHealthRecommendationsPrompt(request, 'gemini');
    const groqPrompt = this.createHealthRecommendationsPrompt(request, 'groq');

    const [openaiResponse, geminiResponse, groqResponse] = await Promise.allSettled([
      this.callOpenAI(openaiPrompt.system, openaiPrompt.user),
      this.callGemini(geminiPrompt.system, geminiPrompt.user),
      this.callGroq(groqPrompt.system, groqPrompt.user)
    ]);

    const responses: AIResponse[] = [
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

    const aggregatedData = this.aggregateResponses(responses, 'healthRecommendations');

    return {
      success: aggregatedData !== null,
      data: aggregatedData,
      error: aggregatedData === null ? 'All AI services failed' : undefined,
      responses,
      processingTime: Date.now() - startTime
    };
  }

  // Create specialized prompts for each AI model
  private createHealthScorePrompt(request: HealthScoreRequest, provider: string) {
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
- Name: ${request.userProfile.full_name || 'Not provided'}
- Age: ${request.userProfile.age || 'Not provided'}
- Gender: ${request.userProfile.gender || 'Not provided'}
- Height: ${request.userProfile.height_cm || 'Not provided'} cm
- Weight: ${request.userProfile.weight_kg || 'Not provided'} kg
- Blood Group: ${request.userProfile.blood_group || 'Not provided'}
- Chronic Conditions: ${request.userProfile.chronic_conditions?.join(', ') || 'None'}
- Medications: ${request.userProfile.medications?.join(', ') || 'None'}
- Health Goals: ${request.userProfile.health_goals?.join(', ') || 'Not specified'}
- Diet Type: ${request.userProfile.diet_type || 'Not specified'}
- Workout Time: ${request.userProfile.workout_time || 'Not specified'}
- Sleep Time: ${request.userProfile.sleep_time || 'Not specified'}
- Wake Up Time: ${request.userProfile.wake_up_time || 'Not provided'}

USER INPUT: ${request.userInput || 'No specific input provided'}
UPLOADED FILES: ${request.uploadedFiles.length > 0 ? request.uploadedFiles.join('\n') : 'No files uploaded'}
VOICE TRANSCRIPT: ${request.voiceTranscript || 'No voice input provided'}`;

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

  private createHealthPlansPrompt(request: HealthPlansRequest, provider: string) {
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
- Name: ${request.userProfile.full_name || 'User'}
- Age: ${request.userProfile.age || 'Not specified'}
- Health Score: ${request.healthScore}/100
- Health Goals: ${request.userProfile.health_goals?.join(', ') || 'General wellness'}
- Diet Type: ${request.userProfile.diet_type || 'Balanced'}
- Workout Time Preference: ${request.userProfile.workout_time || 'Morning'}
- Sleep Schedule: ${request.userProfile.sleep_time || '22:00'} - ${request.userProfile.wake_up_time || '06:00'}

HEALTH ANALYSIS: ${request.analysis}
RECOMMENDATIONS: ${request.recommendations.join(', ')}
USER INPUT: ${request.userInput || 'No specific input provided'}`;

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

  private createActivityDetailsPrompt(request: ActivityDetailsRequest, provider: string) {
    const baseSystem = `You are an expert health and wellness AI assistant for UrCare. Your role is to provide detailed information about specific health activities, including what to do, how to do it, and dietary recommendations when relevant.

Key Guidelines:
- Provide step-by-step instructions
- Include safety considerations
- Suggest modifications for different fitness levels
- Include dietary recommendations when relevant
- Be specific about timing, intensity, and duration
- Provide alternatives for different preferences`;

    const baseUser = `
Provide detailed information about this health activity for the user.

ACTIVITY: ${request.activityTitle}
CATEGORY: ${request.activityCategory}

USER PROFILE:
- Name: ${request.userProfile.full_name || 'User'}
- Age: ${request.userProfile.age || 'Not specified'}
- Fitness Level: ${request.userProfile.workout_time ? 'Active' : 'Beginner'}
- Diet Type: ${request.userProfile.diet_type || 'Balanced'}
- Health Goals: ${request.userProfile.health_goals?.join(', ') || 'General wellness'}`;

    if (provider === 'openai') {
      return {
        system: baseSystem + '\n\nFocus on scientific accuracy and safety protocols.',
        user: baseUser + '\n\nProvide detailed instructions, technique, duration, intensity, modifications, dietary recommendations, equipment, common mistakes, and benefits. Format as JSON.'
      };
    }

    if (provider === 'gemini') {
      return {
        system: baseSystem + '\n\nFocus on holistic approach and wellness integration.',
        user: baseUser + '\n\nProvide detailed instructions, technique, duration, intensity, modifications, dietary recommendations, equipment, common mistakes, and benefits. Format as JSON.'
      };
    }

    if (provider === 'groq') {
      return {
        system: baseSystem + '\n\nFocus on practical implementation and user motivation.',
        user: baseUser + '\n\nProvide detailed instructions, technique, duration, intensity, modifications, dietary recommendations, equipment, common mistakes, and benefits. Format as JSON.'
      };
    }

    return { system: baseSystem, user: baseUser };
  }

  private createHealthRecommendationsPrompt(request: HealthRecommendationsRequest, provider: string) {
    const baseSystem = `You are an expert health and wellness AI assistant for UrCare. Your role is to provide personalized health recommendations based on user data and health analysis.

Key Guidelines:
- Provide specific, actionable recommendations
- Consider the user's current health status and goals
- Include both immediate and long-term suggestions
- Address different aspects of health (physical, mental, nutritional)
- Be encouraging and supportive
- Provide realistic timelines for improvements`;

    const baseUser = `
Provide personalized health recommendations for this user based on their current status and selected plan.

USER PROFILE:
- Name: ${request.userProfile.full_name || 'User'}
- Age: ${request.userProfile.age || 'Not specified'}
- Health Score: ${request.healthScore}/100
- Health Goals: ${request.userProfile.health_goals?.join(', ') || 'General wellness'}
- Current Plan: ${request.selectedPlan?.title || 'No plan selected'}

HEALTH ANALYSIS: ${request.analysis}`;

    if (provider === 'openai') {
      return {
        system: baseSystem + '\n\nFocus on evidence-based recommendations and clinical considerations.',
        user: baseUser + '\n\nProvide immediate actions, this week\'s focus, this month\'s goals, long-term vision, plan tips, warning signs, and when to seek professional help. Format as JSON.'
      };
    }

    if (provider === 'gemini') {
      return {
        system: baseSystem + '\n\nFocus on holistic wellness and sustainable lifestyle changes.',
        user: baseUser + '\n\nProvide immediate actions, this week\'s focus, this month\'s goals, long-term vision, plan tips, warning signs, and when to seek professional help. Format as JSON.'
      };
    }

    if (provider === 'groq') {
      return {
        system: baseSystem + '\n\nFocus on practical implementation and user motivation.',
        user: baseUser + '\n\nProvide immediate actions, this week\'s focus, this month\'s goals, long-term vision, plan tips, warning signs, and when to seek professional help. Format as JSON.'
      };
    }

    return { system: baseSystem, user: baseUser };
  }
}

// Export singleton instance
export const multiAIService = new MultiAIService();
export default multiAIService;
