// Vercel Serverless Function: Generate Health Plan via OpenAI
// Uses environment variable OPENAI_API_KEY configured in Vercel

import type { VercelRequest, VercelResponse } from "@vercel/node";

type UserProfile = {
  full_name?: string;
  age?: number;
  date_of_birth?: number | string;
  gender?: string;
  height_cm?: number;
  height_feet?: number;
  weight_kg?: number;
  weight_lb?: number;
  unit_system?: "metric" | "imperial" | string;
  preferences?: Record<string, any>;
};

function extractSection(text: string, sectionName: string): string {
  const regex = new RegExp(
    `${sectionName}[\\s\\S]*?(?=\\d+\\.\\s\\*\\*|$)`,
    "i"
  );
  const match = text.match(regex);
  return match ? match[0].replace(sectionName, "").trim() : "";
}

function extractHealthScore(text: string): string {
  const match = text.match(/health score[:\s]*(\d+)/i);
  return match ? match[1] : "N/A";
}

function extractCalorieTarget(text: string): string {
  const match = text.match(/(\d+)\s*(?:kcal|calories)/i);
  return match ? match[1] : "N/A";
}

function extractBMI(text: string): string {
  const match = text.match(/BMI[:\s]*(\d+\.?\d*)/i);
  return match ? match[1] : "N/A";
}

function extractKeyRecommendations(text: string): string[] {
  const recommendations: string[] = [];
  const lines = text.split("\n");
  for (const line of lines) {
    if (line.includes("•") || line.includes("-") || line.includes("*")) {
      const cleanLine = line.replace(/^[\s•\-*]+/, "").trim();
      if (cleanLine && cleanLine.length > 10) {
        recommendations.push(cleanLine);
      }
    }
  }
  return recommendations.slice(0, 5);
}

function validateBMI(
  height: number,
  weight: number,
  calculatedBMI: string
): boolean {
  if (!height || !weight || !calculatedBMI) return false;
  let heightM = height;
  let weightKg = weight;
  if (height < 10) {
    heightM = height * 0.3048;
  }
  if (weight > 200) {
    weightKg = weight * 0.453592;
  }
  const expectedBMI = weightKg / (heightM * heightM);
  const calculated = parseFloat(calculatedBMI);
  return Math.abs(expectedBMI - calculated) / expectedBMI < 0.1;
}

function validateCalories(
  age: number,
  gender: string,
  height: number,
  weight: number,
  calculatedCalories: string
): boolean {
  if (!age || !gender || !height || !weight || !calculatedCalories)
    return false;
  let heightCm = height;
  let weightKg = weight;
  if (height < 10) {
    heightCm = height * 30.48;
  }
  if (weight > 200) {
    weightKg = weight * 0.453592;
  }
  let bmr: number;
  if (gender.toLowerCase() === "male") {
    bmr = 10 * weightKg + 6.25 * heightCm - 5 * age + 5;
  } else {
    bmr = 10 * weightKg + 6.25 * heightCm - 5 * age - 161;
  }
  const tdee = bmr * 1.2;
  const calculated = parseFloat(calculatedCalories);
  return Math.abs(tdee - calculated) / tdee < 0.2;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "authorization, x-client-info, apikey, content-type"
  );
  if (req.method === "OPTIONS") {
    return res.status(200).send("ok");
  }
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const profile = (req.body?.profile ?? req.body) as UserProfile | undefined;
    if (!profile)
      return res.status(400).json({ error: "Missing profile data" });

    const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
    if (!OPENAI_API_KEY) {
      return res.status(500).json({ error: "OpenAI not configured" });
    }

    const userInfo = {
      name: profile.full_name,
      age: (profile.age as any) || profile.date_of_birth,
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

    const completionResp = await fetch(
      "https://api.openai.com/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
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
        }),
      }
    );

    if (!completionResp.ok) {
      const errText = await completionResp.text();
      return res
        .status(500)
        .json({ error: "OpenAI request failed", details: errText });
    }

    const data = await completionResp.json();
    const gptResponse: string =
      data?.choices?.[0]?.message?.content || "No response generated.";

    const structuredResponse: any = {
      summary: {
        healthScore: extractHealthScore(gptResponse),
        calorieTarget: extractCalorieTarget(gptResponse),
        bmi: extractBMI(gptResponse),
        keyRecommendations: extractKeyRecommendations(gptResponse),
      },
      sections: {
        healthAssessment: extractSection(gptResponse, "HEALTH ASSESSMENT"),
        nutritionPlan: extractSection(gptResponse, "NUTRITION PLAN"),
        fitnessPlan: extractSection(gptResponse, "FITNESS PLAN"),
        lifestyleOptimization: extractSection(
          gptResponse,
          "LIFESTYLE OPTIMIZATION"
        ),
        healthMonitoring: extractSection(gptResponse, "HEALTH MONITORING"),
        potentialRisks: extractSection(gptResponse, "POTENTIAL HEALTH RISKS"),
        urCareBenefits: extractSection(gptResponse, "HOW UR CARE WILL HELP"),
        nextSteps: extractSection(gptResponse, "ACTIONABLE NEXT STEPS"),
      },
      rawResponse: gptResponse,
    };

    const bmiValidation = validateBMI(
      userInfo.height as unknown as number,
      userInfo.weight as unknown as number,
      structuredResponse.summary.bmi
    );
    const calorieValidation = validateCalories(
      userInfo.age as unknown as number,
      userInfo.gender as unknown as string,
      userInfo.height as unknown as number,
      userInfo.weight as unknown as number,
      structuredResponse.summary.calorieTarget
    );
    structuredResponse.validation = {
      bmiAccurate: bmiValidation,
      caloriesAccurate: calorieValidation,
      dataComplete: !!(
        userInfo.height &&
        userInfo.weight &&
        userInfo.age &&
        userInfo.gender
      ),
    };

    if (!bmiValidation || !calorieValidation) {
      structuredResponse.warnings = [] as string[];
      if (!bmiValidation)
        structuredResponse.warnings.push(
          "BMI calculation may be inaccurate - please verify with healthcare provider"
        );
      if (!calorieValidation)
        structuredResponse.warnings.push(
          "Calorie calculation may be inaccurate - please verify with healthcare provider"
        );
    }

    return res
      .status(200)
      .json({ report: gptResponse, structured: structuredResponse });
  } catch (error: any) {
    console.error("Error generating plan (vercel fn):", error);
    return res.status(500).json({ error: "Failed to generate plan." });
  }
}
