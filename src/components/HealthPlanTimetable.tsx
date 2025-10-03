import { Activity, Apple, Clock, Dumbbell, Moon, Sun } from "lucide-react";
import React from "react";

interface TimetableItem {
  id: string;
  time: string;
  activity: string;
  duration: string;
  type: "morning" | "meal" | "exercise" | "work" | "evening" | "sleep";
  description?: string;
}

interface TimetableItem {
  time: string;
  activity: string;
  duration: string;
  type: "morning" | "meal" | "exercise" | "work" | "evening" | "sleep";
  description?: string;
}

interface HealthPlanTimetableProps {
  plan?: {
    id: string;
    name: string;
    difficulty: "easy" | "moderate" | "hard";
    description: string;
    duration: string;
    features: string[];
    timetable: TimetableItem[];
  };
}

export const HealthPlanTimetable: React.FC<HealthPlanTimetableProps> = ({
  plan,
}) => {
  // Default timetable if no plan is provided
  const defaultTimetable: TimetableItem[] = [
    {
      id: "1",
      time: "6:00 AM",
      activity: "Wake up & Hydration",
      duration: "15 min",
      type: "morning",
      description: "Drink 1 glass of water, stretch",
    },
    {
      id: "2",
      time: "6:30 AM",
      activity: "Morning Yoga",
      duration: "30 min",
      type: "exercise",
      description: "Sun salutations, breathing exercises",
    },
    {
      id: "3",
      time: "7:00 AM",
      activity: "Breakfast",
      duration: "30 min",
      type: "meal",
      description: "Oatmeal with fruits and nuts",
    },
    {
      id: "4",
      time: "8:00 AM",
      activity: "Work/Study",
      duration: "2 hours",
      type: "work",
      description: "Focus time with breaks",
    },
    {
      id: "5",
      time: "10:00 AM",
      activity: "Healthy Snack",
      duration: "15 min",
      type: "meal",
      description: "Nuts or fruits",
    },
    {
      id: "6",
      time: "12:00 PM",
      activity: "Lunch",
      duration: "45 min",
      type: "meal",
      description: "Dal, rice, vegetables",
    },
    {
      id: "7",
      time: "2:00 PM",
      activity: "Afternoon Walk",
      duration: "15 min",
      type: "exercise",
      description: "Light walk for digestion",
    },
    {
      id: "8",
      time: "4:00 PM",
      activity: "Evening Snack",
      duration: "15 min",
      type: "meal",
      description: "Green tea with nuts",
    },
    {
      id: "9",
      time: "6:00 PM",
      activity: "Workout",
      duration: "45 min",
      type: "exercise",
      description: "Strength training or cardio",
    },
    {
      id: "10",
      time: "7:30 PM",
      activity: "Dinner",
      duration: "30 min",
      type: "meal",
      description: "Roti with sabzi",
    },
    {
      id: "11",
      time: "9:00 PM",
      activity: "Relaxation",
      duration: "30 min",
      type: "evening",
      description: "Reading or meditation",
    },
    {
      id: "12",
      time: "10:00 PM",
      activity: "Sleep",
      duration: "8 hours",
      type: "sleep",
      description: "Prepare for bed",
    },
  ];

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "morning":
        return <Sun className="w-4 h-4" />;
      case "meal":
        return <Apple className="w-4 h-4" />;
      case "exercise":
        return <Dumbbell className="w-4 h-4" />;
      case "work":
        return <Activity className="w-4 h-4" />;
      case "evening":
        return <Moon className="w-4 h-4" />;
      case "sleep":
        return <Moon className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  const getActivityColor = (type: string) => {
    switch (type) {
      case "morning":
        return "bg-orange-100 text-orange-800 border-orange-200";
      case "meal":
        return "bg-green-100 text-green-800 border-green-200";
      case "exercise":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "work":
        return "bg-purple-100 text-purple-800 border-purple-200";
      case "evening":
        return "bg-indigo-100 text-indigo-800 border-indigo-200";
      case "sleep":
        return "bg-gray-100 text-gray-800 border-gray-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const timetable = plan ? plan.timetable : defaultTimetable;

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-600 to-emerald-600 px-6 py-4 border-b border-emerald-700">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-white">
              {plan ? plan.name : "Your Daily Health Schedule"}
            </h2>
            <p className="text-sm text-green-100 mt-1">
              {plan ? plan.description : "Today's personalized routine"}
            </p>
            {plan && (
              <div className="flex items-center gap-2 mt-2">
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium ${
                    plan.difficulty === "easy"
                      ? "bg-green-100 text-green-800"
                      : plan.difficulty === "moderate"
                      ? "bg-yellow-100 text-yellow-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {plan.difficulty}
                </span>
                <span className="text-xs text-green-200">{plan.duration}</span>
              </div>
            )}
          </div>
          <div className="text-right">
            <div className="text-sm text-green-200">Current Time</div>
            <div className="text-lg font-semibold text-white">
              {new Date().toLocaleTimeString("en-US", {
                hour: "numeric",
                minute: "2-digit",
                hour12: true,
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Timetable */}
      <div className="p-6">
        <div className="space-y-4">
          {timetable.map((item, index) => (
            <div key={item.id} className="flex items-start gap-4">
              {/* Time Column */}
              <div className="flex-shrink-0 w-20 text-right">
                <div className="text-sm font-medium text-gray-600">
                  {item.time}
                </div>
              </div>

              {/* Timeline */}
              <div className="flex-shrink-0 flex flex-col items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${getActivityColor(
                    item.type
                  )}`}
                >
                  {getActivityIcon(item.type)}
                </div>
                {index < timetable.length - 1 && (
                  <div className="w-0.5 h-8 bg-gray-200 mt-2"></div>
                )}
              </div>

              {/* Activity Card */}
              <div className="flex-1 min-w-0">
                <div
                  className={`p-4 rounded-xl border ${getActivityColor(
                    item.type
                  )}`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-sm">{item.activity}</h3>
                    <span className="text-xs opacity-75">{item.duration}</span>
                  </div>
                  {item.description && (
                    <p className="text-xs opacity-75">{item.description}</p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="bg-gray-50 px-6 py-4 border-t border-gray-100">
        <div className="flex items-center justify-between text-sm text-gray-600">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span>Completed</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
            <span>Upcoming</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
            <span>Pending</span>
          </div>
        </div>
      </div>
    </div>
  );
};
