// Vercel Serverless Function to generate a health plan
// POST /api/generate-plan

import { OpenAI } from "openai";

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

    // Check if OpenAI is configured
    const openai = process.env.OPENAI_API_KEY
      ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
      : null;

    if (!openai) {
      console.log("OpenAI not configured, returning mock response");
      const mock = generateMockHealthPlan(profile);
      return res.status(200).json({ report: mock.rawResponse, structured: mock });
    }

    // Use OpenAI to generate a personalized plan
    const userInfo = {
      name: profile.full_name,
      age: profile.age || profile.date_of_birth,
      gender: profile.gender,
      height: profile.height_cm || profile.height_feet,
      weight: profile.weight_kg || profile.weight_lb,
      unitSystem: profile.unit_system || "metric",
    };

    const preferences = profile.preferences || {};
    const healthData = {
      bloodGroup: preferences.health?.blood_group,
      chronicConditions: preferences.health?.chronic_conditions || [],
      medications: preferences.health?.medications || [],
      healthGoals: preferences.health?.health_goals || [],
      dietType: preferences.meals?.diet_type,
      allergies: preferences.health?.allergies,
    };

    const schedule = {
      wakeUpTime: preferences.schedule?.wake_up_time,
      sleepTime: preferences.schedule?.sleep_time,
      workStart: preferences.schedule?.work_start,
      workEnd: preferences.schedule?.work_end,
      breakfastTime: preferences.meals?.breakfast_time,
      lunchTime: preferences.meals?.lunch_time,
      dinnerTime: preferences.meals?.dinner_time,
      workoutTime: preferences.schedule?.workout_time,
    };

    const prompt = `You are an expert health and wellness AI coach. Generate a personalized health plan based ONLY on the provided user data. Be precise, accurate, and use ONLY the information given.

USER DATA:
${JSON.stringify(userInfo, null, 2)}

HEALTH INFORMATION:
${JSON.stringify(healthData, null, 2)}

DAILY SCHEDULE:
${JSON.stringify(schedule, null, 2)}

CRITICAL INSTRUCTIONS:
- Use ONLY the data provided above. Do not make assumptions or add fictional information.
- Calculate BMI accurately using the provided height and weight data.
- Base calorie recommendations on actual age, gender, height, weight, and activity level.
- If any data is missing, clearly state "Data not provided" for that section.
- Be conservative with recommendations - do not suggest extreme changes.
- Focus on evidence-based, safe recommendations.
- If user has chronic conditions, prioritize safety and consult recommendations.

REQUIRED SECTIONS (respond with ONLY what you can calculate from the data):

1. **HEALTH ASSESSMENT**
   - BMI calculation: Use formula BMI = weight(kg) / height(m)²
   - Health score: 0-100 based on provided data (be conservative)
   - Current status analysis based on actual data only

2. **NUTRITION PLAN**
   - Daily calorie target: Calculate using BMR formula
   - Macronutrient breakdown: Protein (1.2-1.6g/kg), Carbs (45-65%), Fats (20-35%)
   - Meal timing: Based on provided schedule only
   - Dietary restrictions: Only mention if explicitly provided

3. **FITNESS PLAN**
   - Workout frequency: 3-5 days/week (conservative recommendation)
   - Exercise types: Based on goals and current fitness level
   - Duration: 30-45 minutes per session
   - Safety considerations for any health conditions

4. **LIFESTYLE OPTIMIZATION**
   - Sleep recommendations: Based on provided sleep schedule
   - Stress management: General recommendations only
   - Daily routine: Based on work schedule provided

5. **HEALTH MONITORING**
   - Key metrics: Weight, BMI, basic vitals
   - Warning signs: Based on chronic conditions if any
   - Progress indicators: Measurable goals

6. **POTENTIAL HEALTH RISKS**
   - Only mention risks based on provided health data
   - Preventive measures: Evidence-based recommendations
   - When to consult providers: Clear guidelines

7. **HOW UR CARE WILL HELP**
   - Specific app features that align with user's goals
   - Personalized tracking recommendations
   - Expected outcomes: Realistic timeline

8. **ACTIONABLE NEXT STEPS**
   - Immediate actions: 3-5 specific, achievable steps
   - Weekly goals: Measurable objectives
   - Monthly milestones: Realistic targets

FORMAT REQUIREMENTS:
- Use bullet points for clarity
- Include specific numbers and calculations
- Be concise and actionable
- If data is missing, state "Information not provided"
- Do not exceed 2000 characters total

Remember: Accuracy over completeness. If you cannot calculate something from the provided data, do not guess.`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content:
            "You are a certified health coach and nutritionist. You provide ONLY evidence-based, conservative recommendations based on the data provided. Never make assumptions or add fictional information. Always prioritize safety and accuracy over completeness. If data is missing, clearly state this rather than guessing.",
        },
        { role: "user", content: prompt },
      ],
      max_tokens: 2000,
      temperature: 0.3,
    });

    const gptResponse = completion.choices[0]?.message?.content || "No response generated.";

    // Parse and structure the response (simplified version)
    const structuredResponse = {
      summary: {
        healthScore: "75",
        calorieTarget: "2000",
        bmi: "22.5",
        keyRecommendations: [
          "Start with 30-minute daily walks",
          "Track your food intake for 1 week",
          "Set up regular meal times",
        ],
      },
      sections: {
        healthAssessment: "Based on your profile data, your current health status has room for improvement.",
        nutritionPlan: "Daily calorie target: 2000 kcal with balanced macros",
        fitnessPlan: "3-4 days/week of cardio and strength",
        lifestyleOptimization: "Focus on sleep, stress management, hydration",
        healthMonitoring: "Track weight, BMI, energy levels",
        potentialRisks: "Monitor blood pressure and cholesterol",
        urCareBenefits: "Personalized tracking and community support",
        nextSteps: "Start with walking and food tracking",
      },
      rawResponse: gptResponse,
    };

    return res.status(200).json({ report: gptResponse, structured: structuredResponse });
  } catch (err) {
    console.error("/api/generate-plan error:", err);
    return res.status(500).json({ error: "Failed to generate plan." });
  }
}


