import React from 'react';
import { Label } from '@/components/ui/label';

interface RoutineFlexibilityStepProps {
  value: string;
  onChange: (value: string) => void;
  error?: string;
}

export const RoutineFlexibilityStep: React.FC<RoutineFlexibilityStepProps> = ({ value, onChange, error }) => (
  <div>
    <Label>Daily Routine Flexibility</Label>
    <input
      type="range"
      min="1"
      max="10"
      value={value}
      onChange={e => onChange(e.target.value)}
      style={{ width: 200 }}
    />
    <div>Flexibility: {value}</div>
    {error && <div style={{ color: 'red', marginTop: 4 }}>{error}</div>}
  </div>
); 