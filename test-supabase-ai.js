// Test script to verify Supabase Edge Functions AI services
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

const mockHealthScore = 75;
const mockAnalysis = "Good overall health with room for improvement in cardiovascular fitness and sleep quality.";
const mockRecommendations = ["Increase cardio exercise", "Improve sleep hygiene", "Add strength training"];
const mockUserInput = "I want to get fitter and lose some weight while building muscle";

console.log("🧪 Testing Supabase Edge Functions AI Services");
console.log("==============================================");

// Test 1: Supabase plan-activities function
async function testSupabasePlanActivities() {
  console.log("\n🔍 Testing Supabase plan-activities function...");
  
  try {
    const response = await fetch(`${SUPABASE_URL}/functions/v1/plan-activities`, {
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
    console.log("✅ Supabase plan-activities Response:");
    console.log("- Success:", data.success || "N/A");
    console.log("- Activities generated:", data.activities?.length || 0);
    console.log("- Error:", data.error || "None");
    
    return data;
  } catch (error) {
    console.error("❌ Supabase plan-activities Error:", error.message);
    return null;
  }
}

// Test 2: Supabase health-score function
async function testSupabaseHealthScore() {
  console.log("\n🔍 Testing Supabase health-score function...");
  
  try {
    const response = await fetch(`${SUPABASE_URL}/functions/v1/health-score`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
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
    console.log("✅ Supabase health-score Response:");
    console.log("- Success:", data.success || "N/A");
    console.log("- Health Score:", data.healthScore || "N/A");
    console.log("- Analysis:", data.analysis ? "Generated" : "Not generated");
    console.log("- Recommendations:", data.recommendations?.length || 0);
    console.log("- Error:", data.error || "None");
    
    return data;
  } catch (error) {
    console.error("❌ Supabase health-score Error:", error.message);
    return null;
  }
}

// Test 3: Supabase health-plans function
async function testSupabaseHealthPlans() {
  console.log("\n🔍 Testing Supabase health-plans function...");
  
  try {
    const response = await fetch(`${SUPABASE_URL}/functions/v1/health-plans`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
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
    console.log("✅ Supabase health-plans Response:");
    console.log("- Success:", data.success || "N/A");
    console.log("- Plans generated:", data.plans?.length || 0);
    console.log("- Error:", data.error || "None");
    
    if (data.plans) {
      console.log("- First plan:", data.plans[0]?.title || "N/A");
    }
    
    return data;
  } catch (error) {
    console.error("❌ Supabase health-plans Error:", error.message);
    return null;
  }
}

// Test 4: Check Supabase connection
async function testSupabaseConnection() {
  console.log("\n🔍 Testing Supabase connection...");
  
  try {
    const response = await fetch(`${SUPABASE_URL}/rest/v1/`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        'apikey': SUPABASE_ANON_KEY
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    console.log("✅ Supabase connection successful");
    return true;
  } catch (error) {
    console.error("❌ Supabase connection Error:", error.message);
    return false;
  }
}

// Main test function
async function runSupabaseTests() {
  console.log("🚀 Starting Supabase AI Services Test Suite");
  console.log("==========================================");
  
  // Test Supabase connection first
  const connectionTest = await testSupabaseConnection();
  if (!connectionTest) {
    console.log("❌ Cannot proceed with AI tests - Supabase connection failed");
    return;
  }

  // Run all Supabase AI function tests
  const results = {
    planActivities: await testSupabasePlanActivities(),
    healthScore: await testSupabaseHealthScore(),
    healthPlans: await testSupabaseHealthPlans()
  };

  // Summary
  console.log("\n📊 Supabase AI Test Results Summary");
  console.log("===================================");
  
  const tests = [
    { name: "Plan Activities", result: results.planActivities },
    { name: "Health Score", result: results.healthScore },
    { name: "Health Plans", result: results.healthPlans }
  ];

  tests.forEach(test => {
    const status = test.result ? "✅ PASS" : "❌ FAIL";
    console.log(`${status} ${test.name}`);
  });

  const passedTests = tests.filter(t => t.result).length;
  const totalTests = tests.length;
  
  console.log(`\n🎯 Supabase AI Result: ${passedTests}/${totalTests} functions working`);
  
  if (passedTests === totalTests) {
    console.log("🎉 All Supabase AI functions are working correctly!");
  } else {
    console.log("⚠️  Some Supabase AI functions need attention. Check the error messages above.");
  }

  return results;
}

// Run the tests
runSupabaseTests().catch(console.error);
