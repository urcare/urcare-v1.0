/**
 * ENHANCED DAILY SCHEDULE SERVICE
 *
 * This service generates truly personalized daily schedules
 * based on user goals, profile, and specific plan data
 */

import { UserProfile } from "@/contexts/AuthContext";

export interface PersonalizedActivity {
  id: string;
  type:
    | "workout"
    | "meal"
    | "hydration"
    | "sleep"
    | "meditation"
    | "break"
    | "other";
  title: string;
  description: string;
  startTime: string;
  endTime: string;
  duration: number;
  priority: "high" | "medium" | "low";
  category: string;
  instructions: string[];
  tips: string[];
  goalAlignment: string;
  personalizationNotes: string;
  equipment?: string[];
  alternatives?: string[];
}

export interface PersonalizedDailySchedule {
  date: string;
  dayOfWeek: string;
  goal: string;
  difficulty: string;
  activities: PersonalizedActivity[];
  summary: {
    totalDuration: number;
    workoutTime: number;
    mealCount: number;
    sleepHours: number;
    focusAreas: string[];
    goalContributions: Record<string, number>;
  };
  personalizationNotes: string;
  adaptationSuggestions: string[];
}

export interface ScheduleConfig {
  goal: string;
  difficulty: "easy" | "moderate" | "hard";
  userProfile: UserProfile;
  planData?: any;
  date: string;
}

export class EnhancedDailyScheduleService {
  /**
   * Generate personalized daily schedule
   */
  static async generatePersonalizedSchedule(
    config: ScheduleConfig
  ): Promise<PersonalizedDailySchedule> {
    const { goal, difficulty, userProfile, planData, date } = config;

    // Create AI prompt for personalized schedule
    const prompt = this.createSchedulePrompt(
      goal,
      difficulty,
      userProfile,
      planData,
      date
    );

    try {
      // Call AI service to generate personalized schedule
      const aiResponse = await this.callAIService(prompt);
      return this.processAIResponse(aiResponse, goal, difficulty, date);
    } catch (error) {
      console.error("Error generating personalized schedule:", error);
      // Fallback to basic schedule
      return this.generateFallbackSchedule(goal, difficulty, userProfile, date);
    }
  }

  /**
   * Create AI prompt for personalized schedule
   */
  private static createSchedulePrompt(
    goal: string,
    difficulty: string,
    userProfile: UserProfile,
    planData: any,
    date: string
  ): string {
    const userContext = `
USER PROFILE:
- Name: ${userProfile.full_name || "User"}
- Age: ${userProfile.age || "Not specified"}
- Gender: ${userProfile.gender || "Not specified"}
- Height: ${userProfile.height_cm || userProfile.height_feet} ${
      userProfile.unit_system === "metric" ? "cm" : "ft"
    }
- Weight: ${userProfile.weight_kg || userProfile.weight_lb} ${
      userProfile.unit_system === "metric" ? "kg" : "lbs"
    }
- Health Goals: ${userProfile.health_goals?.join(", ") || "General health"}
- Diet Type: ${userProfile.diet_type || "Balanced"}
- Workout Type: ${userProfile.workout_type || "General fitness"}
- Chronic Conditions: ${userProfile.chronic_conditions?.join(", ") || "None"}
- Medications: ${userProfile.medications?.join(", ") || "None"}
- Schedule: Wake up ${userProfile.wake_up_time}, Sleep ${userProfile.sleep_time}
- Work: ${userProfile.work_start} to ${userProfile.work_end}
- Meals: Breakfast ${userProfile.breakfast_time}, Lunch ${
      userProfile.lunch_time
    }, Dinner ${userProfile.dinner_time}
- Workout: ${userProfile.workout_time}
- Routine Flexibility: ${userProfile.routine_flexibility || "5"}/10
- Smoking: ${userProfile.smoking || "No"}
- Drinking: ${userProfile.drinking || "No"}
- Uses Wearable: ${userProfile.uses_wearable || "No"}
- Wearable Type: ${userProfile.wearable_type || "None"}
`;

    const planContext = planData
      ? `
CURRENT PLAN DATA:
${JSON.stringify(planData, null, 2)}
`
      : "";

    return `You are a health and wellness expert. Create a detailed, personalized daily schedule for a user.

${userContext}
${planContext}

USER GOAL: "${goal}"
DIFFICULTY LEVEL: ${difficulty}
DATE: ${date}

Create a personalized daily schedule that:
1. Is specific to the user's exact goal (not generic)
2. Respects their personal schedule and constraints
3. Considers their health conditions and medications
4. Adapts to their fitness level and preferences
5. Includes specific, actionable activities
6. Provides clear instructions and tips
7. Aligns with their goal and difficulty level
8. Includes alternatives and modifications

Return ONLY a JSON object with this exact structure:
{
  "date": "${date}",
  "dayOfWeek": "Monday",
  "goal": "${goal}",
  "difficulty": "${difficulty}",
  "activities": [
    {
      "id": "unique-activity-id",
      "type": "workout|meal|hydration|sleep|meditation|break|other",
      "title": "Specific activity title",
      "description": "Detailed description of what to do",
      "startTime": "HH:MM",
      "endTime": "HH:MM",
      "duration": 30,
      "priority": "high|medium|low",
      "category": "category name",
      "instructions": ["step 1", "step 2", "step 3"],
      "tips": ["tip 1", "tip 2"],
      "goalAlignment": "How this activity helps achieve the goal",
      "personalizationNotes": "Why this is personalized for this user",
      "equipment": ["equipment 1", "equipment 2"],
      "alternatives": ["alternative 1", "alternative 2"]
    }
  ],
  "summary": {
    "totalDuration": 480,
    "workoutTime": 45,
    "mealCount": 3,
    "sleepHours": 8,
    "focusAreas": ["area 1", "area 2"],
    "goalContributions": {
      "goal-progress": 0.8
    }
  },
  "personalizationNotes": "Overall personalization notes for this day",
  "adaptationSuggestions": ["suggestion 1", "suggestion 2"]
}`;
  }

  /**
   * Call AI service for personalized schedule
   */
  private static async callAIService(prompt: string): Promise<any> {
    const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

    if (!OPENAI_API_KEY) {
      throw new Error("OpenAI API key not configured");
    }

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content:
              "You are a health and wellness expert who creates detailed, personalized daily schedules. Always respond with valid JSON only.",
          },
          {
            role: "user",
            content: prompt,
          },
        ],
        max_tokens: 2000,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.statusText}`);
    }

    const data = await response.json();
    return JSON.parse(data.choices[0].message.content);
  }

  /**
   * Process AI response into structured format
   */
  private static processAIResponse(
    aiResponse: any,
    goal: string,
    difficulty: string,
    date: string
  ): PersonalizedDailySchedule {
    return {
      date: aiResponse.date || date,
      dayOfWeek:
        aiResponse.dayOfWeek ||
        new Date(date).toLocaleDateString("en-US", { weekday: "long" }),
      goal: aiResponse.goal || goal,
      difficulty: aiResponse.difficulty || difficulty,
      activities: aiResponse.activities || [],
      summary: aiResponse.summary || {
        totalDuration: 480,
        workoutTime: 45,
        mealCount: 3,
        sleepHours: 8,
        focusAreas: ["Health", "Fitness"],
        goalContributions: { "goal-progress": 0.8 },
      },
      personalizationNotes:
        aiResponse.personalizationNotes ||
        "Personalized schedule for your specific goal",
      adaptationSuggestions: aiResponse.adaptationSuggestions || [
        "Adjust timing as needed",
        "Modify intensity based on energy",
      ],
    };
  }

  /**
   * Generate fallback schedule when AI fails
   */
  private static generateFallbackSchedule(
    goal: string,
    difficulty: string,
    userProfile: UserProfile,
    date: string
  ): PersonalizedDailySchedule {
    const wakeUp = userProfile.wake_up_time || "07:00";
    const sleep = userProfile.sleep_time || "22:00";
    const workoutTime = userProfile.workout_time || "18:00";

    const activities: PersonalizedActivity[] = [
      {
        id: "wake-up",
        type: "other",
        title: "Wake Up & Hydration",
        description: "Start your day with hydration and light movement",
        startTime: wakeUp,
        endTime: this.addMinutes(wakeUp, 15),
        duration: 15,
        priority: "high",
        category: "Morning Routine",
        instructions: ["Drink 500ml water", "5 minutes light stretching"],
        tips: [
          "Set your intention for the day",
          "Avoid checking phone immediately",
        ],
        goalAlignment: `Supports ${goal.toLowerCase()} by establishing healthy morning habits`,
        personalizationNotes:
          "Adapted to your wake-up time and hydration needs",
      },
      {
        id: "breakfast",
        type: "meal",
        title: "Nutritious Breakfast",
        description: "Balanced breakfast to fuel your day",
        startTime: userProfile.breakfast_time || "08:00",
        endTime: this.addMinutes(userProfile.breakfast_time || "08:00", 30),
        duration: 30,
        priority: "high",
        category: "Nutrition",
        instructions: [
          "Include protein, carbs, and healthy fats",
          "Eat mindfully",
        ],
        tips: ["Prepare the night before if needed", "Focus on whole foods"],
        goalAlignment: `Provides energy and nutrients to support ${goal.toLowerCase()}`,
        personalizationNotes: "Tailored to your diet type and schedule",
      },
    ];

    // Add workout if it's a workout day
    if (difficulty !== "easy" || Math.random() > 0.3) {
      activities.push({
        id: "workout",
        type: "workout",
        title: `${
          difficulty.charAt(0).toUpperCase() + difficulty.slice(1)
        } Intensity Workout`,
        description: `Workout designed to help you ${goal.toLowerCase()}`,
        startTime: workoutTime,
        endTime: this.addMinutes(
          workoutTime,
          difficulty === "easy" ? 30 : difficulty === "moderate" ? 45 : 60
        ),
        duration:
          difficulty === "easy" ? 30 : difficulty === "moderate" ? 45 : 60,
        priority: "high",
        category: "Fitness",
        instructions: [
          "Warm up for 5 minutes",
          "Main workout",
          "Cool down for 5 minutes",
        ],
        tips: ["Listen to your body", "Stay hydrated"],
        goalAlignment: `Directly supports ${goal.toLowerCase()} through targeted exercise`,
        personalizationNotes:
          "Adapted to your fitness level and available time",
        equipment: ["Basic home equipment"],
        alternatives: ["Bodyweight exercises", "Walking/running"],
      });
    }

    return {
      date,
      dayOfWeek: new Date(date).toLocaleDateString("en-US", {
        weekday: "long",
      }),
      goal,
      difficulty,
      activities,
      summary: {
        totalDuration: activities.reduce(
          (sum, activity) => sum + activity.duration,
          0
        ),
        workoutTime: activities
          .filter((a) => a.type === "workout")
          .reduce((sum, activity) => sum + activity.duration, 0),
        mealCount: activities.filter((a) => a.type === "meal").length,
        sleepHours: 8,
        focusAreas: [goal, "Health", "Fitness"],
        goalContributions: { "goal-progress": 0.8 },
      },
      personalizationNotes: `This schedule is personalized for your goal of ${goal.toLowerCase()} and your ${difficulty} difficulty preference.`,
      adaptationSuggestions: [
        "Adjust timing based on your energy levels",
        "Modify exercises based on available equipment",
        "Increase or decrease intensity based on how you feel",
      ],
    };
  }

  /**
   * Add minutes to time string
   */
  private static addMinutes(timeStr: string, minutes: number): string {
    const [hours, mins] = timeStr.split(":").map(Number);
    const totalMinutes = hours * 60 + mins + minutes;
    const newHours = Math.floor(totalMinutes / 60);
    const newMins = totalMinutes % 60;
    return `${newHours.toString().padStart(2, "0")}:${newMins
      .toString()
      .padStart(2, "0")}`;
  }
}
