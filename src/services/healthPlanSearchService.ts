import { supabase } from "@/integrations/supabase/client";

export interface HealthPlanSearchRequest {
  query: string;
  userProfile?: any;
  maxTokens?: number;
  includeFileContext?: boolean;
  fileContent?: string;
}

export interface HealthPlanSearchResponse {
  success: boolean;
  plan?: any;
  error?: string;
  tokensUsed?: number;
  estimatedCost?: number;
}

export interface TokenUsage {
  promptTokens: number;
  completionTokens: number;
  totalTokens: number;
  estimatedCost: number;
}

class HealthPlanSearchService {
  private readonly MAX_TOKENS_PER_REQUEST = 4000; // Limit tokens per request
  private readonly MAX_DAILY_TOKENS = 20000; // Daily limit per user
  private readonly COST_PER_1K_TOKENS = 0.03; // Approximate cost for GPT-4

  // Check if user has exceeded daily token limit
  async checkTokenLimit(
    userId: string
  ): Promise<{ allowed: boolean; remaining: number }> {
    try {
      const today = new Date().toISOString().split("T")[0];

      const { data, error } = await supabase
        .from("token_usage")
        .select("total_tokens")
        .eq("user_id", userId)
        .eq("date", today)
        .single();

      if (error && error.code !== "PGRST116") {
        // PGRST116 = no rows found
        throw error;
      }

      const usedTokens = data?.total_tokens || 0;
      const remaining = Math.max(0, this.MAX_DAILY_TOKENS - usedTokens);

      return {
        allowed: remaining > 0,
        remaining,
      };
    } catch (error) {
      console.error("Error checking token limit:", error);
      return { allowed: true, remaining: this.MAX_DAILY_TOKENS };
    }
  }

  // Record token usage
  async recordTokenUsage(userId: string, usage: TokenUsage): Promise<void> {
    try {
      const today = new Date().toISOString().split("T")[0];

      const { error } = await supabase.from("token_usage").upsert(
        {
          user_id: userId,
          date: today,
          total_tokens: usage.totalTokens,
          prompt_tokens: usage.promptTokens,
          completion_tokens: usage.completionTokens,
          estimated_cost: usage.estimatedCost,
          updated_at: new Date().toISOString(),
        },
        {
          onConflict: "user_id,date",
        }
      );

      if (error) {
        console.error("Error recording token usage:", error);
      }
    } catch (error) {
      console.error("Error recording token usage:", error);
    }
  }

  // Generate health plan based on search query
  async generateHealthPlanFromQuery(
    request: HealthPlanSearchRequest,
    userId: string
  ): Promise<HealthPlanSearchResponse> {
    try {
      if (!userId) {
        return { success: false, error: "User not authenticated" };
      }

      const tokenCheck = await this.checkTokenLimit(userId);
      if (!tokenCheck.allowed) {
        return {
          success: false,
          error: `Daily token limit exceeded. Please try again tomorrow.`,
        };
      }

      // Prepare the request with token limits
      const maxTokens = Math.min(
        request.maxTokens || this.MAX_TOKENS_PER_REQUEST,
        tokenCheck.remaining
      );

      // Call the Supabase function with the search query
      const { data, error } = await supabase.functions.invoke(
        "generate-health-plan-from-query",
        {
          method: "POST",
          body: {
            query: request.query,
            userProfile: request.userProfile,
            maxTokens: maxTokens,
            includeFileContext: request.includeFileContext,
            fileContent: request.fileContent,
          },
        }
      );

      if (error) {
        throw new Error(`Failed to generate health plan: ${error.message}`);
      }

      if (!data.success) {
        throw new Error(data.error || "Failed to generate health plan");
      }

      // Record token usage if available
      if (data.tokenUsage) {
        await this.recordTokenUsage(userId, data.tokenUsage);
      }

      return {
        success: true,
        plan: data.plan,
        tokensUsed: data.tokenUsage?.totalTokens,
        estimatedCost: data.tokenUsage?.estimatedCost,
      };
    } catch (error) {
      console.error("Error generating health plan from query:", error);
      return {
        success: false,
        error:
          error instanceof Error ? error.message : "Unknown error occurred",
      };
    }
  }

  // Get user's token usage for the current month
  async getUserTokenUsage(userId: string): Promise<{
    dailyUsage: Array<{ date: string; tokens: number; cost: number }>;
    monthlyTotal: number;
    monthlyCost: number;
  }> {
    try {
      const startOfMonth = new Date();
      startOfMonth.setDate(1);
      startOfMonth.setHours(0, 0, 0, 0);

      const { data, error } = await supabase
        .from("token_usage")
        .select("date, total_tokens, estimated_cost")
        .eq("user_id", userId)
        .gte("date", startOfMonth.toISOString().split("T")[0])
        .order("date", { ascending: true });

      if (error) {
        throw error;
      }

      const dailyUsage =
        data?.map((record) => ({
          date: record.date,
          tokens: record.total_tokens,
          cost: record.estimated_cost,
        })) || [];

      const monthlyTotal = dailyUsage.reduce((sum, day) => sum + day.tokens, 0);
      const monthlyCost = dailyUsage.reduce((sum, day) => sum + day.cost, 0);

      return {
        dailyUsage,
        monthlyTotal,
        monthlyCost,
      };
    } catch (error) {
      console.error("Error fetching token usage:", error);
      return {
        dailyUsage: [],
        monthlyTotal: 0,
        monthlyCost: 0,
      };
    }
  }

  // Estimate token usage for a query
  estimateTokenUsage(query: string, includeProfile: boolean = true): number {
    // Rough estimation: 1 token ≈ 4 characters for English text
    const queryTokens = Math.ceil(query.length / 4);
    const profileTokens = includeProfile ? 500 : 0; // Estimated profile tokens
    const systemPromptTokens = 200; // Estimated system prompt tokens
    const responseTokens = 1000; // Estimated response tokens

    return queryTokens + profileTokens + systemPromptTokens + responseTokens;
  }
}

export const healthPlanSearchService = new HealthPlanSearchService();
