import { OpenAI } from "openai";

const openai = process.env.VITE_OPENAI_API_KEY
  ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
  : null;

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
    `\\*\\*${sectionName}\\*\\*[\\s\\S]*?(?=\\*\\*|$)`,
    "i"
  );
  const match = text.match(regex);
  return match ? match[0].trim() : `Section not found: ${sectionName}`;
}

function extractHealthScore(text) {
  const match = text.match(/Health Score[:\s]*(\d+)/i);
  return match ? match[1] : "N/A";
}

function extractCalorieTarget(text) {
  const match = text.match(/Calorie Target[:\s]*(\d+)/i);
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
    if (
      line.includes("•") ||
      line.includes("-") ||
      line.includes("1.") ||
      line.includes("2.")
    ) {
      const clean = line.replace(/^[\s•\-\d\.]+/, "").trim();
      if (clean && clean.length > 10) {
        recommendations.push(clean);
      }
    }
  }

  return recommendations.slice(0, 5); // Return first 5 recommendations
}

function generateMockHealthPlan(profile) {
  const age = profile.age || 30;
  const height = parseFloat(profile.height_cm || profile.height_feet || "170");
  const weight = parseFloat(profile.weight_kg || profile.weight_lb || "70");

  // Convert to metric if needed
  const heightCm = height < 10 ? height * 30.48 : height;
  const weightKg = weight > 200 ? weight * 0.453592 : weight;

  const heightM = heightCm / 100;
  const bmi = (weightKg / (heightM * heightM)).toFixed(1);

  // Calculate BMR using Mifflin-St Jeor equation
  let bmr;
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

  const mockResponse = `HEALTH ASSESSMENT
Based on your profile data:
• BMI: ${bmi} (Normal)
• Health Score: ${healthScore}/100
• Current Status: Good

NUTRITION PLAN
• Daily Calorie Target: ${tdee} kcal
• Protein: ${Math.round(weightKg * 1.2)}g (1.2g/kg body weight)
• Carbohydrates: ${Math.round(tdee * 0.5)}g (50% of calories)
• Fats: ${Math.round(tdee * 0.3)}g (30% of calories)
• Meal Timing: Based on your schedule preferences

FITNESS PLAN
• Workout Frequency: 3-4 days per week
• Exercise Types: Cardio + Strength training
• Duration: 30-45 minutes per session
• Focus: General fitness and health maintenance

LIFESTYLE OPTIMIZATION
• Sleep: 7-9 hours per night
• Stress Management: Daily meditation or relaxation
• Hydration: 8-10 glasses of water daily
• Regular Health Checkups: Annual physical

HEALTH MONITORING
• Track: Weight, BMI, energy levels
• Measure: Progress every 2 weeks
• Adjust: Plan based on results

POTENTIAL HEALTH RISKS
• Monitor: Blood pressure, cholesterol
• Prevention: Regular exercise, balanced diet
• Consultation: Healthcare provider for concerns

HOW UR CARE WILL HELP
• Personalized tracking dashboard
• Progress monitoring and insights
• Community support and motivation
• Expert guidance and resources

ACTIONABLE NEXT STEPS
1. Start with 30-minute daily walks
2. Track your food intake for 1 week
3. Set up regular meal times
4. Schedule your first workout session
5. Monitor your progress weekly`;

  return {
    summary: {
      healthScore: healthScore.toString(),
      calorieTarget: tdee.toString(),
      bmi: bmi,
      keyRecommendations: [
        "Start with 30-minute daily walks",
        "Track your food intake for 1 week",
        "Set up regular meal times",
        "Schedule your first workout session",
        "Monitor your progress weekly",
      ],
    },
    sections: {
      healthAssessment:
        "Based on your profile data, your current health status is good with room for improvement.",
      nutritionPlan: `Daily calorie target: ${tdee} kcal with balanced macronutrients.`,
      fitnessPlan:
        "3-4 days per week of combined cardio and strength training.",
      lifestyleOptimization:
        "Focus on sleep, stress management, and hydration.",
      healthMonitoring: "Track weight, BMI, and energy levels regularly.",
      potentialRisks: "Monitor blood pressure and cholesterol levels.",
      urCareBenefits: "Personalized tracking and community support.",
      nextSteps: "Start with walking and food tracking.",
    },
    rawResponse: mockResponse,
  };
}

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    res.status(200).end();
    return;
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { profile } = req.body;
    if (!profile) {
      return res.status(400).json({ error: "Missing profile data" });
    }

    // If OpenAI is not configured, return a mock response
    if (!openai) {
      console.log("OpenAI not configured, returning mock response");
      const mockResponse = generateMockHealthPlan(profile);
      return res.json({
        report: mockResponse.rawResponse,
        structured: mockResponse,
      });
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

    // URCARE Master Health AI – integrated system prompt
    const prompt = `URCARE Master Health AI System Prompt

Identity and mission:
- Name: URCARE Master Health AI
- Purpose: Create safe, hyper-personalized, evidence-based daily protocols that adapt in real time to user data for wellness, prevention, and management of lifestyle/chronic conditions.
- Tone: Supportive, clear, human, non-judgmental, culturally aware, motivational. Audience: Adults 25–70+ across diverse geographies.

Safety and clinical governance:
- Medical disclaimer: General educational guidance; not medical advice.
- Contraindications: pregnancy/post-op/frail: avoid high-intensity/risky; diabetes/CVD/CKD/liver/HTN/retinopathy: favor low-risk; avoid supplement–drug interactions; no sauna with unstable CVD; no cold plunge with arrhythmias/uncontrolled HTN.
- Red flags: chest pain, severe dyspnea, syncope, focal neuro deficits, vision loss, severe abdominal pain, persistent vomiting, confusion, blood in stool/urine; extreme glucose issues; rapid unexplained weight loss; fever >38.5°C >3 days; severe dehydration; eating disorder behaviors; self-harm risk; harmful substance misuse. If present: pause plan, advise urgent care, provide only low‑risk steps (hydration, rest).
- Medication rules: never initiate/discontinue/change dosages; provide only general timing guidance; avoid drastic carb restriction or sudden intense exercise for insulin/sulfonylurea users without clinician input.

Evidence policy:
- Prefer consensus guidelines, systematic reviews, RCTs, respected organizations.
- When impactful for safety/decisions, include 1–3 concise citations [1], [2]. If uncertain, state unknowns and propose safe defaults.

Planning engine:
- Daily timeline with time-stamped steps from wake to sleep; specify what/how much/when/how/why (brief). Quantify sets, reps, RPE, tempo, rest, durations. Nutrition in grams/portions, plate method, sequencing, glycemic strategies. Include safety notes and same‑day alternatives.
- Adaptation loop: use adherence/biometrics/feedback to adjust volumes, calories, timing, and complexity. Update a 0–100 health score daily with a one‑line rationale and 1–2 top focus items for tomorrow.

Nutrition engine:
- Protein 1.2–2.2 g/kg/day (tailor to context), TDEE via Mifflin‑St Jeor, hydration 30–35 ml/kg/day unless restricted, meal sequencing hacks (water pre‑meal, protein/veg first, post‑meal walk). Localize foods and provide swaps.

Exercise engine:
- Strength 2–4×/week; cardio base + optional intervals if safe; provide exact sets/reps/RPE/tempo/rest, cues, warm‑up/cool‑down; joint‑safe modifiers and equipment alternatives.

Sleep, stress, environment:
- Regular sleep/wake, morning light, caffeine cutoff 8h pre‑bed, cool/dark/quiet room. Breathing 5–10 min/day; gratitude/visualization prompts. Hourly breaks, sunlight when safe.

Supplements (non‑prescriptive):
- Only widely accepted basics if suitable (e.g., Vitamin D if deficient, omega‑3 from fish/algae, creatine 3–5 g/day if kidneys normal) with clinician confirmation and interaction caution.

Behavior change:
- Tiny habits, If‑Then plans, environment design, streaks; celebrate small wins; reschedule misses with micro‑alternatives.

Output and UI rules:
- Be concise/actionable. Each item: title, time, what/how much/how, brief why, safety/alt. Use localized foods/units and add concise citations when safety‑relevant.

USER DATA:

Personal Information:
${JSON.stringify(userInfo, null, 2)}

Health Information:
${JSON.stringify(healthData, null, 2)}

Schedule Information:
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
            "You are URCARE Master Health AI. You provide ONLY evidence-based, conservative recommendations based on the data provided. Never make assumptions or add fictional information. Always prioritize safety and accuracy over completeness. If data is missing, clearly state this rather than guessing.",
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

    res.json({
      report: structuredResponse.rawResponse,
      structured: structuredResponse,
    });
  } catch (error) {
    console.error("Error in generate-plan API:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}
