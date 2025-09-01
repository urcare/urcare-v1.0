// Vercel Serverless Function to generate a health plan
// POST /api/generate-plan

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

    // For now, return a simple mock response to test if the function works
    const mockResponse = {
      summary: "Your custom health plan is ready!",
      recommendations: [
        "Daily Calorie Target: 2000 kcal",
        "Health Score: 75/100",
        "Start with 30-minute daily walks",
        "Track your food intake for 1 week",
      ],
      detailedReport: "This is a test response to verify the API is working.",
      structured: {
        summary: {
          healthScore: "75",
          calorieTarget: "2000",
          bmi: "22.5",
        },
      },
    };

    return res.status(200).json(mockResponse);
  } catch (err) {
    console.error("/api/generate-plan error:", err);
    return res.status(500).json({ error: "Failed to generate plan." });
  }
}
