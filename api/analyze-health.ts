import type { VercelRequest, VercelResponse } from "@vercel/node";

interface HealthData {
  demographics: {
    age: number;
    gender: string;
    height: string;
    weight: string;
  };
  lifestyle: {
    sleepTime: string;
    wakeUpTime: string;
    workSchedule: {
      start: string;
      end: string;
    };
    mealTimes: {
      breakfast: string;
      lunch: string;
      dinner: string;
    };
    workoutTime: string;
  };
  health: {
    chronicConditions: string[];
    medications: string[];
    healthGoals: string[];
    dietType: string;
    bloodGroup: string;
  };
  onboardingDetails: any;
}

interface HealthMetric {
  id: string;
  name: string;
  value: string;
  target: string;
  status: "good" | "bad";
  icon: string;
  description: string;
}

interface AIHealthAnalysis {
  overallScore: number;
  metrics: HealthMetric[];
  riskFactors: string[];
  recommendations: string[];
}

// OpenAI API integration
async function generateAIHealthAnalysis(
  data: HealthData
): Promise<AIHealthAnalysis> {
  const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

  if (!OPENAI_API_KEY) {
    console.log(
      "OpenAI API key not configured, falling back to basic analysis"
    );
    throw new Error("OpenAI API key not configured");
  }

  const prompt = `
You are a health analysis AI. Based on the following user data, provide a comprehensive health analysis.

User Data:
- Age: ${data.demographics.age}, Gender: ${data.demographics.gender}
- Height: ${data.demographics.height}cm, Weight: ${data.demographics.weight}kg
- Sleep: ${data.lifestyle.sleepTime} - ${data.lifestyle.wakeUpTime}
- Work: ${data.lifestyle.workSchedule.start} - ${
    data.lifestyle.workSchedule.end
  }
- Meals: Breakfast: ${data.lifestyle.mealTimes.breakfast}, Lunch: ${
    data.lifestyle.mealTimes.lunch
  }, Dinner: ${data.lifestyle.mealTimes.dinner}
- Workout Time: ${data.lifestyle.workoutTime}
- Chronic Conditions: ${data.health.chronicConditions?.join(", ") || "None"}
- Medications: ${data.health.medications?.join(", ") || "None"}
- Health Goals: ${data.health.healthGoals?.join(", ") || "None specified"}
- Diet Type: ${data.health.dietType || "Not specified"}
- Blood Group: ${data.health.bloodGroup || "Not specified"}

Please provide a JSON response with the following structure:
{
  "overallScore": <number 0-100>,
  "metrics": [
    {
      "id": "unique-id",
      "name": "Metric Name",
      "value": "current value",
      "target": "target value",
      "status": "good" or "bad",
      "description": "brief explanation"
    }
  ],
  "riskFactors": ["list of health risk factors"],
  "recommendations": ["list of actionable recommendations"]
}

Focus on these key health metrics:
1. BMI and weight status
2. Sleep quality and duration
3. Physical activity level
4. Nutrition assessment
5. Stress indicators
6. Health risk factors

Provide specific, actionable insights based on the data provided.
`;

  try {
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
              "You are a professional health analyst. Provide accurate, helpful health insights based on user data. Always respond with valid JSON only.",
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

    const result = await response.json();
    const content = result.choices[0]?.message?.content;

    if (!content) {
      throw new Error("No content received from OpenAI");
    }

    // Parse the JSON response
    const analysis = JSON.parse(content);
    return analysis;
  } catch (error) {
    console.error("Error calling OpenAI API:", error);
    throw error;
  }
}

// Fallback analysis when OpenAI is not available
function generateFallbackAnalysis(data: HealthData): AIHealthAnalysis {
  const metrics: HealthMetric[] = [];
  let overallScore = 75;

  // BMI Analysis
  if (data.demographics.height && data.demographics.weight) {
    const heightM = parseInt(data.demographics.height) / 100;
    const weightKg = parseInt(data.demographics.weight);
    const bmi = weightKg / (heightM * heightM);

    let bmiStatus: "good" | "bad" = "good";
    let bmiDescription = "Normal BMI range";

    if (bmi < 18.5 || bmi > 24.9) {
      bmiStatus = "bad";
      bmiDescription = bmi < 18.5 ? "Underweight" : "Overweight";
      overallScore -= 10;
    } else {
      overallScore += 10;
    }

    metrics.push({
      id: "bmi",
      name: "BMI Score",
      value: bmi.toFixed(1),
      target: "18.5-24.9",
      status: bmiStatus,
      icon: "TrendingUp",
      description: bmiDescription,
    });
  }

  // Sleep Quality
  if (data.lifestyle.sleepTime && data.lifestyle.wakeUpTime) {
    const sleepHour = parseInt(data.lifestyle.sleepTime.split(":")[0]);
    const wakeHour = parseInt(data.lifestyle.wakeUpTime.split(":")[0]);
    const sleepDuration =
      wakeHour >= sleepHour ? wakeHour - sleepHour : 24 - sleepHour + wakeHour;

    const sleepStatus: "good" | "bad" =
      sleepDuration >= 7 && sleepDuration <= 9 ? "good" : "bad";
    if (sleepStatus === "good") overallScore += 15;
    else overallScore -= 10;

    metrics.push({
      id: "sleep",
      name: "Sleep Quality",
      value: `${sleepDuration}h`,
      target: "7-9h",
      status: sleepStatus,
      icon: "Brain",
      description:
        sleepStatus === "good" ? "Optimal sleep duration" : "Needs improvement",
    });
  }

  // Health Risk Assessment
  const riskFactors = data.health.chronicConditions?.length || 0;
  const medicationCount = data.health.medications?.length || 0;
  const totalRiskScore = Math.max(
    0,
    100 - (riskFactors * 15 + medicationCount * 10)
  );

  if (riskFactors > 0 || medicationCount > 0)
    overallScore -= riskFactors * 5 + medicationCount * 3;

  metrics.push({
    id: "health-risk",
    name: "Health Risk",
    value: totalRiskScore.toString(),
    target: "80+",
    status: totalRiskScore >= 80 ? "good" : "bad",
    icon: "Shield",
    description:
      totalRiskScore >= 80
        ? "Low risk profile"
        : "Moderate risk factors present",
  });

  // Activity Level
  const hasActiveGoals = data.health.healthGoals?.some(
    (goal) =>
      goal.toLowerCase().includes("fitness") ||
      goal.toLowerCase().includes("exercise") ||
      goal.toLowerCase().includes("active")
  );

  const activityScore = hasActiveGoals ? 85 : 65;
  if (hasActiveGoals) overallScore += 10;

  metrics.push({
    id: "activity",
    name: "Activity Level",
    value: activityScore.toString(),
    target: "75+",
    status: activityScore >= 75 ? "good" : "bad",
    icon: "Activity",
    description: hasActiveGoals
      ? "Active lifestyle goals"
      : "Could be more active",
  });

  // Nutrition Assessment
  const hasHealthyDiet =
    data.health.dietType &&
    ["vegetarian", "vegan", "mediterranean", "balanced"].includes(
      data.health.dietType.toLowerCase()
    );

  const nutritionScore = hasHealthyDiet ? 80 : 60;
  if (hasHealthyDiet) overallScore += 5;

  metrics.push({
    id: "nutrition",
    name: "Nutrition Score",
    value: nutritionScore.toString(),
    target: "70+",
    status: nutritionScore >= 70 ? "good" : "bad",
    icon: "Apple",
    description: hasHealthyDiet
      ? "Healthy diet pattern"
      : "Room for improvement",
  });

  // Cap overall score
  overallScore = Math.max(30, Math.min(100, overallScore));

  const riskFactorsList = [];
  if (riskFactors > 0)
    riskFactorsList.push("Chronic health conditions present");
  if (medicationCount > 0) riskFactorsList.push("Multiple medications");
  if (!hasActiveGoals) riskFactorsList.push("Sedentary lifestyle indicators");
  if (!hasHealthyDiet) riskFactorsList.push("Suboptimal nutrition patterns");

  const recommendations = [
    "Focus on consistent sleep schedule (7-9 hours)",
    "Incorporate regular physical activity",
    "Maintain balanced nutrition",
    "Monitor and manage stress levels",
    "Regular health check-ups",
  ];

  return {
    overallScore,
    metrics,
    riskFactors: riskFactorsList,
    recommendations,
  };
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Set CORS headers
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const healthData = req.body as HealthData;

    if (!healthData || !healthData.demographics) {
      console.error("Invalid health data received:", healthData);
      return res.status(400).json({ error: "Invalid health data provided" });
    }

    console.log("Analyzing health data for user...");

    let analysis: AIHealthAnalysis;

    try {
      // Try OpenAI analysis first
      analysis = await generateAIHealthAnalysis(healthData);
      console.log("OpenAI analysis completed successfully");
    } catch (error) {
      console.log(
        "OpenAI analysis failed, using fallback:",
        error instanceof Error ? error.message : error
      );
      // Fallback to basic analysis
      analysis = generateFallbackAnalysis(healthData);
      console.log("Fallback analysis completed successfully");
    }

    return res.status(200).json(analysis);
  } catch (error) {
    console.error("Health analysis error:", error);
    return res.status(500).json({
      error: "Failed to analyze health data",
      details: error instanceof Error ? error.message : "Unknown error",
    });
  }
}
