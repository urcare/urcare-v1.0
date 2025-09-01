// Test script for health plan generation
// Run this in your browser console when logged into the app

console.log("🏥 Health Plan Generation Test Script Loaded!");

// Function to test health plan generation
async function testHealthPlanGeneration() {
  console.log("🔍 Testing health plan generation...");
  
  try {
    // Check if healthPlanService is available
    if (typeof healthPlanService === 'undefined') {
      console.log("❌ healthPlanService not found. Make sure you're on a page that imports it.");
      return;
    }
    
    console.log("✅ healthPlanService found!");
    
    // Get current user
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      console.log("❌ No user found. Please log in first.");
      return;
    }
    
    console.log("👤 User found:", user.email);
    
    // Check if user has a profile
    const { data: profile, error: profileError } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('id', user.id)
      .single();
    
    if (profileError || !profile) {
      console.log("❌ User profile not found. Complete onboarding first.");
      return;
    }
    
    console.log("📋 User profile found:", {
      name: profile.full_name,
      age: profile.age,
      height: profile.height_cm,
      weight: profile.weight_kg,
      goals: profile.health_goals
    });
    
    // Generate health plan
    console.log("🚀 Generating health plan...");
    const healthPlan = await healthPlanService.generateHealthPlan(user.id);
    
    if (healthPlan) {
      console.log("✅ Health plan generated successfully!");
      console.log("📊 Health Metrics:", {
        BMI: healthPlan.metrics.bmi,
        BMR: healthPlan.metrics.bmr,
        TDEE: healthPlan.metrics.tdee,
        HealthScore: healthPlan.metrics.healthScore,
        WeightStatus: healthPlan.metrics.weightStatus
      });
      
      console.log("🍎 Nutrition Plan:", {
        DailyCalories: healthPlan.nutrition.dailyCalories,
        Protein: `${healthPlan.nutrition.protein.grams}g (${healthPlan.nutrition.protein.percentage}%)`,
        Carbs: `${healthPlan.nutrition.carbohydrates.grams}g (${healthPlan.nutrition.carbohydrates.percentage}%)`,
        Fats: `${healthPlan.nutrition.fats.grams}g (${healthPlan.nutrition.fats.percentage}%)`
      });
      
      console.log("💪 Workout Plan:", {
        Frequency: `${healthPlan.workout.frequency} days/week`,
        Duration: `${healthPlan.workout.duration} minutes/session`,
        Types: healthPlan.workout.types
      });
      
      console.log("🌅 Lifestyle Plan:", {
        Sleep: healthPlan.lifestyle.sleep,
        StressManagement: healthPlan.lifestyle.stressManagement,
        Habits: healthPlan.lifestyle.habits
      });
      
      console.log("🎯 Next Steps:", healthPlan.nextSteps);
      
      console.log("🎉 Health plan generation test completed successfully!");
      console.log("💡 Navigate to /health-plan to see the full plan in the UI");
      
    } else {
      console.log("❌ Failed to generate health plan");
    }
    
  } catch (error) {
    console.error("❌ Error testing health plan generation:", error);
  }
}

// Function to check if user has onboarding data
async function checkOnboardingData() {
  console.log("🔍 Checking onboarding data...");
  
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      console.log("❌ No user found");
      return;
    }
    
    const { data: profile, error } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('id', user.id)
      .single();
    
    if (error || !profile) {
      console.log("❌ No profile found");
      return;
    }
    
    console.log("✅ Profile found!");
    console.log("📋 Profile data:", {
      full_name: profile.full_name,
      age: profile.age,
      height_cm: profile.height_cm,
      weight_kg: profile.weight_kg,
      gender: profile.gender,
      health_goals: profile.health_goals,
      diet_type: profile.diet_type,
      chronic_conditions: profile.chronic_conditions,
      medications: profile.medications,
      sleep_quality: profile.sleep_quality,
      stress_level: profile.stress_level,
      workout_time: profile.workout_time,
      routine_flexibility: profile.routine_flexibility,
      onboarding_completed: profile.onboarding_completed
    });
    
    if (!profile.onboarding_completed) {
      console.log("⚠️ Onboarding not completed. Complete onboarding first.");
    } else {
      console.log("✅ Onboarding completed!");
    }
    
  } catch (error) {
    console.error("❌ Error checking onboarding data:", error);
  }
}

// Function to manually create a test profile (for testing)
async function createTestProfile() {
  console.log("🔧 Creating test profile...");
  
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      console.log("❌ No user found");
      return;
    }
    
    const testProfile = {
      id: user.id,
      full_name: "Test User",
      age: 30,
      height_cm: 175,
      weight_kg: 70,
      gender: "male",
      health_goals: ["Lose Weight", "Improve Fitness"],
      diet_type: "Balanced",
      chronic_conditions: [],
      medications: [],
      sleep_quality: "good",
      stress_level: "moderate",
      workout_time: "Morning (06:00-10:00)",
      routine_flexibility: "5",
      wake_up_time: "06:00",
      sleep_time: "22:00",
      work_start: "09:00",
      work_end: "18:00",
      breakfast_time: "07:00",
      lunch_time: "12:00",
      dinner_time: "19:00",
      onboarding_completed: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    
    const { data, error } = await supabase
      .from('user_profiles')
      .upsert(testProfile, { onConflict: 'id' })
      .select()
      .single();
    
    if (error) {
      console.error("❌ Error creating test profile:", error);
      return;
    }
    
    console.log("✅ Test profile created/updated successfully!");
    console.log("📋 Profile:", data);
    
  } catch (error) {
    console.error("❌ Error creating test profile:", error);
  }
}

console.log("📋 Available test functions:");
console.log("  - checkOnboardingData() - Check if user has onboarding data");
console.log("  - createTestProfile() - Create a test profile for testing");
console.log("  - testHealthPlanGeneration() - Test the full health plan generation");
console.log("");
console.log("🚀 Start with: checkOnboardingData()");
console.log("🔧 If no profile exists, use: createTestProfile()");
console.log("🎯 Then test: testHealthPlanGeneration()");
