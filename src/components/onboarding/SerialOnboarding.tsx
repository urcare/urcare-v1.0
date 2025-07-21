import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ArrowRight, User, Calendar, Users, Ruler, Weight, Clock, Briefcase } from 'lucide-react';

interface OnboardingData {
  fullName: string;
  age: string;
  gender: string;
  height: string;
  weight: string;
  wakeUpTime: string;
  sleepTime: string;
  workStart: string;
  workEnd: string;
}

interface SerialOnboardingProps {
  onComplete: (data: OnboardingData) => void;
  onBack: () => void;
}

const steps = [
  { id: 'fullName', title: 'What\'s your full name?', type: 'text', icon: User },
  { id: 'age', title: 'How old are you?', type: 'number', icon: Calendar },
  { id: 'gender', title: 'What\'s your gender?', type: 'choice', icon: Users },
  { id: 'height', title: 'What\'s your height?', type: 'number', icon: Ruler, unit: 'cm' },
  { id: 'weight', title: 'What\'s your weight?', type: 'number', icon: Weight, unit: 'kg' },
  { id: 'wakeUpTime', title: 'What time do you usually wake up?', type: 'time', icon: Clock },
  { id: 'sleepTime', title: 'What time do you usually go to sleep?', type: 'time', icon: Clock },
  { id: 'workSchedule', title: 'What\'s your work schedule?', type: 'timeRange', icon: Briefcase }
];

export const SerialOnboarding: React.FC<SerialOnboardingProps> = ({ onComplete, onBack }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [data, setData] = useState<OnboardingData>({
    fullName: '',
    age: '',
    gender: '',
    height: '',
    weight: '',
    wakeUpTime: '06:00',
    sleepTime: '22:00',
    workStart: '09:00',
    workEnd: '18:00'
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateStep = (stepIndex: number): boolean => {
    const step = steps[stepIndex];
    const newErrors: Record<string, string> = {};

    switch (step.id) {
      case 'fullName':
        if (!data.fullName.trim()) {
          newErrors.fullName = 'Please enter your full name';
        } else if (data.fullName.trim().length < 2) {
          newErrors.fullName = 'Name must be at least 2 characters';
        }
        break;
      case 'age':
        const age = parseInt(data.age);
        if (!data.age || isNaN(age) || age < 1 || age > 120) {
          newErrors.age = 'Please enter a valid age (1-120)';
        }
        break;
      case 'gender':
        if (!data.gender) {
          newErrors.gender = 'Please select your gender';
        }
        break;
      case 'height':
        const height = parseInt(data.height);
        if (!data.height || isNaN(height) || height < 100 || height > 250) {
          newErrors.height = 'Please enter a valid height (100-250 cm)';
        }
        break;
      case 'weight':
        const weight = parseInt(data.weight);
        if (!data.weight || isNaN(weight) || weight < 30 || weight > 300) {
          newErrors.weight = 'Please enter a valid weight (30-300 kg)';
        }
        break;
      case 'wakeUpTime':
        if (!data.wakeUpTime) {
          newErrors.wakeUpTime = 'Please select your wake-up time';
        }
        break;
      case 'sleepTime':
        if (!data.sleepTime) {
          newErrors.sleepTime = 'Please select your sleep time';
        }
        break;
      case 'workSchedule':
        if (!data.workStart || !data.workEnd) {
          newErrors.workSchedule = 'Please set your work schedule';
        } else if (data.workStart >= data.workEnd) {
          newErrors.workSchedule = 'Work start time must be before end time';
        }
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      if (currentStep === steps.length - 1) {
        onComplete(data);
      } else {
        setCurrentStep(currentStep + 1);
      }
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
      setErrors({});
    } else {
      onBack();
    }
  };

  const updateData = (field: keyof OnboardingData, value: string) => {
    setData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const currentStepData = steps[currentStep];
  const progress = ((currentStep + 1) / steps.length) * 100;

  const renderStepContent = () => {
    switch (currentStepData.type) {
      case 'text':
        return (
          <div className="space-y-2">
            <Input
              id={currentStepData.id}
              type="text"
              value={data[currentStepData.id as keyof OnboardingData]}
              onChange={(e) => updateData(currentStepData.id as keyof OnboardingData, e.target.value)}
              placeholder=""
              className="text-center text-3xl font-normal border-none bg-transparent focus:ring-0 focus:outline-none text-gray-900 placeholder-gray-400 p-0 h-auto"
              style={{ boxShadow: 'none' }}
              autoFocus
            />
            <div className="w-full h-px bg-gray-200 mt-2"></div>
            {errors[currentStepData.id] && (
              <p className="text-red-500 text-sm text-center mt-4">{errors[currentStepData.id]}</p>
            )}
          </div>
        );

      case 'number':
        return (
          <div className="space-y-2">
            <div className="relative">
              <Input
                id={currentStepData.id}
                type="number"
                value={data[currentStepData.id as keyof OnboardingData]}
                onChange={(e) => updateData(currentStepData.id as keyof OnboardingData, e.target.value)}
                placeholder=""
                className="text-center text-3xl font-normal border-none bg-transparent focus:ring-0 focus:outline-none text-gray-900 placeholder-gray-400 p-0 h-auto pr-12"
                style={{ boxShadow: 'none' }}
                autoFocus
              />
              {currentStepData.unit && (
                <span className="absolute right-0 top-1/2 transform -translate-y-1/2 text-gray-500 text-xl">
                  {currentStepData.unit}
                </span>
              )}
            </div>
            <div className="w-full h-px bg-gray-200 mt-2"></div>
            {errors[currentStepData.id] && (
              <p className="text-red-500 text-sm text-center mt-4">{errors[currentStepData.id]}</p>
            )}
          </div>
        );

      case 'choice':
        return (
          <div className="space-y-3">
            {['Male', 'Female', 'Other'].map((option, index) => (
              <motion.button
                key={option}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className={`w-full p-4 text-left rounded-2xl border-2 transition-all duration-300 ${
                  data.gender === option 
                    ? 'border-gray-900 bg-gray-900 text-white' 
                    : 'border-gray-200 bg-white text-gray-900 hover:border-gray-300'
                }`}
                onClick={() => updateData('gender', option)}
              >
                <span className="text-lg font-medium">{option}</span>
              </motion.button>
            ))}
            {errors.gender && (
              <p className="text-red-500 text-sm text-center">{errors.gender}</p>
            )}
          </div>
        );

      case 'time':
        return (
          <div className="space-y-2">
            <Input
              id={currentStepData.id}
              type="time"
              value={data[currentStepData.id as keyof OnboardingData]}
              onChange={(e) => updateData(currentStepData.id as keyof OnboardingData, e.target.value)}
              className="text-center text-2xl font-normal border-none bg-transparent focus:ring-0 focus:outline-none text-gray-900 p-0 h-auto"
              style={{ boxShadow: 'none' }}
              autoFocus
            />
            <div className="w-full h-px bg-gray-200 mt-2"></div>
            {errors[currentStepData.id] && (
              <p className="text-red-500 text-sm text-center mt-4">{errors[currentStepData.id]}</p>
            )}
          </div>
        );

      case 'timeRange':
        return (
          <div className="space-y-6">
            <div className="space-y-4">
              <div className="text-center">
                <Label htmlFor="workStart" className="text-lg font-medium text-gray-700 mb-4 block">Start Time</Label>
                <Input
                  id="workStart"
                  type="time"
                  value={data.workStart}
                  onChange={(e) => updateData('workStart', e.target.value)}
                  className="text-center text-xl font-normal border-none bg-transparent focus:ring-0 focus:outline-none text-gray-900 p-0 h-auto"
                  style={{ boxShadow: 'none' }}
                />
                <div className="w-full h-px bg-gray-200 mt-2"></div>
              </div>
              <div className="text-center">
                <Label htmlFor="workEnd" className="text-lg font-medium text-gray-700 mb-4 block">End Time</Label>
                <Input
                  id="workEnd"
                  type="time"
                  value={data.workEnd}
                  onChange={(e) => updateData('workEnd', e.target.value)}
                  className="text-center text-xl font-normal border-none bg-transparent focus:ring-0 focus:outline-none text-gray-900 p-0 h-auto"
                  style={{ boxShadow: 'none' }}
                />
                <div className="w-full h-px bg-gray-200 mt-2"></div>
              </div>
            </div>
            {errors.workSchedule && (
              <p className="text-red-500 text-sm text-center">{errors.workSchedule}</p>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header with back button and progress */}
      <div className="flex items-center justify-between p-4 pt-12">
        <Button
          variant="ghost"
          size="sm"
          onClick={handlePrevious}
          className="p-2 hover:bg-gray-100 rounded-full"
        >
          <ArrowLeft className="w-6 h-6 text-gray-600" />
        </Button>
        
        {/* Progress bar */}
        <div className="flex-1 mx-8">
          <div className="w-full bg-gray-200 rounded-full h-1">
            <div 
              className="bg-gray-800 h-1 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>
        
        <div className="w-10"></div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col px-6 pt-8">
        {/* Question */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-12 text-center"
        >
          <h1 className="text-2xl font-normal text-gray-900 mb-4 leading-tight">
            {currentStepData.title}
          </h1>
          <p className="text-sm text-gray-500">
            Step {currentStep + 1} of {steps.length}
          </p>
        </motion.div>

        {/* Input Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex-1 flex items-start justify-center"
        >
          <div className="w-full max-w-md">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                {renderStepContent()}
              </motion.div>
            </AnimatePresence>
          </div>
        </motion.div>
      </div>

      {/* Continue Button */}
      <div className="p-6 pb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Button
            onClick={handleNext}
            className="w-full bg-gray-900 hover:bg-gray-800 text-white py-4 px-8 rounded-2xl text-lg font-medium transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
          >
            {currentStep === steps.length - 1 ? 'Complete Setup' : 'Continue'}
          </Button>
        </motion.div>
      </div>
    </div>
  );
}; 