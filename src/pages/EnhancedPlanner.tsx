import AIHealthCoachPlan from "@/components/AIHealthCoachPlan";
import { MobileNavigation } from "@/components/MobileNavigation";
import { ThemeWrapper } from "@/components/ThemeWrapper";
import { useAuth } from "@/contexts/AuthContext";
import {
  HealthPlanRecord,
  healthPlanService,
} from "@/services/healthPlanService";
import { Calendar, Plus, RefreshCw } from "lucide-react";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";

// Type for the new AI Health Coach plan format
interface AIHealthCoachPlanData {
  day1: any;
  day2: any;
  overall_goals: string[];
  progress_tips: string[];
  safety_notes?: string[];
  cultural_adaptations?: string[];
}

const EnhancedPlanner: React.FC = () => {
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

  const loadCurrentPlan = async () => {
    try {
      setLoading(true);
      const plan = await healthPlanService.getCurrentPlan();
      setCurrentPlan(plan);
    } catch (error) {
      console.error("Error loading current plan:", error);
      toast.error("Failed to load health plan");
    } finally {
      setLoading(false);
    }
  };

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

  const generateNewPlan = async () => {
    try {
      setGenerating(true);
      const newPlan = await healthPlanService.generateHealthPlan();
      setCurrentPlan(newPlan);
      toast.success("New AI Health Coach plan generated successfully!");
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

      toast.success(
        isCompleted ? "Activity marked as incomplete" : "Activity completed!"
      );
    } catch (error) {
      console.error("Error toggling activity:", error);
      toast.error("Failed to update activity");
    }
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

  // Check if the plan is in the new AI Health Coach format
  const isAIHealthCoachFormat = (plan: HealthPlanRecord) => {
    const day1Plan = plan.day_1_plan;
    return (
      day1Plan &&
      typeof day1Plan === "object" &&
      "focus" in day1Plan &&
      "movement" in day1Plan &&
      "nutrition" in day1Plan &&
      "health_score" in day1Plan
    );
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
                  Loading your AI Health Coach plan...
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
                AI Health Coach
              </h1>
              <p className="text-muted-foreground">
                Your personalized, evidence-based health and wellness plan
              </p>
            </div>

            <div className="bg-card rounded-lg border p-6">
              <div className="text-center py-12">
                <Calendar className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-xl font-semibold mb-2">No Active Plan</h3>
                <p className="text-muted-foreground mb-6">
                  Generate your personalized AI Health Coach plan to get started
                  with science-based, safe, and culturally appropriate health
                  guidance.
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
                  {generating
                    ? "Generating..."
                    : "Generate AI Health Coach Plan"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </ThemeWrapper>
    );
  }

  // If the plan is in the new AI Health Coach format, render it with the new component
  if (isAIHealthCoachFormat(currentPlan)) {
    const aiPlan: AIHealthCoachPlanData = {
      day1: currentPlan.day_1_plan,
      day2: currentPlan.day_2_plan,
      overall_goals: currentPlan.day_1_plan.overall_goals || [],
      progress_tips: currentPlan.day_1_plan.progress_tips || [],
      safety_notes: currentPlan.day_1_plan.safety_notes || [],
      cultural_adaptations: currentPlan.day_1_plan.cultural_adaptations || [],
    };

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
                    AI Health Coach
                  </h1>
                  <p className="text-muted-foreground">
                    Your personalized, evidence-based health plan
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

            {/* AI Health Coach Plan */}
            <AIHealthCoachPlan plan={aiPlan} />
          </div>
        </div>
      </ThemeWrapper>
    );
  }

  // Fallback to the original planner format for backward compatibility
  return (
    <ThemeWrapper>
      <div className="min-h-screen bg-background">
        <MobileNavigation />
        <div className="container mx-auto px-4 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Health Planner (Legacy Format)
            </h1>
            <p className="text-muted-foreground">
              This plan is in the legacy format. Generate a new plan to get the
              enhanced AI Health Coach experience.
            </p>
            <button
              onClick={generateNewPlan}
              disabled={generating}
              className="mt-4 bg-primary text-primary-foreground px-6 py-3 rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 flex items-center gap-2"
            >
              {generating ? (
                <RefreshCw className="h-4 w-4 animate-spin" />
              ) : (
                <Plus className="h-4 w-4" />
              )}
              {generating
                ? "Generating..."
                : "Generate New AI Health Coach Plan"}
            </button>
          </div>
        </div>
      </div>
    </ThemeWrapper>
  );
};

export default EnhancedPlanner;
