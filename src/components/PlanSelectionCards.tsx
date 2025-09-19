import { Activity, CheckCircle, Clock, Target, Zap } from "lucide-react";
import React from "react";

interface PlanData {
  id: string;
  name: string;
  difficulty: "easy" | "moderate" | "hard";
  description: string;
  duration: string;
  features: string[];
  timetable: Array<{
    time: string;
    activity: string;
    duration: string;
    type: "morning" | "meal" | "exercise" | "work" | "evening" | "sleep";
    description?: string;
  }>;
}

interface PlanSelectionCardsProps {
  plans: PlanData[];
  onPlanSelect: (plan: PlanData) => void;
  onViewPlanDetails?: (plan: PlanData) => void;
}

export const PlanSelectionCards: React.FC<PlanSelectionCardsProps> = ({
  plans,
  onPlanSelect,
  onViewPlanDetails,
}) => {
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "easy":
        return "bg-green-50 border-green-200 hover:bg-green-100";
      case "moderate":
        return "bg-yellow-50 border-yellow-200 hover:bg-yellow-100";
      case "hard":
        return "bg-red-50 border-red-200 hover:bg-red-100";
      default:
        return "bg-gray-50 border-gray-200 hover:bg-gray-100";
    }
  };

  const getDifficultyIcon = (difficulty: string) => {
    switch (difficulty) {
      case "easy":
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case "moderate":
        return <Target className="w-5 h-5 text-yellow-600" />;
      case "hard":
        return <Zap className="w-5 h-5 text-red-600" />;
      default:
        return <Activity className="w-5 h-5 text-gray-600" />;
    }
  };

  const getDifficultyBadge = (difficulty: string) => {
    switch (difficulty) {
      case "easy":
        return "bg-green-100 text-green-800";
      case "moderate":
        return "bg-yellow-100 text-yellow-800";
      case "hard":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="px-3 mb-4">
      <div className="text-center mb-4">
        <h2 className="text-lg font-bold text-gray-800 mb-2">
          Choose Your Plan
        </h2>
        <p className="text-sm text-gray-600">
          Select the intensity level that works best for you
        </p>
      </div>

      <div className="space-y-3">
        {plans.map((plan) => (
          <div
            key={plan.id}
            onClick={() => onPlanSelect(plan)}
            className={`p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 ${getDifficultyColor(
              plan.difficulty
            )}`}
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                {getDifficultyIcon(plan.difficulty)}
                <div>
                  <h3 className="font-semibold text-gray-800 capitalize">
                    {plan.name}
                  </h3>
                  <p className="text-sm text-gray-600">{plan.description}</p>
                </div>
              </div>
              <div
                className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyBadge(
                  plan.difficulty
                )}`}
              >
                {plan.difficulty}
              </div>
            </div>

            <div className="flex items-center gap-4 mb-3">
              <div className="flex items-center gap-1 text-sm text-gray-600">
                <Clock className="w-4 h-4" />
                <span>{plan.duration}</span>
              </div>
              <div className="flex items-center gap-1 text-sm text-gray-600">
                <Activity className="w-4 h-4" />
                <span>{plan.timetable.length} activities</span>
              </div>
            </div>

            <div className="space-y-1">
              <p className="text-xs font-medium text-gray-700">Key Features:</p>
              <div className="flex flex-wrap gap-1">
                {plan.features.slice(0, 3).map((feature, index) => (
                  <span
                    key={index}
                    className="text-xs bg-white/60 px-2 py-1 rounded-full text-gray-700"
                  >
                    {feature}
                  </span>
                ))}
                {plan.features.length > 3 && (
                  <span className="text-xs text-gray-500">
                    +{plan.features.length - 3} more
                  </span>
                )}
              </div>
            </div>

            <div className="mt-3 pt-3 border-t border-white/50">
              <div className="flex gap-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onPlanSelect(plan);
                  }}
                  className="flex-1 bg-white/80 text-gray-700 px-3 py-2 rounded-lg text-sm font-medium hover:bg-white transition-colors"
                >
                  Start Plan
                </button>
                {onViewPlanDetails && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onViewPlanDetails(plan);
                    }}
                    className="flex-1 bg-blue-500 text-white px-3 py-2 rounded-lg text-sm font-medium hover:bg-blue-600 transition-colors"
                  >
                    View Details
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
