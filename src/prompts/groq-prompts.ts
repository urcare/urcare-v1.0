// Groq AI Prompts for UrCare Health Platform
// Organized prompts for health score calculation, plan generation, and activity details

export const GROQ_PROMPTS = {
  // Health Score Calculation Prompt
  healthScore: {
    system: `You are an expert health and wellness AI assistant for UrCare. Your role is to calculate a comprehensive health score (0-100) based on user data and provide detailed analysis and recommendations.

Key Guidelines:
- Health score should be 0-100 (0 = poor health, 100 = excellent health)
- Consider all provided data: user profile, health goals, lifestyle factors, medical conditions
- Provide specific, actionable recommendations
- Be encouraging but honest about health status
- Consider age, BMI, sleep patterns, exercise habits, diet, stress levels
- Factor in chronic conditions and medications appropriately`,

    user: (userProfile: any, userInput: string, uploadedFiles: string[], voiceTranscript: string) => `
Calculate a comprehensive health score for this user and provide detailed analysis.

USER PROFILE:
- Name: ${userProfile.full_name || 'Not provided'}
- Age: ${userProfile.age || 'Not provided'}
- Gender: ${userProfile.gender || 'Not provided'}
- Height: ${userProfile.height_cm || 'Not provided'} cm
- Weight: ${userProfile.weight_kg || 'Not provided'} kg
- Blood Group: ${userProfile.blood_group || 'Not provided'}
- Chronic Conditions: ${userProfile.chronic_conditions?.join(', ') || 'None'}
- Medications: ${userProfile.medications?.join(', ') || 'None'}
- Health Goals: ${userProfile.health_goals?.join(', ') || 'Not specified'}
- Diet Type: ${userProfile.diet_type || 'Not specified'}
- Workout Time: ${userProfile.workout_time || 'Not specified'}
- Sleep Time: ${userProfile.sleep_time || 'Not specified'}
- Wake Up Time: ${userProfile.wake_up_time || 'Not provided'}

USER INPUT: ${userInput || 'No specific input provided'}

UPLOADED FILES: ${uploadedFiles.length > 0 ? uploadedFiles.join('\n') : 'No files uploaded'}

VOICE TRANSCRIPT: ${voiceTranscript || 'No voice input provided'}

Please provide:
1. Health Score (0-100)
2. Detailed Analysis (2-3 paragraphs explaining the score)
3. Top 5 Recommendations (specific, actionable advice)
4. Areas of Strength (what they're doing well)
5. Priority Areas for Improvement (what needs most attention)

Format your response as JSON:
{
  "healthScore": number,
  "analysis": "detailed analysis text",
  "recommendations": ["recommendation1", "recommendation2", "recommendation3", "recommendation4", "recommendation5"],
  "strengths": ["strength1", "strength2", "strength3"],
  "improvements": ["improvement1", "improvement2", "improvement3"]
}`
  },

  // Health Plans Generation Prompt
  healthPlans: {
    system: `You are an expert health and wellness AI assistant for UrCare. Your role is to generate 3 personalized health plans based on user data, health score, and analysis.

Key Guidelines:
- Create 3 distinct plans: Beginner, Intermediate, and Advanced
- Each plan should be comprehensive with specific activities and timestamps
- Include wake-up routines, hydration, exercise, meals, work sessions, and sleep
- Make plans realistic and achievable
- Consider the user's health score and current lifestyle
- Provide specific times and durations for each activity
- Include dietary recommendations where relevant`,

    user: (userProfile: any, healthScore: number, analysis: string, recommendations: string[], userInput: string) => `
Generate 3 personalized health plans for this user based on their profile and health analysis.

USER PROFILE:
- Name: ${userProfile.full_name || 'User'}
- Age: ${userProfile.age || 'Not specified'}
- Health Score: ${healthScore}/100
- Health Goals: ${userProfile.health_goals?.join(', ') || 'General wellness'}
- Diet Type: ${userProfile.diet_type || 'Balanced'}
- Workout Time Preference: ${userProfile.workout_time || 'Morning'}
- Sleep Schedule: ${userProfile.sleep_time || '22:00'} - ${userProfile.wake_up_time || '06:00'}

HEALTH ANALYSIS: ${analysis}

RECOMMENDATIONS: ${recommendations.join(', ')}

USER INPUT: ${userInput || 'No specific input provided'}

Create 3 plans:
1. BEGINNER PLAN - For users starting their health journey
2. INTERMEDIATE PLAN - For users with some health habits established
3. ADVANCED PLAN - For users ready for intensive health optimization

Each plan should include:
- Wake Up Routine (with specific time and activities)
- Hydration Schedule (when and how much water)
- Exercise/Workout (type, duration, intensity)
- Meal Times (what to eat and when)
- Work/Focus Sessions (productivity blocks)
- Break Activities (relaxation, stretching)
- Evening Wind-down (preparation for sleep)
- Sleep Schedule (bedtime routine)

Format as JSON:
{
  "plans": [
    {
      "id": "beginner",
      "title": "Beginner Wellness Plan",
      "description": "A gentle introduction to healthy living",
      "difficulty": "Beginner",
      "duration": "4 weeks",
      "activities": [
        {
          "time": "06:30",
          "title": "Wake Up & Hydrate",
          "description": "Drink 500ml water, gentle stretching",
          "duration": "15 minutes",
          "category": "Wake up"
        },
        {
          "time": "07:00",
          "title": "Morning Walk",
          "description": "15-minute brisk walk around the neighborhood",
          "duration": "15 minutes",
          "category": "Exercise"
        },
        {
          "time": "07:30",
          "title": "Healthy Breakfast",
          "description": "Oatmeal with fruits and nuts",
          "duration": "20 minutes",
          "category": "Meals"
        }
      ]
    },
    {
      "id": "intermediate",
      "title": "Intermediate Fitness Plan",
      "description": "Balanced approach to health and fitness",
      "difficulty": "Intermediate",
      "duration": "6 weeks",
      "activities": [
        {
          "time": "06:00",
          "title": "Morning Routine",
          "description": "Hydrate, meditation, light stretching",
          "duration": "20 minutes",
          "category": "Wake up"
        },
        {
          "time": "06:30",
          "title": "Workout Session",
          "description": "30-minute cardio and strength training",
          "duration": "30 minutes",
          "category": "Exercise"
        },
        {
          "time": "07:15",
          "title": "Protein Breakfast",
          "description": "Scrambled eggs with vegetables and whole grain toast",
          "duration": "25 minutes",
          "category": "Meals"
        }
      ]
    },
    {
      "id": "advanced",
      "title": "Advanced Health Optimization",
      "description": "Comprehensive health and performance optimization",
      "difficulty": "Advanced",
      "duration": "8 weeks",
      "activities": [
        {
          "time": "05:30",
          "title": "Early Morning Routine",
          "description": "Cold shower, hydration, meditation, dynamic stretching",
          "duration": "30 minutes",
          "category": "Wake up"
        },
        {
          "time": "06:00",
          "title": "Intensive Workout",
          "description": "45-minute HIIT or strength training session",
          "duration": "45 minutes",
          "category": "Exercise"
        },
        {
          "time": "07:00",
          "title": "Post-Workout Nutrition",
          "description": "Protein smoothie with greens and supplements",
          "duration": "15 minutes",
          "category": "Meals"
        }
      ]
    }
  ]
}`
  },

  // Activity Details Prompt
  activityDetails: {
    system: `You are an expert health and wellness AI assistant for UrCare. Your role is to provide detailed information about specific health activities, including what to do, how to do it, and dietary recommendations when relevant.

Key Guidelines:
- Provide step-by-step instructions
- Include safety considerations
- Suggest modifications for different fitness levels
- Include dietary recommendations when relevant
- Be specific about timing, intensity, and duration
- Provide alternatives for different preferences`,

    user: (activityTitle: string, activityCategory: string, userProfile: any) => `
Provide detailed information about this health activity for the user.

ACTIVITY: ${activityTitle}
CATEGORY: ${activityCategory}

USER PROFILE:
- Name: ${userProfile.full_name || 'User'}
- Age: ${userProfile.age || 'Not specified'}
- Fitness Level: ${userProfile.workout_time ? 'Active' : 'Beginner'}
- Diet Type: ${userProfile.diet_type || 'Balanced'}
- Health Goals: ${userProfile.health_goals?.join(', ') || 'General wellness'}

Please provide:
1. What to do (detailed step-by-step instructions)
2. How to do it (proper form, technique, safety tips)
3. Duration and intensity recommendations
4. Modifications for different fitness levels
5. Dietary recommendations (if relevant to the activity)
6. Equipment needed (if any)
7. Common mistakes to avoid
8. Expected benefits

Format as JSON:
{
  "title": "activity title",
  "category": "activity category",
  "instructions": "detailed step-by-step instructions",
  "technique": "proper form and technique guidance",
  "duration": "recommended duration",
  "intensity": "intensity level and how to measure it",
  "modifications": {
    "beginner": "easier version for beginners",
    "intermediate": "moderate version",
    "advanced": "challenging version"
  },
  "dietary": "dietary recommendations if relevant",
  "equipment": ["equipment1", "equipment2"],
  "mistakes": ["common mistake 1", "common mistake 2"],
  "benefits": ["benefit 1", "benefit 2", "benefit 3"]
}`
  },

  // Health Recommendations Prompt
  healthRecommendations: {
    system: `You are an expert health and wellness AI assistant for UrCare. Your role is to provide personalized health recommendations based on user data and health analysis.

Key Guidelines:
- Provide specific, actionable recommendations
- Consider the user's current health status and goals
- Include both immediate and long-term suggestions
- Address different aspects of health (physical, mental, nutritional)
- Be encouraging and supportive
- Provide realistic timelines for improvements`,

    user: (userProfile: any, healthScore: number, analysis: string, selectedPlan: any) => `
Provide personalized health recommendations for this user based on their current status and selected plan.

USER PROFILE:
- Name: ${userProfile.full_name || 'User'}
- Age: ${userProfile.age || 'Not specified'}
- Health Score: ${healthScore}/100
- Health Goals: ${userProfile.health_goals?.join(', ') || 'General wellness'}
- Current Plan: ${selectedPlan?.title || 'No plan selected'}

HEALTH ANALYSIS: ${analysis}

Please provide:
1. Immediate Actions (what they can do today)
2. This Week's Focus (priorities for the next 7 days)
3. This Month's Goals (what to achieve in 30 days)
4. Long-term Vision (6-month health transformation)
5. Specific Tips for Their Plan
6. Warning Signs to Watch For
7. When to Seek Professional Help

Format as JSON:
{
  "immediate": ["action 1", "action 2", "action 3"],
  "thisWeek": ["focus 1", "focus 2", "focus 3"],
  "thisMonth": ["goal 1", "goal 2", "goal 3"],
  "longTerm": "6-month health transformation vision",
  "planTips": ["tip 1", "tip 2", "tip 3"],
  "warningSigns": ["sign 1", "sign 2", "sign 3"],
  "professionalHelp": "when to seek professional medical advice"
}`
  }
};

// Helper function to get the appropriate prompt
export const getGroqPrompt = (type: keyof typeof GROQ_PROMPTS, ...args: any[]) => {
  const prompt = GROQ_PROMPTS[type];
  if (typeof prompt.user === 'function') {
    return prompt.user(...args);
  }
  return prompt.user;
};

// Helper function to get system prompt
export const getGroqSystemPrompt = (type: keyof typeof GROQ_PROMPTS) => {
  return GROQ_PROMPTS[type].system;
};
