import { Droplets } from "lucide-react";
import React from "react";

interface BloodGroupStepProps {
  value: string;
  onChange: (value: string) => void;
  error?: string;
}

const bloodGroups = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

export const BloodGroupStep: React.FC<BloodGroupStepProps> = ({
  value,
  onChange,
  error,
}) => (
  <div className="w-full space-y-6">
    <div className="flex justify-center">
      <div className="w-full max-w-md">
        <div className="grid grid-cols-4 gap-3">
          {bloodGroups.map((bloodGroup) => (
            <button
              key={bloodGroup}
              onClick={() => onChange(bloodGroup)}
              className={`p-4 rounded-2xl border-2 transition-all duration-200 text-center font-medium flex flex-col items-center gap-2 ${
                value === bloodGroup
                  ? "border-red-500 bg-red-500 text-white shadow-lg scale-105"
                  : "border-gray-200 bg-white text-gray-700 hover:border-primary/30 hover:bg-primary/5"
              }`}
            >
              <Droplets
                className={`w-6 h-6 ${
                  value === bloodGroup ? "text-white" : "text-red-500"
                }`}
              />
              <span className="text-lg font-bold">{bloodGroup}</span>
            </button>
          ))}
        </div>
      </div>
    </div>

    {error && (
      <div className="text-red-500 text-sm text-center mt-3">{error}</div>
    )}
  </div>
);
