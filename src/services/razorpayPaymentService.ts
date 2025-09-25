import { supabase } from "../integrations/supabase/client";
import { subscriptionService } from "./subscriptionService";

export interface RazorpayPaymentData {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
  planType: "monthly" | "yearly";
  userId: string;
}

export interface PaymentVerificationResult {
  success: boolean;
  subscriptionId?: string;
  error?: string;
}

class RazorpayPaymentService {
  /**
   * Verify Razorpay payment and create subscription
   */
  async verifyPaymentAndCreateSubscription(
    paymentData: RazorpayPaymentData
  ): Promise<PaymentVerificationResult> {
    try {
      console.log("Verifying Razorpay payment:", paymentData);

      // Call Supabase function to verify payment with Razorpay
      const { data, error } = await supabase.functions.invoke(
        "verify-razorpay-payment",
        {
          body: {
            razorpay_payment_id: paymentData.razorpay_payment_id,
            razorpay_order_id: paymentData.razorpay_order_id,
            razorpay_signature: paymentData.razorpay_signature,
            userId: paymentData.userId,
            planSlug: "basic", // Default plan for now
            billingCycle: paymentData.planType,
            isFirstTime: true,
          },
        }
      );

      if (error) {
        console.error("Payment verification failed:", error);
        return {
          success: false,
          error: `Payment verification failed: ${error.message}`,
        };
      }

      if (!data || !data.success) {
        console.error("Payment verification returned false:", data);
        return {
          success: false,
          error: "Payment verification failed",
        };
      }

      console.log(
        "Payment verified successfully, subscription created:",
        data.subscriptionId
      );

      return {
        success: true,
        subscriptionId: data.subscriptionId,
      };
    } catch (error) {
      console.error("Error in verifyPaymentAndCreateSubscription:", error);
      return {
        success: false,
        error: `Payment verification error: ${
          error instanceof Error ? error.message : "Unknown error"
        }`,
      };
    }
  }

  /**
   * Handle payment success from Razorpay widget
   */
  async handlePaymentSuccess(
    paymentData: RazorpayPaymentData
  ): Promise<PaymentVerificationResult> {
    try {
      // Verify payment and create subscription
      const result = await this.verifyPaymentAndCreateSubscription(paymentData);

      if (result.success) {
        console.log(
          "Payment success handled, subscription created:",
          result.subscriptionId
        );

        // Update user's subscription status in the app
        // This will be picked up by the auth flow service on next check
        await this.refreshUserSubscriptionStatus(paymentData.userId);
      }

      return result;
    } catch (error) {
      console.error("Error handling payment success:", error);
      return {
        success: false,
        error: `Payment success handling failed: ${
          error instanceof Error ? error.message : "Unknown error"
        }`,
      };
    }
  }

  /**
   * Refresh user's subscription status after payment
   */
  private async refreshUserSubscriptionStatus(userId: string): Promise<void> {
    try {
      // Force refresh of subscription status
      await subscriptionService.getSubscriptionStatus(userId);
      console.log("User subscription status refreshed for user:", userId);
    } catch (error) {
      console.error("Error refreshing subscription status:", error);
    }
  }

  /**
   * Get subscription plan details for Razorpay integration
   */
  async getPlanDetails(planType: "monthly" | "yearly"): Promise<{
    planSlug: string;
    price: number;
    currency: string;
  }> {
    try {
      // Get the basic plan (default for now)
      const plans = await subscriptionService.getSubscriptionPlans();
      const basicPlan = plans.find((plan) => plan.slug === "basic");

      if (!basicPlan) {
        throw new Error("Basic plan not found");
      }

      const price =
        planType === "monthly"
          ? basicPlan.price_monthly
          : basicPlan.price_annual;

      return {
        planSlug: basicPlan.slug,
        price: price,
        currency: "USD",
      };
    } catch (error) {
      console.error("Error getting plan details:", error);
      throw error;
    }
  }
}

export const razorpayPaymentService = new RazorpayPaymentService();

