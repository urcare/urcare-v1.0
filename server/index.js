import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { OpenAI } from 'openai';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json({ limit: '1mb' }));

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

app.post('/api/generate-plan', async (req, res) => {
  try {
    const { profile } = req.body;
    if (!profile) {
      return res.status(400).json({ error: 'Missing profile data' });
    }

    // Compose a prompt using onboarding data
    const prompt = `You are a health AI. Based on the following user onboarding data, generate a detailed custom health plan. Explain potential complications, diseases, and how our product/service will benefit the user.\n\nUser Data: ${JSON.stringify(profile, null, 2)}\n\nReport:`;

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        { role: 'system', content: 'You are a health and wellness expert.' },
        { role: 'user', content: prompt }
      ],
      max_tokens: 900,
      temperature: 0.7
    });

    const gptResponse = completion.choices[0]?.message?.content || 'No response generated.';
    res.json({ report: gptResponse });
  } catch (err) {
    console.error('Error generating plan:', err);
    res.status(500).json({ error: 'Failed to generate plan.' });
  }
});

app.listen(PORT, () => {
  console.log(`AI backend listening on port ${PORT}`);
}); 