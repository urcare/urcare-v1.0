import React from 'react';

interface BloodGroupStepProps {
  value: string;
  onChange: (value: string) => void;
  error?: string;
}

const bloodGroups = [
  'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'
];

export const BloodGroupStep: React.FC<BloodGroupStepProps> = ({ value, onChange, error }) => (
  <div className="space-y-4">
    <div className="grid grid-cols-4 gap-3">
      {bloodGroups.map(bloodGroup => (
        <button
          key={bloodGroup}
          onClick={() => onChange(bloodGroup)}
          className={`p-4 rounded-2xl border-2 transition-all duration-200 text-center ${
            value === bloodGroup
              ? 'border-gray-900 bg-gray-900 text-white shadow-lg scale-105'
              : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300 hover:bg-gray-50'
          }`}
        >
          <span className="font-medium text-sm">{bloodGroup}</span>
        </button>
      ))}
    </div>
    
    {error && (
      <div className="text-red-500 text-sm text-center mt-2">
        {error}
      </div>
    )}
  </div>
); 