import React from 'react';

interface GenderStepProps {
  value: string;
  onChange: (value: string) => void;
  error?: string;
}

const genderOptions = [
  'Male',
  'Female',
  'Other',
  'Prefer not to say',
];

export const GenderStep: React.FC<GenderStepProps> = ({ value, onChange, error }) => (
  <div className="space-y-4">
    <div className="grid grid-cols-2 gap-3">
      {genderOptions.map(option => (
        <button
          key={option}
          onClick={() => onChange(option)}
          className={`p-4 rounded-2xl border-2 transition-all duration-200 text-center ${
            value === option
              ? 'border-gray-900 bg-gray-900 text-white shadow-lg scale-105'
              : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300 hover:bg-gray-50'
          }`}
        >
          <span className="font-medium text-sm">{option}</span>
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