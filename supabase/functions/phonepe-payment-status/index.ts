import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { corsHeaders } from "../_shared/cors.ts";

const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

// PhonePe configuration
const PHONEPE_MERCHANT_ID =
  Deno.env.get("PHONEPE_MERCHANT_ID") || "PHONEPEPGUAT";
const PHONEPE_SALT_KEY =
  Deno.env.get("PHONEPE_SALT_KEY") || "c817ffaf-8471-48b5-a7e2-a27e5b7efbd3";
const PHONEPE_BASE_URL =
  Deno.env.get("PHONEPE_BASE_URL") ||
  "https://api-preprod.phonepe.com/apis/pg-sandbox";

interface StatusRequest {
  merchant_transaction_id: string;
  transaction_id?: string;
}

interface PhonePeStatusRequest {
  merchantId: string;
  merchantTransactionId: string;
  transactionId?: string;
}

function generateChecksum(payload: string, saltKey: string): string {
  const crypto = require("crypto");
  return crypto.createHmac("sha256", saltKey).update(payload).digest("hex");
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
    const { merchant_transaction_id, transaction_id }: StatusRequest =
      await req.json();

    // Validate required fields
    if (!merchant_transaction_id) {
      return new Response(
        JSON.stringify({ error: "Missing merchant_transaction_id" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Get payment record from database
    const { data: payment, error: paymentError } = await supabase
      .from("payments")
      .select("*")
      .eq("phonepe_merchant_transaction_id", merchant_transaction_id)
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

    // Prepare PhonePe status check request
    const phonepeRequest: PhonePeStatusRequest = {
      merchantId: PHONEPE_MERCHANT_ID,
      merchantTransactionId: merchant_transaction_id,
      transactionId: transaction_id || payment.phonepe_transaction_id,
    };

    // Encode the request
    const encodedRequest = base64Encode(JSON.stringify(phonepeRequest));

    // Generate checksum
    const checksum = generateChecksum(
      encodedRequest + "/pg/v1/status" + PHONEPE_SALT_KEY,
      PHONEPE_SALT_KEY
    );

    // Prepare the final payload
    const payload = {
      request: encodedRequest,
      checksum: checksum,
    };

    // Make request to PhonePe
    const phonepeResponse = await fetch(
      `${PHONEPE_BASE_URL}/pg/v1/status/${PHONEPE_MERCHANT_ID}/${merchant_transaction_id}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "X-VERIFY": checksum,
          "X-MERCHANT-ID": PHONEPE_MERCHANT_ID,
          accept: "application/json",
        },
      }
    );

    const phonepeData = await phonepeResponse.json();

    // Update payment record with latest status
    if (phonepeData.success) {
      const decodedResponse = JSON.parse(base64Decode(phonepeData.data));
      const paymentStatus =
        decodedResponse.state === "COMPLETED"
          ? "completed"
          : decodedResponse.state === "FAILED"
          ? "failed"
          : "processing";

      await supabase
        .from("payments")
        .update({
          status: paymentStatus,
          phonepe_response: phonepeData,
          processed_at:
            paymentStatus === "completed" ? new Date().toISOString() : null,
        })
        .eq("id", payment.id);
    }

    return new Response(
      JSON.stringify({
        success: true,
        payment: {
          id: payment.id,
          status: payment.status,
          amount: payment.amount,
          currency: payment.currency,
          payment_method: payment.payment_method,
          billing_cycle: payment.billing_cycle,
          created_at: payment.created_at,
          processed_at: payment.processed_at,
        },
        phonepe_response: phonepeData,
      }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Payment status check error:", error);
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
