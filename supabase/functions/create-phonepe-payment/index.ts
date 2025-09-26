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

function toHexSha256(input: string): string {
  const data = new TextEncoder().encode(input);
  const hash = crypto.subtle.digestSync("SHA-256", data);
  return Array.from(new Uint8Array(hash))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const merchantId = Deno.env.get("PHONEPE_MERCHANT_ID") ?? "";
    const saltKey = Deno.env.get("PHONEPE_SALT_KEY") ?? "";
    const saltIndex = Deno.env.get("PHONEPE_SALT_INDEX") ?? "1";

    if (!merchantId || !saltKey) {
      return new Response(
        JSON.stringify({ error: "Missing PhonePe credentials" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 400 },
      );
    }

    const { amount, merchantTransactionId, redirectUrl, callbackUrl } =
      await req.json();

    if (!amount || !merchantTransactionId || !redirectUrl) {
      return new Response(
        JSON.stringify({ error: "amount, merchantTransactionId, redirectUrl required" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 400 },
      );
    }

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
    const checksum = `${toHexSha256(base64Payload + path + saltKey)}###${saltIndex}`;

    const resp = await fetch(`${BASE_URL}${path}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-VERIFY": checksum,
      },
      body: JSON.stringify({ request: base64Payload }),
    });

    const data = await resp.json();
    return new Response(JSON.stringify(data), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: resp.status,
    });
  } catch (e) {
    return new Response(
      JSON.stringify({ error: e?.message || "Unknown error" }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 400 },
    );
  }
});


