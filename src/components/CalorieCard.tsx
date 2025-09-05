import { Flame, Target, TrendingUp, Zap } from "lucide-react";
import React from "react";

interface CalorieCardProps {
  consumed: number;
  target: number;
  remaining: number;
  macros?: {
    carbs: { current: number; target: number };
    protein: { current: number; target: number };
    fat: { current: number; target: number };
  };
  className?: string;
}

export const CalorieCard: React.FC<CalorieCardProps> = ({
  consumed,
  target,
  remaining,
  macros,
  className = "",
}) => {
  const percentage = Math.min((consumed / target) * 100, 100);
  const isOverTarget = consumed > target;
  const isNearTarget = percentage >= 80 && percentage <= 100;

  // Calculate macro percentages
  const macroPercentages = macros
    ? {
        carbs: Math.min(
          (macros.carbs.current / macros.carbs.target) * 100,
          100
        ),
        protein: Math.min(
          (macros.protein.current / macros.protein.target) * 100,
          100
        ),
        fat: Math.min((macros.fat.current / macros.fat.target) * 100, 100),
      }
    : null;

  const getProgressColor = () => {
    if (isOverTarget) return "from-red-500 to-red-600";
    if (isNearTarget) return "from-orange-500 to-orange-600";
    return "from-emerald-500 to-emerald-600";
  };

  const getStatusColor = () => {
    if (isOverTarget) return "text-red-600";
    if (isNearTarget) return "text-orange-600";
    return "text-emerald-600";
  };

  const getStatusText = () => {
    if (isOverTarget) return "Over target";
    if (isNearTarget) return "Almost there";
    return "On track";
  };

  return (
    <div className={`space-y-3 sm:space-y-4 ${className}`}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-0">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl">
            <Flame className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
          </div>
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-gray-900">
              Daily Calories
            </h2>
            <p className="text-xs sm:text-sm text-gray-600">
              Track your energy intake
            </p>
          </div>
        </div>
        <div className="text-left sm:text-right">
          <div className={`text-sm font-medium ${getStatusColor()}`}>
            {getStatusText()}
          </div>
          <div className="text-xs text-gray-500">
            {percentage.toFixed(0)}% complete
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="space-y-4 sm:space-y-5">
        {/* Circular Progress */}
        <div className="flex items-center justify-center px-4">
          <div className="relative">
            {/* Background Circle */}
            <svg
              className="w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 transform -rotate-90"
              viewBox="0 0 120 120"
            >
              <circle
                cx="60"
                cy="60"
                r="50"
                stroke="currentColor"
                strokeWidth="8"
                fill="none"
                className="text-gray-200"
              />
              {/* Progress Circle */}
              <circle
                cx="60"
                cy="60"
                r="50"
                stroke="currentColor"
                strokeWidth="8"
                fill="none"
                strokeLinecap="round"
                strokeDasharray={`${2 * Math.PI * 50}`}
                strokeDashoffset={`${
                  2 * Math.PI * 50 * (1 - percentage / 100)
                }`}
                className={`text-transparent bg-gradient-to-r ${getProgressColor()} bg-clip-text`}
                style={{
                  background: `conic-gradient(from 0deg, ${
                    getProgressColor().includes("red")
                      ? "#ef4444"
                      : getProgressColor().includes("orange")
                      ? "#f97316"
                      : "#10b981"
                  } 0deg, ${
                    getProgressColor().includes("red")
                      ? "#dc2626"
                      : getProgressColor().includes("orange")
                      ? "#ea580c"
                      : "#059669"
                  } ${percentage * 3.6}deg, #e5e7eb ${percentage * 3.6}deg)`,
                  WebkitMask:
                    "radial-gradient(circle, transparent 42px, black 42px)",
                  mask: "radial-gradient(circle, transparent 42px, black 42px)",
                }}
              />
            </svg>

            {/* Center Content */}
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <div className="text-sm sm:text-base md:text-lg font-bold text-gray-900">
                {consumed.toLocaleString()}
              </div>
              <div className="text-xs text-gray-600">kcal</div>
              <div className="text-xs text-gray-500 mt-1">
                of {target.toLocaleString()}
              </div>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-3">
          <div className="text-center p-2 sm:p-3 bg-transparent rounded-xl border border-gray-200 shadow-sm">
            <div className="text-sm sm:text-base font-semibold text-gray-900">
              {target.toLocaleString()}
            </div>
            <div className="text-xs text-gray-600 flex items-center justify-center gap-1 mt-1">
              <Target className="w-3 h-3" />
              Target
            </div>
          </div>
          <div className="text-center p-2 sm:p-3 bg-transparent rounded-xl border border-gray-200 shadow-sm">
            <div
              className={`text-sm sm:text-base font-semibold ${
                isOverTarget ? "text-red-600" : "text-gray-900"
              }`}
            >
              {isOverTarget ? "+" : ""}
              {Math.abs(remaining).toLocaleString()}
            </div>
            <div className="text-xs text-gray-600 flex items-center justify-center gap-1 mt-1">
              <TrendingUp className="w-3 h-3" />
              {isOverTarget ? "Over" : "Remaining"}
            </div>
          </div>
          <div className="text-center p-2 sm:p-3 bg-transparent rounded-xl border border-gray-200 shadow-sm">
            <div className="text-sm sm:text-base font-semibold text-gray-900">
              {percentage.toFixed(0)}%
            </div>
            <div className="text-xs text-gray-600 flex items-center justify-center gap-1 mt-1">
              <Zap className="w-3 h-3" />
              Progress
            </div>
          </div>
        </div>

        {/* Macro Breakdown */}
        {macros && macroPercentages && (
          <div className="bg-transparent rounded-xl border border-gray-200 shadow-sm p-3 sm:p-4">
            <h4 className="text-sm sm:text-base font-semibold text-gray-900 mb-2 sm:mb-3">
              Macronutrients
            </h4>

            <div className="space-y-2 sm:space-y-3">
              {/* Carbs */}
              <div className="space-y-1 sm:space-y-2">
                <div className="flex justify-between text-xs sm:text-sm">
                  <span className="text-gray-600">Carbohydrates</span>
                  <span className="font-medium text-gray-900">
                    {macros.carbs.current}g / {macros.carbs.target}g
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2 sm:h-3">
                  <div
                    className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 sm:h-3 rounded-full transition-all duration-500"
                    style={{ width: `${macroPercentages.carbs}%` }}
                  />
                </div>
              </div>

              {/* Protein */}
              <div className="space-y-1 sm:space-y-2">
                <div className="flex justify-between text-xs sm:text-sm">
                  <span className="text-gray-600">Protein</span>
                  <span className="font-medium text-gray-900">
                    {macros.protein.current}g / {macros.protein.target}g
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2 sm:h-3">
                  <div
                    className="bg-gradient-to-r from-green-500 to-green-600 h-2 sm:h-3 rounded-full transition-all duration-500"
                    style={{ width: `${macroPercentages.protein}%` }}
                  />
                </div>
              </div>

              {/* Fat */}
              <div className="space-y-1 sm:space-y-2">
                <div className="flex justify-between text-xs sm:text-sm">
                  <span className="text-gray-600">Fat</span>
                  <span className="font-medium text-gray-900">
                    {macros.fat.current}g / {macros.fat.target}g
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2 sm:h-3">
                  <div
                    className="bg-gradient-to-r from-purple-500 to-purple-600 h-2 sm:h-3 rounded-full transition-all duration-500"
                    style={{ width: `${macroPercentages.fat}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Motivational Message */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-100 p-2 sm:p-3">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-blue-500 rounded-lg flex-shrink-0">
              <Zap className="w-3 h-3 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-xs font-medium text-blue-900">
                {isOverTarget
                  ? "Time to burn some calories!"
                  : isNearTarget
                  ? "You're almost at your goal!"
                  : "Great progress today!"}
              </div>
              <div className="text-xs text-blue-700">
                {isOverTarget
                  ? "Consider some light exercise to balance your intake."
                  : isNearTarget
                  ? "Just a little more to reach your target."
                  : "Keep up the excellent work!"}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
