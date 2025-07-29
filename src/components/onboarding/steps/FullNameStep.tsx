import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface FullNameStepProps {
  value: string;
  onChange: (value: string) => void;
  error?: string;
}

export const FullNameStep: React.FC<FullNameStepProps> = ({ value, onChange, error }) => (
  <div className="w-full space-y-3">
    <Label htmlFor="fullName" className="text-base sm:text-lg font-medium text-gray-900">
      What's your full name?
    </Label>
    <Input
      id="fullName"
      type="text"
      value={value}
      onChange={e => onChange(e.target.value)}
      placeholder="Enter your full name"
      autoFocus
      className="w-full h-12 sm:h-14 text-base sm:text-lg px-4 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200"
    />
    {error && (
      <div className="text-red-500 text-sm mt-2 px-1">
        {error}
      </div>
    )}
  </div>
); 