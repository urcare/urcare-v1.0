import React from 'react';
import { Input } from '@/components/ui/input';

interface ReferralCodeStepProps {
  value: string;
  onChange: (value: string) => void;
  error?: string;
}

export const ReferralCodeStep: React.FC<ReferralCodeStepProps> = ({ value, onChange, error }) => (
  <div className="space-y-4">
    <div>
      <label className="text-sm font-medium text-gray-600 mb-2 block">Enter referral code (optional)</label>
      <Input
        type="text"
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder="Enter referral code"
        className="w-full p-4 rounded-2xl border-2 border-gray-200 focus:border-gray-900 focus:ring-0"
      />
    </div>
    
    {error && (
      <div className="text-red-500 text-sm text-center mt-2">
        {error}
      </div>
    )}
  </div>
); 