// Test script specifically for generate-schedule API
import fetch from 'node-fetch';

// Mock data for testing
const mockData = {
  selectedPlanId: "plan_1",
  planDetails: {
    plans: [
      {
        id: "plan_1",
        name: "Foundation Fit",
        description: "A beginner-friendly plan to build healthy habits",
        difficulty: "Beginner",
        focusAreas: ["Cardio", "Strength Training"],
        calorieTarget: 2000,
        estimatedCalories: 2000
      }
    ]
  },
  onboardingData: {
    wakeUpTime: "06:00",
    breakfastTime: "07:00",
    workStart: "09:00",
    lunchTime: "13:00",
    workEnd: "17:00",
    workoutTime: "18:00",
    dinnerTime: "19:00",
    sleepTime: "22:00",
    workoutType: "General",
    dietType: "Balanced",
    allergies: []
  },
  userProfile: {
    id: "test-user-123",
    full_name: "John Doe",
    age: 28,
    gender: "Male",
    height_cm: 175,
    weight_kg: 75,
    wake_up_time: "06:00",
    workout_time: "18:00",
    sleep_time: "22:00",
    diet_type: "Balanced"
  }
};

console.log("🧪 Testing Generate Schedule API");
console.log("===============================");

async function testGenerateSchedule() {
  console.log("\n🔍 Testing /api/generate-schedule endpoint...");
  
  try {
    const response = await fetch('http://localhost:3000/api/generate-schedule', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(mockData)
    });

    console.log("Response Status:", response.status);
    console.log("Response Headers:", Object.fromEntries(response.headers.entries()));

    if (!response.ok) {
      const errorText = await response.text();
      console.error("❌ HTTP Error Response:");
      console.error("Status:", response.status);
      console.error("Status Text:", response.statusText);
      console.error("Body:", errorText);
      return null;
    }

    const data = await response.json();
    console.log("✅ Generate Schedule API Response:");
    console.log("- Success:", data.success);
    console.log("- Schedule generated:", data.schedule?.length || 0);
    console.log("- Selected Plan:", data.selectedPlan?.name || "N/A");
    console.log("- Generated At:", data.generatedAt || "N/A");
    
    if (data.schedule && data.schedule.length > 0) {
      console.log("- First activity:", data.schedule[0]?.activity || "N/A");
      console.log("- First time:", data.schedule[0]?.time || "N/A");
    }
    
    return data;
  } catch (error) {
    console.error("❌ Generate Schedule API Error:", error.message);
    return null;
  }
}

// Main test function
async function runGenerateScheduleTest() {
  console.log("🚀 Starting Generate Schedule Test");
  console.log("=================================");
  
  // Check if server is running
  try {
    const healthCheck = await fetch('http://localhost:3000/api/health-plans', {
      method: 'OPTIONS'
    });
    console.log("✅ Server is running on localhost:3000");
  } catch (error) {
    console.error("❌ Server is not running. Please start the server first:");
    console.error("   node unified-server.js");
    return;
  }

  // Test the generate-schedule endpoint
  const result = await testGenerateSchedule();

  // Summary
  console.log("\n📊 Generate Schedule Test Result");
  console.log("=================================");
  
  if (result) {
    console.log("🎉 Generate Schedule API is working correctly!");
    console.log(`📅 Generated ${result.schedule?.length || 0} schedule activities`);
  } else {
    console.log("❌ Generate Schedule API needs attention.");
  }
}

// Run the test
runGenerateScheduleTest().catch(console.error);
