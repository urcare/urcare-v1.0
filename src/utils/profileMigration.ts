/**
 * Profile Migration Utilities
 * Helps migrate existing user data to the new database structure
 */

import { supabase } from "@/integrations/supabase/client";

export interface LegacyProfile {
  id: string;
  full_name?: string;
  age?: number;
  date_of_birth?: string;
  gender?: string;
  height_cm?: string;
  weight_kg?: string;
  // Add other legacy fields as needed
}

export interface MigrationResult {
  success: boolean;
  migrated: number;
  errors: string[];
}

/**
 * Migrate legacy user profiles to the new structure
 */
export async function migrateUserProfiles(): Promise<MigrationResult> {
  const result: MigrationResult = {
    success: true,
    migrated: 0,
    errors: [],
  };

  try {
    // Get all existing user profiles
    const { data: profiles, error: fetchError } = await supabase
      .from("user_profiles")
      .select("*");

    if (fetchError) {
      result.success = false;
      result.errors.push(`Failed to fetch profiles: ${fetchError.message}`);
      return result;
    }

    if (!profiles || profiles.length === 0) {
      console.log("No profiles to migrate");
      return result;
    }

    console.log(`Found ${profiles.length} profiles to migrate`);

    // Process each profile
    for (const profile of profiles) {
      try {
        // Check if profile needs migration
        const needsMigration =
          !profile.onboarding_completed ||
          !profile.unit_system ||
          !profile.preferences;

        if (!needsMigration) {
          console.log(`Profile ${profile.id} already up to date`);
          continue;
        }

        // Create migration data
        const migrationData = {
          unit_system: profile.unit_system || "metric",
          onboarding_completed: profile.onboarding_completed || false,
          preferences: profile.preferences || {},
          updated_at: new Date().toISOString(),
        };

        // Update the profile
        const { error: updateError } = await supabase
          .from("user_profiles")
          .update(migrationData)
          .eq("id", profile.id);

        if (updateError) {
          result.errors.push(
            `Failed to migrate profile ${profile.id}: ${updateError.message}`
          );
          continue;
        }

        result.migrated++;
        console.log(`Successfully migrated profile ${profile.id}`);
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "Unknown error";
        result.errors.push(
          `Error migrating profile ${profile.id}: ${errorMessage}`
        );
      }
    }

    if (result.errors.length > 0) {
      result.success = false;
    }

    console.log(
      `Migration completed: ${result.migrated} profiles migrated, ${result.errors.length} errors`
    );
    return result;
  } catch (error) {
    result.success = false;
    result.errors.push(
      `Migration failed: ${
        error instanceof Error ? error.message : "Unknown error"
      }`
    );
    return result;
  }
}

/**
 * Validate user profile data
 */
export function validateProfileData(profile: any): {
  isValid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  // Required fields
  if (!profile.id) errors.push("User ID is required");
  if (!profile.full_name) errors.push("Full name is required");
  if (!profile.age || profile.age < 1) errors.push("Valid age is required");
  if (!profile.gender) errors.push("Gender is required");

  // Optional but recommended fields
  if (!profile.unit_system) {
    console.warn("Unit system not set, defaulting to metric");
  }

  if (!profile.onboarding_completed) {
    console.warn("Onboarding not marked as completed");
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * Clean up legacy data
 */
export async function cleanupLegacyData(): Promise<{
  success: boolean;
  errors: string[];
}> {
  const errors: string[] = [];

  try {
    // Remove any orphaned onboarding profiles
    const { error: deleteError } = await supabase
      .from("onboarding_profiles")
      .delete()
      .is("user_id", null);

    if (deleteError) {
      errors.push(
        `Failed to clean up orphaned onboarding profiles: ${deleteError.message}`
      );
    }

    // Update any profiles with missing required fields
    const { error: updateError } = await supabase
      .from("user_profiles")
      .update({
        unit_system: "metric",
        onboarding_completed: false,
        preferences: {},
        updated_at: new Date().toISOString(),
      })
      .is("unit_system", null);

    if (updateError) {
      errors.push(
        `Failed to update profiles with missing fields: ${updateError.message}`
      );
    }

    return {
      success: errors.length === 0,
      errors,
    };
  } catch (error) {
    errors.push(
      `Cleanup failed: ${
        error instanceof Error ? error.message : "Unknown error"
      }`
    );
    return { success: false, errors };
  }
}

/**
 * Get migration statistics
 */
export async function getMigrationStats(): Promise<{
  totalProfiles: number;
  completedOnboarding: number;
  incompleteProfiles: number;
  needsMigration: number;
}> {
  try {
    const { data: profiles, error } = await supabase
      .from("user_profiles")
      .select("id, onboarding_completed, unit_system, preferences");

    if (error) {
      throw error;
    }

    const totalProfiles = profiles?.length || 0;
    const completedOnboarding =
      profiles?.filter((p) => p.onboarding_completed).length || 0;
    const incompleteProfiles = totalProfiles - completedOnboarding;
    const needsMigration =
      profiles?.filter(
        (p) => !p.unit_system || !p.preferences || !p.onboarding_completed
      ).length || 0;

    return {
      totalProfiles,
      completedOnboarding,
      incompleteProfiles,
      needsMigration,
    };
  } catch (error) {
    console.error("Error getting migration stats:", error);
    return {
      totalProfiles: 0,
      completedOnboarding: 0,
      incompleteProfiles: 0,
      needsMigration: 0,
    };
  }
}
