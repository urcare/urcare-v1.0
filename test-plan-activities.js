// Test script for plan-activities function
const testData = {
  selectedPlan: {
    id: "diabetes_reversal_plan",
    title: "Diabetes Reversal Protocol",
    description: "A comprehensive plan to reverse type 2 diabetes naturally",
    difficulty: "Intermediate",
    duration_weeks: 12,
    focus_areas: ["Blood Sugar Control", "Insulin Sensitivity", "Weight Management"],
    estimated_calories: 1800,
    equipment: ["Glucose meter", "Resistance bands", "Yoga mat"],
    benefits: ["Lower blood sugar", "Improved insulin sensitivity", "Weight loss"]
  },
  userProfile: {
    full_name: "John Smith",
    age: 45,
    gender: "Male",
    height_cm: 175,
    weight_kg: 85,
    blood_group: "O+",
    chronic_conditions: ["Type 2 Diabetes", "High Blood Pressure"],
    health_goals: ["Reverse diabetes", "Lose weight", "Improve energy"],
    diet_type: "Low Carb",
    allergies: ["Nuts"],
    family_history: ["Diabetes", "Heart Disease"],
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
    lifestyle: "Sedentary",
    stress_levels: "High",
    mental_health: "Anxious",
    hydration_habits: "Poor",
    occupation: "Office Worker"
  }
};

async function testPlanActivities() {
  try {
    console.log("🧪 Testing Plan Activities Function...");
    console.log("📋 Test Data:", JSON.stringify(testData, null, 2));
    
    const response = await fetch('http://localhost:3000/api/plan-activities', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer test-token'
      },
      body: JSON.stringify(testData)
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
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
      console.log("- Critical Metrics:", result.data.criticalMetrics ? "Present" : "Not provided");
      console.log("- Full Day Timeline:", result.data.fullDayTimeline ? "Present" : "Not provided");
      console.log("- Supplement Protocol:", result.data.supplementProtocol ? "Present" : "Not provided");
      console.log("- Meal Plans:", result.data.mealPlans ? "Present" : "Not provided");
      console.log("- Sleep Optimization:", result.data.sleepOptimization ? "Present" : "Not provided");
      console.log("- Stress Management:", result.data.stressManagement ? "Present" : "Not provided");
      
      // Show a sample of the detailed content
      if (result.data.fullDayTimeline?.morning?.activities?.[0]) {
        const firstActivity = result.data.fullDayTimeline.morning.activities[0];
        console.log("\n🔍 Sample Activity Detail:");
        console.log("- Title:", firstActivity.title);
        console.log("- Duration:", firstActivity.duration);
        console.log("- Description:", firstActivity.description?.substring(0, 100) + "...");
        console.log("- Detailed Instructions:", firstActivity.detailedInstructions ? "Present" : "Not provided");
      }
    }
    
    console.log("\n📄 Full Response (first 1000 characters):");
    console.log(JSON.stringify(result, null, 2).substring(0, 1000) + "...");
    
  } catch (error) {
    console.error("❌ Test failed:", error.message);
  }
}

// Run the test
testPlanActivities();
