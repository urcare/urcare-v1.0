import React from 'react';

interface CriticalConditionsStepProps {
  value: string;
  onChange: (value: string) => void;
  error?: string;
}

export const CriticalConditionsStep: React.FC<CriticalConditionsStepProps> = ({ value, onChange, error }) => (
  <div className="space-y-4">
    <div>
      <label className="text-sm font-medium text-gray-600 mb-2 block">Known allergies or critical conditions</label>
      <textarea
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder="List any allergies or critical conditions"
        rows={4}
        className="w-full p-4 rounded-2xl border-2 border-gray-200 focus:border-gray-900 focus:ring-0 resize-none"
      />
    </div>
    
    {error && (
      <div className="text-red-500 text-sm text-center mt-2">
        {error}
      </div>
    )}
  </div>
); 