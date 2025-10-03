/**
 * Payment Service
 *
 * This service handles payment operations including:
 * - Payment initiation with PhonePe
 * - Payment status tracking
 * - Subscription creation after successful payment
 * - Payment history management
 */

import { supabase } from "@/integrations/supabase/client";
import { Payment, SubscriptionPlan } from "@/types/subscription";
import { PaymentInitiationParams, phonepeService } from "./phonepeService";

export interface PaymentResult {
  success: boolean;
  paymentId?: string;
  transactionId?: string;
  redirectUrl?: string;
  error?: string;
}

export interface PaymentStatus {
  status:
    | "pending"
    | "processing"
    | "completed"
    | "failed"
    | "cancelled"
    | "refunded";
  transactionId?: string;
  amount?: number;
  currency?: string;
  processedAt?: string;
  failureReason?: string;
}

class PaymentService {
  /**
   * Initiate payment for subscription
   */
  async initiatePayment(params: {
    userId: string;
    planId: string;
    billingCycle: "monthly" | "annual";
    paymentMethod:
      | "PAY_PAGE"
      | "UPI_INTENT"
      | "UPI_COLLECT"
      | "UPI_QR"
      | "CARD"
      | "NET_BANKING";
    userEmail?: string;
    userPhone?: string;
    upiVpa?: string;
    targetApp?: string;
    bankCode?: string;
    cardDetails?: {
      cardNumber: string;
      cardType: string;
      cardIssuer: string;
      expiryMonth: number;
      expiryYear: number;
      cvv: string;
    };
  }): Promise<PaymentResult> {
    try {
      // Get plan details
      const { data: plan, error: planError } = await supabase
        .from("subscription_plans")
        .select("*")
        .eq("id", params.planId)
        .single();

      if (planError || !plan) {
        return { success: false, error: "Plan not found" };
      }

      // Check if user is eligible for first-time pricing
      const isFirstTime = await this.isFirstTimeUser(params.userId);

      // Calculate amount
      const amount = this.calculateAmount(
        plan,
        params.billingCycle,
        isFirstTime
      );

      // Create payment record
      const { data: payment, error: paymentError } = await supabase
        .from("payments")
        .insert({
          user_id: params.userId,
          plan_id: params.planId,
          amount: amount,
          currency: "INR",
          status: "pending",
          payment_method: params.paymentMethod,
          billing_cycle: params.billingCycle,
          is_first_time: isFirstTime,
        })
        .select()
        .single();

      if (paymentError || !payment) {
        return { success: false, error: "Failed to create payment record" };
      }

      // Initiate PhonePe payment
      const phonepeParams: PaymentInitiationParams = {
        userId: params.userId,
        amount: amount,
        planId: params.planId,
        billingCycle: params.billingCycle,
        userEmail: params.userEmail,
        userPhone: params.userPhone,
        paymentMethod: params.paymentMethod,
        upiVpa: params.upiVpa,
        targetApp: params.targetApp,
        bankCode: params.bankCode,
        cardDetails: params.cardDetails,
      };

      const phonepeResponse = await phonepeService.initiatePayment(
        phonepeParams
      );

      if (!phonepeResponse.success) {
        // Update payment status to failed
        await supabase
          .from("payments")
          .update({
            status: "failed",
            failure_reason: phonepeResponse.message,
            phonepe_response: phonepeResponse,
          })
          .eq("id", payment.id);

        return { success: false, error: phonepeResponse.message };
      }

      // Update payment with PhonePe transaction details
      await supabase
        .from("payments")
        .update({
          status: "processing",
          phonepe_transaction_id: phonepeResponse.data.transactionId,
          phonepe_merchant_transaction_id:
            phonepeResponse.data.merchantTransactionId,
          phonepe_response: phonepeResponse,
        })
        .eq("id", payment.id);

      return {
        success: true,
        paymentId: payment.id,
        transactionId: phonepeResponse.data.transactionId,
        redirectUrl: phonepeResponse.data.redirectInfo?.url,
      };
    } catch (error) {
      console.error("Payment initiation error:", error);
      return { success: false, error: "Payment initiation failed" };
    }
  }

  /**
   * Check payment status
   */
  async checkPaymentStatus(paymentId: string): Promise<PaymentStatus> {
    try {
      const { data: payment, error } = await supabase
        .from("payments")
        .select("*")
        .eq("id", paymentId)
        .single();

      if (error || !payment) {
        throw new Error("Payment not found");
      }

      // If payment is already completed or failed, return current status
      if (payment.status === "completed" || payment.status === "failed") {
        return {
          status: payment.status,
          transactionId: payment.phonepe_transaction_id,
          amount: payment.amount,
          currency: payment.currency,
          processedAt: payment.processed_at,
          failureReason: payment.failure_reason,
        };
      }

      // Check status with PhonePe if transaction ID exists
      if (payment.phonepe_merchant_transaction_id) {
        const statusResponse = await phonepeService.checkPaymentStatus(
          payment.phonepe_merchant_transaction_id
        );

        if (statusResponse.success) {
          const newStatus = this.mapPhonePeStatusToPaymentStatus(
            statusResponse.data.state
          );

          // Update payment status
          await supabase
            .from("payments")
            .update({
              status: newStatus,
              phonepe_response: statusResponse,
              processed_at:
                newStatus === "completed" ? new Date().toISOString() : null,
              failure_reason:
                newStatus === "failed" ? statusResponse.message : null,
            })
            .eq("id", paymentId);

          // If payment is successful, create subscription
          if (newStatus === "completed") {
            await this.createSubscriptionAfterPayment(payment);
          }

          return {
            status: newStatus,
            transactionId: payment.phonepe_transaction_id,
            amount: payment.amount,
            currency: payment.currency,
            processedAt:
              newStatus === "completed" ? new Date().toISOString() : null,
            failureReason:
              newStatus === "failed" ? statusResponse.message : undefined,
          };
        }
      }

      return {
        status: payment.status,
        transactionId: payment.phonepe_transaction_id,
        amount: payment.amount,
        currency: payment.currency,
      };
    } catch (error) {
      console.error("Payment status check error:", error);
      return {
        status: "failed",
        failureReason: "Status check failed",
      };
    }
  }

  /**
   * Create subscription after successful payment
   */
  private async createSubscriptionAfterPayment(payment: any): Promise<void> {
    try {
      // Check if user already has an active subscription
      const { data: existingSubscription } = await supabase
        .from("subscriptions")
        .select("id")
        .eq("user_id", payment.user_id)
        .in("status", ["active", "trialing"])
        .gt("current_period_end", new Date().toISOString())
        .single();

      if (existingSubscription) {
        // Cancel existing subscription
        await supabase
          .from("subscriptions")
          .update({
            status: "canceled",
            canceled_at: new Date().toISOString(),
          })
          .eq("id", existingSubscription.id);
      }

      // Create new subscription
      const { data: subscription, error } = await supabase.rpc(
        "create_subscription",
        {
          p_user_id: payment.user_id,
          p_plan_id: payment.plan_id,
          p_billing_cycle: payment.billing_cycle,
          p_trial_days: 0,
        }
      );

      if (error) {
        console.error("Failed to create subscription:", error);
        return;
      }

      // Update payment with subscription ID
      await supabase
        .from("payments")
        .update({
          subscription_id: subscription,
        })
        .eq("id", payment.id);
    } catch (error) {
      console.error("Error creating subscription after payment:", error);
    }
  }

  /**
   * Get payment history for user
   */
  async getPaymentHistory(userId: string): Promise<Payment[]> {
    try {
      const { data: payments, error } = await supabase
        .from("payments")
        .select(
          `
          *,
          subscription_plans (
            name,
            slug
          )
        `
        )
        .eq("user_id", userId)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching payment history:", error);
        return [];
      }

      return payments || [];
    } catch (error) {
      console.error("Error fetching payment history:", error);
      return [];
    }
  }

  /**
   * Process refund
   */
  async processRefund(paymentId: string, reason?: string): Promise<boolean> {
    try {
      const { data: payment, error } = await supabase
        .from("payments")
        .select("*")
        .eq("id", paymentId)
        .single();

      if (error || !payment) {
        return false;
      }

      if (!payment.phonepe_transaction_id) {
        return false;
      }

      // Process refund with PhonePe
      const refundResponse = await phonepeService.processRefund({
        originalTransactionId: payment.phonepe_transaction_id,
        amount: payment.amount,
        userId: payment.user_id,
        reason,
      });

      if (refundResponse.success) {
        // Update payment status
        await supabase
          .from("payments")
          .update({
            status: "refunded",
            phonepe_response: refundResponse,
          })
          .eq("id", paymentId);

        // Cancel subscription if it exists
        if (payment.subscription_id) {
          await supabase
            .from("subscriptions")
            .update({
              status: "canceled",
              canceled_at: new Date().toISOString(),
            })
            .eq("id", payment.subscription_id);
        }

        return true;
      }

      return false;
    } catch (error) {
      console.error("Refund processing error:", error);
      return false;
    }
  }

  /**
   * Check if user is first-time user
   */
  private async isFirstTimeUser(userId: string): Promise<boolean> {
    try {
      const { data: existingPayments } = await supabase
        .from("payments")
        .select("id")
        .eq("user_id", userId)
        .eq("status", "completed")
        .limit(1);

      return !existingPayments || existingPayments.length === 0;
    } catch (error) {
      console.error("Error checking first-time user:", error);
      return false;
    }
  }

  /**
   * Calculate amount based on plan and billing cycle
   */
  private calculateAmount(
    plan: SubscriptionPlan,
    billingCycle: "monthly" | "annual",
    isFirstTime: boolean
  ): number {
    if (isFirstTime) {
      return billingCycle === "monthly"
        ? plan.price_first_time_monthly ?? plan.price_monthly
        : plan.price_first_time_annual ?? plan.price_annual;
    }

    return billingCycle === "monthly" ? plan.price_monthly : plan.price_annual;
  }

  /**
   * Map PhonePe status to payment status
   */
  private mapPhonePeStatusToPaymentStatus(
    phonepeStatus: string
  ):
    | "pending"
    | "processing"
    | "completed"
    | "failed"
    | "cancelled"
    | "refunded" {
    switch (phonepeStatus) {
      case "SUCCESS":
        return "completed";
      case "PENDING":
        return "processing";
      case "FAILED":
        return "failed";
      case "CANCELLED":
        return "cancelled";
      default:
        return "pending";
    }
  }

  /**
   * Get available payment methods
   */
  getAvailablePaymentMethods() {
    return [
      {
        id: "PAY_PAGE",
        name: "All Payment Methods",
        description: "Cards, UPI, Net Banking, Wallets",
      },
      {
        id: "UPI_INTENT",
        name: "UPI Intent",
        description: "Pay with UPI apps",
      },
      {
        id: "UPI_COLLECT",
        name: "UPI Collect",
        description: "Pay with UPI ID",
      },
      { id: "UPI_QR", name: "UPI QR", description: "Scan QR code to pay" },
      { id: "CARD", name: "Card Payment", description: "Credit/Debit cards" },
      {
        id: "NET_BANKING",
        name: "Net Banking",
        description: "Direct bank transfer",
      },
    ];
  }

  /**
   * Get test payment details for development
   */
  getTestPaymentDetails() {
    return {
      card: phonepeService.getTestCardDetails(),
      upi: phonepeService.getTestUPIDetails(),
      netbanking: phonepeService.getTestNetBankingDetails(),
    };
  }
}

export const paymentService = new PaymentService();
export default paymentService;
