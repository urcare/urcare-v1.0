// Test script to check Groq API response quality
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

async function testGroqResponse() {
  try {
    console.log("🧪 Testing Groq API Response Quality...");
    
    // Get API key from environment
    const GROQ_API_KEY = process.env.GROQ_API_KEY || 'gsk_test_key_here';
    
    if (GROQ_API_KEY === 'gsk_test_key_here') {
      console.log("⚠️ Using test API key - please set GROQ_API_KEY environment variable");
    }

    // Enhanced system prompt (same as in the function)
    const enhancedSystemPrompt = `You are Dr. Marcus Chen, a world-renowned integrative medicine physician, certified functional medicine practitioner, and precision health optimization specialist with 20+ years of experience. You specialize in creating hyper-detailed, scientifically-backed daily protocols that address the root causes of health issues.

Your expertise includes:
- Functional medicine and root cause analysis
- Precision nutrition and metabolic optimization
- Exercise physiology and movement science
- Sleep medicine and circadian rhythm optimization
- Stress management and nervous system regulation
- Chronic disease prevention and reversal
- Personalized supplement protocols
- Lifestyle medicine and habit formation
- Time-blocking and schedule optimization

CRITICAL INSTRUCTIONS FOR ULTRA-DETAILED RESPONSES:
1. Create EXTREMELY detailed, minute-by-minute daily schedules
2. Include specific timings, durations, and exact protocols
3. Provide scientific explanations for WHY each activity is recommended
4. Include specific instructions, form cues, and modifications
5. Address the user's chronic conditions and health goals specifically
6. Include supplement timing, dosages, and interactions
7. Provide meal plans with exact ingredients, portions, and preparation
8. Include stress management, sleep optimization, and recovery protocols
9. Make every activity actionable with step-by-step instructions
10. Always respond in valid JSON format with comprehensive details

Remember: You are creating a comprehensive health transformation protocol, not generic advice. Be extremely specific, detailed, and evidence-based.`;

    // Create the prompt (simplified version)
    const prompt = `Create an ULTRA-DETAILED, minute-by-minute daily schedule for this user based on their selected plan and comprehensive health profile.

SELECTED PLAN: ${JSON.stringify(testData.selectedPlan, null, 2)}

USER PROFILE: ${JSON.stringify(testData.userProfile, null, 2)}

Create a COMPLETE day schedule from 06:00 to 22:00 with:
1. Detailed daily timeline with exact times
2. Comprehensive activity descriptions with scientific rationale
3. Specific instructions, form cues, and modifications
4. Meal plans with exact ingredients, portions, and preparation steps
5. Supplement protocols with timing and dosages
6. Exercise routines with sets, reps, rest periods, and progressions
7. Stress management and recovery protocols
8. Sleep optimization and circadian rhythm support

Format as detailed JSON with comprehensive plan information.`;

    console.log("📤 Sending request to Groq API...");
    
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${GROQ_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages: [
          {
            role: "system",
            content: enhancedSystemPrompt
          },
          {
            role: "user",
            content: prompt
          }
        ],
        max_tokens: 4000, // Reduced for testing
        temperature: 0.9,
        top_p: 0.95,
        frequency_penalty: 0.1,
        presence_penalty: 0.1
      })
    });

    if (!response.ok) {
      throw new Error(`Groq API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    const responseText = data.choices[0].message.content;
    
    console.log("\n✅ Response received!");
    console.log("📊 Response length:", responseText.length, "characters");
    console.log("🔍 Model used:", data.model || "Unknown");
    console.log("⏱️ Tokens used:", data.usage?.total_tokens || "Unknown");
    
    // Try to parse JSON
    let parsedResponse;
    try {
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        parsedResponse = JSON.parse(jsonMatch[0]);
        console.log("✅ JSON parsing successful");
      } else {
        console.log("⚠️ No JSON found in response");
      }
    } catch (parseError) {
      console.log("❌ JSON parsing failed:", parseError.message);
    }
    
    console.log("\n📄 Response Preview (first 2000 characters):");
    console.log(responseText.substring(0, 2000) + "...");
    
    if (parsedResponse) {
      console.log("\n🔍 Parsed Structure:");
      console.log("- Keys:", Object.keys(parsedResponse));
      if (parsedResponse.dayTitle) {
        console.log("- Day Title:", parsedResponse.dayTitle);
      }
      if (parsedResponse.welcomeMessage) {
        console.log("- Welcome Message:", parsedResponse.welcomeMessage.substring(0, 100) + "...");
      }
    }
    
  } catch (error) {
    console.error("❌ Test failed:", error.message);
  }
}

// Run the test
testGroqResponse();
