import { Calendar, Clock, Zap } from "lucide-react";
import React from "react";

interface RoutineFlexibilityStepProps {
  value: string;
  onChange: (value: string) => void;
  error?: string;
}

const flexibilityLevels = [
  {
    value: "1",
    label: "Very Rigid",
    description: "Strict schedule, no changes",
    icon: Clock,
    color: "text-red-500",
  },
  {
    value: "2",
    label: "Rigid",
    description: "Mostly fixed routine",
    icon: Clock,
    color: "text-orange-500",
  },
  {
    value: "3",
    label: "Somewhat Rigid",
    description: "Slight flexibility",
    icon: Clock,
    color: "text-yellow-500",
  },
  {
    value: "4",
    label: "Moderate",
    description: "Balanced flexibility",
    icon: Calendar,
    color: "text-blue-500",
  },
  {
    value: "5",
    label: "Flexible",
    description: "Good adaptability",
    icon: Calendar,
    color: "text-green-500",
  },
  {
    value: "6",
    label: "Very Flexible",
    description: "Highly adaptable",
    icon: Zap,
    color: "text-purple-500",
  },
  {
    value: "7",
    label: "Extremely Flexible",
    description: "Maximum adaptability",
    icon: Zap,
    color: "text-indigo-500",
  },
  {
    value: "8",
    label: "Ultra Flexible",
    description: "Complete freedom",
    icon: Zap,
    color: "text-pink-500",
  },
  {
    value: "9",
    label: "Super Flexible",
    description: "No schedule constraints",
    icon: Zap,
    color: "text-rose-500",
  },
  {
    value: "10",
    label: "Maximum Flexibility",
    description: "Complete spontaneity",
    icon: Zap,
    color: "text-violet-500",
  },
];

export const RoutineFlexibilityStep: React.FC<RoutineFlexibilityStepProps> = ({
  value,
  onChange,
  error,
}) => {
  const currentLevel =
    flexibilityLevels.find((level) => level.value === value) ||
    flexibilityLevels[4];
  const IconComponent = currentLevel.icon;

  return (
    <div className="w-full space-y-6">
      <div className="flex justify-center">
        <div className="w-full max-w-md">
          {/* Current Level Display */}
          <div className="text-center mb-6">
            <div className="flex items-center justify-center gap-3 mb-3">
              <IconComponent className={`w-8 h-8 ${currentLevel.color}`} />
              <div>
                <h3 className="text-xl font-bold text-gray-900">
                  {currentLevel.label}
                </h3>
                <p className="text-sm text-gray-600">
                  {currentLevel.description}
                </p>
              </div>
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-2">
              {value}/10
            </div>
          </div>

          {/* Slider */}
          <div className="space-y-4">
            <input
              type="range"
              min="1"
              max="10"
              value={value}
              onChange={(e) => onChange(e.target.value)}
              className="w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
              style={{
                background: `linear-gradient(to right, #ef4444 0%, #f97316 10%, #eab308 20%, #3b82f6 30%, #22c55e 40%, #8b5cf6 50%, #6366f1 60%, #ec4899 70%, #f43f5e 80%, #8b5cf6 100%)`,
              }}
            />

            {/* Level Indicators */}
            <div className="flex justify-between text-xs text-gray-500 px-2">
              <span>Rigid</span>
              <span>Flexible</span>
            </div>
          </div>

          {/* Quick Selection Buttons */}
          <div className="grid grid-cols-2 gap-3 mt-6">
            <button
              onClick={() => onChange("3")}
              className={`p-3 rounded-xl border-2 transition-all duration-200 text-sm ${
                value === "3"
                  ? "border-primary bg-primary text-white"
                  : "border-gray-200 bg-white text-gray-700 hover:border-primary/30"
              }`}
            >
              Somewhat Rigid
            </button>
            <button
              onClick={() => onChange("5")}
              className={`p-3 rounded-xl border-2 transition-all duration-200 text-sm ${
                value === "5"
                  ? "border-primary bg-primary text-white"
                  : "border-gray-200 bg-white text-gray-700 hover:border-primary/30"
              }`}
            >
              Flexible
            </button>
            <button
              onClick={() => onChange("7")}
              className={`p-3 rounded-xl border-2 transition-all duration-200 text-sm ${
                value === "7"
                  ? "border-primary bg-primary text-white"
                  : "border-gray-200 bg-white text-gray-700 hover:border-primary/30"
              }`}
            >
              Very Flexible
            </button>
            <button
              onClick={() => onChange("10")}
              className={`p-3 rounded-xl border-2 transition-all duration-200 text-sm ${
                value === "10"
                  ? "border-primary bg-primary text-white"
                  : "border-gray-200 bg-white text-gray-700 hover:border-primary/30"
              }`}
            >
              Maximum Flexibility
            </button>
          </div>
        </div>
      </div>

      {error && (
        <div className="text-red-500 text-sm text-center mt-3">{error}</div>
      )}
    </div>
  );
};
