import { CheckCircle } from "lucide-react";
import React from "react";

interface CompletionStepProps {
  onContinue: () => void;
}

export const CompletionStep: React.FC<CompletionStepProps> = ({
  onContinue,
}) => {
  return (
    <div className="space-y-8 text-center">
      {/* Circular graphic with tick mark */}
      <div className="flex justify-center">
        <div className="relative">
          {/* Gradient border circle */}
          <div className="w-48 h-48 rounded-full bg-gradient-to-r from-pink-200 to-blue-200 p-1">
            <div className="w-full h-full rounded-full bg-white flex items-center justify-center">
              {/* Large tick mark */}
              <CheckCircle className="w-20 h-20 text-primary" />
            </div>
          </div>
        </div>
      </div>

      {/* "All done!" message */}
      <div className="flex items-center justify-center gap-2">
        <span className="text-gray-700 font-medium">All done!</span>
      </div>

      {/* Main message */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Time to generate your custom plan!
        </h2>
        <p className="text-gray-600 text-sm">
          We'll create a personalized health plan based on your information
        </p>
      </div>

      {/* Continue button */}
      <div className="pt-4">
        <button
          onClick={() => {
            console.log("CompletionStep: Continue to Health Assessment clicked");
            onContinue();
          }}
          className="w-full bg-primary text-white py-4 px-6 rounded-2xl font-medium hover:bg-primary/90 transition-colors"
        >
          Continue to Health Assessment
        </button>
      </div>
    </div>
  );
};
