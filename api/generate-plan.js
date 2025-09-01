// Vercel API Route for AI Plan Generation
// This replaces the need for a separate Express server

import OpenAI from "openai";

// Initialize OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || process.env.VITE_OPENAI_API_KEY,
});

export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  // Handle preflight request
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  try {
    const { profile } = req.body;

    if (!profile) {
      return res.status(400).json({ error: "Missing profile data" });
    }

    console.log("Generating plan for profile:", profile);

    // Check if OpenAI API key is available
    if (!process.env.OPENAI_API_KEY && !process.env.VITE_OPENAI_API_KEY) {
      console.error("OpenAI API key not found");
      return res.status(500).json({ error: "OpenAI API key not configured" });
    }

    // Generate AI response
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: `You are a health and wellness expert. Create a personalized health plan based on the user's profile. 
          Return a JSON response with the following structure:
          {
            "summary": "Brief overview of the plan",
            "recommendations": ["Array of specific recommendations"],
            "mealPlan": {
              "breakfast": "Breakfast recommendation",
              "lunch": "Lunch recommendation", 
              "dinner": "Dinner recommendation",
              "snacks": "Snack recommendations"
            },
            "exercisePlan": {
              "frequency": "How often to exercise",
              "types": ["Types of exercises"],
              "duration": "Duration per session"
            },
            "lifestyleChanges": ["Array of lifestyle recommendations"],
            "nextSteps": ["Array of immediate action items"]
          }`,
        },
        {
          role: "user",
          content: `Create a health plan for this profile: ${JSON.stringify(
            profile
          )}`,
        },
      ],
      temperature: 0.7,
      max_tokens: 1000,
    });

    const aiResponse = completion.choices[0]?.message?.content;

    if (!aiResponse) {
      throw new Error("No response from AI");
    }

    // Try to parse JSON response
    let parsedResponse;
    try {
      parsedResponse = JSON.parse(aiResponse);
    } catch (parseError) {
      console.warn(
        "Failed to parse AI response as JSON, using as text:",
        parseError
      );
      parsedResponse = {
        summary: aiResponse,
        recommendations: [aiResponse],
        mealPlan: {
          breakfast: "AI-generated meal plan",
          lunch: "AI-generated meal plan",
          dinner: "AI-generated meal plan",
          snacks: "Healthy snacks",
        },
        exercisePlan: {
          frequency: "3-4 times per week",
          types: ["Cardio", "Strength training"],
          duration: "30-45 minutes",
        },
        lifestyleChanges: ["Follow AI recommendations"],
        nextSteps: ["Start with basic changes"],
      };
    }

    // Create the final response
    const healthPlanReport = {
      id: `plan_${Date.now()}`,
      userId: profile.id,
      generatedAt: new Date().toISOString(),
      profile: profile,
      plan: parsedResponse,
      status: "active",
    };

    console.log("Plan generated successfully");
    return res.status(200).json(healthPlanReport);
  } catch (error) {
    console.error("Error generating plan:", error);

    // Fallback to mock data if AI fails
    const mockResponse = {
      id: `plan_${Date.now()}`,
      userId: profile?.id || "unknown",
      generatedAt: new Date().toISOString(),
      profile: profile || {},
      plan: {
        summary: "Personalized health plan based on your profile",
        recommendations: [
          "Maintain regular meal times",
          "Exercise 3-4 times per week",
          "Stay hydrated throughout the day",
          "Get 7-8 hours of sleep",
        ],
        mealPlan: {
          breakfast: "Protein-rich breakfast with whole grains",
          lunch: "Balanced meal with lean protein and vegetables",
          dinner: "Light dinner with complex carbohydrates",
          snacks: "Nuts, fruits, or yogurt between meals",
        },
        exercisePlan: {
          frequency: "3-4 times per week",
          types: ["Cardio", "Strength training", "Flexibility"],
          duration: "30-45 minutes per session",
        },
        lifestyleChanges: [
          "Establish consistent sleep schedule",
          "Practice stress management techniques",
          "Limit processed foods",
          "Regular health check-ups",
        ],
        nextSteps: [
          "Start with one meal plan change",
          "Schedule exercise sessions",
          "Track your progress",
          "Review plan in 2 weeks",
        ],
      },
      status: "active",
    };

    return res.status(200).json(mockResponse);
  }
}
