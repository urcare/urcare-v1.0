#!/usr/bin/env node

/**
 * Database Schema Update Script
 *
 * This script updates the database schema to include the new onboarding fields:
 * - workout_type: Preferred workout type (Yoga, Home Gym, Gym, Swimming, Cardio, HIIT)
 * - smoking: Smoking status (Never smoked, Former smoker, Occasional smoker, Regular smoker)
 * - drinking: Alcohol consumption level (Never drink, Occasionally, Moderately, Regularly, Heavily)
 *
 * It also removes the old fields that are no longer used:
 * - uses_wearable
 * - wearable_type
 * - share_progress
 * - emergency_contact_name
 * - emergency_contact_phone
 */

import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// Load environment variables
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error("❌ Missing required environment variables:");
  console.error("   VITE_SUPABASE_URL:", !!supabaseUrl);
  console.error("   SUPABASE_SERVICE_ROLE_KEY:", !!supabaseServiceKey);
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function runMigration() {
  console.log("🔄 Starting database schema update...");

  try {
    // Read the migration file
    const migrationPath = path.join(
      __dirname,
      "../supabase/migrations/20250102000000_add_new_onboarding_fields.sql"
    );
    const migrationSQL = fs.readFileSync(migrationPath, "utf8");

    console.log("📄 Migration SQL loaded");

    // Execute the migration
    const { error } = await supabase.rpc("exec_sql", { sql: migrationSQL });

    if (error) {
      console.error("❌ Migration failed:", error);
      process.exit(1);
    }

    console.log("✅ Database schema updated successfully!");
    console.log("");
    console.log("📋 Changes made:");
    console.log("   ➕ Added workout_type column");
    console.log("   ➕ Added smoking column");
    console.log("   ➕ Added drinking column");
    console.log("   ➖ Removed uses_wearable column");
    console.log("   ➖ Removed wearable_type column");
    console.log("   ➖ Removed share_progress column");
    console.log("   ➖ Removed emergency_contact_name column");
    console.log("   ➖ Removed emergency_contact_phone column");
    console.log("   📊 Added indexes for new fields");
    console.log("");
    console.log("🎉 Database is ready for the updated onboarding flow!");
  } catch (error) {
    console.error("❌ Error running migration:", error);
    process.exit(1);
  }
}

// Check if we're in the right directory
if (!fs.existsSync(path.join(__dirname, "../supabase"))) {
  console.error("❌ Please run this script from the project root directory");
  process.exit(1);
}

runMigration();
