# AI Health Plan System

A comprehensive health planning system that uses **Groq AI** and **Gemini AI** in sequence to generate personalized health plans and detailed daily schedules.

## 🚀 Quick Start

### 1. Start the Server
```bash
node unified-server.js
```

### 2. Test the System
```bash
node test-ai-system.js
```

## 🤖 How It Works

### Sequential AI Flow:
```
User Profile → Groq AI → Health Plans → Gemini AI → Detailed Schedule
```

1. **Groq AI** generates 3 comprehensive health plans based on user profile
2. **Gemini AI** creates detailed daily schedule using Groq's first plan
3. **Result**: Complete health plan with personalized daily activities

## 📋 API Endpoints

### Main Endpoint
- **POST** `/api/groq-gemini-sequential`
- **Body**: `{ "userProfile": {...}, "primaryGoal": "..." }`
- **Response**: Complete health plans + detailed schedule

### Other Endpoints
- **POST** `/api/health-score` - Health assessment
- **POST** `/api/health-plans` - Basic health plans
- **POST** `/api/groq/generate-plan` - Groq-only plans
- **POST** `/api/plan-activities` - Activity generation

## 🎯 Features

✅ **Real AI Generation** - No mock data, uses actual Groq and Gemini APIs  
✅ **Personalized Plans** - Based on specific user profile and conditions  
✅ **Work Schedule Aware** - Respects work hours and constraints  
✅ **Health Condition Focused** - Addresses stress, sleep, IBS, sinus issues  
✅ **Vegetarian Meal Plans** - With detailed macros and calories  
✅ **Home Gym Workouts** - Bodyweight exercises with minimal equipment  
✅ **Stress Management** - Breathing exercises, desk stretches, mindfulness  

## 📊 Example Output

### Groq AI Plans:
1. **Serenity Blueprint** (Beginner) - Stress reduction focused
2. **Balance Revival** (Intermediate) - Comprehensive wellness  
3. **Vitality Ignition** (Advanced) - Results-focused

### Gemini AI Schedule:
- **07:30**: Morning Energy Boost (30 min)
- **08:00**: Home Gym Workout (30 min)
- **10:30**: Vegetarian Breakfast (30 min)
- **11:00**: Work Start (8.5 hours with desk exercises)
- **14:00**: Balanced Lunch (30 min)
- **21:00**: Light Dinner (30 min)
- **02:00**: Sleep (5.5 hours)

## 🔧 Configuration

### Required Environment Variables:
```env
VITE_GROQ_API_KEY=your_groq_api_key
VITE_GEMINI_API_KEY=your_gemini_api_key
VITE_OPENAI_API_KEY=your_openai_api_key
```

### User Profile Format:
```javascript
{
  "full_name": "Sarthak Sharma",
  "age": 23,
  "height_cm": "180",
  "weight_kg": "80",
  "work_start": "11:00",
  "work_end": "23:30",
  "wake_up_time": "07:30",
  "sleep_time": "02:00",
  "workout_time": "08:00",
  "diet_type": "Vegetarian",
  "workout_type": "Home Gym",
  "health_goals": ["boost_energy_vitality", "better_sleep_recovery", "reduce_stress_anxiety"],
  "chronic_conditions": ["chronic_stress_anxiety", "sleep_disorders_poor_sleep", "digestive_disorders_ibs_gut_issues"]
}
```

## 🎉 Success!

The system successfully generates:
- **3 Health Plans** with different difficulty levels
- **Detailed Daily Schedule** with exact timings
- **Specific Exercises** for home gym
- **Vegetarian Meal Plans** with macros
- **Work-Break Activities** for long work days
- **Stress Management** techniques
- **Sleep Improvement** routines

## 📁 Project Structure

```
├── unified-server.js          # Main server with all APIs
├── test-ai-system.js          # Test script
├── src/pages/api/             # API endpoints
│   ├── groq/
│   │   └── generate-plan.js   # Groq plan generation
│   └── gemini/
│       └── generate-schedule.js # Gemini schedule generation
└── AI_HEALTH_SYSTEM_README.md # This file
```

## 🚀 Ready to Use!

The AI health plan system is now clean, optimized, and ready to generate personalized health plans using both Groq and Gemini AI! 🎉
