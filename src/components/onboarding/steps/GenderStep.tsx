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
  <div className="w-full space-y-6">
    <div className="flex justify-center">
      <div className="w-full max-w-sm">
        <div className="grid grid-cols-2 gap-4">
          {genderOptions.map(option => (
            <button
              key={option}
              onClick={() => onChange(option)}
              className={`p-6 rounded-2xl border-2 transition-all duration-200 text-center font-medium ${
                value === option
                  ? 'border-blue-500 bg-blue-500 text-white shadow-lg scale-105'
                  : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300 hover:bg-gray-50'
              }`}
            >
              <span className="text-base font-semibold">{option}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
    
    {error && (
      <div className="text-red-500 text-sm text-center mt-3">
        {error}
      </div>
    )}
  </div>
); 