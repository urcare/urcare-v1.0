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

interface VPAValidationRequest {
  vpa: string;
}

interface PhonePeVPARequest {
  merchantId: string;
  vpa: string;
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
    const { vpa }: VPAValidationRequest = await req.json();

    // Validate required fields
    if (!vpa) {
      return new Response(JSON.stringify({ error: "Missing VPA" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Basic VPA format validation
    const vpaRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+$/;
    if (!vpaRegex.test(vpa)) {
      return new Response(
        JSON.stringify({
          error: "Invalid VPA format",
          valid: false,
        }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Prepare PhonePe VPA validation request
    const phonepeRequest: PhonePeVPARequest = {
      merchantId: PHONEPE_MERCHANT_ID,
      vpa: vpa,
    };

    // Encode the request
    const encodedRequest = base64Encode(JSON.stringify(phonepeRequest));

    // Generate checksum
    const checksum = generateChecksum(
      encodedRequest + "/pg/v1/vpa/validate" + PHONEPE_SALT_KEY,
      PHONEPE_SALT_KEY
    );

    // Prepare the final payload
    const payload = {
      request: encodedRequest,
      checksum: checksum,
    };

    // Make request to PhonePe
    const phonepeResponse = await fetch(
      `${PHONEPE_BASE_URL}/pg/v1/vpa/validate`,
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

    return new Response(
      JSON.stringify({
        success: phonepeData.success,
        valid: phonepeData.success && decodedResponse?.valid === true,
        vpa: vpa,
        message: phonepeData.message,
        phonepe_response: phonepeData,
        decoded_response: decodedResponse,
      }),
      {
        status: phonepeData.success ? 200 : 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("VPA validation error:", error);
    return new Response(
      JSON.stringify({
        error: "Internal server error",
        details: error.message,
        valid: false,
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
