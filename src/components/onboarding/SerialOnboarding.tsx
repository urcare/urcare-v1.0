import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ArrowRight, User, Calendar, Users, Ruler, Weight, Clock, Briefcase } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { AuthOptions } from '@/components/auth/AuthOptions';
import { supabase } from '@/integrations/supabase/client';
import { FullNameStep } from './steps/FullNameStep';
import { DateOfBirthStep } from './steps/DateOfBirthStep';
import { GenderStep } from './steps/GenderStep';
import { HeightWeightStep } from './steps/HeightWeightStep';
import { SleepScheduleStep } from './steps/SleepScheduleStep';
import { WorkScheduleStep } from './steps/WorkScheduleStep';
import { ChronicConditionsStep } from './steps/ChronicConditionsStep';
import { MedicationsStep } from './steps/MedicationsStep';
import { SurgeryStep } from './steps/SurgeryStep';
import { HealthGoalsStep } from './steps/HealthGoalsStep';
import { DietTypeStep } from './steps/DietTypeStep';
import { BloodGroupStep } from './steps/BloodGroupStep';
import { MealTimingsStep } from './steps/MealTimingsStep';
import { WorkoutTimeStep } from './steps/WorkoutTimeStep';
import { RoutineFlexibilityStep } from './steps/RoutineFlexibilityStep';
import { WearableStep } from './steps/WearableStep';
import { TrackFamilyStep } from './steps/TrackFamilyStep';
import { ShareProgressStep } from './steps/ShareProgressStep';
import { EmergencyContactStep } from './steps/EmergencyContactStep';
import { CriticalConditionsStep } from './steps/CriticalConditionsStep';
import { HealthReportsStep } from './steps/HealthReportsStep';
import { ReferralCodeStep } from './steps/ReferralCodeStep';
import { CompletionStep } from './steps/CompletionStep';

interface OnboardingData {
  fullName: string;
  age: string;
  birthMonth: string;
  birthDay: string;
  birthYear: string;
  gender: string;
  unitSystem: 'imperial' | 'metric';
  heightFeet: string;
  heightInches: string;
  heightCm: string;
  weightLb: string;
  weightKg: string;
  wakeUpTime: string;
  sleepTime: string;
  workStart: string;
  workEnd: string;
  chronicConditions: string[];
  takesMedications: string;
  medications: string[];
  hasSurgery: string;
  surgeryDetails: string[];
  healthGoals: string[];
  dietType: string;
  bloodGroup: string;
  breakfastTime: string;
  lunchTime: string;
  dinnerTime: string;
  workoutTime: string;
  routineFlexibility: string;
  usesWearable: string;
  wearableType: string;
  trackFamily: string;
  shareProgress: string;
  emergencyContactName: string;
  emergencyContactPhone: string;
  criticalConditions: string;
  hasHealthReports: string;
  healthReports: string[];
  referralCode: string;
  saveProgress: string;
}

interface SerialOnboardingProps {
  onComplete: (data: OnboardingData) => void;
  onBack: () => void;
}

const steps = [
  { id: 'fullName', title: 'What\'s your full name?', type: 'text', icon: User },
  { id: 'dateOfBirth', title: 'When were you born?', type: 'dateOfBirth', icon: Calendar },
  { id: 'gender', title: 'What\'s your gender?', type: 'choice', icon: Users },
  { id: 'heightWeight', title: 'Height & weight', type: 'heightWeight', icon: Ruler },
  { id: 'sleepSchedule', title: 'Sleep schedule', type: 'sleepSchedule', icon: Clock },
  { id: 'workSchedule', title: 'Work schedule', type: 'timeRange', icon: Briefcase },
  { id: 'chronicConditions', title: 'Chronic conditions', type: 'multiChoice', icon: User },
  { id: 'medications', title: 'Medications', type: 'medications', icon: User },
  { id: 'surgery', title: 'Surgery history', type: 'surgery', icon: User },
  { id: 'healthGoals', title: 'Health goals', type: 'healthGoals', icon: User },
  { id: 'dietType', title: 'Diet type', type: 'dietChoice', icon: User },
  { id: 'bloodGroup', title: 'Blood group', type: 'bloodGroup', icon: Weight },
  { id: 'mealTimings', title: 'Meal timings', type: 'mealTimings', icon: Clock },
  { id: 'workoutTime', title: 'Workout time', type: 'workoutChoice', icon: Clock },
  { id: 'routineFlexibility', title: 'Routine flexibility', type: 'slider', icon: User },
  { id: 'wearable', title: 'Wearable devices', type: 'wearable', icon: User },
  { id: 'trackFamily', title: 'Family tracking', type: 'yesNoChoice', icon: Users },
  { id: 'shareProgress', title: 'Progress sharing', type: 'yesNoChoice', icon: Users },
  { id: 'emergencyContact', title: 'Emergency contact', type: 'emergencyContact', icon: User },
  { id: 'criticalConditions', title: 'Critical conditions', type: 'textArea', icon: User },
  { id: 'healthReports', title: 'Health reports', type: 'fileUpload', icon: User },
  { id: 'referralCode', title: 'Referral code', type: 'referralCode', icon: User },
  { id: 'completion', title: 'All done!', type: 'completion', icon: User }
];

// Helper functions for chronic conditions
const getChronicConditions = () => [
  'Diabetes',
  'Hypertension (High Blood Pressure)',
  'Heart Disease',
  'Asthma',
  'Arthritis',
  'Depression/Anxiety',
  'High Cholesterol',
  'Obesity',
  'COPD',
  'Cancer',
  'Kidney Disease',
  'Thyroid Disorders',
  'Allergies',
  'Migraines',
  'None of the above'
];

// Helper functions for date picker
const getMonths = () => [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

const getDays = () => Array.from({ length: 31 }, (_, i) => (i + 1).toString());

const getYears = () => {
  const currentYear = new Date().getFullYear();
  const years = [];
  for (let year = currentYear - 100; year <= currentYear; year++) {
    years.push(year.toString());
  }
  return years;
};

const calculateAge = (birthMonth: string, birthDay: string, birthYear: string) => {
  const monthIndex = getMonths().indexOf(birthMonth);
  const birthDate = new Date(parseInt(birthYear), monthIndex, parseInt(birthDay));
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  
  return age.toString();
};

const calculateSleepDuration = (sleepTime: string, wakeTime: string) => {
  if (!sleepTime || !wakeTime) return null;
  
  const [sleepHour, sleepMinute] = sleepTime.split(':').map(Number);
  const [wakeHour, wakeMinute] = wakeTime.split(':').map(Number);
  
  // Convert times to minutes from midnight
  let sleepMinutes = sleepHour * 60 + sleepMinute;
  let wakeMinutes = wakeHour * 60 + wakeMinute;
  
  // If wake time is earlier than sleep time, assume it's the next day
  if (wakeMinutes <= sleepMinutes) {
    wakeMinutes += 24 * 60; // Add 24 hours
  }
  
  const durationMinutes = wakeMinutes - sleepMinutes;
  const hours = Math.floor(durationMinutes / 60);
  const minutes = durationMinutes % 60;
  
  return { hours, minutes, totalHours: durationMinutes / 60 };
};

// Helper functions for height and weight pickers
const getHeightFeet = () => Array.from({ length: 6 }, (_, i) => (i + 3).toString()); // 3-8 feet
const getHeightInches = () => Array.from({ length: 12 }, (_, i) => i.toString()); // 0-11 inches
const getHeightCm = () => Array.from({ length: 151 }, (_, i) => (i + 100).toString()); // 100-250 cm
const getWeightLb = () => Array.from({ length: 301 }, (_, i) => (i + 50).toString()); // 50-350 lb
const getWeightKg = () => Array.from({ length: 221 }, (_, i) => (i + 30).toString()); // 30-250 kg

// Helper functions for health goals
const getHealthGoals = () => [
  'Disease control',
  'Peak fitness',
  'Weight loss',
  'Mental clarity',
  'Long life',
  'Stress reduction'
];

// Helper function for time options
const getTimeOptions = () => {
  const times = [];
  for (let hour = 0; hour < 24; hour++) {
    for (let minute = 0; minute < 60; minute += 30) {
      const timeString = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
      times.push(timeString);
    }
  }
  return times;
};

// Custom Wheel Picker Component
interface WheelPickerProps {
  options: string[];
  selectedValue: string;
  onValueChange: (value: string) => void;
  width: string;
}

const WheelPicker: React.FC<WheelPickerProps> = ({ options, selectedValue, onValueChange, width }) => {
  const selectedIndex = options.indexOf(selectedValue);
  const visibleItems = 7; // Show 7 items at a time (3 above, 1 center, 3 below)
  const itemHeight = 50; // Height of each item in pixels
  const containerRef = React.useRef<HTMLDivElement>(null);

  // Touch and scroll state
  const [touchStartY, setTouchStartY] = useState<number | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isScrolling, setIsScrolling] = useState(false);

  // Enhanced haptic feedback function
  const triggerHapticFeedback = () => {
    try {
      // Modern haptic feedback for supported devices
      if ('vibrate' in navigator) {
        navigator.vibrate([30]); // Short pulse for better feel
      }
    } catch (error) {
      // Silently fail if haptic feedback is not supported
    }
  };

  const getVisibleOptions = () => {
    const result = [];
    const halfVisible = Math.floor(visibleItems / 2);
    
    for (let i = -halfVisible; i <= halfVisible; i++) {
      const index = selectedIndex + i;
      if (index >= 0 && index < options.length) {
        result.push({
          value: options[index],
          index: index,
          offset: i,
          isSelected: i === 0
        });
      } else {
        // Add empty spaces for smooth scrolling
        result.push({
          value: '',
          index: -1,
          offset: i,
          isSelected: false
        });
      }
    }
    return result;
  };

  const handleItemClick = (targetIndex: number) => {
    if (targetIndex >= 0 && targetIndex < options.length && targetIndex !== selectedIndex) {
      triggerHapticFeedback();
      onValueChange(options[targetIndex]);
    }
  };

  const moveUp = () => {
    if (selectedIndex > 0) {
      setIsScrolling(true);
      triggerHapticFeedback();
      onValueChange(options[selectedIndex - 1]);
      setTimeout(() => setIsScrolling(false), 150);
    }
  };

  const moveDown = () => {
    if (selectedIndex < options.length - 1) {
      setIsScrolling(true);
      triggerHapticFeedback();
      onValueChange(options[selectedIndex + 1]);
      setTimeout(() => setIsScrolling(false), 150);
    }
  };

  // Use useEffect to add wheel event listener with passive: false
  React.useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      if (e.deltaY > 0) {
        moveDown();
      } else {
        moveUp();
      }
    };

    container.addEventListener('wheel', handleWheel, { passive: false });

    return () => {
      container.removeEventListener('wheel', handleWheel);
    };
  }, [selectedIndex]); // Re-add listener when selectedIndex changes

  // Handle touch start
  const handleTouchStart = (e: React.TouchEvent) => {
    e.preventDefault(); // Prevent page scroll
    setTouchStartY(e.touches[0].clientY);
    setIsDragging(true);
  };

  // Handle touch move
  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging || touchStartY === null) return;
    
    e.preventDefault(); // Prevent scroll on the page
    const currentY = e.touches[0].clientY;
    const deltaY = touchStartY - currentY;
    
    // Require minimum movement to trigger scroll (reduced for better sensitivity)
    if (Math.abs(deltaY) > 15) {
      if (deltaY > 0) {
        moveDown();
      } else {
        moveUp();
      }
      setTouchStartY(currentY); // Reset for continuous scrolling
    }
  };

  // Handle touch end
  const handleTouchEnd = () => {
    setTouchStartY(null);
    setIsDragging(false);
  };

  // Handle mouse drag (for desktop)
  const handleMouseDown = (e: React.MouseEvent) => {
    setTouchStartY(e.clientY);
    setIsDragging(true);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || touchStartY === null) return;
    
    const currentY = e.clientY;
    const deltaY = touchStartY - currentY;
    
    // Improved sensitivity for desktop dragging
    if (Math.abs(deltaY) > 12) {
      if (deltaY > 0) {
        moveDown();
      } else {
        moveUp();
      }
      setTouchStartY(currentY);
    }
  };

  const handleMouseUp = () => {
    setTouchStartY(null);
    setIsDragging(false);
  };

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      moveUp();
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      moveDown();
    }
  };

  return (
    <div 
      ref={containerRef}
      className={`relative ${width} h-56 overflow-hidden flex flex-col justify-center focus:outline-none rounded-xl`}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      style={{ userSelect: 'none' }}
    >
      {/* Options container */}
      <div className={`flex flex-col items-center justify-center h-full relative transition-all duration-200 ease-out ${isScrolling ? 'scale-105' : 'scale-100'}`}>
        {getVisibleOptions().map((item, index) => {
          if (!item.value) {
            return (
              <div
                key={`empty-${index}`}
                style={{ height: `${itemHeight}px` }}
                className="flex items-center justify-center"
              >
              </div>
            );
          }

          // Calculate opacity and styling based on distance from center - simple bold text
          const distance = Math.abs(item.offset);
          let opacity, fontSize, fontWeight, color, textShadow, transform, zIndex;
          
          if (item.isSelected) {
            // Selected item - simple bold text
            opacity = 1;
            fontSize = 'clamp(16px, 4vw, 20px)';
            fontWeight = '700';
            color = '#111827';
            textShadow = 'none';
            transform = 'scale(1) translateZ(0)';
            zIndex = 10;
          } else if (distance === 1) {
            // Adjacent items - good visibility
            opacity = 0.7;
            fontSize = 'clamp(14px, 3.5vw, 18px)';
            fontWeight = '500';
            color = '#374151';
            textShadow = 'none';
            transform = 'scale(1) translateZ(0)';
            zIndex = 5;
          } else if (distance === 2) {
            // Further items - moderate visibility
            opacity = 0.4;
            fontSize = 'clamp(12px, 3vw, 16px)';
            fontWeight = '400';
            color = '#6b7280';
            textShadow = 'none';
            transform = 'scale(1) translateZ(0)';
            zIndex = 3;
          } else {
            // Farthest items - low visibility
            opacity = 0.2;
            fontSize = 'clamp(11px, 2.5vw, 14px)';
            fontWeight = '400';
            color = '#9ca3af';
            textShadow = 'none';
            transform = 'scale(1) translateZ(0)';
            zIndex = 1;
          }
          
          return (
            <div
              key={`${item.value}-${index}`}
              className="flex items-center justify-center cursor-pointer transition-all duration-300 ease-out px-2"
              style={{
                height: `${itemHeight}px`,
                opacity,
                transform,
                zIndex
              }}
              onClick={() => handleItemClick(item.index)}
            >
              <span 
                className="select-none text-center leading-tight pointer-events-none whitespace-nowrap overflow-hidden text-ellipsis max-w-full"
                style={{
                  fontSize,
                  fontWeight,
                  color,
                  textShadow
                }}
              >
                {item.value}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export const SerialOnboarding: React.FC<SerialOnboardingProps> = ({ onComplete, onBack }) => {
  const { user } = useAuth();
  const [currentStep, setCurrentStep] = useState(0);
  const [data, setData] = useState<OnboardingData>({
    fullName: '',
    age: '',
    birthMonth: 'January',
    birthDay: '1',
    birthYear: '2000',
    gender: '',
    unitSystem: 'metric',
    heightFeet: '5',
    heightInches: '6',
    heightCm: '170',
    weightLb: '150',
    weightKg: '70',
    wakeUpTime: '06:00',
    sleepTime: '22:00',
    workStart: '09:00',
    workEnd: '18:00',
    chronicConditions: [],
    takesMedications: 'No',
    medications: [],
    hasSurgery: 'No',
    surgeryDetails: [],
    healthGoals: [],
    dietType: 'Balanced',
    bloodGroup: '',
    breakfastTime: '07:00',
    lunchTime: '12:00',
    dinnerTime: '19:00',
    workoutTime: 'Morning (06:00-10:00)',
    routineFlexibility: '5',
    usesWearable: 'No',
    wearableType: '',
    trackFamily: 'No',
    shareProgress: 'No',
    emergencyContactName: '',
    emergencyContactPhone: '',
    criticalConditions: '',
    hasHealthReports: 'No',
    healthReports: [],
    referralCode: '',
    saveProgress: 'No'
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
      case 'dateOfBirth':
        if (!data.birthMonth || !data.birthDay || !data.birthYear) {
          newErrors.dateOfBirth = 'Please select your date of birth';
        }
        break;
      case 'gender':
        if (!data.gender) {
          newErrors.gender = 'Please select your gender';
        }
        break;
      case 'heightWeight':
        if (data.unitSystem === 'imperial') {
          if (!data.heightFeet || !data.heightInches || !data.weightLb) {
            newErrors.heightWeight = 'Please enter your height and weight';
          }
        } else {
          if (!data.heightCm || !data.weightKg) {
            newErrors.heightWeight = 'Please enter your height and weight';
          }
        }
        break;
      case 'sleepSchedule':
        if (!data.wakeUpTime || !data.sleepTime) {
          newErrors.sleepSchedule = 'Please set both wake-up and sleep times';
        }
        break;
      case 'workSchedule':
        if (!data.workStart || !data.workEnd) {
          newErrors.workSchedule = 'Please set your work schedule';
        } else if (data.workStart >= data.workEnd) {
          newErrors.workSchedule = 'Work start time must be before end time';
        }
        break;
      case 'chronicConditions':
        // Chronic conditions can be empty (optional), so no validation needed
        break;
      case 'medications':
        if (data.takesMedications === 'Yes' && data.medications.length === 0) {
          newErrors.medications = 'Please add at least one medication';
        }
        break;
      case 'surgery':
        if (data.hasSurgery === 'Yes' && data.surgeryDetails.length === 0) {
          newErrors.surgery = 'Please add at least one surgery detail';
        }
        break;
      case 'healthGoals':
        if (data.healthGoals.length === 0) {
          newErrors.healthGoals = 'Please select at least one health goal';
        }
        break;
      case 'dietType':
        if (!data.dietType) {
          newErrors.dietType = 'Please select a diet type';
        }
        break;
      case 'bloodGroup':
        if (!data.bloodGroup) {
          newErrors.bloodGroup = 'Please select your blood group';
        }
        break;
      case 'mealTimings':
        if (!data.breakfastTime || !data.lunchTime || !data.dinnerTime) {
          newErrors.mealTimings = 'Please set all meal timings';
        }
        break;
      case 'workoutTime':
        if (!data.workoutTime) {
          newErrors.workoutTime = 'Please select your preferred workout time';
        }
        break;
      case 'routineFlexibility':
        // Flexibility slider has default value, no validation needed
        break;
      case 'wearable':
        if (!data.usesWearable) {
          newErrors.wearable = 'Please select if you use a wearable device';
        } else if (data.usesWearable === 'Yes' && !data.wearableType) {
          newErrors.wearable = 'Please select your wearable device type';
        }
        break;
      case 'trackFamily':
        if (!data.trackFamily) {
          newErrors.trackFamily = 'Please select yes or no';
        }
        break;
      case 'shareProgress':
        if (!data.shareProgress) {
          newErrors.shareProgress = 'Please select yes or no';
        }
        break;
      case 'emergencyContact':
        if (!data.emergencyContactName.trim() || !data.emergencyContactPhone.trim()) {
          newErrors.emergencyContact = 'Please provide emergency contact name and phone number';
        }
        break;
      case 'criticalConditions':
        // Critical conditions are optional, no validation needed
        break;
      case 'healthReports':
        // Health reports are optional, no validation needed
        break;
      case 'referralCode':
        // Referral code is optional, no validation needed
        break;
      case 'auth':
        // Auth step doesn't need validation, handled by AuthOptions component
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      // Calculate age when completing date of birth step
      if (steps[currentStep].id === 'dateOfBirth') {
        const calculatedAge = calculateAge(data.birthMonth, data.birthDay, data.birthYear);
        setData(prev => ({ ...prev, age: calculatedAge }));
      }

      // Convert units when completing height/weight step
      if (steps[currentStep].id === 'heightWeight') {
        const updatedData = { ...data };
        
        if (data.unitSystem === 'imperial') {
          // Convert imperial to metric
          const totalInches = parseInt(data.heightFeet) * 12 + parseInt(data.heightInches);
          const heightCm = Math.round(totalInches * 2.54);
          const weightKg = Math.round(parseInt(data.weightLb) * 0.453592);
          
          updatedData.heightCm = heightCm.toString();
          updatedData.weightKg = weightKg.toString();
        } else {
          // Convert metric to imperial
          const totalInches = Math.round(parseInt(data.heightCm) / 2.54);
          const feet = Math.floor(totalInches / 12);
          const inches = totalInches % 12;
          const weightLb = Math.round(parseInt(data.weightKg) / 0.453592);
          
          updatedData.heightFeet = feet.toString();
          updatedData.heightInches = inches.toString();
          updatedData.weightLb = weightLb.toString();
        }
        
        setData(updatedData);
      }
      
      // Check if this is the referral step (second to last)
      if (currentStep === steps.length - 2) {
        // Move to completion step
        setCurrentStep(currentStep + 1);
        return;
      }
      
      // Check if this is the completion step (last step)
      if (currentStep === steps.length - 1) {
        // Save all onboarding data to database
        console.log('Saving onboarding data at completion step:', data);
        onComplete(data);
        return;
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

  const updateData = (field: keyof OnboardingData, value: string | string[] | number) => {
    setData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing/selecting
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleChronicConditionToggle = (condition: string) => {
    const newConditions = [...data.chronicConditions];
    const isSelected = newConditions.includes(condition);
    const isNoneOption = condition === 'None of the above';
    
    if (isNoneOption) {
      // If clicking "None of the above", clear all others or clear everything
      if (isSelected) {
        updateData('chronicConditions', []);
      } else {
        updateData('chronicConditions', [condition]);
      }
    } else {
      // If clicking any other condition
      if (isSelected) {
        // Remove the condition
        const filtered = newConditions.filter(c => c !== condition);
        updateData('chronicConditions', filtered);
      } else {
        // Add the condition and remove "None of the above" if present
        const filtered = newConditions.filter(c => c !== 'None of the above');
        filtered.push(condition);
        updateData('chronicConditions', filtered);
      }
    }
  };

  const addMedication = (medication: string) => {
    if (medication.trim() && !data.medications.includes(medication.trim())) {
      const newMedications = [...data.medications, medication.trim()];
      updateData('medications', newMedications);
    }
  };

  const removeMedication = (medicationToRemove: string) => {
    const filtered = data.medications.filter(med => med !== medicationToRemove);
    updateData('medications', filtered);
  };

  const addSurgeryDetail = (surgeryDetail: string) => {
    if (surgeryDetail.trim() && !data.surgeryDetails.includes(surgeryDetail.trim())) {
      const newSurgeryDetails = [...data.surgeryDetails, surgeryDetail.trim()];
      updateData('surgeryDetails', newSurgeryDetails);
    }
  };

  const removeSurgeryDetail = (surgeryDetailToRemove: string) => {
    const filtered = data.surgeryDetails.filter(detail => detail !== surgeryDetailToRemove);
    updateData('surgeryDetails', filtered);
  };

  const handleHealthGoalToggle = (goal: string) => {
    const newGoals = [...data.healthGoals];
    const isSelected = newGoals.includes(goal);
    
    if (isSelected) {
      // Remove the goal
      const filtered = newGoals.filter(g => g !== goal);
      updateData('healthGoals', filtered);
    } else {
      // Add the goal
      newGoals.push(goal);
      updateData('healthGoals', newGoals);
    }
  };

  const currentStepData = steps[currentStep];
  const progress = ((currentStep + 1) / steps.length) * 100;

  const renderStepContent = () => {
    switch (currentStepData.id) {
      case 'fullName':
        return <FullNameStep value={data.fullName} onChange={v => updateData('fullName', v)} error={errors.fullName} />;
      case 'dateOfBirth':
        return <DateOfBirthStep month={data.birthMonth} day={data.birthDay} year={data.birthYear} onChange={updateData} error={errors.dateOfBirth} />;
      case 'gender':
        return <GenderStep value={data.gender} onChange={v => updateData('gender', v)} error={errors.gender} />;
      case 'heightWeight':
        return <HeightWeightStep unitSystem={data.unitSystem} heightFeet={data.heightFeet} heightInches={data.heightInches} heightCm={data.heightCm} weightLb={data.weightLb} weightKg={data.weightKg} onChange={updateData} error={errors.heightWeight} />;
      case 'sleepSchedule':
        return <SleepScheduleStep wakeUpTime={data.wakeUpTime} sleepTime={data.sleepTime} onChange={updateData} error={errors.sleepSchedule} />;
      case 'workSchedule':
        return <WorkScheduleStep workStart={data.workStart} workEnd={data.workEnd} onChange={updateData} error={errors.workSchedule} />;
      case 'chronicConditions':
        return <ChronicConditionsStep selected={data.chronicConditions} onToggle={handleChronicConditionToggle} error={errors.chronicConditions} />;
      case 'medications':
        return <MedicationsStep takesMedications={data.takesMedications} medications={data.medications} onTakesMedicationsChange={v => updateData('takesMedications', v)} onAddMedication={addMedication} onRemoveMedication={removeMedication} error={errors.medications} />;
      case 'surgery':
        return <SurgeryStep hasSurgery={data.hasSurgery} surgeryDetails={data.surgeryDetails} onHasSurgeryChange={v => updateData('hasSurgery', v)} onAddSurgeryDetail={addSurgeryDetail} onRemoveSurgeryDetail={removeSurgeryDetail} error={errors.surgery} />;
      case 'healthGoals':
        return <HealthGoalsStep selected={data.healthGoals} onToggle={handleHealthGoalToggle} error={errors.healthGoals} />;
      case 'dietType':
        return <DietTypeStep value={data.dietType} onChange={v => updateData('dietType', v)} error={errors.dietType} />;
      case 'bloodGroup':
        return <BloodGroupStep value={data.bloodGroup} onChange={v => updateData('bloodGroup', v)} error={errors.bloodGroup} />;
      case 'mealTimings':
        return <MealTimingsStep breakfastTime={data.breakfastTime} lunchTime={data.lunchTime} dinnerTime={data.dinnerTime} onChange={updateData} error={errors.mealTimings} />;
      case 'workoutTime':
        return <WorkoutTimeStep value={data.workoutTime} onChange={v => updateData('workoutTime', v)} error={errors.workoutTime} />;
      case 'routineFlexibility':
        return <RoutineFlexibilityStep value={data.routineFlexibility} onChange={v => updateData('routineFlexibility', v)} error={errors.routineFlexibility} />;
      case 'wearable':
        return <WearableStep usesWearable={data.usesWearable} wearableType={data.wearableType} onUsesWearableChange={v => updateData('usesWearable', v)} onWearableTypeChange={v => updateData('wearableType', v)} error={errors.wearable} />;
      case 'trackFamily':
        return <TrackFamilyStep value={data.trackFamily} onChange={v => updateData('trackFamily', v)} error={errors.trackFamily} />;
      case 'shareProgress':
        return <ShareProgressStep value={data.shareProgress} onChange={v => updateData('shareProgress', v)} error={errors.shareProgress} />;
      case 'emergencyContact':
        return <EmergencyContactStep name={data.emergencyContactName} phone={data.emergencyContactPhone} onChange={updateData} error={errors.emergencyContact} />;
      case 'criticalConditions':
        return <CriticalConditionsStep value={data.criticalConditions} onChange={v => updateData('criticalConditions', v)} error={errors.criticalConditions} />;
      case 'healthReports':
        return <HealthReportsStep hasHealthReports={data.hasHealthReports} healthReports={data.healthReports} onHasHealthReportsChange={v => updateData('hasHealthReports', v)} onAddHealthReport={file => updateData('healthReports', [...data.healthReports, file])} onRemoveHealthReport={file => updateData('healthReports', data.healthReports.filter(f => f !== file))} error={errors.healthReports} />;
      case 'referralCode':
        return <ReferralCodeStep value={data.referralCode} onChange={v => updateData('referralCode', v)} error={errors.referralCode} />;
      case 'completion':
        return <CompletionStep onContinue={handleNext} />;
      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-50 flex flex-col overflow-hidden">
      {/* Header with back button and progress - hidden for completion step */}
      {currentStepData.id !== 'completion' && (
        <div className="flex items-center justify-between p-4 pt-12 flex-shrink-0 bg-gray-50">
          <Button
            variant="ghost"
            size="sm"
            onClick={handlePrevious}
            className="p-2 hover:bg-gray-100 rounded-full"
          >
            <ArrowLeft className="w-6 h-6 text-gray-600" />
          </Button>
          
          {/* Progress bar */}
          <div className="flex-1 mx-4 sm:mx-8">
            <div className="w-full bg-gray-200 rounded-full h-1">
              <div 
                className="bg-gray-800 h-1 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>
          
          <div className="w-10"></div>
        </div>
      )}

      {/* Main content - centered and scrollable */}
      <div className="flex-1 flex flex-col items-center justify-center px-4 sm:px-6 py-8 overflow-y-auto">
        <div className="w-full max-w-md">
          {/* Question - hidden for completion step */}
          {currentStepData.id !== 'completion' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="mb-6 sm:mb-8 text-center"
            >
              <h1 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-3 leading-tight">
                {currentStepData.title}
              </h1>
            </motion.div>
          )}

          {/* Input Section - centered content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="w-full"
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="w-full"
              >
                {renderStepContent()}
              </motion.div>
            </AnimatePresence>
          </motion.div>
        </div>
      </div>

      {/* Continue Button - fixed at bottom - hidden for completion step */}
      {currentStepData.id !== 'completion' && (
        <div className="p-4 sm:p-6 pb-6 flex-shrink-0 bg-gray-50">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Button
              onClick={handleNext}
              className="w-full bg-gray-900 hover:bg-gray-800 text-white py-4 px-8 rounded-2xl text-lg font-medium transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
            >
              {currentStep === steps.length - 2 ? 'Continue' : 'Continue'}
            </Button>
          </motion.div>
        </div>
      )}
    </div>
  );
}; 