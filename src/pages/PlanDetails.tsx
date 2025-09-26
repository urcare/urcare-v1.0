import { supabase } from "@/integrations/supabase/client";
import React, { useCallback, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import {
  EnhancedPlanDetails,
  EnhancedPlanDetailsService,
} from "../services/enhancedPlanDetailsService";
import { PlanNamingService } from "../services/planNamingService";
import {
  Activity,
  ComprehensiveHealthPlan,
  MealPlan,
  WorkoutPlan,
} from "../types/comprehensiveHealthPlan";

interface Event {
  id: string;
  title: string;
  start: Date;
  end: Date;
  description: string;
  type: string;
  priority: string;
  category: string;
  instructions: string[];
  tips: string[];
  benefits?: string[];
  scientificEvidence?: string[];
  day: number;
  isAI: boolean;
  duration?: string;
  time?: string;
  color?: "green" | "lime" | "beige" | "text";
  details?: any;
}

const PlanDetails: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [planData, setPlanData] = useState<ComprehensiveHealthPlan | null>(
    null
  );
  const [enhancedDetails, setEnhancedDetails] =
    useState<EnhancedPlanDetails | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
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
  const [selectedDate, setSelectedDate] = useState<string>("");

  // Keep a copy of mapped AI dates for simple filtering
  const [aiDay1Date, setAiDay1Date] = useState<string | null>(null);
  const [aiDay2Date, setAiDay2Date] = useState<string | null>(null);
  const [events, setEvents] = useState<Event[]>([]);

  const formatHeaderDate = (d: Date) =>
    d.toLocaleDateString(undefined, { day: "numeric", month: "long" });

  // Helper function to parse time string to minutes
  const parseTime = (timeStr: string): number => {
    if (!timeStr) return 0;
    const [time, period] = timeStr.split(" ");
    const [hours, minutes] = time.split(":").map(Number);
    let totalMinutes = hours * 60 + minutes;
    if (period === "pm" && hours !== 12) totalMinutes += 12 * 60;
    if (period === "am" && hours === 12) totalMinutes -= 12 * 60;
    return totalMinutes;
  };

  // Generate goal-specific expected impacts
  const getExpectedImpacts = (goal: string): string[] => {
    const goalLower = goal.toLowerCase();

    if (goalLower.includes("weight") && goalLower.includes("gain")) {
      return [
        "Increased muscle mass and strength",
        "Improved body composition",
        "Enhanced appetite and nutrition intake",
        "Better energy levels and recovery",
      ];
    }

    if (goalLower.includes("weight") && goalLower.includes("loss")) {
      return [
        "Sustainable weight loss",
        "Improved body composition",
        "Better energy levels",
        "Enhanced self-confidence",
      ];
    }

    if (goalLower.includes("muscle") || goalLower.includes("build")) {
      return [
        "Increased muscle mass",
        "Enhanced strength and power",
        "Improved body composition",
        "Better metabolic health",
      ];
    }

    if (goalLower.includes("fitness") || goalLower.includes("endurance")) {
      return [
        "Improved cardiovascular health",
        "Enhanced endurance and stamina",
        "Better overall fitness",
        "Increased energy levels",
      ];
    }

    if (goalLower.includes("stress") || goalLower.includes("mental")) {
      return [
        "Reduced stress levels",
        "Improved mental clarity",
        "Better sleep quality",
        "Enhanced emotional well-being",
      ];
    }

    // Default impacts for general health improvement
    return [
      "Better energy and focus",
      "Improved fitness and mobility",
      "Consistent meal timing and nutrition",
      "Healthier sleep routine",
    ];
  };

  // Get plan name based on difficulty level
  // Get systematic plan name using the naming service
  const getSystematicPlanName = (goal: string, difficulty: string) => {
    if (!goal || goal.trim() === "") {
      return "Health Protocol";
    }

    const cleanedGoal = PlanNamingService.cleanUserGoal(goal);
    const systematicName = PlanNamingService.getPlanNameForDifficulty(
      cleanedGoal,
      difficulty || "moderate"
    );

    // Debug logging
    console.log("Plan naming debug:", {
      originalGoal: goal,
      cleanedGoal,
      difficulty,
      systematicName,
    });

    return systematicName;
  };

  // Get goal-specific theme colors with emerald green theme
  const getGoalTheme = (goal: string) => {
    const goalLower = goal.toLowerCase();

    if (goalLower.includes("weight") && goalLower.includes("gain")) {
      return {
        primary: "bg-emerald-600",
        secondary: "bg-emerald-50",
        accent: "text-emerald-700",
        border: "border-emerald-200",
        icon: "💪",
        gradient: "from-emerald-500 to-green-600",
      };
    }

    if (goalLower.includes("weight") && goalLower.includes("loss")) {
      return {
        primary: "bg-emerald-600",
        secondary: "bg-emerald-50",
        accent: "text-emerald-700",
        border: "border-emerald-200",
        icon: "🔥",
        gradient: "from-emerald-500 to-green-600",
      };
    }

    if (goalLower.includes("muscle") || goalLower.includes("build")) {
      return {
        primary: "bg-emerald-600",
        secondary: "bg-emerald-50",
        accent: "text-emerald-700",
        border: "border-emerald-200",
        icon: "🏋️",
        gradient: "from-emerald-500 to-green-600",
      };
    }

    if (goalLower.includes("fitness") || goalLower.includes("endurance")) {
      return {
        primary: "bg-emerald-600",
        secondary: "bg-emerald-50",
        accent: "text-emerald-700",
        border: "border-emerald-200",
        icon: "🏃",
        gradient: "from-emerald-500 to-green-600",
      };
    }

    if (goalLower.includes("stress") || goalLower.includes("mental")) {
      return {
        primary: "bg-emerald-600",
        secondary: "bg-emerald-50",
        accent: "text-emerald-700",
        border: "border-emerald-200",
        icon: "🧘",
        gradient: "from-emerald-500 to-green-600",
      };
    }

    return {
      primary: "bg-emerald-600",
      secondary: "bg-emerald-50",
      accent: "text-emerald-700",
      border: "border-emerald-200",
      icon: "🌟",
      gradient: "from-emerald-500 to-green-600",
    };
  };

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

  // Generate enhanced details when plan data is available
  useEffect(() => {
    if (planData) {
      const userGoal = planData.primary_goal || "improve overall health";
      const enhanced = EnhancedPlanDetailsService.generateEnhancedDetails(
        planData,
        userGoal
      );
      setEnhancedDetails(enhanced);
    }
  }, [planData]);

  // Convert AI Health Coach plan to calendar events
  const convertAIHealthCoachPlanToEvents = useCallback(
    (aiPlan: any): Event[] => {
      console.log("🤖 Converting AI Health Coach plan to events");
      const events: Event[] = [];

      // Convert day 1 activities
      if (aiPlan.day1 && aiPlan.day1.activities) {
        aiPlan.day1.activities.forEach((activity: any, index: number) => {
          const startTime = new Date(
            `${aiPlan.day1.date}T${activity.startTime}`
          );
          const endTime = new Date(`${aiPlan.day1.date}T${activity.endTime}`);

          events.push({
            id: `ai-day1-${activity.id}`,
            title: activity.title,
            start: startTime,
            end: endTime,
            description: activity.description,
            type: activity.type,
            priority: activity.priority,
            category: activity.category,
            instructions: activity.instructions,
            tips: activity.tips,
            benefits: activity.benefits,
            scientificEvidence: activity.scientificEvidence,
            day: 1,
            isAI: true,
          });
        });
      }

      // Convert day 2 activities
      if (aiPlan.day2 && aiPlan.day2.activities) {
        aiPlan.day2.activities.forEach((activity: any, index: number) => {
          const startTime = new Date(
            `${aiPlan.day2.date}T${activity.startTime}`
          );
          const endTime = new Date(`${aiPlan.day2.date}T${activity.endTime}`);

          events.push({
            id: `ai-day2-${activity.id}`,
            title: activity.title,
            start: startTime,
            end: endTime,
            description: activity.description,
            type: activity.type,
            priority: activity.priority,
            category: activity.category,
            instructions: activity.instructions,
            tips: activity.tips,
            benefits: activity.benefits,
            scientificEvidence: activity.scientificEvidence,
            day: 2,
            isAI: true,
          });
        });
      }

      console.log(`✅ Converted ${events.length} AI activities to events`);
      return events;
    },
    []
  );

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
            const wellnessTime = userSchedule.workStart + 4 * 60; // 4 hours after work starts (lunch break)

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
            setEvents([]);
            return;
          }

          console.log("✅ Plan data validation passed, setting plan data");
          setPlanData(planData);
        } else {
          console.log("⚠️ No plan data in location state");
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
          error instanceof Error ? error.message : "Failed to load plan data"
        );
      } finally {
        console.log("🏁 Calendar loading completed");
        setIsLoading(false);
      }
    };

    // Debounce multiple calls to prevent rapid reloads
    const timeoutId = setTimeout(loadPlanData, 50);
    return () => clearTimeout(timeoutId);
  }, [location.state?.planData]); // More specific dependency

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

      // Delete any existing active plan first to avoid constraint conflicts
      const { error: deleteError } = await supabase
        .from("two_day_health_plans")
        .delete()
        .eq("user_id", user.id)
        .eq("is_active", true);

      if (deleteError) {
        console.warn("Warning: Could not delete existing plans:", deleteError);
        // Continue anyway - the insert might still work
      }

      // Store metadata within the JSONB fields
      const day1Plan = {
        ...(base.day_1_plan || {}),
        overall_goals: base.overall_goals || [],
        progress_tips: base.progress_tips || [],
        safety_notes: base.safety_notes || [],
        cultural_adaptations: base.cultural_adaptations || [],
      };

      const day2Plan = {
        ...(base.day_2_plan || {}),
        overall_goals: base.overall_goals || [],
        progress_tips: base.progress_tips || [],
        safety_notes: base.safety_notes || [],
        cultural_adaptations: base.cultural_adaptations || [],
      };

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
        day_1_plan: day1Plan,
        day_2_plan: day2Plan,
      };

      const { data, error } = await supabase
        .from("two_day_health_plans")
        .insert(insertRow)
        .select()
        .single();

      if (error) throw error;

      setIsPreview(false);
      toast.success("Plan set as default!", { id: "save-plan" });

      // Navigate to dashboard to show the plan is active
      setTimeout(() => {
        navigate("/dashboard", {
          state: {
            showInsights: true,
            planSaved: true,
          },
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
      // Delete active plan instead of update to avoid unique constraint conflicts
      const { error } = await supabase
        .from("two_day_health_plans")
        .delete()
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
        navigate("/plan-details", {
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
        navigate("/plan-details", {
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
          <h2 className="text-xl font-bold mb-2">Plan Details Error</h2>
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
          <p className="text-lg">Loading your plan details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Header with Background Image */}
      <div
        className="px-6 pt-12 pb-16 relative"
        style={{
          backgroundImage: "url(/images/imgg.JPG)",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          minHeight: "300px",
        }}
      >
        {/* Dark overlay for better text readability */}
        <div className="absolute inset-0 bg-black bg-opacity-40"></div>

        <div className="flex justify-between items-start relative z-10">
          <div className="flex items-center space-x-4">
            <button
              onClick={handleBackToDashboard}
              className="text-white hover:text-gray-300 transition-colors p-2 rounded-full bg-white/10 hover:bg-white/20"
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
            <div className="flex items-center space-x-3">
              <div
                className={`w-12 h-12 ${
                  getGoalTheme(
                    planData?.primary_goal || "improve overall health"
                  ).primary
                } rounded-full flex items-center justify-center text-white text-2xl`}
              >
                {
                  getGoalTheme(
                    planData?.primary_goal || "improve overall health"
                  ).icon
                }
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white mb-1">
                  {getSystematicPlanName(
                    planData?.primary_goal ||
                      (location.state as any)?.userGoal ||
                      (location.state as any)?.planData?.primary_goal,
                    (planData as any)?.difficulty ||
                      (location.state as any)?.difficulty ||
                      "moderate"
                  ) ||
                    planData?.plan_name ||
                    planData?.primary_goal ||
                    (location.state as any)?.userGoal ||
                    "Health Protocol"}
                </h1>
                <p className="text-white/90 text-sm">
                  {planData?.duration_weeks ||
                    (location.state as any)?.planData?.duration_weeks ||
                    12}{" "}
                  weeks protocol
                </p>
              </div>
            </div>
          </div>
          <div className="text-white">
            {/* Settings menu trigger */}
            <div className="inline-block relative">
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
                  {isPreview && (
                    <button
                      onClick={handleSetAsDefault}
                      disabled={savingDefault}
                      className={`w-full text-left px-4 py-2 hover:bg-gray-100 rounded-t-lg flex items-center ${
                        savingDefault ? "opacity-50 cursor-not-allowed" : ""
                      }`}
                    >
                      {savingDefault ? (
                        <>
                          <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin mr-2"></div>
                          Saving...
                        </>
                      ) : (
                        "Set as default protocol"
                      )}
                    </button>
                  )}
                  <button
                    onClick={handleChangePlan}
                    className={`w-full text-left px-4 py-2 hover:bg-gray-100 ${
                      isPreview ? "" : "rounded-t-lg"
                    } ${isPreview ? "rounded-b-lg" : ""}`}
                  >
                    Change protocol
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="relative z-10 min-h-screen -mt-8">
        {/* Drag Handle */}
        <div className="flex justify-center pt-3 pb-2">
          <div className="w-12 h-1 bg-gray-300 rounded-full"></div>
        </div>

        <div className="px-6">
          {/* Protocol Details Card with Goal-Specific Theming */}
          <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8 relative overflow-hidden">
            {/* Goal-specific accent line */}
            <div
              className={`absolute top-0 left-0 right-0 h-1 ${
                getGoalTheme(planData?.primary_goal || "improve overall health")
                  .primary
              }`}
            ></div>

            <div className="flex items-center space-x-3 mb-6">
              <div
                className={`w-10 h-10 ${
                  getGoalTheme(
                    planData?.primary_goal || "improve overall health"
                  ).secondary
                } rounded-xl flex items-center justify-center`}
              >
                <span className="text-2xl">
                  {
                    getGoalTheme(
                      planData?.primary_goal || "improve overall health"
                    ).icon
                  }
                </span>
              </div>
              <h2 className="text-2xl font-bold text-gray-900">
                Protocol Details
              </h2>
            </div>

            {isPreview && (
              <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-xl text-amber-800 text-sm flex items-center space-x-2">
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
                <span>
                  Preview mode — set this protocol as default to keep the
                  protocol.
                </span>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div
                className={`rounded-2xl ${
                  getGoalTheme(
                    planData?.primary_goal || "improve overall health"
                  ).secondary
                } p-6 border ${
                  getGoalTheme(
                    planData?.primary_goal || "improve overall health"
                  ).border
                }`}
              >
                <div className="flex items-center space-x-2 mb-4">
                  <div
                    className={`w-8 h-8 ${
                      getGoalTheme(
                        planData?.primary_goal || "improve overall health"
                      ).primary
                    } rounded-lg flex items-center justify-center`}
                  >
                    <svg
                      className="w-4 h-4 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    Summary
                  </h3>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between items-center py-2 border-b border-gray-200">
                    <span className="text-sm font-medium text-gray-600">
                      Name:
                    </span>
                    <span className="text-sm font-semibold text-gray-900">
                      {getSystematicPlanName(
                        planData?.primary_goal ||
                          (location.state as any)?.userGoal ||
                          (location.state as any)?.planData?.primary_goal,
                        (planData as any)?.difficulty ||
                          (location.state as any)?.difficulty ||
                          "moderate"
                      ) ||
                        planData?.plan_name ||
                        planData?.primary_goal ||
                        (location.state as any)?.userGoal ||
                        "Health Protocol"}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-gray-200">
                    <span className="text-sm font-medium text-gray-600">
                      Primary Goal:
                    </span>
                    <span className="text-sm font-semibold text-gray-900">
                      {planData?.primary_goal ||
                        (location.state as any)?.userGoal ||
                        (location.state as any)?.planData?.primary_goal ||
                        "Improve overall health"}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-gray-200">
                    <span className="text-sm font-medium text-gray-600">
                      Duration:
                    </span>
                    <span className="text-sm font-semibold text-gray-900">
                      {planData?.duration_weeks ||
                        (location.state as any)?.planData?.duration_weeks ||
                        12}{" "}
                      weeks
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-gray-200">
                    <span className="text-sm font-medium text-gray-600">
                      Difficulty:
                    </span>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        getGoalTheme(
                          planData?.primary_goal || "improve overall health"
                        ).primary
                      } text-white`}
                    >
                      {(planData as any)?.difficulty || "Moderate"}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-2">
                    <span className="text-sm font-medium text-gray-600">
                      Starts:
                    </span>
                    <span className="text-sm font-semibold text-gray-900">
                      {(location.state as any)?.planData?.plan_start_date ||
                        "Today"}
                    </span>
                  </div>
                </div>
              </div>

              <div
                className={`rounded-2xl ${
                  getGoalTheme(
                    planData?.primary_goal || "improve overall health"
                  ).secondary
                } p-6 border ${
                  getGoalTheme(
                    planData?.primary_goal || "improve overall health"
                  ).border
                }`}
              >
                <div className="flex items-center space-x-2 mb-4">
                  <div
                    className={`w-8 h-8 ${
                      getGoalTheme(
                        planData?.primary_goal || "improve overall health"
                      ).primary
                    } rounded-lg flex items-center justify-center`}
                  >
                    <svg
                      className="w-4 h-4 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 10V3L4 14h7v7l9-11h-7z"
                      />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    Expected Impacts
                  </h3>
                </div>
                <div className="space-y-3">
                  {(
                    planData?.plan_data?.overview?.expected_outcomes ||
                    (planData as any)?.expected_outcomes ||
                    enhancedDetails?.expectedImpacts ||
                    getExpectedImpacts(
                      planData?.primary_goal || "improve overall health"
                    )
                  ).map((impact: string, i: number) => (
                    <div key={i} className="flex items-start space-x-3">
                      <div
                        className={`w-2 h-2 ${
                          getGoalTheme(
                            planData?.primary_goal || "improve overall health"
                          ).primary
                        } rounded-full mt-2 flex-shrink-0`}
                      ></div>
                      <span className="text-sm text-gray-700">{impact}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div
                className={`rounded-2xl ${
                  getGoalTheme(
                    planData?.primary_goal || "improve overall health"
                  ).secondary
                } p-6 border ${
                  getGoalTheme(
                    planData?.primary_goal || "improve overall health"
                  ).border
                }`}
              >
                <div className="flex items-center space-x-2 mb-4">
                  <div
                    className={`w-8 h-8 ${
                      getGoalTheme(
                        planData?.primary_goal || "improve overall health"
                      ).primary
                    } rounded-lg flex items-center justify-center`}
                  >
                    <svg
                      className="w-4 h-4 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">Goals</h3>
                </div>
                <div className="space-y-3">
                  {(
                    planData?.plan_data?.overview?.key_principles ||
                    (location.state as any)?.planData?.overall_goals ||
                    planData?.secondary_goals || [
                      "Build healthy habits",
                      "Balance nutrition & activity",
                    ]
                  ).map((g: string, i: number) => (
                    <div key={i} className="flex items-start space-x-3">
                      <div
                        className={`w-2 h-2 ${
                          getGoalTheme(
                            planData?.primary_goal || "improve overall health"
                          ).primary
                        } rounded-full mt-2 flex-shrink-0`}
                      ></div>
                      <span className="text-sm text-gray-700">{g}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div
                className={`rounded-2xl ${
                  getGoalTheme(
                    planData?.primary_goal || "improve overall health"
                  ).secondary
                } p-6 border ${
                  getGoalTheme(
                    planData?.primary_goal || "improve overall health"
                  ).border
                }`}
              >
                <div className="flex items-center space-x-2 mb-4">
                  <div
                    className={`w-8 h-8 ${
                      getGoalTheme(
                        planData?.primary_goal || "improve overall health"
                      ).primary
                    } rounded-lg flex items-center justify-center`}
                  >
                    <svg
                      className="w-4 h-4 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                      />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    Tips & Safety
                  </h3>
                </div>
                <div className="space-y-3">
                  {(
                    planData?.plan_data?.overview?.safety_considerations ||
                    (location.state as any)?.planData?.progress_tips ||
                    []
                  )
                    .concat(
                      (location.state as any)?.planData?.safety_notes || []
                    )
                    .slice(0, 6)
                    .map((t: string, i: number) => (
                      <div key={i} className="flex items-start space-x-3">
                        <div
                          className={`w-2 h-2 ${
                            getGoalTheme(
                              planData?.primary_goal || "improve overall health"
                            ).primary
                          } rounded-full mt-2 flex-shrink-0`}
                        ></div>
                        <span className="text-sm text-gray-700">{t}</span>
                      </div>
                    ))}
                  {!planData?.plan_data?.overview?.safety_considerations
                    ?.length &&
                    !(location.state as any)?.planData?.progress_tips?.length &&
                    !(location.state as any)?.planData?.safety_notes
                      ?.length && (
                      <>
                        <div className="flex items-start space-x-3">
                          <div
                            className={`w-2 h-2 ${
                              getGoalTheme(
                                planData?.primary_goal ||
                                  "improve overall health"
                              ).primary
                            } rounded-full mt-2 flex-shrink-0`}
                          ></div>
                          <span className="text-sm text-gray-700">
                            Hydrate well and warm up before workouts
                          </span>
                        </div>
                        <div className="flex items-start space-x-3">
                          <div
                            className={`w-2 h-2 ${
                              getGoalTheme(
                                planData?.primary_goal ||
                                  "improve overall health"
                              ).primary
                            } rounded-full mt-2 flex-shrink-0`}
                          ></div>
                          <span className="text-sm text-gray-700">
                            Scale intensity based on your current fitness
                          </span>
                        </div>
                        <div className="flex items-start space-x-3">
                          <div
                            className={`w-2 h-2 ${
                              getGoalTheme(
                                planData?.primary_goal ||
                                  "improve overall health"
                              ).primary
                            } rounded-full mt-2 flex-shrink-0`}
                          ></div>
                          <span className="text-sm text-gray-700">
                            Prioritize sleep and recovery
                          </span>
                        </div>
                      </>
                    )}
                </div>
              </div>
            </div>

            <div
              className={`rounded-2xl ${
                getGoalTheme(planData?.primary_goal || "improve overall health")
                  .secondary
              } p-6 border ${
                getGoalTheme(planData?.primary_goal || "improve overall health")
                  .border
              } mt-6`}
            >
              <div className="flex items-center space-x-2 mb-4">
                <div
                  className={`w-8 h-8 ${
                    getGoalTheme(
                      planData?.primary_goal || "improve overall health"
                    ).primary
                  } rounded-lg flex items-center justify-center`}
                >
                  <svg
                    className="w-4 h-4 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900">
                  What's Inside
                </h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div
                    className={`w-12 h-12 ${
                      getGoalTheme(
                        planData?.primary_goal || "improve overall health"
                      ).primary
                    } rounded-xl flex items-center justify-center mx-auto mb-3`}
                  >
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
                        d="M13 10V3L4 14h7v7l9-11h-7z"
                      />
                    </svg>
                  </div>
                  <h4 className="font-semibold text-gray-900 mb-2">Workouts</h4>
                  <p className="text-sm text-gray-600">
                    {planData?.plan_data?.daily_templates?.weekday?.workouts
                      ?.length ||
                      planData?.plan_data?.daily_templates?.weekend?.workouts
                        ?.length ||
                      4}{" "}
                    sessions/week,{" "}
                    {planData?.plan_data?.overview?.training_approach ||
                      "progressive overload"}
                  </p>
                </div>
                <div className="text-center">
                  <div
                    className={`w-12 h-12 ${
                      getGoalTheme(
                        planData?.primary_goal || "improve overall health"
                      ).primary
                    } rounded-xl flex items-center justify-center mx-auto mb-3`}
                  >
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
                        d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m6-5v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6m8 0V9a2 2 0 00-2-2H9a2 2 0 00-2 2v4.01"
                      />
                    </svg>
                  </div>
                  <h4 className="font-semibold text-gray-900 mb-2">
                    Nutrition
                  </h4>
                  <p className="text-sm text-gray-600">
                    {planData?.plan_data?.overview?.nutrition_approach ||
                      "Balanced macros, regular meals, meal-prep guidance"}
                  </p>
                </div>
                <div className="text-center">
                  <div
                    className={`w-12 h-12 ${
                      getGoalTheme(
                        planData?.primary_goal || "improve overall health"
                      ).primary
                    } rounded-xl flex items-center justify-center mx-auto mb-3`}
                  >
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
                        d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                      />
                    </svg>
                  </div>
                  <h4 className="font-semibold text-gray-900 mb-2">Wellness</h4>
                  <p className="text-sm text-gray-600">
                    {planData?.plan_data?.overview?.wellness_approach ||
                      "Mindfulness, hydration, and sleep hygiene practices"}
                  </p>
                </div>
              </div>
            </div>

            {/* Week-by-Week Plan Structure */}
            <div
              className={`rounded-2xl ${
                getGoalTheme(planData?.primary_goal || "improve overall health")
                  .secondary
              } p-6 border ${
                getGoalTheme(planData?.primary_goal || "improve overall health")
                  .border
              } mt-6`}
            >
              <div className="flex items-center space-x-2 mb-6">
                <div
                  className={`w-8 h-8 ${
                    getGoalTheme(
                      planData?.primary_goal || "improve overall health"
                    ).primary
                  } rounded-lg flex items-center justify-center`}
                >
                  <svg
                    className="w-4 h-4 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900">
                  Plan Progression
                </h3>
              </div>
              <div className="space-y-6">
                {enhancedDetails?.weeklyProgression?.slice(0, 4).map((week) => (
                  <div
                    key={week.week}
                    className={`border-l-4 ${
                      getGoalTheme(
                        planData?.primary_goal || "improve overall health"
                      ).primary
                    } pl-6 bg-white rounded-r-2xl p-4 shadow-sm`}
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div
                          className={`w-8 h-8 ${
                            getGoalTheme(
                              planData?.primary_goal || "improve overall health"
                            ).primary
                          } rounded-lg flex items-center justify-center text-white font-bold text-sm`}
                        >
                          {week.week}
                        </div>
                        <h4 className="font-semibold text-gray-900">
                          Week {week.week}
                        </h4>
                      </div>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          week.intensity === "low"
                            ? "bg-green-100 text-green-800"
                            : week.intensity === "moderate"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {week.intensity} intensity
                      </span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="font-medium text-gray-900 mb-1">Focus:</p>
                        <p className="text-gray-600">{week.focus}</p>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900 mb-1">
                          Key Activities:
                        </p>
                        <p className="text-gray-600">
                          {week.keyActivities.join(", ")}
                        </p>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900 mb-1">
                          Milestones:
                        </p>
                        <p className="text-gray-600">
                          {week.milestones.join(", ")}
                        </p>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900 mb-1">
                          Expected Outcomes:
                        </p>
                        <p className="text-gray-600">
                          {week.expectedOutcomes.join(", ")}
                        </p>
                      </div>
                    </div>
                  </div>
                )) ||
                  // Fallback to plan data or default structure
                  (planData?.plan_data?.weekly_structure
                    ? Object.entries(planData.plan_data.weekly_structure)
                        .slice(0, 4)
                        .map(([week, data]: [string, any]) => (
                          <div
                            key={week}
                            className="border-l-4 border-blue-500 pl-4"
                          >
                            <div className="flex items-center justify-between mb-2">
                              <h4 className="font-semibold text-gray-800">
                                Week {week.replace("week", "")}
                              </h4>
                              <span
                                className={`px-2 py-1 rounded-full text-xs font-medium ${
                                  data.intensity_level === "low"
                                    ? "bg-green-100 text-green-800"
                                    : data.intensity_level === "moderate"
                                    ? "bg-yellow-100 text-yellow-800"
                                    : "bg-red-100 text-red-800"
                                }`}
                              >
                                {data.intensity_level} intensity
                              </span>
                            </div>
                            <div className="text-sm text-gray-600 space-y-1">
                              <p>
                                <strong>Focus:</strong>{" "}
                                {data.focus_areas?.join(", ") ||
                                  "General health improvement"}
                              </p>
                              <p>
                                <strong>Key Activities:</strong>{" "}
                                {data.key_activities?.join(", ") ||
                                  "Workouts, nutrition, wellness"}
                              </p>
                              {data.milestones &&
                                data.milestones.length > 0 && (
                                  <p>
                                    <strong>Milestones:</strong>{" "}
                                    {data.milestones.join(", ")}
                                  </p>
                                )}
                            </div>
                          </div>
                        ))
                    : // Default week structure based on plan duration
                      Array.from(
                        { length: Math.min(planData?.duration_weeks || 4, 4) },
                        (_, i) => (
                          <div
                            key={i + 1}
                            className="border-l-4 border-blue-500 pl-4"
                          >
                            <div className="flex items-center justify-between mb-2">
                              <h4 className="font-semibold text-gray-800">
                                Week {i + 1}
                              </h4>
                              <span
                                className={`px-2 py-1 rounded-full text-xs font-medium ${
                                  i === 0
                                    ? "bg-green-100 text-green-800"
                                    : i === 1
                                    ? "bg-yellow-100 text-yellow-800"
                                    : "bg-red-100 text-red-800"
                                }`}
                              >
                                {i === 0
                                  ? "low"
                                  : i === 1
                                  ? "moderate"
                                  : "high"}{" "}
                                intensity
                              </span>
                            </div>
                            <div className="text-sm text-gray-600 space-y-1">
                              <p>
                                <strong>Focus:</strong>{" "}
                                {i === 0
                                  ? "Foundation building, habit formation"
                                  : i === 1
                                  ? "Progressive adaptation, skill development"
                                  : i === 2
                                  ? "Intensity increase, advanced techniques"
                                  : "Peak performance, optimization"}
                              </p>
                              <p>
                                <strong>Key Activities:</strong>{" "}
                                {i === 0
                                  ? "Basic workouts, meal planning, sleep optimization"
                                  : i === 1
                                  ? "Progressive overload, nutrition timing, recovery"
                                  : i === 2
                                  ? "Advanced training, macro cycling, stress management"
                                  : "Peak training, performance nutrition, mental preparation"}
                              </p>
                              <p>
                                <strong>Milestones:</strong>{" "}
                                {i === 0
                                  ? "Establish routine, track progress"
                                  : i === 1
                                  ? "Increase intensity, measure improvements"
                                  : i === 2
                                  ? "Push limits, optimize performance"
                                  : "Achieve goals, maintain consistency"}
                              </p>
                            </div>
                          </div>
                        )
                      ))}
              </div>
            </div>

            {/* Goal-Specific Tips and Safety */}
            {enhancedDetails && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                <div
                  className={`rounded-2xl ${
                    getGoalTheme(
                      planData?.primary_goal || "improve overall health"
                    ).secondary
                  } p-6 border ${
                    getGoalTheme(
                      planData?.primary_goal || "improve overall health"
                    ).border
                  }`}
                >
                  <div className="flex items-center space-x-2 mb-4">
                    <div
                      className={`w-8 h-8 ${
                        getGoalTheme(
                          planData?.primary_goal || "improve overall health"
                        ).primary
                      } rounded-lg flex items-center justify-center`}
                    >
                      <svg
                        className="w-4 h-4 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                        />
                      </svg>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      Goal-Specific Tips
                    </h3>
                  </div>
                  <div className="space-y-3">
                    {enhancedDetails.goalSpecificTips.map((tip, i) => (
                      <div key={i} className="flex items-start space-x-3">
                        <div
                          className={`w-2 h-2 ${
                            getGoalTheme(
                              planData?.primary_goal || "improve overall health"
                            ).primary
                          } rounded-full mt-2 flex-shrink-0`}
                        ></div>
                        <span className="text-sm text-gray-700">{tip}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div
                  className={`rounded-2xl ${
                    getGoalTheme(
                      planData?.primary_goal || "improve overall health"
                    ).secondary
                  } p-6 border ${
                    getGoalTheme(
                      planData?.primary_goal || "improve overall health"
                    ).border
                  }`}
                >
                  <div className="flex items-center space-x-2 mb-4">
                    <div
                      className={`w-8 h-8 ${
                        getGoalTheme(
                          planData?.primary_goal || "improve overall health"
                        ).primary
                      } rounded-lg flex items-center justify-center`}
                    >
                      <svg
                        className="w-4 h-4 text-white"
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
                    <h3 className="text-lg font-semibold text-gray-900">
                      Safety Considerations
                    </h3>
                  </div>
                  <div className="space-y-3">
                    {enhancedDetails.safetyConsiderations.map(
                      (consideration, i) => (
                        <div key={i} className="flex items-start space-x-3">
                          <div
                            className={`w-2 h-2 ${
                              getGoalTheme(
                                planData?.primary_goal ||
                                  "improve overall health"
                              ).primary
                            } rounded-full mt-2 flex-shrink-0`}
                          ></div>
                          <span className="text-sm text-gray-700">
                            {consideration}
                          </span>
                        </div>
                      )
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Success Metrics */}
            {enhancedDetails && (
              <div
                className={`rounded-2xl ${
                  getGoalTheme(
                    planData?.primary_goal || "improve overall health"
                  ).secondary
                } p-6 border ${
                  getGoalTheme(
                    planData?.primary_goal || "improve overall health"
                  ).border
                } mt-6`}
              >
                <div className="flex items-center space-x-2 mb-4">
                  <div
                    className={`w-8 h-8 ${
                      getGoalTheme(
                        planData?.primary_goal || "improve overall health"
                      ).primary
                    } rounded-lg flex items-center justify-center`}
                  >
                    <svg
                      className="w-4 h-4 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                      />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    Success Metrics
                  </h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {enhancedDetails.successMetrics.map((metric, i) => (
                    <div key={i} className="flex items-center space-x-3">
                      <div
                        className={`w-3 h-3 ${
                          getGoalTheme(
                            planData?.primary_goal || "improve overall health"
                          ).primary
                        } rounded-full`}
                      ></div>
                      <span className="text-sm text-gray-700">{metric}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
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

export default PlanDetails;
