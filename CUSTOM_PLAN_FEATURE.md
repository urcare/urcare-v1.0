# Custom Plan Generation Feature

## Overview

The Custom Plan Generation feature uses AI to create personalized health plans for users based on their onboarding data. This feature provides comprehensive, actionable health recommendations tailored to individual needs, goals, and constraints.

## Features

### 1. Comprehensive Health Assessment

- Current health status analysis
- BMI calculation and interpretation
- Risk factors identification
- Health score (0-100) with explanation

### 2. Personalized Nutrition Plan

- Daily calorie target based on goals
- Macronutrient breakdown (protein, carbs, fats)
- Meal timing recommendations
- Dietary restrictions and preferences
- Sample meal suggestions

### 3. Customized Fitness Plan

- Recommended workout frequency and duration
- Exercise types based on goals and schedule
- Progressive training approach
- Recovery and rest days

### 4. Lifestyle Optimization

- Sleep schedule recommendations
- Stress management strategies
- Daily routine suggestions
- Habit formation tips

### 5. Health Monitoring Guidelines

- Key metrics to track
- Recommended health screenings
- Warning signs to watch for
- Progress indicators

### 6. Risk Assessment

- Identified risk factors
- Preventive measures
- When to consult healthcare providers

### 7. UrCare Benefits

- Specific features that will benefit the user
- Personalized recommendations the app can provide
- Expected outcomes and timeline
- Success metrics

### 8. Actionable Next Steps

- Immediate actions to take
- Weekly goals
- Monthly milestones
- Long-term objectives

## Technical Implementation

### Backend (server/index.js)

The backend uses OpenAI's GPT-4 model to generate personalized health plans. Key components:

1. **Data Extraction**: Extracts key information from user profiles including:

   - Basic info (name, age, gender, height, weight)
   - Health data (blood group, conditions, medications, goals)
   - Schedule (sleep, work, meal times)

2. **Structured Prompt**: Uses a comprehensive prompt that requests specific sections:

   - Health Assessment
   - Nutrition Plan
   - Fitness Plan
   - Lifestyle Optimization
   - Health Monitoring
   - Potential Health Risks
   - How UrCare Will Help
   - Actionable Next Steps

3. **Response Parsing**: Includes helper functions to parse and structure the AI response:
   - `parseHealthPlanResponse()`: Main parsing function
   - `extractSection()`: Extracts specific sections from the response
   - `extractHealthScore()`: Extracts health score from text
   - `extractCalorieTarget()`: Extracts calorie recommendations
   - `extractBMI()`: Extracts BMI information
   - `extractKeyRecommendations()`: Extracts top recommendations

### Frontend Components

1. **CustomPlan.tsx**: Main page that handles plan generation

   - Validates user profile data
   - Calls backend API
   - Displays loading states
   - Shows results with paywall integration

2. **StructuredHealthPlan.tsx**: Component for displaying structured plan data
   - Health score overview with progress bar
   - Organized sections with icons
   - Responsive design
   - Color-coded health indicators

## API Endpoint

**POST** `/api/generate-plan`

**Request Body:**

```json
{
  "profile": {
    "full_name": "John Doe",
    "age": 30,
    "gender": "male",
    "height_cm": "175",
    "weight_kg": "70",
    "preferences": {
      "health": {
        "blood_group": "O+",
        "chronic_conditions": ["diabetes"],
        "health_goals": ["lose_weight"]
      },
      "meals": {
        "diet_type": "vegetarian",
        "breakfast_time": "07:00"
      },
      "schedule": {
        "sleep_time": "22:00",
        "wake_up_time": "06:00"
      }
    }
  }
}
```

**Response:**

```json
{
  "report": "Raw AI-generated text...",
  "structured": {
    "summary": {
      "healthScore": "85",
      "calorieTarget": "2100",
      "bmi": "22.9",
      "keyRecommendations": [
        "Increase daily protein intake to 90g",
        "Add 30 minutes of cardio 3x per week",
        "Maintain consistent sleep schedule"
      ]
    },
    "sections": {
      "healthAssessment": "Your current health status...",
      "nutritionPlan": "Based on your goals...",
      "fitnessPlan": "Recommended exercise routine...",
      "lifestyleOptimization": "Sleep and stress management...",
      "healthMonitoring": "Key metrics to track...",
      "potentialRisks": "Risk factors to consider...",
      "urCareBenefits": "How our app will help...",
      "nextSteps": "Immediate actions to take..."
    }
  }
}
```

## User Flow

1. **Onboarding Completion**: User completes onboarding with health data
2. **Plan Generation**: System calls AI backend with user profile
3. **Loading State**: Shows progress indicator while generating
4. **Results Display**: Shows key recommendations and summary
5. **Detailed Report**: Full structured report available for subscribers
6. **Paywall Integration**: Non-subscribers see paywall overlay

## Configuration

### Environment Variables

- `OPENAI_API_KEY`: Required for AI plan generation
- `PORT`: Server port (default: 4000)

### AI Model Settings

- Model: `gpt-4o`
- Max tokens: 2000
- Temperature: 0.7
- System prompt: Certified health coach persona

## Security & Privacy

- User data is processed securely through OpenAI API
- No sensitive health data is stored in logs
- All API calls are authenticated
- Response parsing handles edge cases gracefully

## Future Enhancements

1. **Plan Templates**: Pre-defined plan templates for common scenarios
2. **Progress Tracking**: Integration with user progress data
3. **Plan Updates**: Periodic plan refresh based on user progress
4. **Multi-language Support**: Support for different languages
5. **Expert Review**: Option for human health expert review
6. **Plan Sharing**: Ability to share plans with healthcare providers

## Error Handling

The system includes comprehensive error handling:

- Missing profile data validation
- API call failures
- Response parsing errors
- Fallback to basic recommendations
- User-friendly error messages

## Performance Considerations

- AI response caching for similar profiles
- Async processing for large responses
- Optimized prompt structure for faster generation
- Progressive loading of plan sections
