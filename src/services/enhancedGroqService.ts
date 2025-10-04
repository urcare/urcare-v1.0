// Enhanced Groq Service for Detailed Plan Generation
// Generates comprehensive health plans with detailed activities, nutrition, and recovery protocols

import { 
  DetailedPlan, 
  PlanGenerationRequest, 
  UserOnboardingData,
  DailyPlanTemplate,
  ActivityTemplate 
} from '@/types/planTypes';

interface GroqResponse {
  success: boolean;
  data?: any;
  error?: string;
  processingTime: number;
}

class EnhancedGroqService {
  private apiKey: string;
  private baseUrl: string = 'https://api.groq.com/openai/v1/chat/completions';
  private model: string = 'llama3-8b-8192';

  constructor() {
    this.apiKey = import.meta.env.VITE_GROQ_API_KEY || '';
    
    if (!this.apiKey) {
      console.warn('Groq API key not found. Enhanced plan generation will use fallback responses.');
    }
  }

  private async makeRequest(systemPrompt: string, userPrompt: string): Promise<GroqResponse> {
    if (!this.apiKey) {
      return {
        success: false,
        error: 'Groq API key not configured',
        processingTime: 0
      };
    }

    const startTime = Date.now();

    try {
      const response = await fetch(this.baseUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: this.model,
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userPrompt }
          ],
          temperature: 0.7,
          max_tokens: 8000,
          top_p: 1,
          stream: false
        })
      });

      if (!response.ok) {
        throw new Error(`Groq API error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      
      if (data.choices && data.choices[0] && data.choices[0].message) {
        const content = data.choices[0].message.content;
        
        try {
          const jsonData = JSON.parse(content);
          return {
            success: true,
            data: jsonData,
            processingTime: Date.now() - startTime
          };
        } catch (parseError) {
          return {
            success: true,
            data: { content },
            processingTime: Date.now() - startTime
          };
        }
      } else {
        throw new Error('Invalid response format from Groq API');
      }
    } catch (error) {
      console.error('Groq API request failed:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
        processingTime: Date.now() - startTime
      };
    }
  }

  // Generate detailed health plans using Groq
  async generateDetailedPlans(request: PlanGenerationRequest): Promise<GroqResponse> {
    const systemPrompt = this.createDetailedPlanSystemPrompt();
    const userPrompt = this.createDetailedPlanUserPrompt(request);

    return await this.makeRequest(systemPrompt, userPrompt);
  }

  // Generate specific plan details for a selected plan
  async generatePlanDetails(planId: string, userProfile: UserOnboardingData): Promise<GroqResponse> {
    const systemPrompt = this.createPlanDetailsSystemPrompt();
    const userPrompt = this.createPlanDetailsUserPrompt(planId, userProfile);

    return await this.makeRequest(systemPrompt, userPrompt);
  }

  // Generate weekly structure for a plan
  async generateWeeklyStructure(planData: DetailedPlan, userProfile: UserOnboardingData): Promise<GroqResponse> {
    const systemPrompt = this.createWeeklyStructureSystemPrompt();
    const userPrompt = this.createWeeklyStructureUserPrompt(planData, userProfile);

    return await this.makeRequest(systemPrompt, userPrompt);
  }

  private createDetailedPlanSystemPrompt(): string {
    return `You are an expert health and wellness AI assistant specializing in creating comprehensive, personalized health plans. Your role is to generate detailed health plans that include:

1. **Comprehensive Plan Structure**: Complete plan details with progression milestones, weekly structures, and adaptation rules
2. **Detailed Activity Templates**: Specific activities with instructions, modifications, and alternatives
3. **Nutrition Guidelines**: Complete macronutrient breakdown, meal timing, and hydration goals
4. **Recovery Protocols**: Sleep requirements, rest day activities, and stress management
5. **Adaptation Rules**: Modifications for different fitness levels and circumstances

Key Guidelines:
- Create 3 distinct plans: Beginner, Intermediate, and Advanced
- Each plan must be comprehensive with 4-12 week duration
- Include specific time slots, durations, and intensities
- Provide detailed instructions for each activity
- Consider user's timeline preferences and lifestyle factors
- Include equipment requirements and alternatives
- Provide clear progression milestones
- Include nutrition and recovery protocols
- Make plans realistic and achievable
- Consider chronic conditions and medications

Format your response as detailed JSON following the DetailedPlan interface structure.`;
  }

  private createDetailedPlanUserPrompt(request: PlanGenerationRequest): string {
    const { user_profile, health_score, health_analysis, recommendations } = request;
    
    return `Generate 3 comprehensive health plans for this user based on their detailed profile and health analysis.

USER PROFILE:
- Name: ${user_profile.full_name}
- Age: ${user_profile.age}
- Gender: ${user_profile.gender}
- Height: ${user_profile.height_cm} cm
- Weight: ${user_profile.weight_kg} kg
- Blood Group: ${user_profile.blood_group}
- Chronic Conditions: ${user_profile.chronic_conditions.join(', ') || 'None'}
- Medications: ${user_profile.medications.join(', ') || 'None'}
- Health Goals: ${user_profile.health_goals.join(', ')}
- Diet Type: ${user_profile.diet_type}
- Workout Time Preference: ${user_profile.workout_time}
- Sleep Schedule: ${user_profile.sleep_time} - ${user_profile.wake_up_time}

TIMELINE PREFERENCES:
- Start Date: ${user_profile.timeline_preferences.start_date}
- Duration: ${user_profile.timeline_preferences.duration_weeks} weeks
- Preferred Workout Days: ${user_profile.timeline_preferences.preferred_workout_days.join(', ')}
- Preferred Rest Days: ${user_profile.timeline_preferences.preferred_rest_days.join(', ')}
- Intensity Preference: ${user_profile.timeline_preferences.intensity_preference}

LIFESTYLE FACTORS:
- Work Schedule: ${user_profile.lifestyle_factors.work_schedule}
- Commute Time: ${user_profile.lifestyle_factors.commute_time} minutes
- Family Obligations: ${user_profile.lifestyle_factors.family_obligations.join(', ')}
- Social Activities: ${user_profile.lifestyle_factors.social_activities.join(', ')}
- Stress Level: ${user_profile.lifestyle_factors.stress_level}/10

HEALTH DATA:
- Health Score: ${health_score}/100
- Health Analysis: ${health_analysis}
- Recommendations: ${recommendations.join(', ')}

Create 3 detailed plans:
1. BEGINNER PLAN: Focus on building sustainable habits, gentle progression
2. INTERMEDIATE PLAN: Balanced approach with moderate intensity
3. ADVANCED PLAN: Intensive program for experienced individuals

Each plan must include:
- Complete weekly structure with daily templates
- Detailed activity templates with instructions
- Nutrition guidelines with macronutrient breakdown
- Recovery protocols and sleep requirements
- Progression milestones and adaptation rules
- Equipment requirements and alternatives

Format as JSON following the DetailedPlan interface structure.`;
  }

  private createPlanDetailsSystemPrompt(): string {
    return `You are an expert health and wellness AI assistant. Your role is to provide detailed information about a specific health plan, including:

1. **Comprehensive Plan Overview**: Complete details about the plan's structure, goals, and methodology
2. **Detailed Activity Breakdown**: Specific activities with step-by-step instructions
3. **Nutrition Guidelines**: Detailed meal plans, macronutrient targets, and timing
4. **Recovery Protocols**: Sleep, rest, and stress management strategies
5. **Progression Framework**: How the plan evolves over time
6. **Adaptation Guidelines**: How to modify the plan based on individual needs

Key Guidelines:
- Provide specific, actionable information
- Include timing, duration, and intensity for each activity
- Consider different fitness levels and modifications
- Include safety considerations and prerequisites
- Provide clear progression pathways
- Include equipment requirements and alternatives
- Make information practical and implementable

Format your response as detailed JSON with comprehensive plan information.`;
  }

  private createPlanDetailsUserPrompt(planId: string, userProfile: UserOnboardingData): string {
    return `Provide detailed information about the ${planId} health plan for this user.

USER PROFILE:
- Name: ${userProfile.full_name}
- Age: ${userProfile.age}
- Health Goals: ${userProfile.health_goals.join(', ')}
- Fitness Level: ${userProfile.workout_time ? 'Active' : 'Beginner'}
- Diet Type: ${userProfile.diet_type}
- Available Time: ${userProfile.lifestyle_factors.work_schedule}
- Equipment Access: ${userProfile.lifestyle_factors.equipment_access?.join(', ') || 'Basic home equipment'}

Provide comprehensive details about:
1. Plan structure and methodology
2. Daily activity breakdown with instructions
3. Nutrition guidelines and meal planning
4. Recovery and sleep protocols
5. Progression milestones and adaptations
6. Equipment requirements and alternatives
7. Safety considerations and prerequisites

Format as detailed JSON with complete plan information.`;
  }

  private createWeeklyStructureSystemPrompt(): string {
    return `You are an expert health and wellness AI assistant. Your role is to create detailed weekly structures for health plans, including:

1. **Daily Plan Templates**: Complete daily schedules for each day of the week
2. **Activity Scheduling**: Specific times, durations, and intensities
3. **Theme and Focus**: Daily themes and focus areas
4. **Nutrition Integration**: Meal timing and nutrition focus for each day
5. **Recovery Balance**: Proper rest and recovery scheduling
6. **Flexibility Options**: Alternative activities and modifications

Key Guidelines:
- Create realistic daily schedules based on user's lifestyle
- Include proper rest and recovery days
- Balance different types of activities throughout the week
- Consider user's time constraints and preferences
- Include variety to prevent boredom
- Provide clear progression from day to day
- Include nutrition and hydration timing
- Make schedules practical and achievable

Format your response as detailed JSON following the weekly structure format.`;
  }

  private createWeeklyStructureUserPrompt(planData: DetailedPlan, userProfile: UserOnboardingData): string {
    return `Create a detailed weekly structure for the "${planData.title}" plan for this user.

PLAN DETAILS:
- Title: ${planData.title}
- Difficulty: ${planData.difficulty}
- Duration: ${planData.duration_weeks} weeks
- Focus Areas: ${planData.focus_areas.join(', ')}
- Target Audience: ${planData.target_audience}

USER PROFILE:
- Name: ${userProfile.full_name}
- Workout Time Preference: ${userProfile.workout_time}
- Sleep Schedule: ${userProfile.sleep_time} - ${userProfile.wake_up_time}
- Work Schedule: ${userProfile.lifestyle_factors.work_schedule}
- Available Time: ${userProfile.lifestyle_factors.commute_time} minutes commute
- Preferred Workout Days: ${userProfile.timeline_preferences.preferred_workout_days.join(', ')}
- Preferred Rest Days: ${userProfile.timeline_preferences.preferred_rest_days.join(', ')}

Create a complete weekly structure with:
1. Daily plan templates for each day (Monday-Sunday)
2. Specific activities with times and durations
3. Daily themes and focus areas
4. Nutrition timing and focus
5. Recovery and rest scheduling
6. Alternative activities for flexibility

Format as detailed JSON with complete weekly structure.`;
  }

  // Fallback method for when Groq is not available
  generateFallbackDetailedPlans(request: PlanGenerationRequest): DetailedPlan[] {
    const { user_profile } = request;
    
    return [
      {
        id: "beginner_wellness",
        title: "Beginner Wellness Journey",
        description: "A gentle introduction to healthy living with focus on building sustainable habits and establishing a foundation for long-term wellness.",
        difficulty: "Beginner",
        duration_weeks: 4,
        focus_areas: ["Basic Fitness", "Nutrition", "Sleep", "Stress Management"],
        estimated_calories_per_day: 200,
        equipment_needed: ["No equipment needed", "Yoga mat (optional)"],
        key_benefits: [
          "Build healthy daily habits",
          "Improve energy levels",
          "Better sleep quality",
          "Reduced stress",
          "Increased motivation"
        ],
        target_audience: "Complete beginners or those returning to fitness after a long break",
        prerequisites: [
          "Basic mobility",
          "No serious health conditions",
          "Commitment to 20-30 minutes daily"
        ],
        progression_milestones: [
          {
            week: 1,
            milestone: "Establish daily routine",
            expected_outcome: "Consistent daily activity for 5+ days"
          },
          {
            week: 2,
            milestone: "Increase activity duration",
            expected_outcome: "Complete 30-minute sessions"
          },
          {
            week: 3,
            milestone: "Add variety to activities",
            expected_outcome: "Try different types of exercises"
          },
          {
            week: 4,
            milestone: "Independent habit formation",
            expected_outcome: "Maintain routine without external motivation"
          }
        ],
        weekly_structure: {
          monday: {
            day_type: "workout",
            theme: "Energy Boost Monday",
            activities: [
              {
                id: "morning_walk",
                title: "Morning Walk",
                category: "exercise",
                time_slot: "07:00",
                duration_minutes: 20,
                intensity: "low",
                description: "Gentle 20-minute walk to start the day",
                instructions: ["Start with 5-minute warm-up", "Maintain comfortable pace", "Focus on breathing"],
                equipment: ["Comfortable walking shoes"],
                modifications: {
                  beginner: "Start with 10 minutes",
                  intermediate: "Add light arm movements",
                  advanced: "Include 2-minute jogging intervals"
                },
                benefits: ["Improves circulation", "Boosts energy", "Reduces stress"],
                prerequisites: ["Basic mobility"],
                alternatives: ["Indoor walking", "Treadmill", "Stationary bike"]
              }
            ],
            nutrition_focus: "High protein breakfast",
            recovery_emphasis: "Gentle stretching"
          },
          tuesday: {
            day_type: "rest",
            theme: "Active Recovery Tuesday",
            activities: [
              {
                id: "light_stretching",
                title: "Light Stretching",
                category: "recovery",
                time_slot: "19:00",
                duration_minutes: 15,
                intensity: "low",
                description: "Gentle stretching routine for recovery",
                instructions: ["Hold each stretch for 30 seconds", "Breathe deeply", "Don't force any position"],
                equipment: ["Yoga mat (optional)"],
                modifications: {
                  beginner: "Use chair for support",
                  intermediate: "Add longer holds",
                  advanced: "Include dynamic stretches"
                },
                benefits: ["Improves flexibility", "Reduces muscle tension", "Promotes relaxation"],
                prerequisites: ["Basic mobility"],
                alternatives: ["Yoga", "Tai Chi", "Pilates"]
              }
            ],
            nutrition_focus: "Hydration focus",
            recovery_emphasis: "Rest and recovery"
          },
          wednesday: {
            day_type: "workout",
            theme: "Midweek Motivation",
            activities: [
              {
                id: "bodyweight_exercises",
                title: "Bodyweight Exercises",
                category: "exercise",
                time_slot: "07:30",
                duration_minutes: 25,
                intensity: "medium",
                description: "Basic bodyweight exercises for strength building",
                instructions: ["Warm up for 5 minutes", "Perform 3 sets of each exercise", "Rest 30 seconds between sets"],
                equipment: ["No equipment needed"],
                modifications: {
                  beginner: "Reduce repetitions",
                  intermediate: "Add more sets",
                  advanced: "Increase tempo"
                },
                benefits: ["Builds strength", "Improves coordination", "Burns calories"],
                prerequisites: ["Basic mobility"],
                alternatives: ["Resistance bands", "Light weights", "Water exercises"]
              }
            ],
            nutrition_focus: "Balanced meals",
            recovery_emphasis: "Proper hydration"
          },
          thursday: {
            day_type: "rest",
            theme: "Mindful Thursday",
            activities: [
              {
                id: "meditation",
                title: "Meditation",
                category: "mindfulness",
                time_slot: "20:00",
                duration_minutes: 10,
                intensity: "low",
                description: "Guided meditation for stress relief",
                instructions: ["Find quiet space", "Sit comfortably", "Focus on breathing"],
                equipment: ["No equipment needed"],
                modifications: {
                  beginner: "Start with 5 minutes",
                  intermediate: "Add visualization",
                  advanced: "Extend to 20 minutes"
                },
                benefits: ["Reduces stress", "Improves focus", "Better sleep"],
                prerequisites: ["Basic concentration"],
                alternatives: ["Breathing exercises", "Progressive muscle relaxation", "Yoga nidra"]
              }
            ],
            nutrition_focus: "Light dinner",
            recovery_emphasis: "Mental relaxation"
          },
          friday: {
            day_type: "workout",
            theme: "Friday Energy",
            activities: [
              {
                id: "cardio_workout",
                title: "Cardio Workout",
                category: "exercise",
                time_slot: "18:00",
                duration_minutes: 30,
                intensity: "medium",
                description: "Moderate cardio to end the week strong",
                instructions: ["Warm up for 5 minutes", "Maintain steady pace", "Cool down for 5 minutes"],
                equipment: ["No equipment needed"],
                modifications: {
                  beginner: "Reduce intensity",
                  intermediate: "Add intervals",
                  advanced: "Increase duration"
                },
                benefits: ["Improves heart health", "Burns calories", "Boosts mood"],
                prerequisites: ["Basic fitness"],
                alternatives: ["Dancing", "Swimming", "Cycling"]
              }
            ],
            nutrition_focus: "Post-workout nutrition",
            recovery_emphasis: "Weekend preparation"
          },
          saturday: {
            day_type: "active_recovery",
            theme: "Weekend Wellness",
            activities: [
              {
                id: "outdoor_activity",
                title: "Outdoor Activity",
                category: "exercise",
                time_slot: "10:00",
                duration_minutes: 45,
                intensity: "low",
                description: "Enjoyable outdoor activity for active recovery",
                instructions: ["Choose enjoyable activity", "Maintain comfortable pace", "Focus on fun"],
                equipment: ["Activity-specific equipment"],
                modifications: {
                  beginner: "Shorter duration",
                  intermediate: "Add challenges",
                  advanced: "Increase intensity"
                },
                benefits: ["Fresh air", "Vitamin D", "Social connection"],
                prerequisites: ["Basic mobility"],
                alternatives: ["Gardening", "Walking", "Swimming"]
              }
            ],
            nutrition_focus: "Weekend treats in moderation",
            recovery_emphasis: "Fun and relaxation"
          },
          sunday: {
            day_type: "rest",
            theme: "Sunday Reset",
            activities: [
              {
                id: "week_planning",
                title: "Week Planning",
                category: "mindfulness",
                time_slot: "19:00",
                duration_minutes: 20,
                intensity: "low",
                description: "Plan and prepare for the upcoming week",
                instructions: ["Review previous week", "Set goals for next week", "Prepare for success"],
                equipment: ["Notebook", "Calendar"],
                modifications: {
                  beginner: "Simple goal setting",
                  intermediate: "Detailed planning",
                  advanced: "Comprehensive strategy"
                },
                benefits: ["Better organization", "Reduced stress", "Increased motivation"],
                prerequisites: ["Basic planning skills"],
                alternatives: ["Journaling", "Vision boarding", "Goal setting"]
              }
            ],
            nutrition_focus: "Meal prep for week",
            recovery_emphasis: "Complete rest and preparation"
          }
        },
        nutrition_guidelines: {
          daily_calories: 1800,
          macronutrient_breakdown: {
            protein_percentage: 25,
            carbs_percentage: 50,
            fat_percentage: 25
          },
          meal_timing: {
            breakfast: "07:00-08:00",
            lunch: "12:00-13:00",
            dinner: "18:00-19:00",
            snacks: ["10:00", "15:00"]
          },
          hydration_goals: {
            daily_water_intake: 2000,
            timing_recommendations: ["Upon waking", "Before meals", "During exercise", "Before bed"]
          }
        },
        recovery_protocols: {
          sleep_requirements: {
            hours: 8,
            bedtime: "22:00",
            wake_time: "06:00"
          },
          rest_day_activities: ["Light stretching", "Walking", "Meditation"],
          stress_management: ["Deep breathing", "Meditation", "Nature walks"],
          injury_prevention: ["Proper warm-up", "Cool-down", "Listen to body"]
        },
        adaptation_rules: {
          beginner_modifications: ["Reduce duration", "Lower intensity", "Add breaks"],
          advanced_progressions: ["Increase duration", "Higher intensity", "Add complexity"],
          injury_adaptations: ["Modify exercises", "Focus on mobility", "Consult professional"],
          time_constraints: ["Shorter sessions", "Combine activities", "Focus on essentials"]
        }
      }
    ];
  }
}

// Export singleton instance
export const enhancedGroqService = new EnhancedGroqService();
export default enhancedGroqService;
