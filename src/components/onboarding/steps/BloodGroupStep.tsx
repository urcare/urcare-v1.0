import React from 'react';
import { Label } from '@/components/ui/label';

interface BloodGroupStepProps {
  value: string;
  onChange: (value: string) => void;
  error?: string;
}

const bloodGroups = [
  '', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'
];

export const BloodGroupStep: React.FC<BloodGroupStepProps> = ({ value, onChange, error }) => (
  <div>
    <Label>Blood Group</Label>
    <select value={value} onChange={e => onChange(e.target.value)}>
      {bloodGroups.map(bg => (
        <option key={bg} value={bg}>{bg || 'Select'}</option>
      ))}
    </select>
    {error && <div style={{ color: 'red', marginTop: 4 }}>{error}</div>}
  </div>
); 