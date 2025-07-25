import React from 'react';
import { Label } from '@/components/ui/label';

interface ChronicConditionsStepProps {
  selected: string[];
  onToggle: (condition: string) => void;
  error?: string;
}

const chronicConditions = [
  'Diabetes',
  'Hypertension (High Blood Pressure)',
  'Heart Disease',
  'Asthma',
  'Arthritis',
  'Depression/Anxiety',
  'High Cholesterol',
  'Obesity',
  'COPD',
  'Cancer',
  'Kidney Disease',
  'Thyroid Disorders',
  'Allergies',
  'Migraines',
  'None of the above'
];

export const ChronicConditionsStep: React.FC<ChronicConditionsStepProps> = ({ selected, onToggle, error }) => (
  <div>
    <Label>Do you have any chronic conditions?</Label>
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
      {chronicConditions.map(condition => (
        <label key={condition} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <input
            type="checkbox"
            checked={selected.includes(condition)}
            onChange={() => onToggle(condition)}
          />
          {condition}
        </label>
      ))}
    </div>
    {error && <div style={{ color: 'red', marginTop: 4 }}>{error}</div>}
  </div>
); 