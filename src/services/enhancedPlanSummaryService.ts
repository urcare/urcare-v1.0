/**
 * ENHANCED PLAN SUMMARY SERVICE
 *
 * This service generates goal-specific summaries and details
 * instead of generic mock data
 */

import { UserProfile } from "@/contexts/AuthContext";

export interface GoalSpecificSummary {
  planOverview: string;
  expectedResults: string[];
  keyMetrics: {
    duration: string;
    timeCommitment: string;
    intensity: string;
    expectedProgress: string;
  };
  personalizedFeatures: string[];
  successFactors: string[];
  potentialChallenges: string[];
  adaptationStrategy: string;
}

export interface PlanSummaryConfig {
  goal: string;
  difficulty: "easy" | "moderate" | "hard";
  duration: number;
  userProfile: UserProfile;
  planData?: any;
}

export class EnhancedPlanSummaryService {
  /**
   * Generate goal-specific plan summary
   */
  static async generateGoalSpecificSummary(
    config: PlanSummaryConfig
  ): Promise<GoalSpecificSummary> {
    const { goal, difficulty, duration, userProfile, planData } = config;

    // Create AI prompt for goal-specific summary
    const prompt = this.createSummaryPrompt(
      goal,
      difficulty,
      duration,
      userProfile,
      planData
    );

    try {
      // Call AI service to generate personalized summary
      const aiResponse = await this.callAIService(prompt);
      return this.processAIResponse(aiResponse, goal, difficulty);
    } catch (error) {
      console.error("Error generating goal-specific summary:", error);
      // Fallback to basic summary
      return this.generateFallbackSummary(
        goal,
        difficulty,
        duration,
        userProfile
      );
    }
  }

  /**
   * Create AI prompt for goal-specific summary
   */
  private static createSummaryPrompt(
    goal: string,
    difficulty: string,
    duration: number,
    userProfile: UserProfile,
    planData?: any
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
`;

    const planContext = planData
      ? `
CURRENT PLAN DATA:
${JSON.stringify(planData, null, 2)}
`
      : "";

    return `You are a health and wellness expert. Create a detailed, goal-specific summary for a personalized health plan.

${userContext}
${planContext}

USER GOAL: "${goal}"
DIFFICULTY LEVEL: ${difficulty}
DURATION: ${duration} weeks

Create a comprehensive summary that:
1. Is specific to the user's exact goal (not generic)
2. Reflects their personal profile and constraints
3. Provides realistic expectations based on their situation
4. Addresses their specific health conditions and medications
5. Considers their schedule and lifestyle
6. Is motivational but realistic

Return ONLY a JSON object with this exact structure:
{
  "planOverview": "2-3 sentence overview of how this plan specifically addresses the user's goal",
  "expectedResults": ["specific result 1", "specific result 2", "specific result 3"],
  "keyMetrics": {
    "duration": "X weeks",
    "timeCommitment": "X hours per week",
    "intensity": "low/medium/high",
    "expectedProgress": "specific progress description"
  },
  "personalizedFeatures": ["feature 1", "feature 2", "feature 3"],
  "successFactors": ["factor 1", "factor 2", "factor 3"],
  "potentialChallenges": ["challenge 1", "challenge 2", "challenge 3"],
  "adaptationStrategy": "How the plan will adapt to the user's specific needs and constraints"
}`;
  }

  /**
   * Call AI service for goal-specific summary via API
   */
  private static async callAIService(prompt: string): Promise<any> {
    try {
      const response = await fetch("/api/generate-personalized-plan-summary", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt }),
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.statusText}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error calling AI service:", error);
      throw error;
    }
  }

  /**
   * Process AI response into structured format
   */
  private static processAIResponse(
    aiResponse: any,
    goal: string,
    difficulty: string
  ): GoalSpecificSummary {
    return {
      planOverview:
        aiResponse.planOverview ||
        `This ${difficulty} intensity plan is designed to help you ${goal.toLowerCase()}.`,
      expectedResults: aiResponse.expectedResults || [
        `Progress toward ${goal.toLowerCase()}`,
        "Improved health habits",
        "Increased motivation",
      ],
      keyMetrics: {
        duration: aiResponse.keyMetrics?.duration || "12 weeks",
        timeCommitment:
          aiResponse.keyMetrics?.timeCommitment || "3-5 hours per week",
        intensity: aiResponse.keyMetrics?.intensity || difficulty,
        expectedProgress:
          aiResponse.keyMetrics?.expectedProgress ||
          "Steady progress toward your goal",
      },
      personalizedFeatures: aiResponse.personalizedFeatures || [
        "Personalized to your goal",
        "Adapts to your schedule",
        "Considers your health conditions",
      ],
      successFactors: aiResponse.successFactors || [
        "Consistent execution",
        "Proper nutrition",
        "Adequate rest",
      ],
      potentialChallenges: aiResponse.potentialChallenges || [
        "Time management",
        "Motivation maintenance",
        "Schedule conflicts",
      ],
      adaptationStrategy:
        aiResponse.adaptationStrategy ||
        "The plan will adapt based on your progress and feedback.",
    };
  }

  /**
   * Generate fallback summary when AI fails
   */
  private static generateFallbackSummary(
    goal: string,
    difficulty: string,
    duration: number,
    userProfile: UserProfile
  ): GoalSpecificSummary {
    const timeCommitment =
      difficulty === "easy"
        ? "2-3 hours"
        : difficulty === "moderate"
        ? "4-6 hours"
        : "6-8 hours";

    return {
      planOverview: `This ${difficulty} intensity plan is specifically designed to help you ${goal.toLowerCase()} over ${duration} weeks, taking into account your personal schedule and health profile.`,
      expectedResults: [
        `Measurable progress toward ${goal.toLowerCase()}`,
        "Improved overall health and wellness",
        "Better daily habits and routines",
      ],
      keyMetrics: {
        duration: `${duration} weeks`,
        timeCommitment: `${timeCommitment} per week`,
        intensity: difficulty,
        expectedProgress: "Steady, sustainable progress toward your goal",
      },
      personalizedFeatures: [
        "Tailored to your specific goal",
        "Adapts to your schedule constraints",
        "Considers your health conditions and medications",
      ],
      successFactors: [
        "Consistent daily execution",
        "Proper nutrition and hydration",
        "Adequate sleep and recovery",
      ],
      potentialChallenges: [
        "Time management with your schedule",
        `Maintaining motivation over ${duration} weeks`,
        "Balancing plan requirements with daily life",
      ],
      adaptationStrategy:
        "The plan will automatically adjust based on your progress, feedback, and any changes in your schedule or health status.",
    };
  }
}
