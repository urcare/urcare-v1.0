import { supabase } from "@/integrations/supabase/client";

// Create PhonePe sandbox payment order
export async function createPhonePeSandboxPayment(orderId: string, amount: number, userId: string) {
  try {
    console.log("Creating PhonePe sandbox payment:", {
      orderId,
      amount,
      userId
    });

    // Call Supabase Edge Function for sandbox payment
    const { data, error } = await supabase.functions.invoke('phonepe-sandbox-pay', {
      body: {
        orderId: orderId,
        amount: amount, // Amount in paise (100 for ₹1)
        userId: userId
      }
    });

    if (error) {
      console.error("Supabase function error:", error);
      throw new Error(error.message || "Failed to create sandbox payment order");
    }

    console.log("PhonePe Sandbox Function response:", data);

    if (data && data.success && data.redirectUrl) {
      return {
        success: true,
        redirectUrl: data.redirectUrl,
        orderId: orderId,
        transactionId: data.transactionId
      };
    } else {
      throw new Error(data?.error || data?.message || "Sandbox payment initiation failed");
    }
  } catch (error) {
    console.error("PhonePe Sandbox Payment Error:", error);
    throw error;
  }
}

// Check sandbox payment status
export async function checkPhonePeSandboxStatus(transactionId: string) {
  try {
    console.log("Checking PhonePe sandbox payment status:", transactionId);

    // For sandbox, we'll simulate status check
    // In real implementation, you'd call PhonePe status API
    return {
      success: true,
      status: 'PENDING', // Sandbox payments are usually pending
      transactionId: transactionId
    };
  } catch (error) {
    console.error("PhonePe Sandbox Status Check Error:", error);
    throw error;
  }
}

