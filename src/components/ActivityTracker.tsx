import { useHealthScore } from "@/hooks/useHealthScore";
import React from "react";

interface ActivityTrackerProps {
  className?: string;
}

export const ActivityTracker: React.FC<ActivityTrackerProps> = ({
  className = "",
}) => {
  const { markActivityCompleted, healthData } = useHealthScore();

  const activities = [
    { type: "exercise" as const, label: "Exercise", icon: "💪" },
    { type: "nutrition" as const, label: "Nutrition", icon: "🥗" },
    { type: "hydration" as const, label: "Hydration", icon: "💧" },
    { type: "meals" as const, label: "Meals", icon: "🍽️" },
    { type: "sleep" as const, label: "Sleep", icon: "😴" },
  ];

  const handleActivityToggle = async (
    activityType: (typeof activities)[0]["type"]
  ) => {
    const todayData = healthData?.weekly_view?.find(
      (day) => day.activity_date === new Date().toISOString().split("T")[0]
    );

    const isCompleted = todayData?.[`${activityType}_completed`] || false;
    await markActivityCompleted(activityType, !isCompleted);
  };

  return (
    <div className={`space-y-4 ${className}`}>
      <h3 className="text-lg font-semibold text-gray-800 mb-4">
        Today's Activities
      </h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
        {activities.map((activity) => {
          const todayData = healthData?.weekly_view?.find(
            (day) =>
              day.activity_date === new Date().toISOString().split("T")[0]
          );

          const isCompleted =
            todayData?.[`${activity.type}_completed`] || false;

          return (
            <button
              key={activity.type}
              onClick={() => handleActivityToggle(activity.type)}
              className={`
                flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all duration-200
                ${
                  isCompleted
                    ? "bg-green-50 border-green-500 text-green-700"
                    : "bg-gray-50 border-gray-300 text-gray-600 hover:border-blue-400 hover:bg-blue-50"
                }
              `}
            >
              <div className="text-2xl mb-2">{activity.icon}</div>
              <div className="text-sm font-medium">{activity.label}</div>
              {isCompleted && (
                <div className="text-xs text-green-600 mt-1">✓ Done</div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};
