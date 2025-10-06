// Test the exact integration that the frontend uses
const testFrontendIntegration = async () => {
  console.log("🧪 Testing Frontend Integration...\n");
  
  // This is the exact data structure the frontend sends
  const frontendData = {
    selectedPlan: {
      id: "strength_size_program",
      title: "Strength & Size Program", 
      description: "A comprehensive strength training program designed to build muscle mass and increase strength",
      difficulty: "Intermediate",
      duration_weeks: 12,
      focus_areas: ["Muscle Building", "Strength Training", "Weight Gain"],
      estimated_calories: 2800,
      equipment: ["Dumbbells", "Resistance bands", "Pull-up bar"],
      benefits: ["Increased muscle mass", "Improved strength", "Better body composition"],
      category: "strength"
    },
    userProfile: {
      full_name: "John Doe",
      age: 28,
      gender: "Male", 
      height_cm: 180,
      weight_kg: 75,
      blood_group: "A+",
      chronic_conditions: [],
      health_goals: ["Gain weight", "Build muscle", "Increase strength"],
      diet_type: "High Protein",
      allergies: [],
      family_history: [],
      wake_up_time: "06:30",
      breakfast_time: "07:30", 
      work_start: "09:00",
      lunch_time: "13:00",
      work_end: "17:00",
      workout_time: "18:00",
      dinner_time: "20:00",
      sleep_time: "23:00",
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

  try {
    console.log("📤 Sending request to plan-activities function...");
    
    const response = await fetch('https://lvnkpserdydhnqbigfbz.supabase.co/functions/v1/plan-activities', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx2bmtwc2VyZHlkaG5xYmlnZmJ6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTMzMzY5NjYsImV4cCI6MjA2ODkxMjk2Nn0.Y2NfbA7K9efpFHB6FFmCtgti3udX5wbOoQVkDndtkBc'
      },
      body: JSON.stringify(frontendData)
    });

    console.log(`📊 Response Status: ${response.status}`);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error("❌ Function failed:", errorText);
      return;
    }

    const result = await response.json();
    
    console.log("\n✅ SUCCESS! Function is working!");
    console.log(`🔍 Success: ${result.success}`);
    console.log(`🤖 Provider: ${result.meta?.provider}`);
    console.log(`📋 Plan Title: ${result.meta?.planTitle}`);
    
    if (result.data) {
      console.log("\n📅 Daily Schedule:");
      if (result.data.dailySchedule && result.data.dailySchedule.length > 0) {
        result.data.dailySchedule.forEach((activity, index) => {
          console.log(`  ${index + 1}. ${activity.time} - ${activity.activity} (${activity.duration})`);
          if (activity.exercises && activity.exercises.length > 0) {
            console.log(`     Exercises: ${activity.exercises.map(ex => ex.name).join(', ')}`);
          }
        });
      } else {
        console.log("  No activities in daily schedule");
      }
      
      console.log("\n📝 Response Structure:");
      console.log(`  - Day Title: ${result.data.dayTitle ? 'Present' : 'Missing'}`);
      console.log(`  - Welcome Message: ${result.data.welcomeMessage ? 'Present' : 'Missing'}`);
      console.log(`  - Daily Schedule: ${result.data.dailySchedule ? 'Present' : 'Missing'}`);
      console.log(`  - Full Day Timeline: ${result.data.fullDayTimeline ? 'Present' : 'Missing'}`);
    }
    
    console.log("\n🎉 INTEGRATION TEST PASSED!");
    console.log("💡 The plan-activities function is working correctly");
    console.log("💡 Your frontend should now be able to generate schedules");
    
  } catch (error) {
    console.error("❌ Integration test failed:", error.message);
  }
};

testFrontendIntegration();
