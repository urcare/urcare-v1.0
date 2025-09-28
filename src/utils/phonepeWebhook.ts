/**
 * PhonePe Webhook Handler
 *
 * This utility handles PhonePe webhook callbacks for payment status updates
 */

import { supabase } from "@/integrations/supabase/client";
import { phonepeService } from "@/services/phonepeService";

export interface PhonePeWebhookPayload {
  merchantId: string;
  merchantTransactionId: string;
  transactionId: string;
  amount: number;
  state: "PENDING" | "SUCCESS" | "FAILED" | "CANCELLED";
  responseCode: string;
  paymentInstrument: {
    type: string;
    utr?: string;
    cardDetails?: any;
  };
}

export class PhonePeWebhookHandler {
  /**
   * Verify webhook signature
   */
  static verifySignature(payload: string, signature: string): boolean {
    return phonepeService.verifyWebhookSignature(payload, signature);
  }

  /**
   * Handle payment success webhook
   */
  static async handlePaymentSuccess(
    payload: PhonePeWebhookPayload
  ): Promise<void> {
    try {
      console.log("Processing payment success webhook:", payload);

      // Find payment record by merchant transaction ID
      const { data: payment, error: paymentError } = await supabase
        .from("payments")
        .select("*")
        .eq("phonepe_merchant_transaction_id", payload.merchantTransactionId)
        .single();

      if (paymentError || !payment) {
        console.error(
          "Payment not found for transaction:",
          payload.merchantTransactionId
        );
        return;
      }

      // Update payment status
      await supabase
        .from("payments")
        .update({
          status: "completed",
          phonepe_transaction_id: payload.transactionId,
          phonepe_response: payload,
          processed_at: new Date().toISOString(),
        })
        .eq("id", payment.id);

      // Create subscription if payment is successful
      if (payment.subscription_id) {
        // Update existing subscription
        await supabase
          .from("subscriptions")
          .update({
            status: "active",
            current_period_start: new Date().toISOString(),
            current_period_end: new Date(
              Date.now() +
                (payment.billing_cycle === "monthly" ? 30 : 365) *
                  24 *
                  60 *
                  60 *
                  1000
            ).toISOString(),
          })
          .eq("id", payment.subscription_id);
      } else {
        // Create new subscription
        const { data: subscription, error: subscriptionError } =
          await supabase.rpc("create_subscription", {
            p_user_id: payment.user_id,
            p_plan_id: payment.plan_id,
            p_billing_cycle: payment.billing_cycle,
            p_trial_days: 0,
          });

        if (subscriptionError) {
          console.error("Error creating subscription:", subscriptionError);
          return;
        }

        // Update payment with subscription ID
        await supabase
          .from("payments")
          .update({
            subscription_id: subscription,
          })
          .eq("id", payment.id);
      }

      console.log("Payment success webhook processed successfully");
    } catch (error) {
      console.error("Error processing payment success webhook:", error);
    }
  }

  /**
   * Handle payment failure webhook
   */
  static async handlePaymentFailure(
    payload: PhonePeWebhookPayload
  ): Promise<void> {
    try {
      console.log("Processing payment failure webhook:", payload);

      // Find payment record by merchant transaction ID
      const { data: payment, error: paymentError } = await supabase
        .from("payments")
        .select("*")
        .eq("phonepe_merchant_transaction_id", payload.merchantTransactionId)
        .single();

      if (paymentError || !payment) {
        console.error(
          "Payment not found for transaction:",
          payload.merchantTransactionId
        );
        return;
      }

      // Update payment status
      await supabase
        .from("payments")
        .update({
          status: "failed",
          phonepe_response: payload,
          failure_reason: payload.responseCode,
          processed_at: new Date().toISOString(),
        })
        .eq("id", payment.id);

      console.log("Payment failure webhook processed successfully");
    } catch (error) {
      console.error("Error processing payment failure webhook:", error);
    }
  }

  /**
   * Handle refund webhook
   */
  static async handleRefund(payload: PhonePeWebhookPayload): Promise<void> {
    try {
      console.log("Processing refund webhook:", payload);

      // Find payment record by transaction ID
      const { data: payment, error: paymentError } = await supabase
        .from("payments")
        .select("*")
        .eq("phonepe_transaction_id", payload.transactionId)
        .single();

      if (paymentError || !payment) {
        console.error(
          "Payment not found for refund transaction:",
          payload.transactionId
        );
        return;
      }

      // Update payment status
      await supabase
        .from("payments")
        .update({
          status: "refunded",
          phonepe_response: payload,
          processed_at: new Date().toISOString(),
        })
        .eq("id", payment.id);

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

      console.log("Refund webhook processed successfully");
    } catch (error) {
      console.error("Error processing refund webhook:", error);
    }
  }

  /**
   * Process webhook payload
   */
  static async processWebhook(
    payload: PhonePeWebhookPayload,
    signature: string
  ): Promise<void> {
    try {
      // Verify signature
      const payloadString = JSON.stringify(payload);
      if (!this.verifySignature(payloadString, signature)) {
        console.error("Invalid webhook signature");
        return;
      }

      // Process based on payment state
      switch (payload.state) {
        case "SUCCESS":
          await this.handlePaymentSuccess(payload);
          break;
        case "FAILED":
        case "CANCELLED":
          await this.handlePaymentFailure(payload);
          break;
        case "PENDING":
          // Handle pending state if needed
          console.log("Payment is still pending");
          break;
        default:
          console.log("Unknown payment state:", payload.state);
      }
    } catch (error) {
      console.error("Error processing webhook:", error);
    }
  }
}

export default PhonePeWebhookHandler;
