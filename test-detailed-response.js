// Test to see the detailed response structure
const testDetailedResponse = async () => {
  console.log("🔍 Testing Detailed Response Structure...\n");
  
  const frontendData = {
    selectedPlan: {
      id: "strength_size_program",
      title: "Strength & Size Program",
      difficulty: "Intermediate",
      focus_areas: ["Muscle Building", "Strength Training"],
      estimated_calories: 2800
    },
    userProfile: {
      full_name: "John Doe",
      age: 28,
      gender: "Male",
      height_cm: 180,
      weight_kg: 75,
      wake_up_time: "06:30",
      workout_time: "18:00",
      sleep_time: "23:00"
    }
  };

  try {
    const response = await fetch('https://lvnkpserdydhnqbigfbz.supabase.co/functions/v1/plan-activities', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx2bmtwc2VyZHlkaG5xYmlnZmJ6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTMzMzY5NjYsImV4cCI6MjA2ODkxMjk2Nn0.Y2NfbA7K9efpFHB6FFmCtgti3udX5wbOoQVkDndtkBc'
      },
      body: JSON.stringify(frontendData)
    });

    const result = await response.json();
    
    console.log("📊 Full Response Structure:");
    console.log(JSON.stringify(result, null, 2));
    
  } catch (error) {
    console.error("❌ Test failed:", error.message);
  }
};

testDetailedResponse();
