import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { corsHeaders } from "../_shared/cors.ts";

const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

// PhonePe configuration
const PHONEPE_KEY = Deno.env.get("PHONEPE_KEY") || "c817ffaf-8471-48b5-a7e2-a27e5b7efbd3";
const IS_PRODUCTION = Deno.env.get("PHONEPE_ENVIRONMENT") === "production";

interface PhonePeCallbackData {
  response: string;
  checksum: string;
}

interface PhonePeResponse {
  success: boolean;
  code: string;
  message: string;
  data: {
    merchantId: string;
    merchantTransactionId: string;
    transactionId: string;
    amount: number;
    state: string;
    responseCode: string;
    paymentInstrument: {
      type: string;
      utr?: string;
      cardType?: string;
      pgTransactionId?: string;
      pgServiceTransactionId?: string;
      bankTransactionId?: string;
      bankId?: string;
    };
  };
}

async function generateChecksum(payload: string, saltKey: string): Promise<string> {
  const encoder = new TextEncoder();
  const keyData = encoder.encode(saltKey);
  const messageData = encoder.encode(payload);
  
  const cryptoKey = await crypto.subtle.importKey(
    "raw",
    keyData,
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  
  const signature = await crypto.subtle.sign("HMAC", cryptoKey, messageData);
  const hashArray = Array.from(new Uint8Array(signature));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

function base64Decode(str: string): string {
  return atob(str);
}

async function verifyChecksum(
  response: string,
  checksum: string,
  saltKey: string
): Promise<boolean> {
  const expectedChecksum = await generateChecksum(
    response + "/pg/v1/status" + saltKey,
    saltKey
  );
  return expectedChecksum === checksum;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { response, checksum }: PhonePeCallbackData = await req.json();

    // Verify checksum
    if (!(await verifyChecksum(response, checksum, PHONEPE_KEY))) {
      console.error("Invalid checksum in callback");
      return new Response(JSON.stringify({ error: "Invalid checksum" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Decode the response
    const decodedResponse: PhonePeResponse = JSON.parse(base64Decode(response));

    console.log("PhonePe callback received:", decodedResponse);

    // Find the payment record
    const { data: payment, error: paymentError } = await supabase
      .from("payments")
      .select("*")
      .eq(
        "phonepe_merchant_transaction_id",
        decodedResponse.data.merchantTransactionId
      )
      .single();

    if (paymentError || !payment) {
      console.error("Payment record not found:", paymentError);
      return new Response(
        JSON.stringify({ error: "Payment record not found" }),
        {
          status: 404,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Update payment status
    const paymentStatus =
      decodedResponse.success && decodedResponse.data.state === "COMPLETED"
        ? "completed"
        : "failed";

    const { error: updateError } = await supabase
      .from("payments")
      .update({
        status: paymentStatus,
        phonepe_transaction_id: decodedResponse.data.transactionId,
        phonepe_response: decodedResponse,
        processed_at: new Date().toISOString(),
        failure_reason:
          paymentStatus === "failed" ? decodedResponse.message : null,
      })
      .eq("id", payment.id);

    if (updateError) {
      console.error("Failed to update payment:", updateError);
      return new Response(
        JSON.stringify({ error: "Failed to update payment status" }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // If payment is successful, create or update subscription
    if (paymentStatus === "completed") {
      // Check if user already has an active subscription
      const { data: existingSubscription } = await supabase
        .from("subscriptions")
        .select("*")
        .eq("user_id", payment.user_id)
        .eq("status", "active")
        .single();

      if (existingSubscription) {
        // Update existing subscription
        const newPeriodEnd = new Date(existingSubscription.current_period_end);
        if (payment.billing_cycle === "monthly") {
          newPeriodEnd.setMonth(newPeriodEnd.getMonth() + 1);
        } else {
          newPeriodEnd.setFullYear(newPeriodEnd.getFullYear() + 1);
        }

        await supabase
          .from("subscriptions")
          .update({
            current_period_end: newPeriodEnd.toISOString(),
            status: "active",
          })
          .eq("id", existingSubscription.id);
      } else {
        // Create new subscription
        const now = new Date();
        const periodEnd = new Date();

        if (payment.billing_cycle === "monthly") {
          periodEnd.setMonth(periodEnd.getMonth() + 1);
        } else {
          periodEnd.setFullYear(periodEnd.getFullYear() + 1);
        }

        await supabase.from("subscriptions").insert({
          user_id: payment.user_id,
          plan_id: payment.plan_id,
          status: "active",
          billing_cycle: payment.billing_cycle,
          current_period_start: now.toISOString(),
          current_period_end: periodEnd.toISOString(),
          phonepe_subscription_id: decodedResponse.data.transactionId,
        });
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        payment_status: paymentStatus,
        transaction_id: decodedResponse.data.transactionId,
      }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Payment callback error:", error);
    return new Response(
      JSON.stringify({
        error: "Internal server error",
        details: error.message,
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
