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

interface StatusRequest {
  merchant_transaction_id: string;
  transaction_id?: string;
}

interface PhonePeStatusRequest {
  merchantId: string;
  merchantTransactionId: string;
  transactionId?: string;
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
      merchantId: PHONEPE_MID,
      merchantTransactionId: merchant_transaction_id,
      transactionId: transaction_id || payment.phonepe_transaction_id,
    };

    // Encode the request
    const encodedRequest = base64Encode(JSON.stringify(phonepeRequest));

    // Generate checksum
    const checksum = await generateChecksum(
      encodedRequest + "/pg/v1/status" + PHONEPE_KEY,
      PHONEPE_KEY
    );

    // Prepare the final payload
    const payload = {
      request: encodedRequest,
      checksum: checksum,
    };

    // Make request to PhonePe
    const phonepeResponse = await fetch(
      `${PHONEPE_BASE_URL}/pg/v1/status/${PHONEPE_MID}/${merchant_transaction_id}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "X-VERIFY": checksum,
          "X-MERCHANT-ID": PHONEPE_MID,
          "accept": "application/json",
          ...(PHONEPE_API_KEY && { "Authorization": `Bearer ${PHONEPE_API_KEY}` }),
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
