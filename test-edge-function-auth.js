// Test Edge Function with proper authentication
import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

dotenv.config();

const supabaseUrl =
  process.env.VITE_SUPABASE_URL || "https://lvnkpserdydhnqbigfbz.supabase.co";
const supabaseAnonKey =
  process.env.VITE_SUPABASE_ANON_KEY ||
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx2bmtwc2VyZHlkaG5xYmlnZmJ6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTMzMzY5NjYsImV4cCI6MjA2ODkxMjk2Nn0.Y2NfbA7K9efpFHB6FFmCtgti3udX5wbOoQVkDndtkBc";

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testEdgeFunctionAuth() {
  console.log("🔍 Testing Edge Function with proper authentication...");

  try {
    // First, let's check if we can authenticate
    console.log("\n1️⃣ Testing authentication...");
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError) {
      console.error("❌ Auth error:", authError);
      console.log("This might be why the Edge Function is failing");
    }

    if (!user) {
      console.log("⚠️ No authenticated user - this is expected in development");
      console.log("The Edge Function might require authentication");
    } else {
      console.log("✅ User authenticated:", user.id);
    }

    // Test with a simple Edge Function call first
    console.log("\n2️⃣ Testing simple Edge Function call...");
    const { data: simpleData, error: simpleError } =
      await supabase.functions.invoke("generate-comprehensive-health-plan", {
        body: {
          test: "hello",
        },
      });

    if (simpleError) {
      console.error("❌ Simple Edge Function error:", simpleError);
      console.log("Error details:", JSON.stringify(simpleError, null, 2));

      // Check the response body for more details
      if (simpleError.context && simpleError.context.body) {
        try {
          const responseText = await simpleError.context.body.text();
          console.log("Response body:", responseText);
        } catch (e) {
          console.log("Could not read response body");
        }
      }
    } else {
      console.log("✅ Simple Edge Function call successful!");
      console.log("Response:", simpleData);
    }

    // Test with proper authentication headers
    console.log("\n3️⃣ Testing with explicit auth headers...");
    const { data: authData, error: authError2 } =
      await supabase.functions.invoke("generate-comprehensive-health-plan", {
        body: {
          user_goal: "Test goal",
          user_profile: { id: "test" },
          plan_calculation: { duration_weeks: 1 },
        },
        headers: {
          Authorization: `Bearer ${supabaseAnonKey}`,
        },
      });

    if (authError2) {
      console.error("❌ Auth header Edge Function error:", authError2);
    } else {
      console.log("✅ Auth header Edge Function call successful!");
      console.log("Response:", authData);
    }
  } catch (error) {
    console.error("❌ Test failed:", error);
  }
}

testEdgeFunctionAuth();
