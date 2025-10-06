import { supabase } from "@/integrations/supabase/client";
import type { User } from "@supabase/supabase-js";

export interface OnboardingData {
  fullName: string;
  age: string;
  birthMonth: string;
  birthDay: string;
  birthYear: string;
  gender: string;
  heightFeet: string;
  heightInches: string;
  heightCm: string;
  weightKg: string;
  wakeUpTime: string;
  sleepTime: string;
  workStart: string;
  workEnd: string;
  chronicConditions: string[];
  takesMedications: string;
  medications: string[];
  hasSurgery: string;
  surgeryDetails: string[];
  healthGoals: string[];
  dietType: string;
  bloodGroup: string;
  breakfastTime: string;
  lunchTime: string;
  dinnerTime: string;
  workoutTime: string;
  routineFlexibility: string;
  trackFamily: string;
  criticalConditions: string;
  hasHealthReports: string;
  healthReports: string[];
  referralCode: string;
  saveProgress: string;
  preferences?: any;
  dateOfBirth?: string;
  allergies?: string[];
  workoutType?: string;
  smoking?: string;
  drinking?: string;
  // Demographics fields
  country?: string;
  state?: string;
  district?: string;
}

class OnboardingService {
  /**
   * Convert time values to proper format
   */
  private convertTimeToFormat(timeValue: string | null): string | null {
    if (!timeValue) return null;

    // If already in proper time format (HH:MM), return as is
    if (/^\d{1,2}:\d{2}$/.test(timeValue)) {
      return timeValue;
    }

    // Convert 12-hour AM/PM format to 24-hour format
    if (/^\d{1,2}:\d{2}\s*(AM|PM)$/i.test(timeValue)) {
      const [time, period] = timeValue.split(/\s*(AM|PM)$/i);
      const [hours, minutes] = time.split(":");
      let hour24 = parseInt(hours, 10);

      if (period.toUpperCase() === "AM") {
        if (hour24 === 12) hour24 = 0;
      } else {
        if (hour24 !== 12) hour24 += 12;
      }

      return `${hour24.toString().padStart(2, "0")}:${minutes}`;
    }

    // Convert descriptive time to proper format
    const timeMap: { [key: string]: string } = {
      "Early Morning (05:00-07:00)": "06:00",
      "Morning (06:00-10:00)": "08:00",
      "Late Morning (10:00-12:00)": "11:00",
      "Afternoon (12:00-15:00)": "13:30",
      "Late Afternoon (15:00-17:00)": "16:00",
      "Evening (17:00-20:00)": "18:30",
      "Night (20:00-22:00)": "21:00",
      "Late Night (22:00-24:00)": "23:00",
    };

    return timeMap[timeValue] || null;
  }

  /**
   * Calculate date of birth from components
   */
  private calculateDateOfBirth(month: string, day: string, year: string): string | null {
    if (!month || !day || !year) return null;
    
    const months = [
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
    ];
    
    const monthIndex = months.indexOf(month);
    if (monthIndex === -1) return null;
    
    return `${year}-${String(monthIndex + 1).padStart(2, "0")}-${String(parseInt(day)).padStart(2, "0")}`;
  }

  /**
   * Normalize values to match database constraints
   */
  private normalizeValue(value: string | null | undefined, map: Record<string, string>): string | null {
    if (!value || value.trim() === "") return null;
    
    const normalized = value.toLowerCase().trim();
    return map[normalized] || null;
  }

  /**
   * Save onboarding data to database
   */
  async saveOnboardingData(user: User, data: OnboardingData): Promise<{ success: boolean; error?: string }> {
    try {
      console.log("Saving onboarding data for user:", user.id);
      console.log("Onboarding data received:", data);
      
      // Calculate date of birth
      const dateOfBirth = this.calculateDateOfBirth(data.birthMonth, data.birthDay, data.birthYear);
      
      // Prepare profile data for user_profiles table
      const profileData = {
        id: user.id,
        full_name: data.fullName || null,
        age: data.age ? parseInt(data.age) : null,
        date_of_birth: dateOfBirth,
        gender: data.gender || null,
        height_feet: data.heightFeet || null,
        height_inches: data.heightInches || null,
        height_cm: data.heightCm || null,
        weight_kg: data.weightKg || null,
        wake_up_time: this.convertTimeToFormat(data.wakeUpTime),
        sleep_time: this.convertTimeToFormat(data.sleepTime),
        work_start: this.convertTimeToFormat(data.workStart),
        work_end: this.convertTimeToFormat(data.workEnd),
        chronic_conditions: data.chronicConditions || null,
        takes_medications: data.takesMedications || null,
        medications: data.medications || null,
        has_surgery: data.hasSurgery || null,
        surgery_details: data.surgeryDetails || null,
        health_goals: data.healthGoals || null,
        diet_type: data.dietType || null,
        blood_group: data.bloodGroup || null,
        breakfast_time: this.convertTimeToFormat(data.breakfastTime),
        lunch_time: this.convertTimeToFormat(data.lunchTime),
        dinner_time: this.convertTimeToFormat(data.dinnerTime),
        workout_time: this.convertTimeToFormat(data.workoutTime),
        routine_flexibility: data.routineFlexibility || null,
        workout_type: data.workoutType || null,
        track_family: data.trackFamily || null,
        critical_conditions: data.criticalConditions || null,
        has_health_reports: data.hasHealthReports || null,
        health_reports: data.healthReports || null,
        referral_code: data.referralCode || null,
        save_progress: data.saveProgress || null,
        status: "active",
        preferences: data.preferences || {},
        onboarding_completed: true,
        // Additional health fields (only include fields that exist in the database)
        allergies: data.allergies || null,
        // Set constraint-prone fields to proper values to avoid violations
        smoking: data.smoking || null,
        drinking: data.drinking || null,
        // Demographics fields
        country: data.country || null,
        state: data.state || null,
        district: data.district || null,
      };

      // Save to user_profiles table
      console.log("Saving profile data:", profileData);
      const { error: profileError } = await supabase
        .from("user_profiles")
        .upsert(profileData, { onConflict: "id" });

      if (profileError) {
        console.error("Error saving profile:", profileError);
        return { success: false, error: profileError.message };
      }
      console.log("Profile saved successfully");

      // Save raw onboarding data to onboarding_profiles table
      const onboardingData = {
        user_id: user.id,
        details: data as any,
        onboarding_version: "1.0",
        completed_steps: ["all"],
        completion_percentage: 100,
        // Demographics fields for structured storage
        country: data.country || null,
        state: data.state || null,
        district: data.district || null,
      };
      console.log("Saving onboarding details:", onboardingData);
      
      const { error: onboardingError } = await supabase
        .from("onboarding_profiles")
        .upsert(onboardingData, { onConflict: "user_id" });

      if (onboardingError) {
        console.error("Error saving onboarding details:", onboardingError);
        // Don't fail the entire process if onboarding_profiles save fails
        console.warn("Onboarding details save failed, but profile was saved successfully");
      } else {
        console.log("Onboarding details saved successfully");
      }

      console.log("Onboarding data saved successfully");
      return { success: true };

    } catch (error) {
      console.error("Error in saveOnboardingData:", error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : "Unknown error occurred" 
      };
    }
  }

  /**
   * Check if user has completed onboarding
   */
  async hasCompletedOnboarding(userId: string): Promise<boolean> {
    try {
      const { data, error } = await supabase
        .from("user_profiles")
        .select("onboarding_completed")
        .eq("id", userId)
        .single();

      if (error) {
        console.warn("Error checking onboarding status:", error);
        return false;
      }

      return data?.onboarding_completed || false;
    } catch (error) {
      console.error("Error in hasCompletedOnboarding:", error);
      return false;
    }
  }

  /**
   * Get onboarding data for a user
   */
  async getOnboardingData(userId: string): Promise<OnboardingData | null> {
    try {
      const { data, error } = await supabase
        .from("onboarding_profiles")
        .select("details")
        .eq("user_id", userId)
        .single();

      if (error) {
        console.warn("Error fetching onboarding data:", error);
        return null;
      }

      return data?.details || null;
    } catch (error) {
      console.error("Error in getOnboardingData:", error);
      return null;
    }
  }
}

export const onboardingService = new OnboardingService();
