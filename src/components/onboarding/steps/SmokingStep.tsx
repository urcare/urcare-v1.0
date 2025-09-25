import { AlertTriangle, CheckCircle, Clock, X } from "lucide-react";
import React from "react";

interface SmokingStepProps {
  value: string;
  onChange: (value: string) => void;
  error?: string;
}

const smokingOptions = [
  {
    value: "Never smoked",
    icon: CheckCircle,
    color: "text-green-500",
    description: "No smoking history",
  },
  {
    value: "Former smoker",
    icon: Clock,
    color: "text-yellow-500",
    description: "Quit smoking previously",
  },
  {
    value: "Occasional smoker",
    icon: AlertTriangle,
    color: "text-orange-500",
    description: "Smoke occasionally",
  },
  {
    value: "Regular smoker",
    icon: X,
    color: "text-red-500",
    description: "Smoke regularly",
  },
];

export const SmokingStep: React.FC<SmokingStepProps> = ({
  value,
  onChange,
  error,
}) => (
  <div className="w-full space-y-6">
    <div className="flex justify-center">
      <div className="w-full max-w-2xl">
        <div className="grid grid-cols-2 gap-4">
          {smokingOptions.map((option) => {
            const IconComponent = option.icon;
            return (
              <button
                key={option.value}
                onClick={() => onChange(option.value)}
                className={`p-6 rounded-2xl border-2 transition-all duration-200 text-center font-medium flex flex-col items-center gap-3 ${
                  value === option.value
                    ? "border-primary bg-primary text-white shadow-lg scale-105"
                    : "border-gray-200 bg-white text-gray-700 hover:border-primary/30 hover:bg-primary/5"
                }`}
              >
                <IconComponent
                  className={`w-8 h-8 ${
                    value === option.value ? "text-white" : option.color
                  }`}
                />
                <span className="text-base font-semibold leading-tight">
                  {option.value}
                </span>
                <span className="text-xs opacity-75">{option.description}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>

    {error && (
      <div className="text-red-500 text-sm text-center mt-3">{error}</div>
    )}
  </div>
);
