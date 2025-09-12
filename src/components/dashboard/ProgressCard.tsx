import { ChevronDown, TrendingUp, Volume2 } from "lucide-react";
import React from "react";

interface ProgressCardProps {
  progressPercentage: number;
  caloriesGoal: number;
  currentDate: string;
}

export const ProgressCard: React.FC<ProgressCardProps> = ({
  progressPercentage = 91,
  caloriesGoal = 1350,
  currentDate = "19 September",
}) => {
  return (
    <div className="bg-blue-100 rounded-2xl p-4 shadow-lg">
      {/* Header with icon and title */}
      <div className="flex items-center gap-2 mb-3">
        <div className="w-6 h-6 bg-blue-200 rounded-lg flex items-center justify-center">
          <TrendingUp className="w-4 h-4 text-blue-700" />
        </div>
        <h3 className="text-base font-semibold text-gray-800">Your Progress</h3>
      </div>

      <div className="flex items-center justify-between">
        {/* Left side - Progress percentage and date */}
        <div className="flex flex-col">
          <div className="text-3xl font-bold text-gray-800 mb-1">
            {progressPercentage}%
          </div>
          <div className="flex items-center gap-1 text-gray-600">
            <span className="text-xs">{currentDate}</span>
            <ChevronDown className="w-3 h-3" />
          </div>
        </div>

        {/* Right side - Circular progress with calories */}
        <div className="relative">
          {/* Alert icon */}
          <div className="absolute -top-1 -right-1 w-5 h-5 bg-yellow-400 rounded-full flex items-center justify-center">
            <Volume2 className="w-2.5 h-2.5 text-yellow-800" />
          </div>

          {/* Circular progress */}
          <div className="w-20 h-20 relative">
            <svg
              className="w-20 h-20 transform -rotate-90"
              viewBox="0 0 100 100"
            >
              {/* Background circle */}
              <circle
                cx="50"
                cy="50"
                r="40"
                stroke="#e5e7eb"
                strokeWidth="6"
                fill="none"
              />
              {/* Progress circle */}
              <circle
                cx="50"
                cy="50"
                r="40"
                stroke="#3b82f6"
                strokeWidth="6"
                fill="none"
                strokeDasharray={`${2 * Math.PI * 40}`}
                strokeDashoffset={`${
                  2 * Math.PI * 40 * (1 - progressPercentage / 100)
                }`}
                strokeLinecap="round"
                className="transition-all duration-500"
              />
            </svg>

            {/* Center text */}
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-xs font-semibold text-gray-800">
                {caloriesGoal}
              </span>
              <span className="text-xs text-gray-600">Calories</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
