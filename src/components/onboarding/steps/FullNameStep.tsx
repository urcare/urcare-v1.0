import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface FullNameStepProps {
  value: string;
  onChange: (value: string) => void;
  error?: string;
}

export const FullNameStep: React.FC<FullNameStepProps> = ({ value, onChange, error }) => (
  <div>
    <Label htmlFor="fullName">What's your full name?</Label>
    <Input
      id="fullName"
      type="text"
      value={value}
      onChange={e => onChange(e.target.value)}
      placeholder="Enter your full name"
      autoFocus
    />
    {error && <div style={{ color: 'red', marginTop: 4 }}>{error}</div>}
  </div>
); 