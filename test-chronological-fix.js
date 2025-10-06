// Test script to verify chronological sorting and exercise grouping
const testData = {
  selectedPlan: {
    id: "test_plan",
    title: "Test Health Plan",
    difficulty: "Intermediate"
  },
  userProfile: {
    full_name: "Test User",
    age: 30,
    wake_up_time: "06:00",
    breakfast_time: "07:00",
    workout_time: "18:00",
    sleep_time: "22:00"
  }
};

// Mock response data to test processing
const mockResponse = {
  fullDayTimeline: {
    morning: {
      activities: [
        {
          time: "06:00",
          title: "Morning Routine",
          duration: "20 minutes",
          calories: 0,
          category: "morning_routine"
        },
        {
          time: "07:00",
          title: "Breakfast",
          duration: "30 minutes",
          calories: 400,
          category: "meal"
        }
      ]
    },
    evening: {
      activities: [
        {
          time: "18:00",
          title: "Yoga",
          duration: "30 minutes",
          calories: 200,
          category: "exercise"
        },
        {
          time: "18:30",
          title: "Walking",
          duration: "30 minutes",
          calories: 200,
          category: "exercise"
        },
        {
          time: "19:00",
          title: "Dinner",
          duration: "45 minutes",
          calories: 500,
          category: "meal"
        }
      ]
    }
  }
};

// Test the processing logic
function testProcessing() {
  console.log("🧪 Testing Chronological Sorting and Exercise Grouping...");
  
  // Extract all activities from all time periods
  const allActivities = [];
  
  if (mockResponse.fullDayTimeline.morning?.activities) {
    allActivities.push(...mockResponse.fullDayTimeline.morning.activities);
  }
  if (mockResponse.fullDayTimeline.evening?.activities) {
    allActivities.push(...mockResponse.fullDayTimeline.evening.activities);
  }
  
  console.log("📋 All activities before sorting:", allActivities.map(a => `${a.time} - ${a.title}`));
  
  // Sort activities by time
  allActivities.sort((a, b) => {
    const timeToMinutes = (timeStr) => {
      const [hours, minutes] = timeStr.split(':').map(Number);
      return hours * 60 + minutes;
    };
    return timeToMinutes(a.time) - timeToMinutes(b.time);
  });
  
  console.log("📅 After chronological sorting:", allActivities.map(a => `${a.time} - ${a.title}`));
  
  // Group exercises together
  const processedActivities = [];
  let currentExerciseGroup = null;
  
  for (const activity of allActivities) {
    const isExercise = activity.title?.toLowerCase().includes('yoga') ||
                      activity.title?.toLowerCase().includes('walking') ||
                      activity.title?.toLowerCase().includes('exercise');
    
    if (isExercise) {
      if (!currentExerciseGroup) {
        currentExerciseGroup = {
          time: activity.time,
          category: "exercise",
          activity: "Exercise Session",
          duration: "60 minutes",
          calories: 0,
          instructions: "Complete exercise routine as detailed below",
          equipment: [],
          difficulty: "Intermediate",
          details: "Comprehensive exercise session",
          exercises: []
        };
      }
      
      currentExerciseGroup.exercises.push({
        name: activity.title,
        time: activity.time,
        duration: activity.duration,
        calories: activity.calories || 0,
        instructions: activity.instructions || activity.details,
        equipment: activity.equipment || [],
        difficulty: activity.difficulty || "Intermediate"
      });
      
      currentExerciseGroup.calories += activity.calories || 0;
      
    } else {
      if (currentExerciseGroup) {
        processedActivities.push(currentExerciseGroup);
        currentExerciseGroup = null;
      }
      
      processedActivities.push({
        time: activity.time,
        category: activity.category || "activity",
        activity: activity.title,
        duration: activity.duration,
        calories: activity.calories || 0,
        instructions: activity.instructions || activity.details,
        equipment: activity.equipment || [],
        difficulty: activity.difficulty || "Easy",
        details: activity.details || activity.description
      });
    }
  }
  
  if (currentExerciseGroup) {
    processedActivities.push(currentExerciseGroup);
  }
  
  console.log("\n✅ Final processed activities:");
  processedActivities.forEach((activity, index) => {
    console.log(`${index + 1}. ${activity.time} - ${activity.activity} (${activity.duration})`);
    if (activity.exercises) {
      console.log(`   Exercises:`);
      activity.exercises.forEach(ex => {
        console.log(`   - ${ex.name} (${ex.duration}, ${ex.calories} cal)`);
      });
    }
  });
  
  console.log("\n🎯 Expected result: Activities should be in chronological order (06:00, 07:00, 18:00)");
  console.log("🎯 Expected result: Yoga and Walking should be grouped under one Exercise Session");
}

testProcessing();
