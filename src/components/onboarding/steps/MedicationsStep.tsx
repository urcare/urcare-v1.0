import React from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';

interface MedicationsStepProps {
  takesMedications: string;
  medications: string[];
  onTakesMedicationsChange: (value: string) => void;
  onAddMedication: (medication: string) => void;
  onRemoveMedication: (medication: string) => void;
  error?: string;
}

export const MedicationsStep: React.FC<MedicationsStepProps> = ({
  takesMedications,
  medications,
  onTakesMedicationsChange,
  onAddMedication,
  onRemoveMedication,
  error
}) => {
  const [input, setInput] = React.useState('');
  
  return (
    <div className="space-y-4">
      {/* Yes/No Selection */}
      <div className="flex justify-center space-x-2">
        <button
          onClick={() => onTakesMedicationsChange('Yes')}
          className={`px-6 py-3 rounded-xl border-2 transition-all duration-200 ${
            takesMedications === 'Yes'
              ? 'border-gray-900 bg-gray-900 text-white'
              : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
          }`}
        >
          Yes
        </button>
        <button
          onClick={() => onTakesMedicationsChange('No')}
          className={`px-6 py-3 rounded-xl border-2 transition-all duration-200 ${
            takesMedications === 'No'
              ? 'border-gray-900 bg-gray-900 text-white'
              : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
          }`}
        >
          No
        </button>
      </div>

      {/* Medication Input */}
      {takesMedications === 'Yes' && (
        <div className="space-y-4">
          <div className="flex space-x-2">
            <Input
              type="text"
              placeholder="Add medication"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => {
                if (e.key === 'Enter' && input.trim()) {
                  onAddMedication(input.trim());
                  setInput('');
                }
              }}
              className="flex-1 p-4 rounded-2xl border-2 border-gray-200 focus:border-gray-900 focus:ring-0"
            />
            <Button
              onClick={() => {
                if (input.trim()) {
                  onAddMedication(input.trim());
                  setInput('');
                }
              }}
              className="px-6 py-4 rounded-2xl bg-gray-900 hover:bg-gray-800 text-white"
            >
              Add
            </Button>
          </div>

          {/* Medication List */}
          {medications.length > 0 && (
            <div className="space-y-2">
              {medications.map(med => (
                <div
                  key={med}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-xl"
                >
                  <span className="text-sm font-medium text-gray-700">{med}</span>
                  <button
                    onClick={() => onRemoveMedication(med)}
                    className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
      
      {error && (
        <div className="text-red-500 text-sm text-center mt-2">
          {error}
        </div>
      )}
    </div>
  );
}; 