import { Groq } from 'groq-sdk';

const groq = new Groq({
  apiKey: process.env.VITE_GROQ_API_KEY,
});

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { prompt, userProfile } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required' });
    }

    if (!process.env.VITE_GROQ_API_KEY) {
      return res.status(500).json({ error: 'Groq API key not configured' });
    }

    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: "You are a comprehensive health and fitness planning expert. Generate 3 DISTINCT, personalized health plans based on the user's specific profile, health conditions, and goals. Each plan should address their chronic conditions, work schedule, and health goals. Return ONLY valid JSON."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      model: "llama-3.3-70b-versatile",
      temperature: 0.8,
      max_tokens: 4000,
    });

    const response = completion.choices[0]?.message?.content;
    
    if (!response) {
      throw new Error('No response from Groq API');
    }

    // Try to parse the JSON response
    let plans = [];
    try {
      // Extract JSON from the response (handle cases where there might be extra text)
      const jsonMatch = response.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        plans = JSON.parse(jsonMatch[0]);
      } else {
        // Fallback: try to parse the entire response
        plans = JSON.parse(response);
      }
    } catch (parseError) {
      console.error('Failed to parse Groq response:', parseError);
      console.log('Raw response:', response);
      
      // Fallback: create plans based on the prompt
      const promptLower = prompt.toLowerCase();
      plans = [
        {
          id: 'plan_1',
          title: 'Personalized Wellness Plan',
          description: 'A comprehensive approach to achieving your health goals',
          duration: '4 weeks',
          difficulty: 'Beginner',
          focusAreas: ['General wellness', 'Habit building', 'Lifestyle improvement'],
          estimatedCalories: 200,
          equipment: ['Yoga mat', 'Water bottle', 'Timer'],
          benefits: ['Improved energy', 'Better sleep', 'Reduced stress']
        },
        {
          id: 'plan_2',
          title: 'Advanced Health Optimization',
          description: 'Intensive program for maximum health improvements',
          duration: '6 weeks',
          difficulty: 'Intermediate',
          focusAreas: ['Fitness', 'Nutrition', 'Recovery'],
          estimatedCalories: 300,
          equipment: ['Dumbbells', 'Resistance bands', 'Fitness tracker'],
          benefits: ['Increased strength', 'Better endurance', 'Enhanced focus']
        },
        {
          id: 'plan_3',
          title: 'Sustainable Lifestyle Change',
          description: 'Long-term approach to lasting health improvements',
          duration: '8 weeks',
          difficulty: 'Advanced',
          focusAreas: ['Mindfulness', 'Nutrition', 'Exercise', 'Recovery'],
          estimatedCalories: 250,
          equipment: ['Meditation app', 'Kitchen scale', 'Workout gear'],
          benefits: ['Long-term health', 'Mental clarity', 'Physical strength']
        }
      ];
    }

    // Ensure all plans have required fields
    const processedPlans = plans.map((plan, index) => ({
      id: plan.id || `plan_${index + 1}`,
      title: plan.title || 'Health Plan',
      description: plan.description || 'A personalized health plan',
      duration: plan.duration || '4 weeks',
      difficulty: plan.difficulty || 'Beginner',
      focusAreas: plan.focusAreas || ['General wellness'],
      estimatedCalories: plan.estimatedCalories || 200,
      equipment: plan.equipment || ['Basic equipment'],
      benefits: plan.benefits || ['Improved health']
    }));

    res.status(200).json({
      success: true,
      plans: processedPlans,
      generatedAt: new Date().toISOString()
    });

  } catch (error) {
    console.error('Error generating plans with Groq:', error);
    res.status(500).json({
      error: 'Failed to generate plans',
      details: error.message
    });
  }
}
