import React from 'react';
import { Label } from '@/components/ui/label';

interface DietTypeStepProps {
  value: string;
  onChange: (value: string) => void;
  error?: string;
}

const dietTypes = [
  'Balanced',
  'Vegetarian',
  'Vegan',
  'Keto',
  'Paleo',
  'Low Carb',
  'High Protein',
  'Other'
];

export const DietTypeStep: React.FC<DietTypeStepProps> = ({ value, onChange, error }) => (
  <div>
    <Label>Diet Type</Label>
    <div style={{ display: 'flex', gap: 16 }}>
      {dietTypes.map(type => (
        <label key={type} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <input
            type="radio"
            name="dietType"
            value={type}
            checked={value === type}
            onChange={() => onChange(type)}
          />
          {type}
        </label>
      ))}
    </div>
    {error && <div style={{ color: 'red', marginTop: 4 }}>{error}</div>}
  </div>
); 