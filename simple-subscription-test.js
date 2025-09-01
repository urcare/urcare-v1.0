// Simple script to test subscription - run this in your app's console
// Make sure you're logged into your app first!

console.log("🔧 Simple subscription test script loaded!");

// Function to check what's available
function checkAvailable() {
  console.log("🔍 Checking what's available...");
  console.log("supabase available:", typeof supabase !== "undefined");
  console.log("window.supabase:", window.supabase);

  // Check if we can access the app's supabase instance
  if (typeof supabase !== "undefined") {
    console.log("✅ Supabase is available!");
    return true;
  } else {
    console.log("❌ Supabase not found in global scope");
    console.log("💡 Try running this from your app's page, not a blank page");
    return false;
  }
}

// Function to create trial subscription (NEW - for testing the paywall)
async function createTrialSubscription(
  planSlug = "basic",
  billingCycle = "monthly"
) {
  if (!checkAvailable()) {
    console.log("❌ Cannot proceed - Supabase not available");
    return;
  }

  try {
    console.log(
      `🚀 Creating trial subscription for plan: ${planSlug} (${billingCycle})`
    );

    // First get the plan details
    const { data: plan, error: planError } = await supabase
      .from("subscription_plans")
      .select("*")
      .eq("slug", planSlug)
      .eq("is_active", true)
      .single();

    if (planError || !plan) {
      console.error("❌ Error fetching plan:", planError);
      return;
    }

    console.log("✅ Plan found:", plan.name);

    // Get current user ID (you'll need to replace this with actual user ID)
    const userId = "18b0ceec-3988-4642-8e0b-4fbc70b186cb"; // Replace with your user ID

    // Calculate trial dates
    const now = new Date();
    const trialEnd = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000); // 7 days trial

    // Calculate period end based on billing cycle
    const periodStart = trialEnd;
    const periodEnd = new Date(
      periodStart.getTime() +
        (billingCycle === "annual" ? 365 : 30) * 24 * 60 * 60 * 1000
    );

    // Create trial subscription
    const { data: subscription, error } = await supabase
      .from("subscriptions")
      .insert({
        user_id: userId,
        plan_id: plan.id,
        status: "trialing",
        billing_cycle: billingCycle,
        current_period_start: periodStart.toISOString(),
        current_period_end: periodEnd.toISOString(),
        trial_start: now.toISOString(),
        trial_end: trialEnd.toISOString(),
        metadata: { is_trial: true, created_via: "test_script" },
      })
      .select()
      .single();

    if (error) {
      console.error("❌ Error creating trial subscription:", error);
      return;
    }

    console.log("✅ Trial subscription created successfully!");
    console.log("📋 Details:", subscription);
    console.log("🎉 Trial ends:", trialEnd.toLocaleDateString());
    console.log("🔄 Refresh your app to see the changes!");

    return subscription;
  } catch (error) {
    console.error("❌ Unexpected error:", error);
  }
}

// Function to create subscription (only if supabase is available)
async function createSubscription() {
  if (!checkAvailable()) {
    console.log("❌ Cannot proceed - Supabase not available");
    return;
  }

  try {
    console.log(
      "🚀 Creating subscription for user: 18b0ceec-3988-4642-8e0b-4fbc70b186cb"
    );

    // Check plans first
    const { data: plans, error: plansError } = await supabase
      .from("subscription_plans")
      .select("*")
      .eq("is_active", true);

    if (plansError) {
      console.error("❌ Error fetching plans:", plansError);
      return;
    }

    if (!plans || plans.length === 0) {
      console.error("❌ No subscription plans found");
      return;
    }

    console.log("✅ Available plans:", plans);

    // Use first plan
    const plan = plans[0];
    console.log("🎯 Using plan:", plan.name);

    // Create subscription
    const now = new Date();
    const endDate = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);

    const { data: subscription, error } = await supabase
      .from("subscriptions")
      .insert({
        user_id: "18b0ceec-3988-4642-8e0b-4fbc70b186cb",
        plan_id: plan.id,
        status: "active",
        billing_cycle: "monthly",
        current_period_start: now.toISOString(),
        current_period_end: endDate.toISOString(),
        metadata: { is_test: true },
      })
      .select()
      .single();

    if (error) {
      console.error("❌ Error creating subscription:", error);
      return;
    }

    console.log("✅ Subscription created successfully!");
    console.log("📋 Details:", subscription);
    console.log("🎉 Now refresh your app to see the changes!");
  } catch (error) {
    console.error("❌ Unexpected error:", error);
  }
}

// Function to check current status
async function checkStatus() {
  if (!checkAvailable()) return;

  try {
    const { data: subscriptions, error } = await supabase
      .from("subscriptions")
      .select("*")
      .eq("user_id", "18b0ceec-3988-4642-8e0b-4fbc70b186cb");

    if (error) {
      console.error("❌ Error checking subscriptions:", error);
      return;
    }

    if (!subscriptions || subscriptions.length === 0) {
      console.log("📝 No subscriptions found");
    } else {
      console.log("📋 Current subscriptions:", subscriptions);
    }
  } catch (error) {
    console.error("❌ Error checking status:", error);
  }
}

console.log("📋 Available functions:");
console.log("  - checkAvailable() - Check if supabase is available");
console.log("  - checkStatus() - Check current subscription status");
console.log("  - createSubscription() - Create a test subscription");
console.log(
  "  - createTrialSubscription(planSlug, billingCycle) - Create a trial subscription"
);
console.log("");
console.log("🚀 Start with: checkAvailable()");
console.log(
  "🎁 Try: createTrialSubscription('basic', 'monthly') for a basic plan trial"
);
