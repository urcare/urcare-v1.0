// Script to create a test subscription for user: 18b0ceec-3988-4642-8e0b-4fbc70b186cb
// Run this in your browser console after logging in

const YOUR_USER_ID = "18b0ceec-3988-4642-8e0b-4fbc70b186cb";

async function createTestSubscription() {
  try {
    console.log("🚀 Starting subscription creation for user:", YOUR_USER_ID);

    // First, let's check if subscription plans exist
    console.log("📋 Checking available subscription plans...");
    const { data: plans, error: plansError } = await supabase
      .from("subscription_plans")
      .select("*")
      .eq("is_active", true)
      .order("sort_order", { ascending: true });

    if (plansError) {
      console.error("❌ Error fetching plans:", plansError);
      return;
    }

    if (!plans || plans.length === 0) {
      console.error(
        "❌ No subscription plans found. Please create plans first."
      );
      return;
    }

    console.log("✅ Available plans:", plans);

    // Use the first available plan (usually Basic)
    const plan = plans[0];
    console.log("🎯 Using plan:", plan.name, "with ID:", plan.id);

    // Check current subscription status
    console.log("🔍 Checking current subscription status...");
    const { data: existingSub, error: subCheckError } = await supabase
      .from("subscriptions")
      .select("*")
      .eq("user_id", YOUR_USER_ID);

    if (subCheckError) {
      console.error("❌ Error checking existing subscription:", subCheckError);
    } else if (existingSub && existingSub.length > 0) {
      console.log("📝 Found existing subscriptions:", existingSub);

      // Check if any are active
      const activeSub = existingSub.find((sub) => sub.status === "active");
      if (activeSub) {
        console.log("✅ User already has an active subscription:", activeSub);
        return;
      }
    } else {
      console.log("📝 No existing subscriptions found");
    }

    // Create a test subscription
    console.log("🔄 Creating new test subscription...");
    const now = new Date();
    const endDate = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000); // 30 days from now

    const subscriptionData = {
      user_id: YOUR_USER_ID,
      plan_id: plan.id,
      status: "active",
      billing_cycle: "monthly",
      current_period_start: now.toISOString(),
      current_period_end: endDate.toISOString(),
      trial_start: now.toISOString(),
      trial_end: endDate.toISOString(),
      metadata: { is_test_subscription: true, created_by: "test_script" },
    };

    console.log("📝 Subscription data to insert:", subscriptionData);

    const { data: newSubscription, error: createError } = await supabase
      .from("subscriptions")
      .insert(subscriptionData)
      .select()
      .single();

    if (createError) {
      console.error("❌ Error creating subscription:", createError);
      console.log("🔍 Error details:", createError);
      return;
    }

    console.log("✅ Test subscription created successfully!");
    console.log("📋 Subscription details:", newSubscription);

    // Also create an invoice record
    console.log("💰 Creating invoice record...");
    const invoiceData = {
      subscription_id: newSubscription.id,
      amount: plan.price_monthly,
      currency: "USD",
      status: "paid",
      payment_method: "test",
      payment_id: "test_" + Date.now(),
      invoice_date: now.toISOString(),
    };

    const { error: invoiceError } = await supabase
      .from("subscription_invoices")
      .insert(invoiceData);

    if (invoiceError) {
      console.warn(
        "⚠️ Warning: Could not create invoice record:",
        invoiceError
      );
    } else {
      console.log("✅ Invoice record created successfully!");
    }

    // Verify the subscription was created
    console.log("🔍 Verifying subscription creation...");
    const { data: verifySub, error: verifyError } = await supabase
      .from("subscriptions")
      .select("*")
      .eq("user_id", YOUR_USER_ID)
      .eq("status", "active")
      .single();

    if (verifyError) {
      console.error("❌ Verification failed:", verifyError);
    } else {
      console.log(
        "✅ Verification successful! Active subscription found:",
        verifySub
      );
    }

    console.log(
      "🎉 All done! Now refresh the page to see your subscription in action!"
    );
    console.log(
      "🚀 You should now be able to access Custom Plan and other premium features!"
    );
  } catch (error) {
    console.error("❌ Unexpected error:", error);
    console.log("🔍 Error details:", error);
  }
}

// Also add a function to check current status
async function checkSubscriptionStatus() {
  try {
    console.log("🔍 Checking subscription status for user:", YOUR_USER_ID);

    const { data: subscriptions, error } = await supabase
      .from("subscriptions")
      .select("*")
      .eq("user_id", YOUR_USER_ID);

    if (error) {
      console.error("❌ Error checking subscriptions:", error);
      return;
    }

    if (!subscriptions || subscriptions.length === 0) {
      console.log("📝 No subscriptions found for this user");
    } else {
      console.log("📋 Current subscriptions:", subscriptions);
    }

    // Also check subscription plans
    const { data: plans, error: plansError } = await supabase
      .from("subscription_plans")
      .select("*")
      .eq("is_active", true);

    if (plansError) {
      console.error("❌ Error checking plans:", plansError);
    } else {
      console.log("📋 Available subscription plans:", plans);
    }
  } catch (error) {
    console.error("❌ Error in checkSubscriptionStatus:", error);
  }
}

// Run the functions
console.log("🔧 Test subscription script loaded!");
console.log("📋 Available functions:");
console.log("  - createTestSubscription() - Creates a test subscription");
console.log("  - checkSubscriptionStatus() - Checks current status");
console.log("");
console.log("🚀 Run createTestSubscription() to create your subscription!");
