// Debug utility for health plan issues
import { supabase } from "@/integrations/supabase/client";

export const debugHealthPlan = async () => {
  console.log("🔍 Debugging Health Plan Setup...");

  try {
    // 1. Check if user is authenticated
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();
    console.log(
      "👤 User Auth:",
      user ? "✅ Authenticated" : "❌ Not authenticated",
      userError
    );

    if (!user) {
      console.log("❌ User not authenticated - cannot proceed");
      return;
    }

    // 2. Check if user profile exists
    const { data: profile, error: profileError } = await supabase
      .from("user_profiles")
      .select("*")
      .eq("id", user.id)
      .single();

    console.log(
      "📋 User Profile:",
      profile ? "✅ Found" : "❌ Not found",
      profileError
    );

    if (!profile) {
      console.log("❌ User profile not found - complete onboarding first");
      return;
    }

    // 3. Check if onboarding is completed
    console.log(
      "✅ Onboarding Status:",
      profile.onboarding_completed ? "Completed" : "Not completed"
    );

    if (!profile.onboarding_completed) {
      console.log("❌ Onboarding not completed - complete onboarding first");
      return;
    }

    // 4. Check if tables exist
    const { data: plans, error: plansError } = await supabase
      .from("two_day_health_plans")
      .select("id")
      .limit(1);

    console.log(
      "🗄️ Health Plans Table:",
      plansError ? "❌ Error" : "✅ Accessible",
      plansError
    );

    const { data: progress, error: progressError } = await supabase
      .from("plan_progress")
      .select("id")
      .limit(1);

    console.log(
      "📊 Progress Table:",
      progressError ? "❌ Error" : "✅ Accessible",
      progressError
    );

    // 5. Check if user has existing plans
    const { data: existingPlans, error: existingError } = await supabase
      .from("two_day_health_plans")
      .select("*")
      .eq("user_id", user.id);

    console.log(
      "📅 Existing Plans:",
      existingPlans?.length || 0,
      "plans found",
      existingError
    );

    // 6. Test Supabase function (this will fail if not deployed)
    console.log("🚀 Testing Supabase Function...");
    try {
      const { data, error } = await supabase.functions.invoke(
        "generate-health-plan",
        {
          method: "POST",
          body: {},
        }
      );

      if (error) {
        console.log("❌ Function Error:", error.message);
        if (error.message.includes("Function not found")) {
          console.log(
            "💡 Solution: Deploy the function with: supabase functions deploy generate-health-plan"
          );
        }
        if (error.message.includes("OpenAI")) {
          console.log(
            "💡 Solution: Add OPENAI_API_KEY to your Supabase project secrets"
          );
        }
      } else {
        console.log("✅ Function Working:", data);
      }
    } catch (funcError) {
      console.log("❌ Function Test Failed:", funcError);
    }

    console.log("🔍 Debug Complete");
  } catch (error) {
    console.error("❌ Debug Error:", error);
  }
};

// Export for use in browser console
(window as any).debugHealthPlan = debugHealthPlan;
