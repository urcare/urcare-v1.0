// Vercel Serverless Function to generate a health plan
// POST /api/generate-plan

type BillingUnitSystem = "metric" | "imperial";

interface Preferences {
  meals?: {
    breakfast_time?: string;
    lunch_time?: string;
    dinner_time?: string;
    diet_type?: string;
  };
  schedule?: {
    sleep_time?: string;
    wake_up_time?: string;
    work_start?: string;
    work_end?: string;
    workout_time?: string;
  };
  health?: {
    blood_group?: string;
    chronic_conditions?: string[];
    medications?: string[];
    health_goals?: string[];
    allergies?: string[];
  };
}

interface Profile {
  full_name?: string;
  age?: number;
  date_of_birth?: string;
  gender?: string;
  height_cm?: number;
  height_feet?: number;
  weight_kg?: number;
  weight_lb?: number;
  unit_system?: BillingUnitSystem;
  preferences?: Preferences;
}

function generateMockHealthPlan(profile: Profile) {
  const age = profile.age || 30;
  const gender = (profile.gender || "male").toLowerCase();
  const height = profile.height_cm || 170;
  const weight = profile.weight_kg || 70;

  const heightM = height / 100;
  const bmi = (weight / (heightM * heightM)).toFixed(1);

  let bmr: number;
  if (gender === "male") {
    bmr = 10 * weight + 6.25 * height - 5 * age + 5;
  } else {
    bmr = 10 * weight + 6.25 * height - 5 * age - 161;
  }
  const tdee = Math.round(bmr * 1.2);

  let healthScore = 75;
  if (parseFloat(bmi) >= 18.5 && parseFloat(bmi) <= 24.9) healthScore += 15;
  if (age >= 18 && age <= 65) healthScore += 10;

  const mockResponse = `HEALTH ASSESSMENT
• BMI: ${bmi}
• Health Score: ${healthScore}/100

NUTRITION PLAN
• Daily Calorie Target: ${tdee} kcal
• Balanced macronutrients and regular meals

FITNESS PLAN
• 3-4 days/week cardio + strength, 30-45 mins

LIFESTYLE OPTIMIZATION
• Sleep 7-9 hours, hydrate well, manage stress

HEALTH MONITORING
• Track weight, BMI, energy levels

POTENTIAL HEALTH RISKS
• Monitor BP and lipids

HOW UR CARE WILL HELP
• Personalized tracking and insights

ACTIONABLE NEXT STEPS
1. 30-minute daily walks
2. Track meals for 1 week
3. Set regular meal times`;

  return {
    summary: {
      healthScore: healthScore.toString(),
      calorieTarget: tdee.toString(),
      bmi: bmi,
      keyRecommendations: [
        "Start with 30-minute daily walks",
        "Track your food intake for 1 week",
        "Set up regular meal times",
      ],
    },
    sections: {
      healthAssessment:
        "Based on your profile data, your current health status has room for improvement.",
      nutritionPlan: `Daily calorie target: ${tdee} kcal with balanced macros`,
      fitnessPlan: "3-4 days/week of cardio and strength",
      lifestyleOptimization: "Focus on sleep, stress management, hydration",
      healthMonitoring: "Track weight, BMI, energy levels",
      potentialRisks: "Monitor blood pressure and cholesterol",
      urCareBenefits: "Personalized tracking and community support",
      nextSteps: "Start with walking and food tracking",
    },
    rawResponse: mockResponse,
  };
}

export default async function handler(req: any, res: any) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  try {
    const { profile } = req.body as { profile?: Profile };
    if (!profile) {
      return res.status(400).json({ error: "Missing profile data" });
    }

    // For now, always return mock plan (no OpenAI dependency)
    const mock = generateMockHealthPlan(profile);
    return res.status(200).json({ report: mock.rawResponse, structured: mock });
  } catch (err) {
    console.error("/api/generate-plan error:", err);
    return res.status(500).json({ error: "Failed to generate plan." });
  }
}


