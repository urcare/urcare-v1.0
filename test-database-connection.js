// Test database connection and table existence
import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

dotenv.config();

const supabaseUrl =
  process.env.VITE_SUPABASE_URL || "https://lvnkpserdydhnqbigfbz.supabase.co";
const supabaseAnonKey =
  process.env.VITE_SUPABASE_ANON_KEY ||
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx2bmtwc2VyZHlkaG5xYmlnZmJ6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTMzMzY5NjYsImV4cCI6MjA2ODkxMjk2Nn0.Y2NfbA7K9efpFHB6FFmCtgti3udX5wbOoQVkDndtkBc";

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testDatabaseConnection() {
  console.log("🔍 Testing database connection...");

  try {
    // Test basic connection
    const { data: userProfiles, error: userError } = await supabase
      .from("user_profiles")
      .select("count")
      .limit(1);

    if (userError) {
      console.error("❌ User profiles table error:", userError);
    } else {
      console.log("✅ User profiles table accessible");
    }

    // Test comprehensive health plans table
    const { data: healthPlans, error: healthError } = await supabase
      .from("comprehensive_health_plans")
      .select("count")
      .limit(1);

    if (healthError) {
      console.error("❌ Comprehensive health plans table error:", healthError);
      console.log(
        "📋 This table needs to be created - run the SQL script in Supabase dashboard"
      );
    } else {
      console.log("✅ Comprehensive health plans table accessible");
    }

    // Test daily plan execution table
    const { data: dailyPlans, error: dailyError } = await supabase
      .from("daily_plan_execution")
      .select("count")
      .limit(1);

    if (dailyError) {
      console.error("❌ Daily plan execution table error:", dailyError);
    } else {
      console.log("✅ Daily plan execution table accessible");
    }
  } catch (error) {
    console.error("❌ Database connection test failed:", error);
  }
}

testDatabaseConnection();
