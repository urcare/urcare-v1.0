import { useAuth } from "@/contexts/AuthContext";
import {
  HealthScoreData,
  healthScoreService,
} from "@/services/healthScoreService";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

export const useHealthScore = () => {
  const { user } = useAuth();
  const [healthData, setHealthData] = useState<HealthScoreData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchHealthData = useCallback(async () => {
    if (!user) return;

    setLoading(true);
    setError(null);

    try {
      const data = await healthScoreService.getHealthScoreData(user.id);
      setHealthData(data);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to fetch health data";
      setError(errorMessage);
      console.error("Error fetching health data:", err);
    } finally {
      setLoading(false);
    }
  }, [user]);

  const markActivityCompleted = useCallback(
    async (
      activityType: "exercise" | "nutrition" | "hydration" | "meals" | "sleep",
      completed: boolean = true,
      additionalData?: {
        exercise_duration?: number;
        water_intake?: number;
        calories_consumed?: number;
        sleep_hours?: number;
      }
    ) => {
      if (!user) return;

      try {
        await healthScoreService.markActivityCompleted(
          user.id,
          activityType,
          completed,
          additionalData
        );

        // Refresh health data
        await fetchHealthData();

        const activityNames = {
          exercise: "Exercise",
          nutrition: "Nutrition",
          hydration: "Hydration",
          meals: "Meals",
          sleep: "Sleep",
        };

        toast.success(
          `${activityNames[activityType]} ${
            completed ? "completed" : "marked incomplete"
          }!`
        );
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to update activity";
        setError(errorMessage);
        toast.error(errorMessage);
        console.error("Error marking activity completed:", err);
      }
    },
    [user, fetchHealthData]
  );

  const refreshHealthScore = useCallback(async () => {
    if (!user) return;

    try {
      await healthScoreService.updateHealthScore(user.id);
      await fetchHealthData();
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to refresh health score";
      setError(errorMessage);
      console.error("Error refreshing health score:", err);
    }
  }, [user, fetchHealthData]);

  // Initialize health score for new users
  const initializeHealthScore = useCallback(async () => {
    if (!user) return;

    try {
      await healthScoreService.initializeHealthScore(user.id);
      await fetchHealthData();
    } catch (err) {
      console.error("Error initializing health score:", err);
    }
  }, [user, fetchHealthData]);

  // Fetch data on mount
  useEffect(() => {
    fetchHealthData();
  }, [fetchHealthData]);

  // Get activity icon data (not JSX)
  const getActivityIconData = useCallback(
    (activityType: string, completed: boolean) => {
      const baseClass = `w-8 h-8 rounded-full flex items-center justify-center ${
        completed ? "bg-green-500" : "bg-gray-400"
      }`;

      const iconPaths = {
        exercise:
          "M13.5 5.5c-.28 0-.5-.22-.5-.5s.22-.5.5-.5.5.22.5.5-.22.5-.5.5zm-3.5 2c-.28 0-.5-.22-.5-.5s.22-.5.5-.5.5.22.5.5-.22.5-.5.5zm-3.5 2c-.28 0-.5-.22-.5-.5s.22-.5.5-.5.5.22.5.5-.22.5-.5.5zm7 0c-.28 0-.5-.22-.5-.5s.22-.5.5-.5.5.22.5.5-.22.5-.5.5zm-3.5 2c-.28 0-.5-.22-.5-.5s.22-.5.5-.5.5.22.5.5-.22.5-.5.5z",
        nutrition:
          "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z",
        hydration:
          "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.94-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z",
        meals:
          "M8.1 13.34l2.83-2.83L3.91 3.5c-1.56 1.56-1.56 4.09 0 5.66l4.19 4.18zm6.78-1.81c1.53.71 3.68.21 5.27-1.38 1.91-1.91 2.28-4.65.81-6.12-1.46-1.46-4.2-1.1-6.12.81-1.59 1.59-2.09 3.74-1.38 5.27L3.7 19.87l1.41 1.41L12 14.41l6.88 6.88 1.41-1.41L13.41 13l1.47-1.47z",
        sleep:
          "M13.5 5.5c-.28 0-.5-.22-.5-.5s.22-.5.5-.5.5.22.5.5-.22.5-.5.5zm-3.5 2c-.28 0-.5-.22-.5-.5s.22-.5.5-.5.5.22.5.5-.22.5-.5.5zm-3.5 2c-.28 0-.5-.22-.5-.5s.22-.5.5-.5.5.22.5.5-.22.5-.5.5zm7 0c-.28 0-.5-.22-.5-.5s.22-.5.5-.5.5.22.5.5-.22.5-.5.5zm-3.5 2c-.28 0-.5-.22-.5-.5s.22-.5.5-.5.5.22.5.5-.22.5-.5.5z",
      };

      return {
        className: baseClass,
        iconPath:
          iconPaths[activityType as keyof typeof iconPaths] ||
          iconPaths.exercise,
      };
    },
    []
  );

  // Get streak bonus text
  const getStreakBonusText = useCallback((streakBonus: number) => {
    if (streakBonus >= 1.2) return "Consistent week: 1.2x Score Boost!";
    if (streakBonus >= 1.1) return "Great streak: 1.1x Score Boost!";
    return "Keep going for a bonus!";
  }, []);

  return {
    healthData,
    loading,
    error,
    markActivityCompleted,
    refreshHealthScore,
    initializeHealthScore,
    getActivityIconData,
    getStreakBonusText,
    fetchHealthData,
  };
};
