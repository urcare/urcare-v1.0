import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { Fingerprint, Camera, Smartphone, Watch, Heart, Activity, Moon, Zap, Smile, Frown, Meh } from 'lucide-react';

interface SetupOption {
  id: string;
  name: string;
  description: string;
  icon: React.ComponentType<any>;
  color?: string;
  value?: string;
  label?: string;
}

interface SetupStepsProps {
  setupType: 'biometric' | 'wearables' | 'lifestyle';
  onDataChange: (data: any) => void;
}

// Predefined data for different setup types
const SETUP_DATA = {
  biometric: {
    title: 'Biometric Authentication',
    description: 'Set up biometric login to access your account securely and quickly.',
    options: [
      {
        id: 'fingerprint',
        name: 'Fingerprint Authentication',
        description: 'Use your fingerprint to quickly log in to your account',
        icon: Fingerprint
      },
      {
        id: 'faceID',
        name: 'Face ID Authentication', 
        description: 'Use Face ID for secure and convenient authentication',
        icon: Camera
      }
    ]
  },
  wearables: {
    title: 'Connect Wearables',
    description: 'Connect your wearable devices to track your health data automatically.',
    options: [
      {
        id: 'google-fit',
        name: 'Google Fit',
        description: 'Connect your Android fitness data',
        icon: Activity,
        color: 'bg-green-500'
      },
      {
        id: 'apple-health',
        name: 'Apple Health',
        description: 'Sync with Apple Health app',
        icon: Heart,
        color: 'bg-red-500'
      },
      {
        id: 'fitbit',
        name: 'Fitbit',
        description: 'Connect your Fitbit device',
        icon: Watch,
        color: 'bg-blue-500'
      },
      {
        id: 'samsung-health',
        name: 'Samsung Health',
        description: 'Sync Samsung Health data',
        icon: Smartphone,
        color: 'bg-purple-500'
      }
    ]
  },
  lifestyle: {
    title: 'Lifestyle Insights',
    description: 'Help us understand your sleep and stress patterns.',
    sleepOptions: [
      { value: 'very-poor', label: 'Very Poor', icon: Frown, color: 'text-red-500' },
      { value: 'poor', label: 'Poor', icon: Frown, color: 'text-red-400' },
      { value: 'fair', label: 'Fair', icon: Meh, color: 'text-yellow-500' },
      { value: 'good', label: 'Good', icon: Smile, color: 'text-green-400' },
      { value: 'excellent', label: 'Excellent', icon: Smile, color: 'text-green-500' }
    ],
    stressOptions: [
      { value: 'relaxed', label: 'Relaxed', icon: Smile, color: 'text-green-500' },
      { value: 'mild', label: 'Mild Stress', icon: Smile, color: 'text-green-400' },
      { value: 'moderate', label: 'Moderate', icon: Meh, color: 'text-yellow-500' },
      { value: 'high', label: 'High Stress', icon: Frown, color: 'text-red-400' },
      { value: 'overwhelmed', label: 'Overwhelmed', icon: Frown, color: 'text-red-500' }
    ]
  }
};

export const SetupSteps: React.FC<SetupStepsProps> = ({ setupType, onDataChange }) => {
  const [selections, setSelections] = useState<Record<string, any>>({});
  const [skipStep, setSkipStep] = useState(false);

  const data = SETUP_DATA[setupType] as any;

  const handleToggle = (id: string, checked: boolean) => {
    const newSelections = { ...selections, [id]: checked };
    setSelections(newSelections);
    
    if (setupType === 'biometric') {
      const action = checked ? 'enabled' : 'disabled';
      const feature = id === 'fingerprint' ? 'Fingerprint' : 'Face ID';
      toast.success(`${feature} authentication ${action}`);
    }
    
    onDataChange(newSelections);
  };

  const handleSelection = (category: string, value: string) => {
    const newSelections = { ...selections, [category]: value };
    setSelections(newSelections);
    onDataChange(newSelections);
  };

  const handleSkip = (checked: boolean) => {
    setSkipStep(checked);
    if (checked) {
      setSelections({});
      onDataChange({ skipped: true });
    }
  };

  // Biometric Setup Render
  if (setupType === 'biometric') {
    return (
      <div className="space-y-6">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold tracking-tight">{data.title}</h2>
          <p className="text-muted-foreground mt-2">{data.description}</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {data.options?.map((option) => (
            <Card key={option.id} className={`hover:shadow-lg transition-shadow ${selections[option.id] ? 'border-primary' : ''}`}>
              <CardHeader className="space-y-1">
                <CardTitle className="text-xl flex items-center gap-2">
                  <option.icon className="h-5 w-5 text-primary" />
                  {option.name}
                </CardTitle>
                <CardDescription>{option.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-2">
                  <Switch
                    id={option.id}
                    checked={selections[option.id] || false}
                    onCheckedChange={(checked) => handleToggle(option.id, checked)}
                  />
                  <Label htmlFor={option.id}>Enable {option.name.split(' ')[0]}</Label>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  // Wearables Setup Render
  if (setupType === 'wearables') {
    return (
      <div className="space-y-6">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold tracking-tight">{data.title}</h2>
          <p className="text-muted-foreground mt-2">{data.description}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {data.options?.map((option) => (
            <Card key={option.id} className={`cursor-pointer transition-all hover:shadow-md ${selections[option.id] ? 'border-teal-500 bg-teal-50' : ''}`}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className={`w-12 h-12 rounded-full ${option.color} flex items-center justify-center text-white`}>
                      <option.icon className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{option.name}</h3>
                      <p className="text-sm text-gray-600">{option.description}</p>
                    </div>
                  </div>
                  <Switch
                    checked={selections[option.id] || false}
                    onCheckedChange={(checked) => handleToggle(option.id, checked)}
                  />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg">
          <Switch
            checked={skipStep}
            onCheckedChange={handleSkip}
          />
          <span className="text-sm text-gray-700">Skip wearables setup for now</span>
        </div>
      </div>
    );
  }

  // Lifestyle Setup Render
  if (setupType === 'lifestyle') {
    return (
      <div className="space-y-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold tracking-tight">{data.title}</h2>
          <p className="text-gray-600">{data.description}</p>
        </div>

        {/* Sleep Quality */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 mb-4">
            <Moon className="w-5 h-5 text-teal-600" />
            <Label className="text-lg font-medium">Sleep Quality</Label>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            {data.sleepOptions?.map((option) => (
              <Button
                key={option.value}
                variant={selections.sleepQuality === option.value ? "default" : "outline"}
                onClick={() => handleSelection('sleepQuality', option.value)}
                className={`h-auto py-4 flex flex-col items-center gap-2 ${
                  selections.sleepQuality === option.value
                    ? 'bg-teal-600 hover:bg-teal-700 text-white'
                    : 'hover:bg-teal-50 hover:border-teal-300'
                }`}
              >
                <option.icon className={`w-6 h-6 ${selections.sleepQuality === option.value ? 'text-white' : option.color}`} />
                <span className="text-sm font-medium">{option.label}</span>
              </Button>
            ))}
          </div>
        </div>

        {/* Stress Level */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 mb-4">
            <Zap className="w-5 h-5 text-teal-600" />
            <Label className="text-lg font-medium">Stress Level</Label>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            {data.stressOptions?.map((option) => (
              <Button
                key={option.value}
                variant={selections.stressLevel === option.value ? "default" : "outline"}
                onClick={() => handleSelection('stressLevel', option.value)}
                className={`h-auto py-4 flex flex-col items-center gap-2 ${
                  selections.stressLevel === option.value
                    ? 'bg-teal-600 hover:bg-teal-700 text-white'
                    : 'hover:bg-teal-50 hover:border-teal-300'
                }`}
              >
                <option.icon className={`w-6 h-6 ${selections.stressLevel === option.value ? 'text-white' : option.color}`} />
                <span className="text-sm font-medium">{option.label}</span>
              </Button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return null;
}; 