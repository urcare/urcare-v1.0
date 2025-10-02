// Groq AI Service for UrCare Health Platform
// Handles all AI-powered health analysis and recommendations

import { GROQ_PROMPTS, getGroqPrompt, getGroqSystemPrompt } from '@/prompts/groq-prompts';

interface GroqResponse {
  success: boolean;
  data?: any;
  error?: string;
}

interface HealthScoreRequest {
  userProfile: any;
  userInput: string;
  uploadedFiles: string[];
  voiceTranscript: string;
}

interface HealthPlansRequest {
  userProfile: any;
  healthScore: number;
  analysis: string;
  recommendations: string[];
  userInput: string;
}

interface ActivityDetailsRequest {
  activityTitle: string;
  activityCategory: string;
  userProfile: any;
}

interface HealthRecommendationsRequest {
  userProfile: any;
  healthScore: number;
  analysis: string;
  selectedPlan: any;
}

class GroqService {
  private apiKey: string;
  private baseUrl: string = 'https://api.groq.com/openai/v1/chat/completions';
  private model: string = 'llama3-8b-8192'; // Fast and efficient model

  constructor() {
    // Get API key from environment
    this.apiKey = import.meta.env.VITE_GROQ_API_KEY || '';
    
    if (!this.apiKey) {
      console.warn('Groq API key not found. AI features will use fallback responses.');
    }
  }

  private async makeRequest(systemPrompt: string, userPrompt: string): Promise<GroqResponse> {
    if (!this.apiKey) {
      return {
        success: false,
        error: 'Groq API key not configured'
      };
    }

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
          max_tokens: 4000,
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
          // Try to parse as JSON
          const jsonData = JSON.parse(content);
          return {
            success: true,
            data: jsonData
          };
        } catch (parseError) {
          // If not JSON, return as text
          return {
            success: true,
            data: { content }
          };
        }
      } else {
        throw new Error('Invalid response format from Groq API');
      }
    } catch (error) {
      console.error('Groq API request failed:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  }

  // Calculate health score using Groq AI
  async calculateHealthScore(request: HealthScoreRequest): Promise<GroqResponse> {
    const systemPrompt = getGroqSystemPrompt('healthScore');
    const userPrompt = getGroqPrompt('healthScore', 
      request.userProfile, 
      request.userInput, 
      request.uploadedFiles, 
      request.voiceTranscript
    );

    const response = await this.makeRequest(systemPrompt, userPrompt);
    
    if (response.success && response.data) {
      // Ensure health score is within valid range
      if (response.data.healthScore !== undefined) {
        response.data.healthScore = Math.max(0, Math.min(100, response.data.healthScore));
      }
    }

    return response;
  }

  // Generate health plans using Groq AI
  async generateHealthPlans(request: HealthPlansRequest): Promise<GroqResponse> {
    const systemPrompt = getGroqSystemPrompt('healthPlans');
    const userPrompt = getGroqPrompt('healthPlans', 
      request.userProfile, 
      request.healthScore, 
      request.analysis, 
      request.recommendations, 
      request.userInput
    );

    return await this.makeRequest(systemPrompt, userPrompt);
  }

  // Get detailed activity information using Groq AI
  async getActivityDetails(request: ActivityDetailsRequest): Promise<GroqResponse> {
    const systemPrompt = getGroqSystemPrompt('activityDetails');
    const userPrompt = getGroqPrompt('activityDetails', 
      request.activityTitle, 
      request.activityCategory, 
      request.userProfile
    );

    return await this.makeRequest(systemPrompt, userPrompt);
  }

  // Get health recommendations using Groq AI
  async getHealthRecommendations(request: HealthRecommendationsRequest): Promise<GroqResponse> {
    const systemPrompt = getGroqSystemPrompt('healthRecommendations');
    const userPrompt = getGroqPrompt('healthRecommendations', 
      request.userProfile, 
      request.healthScore, 
      request.analysis, 
      request.selectedPlan
    );

    return await this.makeRequest(systemPrompt, userPrompt);
  }

  // Fallback health score calculation when Groq is not available
  calculateFallbackHealthScore(userProfile: any): any {
    let score = 50; // Base score
    const analysis = [];
    const recommendations = [];

    // Age factor
    const age = parseInt(userProfile.age) || 30;
    if (age < 30) score += 10;
    else if (age < 50) score += 5;
    else if (age < 70) score -= 5;
    else score -= 10;

    // Weight factor (BMI calculation)
    const height = parseFloat(userProfile.height_cm) || 170;
    const weight = parseFloat(userProfile.weight_kg) || 70;
    const bmi = weight / ((height / 100) ** 2);
    
    if (bmi >= 18.5 && bmi <= 24.9) {
      score += 15;
      analysis.push("Your BMI is in the healthy range.");
    } else if (bmi < 18.5) {
      score += 5;
      analysis.push("Your BMI suggests you may be underweight.");
      recommendations.push("Consider consulting a nutritionist for healthy weight gain strategies");
    } else if (bmi > 24.9 && bmi < 30) {
      score += 5;
      analysis.push("Your BMI is slightly above the healthy range.");
      recommendations.push("Focus on maintaining a balanced diet and regular exercise");
    } else {
      score -= 10;
      analysis.push("Your BMI indicates you may be overweight.");
      recommendations.push("Consider a structured weight management program with professional guidance");
    }

    // Health goals factor
    if (userProfile.health_goals && userProfile.health_goals.length > 0) {
      score += 10;
      analysis.push("Having specific health goals is excellent for motivation.");
    } else {
      recommendations.push("Set specific, measurable health goals to improve your wellness journey");
    }

    // Diet type factor
    const dietType = userProfile.diet_type?.toLowerCase() || '';
    if (dietType.includes('balanced') || dietType.includes('mediterranean')) {
      score += 10;
      analysis.push("Your diet type is well-balanced and health-promoting.");
    } else if (dietType.includes('vegetarian') || dietType.includes('vegan')) {
      score += 8;
      analysis.push("Your plant-based diet is generally healthy with proper planning.");
      recommendations.push("Ensure adequate protein and B12 intake with your plant-based diet");
    } else if (dietType === 'none' || !dietType) {
      score -= 5;
      recommendations.push("Consider establishing a consistent dietary pattern for better health");
    }

    // Sleep schedule factor
    if (userProfile.sleep_time && userProfile.wake_up_time) {
      score += 8;
      analysis.push("Having a consistent sleep schedule is great for your health.");
    } else {
      score -= 5;
      recommendations.push("Establish a consistent sleep schedule for better health and energy");
    }

    // Workout routine factor
    if (userProfile.workout_time) {
      score += 10;
      analysis.push("Regular exercise is one of the best things you can do for your health.");
    } else {
      score -= 8;
      recommendations.push("Start incorporating regular physical activity into your routine");
    }

    // Chronic conditions factor
    if (userProfile.chronic_conditions && userProfile.chronic_conditions.length > 0) {
      score -= userProfile.chronic_conditions.length * 5;
      analysis.push("Managing chronic conditions requires careful attention to your health.");
      recommendations.push("Work closely with healthcare providers to manage your chronic conditions");
    }

    // Medications factor
    if (userProfile.medications && userProfile.medications.length > 0) {
      score -= 3;
      analysis.push("Taking prescribed medications as directed is important for your health.");
      recommendations.push("Continue taking medications as prescribed and discuss any concerns with your doctor");
    }

    // Ensure score is within valid range
    score = Math.max(0, Math.min(100, Math.round(score)));

    return {
      healthScore: score,
      analysis: analysis.join(' '),
      recommendations: recommendations,
      strengths: [
        "You're taking steps to improve your health",
        "You have access to health resources and support"
      ],
      improvements: [
        "Focus on consistent daily habits",
        "Set specific, achievable health goals",
        "Monitor your progress regularly"
      ]
    };
  }

  // Fallback health plans when Groq is not available
  generateFallbackHealthPlans(userProfile: any): any {
    return {
      plans: [
        {
          id: "beginner",
          title: "Beginner Wellness Plan",
          description: "A gentle introduction to healthy living",
          difficulty: "Beginner",
          duration: "4 weeks",
          activities: [
            {
              time: "06:30",
              title: "Wake Up & Hydrate",
              description: "Drink 500ml water, gentle stretching",
              duration: "15 minutes",
              category: "Wake up"
            },
            {
              time: "07:00",
              title: "Morning Walk",
              description: "15-minute brisk walk around the neighborhood",
              duration: "15 minutes",
              category: "Exercise"
            },
            {
              time: "07:30",
              title: "Healthy Breakfast",
              description: "Oatmeal with fruits and nuts",
              duration: "20 minutes",
              category: "Meals"
            },
            {
              time: "08:00",
              title: "Work Session",
              description: "Focused work time with breaks",
              duration: "2 hours",
              category: "Work"
            },
            {
              time: "10:00",
              title: "Hydration Break",
              description: "Drink water and light stretching",
              duration: "10 minutes",
              category: "Hydration"
            }
          ]
        },
        {
          id: "intermediate",
          title: "Intermediate Fitness Plan",
          description: "Balanced approach to health and fitness",
          difficulty: "Intermediate",
          duration: "6 weeks",
          activities: [
            {
              time: "06:00",
              title: "Morning Routine",
              description: "Hydrate, meditation, light stretching",
              duration: "20 minutes",
              category: "Wake up"
            },
            {
              time: "06:30",
              title: "Workout Session",
              description: "30-minute cardio and strength training",
              duration: "30 minutes",
              category: "Exercise"
            },
            {
              time: "07:15",
              title: "Protein Breakfast",
              description: "Scrambled eggs with vegetables and whole grain toast",
              duration: "25 minutes",
              category: "Meals"
            },
            {
              time: "08:00",
              title: "Focused Work",
              description: "Deep work session with productivity techniques",
              duration: "2.5 hours",
              category: "Work"
            },
            {
              time: "10:30",
              title: "Active Break",
              description: "Quick workout or walk",
              duration: "15 minutes",
              category: "Exercise"
            }
          ]
        },
        {
          id: "advanced",
          title: "Advanced Health Optimization",
          description: "Comprehensive health and performance optimization",
          difficulty: "Advanced",
          duration: "8 weeks",
          activities: [
            {
              time: "05:30",
              title: "Early Morning Routine",
              description: "Cold shower, hydration, meditation, dynamic stretching",
              duration: "30 minutes",
              category: "Wake up"
            },
            {
              time: "06:00",
              title: "Intensive Workout",
              description: "45-minute HIIT or strength training session",
              duration: "45 minutes",
              category: "Exercise"
            },
            {
              time: "07:00",
              title: "Post-Workout Nutrition",
              description: "Protein smoothie with greens and supplements",
              duration: "15 minutes",
              category: "Meals"
            },
            {
              time: "07:30",
              title: "Peak Performance Work",
              description: "High-focus work session during peak mental hours",
              duration: "3 hours",
              category: "Work"
            },
            {
              time: "10:30",
              title: "Recovery Break",
              description: "Active recovery, mobility work, or light cardio",
              duration: "20 minutes",
              category: "Recovery"
            }
          ]
        }
      ]
    };
  }
}

// Export singleton instance
export const groqService = new GroqService();
export default groqService;
