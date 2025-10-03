import { useAuth } from "@/contexts/AuthContext";
import { StepCounterService } from "@/services/stepCounterService";
import {
  Activity,
  Footprints,
  Play,
  Square,
  Target,
  TrendingUp,
} from "lucide-react";
import React, { useEffect, useState } from "react";

export const StepCounterCard: React.FC = () => {
  const { user, profile } = useAuth();
  const [stepService] = useState(() => StepCounterService.getInstance());
  const [currentSteps, setCurrentSteps] = useState(0);
  const [dailySteps, setDailySteps] = useState(0);
  const [isTracking, setIsTracking] = useState(false);
  const [stepGoal] = useState(10000); // Default 10K steps
  const [isInitialized, setIsInitialized] = useState(false);

  // Initialize step counter service
  useEffect(() => {
    const initializeService = async () => {
      if (!profile || isInitialized) return;

      try {
        // Create user fitness profile from auth profile
        const userFitnessProfile = {
          id: user?.id || "",
          age: profile?.age || 25,
          height: profile?.height_cm || 170,
          weight: profile?.weight_kg || 70,
          gender: profile?.gender || "Male",
          activityLevel: "moderate",
          stepGoal: stepGoal,
        };

        await stepService.initialize(userFitnessProfile);
        setIsInitialized(true);

        // Set up step update callback
        stepService.onStepUpdate = (steps) => {
          setCurrentSteps(steps);
        };

        // Load today's stats
        const stats = await stepService.getDailyStats();
        if (stats) {
          setDailySteps(stats.totalSteps);
        }

        console.log("Step counter service initialized");
      } catch (error) {
        console.error("Failed to initialize step counter service:", error);
      }
    };

    initializeService();
  }, [profile, user, stepService, isInitialized, stepGoal]);

  // Start tracking
  const handleStartTracking = async () => {
    try {
      await stepService.startTracking();
      setIsTracking(true);
    } catch (error) {
      console.error("Failed to start step tracking:", error);
    }
  };

  // Stop tracking
  const handleStopTracking = async () => {
    try {
      await stepService.stopTracking();
      setIsTracking(false);
      // Reload daily stats
      const stats = await stepService.getDailyStats();
      if (stats) {
        setDailySteps(stats.totalSteps);
      }
    } catch (error) {
      console.error("Failed to stop step tracking:", error);
    }
  };

  // Calculate progress percentage
  const progressPercentage = Math.min((dailySteps / stepGoal) * 100, 100);

  // Get progress color
  const getProgressColor = () => {
    if (progressPercentage >= 100) return "text-green-500";
    if (progressPercentage >= 75) return "text-blue-500";
    if (progressPercentage >= 50) return "text-yellow-500";
    return "text-red-500";
  };

  if (!isInitialized) {
    return (
      <div className="h-full bg-white/95 backdrop-blur-xl rounded-2xl p-4 shadow-xl border border-gray-100/50 flex items-center justify-center">
        <div className="flex items-center space-x-2">
          <Activity className="h-5 w-5 animate-spin text-blue-600" />
          <span className="text-sm text-gray-600">Initializing...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full bg-white/95 backdrop-blur-xl rounded-2xl p-4 shadow-xl border border-gray-100/50 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <Footprints className="h-5 w-5 text-blue-600" />
          <h3 className="text-lg font-semibold text-gray-800">Steps</h3>
        </div>
        <div
          className={`w-3 h-3 rounded-full ${
            isTracking ? "bg-green-500 animate-pulse" : "bg-gray-300"
          }`}
        ></div>
      </div>

      {/* Main Step Display */}
      <div className="flex-1 flex flex-col justify-center">
        <div className="text-center mb-4">
          <div className="text-3xl sm:text-4xl font-bold text-gray-800 mb-1">
            {dailySteps.toLocaleString()}
          </div>
          <div className="text-sm text-gray-500">steps today</div>
        </div>

        {/* Progress Bar */}
        <div className="mb-4">
          <div className="flex justify-between text-xs text-gray-500 mb-1">
            <span>Progress</span>
            <span>{Math.round(progressPercentage)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progressPercentage}%` }}
            ></div>
          </div>
          <div className="text-xs text-gray-500 mt-1">
            {stepGoal - dailySteps > 0
              ? `${(stepGoal - dailySteps).toLocaleString()} to go`
              : "Goal achieved! 🎉"}
          </div>
        </div>

        {/* Goal Display */}
        <div className="text-center mb-4">
          <div className="flex items-center justify-center space-x-1 text-sm text-gray-600">
            <Target className="h-4 w-4" />
            <span>Goal: {stepGoal.toLocaleString()}</span>
          </div>
        </div>
      </div>

      {/* Control Button */}
      <div className="mt-auto">
        {!isTracking ? (
          <button
            onClick={handleStartTracking}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center space-x-2"
          >
            <Play className="h-4 w-4" />
            <span>Start Tracking</span>
          </button>
        ) : (
          <button
            onClick={handleStopTracking}
            className="w-full bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center space-x-2"
          >
            <Square className="h-4 w-4" />
            <span>Stop Tracking</span>
          </button>
        )}
      </div>

      {/* Quick Stats */}
      <div className="mt-3 pt-3 border-t border-gray-100">
        <div className="flex justify-between text-xs text-gray-500">
          <div className="flex items-center space-x-1">
            <TrendingUp className="h-3 w-3" />
            <span>Current: {currentSteps.toLocaleString()}</span>
          </div>
          <div className="text-gray-400">{isTracking ? "Live" : "Paused"}</div>
        </div>
      </div>
    </div>
  );
};
