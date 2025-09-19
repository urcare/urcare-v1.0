import { ArrowLeft } from "lucide-react";
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

interface PlannerPageProps {
  plan: PlanData;
  onBack: () => void;
}

export const PlannerPage: React.FC<PlannerPageProps> = ({ plan, onBack }) => {
  console.log("PlannerPage received plan:", plan);
  const getActivityIcon = (type: string) => {
    switch (type) {
      case "morning":
        return "🌅";
      case "meal":
        return "🍎";
      case "exercise":
        return "💪";
      case "work":
        return "💼";
      case "evening":
        return "🌙";
      case "sleep":
        return "😴";
      default:
        return "⏰";
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

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "easy":
        return "bg-green-500";
      case "moderate":
        return "bg-yellow-500";
      case "hard":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  return (
    <div className="fixed inset-0 h-screen w-screen bg-white flex flex-col z-50">
      {/* Header - Dark Section - 25% of screen height */}
      <div
        className="bg-cover bg-center bg-no-repeat backdrop-blur-md border-b border-white/30 px-4 py-6 text-white h-1/4 flex items-center relative overflow-hidden shadow-2xl"
        style={{ backgroundImage: "url(/images/imgg.JPG)" }}
      >
        {/* Dark overlay for text readability */}
        <div className="absolute inset-0 bg-black/20"></div>
        {/* Glass refraction effects */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/15 via-transparent to-white/8"></div>
        <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-white/15 to-transparent"></div>
        <div className="absolute bottom-0 right-0 w-1/3 h-1/3 bg-gradient-to-tl from-white/10 to-transparent rounded-full blur-md"></div>
        <div className="absolute top-1/4 left-1/4 w-1/4 h-1/4 bg-gradient-to-br from-white/20 to-transparent rounded-full blur-sm"></div>
        <div className="flex items-center justify-between w-full relative z-10">
          <button
            onClick={onBack}
            className="p-2 hover:bg-white/20 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="text-center">
            <h1 className="text-2xl font-bold">{plan.name}</h1>
            <p className="text-sm text-gray-400">{plan.description}</p>
            <div className="flex items-center justify-center gap-4 mt-2">
              <span
                className={`px-3 py-1 rounded-full text-xs font-medium ${
                  plan.difficulty === "easy"
                    ? "bg-green-500 text-white"
                    : plan.difficulty === "moderate"
                    ? "bg-yellow-500 text-white"
                    : "bg-red-500 text-white"
                }`}
              >
                {plan.difficulty}
              </span>
              <span className="text-xs text-gray-300">{plan.duration}</span>
              <span className="text-xs text-gray-300">
                {plan.timetable.length} activities
              </span>
            </div>
          </div>
          <div className="w-9"></div> {/* Spacer for centering */}
        </div>
      </div>

      {/* Calendar Section - Rounded edges */}
      <div className="bg-white rounded-t-3xl -mt-4 relative z-10">
        <div className="px-4 py-4">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            {new Date().toLocaleDateString("en-US", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </h2>

          {/* Days of week */}
          <div className="flex justify-between mb-4">
            {["S", "M", "T", "W", "T", "F", "S"].map((day, index) => {
              const today = new Date();
              const startOfWeek = new Date(today);
              startOfWeek.setDate(today.getDate() - today.getDay());
              const dayDate = new Date(startOfWeek);
              dayDate.setDate(startOfWeek.getDate() + index);
              const isToday = dayDate.toDateString() === today.toDateString();

              return (
                <div key={`${day}-${index}`} className="text-center">
                  <div className="text-xs text-gray-500 mb-2">{day}</div>
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                      isToday ? "bg-orange-200 text-gray-900" : "text-gray-600"
                    }`}
                  >
                    {dayDate.getDate()}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Schedule Section - 75% of screen height */}
      <div className="flex-1 overflow-y-auto px-4 py-2 scrollbar-hide">
        <div className="space-y-6">
          {plan.timetable.map((item, index) => (
            <div key={index} className="flex items-start gap-6">
              {/* Time Column - Left Side */}
              <div className="flex-shrink-0 w-20 text-right pt-3">
                <div className="text-sm font-medium text-gray-600">
                  {item.time}
                </div>
              </div>

              {/* Schedule Block - Right Side */}
              <div className="flex-1">
                <div
                  className={`p-4 rounded-xl ${
                    item.type === "morning"
                      ? "bg-green-500 text-white"
                      : item.type === "meal"
                      ? "bg-yellow-300 text-gray-900"
                      : item.type === "exercise"
                      ? "bg-blue-500 text-white"
                      : item.type === "work"
                      ? "bg-purple-500 text-white"
                      : item.type === "evening"
                      ? "bg-indigo-500 text-white"
                      : "bg-gray-500 text-white"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-base">{item.activity}</h3>
                    <span className="text-sm opacity-90">{item.duration}</span>
                  </div>
                  {item.description && (
                    <p className="text-sm opacity-90 mt-1">
                      {item.description}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Add Button - Bottom Right */}
      <div className="absolute bottom-6 right-6">
        <button className="w-16 h-16 bg-gray-900 hover:bg-gray-800 text-white rounded-full flex items-center justify-center shadow-lg transition-colors">
          <span className="text-2xl">+</span>
        </button>
      </div>
    </div>
  );
};
