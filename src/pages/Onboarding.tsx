import { AuthOptions } from "@/components/auth/AuthOptions";
import { supabase } from "@/integrations/supabase/client";
import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { SerialOnboarding } from "../components/onboarding/SerialOnboarding";
import { useAuth } from "../contexts/AuthContext";
import {
  User,
  Heart,
  Droplets,
  Coffee,
  Brain,
  Shield,
  Users,
  Zap,
  Clock,
  Activity,
  Apple,
  Pill,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Moon,
  Sun,
  Briefcase,
} from "lucide-react";

// Helper function for months (same as in SerialOnboarding)
const getMonths = () => [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

interface OnboardingData {
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

  // ✅ NEW FIELDS: All additional health data
  allergies?: string[];
  family_history?: string[];
  lifestyle?: string;
  stress_levels?: string;
  mental_health?: string;
  hydration_habits?: string;
  smoking_status?: string;
  alcohol_consumption?: string;
  occupation?: string;
  workoutType?: string;
  smoking?: string;
  drinking?: string;
}

const Onboarding = () => {
  const navigate = useNavigate();
  const { user, refreshProfile, profile } = useAuth();
  const [onboardingStep, setOnboardingStep] = useState<
    "welcome" | "serial" | "complete"
  >("welcome");
  const [loading, setLoading] = useState(false);
  const [profileCreated, setProfileCreated] = useState(false);
  const [pendingOnboardingData, setPendingOnboardingData] =
    useState<OnboardingData | null>(null);
  const [showAuth, setShowAuth] = useState(false);
  const [isCompleting, setIsCompleting] = useState(false);

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

  // Normalize lifestyle fields to match DB constraints
  const normalizeLifestyleValue = (value: string | null | undefined): string | null => {
    if (!value || value.trim() === "" || value.toLowerCase().includes("prefer")) {
      return null;
    }
    return value.toLowerCase().trim();
  };

  // Show auth popup if not authenticated
  useEffect(() => {
    if (!user) setShowAuth(true);
    else setShowAuth(false);
  }, [user]);

  // Redirect based on subscription status if onboarding is already complete
  useEffect(() => {
    if (profile && profile.onboarding_completed) {
      // Check subscription status and redirect accordingly
      const checkSubscriptionAndRedirect = async () => {
        try {
          const { subscriptionService } = await import(
            "../services/subscriptionService"
          );
          const { isTrialBypassEnabled } = await import(
            "../config/subscription"
          );

          // Check if trial bypass is enabled (for development/testing)
          if (isTrialBypassEnabled()) {
            console.log(
              "Onboarding: Trial bypass enabled, redirecting to dashboard"
            );
            navigate("/dashboard", { replace: true });
            return;
          }

          // Check if user has completed health assessment
          const { data: healthPlan } = await supabase
            .from("health_plans")
            .select("id")
            .eq("user_id", profile.id)
            .limit(1)
            .maybeSingle();

          if (!healthPlan) {
            console.log(
              "Onboarding: User hasn't completed health assessment, redirecting to health-assessment"
            );
            navigate("/health-assessment", { replace: true });
            return;
          }

          // Check actual subscription status
          const subscriptionStatus =
            await subscriptionService.getSubscriptionStatus(profile.id);
          const hasAccess =
            subscriptionStatus.isActive || subscriptionStatus.isTrial;

          if (hasAccess) {
            console.log(
              "Onboarding: User has active subscription or trial, redirecting to dashboard"
            );
            navigate("/dashboard", { replace: true });
          } else {
            console.log(
              "Onboarding: User no subscription, redirecting to paywall"
            );
            navigate("/paywall", { replace: true });
          }
        } catch (subscriptionError) {
          console.error(
            "Onboarding: Error checking subscription status:",
            subscriptionError
          );
          // Fallback: redirect to paywall
          console.log(
            "Onboarding: Subscription check failed, redirecting to paywall"
          );
          navigate("/paywall", { replace: true });
        }
      };

      checkSubscriptionAndRedirect();
    } else if (
      profile &&
      !profile.onboarding_completed &&
      onboardingStep === "welcome"
    ) {
      // If profile exists but onboarding is not completed, show onboarding
      setOnboardingStep("serial");
    }
  }, [profile, navigate, onboardingStep]);

  // Define handleSerialComplete before using it in useEffect
  const handleSerialComplete = useCallback(
    async (data: OnboardingData) => {
      console.log(
        "Onboarding.tsx: handleSerialComplete called with data:",
        data
      );

      // Guard against multiple calls
      if (isCompleting) {
        console.log("Onboarding already in progress, skipping duplicate call");
        return;
      }

      if (!user) {
        console.error("No user found for onboarding completion");
        toast.error("User not found", { description: "Please log in again." });
        return;
      }

      // Guard against empty data - don't complete onboarding with no data
      if (!data || Object.keys(data).length === 0) {
        console.log("Skipping onboarding completion - no data provided");
        return;
      }

      setIsCompleting(true);

      console.log(
        "Starting comprehensive onboarding completion for user:",
        user.id
      );
      console.log("Onboarding data received:", data);
      setLoading(true);

      try {
        // Calculate date of birth from birth month, day, and year
        const calculateDateOfBirth = (
          month: string,
          day: string,
          year: string
        ) => {
          if (!month || !day || !year) return null;
          const monthIndex = getMonths().indexOf(month);
          if (monthIndex === -1) return null;
          return `${year}-${String(monthIndex + 1).padStart(2, "0")}-${String(
            parseInt(day)
          ).padStart(2, "0")}`;
        };

        const dateOfBirth = calculateDateOfBirth(
          data.birthMonth,
          data.birthDay,
          data.birthYear
        );
        console.log(
          "Calculated date of birth:",
          dateOfBirth,
          "from:",
          data.birthMonth,
          data.birthDay,
          data.birthYear
        );

        // Create or update user profile
        const profileData = {
          id: user.id,
          full_name: data.fullName || null,
          age: data.age || null,
          date_of_birth: dateOfBirth,
          gender: data.gender || null,
          height_feet: data.heightFeet || null,
          height_inches: data.heightInches || null,
          height_cm: data.heightCm || null,
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
          workout_type: data.workoutType || null,
          smoking: normalizeLifestyleValue(data.smoking),
          drinking: normalizeLifestyleValue(data.drinking),
          track_family: data.trackFamily || null,
          critical_conditions: data.criticalConditions || null,
          has_health_reports: data.hasHealthReports || null,
          health_reports: data.healthReports || null,
          referral_code: data.referralCode || null,
          save_progress: data.saveProgress || null,
          status: "active",
          preferences: data.preferences || {},

          // ✅ NEW: Save all additional health fields
          allergies: data.allergies || null,
          family_history: data.family_history || null,
          lifestyle: data.lifestyle || null,
          stress_levels: data.stress_levels || null,
          mental_health: data.mental_health || null,
          hydration_habits: data.hydration_habits || null,
          smoking_status: data.smoking_status || null,
          alcohol_consumption: data.alcohol_consumption || null,
          occupation: data.occupation || null,

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
        console.log("Onboarding.tsx: Setting onboardingStep to 'complete'");
        setOnboardingStep("complete");

        toast.success("Onboarding completed successfully!", {
          description: "Your profile has been saved.",
        });

        console.log(
          "Onboarding.tsx: Onboarding completion successful, should redirect"
        );
        // Let the redirect logic handle navigation based on updated profile
        // The useEffect with profile dependency will redirect to /health-assessment
      } catch (error) {
        console.error("Error completing onboarding:", error);
        toast.error("Failed to complete onboarding", {
          description:
            error instanceof Error ? error.message : "Please try again.",
        });
      } finally {
        setLoading(false);
        setIsCompleting(false);
      }
    },
    [user, navigate, refreshProfile, isCompleting]
  );

  // Restore onboarding data from localStorage after OAuth (only once)
  useEffect(() => {
    if (user && onboardingStep !== "complete" && !pendingOnboardingData) {
      const pending = localStorage.getItem("pendingOnboardingData");
      if (pending) {
        try {
          const onboardingData = JSON.parse(pending);
          console.log(
            "Restoring onboarding data from localStorage:",
            onboardingData
          );
          setPendingOnboardingData(onboardingData);
          handleSerialComplete(onboardingData);
          localStorage.removeItem("pendingOnboardingData");
        } catch (e) {
          console.warn("Failed to parse onboardingData from localStorage:", e);
        }
      }
    }
  }, [user, onboardingStep, handleSerialComplete, pendingOnboardingData]);

  // Fallback: create profile row if missing (with debounce)
  useEffect(() => {
    if (user && !profile && !loading) {
      const timer = setTimeout(() => {
        console.log("Onboarding: Creating fallback profile for user:", user.id);
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
      }, 2000); // 2 second delay to avoid race conditions

      return () => clearTimeout(timer);
    }
  }, [user, profile, refreshProfile, loading]);

  // Manual trigger for development (removed to prevent duplicate processing)
  // The onboarding data restoration is now handled in the previous useEffect

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

  // Show completion with scrollable profile data
  if (onboardingStep === "complete" && profile) {
    // Prepare profile fields for display
    const profileFields = [
      { label: "Full Name", value: profile.full_name, icon: User },
      { label: "Age", value: profile.age, icon: Clock },
      { label: "Gender", value: profile.gender, icon: User },
      { label: "Height (cm)", value: profile.height_cm, icon: Activity },
      { label: "Weight (kg)", value: profile.weight_kg, icon: Heart },
      { label: "Diet Type", value: profile.diet_type, icon: Apple },
      { label: "Workout Time", value: profile.workout_time, icon: Zap },
      { label: "Sleep Time", value: profile.sleep_time, icon: Moon },
      { label: "Wake Up Time", value: profile.wake_up_time, icon: Sun },
      { label: "Medications", value: Array.isArray(profile.medications) ? profile.medications.join(", ") : profile.medications, icon: Pill },
      { label: "Allergies", value: Array.isArray(profile.allergies) ? profile.allergies.join(", ") : profile.allergies, icon: Shield },
      { label: "Family History", value: Array.isArray(profile.family_history) ? profile.family_history.join(", ") : profile.family_history, icon: Users },
      { label: "Lifestyle", value: profile.lifestyle, icon: Zap },
      { label: "Stress Levels", value: profile.stress_levels, icon: Brain },
      { label: "Mental Health", value: profile.mental_health, icon: Brain },
      { label: "Hydration", value: profile.hydration_habits, icon: Droplets },
      { label: "Smoking Status", value: profile.smoking_status, icon: Coffee },
      { label: "Alcohol Consumption", value: profile.alcohol_consumption, icon: Coffee },
      { label: "Occupation", value: profile.occupation, icon: Briefcase },
    ].filter(field => field.value != null && field.value !== "");

    return (
      <div className="h-screen bg-white flex flex-col overflow-hidden">
        <div className="p-4 border-b">
          <h2 className="text-xl font-bold text-gray-900">Your Profile Summary</h2>
          <p className="text-sm text-gray-600">Review your saved information</p>
        </div>

        {/* Scrollable Cards */}
        <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
          {profileFields.map((field, index) => {
            const Icon = field.icon;
            return (
              <div key={index} className="flex items-start p-3 bg-gray-50 rounded-lg border">
                <div className="flex-shrink-0 mr-3 mt-0.5">
                  <Icon className="w-5 h-5 text-gray-600" />
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-900">{field.label}</h3>
                  <p className="text-sm text-gray-700 mt-1">{field.value || "Not specified"}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Continue Button */}
        <div className="p-4 border-t bg-white">
          <button
            onClick={async () => {
              try {
                const { subscriptionService } = await import("../services/subscriptionService");
                const { isTrialBypassEnabled } = await import("../config/subscription");

                if (isTrialBypassEnabled()) {
                  navigate("/dashboard", { replace: true });
                  return;
                }

                // Check if user has health plan
                const { data: healthPlan } = await supabase
                  .from("health_plans")
                  .select("id")
                  .eq("user_id", profile.id)
                  .limit(1)
                  .maybeSingle();

                if (healthPlan) {
                  const subscriptionStatus = await subscriptionService.getSubscriptionStatus(profile.id);
                  if (subscriptionStatus.isActive || subscriptionStatus.isTrial) {
                    navigate("/dashboard", { replace: true });
                    return;
                  }
                }

                // New user or no active subscription
                navigate("/paywall", { replace: true });
              } catch (error) {
                console.error("Redirect error:", error);
                navigate("/paywall", { replace: true });
              }
            }}
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 px-4 rounded-xl shadow-md transition-colors"
          >
            Continue
          </button>
        </div>
      </div>
    );
  }

  return null;
};

export default Onboarding;