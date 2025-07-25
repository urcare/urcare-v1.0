import React from 'react';
import { Label } from '@/components/ui/label';

interface TrackFamilyStepProps {
  value: string;
  onChange: (value: string) => void;
  error?: string;
}

export const TrackFamilyStep: React.FC<TrackFamilyStepProps> = ({ value, onChange, error }) => (
  <div>
    <Label>Do you want to track family members' health too?</Label>
    <div>
      <label>
        <input
          type="radio"
          name="trackFamily"
          value="Yes"
          checked={value === 'Yes'}
          onChange={() => onChange('Yes')}
        />
        Yes
      </label>
      <label style={{ marginLeft: 16 }}>
        <input
          type="radio"
          name="trackFamily"
          value="No"
          checked={value === 'No'}
          onChange={() => onChange('No')}
        />
        No
      </label>
    </div>
    {error && <div style={{ color: 'red', marginTop: 4 }}>{error}</div>}
  </div>
); 