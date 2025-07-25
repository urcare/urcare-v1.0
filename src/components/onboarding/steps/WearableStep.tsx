import React from 'react';
import { Label } from '@/components/ui/label';

interface WearableStepProps {
  usesWearable: string;
  wearableType: string;
  onUsesWearableChange: (value: string) => void;
  onWearableTypeChange: (value: string) => void;
  error?: string;
}

export const WearableStep: React.FC<WearableStepProps> = ({ usesWearable, wearableType, onUsesWearableChange, onWearableTypeChange, error }) => (
  <div>
    <Label>Do you use a smartwatch/fitness band?</Label>
    <div style={{ marginBottom: 8 }}>
      <label>
        <input
          type="radio"
          name="usesWearable"
          value="Yes"
          checked={usesWearable === 'Yes'}
          onChange={() => onUsesWearableChange('Yes')}
        />
        Yes
      </label>
      <label style={{ marginLeft: 16 }}>
        <input
          type="radio"
          name="usesWearable"
          value="No"
          checked={usesWearable === 'No'}
          onChange={() => onUsesWearableChange('No')}
        />
        No
      </label>
    </div>
    {usesWearable === 'Yes' && (
      <input
        type="text"
        placeholder="Type of wearable (e.g. Fitbit, Apple Watch)"
        value={wearableType}
        onChange={e => onWearableTypeChange(e.target.value)}
      />
    )}
    {error && <div style={{ color: 'red', marginTop: 4 }}>{error}</div>}
  </div>
); 