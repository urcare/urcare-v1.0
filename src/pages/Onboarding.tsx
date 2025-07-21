import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../integrations/supabase/client';
import { toast } from 'sonner';
import { OnboardingSteps } from '../components/onboarding/OnboardingSteps';
import { SerialOnboarding } from '../components/onboarding/SerialOnboarding';

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

const Onboarding = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [onboardingStep, setOnboardingStep] = useState<'welcome' | 'serial' | 'complete'>('welcome');
  const [loading, setLoading] = useState(false);

  const handleSerialComplete = async (data: OnboardingData) => {
    if (!user) {
      console.error('No user found for onboarding completion');
      toast.error('User not found', { description: 'Please log in again.' });
      return;
    }

    console.log('Starting onboarding completion for user:', user.id);
    setLoading(true);
    
    try {
      const userProfileData = {
        id: user.id,
        full_name: data.fullName,
        age: parseInt(data.age),
        gender: data.gender,
        height: parseInt(data.height),
        weight: parseInt(data.weight),
        onboarding_completed: true,
        preferences: {
          wake_up_time: data.wakeUpTime,
          sleep_time: data.sleepTime,
          work_start: data.workStart,
          work_end: data.workEnd,
        },
      };

      console.log('Upserting user profile:', userProfileData);
      
      // Upsert the user profile
      const { error: upsertError } = await supabase
        .from('user_profiles')
        .upsert(userProfileData);

      if (upsertError) {
        console.error('Error upserting user profile:', upsertError);
        throw upsertError;
      }

      console.log('User profile upserted successfully');
      
      setOnboardingStep('complete');
      
      setTimeout(() => {
        toast.success('Welcome to UrCare!', { 
          description: `Great to have you here, ${data.fullName}!` 
        });
        navigate('/dashboard');
      }, 2000);
      
    } catch (error: any) {
      console.error('Error completing onboarding:', error);
      toast.error('Onboarding failed', {
        description: error.message || 'There was an error completing your onboarding. Please try again.'
      });
    } finally {
      setLoading(false);
    }
  };

  // Show welcome screen first
  if (onboardingStep === 'welcome') {
    return (
      <OnboardingSteps
        stepType="welcome"
        onContinue={() => setOnboardingStep('serial')}
      />
    );
  }

  // Show serial onboarding
  if (onboardingStep === 'serial') {
    return (
      <SerialOnboarding
        onComplete={handleSerialComplete}
        onBack={() => setOnboardingStep('welcome')}
      />
    );
  }

  // Show completion
  if (onboardingStep === 'complete') {
    return (
      <OnboardingSteps
        stepType="complete"
        onContinue={() => navigate('/dashboard')}
      />
    );
  }

  return null;
};

export default Onboarding; 