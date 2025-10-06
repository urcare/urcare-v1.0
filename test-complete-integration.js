// Complete integration test for all functions
const testFunctions = async () => {
  const baseUrl = 'https://lvnkpserdydhnqbigfbz.supabase.co/functions/v1';
  const authHeader = 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx2bmtwc2VyZHlkaG5xYmlnZmJ6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTMzMzY5NjYsImV4cCI6MjA2ODkxMjk2Nn0.Y2NfbA7K9efpFHB6FFmCtgti3udX5wbOoQVkDndtkBc';
  
  const testData = {
    userProfile: {
      full_name: "Test User",
      age: 30,
      gender: "Male",
      height_cm: 175,
      weight_kg: 70,
      blood_group: "O+",
      chronic_conditions: [],
      health_goals: ["Gain weight", "Build muscle"],
      diet_type: "High Protein",
      allergies: [],
      family_history: [],
      wake_up_time: "06:00",
      breakfast_time: "07:00",
      work_start: "09:00",
      lunch_time: "12:30",
      work_end: "17:00",
      workout_time: "18:00",
      dinner_time: "19:30",
      sleep_time: "22:00",
      workout_type: "Home",
      routine_flexibility: "Moderate",
      smoking: "Never",
      drinking: "Occasionally",
      lifestyle: "Active",
      stress_levels: "Medium",
      mental_health: "Good",
      hydration_habits: "Good",
      occupation: "Software Developer"
    }
  };

  console.log("🧪 Testing Complete Integration...\n");

  // Test 1: Health Score
  console.log("1️⃣ Testing Health Score Function...");
  try {
    const healthScoreResponse = await fetch(`${baseUrl}/health-score`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': authHeader
      },
      body: JSON.stringify(testData)
    });
    
    console.log(`   Status: ${healthScoreResponse.status}`);
    if (healthScoreResponse.ok) {
      const result = await healthScoreResponse.json();
      console.log(`   ✅ Success: ${result.success}`);
      console.log(`   🤖 Provider: ${result.meta?.provider || 'Unknown'}`);
    } else {
      const error = await healthScoreResponse.text();
      console.log(`   ❌ Error: ${error}`);
    }
  } catch (error) {
    console.log(`   ❌ Exception: ${error.message}`);
  }

  console.log("");

  // Test 2: Health Plans
  console.log("2️⃣ Testing Health Plans Function...");
  try {
    const healthPlansResponse = await fetch(`${baseUrl}/health-plans`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': authHeader
      },
      body: JSON.stringify({ userInput: "gain weight", userProfile: testData.userProfile })
    });
    
    console.log(`   Status: ${healthPlansResponse.status}`);
    if (healthPlansResponse.ok) {
      const result = await healthPlansResponse.json();
      console.log(`   ✅ Success: ${result.success}`);
      console.log(`   📋 Plans: ${result.plans?.length || 0} plans generated`);
      console.log(`   🤖 Provider: ${result.meta?.provider || 'Unknown'}`);
    } else {
      const error = await healthPlansResponse.text();
      console.log(`   ❌ Error: ${error}`);
    }
  } catch (error) {
    console.log(`   ❌ Exception: ${error.message}`);
  }

  console.log("");

  // Test 3: Plan Activities
  console.log("3️⃣ Testing Plan Activities Function...");
  try {
    const planActivitiesData = {
      selectedPlan: {
        id: "strength_size_program",
        title: "Strength & Size Program",
        difficulty: "Intermediate",
        focus_areas: ["Muscle Building", "Strength Training"],
        estimated_calories: 2800
      },
      userProfile: testData.userProfile
    };

    const planActivitiesResponse = await fetch(`${baseUrl}/plan-activities`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': authHeader
      },
      body: JSON.stringify(planActivitiesData)
    });
    
    console.log(`   Status: ${planActivitiesResponse.status}`);
    if (planActivitiesResponse.ok) {
      const result = await planActivitiesResponse.json();
      console.log(`   ✅ Success: ${result.success}`);
      console.log(`   📅 Activities: ${result.dailySchedule?.length || 0} activities`);
      console.log(`   🤖 Provider: ${result.meta?.provider || 'Unknown'}`);
      
      if (result.dailySchedule) {
        console.log(`   📋 Activity Times: ${result.dailySchedule.map(a => a.time).join(', ')}`);
      }
    } else {
      const error = await planActivitiesResponse.text();
      console.log(`   ❌ Error: ${error}`);
    }
  } catch (error) {
    console.log(`   ❌ Exception: ${error.message}`);
  }

  console.log("\n🎯 Integration Test Complete!");
  console.log("💡 All functions should return 200 status for successful integration");
  console.log("💡 If any function returns 500, check the API keys in Supabase dashboard");
};

testFunctions();
