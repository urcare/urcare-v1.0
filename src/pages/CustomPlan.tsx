import { Button } from "@/components/ui/button";
import { ProgressSteps } from "@/components/ui/loading-animation";
import { supabase } from "@/integrations/supabase/client";
import {
  Apple,
  Clock,
  Coffee,
  Droplets,
  Footprints,
  Heart,
  Wine,
} from "lucide-react";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { UserProfile, useAuth } from "../contexts/AuthContext";

interface HealthPlanReport {
  summary: string;
  recommendations: string[];
  detailedReport: string;
  structured?: {
    summary: {
      healthScore: string;
      calorieTarget: string;
      bmi: string;
      keyRecommendations: string[];
    };
    sections: {
      healthAssessment: string;
      nutritionPlan: string;
      fitnessPlan: string;
      lifestyleOptimization: string;
      healthMonitoring: string;
      potentialRisks: string;
      urCareBenefits: string;
      nextSteps: string;
    };
  } | null;
}

interface HealthMetric {
  id: string;
  name: string;
  value: string;
  target: string;
  status: "good" | "bad";
  icon: React.ReactNode;
}

// Generate health metrics based on user onboarding data
const generateHealthMetrics = (
  profile: UserProfile,
  onboardingData: any
): HealthMetric[] => {
  const metrics: HealthMetric[] = [];

  // Stress Score - based on chronic conditions and medications
  const stressFactors =
    (profile.chronic_conditions?.length || 0) +
    (profile.medications?.length || 0);
  const stressScore = Math.min(50 + stressFactors * 8, 100);
  metrics.push({
    id: "stress",
    name: "50+ stress score",
    value: stressScore.toString(),
    target: "50",
    status: stressScore > 50 ? "bad" : "good",
    icon: <Heart className="h-5 w-5" />,
  });

  // Alcohol - check if user has alcohol-related conditions or mentions
  const hasAlcoholIssues =
    profile.chronic_conditions?.some(
      (condition) =>
        condition.toLowerCase().includes("liver") ||
        condition.toLowerCase().includes("alcohol")
    ) || false;
  metrics.push({
    id: "alcohol",
    name: "Alcohol",
    value: hasAlcoholIssues ? "2.5 drinks" : "0.0 drinks",
    target: "0",
    status: hasAlcoholIssues ? "bad" : "good",
    icon: <Wine className="h-5 w-5" />,
  });

  // Caffeine - based on sleep issues and work schedule
  const hasSleepIssues =
    profile.sleep_time && profile.wake_up_time
      ? new Date(`2000-01-01 ${profile.sleep_time}`).getTime() -
          new Date(`2000-01-01 ${profile.wake_up_time}`).getTime() <
        8 * 60 * 60 * 1000
      : false;
  const caffeineIntake = hasSleepIssues ? 180 : 95;
  metrics.push({
    id: "caffeine",
    name: "Caffeine",
    value: `${caffeineIntake} mg`,
    target: "100",
    status: caffeineIntake > 150 ? "bad" : "good",
    icon: <Coffee className="h-5 w-5" />,
  });

  // Hydration - based on health goals and conditions
  const needsMoreHydration =
    profile.health_goals?.some(
      (goal) =>
        goal.toLowerCase().includes("hydration") ||
        goal.toLowerCase().includes("water")
    ) ||
    profile.chronic_conditions?.some((condition) =>
      condition.toLowerCase().includes("kidney")
    ) ||
    false;
  const hydrationAmount = needsMoreHydration ? 48 : 64;
  metrics.push({
    id: "hydration",
    name: "Hydration",
    value: `${hydrationAmount}.0 fl oz`,
    target: "64",
    status: hydrationAmount >= 64 ? "good" : "bad",
    icon: <Droplets className="h-5 w-5" />,
  });

  // Steps - based on fitness goals and work schedule
  const hasFitnessGoals =
    profile.health_goals?.some(
      (goal) =>
        goal.toLowerCase().includes("fitness") ||
        goal.toLowerCase().includes("exercise") ||
        goal.toLowerCase().includes("weight")
    ) || false;
  const stepCount = hasFitnessGoals ? 8500 : 12500;
  metrics.push({
    id: "steps",
    name: "10,000+ steps",
    value: stepCount.toLocaleString(),
    target: "10,000",
    status: stepCount >= 10000 ? "good" : "bad",
    icon: <Footprints className="h-5 w-5" />,
  });

  // Nutrition Score - based on diet type and health goals
  const hasNutritionGoals =
    profile.health_goals?.some(
      (goal) =>
        goal.toLowerCase().includes("nutrition") ||
        goal.toLowerCase().includes("diet")
    ) || false;
  const isHealthyDiet =
    profile.diet_type &&
    ["vegetarian", "vegan", "mediterranean"].includes(
      profile.diet_type.toLowerCase()
    );
  const nutritionScore = hasNutritionGoals && isHealthyDiet ? 78 : 65;
  metrics.push({
    id: "nutrition",
    name: "67+ nutrition score",
    value: nutritionScore.toString(),
    target: "67",
    status: nutritionScore >= 67 ? "good" : "bad",
    icon: <Apple className="h-5 w-5" />,
  });

  // Late Meal - based on dinner time and sleep schedule
  const dinnerTime = profile.dinner_time;
  const sleepTime = profile.sleep_time;
  let lateMealStatus = "good";
  let lateMealTime = "7:30 PM";

  if (dinnerTime && sleepTime) {
    const dinnerHour = parseInt(dinnerTime.split(":")[0]);
    const sleepHour = parseInt(sleepTime.split(":")[0]);
    if (dinnerHour > 20 || sleepHour - dinnerHour < 2) {
      lateMealStatus = "bad";
      lateMealTime = dinnerTime;
    }
  }

  metrics.push({
    id: "late-meal",
    name: "Late meal",
    value: lateMealTime,
    target: "8:00 PM",
    status: lateMealStatus as "good" | "bad",
    icon: <Clock className="h-5 w-5" />,
  });

  return metrics;
};

// Rotating Wheel Component
const RotatingWheel: React.FC<{ metrics: HealthMetric[] }> = ({ metrics }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsAnimating(true);
      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % metrics.length);
        setIsAnimating(false);
      }, 300);
    }, 2000);

    return () => clearInterval(interval);
  }, [metrics.length]);

  const currentMetric = metrics[currentIndex];

  return (
    <div className="flex justify-center mb-8">
      <div className="relative w-32 h-32">
        {/* Rotating wheel background */}
        <div
          className={`absolute inset-0 rounded-full bg-gradient-to-br from-purple-100 to-blue-100 transition-transform duration-300 ${
            isAnimating ? "scale-110" : "scale-100"
          }`}
          style={{
            transform: `rotate(${currentIndex * (360 / metrics.length)}deg)`,
            transition: "transform 0.3s ease-in-out",
          }}
        />

        {/* Center content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center z-10">
          <div className="text-2xl font-bold text-gray-800 mb-1">
            {currentMetric.value}
          </div>
          <div className="text-xs text-gray-600 text-center px-2">
            {currentMetric.name}
          </div>
        </div>

        {/* Status indicator */}
        <div
          className={`absolute top-2 right-2 w-6 h-6 rounded-full flex items-center justify-center ${
            currentMetric.status === "good" ? "bg-green-500" : "bg-red-500"
          }`}
        >
          {currentMetric.status === "good" ? (
            <svg
              className="w-4 h-4 text-white"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                clipRule="evenodd"
              />
            </svg>
          ) : (
            <svg
              className="w-4 h-4 text-white"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          )}
        </div>
      </div>
    </div>
  );
};

// Generate basic health plan without AI
async function generateBasicHealthPlan(
  profile: UserProfile
): Promise<HealthPlanReport> {
  console.log("Generating basic health plan for profile:", profile);

  // Calculate basic health metrics
  const age =
    profile.age ||
    new Date().getFullYear() -
      new Date(profile.date_of_birth || "1990-01-01").getFullYear();
  const height = profile.height_cm || 170;
  const weight = profile.weight_kg || 70;

  const heightM = height / 100;
  const bmi = (weight / (heightM * heightM)).toFixed(1);

  let bmr: number;
  const gender = (profile.gender || "male").toLowerCase();
  if (gender === "male") {
    bmr = 10 * weight + 6.25 * height - 5 * age + 5;
  } else {
    bmr = 10 * weight + 6.25 * height - 5 * age - 161;
  }
  const tdee = Math.round(bmr * 1.2);

  let healthScore = 75;
  if (parseFloat(bmi) >= 18.5 && parseFloat(bmi) <= 24.9) healthScore += 15;
  if (age >= 18 && age <= 65) healthScore += 10;

  const basicReport = `HEALTH ASSESSMENT
• BMI: ${bmi}
• Health Score: ${healthScore}/100
• Current status: Based on your profile, there's room for improvement

NUTRITION PLAN
• Daily Calorie Target: ${tdee} kcal
• Balanced macronutrients and regular meals
• Focus on whole foods and proper hydration

FITNESS PLAN
• 3-4 days/week cardio + strength training
• 30-45 minutes per session
• Progressive intensity based on fitness level

LIFESTYLE OPTIMIZATION
• Sleep: 7-9 hours nightly
• Stress management techniques
• Regular meal timing

HEALTH MONITORING
• Track weight, BMI, energy levels
• Monitor progress weekly

POTENTIAL HEALTH RISKS
• Monitor blood pressure and lipid levels
• Regular health check-ups recommended

HOW UR CARE WILL HELP
• Personalized tracking and insights
• Community support and motivation
• Evidence-based recommendations

ACTIONABLE NEXT STEPS
1. Start with 30-minute daily walks
2. Track your food intake for 1 week
3. Establish regular meal times
4. Get 7-8 hours of sleep nightly
5. Stay hydrated throughout the day`;

  return {
    summary: `Your basic health plan is ready! Health Score: ${healthScore}/100`,
    recommendations: [
      `Daily Calorie Target: ${tdee} kcal`,
      `BMI: ${bmi}`,
      `Health Score: ${healthScore}/100`,
      "Start with 30-minute daily walks",
      "Track your food intake for 1 week",
      "Establish regular meal times",
    ],
    detailedReport: basicReport,
    structured: {
      summary: {
        healthScore: healthScore.toString(),
        calorieTarget: tdee.toString(),
        bmi: bmi,
        keyRecommendations: [
          "Start with 30-minute daily walks",
          "Track your food intake for 1 week",
          "Establish regular meal times",
        ],
      },
      sections: {
        healthAssessment: `BMI: ${bmi}, Health Score: ${healthScore}/100`,
        nutritionPlan: `Daily calorie target: ${tdee} kcal with balanced macros`,
        fitnessPlan: "3-4 days/week of cardio and strength training",
        lifestyleOptimization: "Focus on sleep, stress management, hydration",
        healthMonitoring: "Track weight, BMI, energy levels",
        potentialRisks: "Monitor blood pressure and cholesterol",
        urCareBenefits: "Personalized tracking and community support",
        nextSteps: "Start with walking and food tracking",
      },
    },
  };
}

type PlanStep = "initial" | "generating" | "ready" | "error";

const CustomPlan: React.FC = () => {
  const navigate = useNavigate();
  const { profile, loading, isInitialized } = useAuth();
  const [step, setStep] = useState<PlanStep>("initial");
  const [report, setReport] = useState<HealthPlanReport | null>(null);
  const [currentProgressStep, setCurrentProgressStep] = useState(0);
  const [healthMetrics, setHealthMetrics] = useState<HealthMetric[]>([]);
  const [onboardingData, setOnboardingData] = useState<any>(null);
  const [isGeneratingMetrics, setIsGeneratingMetrics] = useState(false);
  const [metricsInitialized, setMetricsInitialized] = useState(false);
  const [metricsError, setMetricsError] = useState<string | null>(null);
  const [fallbackTriggered, setFallbackTriggered] = useState(false);
  const hasNavigatedRef = useRef(false);
  const metricsGeneratedRef = useRef(false);
  const navigationTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Progress steps for the generation process
  const progressSteps = [
    "Analyzing your health data",
    "Calculating nutrition requirements",
    "Creating workout routine",
    "Generating lifestyle recommendations",
    "Finalizing your custom plan",
  ];

  // Function to generate metrics with error handling
  const generateMetricsWithFallback = useCallback(
    (profile: UserProfile, onboardingData: any = {}) => {
      try {
        const metrics = generateHealthMetrics(profile, onboardingData);
        setHealthMetrics(metrics);
        setMetricsInitialized(true);
        setMetricsError(null);
      } catch (error) {
        console.error("Error generating health metrics:", error);
        setMetricsError("Failed to generate health metrics");
        // Still try to generate basic metrics
        try {
          const basicMetrics = generateHealthMetrics(profile, {});
          setHealthMetrics(basicMetrics);
          setMetricsInitialized(true);
        } catch (fallbackError) {
          console.error("Fallback metrics generation failed:", fallbackError);
          setMetricsError("Unable to generate health metrics");
        }
      }
    },
    []
  );

  // Retry function for metrics generation
  const retryMetricsGeneration = useCallback(() => {
    if (!profile) return;
    setMetricsError(null);
    setMetricsInitialized(false);
    setIsGeneratingMetrics(true);
    metricsGeneratedRef.current = false; // Reset the ref to allow retry

    // Generate metrics immediately without fetching onboarding data
    try {
      const metrics = generateHealthMetrics(profile, {});
      setHealthMetrics(metrics);
      setMetricsInitialized(true);
      setMetricsError(null);
      metricsGeneratedRef.current = true; // Mark as completed
    } catch (error) {
      console.error("Error generating health metrics on retry:", error);
      setMetricsError("Unable to generate health metrics");
    }
    setIsGeneratingMetrics(false);
  }, [profile]);

  // Fetch onboarding data and generate health metrics
  useEffect(() => {
    console.log("CustomPlan useEffect triggered:", { 
      profile: !!profile, 
      metricsInitialized, 
      onboardingCompleted: profile?.onboarding_completed,
      metricsGeneratedRef: metricsGeneratedRef.current
    });

    // Prevent infinite loops - only run once per profile
    if (!profile || metricsGeneratedRef.current) {
      console.log("Skipping metrics generation:", { 
        hasProfile: !!profile, 
        alreadyGenerated: metricsGeneratedRef.current 
      });
      return;
    }

    const fetchOnboardingData = async () => {
      console.log("Starting fetchOnboardingData");
      setIsGeneratingMetrics(true);
      setMetricsError(null);
      metricsGeneratedRef.current = true; // Mark as started to prevent re-runs

      // Add timeout to prevent infinite loading
      const timeoutId = setTimeout(() => {
        console.warn("Metrics generation timeout, using fallback");
        try {
          const metrics = generateHealthMetrics(profile, {});
          setHealthMetrics(metrics);
          setMetricsInitialized(true);
          setMetricsError(null);
          console.log("Timeout fallback completed successfully");
        } catch (error) {
          console.error("Fallback metrics generation failed:", error);
          setMetricsError("Unable to generate health metrics");
        }
        setIsGeneratingMetrics(false);
      }, 10000); // 10 second timeout

      try {
        // Fetch onboarding data using existing supabase client
        const { data: onboarding, error } = await supabase
          .from("onboarding_profiles")
          .select("details")
          .eq("user_id", profile.id)
          .single();

        if (error) {
          console.warn("Could not fetch onboarding data:", error);
        } else {
          console.log("Onboarding data fetched successfully");
          setOnboardingData(onboarding?.details || {});
        }

        // Generate health metrics based on profile and onboarding data
        try {
          console.log("Generating health metrics...");
          const metrics = generateHealthMetrics(
            profile,
            onboarding?.details || {}
          );
          setHealthMetrics(metrics);
          setMetricsInitialized(true);
          setMetricsError(null);
          console.log("Health metrics generated successfully:", metrics.length);
        } catch (error) {
          console.error("Error generating health metrics:", error);
          setMetricsError("Failed to generate health metrics");
          // Still try to generate basic metrics
          try {
            const basicMetrics = generateHealthMetrics(profile, {});
            setHealthMetrics(basicMetrics);
            setMetricsInitialized(true);
            console.log("Basic metrics generated as fallback");
          } catch (fallbackError) {
            console.error("Fallback metrics generation failed:", fallbackError);
            setMetricsError("Unable to generate health metrics");
          }
        }
      } catch (error) {
        console.error("Error fetching onboarding data:", error);
        setMetricsError("Failed to load onboarding data");
        // Fallback to basic metrics
        try {
          const metrics = generateHealthMetrics(profile, {});
          setHealthMetrics(metrics);
          setMetricsInitialized(true);
          console.log("Basic metrics generated after error");
        } catch (fallbackError) {
          console.error("Fallback metrics generation failed:", fallbackError);
          setMetricsError("Unable to generate health metrics");
        }
      } finally {
        clearTimeout(timeoutId);
        setIsGeneratingMetrics(false);
        console.log("fetchOnboardingData completed");
      }
    };

    if (profile.onboarding_completed) {
      console.log("Profile has completed onboarding, fetching data");
      fetchOnboardingData();
    } else {
      console.log("Profile has not completed onboarding, generating basic metrics");
      // If profile exists but onboarding not completed, generate basic metrics
      setIsGeneratingMetrics(true);
      metricsGeneratedRef.current = true; // Mark as started
      try {
        const metrics = generateHealthMetrics(profile, {});
        setHealthMetrics(metrics);
        setMetricsInitialized(true);
        setMetricsError(null);
        console.log("Basic metrics generated for incomplete onboarding");
      } catch (error) {
        console.error("Error generating basic metrics:", error);
        setMetricsError("Unable to generate health metrics");
      }
      setIsGeneratingMetrics(false);
    }
  }, [profile]); // Remove metricsInitialized from dependencies

  // Fallback mechanism to prevent infinite loading
  useEffect(() => {
    if (profile && !metricsInitialized && !isGeneratingMetrics && !fallbackTriggered) {
      const fallbackTimeout = setTimeout(() => {
        console.warn("Fallback triggered - showing content without metrics");
        setFallbackTriggered(true);
        // Generate basic metrics as fallback
        try {
          const basicMetrics = generateHealthMetrics(profile, {});
          setHealthMetrics(basicMetrics);
          setMetricsInitialized(true);
          setIsGeneratingMetrics(false);
        } catch (error) {
          console.error("Fallback metrics generation failed:", error);
          setMetricsInitialized(true); // Still set to true to show content
          setIsGeneratingMetrics(false);
        }
      }, 15000); // 15 second fallback

      return () => clearTimeout(fallbackTimeout);
    }
  }, [profile, metricsInitialized, isGeneratingMetrics, fallbackTriggered]);

  // Safe navigation function to prevent throttling
  const safeNavigate = useCallback(
    (path: string) => {
      if (hasNavigatedRef.current) return;

      // Clear any existing timeout
      if (navigationTimeoutRef.current) {
        clearTimeout(navigationTimeoutRef.current);
      }

      hasNavigatedRef.current = true;

      // Use timeout to ensure navigation happens after current render cycle
      navigationTimeoutRef.current = setTimeout(() => {
        navigate(path, { replace: true });
      }, 100);
    },
    [navigate]
  );

  // Check if user has completed onboarding
  useEffect(() => {
    // Prevent navigation throttling - only run once when profile changes
    if (hasNavigatedRef.current) return;
    if (!isInitialized || loading) return; // wait for auth/profile to load

    // If profile is null (database timeout), allow OAuth users to proceed
    if (!profile) {
      console.log(
        "CustomPlan: Profile is null, allowing OAuth user to proceed"
      );
      return;
    }

    if (!profile.onboarding_completed) {
      toast.error("Please complete your onboarding first.");
      safeNavigate("/onboarding");
      return;
    }

    const preferences = profile.preferences as {
      meals?: { breakfast_time?: string };
      schedule?: { sleep_time?: string; wake_up_time?: string };
      health?: { blood_group?: string };
    };

    const required = [
      profile.full_name,
      profile.date_of_birth,
      profile.gender,
      preferences?.meals?.breakfast_time,
      preferences?.schedule?.sleep_time,
      preferences?.schedule?.wake_up_time,
      preferences?.health?.blood_group,
    ];

    if (required.some((v) => !v)) {
      toast.error("Please complete your onboarding first.");
      safeNavigate("/onboarding");
      return;
    }
  }, [profile, safeNavigate]); // Include safeNavigate in dependencies

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (navigationTimeoutRef.current) {
        clearTimeout(navigationTimeoutRef.current);
      }
    };
  }, []);

  // Show loading state while AuthContext is initializing
  if (!isInitialized || loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  // Handle continue button click
  const handleGeneratePlan = async () => {
    if (!profile) {
      // If profile is null due to database timeout, create a basic profile for OAuth users
      console.log(
        "CustomPlan: Profile is null, creating basic profile for OAuth user"
      );
      const basicProfile: UserProfile = {
        id: "temp-oauth-user",
        full_name: "OAuth User",
        age: 30,
        date_of_birth: "1994-01-01",
        gender: "male",
        unit_system: "metric",
        height_cm: "170",
        weight_kg: "70",
        onboarding_completed: true,
        status: "active",
        preferences: {},
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        // Add all other required fields as null
        height_feet: null,
        height_inches: null,
        weight_lb: null,
        wake_up_time: null,
        sleep_time: null,
        work_start: null,
        work_end: null,
        chronic_conditions: null,
        takes_medications: null,
        medications: null,
        has_surgery: null,
        surgery_details: null,
        health_goals: null,
        diet_type: null,
        blood_group: null,
        breakfast_time: null,
        lunch_time: null,
        dinner_time: null,
        workout_time: null,
        routine_flexibility: null,
        uses_wearable: null,
        wearable_type: null,
        track_family: null,
        share_progress: null,
        emergency_contact_name: null,
        emergency_contact_phone: null,
        critical_conditions: null,
        has_health_reports: null,
        health_reports: null,
        referral_code: null,
        save_progress: null,
      };

      setStep("generating");

      // Simulate progress steps
      const progressInterval = setInterval(() => {
        setCurrentProgressStep((prev) => {
          if (prev < progressSteps.length - 1) {
            return prev + 1;
          } else {
            clearInterval(progressInterval);
            return prev;
          }
        });
      }, 1500);

      try {
        const planReport = await generateBasicHealthPlan(basicProfile);
        setReport(planReport);
        setStep("ready");
        toast.success("Your basic health plan is ready!");
      } catch (error) {
        console.error("Error generating plan:", error);
        setStep("error");
        toast.error("Failed to generate health plan. Please try again.");
      } finally {
        clearInterval(progressInterval);
      }
      return;
    }

    setStep("generating");

    // Simulate progress steps
    const progressInterval = setInterval(() => {
      setCurrentProgressStep((prev) => {
        if (prev < progressSteps.length - 1) {
          return prev + 1;
        } else {
          clearInterval(progressInterval);
          return prev;
        }
      });
    }, 1500);

    try {
      // Try serverless AI endpoint first
      const response = await fetch(`/api/generate-plan`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ profile }),
      });

      if (response.ok) {
        const data = await response.json();
        const structured = data?.structured;
        const reportText = data?.report || "";

        if (structured) {
          const planReport: HealthPlanReport = {
            summary: `Your AI health plan is ready! Health Score: ${structured.summary.healthScore}/100`,
            recommendations: [
              `Daily Calorie Target: ${structured.summary.calorieTarget} kcal`,
              `BMI: ${structured.summary.bmi}`,
              ...structured.summary.keyRecommendations.slice(0, 3),
            ],
            detailedReport: reportText,
            structured,
          };
          setReport(planReport);
          setStep("ready");
          toast.success("Your AI health plan is ready!");
          return;
        }
      }

      // Fallback to basic generator
      const planReport = await generateBasicHealthPlan(profile);
      setReport(planReport);
      setStep("ready");
      toast.success("Your basic health plan is ready!");
    } catch (error) {
      console.error("Error generating plan:", error);
      setStep("error");
      toast.error("Failed to generate health plan. Please try again.");
    } finally {
      clearInterval(progressInterval);
    }
  };

  if (step === "generating") {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="max-w-md w-full mx-auto p-6">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold mb-2">Generating Your Plan</h2>
            <p className="text-muted-foreground">
              Creating your personalized health plan...
            </p>
          </div>
          <ProgressSteps
            steps={progressSteps}
            currentStep={currentProgressStep}
          />
        </div>
      </div>
    );
  }

  if (step === "ready" && report) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold mb-2">Your Health Plan</h1>
              <p className="text-muted-foreground">{report.summary}</p>
            </div>

            <div className="grid gap-6">
              <div className="bg-card rounded-lg border p-6">
                <h3 className="text-xl font-semibold mb-4">
                  Key Recommendations
                </h3>
                <ul className="space-y-2">
                  {report.recommendations.map((rec, index) => (
                    <li key={index} className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-primary rounded-full"></div>
                      <span>{rec}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-card rounded-lg border p-6">
                <h3 className="text-xl font-semibold mb-4">Detailed Plan</h3>
                <div className="whitespace-pre-line text-sm">
                  {report.detailedReport}
                </div>
              </div>
            </div>

            <div className="text-center mt-8">
              <Button onClick={() => navigate("/dashboard")}>
                Go to Dashboard
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (step === "error") {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Something went wrong</h2>
          <p className="text-muted-foreground mb-6">
            We couldn't generate your health plan. Please try again.
          </p>
          <Button onClick={() => setStep("initial")}>Try Again</Button>
        </div>
      </div>
    );
  }

  // Show error state if metrics generation failed
  if (metricsError && !isGeneratingMetrics) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-8 h-8 text-red-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 19.5c-.77.833.192 2.5 1.732 2.5z"
              />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Something went wrong
          </h2>
          <p className="text-gray-600 mb-6">{metricsError}</p>
          <Button onClick={retryMetricsGeneration} className="w-full">
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  // Show loading state while generating metrics or if metrics not initialized yet
  // But allow fallback to show content if fallback is triggered
  console.log("CustomPlan render state:", {
    isGeneratingMetrics,
    hasProfile: !!profile,
    metricsInitialized,
    fallbackTriggered,
    shouldShowLoading: (isGeneratingMetrics || (profile && !metricsInitialized)) && !fallbackTriggered
  });

  if ((isGeneratingMetrics || (profile && !metricsInitialized)) && !fallbackTriggered) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Analyzing your health data...</p>
          {/* Debug info */}
          <div className="mt-4 text-xs text-gray-400">
            Debug: {isGeneratingMetrics ? 'Generating' : 'Waiting'} | 
            Profile: {profile ? 'Yes' : 'No'} | 
            Metrics: {metricsInitialized ? 'Yes' : 'No'} |
            Fallback: {fallbackTriggered ? 'Yes' : 'No'}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white">
      <div className="max-w-md w-full mx-auto p-6">
        {/* Health Metrics Cards */}
        <div className="space-y-3 mb-8">
          {healthMetrics.map((metric) => (
            <div
              key={metric.id}
              className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex items-center justify-between"
            >
              <div className="flex items-center space-x-3">
                <div
                  className={`p-2 rounded-full ${
                    metric.status === "good" ? "bg-green-100" : "bg-red-100"
                  }`}
                >
                  {metric.icon}
                </div>
                <div>
                  <div className="font-medium text-gray-900">{metric.name}</div>
                  <div
                    className={`text-sm ${
                      metric.status === "good"
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    {metric.value}
                  </div>
                </div>
              </div>
              <div
                className={`w-6 h-6 rounded-full flex items-center justify-center ${
                  metric.status === "good" ? "bg-green-500" : "bg-red-500"
                }`}
              >
                {metric.status === "good" ? (
                  <svg
                    className="w-4 h-4 text-white"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                ) : (
                  <svg
                    className="w-4 h-4 text-white"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Rotating Wheel */}
        {healthMetrics.length > 0 && <RotatingWheel metrics={healthMetrics} />}

        {/* Main Content */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-3">
            Better health timeline
          </h1>
          <p className="text-gray-600 text-sm leading-relaxed">
            Your habits shape your health. UrCare helps you spot the ones that
            move the needle, so you can double down on what works.
          </p>
        </div>

        {/* Action Button */}
        <Button
          onClick={() => navigate("/paywall")}
          className="w-full bg-gray-800 hover:bg-gray-900 text-white py-4 rounded-xl font-medium"
          size="lg"
        >
          Continue
        </Button>
      </div>
    </div>
  );
};

export default CustomPlan;
