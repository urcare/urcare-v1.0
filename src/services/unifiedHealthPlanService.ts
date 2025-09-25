/**
 * UNIFIED HEALTH PLAN SERVICE
 *
 * This service provides a systematic approach to health plan generation
 * using processed user data and structured AI prompts.
 */

import { UserProfile } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { AIPromptGenerator, HealthPlanPrompt } from "./aiPromptGenerator";
import {
  AIPromptContext,
  ProcessedUserData,
  userDataProcessor,
} from "./userDataProcessor";

// ============================================================================
// INTERFACES & TYPES
// ============================================================================

export interface HealthPlanGenerationRequest {
  userGoal?: string;
  userQuery?: string;
  promptType?: "basic" | "comprehensive" | "goalAware" | "queryBased";
  forceRegenerate?: boolean;
}

export interface HealthPlanGenerationResult {
  success: boolean;
  plan?: any;
  error?: string;
  metadata?: {
    processingTime: number;
    modelUsed: string;
    tokensUsed: number;
    complexityScore: number;
    riskLevel: string;
  };
}

export interface HealthPlanRecord {
  id: string;
  user_id: string;
  plan_start_date: string;
  plan_end_date: string;
  day_1_plan: any;
  day_2_plan: any;
  day_1_completed: boolean;
  day_2_completed: boolean;
  progress_data: any;
  generated_at: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

// ============================================================================
// MAIN UNIFIED HEALTH PLAN SERVICE
// ============================================================================

export class UnifiedHealthPlanService {
  /**
   * Generate health plan using systematic approach
   */
  static async generateHealthPlan(
    profile: UserProfile,
    request: HealthPlanGenerationRequest = {}
  ): Promise<HealthPlanGenerationResult> {
    const startTime = Date.now();
    console.log("🚀 Starting unified health plan generation...");

    try {
      // Step 1: Process user data systematically
      console.log("📊 Step 1: Processing user data...");
      const { processedData, aiContext } = await userDataProcessor.processForAI(
        profile,
        request.userGoal
      );

      // Step 2: Generate appropriate AI prompt
      console.log("🤖 Step 2: Generating AI prompt...");
      const promptType =
        request.promptType || this.determinePromptType(processedData, request);
      const healthPlanPrompt = this.generatePrompt(
        processedData,
        aiContext,
        promptType,
        request.userQuery
      );

      // Step 3: Call AI service
      console.log("🧠 Step 3: Calling AI service...");
      const aiResponse = await this.callAIService(healthPlanPrompt);

      // Step 4: Process and validate response
      console.log("✅ Step 4: Processing AI response...");
      const processedPlan = this.processAIResponse(aiResponse, processedData);

      // Step 5: Save to database
      console.log("💾 Step 5: Saving to database...");
      const savedPlan = await this.saveHealthPlan(processedPlan, profile.id);

      const processingTime = Date.now() - startTime;

      console.log("🎉 Health plan generated successfully!");

      return {
        success: true,
        plan: savedPlan,
        metadata: {
          processingTime,
          modelUsed: healthPlanPrompt.config.model,
          tokensUsed: aiResponse.usage?.total_tokens || 0,
          complexityScore: processedData.aiContext.complexityScore,
          riskLevel: processedData.aiContext.riskLevel,
        },
      };
    } catch (error) {
      console.error("❌ Health plan generation failed:", error);

      return {
        success: false,
        error:
          error instanceof Error ? error.message : "Unknown error occurred",
        metadata: {
          processingTime: Date.now() - startTime,
          modelUsed: "unknown",
          tokensUsed: 0,
          complexityScore: 0,
          riskLevel: "unknown",
        },
      };
    }
  }

  /**
   * Get current active health plan
   */
  static async getCurrentPlan(
    userId: string
  ): Promise<HealthPlanRecord | null> {
    try {
      const { data, error } = await supabase
        .from("two_day_health_plans")
        .select("*")
        .eq("user_id", userId)
        .eq("is_active", true)
        .single();

      if (error) {
        console.warn("No active plan found:", error.message);
        return null;
      }

      return data as HealthPlanRecord;
    } catch (error) {
      console.error("Error fetching current plan:", error);
      return null;
    }
  }

  /**
   * Generate next health plan (deactivates current)
   */
  static async generateNextPlan(
    profile: UserProfile,
    request: HealthPlanGenerationRequest = {}
  ): Promise<HealthPlanGenerationResult> {
    try {
      // Deactivate current plan
      const currentPlan = await this.getCurrentPlan(profile.id);
      if (currentPlan) {
        await supabase
          .from("two_day_health_plans")
          .update({ is_active: false })
          .eq("id", currentPlan.id);
      }

      // Generate new plan
      return await this.generateHealthPlan(profile, request);
    } catch (error) {
      console.error("Error generating next plan:", error);
      return {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Failed to generate next plan",
      };
    }
  }

  // ============================================================================
  // PRIVATE METHODS
  // ============================================================================

  /**
   * Determine the best prompt type based on user data and request
   */
  private static determinePromptType(
    processedData: ProcessedUserData,
    request: HealthPlanGenerationRequest
  ): "basic" | "comprehensive" | "goalAware" | "queryBased" {
    // If user has a specific query, use query-based
    if (request.userQuery) {
      return "queryBased";
    }

    // If user has specific goals, use goal-aware
    if (request.userGoal || processedData.goals.primary.length > 0) {
      return "goalAware";
    }

    // If high complexity, use comprehensive
    if (processedData.aiContext.complexityScore > 60) {
      return "comprehensive";
    }

    // Default to basic
    return "basic";
  }

  /**
   * Generate appropriate prompt based on type
   */
  private static generatePrompt(
    processedData: ProcessedUserData,
    aiContext: AIPromptContext,
    promptType: "basic" | "comprehensive" | "goalAware" | "queryBased",
    userQuery?: string
  ): HealthPlanPrompt {
    switch (promptType) {
      case "comprehensive":
        return AIPromptGenerator.generateComprehensivePrompt(
          processedData,
          aiContext
        );

      case "goalAware":
        return AIPromptGenerator.generateGoalAwarePrompt(
          processedData,
          aiContext
        );

      case "queryBased":
        if (!userQuery)
          throw new Error("User query required for query-based prompt");
        return AIPromptGenerator.generateQueryBasedPrompt(
          processedData,
          aiContext,
          userQuery
        );

      default:
        return AIPromptGenerator.generateHealthPlanPrompt(
          processedData,
          aiContext,
          "basic"
        );
    }
  }

  /**
   * Call AI service with structured prompt
   */
  private static async callAIService(prompt: HealthPlanPrompt): Promise<any> {
    const config = {
      model: prompt.config.model,
      messages: [
        { role: "system", content: prompt.systemPrompt },
        { role: "user", content: prompt.userPrompt },
      ],
      max_tokens: prompt.config.maxTokens,
      temperature: prompt.config.temperature,
    };

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify(config),
    });

    if (!response.ok) {
      throw new Error(
        `OpenAI API error: ${response.status} ${response.statusText}`
      );
    }

    return await response.json();
  }

  /**
   * Process and validate AI response
   */
  private static processAIResponse(
    aiResponse: any,
    processedData: ProcessedUserData
  ): any {
    const content = aiResponse.choices[0]?.message?.content;

    if (!content) {
      throw new Error("No content received from AI");
    }

    try {
      // Clean and parse JSON response
      let cleanContent = content.trim();

      // Remove markdown code blocks if present
      if (cleanContent.startsWith("```json")) {
        cleanContent = cleanContent
          .replace(/^```json\s*/, "")
          .replace(/\s*```$/, "");
      } else if (cleanContent.startsWith("```")) {
        cleanContent = cleanContent
          .replace(/^```\s*/, "")
          .replace(/\s*```$/, "");
      }

      // Try to find JSON object in the content
      const jsonMatch = cleanContent.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        cleanContent = jsonMatch[0];
      }

      const plan = JSON.parse(cleanContent);

      // Add metadata
      plan._metadata = {
        generatedAt: new Date().toISOString(),
        complexityScore: processedData.aiContext.complexityScore,
        riskLevel: processedData.aiContext.riskLevel,
        focusAreas: processedData.aiContext.focusAreas,
      };

      return plan;
    } catch (parseError) {
      console.error("Failed to parse AI response:", parseError);
      throw new Error(`Invalid response format from AI: ${parseError.message}`);
    }
  }

  /**
   * Save health plan to database
   */
  private static async saveHealthPlan(
    plan: any,
    userId: string
  ): Promise<HealthPlanRecord> {
    const today = new Date();
    const day1 = new Date(today);
    const day2 = new Date(today);
    day2.setDate(day2.getDate() + 1);

    const planData = {
      user_id: userId,
      plan_start_date: day1.toISOString().split("T")[0],
      plan_end_date: day2.toISOString().split("T")[0],
      day_1_plan: plan.day1,
      day_2_plan: plan.day2,
      day_1_completed: false,
      day_2_completed: false,
      progress_data: {
        overallGoals: plan.overallGoals || [],
        progressTips: plan.progressTips || [],
        goalAlignment: plan.goalAlignment || {},
        metadata: plan._metadata || {},
      },
      generated_at: new Date().toISOString(),
      is_active: true,
    };

    const { data, error } = await supabase
      .from("two_day_health_plans")
      .insert(planData)
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to save health plan: ${error.message}`);
    }

    return data as HealthPlanRecord;
  }
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

export const unifiedHealthPlanService = {
  /**
   * Generate health plan with systematic approach
   */
  async generatePlan(
    profile: UserProfile,
    request: HealthPlanGenerationRequest = {}
  ): Promise<HealthPlanGenerationResult> {
    return UnifiedHealthPlanService.generateHealthPlan(profile, request);
  },

  /**
   * Get current active plan
   */
  async getCurrentPlan(userId: string): Promise<HealthPlanRecord | null> {
    return UnifiedHealthPlanService.getCurrentPlan(userId);
  },

  /**
   * Generate next plan (deactivates current)
   */
  async generateNextPlan(
    profile: UserProfile,
    request: HealthPlanGenerationRequest = {}
  ): Promise<HealthPlanGenerationResult> {
    return UnifiedHealthPlanService.generateNextPlan(profile, request);
  },

  /**
   * Get user data summary for debugging
   */
  async getUserDataSummary(profile: UserProfile): Promise<string> {
    const { processedData } = await userDataProcessor.processForAI(profile);
    return userDataProcessor.getStructuredSummary(processedData);
  },
};

export default UnifiedHealthPlanService;
