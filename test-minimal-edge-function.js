// Test minimal Edge Function call to isolate the issue
import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

dotenv.config();

const supabaseUrl =
  process.env.VITE_SUPABASE_URL || "https://lvnkpserdydhnqbigfbz.supabase.co";
const supabaseAnonKey =
  process.env.VITE_SUPABASE_ANON_KEY ||
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx2bmtwc2VyZHlkaG5xYmlnZmJ6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTMzMzY5NjYsImV4cCI6MjA2ODkxMjk2Nn0.Y2NfbA7K9efpFHB6FFmCtgti3udX5wbOoQVkDndtkBc";

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testMinimalEdgeFunction() {
  console.log("🔍 Testing minimal Edge Function call...");

  try {
    // Test with minimal data to isolate the issue
    const { data, error } = await supabase.functions.invoke(
      "generate-comprehensive-health-plan",
      {
        body: {
          user_goal: "Test goal",
          user_profile: {
            id: "test-user",
            full_name: "Test User",
            age: 25,
            gender: "male",
            height_cm: "175",
            weight_kg: "70",
            chronic_conditions: [],
            health_goals: ["test"],
            diet_type: "balanced",
            workout_time: "morning",
            routine_flexibility: "moderate",
          },
          plan_calculation: {
            duration_weeks: 1,
            plan_type: "quick_win",
            timeline_preference: "fast",
            expected_outcomes: ["Test outcome"],
            key_milestones: ["Test milestone"],
          },
        },
      }
    );

    if (error) {
      console.error("❌ Edge Function error:", error);
      console.log("Error details:", JSON.stringify(error, null, 2));

      // Try to get more details from the response
      if (error.context && error.context.body) {
        try {
          const responseText = await error.context.body.text();
          console.log("Response body:", responseText);
        } catch (e) {
          console.log("Could not read response body");
        }
      }
    } else {
      console.log("✅ Edge Function successful!");
      console.log("Response:", JSON.stringify(data, null, 2));
    }
  } catch (error) {
    console.error("❌ Test failed:", error);
  }
}

testMinimalEdgeFunction();
