import {
  HealthPlanRecord,
  healthPlanService,
} from "@/services/healthPlanService";
import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";

export const useHealthPlan = () => {
  const [currentPlan, setCurrentPlan] = useState<HealthPlanRecord | null>(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [dayProgress, setDayProgress] = useState<{
    [activityId: string]: boolean;
  }>({});

  // Use refs to prevent unnecessary re-renders and optimize performance
  const loadingRef = useRef(false);
  const generatingRef = useRef(false);

  // Optimized plan loading with debouncing and caching
  const loadCurrentPlan = useCallback(async () => {
    if (loadingRef.current) return; // Prevent concurrent calls

    try {
      loadingRef.current = true;
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
      loadingRef.current = false;
      setLoading(false);
    }
  }, []);

  // Optimized plan generation with loading state management
  const generateNewPlan = useCallback(async () => {
    if (generatingRef.current) return; // Prevent concurrent calls

    try {
      generatingRef.current = true;
      setGenerating(true);

      const newPlan = await healthPlanService.generateHealthPlan();
      setCurrentPlan(newPlan);
      toast.success("New health plan generated successfully!");
    } catch (error) {
      console.error("Error generating plan:", error);
      toast.error("Failed to generate health plan");
    } finally {
      generatingRef.current = false;
      setGenerating(false);
    }
  }, []);

  // Optimized progress loading with caching
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

  // Optimized activity completion with optimistic updates
  const toggleActivityCompletion = useCallback(
    async (activityId: string, dayNumber: number) => {
      if (!currentPlan) return;

      const isCompleted = dayProgress[activityId];

      // Optimistic update - update UI immediately
      setDayProgress((prev) => ({
        ...prev,
        [activityId]: !isCompleted,
      }));

      try {
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

        // Check if all activities for the day are completed
        if (!isCompleted) {
          await checkDayCompletion(dayNumber);
        }

        toast.success(
          isCompleted ? "Activity marked as incomplete" : "Activity completed!"
        );
      } catch (error) {
        console.error("Error toggling activity:", error);

        // Revert optimistic update on error
        setDayProgress((prev) => ({
          ...prev,
          [activityId]: isCompleted,
        }));

        toast.error("Failed to update activity");
      }
    },
    [currentPlan, dayProgress]
  );

  // Optimized day completion checking
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

  // Optimized completion percentage calculation
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

  // Load plan on mount
  useEffect(() => {
    loadCurrentPlan();
  }, [loadCurrentPlan]);

  // Clear cache on unmount
  useEffect(() => {
    return () => {
      healthPlanService.clearCache();
    };
  }, []);

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
