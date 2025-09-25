/**
 * DAILY SCHEDULE VIEW COMPONENT
 *
 * Component for viewing and interacting with daily schedules
 */

import {
  DailySchedule,
  IntelligentHealthPlanningService,
} from "@/services/intelligentHealthPlanningService";
import React, { useEffect, useState } from "react";

interface DailyScheduleViewProps {
  userId: string;
  date?: string;
  onActivityComplete?: (activityId: string, completed: boolean) => void;
}

export const DailyScheduleView: React.FC<DailyScheduleViewProps> = ({
  userId,
  date,
  onActivityComplete,
}) => {
  const [schedule, setSchedule] = useState<DailySchedule | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [completedActivities, setCompletedActivities] = useState<Set<string>>(
    new Set()
  );

  useEffect(() => {
    loadSchedule();
  }, [userId, date]);

  const loadSchedule = async () => {
    setLoading(true);
    setError(null);
    try {
      const todaySchedule =
        await IntelligentHealthPlanningService.getTodaySchedule(userId, date);
      if (todaySchedule) {
        setSchedule(todaySchedule);
        // Load completed activities
        loadCompletedActivities();
      } else {
        setError("No schedule found for this date");
      }
    } catch (error) {
      console.error("Error loading schedule:", error);
      setError("Failed to load schedule");
    } finally {
      setLoading(false);
    }
  };

  const loadCompletedActivities = async () => {
    // This would typically load from the database
    // For now, we'll use localStorage as a fallback
    const completed = localStorage.getItem(
      `completed_activities_${userId}_${
        date || new Date().toISOString().split("T")[0]
      }`
    );
    if (completed) {
      setCompletedActivities(new Set(JSON.parse(completed)));
    }
  };

  const handleActivityToggle = async (
    activityId: string,
    completed: boolean
  ) => {
    try {
      await IntelligentHealthPlanningService.markActivityCompleted(
        userId,
        activityId,
        completed
      );

      const newCompleted = new Set(completedActivities);
      if (completed) {
        newCompleted.add(activityId);
      } else {
        newCompleted.delete(activityId);
      }
      setCompletedActivities(newCompleted);

      // Save to localStorage as backup
      localStorage.setItem(
        `completed_activities_${userId}_${
          date || new Date().toISOString().split("T")[0]
        }`,
        JSON.stringify(Array.from(newCompleted))
      );

      if (onActivityComplete) {
        onActivityComplete(activityId, completed);
      }
    } catch (error) {
      console.error("Error updating activity completion:", error);
    }
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

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "border-red-200 bg-red-50";
      case "medium":
        return "border-yellow-200 bg-yellow-50";
      case "low":
        return "border-green-200 bg-green-50";
      default:
        return "border-gray-200 bg-gray-50";
    }
  };

  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(":");
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? "PM" : "AM";
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  const getCompletionPercentage = () => {
    if (!schedule) return 0;
    return Math.round(
      (completedActivities.size / schedule.activities.length) * 100
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-2">Loading schedule...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center p-8">
        <p className="text-red-600 mb-4">{error}</p>
        <button
          onClick={loadSchedule}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Retry
        </button>
      </div>
    );
  }

  if (!schedule) {
    return (
      <div className="text-center p-8">
        <p className="text-gray-600">No schedule available for this date</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          {schedule.dayOfWeek} Schedule
        </h1>
        <p className="text-lg text-gray-600 mb-4">
          {new Date(schedule.date).toLocaleDateString("en-US", {
            month: "long",
            day: "numeric",
            year: "numeric",
          })}
        </p>

        {/* Progress Bar */}
        <div className="bg-gray-200 rounded-full h-4 mb-4">
          <div
            className="bg-blue-600 h-4 rounded-full transition-all duration-300"
            style={{ width: `${getCompletionPercentage()}%` }}
          ></div>
        </div>
        <div className="flex justify-between text-sm text-gray-600">
          <span>Progress: {getCompletionPercentage()}%</span>
          <span>
            {completedActivities.size} of {schedule.activities.length}{" "}
            activities completed
          </span>
        </div>
      </div>

      {/* Schedule Summary */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
        <h3 className="text-lg font-semibold text-blue-900 mb-4">
          Today's Summary
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">
              {schedule.summary.totalActivities}
            </div>
            <div className="text-sm text-blue-800">Total Activities</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">
              {schedule.summary.totalDuration}
            </div>
            <div className="text-sm text-blue-800">Minutes</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">
              {schedule.summary.calories}
            </div>
            <div className="text-sm text-blue-800">Calories</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">
              {schedule.summary.protein}g
            </div>
            <div className="text-sm text-blue-800">Protein</div>
          </div>
        </div>
      </div>

      {/* Activities List */}
      <div className="space-y-4">
        {schedule.activities.map((activity, index) => {
          const isCompleted = completedActivities.has(activity.id);

          return (
            <div
              key={activity.id}
              className={`border rounded-lg p-4 transition-all duration-200 ${
                isCompleted
                  ? "border-green-300 bg-green-50 opacity-75"
                  : getPriorityColor(activity.priority)
              }`}
            >
              <div className="flex items-start space-x-4">
                {/* Activity Icon and Checkbox */}
                <div className="flex items-center space-x-3">
                  <button
                    onClick={() =>
                      handleActivityToggle(activity.id, !isCompleted)
                    }
                    className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
                      isCompleted
                        ? "bg-green-500 border-green-500 text-white"
                        : "border-gray-300 hover:border-green-400"
                    }`}
                  >
                    {isCompleted && <span className="text-sm">✓</span>}
                  </button>
                  <div className="text-2xl">
                    {getActivityIcon(activity.type)}
                  </div>
                </div>

                {/* Activity Content */}
                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3
                        className={`text-lg font-semibold ${
                          isCompleted
                            ? "line-through text-gray-500"
                            : "text-gray-900"
                        }`}
                      >
                        {activity.title}
                      </h3>
                      <p
                        className={`text-gray-600 ${
                          isCompleted ? "line-through" : ""
                        }`}
                      >
                        {activity.description}
                      </p>
                    </div>
                    <div className="text-right text-sm text-gray-500">
                      <div>
                        {formatTime(activity.startTime)} -{" "}
                        {formatTime(activity.endTime)}
                      </div>
                      <div>{activity.duration} min</div>
                    </div>
                  </div>

                  {/* Instructions */}
                  {activity.instructions &&
                    activity.instructions.length > 0 && (
                      <div className="mt-3">
                        <h4 className="text-sm font-medium text-gray-700 mb-2">
                          Instructions:
                        </h4>
                        <ol className="list-decimal list-inside space-y-1 text-sm text-gray-600">
                          {activity.instructions.map((instruction, idx) => (
                            <li
                              key={idx}
                              className={isCompleted ? "line-through" : ""}
                            >
                              {instruction}
                            </li>
                          ))}
                        </ol>
                      </div>
                    )}

                  {/* Tips */}
                  {activity.tips && activity.tips.length > 0 && (
                    <div className="mt-3">
                      <h4 className="text-sm font-medium text-gray-700 mb-2">
                        Tips:
                      </h4>
                      <ul className="list-disc list-inside space-y-1 text-sm text-gray-600">
                        {activity.tips.map((tip, idx) => (
                          <li
                            key={idx}
                            className={isCompleted ? "line-through" : ""}
                          >
                            {tip}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Nutrition Details */}
                  {activity.nutritionDetails && (
                    <div className="mt-3 bg-green-50 border border-green-200 rounded-lg p-3">
                      <h4 className="text-sm font-medium text-green-800 mb-2">
                        Nutrition Information:
                      </h4>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div>
                          Calories: {activity.nutritionDetails.calories}
                        </div>
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
                      <h4 className="text-sm font-medium text-blue-800 mb-2">
                        Workout Details:
                      </h4>
                      <div className="space-y-2">
                        {activity.workoutDetails.exercises.map(
                          (exercise, idx) => (
                            <div key={idx} className="text-sm">
                              <span className="font-medium text-blue-800">
                                {exercise.name}
                              </span>
                              <span className="text-blue-600 ml-2">
                                {exercise.sets} sets × {exercise.reps} reps
                                {exercise.weight && ` @ ${exercise.weight}`}
                              </span>
                            </div>
                          )
                        )}
                      </div>
                    </div>
                  )}

                  {/* Equipment */}
                  {activity.equipment && activity.equipment.length > 0 && (
                    <div className="mt-3">
                      <h4 className="text-sm font-medium text-gray-700 mb-2">
                        Equipment needed:
                      </h4>
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
                  {activity.alternatives &&
                    activity.alternatives.length > 0 && (
                      <div className="mt-3">
                        <h4 className="text-sm font-medium text-gray-700 mb-2">
                          Alternatives:
                        </h4>
                        <ul className="list-disc list-inside space-y-1 text-sm text-gray-600">
                          {activity.alternatives.map((alt, idx) => (
                            <li key={idx}>{alt}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Completion Message */}
      {getCompletionPercentage() === 100 && (
        <div className="mt-8 bg-green-50 border border-green-200 rounded-lg p-6 text-center">
          <div className="text-4xl mb-4">🎉</div>
          <h3 className="text-xl font-semibold text-green-800 mb-2">
            Congratulations!
          </h3>
          <p className="text-green-600">
            You've completed all activities for today. Great job!
          </p>
        </div>
      )}
    </div>
  );
};

export default DailyScheduleView;
