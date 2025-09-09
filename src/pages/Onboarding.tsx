import { AuthOptions } from "@/components/auth/AuthOptions";
import { supabase } from "@/integrations/supabase/client";
import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { SerialOnboarding } from "../components/onboarding/SerialOnboarding";
import { useAuth } from "../contexts/AuthContext";

interface OnboardingData {
  fullName: string;
  age: string;
  birthMonth: string;
  birthDay: string;
  birthYear: string;
  gender: string;
  unitSystem: "imperial" | "metric";
  heightFeet: string;
  heightInches: string;
  heightCm: string;
  weightLb: string;
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
  usesWearable: string;
  wearableType: string;
  trackFamily: string;
  shareProgress: string;
  emergencyContactName: string;
  emergencyContactPhone: string;
  criticalConditions: string;
  hasHealthReports: string;
  healthReports: string[];
  referralCode: string;
  saveProgress: string;
  preferences?: any;
  dateOfBirth?: string;
}

const Onboarding = () => {
  const navigate = useNavigate();
  const { user, refreshProfile, profile } = useAuth();
  const [onboardingStep, setOnboardingStep] = useState<
    "welcome" | "serial" | "complete"
  >("welcome");
  const [loading, setLoading] = useState(false);
  const [pendingOnboardingData, setPendingOnboardingData] =
    useState<OnboardingData | null>(null);
  const [showAuth, setShowAuth] = useState(false);

  // Helper function to convert descriptive time to proper time format
  const convertTimeToFormat = (timeValue: string | null): string | null => {
    if (!timeValue) return null;

    // If it's already in proper time format (HH:MM), return as is
    if (/^\d{1,2}:\d{2}$/.test(timeValue)) {
      return timeValue;
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
  };

  // Show auth popup if not authenticated
  useEffect(() => {
    if (!user) setShowAuth(true);
    else setShowAuth(false);
  }, [user]);

  // Redirect to /custom-plan if onboarding is already complete
  useEffect(() => {
    if (profile && profile.onboarding_completed) {
      navigate("/custom-plan", { replace: true });
    } else if (profile && !profile.onboarding_completed) {
      // If profile exists but onboarding is not completed, show onboarding
      setOnboardingStep("serial");
    }
  }, [profile, navigate]);

  // Define handleSerialComplete before using it in useEffect
  const handleSerialComplete = useCallback(
    async (data: OnboardingData) => {
      if (!user) {
        console.error("No user found for onboarding completion");
        toast.error("User not found", { description: "Please log in again." });
        return;
      }

      console.log(
        "Starting comprehensive onboarding completion for user:",
        user.id
      );
      console.log("Onboarding data received:", data);
      setLoading(true);

      try {
        // Create or update user profile
        const profileData = {
          id: user.id,
          full_name: data.fullName || null,
          age: data.age || null,
          date_of_birth: data.dateOfBirth || null,
          gender: data.gender || null,
          unit_system: data.unitSystem || "metric",
          height_feet: data.heightFeet || null,
          height_inches: data.heightInches || null,
          height_cm: data.heightCm || null,
          weight_lb: data.weightLb || null,
          weight_kg: data.weightKg || null,
          wake_up_time: convertTimeToFormat(data.wakeUpTime),
          sleep_time: convertTimeToFormat(data.sleepTime),
          work_start: convertTimeToFormat(data.workStart),
          work_end: convertTimeToFormat(data.workEnd),
          chronic_conditions: data.chronicConditions || null,
          takes_medications: data.takesMedications || null,
          medications: data.medications || null,
          has_surgery: data.hasSurgery || null,
          surgery_details: data.surgeryDetails || null,
          health_goals: data.healthGoals || null,
          diet_type: data.dietType || null,
          blood_group: data.bloodGroup || null,
          breakfast_time: convertTimeToFormat(data.breakfastTime),
          lunch_time: convertTimeToFormat(data.lunchTime),
          dinner_time: convertTimeToFormat(data.dinnerTime),
          workout_time: convertTimeToFormat(data.workoutTime),
          routine_flexibility: data.routineFlexibility || null,
          uses_wearable: data.usesWearable || null,
          wearable_type: data.wearableType || null,
          track_family: data.trackFamily || null,
          share_progress: data.shareProgress || null,
          emergency_contact_name: data.emergencyContactName || null,
          emergency_contact_phone: data.emergencyContactPhone || null,
          critical_conditions: data.criticalConditions || null,
          has_health_reports: data.hasHealthReports || null,
          health_reports: data.healthReports || null,
          referral_code: data.referralCode || null,
          save_progress: data.saveProgress || null,
          status: "active",
          preferences: data.preferences || {},
          onboarding_completed: true,
        };

        console.log("Profile data to be saved:", profileData);

        // Save raw onboarding answers into onboarding_profiles (separate table)
        const { error: onboardingError } = await supabase
          .from("onboarding_profiles")
          .upsert(
            {
              user_id: user.id,
              details: data as any,
            },
            { onConflict: "user_id" }
          );

        if (onboardingError) {
          console.error("Error saving onboarding details:", onboardingError);
          throw onboardingError;
        }

        const { error: profileError } = await supabase
          .from("user_profiles")
          .upsert(profileData, { onConflict: "id" });

        if (profileError) {
          console.error("Error saving profile:", profileError);
          throw profileError;
        }

        console.log("Profile saved successfully");

        // Refresh the profile in AuthContext to get updated data
        await refreshProfile();

        // Set onboarding step to complete
        setOnboardingStep("complete");

        toast.success("Onboarding completed successfully!", {
          description: "Your profile has been saved.",
        });

        // Let the redirect logic handle navigation based on updated profile
        // The useEffect with profile dependency will redirect to /custom-plan
      } catch (error) {
        console.error("Error completing onboarding:", error);
        toast.error("Failed to complete onboarding", {
          description:
            error instanceof Error ? error.message : "Please try again.",
        });
      } finally {
        setLoading(false);
      }
    },
    [user, navigate, refreshProfile]
  );

  // Restore onboarding data from localStorage after OAuth
  useEffect(() => {
    if (user && onboardingStep !== "complete") {
      const pending = localStorage.getItem("pendingOnboardingData");
      if (pending) {
        try {
          const onboardingData = JSON.parse(pending);
          setPendingOnboardingData(onboardingData);
          handleSerialComplete(onboardingData);
          localStorage.removeItem("pendingOnboardingData");
        } catch (e) {
          console.warn("Failed to parse onboardingData from localStorage:", e);
        }
      }
    }
  }, [user, onboardingStep, handleSerialComplete]);

  // Fallback: create profile row if missing
  useEffect(() => {
    if (user && !profile) {
      supabase
        .from("user_profiles")
        .insert([
          { id: user.id, full_name: user.email, onboarding_completed: false },
        ])
        .then(async ({ error }) => {
          if (error) {
            console.error(
              "Failed to create user profile in onboarding fallback:",
              error
            );
          } else {
            console.log(
              "Created user profile in onboarding fallback for user:",
              user.id
            );
            // Refresh the profile in AuthContext after creation
            await refreshProfile();
          }
        });
    }
  }, [user, profile, refreshProfile]);

  // Manual trigger for development
  useEffect(() => {
    if (user && pendingOnboardingData) {
      const pending = localStorage.getItem("pendingOnboardingData");
      if (pending) {
        try {
          const onboardingData = JSON.parse(pending);
          console.log(
            "Manual trigger: Restoring onboardingData from localStorage:",
            onboardingData
          );
          handleSerialComplete(onboardingData);
          localStorage.removeItem("pendingOnboardingData");
        } catch (e) {
          console.warn(
            "Manual trigger: Failed to parse onboardingData from localStorage:",
            e
          );
        }
      }
    } else {
      console.log("Manual trigger: No pending data or user not found");
    }
  }, [user, pendingOnboardingData, handleSerialComplete]);

  // Show auth popup if not authenticated
  if (showAuth) {
    return (
      <AuthOptions
        onboardingData={{}}
        onAuthSuccess={() => setShowAuth(false)}
      />
    );
  }

  // Show serial onboarding directly (welcome screen is now separate)
  if (onboardingStep === "welcome" || onboardingStep === "serial") {
    return (
      <>
        <SerialOnboarding
          onComplete={handleSerialComplete}
          onBack={() => navigate("/")}
        />
      </>
    );
  }

  // Show completion
  if (onboardingStep === "complete") {
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-gradient-to-br from-green-50 to-blue-50 px-4 overflow-hidden">
        <div className="text-center max-w-sm sm:max-w-md">
          <div className="w-16 h-16 sm:w-20 sm:h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
            <svg
              className="w-8 h-8 sm:w-10 sm:h-10 text-green-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3 sm:mb-4">
            Profile Setup Complete!
          </h2>
          <p className="text-base sm:text-lg text-gray-600 mb-6 sm:mb-8">
            Your profile has been successfully saved. You can now start using
            UrCare.
          </p>
          <button
            onClick={() => navigate("/custom-plan")}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 sm:py-4 px-6 sm:px-8 rounded-2xl text-base sm:text-lg font-medium transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
          >
            Continue to Custom Plan
          </button>
        </div>
      </div>
    );
  }

  return null;
};

export default Onboarding;
