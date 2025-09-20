// Test database operations directly
import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

dotenv.config();

const supabaseUrl =
  process.env.VITE_SUPABASE_URL || "https://lvnkpserdydhnqbigfbz.supabase.co";
const supabaseAnonKey =
  process.env.VITE_SUPABASE_ANON_KEY ||
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx2bmtwc2VyZHlkaG5xYmlnZmJ6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTMzMzY5NjYsImV4cCI6MjA2ODkxMjk2Nn0.Y2NfbA7K9efpFHB6FFmCtgti3udX5wbOoQVkDndtkBc";

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testDatabaseDirect() {
  console.log("🔍 Testing database operations directly...");

  try {
    // Test 1: Check if comprehensive_health_plans table exists
    console.log("\n1️⃣ Testing comprehensive_health_plans table...");
    const { data: tableTest, error: tableError } = await supabase
      .from("comprehensive_health_plans")
      .select("count")
      .limit(1);

    if (tableError) {
      console.error("❌ Table error:", tableError);
      console.log(
        "The comprehensive_health_plans table might not exist or have RLS issues"
      );
    } else {
      console.log("✅ Table accessible");
    }

    // Test 2: Try to insert a test record
    console.log("\n2️⃣ Testing insert operation...");
    const testRecord = {
      user_id: "test-user-123",
      plan_name: "Test Plan",
      plan_type: "quick_win",
      primary_goal: "Test goal",
      secondary_goals: ["test"],
      start_date: new Date().toISOString().split("T")[0],
      target_end_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
        .toISOString()
        .split("T")[0],
      duration_weeks: 1,
      plan_data: { test: "data" },
      weekly_milestones: [],
      monthly_assessments: [],
      status: "active",
    };

    const { data: insertData, error: insertError } = await supabase
      .from("comprehensive_health_plans")
      .insert(testRecord)
      .select()
      .single();

    if (insertError) {
      console.error("❌ Insert error:", insertError);
      console.log(
        "Insert error details:",
        JSON.stringify(insertError, null, 2)
      );
    } else {
      console.log("✅ Insert successful!");
      console.log("Inserted record:", insertData);

      // Clean up - delete the test record
      const { error: deleteError } = await supabase
        .from("comprehensive_health_plans")
        .delete()
        .eq("id", insertData.id);

      if (deleteError) {
        console.error("❌ Delete error:", deleteError);
      } else {
        console.log("✅ Test record cleaned up");
      }
    }

    // Test 3: Check OpenAI API key availability
    console.log("\n3️⃣ Testing OpenAI API key...");
    const openaiKey = process.env.OPENAI_API_KEY;
    if (!openaiKey) {
      console.log("⚠️ No OpenAI API key found in local environment");
      console.log(
        "This is expected - the key should be in Supabase Edge Functions"
      );
    } else {
      console.log("✅ OpenAI API key found locally");

      // Test direct OpenAI call
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
                { role: "system", content: "You are a helpful assistant." },
                { role: "user", content: "Say hello." },
              ],
              max_tokens: 10,
            }),
          }
        );

        if (response.ok) {
          const data = await response.json();
          console.log("✅ OpenAI API call successful!");
          console.log("Response:", data.choices[0]?.message?.content);
        } else {
          console.error(
            "❌ OpenAI API call failed:",
            response.status,
            response.statusText
          );
        }
      } catch (openaiError) {
        console.error("❌ OpenAI API error:", openaiError);
      }
    }
  } catch (error) {
    console.error("❌ Test failed:", error);
  }
}

testDatabaseDirect();
