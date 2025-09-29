import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { crypto } from "https://deno.land/std@0.168.0/crypto/mod.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface VerifyPaymentRequest {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
  plan_name: string;
  billing_cycle: "monthly" | "annual";
}

// Function to verify Razorpay signature
async function verifySignature(
  razorpay_order_id: string,
  razorpay_payment_id: string,
  razorpay_signature: string,
  secret: string
): Promise<boolean> {
  const body = `${razorpay_order_id}|${razorpay_payment_id}`;
  const expectedSignature = await crypto.subtle.digest(
    "SHA-256",
    new TextEncoder().encode(body)
  );
  
  // Convert ArrayBuffer to hex string
  const expectedSignatureHex = Array.from(new Uint8Array(expectedSignature))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
  
  return expectedSignatureHex === razorpay_signature;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    // Get the authorization header
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: "Missing authorization header" }),
        {
          status: 401,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Initialize Supabase client
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? "",
      {
        global: {
          headers: { Authorization: authHeader },
        },
      }
    );

    // Get the current user
    const {
      data: { user },
      error: userError,
    } = await supabaseClient.auth.getUser();

    if (userError || !user) {
      return new Response(
        JSON.stringify({ error: "Unauthorized" }),
        {
          status: 401,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Parse request body
    const {
      razorpay_payment_id,
      razorpay_order_id,
      razorpay_signature,
      plan_name,
      billing_cycle,
    }: VerifyPaymentRequest = await req.json();

    if (!razorpay_payment_id || !razorpay_order_id || !razorpay_signature) {
      return new Response(
        JSON.stringify({ error: "Missing payment verification data" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Get Razorpay webhook secret
    const razorpayWebhookSecret = Deno.env.get("RAZORPAY_WEBHOOK_SECRET");
    if (!razorpayWebhookSecret) {
      return new Response(
        JSON.stringify({ error: "Webhook secret not configured" }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Verify the signature
    const isValidSignature = await verifySignature(
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      razorpayWebhookSecret
    );

    if (!isValidSignature) {
      return new Response(
        JSON.stringify({ error: "Invalid payment signature" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Get the order details from database
    const { data: orderData, error: orderError } = await supabaseClient
      .from("payment_orders")
      .select("*")
      .eq("razorpay_order_id", razorpay_order_id)
      .eq("user_id", user.id)
      .single();

    if (orderError || !orderData) {
      return new Response(
        JSON.stringify({ error: "Order not found" }),
        {
          status: 404,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Update order status to completed
    const { error: updateError } = await supabaseClient
      .from("payment_orders")
      .update({
        status: "completed",
        razorpay_payment_id: razorpay_payment_id,
        completed_at: new Date().toISOString(),
      })
      .eq("razorpay_order_id", razorpay_order_id);

    if (updateError) {
      console.error("Error updating order status:", updateError);
    }

    // Create or update user subscription
    const subscriptionData = {
      user_id: user.id,
      plan_name: plan_name,
      billing_cycle: billing_cycle,
      status: "active",
      payment_id: razorpay_payment_id,
      order_id: razorpay_order_id,
      amount: orderData.amount,
      currency: orderData.currency,
      started_at: new Date().toISOString(),
      expires_at: new Date(
        Date.now() + (billing_cycle === "monthly" ? 30 : 365) * 24 * 60 * 60 * 1000
      ).toISOString(),
    };

    // Check if user already has an active subscription
    const { data: existingSubscription } = await supabaseClient
      .from("user_subscriptions")
      .select("*")
      .eq("user_id", user.id)
      .eq("status", "active")
      .single();

    if (existingSubscription) {
      // Update existing subscription
      const { error: updateSubError } = await supabaseClient
        .from("user_subscriptions")
        .update(subscriptionData)
        .eq("user_id", user.id)
        .eq("status", "active");

      if (updateSubError) {
        console.error("Error updating subscription:", updateSubError);
      }
    } else {
      // Create new subscription
      const { error: createSubError } = await supabaseClient
        .from("user_subscriptions")
        .insert(subscriptionData);

      if (createSubError) {
        console.error("Error creating subscription:", createSubError);
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        payment_id: razorpay_payment_id,
        order_id: razorpay_order_id,
        message: "Payment verified and subscription activated",
      }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error verifying Razorpay payment:", error);
    return new Response(
      JSON.stringify({ error: "Internal server error" }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
