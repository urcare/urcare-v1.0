// Test script for health plan generation
// This can be used to test the health plan generation locally

import { createClient } from "@supabase/supabase-js";

const supabaseUrl =
  process.env.VITE_SUPABASE_URL || "https://lvnkpserdydhnqbigfbz.supabase.co";
const supabaseKey =
  process.env.VITE_SUPABASE_ANON_KEY ||
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx2bmtwc2VyZHlkaG5xYmlnZmJ6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTMzMzY5NjYsImV4cCI6MjA2ODkxMjk2Nn0.Y2NfbA7K9efpFHB6FFmCtgti3udX5wbOoQVkDndtkBc";

const supabase = createClient(supabaseUrl, supabaseKey);

async function testHealthPlanGeneration() {
  try {
    console.log("Testing health plan generation...");

    // Test the Supabase function
    const { data, error } = await supabase.functions.invoke(
      "generate-health-plan",
      {
        method: "POST",
        body: {},
      }
    );

    if (error) {
      console.error("Error:", error);
      return;
    }

    console.log("Success:", data);
  } catch (error) {
    console.error("Test failed:", error);
  }
}

// Run the test
testHealthPlanGeneration();
