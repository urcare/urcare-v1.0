import {
  Activity,
  AlertCircle,
  Brain,
  CheckCircle,
  Heart,
  Loader2,
  Target,
  Utensils,
  Zap,
} from "lucide-react";
import React, { useEffect, useState } from "react";

interface ProgressStep {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  status: "pending" | "active" | "completed" | "error";
  percentage: number;
}

interface HealthPlanProgressProps {
  isGenerating: boolean;
  currentStep?: string;
  error?: string;
  onComplete?: () => void;
}

export const HealthPlanProgress: React.FC<HealthPlanProgressProps> = ({
  isGenerating,
  currentStep,
  error,
  onComplete,
}) => {
  const [progress, setProgress] = useState(0);
  const [activeStepIndex, setActiveStepIndex] = useState(0);

  const steps: ProgressStep[] = [
    {
      id: "analyzing",
      title: "Analyzing Your Profile",
      description: "Processing your health data, goals, and preferences",
      icon: <Brain className="w-5 h-5" />,
      status: "pending",
      percentage: 15,
    },
    {
      id: "disease-detection",
      title: "Detecting Health Conditions",
      description:
        "Identifying specific health conditions and optimization areas",
      icon: <Heart className="w-5 h-5" />,
      status: "pending",
      percentage: 25,
    },
    {
      id: "nutrition-plan",
      title: "Creating Nutrition Plan",
      description: "Designing personalized meal plans with scientific backing",
      icon: <Utensils className="w-5 h-5" />,
      status: "pending",
      percentage: 45,
    },
    {
      id: "exercise-protocol",
      title: "Building Exercise Protocol",
      description: "Developing targeted workout routines and movement plans",
      icon: <Activity className="w-5 h-5" />,
      status: "pending",
      percentage: 65,
    },
    {
      id: "lifestyle-integration",
      title: "Integrating Lifestyle",
      description: "Optimizing sleep, stress management, and daily routines",
      icon: <Target className="w-5 h-5" />,
      status: "pending",
      percentage: 80,
    },
    {
      id: "finalizing",
      title: "Finalizing Plan",
      description: "Adding progress tracking and safety protocols",
      icon: <Zap className="w-5 h-5" />,
      status: "pending",
      percentage: 100,
    },
  ];

  useEffect(() => {
    if (!isGenerating) {
      setProgress(0);
      setActiveStepIndex(0);
      return;
    }

    // Simulate progress updates based on current step
    const stepMap: { [key: string]: number } = {
      analyzing: 0,
      "disease-detection": 1,
      "nutrition-plan": 2,
      "exercise-protocol": 3,
      "lifestyle-integration": 4,
      finalizing: 5,
    };

    const currentIndex = currentStep ? stepMap[currentStep] || 0 : 0;
    setActiveStepIndex(currentIndex);
    setProgress(steps[currentIndex]?.percentage || 0);

    // Simulate progress within current step
    const interval = setInterval(() => {
      setProgress((prev) => {
        const nextProgress = prev + Math.random() * 2;
        const maxProgress = steps[currentIndex]?.percentage || 100;
        return Math.min(nextProgress, maxProgress);
      });
    }, 200);

    return () => clearInterval(interval);
  }, [isGenerating, currentStep]);

  useEffect(() => {
    if (progress >= 100 && isGenerating) {
      setTimeout(() => {
        onComplete?.();
      }, 500);
    }
  }, [progress, isGenerating, onComplete]);

  if (!isGenerating && !error) {
    return null;
  }

  return (
    <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
      <div className="mb-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          Creating Your Personalized Health Plan
        </h3>
        <p className="text-gray-600">
          Our AI is analyzing your data and creating a comprehensive plan
          tailored to your needs
        </p>
      </div>

      {/* Progress Bar */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-gray-700">Progress</span>
          <span className="text-sm font-medium text-blue-600">
            {Math.round(progress)}%
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3">
          <div
            className="bg-gradient-to-r from-blue-500 to-blue-600 h-3 rounded-full transition-all duration-300 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Steps */}
      <div className="space-y-4">
        {steps.map((step, index) => {
          const isActive = index === activeStepIndex;
          const isCompleted = index < activeStepIndex;
          const isPending = index > activeStepIndex;

          return (
            <div
              key={step.id}
              className={`flex items-start space-x-3 p-3 rounded-lg transition-all duration-300 ${
                isActive
                  ? "bg-blue-50 border border-blue-200"
                  : isCompleted
                  ? "bg-green-50 border border-green-200"
                  : "bg-gray-50 border border-gray-200"
              }`}
            >
              <div
                className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                  isActive
                    ? "bg-blue-100 text-blue-600"
                    : isCompleted
                    ? "bg-green-100 text-green-600"
                    : "bg-gray-100 text-gray-400"
                }`}
              >
                {isCompleted ? (
                  <CheckCircle className="w-5 h-5" />
                ) : isActive ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  step.icon
                )}
              </div>

              <div className="flex-1 min-w-0">
                <h4
                  className={`text-sm font-medium ${
                    isActive
                      ? "text-blue-900"
                      : isCompleted
                      ? "text-green-900"
                      : "text-gray-700"
                  }`}
                >
                  {step.title}
                </h4>
                <p
                  className={`text-xs ${
                    isActive
                      ? "text-blue-700"
                      : isCompleted
                      ? "text-green-700"
                      : "text-gray-500"
                  }`}
                >
                  {step.description}
                </p>

                {isActive && (
                  <div className="mt-2">
                    <div className="w-full bg-blue-200 rounded-full h-1">
                      <div
                        className="bg-blue-500 h-1 rounded-full transition-all duration-500"
                        style={{
                          width: `${
                            ((progress - (steps[index - 1]?.percentage || 0)) /
                              (step.percentage -
                                (steps[index - 1]?.percentage || 0))) *
                            100
                          }%`,
                        }}
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Error State */}
      {error && (
        <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-center space-x-2 text-red-600">
            <AlertCircle className="w-5 h-5" />
            <span className="font-medium">Error generating plan</span>
          </div>
          <p className="text-red-500 mt-2 text-sm">{error}</p>
        </div>
      )}

      {/* Additional Info */}
      <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <div className="flex items-start space-x-2">
          <div className="flex-shrink-0 w-5 h-5 text-blue-600 mt-0.5">
            <Brain className="w-5 h-5" />
          </div>
          <div className="text-sm text-blue-800">
            <p className="font-medium mb-1">
              What's happening behind the scenes:
            </p>
            <ul className="space-y-1 text-xs">
              <li>• Analyzing your health profile and medical history</li>
              <li>• Applying evidence-based protocols for your conditions</li>
              <li>• Creating personalized nutrition and exercise plans</li>
              <li>• Integrating cultural preferences and lifestyle factors</li>
              <li>• Adding comprehensive progress tracking systems</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
