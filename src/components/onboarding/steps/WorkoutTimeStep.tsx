import { Calendar, Clock, Moon, Sun, Sunrise, Sunset } from "lucide-react";
import React from "react";

interface WorkoutTimeStepProps {
  value: string;
  onChange: (value: string) => void;
  error?: string;
}

const workoutTimes = [
  { value: "Morning (06:00-10:00)", icon: Sunrise, color: "text-orange-500" },
  { value: "Afternoon (12:00-16:00)", icon: Sun, color: "text-yellow-500" },
  { value: "Evening (17:00-21:00)", icon: Sunset, color: "text-red-500" },
  { value: "Night (21:00-00:00)", icon: Moon, color: "text-purple-500" },
  { value: "Flexible", icon: Clock, color: "text-blue-500" },
  { value: "Other", icon: Calendar, color: "text-gray-500" },
];

export const WorkoutTimeStep: React.FC<WorkoutTimeStepProps> = ({
  value,
  onChange,
  error,
}) => (
  <div className="w-full space-y-6">
    <div className="flex justify-center">
      <div className="w-full max-w-lg">
        <div className="grid grid-cols-2 gap-4">
          {workoutTimes.map((option) => {
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
