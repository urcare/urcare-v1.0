import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface FullNameStepProps {
  value: string;
  onChange: (value: string) => void;
  error?: string;
}

export const FullNameStep: React.FC<FullNameStepProps> = ({ value, onChange, error }) => (
  <div className="w-full space-y-6">
    <div className="text-center mb-8">
      <Label htmlFor="fullName" className="text-lg sm:text-xl font-medium text-gray-700 mb-4 block">
        What's your full name?
      </Label>
    </div>
    
    <div className="flex justify-center">
      <div className="w-full max-w-sm">
        <Input
          id="fullName"
          type="text"
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder="Enter your full name"
          autoFocus
          className="w-full h-16 sm:h-18 text-lg sm:text-xl px-6 rounded-2xl border-2 border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 transition-all duration-200 text-center font-medium"
        />
        {error && (
          <div className="text-red-500 text-sm mt-3 text-center">
            {error}
          </div>
        )}
      </div>
    </div>
  </div>
); 