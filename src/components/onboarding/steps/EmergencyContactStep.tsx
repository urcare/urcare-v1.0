import React from 'react';
import { Label } from '@/components/ui/label';

interface EmergencyContactStepProps {
  name: string;
  phone: string;
  onChange: (field: 'emergencyContactName' | 'emergencyContactPhone', value: string) => void;
  error?: string;
}

export const EmergencyContactStep: React.FC<EmergencyContactStepProps> = ({ name, phone, onChange, error }) => (
  <div>
    <Label>Emergency Contact Person</Label>
    <div style={{ display: 'flex', gap: 8 }}>
      <input
        type="text"
        placeholder="Name"
        value={name}
        onChange={e => onChange('emergencyContactName', e.target.value)}
      />
      <input
        type="tel"
        placeholder="Phone"
        value={phone}
        onChange={e => onChange('emergencyContactPhone', e.target.value)}
      />
    </div>
    {error && <div style={{ color: 'red', marginTop: 4 }}>{error}</div>}
  </div>
); 