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

    const { merchantTransactionId } = await req.json();
    if (!merchantId || !saltKey || !merchantTransactionId) {
      return new Response(
        JSON.stringify({ error: "Missing credentials or merchantTransactionId" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 400 },
      );
    }

    const path = `/pg/v1/status/${merchantId}/${merchantTransactionId}`;
    const checksum = `${toHexSha256(path + saltKey)}###${saltIndex}`;

    const resp = await fetch(`${BASE_URL}${path}`, {
      headers: {
        "X-VERIFY": checksum,
        "X-MERCHANT-ID": merchantId,
      },
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


