import React from 'react';
import { Label } from '@/components/ui/label';

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
  <div>
    <Label>What's your gender?</Label>
    <div style={{ display: 'flex', gap: 16 }}>
      {genderOptions.map(option => (
        <label key={option} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <input
            type="radio"
            name="gender"
            value={option}
            checked={value === option}
            onChange={() => onChange(option)}
          />
          {option}
        </label>
      ))}
    </div>
    {error && <div style={{ color: 'red', marginTop: 4 }}>{error}</div>}
  </div>
); 