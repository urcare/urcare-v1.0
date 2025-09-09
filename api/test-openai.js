import { OpenAI } from 'openai';

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const apiKey = process.env.OPENAI_API_KEY;
    
    if (!apiKey) {
      return res.json({
        status: 'error',
        message: 'OpenAI API key not configured in environment variables',
        hasApiKey: false,
        environment: process.env.NODE_ENV || 'development'
      });
    }

    // Test the API key by making a simple request
    const openai = new OpenAI({ apiKey });
    
    try {
      // Test with a simple completion to verify the key works
      const response = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "user",
            content: "Say 'API key is working' if you can read this message."
          }
        ],
        max_tokens: 10,
        temperature: 0
      });

      const content = response.choices[0]?.message?.content;

      return res.json({
        status: 'success',
        message: 'OpenAI API key is working correctly',
        hasApiKey: true,
        testResponse: content,
        model: 'gpt-3.5-turbo',
        environment: process.env.NODE_ENV || 'development',
        timestamp: new Date().toISOString()
      });

    } catch (openaiError) {
      return res.json({
        status: 'error',
        message: 'OpenAI API key is configured but not working',
        hasApiKey: true,
        error: openaiError.message,
        environment: process.env.NODE_ENV || 'development',
        timestamp: new Date().toISOString()
      });
    }

  } catch (error) {
    return res.status(500).json({
      status: 'error',
      message: 'Server error while testing OpenAI API key',
      error: error.message,
      environment: process.env.NODE_ENV || 'development',
      timestamp: new Date().toISOString()
    });
  }
}
