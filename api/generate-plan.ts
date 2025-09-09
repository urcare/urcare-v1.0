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
  // Set CORS headers
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "authorization, x-client-info, apikey, content-type"
  );

  // Handle preflight requests
  if (req.method === "OPTIONS") {
    return res.status(200).send("ok");
  }

  // Only allow POST requests
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    // Extract and validate profile data
    const profile = (req.body?.profile ?? req.body) as UserProfile | undefined;
    if (!profile) {
      console.error("Missing profile data in request");
      return res.status(400).json({ error: "Missing profile data" });
    }

    // Check OpenAI API key
    const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
    if (!OPENAI_API_KEY) {
      console.error("OpenAI API key not configured");
      return res.status(500).json({ error: "OpenAI not configured" });
    }

    console.log(
      "Generating health plan for profile:",
      profile.full_name || "Unknown"
    );

    // Process and validate user data
    const userInfo = {
      name: profile.full_name || "User",
      age:
        profile.age ||
        (profile.date_of_birth
          ? new Date().getFullYear() -
            new Date(profile.date_of_birth).getFullYear()
          : 30),
      gender: profile.gender || "male",
      height: profile.height_cm || profile.height_feet || 170,
      weight: profile.weight_kg || profile.weight_lb || 70,
      unitSystem: profile.unit_system || "metric",
    };

    // Ensure we have valid numeric values
    if (typeof userInfo.height !== "number" || userInfo.height <= 0) {
      userInfo.height = 170; // Default height in cm
    }
    if (typeof userInfo.weight !== "number" || userInfo.weight <= 0) {
      userInfo.weight = 70; // Default weight in kg
    }
    if (
      typeof userInfo.age !== "number" ||
      userInfo.age <= 0 ||
      userInfo.age > 120
    ) {
      userInfo.age = 30; // Default age
    }

    const preferences = profile.preferences || {};
    const healthData = {
      bloodGroup: preferences.health?.blood_group || "Not specified",
      chronicConditions: preferences.health?.chronic_conditions || [],
      medications: preferences.health?.medications || [],
      healthGoals: preferences.health?.health_goals || ["General wellness"],
      dietType: preferences.meals?.diet_type || "Balanced",
      allergies: preferences.health?.allergies || "None known",
    };

    const schedule = {
      wakeUpTime: preferences.schedule?.wake_up_time || "07:00",
      sleepTime: preferences.schedule?.sleep_time || "23:00",
      workStart: preferences.schedule?.work_start || "09:00",
      workEnd: preferences.schedule?.work_end || "17:00",
      breakfastTime: preferences.meals?.breakfast_time || "08:00",
      lunchTime: preferences.meals?.lunch_time || "13:00",
      dinnerTime: preferences.meals?.dinner_time || "19:00",
      workoutTime: preferences.schedule?.workout_time || "18:00",
    };

    const prompt = `You are a certified health coach. Create a personalized health plan based on the user's data.

USER PROFILE:
- Name: ${userInfo.name}
- Age: ${userInfo.age} years
- Gender: ${userInfo.gender}
- Height: ${userInfo.height} cm
- Weight: ${userInfo.weight} kg
- Health Goals: ${healthData.healthGoals.join(", ")}
- Diet Type: ${healthData.dietType}
- Chronic Conditions: ${
      healthData.chronicConditions.length > 0
        ? healthData.chronicConditions.join(", ")
        : "None"
    }
- Allergies: ${healthData.allergies}

DAILY SCHEDULE:
- Wake up: ${schedule.wakeUpTime}
- Sleep: ${schedule.sleepTime}
- Work: ${schedule.workStart} - ${schedule.workEnd}
- Workout: ${schedule.workoutTime}

INSTRUCTIONS:
1. Calculate BMI using: BMI = weight(kg) / (height(m))²
2. Calculate BMR using Mifflin-St Jeor equation
3. Provide realistic, safe recommendations
4. Keep response under 1500 characters
5. Use bullet points for clarity

RESPONSE FORMAT:
**HEALTH ASSESSMENT**
• BMI: [calculated value]
• Health Score: [0-100]
• Status: [brief analysis]

**NUTRITION PLAN**
• Daily Calories: [calculated target]
• Protein: [g per day]
• Carbs: [% of calories]
• Fats: [% of calories]

**FITNESS PLAN**
• Frequency: [days per week]
• Duration: [minutes per session]
• Focus: [cardio/strength/mixed]

**LIFESTYLE TIPS**
• Sleep: [recommendations]
• Hydration: [daily water intake]
• Stress: [management tips]

**NEXT STEPS**
• [3-5 specific actions]`;

    // Make OpenAI API request with timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout

    try {
      const completionResp = await fetch(
        "https://api.openai.com/v1/chat/completions",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${OPENAI_API_KEY}`,
          },
          body: JSON.stringify({
            model: "gpt-4o-mini", // Use cheaper model for better reliability
            messages: [
              {
                role: "system",
                content:
                  "You are a certified health coach. Provide accurate, evidence-based health recommendations. Always include specific numbers and calculations. Keep responses concise and actionable.",
              },
              { role: "user", content: prompt },
            ],
            max_tokens: 1500,
            temperature: 0.2, // Lower temperature for more consistent responses
          }),
          signal: controller.signal,
        }
      );

      clearTimeout(timeoutId);

      if (!completionResp.ok) {
        const errText = await completionResp.text();
        console.error("OpenAI API error:", errText);
        throw new Error(`OpenAI request failed: ${completionResp.status}`);
      }

      const data = await completionResp.json();
      const gptResponse: string =
        data?.choices?.[0]?.message?.content || "No response generated.";

      if (!gptResponse || gptResponse.trim().length === 0) {
        throw new Error("Empty response from OpenAI");
      }

      console.log("OpenAI response received, length:", gptResponse.length);

      // Create structured response with fallback values
      const structuredResponse = {
        summary: {
          healthScore: extractHealthScore(gptResponse) || "75",
          calorieTarget: extractCalorieTarget(gptResponse) || "2000",
          bmi:
            extractBMI(gptResponse) ||
            (userInfo.weight / (userInfo.height / 100) ** 2).toFixed(1),
          keyRecommendations: extractKeyRecommendations(gptResponse).slice(
            0,
            3
          ),
        },
        sections: {
          healthAssessment:
            extractSection(gptResponse, "HEALTH ASSESSMENT") ||
            "Health assessment based on your profile data.",
          nutritionPlan:
            extractSection(gptResponse, "NUTRITION PLAN") ||
            "Balanced nutrition plan with proper macronutrient distribution.",
          fitnessPlan:
            extractSection(gptResponse, "FITNESS PLAN") ||
            "Regular exercise routine tailored to your goals.",
          lifestyleTips:
            extractSection(gptResponse, "LIFESTYLE TIPS") ||
            "Healthy lifestyle recommendations for optimal wellness.",
          nextSteps:
            extractSection(gptResponse, "NEXT STEPS") ||
            "Start with small, achievable changes to build healthy habits.",
        },
        rawResponse: gptResponse,
        generatedAt: new Date().toISOString(),
        userProfile: {
          name: userInfo.name,
          age: userInfo.age,
          gender: userInfo.gender,
        },
      };

      console.log("Structured response created successfully");

      return res.status(200).json({
        success: true,
        report: gptResponse,
        structured: structuredResponse,
      });
    } catch (fetchError: any) {
      clearTimeout(timeoutId);
      console.error("Error in OpenAI request:", fetchError);

      // Return fallback response instead of failing completely
      const fallbackResponse = {
        summary: {
          healthScore: "75",
          calorieTarget: "2000",
          bmi: (userInfo.weight / (userInfo.height / 100) ** 2).toFixed(1),
          keyRecommendations: [
            "Maintain a balanced diet with proper nutrition",
            "Engage in regular physical activity",
            "Get adequate sleep and manage stress",
          ],
        },
        sections: {
          healthAssessment: `Based on your profile (Age: ${
            userInfo.age
          }, BMI: ${(userInfo.weight / (userInfo.height / 100) ** 2).toFixed(
            1
          )}), you're on track for good health.`,
          nutritionPlan: `Daily calorie target: ~2000 kcal. Focus on balanced macronutrients and regular meal timing.`,
          fitnessPlan: `Aim for 3-5 days of exercise per week, 30-45 minutes per session.`,
          lifestyleTips: `Maintain consistent sleep schedule and stay hydrated throughout the day.`,
          nextSteps: [
            "Start with 10 minutes of daily exercise",
            "Track your water intake",
            "Establish a regular sleep routine",
          ],
        },
        rawResponse:
          "Health plan generated with basic recommendations due to AI service unavailability.",
        generatedAt: new Date().toISOString(),
        userProfile: {
          name: userInfo.name,
          age: userInfo.age,
          gender: userInfo.gender,
        },
        fallback: true,
        error: fetchError.message,
      };

      return res.status(200).json({
        success: true,
        report: fallbackResponse.rawResponse,
        structured: fallbackResponse,
      });
    }
  } catch (error: any) {
    console.error("Error generating plan (vercel fn):", error);
    return res.status(500).json({ error: "Failed to generate plan." });
  }
}
