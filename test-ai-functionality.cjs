// Test script to verify AI functionality
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

async function testAI() {
  console.log('🧪 Testing AI functionality...\n');

  try {
    // Test health score generation
    console.log('1. Testing Health Score Generation...');
    const healthScoreResponse = await fetch('http://localhost:3000/api/health-score', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userProfile: {
          id: 'test-user',
          age: 30,
          gender: 'Male',
          height_cm: '175',
          weight_kg: '70',
          health_goals: ['Weight loss', 'Better sleep'],
          diet_type: 'Balanced',
          workout_time: 'Morning'
        },
        userInput: 'I want to lose weight and improve my sleep quality',
        uploadedFiles: [],
        voiceTranscript: ''
      })
    });

    if (healthScoreResponse.ok) {
      const healthScoreData = await healthScoreResponse.json();
      console.log('✅ Health Score API working!');
      console.log('   Health Score:', healthScoreData.healthScore);
      console.log('   Analysis:', healthScoreData.analysis);
      console.log('   Recommendations:', healthScoreData.recommendations);
    } else {
      console.log('❌ Health Score API failed:', healthScoreResponse.status);
      const error = await healthScoreResponse.text();
      console.log('   Error:', error);
    }

    console.log('\n2. Testing Health Plans Generation...');
    const plansResponse = await fetch('http://localhost:3000/api/health-plans', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userProfile: {
          id: 'test-user',
          age: 30,
          gender: 'Male',
          height_cm: '175',
          weight_kg: '70',
          health_goals: ['Weight loss', 'Better sleep'],
          diet_type: 'Balanced',
          workout_time: 'Morning'
        },
        healthScore: 75,
        analysis: 'Good health with room for improvement',
        recommendations: ['Exercise regularly', 'Get better sleep'],
        userInput: 'I want to lose weight and improve my sleep quality',
        uploadedFiles: [],
        voiceTranscript: ''
      })
    });

    if (plansResponse.ok) {
      const plansData = await plansResponse.json();
      console.log('✅ Health Plans API working!');
      console.log('   Number of plans:', plansData.plans?.length || 0);
      if (plansData.plans && plansData.plans.length > 0) {
        console.log('   First plan:', plansData.plans[0].title);
        console.log('   Difficulty:', plansData.plans[0].difficulty);
        console.log('   Duration:', plansData.plans[0].duration);
      }
    } else {
      console.log('❌ Health Plans API failed:', plansResponse.status);
      const error = await plansResponse.text();
      console.log('   Error:', error);
    }

  } catch (error) {
    console.log('❌ Test failed:', error.message);
    console.log('   Make sure the server is running on port 3000');
    console.log('   Run: node server.js');
  }
}

testAI();
