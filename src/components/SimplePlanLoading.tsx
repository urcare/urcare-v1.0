import React, { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";

interface SimplePlanLoadingProps {
  isGenerating: boolean;
  progress: number;
  error?: string;
  onComplete?: () => void;
}

export const SimplePlanLoading: React.FC<SimplePlanLoadingProps> = ({
  isGenerating,
  progress,
  error,
  onComplete,
}) => {
  const [displayProgress, setDisplayProgress] = useState(0);

  // Smooth progress animation
  useEffect(() => {
    if (!isGenerating) {
      setDisplayProgress(0);
      return;
    }

    const interval = setInterval(() => {
      setDisplayProgress((prev) => {
        const diff = progress - prev;
        if (Math.abs(diff) < 0.5) {
          return progress;
        }
        return prev + diff * 0.1; // Smooth animation
      });
    }, 50);

    return () => clearInterval(interval);
  }, [isGenerating, progress]);

  // Handle completion
  useEffect(() => {
    if (displayProgress >= 100 && isGenerating) {
      setTimeout(() => {
        onComplete?.();
      }, 500);
    }
  }, [displayProgress, isGenerating, onComplete]);

  if (!isGenerating && !error) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4 shadow-2xl">
        {error ? (
          <div className="text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-8 h-8 text-red-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Plan Generation Failed
            </h3>
            <p className="text-gray-600 mb-4">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        ) : (
          <div className="text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
            </div>
            
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Generating Your Health Plan
            </h3>
            
            <p className="text-gray-600 mb-6">
              Creating a personalized plan based on your goals and preferences...
            </p>

            {/* Progress Bar */}
            <div className="mb-4">
              <div className="flex justify-between text-sm text-gray-600 mb-2">
                <span>Progress</span>
                <span>{Math.round(displayProgress)}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className="bg-gradient-to-r from-blue-500 to-blue-600 h-3 rounded-full transition-all duration-300 ease-out"
                  style={{ width: `${displayProgress}%` }}
                />
              </div>
            </div>

            {/* Status Messages */}
            <div className="text-sm text-gray-500">
              {displayProgress < 20 && "Analyzing your profile..."}
              {displayProgress >= 20 && displayProgress < 40 && "Creating nutrition plan..."}
              {displayProgress >= 40 && displayProgress < 60 && "Building exercise routine..."}
              {displayProgress >= 60 && displayProgress < 80 && "Optimizing lifestyle factors..."}
              {displayProgress >= 80 && displayProgress < 100 && "Finalizing your plan..."}
              {displayProgress >= 100 && "Plan ready!"}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
