import { useAuth } from "@/contexts/AuthContext";
import {
  HealthGoal,
  TimelineCalculation,
  UserProfile,
  goalTimelineCalculator,
} from "@/services/goalTimelineCalculator";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

export const useHealthGoals = () => {
  const { user, profile } = useAuth();
  const [goals, setGoals] = useState<HealthGoal[]>([]);
  const [loading, setLoading] = useState(true);
  const [calculating, setCalculating] = useState(false);

  /**
   * Load user's health goals
   */
  const loadGoals = useCallback(async () => {
    if (!user) return;

    try {
      setLoading(true);
      const userGoals = await goalTimelineCalculator.getUserHealthGoals(
        user.id
      );
      setGoals(userGoals);
    } catch (error) {
      console.error("Error loading health goals:", error);
      toast.error("Failed to load health goals");
    } finally {
      setLoading(false);
    }
  }, [user]);

  /**
   * Create a new health goal with timeline calculation
   */
  const createGoal = useCallback(
    async (
      goalData: Omit<
        HealthGoal,
        | "id"
        | "user_id"
        | "calculated_timeline_weeks"
        | "progress_percentage"
        | "created_at"
        | "updated_at"
      >
    ) => {
      if (!user || !profile) {
        toast.error("User profile not available");
        return null;
      }

      try {
        setCalculating(true);

        // Create user profile for timeline calculation
        const userProfile: UserProfile = {
          age: profile.age || 30,
          gender: profile.gender || "other",
          height_cm: parseInt(profile.height_cm || "170"),
          weight_kg: parseInt(profile.weight_kg || "70"),
          fitness_level: "beginner", // Default, could be enhanced with user input
          health_conditions: profile.chronic_conditions || [],
          lifestyle_factors: {
            smoking_status: "never", // Default, could be enhanced
            alcohol_consumption: "none", // Default, could be enhanced
            exercise_frequency: "none", // Default, could be enhanced
            sleep_hours: 7, // Default, could be enhanced
            stress_level: "moderate", // Default, could be enhanced
          },
        };

        // Calculate timeline
        const timelineCalculation =
          await goalTimelineCalculator.calculateTimeline(goalData, userProfile);

        // Create goal with calculated timeline
        const goalWithTimeline: Omit<
          HealthGoal,
          "id" | "created_at" | "updated_at"
        > = {
          ...goalData,
          user_id: user.id,
          calculated_timeline_weeks: timelineCalculation.realistic_weeks,
          progress_percentage: 0,
        };

        // Save to database
        const savedGoal = await goalTimelineCalculator.saveHealthGoal(
          goalWithTimeline
        );

        if (savedGoal) {
          setGoals((prev) => [savedGoal, ...prev]);
          toast.success(
            `Goal created! Timeline: ${timelineCalculation.realistic_weeks} weeks`
          );
          return savedGoal;
        } else {
          toast.error("Failed to save goal");
          return null;
        }
      } catch (error) {
        console.error("Error creating goal:", error);
        toast.error("Failed to create goal");
        return null;
      } finally {
        setCalculating(false);
      }
    },
    [user, profile]
  );

  /**
   * Update a health goal
   */
  const updateGoal = useCallback(
    async (goalId: string, updates: Partial<HealthGoal>) => {
      try {
        const updatedGoal = await goalTimelineCalculator.updateHealthGoal(
          goalId,
          updates
        );

        if (updatedGoal) {
          setGoals((prev) =>
            prev.map((goal) => (goal.id === goalId ? updatedGoal : goal))
          );
          toast.success("Goal updated successfully");
          return updatedGoal;
        } else {
          toast.error("Failed to update goal");
          return null;
        }
      } catch (error) {
        console.error("Error updating goal:", error);
        toast.error("Failed to update goal");
        return null;
      }
    },
    []
  );

  /**
   * Calculate timeline for a goal without saving
   */
  const calculateTimeline = useCallback(
    async (
      goalData: Omit<
        HealthGoal,
        | "id"
        | "user_id"
        | "calculated_timeline_weeks"
        | "progress_percentage"
        | "created_at"
        | "updated_at"
      >
    ): Promise<TimelineCalculation | null> => {
      if (!profile) return null;

      try {
        setCalculating(true);

        const userProfile: UserProfile = {
          age: profile.age || 30,
          gender: profile.gender || "other",
          height_cm: parseInt(profile.height_cm || "170"),
          weight_kg: parseInt(profile.weight_kg || "70"),
          fitness_level: "beginner",
          health_conditions: profile.chronic_conditions || [],
          lifestyle_factors: {
            smoking_status: "never",
            alcohol_consumption: "none",
            exercise_frequency: "none",
            sleep_hours: 7,
            stress_level: "moderate",
          },
        };

        const timelineCalculation =
          await goalTimelineCalculator.calculateTimeline(goalData, userProfile);
        return timelineCalculation;
      } catch (error) {
        console.error("Error calculating timeline:", error);
        toast.error("Failed to calculate timeline");
        return null;
      } finally {
        setCalculating(false);
      }
    },
    [profile]
  );

  /**
   * Get active goals
   */
  const getActiveGoals = useCallback(() => {
    return goals.filter((goal) => goal.status === "active");
  }, [goals]);

  /**
   * Get completed goals
   */
  const getCompletedGoals = useCallback(() => {
    return goals.filter((goal) => goal.status === "completed");
  }, [goals]);

  /**
   * Get goals by type
   */
  const getGoalsByType = useCallback(
    (goalType: string) => {
      return goals.filter((goal) => goal.goal_type === goalType);
    },
    [goals]
  );

  /**
   * Get goal progress summary
   */
  const getGoalProgressSummary = useCallback(() => {
    const activeGoals = getActiveGoals();
    const completedGoals = getCompletedGoals();

    const totalGoals = goals.length;
    const completionRate =
      totalGoals > 0 ? (completedGoals.length / totalGoals) * 100 : 0;

    const averageProgress =
      activeGoals.length > 0
        ? activeGoals.reduce((sum, goal) => sum + goal.progress_percentage, 0) /
          activeGoals.length
        : 0;

    return {
      totalGoals,
      activeGoals: activeGoals.length,
      completedGoals: completedGoals.length,
      completionRate: Math.round(completionRate),
      averageProgress: Math.round(averageProgress),
    };
  }, [goals, getActiveGoals, getCompletedGoals]);

  /**
   * Mark goal as completed
   */
  const completeGoal = useCallback(
    async (goalId: string) => {
      try {
        const updatedGoal = await updateGoal(goalId, {
          status: "completed",
          progress_percentage: 100,
        });

        if (updatedGoal) {
          toast.success("🎉 Goal completed! Congratulations!");
        }

        return updatedGoal;
      } catch (error) {
        console.error("Error completing goal:", error);
        toast.error("Failed to complete goal");
        return null;
      }
    },
    [updateGoal]
  );

  /**
   * Pause a goal
   */
  const pauseGoal = useCallback(
    async (goalId: string) => {
      try {
        const updatedGoal = await updateGoal(goalId, { status: "paused" });

        if (updatedGoal) {
          toast.success("Goal paused");
        }

        return updatedGoal;
      } catch (error) {
        console.error("Error pausing goal:", error);
        toast.error("Failed to pause goal");
        return null;
      }
    },
    [updateGoal]
  );

  /**
   * Resume a paused goal
   */
  const resumeGoal = useCallback(
    async (goalId: string) => {
      try {
        const updatedGoal = await updateGoal(goalId, { status: "active" });

        if (updatedGoal) {
          toast.success("Goal resumed");
        }

        return updatedGoal;
      } catch (error) {
        console.error("Error resuming goal:", error);
        toast.error("Failed to resume goal");
        return null;
      }
    },
    [updateGoal]
  );

  /**
   * Delete a goal
   */
  const deleteGoal = useCallback(async (goalId: string) => {
    try {
      // Note: This would need to be implemented in the service
      // For now, we'll just remove it from the local state
      setGoals((prev) => prev.filter((goal) => goal.id !== goalId));
      toast.success("Goal deleted");
    } catch (error) {
      console.error("Error deleting goal:", error);
      toast.error("Failed to delete goal");
    }
  }, []);

  // Load goals on mount
  useEffect(() => {
    loadGoals();
  }, [loadGoals]);

  return {
    goals,
    loading,
    calculating,
    loadGoals,
    createGoal,
    updateGoal,
    calculateTimeline,
    getActiveGoals,
    getCompletedGoals,
    getGoalsByType,
    getGoalProgressSummary,
    completeGoal,
    pauseGoal,
    resumeGoal,
    deleteGoal,
  };
};
