import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { X } from "lucide-react";
import React from "react";

interface SurgeryStepProps {
  hasSurgery: string;
  surgeryDetails: string[];
  onHasSurgeryChange: (value: string) => void;
  onAddSurgeryDetail: (detail: string) => void;
  onRemoveSurgeryDetail: (detail: string) => void;
  error?: string;
}

export const SurgeryStep: React.FC<SurgeryStepProps> = ({
  hasSurgery,
  surgeryDetails,
  onHasSurgeryChange,
  onAddSurgeryDetail,
  onRemoveSurgeryDetail,
  error,
}) => {
  const [input, setInput] = React.useState("");

  return (
    <div className="space-y-4">
      {/* Yes/No Selection */}
      <div className="flex justify-center space-x-2">
        <button
          onClick={() => onHasSurgeryChange("Yes")}
          className={`px-6 py-3 rounded-xl border-2 transition-all duration-200 ${
            hasSurgery === "Yes"
              ? "text-white"
              : "border-gray-200 bg-white text-gray-700 hover:border-gray-300 hover:bg-gray-50"
          }`}
          style={hasSurgery === "Yes" ? { 
            borderColor: '#008000', 
            backgroundColor: '#008000' 
          } : {}}
        >
          Yes
        </button>
        <button
          onClick={() => onHasSurgeryChange("No")}
          className={`px-6 py-3 rounded-xl border-2 transition-all duration-200 ${
            hasSurgery === "No"
              ? "text-white"
              : "border-gray-200 bg-white text-gray-700 hover:border-gray-300 hover:bg-gray-50"
          }`}
          style={hasSurgery === "No" ? { 
            borderColor: '#008000', 
            backgroundColor: '#008000' 
          } : {}}
        >
          No
        </button>
      </div>

      {/* Surgery Details Input */}
      {hasSurgery === "Yes" && (
        <div className="space-y-4">
          <div className="flex space-x-2">
            <Input
              type="text"
              placeholder="Add surgery detail"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && input.trim()) {
                  onAddSurgeryDetail(input.trim());
                  setInput("");
                }
              }}
              className="flex-1 p-4 rounded-2xl border-2 border-gray-200 focus:border-gray-900 focus:ring-0"
            />
            <Button
              onClick={() => {
                if (input.trim()) {
                  onAddSurgeryDetail(input.trim());
                  setInput("");
                }
              }}
              className="px-6 py-4 rounded-2xl bg-gray-900 hover:bg-gray-800 text-white"
            >
              Add
            </Button>
          </div>

          {/* Surgery Details List */}
          {surgeryDetails.length > 0 && (
            <div className="space-y-2">
              {surgeryDetails.map((detail) => (
                <div
                  key={detail}
                  className="flex items-center justify-between p-3 bg-emerald-50 rounded-xl"
                >
                  <span className="text-sm font-medium text-gray-700">
                    {detail}
                  </span>
                  <button
                    onClick={() => onRemoveSurgeryDetail(detail)}
                    className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {error && (
        <div className="text-red-500 text-sm text-center mt-2">{error}</div>
      )}
    </div>
  );
};
