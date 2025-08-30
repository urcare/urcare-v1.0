import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import { OpenAI } from "openai";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json({ limit: "1mb" }));

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// Helper function to parse and structure the AI response
function parseHealthPlanResponse(rawResponse) {
  try {
    // Extract key sections from the response
    const sections = {
      healthAssessment: extractSection(rawResponse, "HEALTH ASSESSMENT"),
      nutritionPlan: extractSection(rawResponse, "NUTRITION PLAN"),
      fitnessPlan: extractSection(rawResponse, "FITNESS PLAN"),
      lifestyleOptimization: extractSection(
        rawResponse,
        "LIFESTYLE OPTIMIZATION"
      ),
      healthMonitoring: extractSection(rawResponse, "HEALTH MONITORING"),
      potentialRisks: extractSection(rawResponse, "POTENTIAL HEALTH RISKS"),
      urCareBenefits: extractSection(rawResponse, "HOW UR CARE WILL HELP"),
      nextSteps: extractSection(rawResponse, "ACTIONABLE NEXT STEPS"),
    };

    // Extract key metrics
    const healthScore = extractHealthScore(rawResponse);
    const calorieTarget = extractCalorieTarget(rawResponse);
    const bmi = extractBMI(rawResponse);

    return {
      summary: {
        healthScore,
        calorieTarget,
        bmi,
        keyRecommendations: extractKeyRecommendations(rawResponse),
      },
      sections,
      rawResponse,
    };
  } catch (error) {
    console.error("Error parsing health plan response:", error);
    return {
      summary: {
        healthScore: "N/A",
        calorieTarget: "N/A",
        bmi: "N/A",
        keyRecommendations: ["Unable to parse recommendations"],
      },
      sections: {},
      rawResponse,
    };
  }
}

function extractSection(text, sectionName) {
  const regex = new RegExp(
    `${sectionName}[\\s\\S]*?(?=\\d+\\.\\s\\*\\*|$)`,
    "i"
  );
  const match = text.match(regex);
  return match ? match[0].replace(sectionName, "").trim() : "";
}

function extractHealthScore(text) {
  const match = text.match(/health score[:\s]*(\d+)/i);
  return match ? match[1] : "N/A";
}

function extractCalorieTarget(text) {
  const match = text.match(/(\d+)\s*(?:kcal|calories)/i);
  return match ? match[1] : "N/A";
}

function extractBMI(text) {
  const match = text.match(/BMI[:\s]*(\d+\.?\d*)/i);
  return match ? match[1] : "N/A";
}

function extractKeyRecommendations(text) {
  const recommendations = [];
  const lines = text.split("\n");

  for (const line of lines) {
    if (line.includes("•") || line.includes("-") || line.includes("*")) {
      const cleanLine = line.replace(/^[\s•\-*]+/, "").trim();
      if (cleanLine && cleanLine.length > 10) {
        recommendations.push(cleanLine);
      }
    }
  }

  return recommendations.slice(0, 5); // Return top 5 recommendations
}

app.post("/api/generate-plan", async (req, res) => {
  try {
    const { profile } = req.body;
    if (!profile) {
      return res.status(400).json({ error: "Missing profile data" });
    }

    // Extract key information from profile
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

    // Create comprehensive prompt
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

    const gptResponse =
      completion.choices[0]?.message?.content || "No response generated.";

    // Parse and structure the response
    const structuredResponse = parseHealthPlanResponse(gptResponse);

    // Validate calculations
    const bmiValidation = validateBMI(
      userInfo.height,
      userInfo.weight,
      structuredResponse.summary.bmi
    );

    const calorieValidation = validateCalories(
      userInfo.age,
      userInfo.gender,
      userInfo.height,
      userInfo.weight,
      structuredResponse.summary.calorieTarget
    );

    // Add validation flags to response
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

    // If calculations are inaccurate, add warnings
    if (!bmiValidation || !calorieValidation) {
      structuredResponse.warnings = [];
      if (!bmiValidation) {
        structuredResponse.warnings.push(
          "BMI calculation may be inaccurate - please verify with healthcare provider"
        );
      }
      if (!calorieValidation) {
        structuredResponse.warnings.push(
          "Calorie calculation may be inaccurate - please verify with healthcare provider"
        );
      }
    }

    res.json({
      report: gptResponse,
      structured: structuredResponse,
    });
  } catch (err) {
    console.error("Error generating plan:", err);
    res.status(500).json({ error: "Failed to generate plan." });
  }
});

app.listen(PORT, () => {
  console.log(`AI backend listening on port ${PORT}`);
});
