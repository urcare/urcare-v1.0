// Test OpenAI API key in Supabase Edge Function
import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

dotenv.config();

const supabaseUrl =
  process.env.VITE_SUPABASE_URL || "https://lvnkpserdydhnqbigfbz.supabase.co";
const supabaseAnonKey =
  process.env.VITE_SUPABASE_ANON_KEY ||
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx2bmtwc2VyZHlkaG5xYmlnZmJ6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTMzMzY5NjYsImV4cCI6MjA2ODkxMjk2Nn0.Y2NfbA7K9efpFHB6FFmCtgti3udX5wbOoQVkDndtkBc";

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testOpenAIAPI() {
  console.log("🔍 Testing OpenAI API key in Supabase Edge Function...");

  try {
    // Test the comprehensive health plan generation
    console.log("\n1️⃣ Testing comprehensive health plan generation...");

    const testUserGoal = "Build muscle and lose weight";
    const testUserProfile = {
      id: "test-user-123",
      full_name: "Test User",
      age: 25,
      gender: "male",
      height_cm: "175",
      weight_kg: "70",
      chronic_conditions: [],
      health_goals: ["muscle_gain", "weight_loss"],
      diet_type: "balanced",
      workout_time: "morning",
      routine_flexibility: "moderate",
    };

    const testPlanCalculation = {
      duration_weeks: 8,
      plan_type: "health_transformation",
      timeline_preference: "moderate",
      expected_outcomes: ["Increased muscle mass", "Weight loss"],
      key_milestones: [
        "Week 2: Establish routine",
        "Week 4: First progress check",
      ],
    };

    const { data, error } = await supabase.functions.invoke(
      "generate-comprehensive-health-plan",
      {
        body: {
          user_goal: testUserGoal,
          user_profile: testUserProfile,
          plan_calculation: testPlanCalculation,
        },
      }
    );

    if (error) {
      console.error("❌ Edge Function error:", error);
      console.log("Error details:", JSON.stringify(error, null, 2));

      // Check if it's an API key issue
      if (
        error.message?.includes("OpenAI") ||
        error.message?.includes("API key")
      ) {
        console.log("\n🔑 API Key Issue Detected!");
        console.log(
          "The OpenAI API key might not be configured in Supabase Edge Functions."
        );
        console.log("To fix this:");
        console.log("1. Go to Supabase Dashboard → Settings → Edge Functions");
        console.log(
          "2. Add environment variable: OPENAI_API_KEY = your-api-key"
        );
        console.log("3. Redeploy the Edge Function");
      }
    } else {
      console.log("✅ Edge Function successful!");
      console.log("Response:", JSON.stringify(data, null, 2));
    }

    // Test direct OpenAI API call (if we have the key locally)
    console.log("\n2️⃣ Testing direct OpenAI API call...");
    const openaiKey = process.env.VITE_OPENAI_API_KEY;

    if (!openaiKey) {
      console.log("⚠️ No local OpenAI API key found in environment variables");
      console.log(
        "This is normal - the key should be in Supabase Edge Functions"
      );
    } else {
      console.log("🔑 Local API key found, testing direct call...");

      try {
        const response = await fetch(
          "https://api.openai.com/v1/chat/completions",
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${openaiKey}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              model: "gpt-4",
              messages: [
                { role: "system", content: "You are a helpful health coach." },
                { role: "user", content: "Create a simple 1-day health plan." },
              ],
              max_tokens: 100,
            }),
          }
        );

        if (response.ok) {
          const data = await response.json();
          console.log("✅ Direct OpenAI API call successful!");
          console.log(
            "Response preview:",
            data.choices[0]?.message?.content?.substring(0, 100) + "..."
          );
        } else {
          console.error(
            "❌ Direct OpenAI API call failed:",
            response.status,
            response.statusText
          );
        }
      } catch (directError) {
        console.error("❌ Direct OpenAI API call error:", directError);
      }
    }
  } catch (error) {
    console.error("❌ Test failed:", error);
  }
}

testOpenAIAPI();
