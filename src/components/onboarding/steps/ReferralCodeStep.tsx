import React from 'react';
import { Label } from '@/components/ui/label';

interface ReferralCodeStepProps {
  value: string;
  onChange: (value: string) => void;
  error?: string;
}

export const ReferralCodeStep: React.FC<ReferralCodeStepProps> = ({ value, onChange, error }) => (
  <div>
    <Label>Enter referral code (optional)</Label>
    <input
      type="text"
      value={value}
      onChange={e => onChange(e.target.value)}
      placeholder="Referral code"
    />
    {error && <div style={{ color: 'red', marginTop: 4 }}>{error}</div>}
  </div>
); 