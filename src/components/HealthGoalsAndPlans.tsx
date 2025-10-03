import { useAuth } from "@/contexts/AuthContext";
import { Activity, ArrowRight, Heart, Target, Zap } from "lucide-react";
import React, { useMemo } from "react";

export const HealthGoalsAndPlans: React.FC = () => {
  const { profile } = useAuth();

  // Generate health goals based on profile data
  const healthGoals = useMemo(() => {
    const goals = [];

    // Check for chronic conditions and create specific goals
    if (profile?.chronic_conditions && profile.chronic_conditions.length > 0) {
      profile.chronic_conditions.forEach((condition) => {
        switch (condition.toLowerCase()) {
          case "diabetes":
            goals.push({
              id: "diabetes",
              title: "Manage Diabetes",
              description:
                "Control blood sugar levels and prevent complications",
              icon: Heart,
              priority: "high",
              color: "red",
            });
            break;
          case "hypertension":
            goals.push({
              id: "hypertension",
              title: "Lower Blood Pressure",
              description:
                "Reduce hypertension and improve cardiovascular health",
              icon: Activity,
              priority: "high",
              color: "orange",
            });
            break;
          case "obesity":
            goals.push({
              id: "obesity",
              title: "Weight Management",
              description: "Achieve and maintain a healthy weight",
              icon: Target,
              priority: "high",
              color: "blue",
            });
            break;
          default:
            goals.push({
              id: condition.toLowerCase(),
              title: `Manage ${condition}`,
              description: `Improve health outcomes for ${condition}`,
              icon: Heart,
              priority: "medium",
              color: "gray",
            });
        }
      });
    }

    // Add general health goals based on profile data
    if (profile?.age && profile.age > 50) {
      goals.push({
        id: "aging",
        title: "Healthy Aging",
        description: "Maintain vitality and prevent age-related diseases",
        icon: Zap,
        priority: "medium",
        color: "purple",
      });
    }

    // Add fitness goals if no workout routine
    if (!profile?.workout_time) {
      goals.push({
        id: "fitness",
        title: "Build Fitness Routine",
        description: "Establish regular exercise habits",
        icon: Activity,
        priority: "medium",
        color: "green",
      });
    }

    // Add sleep goals if no sleep schedule
    if (!profile?.sleep_time || !profile?.wake_up_time) {
      goals.push({
        id: "sleep",
        title: "Improve Sleep Quality",
        description: "Establish consistent sleep schedule",
        icon: Heart,
        priority: "medium",
        color: "indigo",
      });
    }

    // If no specific goals, add general wellness
    if (goals.length === 0) {
      goals.push({
        id: "wellness",
        title: "Overall Wellness",
        description: "Maintain and improve general health",
        icon: Target,
        priority: "low",
        color: "green",
      });
    }

    return goals;
  }, [profile]);

  // Generate recommended plans based on goals
  const recommendedPlans = useMemo(() => {
    const plans = [];

    // Diabetes management plan
    if (profile?.chronic_conditions?.includes("diabetes")) {
      plans.push({
        id: "diabetes-plan",
        title: "Diabetes Management Plan",
        description:
          "Comprehensive plan to control blood sugar and prevent complications",
        duration: "12 weeks",
        difficulty: "Moderate",
        features: [
          "Blood sugar monitoring",
          "Dietary guidelines",
          "Exercise routine",
          "Medication tracking",
        ],
        color: "red",
        icon: Heart,
      });
    }

    // Weight management plan
    if (
      profile?.chronic_conditions?.includes("obesity") ||
      (profile?.weight_kg && profile?.height_cm)
    ) {
      const bmi =
        parseFloat(profile.weight_kg) /
        (parseFloat(profile.height_cm) / 100) ** 2;
      if (bmi > 25) {
        plans.push({
          id: "weight-plan",
          title: "Weight Management Plan",
          description:
            "Structured approach to achieve and maintain healthy weight",
          duration: "16 weeks",
          difficulty: "Moderate",
          features: [
            "Calorie tracking",
            "Meal planning",
            "Workout routines",
            "Progress monitoring",
          ],
          color: "blue",
          icon: Target,
        });
      }
    }

    // Fitness plan
    if (!profile?.workout_time) {
      plans.push({
        id: "fitness-plan",
        title: "Fitness Foundation Plan",
        description: "Build strength, endurance, and healthy exercise habits",
        duration: "8 weeks",
        difficulty: "Beginner",
        features: [
          "Home workouts",
          "Cardio routines",
          "Strength training",
          "Flexibility exercises",
        ],
        color: "green",
        icon: Activity,
      });
    }

    // Sleep optimization plan
    if (!profile?.sleep_time || !profile?.wake_up_time) {
      plans.push({
        id: "sleep-plan",
        title: "Sleep Optimization Plan",
        description:
          "Improve sleep quality and establish healthy sleep patterns",
        duration: "6 weeks",
        difficulty: "Easy",
        features: [
          "Sleep schedule",
          "Bedtime routine",
          "Sleep hygiene",
          "Relaxation techniques",
        ],
        color: "indigo",
        icon: Heart,
      });
    }

    // General wellness plan
    plans.push({
      id: "wellness-plan",
      title: "Complete Wellness Plan",
      description: "Comprehensive approach to overall health and wellbeing",
      duration: "20 weeks",
      difficulty: "Moderate",
      features: [
        "Nutrition guidance",
        "Exercise program",
        "Stress management",
        "Health monitoring",
      ],
      color: "purple",
      icon: Zap,
    });

    return plans;
  }, [profile]);

  const getColorClasses = (color: string) => {
    const colorMap = {
      red: "bg-red-50 border-red-200 text-red-700",
      orange: "bg-orange-50 border-orange-200 text-orange-700",
      blue: "bg-blue-50 border-blue-200 text-blue-700",
      green: "bg-green-50 border-green-200 text-green-700",
      purple: "bg-purple-50 border-purple-200 text-purple-700",
      indigo: "bg-indigo-50 border-indigo-200 text-indigo-700",
      gray: "bg-gray-50 border-gray-200 text-gray-700",
    };
    return colorMap[color as keyof typeof colorMap] || colorMap.gray;
  };

  const getIconColor = (color: string) => {
    const colorMap = {
      red: "text-red-500",
      orange: "text-orange-500",
      blue: "text-blue-500",
      green: "text-green-500",
      purple: "text-purple-500",
      indigo: "text-indigo-500",
      gray: "text-gray-500",
    };
    return colorMap[color as keyof typeof colorMap] || colorMap.gray;
  };

  if (!profile) {
    return (
      <div className="h-1/2 bg-transparent px-4 pb-4">
        <div className="text-center text-gray-500">Loading goals...</div>
      </div>
    );
  }

  return (
    <div className="h-9/20 bg-transparent px-4 pb-4">
      <div className="h-full flex flex-col gap-4">
        {/* Health Goals Section */}
        <div className="bg-white/95 backdrop-blur-xl rounded-2xl p-4 shadow-xl border border-gray-100/50">
          <div className="flex items-center gap-2 mb-4">
            <Target className="w-5 h-5 text-gray-700" />
            <h3 className="text-lg font-bold text-gray-800">
              Your Health Goals
            </h3>
          </div>

          <div className="grid grid-cols-1 gap-3">
            {healthGoals.map((goal) => {
              const Icon = goal.icon;
              return (
                <div
                  key={goal.id}
                  className={`p-3 rounded-xl border ${getColorClasses(
                    goal.color
                  )}`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-5 h-5 ${getIconColor(goal.color)}`} />
                    <div className="flex-1">
                      <h4 className="font-semibold text-sm">{goal.title}</h4>
                      <p className="text-xs opacity-80">{goal.description}</p>
                    </div>
                    <div className="text-xs font-medium opacity-60 capitalize">
                      {goal.priority} priority
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Recommended Plans Section */}
        <div className="bg-white/95 backdrop-blur-xl rounded-2xl p-4 shadow-xl border border-gray-100/50">
          <div className="flex items-center gap-2 mb-4">
            <Zap className="w-5 h-5 text-gray-700" />
            <h3 className="text-lg font-bold text-gray-800">
              Recommended Plans
            </h3>
          </div>

          <div className="space-y-3">
            {recommendedPlans.map((plan) => {
              const Icon = plan.icon;
              return (
                <div
                  key={plan.id}
                  className={`p-4 rounded-xl border ${getColorClasses(
                    plan.color
                  )} hover:shadow-md transition-all duration-200 cursor-pointer`}
                >
                  <div className="flex items-start gap-3">
                    <Icon
                      className={`w-6 h-6 ${getIconColor(plan.color)} mt-1`}
                    />
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-bold text-sm">{plan.title}</h4>
                        <ArrowRight className="w-4 h-4 opacity-60" />
                      </div>
                      <p className="text-xs opacity-80 mb-3">
                        {plan.description}
                      </p>

                      <div className="flex items-center gap-4 mb-3">
                        <div className="text-xs">
                          <span className="font-medium">Duration:</span>{" "}
                          {plan.duration}
                        </div>
                        <div className="text-xs">
                          <span className="font-medium">Level:</span>{" "}
                          {plan.difficulty}
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-1">
                        {plan.features.map((feature, index) => (
                          <span
                            key={index}
                            className="text-xs bg-white/50 px-2 py-1 rounded-full"
                          >
                            {feature}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
