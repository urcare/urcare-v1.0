import OpenAI from 'openai';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.VITE_OPENAI_API_KEY || ""
});

async function testOpenAI() {
  try {
    console.log('🔍 Testing OpenAI API with environment key...');
    console.log('🔑 API Key (first 10 chars):', process.env.VITE_OPENAI_API_KEY?.substring(0, 10) + '...');
    
    const completion = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: 'You are a health assessment AI. Always respond in valid JSON format.'
        },
        {
          role: 'user',
          content: 'Calculate a health score for a 30-year-old male, 70kg, 175cm. Respond in JSON format with healthScore, analysis, and recommendations.'
        }
      ],
      max_tokens: 200,
      temperature: 0.7
    });
    
    console.log('✅ OpenAI API is working!');
    console.log('📨 Response:', completion.choices[0].message.content);
    
    // Try to parse JSON
    try {
      const jsonResponse = JSON.parse(completion.choices[0].message.content);
      console.log('✅ JSON parsing successful:', jsonResponse);
    } catch (parseError) {
      console.log('⚠️ JSON parsing failed, but API is working');
    }
    
  } catch (error) {
    console.error('❌ OpenAI Error:', error.message);
    console.error('❌ Full error:', error);
  }
}

testOpenAI();
