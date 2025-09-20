import {
  Activity,
  ComprehensiveHealthPlan,
  MealPlan,
  WorkoutPlan,
} from "@/types/comprehensiveHealthPlan";
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

interface Event {
  id: string;
  title: string;
  duration: string;
  time: string;
  color: "green" | "lime" | "beige" | "text";
  type?: "activity" | "meal" | "workout" | "wellness";
  description?: string;
}

const Calendar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState("22 October");
  const [selectedDay, setSelectedDay] = useState(22);
  const [planData, setPlanData] = useState<ComprehensiveHealthPlan | null>(
    null
  );
  const [events, setEvents] = useState<Event[]>([]);

  const weekDays = [
    { day: "S", date: 18 },
    { day: "M", date: 19 },
    { day: "T", date: 20 },
    { day: "W", date: 21 },
    { day: "T", date: 22 },
    { day: "F", date: 23 },
    { day: "S", date: 24 },
  ];

  // Default events for demo
  const defaultEvents: Event[] = [
    {
      id: "1",
      title: "Dailly stand-up",
      duration: "1 hour",
      time: "9:00 am",
      color: "green",
    },
    {
      id: "2",
      title: "Design Alignment",
      duration: "",
      time: "10:00 am",
      color: "lime",
    },
    {
      id: "3",
      title: "Review work place safety",
      duration: "45 min",
      time: "11:00 am",
      color: "beige",
    },
    {
      id: "4",
      title: "Lunch",
      duration: "30 min",
      time: "12:00 am",
      color: "text",
    },
  ];

  // Helper function to parse time strings
  const parseTime = (timeStr: string): number => {
    const [time, period] = timeStr.split(" ");
    const [hours, minutes] = time.split(":").map(Number);
    let totalMinutes = hours * 60 + minutes;
    if (period === "pm" && hours !== 12) totalMinutes += 12 * 60;
    if (period === "am" && hours === 12) totalMinutes -= 12 * 60;
    return totalMinutes;
  };

  // Convert plan data to calendar events
  const convertPlanToEvents = (plan: ComprehensiveHealthPlan): Event[] => {
    const events: Event[] = [];
    let eventId = 1;

    // Get weekday template (assuming we're showing a weekday)
    const weekdayTemplate = plan.plan_data.daily_templates.weekday;
    if (!weekdayTemplate) return events;

    // Convert morning routine activities
    weekdayTemplate.morning_routine?.forEach((activity: Activity) => {
      events.push({
        id: `morning-${eventId++}`,
        title: activity.title,
        duration: `${activity.duration} min`,
        time: "7:00 am", // Default morning time
        color: "green",
        type: "activity",
        description: activity.description,
      });
    });

    // Convert meals
    weekdayTemplate.meals?.forEach((meal: MealPlan, index: number) => {
      const mealTimes = ["8:00 am", "12:00 pm", "6:00 pm"]; // Breakfast, Lunch, Dinner
      events.push({
        id: `meal-${eventId++}`,
        title: meal.name,
        duration: `${meal.prep_time + meal.cook_time} min`,
        time: mealTimes[index] || "12:00 pm",
        color: "lime",
        type: "meal",
        description: meal.description,
      });
    });

    // Convert workouts
    weekdayTemplate.workouts?.forEach((workout: WorkoutPlan) => {
      events.push({
        id: `workout-${eventId++}`,
        title: workout.name,
        duration: `${workout.duration} min`,
        time: "5:00 pm", // Default evening workout time
        color: "beige",
        type: "workout",
        description: workout.description,
      });
    });

    // Convert evening routine
    weekdayTemplate.evening_routine?.forEach((activity: Activity) => {
      events.push({
        id: `evening-${eventId++}`,
        title: activity.title,
        duration: `${activity.duration} min`,
        time: "9:00 pm", // Default evening time
        color: "text",
        type: "wellness",
        description: activity.description,
      });
    });

    // Sort events by time
    return events.sort((a, b) => {
      const timeA = parseTime(a.time);
      const timeB = parseTime(b.time);
      return timeA - timeB;
    });
  };

  // Load plan data from location state
  useEffect(() => {
    if (location.state?.planData) {
      setPlanData(location.state.planData);
      const planEvents = convertPlanToEvents(location.state.planData);
      setEvents(planEvents);
    } else {
      setEvents(defaultEvents);
    }
  }, [location.state]);

  const handleBackToDashboard = () => {
    navigate("/dashboard");
  };

  const getEventColorClass = (color: Event["color"]) => {
    switch (color) {
      case "green":
        return "bg-green-500 text-white";
      case "lime":
        return "bg-lime-300 text-black";
      case "beige":
        return "bg-amber-50 text-black";
      case "text":
        return "text-black";
      default:
        return "bg-gray-200 text-black";
    }
  };

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Dark Header */}
      <div className="bg-gray-900 px-6 pt-12 pb-4">
        <div className="flex justify-between items-start">
          <div className="flex items-center space-x-4">
            <button
              onClick={handleBackToDashboard}
              className="text-white hover:text-gray-300 transition-colors"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>
            <div>
              <h1 className="text-3xl font-bold text-white mb-1">
                {planData ? planData.plan_name : "Sleipner"}
              </h1>
              <p className="text-white text-sm">
                {planData
                  ? `${planData.duration_weeks} weeks plan`
                  : "331 days left"}
              </p>
            </div>
          </div>
          <div className="text-white">
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
            </svg>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="bg-white rounded-t-3xl -mt-4 relative z-10 min-h-screen">
        {/* Drag Handle */}
        <div className="flex justify-center pt-3 pb-2">
          <div className="w-12 h-1 bg-gray-300 rounded-full"></div>
        </div>

        <div className="px-6">
          {/* Date Header */}
          <h2 className="text-2xl font-bold text-black mb-6">{selectedDate}</h2>

          {/* Week Calendar */}
          <div className="flex justify-between mb-8">
            {weekDays.map((day, index) => (
              <div
                key={index}
                className={`flex flex-col items-center py-2 px-3 rounded-xl cursor-pointer transition-colors ${
                  day.date === selectedDay ? "bg-amber-50" : "hover:bg-gray-50"
                }`}
                onClick={() => setSelectedDay(day.date)}
              >
                <span className="text-sm text-gray-600 mb-1">{day.day}</span>
                <span className="text-lg font-medium text-black">
                  {day.date}
                </span>
              </div>
            ))}
          </div>

          {/* Timeline */}
          <div className="space-y-6">
            {events.map((event, index) => (
              <div key={event.id} className="flex items-start space-x-4">
                {/* Time Label */}
                <div className="w-16 text-sm text-gray-600 mt-1">
                  {event.time}
                </div>

                {/* Event Card */}
                <div className="flex-1">
                  {event.color === "text" ? (
                    <div className="py-2">
                      <h3 className="text-black font-medium">{event.title}</h3>
                      {event.duration && (
                        <p className="text-sm text-gray-600">
                          {event.duration}
                        </p>
                      )}
                    </div>
                  ) : (
                    <div
                      className={`rounded-xl p-4 ${getEventColorClass(
                        event.color
                      )}`}
                    >
                      <h3 className="font-medium">{event.title}</h3>
                      {event.duration && (
                        <p className="text-sm opacity-80 mt-1">
                          {event.duration}
                        </p>
                      )}
                    </div>
                  )}

                  {/* Current Time Indicator for first event */}
                  {index === 0 && (
                    <div className="relative mt-2">
                      <div className="flex items-center">
                        <div className="w-2 h-2 bg-black rounded-full"></div>
                        <div className="flex-1 h-px bg-black ml-2"></div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Floating Action Button */}
        <div className="fixed bottom-8 right-6">
          <button className="w-14 h-14 bg-black rounded-full flex items-center justify-center shadow-lg hover:bg-gray-800 transition-colors">
            <svg
              className="w-6 h-6 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4v16m8-8H4"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Calendar;
