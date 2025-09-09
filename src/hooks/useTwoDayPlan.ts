import { useAuth } from "@/contexts/AuthContext";
import {
  TwoDayHealthPlan,
  twoDayPlanService,
} from "@/services/twoDayPlanService";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export const useTwoDayPlan = () => {
  const { user } = useAuth();
  const [currentPlan, setCurrentPlan] = useState<TwoDayHealthPlan | null>(null);
  const [planHistory, setPlanHistory] = useState<TwoDayHealthPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCurrentPlan = async () => {
    if (!user) return;

    try {
      setLoading(true);
      const plan = await twoDayPlanService.getCurrentPlan(user.id);
      setCurrentPlan(plan);
      setError(null);
    } catch (err: any) {
      console.error("Error fetching current plan:", err);
      setError(err.message || "Failed to fetch current plan");
    } finally {
      setLoading(false);
    }
  };

  const fetchPlanHistory = async () => {
    if (!user) return;

    try {
      const history = await twoDayPlanService.getPlanHistory(user.id, 10);
      setPlanHistory(history);
    } catch (err: any) {
      console.error("Error fetching plan history:", err);
      // Don't set error for history fetch failure as it's not critical
    }
  };

  const generateNewPlan = async (preferences?: any) => {
    if (!user) {
      toast.error("Please log in to generate a plan");
      return;
    }

    try {
      setLoading(true);
      const newPlan = await twoDayPlanService.generateTwoDayPlan({
        userProfile: user,
        preferences,
      });
      setCurrentPlan(newPlan);
      await fetchPlanHistory(); // Refresh history
      toast.success("New 2-day plan generated successfully!");
    } catch (err: any) {
      console.error("Error generating new plan:", err);
      setError(err.message || "Failed to generate new plan");
      toast.error("Failed to generate new plan", {
        description: err.message || "Please try again later",
      });
    } finally {
      setLoading(false);
    }
  };

  const updateActivityProgress = async (
    activityId: string,
    dayNumber: 1 | 2,
    completed: boolean,
    notes?: string
  ) => {
    if (!currentPlan) return;

    try {
      await twoDayPlanService.updateActivityProgress(
        currentPlan.id,
        activityId,
        dayNumber,
        completed,
        notes
      );

      // Refresh current plan to get updated progress
      await fetchCurrentPlan();

      // Check if plan is now completed and we need to generate a new one
      const updatedPlan = await twoDayPlanService.getCurrentPlan(user!.id);
      if (updatedPlan?.day1Completed && updatedPlan?.day2Completed) {
        // Plan is completed, the service should automatically generate a new one
        setTimeout(() => {
          fetchCurrentPlan();
          fetchPlanHistory();
        }, 2000); // Give some time for the automatic generation
      }
    } catch (err: any) {
      console.error("Error updating activity progress:", err);
      toast.error("Failed to update activity progress");
      throw err; // Re-throw so the component can handle it
    }
  };

  const refreshPlan = async () => {
    await Promise.all([fetchCurrentPlan(), fetchPlanHistory()]);
  };

  // Initial data fetch
  useEffect(() => {
    if (user) {
      fetchCurrentPlan();
      fetchPlanHistory();
    } else {
      setCurrentPlan(null);
      setPlanHistory([]);
      setLoading(false);
    }
  }, [user]);

  // Auto-refresh when plan might be completed
  useEffect(() => {
    if (currentPlan?.day1Completed && currentPlan?.day2Completed) {
      // Set up periodic checking for new plan generation
      const checkInterval = setInterval(async () => {
        const latestPlan = await twoDayPlanService.getCurrentPlan(user!.id);
        if (latestPlan && latestPlan.id !== currentPlan.id) {
          setCurrentPlan(latestPlan);
          await fetchPlanHistory();
          clearInterval(checkInterval);
        }
      }, 5000); // Check every 5 seconds

      // Clean up after 30 seconds
      setTimeout(() => {
        clearInterval(checkInterval);
      }, 30000);

      return () => clearInterval(checkInterval);
    }
  }, [currentPlan, user]);

  return {
    currentPlan,
    planHistory,
    loading,
    error,
    generateNewPlan,
    updateActivityProgress,
    refreshPlan,
    hasActivePlan: !!currentPlan?.isActive,
  };
};
