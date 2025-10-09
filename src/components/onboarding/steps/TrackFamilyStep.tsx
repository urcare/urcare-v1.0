import { UserX, Users } from "lucide-react";
import React from "react";

interface TrackFamilyStepProps {
  value: string;
  onChange: (value: string) => void;
  error?: string;
}

export const TrackFamilyStep: React.FC<TrackFamilyStepProps> = ({
  value,
  onChange,
  error,
}) => (
  <div className="w-full space-y-6">
    <div className="flex justify-center">
      <div className="w-full max-w-md">
        <div className="text-center mb-6">
          <p className="text-sm text-gray-600">
            Would you like to track family members' health too?
          </p>
        </div>

        <div className="flex justify-center space-x-4">
          <button
            onClick={() => onChange("Yes")}
                className={`px-8 py-4 rounded-2xl border-2 transition-all duration-200 flex items-center gap-3 ${
                  value === "Yes"
                    ? "text-white shadow-lg scale-105"
                    : "border-gray-200 bg-white text-gray-700 hover:border-gray-300 hover:bg-gray-50"
                }`}
                style={value === "Yes" ? { 
                  borderColor: '#008000', 
                  backgroundColor: '#008000' 
                } : {}}
          >
            <Users className="w-6 h-6" />
            <span className="font-semibold">Yes</span>
          </button>
          <button
            onClick={() => onChange("No")}
                className={`px-8 py-4 rounded-2xl border-2 transition-all duration-200 flex items-center gap-3 ${
                  value === "No"
                    ? "text-white shadow-lg scale-105"
                    : "border-gray-200 bg-white text-gray-700 hover:border-gray-300 hover:bg-gray-50"
                }`}
                style={value === "No" ? { 
                  borderColor: '#008000', 
                  backgroundColor: '#008000' 
                } : {}}
          >
            <UserX className="w-6 h-6" />
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
