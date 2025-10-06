// AI Function Integration Service
// Integrates with existing AI functions and automatically saves data
import { aiDataPersistenceService } from './aiDataPersistenceService';

interface UserProfile {
  id: string;
  age?: string;
  gender?: string;
  height_cm?: string;
  weight_kg?: string;
  blood_group?: string;
  chronic_conditions?: string[];
  medications?: string[];
  health_goals?: string[];
  diet_type?: string;
  workout_time?: string;
  sleep_time?: string;
  wake_up_time?: string;
  [key: string]: any;
}

class AIFunctionIntegrationService {
  // Call health-score API and save data
  async generateAndSaveHealthScore(
    userProfile: UserProfile,
    userInput?: string,
    uploadedFiles?: any[],
    voiceTranscript?: string
  ): Promise<any> {
    try {
      console.log('🔍 Generating health score for user:', userProfile.id);

      // Call your existing health-score API
      const response = await fetch('/api/health-score', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userProfile,
          userInput,
          uploadedFiles,
          voiceTranscript
        })
      });

      if (!response.ok) {
        throw new Error(`Health score API failed: ${response.status}`);
      }

      const data = await response.json();

      if (data.success) {
        // Save the health score data
        const savedHealthScore = await aiDataPersistenceService.saveHealthScore(
          userProfile.id,
          {
            healthScore: data.healthScore,
            analysis: data.analysis,
            recommendations: data.recommendations,
            meta: data.meta
          },
          userInput,
          uploadedFiles,
          voiceTranscript
        );

        // Save AI session
        await aiDataPersistenceService.saveAISession(
          userProfile.id,
          'health_score',
          'Health assessment and scoring',
          userInput || 'Health profile assessment',
          JSON.stringify(data),
          data,
          data.meta?.provider || 'Unknown',
          undefined,
          savedHealthScore.id
        );

        return {
          success: true,
          healthScore: data.healthScore,
          analysis: data.analysis,
          recommendations: data.recommendations,
          savedData: savedHealthScore
        };
      } else {
        throw new Error(data.error || 'Health score generation failed');
      }
    } catch (error) {
      console.error('Error in generateAndSaveHealthScore:', error);
      throw error;
    }
  }

  // Call health-plans API and save data
  async generateAndSaveHealthPlans(
    userProfile: UserProfile,
    healthScore: number,
    analysis: string,
    recommendations: string[],
    userInput?: string,
    uploadedFiles?: any[],
    voiceTranscript?: string
  ): Promise<any> {
    try {
      console.log('🔍 Generating health plans for user:', userProfile.id);

      // Call your existing health-plans API
      const response = await fetch('/api/health-plans', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userProfile,
          healthScore,
          analysis,
          recommendations,
          userInput,
          uploadedFiles,
          voiceTranscript
        })
      });

      if (!response.ok) {
        throw new Error(`Health plans API failed: ${response.status}`);
      }

      const data = await response.json();

      if (data.success && data.plans) {
        // Save the health plans data
        const savedPlans = await aiDataPersistenceService.saveHealthPlans(
          userProfile.id,
          data.plans,
          data.meta?.provider || 'Unknown'
        );

        // Save AI session
        await aiDataPersistenceService.saveAISession(
          userProfile.id,
          'health_plans',
          'Health plan generation',
          userInput || 'Health plan generation request',
          JSON.stringify(data),
          data,
          data.meta?.provider || 'Unknown'
        );

        return {
          success: true,
          plans: data.plans,
          savedPlans: savedPlans
        };
      } else {
        throw new Error(data.error || 'Health plans generation failed');
      }
    } catch (error) {
      console.error('Error in generateAndSaveHealthPlans:', error);
      throw error;
    }
  }

  // Call plan-activities API and save data
  async generateAndSavePlanActivities(
    userProfile: UserProfile,
    selectedPlan: any
  ): Promise<any> {
    try {
      console.log('🔍 Generating plan activities for plan:', selectedPlan.title);

      // Call your existing plan-activities API
      const response = await fetch('/api/plan-activities', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          selectedPlan,
          userProfile
        })
      });

      if (!response.ok) {
        throw new Error(`Plan activities API failed: ${response.status}`);
      }

      const data = await response.json();

      if (data.success && data.activities) {
        // Find the saved plan ID
        const savedPlans = await aiDataPersistenceService.getUserHealthPlans(userProfile.id);
        const savedPlan = savedPlans.find(p => p.plan_id === selectedPlan.id);
        
        if (savedPlan) {
          // Save the plan activities data
          const savedActivities = await aiDataPersistenceService.savePlanActivities(
            userProfile.id,
            savedPlan.id,
            data.activities,
            'Unknown' // You might want to pass the AI provider from the response
          );

          // Save AI session
          await aiDataPersistenceService.saveAISession(
            userProfile.id,
            'plan_activities',
            'Plan activities generation',
            `Activities for plan: ${selectedPlan.title}`,
            JSON.stringify(data),
            data,
            'Unknown',
            savedPlan.id
          );

          return {
            success: true,
            activities: data.activities,
            savedActivities: savedActivities
          };
        } else {
          throw new Error('Selected plan not found in saved plans');
        }
      } else {
        throw new Error(data.error || 'Plan activities generation failed');
      }
    } catch (error) {
      console.error('Error in generateAndSavePlanActivities:', error);
      throw error;
    }
  }

  // Complete workflow: health score -> plans -> activities
  async generateCompleteHealthPlan(
    userProfile: UserProfile,
    userInput?: string,
    uploadedFiles?: any[],
    voiceTranscript?: string
  ): Promise<any> {
    try {
      console.log('🚀 Starting complete health plan generation for user:', userProfile.id);

      // Step 1: Generate and save health score
      const healthScoreResult = await this.generateAndSaveHealthScore(
        userProfile,
        userInput,
        uploadedFiles,
        voiceTranscript
      );

      // Step 2: Generate and save health plans
      const healthPlansResult = await this.generateAndSaveHealthPlans(
        userProfile,
        healthScoreResult.healthScore,
        healthScoreResult.analysis,
        healthScoreResult.recommendations,
        userInput,
        uploadedFiles,
        voiceTranscript
      );

      // Step 3: Generate activities for the first plan (or let user select)
      const firstPlan = healthPlansResult.plans[0];
      const planActivitiesResult = await this.generateAndSavePlanActivities(
        userProfile,
        firstPlan
      );

      return {
        success: true,
        healthScore: healthScoreResult,
        healthPlans: healthPlansResult,
        planActivities: planActivitiesResult,
        message: 'Complete health plan generated and saved successfully'
      };
    } catch (error) {
      console.error('Error in generateCompleteHealthPlan:', error);
      throw error;
    }
  }

  // Check if user has existing data and return it
  async getExistingUserData(userId: string): Promise<{
    hasData: boolean;
    healthScore: any | null;
    activePlan: any | null;
    allPlans: any[];
    todayActivities: any[];
  }> {
    try {
      const hasData = await aiDataPersistenceService.hasExistingData(userId);
      
      if (!hasData) {
        return {
          hasData: false,
          healthScore: null,
          activePlan: null,
          allPlans: [],
          todayActivities: []
        };
      }

      const dataSummary = await aiDataPersistenceService.getUserDataSummary(userId);
      
      return {
        hasData: true,
        healthScore: dataSummary.healthScore,
        activePlan: dataSummary.activePlan,
        allPlans: dataSummary.allPlans,
        todayActivities: dataSummary.todayActivities
      };
    } catch (error) {
      console.error('Error in getExistingUserData:', error);
      return {
        hasData: false,
        healthScore: null,
        activePlan: null,
        allPlans: [],
        todayActivities: []
      };
    }
  }

  // Set active plan and get its activities
  async setActivePlanAndGetActivities(
    userId: string,
    planId: string
  ): Promise<any> {
    try {
      // Set the plan as active
      await aiDataPersistenceService.setActivePlan(userId, planId);

      // Get the plan activities
      const activities = await aiDataPersistenceService.getPlanActivities(userId, planId);

      return {
        success: true,
        activities: activities
      };
    } catch (error) {
      console.error('Error in setActivePlanAndGetActivities:', error);
      throw error;
    }
  }

  // Update activity completion
  async updateActivityCompletion(
    activityId: string,
    completionData: {
      is_completed?: boolean;
      completion_percentage?: number;
      actual_duration?: number;
      actual_calories?: number;
      difficulty_rating?: number;
      satisfaction_rating?: number;
      energy_level_before?: number;
      energy_level_after?: number;
      user_notes?: string;
    }
  ): Promise<void> {
    try {
      await aiDataPersistenceService.updateActivityCompletion(activityId, {
        ...completionData,
        completed_at: completionData.is_completed ? new Date().toISOString() : undefined
      });
    } catch (error) {
      console.error('Error in updateActivityCompletion:', error);
      throw error;
    }
  }

  // Get today's schedule for user
  async getTodaySchedule(userId: string): Promise<any[]> {
    try {
      return await aiDataPersistenceService.getTodayActivities(userId);
    } catch (error) {
      console.error('Error in getTodaySchedule:', error);
      return [];
    }
  }
}

export const aiFunctionIntegrationService = new AIFunctionIntegrationService();
