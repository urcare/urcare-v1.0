/**
 * PLAN DETAILS PAGE COMPONENT
 *
 * Detailed view of the selected health plan with comprehensive information
 */

import {
  HealthProgress,
  IntelligentHealthPlanningService,
  WeeklyPlan,
} from "@/services/intelligentHealthPlanningService";
import React, { useEffect, useState } from "react";

interface PlanDetailsPageProps {
  plan: WeeklyPlan;
  onStartPlan: () => void;
  onBack: () => void;
}

export const PlanDetailsPage: React.FC<PlanDetailsPageProps> = ({
  plan,
  onStartPlan,
  onBack,
}) => {
  const [selectedDay, setSelectedDay] = useState<number>(0);
  const [progress, setProgress] = useState<HealthProgress | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadProgress();
  }, []);

  const loadProgress = async () => {
    setLoading(true);
    try {
      const userProgress =
        await IntelligentHealthPlanningService.getUserHealthProgress(
          plan.userId
        );
      setProgress(userProgress);
    } catch (error) {
      console.error("Error loading progress:", error);
    } finally {
      setLoading(false);
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "easy":
        return "text-green-600 bg-green-100";
      case "moderate":
        return "text-yellow-600 bg-yellow-100";
      case "hard":
        return "text-red-600 bg-red-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  const getDifficultyIcon = (difficulty: string) => {
    switch (difficulty) {
      case "easy":
        return "🌱";
      case "moderate":
        return "💪";
      case "hard":
        return "🔥";
      default:
        return "📋";
    }
  };

  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(":");
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? "PM" : "AM";
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "wake_up":
        return "🌅";
      case "morning_routine":
        return "🧘";
      case "breakfast":
        return "🍳";
      case "workout":
        return "💪";
      case "lunch":
        return "🥗";
      case "snack":
        return "🍎";
      case "dinner":
        return "🍽️";
      case "evening_routine":
        return "🌙";
      case "sleep_prep":
        return "😴";
      default:
        return "📋";
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={onBack}
            className="flex items-center text-gray-600 hover:text-gray-800"
          >
            <span className="mr-2">←</span>
            Back to Selection
          </button>
          <div
            className={`px-3 py-1 rounded-full text-sm font-medium ${getDifficultyColor(
              plan.difficulty
            )}`}
          >
            {getDifficultyIcon(plan.difficulty)}{" "}
            {plan.difficulty.charAt(0).toUpperCase() + plan.difficulty.slice(1)}{" "}
            Plan
          </div>
        </div>

        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Your Personalized Health Plan
        </h1>
        <p className="text-lg text-gray-600">
          A comprehensive 7-day plan tailored to your goals and preferences
        </p>
      </div>

      {/* Progress Overview */}
      {progress && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
          <h3 className="text-lg font-semibold text-blue-900 mb-4">
            Your Health Progress
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {progress.currentStreak}
              </div>
              <div className="text-sm text-blue-800">Day Streak</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {progress.healthScore}
              </div>
              <div className="text-sm text-blue-800">Health Score</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {Math.round(progress.averageCompletion)}%
              </div>
              <div className="text-sm text-blue-800">Completion Rate</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {progress.completedPlans}
              </div>
              <div className="text-sm text-blue-800">Plans Completed</div>
            </div>
          </div>
        </div>
      )}

      {/* Plan Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        {/* Goals & Tips */}
        <div className="lg:col-span-1">
          <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Plan Goals
            </h3>
            <ul className="space-y-2">
              {plan.overallGoals.map((goal, index) => (
                <li key={index} className="flex items-start">
                  <span className="text-green-500 mr-2 mt-1">🎯</span>
                  <span className="text-gray-700">{goal}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Progress Tips
            </h3>
            <ul className="space-y-2">
              {plan.progressTips.map((tip, index) => (
                <li key={index} className="flex items-start">
                  <span className="text-blue-500 mr-2 mt-1">💡</span>
                  <span className="text-gray-700">{tip}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Weekly Schedule */}
        <div className="lg:col-span-2">
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              7-Day Schedule
            </h3>
            <div className="grid grid-cols-7 gap-2">
              {plan.days.map((day, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedDay(index)}
                  className={`p-3 rounded-lg text-center transition-colors ${
                    selectedDay === index
                      ? "bg-blue-100 border-2 border-blue-300"
                      : "bg-gray-50 border border-gray-200 hover:bg-gray-100"
                  }`}
                >
                  <div className="text-sm font-medium text-gray-900">
                    {day.dayOfWeek}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    {new Date(day.date).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    })}
                  </div>
                  <div className="text-xs text-gray-600 mt-1">
                    {day.summary.totalActivities} activities
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Selected Day Details */}
      <div className="bg-white border border-gray-200 rounded-lg p-6 mb-8">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-gray-900">
            {plan.days[selectedDay]?.dayOfWeek} -{" "}
            {new Date(plan.days[selectedDay]?.date).toLocaleDateString(
              "en-US",
              {
                month: "long",
                day: "numeric",
              }
            )}
          </h3>
          <div className="flex items-center space-x-4">
            <div className="text-sm text-gray-600">
              <span className="font-medium">Duration:</span>{" "}
              {plan.days[selectedDay]?.summary.totalDuration} min
            </div>
            <div className="text-sm text-gray-600">
              <span className="font-medium">Calories:</span>{" "}
              {plan.days[selectedDay]?.summary.calories}
            </div>
            <div className="text-sm text-gray-600">
              <span className="font-medium">Protein:</span>{" "}
              {plan.days[selectedDay]?.summary.protein}g
            </div>
          </div>
        </div>

        <div className="space-y-4">
          {plan.days[selectedDay]?.activities.map((activity, index) => (
            <div
              key={index}
              className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-3">
                  <div className="text-2xl">
                    {getActivityIcon(activity.type)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <h4 className="text-lg font-semibold text-gray-900">
                        {activity.title}
                      </h4>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          activity.priority === "high"
                            ? "bg-red-100 text-red-700"
                            : activity.priority === "medium"
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-green-100 text-green-700"
                        }`}
                      >
                        {activity.priority} priority
                      </span>
                    </div>
                    <p className="text-gray-600 mb-2">{activity.description}</p>
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <span>
                        ⏰ {formatTime(activity.startTime)} -{" "}
                        {formatTime(activity.endTime)}
                      </span>
                      <span>⏱️ {activity.duration} min</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Instructions */}
              {activity.instructions && activity.instructions.length > 0 && (
                <div className="mt-3">
                  <h5 className="text-sm font-medium text-gray-700 mb-2">
                    Instructions:
                  </h5>
                  <ol className="list-decimal list-inside space-y-1 text-sm text-gray-600">
                    {activity.instructions.map((instruction, idx) => (
                      <li key={idx}>{instruction}</li>
                    ))}
                  </ol>
                </div>
              )}

              {/* Tips */}
              {activity.tips && activity.tips.length > 0 && (
                <div className="mt-3">
                  <h5 className="text-sm font-medium text-gray-700 mb-2">
                    Tips:
                  </h5>
                  <ul className="list-disc list-inside space-y-1 text-sm text-gray-600">
                    {activity.tips.map((tip, idx) => (
                      <li key={idx}>{tip}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Nutrition Details */}
              {activity.nutritionDetails && (
                <div className="mt-3 bg-green-50 border border-green-200 rounded-lg p-3">
                  <h5 className="text-sm font-medium text-green-800 mb-2">
                    Nutrition Information:
                  </h5>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>Calories: {activity.nutritionDetails.calories}</div>
                    <div>Protein: {activity.nutritionDetails.protein}g</div>
                    <div>Carbs: {activity.nutritionDetails.carbs}g</div>
                    <div>Fat: {activity.nutritionDetails.fat}g</div>
                  </div>
                  {activity.nutritionDetails.ingredients && (
                    <div className="mt-2">
                      <span className="text-sm font-medium text-green-800">
                        Ingredients:{" "}
                      </span>
                      <span className="text-sm text-green-700">
                        {activity.nutritionDetails.ingredients.join(", ")}
                      </span>
                    </div>
                  )}
                </div>
              )}

              {/* Workout Details */}
              {activity.workoutDetails && (
                <div className="mt-3 bg-blue-50 border border-blue-200 rounded-lg p-3">
                  <h5 className="text-sm font-medium text-blue-800 mb-2">
                    Workout Details:
                  </h5>
                  <div className="space-y-2">
                    {activity.workoutDetails.exercises.map((exercise, idx) => (
                      <div key={idx} className="text-sm">
                        <span className="font-medium text-blue-800">
                          {exercise.name}
                        </span>
                        <span className="text-blue-600 ml-2">
                          {exercise.sets} sets × {exercise.reps} reps
                          {exercise.weight && ` @ ${exercise.weight}`}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Equipment */}
              {activity.equipment && activity.equipment.length > 0 && (
                <div className="mt-3">
                  <h5 className="text-sm font-medium text-gray-700 mb-2">
                    Equipment needed:
                  </h5>
                  <div className="flex flex-wrap gap-2">
                    {activity.equipment.map((item, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Alternatives */}
              {activity.alternatives && activity.alternatives.length > 0 && (
                <div className="mt-3">
                  <h5 className="text-sm font-medium text-gray-700 mb-2">
                    Alternatives:
                  </h5>
                  <ul className="list-disc list-inside space-y-1 text-sm text-gray-600">
                    {activity.alternatives.map((alt, idx) => (
                      <li key={idx}>{alt}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Meal Variations */}
      <div className="bg-white border border-gray-200 rounded-lg p-6 mb-8">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Weekly Meal Variations
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <h4 className="font-medium text-gray-800 mb-2">
              Breakfast Options
            </h4>
            <ul className="space-y-1 text-sm text-gray-600">
              {plan.mealVariations.breakfast.map((meal, index) => (
                <li key={index} className="flex items-center">
                  <span className="text-orange-500 mr-2">🍳</span>
                  {meal}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="font-medium text-gray-800 mb-2">Lunch Options</h4>
            <ul className="space-y-1 text-sm text-gray-600">
              {plan.mealVariations.lunch.map((meal, index) => (
                <li key={index} className="flex items-center">
                  <span className="text-green-500 mr-2">🥗</span>
                  {meal}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="font-medium text-gray-800 mb-2">Dinner Options</h4>
            <ul className="space-y-1 text-sm text-gray-600">
              {plan.mealVariations.dinner.map((meal, index) => (
                <li key={index} className="flex items-center">
                  <span className="text-purple-500 mr-2">🍽️</span>
                  {meal}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="font-medium text-gray-800 mb-2">Snack Options</h4>
            <ul className="space-y-1 text-sm text-gray-600">
              {plan.mealVariations.snacks.map((snack, index) => (
                <li key={index} className="flex items-center">
                  <span className="text-yellow-500 mr-2">🍎</span>
                  {snack}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
        >
          Back to Selection
        </button>
        <button
          onClick={onStartPlan}
          className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold"
        >
          Start This Plan
        </button>
      </div>
    </div>
  );
};

export default PlanDetailsPage;
