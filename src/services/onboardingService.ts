import { supabase } from "@/integrations/supabase/client";

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
  workoutType: string;
  smoking: string;
  drinking: string;
  trackFamily: string;
  criticalConditions: string;
  hasHealthReports: string;
  healthReports: string[];
  referralCode: string;
  saveProgress: string;
  // Demographics fields
  country: string;
  state: string;
  district: string;
}

class OnboardingService {
  async saveOnboardingData(userId: string, data: OnboardingData): Promise<void> {
    try {
      console.log("🔧 Calling save_onboarding_data function with:", {
        userId,
        dataKeys: Object.keys(data)
      });
      
      // Use the database function to save onboarding data
      const { data: result, error } = await supabase.rpc('save_onboarding_data', {
        p_user_id: userId,
        p_onboarding_data: data
      });

      if (error) {
        console.error("❌ Database function error:", error);
        throw error;
      }
      
      console.log("✅ Database function result:", result);
    } catch (error) {
      console.error("❌ Service error:", error);
      throw error;
    }
  }

  async getOnboardingData(userId: string): Promise<OnboardingData | null> {
    try {
      // Use the database function to get onboarding data
      const { data, error } = await supabase.rpc('get_onboarding_data', {
        p_user_id: userId
      });

      if (error) {
        return null;
      }

      return data || null;
    } catch (error) {
      return null;
    }
  }

  async saveHealthReport(userId: string, reportName: string, filePath: string, fileSize?: number, mimeType?: string): Promise<string> {
    try {
      const { data, error } = await supabase.rpc('save_health_report', {
        p_user_id: userId,
        p_report_name: reportName,
        p_file_path: filePath,
        p_file_size: fileSize,
        p_mime_type: mimeType
      });

      if (error) {
        throw error;
      }

      return data;
    } catch (error) {
      throw error;
    }
  }
}

export const onboardingService = new OnboardingService();