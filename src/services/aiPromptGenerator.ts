/**
 * SYSTEMATIC AI PROMPT GENERATOR
 *
 * This service generates structured AI prompts based on processed user data.
 * No more scattered prompt building!
 */

import { AIPromptContext, ProcessedUserData } from "./userDataProcessor";

// ============================================================================
// INTERFACES & TYPES
// ============================================================================

export interface AIPromptConfig {
  model: "gpt-4o" | "gpt-4o-mini" | "gpt-3.5-turbo";
  maxTokens: number;
  temperature: number;
  systemPrompt: string;
  userPrompt: string;
}

export interface HealthPlanPrompt {
  systemPrompt: string;
  userPrompt: string;
  config: AIPromptConfig;
}

export interface PromptTemplates {
  system: {
    basic: string;
    comprehensive: string;
    goalAware: string;
    queryBased: string;
  };
  user: {
    basic: string;
    comprehensive: string;
    goalAware: string;
    queryBased: string;
  };
}

// ============================================================================
// MAIN AI PROMPT GENERATOR CLASS
// ============================================================================

export class AIPromptGenerator {
  private static readonly PROMPT_TEMPLATES: PromptTemplates = {
    system: {
      basic: `You are a professional health coach and nutritionist. Create personalized, evidence-based health plans that are safe and effective.`,

      comprehensive: `You are Dr. Sarah Chen, a Master Health AI Specialist with 20+ years of experience in clinical nutrition, exercise physiology, and evidence-based health optimization.

CORE PRINCIPLES:
- Create scientifically-proven protocols that are safe and effective
- Personalize every recommendation based on individual data
- Focus on root causes, not just symptoms
- Integrate nutrition, movement, sleep, stress, and mindset holistically
- Provide actionable, time-stamped daily protocols

SAFETY MANDATE: Every recommendation must be evidence-based and safe. Never suggest anything that could cause harm.

OUTPUT REQUIREMENT: Return ONLY valid JSON without markdown, explanations, or additional text.`,

      goalAware: `You are Dr. Sarah Chen, a health expert who creates personalized, goal-aware health plans. Always respond with valid JSON in the exact format requested.

GOAL-AWARE PLANNING PRINCIPLES:
1. **Goal Alignment**: Every activity must directly support at least one of the user's health goals
2. **Impact Scoring**: Assign impact scores (0-1) to each activity based on how much it contributes to goal progress
3. **Compliance Weighting**: Assign compliance weights (0-1) based on how critical each activity is for goal success
4. **Timeline Integration**: Consider the user's timeline preferences when setting activity intensity
5. **Barrier Awareness**: Design activities that work around or address the user's identified barriers
6. **Priority-Based Planning**: Focus more activities on higher-priority goals`,

      queryBased: `You are the URCARE Master Health AI System. Create safe, hyper-personalized, evidence-based daily protocols that adapt in real time to user data for wellness, prevention, and management of lifestyle/chronic conditions.

SAFETY AND CLINICAL GOVERNANCE:
- Medical disclaimer: General educational guidance; not medical advice
- Contraindications: pregnancy/post-op/frail: avoid high-intensity/risky; diabetes/CVD/CKD/liver/HTN/retinopathy: favor low-risk
- Red flags: chest pain, severe dyspnea, syncope, focal neuro deficits, vision loss, severe abdominal pain, persistent vomiting, confusion, blood in stool/urine
- Medication rules: never initiate/discontinue/change dosages; provide only general timing guidance

OUTPUT REQUIREMENT: Return ONLY valid JSON matching the exact structure requested.`,
    },

    user: {
      basic: `Create a personalized 2-day health plan for this user.`,

      comprehensive: `Create a hyper-personalized 2-day health optimization protocol for:

USER PROFILE:
{userSummary}

HEALTH PROFILE:
{healthProfile}

GOALS & PREFERENCES:
{goalsAndPreferences}

SCHEDULE CONSTRAINTS:
{scheduleConstraints}

SAFETY CONSIDERATIONS:
{safetyConsiderations}

REQUIREMENTS:
1. Create time-stamped daily protocols with specific activities
2. Include evidence-based nutrition with meal sequencing
3. Add movement protocols adapted to their fitness level
4. Integrate circadian optimization and stress management
5. Include small hacks that enhance results
6. Make it culturally appropriate and geographically relevant
7. Ensure progressive difficulty and built-in adaptability

Return comprehensive plan in this JSON structure:
{
  "day1": {
    "date": "YYYY-MM-DD",
    "activities": [
      {
        "id": "1",
        "type": "meal",
        "title": "Breakfast",
        "description": "Detailed breakfast description with specific foods",
        "startTime": "07:00",
        "endTime": "07:30",
        "duration": 30,
        "priority": "high",
        "category": "nutrition",
        "instructions": ["Step 1", "Step 2"]
      }
    ],
    "summary": {
      "totalActivities": 12,
      "workoutTime": 60,
      "mealCount": 3,
      "sleepHours": 8,
      "focusAreas": ["nutrition", "exercise", "hydration"]
    }
  },
  "day2": { /* same structure as day1 */ },
  "overallGoals": ["Specific goal 1", "Specific goal 2", "Specific goal 3"],
  "progressTips": ["Detailed tip 1", "Detailed tip 2", "Detailed tip 3"]
}`,

      goalAware: `Create a comprehensive, goal-aware 2-day health plan that directly supports the user's specific health goals.

USER PROFILE:
{userSummary}

HEALTH PROFILE:
{healthProfile}

GOALS & PREFERENCES:
{goalsAndPreferences}

SCHEDULE CONSTRAINTS:
{scheduleConstraints}

SAFETY CONSIDERATIONS:
{safetyConsiderations}

AI INSTRUCTIONS:
{aiInstructions}

Each activity must include: relatedGoals (array of goal IDs), impactScore (0-1), complianceWeight (0-1)
Activities should be realistic and achievable within the user's schedule
Include specific instructions and tips for each activity
Consider the user's fitness level, health conditions, and lifestyle factors

Return a JSON object with this exact structure:
{
  "day1": {
    "date": "YYYY-MM-DD",
    "activities": [
      {
        "id": "unique-activity-id",
        "type": "workout|meal|hydration|sleep|meditation|break|other",
        "title": "Activity Title",
        "description": "Detailed description",
        "startTime": "HH:MM",
        "endTime": "HH:MM",
        "duration": minutes,
        "priority": "high|medium|low",
        "category": "category name",
        "instructions": ["step 1", "step 2"],
        "tips": ["tip 1", "tip 2"],
        "relatedGoals": ["goal-id-1", "goal-id-2"],
        "impactScore": 0.8,
        "complianceWeight": 0.9
      }
    ],
    "summary": {
      "totalActivities": number,
      "workoutTime": minutes,
      "mealCount": number,
      "sleepHours": number,
      "focusAreas": ["area1", "area2"],
      "goalContributions": {
        "goal-id": {
          "activities": number,
          "totalImpact": number,
          "expectedProgress": number
        }
      }
    }
  },
  "day2": { /* same structure as day1 */ },
  "overallGoals": ["goal summary 1", "goal summary 2"],
  "progressTips": ["tip 1", "tip 2"],
  "goalAlignment": {
    "goal-id": {
      "goal": { /* full goal object */ },
      "activities": number,
      "expectedWeeklyProgress": number,
      "timelineAlignment": "on_track|ahead|behind"
    }
  }
}`,

      queryBased: `Create a personalized health plan based on the user's query and profile information.

USER PROFILE:
{userSummary}

HEALTH PROFILE:
{healthProfile}

GOALS & PREFERENCES:
{goalsAndPreferences}

SCHEDULE CONSTRAINTS:
{scheduleConstraints}

SAFETY CONSIDERATIONS:
{safetyConsiderations}

AI INSTRUCTIONS:
{aiInstructions}

USER QUERY: "{userQuery}"

Please create a personalized health plan based on the above query and user information.

Return ONLY valid JSON matching this exact structure:
{
  "summary": "Health plan summary",
  "confidence": 0.85,
  "evidenceBase": ["Study 1", "Study 2"],
  "biometricTargets": {
    "weight": "target weight",
    "bodyFat": "target body fat %",
    "muscle": "target muscle mass"
  },
  "morningProtocol": {
    "wakeUp": "06:00",
    "activities": ["hydration", "light exercise", "meditation"]
  },
  "trainingBlock": {
    "type": "strength",
    "duration": 45,
    "exercises": ["exercise 1", "exercise 2"]
  },
  "nutritionPlan": {
    "calories": 2000,
    "macros": {"protein": 150, "carbs": 200, "fat": 80},
    "meals": ["meal 1", "meal 2", "meal 3"]
  },
  "sleepOptimization": {
    "bedtime": "22:00",
    "duration": 8,
    "practices": ["no screens 1h before bed", "cool room"]
  },
  "adaptiveAdjustments": {
    "complianceThreshold": 70,
    "adjustmentTriggers": ["low energy", "difficulty sleeping"]
  },
  "evidenceSupport": ["Citation 1", "Citation 2"],
  "warnings": ["Warning 1", "Warning 2"],
  "nextSteps": ["Step 1", "Step 2", "Step 3"]
}`,
    },
  };

  /**
   * Generate AI prompt for health plan generation
   */
  static generateHealthPlanPrompt(
    processedData: ProcessedUserData,
    aiContext: AIPromptContext,
    promptType:
      | "basic"
      | "comprehensive"
      | "goalAware"
      | "queryBased" = "comprehensive",
    userQuery?: string
  ): HealthPlanPrompt {
    console.log(`🤖 Generating ${promptType} AI prompt...`);

    // Select model based on complexity
    const model = this.selectModel(processedData.aiContext.complexityScore);
    const maxTokens = this.calculateMaxTokens(
      processedData.aiContext.complexityScore
    );

    // Generate system prompt
    const systemPrompt = this.generateSystemPrompt(promptType, aiContext);

    // Generate user prompt
    const userPrompt = this.generateUserPrompt(
      promptType,
      aiContext,
      userQuery
    );

    const config: AIPromptConfig = {
      model,
      maxTokens,
      temperature: 0.3,
      systemPrompt,
      userPrompt,
    };

    console.log(`✅ AI prompt generated successfully`);
    console.log(
      `📊 Model: ${model}, Max Tokens: ${maxTokens}, Type: ${promptType}`
    );

    return {
      systemPrompt,
      userPrompt,
      config,
    };
  }

  /**
   * Generate system prompt based on type and context
   */
  private static generateSystemPrompt(
    promptType: "basic" | "comprehensive" | "goalAware" | "queryBased",
    aiContext: AIPromptContext
  ): string {
    let systemPrompt = this.PROMPT_TEMPLATES.system[promptType];

    // Add context-specific instructions
    if (aiContext.safetyConsiderations.includes("HIGH RISK")) {
      systemPrompt +=
        "\n\nIMPORTANT: This user has high-risk conditions. Prioritize safety and conservative recommendations.";
    }

    if (aiContext.aiInstructions.includes("Complexity Score: 8")) {
      systemPrompt +=
        "\n\nThis is a complex case requiring detailed, personalized recommendations.";
    }

    return systemPrompt;
  }

  /**
   * Generate user prompt based on type and context
   */
  private static generateUserPrompt(
    promptType: "basic" | "comprehensive" | "goalAware" | "queryBased",
    aiContext: AIPromptContext,
    userQuery?: string
  ): string {
    let userPrompt = this.PROMPT_TEMPLATES.user[promptType];

    // Replace placeholders with actual data
    userPrompt = userPrompt
      .replace("{userSummary}", aiContext.userSummary)
      .replace("{healthProfile}", aiContext.healthProfile)
      .replace("{goalsAndPreferences}", aiContext.goalsAndPreferences)
      .replace("{scheduleConstraints}", aiContext.scheduleConstraints)
      .replace("{safetyConsiderations}", aiContext.safetyConsiderations)
      .replace("{aiInstructions}", aiContext.aiInstructions);

    if (userQuery) {
      userPrompt = userPrompt.replace("{userQuery}", userQuery);
    }

    return userPrompt;
  }

  /**
   * Select appropriate AI model based on complexity
   */
  private static selectModel(
    complexityScore: number
  ): "gpt-4o" | "gpt-4o-mini" | "gpt-3.5-turbo" {
    if (complexityScore > 70) return "gpt-4o";
    if (complexityScore > 40) return "gpt-4o-mini";
    return "gpt-3.5-turbo";
  }

  /**
   * Calculate max tokens based on complexity
   */
  private static calculateMaxTokens(complexityScore: number): number {
    if (complexityScore > 70) return 4000;
    if (complexityScore > 40) return 3000;
    return 2000;
  }

  /**
   * Generate prompt for specific health goals
   */
  static generateGoalSpecificPrompt(
    processedData: ProcessedUserData,
    aiContext: AIPromptContext,
    specificGoal: string
  ): HealthPlanPrompt {
    const goalSpecificSystemPrompt = `${this.PROMPT_TEMPLATES.system.comprehensive}

SPECIFIC GOAL FOCUS: ${specificGoal}

Create a detailed, evidence-based plan specifically targeting: ${specificGoal}
Ensure all recommendations directly support this goal.
Include specific metrics and milestones for tracking progress.`;

    const goalSpecificUserPrompt = `${this.PROMPT_TEMPLATES.user.comprehensive}

SPECIFIC GOAL: ${specificGoal}

Focus all recommendations on achieving: ${specificGoal}
Include specific metrics, milestones, and progress tracking methods.
Ensure the plan is optimized for this specific goal while maintaining overall health.`;

    return {
      systemPrompt: goalSpecificSystemPrompt,
      userPrompt: goalSpecificUserPrompt,
      config: {
        model: this.selectModel(processedData.aiContext.complexityScore),
        maxTokens: this.calculateMaxTokens(
          processedData.aiContext.complexityScore
        ),
        temperature: 0.3,
        systemPrompt: goalSpecificSystemPrompt,
        userPrompt: goalSpecificUserPrompt,
      },
    };
  }

  /**
   * Generate prompt for query-based health plans
   */
  static generateQueryBasedPrompt(
    processedData: ProcessedUserData,
    aiContext: AIPromptContext,
    userQuery: string
  ): HealthPlanPrompt {
    return this.generateHealthPlanPrompt(
      processedData,
      aiContext,
      "queryBased",
      userQuery
    );
  }

  /**
   * Generate prompt for comprehensive health plans
   */
  static generateComprehensivePrompt(
    processedData: ProcessedUserData,
    aiContext: AIPromptContext
  ): HealthPlanPrompt {
    return this.generateHealthPlanPrompt(
      processedData,
      aiContext,
      "comprehensive"
    );
  }

  /**
   * Generate prompt for goal-aware health plans
   */
  static generateGoalAwarePrompt(
    processedData: ProcessedUserData,
    aiContext: AIPromptContext
  ): HealthPlanPrompt {
    return this.generateHealthPlanPrompt(processedData, aiContext, "goalAware");
  }

  /**
   * Generate highly personalized AI prompt with comprehensive user data
   */
  static generatePersonalizedPrompt(
    processedData: ProcessedUserData,
    aiContext: AIPromptContext,
    userGoal: string,
    promptType: "comprehensive" | "goalAware" | "queryBased" = "comprehensive"
  ): HealthPlanPrompt {
    console.log(`🤖 Generating enhanced ${promptType} AI prompt...`);

    // Select model based on complexity
    const model = this.selectModel(processedData.aiContext.complexityScore);
    const maxTokens = this.calculateMaxTokens(
      processedData.aiContext.complexityScore
    );

    // Generate enhanced system prompt
    const systemPrompt = this.generateEnhancedSystemPrompt(
      promptType,
      aiContext,
      userGoal
    );

    // Generate enhanced user prompt with comprehensive data
    const userPrompt = this.generateEnhancedUserPrompt(
      promptType,
      processedData,
      aiContext,
      userGoal
    );

    const config: AIPromptConfig = {
      model,
      maxTokens,
      temperature: 0.3,
      systemPrompt,
      userPrompt,
    };

    console.log(`✅ Enhanced AI prompt generated successfully`);
    console.log(
      `📊 Model: ${model}, Max Tokens: ${maxTokens}, Type: ${promptType}`
    );

    return {
      systemPrompt,
      userPrompt,
      config,
    };
  }

  /**
   * Generate enhanced system prompt with goal-specific instructions
   */
  private static generateEnhancedSystemPrompt(
    promptType: string,
    aiContext: AIPromptContext,
    userGoal: string
  ): string {
    const baseSystemPrompt = `You are Dr. Sarah Chen, a Master Health AI Specialist with 20+ years of experience in clinical nutrition, exercise physiology, and evidence-based health optimization.

CORE PRINCIPLES:
- Create scientifically-proven protocols that are safe and effective
- Personalize every recommendation based on individual data
- Focus on root causes, not just symptoms
- Integrate nutrition, movement, sleep, stress, and mindset holistically
- Provide actionable, time-stamped daily protocols

SAFETY MANDATE: Every recommendation must be evidence-based and safe. Never suggest anything that could cause harm.

GOAL-SPECIFIC FOCUS: This plan must be specifically designed to help the user achieve: "${userGoal}"
Every recommendation must directly support this specific goal.

PERSONALIZATION REQUIREMENTS:
- Use the user's exact schedule, preferences, and constraints
- Consider their health conditions and medications
- Adapt to their fitness level and experience
- Respect their dietary preferences and restrictions
- Work within their time constraints and lifestyle

OUTPUT REQUIREMENT: Return ONLY valid JSON without markdown, explanations, or additional text.`;

    // Add goal-specific instructions
    const goalSpecificInstructions = this.getGoalSpecificInstructions(userGoal);

    // Add safety considerations based on user profile
    const safetyInstructions = this.getSafetyInstructions(aiContext);

    return `${baseSystemPrompt}

${goalSpecificInstructions}

${safetyInstructions}

CRITICAL: Every recommendation must be specifically tailored to help achieve "${userGoal}". Generic recommendations are not acceptable.`;
  }

  /**
   * Generate enhanced user prompt with comprehensive data
   */
  private static generateEnhancedUserPrompt(
    promptType: string,
    processedData: ProcessedUserData,
    aiContext: AIPromptContext,
    userGoal: string
  ): string {
    const comprehensiveUserData = this.buildComprehensiveUserData(
      processedData,
      userGoal
    );

    let userPrompt = `Create a hyper-personalized health plan specifically designed to help achieve: "${userGoal}"

${comprehensiveUserData}

CRITICAL REQUIREMENTS:
1. Every recommendation must directly support achieving "${userGoal}"
2. Use the user's exact schedule and constraints
3. Consider their health conditions and medications
4. Adapt to their fitness level and preferences
5. Provide specific, actionable instructions
6. Include alternatives and modifications
7. Make it realistic and achievable for this specific user

Return ONLY valid JSON matching this exact structure:
{
  "summary": "2-3 sentence summary specifically about how this plan helps achieve the user's goal",
  "confidence": 0.85,
  "evidenceBase": ["Study 1", "Study 2"],
  "biometricTargets": {
    "weight": "target weight",
    "bodyFat": "target body fat %",
    "muscle": "target muscle mass"
  },
  "morningProtocol": {
    "wakeUp": "06:00",
    "activities": ["hydration", "light exercise", "meditation"]
  },
  "trainingBlock": {
    "type": "strength",
    "duration": 45,
    "exercises": ["exercise 1", "exercise 2"]
  },
  "nutritionPlan": {
    "calories": 2000,
    "macros": {"protein": 150, "carbs": 200, "fat": 80},
    "meals": ["meal 1", "meal 2", "meal 3"]
  },
  "sleepOptimization": {
    "bedtime": "22:00",
    "duration": 8,
    "practices": ["no screens 1h before bed", "cool room"]
  },
  "adaptiveAdjustments": {
    "complianceThreshold": 70,
    "adjustmentTriggers": ["low energy", "difficulty sleeping"]
  },
  "evidenceSupport": ["Citation 1", "Citation 2"],
  "warnings": ["Warning 1", "Warning 2"],
  "nextSteps": ["Step 1", "Step 2", "Step 3"]
}`;

    return userPrompt;
  }

  /**
   * Build comprehensive user data string
   */
  private static buildComprehensiveUserData(
    processedData: ProcessedUserData,
    userGoal: string
  ): string {
    return `
DETAILED USER PROFILE:

BASIC INFORMATION:
- Name: ${processedData.basic.name}
- Age: ${processedData.basic.age}
- Gender: ${processedData.basic.gender}
- Date of Birth: ${processedData.basic.dateOfBirth || "Not specified"}

PHYSICAL METRICS:
- Height: ${processedData.physical.height.display}
- Weight: ${processedData.physical.weight.display}
- BMI: ${processedData.physical.bmi?.toFixed(1) || "Not calculated"}

HEALTH STATUS:
- Chronic Conditions: ${processedData.health.conditions.join(", ") || "None"}
- Medications: ${processedData.health.medications.join(", ") || "None"}
- Surgeries: ${processedData.health.surgeries.join(", ") || "None"}
- Critical Conditions: ${
      processedData.health.criticalConditions.join(", ") || "None"
    }
- Blood Group: ${processedData.health.bloodGroup || "Not specified"}

GOALS & PREFERENCES:
- Primary Goal: "${userGoal}"
- Additional Goals: ${processedData.goals.primary.join(", ") || "None"}
- Diet Type: ${processedData.goals.dietType}
- Workout Type: ${processedData.goals.workoutType}
- Routine Flexibility: ${processedData.goals.routineFlexibility}/10

DAILY SCHEDULE:
- Wake Up: ${processedData.schedule.wakeUp}
- Sleep: ${processedData.schedule.sleep}
- Work: ${processedData.schedule.workStart} to ${processedData.schedule.workEnd}
- Breakfast: ${processedData.schedule.meals.breakfast}
- Lunch: ${processedData.schedule.meals.lunch}
- Dinner: ${processedData.schedule.meals.dinner}
- Workout: ${processedData.schedule.workout}

LIFESTYLE FACTORS:
- Smoking: ${processedData.lifestyle.smoking}
- Drinking: ${processedData.lifestyle.drinking}
- Uses Wearable: ${processedData.lifestyle.usesWearable ? "Yes" : "No"}
- Wearable Type: ${processedData.lifestyle.wearableType || "None"}
- Track Family: ${processedData.lifestyle.trackFamily ? "Yes" : "No"}
- Share Progress: ${processedData.lifestyle.shareProgress ? "Yes" : "No"}

SAFETY & MEDICAL:
- Emergency Contact: ${
      processedData.safety.emergencyContact.name || "Not specified"
    }
- Has Health Reports: ${processedData.safety.hasHealthReports ? "Yes" : "No"}
- Health Reports: ${processedData.safety.healthReports.join(", ") || "None"}

AI PROCESSING CONTEXT:
- Complexity Score: ${processedData.aiContext.complexityScore}/100
- Risk Level: ${processedData.aiContext.riskLevel}
- Focus Areas: ${processedData.aiContext.focusAreas.join(", ")}
- Contraindications: ${
      processedData.aiContext.contraindications.join(", ") || "None"
    }
- Recommendations: ${processedData.aiContext.recommendations.join(", ")}
`;
  }

  /**
   * Get goal-specific instructions
   */
  private static getGoalSpecificInstructions(userGoal: string): string {
    const goalLower = userGoal.toLowerCase();

    if (goalLower.includes("weight") && goalLower.includes("loss")) {
      return `
WEIGHT LOSS FOCUS:
- Prioritize caloric deficit through nutrition and exercise
- Include strength training to preserve muscle mass
- Focus on sustainable, long-term habits
- Consider metabolic factors and individual needs
- Include progress tracking and milestone celebrations`;
    }

    if (goalLower.includes("weight") && goalLower.includes("gain")) {
      return `
WEIGHT GAIN FOCUS:
- Prioritize caloric surplus with nutrient-dense foods
- Include progressive strength training
- Focus on muscle building over fat gain
- Consider individual metabolism and activity levels
- Include proper recovery and sleep optimization`;
    }

    if (goalLower.includes("muscle") || goalLower.includes("strength")) {
      return `
MUSCLE/STRENGTH FOCUS:
- Prioritize progressive overload in training
- Include adequate protein intake for muscle synthesis
- Focus on compound movements and proper form
- Consider recovery and sleep for muscle growth
- Include periodization and progression planning`;
    }

    if (goalLower.includes("fitness") || goalLower.includes("endurance")) {
      return `
FITNESS/ENDURANCE FOCUS:
- Include both cardiovascular and strength training
- Focus on progressive overload and variety
- Consider individual fitness level and goals
- Include proper warm-up and cool-down
- Balance intensity with recovery`;
    }

    if (goalLower.includes("stress") || goalLower.includes("mental")) {
      return `
MENTAL WELLNESS FOCUS:
- Include stress management techniques
- Focus on sleep optimization and recovery
- Include mindfulness and relaxation practices
- Consider work-life balance and boundaries
- Include social connection and support systems`;
    }

    return `
GENERAL HEALTH FOCUS:
- Balance all aspects of health (nutrition, exercise, sleep, stress)
- Focus on sustainable lifestyle changes
- Include regular health monitoring
- Consider individual preferences and constraints
- Include education and behavior change strategies`;
  }

  /**
   * Get safety instructions based on user profile
   */
  private static getSafetyInstructions(aiContext: AIPromptContext): string {
    let safetyInstructions = "";

    if (aiContext.safetyConsiderations.includes("HIGH RISK")) {
      safetyInstructions += `
HIGH RISK SAFETY PROTOCOLS:
- Prioritize safety over intensity
- Include medical clearance recommendations
- Focus on low-impact, safe activities
- Include regular health monitoring
- Provide clear warning signs to watch for`;
    }

    if (aiContext.safetyConsiderations.includes("MEDICATIONS")) {
      safetyInstructions += `
MEDICATION CONSIDERATIONS:
- Consider potential drug-nutrient interactions
- Avoid recommendations that could interfere with medications
- Include timing considerations for medications
- Provide guidance on when to consult healthcare provider
- Include monitoring for medication-related side effects`;
    }

    if (aiContext.safetyConsiderations.includes("CHRONIC CONDITIONS")) {
      safetyInstructions += `
CHRONIC CONDITION MANAGEMENT:
- Tailor recommendations to specific conditions
- Include condition-specific precautions
- Focus on management rather than cure
- Include regular monitoring and follow-up
- Provide clear guidelines for when to seek medical attention`;
    }

    return safetyInstructions;
  }
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

export const aiPromptGenerator = {
  /**
   * Generate all types of prompts for a user
   */
  async generateAllPrompts(
    processedData: ProcessedUserData,
    aiContext: AIPromptContext,
    userQuery?: string
  ): Promise<{
    basic: HealthPlanPrompt;
    comprehensive: HealthPlanPrompt;
    goalAware: HealthPlanPrompt;
    queryBased?: HealthPlanPrompt;
  }> {
    return {
      basic: AIPromptGenerator.generateHealthPlanPrompt(
        processedData,
        aiContext,
        "basic"
      ),
      comprehensive: AIPromptGenerator.generateComprehensivePrompt(
        processedData,
        aiContext
      ),
      goalAware: AIPromptGenerator.generateGoalAwarePrompt(
        processedData,
        aiContext
      ),
      queryBased: userQuery
        ? AIPromptGenerator.generateQueryBasedPrompt(
            processedData,
            aiContext,
            userQuery
          )
        : undefined,
    };
  },

  /**
   * Get prompt configuration for API calls
   */
  getPromptConfig(prompt: HealthPlanPrompt) {
    return {
      model: prompt.config.model,
      messages: [
        { role: "system", content: prompt.systemPrompt },
        { role: "user", content: prompt.userPrompt },
      ],
      max_tokens: prompt.config.maxTokens,
      temperature: prompt.config.temperature,
    };
  },
};

export default AIPromptGenerator;
