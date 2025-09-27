import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

const BASE_URL =
  (Deno.env.get("PHONEPE_ENV") || "SANDBOX").toUpperCase() === "PROD"
    ? "https://api.phonepe.com/apis/hermes"
    : "https://api-preprod.phonepe.com/apis/pg-sandbox";

async function toHexSha256(input: string): Promise<string> {
  const data = new TextEncoder().encode(input);
  const hash = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(hash))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    // First, let's just return a simple test response
    console.log("Function called successfully");

    const merchantId = Deno.env.get("PHONEPE_MERCHANT_ID") ?? "";
    const saltKey = Deno.env.get("PHONEPE_SALT_KEY") ?? "";
    const saltIndex = Deno.env.get("PHONEPE_SALT_INDEX") ?? "1";

    console.log("PhonePe credentials check:", {
      merchantId: merchantId ? "***" : "missing",
      saltKey: saltKey ? "***" : "missing",
      saltIndex,
    });

    if (!merchantId || !saltKey) {
      console.log("Missing PhonePe credentials");
      return new Response(
        JSON.stringify({ error: "Missing PhonePe credentials" }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 400,
        }
      );
    }

    const { amount, merchantTransactionId, redirectUrl, callbackUrl } =
      await req.json();

    console.log("Request payload:", {
      amount,
      merchantTransactionId,
      redirectUrl,
      callbackUrl,
    });

    if (!amount || !merchantTransactionId || !redirectUrl) {
      console.log("Missing required parameters");
      return new Response(
        JSON.stringify({
          error: "amount, merchantTransactionId, redirectUrl required",
        }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 400,
        }
      );
    }

    // For now, let's just return a test response to see if the function works
    console.log("All parameters present, returning test response");
    return new Response(
      JSON.stringify({
        success: true,
        message: "Function is working",
        data: { test: "response" },
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );

    const payload = {
      merchantId,
      merchantTransactionId,
      merchantUserId: merchantTransactionId,
      amount, // in paise
      redirectUrl,
      callbackUrl: callbackUrl || redirectUrl,
      paymentInstrument: { type: "PAY_PAGE" },
    };

    const base64Payload = btoa(JSON.stringify(payload));
    const path = "/pg/v1/pay";
    const checksum = `${await toHexSha256(
      base64Payload + path + saltKey
    )}###${saltIndex}`;

    console.log("PhonePe API call details:", {
      url: `${BASE_URL}${path}`,
      payload: payload,
      base64Payload: base64Payload,
      checksum: checksum.substring(0, 20) + "...",
    });

    const resp = await fetch(`${BASE_URL}${path}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-VERIFY": checksum,
      },
      body: JSON.stringify({ request: base64Payload }),
    });

    console.log("PhonePe API response status:", resp.status);
    const data = await resp.json();
    console.log("PhonePe API response data:", data);

    if (!resp.ok) {
      return new Response(
        JSON.stringify({
          error: "PhonePe API error",
          status: resp.status,
          data: data,
        }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 400,
        }
      );
    }

    return new Response(JSON.stringify(data), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: resp.status,
    });
  } catch (e) {
    console.error("PhonePe function error:", e);
    return new Response(
      JSON.stringify({
        error: e?.message || "Unknown error",
        details: e?.stack || "No stack trace",
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 400,
      }
    );
  }
});
