
import React, { useState } from 'react';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Moon, Zap, Smile, Frown, Meh } from 'lucide-react';

interface LifestyleInsightsProps {
  onDataChange: (data: any) => void;
}

const sleepQualityOptions = [
  { value: 'very-poor', label: 'Very Poor', icon: Frown, color: 'text-red-500' },
  { value: 'poor', label: 'Poor', icon: Frown, color: 'text-red-400' },
  { value: 'fair', label: 'Fair', icon: Meh, color: 'text-yellow-500' },
  { value: 'good', label: 'Good', icon: Smile, color: 'text-green-400' },
  { value: 'excellent', label: 'Excellent', icon: Smile, color: 'text-green-500' },
];

const stressLevelOptions = [
  { value: 'relaxed', label: 'Relaxed', icon: Smile, color: 'text-green-500' },
  { value: 'mild', label: 'Mild Stress', icon: Smile, color: 'text-green-400' },
  { value: 'moderate', label: 'Moderate', icon: Meh, color: 'text-yellow-500' },
  { value: 'high', label: 'High Stress', icon: Frown, color: 'text-red-400' },
  { value: 'overwhelmed', label: 'Overwhelmed', icon: Frown, color: 'text-red-500' },
];

const LifestyleInsights: React.FC<LifestyleInsightsProps> = ({ onDataChange }) => {
  const [sleepQuality, setSleepQuality] = useState('');
  const [stressLevel, setStressLevel] = useState('');

  const handleSleepChange = (value: string) => {
    setSleepQuality(value);
    onDataChange({ sleepQuality: value, stressLevel });
  };

  const handleStressChange = (value: string) => {
    setStressLevel(value);
    onDataChange({ sleepQuality, stressLevel: value });
  };

  return (
    <div className="space-y-8">
      <div className="text-center">
        <p className="text-gray-600">Help us understand your sleep and stress patterns.</p>
      </div>

      {/* Sleep Quality */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 mb-4">
          <Moon className="w-5 h-5 text-teal-600" />
          <Label className="text-lg font-medium">How would you rate your sleep quality?</Label>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
          {sleepQualityOptions.map((option) => {
            const IconComponent = option.icon;
            return (
              <Button
                key={option.value}
                variant={sleepQuality === option.value ? "default" : "outline"}
                className={`p-4 h-auto flex flex-col items-center gap-2 ${
                  sleepQuality === option.value 
                    ? 'bg-gradient-to-r from-teal-500 to-blue-500 text-white' 
                    : 'hover:border-teal-300 hover:bg-teal-50'
                }`}
                onClick={() => handleSleepChange(option.value)}
              >
                <IconComponent className={`w-6 h-6 ${sleepQuality === option.value ? 'text-white' : option.color}`} />
                <span className="text-sm font-medium">{option.label}</span>
              </Button>
            );
          })}
        </div>
      </div>

      {/* Stress Level */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 mb-4">
          <Zap className="w-5 h-5 text-teal-600" />
          <Label className="text-lg font-medium">How stressed do you feel on a typical day?</Label>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
          {stressLevelOptions.map((option) => {
            const IconComponent = option.icon;
            return (
              <Button
                key={option.value}
                variant={stressLevel === option.value ? "default" : "outline"}
                className={`p-4 h-auto flex flex-col items-center gap-2 ${
                  stressLevel === option.value 
                    ? 'bg-gradient-to-r from-teal-500 to-blue-500 text-white' 
                    : 'hover:border-teal-300 hover:bg-teal-50'
                }`}
                onClick={() => handleStressChange(option.value)}
              >
                <IconComponent className={`w-6 h-6 ${stressLevel === option.value ? 'text-white' : option.color}`} />
                <span className="text-sm font-medium">{option.label}</span>
              </Button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default LifestyleInsights;
