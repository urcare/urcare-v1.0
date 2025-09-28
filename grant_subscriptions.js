const { createClient } = require("@supabase/supabase-js");

// You'll need to add your Supabase URL and anon key here
const supabaseUrl = "YOUR_SUPABASE_URL";
const supabaseKey = "YOUR_SUPABASE_ANON_KEY";

const supabase = createClient(supabaseUrl, supabaseKey);

async function grantSubscriptions() {
  try {
    // First, get the Family plan ID
    const { data: plan, error: planError } = await supabase
      .from("subscription_plans")
      .select("id")
      .eq("slug", "family")
      .single();

    if (planError) {
      console.error("Error getting plan:", planError);
      return;
    }

    console.log("Family plan ID:", plan.id);

    // Insert yearly subscriptions for both users
    const { data, error } = await supabase.from("subscriptions").insert([
      {
        user_id: "15145645-ba06-4b73-9e40-8fec7fc04e2d", // Deepak
        plan_id: plan.id,
        status: "active",
        billing_cycle: "annual",
        current_period_start: new Date().toISOString(),
        current_period_end: new Date(
          Date.now() + 365 * 24 * 60 * 60 * 1000
        ).toISOString(),
        cancel_at_period_end: false,
        metadata: {
          granted_by: "admin",
          grant_type: "manual",
          notes: "Yearly subscription granted manually",
        },
      },
      {
        user_id: "5965e3d6-f3db-470d-b930-5f3e16ec41ef", // Sarthak Sharma
        plan_id: plan.id,
        status: "active",
        billing_cycle: "annual",
        current_period_start: new Date().toISOString(),
        current_period_end: new Date(
          Date.now() + 365 * 24 * 60 * 60 * 1000
        ).toISOString(),
        cancel_at_period_end: false,
        metadata: {
          granted_by: "admin",
          grant_type: "manual",
          notes: "Yearly subscription granted manually",
        },
      },
    ]);

    if (error) {
      console.error("Error creating subscriptions:", error);
      return;
    }

    console.log("Subscriptions created successfully:", data);

    // Verify the subscriptions were created
    const { data: subscriptions, error: verifyError } = await supabase
      .from("subscriptions")
      .select(
        `
        id,
        user_id,
        status,
        billing_cycle,
        current_period_start,
        current_period_end,
        created_at,
        subscription_plans!inner(name)
      `
      )
      .in("user_id", [
        "15145645-ba06-4b73-9e40-8fec7fc04e2d",
        "5965e3d6-f3db-470d-b930-5f3e16ec41ef",
      ])
      .order("created_at", { ascending: false });

    if (verifyError) {
      console.error("Error verifying subscriptions:", verifyError);
      return;
    }

    console.log("Verification - Subscriptions found:", subscriptions);
  } catch (error) {
    console.error("Unexpected error:", error);
  }
}

grantSubscriptions();
