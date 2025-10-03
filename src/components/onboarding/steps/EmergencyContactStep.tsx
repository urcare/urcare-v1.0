import React from 'react';
import { Input } from '@/components/ui/input';

interface EmergencyContactStepProps {
  name: string;
  phone: string;
  onChange: (field: 'emergencyContactName' | 'emergencyContactPhone', value: string) => void;
  error?: string;
}

export const EmergencyContactStep: React.FC<EmergencyContactStepProps> = ({ name, phone, onChange, error }) => (
  <div className="space-y-4">
    <div className="space-y-3">
      <div>
        <label className="text-sm font-medium text-gray-600 mb-2 block">Contact Name</label>
        <Input
          type="text"
          placeholder="Enter contact name"
          value={name}
          onChange={e => onChange('emergencyContactName', e.target.value)}
          className="w-full p-4 rounded-2xl border-2 border-gray-200 focus:border-gray-900 focus:ring-0"
        />
      </div>
      
      <div>
        <label className="text-sm font-medium text-gray-600 mb-2 block">Phone Number</label>
        <Input
          type="tel"
          placeholder="Enter phone number"
          value={phone}
          onChange={e => onChange('emergencyContactPhone', e.target.value)}
          className="w-full p-4 rounded-2xl border-2 border-gray-200 focus:border-gray-900 focus:ring-0"
        />
      </div>
    </div>
    
    {error && (
      <div className="text-red-500 text-sm text-center mt-2">
        {error}
      </div>
    )}
  </div>
); 