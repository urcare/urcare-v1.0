import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { corsHeaders } from "../_shared/cors.ts";

const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

// PhonePe configuration
const PHONEPE_MID = Deno.env.get("PHONEPE_MID") || "PHONEPEPGUAT";
const PHONEPE_KEY = Deno.env.get("PHONEPE_KEY") || "c817ffaf-8471-48b5-a7e2-a27e5b7efbd3";
const PHONEPE_API_KEY = Deno.env.get("PHONEPE_API_KEY") || "";
const PHONEPE_BASE_URL = Deno.env.get("PHONEPE_BASE_URL") || "https://api-preprod.phonepe.com/apis/pg-sandbox";
const IS_PRODUCTION = Deno.env.get("PHONEPE_ENVIRONMENT") === "production";

interface RefundRequest {
  payment_id: string;
  refund_amount?: number;
  reason?: string;
}

interface PhonePeRefundRequest {
  merchantId: string;
  merchantUserId: string;
  originalTransactionId: string;
  merchantRefundId: string;
  amount: number;
  callbackUrl: string;
}

function generateMerchantRefundId(): string {
  return `REF_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
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

function base64Encode(str: string): string {
  return btoa(str);
}

function base64Decode(str: string): string {
  return atob(str);
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const {
      payment_id,
      refund_amount,
      reason = "Customer requested refund",
    }: RefundRequest = await req.json();

    // Validate required fields
    if (!payment_id) {
      return new Response(JSON.stringify({ error: "Missing payment_id" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Get payment record
    const { data: payment, error: paymentError } = await supabase
      .from("payments")
      .select("*")
      .eq("id", payment_id)
      .single();

    if (paymentError || !payment) {
      return new Response(
        JSON.stringify({ error: "Payment record not found" }),
        {
          status: 404,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Check if payment is eligible for refund
    if (payment.status !== "completed") {
      return new Response(
        JSON.stringify({
          error: "Payment is not completed and cannot be refunded",
        }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Check if already refunded
    if (payment.status === "refunded") {
      return new Response(
        JSON.stringify({ error: "Payment has already been refunded" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Determine refund amount
    const refundAmount = refund_amount || payment.amount;
    if (refundAmount > payment.amount) {
      return new Response(
        JSON.stringify({ error: "Refund amount cannot exceed payment amount" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Generate merchant refund ID
    const merchantRefundId = generateMerchantRefundId();

    // Prepare PhonePe refund request
    const phonepeRequest: PhonePeRefundRequest = {
      merchantId: PHONEPE_MID,
      merchantUserId: payment.user_id,
      originalTransactionId: payment.phonepe_transaction_id!,
      merchantRefundId,
      amount: refundAmount * 100, // PhonePe expects amount in paise
      callbackUrl: `${Deno.env.get(
        "SUPABASE_URL"
      )}/functions/v1/phonepe-refund-callback`,
    };

    // Encode the request
    const encodedRequest = base64Encode(JSON.stringify(phonepeRequest));

    // Generate checksum
    const checksum = await generateChecksum(
      encodedRequest + "/pg/v1/refund" + PHONEPE_KEY,
      PHONEPE_KEY
    );

    // Prepare the final payload
    const payload = {
      request: encodedRequest,
      checksum: checksum,
    };

    // Make request to PhonePe
    const phonepeResponse = await fetch(`${PHONEPE_BASE_URL}/pg/v1/refund`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-VERIFY": checksum,
        "X-MERCHANT-ID": PHONEPE_MID,
        "accept": "application/json",
        ...(PHONEPE_API_KEY && { "Authorization": `Bearer ${PHONEPE_API_KEY}` }),
      },
      body: JSON.stringify(payload),
    });

    const phonepeData = await phonepeResponse.json();

    // Update payment record with refund status
    await supabase
      .from("payments")
      .update({
        status: phonepeData.success ? "refunded" : "failed",
        phonepe_response: phonepeData,
        failure_reason: phonepeData.success ? null : phonepeData.message,
      })
      .eq("id", payment.id);

    // If refund is successful, update subscription status
    if (phonepeData.success) {
      // Cancel the subscription
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

    if (!phonepeData.success) {
      return new Response(
        JSON.stringify({
          error: "Refund failed",
          details: phonepeData.message,
          phonepe_response: phonepeData,
        }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    return new Response(
      JSON.stringify({
        success: true,
        refund_id: merchantRefundId,
        refund_amount: refundAmount,
        payment_id: payment.id,
        phonepe_response: phonepeData,
      }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Refund error:", error);
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
