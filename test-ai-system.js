// Comprehensive AI Health Plan System Test
import fetch from 'node-fetch';

const userProfile = {
  full_name: "Sarthak Sharma",
  age: 23,
  gender: "Male",
  height_cm: "180",
  weight_kg: "80",
  blood_group: "B+",
  wake_up_time: "07:30",
  sleep_time: "02:00",
  work_start: "11:00",
  work_end: "23:30",
  breakfast_time: "10:30",
  lunch_time: "14:00",
  dinner_time: "21:00",
  workout_time: "08:00",
  chronic_conditions: ["chronic_stress_anxiety", "sleep_disorders_poor_sleep", "digestive_disorders_ibs_gut_issues"],
  health_goals: ["boost_energy_vitality", "better_sleep_recovery", "reduce_stress_anxiety"],
  diet_type: "Vegetarian",
  workout_type: "Home Gym",
  routine_flexibility: "8",
  critical_conditions: "Sinus",
  allergies: null
};

async function testAISystem() {
  console.log('🎯 AI Health Plan System Test');
  console.log('=============================');
  console.log(`👤 User: ${userProfile.full_name} (${userProfile.age}M, ${userProfile.height_cm}cm, ${userProfile.weight_kg}kg)`);
  console.log(`🏠 Workout: ${userProfile.workout_type} | 🍽️ Diet: ${userProfile.diet_type}`);
  console.log(`⏰ Schedule: Wake ${userProfile.wake_up_time} | Work ${userProfile.work_start}-${userProfile.work_end} | Sleep ${userProfile.sleep_time}`);
  console.log(`🎯 Goals: ${userProfile.health_goals.join(', ')}`);
  console.log(`⚠️ Conditions: ${userProfile.chronic_conditions.join(', ')}`);
  console.log('');
  
  try {
    // Test Sequential Groq -> Gemini Flow
    console.log('🔄 Testing Sequential Groq -> Gemini Flow...');
    const response = await fetch('http://localhost:3000/api/groq-gemini-sequential', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userProfile: userProfile,
        primaryGoal: 'Boost energy, improve sleep, reduce stress'
      })
    });
    
    if (response.ok) {
      const data = await response.json();
      console.log('✅ Sequential Flow Success!');
      console.log(`🔄 Flow: ${data.flow}`);
      console.log('');
      
      // Display Groq Results
      console.log('🤖 GROQ AI RESULTS:');
      console.log('==================');
      console.log(`📋 Generated ${data.step1.plans?.length || 0} health plans`);
      
      if (data.step1.plans && data.step1.plans.length > 0) {
        data.step1.plans.forEach((plan, index) => {
          console.log(`\n${index + 1}. ${plan.name || plan.title}`);
          console.log(`   Difficulty: ${plan.difficulty || 'Not specified'}`);
          console.log(`   Duration: ${plan.duration || 'Not specified'}`);
          console.log(`   Focus: ${plan.focusAreas?.join(', ') || 'General wellness'}`);
          console.log(`   Calories: ${plan.calorieTarget || 'Not specified'}`);
          console.log(`   Equipment: ${plan.equipment?.join(', ') || 'Basic equipment'}`);
        });
      }
      
      // Display Gemini Results
      console.log('\n🧠 GEMINI AI RESULTS:');
      console.log('====================');
      console.log(`📅 Generated detailed schedule based on Groq plan`);
      
      if (data.step2.schedule && data.step2.schedule.dailySchedule) {
        const schedule = data.step2.schedule.dailySchedule;
        console.log(`📊 Schedule contains ${schedule.length} daily activities:`);
        
        schedule.forEach((activity, index) => {
          console.log(`\n${index + 1}. ${activity.time} - ${activity.activity}`);
          console.log(`   Category: ${activity.category}`);
          console.log(`   Duration: ${activity.duration}`);
          console.log(`   Details: ${activity.details}`);
          if (activity.calories) {
            console.log(`   Calories: ${activity.calories}`);
          }
          if (activity.meal) {
            console.log(`   Meal: ${activity.meal.name} (${activity.meal.totalCalories} cal)`);
          }
          if (activity.workout) {
            console.log(`   Workout: ${activity.workout.type} (${activity.workout.totalDuration})`);
          }
        });
      }
      
      console.log('\n🎉 AI SYSTEM TEST SUCCESSFUL!');
      console.log('=============================');
      console.log('✅ Groq AI: Generated health plans');
      console.log('✅ Gemini AI: Created detailed schedule');
      console.log('🔄 Sequential processing completed!');
      
    } else {
      console.log('❌ API call failed:', response.status);
      const errorText = await response.text();
      console.log('Error details:', errorText);
    }
    
  } catch (error) {
    console.error('❌ Error testing AI system:', error.message);
  }
}

testAISystem();
