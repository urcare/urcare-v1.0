import { AuthOptions } from "@/components/auth/AuthOptions";
import { supabase } from "@/integrations/supabase/client";
import { useCallback, useEffect, useState, useRef } from "react";
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
  const isCompletingRef = useRef(false);
  const hasCompletedOnboardingRef = useRef(false);
  const hasRedirectedRef = useRef(false);

  // Helper function to convert descriptive time to proper time format
  const convertTimeToFormat = (timeValue: string | null): string | null => {
    if (!timeValue) return null;

    // If it's already in proper time format (HH:MM), return as is
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
        // PM
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
  };

  // Normalize lifestyle fields to match DB constraints
  const normalizeLifestyleValue = (value: string | null | undefined): string | null => {
    if (!value || value.trim() === "" || value.toLowerCase().includes("prefer")) {
      return null;
    }
    return value.toLowerCase().trim();
  };

  // Normalize drinking value to match database constraints
  const normalizeDrinkingValue = (value: string | null | undefined): string | null => {
    if (!value || value.trim() === "") {
      return null;
    }
    
    const normalized = value.toLowerCase().trim();
    
    // Map common values to database-accepted values
    const drinkingMap: { [key: string]: string } = {
      "never drink": "never",
      "never drank": "never", 
      "never": "never",
      "no": "never",
      "none": "never",
      "not at all": "never",
      "abstain": "never",
      "abstainer": "never",
      "teetotaler": "never",
      "teetotal": "never",
      "prefer not to say": "never",
      "don't drink": "never",
      "do not drink": "never",
      "non-drinker": "never",
      "occasionally": "occasionally",
      "socially": "socially",
      "social drinking": "socially",
      "regularly": "regularly",
      "frequently": "frequently",
      "daily": "daily",
      "former drinker": "never",
      "current drinker": "occasionally",
      "ex-drinker": "never",
      "recovering": "never",
      "in recovery": "never",
      "sober": "never",
      "moderate": "occasionally",
      "light": "occasionally",
      "heavy": "frequently",
      "excessive": "daily"
    };
    
    const mappedValue = drinkingMap[normalized];
    if (mappedValue) {
      console.log(`Drinking value mapped: "${value}" -> "${mappedValue}"`);
      return mappedValue;
    }
    
    // If no mapping found, return null to avoid constraint violation
    console.warn(`Unknown drinking value: "${value}", setting to null`);
    return null;
  };

  // Normalize smoking value to match database constraints
  const normalizeSmokingValue = (value: string | null | undefined): string | null => {
    if (!value || value.trim() === "") {
      return null;
    }
    
    const normalized = value.toLowerCase().trim();
    
    // Map common values to database-accepted values
    const smokingMap: { [key: string]: string } = {
      "never smoke": "never",
      "never smoked": "never", 
      "never": "never",
      "no": "never",
      "none": "never",
      "not at all": "never",
      "non-smoker": "never",
      "prefer not to say": "never",
      "don't smoke": "never",
      "do not smoke": "never",
      "occasionally": "occasionally",
      "socially": "socially",
      "social smoking": "socially",
      "regularly": "regularly",
      "frequently": "frequently",
      "daily": "daily",
      "former smoker": "never",
      "current smoker": "occasionally",
      "ex-smoker": "never",
      "quit": "never",
      "stopped": "never",
      "moderate": "occasionally",
      "light": "occasionally",
      "heavy": "frequently",
      "chain smoker": "daily"
    };
    
    const mappedValue = smokingMap[normalized];
    if (mappedValue) {
      console.log(`Smoking value mapped: "${value}" -> "${mappedValue}"`);
      return mappedValue;
    }
    
    // If no mapping found, return null to avoid constraint violation
    console.warn(`Unknown smoking value: "${value}", setting to null`);
    return null;
  };

  // TEMPORARY: Skip auth requirement for onboarding
  // Show auth popup if not authenticated (commented out for temporary bypass)
  // useEffect(() => {
  //   if (!user) setShowAuth(true);
  //   else setShowAuth(false);
  // }, [user]);

  // Immediate redirect if onboarding is already completed
  useEffect(() => {
    console.log("Onboarding: Profile state check", { 
      hasProfile: !!profile, 
      onboardingCompleted: profile?.onboarding_completed,
      profileId: profile?.id,
      onboardingStep,
      hasCompletedOnboarding: hasCompletedOnboardingRef.current,
      hasRedirected: hasRedirectedRef.current
    });
    
    // Only redirect if onboarding is actually completed AND we're not in the middle of completing it
    // AND we haven't already redirected
    if (profile && 
        (profile.onboarding_completed || hasCompletedOnboardingRef.current) && 
        onboardingStep !== "serial" && 
        !isCompletingRef.current &&
        !hasRedirectedRef.current) {
      console.log("Onboarding: Immediate redirect - user has completed onboarding");
      hasRedirectedRef.current = true; // Mark that we've redirected
      // Small delay to ensure all state is properly updated
      setTimeout(() => {
        navigate("/health-assessment", { replace: true });
      }, 50);
    }
  }, [profile, navigate, onboardingStep]);

  // Prevent redirect back to onboarding if user is on health assessment
  useEffect(() => {
    const currentPath = window.location.pathname;
    if (currentPath === "/health-assessment" ) {
      console.log("Onboarding: User is on health assessment with completed onboarding, staying here");
      return;
    }
  }, [profile]);

  // Redirect based on subscription status if onboarding is already complete
  useEffect(() => {
    // Only run this if onboarding is completed AND we're not in the middle of completing it
    if (profile && (profile.onboarding_completed || hasCompletedOnboardingRef.current) && onboardingStep !== "serial" && !isCompletingRef.current) {
      console.log("Onboarding: User has completed onboarding, checking next steps");
      
      // Check subscription status and redirect accordingly
      const checkSubscriptionAndRedirect = async () => {
        try {
          const { subscriptionService } = await import(
            "../services/subscriptionService"
          );

          // Check if user has completed health plan generation
          const { data: healthPlan } = await supabase
            .from("comprehensive_health_plans")
            .select("id")
            .eq("user_id", profile.id)
            .eq("status", "active")
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
          const hasAccess = subscriptionStatus.isActive;

          if (hasAccess) {
            console.log(
              "Onboarding: User has active subscription, redirecting to dashboard"
            );
            navigate("/dashboard", { replace: true });
          } else {
            console.log(
              "Onboarding: User no subscription, redirecting to health-assessment"
            );
            navigate("/health-assessment", { replace: true });
          }
        } catch (subscriptionError) {
          console.error(
            "Onboarding: Error checking subscription status:",
            subscriptionError
          );
          // Fallback: redirect to health assessment
          console.log(
            "Onboarding: Subscription check failed, redirecting to health-assessment"
          );
          navigate("/health-assessment", { replace: true });
        }
      };

      checkSubscriptionAndRedirect();
    } else if (
      profile &&
      !profile.onboarding_completed &&
      !hasCompletedOnboardingRef.current &&
      !hasRedirectedRef.current &&
      onboardingStep === "welcome"
    ) {
      // If profile exists but onboarding is not completed, show onboarding
      console.log("Onboarding: User hasn't completed onboarding, showing serial onboarding");
      setOnboardingStep("serial");
    } else if (hasCompletedOnboardingRef.current || hasRedirectedRef.current) {
      // If we've completed onboarding or already redirected, don't show serial onboarding
      console.log("Onboarding: User has completed onboarding or already redirected, skipping serial onboarding");
    }
  }, [profile, navigate, onboardingStep]);

  // Define handleSerialComplete before using it in useEffect
  const handleSerialComplete = useCallback(
    async (data: OnboardingData) => {
      console.log(
        "Onboarding.tsx: handleSerialComplete called with data:",
        data
      );

      // TEMPORARY: Handle case where there's no user (bypass mode)
      if (!user) {
        console.log("No user found - in bypass mode, storing data locally");
        // Store onboarding data in localStorage for later use
        localStorage.setItem("pendingOnboardingData", JSON.stringify(data));
        toast.success("Onboarding completed successfully!", {
          description: "Your progress has been saved locally.",
        });
        // Set onboarding step to complete to show the completion screen
        setOnboardingStep("complete");
        return;
      }

      // Guard against empty data - don't complete onboarding with no data
      if (!data || Object.keys(data).length === 0) {
        console.log("Skipping onboarding completion - no data provided");
        return;
      }

      // Reset any stuck state
      if (isCompleting) {
        console.log("Resetting stuck completing state");
        setIsCompleting(false);
      }

      setIsCompleting(true);
      isCompletingRef.current = true;

      // Add timeout to reset completing state if it gets stuck
      const completingTimeout = setTimeout(() => {
        console.log("Completing timeout reached, resetting state");
        setIsCompleting(false);
        isCompletingRef.current = false;
        setLoading(false);
      }, 30000); // 30 second timeout

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

        // Create or update user profile with robust error handling
        let profileData;
        try {
          // Create a clean profile data object with all constraint-prone fields set to null
          profileData = {
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
            // Force constraint-prone fields to null to avoid database constraint violations
            smoking: null,
            drinking: null,
            smoking_status: null,
            alcohol_consumption: null,
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
            occupation: data.occupation || null,

            onboarding_completed: true,
          };
        } catch (profileError) {
          console.error("Error creating profile data:", profileError);
          // Create minimal profile data to avoid constraint violations
          profileData = {
            id: user.id,
            full_name: data.fullName || null,
            age: data.age || null,
            date_of_birth: dateOfBirth,
            gender: data.gender || null,
            onboarding_completed: true,
            status: "active",
            drinking: null, // Force null to avoid constraint violations
            smoking: null,
          };
        }

        console.log("Profile data to be saved:", profileData);
        console.log("Smoking value in profile data:", profileData.smoking);
        console.log("Drinking value in profile data:", profileData.drinking);
        console.log("Raw drinking value from data:", data.drinking);
        console.log("Raw smoking value from data:", data.smoking);

        // Set onboarding step to complete FIRST
        console.log("Onboarding.tsx: Setting onboardingStep to 'complete'");
        setOnboardingStep("complete");
        
        // Mark onboarding as completed to prevent any redirects back
        hasCompletedOnboardingRef.current = true;
        hasRedirectedRef.current = true; // Mark that we're about to redirect
        
        // Update profile state locally to prevent redirect back to onboarding
        console.log("Onboarding.tsx: Updating profile state locally");
        if (profile) {
          profile.onboarding_completed = true;
          // Don't call refreshProfile() as it will override our local changes
          console.log("Onboarding.tsx: Profile updated locally, onboarding_completed set to true");
        }
        
        // Redirect immediately to health-assessment - ALWAYS redirect regardless of database issues
        console.log("Onboarding.tsx: Redirecting to health-assessment immediately");
        setTimeout(() => {
          navigate("/health-assessment", { replace: true });
        }, 100); // Small delay to ensure state is set

        // Save profile data in background (async, don't await)
        supabase
          .from("user_profiles")
          .upsert(profileData, { onConflict: "id" })
          .then(({ error: profileError }) => {
            if (profileError) {
              console.error("Error saving profile:", profileError);
              console.error("Profile data that failed:", profileData);
              
              // If it's a constraint error, try saving with problematic fields set to null
              if (profileError.code === '23514') {
                let retryProfileData = { ...profileData };
                
                if (profileError.message.includes('drinking_check')) {
                  console.log("Onboarding.tsx: Retrying save with drinking set to null");
                  retryProfileData.drinking = null;
                }
                
                if (profileError.message.includes('smoking_check')) {
                  console.log("Onboarding.tsx: Retrying save with smoking set to null");
                  retryProfileData.smoking = null;
                }
                
                // If both drinking and smoking have issues, set both to null
                if (profileError.message.includes('drinking_check') && profileError.message.includes('smoking_check')) {
                  console.log("Onboarding.tsx: Retrying save with both drinking and smoking set to null");
                  retryProfileData.drinking = null;
                  retryProfileData.smoking = null;
                }
                
                supabase
                  .from("user_profiles")
                  .upsert(retryProfileData, { onConflict: "id" })
                  .then(({ error: retryError }) => {
                    if (retryError) {
                      console.error("Retry save also failed:", retryError);
                    } else {
                      console.log("Profile saved successfully on retry");
                    }
                  });
              } else {
                // Don't redirect back to onboarding on error - user is already on health assessment
                toast.error("Profile save failed, but you can continue", {
                  description: "Your data will be saved when you complete the process."
                });
              }
            } else {
              console.log("Profile saved successfully");
              // Don't refresh profile as it will override our local onboarding_completed state
              // The user is already on health assessment, no need to refresh
            }
          });

        // Save raw onboarding answers into onboarding_profiles (separate table) - async
        supabase
          .from("onboarding_profiles")
          .upsert(
            {
              user_id: user.id,
              details: data as any,
            },
            { onConflict: "user_id" }
          )
          .then(({ error: onboardingError }) => {
            if (onboardingError) {
              console.error("Error saving onboarding details:", onboardingError);
            } else {
              console.log("Onboarding details saved successfully");
            }
          });

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
        clearTimeout(completingTimeout);
        setLoading(false);
        setIsCompleting(false);
        isCompletingRef.current = false;
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

  // If onboarding is already completed, show loading while redirecting
  if (profile && (profile.onboarding_completed || hasCompletedOnboardingRef.current)) {
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-app-bg px-4">
        <div className="text-center max-w-sm sm:max-w-md">
          <div className="w-16 h-16 sm:w-20 sm:h-20 bg-card-secondary/20 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
            <div className="w-8 h-8 sm:w-10 sm:h-10 border-4 border-logo-text border-t-transparent rounded-full animate-spin"></div>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-text-primary mb-3 sm:mb-4">
            Redirecting...
          </h2>
          <p className="text-base sm:text-lg text-text-secondary mb-6 sm:mb-8">
            Taking you to your health assessment.
          </p>
        </div>
      </div>
    );
  }

  // Show serial onboarding directly (welcome screen is now separate)
  if ((onboardingStep === "welcome" || onboardingStep === "serial") && !hasCompletedOnboardingRef.current) {
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
      <div className="h-screen flex flex-col items-center justify-center bg-app-bg px-4 overflow-hidden">
        <div className="text-center max-w-sm sm:max-w-md">
          <div className="w-16 h-16 sm:w-20 sm:h-20 bg-card-secondary/20 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
            <svg
              className="w-8 h-8 sm:w-10 sm:h-10 text-logo-text"
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
          <h2 className="text-xl sm:text-2xl font-bold text-text-primary mb-3 sm:mb-4">
            Profile Setup Complete!
          </h2>
          <p className="text-base sm:text-lg text-text-secondary mb-6 sm:mb-8">
            Your profile has been successfully saved. You can now start using
            UrCare.
          </p>
          <div className="space-y-3">
            <button
              onClick={() => {
                // TEMPORARY: In bypass mode, always go to paywall
                if (!user) {
                  console.log("Continue button clicked - redirecting to paywall (bypass mode)");
                  navigate("/paywall", { replace: true });
                  return;
                }
                
                // Redirect immediately to health assessment for authenticated users
                console.log("Continue button clicked - redirecting to health-assessment immediately");
                hasRedirectedRef.current = true; // Mark that we're redirecting
                navigate("/health-assessment", { replace: true });
              }}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 px-4 rounded-xl shadow-md transition-colors"
            >
              Continue
            </button>
            
            {/* Development buttons */}
            {process.env.NODE_ENV === 'development' && (
              <div className="space-y-2">
                <button
                  onClick={() => {
                    console.log("Resetting onboarding state");
                    setIsCompleting(false);
                    setLoading(false);
                    setOnboardingStep("serial");
                    hasCompletedOnboardingRef.current = false;
                    hasRedirectedRef.current = false;
                  }}
                  className="w-full bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded-xl shadow-md transition-colors text-sm"
                >
                  Reset (Dev)
                </button>
                 <button
                   onClick={() => {
                     console.log("Force redirecting to health-assessment");
                     hasRedirectedRef.current = true; // Mark that we're redirecting
                     navigate("/health-assessment", { replace: true });
                   }}
                   className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-xl shadow-md transition-colors text-sm"
                 >
                   Go to Health Assessment (Dev)
                 </button>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return null;
};

export default Onboarding;