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
      console.log("🔧 Saving onboarding data directly to database:", {
        userId,
        dataKeys: Object.keys(data)
      });
      
      // Direct database update - insert or update onboarding profile (legacy table)
      const { data: result, error } = await supabase
        .from('onboarding_profiles')
        .upsert({
          user_id: userId,
          full_name: data.fullName,
          age: parseInt(data.age) || null,
          birth_month: data.birthMonth,
          birth_day: data.birthDay,
          birth_year: data.birthYear,
          gender: data.gender,
          height_feet: data.heightFeet,
          height_inches: data.heightInches,
          height_cm: data.heightCm,
          weight_kg: data.weightKg,
          country: data.country,
          state: data.state,
          district: data.district,
          wake_up_time: data.wakeUpTime,
          sleep_time: data.sleepTime,
          work_start: data.workStart,
          work_end: data.workEnd,
          blood_group: data.bloodGroup,
          critical_conditions: data.criticalConditions,
          diet_type: data.dietType,
          breakfast_time: data.breakfastTime,
          lunch_time: data.lunchTime,
          dinner_time: data.dinnerTime,
          workout_time: data.workoutTime,
          routine_flexibility: data.routineFlexibility,
          workout_type: data.workoutType,
          smoking: data.smoking,
          drinking: data.drinking,
          track_family: data.trackFamily,
          referral_code: data.referralCode,
          medications: data.medications || [],
          chronic_conditions: data.chronicConditions || [],
          surgery_details: data.surgeryDetails || [],
          health_goals: data.healthGoals || [],
          onboarding_completed: true,
          health_assessment_completed: false,
          completion_percentage: 100,
          updated_at: new Date().toISOString()
        }, {
          onConflict: 'user_id'
        });

      if (error) {
        console.error("❌ Database error:", error);
        throw error;
      }
      
      console.log("✅ Onboarding data saved successfully:", result);
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