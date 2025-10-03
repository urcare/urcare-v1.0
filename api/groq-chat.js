// Groq AI Chat API Endpoint
// Handles chat messages and returns health analysis

const express = require('express');
const router = express.Router();

// Mock Groq API integration (replace with actual Groq API calls)
router.post('/chat', async (req, res) => {
  try {
    const { message, userProfile, uploadedFiles, voiceTranscript } = req.body;

    if (!message && !uploadedFiles?.length && !voiceTranscript) {
      return res.status(400).json({ error: 'No input provided' });
    }

    // Simulate Groq AI processing
    const healthScore = calculateHealthScoreFromMessage(message, userProfile);
    const plans = generateHealthPlansFromMessage(message, userProfile, healthScore);

    res.json({
      success: true,
      healthScore,
      analysis: generateAnalysis(healthScore, message),
      recommendations: generateRecommendations(message, userProfile),
      plans
    });

  } catch (error) {
    console.error('Groq chat error:', error);
    res.status(500).json({ error: 'Failed to process chat message' });
  }
});

// Calculate health score based on message content
function calculateHealthScoreFromMessage(message, userProfile) {
  let score = 50; // Base score
  
  const messageLower = message.toLowerCase();
  
  // Positive health indicators
  if (messageLower.includes('exercise') || messageLower.includes('workout')) score += 15;
  if (messageLower.includes('healthy') || messageLower.includes('nutrition')) score += 10;
  if (messageLower.includes('sleep') || messageLower.includes('rest')) score += 10;
  if (messageLower.includes('water') || messageLower.includes('hydrate')) score += 5;
  if (messageLower.includes('meditation') || messageLower.includes('mindfulness')) score += 10;
  
  // Negative health indicators
  if (messageLower.includes('stress') || messageLower.includes('anxiety')) score -= 10;
  if (messageLower.includes('tired') || messageLower.includes('exhausted')) score -= 5;
  if (messageLower.includes('pain') || messageLower.includes('ache')) score -= 15;
  if (messageLower.includes('sick') || messageLower.includes('ill')) score -= 20;
  
  // User profile factors
  if (userProfile?.age < 30) score += 5;
  if (userProfile?.age > 50) score -= 5;
  if (userProfile?.workout_time) score += 10;
  if (userProfile?.diet_type === 'Balanced') score += 10;
  
  return Math.max(0, Math.min(100, score));
}

// Generate health plans based on message and user profile
function generateHealthPlansFromMessage(message, userProfile, healthScore) {
  const messageLower = message.toLowerCase();
  
  // Determine focus area based on message
  let focusArea = 'general';
  if (messageLower.includes('weight') || messageLower.includes('lose')) focusArea = 'weight_loss';
  if (messageLower.includes('muscle') || messageLower.includes('strength')) focusArea = 'muscle_building';
  if (messageLower.includes('stress') || messageLower.includes('anxiety')) focusArea = 'stress_management';
  if (messageLower.includes('sleep') || messageLower.includes('insomnia')) focusArea = 'sleep_improvement';
  
  const plans = [
    {
      id: 'plan-a',
      title: 'Plan A: Foundation Building',
      description: 'Focus on establishing healthy habits and routines',
      difficulty: 'Beginner',
      duration: '4 weeks',
      focusArea,
      activities: generateActivities('beginner', focusArea)
    },
    {
      id: 'plan-b',
      title: 'Plan B: Balanced Approach',
      description: 'Moderate intensity with focus on consistency',
      difficulty: 'Intermediate',
      duration: '6 weeks',
      focusArea,
      activities: generateActivities('intermediate', focusArea)
    },
    {
      id: 'plan-c',
      title: 'Plan C: Advanced Optimization',
      description: 'High-intensity program for maximum results',
      difficulty: 'Advanced',
      duration: '8 weeks',
      focusArea,
      activities: generateActivities('advanced', focusArea)
    }
  ];
  
  return plans;
}

// Generate activities based on difficulty and focus area
function generateActivities(difficulty, focusArea) {
  const baseActivities = {
    beginner: [
      { time: '07:00', title: 'Morning Hydration', description: 'Drink 500ml water', duration: '5 minutes', category: 'Hydration' },
      { time: '07:30', title: 'Light Exercise', description: '15-minute walk or stretching', duration: '15 minutes', category: 'Exercise' },
      { time: '08:00', title: 'Healthy Breakfast', description: 'Balanced meal with protein', duration: '20 minutes', category: 'Meals' }
    ],
    intermediate: [
      { time: '06:30', title: 'Morning Routine', description: 'Hydration, meditation, light stretching', duration: '20 minutes', category: 'Wake up' },
      { time: '07:00', title: 'Workout Session', description: '30-minute cardio and strength training', duration: '30 minutes', category: 'Exercise' },
      { time: '08:00', title: 'Protein Breakfast', description: 'High-protein meal with complex carbs', duration: '25 minutes', category: 'Meals' }
    ],
    advanced: [
      { time: '05:30', title: 'Early Morning Routine', description: 'Cold shower, hydration, meditation', duration: '30 minutes', category: 'Wake up' },
      { time: '06:00', title: 'Intensive Workout', description: '45-minute HIIT or strength training', duration: '45 minutes', category: 'Exercise' },
      { time: '07:00', title: 'Post-Workout Nutrition', description: 'Protein smoothie with supplements', duration: '15 minutes', category: 'Meals' }
    ]
  };
  
  let activities = baseActivities[difficulty] || baseActivities.beginner;
  
  // Customize based on focus area
  if (focusArea === 'weight_loss') {
    activities = activities.map(activity => ({
      ...activity,
      description: activity.description + ' (weight loss focus)'
    }));
  } else if (focusArea === 'muscle_building') {
    activities = activities.map(activity => ({
      ...activity,
      description: activity.description + ' (muscle building focus)'
    }));
  } else if (focusArea === 'stress_management') {
    activities = activities.map(activity => ({
      ...activity,
      description: activity.description + ' (stress management focus)'
    }));
  }
  
  return activities;
}

// Generate analysis based on health score and message
function generateAnalysis(healthScore, message) {
  const messageLower = message.toLowerCase();
  
  if (healthScore >= 80) {
    return `Excellent! Your health score of ${healthScore} indicates you're on the right track. ${messageLower.includes('stress') ? 'Focus on stress management techniques to maintain this level.' : 'Keep up the great work!'}`;
  } else if (healthScore >= 60) {
    return `Good progress! Your health score of ${healthScore} shows you're making positive changes. ${messageLower.includes('exercise') ? 'Continue with your exercise routine and consider adding variety.' : 'Consider adding more physical activity to your routine.'}`;
  } else if (healthScore >= 40) {
    return `Your health score of ${healthScore} suggests there's room for improvement. ${messageLower.includes('tired') ? 'Focus on getting adequate sleep and managing stress.' : 'Start with small, consistent changes to build healthy habits.'}`;
  } else {
    return `Your health score of ${healthScore} indicates significant areas for improvement. ${messageLower.includes('pain') ? 'Consider consulting a healthcare professional and start with gentle, low-impact activities.' : 'Focus on basic health fundamentals like sleep, nutrition, and gentle movement.'}`;
  }
}

// Generate recommendations based on message and user profile
function generateRecommendations(message, userProfile) {
  const messageLower = message.toLowerCase();
  const recommendations = [];
  
  if (messageLower.includes('stress') || messageLower.includes('anxiety')) {
    recommendations.push('Practice daily meditation or deep breathing exercises');
    recommendations.push('Consider yoga or gentle stretching routines');
    recommendations.push('Ensure adequate sleep (7-9 hours per night)');
  }
  
  if (messageLower.includes('weight') || messageLower.includes('lose')) {
    recommendations.push('Focus on a balanced diet with portion control');
    recommendations.push('Incorporate both cardio and strength training');
    recommendations.push('Track your progress with measurements and photos');
  }
  
  if (messageLower.includes('muscle') || messageLower.includes('strength')) {
    recommendations.push('Progressive resistance training 3-4 times per week');
    recommendations.push('Ensure adequate protein intake (1.6-2.2g per kg body weight)');
    recommendations.push('Allow proper rest and recovery between workouts');
  }
  
  if (messageLower.includes('sleep') || messageLower.includes('tired')) {
    recommendations.push('Maintain a consistent sleep schedule');
    recommendations.push('Create a relaxing bedtime routine');
    recommendations.push('Limit screen time before bed');
  }
  
  // Default recommendations if no specific focus
  if (recommendations.length === 0) {
    recommendations.push('Stay hydrated by drinking 8-10 glasses of water daily');
    recommendations.push('Include at least 30 minutes of physical activity daily');
    recommendations.push('Eat a variety of fruits and vegetables');
    recommendations.push('Get 7-9 hours of quality sleep each night');
    recommendations.push('Practice stress management techniques');
  }
  
  return recommendations;
}

module.exports = router;



