// Debug the 406 error - RLS policies exist but query is failing
import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

dotenv.config();

const supabaseUrl =
  process.env.VITE_SUPABASE_URL || "https://lvnkpserdydhnqbigfbz.supabase.co";
const supabaseAnonKey =
  process.env.VITE_SUPABASE_ANON_KEY ||
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx2bmtwc2VyZHlkaG5xYmlnZmJ6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTMzMzY5NjYsImV4cCI6MjA2ODkxMjk2Nn0.Y2NfbA7K9efpFHB6FFmCtgti3udX5wbOoQVkDndtkBc";

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function debug406Error() {
  console.log("🔍 Debugging 406 error...");

  try {
    // Test 1: Check authentication
    console.log("\n1️⃣ Testing authentication...");
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError) {
      console.error("❌ Authentication error:", authError);
      return;
    }

    if (!user) {
      console.error("❌ No authenticated user");
      return;
    }

    console.log("✅ User authenticated:", user.id);

    // Test 2: Check user profile access
    console.log("\n2️⃣ Testing user profile access...");
    const { data: profile, error: profileError } = await supabase
      .from("user_profiles")
      .select("*")
      .eq("id", user.id)
      .single();

    if (profileError) {
      console.error("❌ User profile error:", profileError);
    } else {
      console.log("✅ User profile accessible");
    }

    // Test 3: Test comprehensive health plans query (the failing one)
    console.log("\n3️⃣ Testing comprehensive health plans query...");
    const { data: healthPlans, error: healthError } = await supabase
      .from("comprehensive_health_plans")
      .select("*")
      .eq("user_id", user.id)
      .eq("status", "active");

    if (healthError) {
      console.error("❌ Comprehensive health plans error:", healthError);
      console.log("Error details:", JSON.stringify(healthError, null, 2));

      // Test 4: Try without status filter
      console.log("\n4️⃣ Testing without status filter...");
      const { data: allPlans, error: allPlansError } = await supabase
        .from("comprehensive_health_plans")
        .select("*")
        .eq("user_id", user.id);

      if (allPlansError) {
        console.error("❌ All plans query error:", allPlansError);
      } else {
        console.log(
          "✅ All plans query successful, found:",
          allPlans.length,
          "plans"
        );
      }

      // Test 5: Try with different column name
      console.log("\n5️⃣ Testing with different column name...");
      const { data: plansById, error: plansByIdError } = await supabase
        .from("comprehensive_health_plans")
        .select("*")
        .eq("id", user.id);

      if (plansByIdError) {
        console.error("❌ Plans by ID error:", plansByIdError);
      } else {
        console.log("✅ Plans by ID query successful");
      }
    } else {
      console.log("✅ Comprehensive health plans query successful");
      console.log("Found plans:", healthPlans.length);
    }

    // Test 6: Check table structure
    console.log("\n6️⃣ Checking table structure...");
    const { data: tableInfo, error: tableError } = await supabase
      .from("comprehensive_health_plans")
      .select("*")
      .limit(0);

    if (tableError) {
      console.error("❌ Table structure error:", tableError);
    } else {
      console.log("✅ Table structure accessible");
    }
  } catch (error) {
    console.error("❌ Debug failed:", error);
  }
}

debug406Error();
