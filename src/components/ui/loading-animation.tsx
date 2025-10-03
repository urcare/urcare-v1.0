import React from "react";
import { cn } from "@/lib/utils";

interface LoadingAnimationProps {
  className?: string;
  size?: "sm" | "md" | "lg";
  variant?: "default" | "ai-thinking" | "pulse";
}

export const LoadingAnimation: React.FC<LoadingAnimationProps> = ({
  className,
  size = "md",
  variant = "ai-thinking",
}) => {
  const sizeClasses = {
    sm: "w-8 h-8",
    md: "w-12 h-12",
    lg: "w-16 h-16",
  };

  const variantClasses = {
    default: "animate-spin",
    "ai-thinking": "animate-ai-thinking",
    pulse: "animate-medical-pulse",
  };

  return (
    <div className={cn("flex items-center justify-center", className)}>
      <div
        className={cn(
          "relative",
          sizeClasses[size],
          variantClasses[variant]
        )}
      >
        {/* Main circle */}
        <div className="w-full h-full rounded-full border-4 border-medical-blue-200 bg-gradient-to-br from-medical-blue-50 to-medical-blue-100 flex items-center justify-center">
          <div className="w-1/2 h-1/2 rounded-full bg-gradient-to-br from-medical-blue-400 to-medical-blue-600 flex items-center justify-center">
            <div className="w-1/3 h-1/3 rounded-full bg-white animate-pulse" />
          </div>
        </div>
        
        {/* Orbiting dots */}
        <div className="absolute inset-0 animate-spin">
          <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <div className="w-2 h-2 bg-medical-teal-400 rounded-full animate-pulse" />
          </div>
          <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2">
            <div className="w-2 h-2 bg-medical-green-400 rounded-full animate-pulse" />
          </div>
          <div className="absolute left-0 top-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <div className="w-2 h-2 bg-medical-blue-400 rounded-full animate-pulse" />
          </div>
          <div className="absolute right-0 top-1/2 transform translate-x-1/2 -translate-y-1/2">
            <div className="w-2 h-2 bg-medical-teal-500 rounded-full animate-pulse" />
          </div>
        </div>
      </div>
    </div>
  );
};

export const AIThinkingAnimation: React.FC<{ className?: string }> = ({
  className,
}) => {
  return (
    <div className={cn("flex flex-col items-center space-y-4", className)}>
      <LoadingAnimation size="lg" variant="ai-thinking" />
      <div className="text-center space-y-2">
        <h3 className="text-lg font-semibold text-gray-900">
          AI is analyzing your data...
        </h3>
        <p className="text-sm text-gray-600 max-w-xs">
          Creating your personalized health plan with diet, workout, and lifestyle recommendations
        </p>
      </div>
      
      {/* Progress dots */}
      <div className="flex space-x-2">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="w-2 h-2 bg-medical-blue-400 rounded-full animate-pulse"
            style={{
              animationDelay: `${i * 0.2}s`,
              animationDuration: "1.4s",
            }}
          />
        ))}
      </div>
    </div>
  );
};

export const ProgressSteps: React.FC<{
  steps: string[];
  currentStep: number;
  className?: string;
}> = ({ steps, currentStep, className }) => {
  return (
    <div className={cn("w-full space-y-3", className)}>
      {steps.map((step, index) => (
        <div
          key={index}
          className={cn(
            "flex items-center space-x-3 p-3 rounded-lg transition-all duration-300",
            index <= currentStep
              ? "bg-medical-blue-50 border border-medical-blue-200"
              : "bg-gray-50 border border-gray-200"
          )}
        >
          <div
            className={cn(
              "w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium transition-all duration-300",
              index < currentStep
                ? "bg-medical-green-500 text-white"
                : index === currentStep
                ? "bg-medical-blue-500 text-white animate-pulse"
                : "bg-gray-300 text-gray-600"
            )}
          >
            {index < currentStep ? "✓" : index + 1}
          </div>
          <span
            className={cn(
              "text-sm font-medium transition-colors duration-300",
              index <= currentStep
                ? "text-gray-900"
                : "text-gray-500"
            )}
          >
            {step}
          </span>
        </div>
      ))}
    </div>
  );
};
