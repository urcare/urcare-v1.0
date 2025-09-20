// Simple script to run database migration
// This will create the comprehensive health plan tables

import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// Load environment variables
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const supabaseUrl =
  process.env.VITE_SUPABASE_URL || "https://lvnkpserdydhnqbigfbz.supabase.co";
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseServiceKey) {
  console.error(
    "❌ SUPABASE_SERVICE_ROLE_KEY not found in environment variables"
  );
  console.log("Please add SUPABASE_SERVICE_ROLE_KEY to your .env file");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function runMigration() {
  try {
    console.log("🚀 Starting database migration...");

    // Read the migration file
    const migrationPath = path.join(
      __dirname,
      "supabase",
      "migrations",
      "20250105000000_create_comprehensive_health_plans.sql"
    );
    const migrationSQL = fs.readFileSync(migrationPath, "utf8");

    console.log("📄 Migration file loaded");

    // Execute the migration
    const { data, error } = await supabase.rpc("exec_sql", {
      sql: migrationSQL,
    });

    if (error) {
      console.error("❌ Migration failed:", error);
      return;
    }

    console.log("✅ Migration completed successfully!");
    console.log("📊 Comprehensive health plan tables created");
  } catch (error) {
    console.error("❌ Error running migration:", error);
  }
}

runMigration();
