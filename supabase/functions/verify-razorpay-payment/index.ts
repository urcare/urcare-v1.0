import { crypto } from "https://deno.land/std@0.168.0/crypto/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import Razorpay from "https://esm.sh/razorpay@2.8.6";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    // Create Supabase client
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? "",
      {
        global: {
          headers: { Authorization: req.headers.get("Authorization")! },
        },
      }
    );

    // Create Razorpay client
    const razorpay = new Razorpay({
      key_id: Deno.env.get("RAZORPAY_KEY_ID") ?? "",
      key_secret: Deno.env.get("RAZORPAY_KEY_SECRET") ?? "",
    });

    // Get request body
    const {
      razorpay_payment_id,
      razorpay_order_id,
      razorpay_signature,
      userId,
    } = await req.json();

    // Validate required fields
    if (
      !razorpay_payment_id ||
      !razorpay_order_id ||
      !razorpay_signature ||
      !userId
    ) {
      throw new Error(
        "Missing required fields: razorpay_payment_id, razorpay_order_id, razorpay_signature, userId"
      );
    }

    // Verify signature
    const text = `${razorpay_order_id}|${razorpay_payment_id}`;
    const secret = Deno.env.get("RAZORPAY_KEY_SECRET") ?? "";

    const encoder = new TextEncoder();
    const keyData = encoder.encode(secret);
    const messageData = encoder.encode(text);

    const cryptoKey = await crypto.subtle.importKey(
      "raw",
      keyData,
      { name: "HMAC", hash: "SHA-256" },
      false,
      ["sign"]
    );

    const signature = await crypto.subtle.sign("HMAC", cryptoKey, messageData);
    const expectedSignature = Array.from(new Uint8Array(signature))
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");

    if (expectedSignature !== razorpay_signature) {
      throw new Error("Invalid signature");
    }

    // Get payment details from Razorpay
    const payment = await razorpay.payments.fetch(razorpay_payment_id);

    if (payment.status !== "captured") {
      throw new Error("Payment not captured");
    }

    // Get order details to extract subscription information
    const order = await razorpay.orders.fetch(razorpay_order_id);
    const notes = order.notes || {};

    // Use provided parameters or fallback to order notes
    const planSlug = body.planSlug || notes.planSlug || "basic";
    const billingCycle = body.billingCycle || notes.billingCycle || "annual";
    const isFirstTime =
      body.isFirstTime !== undefined
        ? body.isFirstTime
        : notes.isFirstTime === "true";

    console.log("Using subscription details:", {
      planSlug,
      billingCycle,
      isFirstTime,
    });

    // Get plan details from database
    const { data: plan, error: planError } = await supabaseClient
      .from("subscription_plans")
      .select("*")
      .eq("slug", planSlug)
      .single();

    if (planError || !plan) {
      throw new Error("Plan not found");
    }

    // Calculate subscription end date
    const now = new Date();
    const endDate = new Date(now);

    if (billingCycle === "monthly") {
      endDate.setMonth(endDate.getMonth() + 1);
    } else {
      endDate.setFullYear(endDate.getFullYear() + 1);
    }

    // Create subscription in database
    const { data: subscription, error: subscriptionError } =
      await supabaseClient
        .from("subscriptions")
        .insert({
          user_id: userId,
          plan_id: plan.id,
          status: "active",
          billing_cycle: billingCycle,
          current_period_start: now.toISOString(),
          current_period_end: endDate.toISOString(),
          stripe_subscription_id: razorpay_payment_id, // Using stripe field for Razorpay payment ID
          metadata: {
            razorpay_payment_id: razorpay_payment_id,
            razorpay_order_id: razorpay_order_id,
            amount_paid: payment.amount / 100,
            currency: payment.currency,
            is_first_time: isFirstTime,
          },
        })
        .select()
        .single();

    if (subscriptionError) {
      console.error("Error creating subscription:", subscriptionError);
      throw new Error("Failed to create subscription");
    }

    // Create invoice record
    const { error: invoiceError } = await supabaseClient
      .from("subscription_invoices")
      .insert({
        subscription_id: subscription.id,
        amount: payment.amount / 100,
        currency: payment.currency,
        status: "paid",
        payment_method: "razorpay",
        payment_id: razorpay_payment_id,
        order_id: razorpay_order_id,
        invoice_date: now.toISOString(),
      });

    if (invoiceError) {
      console.error("Error creating invoice:", invoiceError);
      // Don't throw error here as subscription was created successfully
    }

    return new Response(
      JSON.stringify({
        success: true,
        subscriptionId: subscription.id,
        subscription: {
          id: subscription.id,
          status: subscription.status,
          billing_cycle: subscription.billing_cycle,
          current_period_end: subscription.current_period_end,
        },
        message: "Payment verified and subscription created successfully",
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );
  } catch (error) {
    console.error("Error verifying payment:", error);

    return new Response(
      JSON.stringify({
        success: false,
        error: error.message,
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 400,
      }
    );
  }
});
