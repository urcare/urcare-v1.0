import { Lock, Share2 } from "lucide-react";
import React from "react";

interface ShareProgressStepProps {
  value: string;
  onChange: (value: string) => void;
  error?: string;
}

export const ShareProgressStep: React.FC<ShareProgressStepProps> = ({
  value,
  onChange,
  error,
}) => (
  <div className="w-full space-y-6">
    <div className="flex justify-center">
      <div className="w-full max-w-md">
        <div className="text-center mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Health Progress Sharing
          </h3>
          <p className="text-sm text-gray-600">
            Would you like to share your health progress with family?
          </p>
        </div>

        <div className="flex justify-center space-x-4">
          <button
            onClick={() => onChange("Yes")}
            className={`px-8 py-4 rounded-2xl border-2 transition-all duration-200 flex items-center gap-3 ${
              value === "Yes"
                ? "border-primary bg-primary text-white shadow-lg scale-105"
                : "border-gray-200 bg-white text-gray-700 hover:border-primary/30 hover:bg-primary/5"
            }`}
          >
            <Share2 className="w-6 h-6" />
            <span className="font-semibold">Yes</span>
          </button>
          <button
            onClick={() => onChange("No")}
            className={`px-8 py-4 rounded-2xl border-2 transition-all duration-200 flex items-center gap-3 ${
              value === "No"
                ? "border-primary bg-primary text-white shadow-lg scale-105"
                : "border-gray-200 bg-white text-gray-700 hover:border-primary/30 hover:bg-primary/5"
            }`}
          >
            <Lock className="w-6 h-6" />
            <span className="font-semibold">No</span>
          </button>
        </div>
      </div>
    </div>

    {error && (
      <div className="text-red-500 text-sm text-center mt-3">{error}</div>
    )}
  </div>
);
