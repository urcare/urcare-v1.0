import {
  Apple,
  Beef,
  Carrot,
  Dumbbell,
  Fish,
  Leaf,
  Utensils,
  Wheat,
} from "lucide-react";
import React from "react";

interface DietTypeStepProps {
  value: string;
  onChange: (value: string) => void;
  error?: string;
}

const dietTypes = [
  { value: "Balanced", icon: Apple, color: "text-green-500" },
  { value: "Vegetarian", icon: Carrot, color: "text-orange-500" },
  { value: "Vegan", icon: Leaf, color: "text-emerald-500" },
  { value: "Keto", icon: Beef, color: "text-red-500" },
  { value: "Paleo", icon: Fish, color: "text-blue-500" },
  { value: "Low Carb", icon: Wheat, color: "text-yellow-500" },
  { value: "High Protein", icon: Dumbbell, color: "text-purple-500" },
  { value: "Other", icon: Utensils, color: "text-gray-500" },
];

export const DietTypeStep: React.FC<DietTypeStepProps> = ({
  value,
  onChange,
  error,
}) => (
  <div className="w-full space-y-6">
    <div className="flex justify-center">
      <div className="w-full max-w-lg">
        <div className="grid grid-cols-2 gap-4">
          {dietTypes.map((option) => {
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
                <span className="text-base font-semibold">{option.value}</span>
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
