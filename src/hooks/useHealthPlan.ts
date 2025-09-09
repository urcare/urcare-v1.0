import {
  HealthPlanRecord,
  healthPlanService,
} from "@/services/healthPlanService";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

export const useHealthPlan = () => {
  const [currentPlan, setCurrentPlan] = useState<HealthPlanRecord | null>(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [dayProgress, setDayProgress] = useState<{
    [activityId: string]: boolean;
  }>({});

  const loadCurrentPlan = useCallback(async () => {
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
    } catch (error) {
      console.error("Error loading current plan:", error);
      toast.error("Failed to load health plan");
    } finally {
      setLoading(false);
    }
  }, []);

  const generateNewPlan = useCallback(async () => {
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
  }, []);

  const loadDayProgress = useCallback(
    async (dayNumber: number) => {
      if (!currentPlan) return;

      try {
        const progress = await healthPlanService.getDayProgress(
          currentPlan.id,
          dayNumber
        );
        setDayProgress(progress);
      } catch (error) {
        console.error("Error loading day progress:", error);
      }
    },
    [currentPlan]
  );

  const toggleActivityCompletion = useCallback(
    async (activityId: string, dayNumber: number) => {
      if (!currentPlan) return;

      try {
        const isCompleted = dayProgress[activityId];

        if (isCompleted) {
          // Mark as incomplete
          await healthPlanService.markActivityCompleted(
            currentPlan.id,
            activityId,
            dayNumber,
            "Marked as incomplete"
          );
        } else {
          // Mark as completed
          await healthPlanService.markActivityCompleted(
            currentPlan.id,
            activityId,
            dayNumber
          );
        }

        // Update local state
        setDayProgress((prev) => ({
          ...prev,
          [activityId]: !isCompleted,
        }));

        // Check if all activities for the day are completed
        if (!isCompleted) {
          await checkDayCompletion(dayNumber);
        }

        toast.success(
          isCompleted ? "Activity marked as incomplete" : "Activity completed!"
        );
      } catch (error) {
        console.error("Error toggling activity:", error);
        toast.error("Failed to update activity");
      }
    },
    [currentPlan, dayProgress]
  );

  const checkDayCompletion = useCallback(
    async (dayNumber: number) => {
      if (!currentPlan) return;

      const dayPlan =
        dayNumber === 1 ? currentPlan.day_1_plan : currentPlan.day_2_plan;
      const totalActivities = dayPlan.activities.length;
      const completedActivities =
        Object.values(dayProgress).filter(Boolean).length;

      // If all activities are completed, mark the day as completed
      if (completedActivities === totalActivities && totalActivities > 0) {
        try {
          await healthPlanService.markDayCompleted(
            currentPlan.id,
            dayNumber as 1 | 2
          );
          toast.success(`Day ${dayNumber} completed! 🎉`);

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
    },
    [currentPlan, dayProgress]
  );

  const getCompletionPercentage = useCallback(
    (dayNumber: number) => {
      if (!currentPlan) return 0;
      const dayPlan =
        dayNumber === 1 ? currentPlan.day_1_plan : currentPlan.day_2_plan;
      const totalActivities = dayPlan.activities.length;
      const completedActivities =
        Object.values(dayProgress).filter(Boolean).length;
      return totalActivities > 0
        ? Math.round((completedActivities / totalActivities) * 100)
        : 0;
    },
    [currentPlan, dayProgress]
  );

  useEffect(() => {
    loadCurrentPlan();
  }, [loadCurrentPlan]);

  return {
    currentPlan,
    loading,
    generating,
    dayProgress,
    loadCurrentPlan,
    generateNewPlan,
    loadDayProgress,
    toggleActivityCompletion,
    getCompletionPercentage,
  };
};
