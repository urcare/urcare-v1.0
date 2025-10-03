import {
  ComprehensiveHealthPlan,
  PLAN_TYPE_DEFINITIONS,
} from "@/types/comprehensiveHealthPlan";
import {
  AlertCircle,
  Calendar,
  CheckCircle,
  Clock,
  Target,
  TrendingUp,
} from "lucide-react";

interface PlanData {
  id: string;
  name: string;
  difficulty: "easy" | "moderate" | "hard";
  description: string;
  duration: string;
  features: string[];
  plan_type?: ComprehensiveHealthPlan["plan_type"];
  duration_weeks?: number;
  expected_outcomes?: string[];
  key_milestones?: string[];
  comprehensive_plan?: ComprehensiveHealthPlan;
}

interface ComprehensivePlanSelectionCardsProps {
  plans: PlanData[];
  onPlanSelect: (plan: PlanData) => void;
  onViewPlanDetails: (plan: PlanData) => void;
}

export const ComprehensivePlanSelectionCards = ({
  plans,
  onPlanSelect,
  onViewPlanDetails,
}: ComprehensivePlanSelectionCardsProps) => {
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "easy":
        return "bg-green-100 text-green-800 border-green-200";
      case "moderate":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "hard":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getPlanTypeIcon = (planType?: ComprehensiveHealthPlan["plan_type"]) => {
    switch (planType) {
      case "quick_win":
        return <TrendingUp className="w-5 h-5" />;
      case "habit_formation":
        return <CheckCircle className="w-5 h-5" />;
      case "health_transformation":
        return <Target className="w-5 h-5" />;
      case "disease_management":
        return <AlertCircle className="w-5 h-5" />;
      case "lifestyle_change":
        return <Calendar className="w-5 h-5" />;
      default:
        return <Target className="w-5 h-5" />;
    }
  };

  const getPlanTypeColor = (
    planType?: ComprehensiveHealthPlan["plan_type"]
  ) => {
    switch (planType) {
      case "quick_win":
        return "text-yellow-600";
      case "habit_formation":
        return "text-green-600";
      case "health_transformation":
        return "text-blue-600";
      case "disease_management":
        return "text-red-600";
      case "lifestyle_change":
        return "text-purple-600";
      default:
        return "text-gray-600";
    }
  };

  const formatDuration = (durationWeeks?: number, duration?: string) => {
    if (durationWeeks) {
      if (durationWeeks < 2) return `${durationWeeks} week`;
      if (durationWeeks < 8) return `${durationWeeks} weeks`;
      if (durationWeeks < 52)
        return `${durationWeeks} weeks (${Math.ceil(
          durationWeeks / 4
        )} months)`;
      return `${durationWeeks} weeks (${Math.ceil(durationWeeks / 52)} year${
        durationWeeks >= 104 ? "s" : ""
      })`;
    }
    return duration || "Duration varies";
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Choose Your Health Journey
        </h2>
        <p className="text-gray-600">
          Select a plan that matches your commitment level and timeline
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {plans.map((plan, index) => (
          <div
            key={plan.id}
            className={`relative bg-white rounded-xl shadow-lg border-2 transition-all duration-300 hover:shadow-xl hover:scale-105 ${
              index === 1
                ? "border-blue-300 ring-2 ring-blue-100"
                : "border-gray-200"
            }`}
          >
            {/* Recommended Badge */}
            {index === 1 && (
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <span className="bg-blue-600 text-white px-4 py-1 rounded-full text-sm font-medium">
                  Recommended
                </span>
              </div>
            )}

            <div className="p-6">
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <div className={getPlanTypeColor(plan.plan_type)}>
                    {getPlanTypeIcon(plan.plan_type)}
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">
                      {plan.name}
                    </h3>
                    {plan.plan_type && (
                      <p className="text-sm text-gray-500">
                        {PLAN_TYPE_DEFINITIONS[plan.plan_type].name}
                      </p>
                    )}
                  </div>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium border ${getDifficultyColor(
                    plan.difficulty
                  )}`}
                >
                  {plan.difficulty}
                </span>
              </div>

              {/* Duration */}
              <div className="flex items-center space-x-2 mb-3">
                <Clock className="w-4 h-4 text-gray-500" />
                <span className="text-sm font-medium text-gray-700">
                  {formatDuration(plan.duration_weeks, plan.duration)}
                </span>
              </div>

              {/* Description */}
              <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                {plan.description}
              </p>

              {/* Expected Outcomes */}
              {plan.expected_outcomes && plan.expected_outcomes.length > 0 && (
                <div className="mb-4">
                  <h4 className="text-sm font-semibold text-gray-800 mb-2">
                    Expected Outcomes:
                  </h4>
                  <ul className="space-y-1">
                    {plan.expected_outcomes.slice(0, 3).map((outcome, idx) => (
                      <li key={idx} className="flex items-start space-x-2">
                        <CheckCircle className="w-3 h-3 text-green-500 mt-0.5 flex-shrink-0" />
                        <span className="text-xs text-gray-600">{outcome}</span>
                      </li>
                    ))}
                    {plan.expected_outcomes.length > 3 && (
                      <li className="text-xs text-gray-500 ml-5">
                        +{plan.expected_outcomes.length - 3} more outcomes
                      </li>
                    )}
                  </ul>
                </div>
              )}

              {/* Key Milestones */}
              {plan.key_milestones && plan.key_milestones.length > 0 && (
                <div className="mb-4">
                  <h4 className="text-sm font-semibold text-gray-800 mb-2">
                    Key Milestones:
                  </h4>
                  <ul className="space-y-1">
                    {plan.key_milestones.slice(0, 2).map((milestone, idx) => (
                      <li key={idx} className="flex items-start space-x-2">
                        <Target className="w-3 h-3 text-blue-500 mt-0.5 flex-shrink-0" />
                        <span className="text-xs text-gray-600">
                          {milestone}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Features */}
              <div className="mb-6">
                <h4 className="text-sm font-semibold text-gray-800 mb-2">
                  What's Included:
                </h4>
                <ul className="space-y-1">
                  {plan.features.slice(0, 4).map((feature, idx) => (
                    <li key={idx} className="flex items-start space-x-2">
                      <CheckCircle className="w-3 h-3 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-xs text-gray-600">{feature}</span>
                    </li>
                  ))}
                  {plan.features.length > 4 && (
                    <li className="text-xs text-gray-500 ml-5">
                      +{plan.features.length - 4} more features
                    </li>
                  )}
                </ul>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2">
                <button
                  onClick={() => onPlanSelect(plan)}
                  className={`w-full py-3 px-4 rounded-lg font-medium transition-colors ${
                    index === 1
                      ? "bg-blue-600 text-white hover:bg-blue-700"
                      : "bg-gray-900 text-white hover:bg-gray-800"
                  }`}
                >
                  Start This Plan
                </button>
                <button
                  onClick={() => onViewPlanDetails(plan)}
                  className="w-full py-2 px-4 rounded-lg font-medium text-gray-600 border border-gray-300 hover:bg-gray-50 transition-colors"
                >
                  View Details
                </button>
              </div>
            </div>

            {/* Progress Indicator for Comprehensive Plans */}
            {plan.comprehensive_plan && (
              <div className="absolute top-4 right-4">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-xs font-bold text-blue-600">
                    {Math.round(
                      plan.comprehensive_plan.overall_progress_percentage
                    )}
                    %
                  </span>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Additional Information */}
      <div className="bg-gray-50 rounded-lg p-4 text-center">
        <p className="text-sm text-gray-600 mb-2">
          ✨ All plans include adaptive adjustments based on your progress
        </p>
        <p className="text-xs text-gray-500">
          Timelines may be adjusted based on your compliance and feedback
        </p>
      </div>
    </div>
  );
};
