import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { corsHeaders } from "../_shared/cors.ts";

// PhonePe configuration
const PHONEPE_MERCHANT_ID =
  Deno.env.get("PHONEPE_MERCHANT_ID") || "PHONEPEPGUAT";
const PHONEPE_SALT_KEY =
  Deno.env.get("PHONEPE_SALT_KEY") || "c817ffaf-8471-48b5-a7e2-a27e5b7efbd3";
const PHONEPE_BASE_URL =
  Deno.env.get("PHONEPE_BASE_URL") ||
  "https://api-preprod.phonepe.com/apis/pg-sandbox";

interface PaymentOptionsRequest {
  amount?: number;
  currency?: string;
}

interface PhonePePaymentOptionsRequest {
  merchantId: string;
  amount?: number;
  currency?: string;
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
    const { amount, currency = "INR" }: PaymentOptionsRequest =
      await req.json();

    // Prepare PhonePe payment options request
    const phonepeRequest: PhonePePaymentOptionsRequest = {
      merchantId: PHONEPE_MERCHANT_ID,
      amount: amount ? amount * 100 : undefined, // PhonePe expects amount in paise
      currency: currency,
    };

    // Encode the request
    const encodedRequest = base64Encode(JSON.stringify(phonepeRequest));

    // Generate checksum
    const checksum = generateChecksum(
      encodedRequest + "/pg/v1/paymentOptions" + PHONEPE_SALT_KEY,
      PHONEPE_SALT_KEY
    );

    // Prepare the final payload
    const payload = {
      request: encodedRequest,
      checksum: checksum,
    };

    // Make request to PhonePe
    const phonepeResponse = await fetch(
      `${PHONEPE_BASE_URL}/pg/v1/paymentOptions`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-VERIFY": checksum,
          accept: "application/json",
        },
        body: JSON.stringify(payload),
      }
    );

    const phonepeData = await phonepeResponse.json();

    // Decode the response if successful
    let decodedResponse = null;
    if (phonepeData.success && phonepeData.data) {
      try {
        decodedResponse = JSON.parse(base64Decode(phonepeData.data));
      } catch (e) {
        console.error("Failed to decode PhonePe response:", e);
      }
    }

    // If PhonePe API fails, return default payment options
    if (!phonepeData.success) {
      const defaultOptions = {
        success: true,
        payment_options: {
          upi: {
            enabled: true,
            methods: ["UPI_ID", "UPI_QR", "UPI_COLLECT"],
          },
          card: {
            enabled: true,
            methods: ["DEBIT_CARD", "CREDIT_CARD"],
          },
          netbanking: {
            enabled: true,
            methods: ["NET_BANKING"],
          },
          wallet: {
            enabled: true,
            methods: ["WALLET"],
          },
        },
        message: "Using default payment options as PhonePe API is unavailable",
      };

      return new Response(JSON.stringify(defaultOptions), {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(
      JSON.stringify({
        success: phonepeData.success,
        payment_options: decodedResponse,
        message: phonepeData.message,
        phonepe_response: phonepeData,
      }),
      {
        status: phonepeData.success ? 200 : 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Payment options error:", error);

    // Return default payment options on error
    const defaultOptions = {
      success: true,
      payment_options: {
        upi: {
          enabled: true,
          methods: ["UPI_ID", "UPI_QR", "UPI_COLLECT"],
        },
        card: {
          enabled: true,
          methods: ["DEBIT_CARD", "CREDIT_CARD"],
        },
        netbanking: {
          enabled: true,
          methods: ["NET_BANKING"],
        },
        wallet: {
          enabled: true,
          methods: ["WALLET"],
        },
      },
      message: "Using default payment options due to service error",
    };

    return new Response(JSON.stringify(defaultOptions), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
