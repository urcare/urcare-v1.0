import { supabase } from "@/integrations/supabase/client";
import { ChevronDown, ChevronUp } from "lucide-react";
import React, { useCallback, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "sonner";
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
  // Add details for expandable content
  details?: {
    description?: string;
    exercises?: Array<{
      name: string;
      sets: number;
      reps: number;
      rest: string;
    }>;
    nutrition?: {
      calories: number;
      protein: string;
      carbs: string;
      fats: string;
      foods: string[];
    };
    instructions?: string[];
    tips?: string[];
  };
}

const Calendar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [selectedDay, setSelectedDay] = useState<number>(new Date().getDate());
  const [planData, setPlanData] = useState<ComprehensiveHealthPlan | null>(
    null
  );
  const [events, setEvents] = useState<Event[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  // Add state for expanded events
  const [expandedEvent, setExpandedEvent] = useState<string | null>(null);
  const [isPreview, setIsPreview] = useState<boolean>(false);
  const [savingDefault, setSavingDefault] = useState<boolean>(false);
  const [menuOpen, setMenuOpen] = useState<boolean>(false);
  const [editOpen, setEditOpen] = useState<boolean>(false);
  const [editDifficulty, setEditDifficulty] = useState<string>("");
  const [editDurationWeeks, setEditDurationWeeks] = useState<number>(0);
  const [savingEdit, setSavingEdit] = useState<boolean>(false);

  // Dynamic week based on today
  const [weekDays, setWeekDays] = useState<
    Array<{ day: string; date: number; fullDate: string }>
  >([]);

  // Keep a copy of mapped AI dates for simple filtering
  const [aiDay1Date, setAiDay1Date] = useState<string | null>(null);
  const [aiDay2Date, setAiDay2Date] = useState<string | null>(null);

  const formatHeaderDate = (d: Date) =>
    d.toLocaleDateString(undefined, { day: "numeric", month: "long" });

  const generateCurrentWeek = () => {
    const today = new Date();
    const dayOfWeek = today.getDay(); // 0=Sun ... 6=Sat
    const start = new Date(today);
    start.setDate(today.getDate() - dayOfWeek);

    const dayMap = ["S", "M", "T", "W", "T", "F", "S"];
    const result: Array<{ day: string; date: number; fullDate: string }> = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date(start);
      d.setDate(start.getDate() + i);
      result.push({
        day: dayMap[i],
        date: d.getDate(),
        fullDate: d.toISOString().split("T")[0],
      });
    }
    return result;
  };

  useEffect(() => {
    const week = generateCurrentWeek();
    setWeekDays(week);
    setSelectedDate(formatHeaderDate(new Date()));
  }, []);

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

  // Convert AI Health Coach Plan to Calendar Events
  const convertAIHealthCoachPlanToEvents = (aiPlan: any): Event[] => {
    console.log("🔄 Converting AI Health Coach Plan to events");
    const events: Event[] = [];
    let eventId = 1;

    // Helper function to get activity color
    const getActivityColor = (
      type: string
    ): "green" | "lime" | "beige" | "text" => {
      switch (type.toLowerCase()) {
        case "meal":
        case "nutrition":
          return "beige";
        case "exercise":
        case "workout":
        case "movement":
          return "green";
        case "wellness":
        case "mindfulness":
        case "breathing":
          return "lime";
        default:
          return "text";
      }
    };

    // Process Day 1 activities
    if (aiPlan.day1 && aiPlan.day1.activities) {
      aiPlan.day1.activities.forEach((activity: any) => {
        events.push({
          id: `day1-${eventId++}`,
          title: activity.title || activity.name || "Activity",
          duration: `${activity.duration || 30} min`,
          time: activity.startTime || "9:00 am",
          color: getActivityColor(activity.type || "wellness"),
          type: activity.type || "activity",
          description: activity.description || "",
          details: {
            description: activity.description || "",
            instructions: activity.instructions || [],
            tips: activity.tips || [],
          },
        });
      });
    }

    // If no activities found, create some from the plan structure
    if (events.length === 0 && aiPlan.day1) {
      const day1 = aiPlan.day1;
      let currentTime = "7:00 am";

      // Morning routine
      if (day1.focus) {
        events.push({
          id: `focus-${eventId++}`,
          title: "Daily Focus",
          duration: "15 min",
          time: currentTime,
          color: "lime",
          type: "wellness",
          description: day1.focus,
          details: {
            description: day1.focus,
            tips: ["Start your day with intention", "Focus on your main goal"],
          },
        });
      }

      // Movement
      if (day1.movement) {
        events.push({
          id: `movement-${eventId++}`,
          title: day1.movement.type === "home" ? "Home Workout" : "Gym Session",
          duration: `${day1.movement.duration_min || 45} min`,
          time: "8:00 am",
          color: "green",
          type: "workout",
          description: `${day1.movement.duration_min || 45} minute ${
            day1.movement.type
          } workout`,
          details: {
            description: `${day1.movement.duration_min || 45} minute ${
              day1.movement.type
            } workout`,
            exercises: day1.movement.exercises || [],
            tips: day1.movement.warmup || [],
          },
        });
      }

      // Nutrition/Meals
      if (day1.nutrition && day1.nutrition.meals) {
        day1.nutrition.meals.forEach((meal: any, index: number) => {
          const mealTimes = ["8:30 am", "12:30 pm", "7:00 pm"];
          events.push({
            id: `meal-${eventId++}`,
            title: meal.name || `Meal ${index + 1}`,
            duration: "30 min",
            time: mealTimes[index] || "12:00 pm",
            color: "beige",
            type: "meal",
            description: meal.detailedDescription || "Healthy meal",
            details: {
              description: meal.detailedDescription || "Healthy meal",
              nutrition: meal.macros
                ? {
                    calories: meal.macros.p + meal.macros.c + meal.macros.f,
                    protein: `${meal.macros.p}g`,
                    carbs: `${meal.macros.c}g`,
                    fats: `${meal.macros.f}g`,
                    foods: meal.items?.map((item: any) => item.food) || [],
                  }
                : undefined,
              tips: meal.eatingInstructions || [],
            },
          });
        });
      }

      // Stress management
      if (day1.stress) {
        events.push({
          id: `stress-${eventId++}`,
          title: day1.stress.practice || "Stress Management",
          duration: `${day1.stress.duration_min || 10} min`,
          time: "6:00 pm",
          color: "lime",
          type: "wellness",
          description: day1.stress.reflection_prompt || "Mindfulness practice",
          details: {
            description:
              day1.stress.reflection_prompt || "Mindfulness practice",
            tips: ["Take deep breaths", "Focus on the present moment"],
          },
        });
      }
    }

    console.log(`✅ Converted AI plan to ${events.length} events`);
    return events;
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
              details: {
                description: activity.description,
                detailedInstructions: activity.detailedInstructions,
                instructions: activity.instructions || [
                  "Follow the activity instructions carefully",
                  "Take breaks as needed",
                  "Stay hydrated throughout",
                ],
                tips: activity.tips || [
                  "Start slowly and build up intensity",
                  "Listen to your body",
                  "Maintain proper form",
                ],
                benefits: activity.benefits,
                scientificEvidence: activity.scientificEvidence,
                nutritionalDetails: activity.nutritionalDetails,
                officeOptimizations: activity.officeOptimizations,
                officeSpecific: activity.officeSpecific,
                workoutDetails: activity.workoutDetails,
                exerciseBreakdown: activity.exerciseBreakdown,
                exercises: activity.exercises,
                nutrition: activity.nutrition,
              },
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
              details: {
                description: meal.description,
                detailedInstructions: meal.detailedInstructions,
                nutrition: {
                  calories: meal.nutrition?.calories || 400,
                  protein: `${meal.nutrition?.protein || 25}g`,
                  carbs: `${meal.nutrition?.carbohydrates || 35}g`,
                  fats: `${meal.nutrition?.fat || 15}g`,
                  foods: meal.ingredients?.map(
                    (ing) => `${ing.quantity} ${ing.unit} ${ing.name}`
                  ) || ["Sample ingredient 1", "Sample ingredient 2"],
                },
                nutritionalDetails: meal.nutritionalDetails,
                instructions: meal.instructions || [
                  "Prepare all ingredients",
                  "Follow cooking instructions",
                  "Serve and enjoy your meal",
                ],
                tips: meal.tips || [
                  "Use fresh ingredients when possible",
                  "Season to taste",
                  "Store leftovers properly",
                ],
                benefits: meal.benefits,
                scientificEvidence: meal.scientificEvidence,
                mealDetails: meal.mealDetails,
              },
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
              details: {
                description: workout.description,
                detailedInstructions: workout.detailedInstructions,
                exercises: workout.exercises?.map((exercise) => ({
                  name: exercise.name,
                  sets: exercise.sets || 3,
                  reps: exercise.reps || 12,
                  rest: `${exercise.rest_between_sets || 60}s`,
                })) || [
                  { name: "Sample Exercise 1", sets: 3, reps: 12, rest: "60s" },
                  { name: "Sample Exercise 2", sets: 3, reps: 15, rest: "60s" },
                  { name: "Sample Exercise 3", sets: 3, reps: 10, rest: "90s" },
                ],
                exerciseBreakdown: workout.exerciseBreakdown,
                workoutDetails: workout.workoutDetails,
                instructions: workout.instructions || [
                  "Warm up for 5-10 minutes",
                  "Focus on proper form",
                  "Take rest between sets",
                  "Cool down with stretching",
                ],
                tips: workout.tips || [
                  "Listen to your body",
                  "Maintain proper form",
                  "Stay hydrated",
                ],
                benefits: workout.benefits,
                scientificEvidence: workout.scientificEvidence,
              },
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
              details: {
                description: activity.description,
                instructions: activity.instructions || [
                  "Find a quiet, comfortable space",
                  "Focus on your breathing",
                  "Practice mindfulness",
                  "Take your time with the activity",
                ],
                tips: activity.tips || [
                  "Start with short sessions",
                  "Be patient with yourself",
                  "Consistency is key",
                ],
              },
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
              details: {
                description: activity.description,
                instructions: activity.instructions || [
                  "Prepare for evening routine",
                  "Follow activity instructions",
                  "Relax and unwind",
                  "Prepare for sleep",
                ],
                tips: activity.tips || [
                  "Create a calm environment",
                  "Avoid screens before bed",
                  "Practice relaxation techniques",
                ],
              },
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
            details: {
              description: `Target: ${sleepDuration} hours of sleep`,
              instructions: [
                "Turn off all screens 1 hour before bed",
                "Create a cool, dark sleeping environment",
                "Practice relaxation techniques",
                "Aim for consistent sleep schedule",
              ],
              tips: [
                "Keep bedroom temperature cool (65-68°F)",
                "Use blackout curtains or eye mask",
                "Avoid caffeine after 2 PM",
                "Establish a bedtime routine",
              ],
            },
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
        preview: !!location.state?.preview,
        locationStateKeys: location.state ? Object.keys(location.state) : null,
        currentPath: window.location.pathname,
        timestamp: new Date().toISOString(),
      });

      try {
        setIsLoading(true);
        setError(null);

        if (location.state?.planData) {
          console.log("✅ Plan data found in location state");
          console.log("📋 Plan data details:", location.state.planData);
          setIsPreview(!!location.state.preview);

          // Handle AI Health Coach plans (from input bar generation)
          if (location.state.planData.day1 && location.state.planData.day2) {
            console.log("🤖 AI Health Coach Plan detected");
            const aiPlan = location.state.planData;

            // Convert AI plan activities to events
            const aiEvents = convertAIHealthCoachPlanToEvents(aiPlan);
            setEvents(aiEvents);
            setIsLoading(false);
            return;
          }

          // Handle Two-Day plan shape (day_1_plan/day_2_plan) by mapping to AI shape
          if (
            location.state.planData.day_1_plan &&
            location.state.planData.day_2_plan
          ) {
            console.log(
              "🗓️ Two-day plan shape detected; mapping to AI plan format"
            );
            const mapped = {
              day1: {
                ...location.state.planData.day_1_plan,
                activities: location.state.planData.day_1_plan.activities || [],
                focus: location.state.planData.day_1_plan.focus || "",
                movement:
                  location.state.planData.day_1_plan.movement || undefined,
                nutrition:
                  location.state.planData.day_1_plan.nutrition || undefined,
                stress: location.state.planData.day_1_plan.stress || undefined,
                sleep: location.state.planData.day_1_plan.sleep || undefined,
                recovery:
                  location.state.planData.day_1_plan.recovery || undefined,
                education: location.state.planData.day_1_plan.education || "",
                health_score: location.state.planData.day_1_plan
                  .health_score || {
                  total: 0,
                  delta: 0,
                  subscores: {
                    metabolic: 0,
                    fitness: 0,
                    sleep: 0,
                    nutrition: 0,
                  },
                },
                timezone: location.state.planData.day_1_plan.timezone || "UTC",
                date:
                  location.state.planData.plan_start_date ||
                  new Date().toISOString().split("T")[0],
              },
              day2: {
                ...location.state.planData.day_2_plan,
                activities: location.state.planData.day_2_plan.activities || [],
                focus: location.state.planData.day_2_plan.focus || "",
                movement:
                  location.state.planData.day_2_plan.movement || undefined,
                nutrition:
                  location.state.planData.day_2_plan.nutrition || undefined,
                stress: location.state.planData.day_2_plan.stress || undefined,
                sleep: location.state.planData.day_2_plan.sleep || undefined,
                recovery:
                  location.state.planData.day_2_plan.recovery || undefined,
                education: location.state.planData.day_2_plan.education || "",
                health_score: location.state.planData.day_2_plan
                  .health_score || {
                  total: 0,
                  delta: 0,
                  subscores: {
                    metabolic: 0,
                    fitness: 0,
                    sleep: 0,
                    nutrition: 0,
                  },
                },
                timezone: location.state.planData.day_2_plan.timezone || "UTC",
                date:
                  location.state.planData.plan_end_date ||
                  new Date().toISOString().split("T")[0],
              },
              overall_goals: location.state.planData.overall_goals || [],
              progress_tips: location.state.planData.progress_tips || [],
              safety_notes: location.state.planData.safety_notes || [],
              cultural_adaptations:
                location.state.planData.cultural_adaptations || [],
            } as any;

            setAiDay1Date(mapped.day1.date);
            setAiDay2Date(mapped.day2.date);

            const aiEvents = convertAIHealthCoachPlanToEvents(mapped);
            setEvents(aiEvents);
            setIsLoading(false);
            return;
          }

          // Handle Comprehensive Health Plans (from plan generation buttons)
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

  const handleSetAsDefault = useCallback(async () => {
    try {
      if (!location.state?.planData) {
        toast.error("No plan to save");
        return;
      }
      setSavingDefault(true);
      toast.loading("Saving as your default plan...", { id: "save-plan" });

      const base: any = location.state.planData;
      const user = (await supabase.auth.getUser()).data.user;
      if (!user) {
        toast.error("Not authenticated", { id: "save-plan" });
        setSavingDefault(false);
        return;
      }

      const insertRow: any = {
        user_id: user.id,
        is_active: true,
        plan_start_date:
          base.plan_start_date || new Date().toISOString().split("T")[0],
        plan_end_date:
          base.plan_end_date ||
          new Date(Date.now() + 24 * 60 * 60 * 1000)
            .toISOString()
            .split("T")[0],
        day_1_plan: base.day_1_plan || {},
        day_2_plan: base.day_2_plan || {},
        overall_goals: base.overall_goals || [],
        progress_tips: base.progress_tips || [],
        safety_notes: base.safety_notes || [],
        cultural_adaptations: base.cultural_adaptations || [],
      };

      const { data, error } = await supabase
        .from("two_day_health_plans")
        .insert(insertRow)
        .select()
        .single();

      if (error) throw error;

      setIsPreview(false);
      toast.success("Plan set as default!", { id: "save-plan" });
      
      // Navigate to health insights to show the plan is active
      setTimeout(() => {
        navigate("/health-plan", { 
          state: { 
            showInsights: true,
            planSaved: true 
          } 
        });
      }, 1000);
    } catch (e) {
      console.error("Failed to set default plan", e);
      toast.error(e?.message || "Failed to set default plan", {
        id: "save-plan",
      });
    } finally {
      setSavingDefault(false);
    }
  }, [location.state?.planData]);

  const handleRemovePlan = useCallback(async () => {
    try {
      setMenuOpen(false);
      if (isPreview) {
        toast.success("Preview closed");
        navigate("/dashboard");
        return;
      }
      const user = (await supabase.auth.getUser()).data.user;
      if (!user) {
        toast.error("Not authenticated");
        return;
      }
      toast.loading("Removing your active plan...", { id: "remove-plan" });
      const { error } = await supabase
        .from("two_day_health_plans")
        .update({ is_active: false })
        .eq("user_id", user.id)
        .eq("is_active", true);
      if (error) throw error;
      toast.success("Plan removed", { id: "remove-plan" });
      navigate("/dashboard");
    } catch (e) {
      console.error("Remove plan failed", e);
      toast.error("Failed to remove plan", { id: "remove-plan" });
    }
  }, [isPreview, navigate]);

  const handleChangePlan = useCallback(() => {
    setMenuOpen(false);
    navigate("/dashboard");
  }, [navigate]);

  const openEdit = useCallback(() => {
    setMenuOpen(false);
    // Seed edit values from planData or defaults
    const pd: any = location.state?.planData || planData || {};
    setEditDifficulty(pd.difficulty || "moderate");
    setEditDurationWeeks(pd.duration_weeks || 12);
    setEditOpen(true);
  }, [location.state?.planData, planData]);

  const handleSaveEdit = useCallback(async () => {
    try {
      setSavingEdit(true);
      const original: any = location.state?.planData || planData || {};
      // update difficulty/duration meta on the local shape
      const updated = {
        ...original,
        difficulty: editDifficulty,
        duration_weeks: editDurationWeeks,
      } as any;

      if (isPreview) {
        // Update local preview only and refresh events
        navigate("/calendar", {
          state: { ...location.state, planData: updated, preview: true },
          replace: true,
        });
        toast.success("Preview updated");
      } else {
        // Persist to active plan using two_day_health_plans columns
        const user = (await supabase.auth.getUser()).data.user;
        if (!user) {
          toast.error("Not authenticated");
          setSavingEdit(false);
          return;
        }
        toast.loading("Updating your plan...", { id: "edit-plan" });

        // Merge meta into day_1_plan/day_2_plan JSON so it is carried in DB
        const day1 = {
          ...(original.day_1_plan || {}),
          difficulty: editDifficulty,
          duration_weeks: editDurationWeeks,
        };
        const day2 = {
          ...(original.day_2_plan || {}),
          difficulty: editDifficulty,
          duration_weeks: editDurationWeeks,
        };

        const { data, error } = await supabase
          .from("two_day_health_plans")
          .update({
            day_1_plan: day1,
            day_2_plan: day2,
            plan_start_date:
              original.plan_start_date ||
              new Date().toISOString().split("T")[0],
            plan_end_date:
              original.plan_end_date ||
              new Date(Date.now() + 24 * 60 * 60 * 1000)
                .toISOString()
                .split("T")[0],
          })
          .eq("user_id", user.id)
          .eq("is_active", true)
          .select();
        if (error) throw error;
        toast.success("Plan updated", { id: "edit-plan" });
        navigate("/calendar", {
          state: {
            planData: { ...updated, day_1_plan: day1, day_2_plan: day2 },
            preview: false,
          },
          replace: true,
        });
      }
    } catch (e) {
      console.error("Edit save failed", e);
      toast.error("Failed to save changes", { id: "edit-plan" });
    } finally {
      setSavingEdit(false);
      setEditOpen(false);
    }
  }, [
    isPreview,
    editDifficulty,
    editDurationWeeks,
    location.state,
    planData,
    navigate,
  ]);

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
                  ? `${planData.duration_weeks} weeks protocol`
                  : "4 weeks protocol"}
              </p>
            </div>
          </div>
          <div className="text-white">
            {isPreview && (
              <button
                onClick={handleSetAsDefault}
                disabled={savingDefault}
                className={`px-4 py-2 rounded-lg ${
                  savingDefault
                    ? "bg-gray-500"
                    : "bg-amber-500 hover:bg-amber-600"
                }`}
              >
                {savingDefault ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Saving...
                  </>
                ) : (
                  "Set as default protocol"
                )}
              </button>
            )}
            {/* Settings menu trigger */}
            <div className="inline-block ml-3 relative">
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-colors"
                aria-haspopup="true"
                aria-expanded={menuOpen}
              >
                <svg
                  className="w-6 h-6"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                </svg>
              </button>
              {menuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white text-black rounded-lg shadow-lg z-20">
                  <button
                    onClick={openEdit}
                    className="w-full text-left px-4 py-2 hover:bg-gray-100 rounded-t-lg"
                  >
                    Edit protocol
                  </button>
                  <button
                    onClick={handleChangePlan}
                    className="w-full text-left px-4 py-2 hover:bg-gray-100"
                  >
                    Change protocol
                  </button>
                  <button
                    onClick={handleRemovePlan}
                    className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 rounded-b-lg"
                  >
                    Remove protocol
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="bg-white rounded-t-3xl mt-8 relative z-10 min-h-screen">
        {/* Drag Handle */}
        <div className="flex justify-center pt-3 pb-2">
          <div className="w-12 h-1 bg-gray-300 rounded-full"></div>
        </div>

        <div className="px-6">
          {/* Protocol Details (replacing timetable) */}
          <h2 className="text-2xl font-bold text-black mb-6">Protocol Details</h2>
          {isPreview && (
            <div className="mb-4 p-3 bg-amber-50 border border-amber-200 rounded-lg text-amber-800 text-sm">
              Preview mode — set this protocol as default to keep the protocol.
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">

            <div className="rounded-2xl bg-white p-4 border border-gray-200">
              <h3 className="text-lg font-semibold text-black mb-2">Summary</h3>
              <div className="text-sm text-gray-700 space-y-1">
                <div><strong>Name:</strong> {planData?.plan_name || "Custom Protocol"}</div>
                <div><strong>Primary Goal:</strong> {planData?.primary_goal || "Improve overall health"}</div>
                <div><strong>Duration:</strong> {planData?.duration_weeks || 12} weeks</div>
                <div><strong>Difficulty:</strong> {(planData as any)?.difficulty || "Moderate"}</div>
                <div><strong>Starts:</strong> {(location.state as any)?.planData?.plan_start_date || "Today"}</div>
              </div>
            </div>

            <div className="rounded-2xl bg-white p-4 border border-gray-200">
              <h3 className="text-lg font-semibold text-black mb-2">Expected Impacts</h3>
              <ul className="list-disc pl-5 text-sm text-gray-700 space-y-1">
                {(planData as any)?.expected_outcomes?.length
                  ? (planData as any).expected_outcomes.map((t: string, i: number) => (<li key={i}>{t}</li>))
                  : ["Better energy and focus","Improved fitness and mobility","Consistent meal timing and nutrition","Healthier sleep routine"].map((t, i) => (<li key={i}>{t}</li>))}
              </ul>
            </div>

            <div className="rounded-2xl bg-white p-4 border border-gray-200">
              <h3 className="text-lg font-semibold text-black mb-2">Goals</h3>
              <ul className="list-disc pl-5 text-sm text-gray-700 space-y-1">
                {((location.state as any)?.planData?.overall_goals || planData?.overall_goals || ["Build healthy habits","Balance nutrition & activity"]).map((g: string, i: number) => (<li key={i}>{g}</li>))}
              </ul>
            </div>

            <div className="rounded-2xl bg-white p-4 border border-gray-200">
              <h3 className="text-lg font-semibold text-black mb-2">Tips & Safety</h3>
              <ul className="list-disc pl-5 text-sm text-gray-700 space-y-1">
                {(((location.state as any)?.planData?.progress_tips) || []).concat(((location.state as any)?.planData?.safety_notes) || []).slice(0,6).map((t: string, i: number) => (<li key={i}>{t}</li>))}
                {(!((location.state as any)?.planData?.progress_tips)?.length && !((location.state as any)?.planData?.safety_notes)?.length) && (<>
                  <li>Hydrate well and warm up before workouts</li>
                  <li>Scale intensity based on your current fitness</li>
                  <li>Prioritize sleep and recovery</li>
                </>)}
              </ul>
            </div>
          </div>

          <div className="rounded-2xl bg-white p-4 border border-gray-200">
            <h3 className="text-lg font-semibold text-black mb-2">What’s Inside</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm text-gray-700">
              <div><strong>Workouts</strong><p className="mt-1">{planData?.plan_data?.daily_templates?.weekday?.workouts?.length || 4} sessions/week, progressive overload</p></div>
              <div><strong>Nutrition</strong><p className="mt-1">Balanced macros, regular meals, meal-prep guidance</p></div>
              <div><strong>Wellness</strong><p className="mt-1">Mindfulness, hydration, and sleep hygiene practices</p></div>
            </div>
          </div>
        </div>










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

      {/* Edit Plan Modal */}
      {editOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-30">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md">
            <h3 className="text-xl font-bold text-black mb-4">Edit protocol</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-700 mb-1">
                  Difficulty
                </label>
                <select
                  value={editDifficulty}
                  onChange={(e) => setEditDifficulty(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                >
                  <option value="easy">Easy</option>
                  <option value="moderate">Moderate</option>
                  <option value="hard">Hard</option>
                </select>
              </div>
              <div>
                <label className="block text-sm text-gray-700 mb-1">
                  Duration (weeks)
                </label>
                <input
                  type="number"
                  min={4}
                  max={52}
                  value={editDurationWeeks}
                  onChange={(e) =>
                    setEditDurationWeeks(parseInt(e.target.value || "0", 10))
                  }
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                />
              </div>
            </div>
            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => setEditOpen(false)}
                className="px-4 py-2 rounded-lg bg-gray-100 text-black hover:bg-gray-200"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveEdit}
                disabled={savingEdit}
                className={`px-4 py-2 rounded-lg text-white ${
                  savingEdit ? "bg-gray-500" : "bg-black hover:bg-gray-800"
                }`}
              >
                {savingEdit ? "Saving..." : "Save changes"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Calendar;
