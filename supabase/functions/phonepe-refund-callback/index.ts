import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { corsHeaders } from "../_shared/cors.ts";

const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

// PhonePe configuration
const PHONEPE_SALT_KEY =
  Deno.env.get("PHONEPE_SALT_KEY") || "c817ffaf-8471-48b5-a7e2-a27e5b7efbd3";

interface PhonePeRefundCallbackData {
  response: string;
  checksum: string;
}

interface PhonePeRefundResponse {
  success: boolean;
  code: string;
  message: string;
  data: {
    merchantId: string;
    merchantRefundId: string;
    originalTransactionId: string;
    transactionId: string;
    amount: number;
    state: string;
    responseCode: string;
  };
}

function generateChecksum(payload: string, saltKey: string): string {
  const crypto = require("crypto");
  return crypto.createHmac("sha256", saltKey).update(payload).digest("hex");
}

function base64Decode(str: string): string {
  return atob(str);
}

function verifyChecksum(
  response: string,
  checksum: string,
  saltKey: string
): boolean {
  const expectedChecksum = generateChecksum(
    response + "/pg/v1/refund" + saltKey,
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
    const { response, checksum }: PhonePeRefundCallbackData = await req.json();

    // Verify checksum
    if (!verifyChecksum(response, checksum, PHONEPE_SALT_KEY)) {
      console.error("Invalid checksum in refund callback");
      return new Response(JSON.stringify({ error: "Invalid checksum" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Decode the response
    const decodedResponse: PhonePeRefundResponse = JSON.parse(
      base64Decode(response)
    );

    console.log("PhonePe refund callback received:", decodedResponse);

    // Find the payment record
    const { data: payment, error: paymentError } = await supabase
      .from("payments")
      .select("*")
      .eq("phonepe_transaction_id", decodedResponse.data.originalTransactionId)
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
    const refundStatus =
      decodedResponse.success && decodedResponse.data.state === "COMPLETED"
        ? "refunded"
        : "failed";

    const { error: updateError } = await supabase
      .from("payments")
      .update({
        status: refundStatus,
        phonepe_response: decodedResponse,
        processed_at: new Date().toISOString(),
        failure_reason:
          refundStatus === "failed" ? decodedResponse.message : null,
      })
      .eq("id", payment.id);

    if (updateError) {
      console.error("Failed to update payment refund status:", updateError);
      return new Response(
        JSON.stringify({ error: "Failed to update payment refund status" }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // If refund is successful, ensure subscription is canceled
    if (refundStatus === "refunded") {
      await supabase
        .from("subscriptions")
        .update({
          status: "canceled",
          canceled_at: new Date().toISOString(),
          cancel_at_period_end: true,
        })
        .eq("user_id", payment.user_id)
        .eq("status", "active");
    }

    return new Response(
      JSON.stringify({
        success: true,
        refund_status: refundStatus,
        refund_id: decodedResponse.data.merchantRefundId,
        transaction_id: decodedResponse.data.transactionId,
      }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Refund callback error:", error);
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
