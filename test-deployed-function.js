// Test script to verify the deployed plan-activities function
const testData = {
  selectedPlan: {
    id: "test_plan",
    title: "Test Health Plan",
    difficulty: "Intermediate",
    focus_areas: ["Weight Gain", "Muscle Building"],
    estimated_calories: 2500
  },
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
    occupation: "Office Worker"
  }
};

async function testDeployedFunction() {
  try {
    console.log("🧪 Testing Deployed Plan-Activities Function...");
    console.log("📋 Test Data:", JSON.stringify(testData, null, 2));
    
    const response = await fetch('https://lvnkpserdydhnqbigfbz.supabase.co/functions/v1/plan-activities', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx2bmtwc2VyZHlkaG5xYmlnZmJ6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTMzMzY5NjYsImV4cCI6MjA2ODkxMjk2Nn0.Y2NfbA7K9efpFHB6FFmCtgti3udX5wbOoQVkDndtkBc'
      },
      body: JSON.stringify(testData)
    });

    console.log("📊 Response status:", response.status);
    console.log("📊 Response headers:", Object.fromEntries(response.headers.entries()));

    if (!response.ok) {
      const errorText = await response.text();
      console.error("❌ Function failed:", errorText);
      return;
    }

    const result = await response.json();
    
    console.log("\n✅ Response received!");
    console.log("📊 Response length:", JSON.stringify(result).length, "characters");
    console.log("🔍 Success:", result.success);
    console.log("🤖 Provider:", result.meta?.provider);
    
    if (result.data) {
      console.log("\n📝 Response Structure:");
      console.log("- Day Title:", result.data.dayTitle || "Not provided");
      console.log("- Welcome Message:", result.data.welcomeMessage ? "Present" : "Not provided");
      console.log("- Daily Schedule:", result.data.dailySchedule ? "Present" : "Not provided");
      console.log("- Full Day Timeline:", result.data.fullDayTimeline ? "Present" : "Not provided");
      
      if (result.data.dailySchedule) {
        console.log("\n📅 Daily Schedule Activities:");
        result.data.dailySchedule.forEach((activity, index) => {
          console.log(`${index + 1}. ${activity.time} - ${activity.activity} (${activity.duration})`);
          if (activity.exercises) {
            console.log(`   Exercises: ${activity.exercises.length} exercises`);
            activity.exercises.forEach(ex => {
              console.log(`   - ${ex.name} (${ex.duration}, ${ex.calories} cal)`);
            });
          }
        });
      }
    }
    
    console.log("\n📄 Full Response (first 2000 characters):");
    console.log(JSON.stringify(result, null, 2).substring(0, 2000) + "...");
    
  } catch (error) {
    console.error("❌ Test failed:", error.message);
  }
}

// Run the test
testDeployedFunction();
