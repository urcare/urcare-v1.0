// Test RLS policies and specific queries
import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

dotenv.config();

const supabaseUrl =
  process.env.VITE_SUPABASE_URL || "https://lvnkpserdydhnqbigfbz.supabase.co";
const supabaseAnonKey =
  process.env.VITE_SUPABASE_ANON_KEY ||
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx2bmtwc2VyZHlkaG5xYmlnZmJ6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTMzMzY5NjYsImV4cCI6MjA2ODkxMjk2Nn0.Y2NfbA7K9efpFHB6FFmCtgti3udX5wbOoQVkDndtkBc";

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testRLSPolicies() {
  console.log("🔍 Testing RLS policies...");

  try {
    // Test the exact query that's failing
    const testUserId = "9d1051c9-0241-4370-99a3-034bd2d5d001";

    console.log("Testing comprehensive_health_plans query...");
    const { data: healthPlans, error: healthError } = await supabase
      .from("comprehensive_health_plans")
      .select("*")
      .eq("user_id", testUserId)
      .eq("status", "active");

    if (healthError) {
      console.error("❌ Comprehensive health plans query error:", healthError);
      console.log("Error details:", JSON.stringify(healthError, null, 2));
    } else {
      console.log("✅ Comprehensive health plans query successful");
      console.log("Results:", healthPlans);
    }

    // Test without RLS (using service role)
    console.log("\n🔍 Testing with service role...");
    const supabaseService = createClient(
      supabaseUrl,
      process.env.SUPABASE_SERVICE_ROLE_KEY || "your-service-role-key"
    );

    const { data: serviceData, error: serviceError } = await supabaseService
      .from("comprehensive_health_plans")
      .select("*")
      .eq("user_id", testUserId)
      .eq("status", "active");

    if (serviceError) {
      console.error("❌ Service role query error:", serviceError);
    } else {
      console.log("✅ Service role query successful");
      console.log("Results:", serviceData);
    }
  } catch (error) {
    console.error("❌ RLS test failed:", error);
  }
}

testRLSPolicies();
