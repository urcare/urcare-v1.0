import React from 'react';

interface HealthGoalsStepProps {
  selected: string[];
  onToggle: (goal: string) => void;
  error?: string;
}

const healthGoals = [
  'Lose Weight',
  'Gain Muscle',
  'Improve Sleep',
  'Reduce Stress',
  'Increase Energy',
  'Improve Nutrition',
  'Manage Chronic Condition',
  'Increase Activity',
  'Other'
];

export const HealthGoalsStep: React.FC<HealthGoalsStepProps> = ({ selected, onToggle, error }) => (
  <div className="space-y-4">
    <div className="grid grid-cols-1 gap-3">
      {healthGoals.map(goal => (
        <button
          key={goal}
          onClick={() => onToggle(goal)}
          className={`p-4 rounded-2xl border-2 transition-all duration-200 text-left ${
            selected.includes(goal)
              ? 'border-gray-900 bg-gray-900 text-white shadow-lg scale-105'
              : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300 hover:bg-gray-50'
          }`}
        >
          <span className="font-medium text-sm">{goal}</span>
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