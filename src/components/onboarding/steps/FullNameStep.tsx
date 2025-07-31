import React from 'react';
import { Input } from '@/components/ui/input';

interface FullNameStepProps {
  value: string;
  onChange: (value: string) => void;
  error?: string;
}

export const FullNameStep: React.FC<FullNameStepProps> = ({ value, onChange, error }) => (
  <div className="w-full space-y-6">
    <div className="space-y-4">
      <Input
        type="text"
        id="fullName"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Enter your full name"
        className="w-full p-4 rounded-2xl border-2 border-gray-200 focus:border-gray-900 focus:ring-0 text-lg"
        autoFocus
      />
      
      {error && (
        <div className="text-red-500 text-sm text-center">
          {error}
        </div>
      )}
    </div>
  </div>
); 