import { MobileNavigation } from "@/components/MobileNavigation";
import { ThemeWrapper } from "@/components/ThemeWrapper";
import { useAuth } from "@/contexts/AuthContext";
import {
  HealthPlanRecord,
  healthPlanService,
} from "@/services/healthPlanService";
import { debugHealthPlan } from "@/utils/healthPlanDebug";
import {
  Activity,
  Brain,
  Calendar,
  CheckCircle,
  Circle,
  Clock,
  Coffee,
  Droplets,
  Moon,
  Plus,
  RefreshCw,
  Target,
  TrendingUp,
  Utensils,
} from "lucide-react";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";

const Planner: React.FC = () => {
  const { user, profile } = useAuth();
  const [currentPlan, setCurrentPlan] = useState<HealthPlanRecord | null>(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [selectedDay, setSelectedDay] = useState<1 | 2>(1);
  const [dayProgress, setDayProgress] = useState<{
    [activityId: string]: boolean;
  }>({});

  useEffect(() => {
    loadCurrentPlan();
  }, []);

  useEffect(() => {
    if (currentPlan) {
      loadDayProgress();
    }
  }, [currentPlan, selectedDay]);

  const loadDayProgress = async () => {
    if (!currentPlan) return;

    try {
      const progress = await healthPlanService.getDayProgress(
        currentPlan.id,
        selectedDay
      );
      setDayProgress(progress);
    } catch (error) {
      console.error("Error loading day progress:", error);
    }
  };

  const loadCurrentPlan = async () => {
    try {
      setLoading(true);

      // First check if we need to generate a new plan
      const newPlan = await healthPlanService.checkAndGenerateNextPlan();
      if (newPlan) {
        setCurrentPlan(newPlan);
        toast.success("New health plan generated automatically!");
        return;
      }

      // Otherwise load the current plan
      const plan = await healthPlanService.getCurrentPlan();
      setCurrentPlan(plan);

      if (plan) {
        const progress = await healthPlanService.getDayProgress(
          plan.id,
          selectedDay
        );
        setDayProgress(progress);
      }
    } catch (error) {
      console.error("Error loading current plan:", error);
      toast.error("Failed to load health plan");
    } finally {
      setLoading(false);
    }
  };

  const generateNewPlan = async () => {
    try {
      setGenerating(true);
      const newPlan = await healthPlanService.generateHealthPlan();
      setCurrentPlan(newPlan);
      toast.success("New health plan generated successfully!");
    } catch (error) {
      console.error("Error generating plan:", error);
      toast.error("Failed to generate health plan");
    } finally {
      setGenerating(false);
    }
  };

  const toggleActivityCompletion = async (activityId: string) => {
    if (!currentPlan) return;

    try {
      const isCompleted = dayProgress[activityId];

      if (isCompleted) {
        // Mark as incomplete
        await healthPlanService.markActivityCompleted(
          currentPlan.id,
          activityId,
          selectedDay,
          "Marked as incomplete"
        );
      } else {
        // Mark as completed
        await healthPlanService.markActivityCompleted(
          currentPlan.id,
          activityId,
          selectedDay
        );
      }

      // Update local state
      setDayProgress((prev) => ({
        ...prev,
        [activityId]: !isCompleted,
      }));

      // Check if all activities for the day are completed
      if (!isCompleted) {
        await checkDayCompletion();
      }

      toast.success(
        isCompleted ? "Activity marked as incomplete" : "Activity completed!"
      );
    } catch (error) {
      console.error("Error toggling activity:", error);
      toast.error("Failed to update activity");
    }
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "workout":
        return <Activity className="h-4 w-4" />;
      case "meal":
        return <Utensils className="h-4 w-4" />;
      case "hydration":
        return <Droplets className="h-4 w-4" />;
      case "sleep":
        return <Moon className="h-4 w-4" />;
      case "meditation":
        return <Brain className="h-4 w-4" />;
      case "break":
        return <Coffee className="h-4 w-4" />;
      default:
        return <Target className="h-4 w-4" />;
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
    return new Date(`2000-01-01T${time}`).toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  const checkDayCompletion = async () => {
    if (!currentPlan) return;

    const dayPlan =
      selectedDay === 1 ? currentPlan.day_1_plan : currentPlan.day_2_plan;
    const totalActivities = dayPlan.activities.length;
    const completedActivities =
      Object.values(dayProgress).filter(Boolean).length;

    // If all activities are completed, mark the day as completed
    if (completedActivities === totalActivities && totalActivities > 0) {
      try {
        await healthPlanService.markDayCompleted(currentPlan.id, selectedDay);
        toast.success(`Day ${selectedDay} completed! 🎉`);

        // If both days are completed, generate next plan
        if (currentPlan.day_1_completed && currentPlan.day_2_completed) {
          setTimeout(async () => {
            try {
              const nextPlan = await healthPlanService.generateNextPlan();
              setCurrentPlan(nextPlan);
              toast.success("New 2-day plan generated!");
            } catch (error) {
              console.error("Error generating next plan:", error);
            }
          }, 2000);
        }
      } catch (error) {
        console.error("Error marking day as completed:", error);
      }
    }
  };

  const getCompletionPercentage = () => {
    if (!currentPlan) return 0;
    const dayPlan =
      selectedDay === 1 ? currentPlan.day_1_plan : currentPlan.day_2_plan;
    const totalActivities = dayPlan.activities.length;
    const completedActivities =
      Object.values(dayProgress).filter(Boolean).length;
    return totalActivities > 0
      ? Math.round((completedActivities / totalActivities) * 100)
      : 0;
  };

  if (loading) {
    return (
      <ThemeWrapper>
        <div className="min-h-screen bg-background">
          <MobileNavigation />
          <div className="container mx-auto px-4 py-8">
            <div className="flex items-center justify-center min-h-[400px]">
              <div className="text-center">
                <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
                <p className="text-muted-foreground">
                  Loading your health plan...
                </p>
              </div>
            </div>
          </div>
        </div>
      </ThemeWrapper>
    );
  }

  if (!currentPlan) {
    return (
      <ThemeWrapper>
        <div className="min-h-screen bg-background">
          <MobileNavigation />
          <div className="container mx-auto px-4 py-8">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-foreground mb-2">
                Health Planner
              </h1>
              <p className="text-muted-foreground">
                Your personalized health and wellness schedule
              </p>
            </div>

            <div className="bg-card rounded-lg border p-6">
              <div className="text-center py-12">
                <Calendar className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-xl font-semibold mb-2">No Active Plan</h3>
                <p className="text-muted-foreground mb-6">
                  Generate your personalized 2-day health plan to get started.
                </p>
                <button
                  onClick={generateNewPlan}
                  disabled={generating}
                  className="bg-primary text-primary-foreground px-6 py-3 rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 flex items-center gap-2 mx-auto"
                >
                  {generating ? (
                    <RefreshCw className="h-4 w-4 animate-spin" />
                  ) : (
                    <Plus className="h-4 w-4" />
                  )}
                  {generating ? "Generating..." : "Generate Health Plan"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </ThemeWrapper>
    );
  }

  const dayPlan =
    selectedDay === 1 ? currentPlan.day_1_plan : currentPlan.day_2_plan;
  const completionPercentage = getCompletionPercentage();

  return (
    <ThemeWrapper>
      <div className="min-h-screen bg-background">
        <MobileNavigation />

        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="text-3xl font-bold text-foreground mb-2">
                  Health Planner
                </h1>
                <p className="text-muted-foreground">
                  Your personalized 2-day health schedule
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={generateNewPlan}
                  disabled={generating}
                  className="bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 flex items-center gap-2"
                >
                  {generating ? (
                    <RefreshCw className="h-4 w-4 animate-spin" />
                  ) : (
                    <RefreshCw className="h-4 w-4" />
                  )}
                  {generating ? "Generating..." : "New Plan"}
                </button>
                <button
                  onClick={debugHealthPlan}
                  className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors flex items-center gap-2"
                >
                  🐛 Debug
                </button>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="bg-card rounded-lg border p-4 mb-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-foreground">
                  Day {selectedDay} Progress
                </span>
                <span className="text-sm text-muted-foreground">
                  {completionPercentage}%
                </span>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div
                  className="bg-primary h-2 rounded-full transition-all duration-300"
                  style={{ width: `${completionPercentage}%` }}
                />
              </div>
            </div>

            {/* Day Selector */}
            <div className="flex gap-2 mb-6">
              <button
                onClick={() => setSelectedDay(1)}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  selectedDay === 1
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground hover:bg-muted/80"
                }`}
              >
                Day 1 -{" "}
                {new Date(currentPlan.plan_start_date).toLocaleDateString()}
              </button>
              <button
                onClick={() => setSelectedDay(2)}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  selectedDay === 2
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground hover:bg-muted/80"
                }`}
              >
                Day 2 -{" "}
                {new Date(currentPlan.plan_end_date).toLocaleDateString()}
              </button>
            </div>
          </div>

          {/* Activities List */}
          <div className="space-y-4">
            {dayPlan.activities.map((activity) => (
              <div
                key={activity.id}
                className={`bg-card rounded-lg border p-4 transition-all duration-200 ${
                  dayProgress[activity.id] ? "opacity-75" : ""
                } ${getPriorityColor(activity.priority)}`}
              >
                <div className="flex items-start gap-4">
                  <button
                    onClick={() => toggleActivityCompletion(activity.id)}
                    className="mt-1 text-primary hover:text-primary/80 transition-colors"
                  >
                    {dayProgress[activity.id] ? (
                      <CheckCircle className="h-5 w-5" />
                    ) : (
                      <Circle className="h-5 w-5" />
                    )}
                  </button>

                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      {getActivityIcon(activity.type)}
                      <h3 className="font-semibold text-foreground">
                        {activity.title}
                      </h3>
                      <span className="text-xs bg-muted px-2 py-1 rounded-full">
                        {activity.priority}
                      </span>
                    </div>

                    <p className="text-sm text-muted-foreground mb-3">
                      {activity.description}
                    </p>

                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {formatTime(activity.startTime)} -{" "}
                        {formatTime(activity.endTime)}
                      </div>
                      <div className="flex items-center gap-1">
                        <Target className="h-3 w-3" />
                        {activity.duration} min
                      </div>
                      <div className="flex items-center gap-1">
                        <TrendingUp className="h-3 w-3" />
                        {activity.category}
                      </div>
                    </div>

                    {activity.instructions &&
                      activity.instructions.length > 0 && (
                        <div className="mt-3">
                          <h4 className="text-xs font-medium text-foreground mb-1">
                            Instructions:
                          </h4>
                          <ul className="text-xs text-muted-foreground space-y-1">
                            {activity.instructions.map((instruction, index) => (
                              <li
                                key={index}
                                className="flex items-start gap-1"
                              >
                                <span className="text-primary">•</span>
                                {instruction}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                    {activity.tips && activity.tips.length > 0 && (
                      <div className="mt-2">
                        <h4 className="text-xs font-medium text-foreground mb-1">
                          Tips:
                        </h4>
                        <ul className="text-xs text-muted-foreground space-y-1">
                          {activity.tips.map((tip, index) => (
                            <li key={index} className="flex items-start gap-1">
                              <span className="text-green-500">💡</span>
                              {tip}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Day Summary */}
          <div className="mt-8 bg-card rounded-lg border p-6">
            <h3 className="text-lg font-semibold mb-4">
              Day {selectedDay} Summary
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">
                  {dayPlan.summary.totalActivities}
                </div>
                <div className="text-sm text-muted-foreground">
                  Total Activities
                </div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">
                  {dayPlan.summary.workoutTime}min
                </div>
                <div className="text-sm text-muted-foreground">
                  Workout Time
                </div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">
                  {dayPlan.summary.mealCount}
                </div>
                <div className="text-sm text-muted-foreground">Meals</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">
                  {dayPlan.summary.sleepHours}h
                </div>
                <div className="text-sm text-muted-foreground">Sleep</div>
              </div>
            </div>
            <div className="mt-4">
              <h4 className="text-sm font-medium mb-2">Focus Areas:</h4>
              <div className="flex flex-wrap gap-2">
                {dayPlan.summary.focusAreas.map((area, index) => (
                  <span
                    key={index}
                    className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full"
                  >
                    {area}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </ThemeWrapper>
  );
};

export default Planner;
