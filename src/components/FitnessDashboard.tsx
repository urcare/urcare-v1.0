import { useAuth } from "@/contexts/AuthContext";
import { nutritionTrackingService } from "@/services/nutritionTrackingService";
import React, { useEffect, useState } from "react";
import { CalorieCard } from "./CalorieCard";

interface DashboardData {
  calories: {
    consumed: number;
    target: number;
    remaining: number;
  };
  macros: {
    carbs: { current: number; target: number };
    protein: { current: number; target: number };
    fat: { current: number; target: number };
  };
}

export const FitnessDashboard: React.FC = () => {
  const { user, profile } = useAuth();

  // Set default data immediately to prevent loading screen on tab switches
  const [dashboardData, setDashboardData] = useState<DashboardData>({
    calories: { consumed: 1280, target: 2000, remaining: 720 },
    macros: {
      carbs: { current: 88, target: 120 },
      protein: { current: 24, target: 70 },
      fat: { current: 32, target: 55 },
    },
  });

  const [loading, setLoading] = useState(false);
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  useEffect(() => {
    const loadDashboardData = async () => {
      if (!user || !profile) return;

      try {
        // Only show loading on initial load, not on tab switches
        if (isInitialLoad) {
          setLoading(true);
        }

        // Get user's name

        // Calculate target calories and macros from user profile
        let targetCalories = 2000; // Default
        let targetCarbs = 250;
        let targetProtein = 150;
        let targetFat = 67;

        if (profile.weight_kg && profile.height_cm && profile.age) {
          // Calculate BMR using Mifflin-St Jeor Equation
          let bmr: number;
          if (profile.gender === "male") {
            bmr =
              10 * parseFloat(profile.weight_kg) +
              6.25 * parseFloat(profile.height_cm) -
              5 * profile.age +
              5;
          } else {
            bmr =
              10 * parseFloat(profile.weight_kg) +
              6.25 * parseFloat(profile.height_cm) -
              5 * profile.age -
              161;
          }

          // Apply activity multiplier (assuming lightly active)
          targetCalories = Math.round(bmr * 1.375);

          // Calculate macros
          targetProtein = Math.round(parseFloat(profile.weight_kg) * 1.6);
          targetFat = Math.round((targetCalories * 0.25) / 9);
          targetCarbs = Math.round(
            (targetCalories - targetProtein * 4 - targetFat * 9) / 4
          );
        }

        // Get today's nutrition data using the nutrition service
        const today = new Date().toISOString().split("T")[0];
        let nutritionData = null;

        try {
          nutritionData = await nutritionTrackingService.getDailyNutrition(
            user.id,
            today
          );
        } catch (error) {
          console.warn("Nutrition data not available:", error);
          // Use default values if nutrition data is not available
        }

        const consumedCalories = nutritionData?.totalCalories || 0;
        const consumedCarbs = nutritionData?.carbs || 0;
        const consumedProtein = nutritionData?.protein || 0;
        const consumedFat = nutritionData?.fat || 0;

        setDashboardData({
          calories: {
            consumed: consumedCalories,
            target: targetCalories,
            remaining: Math.max(0, targetCalories - consumedCalories),
          },
          macros: {
            carbs: { current: consumedCarbs, target: targetCarbs },
            protein: { current: consumedProtein, target: targetProtein },
            fat: { current: consumedFat, target: targetFat },
          },
        });
      } catch (error) {
        console.error("Error loading dashboard data:", error);
        // Set default data on error
        setDashboardData({
          calories: { consumed: 1280, target: 2000, remaining: 720 },
          macros: {
            carbs: { current: 88, target: 120 },
            protein: { current: 24, target: 70 },
            fat: { current: 32, target: 55 },
          },
        });
      } finally {
        setLoading(false);
        setIsInitialLoad(false);
      }
    };

    loadDashboardData();
  }, [user, profile, isInitialLoad]);

  // Only show loading screen on initial load
  if (loading && isInitialLoad) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-500">Loading...</div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-gray-50 px-3 py-2 relative overflow-hidden">
      {/* Subtle loading indicator for background updates */}
      {loading && !isInitialLoad && (
        <div className="absolute top-2 right-2 z-10">
          <div className="w-4 h-4 border-2 border-green-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}

      {/* Calories Dashboard */}
      <div className="h-full overflow-y-auto">
        <CalorieCard
          consumed={dashboardData.calories.consumed}
          target={dashboardData.calories.target}
          remaining={dashboardData.calories.remaining}
          macros={dashboardData.macros}
        />
      </div>
    </div>
  );
};
