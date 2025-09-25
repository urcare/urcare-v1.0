/**
 * SYSTEMATIC USER DATA PROCESSOR
 *
 * This service processes all user data systematically and structures it
 * for AI prompt generation. No more scattered data processing!
 */

import { UserProfile } from "@/contexts/AuthContext";

// ============================================================================
// INTERFACES & TYPES
// ============================================================================

export interface ProcessedUserData {
  // Basic Information
  basic: {
    name: string;
    age: number;
    gender: string;
    dateOfBirth: string | null;
  };

  // Physical Metrics
  physical: {
    height: {
      value: number;
      unit: "cm" | "ft";
      display: string;
    };
    weight: {
      value: number;
      unit: "kg" | "lb";
      display: string;
    };
    bmi: number | null;
  };

  // Health Status
  health: {
    conditions: string[];
    medications: string[];
    surgeries: string[];
    criticalConditions: string[];
    bloodGroup: string | null;
  };

  // Goals & Preferences
  goals: {
    primary: string[];
    dietType: string;
    workoutType: string;
    routineFlexibility: number; // 1-10 scale
  };

  // Schedule & Lifestyle
  schedule: {
    wakeUp: string;
    sleep: string;
    workStart: string;
    workEnd: string;
    meals: {
      breakfast: string;
      lunch: string;
      dinner: string;
    };
    workout: string;
  };

  // Lifestyle Factors
  lifestyle: {
    smoking: string;
    drinking: string;
    usesWearable: boolean;
    wearableType: string | null;
    trackFamily: boolean;
    shareProgress: boolean;
  };

  // Safety & Medical
  safety: {
    emergencyContact: {
      name: string | null;
      phone: string | null;
    };
    hasHealthReports: boolean;
    healthReports: string[];
  };

  // AI Processing Context
  aiContext: {
    complexityScore: number;
    riskLevel: "low" | "medium" | "high";
    focusAreas: string[];
    contraindications: string[];
    recommendations: string[];
  };
}

export interface AIPromptContext {
  userSummary: string;
  healthProfile: string;
  goalsAndPreferences: string;
  scheduleConstraints: string;
  safetyConsiderations: string;
  aiInstructions: string;
}

// ============================================================================
// MAIN DATA PROCESSOR CLASS
// ============================================================================

export class UserDataProcessor {
  /**
   * Process raw user profile data into structured format
   */
  static processUserData(
    profile: UserProfile,
    userGoal?: string
  ): ProcessedUserData {
    console.log("🔄 Processing user data systematically...");

    const processed: ProcessedUserData = {
      basic: this.processBasicInfo(profile),
      physical: this.processPhysicalMetrics(profile),
      health: this.processHealthStatus(profile),
      goals: this.processGoalsAndPreferences(profile, userGoal),
      schedule: this.processSchedule(profile),
      lifestyle: this.processLifestyle(profile),
      safety: this.processSafetyInfo(profile),
      aiContext: this.processAIContext(profile, userGoal),
    };

    console.log("✅ User data processed successfully");
    return processed;
  }

  /**
   * Generate structured AI prompt context
   */
  static generateAIPromptContext(
    processedData: ProcessedUserData,
    userGoal?: string
  ): AIPromptContext {
    return {
      userSummary: this.generateUserSummary(processedData),
      healthProfile: this.generateHealthProfile(processedData),
      goalsAndPreferences: this.generateGoalsAndPreferences(
        processedData,
        userGoal
      ),
      scheduleConstraints: this.generateScheduleConstraints(processedData),
      safetyConsiderations: this.generateSafetyConsiderations(processedData),
      aiInstructions: this.generateAIInstructions(processedData),
    };
  }

  // ============================================================================
  // DATA PROCESSING METHODS
  // ============================================================================

  private static processBasicInfo(profile: UserProfile) {
    return {
      name: profile.full_name || "User",
      age: profile.age || 30,
      gender: profile.gender || "Not specified",
      dateOfBirth: profile.date_of_birth,
    };
  }

  private static processPhysicalMetrics(profile: UserProfile) {
    const unitSystem = profile.unit_system || "metric";

    let height = { value: 0, unit: "cm" as "cm" | "ft", display: "" };
    let weight = { value: 0, unit: "kg" as "kg" | "lb", display: "" };

    if (unitSystem === "metric") {
      height = {
        value: parseFloat(profile.height_cm || "170"),
        unit: "cm",
        display: `${profile.height_cm} cm`,
      };
      weight = {
        value: parseFloat(profile.weight_kg || "70"),
        unit: "kg",
        display: `${profile.weight_kg} kg`,
      };
    } else {
      const feet = parseFloat(profile.height_feet || "5");
      const inches = parseFloat(profile.height_inches || "6");
      const totalInches = feet * 12 + inches;

      height = {
        value: totalInches,
        unit: "ft",
        display: `${feet}'${inches}"`,
      };
      weight = {
        value: parseFloat(profile.weight_lb || "150"),
        unit: "lb",
        display: `${profile.weight_lb} lbs`,
      };
    }

    // Calculate BMI
    let bmi: number | null = null;
    if (height.value > 0 && weight.value > 0) {
      if (unitSystem === "metric") {
        bmi = weight.value / Math.pow(height.value / 100, 2);
      } else {
        bmi = (weight.value * 703) / Math.pow(height.value, 2);
      }
    }

    return { height, weight, bmi };
  }

  private static processHealthStatus(profile: UserProfile) {
    return {
      conditions: profile.chronic_conditions || [],
      medications: profile.medications || [],
      surgeries: profile.surgery_details || [],
      criticalConditions: profile.critical_conditions
        ? [profile.critical_conditions]
        : [],
      bloodGroup: profile.blood_group,
    };
  }

  private static processGoalsAndPreferences(
    profile: UserProfile,
    userGoal?: string
  ) {
    return {
      primary: userGoal ? [userGoal] : profile.health_goals || [],
      dietType: profile.diet_type || "Balanced",
      workoutType: profile.workout_type || "General fitness",
      routineFlexibility: parseInt(profile.routine_flexibility || "5"),
    };
  }

  private static processSchedule(profile: UserProfile) {
    return {
      wakeUp: profile.wake_up_time || "07:00",
      sleep: profile.sleep_time || "22:00",
      workStart: profile.work_start || "09:00",
      workEnd: profile.work_end || "17:00",
      meals: {
        breakfast: profile.breakfast_time || "08:00",
        lunch: profile.lunch_time || "13:00",
        dinner: profile.dinner_time || "19:00",
      },
      workout: profile.workout_time || "18:00",
    };
  }

  private static processLifestyle(profile: UserProfile) {
    return {
      smoking: profile.smoking || "No",
      drinking: profile.drinking || "No",
      usesWearable: profile.uses_wearable === "Yes",
      wearableType: profile.wearable_type,
      trackFamily: profile.track_family === "Yes",
      shareProgress: profile.share_progress === "Yes",
    };
  }

  private static processSafetyInfo(profile: UserProfile) {
    return {
      emergencyContact: {
        name: profile.emergency_contact_name,
        phone: profile.emergency_contact_phone,
      },
      hasHealthReports: profile.has_health_reports === "Yes",
      healthReports: profile.health_reports || [],
    };
  }

  private static processAIContext(profile: UserProfile, userGoal?: string) {
    const complexityScore = this.calculateComplexityScore(profile, userGoal);
    const riskLevel = this.assessRiskLevel(profile);
    const focusAreas = this.identifyFocusAreas(profile, userGoal);
    const contraindications = this.identifyContraindications(profile);
    const recommendations = this.generateRecommendations(profile, userGoal);

    return {
      complexityScore,
      riskLevel,
      focusAreas,
      contraindications,
      recommendations,
    };
  }

  // ============================================================================
  // AI CONTEXT GENERATION
  // ============================================================================

  private static calculateComplexityScore(
    profile: UserProfile,
    userGoal?: string
  ): number {
    let score = 0;

    // Health conditions
    score += (profile.chronic_conditions?.length || 0) * 15;

    // Medications
    score += (profile.medications?.length || 0) * 10;

    // Age factors
    if (profile.age) {
      if (profile.age > 60) score += 20;
      if (profile.age < 25) score += 10;
    }

    // Complex goals
    const complexGoals = [
      "diabetes",
      "pcos",
      "weight loss",
      "muscle gain",
      "longevity",
    ];
    if (
      userGoal &&
      complexGoals.some((goal) => userGoal.toLowerCase().includes(goal))
    ) {
      score += 25;
    }

    return Math.min(score, 100);
  }

  private static assessRiskLevel(
    profile: UserProfile
  ): "low" | "medium" | "high" {
    const conditions = profile.chronic_conditions || [];
    const medications = profile.medications || [];
    const criticalConditions = profile.critical_conditions;

    if (criticalConditions || conditions.length > 3 || medications.length > 3) {
      return "high";
    }

    if (conditions.length > 0 || medications.length > 0) {
      return "medium";
    }

    return "low";
  }

  private static identifyFocusAreas(
    profile: UserProfile,
    userGoal?: string
  ): string[] {
    const areas: string[] = [];

    // Based on health conditions
    const conditions = profile.chronic_conditions || [];
    if (conditions.includes("diabetes")) areas.push("blood sugar management");
    if (conditions.includes("hypertension"))
      areas.push("cardiovascular health");
    if (conditions.includes("PCOS")) areas.push("hormonal balance");

    // Based on goals
    if (userGoal) {
      if (userGoal.toLowerCase().includes("weight"))
        areas.push("weight management");
      if (userGoal.toLowerCase().includes("muscle"))
        areas.push("strength training");
      if (userGoal.toLowerCase().includes("energy"))
        areas.push("energy optimization");
    }

    // Default areas
    if (areas.length === 0) {
      areas.push("general wellness", "lifestyle optimization");
    }

    return areas;
  }

  private static identifyContraindications(profile: UserProfile): string[] {
    const contraindications: string[] = [];

    const conditions = profile.chronic_conditions || [];
    const medications = profile.medications || [];

    // Condition-based contraindications
    if (conditions.includes("diabetes")) {
      contraindications.push("avoid extreme carb restriction");
      contraindications.push("monitor blood sugar during exercise");
    }

    if (conditions.includes("hypertension")) {
      contraindications.push(
        "avoid high-intensity exercise without medical clearance"
      );
    }

    if (conditions.includes("heart disease")) {
      contraindications.push("avoid high-intensity exercise");
      contraindications.push("avoid sauna and cold plunge");
    }

    // Medication-based contraindications
    if (
      medications.some((med) => med.toLowerCase().includes("blood thinner"))
    ) {
      contraindications.push("avoid high-impact activities");
    }

    return contraindications;
  }

  private static generateRecommendations(
    profile: UserProfile,
    userGoal?: string
  ): string[] {
    const recommendations: string[] = [];

    // Age-based recommendations
    if (profile.age && profile.age > 50) {
      recommendations.push("focus on joint health and flexibility");
      recommendations.push("prioritize bone density exercises");
    }

    // Condition-based recommendations
    const conditions = profile.chronic_conditions || [];
    if (conditions.includes("diabetes")) {
      recommendations.push("focus on consistent meal timing");
      recommendations.push("include post-meal walks");
    }

    // Goal-based recommendations
    if (userGoal) {
      if (userGoal.toLowerCase().includes("weight loss")) {
        recommendations.push("create sustainable calorie deficit");
        recommendations.push("focus on whole foods");
      }
      if (userGoal.toLowerCase().includes("muscle gain")) {
        recommendations.push("prioritize protein intake");
        recommendations.push("progressive overload training");
      }
    }

    return recommendations;
  }

  // ============================================================================
  // AI PROMPT GENERATION
  // ============================================================================

  private static generateUserSummary(processedData: ProcessedUserData): string {
    const { basic, physical, health } = processedData;

    return `User: ${basic.name}, ${basic.age} years old, ${basic.gender}
Physical: ${physical.height.display}, ${physical.weight.display}${
      physical.bmi ? ` (BMI: ${physical.bmi.toFixed(1)})` : ""
    }
Health Status: ${
      health.conditions.length > 0
        ? health.conditions.join(", ")
        : "No chronic conditions"
    }`;
  }

  private static generateHealthProfile(
    processedData: ProcessedUserData
  ): string {
    const { health, aiContext } = processedData;

    let profile = `Health Conditions: ${
      health.conditions.length > 0 ? health.conditions.join(", ") : "None"
    }`;

    if (health.medications.length > 0) {
      profile += `\nMedications: ${health.medications.join(", ")}`;
    }

    if (health.surgeries.length > 0) {
      profile += `\nPrevious Surgeries: ${health.surgeries.join(", ")}`;
    }

    if (health.bloodGroup) {
      profile += `\nBlood Group: ${health.bloodGroup}`;
    }

    profile += `\nRisk Level: ${aiContext.riskLevel.toUpperCase()}`;
    profile += `\nFocus Areas: ${aiContext.focusAreas.join(", ")}`;

    return profile;
  }

  private static generateGoalsAndPreferences(
    processedData: ProcessedUserData,
    userGoal?: string
  ): string {
    const { goals } = processedData;

    let goalsText = `Primary Goals: ${goals.primary.join(", ")}`;
    goalsText += `\nDiet Preference: ${goals.dietType}`;
    goalsText += `\nWorkout Preference: ${goals.workoutType}`;
    goalsText += `\nRoutine Flexibility: ${goals.routineFlexibility}/10`;

    return goalsText;
  }

  private static generateScheduleConstraints(
    processedData: ProcessedUserData
  ): string {
    const { schedule } = processedData;

    return `Daily Schedule:
- Wake up: ${schedule.wakeUp}
- Sleep: ${schedule.sleep}
- Work: ${schedule.workStart} - ${schedule.workEnd}
- Meals: Breakfast ${schedule.meals.breakfast}, Lunch ${schedule.meals.lunch}, Dinner ${schedule.meals.dinner}
- Workout: ${schedule.workout}`;
  }

  private static generateSafetyConsiderations(
    processedData: ProcessedUserData
  ): string {
    const { aiContext, safety } = processedData;

    let safetyText = `Safety Considerations:\n`;

    if (aiContext.contraindications.length > 0) {
      safetyText += `Contraindications: ${aiContext.contraindications.join(
        ", "
      )}\n`;
    }

    if (safety.emergencyContact.name) {
      safetyText += `Emergency Contact: ${safety.emergencyContact.name} (${safety.emergencyContact.phone})\n`;
    }

    safetyText += `Risk Level: ${aiContext.riskLevel.toUpperCase()}`;

    return safetyText;
  }

  private static generateAIInstructions(
    processedData: ProcessedUserData
  ): string {
    const { aiContext } = processedData;

    let instructions = `AI Instructions:
- Complexity Score: ${aiContext.complexityScore}/100
- Risk Level: ${aiContext.riskLevel}
- Focus Areas: ${aiContext.focusAreas.join(", ")}`;

    if (aiContext.recommendations.length > 0) {
      instructions += `\n- Key Recommendations: ${aiContext.recommendations.join(
        ", "
      )}`;
    }

    if (aiContext.contraindications.length > 0) {
      instructions += `\n- Avoid: ${aiContext.contraindications.join(", ")}`;
    }

    return instructions;
  }
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

export const userDataProcessor = {
  /**
   * Process user data and generate AI prompt context in one call
   */
  async processForAI(
    profile: UserProfile,
    userGoal?: string
  ): Promise<{
    processedData: ProcessedUserData;
    aiContext: AIPromptContext;
  }> {
    const processedData = UserDataProcessor.processUserData(profile, userGoal);
    const aiContext = UserDataProcessor.generateAIPromptContext(
      processedData,
      userGoal
    );

    return { processedData, aiContext };
  },

  /**
   * Get structured user summary for display
   */
  getStructuredSummary(processedData: ProcessedUserData): string {
    const { basic, physical, health, goals, aiContext } = processedData;

    return `
=== USER PROFILE SUMMARY ===
Name: ${basic.name}
Age: ${basic.age} | Gender: ${basic.gender}
Physical: ${physical.height.display}, ${physical.weight.display}${
      physical.bmi ? ` (BMI: ${physical.bmi.toFixed(1)})` : ""
    }

Health Status:
- Conditions: ${
      health.conditions.length > 0 ? health.conditions.join(", ") : "None"
    }
- Medications: ${
      health.medications.length > 0 ? health.medications.join(", ") : "None"
    }
- Risk Level: ${aiContext.riskLevel.toUpperCase()}

Goals & Preferences:
- Primary Goals: ${goals.primary.join(", ")}
- Diet: ${goals.dietType}
- Workout: ${goals.workoutType}
- Flexibility: ${goals.routineFlexibility}/10

AI Context:
- Complexity: ${aiContext.complexityScore}/100
- Focus Areas: ${aiContext.focusAreas.join(", ")}
- Recommendations: ${aiContext.recommendations.join(", ")}
    `.trim();
  },
};

export default UserDataProcessor;
