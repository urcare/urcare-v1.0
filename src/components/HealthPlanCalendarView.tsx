import {
  Activity,
  ArrowLeft,
  ArrowRight,
  Calendar,
  CheckCircle,
  Heart,
  Moon,
  Sun,
  Target,
  Utensils,
  Zap,
} from "lucide-react";
import React, { useState } from "react";

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

interface HealthPlanCalendarViewProps {
  plan: PlanData;
  onBack: () => void;
}

export const HealthPlanCalendarView: React.FC<HealthPlanCalendarViewProps> = ({
  plan,
  onBack,
}) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState<number>(1);
  const [completedActivities, setCompletedActivities] = useState<{
    [key: string]: boolean;
  }>({});

  // Calculate plan duration in days
  const planDuration = parseInt(plan.duration.split(" ")[0]) || 30;

  // Generate calendar days for the plan
  const generateCalendarDays = () => {
    const days = [];
    const startDate = new Date();

    for (let i = 0; i < planDuration; i++) {
      const dayDate = new Date(startDate);
      dayDate.setDate(startDate.getDate() + i);

      const dayNumber = i + 1;
      const isCompleted = completedActivities[`day-${dayNumber}`];
      const isToday = i === 0;
      const isPast = i < 0;

      days.push({
        dayNumber,
        date: dayDate,
        isCompleted,
        isToday,
        isPast,
        activities: getDayActivities(dayNumber),
      });
    }

    return days;
  };

  // Get activities for a specific day (cycling through the timetable)
  const getDayActivities = (dayNumber: number) => {
    const activitiesPerDay = 6; // Show 6 activities per day
    const startIndex =
      ((dayNumber - 1) * activitiesPerDay) % plan.timetable.length;

    return plan.timetable.slice(startIndex, startIndex + activitiesPerDay);
  };

  // Get activity icon based on type
  const getActivityIcon = (type: string) => {
    switch (type) {
      case "morning":
        return <Sun className="w-4 h-4 text-yellow-500" />;
      case "meal":
        return <Utensils className="w-4 h-4 text-green-500" />;
      case "exercise":
        return <Activity className="w-4 h-4 text-blue-500" />;
      case "work":
        return <Target className="w-4 h-4 text-purple-500" />;
      case "evening":
        return <Heart className="w-4 h-4 text-pink-500" />;
      case "sleep":
        return <Moon className="w-4 h-4 text-indigo-500" />;
      default:
        return <Zap className="w-4 h-4 text-gray-500" />;
    }
  };

  // Toggle activity completion
  const toggleActivityCompletion = (
    dayNumber: number,
    activityIndex: number
  ) => {
    const activityKey = `day-${dayNumber}-activity-${activityIndex}`;
    setCompletedActivities((prev) => ({
      ...prev,
      [activityKey]: !prev[activityKey],
    }));
  };

  // Get completion percentage for a day
  const getDayCompletionPercentage = (dayNumber: number) => {
    const activities = getDayActivities(dayNumber);
    const completedCount = activities.filter(
      (_, index) => completedActivities[`day-${dayNumber}-activity-${index}`]
    ).length;

    return Math.round((completedCount / activities.length) * 100);
  };

  const calendarDays = generateCalendarDays();
  const currentDayData = calendarDays.find(
    (day) => day.dayNumber === selectedDay
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={onBack}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>

            <div className="text-center">
              <h1 className="text-xl font-bold text-gray-900">{plan.name}</h1>
              <p className="text-sm text-gray-600">{plan.description}</p>
            </div>

            <div className="w-9"></div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        {/* Plan Overview */}
        <div className="bg-white rounded-xl p-6 mb-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <Calendar className="w-6 h-6 text-blue-600" />
              <h2 className="text-lg font-semibold text-gray-900">
                Plan Overview
              </h2>
            </div>
            <div className="flex items-center gap-2">
              <span
                className={`px-3 py-1 rounded-full text-xs font-medium ${
                  plan.difficulty === "easy"
                    ? "bg-green-100 text-green-800"
                    : plan.difficulty === "moderate"
                    ? "bg-yellow-100 text-yellow-800"
                    : "bg-red-100 text-red-800"
                }`}
              >
                {plan.difficulty}
              </span>
              <span className="text-sm text-gray-600">{plan.duration}</span>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {planDuration}
              </div>
              <div className="text-sm text-gray-600">Total Days</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {
                  Object.keys(completedActivities).filter(
                    (key) => completedActivities[key]
                  ).length
                }
              </div>
              <div className="text-sm text-gray-600">Completed</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">
                {Math.round(
                  (Object.keys(completedActivities).filter(
                    (key) => completedActivities[key]
                  ).length /
                    (planDuration * 6)) *
                    100
                )}
                %
              </div>
              <div className="text-sm text-gray-600">Progress</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">
                {plan.timetable.length}
              </div>
              <div className="text-sm text-gray-600">Activities</div>
            </div>
          </div>
        </div>

        {/* Calendar Grid */}
        <div className="bg-white rounded-xl p-6 mb-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">
              Calendar View
            </h3>
            <div className="flex items-center gap-2">
              <button
                onClick={() =>
                  setCurrentDate(
                    new Date(
                      currentDate.getFullYear(),
                      currentDate.getMonth() - 1,
                      1
                    )
                  )
                }
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
              <span className="text-sm font-medium text-gray-700">
                {currentDate.toLocaleDateString("en-US", {
                  month: "long",
                  year: "numeric",
                })}
              </span>
              <button
                onClick={() =>
                  setCurrentDate(
                    new Date(
                      currentDate.getFullYear(),
                      currentDate.getMonth() + 1,
                      1
                    )
                  )
                }
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-7 gap-2 mb-4">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
              <div
                key={day}
                className="text-center text-sm font-medium text-gray-500 py-2"
              >
                {day}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-2">
            {calendarDays.slice(0, 14).map((day, index) => {
              const completionPercentage = getDayCompletionPercentage(
                day.dayNumber
              );

              return (
                <button
                  key={index}
                  onClick={() => setSelectedDay(day.dayNumber)}
                  className={`p-3 rounded-lg border-2 transition-all duration-200 ${
                    selectedDay === day.dayNumber
                      ? "border-blue-500 bg-blue-50"
                      : day.isCompleted
                      ? "border-green-500 bg-green-50"
                      : day.isToday
                      ? "border-orange-500 bg-orange-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <div className="text-center">
                    <div
                      className={`text-sm font-medium ${
                        selectedDay === day.dayNumber
                          ? "text-blue-700"
                          : day.isCompleted
                          ? "text-green-700"
                          : day.isToday
                          ? "text-orange-700"
                          : "text-gray-700"
                      }`}
                    >
                      {day.dayNumber}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      Day {day.dayNumber}
                    </div>
                    {completionPercentage > 0 && (
                      <div className="mt-2">
                        <div className="w-full bg-gray-200 rounded-full h-1">
                          <div
                            className={`h-1 rounded-full ${
                              completionPercentage === 100
                                ? "bg-green-500"
                                : "bg-blue-500"
                            }`}
                            style={{ width: `${completionPercentage}%` }}
                          />
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          {completionPercentage}%
                        </div>
                      </div>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Day Details */}
        {currentDayData && (
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                Day {currentDayData.dayNumber} -{" "}
                {currentDayData.date.toLocaleDateString()}
              </h3>
              <div className="flex items-center gap-2">
                <div className="text-sm text-gray-600">
                  {getDayCompletionPercentage(currentDayData.dayNumber)}%
                  Complete
                </div>
                {getDayCompletionPercentage(currentDayData.dayNumber) ===
                  100 && <CheckCircle className="w-5 h-5 text-green-500" />}
              </div>
            </div>

            <div className="space-y-3">
              {currentDayData.activities.map((activity, index) => {
                const isCompleted =
                  completedActivities[
                    `day-${currentDayData.dayNumber}-activity-${index}`
                  ];

                return (
                  <div
                    key={index}
                    className={`p-4 rounded-lg border-2 transition-all duration-200 ${
                      isCompleted
                        ? "border-green-200 bg-green-50"
                        : "border-gray-200 bg-gray-50 hover:border-gray-300"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() =>
                            toggleActivityCompletion(
                              currentDayData.dayNumber,
                              index
                            )
                          }
                          className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
                            isCompleted
                              ? "border-green-500 bg-green-500 text-white"
                              : "border-gray-300 hover:border-green-500"
                          }`}
                        >
                          {isCompleted && <CheckCircle className="w-4 h-4" />}
                        </button>

                        <div className="flex items-center gap-2">
                          {getActivityIcon(activity.type)}
                          <div>
                            <div
                              className={`font-medium ${
                                isCompleted
                                  ? "text-green-700 line-through"
                                  : "text-gray-900"
                              }`}
                            >
                              {activity.activity}
                            </div>
                            <div className="text-sm text-gray-600">
                              {activity.time} • {activity.duration}
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                            activity.type === "morning"
                              ? "bg-yellow-100 text-yellow-800"
                              : activity.type === "meal"
                              ? "bg-green-100 text-green-800"
                              : activity.type === "exercise"
                              ? "bg-blue-100 text-blue-800"
                              : activity.type === "work"
                              ? "bg-purple-100 text-purple-800"
                              : activity.type === "evening"
                              ? "bg-pink-100 text-pink-800"
                              : "bg-indigo-100 text-indigo-800"
                          }`}
                        >
                          {activity.type}
                        </span>
                        {isCompleted && (
                          <CheckCircle className="w-5 h-5 text-green-500" />
                        )}
                      </div>
                    </div>

                    {activity.description && (
                      <div className="mt-2 text-sm text-gray-600">
                        {activity.description}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
