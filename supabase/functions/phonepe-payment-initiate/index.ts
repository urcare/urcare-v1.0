import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { corsHeaders } from "../_shared/cors.ts";

const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

// PhonePe configuration
const PHONEPE_MERCHANT_ID =
  Deno.env.get("PHONEPE_MERCHANT_ID") || "PHONEPEPGUAT";
const PHONEPE_KEY_INDEX = Deno.env.get("PHONEPE_KEY_INDEX") || "1";
const PHONEPE_SALT_KEY =
  Deno.env.get("PHONEPE_SALT_KEY") || "c817ffaf-8471-48b5-a7e2-a27e5b7efbd3";
const PHONEPE_BASE_URL =
  Deno.env.get("PHONEPE_BASE_URL") ||
  "https://api-preprod.phonepe.com/apis/pg-sandbox";

interface PaymentRequest {
  user_id: string;
  plan_id: string;
  billing_cycle: "monthly" | "annual";
  amount: number;
  currency?: string;
  payment_method: "card" | "upi" | "netbanking" | "wallet";
  redirect_url?: string;
  callback_url?: string;
}

interface PhonePePayRequest {
  merchantId: string;
  merchantTransactionId: string;
  merchantUserId: string;
  amount: number;
  redirectUrl: string;
  redirectMode: string;
  callbackUrl: string;
  mobileNumber: string;
  paymentInstrument: {
    type: string;
    targetApp?: string;
    vpa?: string;
    cardDetails?: {
      cardNumber: string;
      cardType: string;
      cardIssuer: string;
      expiryMonth: number;
      expiryYear: number;
      cvv: string;
    };
  };
}

function generateMerchantTransactionId(): string {
  return `TXN_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
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
    const {
      user_id,
      plan_id,
      billing_cycle,
      amount,
      currency = "INR",
      payment_method,
      redirect_url,
      callback_url,
    }: PaymentRequest = await req.json();

    // Validate required fields
    if (!user_id || !plan_id || !billing_cycle || !amount || !payment_method) {
      return new Response(
        JSON.stringify({ error: "Missing required fields" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Get subscription plan details
    const { data: plan, error: planError } = await supabase
      .from("subscription_plans")
      .select("*")
      .eq("id", plan_id)
      .single();

    if (planError || !plan) {
      return new Response(
        JSON.stringify({ error: "Invalid subscription plan" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Get user details
    const { data: user, error: userError } = await supabase
      .from("user_profiles")
      .select("*")
      .eq("id", user_id)
      .single();

    if (userError || !user) {
      return new Response(JSON.stringify({ error: "User not found" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Generate merchant transaction ID
    const merchantTransactionId = generateMerchantTransactionId();

    // Create payment record
    const { data: payment, error: paymentError } = await supabase
      .from("payments")
      .insert({
        user_id,
        plan_id,
        amount,
        currency,
        status: "pending",
        payment_method,
        billing_cycle,
        phonepe_merchant_transaction_id: merchantTransactionId,
        is_first_time: true,
      })
      .select()
      .single();

    if (paymentError) {
      return new Response(
        JSON.stringify({
          error: "Failed to create payment record",
          details: paymentError.message,
        }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Prepare PhonePe payment request
    const phonepeRequest: PhonePePayRequest = {
      merchantId: PHONEPE_MERCHANT_ID,
      merchantTransactionId,
      merchantUserId: user_id,
      amount: amount * 100, // PhonePe expects amount in paise
      redirectUrl:
        redirect_url || `${Deno.env.get("FRONTEND_URL")}/payment/success`,
      redirectMode: "POST",
      callbackUrl:
        callback_url ||
        `${Deno.env.get("SUPABASE_URL")}/functions/v1/phonepe-payment-callback`,
      mobileNumber: user.phone || "9999999999",
      paymentInstrument: {
        type: payment_method.toUpperCase(),
      },
    };

    // Encode the request
    const encodedRequest = base64Encode(JSON.stringify(phonepeRequest));

    // Generate checksum
    const checksum = generateChecksum(
      encodedRequest + "/pg/v1/pay" + PHONEPE_SALT_KEY,
      PHONEPE_SALT_KEY
    );

    // Prepare the final payload
    const payload = {
      request: encodedRequest,
      checksum: checksum,
    };

    // Make request to PhonePe
    const phonepeResponse = await fetch(`${PHONEPE_BASE_URL}/pg/v1/pay`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-VERIFY": checksum,
        accept: "application/json",
      },
      body: JSON.stringify(payload),
    });

    const phonepeData = await phonepeResponse.json();

    // Update payment record with PhonePe response
    await supabase
      .from("payments")
      .update({
        phonepe_response: phonepeData,
        phonepe_transaction_id: phonepeData.data?.transactionId,
        status: phonepeData.success ? "processing" : "failed",
      })
      .eq("id", payment.id);

    if (!phonepeData.success) {
      return new Response(
        JSON.stringify({
          error: "Payment initiation failed",
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
        payment_id: payment.id,
        merchant_transaction_id: merchantTransactionId,
        phonepe_transaction_id: phonepeData.data?.transactionId,
        redirect_url: phonepeData.data?.redirectUrl,
        payment_url: phonepeData.data?.redirectUrl,
      }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Payment initiation error:", error);
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
