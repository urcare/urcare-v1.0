// Groq AI Prompts for UrCare Health Platform
// Organized prompts for health score calculation, plan generation, and activity details

export const GROQ_PROMPTS = {
  // Enhanced Health Score Calculation Prompt
  healthScore: {
    system: `You are an expert health and wellness AI assistant for UrCare. Your role is to calculate a comprehensive health score (0-100) based on user data and provide detailed analysis and recommendations.

Key Guidelines:
- Health score should be 0-100 (0 = poor health, 100 = excellent health)
- Consider all provided data: user profile, health goals, lifestyle factors, medical conditions
- Provide specific, actionable recommendations
- Be encouraging but honest about health status
- Consider age, BMI, sleep patterns, exercise habits, diet, stress levels
- Factor in chronic conditions and medications appropriately
- Use evidence-based health metrics and guidelines
- Consider mental health, social factors, and environmental influences
- Provide risk assessments for potential health issues
- Include specific health metrics breakdown for different aspects`,

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
- Stress Level: ${userProfile.stress_level || 'Not specified'}
- Water Intake: ${userProfile.water_intake || 'Not specified'}
- Smoking Status: ${userProfile.smoking_status || 'Not specified'}
- Alcohol Consumption: ${userProfile.alcohol_consumption || 'Not specified'}

USER INPUT: ${userInput || 'No specific input provided'}

UPLOADED FILES: ${uploadedFiles.length > 0 ? uploadedFiles.join('\n') : 'No files uploaded'}

VOICE TRANSCRIPT: ${voiceTranscript || 'No voice input provided'}

Please provide:
1. Health Score (0-100)
2. Detailed Analysis (2-3 paragraphs explaining the score)
3. Top 5 Recommendations (specific, actionable advice)
4. Areas of Strength (what they're doing well)
5. Priority Areas for Improvement (what needs most attention)
6. Risk Factors (potential health concerns)
7. Health Metrics Breakdown (scores for different health aspects)
8. Next Steps (immediate actions to take)

Format your response as JSON:
{
  "healthScore": number,
  "analysis": "detailed analysis text",
  "recommendations": ["recommendation1", "recommendation2", "recommendation3", "recommendation4", "recommendation5"],
  "strengths": ["strength1", "strength2", "strength3"],
  "improvements": ["improvement1", "improvement2", "improvement3"],
  "riskFactors": ["risk1", "risk2", "risk3"],
  "healthMetrics": {
    "physical": number,
    "mental": number,
    "nutritional": number,
    "lifestyle": number,
    "preventive": number
  },
  "nextSteps": ["step1", "step2", "step3"]
}`
  },

  // Enhanced Health Plans Generation Prompt
  healthPlans: {
    system: `You are an expert health and wellness AI assistant for UrCare. Your role is to generate 3 highly detailed, personalized health plans based on user data, health score, and analysis.

Key Guidelines:
- Create 3 distinct plans with personalized names based on user goals (e.g., "Ultimate Weight Gainer", "Diabetes Reversal Protocol", "Muscle Building Mastery")
- Each plan should be comprehensive with minute-by-minute daily schedules
- Include detailed protocols for each activity with specific instructions, timing, and reasoning
- Provide exact meal plans with nutritional breakdowns and preparation instructions
- Include specific supplement recommendations and timing
- Add detailed exercise protocols with form cues and progressions
- Include stress management, sleep optimization, and recovery protocols
- Provide tracking metrics and milestone markers
- Consider user's specific health conditions, goals, and lifestyle constraints
- Make plans evidence-based and scientifically sound
- Include motivational elements and success strategies`,

    user: (userProfile: any, healthScore: number, analysis: string, recommendations: string[], userInput: string) => `
Generate 3 highly detailed, personalized health plans for this user based on their profile and health analysis.

USER PROFILE:
- Name: ${userProfile.full_name || 'User'}
- Age: ${userProfile.age || 'Not specified'}
- Gender: ${userProfile.gender || 'Not specified'}
- Height: ${userProfile.height_cm || 'Not specified'} cm
- Weight: ${userProfile.weight_kg || 'Not specified'} kg
- Health Score: ${healthScore}/100
- Health Goals: ${userProfile.health_goals?.join(', ') || 'General wellness'}
- Diet Type: ${userProfile.diet_type || 'Balanced'}
- Workout Time Preference: ${userProfile.workout_time || 'Morning'}
- Sleep Schedule: ${userProfile.sleep_time || '22:00'} - ${userProfile.wake_up_time || '06:00'}
- Stress Level: ${userProfile.stress_level || 'Moderate'}
- Chronic Conditions: ${userProfile.chronic_conditions?.join(', ') || 'None'}
- Medications: ${userProfile.medications?.join(', ') || 'None'}
- Blood Group: ${userProfile.blood_group || 'Not specified'}

HEALTH ANALYSIS: ${analysis}

RECOMMENDATIONS: ${recommendations.join(', ')}

USER INPUT: ${userInput || 'No specific input provided'}

Create 3 highly detailed plans with personalized names based on the user's specific goals:

1. FOUNDATION PLAN - For users starting their health journey (4-6 weeks)
2. TRANSFORMATION PLAN - For users ready for significant changes (8-12 weeks)  
3. MASTERY PLAN - For users seeking peak optimization (12-16 weeks)

Each plan must include:

**PLAN STRUCTURE:**
- Personalized plan name based on user goals
- Detailed description and transformation vision
- Specific duration and target outcomes
- Weekly progression milestones
- Daily minute-by-minute schedule (5:00 AM - 10:00 PM)
- Detailed activity protocols with exact instructions
- Complete meal plans with recipes and nutritional breakdowns
- Supplement protocols with timing and dosages
- Exercise programs with form cues and progressions
- Sleep optimization protocols
- Stress management techniques
- Progress tracking metrics
- Success strategies and motivation tips

**DAILY SCHEDULE FORMAT:**
Each day should follow this detailed structure:
- **5:00 AM - Morning Activation Protocol** (specific wake-up routine)
- **5:30 AM - Metabolic Boost Sequence** (hydration, supplements, movement)
- **6:00 AM - Exercise Protocol** (detailed workout with form cues)
- **7:00 AM - Strategic Breakfast** (complete meal with recipes)
- **8:00 AM - Work/Productivity Block** (with movement breaks)
- **10:00 AM - Mid-Morning Optimization** (snack, supplements, movement)
- **12:00 PM - Strategic Lunch** (complete meal with preparation)
- **1:00 PM - Afternoon Focus Block** (work with movement breaks)
- **3:00 PM - Afternoon Recharge** (snack, supplements, light activity)
- **4:00 PM - Secondary Exercise** (complementary workout)
- **5:00 PM - Evening Preparation** (meal prep, planning)
- **6:00 PM - Strategic Dinner** (complete meal with recipes)
- **7:00 PM - Evening Optimization** (supplements, relaxation)
- **8:00 PM - Wind-Down Protocol** (preparation for sleep)
- **9:00 PM - Sleep Induction** (bedtime routine)

**MEAL PLANS MUST INCLUDE:**
- Exact ingredients and quantities
- Step-by-step preparation instructions
- Nutritional breakdown (calories, protein, carbs, fat, fiber)
- Timing and eating sequence
- Supplement timing with meals
- Hydration protocols

**EXERCISE PROTOCOLS MUST INCLUDE:**
- Detailed exercise descriptions with form cues
- Specific sets, reps, and rest periods
- Equipment needed and alternatives
- Progression guidelines
- Safety considerations
- Modifications for different fitness levels

**SUPPLEMENT PROTOCOLS MUST INCLUDE:**
- Specific supplements with dosages
- Timing with meals and activities
- Interactions and contraindications
- Expected benefits and timeline
- Quality recommendations

Format as JSON:
{
  "plans": [
    {
      "id": "foundation",
      "title": "Personalized Foundation Plan Name Based on Goals",
      "description": "Detailed description of what this plan will achieve",
      "difficulty": "Foundation",
      "duration": "4-6 weeks",
      "targetHealthScore": 75,
      "primaryGoals": ["goal1", "goal2", "goal3"],
      "expectedOutcomes": ["outcome1", "outcome2", "outcome3"],
      "weeklyMilestones": [
        "Week 1: Establish routine and baseline",
        "Week 2: Increase intensity and consistency", 
        "Week 3: Optimize nutrition and recovery",
        "Week 4: Master protocols and prepare for next level"
      ],
      "dailySchedule": {
        "05:00": {
          "title": "Morning Activation Protocol",
          "duration": "30 minutes",
          "description": "Detailed wake-up routine with specific steps",
          "activities": [
            {
              "time": "05:00-05:05",
              "title": "Instant Wake Protocol",
              "description": "Specific wake-up steps with reasoning",
              "instructions": ["step1", "step2", "step3"],
              "supplements": ["supplement1", "supplement2"],
              "tracking": "What to measure and record"
            }
          ]
        },
        "05:30": {
          "title": "Metabolic Boost Sequence", 
          "duration": "30 minutes",
          "description": "Hydration and metabolic activation protocol",
          "activities": [
            {
              "time": "05:30-05:45",
              "title": "Hydration Protocol",
              "description": "Specific hydration routine with ingredients",
              "instructions": ["step1", "step2", "step3"],
              "ingredients": ["ingredient1", "ingredient2"],
              "benefits": "Why this helps achieve goals"
            }
          ]
        }
      },
      "mealPlans": {
        "breakfast": {
          "time": "07:00",
          "title": "Strategic Breakfast Name",
          "calories": 450,
          "protein": 35,
          "carbs": 25,
          "fat": 28,
          "fiber": 12,
          "ingredients": ["ingredient1", "ingredient2"],
          "preparation": ["step1", "step2", "step3"],
          "eatingSequence": ["eat1", "eat2", "eat3"],
          "supplements": ["supplement1", "supplement2"]
        }
      },
      "exerciseProtocols": {
        "morning": {
          "time": "06:00",
          "title": "Morning Exercise Protocol",
          "duration": "45 minutes",
          "type": "Cardio/Strength/Hybrid",
          "exercises": [
            {
              "name": "Exercise Name",
              "sets": 3,
              "reps": "12-15",
              "rest": "60 seconds",
              "form": "Detailed form cues",
              "equipment": ["equipment1", "equipment2"],
              "alternatives": ["alt1", "alt2"],
              "progression": "How to progress this exercise"
            }
          ]
        }
      },
      "supplementProtocol": {
        "morning": ["supplement1", "supplement2"],
        "preWorkout": ["supplement3"],
        "postWorkout": ["supplement4", "supplement5"],
        "evening": ["supplement6", "supplement7"],
        "bedtime": ["supplement8"]
      },
      "trackingMetrics": {
        "daily": ["metric1", "metric2", "metric3"],
        "weekly": ["metric4", "metric5"],
        "monthly": ["metric6", "metric7"]
      },
      "successStrategies": ["strategy1", "strategy2", "strategy3"]
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
  },

  // NEW: Mental Health Assessment Prompt
  mentalHealthAssessment: {
    system: `You are an expert mental health and wellness AI assistant for UrCare. Your role is to assess mental health status and provide supportive recommendations.

Key Guidelines:
- Focus on mental wellness and emotional health
- Provide supportive, non-judgmental guidance
- Encourage professional help when appropriate
- Include stress management and coping strategies
- Consider work-life balance and social factors
- Be sensitive to mental health conditions
- Provide evidence-based mental health practices`,

    user: (userProfile: any, stressLevel: string, mood: string, sleepQuality: string, socialSupport: string) => `
Assess the mental health and emotional wellness of this user.

USER PROFILE:
- Name: ${userProfile.full_name || 'User'}
- Age: ${userProfile.age || 'Not specified'}
- Stress Level: ${stressLevel || 'Not specified'}
- Current Mood: ${mood || 'Not specified'}
- Sleep Quality: ${sleepQuality || 'Not specified'}
- Social Support: ${socialSupport || 'Not specified'}
- Health Goals: ${userProfile.health_goals?.join(', ') || 'General wellness'}

Please provide:
1. Mental Health Score (0-100)
2. Stress Assessment
3. Mood Analysis
4. Coping Strategies
5. Stress Management Techniques
6. Social Wellness Tips
7. Professional Resources
8. Daily Mental Health Practices

Format as JSON:
{
  "mentalHealthScore": number,
  "stressAssessment": "detailed stress analysis",
  "moodAnalysis": "mood evaluation and insights",
  "copingStrategies": ["strategy 1", "strategy 2", "strategy 3"],
  "stressManagement": ["technique 1", "technique 2", "technique 3"],
  "socialWellness": ["tip 1", "tip 2", "tip 3"],
  "professionalResources": ["resource 1", "resource 2"],
  "dailyPractices": ["practice 1", "practice 2", "practice 3"]
}`
  },

  // NEW: Nutrition Analysis Prompt
  nutritionAnalysis: {
    system: `You are an expert nutritionist AI assistant for UrCare. Your role is to analyze dietary patterns and provide personalized nutrition recommendations.

Key Guidelines:
- Provide evidence-based nutrition advice
- Consider dietary restrictions and preferences
- Focus on whole foods and balanced nutrition
- Address specific health conditions and goals
- Include meal planning and preparation tips
- Consider cultural and lifestyle factors
- Provide practical shopping and cooking guidance`,

    user: (userProfile: any, currentDiet: string, dietaryRestrictions: string[], healthGoals: string[], mealPatterns: string) => `
Analyze the nutrition and dietary patterns of this user.

USER PROFILE:
- Name: ${userProfile.full_name || 'User'}
- Age: ${userProfile.age || 'Not specified'}
- Current Diet: ${currentDiet || 'Not specified'}
- Dietary Restrictions: ${dietaryRestrictions.join(', ') || 'None'}
- Health Goals: ${healthGoals.join(', ') || 'General wellness'}
- Meal Patterns: ${mealPatterns || 'Not specified'}
- Chronic Conditions: ${userProfile.chronic_conditions?.join(', ') || 'None'}

Please provide:
1. Nutrition Score (0-100)
2. Dietary Analysis
3. Nutrient Deficiencies/Gaps
4. Meal Planning Recommendations
5. Recipe Suggestions
6. Shopping List Tips
7. Hydration Guidelines
8. Supplement Recommendations (if needed)

Format as JSON:
{
  "nutritionScore": number,
  "dietaryAnalysis": "detailed nutrition analysis",
  "nutrientGaps": ["gap 1", "gap 2", "gap 3"],
  "mealPlanning": ["tip 1", "tip 2", "tip 3"],
  "recipeSuggestions": ["recipe 1", "recipe 2", "recipe 3"],
  "shoppingTips": ["tip 1", "tip 2", "tip 3"],
  "hydration": "hydration guidelines and tips",
  "supplements": ["supplement 1", "supplement 2"]
}`
  },

  // NEW: Sleep Optimization Prompt
  sleepOptimization: {
    system: `You are an expert sleep and circadian rhythm AI assistant for UrCare. Your role is to analyze sleep patterns and provide personalized sleep optimization recommendations.

Key Guidelines:
- Focus on sleep quality and circadian health
- Provide evidence-based sleep hygiene practices
- Consider individual sleep needs and chronotypes
- Address sleep disorders and disturbances
- Include environmental and behavioral factors
- Provide practical bedtime and wake-up routines`,

    user: (userProfile: any, sleepDuration: string, sleepQuality: string, bedtimeRoutine: string, sleepIssues: string[]) => `
Analyze the sleep patterns and provide optimization recommendations for this user.

USER PROFILE:
- Name: ${userProfile.full_name || 'User'}
- Age: ${userProfile.age || 'Not specified'}
- Sleep Duration: ${sleepDuration || 'Not specified'}
- Sleep Quality: ${sleepQuality || 'Not specified'}
- Bedtime Routine: ${bedtimeRoutine || 'Not specified'}
- Sleep Issues: ${sleepIssues.join(', ') || 'None'}
- Work Schedule: ${userProfile.workout_time || 'Not specified'}

Please provide:
1. Sleep Score (0-100)
2. Sleep Analysis
3. Circadian Rhythm Assessment
4. Sleep Hygiene Recommendations
5. Bedtime Routine Suggestions
6. Wake-up Routine Suggestions
7. Environmental Optimizations
8. Sleep Disorder Screening

Format as JSON:
{
  "sleepScore": number,
  "sleepAnalysis": "detailed sleep pattern analysis",
  "circadianAssessment": "circadian rhythm evaluation",
  "sleepHygiene": ["practice 1", "practice 2", "practice 3"],
  "bedtimeRoutine": ["step 1", "step 2", "step 3"],
  "wakeUpRoutine": ["step 1", "step 2", "step 3"],
  "environmental": ["optimization 1", "optimization 2", "optimization 3"],
  "disorderScreening": "potential sleep disorder indicators"
}`
  },

  // NEW: Fitness Assessment Prompt
  fitnessAssessment: {
    system: `You are an expert fitness and exercise physiology AI assistant for UrCare. Your role is to assess fitness levels and provide personalized exercise recommendations.

Key Guidelines:
- Assess cardiovascular, strength, and flexibility fitness
- Consider current fitness level and limitations
- Provide progressive exercise programming
- Include injury prevention strategies
- Address different fitness goals and preferences
- Consider equipment availability and space constraints`,

    user: (userProfile: any, currentFitnessLevel: string, exerciseHistory: string, fitnessGoals: string[], availableEquipment: string[], timeConstraints: string) => `
Assess the fitness level and provide exercise recommendations for this user.

USER PROFILE:
- Name: ${userProfile.full_name || 'User'}
- Age: ${userProfile.age || 'Not specified'}
- Current Fitness Level: ${currentFitnessLevel || 'Not specified'}
- Exercise History: ${exerciseHistory || 'Not specified'}
- Fitness Goals: ${fitnessGoals.join(', ') || 'General fitness'}
- Available Equipment: ${availableEquipment.join(', ') || 'None'}
- Time Constraints: ${timeConstraints || 'Not specified'}
- Chronic Conditions: ${userProfile.chronic_conditions?.join(', ') || 'None'}

Please provide:
1. Fitness Score (0-100)
2. Fitness Assessment
3. Exercise Program Recommendations
4. Workout Schedule
5. Progression Plan
6. Injury Prevention Tips
7. Equipment Alternatives
8. Performance Tracking

Format as JSON:
{
  "fitnessScore": number,
  "fitnessAssessment": "detailed fitness level analysis",
  "exerciseProgram": ["exercise 1", "exercise 2", "exercise 3"],
  "workoutSchedule": "weekly workout plan",
  "progressionPlan": "how to progress over time",
  "injuryPrevention": ["tip 1", "tip 2", "tip 3"],
  "equipmentAlternatives": ["alternative 1", "alternative 2"],
  "performanceTracking": ["metric 1", "metric 2", "metric 3"]
}`
  }
};

// Helper function to get the appropriate prompt
export const getGroqPrompt = (type: keyof typeof GROQ_PROMPTS, ...args: any[]): any => {
  const prompt = GROQ_PROMPTS[type];
  if (typeof prompt.user === 'function') {
    return (prompt.user as (...args: any[]) => any)(...args);
  }
  return prompt.user;
};

// Helper function to get system prompt
export const getGroqSystemPrompt = (type: keyof typeof GROQ_PROMPTS) => {
  return GROQ_PROMPTS[type].system;
};

// NEW: Helper function to get all available prompt types
export const getAvailablePromptTypes = () => {
  return Object.keys(GROQ_PROMPTS);
};

// NEW: Helper function to validate prompt type
export const isValidPromptType = (type: string): type is keyof typeof GROQ_PROMPTS => {
  return type in GROQ_PROMPTS;
};
