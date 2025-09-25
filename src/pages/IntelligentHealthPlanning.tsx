/**
 * INTELLIGENT HEALTH PLANNING PAGE
 *
 * Main page for the intelligent health planning system
 */

import DailyScheduleView from "@/components/IntelligentHealthPlanning/DailyScheduleView";
import DifficultySelection from "@/components/IntelligentHealthPlanning/DifficultySelection";
import PlanDetailsPage from "@/components/IntelligentHealthPlanning/PlanDetailsPage";
import { useAuth } from "@/contexts/AuthContext";
import {
  HealthProgress,
  IntelligentHealthPlanningService,
  WeeklyPlan,
} from "@/services/intelligentHealthPlanningService";
import React, { useEffect, useState } from "react";

type ViewState =
  | "goal-input"
  | "difficulty-selection"
  | "plan-details"
  | "daily-schedule";

export const IntelligentHealthPlanning: React.FC = () => {
  const { user, profile } = useAuth();
  const [currentView, setCurrentView] = useState<ViewState>("goal-input");
  const [userGoal, setUserGoal] = useState<string>("");
  const [selectedPlan, setSelectedPlan] = useState<WeeklyPlan | null>(null);
  const [healthProgress, setHealthProgress] = useState<HealthProgress | null>(
    null
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user && profile) {
      loadHealthProgress();
    }
  }, [user, profile]);

  const loadHealthProgress = async () => {
    if (!user) return;

    setLoading(true);
    try {
      const progress =
        await IntelligentHealthPlanningService.getUserHealthProgress(user.id);
      setHealthProgress(progress);
    } catch (error) {
      console.error("Error loading health progress:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleGoalSubmit = (goal: string) => {
    setUserGoal(goal);
    setCurrentView("difficulty-selection");
  };

  const handlePlanSelected = (plan: WeeklyPlan) => {
    setSelectedPlan(plan);
    setCurrentView("plan-details");
  };

  const handleStartPlan = () => {
    setCurrentView("daily-schedule");
  };

  const handleBackToSelection = () => {
    setCurrentView("difficulty-selection");
  };

  const handleBackToGoal = () => {
    setCurrentView("goal-input");
  };

  const handleBackToDetails = () => {
    setCurrentView("plan-details");
  };

  if (!user || !profile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Please log in to access health planning
          </h2>
          <p className="text-gray-600">
            You need to be logged in to use the intelligent health planning
            system.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-semibold text-gray-900">
                Intelligent Health Planning
              </h1>
            </div>

            {/* Health Progress Indicator */}
            {healthProgress && (
              <div className="flex items-center space-x-6">
                <div className="text-center">
                  <div className="text-lg font-bold text-blue-600">
                    {healthProgress.healthScore}
                  </div>
                  <div className="text-xs text-gray-500">Health Score</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold text-green-600">
                    {healthProgress.currentStreak}
                  </div>
                  <div className="text-xs text-gray-500">Day Streak</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold text-purple-600">
                    {Math.round(healthProgress.averageCompletion)}%
                  </div>
                  <div className="text-xs text-gray-500">Completion</div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto py-6">
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-600">{error}</p>
            <button
              onClick={() => setError(null)}
              className="mt-2 text-sm text-red-600 hover:text-red-800"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Goal Input View */}
        {currentView === "goal-input" && (
          <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-lg shadow-sm border p-8">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                  What's Your Health Goal?
                </h2>
                <p className="text-lg text-gray-600">
                  Tell us what you want to achieve, and we'll create a
                  personalized plan for you
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <label
                    htmlFor="goal"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Your Health Goal
                  </label>
                  <textarea
                    id="goal"
                    value={userGoal}
                    onChange={(e) => setUserGoal(e.target.value)}
                    placeholder="e.g., I want to lose 20 pounds, build muscle, improve my cardiovascular health, manage my diabetes, etc."
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    rows={4}
                  />
                </div>

                <div className="flex justify-end">
                  <button
                    onClick={() => handleGoalSubmit(userGoal)}
                    disabled={!userGoal.trim()}
                    className={`px-6 py-3 rounded-lg font-semibold transition-colors ${
                      userGoal.trim()
                        ? "bg-blue-600 text-white hover:bg-blue-700"
                        : "bg-gray-300 text-gray-500 cursor-not-allowed"
                    }`}
                  >
                    Continue to Difficulty Selection
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Difficulty Selection View */}
        {currentView === "difficulty-selection" && (
          <DifficultySelection
            profile={profile}
            userGoal={userGoal}
            onPlanSelected={handlePlanSelected}
            onBack={handleBackToGoal}
          />
        )}

        {/* Plan Details View */}
        {currentView === "plan-details" && selectedPlan && (
          <PlanDetailsPage
            plan={selectedPlan}
            onStartPlan={handleStartPlan}
            onBack={handleBackToSelection}
          />
        )}

        {/* Daily Schedule View */}
        {currentView === "daily-schedule" && selectedPlan && (
          <div>
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  Your Daily Schedule
                </h2>
                <p className="text-gray-600">
                  Follow your personalized plan step by step
                </p>
              </div>
              <div className="flex space-x-3">
                <button
                  onClick={handleBackToDetails}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                >
                  View Plan Details
                </button>
                <button
                  onClick={() => setCurrentView("difficulty-selection")}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Change Plan
                </button>
              </div>
            </div>

            <DailyScheduleView
              userId={user.id}
              onActivityComplete={(activityId, completed) => {
                console.log(
                  `Activity ${activityId} ${
                    completed ? "completed" : "incomplete"
                  }`
                );
                // Refresh health progress
                loadHealthProgress();
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default IntelligentHealthPlanning;
