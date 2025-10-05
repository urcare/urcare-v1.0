// Test script to verify AI services with mock onboarding data
import fetch from 'node-fetch';

// Mock onboarding data
const mockUserProfile = {
  id: "test-user-123",
  full_name: "John Doe",
  age: 28,
  gender: "Male",
  height_cm: 175,
  weight_kg: 75,
  blood_group: "O+",
  chronic_conditions: ["None"],
  medications: ["None"],
  health_goals: ["Weight loss", "Muscle building", "Better sleep"],
  diet_type: "Balanced",
  workout_time: "Morning",
  sleep_time: "22:00",
  wake_up_time: "06:00"
};

const mockHealthScore = 75;
const mockAnalysis = "Good overall health with room for improvement in cardiovascular fitness and sleep quality.";
const mockRecommendations = ["Increase cardio exercise", "Improve sleep hygiene", "Add strength training"];
const mockUserInput = "I want to get fitter and lose some weight while building muscle";

console.log("🧪 Testing AI Services with Mock Data");
console.log("=====================================");

// Test 1: Groq-Gemini Sequential API
async function testGroqGeminiSequential() {
  console.log("\n🔍 Testing Groq-Gemini Sequential API...");
  
  try {
    const response = await fetch('http://localhost:3000/api/groq-gemini-sequential', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userProfile: mockUserProfile,
        primaryGoal: "Get fitter and lose weight while building muscle"
      })
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    console.log("✅ Groq-Gemini Sequential API Response:");
    console.log("- Success:", data.success);
    console.log("- Plans generated:", data.step1?.plans?.length || 0);
    console.log("- Schedule generated:", data.step2?.schedule?.dailySchedule?.length || 0);
    
    if (data.step1?.plans) {
      console.log("- First plan:", data.step1.plans[0]?.name || "N/A");
    }
    
    return data;
  } catch (error) {
    console.error("❌ Groq-Gemini Sequential API Error:", error.message);
    return null;
  }
}

// Test 2: Health Plans API
async function testHealthPlans() {
  console.log("\n🔍 Testing Health Plans API...");
  
  try {
    const response = await fetch('http://localhost:3000/api/health-plans', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userProfile: mockUserProfile,
        healthScore: mockHealthScore,
        analysis: mockAnalysis,
        recommendations: mockRecommendations,
        userInput: mockUserInput
      })
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    console.log("✅ Health Plans API Response:");
    console.log("- Success:", data.success);
    console.log("- Plans generated:", data.plans?.length || 0);
    console.log("- Provider used:", data.meta?.provider || "N/A");
    
    if (data.plans) {
      console.log("- First plan:", data.plans[0]?.title || "N/A");
    }
    
    return data;
  } catch (error) {
    console.error("❌ Health Plans API Error:", error.message);
    return null;
  }
}

// Test 3: Health Score API
async function testHealthScore() {
  console.log("\n🔍 Testing Health Score API...");
  
  try {
    const response = await fetch('http://localhost:3000/api/health-score', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userProfile: mockUserProfile,
        userInput: mockUserInput
      })
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    console.log("✅ Health Score API Response:");
    console.log("- Success:", data.success);
    console.log("- Health Score:", data.healthScore || "N/A");
    console.log("- Analysis:", data.analysis ? "Generated" : "Not generated");
    console.log("- Recommendations:", data.recommendations?.length || 0);
    
    return data;
  } catch (error) {
    console.error("❌ Health Score API Error:", error.message);
    return null;
  }
}

// Test 4: Plan Activities API
async function testPlanActivities() {
  console.log("\n🔍 Testing Plan Activities API...");
  
  try {
    const response = await fetch('http://localhost:3000/api/plan-activities', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userProfile: mockUserProfile,
        selectedPlan: {
          id: "test-plan",
          name: "Test Health Plan",
          description: "A test health plan for verification",
          difficulty: "Intermediate",
          focusAreas: ["Cardio", "Strength Training"]
        }
      })
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    console.log("✅ Plan Activities API Response:");
    console.log("- Success:", data.success);
    console.log("- Activities generated:", data.activities?.length || 0);
    
    return data;
  } catch (error) {
    console.error("❌ Plan Activities API Error:", error.message);
    return null;
  }
}

// Test 5: Generate Schedule API
async function testGenerateSchedule() {
  console.log("\n🔍 Testing Generate Schedule API...");
  
  try {
    const response = await fetch('http://localhost:3000/api/generate-schedule', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
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
        userProfile: mockUserProfile
      })
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    console.log("✅ Generate Schedule API Response:");
    console.log("- Success:", data.success);
    console.log("- Schedule generated:", data.schedule?.dailySchedule?.length || 0);
    
    return data;
  } catch (error) {
    console.error("❌ Generate Schedule API Error:", error.message);
    return null;
  }
}

// Main test function
async function runAllTests() {
  console.log("🚀 Starting AI Services Test Suite");
  console.log("===================================");
  
  // Check if server is running
  try {
    const healthCheck = await fetch('http://localhost:3000/api/health-plans', {
      method: 'OPTIONS'
    });
    console.log("✅ Server is running on localhost:3000");
  } catch (error) {
    console.error("❌ Server is not running. Please start the server first:");
    console.error("   npm run dev");
    console.error("   or");
    console.error("   node server.js");
    return;
  }

  // Run all tests
  const results = {
    groqGemini: await testGroqGeminiSequential(),
    healthPlans: await testHealthPlans(),
    healthScore: await testHealthScore(),
    planActivities: await testPlanActivities(),
    generateSchedule: await testGenerateSchedule()
  };

  // Summary
  console.log("\n📊 Test Results Summary");
  console.log("========================");
  
  const tests = [
    { name: "Groq-Gemini Sequential", result: results.groqGemini },
    { name: "Health Plans", result: results.healthPlans },
    { name: "Health Score", result: results.healthScore },
    { name: "Plan Activities", result: results.planActivities },
    { name: "Generate Schedule", result: results.generateSchedule }
  ];

  tests.forEach(test => {
    const status = test.result ? "✅ PASS" : "❌ FAIL";
    console.log(`${status} ${test.name}`);
  });

  const passedTests = tests.filter(t => t.result).length;
  const totalTests = tests.length;
  
  console.log(`\n🎯 Overall Result: ${passedTests}/${totalTests} tests passed`);
  
  if (passedTests === totalTests) {
    console.log("🎉 All AI services are working correctly!");
  } else {
    console.log("⚠️  Some AI services need attention. Check the error messages above.");
  }
}

// Run the tests
runAllTests().catch(console.error);
