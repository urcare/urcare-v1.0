import { config } from "../config";
import { UserProfile } from "../contexts/AuthContext";

export interface HealthPlanReport {
  summary: string;
  recommendations: string[];
  detailedReport: string;
  structured: {
    summary: {
      healthScore: string;
      calorieTarget: string;
      bmi: string;
      keyRecommendations: string[];
    };
    sections: {
      healthAssessment: string;
      nutritionPlan: string;
      fitnessPlan: string;
      lifestyleOptimization: string;
      healthMonitoring: string;
      potentialRisks: string;
      urCareBenefits: string;
      nextSteps: string;
    };
  };
}

class HealthReportService {
  private apiBaseUrl: string;

  constructor() {
    this.apiBaseUrl = config.api.baseUrl;
  }

  async generateHealthPlan(profile: UserProfile): Promise<HealthPlanReport> {
    try {
      const response = await fetch(`${this.apiBaseUrl}/api/generate-plan`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ profile }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Server API error:", errorText);
        throw new Error(`Server API error: ${response.status}`);
      }

      const data = await response.json();

      // The server returns { report, structured } format
      if (data.report && data.structured) {
        return {
          summary: data.structured.summary?.healthScore
            ? `Your personalized health plan is ready! Health Score: ${data.structured.summary.healthScore}/100`
            : "Your personalized health plan is ready!",
          recommendations: data.structured.summary?.keyRecommendations || [
            "Start with 10 minutes of daily exercise",
            "Track your water intake",
            "Establish a regular sleep routine",
            "Plan meals in advance",
            "Set weekly goals",
          ],
          detailedReport: data.report,
          structured: data.structured,
        };
      }

      throw new Error("Invalid response format from server");
    } catch (error) {
      console.error("Error generating health plan with server API:", error);
      // Fallback to basic plan if server API fails
      return this.generateBasicHealthPlan(profile);
    }
  }

  private generateBasicHealthPlan(profile: UserProfile): HealthPlanReport {
    console.log("Generating basic health plan for profile:", profile);

    // Calculate basic health metrics with better defaults
    const age =
      profile.age ||
      (profile.date_of_birth
        ? new Date().getFullYear() -
          new Date(profile.date_of_birth).getFullYear()
        : 30);
    const height = parseFloat(
      profile.height_cm || profile.height_feet || "170"
    );
    const weight = parseFloat(profile.weight_kg || profile.weight_lb || "70");

    // Convert to metric if needed
    const heightCm = height < 10 ? height * 30.48 : height;
    const weightKg = weight > 200 ? weight * 0.453592 : weight;

    const heightM = heightCm / 100;
    const bmi = (weightKg / (heightM * heightM)).toFixed(1);

    // Calculate BMR using Mifflin-St Jeor equation
    let bmr: number;
    const gender = (profile.gender || "male").toLowerCase();
    if (gender === "male") {
      bmr = 10 * weightKg + 6.25 * heightCm - 5 * age + 5;
    } else {
      bmr = 10 * weightKg + 6.25 * heightCm - 5 * age - 161;
    }
    const tdee = Math.round(bmr * 1.2);

    // Calculate health score
    let healthScore = 70;
    if (parseFloat(bmi) >= 18.5 && parseFloat(bmi) <= 24.9) healthScore += 20;
    if (age >= 18 && age <= 65) healthScore += 10;
    if (age >= 25 && age <= 45) healthScore += 5;

    const bmiCategory =
      parseFloat(bmi) < 18.5
        ? "Underweight"
        : parseFloat(bmi) > 24.9
        ? "Overweight"
        : "Normal weight";

    const basicReport = `**HEALTH ASSESSMENT**
• BMI: ${bmi} (${bmiCategory})
• Health Score: ${healthScore}/100
• Age: ${age} years
• Status: ${bmiCategory} - ${
      parseFloat(bmi) < 18.5
        ? "Consider consulting a nutritionist"
        : parseFloat(bmi) > 24.9
        ? "Focus on balanced diet and exercise"
        : "Maintain current healthy habits"
    }

**NUTRITION PLAN**
• Daily Calorie Target: ${tdee} kcal
• Protein: ${Math.round(weightKg * 1.2)}g per day (${Math.round(
      weightKg * 1.2 * 4
    )} kcal)
• Carbs: 50% of calories (${Math.round(tdee * 0.5)} kcal)
• Fats: 25% of calories (${Math.round(tdee * 0.25)} kcal)

**FITNESS PLAN**
• Frequency: 3-4 days per week
• Duration: 30-45 minutes per session
• Focus: Mix of cardio and strength training
• Intensity: Moderate to vigorous

**LIFESTYLE TIPS**
• Sleep: 7-9 hours per night consistently
• Hydration: 8-10 glasses of water daily
• Stress: Practice mindfulness and relaxation techniques
• Meal timing: Regular meal times to support metabolism

**NEXT STEPS**
• Start with 10 minutes of daily exercise
• Track your water intake throughout the day
• Establish a regular sleep routine
• Plan your meals in advance
• Set realistic weekly goals and track progress`;

    return {
      summary: `Your personalized health plan is ready! Health Score: ${healthScore}/100`,
      recommendations: [
        `Daily Calorie Target: ${tdee} kcal`,
        `BMI: ${bmi} (${bmiCategory})`,
        `Exercise: 3-4 days per week`,
        `Sleep: 7-9 hours nightly`,
        `Hydration: 8-10 glasses daily`,
      ],
      detailedReport: basicReport,
      structured: {
        summary: {
          healthScore: healthScore.toString(),
          calorieTarget: tdee.toString(),
          bmi: bmi,
          keyRecommendations: [
            "Start with 10 minutes of daily exercise",
            "Track your water intake",
            "Establish a regular sleep routine",
            "Plan meals in advance",
            "Set weekly goals",
          ],
        },
        sections: {
          healthAssessment: `BMI: ${bmi} (${bmiCategory}), Health Score: ${healthScore}/100`,
          nutritionPlan: `Daily target: ${tdee} kcal with balanced macronutrients`,
          fitnessPlan: `3-4 days per week, 30-45 minutes per session`,
          lifestyleOptimization: `Focus on sleep, hydration, and stress management`,
          healthMonitoring: `Track weight, BMI, and energy levels weekly`,
          potentialRisks: `Monitor blood pressure and cholesterol levels`,
          urCareBenefits: `Personalized tracking and community support`,
          nextSteps: `Start small and build healthy habits gradually`,
        },
      },
    };
  }
}

export const healthReportService = new HealthReportService();
