import { User, UserX, Users } from "lucide-react";
import React from "react";

interface GenderStepProps {
  value: string;
  onChange: (value: string) => void;
  error?: string;
}

const genderOptions = [
  { value: "Male", icon: User, color: "text-blue-600" },
  { value: "Female", icon: User, color: "text-pink-600" },
  { value: "Other", icon: Users, color: "text-purple-600" },
  { value: "Prefer not to say", icon: UserX, color: "text-gray-600" },
];

export const GenderStep: React.FC<GenderStepProps> = ({
  value,
  onChange,
  error,
}) => (
  <div className="w-full space-y-6">
    <div className="flex justify-center">
      <div className="w-full max-w-sm">
        <div className="grid grid-cols-2 gap-4">
          {genderOptions.map((option) => {
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
