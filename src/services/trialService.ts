import { supabase } from "@/integrations/supabase/client";

export interface TrialInfo {
  id: string;
  user_id: string;
  trial_start: string;
  trial_end: string;
  is_active: boolean;
  days_remaining: number;
  claimed_at: string;
  expires_at: string;
}

export interface TrialStatus {
  hasTrial: boolean;
  isActive: boolean;
  daysRemaining: number;
  trialInfo: TrialInfo | null;
  canClaimTrial: boolean;
}

class TrialService {
  private readonly TRIAL_DURATION_DAYS = 3;

  /**
   * Check if user has an active trial
   */
  async hasActiveTrial(userId: string): Promise<boolean> {
    try {
      const { data, error } = await supabase
        .from("user_trials")
        .select("id, trial_end")
        .eq("user_id", userId)
        .eq("is_active", true)
        .maybeSingle();

      // Handle "no record found" case
      if (error && error.code === 'PGRST116') {
        return false;
      }

      if (error || !data) {
        return false;
      }

      const now = new Date();
      const trialEnd = new Date(data.trial_end);

      // If trial has expired, mark it as inactive
      if (trialEnd < now) {
        await this.deactivateTrial(data.id);
        return false;
      }

      return true;
    } catch (error) {
      console.error("Error checking active trial:", error);
      return false;
    }
  }

  /**
   * Get trial status for user
   */
  async getTrialStatus(userId: string): Promise<TrialStatus> {
    try {
      console.log("TrialService: Getting trial status for user:", userId);
      
      // Use .maybeSingle() instead of .single() to handle "no record found" gracefully
      const { data, error } = await supabase
        .from("user_trials")
        .select("*")
        .eq("user_id", userId)
        .order("claimed_at", { ascending: false })
        .limit(1)
        .maybeSingle();
      
      console.log("TrialService: Trial query result:", { data, error });

      // Handle "no record found" case (PGRST116 error code)
      if (error && error.code === 'PGRST116') {
        console.log("TrialService: No trial found for user, returning default status");
        return {
          hasTrial: false,
          isActive: false,
          daysRemaining: 0,
          trialInfo: null,
          canClaimTrial: true,
        };
      }

      // Handle other errors
      if (error || !data) {
        console.warn("TrialService: Error or no data:", error);
        return {
          hasTrial: false,
          isActive: false,
          daysRemaining: 0,
          trialInfo: null,
          canClaimTrial: true,
        };
      }

      const now = new Date();
      const trialEnd = new Date(data.trial_end);
      const daysRemaining = Math.ceil(
        (trialEnd.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
      );
      const isActive = data.is_active && trialEnd > now;

      console.log("TrialService: Trial found:", {
        isActive,
        daysRemaining,
        trialEnd: data.trial_end
      });

      return {
        hasTrial: true,
        isActive,
        daysRemaining: Math.max(0, daysRemaining),
        trialInfo: data,
        canClaimTrial: false, // User already has a trial
      };
    } catch (error) {
      console.error("TrialService: Unexpected error getting trial status:", error);
      return {
        hasTrial: false,
        isActive: false,
        daysRemaining: 0,
        trialInfo: null,
        canClaimTrial: true,
      };
    }
  }

  /**
   * Claim a trial for the user
   */
  async claimTrial(userId: string): Promise<TrialInfo | null> {
    try {
      // Check if user already has a trial
      const existingTrial = await this.getTrialStatus(userId);
      if (existingTrial.hasTrial) {
        throw new Error("User already has a trial");
      }

      const now = new Date();
      const trialEnd = new Date(
        now.getTime() + this.TRIAL_DURATION_DAYS * 24 * 60 * 60 * 1000
      );

      const trialData = {
        user_id: userId,
        trial_start: now.toISOString(),
        trial_end: trialEnd.toISOString(),
        is_active: true,
        claimed_at: now.toISOString(),
        expires_at: trialEnd.toISOString(),
      };

      const { data, error } = await supabase
        .from("user_trials")
        .insert(trialData)
        .select()
        .single();

      if (error) {
        console.error("Error claiming trial:", error);
        return null;
      }

      // Also create a trial subscription
      await this.createTrialSubscription(userId, data.id);

      return data;
    } catch (error) {
      console.error("Error in claimTrial:", error);
      return null;
    }
  }

  /**
   * Create a trial subscription
   */
  private async createTrialSubscription(
    userId: string,
    trialId: string
  ): Promise<void> {
    try {
      // Get the basic plan
      const { data: plan, error: planError } = await supabase
        .from("subscription_plans")
        .select("id")
        .eq("slug", "basic")
        .single();

      if (planError || !plan) {
        console.error("Error getting basic plan:", planError);
        return;
      }

      const now = new Date();
      const trialEnd = new Date(
        now.getTime() + this.TRIAL_DURATION_DAYS * 24 * 60 * 60 * 1000
      );

      const subscriptionData = {
        user_id: userId,
        plan_id: plan.id,
        status: "trialing",
        billing_cycle: "monthly",
        current_period_start: now.toISOString(),
        current_period_end: trialEnd.toISOString(),
        trial_start: now.toISOString(),
        trial_end: trialEnd.toISOString(),
        metadata: {
          trial_id: trialId,
          is_trial_subscription: true,
        },
      };

      const { error } = await supabase
        .from("subscriptions")
        .insert(subscriptionData);

      if (error) {
        console.error("Error creating trial subscription:", error);
      }
    } catch (error) {
      console.error("Error in createTrialSubscription:", error);
    }
  }

  /**
   * Deactivate a trial
   */
  async deactivateTrial(trialId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from("user_trials")
        .update({ is_active: false })
        .eq("id", trialId);

      if (error) {
        console.error("Error deactivating trial:", error);
        return false;
      }

      return true;
    } catch (error) {
      console.error("Error in deactivateTrial:", error);
      return false;
    }
  }

  /**
   * Check and deactivate expired trials
   */
  async checkExpiredTrials(): Promise<void> {
    try {
      const now = new Date().toISOString();

      // Find expired trials
      const { data: expiredTrials, error } = await supabase
        .from("user_trials")
        .select("id, user_id")
        .eq("is_active", true)
        .lt("trial_end", now);

      if (error) {
        console.error("Error finding expired trials:", error);
        return;
      }

      if (!expiredTrials || expiredTrials.length === 0) {
        return;
      }

      // Deactivate expired trials
      const trialIds = expiredTrials.map((t) => t.id);
      const { error: updateError } = await supabase
        .from("user_trials")
        .update({ is_active: false })
        .in("id", trialIds);

      if (updateError) {
        console.error("Error deactivating expired trials:", updateError);
        return;
      }

      // Also update trial subscriptions to canceled
      const userIds = expiredTrials.map((t) => t.user_id);
      const { error: subscriptionError } = await supabase
        .from("subscriptions")
        .update({ status: "canceled" })
        .in("user_id", userIds)
        .eq("status", "trialing");

      if (subscriptionError) {
        console.error(
          "Error canceling trial subscriptions:",
          subscriptionError
        );
      }

      console.log(`Deactivated ${expiredTrials.length} expired trials`);
    } catch (error) {
      console.error("Error in checkExpiredTrials:", error);
    }
  }

  /**
   * Get trial days remaining
   */
  async getTrialDaysRemaining(userId: string): Promise<number> {
    try {
      const trialStatus = await this.getTrialStatus(userId);
      return trialStatus.daysRemaining;
    } catch (error) {
      console.error("Error getting trial days remaining:", error);
      return 0;
    }
  }

  /**
   * Start a trial for the user (alias for claimTrial)
   */
  async startTrial(userId: string): Promise<TrialInfo | null> {
    return this.claimTrial(userId);
  }
}

export const trialService = new TrialService();
