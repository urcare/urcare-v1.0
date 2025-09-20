import React, { useCallback, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Activity,
  ComprehensiveHealthPlan,
  MealPlan,
  WorkoutPlan,
} from "../types/comprehensiveHealthPlan";

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
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

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

  // Convert plan data to calendar events with user's actual schedule
  const convertPlanToEvents = useCallback(
    (plan: ComprehensiveHealthPlan): Event[] => {
      console.log("🔄 CONVERTING PLAN TO EVENTS WITH USER SCHEDULE");
      console.log("📋 Plan received for conversion:", {
        planId: plan.id,
        planName: plan.plan_name,
        planType: plan.plan_type,
        hasPlanData: !!plan.plan_data,
        planDataKeys: plan.plan_data ? Object.keys(plan.plan_data) : null,
      });

      const events: Event[] = [];
      let eventId = 1;

      // Helper function to convert time string to minutes
      const timeToMinutes = (timeStr: string): number => {
        if (!timeStr) return 0;
        const [time, period] = timeStr.split(" ");
        const [hours, minutes] = time.split(":").map(Number);
        let totalMinutes = hours * 60 + minutes;
        if (period === "pm" && hours !== 12) totalMinutes += 12 * 60;
        if (period === "am" && hours === 12) totalMinutes -= 12 * 60;
        return totalMinutes;
      };

      // Get user's schedule from plan data or use defaults
      const userSchedule = {
        wakeUp: timeToMinutes(
          plan.plan_data.user_schedule?.wake_up_time || "06:00 am"
        ),
        workStart: timeToMinutes(
          plan.plan_data.user_schedule?.work_start || "09:00 am"
        ),
        workEnd: timeToMinutes(
          plan.plan_data.user_schedule?.work_end || "17:00 pm"
        ),
        breakfast: timeToMinutes(
          plan.plan_data.user_schedule?.breakfast_time || "07:00 am"
        ),
        lunch: timeToMinutes(
          plan.plan_data.user_schedule?.lunch_time || "12:00 pm"
        ),
        dinner: timeToMinutes(
          plan.plan_data.user_schedule?.dinner_time || "19:00 pm"
        ),
        workout: timeToMinutes(
          plan.plan_data.user_schedule?.workout_time || "18:00 pm"
        ),
        sleep: timeToMinutes(
          plan.plan_data.user_schedule?.sleep_time || "22:00 pm"
        ),
      };

      console.log("👤 User's actual schedule:", userSchedule);

      // Helper function to format time from minutes
      const formatTime = (minutes: number): string => {
        const hours = Math.floor(minutes / 60);
        const mins = minutes % 60;
        const period = hours >= 12 ? "pm" : "am";
        const displayHours = hours > 12 ? hours - 12 : hours === 0 ? 12 : hours;
        return `${displayHours}:${mins.toString().padStart(2, "0")} ${period}`;
      };

      // Helper function to get color based on activity type
      const getActivityColor = (type: string): Event["color"] => {
        switch (type) {
          case "meal":
            return "lime";
          case "exercise":
            return "beige";
          case "wellness":
            return "green";
          case "hydration":
            return "green";
          case "sleep":
            return "text";
          default:
            return "green";
        }
      };

      // Add error handling for plan data structure
      try {
        // Check if plan and plan_data exist
        if (!plan || !plan.plan_data || !plan.plan_data.daily_templates) {
          console.warn("Plan data structure is incomplete:", plan);
          return events;
        }

        // Get weekday template (assuming we're showing a weekday)
        const weekdayTemplate = plan.plan_data.daily_templates.weekday;
        if (!weekdayTemplate) {
          console.warn("Weekday template not found in plan data");
          return events;
        }

        // Process morning routine activities (after wake up)
        if (
          weekdayTemplate.morning_routine &&
          weekdayTemplate.morning_routine.length > 0
        ) {
          let morningTime = userSchedule.wakeUp;
          weekdayTemplate.morning_routine.forEach((activity: Activity) => {
            events.push({
              id: `morning-${eventId++}`,
              title: activity.title,
              duration: `${activity.duration} min`,
              time: formatTime(morningTime),
              color: getActivityColor(activity.type),
              type: "activity",
              description: activity.description,
            });
            morningTime += activity.duration + 15; // Add 15 min buffer between activities
          });
        }

        // Process meals with user's actual meal times
        if (weekdayTemplate.meals && weekdayTemplate.meals.length > 0) {
          weekdayTemplate.meals.forEach((meal: MealPlan, index: number) => {
            // Use user's actual meal times
            let mealTime;
            if (index === 0) {
              // Breakfast - use user's breakfast time
              mealTime = userSchedule.breakfast;
            } else if (index === 1) {
              // Lunch - use user's lunch time
              mealTime = userSchedule.lunch;
            } else if (index === 2) {
              // Dinner - use user's dinner time
              mealTime = userSchedule.dinner;
            } else {
              // Additional meals - space them out
              mealTime = userSchedule.breakfast + index * 4 * 60; // Every 4 hours from breakfast
            }

            events.push({
              id: `meal-${eventId++}`,
              title: meal.name,
              duration: `${meal.prep_time + meal.cook_time} min`,
              time: formatTime(mealTime),
              color: "lime",
              type: "meal",
              description: meal.description,
            });
          });
        }

        // Process workouts - use user's preferred workout time
        if (weekdayTemplate.workouts && weekdayTemplate.workouts.length > 0) {
          weekdayTemplate.workouts.forEach((workout: WorkoutPlan) => {
            // Use user's actual workout time preference
            let workoutTime = userSchedule.workout;

            // If workout time is during work hours, adjust to after work
            if (
              workoutTime >= userSchedule.workStart &&
              workoutTime <= userSchedule.workEnd
            ) {
              workoutTime = userSchedule.workEnd + 30; // 30 minutes after work ends
            }

            events.push({
              id: `workout-${eventId++}`,
              title: workout.name,
              duration: `${workout.duration} min`,
              time: formatTime(workoutTime),
              color: "beige",
              type: "workout",
              description: workout.description,
            });
          });
        }

        // Process wellness activities
        if (
          weekdayTemplate.wellness_activities &&
          weekdayTemplate.wellness_activities.length > 0
        ) {
          weekdayTemplate.wellness_activities.forEach((activity: Activity) => {
            // Schedule wellness activities during work breaks or after work
            let wellnessTime = userSchedule.workStart + 4 * 60; // 4 hours after work starts (lunch break)

            events.push({
              id: `wellness-${eventId++}`,
              title: activity.title,
              duration: `${activity.duration} min`,
              time: formatTime(wellnessTime),
              color: getActivityColor(activity.type),
              type: "wellness",
              description: activity.description,
            });
          });
        }

        // Process evening routine (before sleep)
        if (
          weekdayTemplate.evening_routine &&
          weekdayTemplate.evening_routine.length > 0
        ) {
          let eveningTime = userSchedule.sleep - 60; // 1 hour before sleep
          weekdayTemplate.evening_routine.forEach((activity: Activity) => {
            events.push({
              id: `evening-${eventId++}`,
              title: activity.title,
              duration: `${activity.duration} min`,
              time: formatTime(eveningTime),
              color: "text",
              type: "wellness",
              description: activity.description,
            });
            eveningTime -= activity.duration + 15; // Move earlier for next activity
          });
        }

        // Add sleep time using user's actual sleep time
        if (weekdayTemplate.sleep_targets) {
          const sleepDuration =
            weekdayTemplate.sleep_targets.target_duration || 8;
          events.push({
            id: `sleep-${eventId++}`,
            title: "Sleep",
            duration: `${sleepDuration * 60} min`,
            time: formatTime(userSchedule.sleep),
            color: "text",
            type: "wellness",
            description: `Target: ${sleepDuration} hours of sleep`,
          });
        }

        // Sort events by time
        const sortedEvents = events.sort((a, b) => {
          const timeA = parseTime(a.time);
          const timeB = parseTime(b.time);
          return timeA - timeB;
        });

        console.log(
          "✅ Plan conversion completed successfully with user schedule"
        );
        console.log("📅 Final events generated:", {
          totalEvents: sortedEvents.length,
          userSchedule: userSchedule,
          events: sortedEvents.map((e) => ({
            id: e.id,
            title: e.title,
            time: e.time,
            type: e.type,
            color: e.color,
          })),
        });

        return sortedEvents;
      } catch (error) {
        console.error("❌ Error converting plan to events:", error);
        console.error("🔍 Conversion error details:", {
          errorMessage: error.message,
          errorStack: error.stack,
          planData: plan,
        });
        setError("Failed to process plan data");
        return events; // Return empty events array on error
      }
    },
    []
  );

  // Load plan data from location state with comprehensive error handling
  useEffect(() => {
    const loadPlanData = async () => {
      console.log("📅 CALENDAR PAGE LOADING STARTED");
      console.log("🔍 Location state received:", {
        hasLocationState: !!location.state,
        hasPlanData: !!location.state?.planData,
        hasPlanName: !!location.state?.planName,
        locationStateKeys: location.state ? Object.keys(location.state) : null,
        currentPath: window.location.pathname,
        timestamp: new Date().toISOString(),
      });

      try {
        setIsLoading(true);
        setError(null);

        if (location.state?.planData) {
          console.log("✅ Plan data found in location state");
          console.log("📋 Plan data details:", {
            planId: location.state.planData.id,
            planName: location.state.planData.plan_name,
            planType: location.state.planData.plan_type,
            startDate: location.state.planData.start_date,
            durationWeeks: location.state.planData.duration_weeks,
            status: location.state.planData.status,
            hasPlanData: !!location.state.planData.plan_data,
            planDataKeys: location.state.planData.plan_data
              ? Object.keys(location.state.planData.plan_data)
              : null,
            fullPlanData: location.state.planData,
          });

          // Validate plan data structure with more robust checks
          const planData = location.state.planData;
          if (!planData || typeof planData !== "object") {
            console.warn(
              "❌ Invalid plan data structure, using default events"
            );
            console.log("🔍 Invalid plan data:", planData);
            setEvents(defaultEvents);
            return;
          }

          console.log("✅ Plan data validation passed, setting plan data");
          setPlanData(planData);

          // Try to convert plan to events with error handling
          try {
            console.log("🔄 Converting plan to events...");
            const planEvents = convertPlanToEvents(planData);
            console.log("📅 Plan events generated:", {
              eventCount: planEvents.length,
              events: planEvents.map((e) => ({
                id: e.id,
                title: e.title,
                time: e.time,
                type: e.type,
              })),
            });
            setEvents(planEvents.length > 0 ? planEvents : defaultEvents);
            console.log("✅ Events set successfully");
          } catch (conversionError) {
            console.warn(
              "❌ Plan conversion failed, using default events:",
              conversionError
            );
            console.log("🔍 Conversion error details:", {
              errorMessage: conversionError.message,
              errorStack: conversionError.stack,
              planData: planData,
            });
            setEvents(defaultEvents);
          }
        } else {
          console.log(
            "⚠️ No plan data in location state, using default events"
          );
          console.log(
            "📝 Default events:",
            defaultEvents.map((e) => ({
              id: e.id,
              title: e.title,
              time: e.time,
            }))
          );
          setEvents(defaultEvents);
        }
      } catch (error) {
        console.error("❌ Error loading plan data:", error);
        console.error("🔍 Error details:", {
          errorMessage: error.message,
          errorStack: error.stack,
          errorName: error.name,
          locationState: location.state,
        });
        setError(
          error instanceof Error
            ? error.message
            : "Failed to load calendar data"
        );
        setEvents(defaultEvents); // Fallback to default events
        console.log("🔄 Fallback to default events due to error");
      } finally {
        console.log("🏁 Calendar loading completed");
        setIsLoading(false);
      }
    };

    // Debounce multiple calls to prevent rapid reloads
    const timeoutId = setTimeout(loadPlanData, 50);
    return () => clearTimeout(timeoutId);
  }, [location.state?.planData, convertPlanToEvents]); // More specific dependency

  const handleBackToDashboard = useCallback(() => {
    try {
      navigate("/dashboard");
    } catch (error) {
      console.error("Navigation error:", error);
      window.location.href = "/dashboard";
    }
  }, [navigate]);

  const handleRetry = useCallback(() => {
    setError(null);
    setIsLoading(true);
    // Trigger re-load
    window.location.reload();
  }, []);

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

  // Error Boundary Component
  if (error) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center text-white p-6">
          <div className="mb-4">
            <svg
              className="w-16 h-16 mx-auto text-red-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
              />
            </svg>
          </div>
          <h2 className="text-xl font-bold mb-2">Calendar Error</h2>
          <p className="text-gray-300 mb-4">{error}</p>
          <div className="space-x-4">
            <button
              onClick={handleRetry}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors"
            >
              Try Again
            </button>
            <button
              onClick={handleBackToDashboard}
              className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              Go Back
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Loading State
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center text-white">
          <div className="animate-spin w-12 h-12 border-4 border-white border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-lg">Loading your calendar...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Header with Background Image */}
      <div
        className="px-6 pt-12 pb-4 relative"
        style={{
          backgroundImage: "url(/images/imgg.JPG)",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        {/* Dark overlay for better text readability */}
        <div className="absolute inset-0 bg-black bg-opacity-40"></div>
        <div className="flex justify-between items-start relative z-10">
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
                {planData
                  ? planData.primary_goal || planData.plan_name
                  : "Habit Builder"}
              </h1>
              <p className="text-white text-sm">
                {planData
                  ? `${planData.duration_weeks} weeks plan`
                  : "4 weeks plan"}
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
            {events && events.length > 0 ? (
              events.map((event, index) => (
                <div key={event.id} className="flex items-start space-x-4">
                  {/* Time Label */}
                  <div className="w-16 text-sm text-gray-600 mt-1">
                    {event.time}
                  </div>

                  {/* Event Card */}
                  <div className="flex-1">
                    {event.color === "text" ? (
                      <div className="py-2">
                        <h3 className="text-black font-medium">
                          {event.title}
                        </h3>
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
              ))
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-600">No events scheduled for today</p>
              </div>
            )}
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
