import { Button } from "@/components/ui/button";
import {
  AIThinkingAnimation,
  ProgressSteps,
} from "@/components/ui/loading-animation";
import React, { useEffect, useState } from "react";
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

// Call backend API for GPT-4 report generation
async function fetchCustomPlanReport(
  profile: UserProfile
): Promise<HealthPlanReport> {
  try {
    const res = await fetch("/api/generate-plan", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ profile }),
    });
    if (!res.ok) throw new Error("Failed to generate plan");
    const data = await res.json();

    // Use structured response if available, fallback to raw response
    if (data.structured) {
      const { structured } = data;
      return {
        summary: `Your custom plan is ready! Health Score: ${structured.summary.healthScore}/100`,
        recommendations: [
          `Daily Calorie Target: ${structured.summary.calorieTarget} kcal`,
          `BMI: ${structured.summary.bmi}`,
          `Health Score: ${structured.summary.healthScore}/100`,
          ...structured.summary.keyRecommendations.slice(0, 3),
        ],
        detailedReport: data.report || "No report generated.",
        structured: structured,
      };
    } else {
      // Fallback to original format
      return {
        summary: "Your custom plan is ready! (see below)",
        recommendations: [
          "Daily Calorie Intake: 2100 kcal",
          "Carbohydrates: 250g",
          "Protein: 90g",
          "Fats: 70g",
          "Health Score: 82/100",
          "Potential Complications: See full report.",
          "Product Benefit: See full report.",
        ],
        detailedReport: data.report || "No report generated.",
        structured: null,
      };
    }
  } catch (err) {
    console.error("Error fetching custom plan:", err);
    throw new Error("Failed to generate custom plan. Please try again.");
  }
}

type PlanStep = "initial" | "generating" | "ready" | "error";

const CustomPlan: React.FC = () => {
  const navigate = useNavigate();
  const { profile } = useAuth();
  const [step, setStep] = useState<PlanStep>("initial");
  const [report, setReport] = useState<HealthPlanReport | null>(null);
  const [currentProgressStep, setCurrentProgressStep] = useState(0);

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
    if (!profile) {
      toast.error("Profile not found. Please complete onboarding.");
      navigate("/onboarding");
      return;
    }

    if (!profile.onboarding_completed) {
      toast.error("Please complete your onboarding first.");
      navigate("/onboarding");
      return;
    }

    // Check for required onboarding data
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
      toast.error(
        "Some onboarding data is missing. Please complete your profile setup."
      );
      navigate("/onboarding");
      return;
    }
  }, [profile, navigate]);

  // Handle continue button click
  const handleGeneratePlan = async () => {
    if (!profile) {
      toast.error("Profile not found. Please complete onboarding.");
      navigate("/onboarding");
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
      const planReport = await fetchCustomPlanReport(profile);
      setReport(planReport);
      setStep("ready");
      toast.success("Your custom health plan is ready!");
    } catch (error) {
      console.error("Error generating plan:", error);
      setStep("error");
      toast.error("Failed to generate custom plan. Please try again.");
    } finally {
      clearInterval(progressInterval);
    }
  };

  // Modern success circle component
  const SuccessCircle = () => (
    <div className="relative w-20 h-20 mb-6">
      {/* Outer ring */}
      <div className="absolute inset-0 rounded-full border-4 border-medical-green-200 bg-gradient-to-br from-medical-green-50 to-medical-green-100 animate-scale-in">
        {/* Inner circle */}
        <div className="absolute inset-2 rounded-full bg-gradient-to-br from-medical-green-400 to-medical-green-600 flex items-center justify-center">
          <div className="text-white text-2xl animate-fade-in">✓</div>
        </div>
      </div>

      {/* Animated particles */}
      {[0, 1, 2, 3].map((i) => (
        <div
          key={i}
          className="absolute w-2 h-2 bg-medical-green-400 rounded-full animate-pulse"
          style={{
            top: `${25 + 25 * Math.sin((i * Math.PI) / 2)}%`,
            left: `${25 + 25 * Math.cos((i * Math.PI) / 2)}%`,
            animationDelay: `${i * 0.2}s`,
          }}
        />
      ))}
    </div>
  );

  // Paywall overlay
  const Paywall = () => (
    <div className="absolute inset-0 bg-white/95 backdrop-blur-sm flex flex-col items-center justify-center z-20 rounded-xl border border-gray-200">
      <div className="text-center space-y-4 px-6 max-w-sm">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-medical-blue-400 to-medical-blue-600 flex items-center justify-center">
          <span className="text-white text-2xl">🔒</span>
        </div>
        <h2 className="text-xl font-bold text-gray-900">
          Unlock Your Full Custom Plan
        </h2>
        <p className="text-gray-600 text-sm">
          Subscribe to access your detailed GPT-4 powered health report with
          personalized diet, workout, and lifestyle recommendations.
        </p>
        <Button
          className="w-full bg-gradient-to-r from-medical-blue-500 to-medical-blue-600 hover:from-medical-blue-600 hover:to-medical-blue-700 text-white font-semibold py-3"
          onClick={() => navigate("/paywall")}
        >
          Subscribe Now
        </Button>
        <p className="text-gray-500 text-xs">
          Already subscribed?{" "}
          <span
            className="underline cursor-pointer text-medical-blue-600"
            onClick={() => window.location.reload()}
          >
            Refresh
          </span>
        </p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-medical-blue-50 via-white to-medical-teal-50 flex items-center justify-center p-4">
      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-medical-lg border border-gray-100 overflow-hidden">
        {/* Header with gradient */}
        <div className="bg-gradient-to-r from-medical-blue-500 to-medical-teal-500 p-6 text-white text-center">
          <h1 className="text-xl font-bold mb-2">Your Custom Health Plan</h1>
          <p className="text-medical-blue-100 text-sm">
            Personalized recommendations based on your data
          </p>
        </div>

        <div className="p-6">
          {step === "initial" && (
            <div className="text-center space-y-6">
              <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-medical-blue-100 to-medical-blue-200 flex items-center justify-center">
                <span className="text-3xl">🧠</span>
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-3">
                  Time to generate your custom plan!
                </h2>
                <p className="text-gray-600 text-sm leading-relaxed">
                  We'll analyze your onboarding data to create a personalized
                  health plan including diet recommendations, workout routines,
                  and lifestyle optimization.
                </p>
              </div>

              <div className="bg-medical-blue-50 rounded-lg p-4 border border-medical-blue-200">
                <h3 className="font-semibold text-medical-blue-900 mb-2">
                  What you'll get:
                </h3>
                <ul className="text-sm text-medical-blue-800 space-y-1">
                  <li>• Personalized nutrition plan with calorie targets</li>
                  <li>• Custom workout routine based on your goals</li>
                  <li>• Lifestyle optimization recommendations</li>
                  <li>• Health monitoring guidelines</li>
                </ul>
              </div>

              <Button
                onClick={handleGeneratePlan}
                className="w-full bg-gradient-to-r from-medical-blue-500 to-medical-blue-600 hover:from-medical-blue-600 hover:to-medical-blue-700 text-white font-semibold py-3 rounded-lg shadow-medical"
              >
                Generate My Custom Plan
              </Button>
            </div>
          )}

          {step === "generating" && (
            <div className="text-center space-y-6">
              <AIThinkingAnimation />

              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  Creating your personalized plan...
                </h3>

                <ProgressSteps
                  steps={progressSteps}
                  currentStep={currentProgressStep}
                />
              </div>
            </div>
          )}

          {step === "ready" && report && (
            <div className="space-y-6">
              <div className="text-center">
                <SuccessCircle />
                <h2 className="text-xl font-bold text-gray-900 mb-2">
                  Congratulations! Your custom plan is ready!
                </h2>
                <p className="text-gray-600 text-sm">
                  Here are your key recommendations based on your data:
                </p>
              </div>

              <div className="bg-gradient-to-br from-medical-green-50 to-medical-teal-50 rounded-lg p-4 border border-medical-green-200">
                <ul className="space-y-2">
                  {report.recommendations.map((rec: string, idx: number) => (
                    <li
                      key={idx}
                      className="text-gray-800 text-sm font-medium flex items-start animate-fade-in"
                      style={{ animationDelay: `${idx * 0.1}s` }}
                    >
                      <span className="mr-2 text-medical-green-600 font-bold">
                        •
                      </span>
                      {rec}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Paywall for detailed report */}
              <Paywall />

              <div className="flex flex-col space-y-3">
                <Button
                  onClick={() => navigate("/dashboard")}
                  className="w-full bg-gradient-to-r from-medical-green-500 to-medical-green-600 hover:from-medical-green-600 hover:to-medical-green-700 text-white font-semibold py-3"
                >
                  Go to Dashboard
                </Button>
                <Button
                  variant="outline"
                  onClick={() => navigate("/paywall")}
                  className="w-full border-medical-blue-200 text-medical-blue-700 hover:bg-medical-blue-50"
                >
                  View Full Report
                </Button>
              </div>
            </div>
          )}

          {step === "error" && (
            <div className="text-center space-y-6">
              <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-red-100 to-red-200 flex items-center justify-center">
                <span className="text-3xl">⚠️</span>
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-2">
                  Something went wrong
                </h2>
                <p className="text-gray-600 text-sm">
                  We couldn't generate your custom plan. Please try again.
                </p>
              </div>

              <div className="flex space-x-3">
                <Button
                  onClick={handleGeneratePlan}
                  className="flex-1 bg-gradient-to-r from-medical-blue-500 to-medical-blue-600 hover:from-medical-blue-600 hover:to-medical-blue-700 text-white font-semibold py-3"
                >
                  Try Again
                </Button>
                <Button
                  variant="outline"
                  onClick={() => navigate("/onboarding")}
                  className="flex-1 border-gray-300 text-gray-700 hover:bg-gray-50"
                >
                  Back to Onboarding
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CustomPlan;
