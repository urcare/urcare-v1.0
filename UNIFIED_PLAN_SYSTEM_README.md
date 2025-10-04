# Unified Plan System - Complete Implementation

## Overview

This system provides a comprehensive solution for generating detailed health plans using Groq AI and creating personalized daily schedules using Gemini AI, with automatic midnight updates. The system integrates user onboarding data, timeline preferences, and performance feedback to create adaptive, personalized health experiences.

## Architecture

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   User Input    │───▶│  Unified Service │───▶│  Plan Storage   │
│ (Onboarding)    │    │                  │    │                 │
└─────────────────┘    └──────────────────┘    └─────────────────┘
                                │
                                ▼
                       ┌──────────────────┐
                       │  Groq Service    │
                       │ (Plan Generation)│
                       └──────────────────┘
                                │
                                ▼
                       ┌──────────────────┐
                       │ Gemini Service   │
                       │(Schedule Creation)│
                       └──────────────────┘
                                │
                                ▼
                       ┌──────────────────┐
                       │ Midnight Scheduler│
                       │ (Auto Updates)   │
                       └──────────────────┘
```

## Key Features

### 1. **Detailed Plan Generation (Groq)**
- Generates 3 comprehensive health plans (Beginner, Intermediate, Advanced)
- Includes detailed activity templates with instructions and modifications
- Provides nutrition guidelines with macronutrient breakdown
- Includes recovery protocols and sleep requirements
- Offers adaptation rules for different fitness levels

### 2. **Daily Schedule Creation (Gemini)**
- Creates personalized daily schedules from plan data
- Adapts to user performance and feedback
- Considers weather conditions and special events
- Provides specific meal plans and hydration schedules
- Includes recovery and stress management activities

### 3. **Automatic Midnight Updates**
- Automatically generates new schedules at midnight
- Adapts plans based on previous day's performance
- Tracks progress and milestone achievements
- Provides intelligent plan modifications

### 4. **Progress Tracking**
- Monitors completion rates and user feedback
- Tracks milestone achievements
- Maintains adaptation history
- Provides progress insights and recommendations

## File Structure

```
src/
├── types/
│   └── planTypes.ts                 # Type definitions for plans and schedules
├── services/
│   ├── enhancedGroqService.ts       # Groq AI service for plan generation
│   ├── geminiScheduleService.ts     # Gemini AI service for schedule creation
│   ├── midnightScheduler.ts         # Automatic midnight update scheduler
│   └── unifiedPlanService.ts        # Main unified service
api/
└── generate-unified-plan.js         # API endpoint for plan generation
test-unified-plan-flow.js            # Test script for complete flow
```

## Usage

### 1. **Generate Complete Plan**

```javascript
import { unifiedPlanService } from './src/services/unifiedPlanService';

const planRequest = {
  user_profile: {
    id: 'user_123',
    full_name: 'John Doe',
    age: 30,
    health_goals: ['Weight Loss', 'Muscle Building'],
    timeline_preferences: {
      duration_weeks: 8,
      intensity_preference: 'medium'
    },
    // ... other profile data
  },
  health_score: 65,
  health_analysis: 'Good foundation for improvement...',
  recommendations: ['Increase water intake', 'Add strength training'],
  customization_preferences: {
    workout_intensity: 'medium',
    equipment_access: ['Dumbbells', 'Yoga mat']
  }
};

const result = await unifiedPlanService.generateCompletePlan(planRequest);
```

### 2. **Generate Daily Schedule**

```javascript
const schedule = await unifiedPlanService.generateDailySchedule('user_123', '2024-01-15');
```

### 3. **Get User Progress**

```javascript
const progress = await unifiedPlanService.getUserProgress('user_123');
```

### 4. **Update User Plan**

```javascript
const updates = {
  health_goals: ['Weight Loss', 'Muscle Building', 'Better Sleep'],
  timeline_preferences: {
    duration_weeks: 12,
    intensity_preference: 'high'
  }
};

await unifiedPlanService.updateUserPlan('user_123', updates);
```

## API Endpoints

### POST `/api/generate-unified-plan`

Generates a complete health plan with daily schedule.

**Request Body:**
```json
{
  "userProfile": {
    "id": "user_123",
    "full_name": "John Doe",
    "age": 30,
    "health_goals": ["Weight Loss", "Muscle Building"],
    "timeline_preferences": {
      "duration_weeks": 8,
      "intensity_preference": "medium"
    }
  },
  "healthScore": 65,
  "healthAnalysis": "Good foundation for improvement...",
  "recommendations": ["Increase water intake", "Add strength training"],
  "customizationPreferences": {
    "workout_intensity": "medium",
    "equipment_access": ["Dumbbells", "Yoga mat"]
  }
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "plans": [...], // Array of 3 detailed plans
    "selected_plan": {...}, // Best plan for user
    "initial_schedule": {...}, // Today's schedule
    "progress_tracking": {...} // Progress tracking data
  },
  "processingTime": 2500,
  "provider": "Unified (Groq + Gemini)"
}
```

## Environment Variables

```bash
# Required API Keys
VITE_GROQ_API_KEY=your_groq_api_key_here
VITE_GEMINI_API_KEY=your_gemini_api_key_here

# Optional (for fallback)
VITE_OPENAI_API_KEY=your_openai_api_key_here
```

## Testing

Run the complete flow test:

```bash
node test-unified-plan-flow.js
```

This will test:
- Plan generation with Groq
- Schedule creation with Gemini
- Midnight scheduler registration
- Progress tracking
- Force update simulation

## Key Components

### 1. **Enhanced Groq Service**
- Generates detailed health plans with comprehensive information
- Includes activity templates, nutrition guidelines, and recovery protocols
- Provides fallback plans when API is unavailable

### 2. **Gemini Schedule Service**
- Creates personalized daily schedules
- Adapts to user performance and circumstances
- Considers weather, events, and user feedback

### 3. **Midnight Scheduler**
- Automatically updates schedules at midnight
- Tracks user progress and performance
- Provides intelligent plan adaptations

### 4. **Unified Plan Service**
- Integrates all services into a single interface
- Handles plan selection and optimization
- Manages user registration and updates

## Data Models

### DetailedPlan
- Complete plan structure with activities, nutrition, and recovery
- Includes progression milestones and adaptation rules
- Provides equipment requirements and alternatives

### DailySchedule
- Specific daily schedule with scheduled activities
- Includes nutrition plan and recovery focus
- Tracks completion status and user feedback

### UserOnboardingData
- Comprehensive user profile information
- Timeline preferences and lifestyle factors
- Health goals and dietary preferences

## Features

### ✅ **Implemented**
- [x] Detailed plan generation with Groq
- [x] Daily schedule creation with Gemini
- [x] Automatic midnight updates
- [x] Progress tracking and milestone management
- [x] User plan registration and updates
- [x] Fallback mechanisms for API failures
- [x] Comprehensive type definitions
- [x] Test suite for complete flow

### 🔄 **In Progress**
- [ ] Database integration for persistent storage
- [ ] Real-time progress updates
- [ ] Advanced analytics and insights
- [ ] Mobile app integration

### 📋 **Future Enhancements**
- [ ] Social features and community challenges
- [ ] Integration with fitness trackers
- [ ] Advanced AI coaching and recommendations
- [ ] Gamification and achievement system

## Troubleshooting

### Common Issues

1. **API Key Not Configured**
   - Ensure environment variables are set correctly
   - Check API key validity and permissions

2. **Plan Generation Fails**
   - System will automatically use fallback plans
   - Check Groq API status and rate limits

3. **Schedule Creation Fails**
   - System will use plan templates as fallback
   - Check Gemini API status and rate limits

4. **Midnight Scheduler Not Running**
   - Check if scheduler is properly initialized
   - Verify user plan registration

### Debug Mode

Enable debug logging by setting:
```bash
DEBUG=unified-plan-system
```

## Support

For issues or questions:
1. Check the test script for examples
2. Review the API documentation
3. Check environment variable configuration
4. Verify API key permissions

## License

This system is part of the UrCare Health Platform and follows the same licensing terms.
