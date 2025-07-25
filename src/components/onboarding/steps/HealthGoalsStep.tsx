import React from 'react';
import { Label } from '@/components/ui/label';

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
  <div>
    <Label>What are your main health goals?</Label>
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
      {healthGoals.map(goal => (
        <label key={goal} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <input
            type="checkbox"
            checked={selected.includes(goal)}
            onChange={() => onToggle(goal)}
          />
          {goal}
        </label>
      ))}
    </div>
    {error && <div style={{ color: 'red', marginTop: 4 }}>{error}</div>}
  </div>
); 