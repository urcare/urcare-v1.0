import { Button } from "@/components/ui/button";
import { ProgressSteps } from "@/components/ui/loading-animation";
import { supabase } from "@/integrations/supabase/client";
import {
  Activity,
  AlertTriangle,
  Apple,
  Brain,
  Heart,
  Shield,
  TrendingUp,
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
  description: string;
}

interface AIHealthAnalysis {
  overallScore: number;
  metrics: HealthMetric[];
  riskFactors: string[];
  recommendations: string[];
}

// Generate AI-powered health analysis using OpenAI
const generateAIHealthAnalysis = async (
  profile: UserProfile,
  onboardingData: Record<string, unknown>
): Promise<AIHealthAnalysis> => {
  try {
    console.log("Generating AI health analysis...");

    // Prepare data for AI analysis
    const analysisData = {
      demographics: {
        age: profile.age,
        gender: profile.gender,
        height: profile.height_cm,
        weight: profile.weight_kg,
      },
      lifestyle: {
        sleepTime: profile.sleep_time,
        wakeUpTime: profile.wake_up_time,
        workSchedule: {
          start: profile.work_start,
          end: profile.work_end,
        },
        mealTimes: {
          breakfast: profile.breakfast_time,
          lunch: profile.lunch_time,
          dinner: profile.dinner_time,
        },
        workoutTime: profile.workout_time,
      },
      health: {
        chronicConditions: profile.chronic_conditions,
        medications: profile.medications,
        healthGoals: profile.health_goals,
        dietType: profile.diet_type,
        bloodGroup: profile.blood_group,
      },
      onboardingDetails: onboardingData,
    };

    const response = await fetch("/api/analyze-health", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(analysisData),
    });

    if (!response.ok) {
      throw new Error("Failed to get AI health analysis");
    }

    const aiAnalysis = await response.json();
    return aiAnalysis;
  } catch (error) {
    console.error("Error generating AI health analysis:", error);
    // Fallback to basic analysis
    return generateBasicHealthAnalysis(profile, onboardingData);
  }
};

// Fallback basic health analysis when AI is not available
const generateBasicHealthAnalysis = (
  profile: UserProfile,
  onboardingData: Record<string, unknown>
): AIHealthAnalysis => {
  const metrics: HealthMetric[] = [];
  let overallScore = 75;

  // BMI Analysis
  if (profile.height_cm && profile.weight_kg) {
    const heightM = parseFloat(profile.height_cm) / 100;
    const weightKg = parseFloat(profile.weight_kg);
    const bmi = weightKg / (heightM * heightM);

    let bmiStatus: "good" | "bad" = "good";
    let bmiDescription = "Normal BMI range";

    if (bmi < 18.5 || bmi > 24.9) {
      bmiStatus = "bad";
      bmiDescription = bmi < 18.5 ? "Underweight" : "Overweight";
      overallScore -= 10;
    } else {
      overallScore += 10;
    }

    metrics.push({
      id: "bmi",
      name: "BMI Score",
      value: bmi.toFixed(1),
      target: "18.5-24.9",
      status: bmiStatus,
      icon: <TrendingUp className="h-5 w-5" />,
      description: bmiDescription,
    });
  }

  // Sleep Quality
  if (profile.sleep_time && profile.wake_up_time) {
    const sleepHour = parseInt(profile.sleep_time.split(":")[0]);
    const wakeHour = parseInt(profile.wake_up_time.split(":")[0]);
    const sleepDuration =
      wakeHour >= sleepHour ? wakeHour - sleepHour : 24 - sleepHour + wakeHour;

    const sleepStatus: "good" | "bad" =
      sleepDuration >= 7 && sleepDuration <= 9 ? "good" : "bad";
    if (sleepStatus === "good") overallScore += 15;
    else overallScore -= 10;

    metrics.push({
      id: "sleep",
      name: "Sleep Quality",
      value: `${sleepDuration}h`,
      target: "7-9h",
      status: sleepStatus,
      icon: <Brain className="h-5 w-5" />,
      description:
        sleepStatus === "good" ? "Optimal sleep duration" : "Needs improvement",
    });
  }

  // Health Risk Assessment
  const riskFactors = profile.chronic_conditions?.length || 0;
  const medicationCount = profile.medications?.length || 0;
  const totalRiskScore = Math.max(
    0,
    100 - (riskFactors * 15 + medicationCount * 10)
  );

  if (riskFactors > 0 || medicationCount > 0)
    overallScore -= riskFactors * 5 + medicationCount * 3;

  metrics.push({
    id: "health-risk",
    name: "Health Risk",
    value: totalRiskScore.toString(),
    target: "80+",
    status: totalRiskScore >= 80 ? "good" : "bad",
    icon: <Shield className="h-5 w-5" />,
    description:
      totalRiskScore >= 80
        ? "Low risk profile"
        : "Moderate risk factors present",
  });

  // Activity Level
  const hasActiveGoals = profile.health_goals?.some(
    (goal) =>
      goal.toLowerCase().includes("fitness") ||
      goal.toLowerCase().includes("exercise") ||
      goal.toLowerCase().includes("active")
  );

  const activityScore = hasActiveGoals ? 85 : 65;
  if (hasActiveGoals) overallScore += 10;

  metrics.push({
    id: "activity",
    name: "Activity Level",
    value: activityScore.toString(),
    target: "75+",
    status: activityScore >= 75 ? "good" : "bad",
    icon: <Activity className="h-5 w-5" />,
    description: hasActiveGoals
      ? "Active lifestyle goals"
      : "Could be more active",
  });

  // Nutrition Assessment
  const hasHealthyDiet =
    profile.diet_type &&
    ["vegetarian", "vegan", "mediterranean", "balanced"].includes(
      profile.diet_type.toLowerCase()
    );

  const nutritionScore = hasHealthyDiet ? 80 : 60;
  if (hasHealthyDiet) overallScore += 5;

  metrics.push({
    id: "nutrition",
    name: "Nutrition Score",
    value: nutritionScore.toString(),
    target: "70+",
    status: nutritionScore >= 70 ? "good" : "bad",
    icon: <Apple className="h-5 w-5" />,
    description: hasHealthyDiet
      ? "Healthy diet pattern"
      : "Room for improvement",
  });

  // Stress Indicators
  const stressIndicators =
    (profile.chronic_conditions?.length || 0) +
    (profile.medications?.length || 0);
  const stressScore = Math.max(20, 100 - stressIndicators * 15);

  metrics.push({
    id: "stress",
    name: "Stress Level",
    value: stressScore.toString(),
    target: "60+",
    status: stressScore >= 60 ? "good" : "bad",
    icon: <Heart className="h-5 w-5" />,
    description:
      stressScore >= 60 ? "Manageable stress levels" : "High stress indicators",
  });

  // Cap overall score
  overallScore = Math.max(30, Math.min(100, overallScore));

  const riskFactorsList = [];
  if (riskFactors > 0)
    riskFactorsList.push("Chronic health conditions present");
  if (medicationCount > 0) riskFactorsList.push("Multiple medications");
  if (!hasActiveGoals) riskFactorsList.push("Sedentary lifestyle indicators");
  if (!hasHealthyDiet) riskFactorsList.push("Suboptimal nutrition patterns");

  const recommendations = [
    "Focus on consistent sleep schedule (7-9 hours)",
    "Incorporate regular physical activity",
    "Maintain balanced nutrition",
    "Monitor and manage stress levels",
    "Regular health check-ups",
  ];

  return {
    overallScore,
    metrics,
    riskFactors: riskFactorsList,
    recommendations,
  };
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
  const height = parseFloat(profile.height_cm || "170");
  const weight = parseFloat(profile.weight_kg || "70");

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

interface ComponentState {
  isLoading: boolean;
  isInitialized: boolean;
  error: string | null;
  healthAnalysis: AIHealthAnalysis | null;
  onboardingData: Record<string, unknown>;
}

const CustomPlan: React.FC = () => {
  const navigate = useNavigate();
  const { profile, loading, isInitialized } = useAuth();
  const [step, setStep] = useState<PlanStep>("initial");
  const [report, setReport] = useState<HealthPlanReport | null>(null);
  const [currentProgressStep, setCurrentProgressStep] = useState(0);

  // Simplified state management
  const [state, setState] = useState<ComponentState>({
    isLoading: false,
    isInitialized: false,
    error: null,
    healthAnalysis: null,
    onboardingData: {},
  });

  const hasNavigatedRef = useRef(false);
  const navigationTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const initializationRef = useRef(false);
  const lastInitializedProfileId = useRef<string | null>(null);
  const navigateRef = useRef(navigate);
  const lastProcessedProfileId = useRef<string | null>(null);
  const isProcessingRef = useRef(false);

  // Progress steps for the generation process
  const progressSteps = [
    "Analyzing your health data",
    "Calculating nutrition requirements",
    "Creating workout routine",
    "Generating lifestyle recommendations",
    "Finalizing your custom plan",
  ];

  // Single initialization function - defined without useCallback to avoid dependency issues
  const initializeHealthData = async () => {
    // Use ref to check initialization status to avoid dependency issues
    if (!profile || initializationRef.current || lastInitializedProfileId.current === profile?.id) {
      console.log("Skipping initializeHealthData due to guard:", {
        profile: profile?.id,
        initializationRef: initializationRef.current,
        lastInitializedProfileId: lastInitializedProfileId.current,
        authIsInitialized: isInitialized,
        authLoading: loading,
      });
      return;
    }

    console.log("Initializing health data for profile:", profile.id);
    initializationRef.current = true;
    lastInitializedProfileId.current = profile.id;

    setState((prev) => ({
      ...prev,
      isLoading: true,
      error: null,
    }));

    try {
      let onboardingData: Record<string, unknown> = {}; // Explicitly typed

      // Fetch onboarding data if available
      if (profile.onboarding_completed) {
        try {
          const { data: onboarding, error } = await supabase
            .from("onboarding_profiles")
            .select("details")
            .eq("user_id", profile.id)
            .single();

          if (!error && onboarding?.details) {
            onboardingData = onboarding.details;
            console.log("Onboarding data fetched successfully");
          }
        } catch (error) {
          console.warn("Could not fetch onboarding data:", error);
        }
      }

      // Generate health analysis
      console.log("Generating health analysis...");
      const healthAnalysis = await generateAIHealthAnalysis(
        profile,
        onboardingData
      );
      console.log("Health analysis generated successfully");

      setState({
        isLoading: false,
        isInitialized: true,
        error: null,
        healthAnalysis,
        onboardingData,
      });
    } catch (error) {
      console.error("Error initializing health data:", error);
      setState((prev) => ({
        ...prev,
        isLoading: false,
        error: "Failed to load health data",
        isInitialized: true, // Ensure state is initialized even on error
      }));
    }
  };

  // Retry function
  const retryInitialization = useCallback(() => {
    initializationRef.current = false;
    lastInitializedProfileId.current = null;
    lastProcessedProfileId.current = null;
    isProcessingRef.current = false;
    setState({
      isLoading: false,
      isInitialized: false,
      error: null,
      healthAnalysis: null,
      onboardingData: {},
    });
  }, []);

  // Update navigate ref when navigate changes
  useEffect(() => {
    navigateRef.current = navigate;
  }, [navigate]);

  // Safe navigation function to prevent throttling
  const safeNavigate = useCallback((path: string) => {
    if (hasNavigatedRef.current) return;

    // Clear any existing timeout
    if (navigationTimeoutRef.current) {
      clearTimeout(navigationTimeoutRef.current);
    }

    hasNavigatedRef.current = true;

    // Use timeout to ensure navigation happens after current render cycle
    navigationTimeoutRef.current = setTimeout(() => {
      navigateRef.current(path, { replace: true });
    }, 100);
  }, []); // No dependencies to avoid cycles

  // Single comprehensive useEffect to handle all initialization logic
  useEffect(() => {
    // Early returns for various conditions
    if (!isInitialized || loading) return; // wait for auth/profile to load
    if (hasNavigatedRef.current) return; // prevent navigation throttling
    if (isProcessingRef.current) return; // prevent concurrent processing

    // If profile is null (database timeout), allow OAuth users to proceed
    if (!profile) {
      console.log(
        "CustomPlan: Profile is null, allowing OAuth user to proceed"
      );
      return;
    }

    // Prevent processing the same profile multiple times
    if (lastProcessedProfileId.current === profile.id) {
      console.log("CustomPlan: Profile already processed, skipping:", profile.id);
      return;
    }

    // Set processing flag and profile ID immediately to prevent race conditions
    isProcessingRef.current = true;
    lastProcessedProfileId.current = profile.id;
    console.log("CustomPlan: Processing profile:", profile.id);

    // Check onboarding completion
    if (!profile.onboarding_completed) {
      toast.error("Please complete your onboarding first.");
      safeNavigate("/onboarding");
      isProcessingRef.current = false; // Reset processing flag
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
      isProcessingRef.current = false; // Reset processing flag
      return;
    }

    // Initialize health data if all checks pass
    if (!initializationRef.current) {
      initializeHealthData();
    }

    // Reset processing flag after completion
    isProcessingRef.current = false;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profile, isInitialized, loading, safeNavigate]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (navigationTimeoutRef.current) {
        clearTimeout(navigationTimeoutRef.current);
      }
      // Reset tracking on unmount to prevent stale state
      initializationRef.current = false;
      lastInitializedProfileId.current = null;
      lastProcessedProfileId.current = null;
      isProcessingRef.current = false;
    };
  }, []);

  // Show loading state while AuthContext is initializing
  if (!isInitialized || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white flex items-center justify-center px-4">
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

  // Show error state if health data loading failed
  if (state.error && !state.isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white flex items-center justify-center px-4">
        <div className="text-center max-w-md mx-auto p-4 sm:p-6">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertTriangle className="w-8 h-8 text-red-600" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Something went wrong
          </h2>
          <p className="text-gray-600 mb-6">{state.error}</p>
          <Button onClick={retryInitialization} className="w-full">
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  // Show loading state while analyzing health data
  if (state.isLoading || (profile && !state.isInitialized)) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white flex items-center justify-center px-4">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Analyzing your health data...</p>
          <p className="text-sm text-gray-500 mt-2">
            This may take a few moments
          </p>
        </div>
      </div>
    );
  }

  // Get health analysis data
  const healthAnalysis = state.healthAnalysis;
  const healthMetrics = healthAnalysis?.metrics || [];

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white">
      <div className="max-w-md w-full mx-auto p-4 sm:p-6">
        {/* Overall Health Score */}
        {healthAnalysis && (
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-gray-900 mb-2">
                {healthAnalysis.overallScore}/100
              </div>
              <div className="text-sm text-gray-600">Overall Health Score</div>
              <div className="w-full bg-gray-200 rounded-full h-2 mt-3">
                <div
                  className="bg-gradient-to-r from-purple-500 to-blue-500 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${healthAnalysis.overallScore}%` }}
                ></div>
              </div>
            </div>
          </div>
        )}

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
                  <div className="text-xs text-gray-500 mb-1">
                    {metric.description}
                  </div>
                  <div
                    className={`text-sm font-semibold ${
                      metric.status === "good"
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    {metric.value}{" "}
                    <span className="text-gray-400">/ {metric.target}</span>
                  </div>
                </div>
              </div>
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  metric.status === "good" ? "bg-green-500" : "bg-red-500"
                }`}
              >
                {metric.status === "good" ? (
                  <svg
                    className="w-5 h-5 text-white"
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
                    className="w-5 h-5 text-white"
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
            Your Health Analysis
          </h1>
          <p className="text-gray-600 text-sm leading-relaxed">
            Based on your onboarding data, we've analyzed your health patterns
            and identified key areas for improvement.
          </p>
        </div>

        {/* Risk Factors */}
        {healthAnalysis && healthAnalysis.riskFactors.length > 0 && (
          <div className="bg-red-50 rounded-xl p-4 mb-6">
            <h3 className="text-sm font-semibold text-red-800 mb-2 flex items-center">
              <AlertTriangle className="w-4 h-4 mr-1" />
              Areas of Concern
            </h3>
            <ul className="text-sm text-red-700 space-y-1">
              {healthAnalysis.riskFactors.map((risk, index) => (
                <li key={index} className="flex items-start">
                  <span className="w-1 h-1 bg-red-500 rounded-full mt-2 mr-2 flex-shrink-0"></span>
                  {risk}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Action Button */}
        <Button
          onClick={() => navigate("/paywall")}
          className="w-full bg-gray-800 hover:bg-gray-900 text-white py-4 rounded-xl font-medium"
          size="lg"
        >
          Get Personalized Plan
        </Button>
      </div>
    </div>
  );
};

export default CustomPlan;
