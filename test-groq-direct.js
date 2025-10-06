// Test Groq API directly to see what's happening
import dotenv from 'dotenv';
dotenv.config();

const GROQ_API_KEY = process.env.GROQ_API_KEY;

const prompt = `Generate EXACTLY 3 health plans (Beginner, Intermediate, Advanced) for a user who wants to gain weight.

Return JSON in this format:
{
  "success": true,
  "plans": [
    {
      "id": "beginner_plan",
      "title": "Plan Name",
      "description": "Brief description",
      "duration": "8 weeks",
      "difficulty": "Beginner",
      "focusAreas": ["area1", "area2"],
      "estimatedCalories": 200,
      "equipment": ["item1"],
      "benefits": ["benefit1"]
    },
    {
      "id": "intermediate_plan",
      "title": "Plan Name",
      "description": "Brief description",
      "duration": "12 weeks",
      "difficulty": "Intermediate",
      "focusAreas": ["area1", "area2"],
      "estimatedCalories": 400,
      "equipment": ["item1"],
      "benefits": ["benefit1"]
    },
    {
      "id": "advanced_plan",
      "title": "Plan Name",
      "description": "Brief description",
      "duration": "16 weeks",
      "difficulty": "Advanced",
      "focusAreas": ["area1", "area2"],
      "estimatedCalories": 600,
      "equipment": ["item1"],
      "benefits": ["benefit1"]
    }
  ]
}`;

async function testGroq() {
  console.log('🧪 Testing Groq API directly...\n');
  
  const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${GROQ_API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model: 'llama-3.3-70b-versatile',
      messages: [
        {
          role: 'system',
          content: 'You are a health planning AI. Return ONLY valid JSON, no markdown.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      max_tokens: 6000,
      temperature: 0.8,
      response_format: { type: 'json_object' }
    })
  });

  console.log('📊 Response Status:', response.status);
  
  const data = await response.json();
  
  if (data.error) {
    console.log('❌ Error:', data.error);
    return;
  }
  
  console.log('\n📝 Raw Response:');
  console.log(data.choices[0].message.content.substring(0, 500));
  
  try {
    const json = JSON.parse(data.choices[0].message.content);
    console.log('\n✅ Plans Generated:', json.plans?.length || 0);
    json.plans?.forEach((plan, i) => {
      console.log(`   ${i + 1}. ${plan.title} (${plan.difficulty})`);
    });
  } catch (e) {
    console.log('\n❌ JSON Parse Error:', e.message);
  }
}

testGroq().catch(console.error);

