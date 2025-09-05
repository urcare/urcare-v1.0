import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { nutritionTrackingService } from "@/services/nutritionTrackingService";
import { Plus } from "lucide-react";
import React, { useEffect, useState } from "react";
import { FoodLogger } from "./FoodLogger";

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
  steps: {
    current: number;
    target: number;
  };
}

const CalorieTrackerWidget: React.FC<{
  percentage: number;
  size: number;
  children?: React.ReactNode;
}> = ({ percentage, size, children }) => {
  const centerX = size / 2;
  const centerY = size / 2;
  const outerRadius = size * 0.35;
  const innerRadius = size * 0.25;
  const segmentWidth = 8;
  
  // Create 4 segments for the arc
  const segmentAngles = [45, 45, 45, 45]; // Each segment is 45 degrees
  const totalAngle = 180; // Semi-circle
  const startAngle = -90; // Start from top
  
  // Calculate which segments should be filled
  const filledSegments = Math.floor((percentage / 100) * 4);
  const partialSegment = ((percentage / 100) * 4) % 1;
  
  const createSegmentPath = (segmentIndex: number, isFilled: boolean, partialFill: number = 1) => {
    const segmentStartAngle = startAngle + (segmentIndex * 45);
    const segmentEndAngle = segmentStartAngle + (45 * partialFill);
    
    const startAngleRad = (segmentStartAngle * Math.PI) / 180;
    const endAngleRad = (segmentEndAngle * Math.PI) / 180;
    
    const outerStartX = centerX + outerRadius * Math.cos(startAngleRad);
    const outerStartY = centerY + outerRadius * Math.sin(startAngleRad);
    const outerEndX = centerX + outerRadius * Math.cos(endAngleRad);
    const outerEndY = centerY + outerRadius * Math.sin(endAngleRad);
    
    const innerStartX = centerX + innerRadius * Math.cos(startAngleRad);
    const innerStartY = centerY + innerRadius * Math.sin(startAngleRad);
    const innerEndX = centerX + innerRadius * Math.cos(endAngleRad);
    const innerEndY = centerY + innerRadius * Math.sin(endAngleRad);
    
    // Create pill-shaped segment
    const path = `
      M ${outerStartX} ${outerStartY}
      A ${outerRadius} ${outerRadius} 0 0 1 ${outerEndX} ${outerEndY}
      L ${innerEndX} ${innerEndY}
      A ${innerRadius} ${innerRadius} 0 0 0 ${innerStartX} ${innerStartY}
      Z
    `;
    
    return path;
  };
  
  // Calculate pointer position
  const pointerAngle = startAngle + (percentage / 100) * totalAngle;
  const pointerAngleRad = (pointerAngle * Math.PI) / 180;
  const pointerX = centerX + outerRadius * Math.cos(pointerAngleRad);
  const pointerY = centerY + outerRadius * Math.sin(pointerAngleRad);

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="absolute inset-0">
        {/* Inner accent arc (dashed) */}
        <path
          d={`M ${centerX - innerRadius} ${centerY} A ${innerRadius} ${innerRadius} 0 0 1 ${centerX + innerRadius} ${centerY}`}
          stroke="#9CA3AF"
          strokeWidth="2"
          fill="none"
          strokeDasharray="4 4"
          strokeLinecap="round"
        />
        
        {/* Segment tracks (background) */}
        {segmentAngles.map((_, index) => (
          <path
            key={`track-${index}`}
            d={createSegmentPath(index, false)}
            fill="#6B7280"
            className="transition-all duration-300"
          />
        ))}
        
        {/* Filled segments */}
        {Array.from({ length: filledSegments }, (_, index) => (
          <path
            key={`filled-${index}`}
            d={createSegmentPath(index, true)}
            fill="white"
            className="transition-all duration-500 ease-in-out"
          />
        ))}
        
        {/* Partial segment */}
        {partialSegment > 0 && (
          <path
            d={createSegmentPath(filledSegments, true, partialSegment)}
            fill="white"
            className="transition-all duration-500 ease-in-out"
          />
        )}
        
        {/* Progress indicator handle */}
        <g transform={`translate(${pointerX}, ${pointerY})`}>
          <circle
            cx="0"
            cy="0"
            r="8"
            fill="#374151"
            className="transition-all duration-500 ease-in-out"
          />
          {/* Speech bubble pointer */}
          <polygon
            points="0,0 0,16 -4,12 4,12"
            fill="#374151"
            className="transition-all duration-500 ease-in-out"
          />
        </g>
      </svg>
      
      {/* Center content */}
      <div className="absolute inset-0 flex items-center justify-center">
        {children}
      </div>
    </div>
  );
};

const ActivityChart: React.FC<{ steps: number; target: number }> = ({
  steps,
  target,
}) => {
  const data = [40, 60, 30, 80, 50, 70, 90]; // Mock weekly data, replace with real data
  const maxValue = Math.max(...data);

  return (
    <div className="flex items-end space-x-1 h-16">
      {data.map((value, index) => (
        <div
          key={index}
          className={`flex-1 rounded-t-sm transition-all duration-300 ${
            index === data.length - 1 ? "bg-green-500" : "bg-gray-300"
          }`}
          style={{
            height: `${(value / maxValue) * 100}%`,
            minHeight: "8px",
          }}
        />
      ))}
    </div>
  );
};

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
    steps: { current: 8500, target: 10000 },
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
        let fitnessData = null;

        try {
          nutritionData = await nutritionTrackingService.getDailyNutrition(
            user.id,
            today
          );
        } catch (error) {
          console.warn("Nutrition data not available:", error);
          // Use default values if nutrition data is not available
        }

        try {
          // Get today's fitness data (steps)
          const { data: fitnessDataResult } = await supabase
            .from("daily_fitness_stats")
            .select("*")
            .eq("user_id", user.id)
            .eq("date", today)
            .single();
          fitnessData = fitnessDataResult;
        } catch (error) {
          console.warn("Fitness data not available:", error);
          // Use default values if fitness data is not available
        }

        const consumedCalories = nutritionData?.totalCalories || 0;
        const consumedCarbs = nutritionData?.carbs || 0;
        const consumedProtein = nutritionData?.protein || 0;
        const consumedFat = nutritionData?.fat || 0;
        const currentSteps = fitnessData?.total_steps || 0;

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
          steps: {
            current: currentSteps,
            target: 10000, // Default step target
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
          steps: { current: 8500, target: 10000 },
        });
      } finally {
        setLoading(false);
        setIsInitialLoad(false);
      }
    };

    loadDashboardData();
  }, [user, profile, isInitialLoad]);

  const handleFoodAdded = () => {
    // Reload dashboard data when food is added (without showing loading)
    if (user && profile) {
      const loadData = async () => {
        try {
          const today = new Date().toISOString().split("T")[0];
          const nutritionData = await nutritionTrackingService.getDailyNutrition(
            user.id,
            today
          );

          if (nutritionData && dashboardData) {
            setDashboardData({
              ...dashboardData,
              calories: {
                ...dashboardData.calories,
                consumed: nutritionData.totalCalories,
                remaining: Math.max(
                  0,
                  dashboardData.calories.target - nutritionData.totalCalories
                ),
              },
              macros: {
                carbs: {
                  current: nutritionData.carbs,
                  target: dashboardData.macros.carbs.target,
                },
                protein: {
                  current: nutritionData.protein,
                  target: dashboardData.macros.protein.target,
                },
                fat: {
                  current: nutritionData.fat,
                  target: dashboardData.macros.fat.target,
                },
              },
            });
          }
        } catch (error) {
          console.error("Error updating nutrition data:", error);
        }
      };
      loadData();
    }
  };

  // Only show loading screen on initial load
  if (loading && isInitialLoad) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-500">Loading...</div>
      </div>
    );
  }

  const caloriesPercentage = Math.min(
    (dashboardData.calories.consumed / dashboardData.calories.target) * 100,
    100
  );
  const stepsPercentage = Math.min(
    (dashboardData.steps.current / dashboardData.steps.target) * 100,
    100
  );

  return (
    <div className="min-h-screen bg-gray-50 px-6 py-4 relative">
      {/* Subtle loading indicator for background updates */}
      {loading && !isInitialLoad && (
        <div className="absolute top-4 right-4 z-10">
          <div className="w-6 h-6 border-2 border-green-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}
      
      {/* Calories Card */}
      <div className="bg-green-200 rounded-3xl p-8 mb-6 relative overflow-hidden">
        <div className="flex items-center justify-center">
          <CalorieTrackerWidget
            percentage={caloriesPercentage}
            size={200}
          >
            <div className="text-center">
              <div className="text-4xl font-bold text-white">
                {dashboardData.calories.consumed}
              </div>
              <div className="text-white text-opacity-90 text-lg">kcal</div>
            </div>
          </CalorieTrackerWidget>
        </div>

        {/* Decorative elements */}
        <div className="absolute top-6 left-6 w-16 h-16 bg-white bg-opacity-20 rounded-full"></div>
        <div className="absolute bottom-8 right-8 w-24 h-24 bg-white bg-opacity-10 rounded-full"></div>
      </div>

      {/* Bottom Cards */}
      <div className="grid grid-cols-2 gap-4">
        {/* Activity Card */}
        <div className="bg-white rounded-2xl p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Activity</h3>
          <ActivityChart
            steps={dashboardData.steps.current}
            target={dashboardData.steps.target}
          />
          <div className="flex items-center mt-4">
            <span className="text-2xl font-bold text-gray-900">
              {dashboardData.steps.current.toLocaleString()}
            </span>
            <span className="text-sm text-gray-500 ml-1">steps</span>
            <div className="ml-auto">
              <div className="w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center">
                <div className="w-3 h-3 border-2 border-gray-400 border-t-transparent rounded-full animate-spin-slow"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Add a Friend Card */}
        <div className="bg-gradient-to-br from-yellow-200 to-green-300 rounded-2xl p-6 relative overflow-hidden">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Add a friend
          </h3>
          <p className="text-sm text-gray-700 mb-4">
            Create challenges and enjoy the process
          </p>

          {/* Avatar Stack */}
          <div className="flex items-center mb-4">
            <div className="w-10 h-10 bg-white rounded-full overflow-hidden border-2 border-white -ml-0">
              <img
                src="https://api.dicebear.com/7.x/avataaars/svg?seed=friend1"
                alt="Friend 1"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="w-10 h-10 bg-white rounded-full overflow-hidden border-2 border-white -ml-2">
              <img
                src="https://api.dicebear.com/7.x/avataaars/svg?seed=friend2"
                alt="Friend 2"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center border-2 border-white -ml-2">
              <Plus className="w-5 h-5 text-white" />
            </div>
          </div>

          {/* Decorative circles */}
          <div className="absolute -top-4 -right-4 w-16 h-16 bg-white bg-opacity-30 rounded-full"></div>
          <div className="absolute -bottom-4 -left-4 w-12 h-12 bg-white bg-opacity-20 rounded-full"></div>
        </div>
      </div>

      {/* Food Logger */}
      <FoodLogger onFoodAdded={handleFoodAdded} />
    </div>
  );
};
