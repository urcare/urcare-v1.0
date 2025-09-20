import { useCallback, useState } from "react";
import {
  ProgressCallback,
  healthPlanServiceWithProgress,
} from "../services/healthPlanServiceWithProgress";

interface GenerationProgress {
  isGenerating: boolean;
  progress: number;
  currentStep: string;
  status: "idle" | "generating" | "completed" | "error";
  error?: string;
}

interface UseHealthPlanGenerationReturn {
  progress: GenerationProgress;
  generatePlan: () => Promise<void>;
  reset: () => void;
}

export const useHealthPlanGeneration = (): UseHealthPlanGenerationReturn => {
  const [progress, setProgress] = useState<GenerationProgress>({
    isGenerating: false,
    progress: 0,
    currentStep: "analyzing",
    status: "idle",
  });

  const updateProgress = useCallback((updates: Partial<GenerationProgress>) => {
    setProgress((prev) => ({ ...prev, ...updates }));
  }, []);

  // Removed simulateProgress - now using real progress from service

  const generatePlan = useCallback(async () => {
    try {
      updateProgress({
        isGenerating: true,
        progress: 0,
        currentStep: "analyzing",
        status: "generating",
        error: undefined,
      });

      // Set up progress callback
      const progressCallback: ProgressCallback = (
        step,
        progressValue,
        message
      ) => {
        updateProgress({
          currentStep: step,
          progress: progressValue,
        });
      };

      healthPlanServiceWithProgress.setProgressCallback(progressCallback);

      // Generate the actual plan
      const plan = await healthPlanServiceWithProgress.generateHealthPlan();

      // Complete the generation
      updateProgress({
        isGenerating: false,
        progress: 100,
        currentStep: "finalizing",
        status: "completed",
      });

      return plan;
    } catch (error) {
      updateProgress({
        isGenerating: false,
        status: "error",
        error:
          error instanceof Error
            ? error.message
            : "Failed to generate health plan",
      });
      throw error;
    }
  }, [updateProgress]);

  const reset = useCallback(() => {
    setProgress({
      isGenerating: false,
      progress: 0,
      currentStep: "analyzing",
      status: "idle",
    });
  }, []);

  return {
    progress,
    generatePlan,
    reset,
  };
};
