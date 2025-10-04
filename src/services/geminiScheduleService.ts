// Gemini Service for Daily Schedule Generation
// Creates personalized daily schedules from plan data with intelligent adaptations

import { 
  DetailedPlan, 
  ScheduleGenerationRequest, 
  DailySchedule,
  ScheduledActivity,
  DailyNutritionPlan,
  MidnightUpdateRequest,
  UserOnboardingData
} from '@/types/planTypes';

interface GeminiResponse {
  success: boolean;
  data?: any;
  error?: string;
  processingTime: number;
}

class GeminiScheduleService {
  private apiKey: string;
  private baseUrl: string = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';

  constructor() {
    this.apiKey = import.meta.env.VITE_GEMINI_API_KEY || '';
    
    if (!this.apiKey) {
      console.warn('Gemini API key not found. Schedule generation will use fallback responses.');
    }
  }

  private async makeRequest(prompt: string): Promise<GeminiResponse> {
    if (!this.apiKey) {
      return {
        success: false,
        error: 'Gemini API key not configured',
        processingTime: 0
      };
    }

    const startTime = Date.now();

    try {
      const response = await fetch(`${this.baseUrl}?key=${this.apiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: prompt
            }]
          }],
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 4000,
            topP: 0.8,
            topK: 40,
            responseMimeType: "application/json"
          }
        })
      });

      if (!response.ok) {
        throw new Error(`Gemini API error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      
      if (data.candidates && data.candidates[0] && data.candidates[0].content) {
        const content = data.candidates[0].content.parts[0].text;
        
        try {
          // First, try to parse as JSON directly
          const jsonData = JSON.parse(content);
          return {
            success: true,
            data: jsonData,
            processingTime: Date.now() - startTime
          };
        } catch (parseError) {
          console.error('Failed to parse Gemini response as JSON:', parseError);
          console.log('Raw response:', content);
          
          // If JSON parsing fails, try to extract JSON from HTML or other formats
          try {
            // Remove HTML tags and extract JSON
            const cleanText = content
              .replace(/<[^>]*>/g, '') // Remove HTML tags
              .replace(/&lt;/g, '<')
              .replace(/&gt;/g, '>')
              .replace(/&amp;/g, '&')
              .replace(/&quot;/g, '"')
              .replace(/&#39;/g, "'");
            
            // Try to find JSON array or object in the cleaned text
            const jsonMatch = cleanText.match(/\{[\s\S]*\}/) || cleanText.match(/\[[\s\S]*\]/);
            if (jsonMatch) {
              const jsonData = JSON.parse(jsonMatch[0]);
              return {
                success: true,
                data: jsonData,
                processingTime: Date.now() - startTime
              };
            } else {
              throw new Error('No valid JSON found in response');
            }
          } catch (htmlParseError) {
            console.error('Failed to parse HTML response:', htmlParseError);
            console.log('Cleaned text:', content.replace(/<[^>]*>/g, ''));
            
            return {
              success: true,
              data: { content },
              processingTime: Date.now() - startTime
            };
          }
        }
      } else {
        throw new Error('Invalid response format from Gemini API');
      }
    } catch (error) {
      console.error('Gemini API request failed:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
        processingTime: Date.now() - startTime
      };
    }
  }

  // Generate daily schedule from plan data
  async generateDailySchedule(request: ScheduleGenerationRequest): Promise<GeminiResponse> {
    const prompt = this.createDailySchedulePrompt(request);
    return await this.makeRequest(prompt);
  }

  // Generate weekly schedule from plan data
  async generateWeeklySchedule(planData: DetailedPlan, userProfile: UserOnboardingData, startDate: string): Promise<GeminiResponse> {
    const prompt = this.createWeeklySchedulePrompt(planData, userProfile, startDate);
    return await this.makeRequest(prompt);
  }

  // Generate midnight update for next day's schedule
  async generateMidnightUpdate(request: MidnightUpdateRequest): Promise<GeminiResponse> {
    const prompt = this.createMidnightUpdatePrompt(request);
    return await this.makeRequest(prompt);
  }

  // Generate adaptive schedule based on previous day's performance
  async generateAdaptiveSchedule(
    planData: DetailedPlan, 
    userProfile: UserOnboardingData, 
    previousDayPerformance: any,
    targetDate: string
  ): Promise<GeminiResponse> {
    const prompt = this.createAdaptiveSchedulePrompt(planData, userProfile, previousDayPerformance, targetDate);
    return await this.makeRequest(prompt);
  }

  private createDailySchedulePrompt(request: ScheduleGenerationRequest): string {
    const { plan_data, user_profile, target_date, previous_day_performance, weather_conditions, special_events } = request;
    
    return `You are an expert health and wellness AI assistant specializing in creating personalized daily schedules. Generate a detailed daily schedule for ${user_profile.full_name} based on their selected plan and current circumstances.

PLAN DETAILS:
- Plan: ${plan_data.title}
- Difficulty: ${plan_data.difficulty}
- Focus Areas: ${plan_data.focus_areas.join(', ')}
- Target Date: ${target_date}
- Day Type: ${plan_data.weekly_structure[this.getDayOfWeek(target_date)].day_type}

USER PROFILE:
- Name: ${user_profile.full_name}
- Age: ${user_profile.age}
- Health Goals: ${user_profile.health_goals.join(', ')}
- Workout Time Preference: ${user_profile.workout_time}
- Sleep Schedule: ${user_profile.sleep_time} - ${user_profile.wake_up_time}
- Work Schedule: ${user_profile.lifestyle_factors.work_schedule}
- Available Time: ${user_profile.lifestyle_factors.commute_time} minutes commute

${previous_day_performance ? `
PREVIOUS DAY PERFORMANCE:
- Completion Rate: ${previous_day_performance.completion_rate}%
- Difficulty Feedback: ${previous_day_performance.difficulty_feedback}/10
- Energy Levels: ${previous_day_performance.energy_levels}/10
- Notes: ${previous_day_performance.notes}
` : ''}

${weather_conditions ? `
WEATHER CONDITIONS:
- Temperature: ${weather_conditions.temperature}°C
- Conditions: ${weather_conditions.conditions}
- Outdoor Suitable: ${weather_conditions.outdoor_suitable ? 'Yes' : 'No'}
` : ''}

${special_events ? `
SPECIAL EVENTS:
${special_events.map(event => `- ${event.type} at ${event.time} (Impact: ${event.impact_on_schedule})`).join('\n')}
` : ''}

Create a comprehensive daily schedule that includes:

1. **Scheduled Activities**: Specific times, durations, and detailed instructions
2. **Nutrition Plan**: Meal timing, specific foods, and hydration schedule
3. **Recovery Focus**: Rest periods, stress management, and sleep preparation
4. **Adaptations**: Modifications based on previous performance and current circumstances
5. **Motivation Elements**: Encouraging messages and progress tracking

Consider:
- User's energy levels and previous day's performance
- Weather conditions for outdoor activities
- Special events and time constraints
- Optimal timing for different activities
- Recovery and rest needs
- Nutrition timing and requirements

Format your response as detailed JSON following the DailySchedule interface structure.`;
  }

  private createWeeklySchedulePrompt(planData: DetailedPlan, userProfile: UserOnboardingData, startDate: string): string {
    return `You are an expert health and wellness AI assistant. Generate a complete weekly schedule for ${userProfile.full_name} based on their selected plan.

PLAN DETAILS:
- Plan: ${planData.title}
- Difficulty: ${planData.difficulty}
- Duration: ${planData.duration_weeks} weeks
- Focus Areas: ${planData.focus_areas.join(', ')}
- Start Date: ${startDate}

USER PROFILE:
- Name: ${userProfile.full_name}
- Age: ${userProfile.age}
- Health Goals: ${userProfile.health_goals.join(', ')}
- Workout Time Preference: ${userProfile.workout_time}
- Sleep Schedule: ${userProfile.sleep_time} - ${userProfile.wake_up_time}
- Work Schedule: ${userProfile.lifestyle_factors.work_schedule}
- Preferred Workout Days: ${userProfile.timeline_preferences.preferred_workout_days.join(', ')}
- Preferred Rest Days: ${userProfile.timeline_preferences.preferred_rest_days.join(', ')}

Create a complete weekly schedule (7 days) with:

1. **Daily Schedules**: Complete daily plans with specific activities and times
2. **Progressive Structure**: Each day builds on the previous day
3. **Variety and Balance**: Different types of activities throughout the week
4. **Recovery Integration**: Proper rest and recovery scheduling
5. **Nutrition Planning**: Daily meal plans and hydration schedules
6. **Flexibility Options**: Alternative activities for different circumstances

Consider:
- User's lifestyle and time constraints
- Optimal progression throughout the week
- Balance between different activity types
- Recovery and rest needs
- Nutrition timing and requirements
- Motivation and engagement factors

Format your response as detailed JSON with complete weekly schedule data.`;
  }

  private createMidnightUpdatePrompt(request: MidnightUpdateRequest): string {
    const { user_id, plan_id, current_date, previous_day_data, adaptation_needed, reason_for_adaptation } = request;
    
    return `You are an expert health and wellness AI assistant. Generate an updated daily schedule for tomorrow based on today's performance and user feedback.

USER ID: ${user_id}
PLAN ID: ${plan_id}
CURRENT DATE: ${current_date}
TOMORROW'S DATE: ${this.getNextDay(current_date)}

PREVIOUS DAY PERFORMANCE:
- Completion Rate: ${previous_day_data.completion_rate}%
- Activities Completed: ${previous_day_data.activities_completed}/${previous_day_data.total_activities}
- User Feedback:
  - Difficulty Rating: ${previous_day_data.user_feedback.difficulty_rating}/10
  - Energy Levels: ${previous_day_data.user_feedback.energy_levels}/10
  - Satisfaction: ${previous_day_data.user_feedback.satisfaction}/10
  - Notes: ${previous_day_data.user_feedback.notes}

ADAPTATION NEEDED: ${adaptation_needed ? 'Yes' : 'No'}
${reason_for_adaptation ? `REASON: ${reason_for_adaptation}` : ''}

Generate an updated schedule for tomorrow that:

1. **Adapts to Performance**: Adjusts difficulty and duration based on today's completion rate
2. **Addresses Feedback**: Incorporates user's difficulty and energy level feedback
3. **Maintains Progression**: Keeps the plan moving forward appropriately
4. **Optimizes Timing**: Adjusts activity timing based on energy patterns
5. **Provides Motivation**: Includes encouraging messages and progress recognition

Adaptation Guidelines:
- If completion rate < 70%: Reduce difficulty or duration
- If difficulty rating > 7: Simplify activities or add more breaks
- If energy levels < 5: Focus on lighter activities and better recovery
- If satisfaction < 6: Add more variety or adjust timing
- If adaptation needed: Make specific changes based on reason

Format your response as detailed JSON following the DailySchedule interface structure.`;
  }

  private createAdaptiveSchedulePrompt(
    planData: DetailedPlan, 
    userProfile: UserOnboardingData, 
    previousDayPerformance: any,
    targetDate: string
  ): string {
    return `You are an expert health and wellness AI assistant. Generate an adaptive daily schedule that intelligently adjusts based on the user's previous performance and current needs.

PLAN DETAILS:
- Plan: ${planData.title}
- Difficulty: ${planData.difficulty}
- Target Date: ${targetDate}

USER PROFILE:
- Name: ${userProfile.full_name}
- Age: ${userProfile.age}
- Health Goals: ${userProfile.health_goals.join(', ')}
- Workout Time Preference: ${userProfile.workout_time}
- Sleep Schedule: ${userProfile.sleep_time} - ${userProfile.wake_up_time}

PREVIOUS DAY PERFORMANCE:
- Completion Rate: ${previousDayPerformance.completion_rate}%
- Difficulty Feedback: ${previousDayPerformance.difficulty_feedback}/10
- Energy Levels: ${previousDayPerformance.energy_levels}/10
- Satisfaction: ${previousDayPerformance.satisfaction}/10
- Notes: ${previousDayPerformance.notes}

Generate an adaptive schedule that:

1. **Intelligently Adjusts**: Modifies activities based on performance data
2. **Maintains Motivation**: Keeps the user engaged and progressing
3. **Optimizes Timing**: Schedules activities when user has most energy
4. **Provides Alternatives**: Offers backup options for different circumstances
5. **Tracks Progress**: Includes progress indicators and achievements

Adaptation Rules:
- High completion + low difficulty = Increase challenge
- Low completion + high difficulty = Reduce challenge
- Low energy = Focus on recovery and lighter activities
- High satisfaction = Continue similar approach
- Low satisfaction = Add variety and adjust approach

Format your response as detailed JSON following the DailySchedule interface structure.`;
  }

  private getDayOfWeek(dateString: string): string {
    const date = new Date(dateString);
    const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    return days[date.getDay()];
  }

  private getNextDay(dateString: string): string {
    const date = new Date(dateString);
    date.setDate(date.getDate() + 1);
    return date.toISOString().split('T')[0];
  }

  // Fallback method for when Gemini is not available
  generateFallbackDailySchedule(request: ScheduleGenerationRequest): DailySchedule {
    const { plan_data, user_profile, target_date } = request;
    const dayOfWeek = this.getDayOfWeek(target_date);
    const dayTemplate = plan_data.weekly_structure[dayOfWeek as keyof typeof plan_data.weekly_structure];
    
    return {
      id: `schedule_${user_profile.id}_${target_date}`,
      user_id: user_profile.id,
      plan_id: plan_data.id,
      date: target_date,
      day_of_week: dayOfWeek,
      day_type: dayTemplate.day_type,
      activities: dayTemplate.activities.map((activity, index) => ({
        id: `activity_${index}_${target_date}`,
        template_id: activity.id,
        title: activity.title,
        category: activity.category,
        scheduled_time: activity.time_slot,
        duration_minutes: activity.duration_minutes,
        intensity: activity.intensity,
        description: activity.description,
        instructions: activity.instructions,
        equipment: activity.equipment,
        status: 'pending',
        completion_notes: '',
        actual_duration: 0,
        difficulty_rating: 0,
        satisfaction_rating: 0
      })),
      nutrition_plan: {
        date: target_date,
        total_calories: plan_data.nutrition_guidelines.daily_calories,
        meals: {
          breakfast: {
            name: "Healthy Breakfast",
            time: "07:00",
            calories: 400,
            macronutrients: { protein: 20, carbs: 50, fat: 15 },
            ingredients: ["Oatmeal", "Berries", "Nuts", "Milk"],
            preparation_time: 10,
            instructions: ["Cook oatmeal", "Add berries and nuts", "Serve with milk"],
            alternatives: ["Toast with avocado", "Greek yogurt parfait"],
            dietary_restrictions: []
          },
          lunch: {
            name: "Balanced Lunch",
            time: "12:00",
            calories: 500,
            macronutrients: { protein: 25, carbs: 60, fat: 20 },
            ingredients: ["Grilled chicken", "Quinoa", "Vegetables", "Olive oil"],
            preparation_time: 20,
            instructions: ["Grill chicken", "Cook quinoa", "Sauté vegetables", "Combine and serve"],
            alternatives: ["Salad bowl", "Wrap"],
            dietary_restrictions: []
          },
          dinner: {
            name: "Light Dinner",
            time: "18:00",
            calories: 400,
            macronutrients: { protein: 30, carbs: 40, fat: 15 },
            ingredients: ["Fish", "Sweet potato", "Broccoli", "Herbs"],
            preparation_time: 25,
            instructions: ["Bake fish with herbs", "Roast sweet potato", "Steam broccoli", "Serve together"],
            alternatives: ["Vegetarian option", "Pasta dish"],
            dietary_restrictions: []
          },
          snacks: [
            {
              name: "Morning Snack",
              time: "10:00",
              calories: 150,
              macronutrients: { protein: 5, carbs: 20, fat: 5 },
              ingredients: ["Apple", "Almonds"],
              preparation_time: 2,
              instructions: ["Slice apple", "Add almonds"],
              alternatives: ["Banana", "Trail mix"],
              dietary_restrictions: []
            }
          ]
        },
        hydration: {
          target_water_intake: plan_data.nutrition_guidelines.hydration_goals.daily_water_intake,
          timing_schedule: plan_data.nutrition_guidelines.hydration_goals.timing_recommendations,
          current_intake: 0
        },
        supplements: []
      },
      recovery_focus: ["Proper sleep", "Stress management", "Active recovery"],
      progress_notes: "",
      completion_status: 'pending',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
  }
}

// Export singleton instance
export const geminiScheduleService = new GeminiScheduleService();
export default geminiScheduleService;
