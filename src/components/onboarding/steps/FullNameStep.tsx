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
    
    
        {error && (
          <div className="text-red-500 text-sm mt-3 text-center">
            {error}
          </div>
        )}
      </div>
    
); 