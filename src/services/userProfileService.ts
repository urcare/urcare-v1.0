/**
 * User Profile Service
 * Handles all user profile and onboarding data operations
 * Updated to match the latest database structure
 */

import { UserProfile } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";

// ============================================================================
// INTERFACES & TYPES
// ============================================================================

export interface OnboardingData {
  // Basic Information
  fullName: string;
  age: number;
  dateOfBirth: string;
  gender: string;

  // Physical Metrics
  unitSystem: "metric" | "imperial";
  heightFeet?: string;
  heightInches?: string;
  heightCm?: string;
  weightLb?: string;
  weightKg?: string;

  // Schedule & Lifestyle
  wakeUpTime: string;
  sleepTime: string;
  workStart: string;
  workEnd: string;
  breakfastTime: string;
  lunchTime: string;
  dinnerTime: string;
  workoutTime: string;

  // Health Information
  chronicConditions: string[];
  takesMedications: string;
  medications: string[];
  hasSurgery: string;
  surgeryDetails: string[];
  healthGoals: string[];
  dietType: string;
  bloodGroup: string;

  // Lifestyle Factors
  routineFlexibility: string;
  workoutType: string;
  smoking: string;
  drinking: string;
  usesWearable: string;
  wearableType: string;
  trackFamily: string;
  shareProgress: string;

  // Safety & Medical
  emergencyContactName: string;
  emergencyContactPhone: string;
  criticalConditions: string;
  hasHealthReports: string;
  healthReports: string[];
  referralCode: string;
  saveProgress: string;

  // Additional Data
  preferences: Record<string, any>;
}

export interface ProfileUpdateData {
  full_name?: string;
  age?: number;
  date_of_birth?: string;
  gender?: string;
  unit_system?: string;
  height_feet?: string;
  height_inches?: string;
  height_cm?: string;
  weight_lb?: string;
  weight_kg?: string;
  wake_up_time?: string;
  sleep_time?: string;
  work_start?: string;
  work_end?: string;
  chronic_conditions?: string[];
  takes_medications?: string;
  medications?: string[];
  has_surgery?: string;
  surgery_details?: string[];
  health_goals?: string[];
  diet_type?: string;
  blood_group?: string;
  breakfast_time?: string;
  lunch_time?: string;
  dinner_time?: string;
  workout_time?: string;
  routine_flexibility?: string;
  workout_type?: string;
  smoking?: string;
  drinking?: string;
  track_family?: string;
  critical_conditions?: string;
  has_health_reports?: string;
  health_reports?: string[];
  referral_code?: string;
  save_progress?: string;
  preferences?: Record<string, any>;
  onboarding_completed?: boolean;
}

// ============================================================================
// USER PROFILE SERVICE
// ============================================================================

export class UserProfileService {
  /**
   * Create or update user profile from onboarding data
   */
  async saveOnboardingData(
    userId: string,
    data: OnboardingData
  ): Promise<{ success: boolean; error?: string }> {
    try {
      const profileData: ProfileUpdateData = {
        full_name: data.fullName,
        age: data.age,
        date_of_birth: data.dateOfBirth,
        gender: data.gender,
        unit_system: data.unitSystem,
        height_feet: data.heightFeet,
        height_inches: data.heightInches,
        height_cm: data.heightCm,
        weight_lb: data.weightLb,
        weight_kg: data.weightKg,
        wake_up_time: data.wakeUpTime,
        sleep_time: data.sleepTime,
        work_start: data.workStart,
        work_end: data.workEnd,
        chronic_conditions: data.chronicConditions,
        takes_medications: data.takesMedications,
        medications: data.medications,
        has_surgery: data.hasSurgery,
        surgery_details: data.surgeryDetails,
        health_goals: data.healthGoals,
        diet_type: data.dietType,
        blood_group: data.bloodGroup,
        breakfast_time: data.breakfastTime,
        lunch_time: data.lunchTime,
        dinner_time: data.dinnerTime,
        workout_time: data.workoutTime,
        routine_flexibility: data.routineFlexibility,
        workout_type: data.workoutType,
        smoking: data.smoking,
        drinking: data.drinking,
        track_family: data.trackFamily,
        critical_conditions: data.criticalConditions,
        has_health_reports: data.hasHealthReports,
        health_reports: data.healthReports,
        referral_code: data.referralCode,
        save_progress: data.saveProgress,
        preferences: data.preferences,
        onboarding_completed: true,
      };

      // Save to profiles table
      const { error: profileError } = await supabase
        .from("profiles")
        .upsert(
          {
            id: userId,
            email: '',
            ...profileData,
            updated_at: new Date().toISOString(),
          },
          {
            onConflict: "id",
          }
        );

      if (profileError) {
        console.error("Error saving user profile:", profileError);
        return { success: false, error: profileError.message };
      }

      // Save raw onboarding data to unified_user_profiles table (onboarding data is now part of the unified profile)
      // The onboarding data is already included in the profileData above

      return { success: true };
    } catch (error) {
      console.error("Error in saveOnboardingData:", error);
      return {
        success: false,
        error:
          error instanceof Error ? error.message : "Unknown error occurred",
      };
    }
  }

  /**
   * Get user profile by user ID
   */
  async getUserProfile(userId: string): Promise<UserProfile | null> {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .single();

      if (error) {
        if (error.code === "PGRST116") {
          // No profile found
          return null;
        }
        throw error;
      }

      return data as UserProfile;
    } catch (error) {
      console.error("Error fetching user profile:", error);
      return null;
    }
  }

  /**
   * Update user profile
   */
  async updateUserProfile(
    userId: string,
    updates: ProfileUpdateData
  ): Promise<{ success: boolean; error?: string }> {
    try {
      const { error } = await supabase
        .from("profiles")
        .update({
          ...updates,
          updated_at: new Date().toISOString(),
        })
        .eq("id", userId);

      if (error) {
        console.error("Error updating user profile:", error);
        return { success: false, error: error.message };
      }

      return { success: true };
    } catch (error) {
      console.error("Error in updateUserProfile:", error);
      return {
        success: false,
        error:
          error instanceof Error ? error.message : "Unknown error occurred",
      };
    }
  }

  /**
   * Get onboarding data for a user
   */
  async getOnboardingData(userId: string): Promise<any | null> {
    try {
      const { data, error } = await supabase
        .from("onboarding_profiles")
        .select("details")
        .eq("user_id", userId)
        .single();

      if (error) {
        if (error.code === "PGRST116") {
          return null;
        }
        throw error;
      }

      return data?.details || null;
    } catch (error) {
      console.error("Error fetching onboarding data:", error);
      return null;
    }
  }

  /**
   * Check if user has completed onboarding
   */
  async hasCompletedOnboarding(userId: string): Promise<boolean> {
    try {
      const { data, error } = await supabase
        .from("onboarding_profiles")
        .select("onboarding_completed")
        .eq("user_id", userId)
        .single();

      if (error) {
        if (error.code === "PGRST116") {
          return false;
        }
        throw error;
      }

      return data?.onboarding_completed || false;
    } catch (error) {
      console.error("Error checking onboarding status:", error);
      return false;
    }
  }

  /**
   * Mark onboarding as completed
   */
  async completeOnboarding(
    userId: string
  ): Promise<{ success: boolean; error?: string }> {
    try {
      const { error } = await supabase
        .from("onboarding_profiles")
        .update({
          onboarding_completed: true,
          updated_at: new Date().toISOString(),
        })
        .eq("user_id", userId);

      if (error) {
        console.error("Error completing onboarding:", error);
        return { success: false, error: error.message };
      }

      return { success: true };
    } catch (error) {
      console.error("Error in completeOnboarding:", error);
      return {
        success: false,
        error:
          error instanceof Error ? error.message : "Unknown error occurred",
      };
    }
  }

  /**
   * Delete user profile
   */
  async deleteUserProfile(
    userId: string
  ): Promise<{ success: boolean; error?: string }> {
    try {
      const { error } = await supabase
        .from("profiles")
        .delete()
        .eq("id", userId);

      if (error) {
        console.error("Error deleting user profile:", error);
        return { success: false, error: error.message };
      }

      return { success: true };
    } catch (error) {
      console.error("Error in deleteUserProfile:", error);
      return {
        success: false,
        error:
          error instanceof Error ? error.message : "Unknown error occurred",
      };
    }
  }

  /**
   * Get user profile with health metrics
   */
  async getUserProfileWithMetrics(userId: string): Promise<{
    profile: UserProfile | null;
    healthMetrics: any[];
    error?: string;
  }> {
    try {
      // Get profile
      const profile = await this.getUserProfile(userId);

      if (!profile) {
        return { profile: null, healthMetrics: [] };
      }

      // Get recent health metrics
      const { data: healthMetrics, error: metricsError } = await supabase
        .from("health_metrics")
        .select("*")
        .eq("user_id", userId)
        .order("date", { ascending: false })
        .limit(30);

      if (metricsError) {
        console.warn("Error fetching health metrics:", metricsError);
      }

      return {
        profile,
        healthMetrics: healthMetrics || [],
        error: metricsError?.message,
      };
    } catch (error) {
      console.error("Error in getUserProfileWithMetrics:", error);
      return {
        profile: null,
        healthMetrics: [],
        error:
          error instanceof Error ? error.message : "Unknown error occurred",
      };
    }
  }

  /**
   * Update user preferences
   */
  async updateUserPreferences(
    userId: string,
    preferences: Record<string, any>
  ): Promise<{ success: boolean; error?: string }> {
    try {
      const { error } = await supabase
        .from("profiles")
        .update({
          preferences,
          updated_at: new Date().toISOString(),
        })
        .eq("id", userId);

      if (error) {
        console.error("Error updating user preferences:", error);
        return { success: false, error: error.message };
      }

      return { success: true };
    } catch (error) {
      console.error("Error in updateUserPreferences:", error);
      return {
        success: false,
        error:
          error instanceof Error ? error.message : "Unknown error occurred",
      };
    }
  }

  /**
   * Get user profile statistics
   */
  async getUserProfileStats(userId: string): Promise<{
    profileCompleteness: number;
    healthScore: number;
    daysActive: number;
    error?: string;
  }> {
    try {
      const profile = await this.getUserProfile(userId);

      if (!profile) {
        return { profileCompleteness: 0, healthScore: 0, daysActive: 0 };
      }

      // Calculate profile completeness
      const requiredFields = [
        "full_name",
        "age",
        "gender",
        "height_cm",
        "weight_kg",
        "wake_up_time",
        "sleep_time",
        "health_goals",
      ];

      const completedFields = requiredFields.filter(
        (field) =>
          profile[field as keyof UserProfile] !== null &&
          profile[field as keyof UserProfile] !== undefined &&
          profile[field as keyof UserProfile] !== ""
      ).length;

      const profileCompleteness = Math.round(
        (completedFields / requiredFields.length) * 100
      );

      // Get health score
      const { data: healthScore } = await supabase
        .from("health_scores")
        .select("score")
        .eq("user_id", userId)
        .single();

      // Get days active
      const { data: activities } = await supabase
        .from("daily_activities")
        .select("activity_date")
        .eq("user_id", userId)
        .not("activity_date", "is", null);

      const daysActive = activities
        ? new Set(activities.map((a) => a.activity_date)).size
        : 0;

      return {
        profileCompleteness,
        healthScore: healthScore?.score || 0,
        daysActive,
      };
    } catch (error) {
      console.error("Error in getUserProfileStats:", error);
      return {
        profileCompleteness: 0,
        healthScore: 0,
        daysActive: 0,
        error:
          error instanceof Error ? error.message : "Unknown error occurred",
      };
    }
  }
}

// ============================================================================
// EXPORT SINGLETON INSTANCE
// ============================================================================

export const userProfileService = new UserProfileService();
