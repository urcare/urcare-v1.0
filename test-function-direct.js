// Test Supabase function directly with HTTP call
async function testFunctionDirect() {
  console.log('🧪 Testing Supabase function directly...\n');
  
  const functionUrl = 'https://lvnkpserdydhnqbigfbz.supabase.co/functions/v1/health-plans';
  const anonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx2bmtwc2VyZHlkaG5xYmlnZmJ6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTMzMzY5NjYsImV4cCI6MjA2ODkxMjk2Nn0.Y2NfbA7K9efpFHB6FFmCtgti3udX5wbOoQVkDndtkBc';
  
  const requestBody = {
    userProfile: {
      id: 'test',
      age: 25,
      gender: 'male',
      height: 175,
      weight: 70,
      activity_level: 'moderate',
      health_goals: ['gain_weight'],
      medical_conditions: [],
      medications: [],
      allergies: [],
      sleep_hours: 8,
      stress_level: 3,
      diet_type: 'balanced',
      exercise_frequency: 3,
      chronic_conditions: [],
      family_history: [],
      lifestyle_factors: [],
      wake_up_time: '07:00',
      sleep_time: '23:00',
      workout_time: '18:00'
    }
  };

  try {
    const response = await fetch(functionUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${anonKey}`,
        'Content-Type': 'application/json',
        'apikey': anonKey
      },
      body: JSON.stringify(requestBody)
    });

    console.log('📊 Response Status:', response.status);
    console.log('📊 Response Headers:', Object.fromEntries(response.headers.entries()));
    
    const responseText = await response.text();
    console.log('📝 Response Body:', responseText.substring(0, 500));
    
    if (response.ok) {
      try {
        const data = JSON.parse(responseText);
        console.log('\n✅ Success!');
        console.log('   Plans Count:', data.plans?.length || 0);
        console.log('   Provider:', data.meta?.provider || 'Unknown');
        
        if (data.plans?.length > 0) {
          console.log('\n📋 Plans Generated:');
          data.plans.forEach((plan, i) => {
            console.log(`   ${i + 1}. ${plan.title} (${plan.difficulty})`);
          });
        }
        
        console.log('\n📝 Full Response:');
        console.log(JSON.stringify(data, null, 2));
        
      } catch (e) {
        console.log('\n❌ JSON Parse Error:', e.message);
      }
    } else {
      console.log('\n❌ Function Error:', responseText);
    }

  } catch (error) {
    console.log('❌ Network Error:', error.message);
  }
}

testFunctionDirect().catch(console.error);
