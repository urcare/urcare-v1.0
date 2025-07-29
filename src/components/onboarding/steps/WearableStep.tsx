import React from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { X, Watch, Smartphone } from 'lucide-react';

interface WearableStepProps {
  usesWearable: string;
  wearableType: string;
  onUsesWearableChange: (value: string) => void;
  onWearableTypeChange: (value: string) => void;
  error?: string;
}

export const WearableStep: React.FC<WearableStepProps> = ({ 
  usesWearable, 
  wearableType, 
  onUsesWearableChange, 
  onWearableTypeChange, 
  error 
}) => {
  const [input, setInput] = React.useState('');
  const [wearableTypes, setWearableTypes] = React.useState<string[]>([]);

  const addWearableType = () => {
    if (input.trim() && !wearableTypes.includes(input.trim())) {
      const newTypes = [...wearableTypes, input.trim()];
      setWearableTypes(newTypes);
      onWearableTypeChange(newTypes.join(', '));
      setInput('');
    }
  };

  const removeWearableType = (typeToRemove: string) => {
    const newTypes = wearableTypes.filter(type => type !== typeToRemove);
    setWearableTypes(newTypes);
    onWearableTypeChange(newTypes.join(', '));
  };

  return (
    <div className="w-full space-y-6">
      <div className="flex justify-center">
        <div className="w-full max-w-md">
          {/* Yes/No Selection */}
          <div className="flex justify-center space-x-4 mb-6">
            <button
              onClick={() => onUsesWearableChange('Yes')}
              className={`px-8 py-4 rounded-2xl border-2 transition-all duration-200 flex items-center gap-3 ${
                usesWearable === 'Yes'
                  ? 'border-blue-500 bg-blue-500 text-white shadow-lg scale-105'
                  : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300 hover:bg-gray-50'
              }`}
            >
              <Watch className="w-6 h-6" />
              <span className="font-semibold">Yes</span>
            </button>
            <button
              onClick={() => onUsesWearableChange('No')}
              className={`px-8 py-4 rounded-2xl border-2 transition-all duration-200 flex items-center gap-3 ${
                usesWearable === 'No'
                  ? 'border-blue-500 bg-blue-500 text-white shadow-lg scale-105'
                  : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300 hover:bg-gray-50'
              }`}
            >
              <Smartphone className="w-6 h-6" />
              <span className="font-semibold">No</span>
            </button>
          </div>

          {/* Wearable Types Input */}
          {usesWearable === 'Yes' && (
            <div className="space-y-4">
              <div className="text-center mb-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">What type of wearable do you use?</h3>
                <p className="text-sm text-gray-600">Add your devices (e.g., Apple Watch, Fitbit, Samsung Galaxy Watch)</p>
              </div>
              
              <div className="flex space-x-2">
                <Input
                  type="text"
                  placeholder="Type of wearable"
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={e => {
                    if (e.key === 'Enter' && input.trim()) {
                      addWearableType();
                    }
                  }}
                  className="flex-1 p-4 rounded-2xl border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                />
                <Button
                  onClick={addWearableType}
                  className="px-6 py-4 rounded-2xl bg-blue-500 hover:bg-blue-600 text-white"
                >
                  Add
                </Button>
              </div>

              {/* Wearable Types List */}
              {wearableTypes.length > 0 && (
                <div className="space-y-2">
                  {wearableTypes.map(type => (
                    <div
                      key={type}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-xl"
                    >
                      <span className="text-sm font-medium text-gray-700">{type}</span>
                      <button
                        onClick={() => removeWearableType(type)}
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
        </div>
      </div>
      
      {error && (
        <div className="text-red-500 text-sm text-center mt-3">
          {error}
        </div>
      )}
    </div>
  );
}; 