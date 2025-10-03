/**
 * DIFFICULTY SELECTION COMPONENT
 *
 * Component for selecting difficulty level (Easy, Moderate, Hard)
 */

import {
  DifficultyLevel,
  IntelligentHealthPlanningService,
  WeeklyPlan,
} from "@/services/intelligentHealthPlanningService";
import React, { useEffect, useState } from "react";

interface DifficultySelectionProps {
  profile: any;
  userGoal: string;
  onPlanSelected: (plan: WeeklyPlan) => void;
  onBack?: () => void;
}

export const DifficultySelection: React.FC<DifficultySelectionProps> = ({
  profile,
  userGoal,
  onPlanSelected,
  onBack,
}) => {
  const [difficultyOptions, setDifficultyOptions] = useState<{
    easy: DifficultyLevel;
    moderate: DifficultyLevel;
    hard: DifficultyLevel;
  } | null>(null);
  const [loading, setLoading] = useState(false);
  const [selectedDifficulty, setSelectedDifficulty] = useState<string | null>(
    null
  );
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadDifficultyOptions();
  }, []);

  const loadDifficultyOptions = async () => {
    setLoading(true);
    setError(null);
    try {
      const options =
        await IntelligentHealthPlanningService.generateDifficultyOptions(
          profile,
          userGoal
        );
      setDifficultyOptions(options);
    } catch (error) {
      console.error("Error loading difficulty options:", error);
      setError("Failed to load difficulty options. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleDifficultySelect = async (difficulty: string) => {
    setSelectedDifficulty(difficulty);
    setLoading(true);
    setError(null);

    try {
      const plan = await IntelligentHealthPlanningService.generateWeeklyPlan(
        profile,
        difficulty as "easy" | "moderate" | "hard",
        userGoal
      );
      onPlanSelected(plan);
    } catch (error) {
      console.error("Error generating plan:", error);
      setError("Failed to generate plan. Please try again.");
      setSelectedDifficulty(null);
    } finally {
      setLoading(false);
    }
  };

  if (loading && !difficultyOptions) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-2">Loading difficulty options...</span>
      </div>
    );
  }

  if (error && !difficultyOptions) {
    return (
      <div className="text-center p-8">
        <p className="text-red-600 mb-4">{error}</p>
        <button
          onClick={loadDifficultyOptions}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Retry
        </button>
        {onBack && (
          <button
            onClick={onBack}
            className="ml-4 px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
          >
            Back
          </button>
        )}
      </div>
    );
  }

  if (!difficultyOptions) {
    return (
      <div className="text-center p-8">
        <p className="text-red-600">Failed to load difficulty options</p>
        <button
          onClick={loadDifficultyOptions}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          Choose Your Difficulty Level
        </h2>
        <p className="text-lg text-gray-600 mb-2">
          Your Goal:{" "}
          <span className="font-semibold text-blue-600">{userGoal}</span>
        </p>
        <p className="text-gray-500">
          Select the difficulty level that best matches your current fitness
          level and time availability
        </p>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-600">{error}</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Easy Plan */}
        <div className="bg-green-50 border-2 border-green-200 rounded-xl p-6 hover:shadow-lg transition-shadow">
          <div className="text-center mb-4">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">🌱</span>
            </div>
            <h3 className="text-xl font-bold text-green-800 mb-2">
              {difficultyOptions.easy.name}
            </h3>
            <p className="text-green-600 mb-4">
              {difficultyOptions.easy.description}
            </p>
          </div>

          <div className="space-y-3 mb-6">
            <div className="flex items-center">
              <span className="text-sm font-medium text-gray-600 w-20">
                Time:
              </span>
              <span className="text-sm text-gray-800">
                {difficultyOptions.easy.estimatedTime}
              </span>
            </div>
            <div className="flex items-center">
              <span className="text-sm font-medium text-gray-600 w-20">
                Intensity:
              </span>
              <div className="flex">
                {[...Array(10)].map((_, i) => (
                  <div
                    key={i}
                    className={`w-2 h-2 rounded-full mr-1 ${
                      i < difficultyOptions.easy.intensity
                        ? "bg-green-500"
                        : "bg-gray-300"
                    }`}
                  />
                ))}
              </div>
            </div>
            <div className="flex items-center">
              <span className="text-sm font-medium text-gray-600 w-20">
                Commitment:
              </span>
              <span className="text-sm text-gray-800">
                {difficultyOptions.easy.timeCommitment}
              </span>
            </div>
          </div>

          <div className="mb-6">
            <h4 className="font-semibold text-gray-800 mb-2">
              What you'll get:
            </h4>
            <ul className="text-sm text-gray-600 space-y-1">
              {difficultyOptions.easy.characteristics.map((char, index) => (
                <li key={index} className="flex items-center">
                  <span className="text-green-500 mr-2">✓</span>
                  {char}
                </li>
              ))}
            </ul>
          </div>

          <div className="mb-6">
            <h4 className="font-semibold text-gray-800 mb-2">
              Equipment needed:
            </h4>
            <div className="flex flex-wrap gap-2">
              {difficultyOptions.easy.equipmentNeeded.map(
                (equipment, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded"
                  >
                    {equipment}
                  </span>
                )
              )}
            </div>
          </div>

          <button
            onClick={() => handleDifficultySelect("easy")}
            disabled={loading && selectedDifficulty === "easy"}
            className={`w-full py-3 px-4 rounded-lg font-semibold transition-colors ${
              loading && selectedDifficulty === "easy"
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-green-600 hover:bg-green-700 text-white"
            }`}
          >
            {loading && selectedDifficulty === "easy" ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Generating Plan...
              </div>
            ) : (
              "Choose Easy Plan"
            )}
          </button>
        </div>

        {/* Moderate Plan */}
        <div className="bg-yellow-50 border-2 border-yellow-200 rounded-xl p-6 hover:shadow-lg transition-shadow">
          <div className="text-center mb-4">
            <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">💪</span>
            </div>
            <h3 className="text-xl font-bold text-yellow-800 mb-2">
              {difficultyOptions.moderate.name}
            </h3>
            <p className="text-yellow-600 mb-4">
              {difficultyOptions.moderate.description}
            </p>
          </div>

          <div className="space-y-3 mb-6">
            <div className="flex items-center">
              <span className="text-sm font-medium text-gray-600 w-20">
                Time:
              </span>
              <span className="text-sm text-gray-800">
                {difficultyOptions.moderate.estimatedTime}
              </span>
            </div>
            <div className="flex items-center">
              <span className="text-sm font-medium text-gray-600 w-20">
                Intensity:
              </span>
              <div className="flex">
                {[...Array(10)].map((_, i) => (
                  <div
                    key={i}
                    className={`w-2 h-2 rounded-full mr-1 ${
                      i < difficultyOptions.moderate.intensity
                        ? "bg-yellow-500"
                        : "bg-gray-300"
                    }`}
                  />
                ))}
              </div>
            </div>
            <div className="flex items-center">
              <span className="text-sm font-medium text-gray-600 w-20">
                Commitment:
              </span>
              <span className="text-sm text-gray-800">
                {difficultyOptions.moderate.timeCommitment}
              </span>
            </div>
          </div>

          <div className="mb-6">
            <h4 className="font-semibold text-gray-800 mb-2">
              What you'll get:
            </h4>
            <ul className="text-sm text-gray-600 space-y-1">
              {difficultyOptions.moderate.characteristics.map((char, index) => (
                <li key={index} className="flex items-center">
                  <span className="text-yellow-500 mr-2">✓</span>
                  {char}
                </li>
              ))}
            </ul>
          </div>

          <div className="mb-6">
            <h4 className="font-semibold text-gray-800 mb-2">
              Equipment needed:
            </h4>
            <div className="flex flex-wrap gap-2">
              {difficultyOptions.moderate.equipmentNeeded.map(
                (equipment, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 bg-yellow-100 text-yellow-700 text-xs rounded"
                  >
                    {equipment}
                  </span>
                )
              )}
            </div>
          </div>

          <button
            onClick={() => handleDifficultySelect("moderate")}
            disabled={loading && selectedDifficulty === "moderate"}
            className={`w-full py-3 px-4 rounded-lg font-semibold transition-colors ${
              loading && selectedDifficulty === "moderate"
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-yellow-600 hover:bg-yellow-700 text-white"
            }`}
          >
            {loading && selectedDifficulty === "moderate" ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Generating Plan...
              </div>
            ) : (
              "Choose Moderate Plan"
            )}
          </button>
        </div>

        {/* Hard Plan */}
        <div className="bg-red-50 border-2 border-red-200 rounded-xl p-6 hover:shadow-lg transition-shadow">
          <div className="text-center mb-4">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">🔥</span>
            </div>
            <h3 className="text-xl font-bold text-red-800 mb-2">
              {difficultyOptions.hard.name}
            </h3>
            <p className="text-red-600 mb-4">
              {difficultyOptions.hard.description}
            </p>
          </div>

          <div className="space-y-3 mb-6">
            <div className="flex items-center">
              <span className="text-sm font-medium text-gray-600 w-20">
                Time:
              </span>
              <span className="text-sm text-gray-800">
                {difficultyOptions.hard.estimatedTime}
              </span>
            </div>
            <div className="flex items-center">
              <span className="text-sm font-medium text-gray-600 w-20">
                Intensity:
              </span>
              <div className="flex">
                {[...Array(10)].map((_, i) => (
                  <div
                    key={i}
                    className={`w-2 h-2 rounded-full mr-1 ${
                      i < difficultyOptions.hard.intensity
                        ? "bg-red-500"
                        : "bg-gray-300"
                    }`}
                  />
                ))}
              </div>
            </div>
            <div className="flex items-center">
              <span className="text-sm font-medium text-gray-600 w-20">
                Commitment:
              </span>
              <span className="text-sm text-gray-800">
                {difficultyOptions.hard.timeCommitment}
              </span>
            </div>
          </div>

          <div className="mb-6">
            <h4 className="font-semibold text-gray-800 mb-2">
              What you'll get:
            </h4>
            <ul className="text-sm text-gray-600 space-y-1">
              {difficultyOptions.hard.characteristics.map((char, index) => (
                <li key={index} className="flex items-center">
                  <span className="text-red-500 mr-2">✓</span>
                  {char}
                </li>
              ))}
            </ul>
          </div>

          <div className="mb-6">
            <h4 className="font-semibold text-gray-800 mb-2">
              Equipment needed:
            </h4>
            <div className="flex flex-wrap gap-2">
              {difficultyOptions.hard.equipmentNeeded.map(
                (equipment, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 bg-red-100 text-red-700 text-xs rounded"
                  >
                    {equipment}
                  </span>
                )
              )}
            </div>
          </div>

          <button
            onClick={() => handleDifficultySelect("hard")}
            disabled={loading && selectedDifficulty === "hard"}
            className={`w-full py-3 px-4 rounded-lg font-semibold transition-colors ${
              loading && selectedDifficulty === "hard"
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-red-600 hover:bg-red-700 text-white"
            }`}
          >
            {loading && selectedDifficulty === "hard" ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Generating Plan...
              </div>
            ) : (
              "Choose Hard Plan"
            )}
          </button>
        </div>
      </div>

      <div className="mt-8 text-center">
        <p className="text-sm text-gray-500">
          You can always adjust your difficulty level later based on your
          progress
        </p>
      </div>
    </div>
  );
};

export default DifficultySelection;
