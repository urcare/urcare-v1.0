import { useAuth } from "@/contexts/AuthContext";
import {
  Activity,
  Flame,
  Minus,
  Plus,
  Target,
  TrendingUp,
  Zap,
} from "lucide-react";
import React, { useEffect, useState } from "react";

export const CalorieTrackerCard: React.FC = () => {
  const { user, profile } = useAuth();
  const [caloriesBurned, setCaloriesBurned] = useState(0);
  const [calorieGoal, setCalorieGoal] = useState(2000); // Default 2000 calories
  const [isTracking, setIsTracking] = useState(false);
  const [currentSessionCalories, setCurrentSessionCalories] = useState(0);
  const [trackingStartTime, setTrackingStartTime] = useState<Date | null>(null);

  // Calculate calories based on user profile
  useEffect(() => {
    if (profile) {
      // Basic calorie goal calculation (simplified)
      const baseCalories = profile.gender === "Male" ? 2500 : 2000;
      const ageFactor = profile.age
        ? Math.max(0.8, 1 - (profile.age - 25) * 0.01)
        : 1;
      const weightFactor = profile.weight_kg ? profile.weight_kg / 70 : 1;

      setCalorieGoal(Math.round(baseCalories * ageFactor * weightFactor));
    }
  }, [profile]);

  // Simulate calorie burning when tracking
  useEffect(() => {
    if (!isTracking) return;

    const interval = setInterval(() => {
      // Simulate calorie burning based on time and user profile
      const timeElapsed = trackingStartTime
        ? (Date.now() - trackingStartTime.getTime()) / 1000 / 60
        : 0; // minutes
      const caloriesPerMinute = profile?.weight_kg
        ? profile.weight_kg * 0.1
        : 7; // Rough estimate
      const newSessionCalories = Math.round(timeElapsed * caloriesPerMinute);

      setCurrentSessionCalories(newSessionCalories);
      setCaloriesBurned(
        (prev) => prev + (newSessionCalories - currentSessionCalories)
      );
    }, 10000); // Update every 10 seconds

    return () => clearInterval(interval);
  }, [isTracking, trackingStartTime, profile, currentSessionCalories]);

  // Start tracking
  const handleStartTracking = () => {
    setIsTracking(true);
    setTrackingStartTime(new Date());
    setCurrentSessionCalories(0);
  };

  // Stop tracking
  const handleStopTracking = () => {
    setIsTracking(false);
    setTrackingStartTime(null);
    setCurrentSessionCalories(0);
  };

  // Manual calorie adjustment
  const adjustCalories = (amount: number) => {
    setCaloriesBurned((prev) => Math.max(0, prev + amount));
  };

  // Calculate progress percentage
  const progressPercentage = Math.min(
    (caloriesBurned / calorieGoal) * 100,
    100
  );

  // Get progress color
  const getProgressColor = () => {
    if (progressPercentage >= 100) return "text-green-500";
    if (progressPercentage >= 75) return "text-orange-500";
    if (progressPercentage >= 50) return "text-yellow-500";
    return "text-red-500";
  };

  return (
    <div className="h-full bg-white/95 backdrop-blur-xl rounded-2xl p-4 shadow-xl border border-gray-100/50 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <Flame className="h-5 w-5 text-orange-600" />
          <h3 className="text-lg font-semibold text-gray-800">Calories</h3>
        </div>
        <div
          className={`w-3 h-3 rounded-full ${
            isTracking ? "bg-orange-500 animate-pulse" : "bg-gray-300"
          }`}
        ></div>
      </div>

      {/* Main Calorie Display */}
      <div className="flex-1 flex flex-col justify-center">
        <div className="text-center mb-4">
          <div className="text-3xl sm:text-4xl font-bold text-gray-800 mb-1">
            {caloriesBurned.toLocaleString()}
          </div>
          <div className="text-sm text-gray-500">calories burned</div>
        </div>

        {/* Progress Bar */}
        <div className="mb-4">
          <div className="flex justify-between text-xs text-gray-500 mb-1">
            <span>Progress</span>
            <span>{Math.round(progressPercentage)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-orange-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progressPercentage}%` }}
            ></div>
          </div>
          <div className="text-xs text-gray-500 mt-1">
            {calorieGoal - caloriesBurned > 0
              ? `${(calorieGoal - caloriesBurned).toLocaleString()} to go`
              : "Goal achieved! 🔥"}
          </div>
        </div>

        {/* Goal Display */}
        <div className="text-center mb-4">
          <div className="flex items-center justify-center space-x-1 text-sm text-gray-600">
            <Target className="h-4 w-4" />
            <span>Goal: {calorieGoal.toLocaleString()}</span>
          </div>
        </div>
      </div>

      {/* Control Buttons */}
      <div className="mt-auto space-y-2">
        {/* Start/Stop Button */}
        {!isTracking ? (
          <button
            onClick={handleStartTracking}
            className="w-full bg-orange-500 hover:bg-orange-600 text-white py-2 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center space-x-2"
          >
            <Activity className="h-4 w-4" />
            <span>Start Tracking</span>
          </button>
        ) : (
          <button
            onClick={handleStopTracking}
            className="w-full bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center space-x-2"
          >
            <Zap className="h-4 w-4" />
            <span>Stop Tracking</span>
          </button>
        )}

        {/* Manual Adjustment Buttons */}
        <div className="flex space-x-2">
          <button
            onClick={() => adjustCalories(-50)}
            className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-1 px-2 rounded text-sm transition-colors duration-200 flex items-center justify-center space-x-1"
          >
            <Minus className="h-3 w-3" />
            <span>50</span>
          </button>
          <button
            onClick={() => adjustCalories(50)}
            className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-1 px-2 rounded text-sm transition-colors duration-200 flex items-center justify-center space-x-1"
          >
            <Plus className="h-3 w-3" />
            <span>50</span>
          </button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="mt-3 pt-3 border-t border-gray-100">
        <div className="flex justify-between text-xs text-gray-500">
          <div className="flex items-center space-x-1">
            <TrendingUp className="h-3 w-3" />
            <span>Session: {currentSessionCalories}</span>
          </div>
          <div className="text-gray-400">{isTracking ? "Burning" : "Idle"}</div>
        </div>
      </div>
    </div>
  );
};
