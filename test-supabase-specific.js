// Test script to verify specific Supabase Edge Functions AI services
import fetch from 'node-fetch';

// Supabase configuration
const SUPABASE_URL = 'https://lvnkpserdydhnqbigfbz.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx2bmtwc2VyZHlkaG5xYmlnZmJ6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTMzMzY5NjYsImV4cCI6MjA2ODkxMjk2Nn0.Y2NfbA7K9efpFHB6FFmCtgti3udX5wbOoQVkDndtkBc';

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

console.log("🧪 Testing Specific Supabase Edge Functions");
console.log("===========================================");

// Test 1: generate-ai-health-plans function
async function testGenerateAIHealthPlans() {
  console.log("\n🔍 Testing generate-ai-health-plans function...");
  
  try {
    const response = await fetch(`${SUPABASE_URL}/functions/v1/generate-ai-health-plans`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
      },
      body: JSON.stringify({
        userProfile: mockUserProfile,
        healthScore: 75,
        analysis: "Good overall health with room for improvement",
        recommendations: ["Increase cardio", "Improve sleep"],
        userInput: "I want to get fitter and lose weight"
      })
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    console.log("✅ generate-ai-health-plans Response:");
    console.log("- Success:", data.success || "N/A");
    console.log("- Plans generated:", data.plans?.length || 0);
    console.log("- Error:", data.error || "None");
    
    return data;
  } catch (error) {
    console.error("❌ generate-ai-health-plans Error:", error.message);
    return null;
  }
}

// Test 2: generate-ai-health-coach-plan function
async function testGenerateAIHealthCoachPlan() {
  console.log("\n🔍 Testing generate-ai-health-coach-plan function...");
  
  try {
    const response = await fetch(`${SUPABASE_URL}/functions/v1/generate-ai-health-coach-plan`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
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
    console.log("✅ generate-ai-health-coach-plan Response:");
    console.log("- Success:", data.success || "N/A");
    console.log("- Plan generated:", data.plan ? "Yes" : "No");
    console.log("- Error:", data.error || "None");
    
    return data;
  } catch (error) {
    console.error("❌ generate-ai-health-coach-plan Error:", error.message);
    return null;
  }
}

// Test 3: generate-workout-schedule function
async function testGenerateWorkoutSchedule() {
  console.log("\n🔍 Testing generate-workout-schedule function...");
  
  try {
    const response = await fetch(`${SUPABASE_URL}/functions/v1/generate-workout-schedule`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
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
    console.log("✅ generate-workout-schedule Response:");
    console.log("- Success:", data.success || "N/A");
    console.log("- Schedule generated:", data.schedule ? "Yes" : "No");
    console.log("- Error:", data.error || "None");
    
    return data;
  } catch (error) {
    console.error("❌ generate-workout-schedule Error:", error.message);
    return null;
  }
}

// Test 4: health-plans function (different from generate-ai-health-plans)
async function testHealthPlansFunction() {
  console.log("\n🔍 Testing health-plans function...");
  
  try {
    const response = await fetch(`${SUPABASE_URL}/functions/v1/health-plans`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
      },
      body: JSON.stringify({
        userProfile: mockUserProfile,
        healthScore: 75,
        analysis: "Good overall health with room for improvement",
        recommendations: ["Increase cardio", "Improve sleep"],
        userInput: "I want to get fitter and lose weight"
      })
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    console.log("✅ health-plans Response:");
    console.log("- Success:", data.success || "N/A");
    console.log("- Plans generated:", data.plans?.length || 0);
    console.log("- Error:", data.error || "None");
    
    return data;
  } catch (error) {
    console.error("❌ health-plans Error:", error.message);
    return null;
  }
}

// Main test function
async function runSpecificSupabaseTests() {
  console.log("🚀 Starting Specific Supabase AI Functions Test");
  console.log("=============================================");
  
  // Run all specific Supabase AI function tests
  const results = {
    generateAIHealthPlans: await testGenerateAIHealthPlans(),
    generateAIHealthCoachPlan: await testGenerateAIHealthCoachPlan(),
    generateWorkoutSchedule: await testGenerateWorkoutSchedule(),
    healthPlans: await testHealthPlansFunction()
  };

  // Summary
  console.log("\n📊 Specific Supabase AI Test Results Summary");
  console.log("===========================================");
  
  const tests = [
    { name: "generate-ai-health-plans", result: results.generateAIHealthPlans },
    { name: "generate-ai-health-coach-plan", result: results.generateAIHealthCoachPlan },
    { name: "generate-workout-schedule", result: results.generateWorkoutSchedule },
    { name: "health-plans", result: results.healthPlans }
  ];

  tests.forEach(test => {
    const status = test.result ? "✅ PASS" : "❌ FAIL";
    console.log(`${status} ${test.name}`);
  });

  const passedTests = tests.filter(t => t.result).length;
  const totalTests = tests.length;
  
  console.log(`\n🎯 Specific Supabase AI Result: ${passedTests}/${totalTests} functions working`);
  
  if (passedTests === totalTests) {
    console.log("🎉 All specific Supabase AI functions are working correctly!");
  } else {
    console.log("⚠️  Some specific Supabase AI functions need attention. Check the error messages above.");
  }

  return results;
}

// Run the tests
runSpecificSupabaseTests().catch(console.error);
