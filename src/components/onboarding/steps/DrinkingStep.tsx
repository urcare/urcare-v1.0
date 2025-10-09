import {
  AlertTriangle,
  CheckCircle,
  Clock,
  Droplets,
  Wine,
} from "lucide-react";
import React from "react";

interface DrinkingStepProps {
  value: string;
  onChange: (value: string) => void;
  error?: string;
}

const drinkingOptions = [
  {
    value: "Never drink",
    icon: CheckCircle,
    color: "text-green-500",
    description: "No alcohol consumption",
  },
  {
    value: "Occasionally",
    icon: Clock,
    color: "text-blue-500",
    description: "Drink on special occasions",
  },
  {
    value: "Moderately",
    icon: Droplets,
    color: "text-yellow-500",
    description: "1-2 drinks per week",
  },
  {
    value: "Regularly",
    icon: Wine,
    color: "text-orange-500",
    description: "3+ drinks per week",
  },
  {
    value: "Heavily",
    icon: AlertTriangle,
    color: "text-red-500",
    description: "Daily or excessive drinking",
  },
];

export const DrinkingStep: React.FC<DrinkingStepProps> = ({
  value,
  onChange,
  error,
}) => (
  <div className="w-full space-y-6">
    <div className="flex justify-center">
      <div className="w-full max-w-2xl">
        <div className="grid grid-cols-2 gap-4">
          {drinkingOptions.map((option) => {
            const IconComponent = option.icon;
            return (
              <button
                key={option.value}
                onClick={() => onChange(option.value)}
                    className={`p-6 rounded-2xl border-2 transition-all duration-200 text-center font-medium flex flex-col items-center gap-3 ${
                      value === option.value
                        ? "text-white shadow-lg scale-105"
                        : "border-gray-200 bg-white text-gray-700 hover:border-gray-300 hover:bg-gray-50"
                    }`}
                    style={value === option.value ? { 
                      borderColor: '#008000', 
                      backgroundColor: '#008000' 
                    } : {}}
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
