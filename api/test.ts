export default async function handler(req: any, res: any) {
  // Set CORS headers
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  try {
    return res.status(200).json({
      message: "Test API working!",
      timestamp: new Date().toISOString(),
      method: req.method,
      hasBody: !!req.body,
    });
  } catch (error) {
    console.error("Test API error:", error);
    return res.status(500).json({ error: "Test API failed" });
  }
}
