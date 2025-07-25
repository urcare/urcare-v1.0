import React from 'react';
import { Label } from '@/components/ui/label';

interface CriticalConditionsStepProps {
  value: string;
  onChange: (value: string) => void;
  error?: string;
}

export const CriticalConditionsStep: React.FC<CriticalConditionsStepProps> = ({ value, onChange, error }) => (
  <div>
    <Label>Known allergies or critical conditions</Label>
    <textarea
      value={value}
      onChange={e => onChange(e.target.value)}
      placeholder="List any allergies or critical conditions"
      rows={3}
      style={{ width: '100%' }}
    />
    {error && <div style={{ color: 'red', marginTop: 4 }}>{error}</div>}
  </div>
); 