import React from "react";
import { useHealthPlanGeneration } from "../hooks/useHealthPlanGeneration";
import { HealthPlanProgress } from "./HealthPlanProgress";

export const HealthPlanProgressDemo: React.FC = () => {
  const { progress, generatePlan, reset } = useHealthPlanGeneration();

  const handleStartGeneration = async () => {
    try {
      await generatePlan();
      console.log("Plan generation completed!");
    } catch (error) {
      console.error("Plan generation failed:", error);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Health Plan Generation Progress Demo
        </h1>
        <p className="text-gray-600 mb-6">
          Test the enhanced progress tracking system for health plan generation
        </p>

        <div className="flex gap-4 justify-center">
          <button
            onClick={handleStartGeneration}
            disabled={progress.isGenerating}
            className={`px-6 py-3 rounded-lg font-medium transition-colors ${
              progress.isGenerating
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-blue-600 text-white hover:bg-blue-700"
            }`}
          >
            {progress.isGenerating ? "Generating..." : "Start Plan Generation"}
          </button>

          <button
            onClick={reset}
            disabled={progress.isGenerating}
            className={`px-6 py-3 rounded-lg font-medium transition-colors ${
              progress.isGenerating
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-gray-600 text-white hover:bg-gray-700"
            }`}
          >
            Reset
          </button>
        </div>
      </div>

      {/* Progress Display */}
      <HealthPlanProgress
        isGenerating={progress.isGenerating}
        currentStep={progress.currentStep}
        error={progress.error}
        onComplete={() => {
          console.log("Generation completed!");
        }}
      />

      {/* Debug Info */}
      <div className="bg-gray-100 rounded-lg p-4">
        <h3 className="font-medium text-gray-900 mb-2">Debug Information:</h3>
        <div className="text-sm text-gray-600 space-y-1">
          <p>
            <strong>Status:</strong> {progress.status}
          </p>
          <p>
            <strong>Current Step:</strong> {progress.currentStep}
          </p>
          <p>
            <strong>Progress:</strong> {Math.round(progress.progress)}%
          </p>
          <p>
            <strong>Is Generating:</strong>{" "}
            {progress.isGenerating ? "Yes" : "No"}
          </p>
          {progress.error && (
            <p>
              <strong>Error:</strong> {progress.error}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
