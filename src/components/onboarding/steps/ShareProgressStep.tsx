import React from 'react';
import { Label } from '@/components/ui/label';

interface ShareProgressStepProps {
  value: string;
  onChange: (value: string) => void;
  error?: string;
}

export const ShareProgressStep: React.FC<ShareProgressStepProps> = ({ value, onChange, error }) => (
  <div>
    <Label>Would you like to share your health progress with family?</Label>
    <div>
      <label>
        <input
          type="radio"
          name="shareProgress"
          value="Yes"
          checked={value === 'Yes'}
          onChange={() => onChange('Yes')}
        />
        Yes
      </label>
      <label style={{ marginLeft: 16 }}>
        <input
          type="radio"
          name="shareProgress"
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