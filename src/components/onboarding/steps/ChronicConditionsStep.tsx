import React from "react";

interface ChronicConditionsStepProps {
  selected: string[];
  onToggle: (condition: string) => void;
  error?: string;
}

const chronicConditions = [
  "Diabetes",
  "Hypertension (High Blood Pressure)",
  "Heart Disease",
  "Asthma",
  "Arthritis",
  "Depression/Anxiety",
  "High Cholesterol",
  "Obesity",
  "COPD",
  "Cancer",
  "Kidney Disease",
  "Thyroid Disorders",
  "Allergies",
  "Migraines",
  "None of the above",
];

export const ChronicConditionsStep: React.FC<ChronicConditionsStepProps> = ({
  selected,
  onToggle,
  error,
}) => (
  <div className="space-y-4">
    <div className="grid grid-cols-1 gap-3">
      {chronicConditions.map((condition) => (
        <button
          key={condition}
          onClick={() => onToggle(condition)}
          className={`p-4 rounded-2xl border-2 transition-all duration-200 text-left ${
            selected.includes(condition)
              ? "border-gray-900 bg-gray-900 text-white shadow-lg scale-105"
              : "border-gray-200 bg-white text-gray-700 hover:border-primary/30 hover:bg-primary/5"
          }`}
        >
          <span className="font-medium text-sm">{condition}</span>
        </button>
      ))}
    </div>

    {error && (
      <div className="text-red-500 text-sm text-center mt-2">{error}</div>
    )}
  </div>
);
