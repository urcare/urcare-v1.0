import { Button } from "@/components/ui/button";
import { ProgressSteps } from "@/components/ui/loading-animation";
import React, { useEffect, useState, useRef } from "react";
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
  const hasNavigatedRef = useRef(false);

  // Progress steps for the generation process
  const progressSteps = [
    "Analyzing your health data",
    "Calculating nutrition requirements",
    "Creating workout routine",
    "Generating lifestyle recommendations",
    "Finalizing your custom plan",
  ];

  // Check if user has completed onboarding
  useEffect(() => {
    // Prevent navigation throttling
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
      hasNavigatedRef.current = true;
      toast.error("Please complete your onboarding first.");
      navigate("/onboarding", { replace: true });
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
      hasNavigatedRef.current = true;
      toast.error("Please complete your onboarding first.");
      navigate("/onboarding", { replace: true });
      return;
    }
  }, [isInitialized, loading, profile, navigate]);

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

  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="max-w-md w-full mx-auto p-6">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">Custom Health Plan</h1>
          <p className="text-muted-foreground">
            Generate a personalized health plan based on your profile
          </p>
        </div>

        <div className="space-y-4">
          <Button onClick={handleGeneratePlan} className="w-full" size="lg">
            Generate My Health Plan
          </Button>

          <Button
            variant="outline"
            onClick={() => navigate("/dashboard")}
            className="w-full"
          >
            Back to Dashboard
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CustomPlan;
