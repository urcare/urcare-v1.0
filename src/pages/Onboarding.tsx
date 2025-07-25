import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'sonner';
import { OnboardingSteps } from '../components/onboarding/OnboardingSteps';
import { SerialOnboarding } from '../components/onboarding/SerialOnboarding';
import { supabase } from '@/integrations/supabase/client';

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

const Onboarding = () => {
  const navigate = useNavigate();
  const { user, refreshProfile, profile } = useAuth();
  const [onboardingStep, setOnboardingStep] = useState<'welcome' | 'serial' | 'complete'>('welcome');
  const [loading, setLoading] = useState(false);
  const [pendingOnboardingData, setPendingOnboardingData] = useState<OnboardingData | null>(null);

  // Redirect to /auth if user is not authenticated
  useEffect(() => {
    if (!user) {
      navigate('/auth', { replace: true });
    }
  }, [user, navigate]);

  // Restore onboarding data from localStorage after OAuth
  useEffect(() => {
    if (user && onboardingStep !== 'complete') {
      const pending = localStorage.getItem('pendingOnboardingData');
      if (pending) {
        try {
          const onboardingData = JSON.parse(pending);
          setPendingOnboardingData(onboardingData);
          handleSerialComplete(onboardingData);
          localStorage.removeItem('pendingOnboardingData');
        } catch (e) {
          console.warn('Failed to parse onboardingData from localStorage:', e);
        }
      }
    }
  }, [user, onboardingStep]);

  // Temporary manual trigger for debugging
  const handleManualOnboardingSave = () => {
    const pending = localStorage.getItem('pendingOnboardingData');
    if (pending) {
      try {
        const onboardingData = JSON.parse(pending);
        console.log('Manual trigger: Restoring onboardingData from localStorage:', onboardingData);
        handleSerialComplete(onboardingData);
        localStorage.removeItem('pendingOnboardingData');
      } catch (e) {
        console.warn('Manual trigger: Failed to parse onboardingData from localStorage:', e);
      }
    } else {
      console.warn('Manual trigger: No onboardingData found in localStorage');
    }
  };

  // Comprehensive data validation function
  const validateOnboardingData = (data: OnboardingData): { isValid: boolean; errors: string[] } => {
    const errors: string[] = [];

    // Required fields validation
    if (!data.fullName?.trim()) errors.push('Full name is required');
    if (!data.birthMonth || !data.birthDay || !data.birthYear) errors.push('Date of birth is required');
    if (!data.gender) errors.push('Gender is required');
    if (!data.heightCm || parseInt(data.heightCm) <= 0) errors.push('Valid height is required');
    if (!data.weightKg || parseInt(data.weightKg) <= 0) errors.push('Valid weight is required');
    if (!data.wakeUpTime) errors.push('Wake-up time is required');
    if (!data.sleepTime) errors.push('Sleep time is required');
    if (!data.bloodGroup) errors.push('Blood group is required');
    if (!data.emergencyContactName?.trim()) errors.push('Emergency contact name is required');
    if (!data.emergencyContactPhone?.trim()) errors.push('Emergency contact phone is required');

    // Data format validation
    const currentYear = new Date().getFullYear();
    const birthYear = parseInt(data.birthYear);
    if (birthYear < currentYear - 120 || birthYear > currentYear) {
      errors.push('Invalid birth year');
    }

    // Phone number validation (basic)
    const phoneRegex = /^[\+]?[\d\s\-\(\)]{10,}$/;
    if (data.emergencyContactPhone && !phoneRegex.test(data.emergencyContactPhone)) {
      errors.push('Invalid emergency contact phone number');
    }

    // Health data validation
    if (data.takesMedications === 'Yes' && (!data.medications || data.medications.length === 0)) {
      errors.push('Please list medications if you take any');
    }

    if (data.hasSurgery === 'Yes' && (!data.surgeryDetails || data.surgeryDetails.length === 0)) {
      errors.push('Please provide surgery details if you have had surgery');
    }

    return { isValid: errors.length === 0, errors };
  };

  // Calculate date of birth from components
  const calculateDateOfBirth = (month: string, day: string, year: string): string => {
    const months = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
    const monthIndex = months.indexOf(month);
    if (monthIndex === -1) return '';
    
    const date = new Date(parseInt(year), monthIndex, parseInt(day));
    return date.toISOString().split('T')[0]; // YYYY-MM-DD format
  };

  // Generate data completeness summary
  const generateDataSummary = (data: OnboardingData) => {
    const categories = {
      'Personal Info': [
        data.fullName, data.birthMonth, data.birthDay, data.birthYear, data.gender
      ].filter(Boolean).length,
      'Health Metrics': [
        data.heightCm, data.weightKg, data.bloodGroup
      ].filter(Boolean).length,
      'Schedule & Lifestyle': [
        data.wakeUpTime, data.sleepTime, data.workStart, data.workEnd,
        data.breakfastTime, data.lunchTime, data.dinnerTime, data.workoutTime
      ].filter(Boolean).length,
      'Health Information': [
        data.chronicConditions?.length > 0 ? 'chronic' : '',
        data.takesMedications, data.medications?.length > 0 ? 'meds' : '',
        data.hasSurgery, data.healthGoals?.length > 0 ? 'goals' : ''
      ].filter(Boolean).length,
      'Emergency & Contact': [
        data.emergencyContactName, data.emergencyContactPhone
      ].filter(Boolean).length
    };

    const totalExpected = 22; // Total number of important fields
    const totalCompleted = Object.values(categories).reduce((sum, count) => sum + count, 0);
    const completeness = Math.round((totalCompleted / totalExpected) * 100);

    return { categories, totalCompleted, totalExpected, completeness };
  };

  const handleSerialComplete = async (data: OnboardingData) => {
    if (!user) {
      console.error('No user found for onboarding completion');
      toast.error('User not found', { description: 'Please log in again.' });
      return;
    }

    console.log('Starting comprehensive onboarding completion for user:', user.id);
    console.log('Onboarding data received:', data);
    setLoading(true);

    try {
      // Step 1: Validate all collected data
      const validation = validateOnboardingData(data);
      console.log('Data validation result:', validation);
      if (!validation.isValid) {
        toast.error('Incomplete Information', {
          description: `Please complete: ${validation.errors.join(', ')}`
        });
        setLoading(false);
        return;
      }

      // Step 2: Calculate derived data and data summary
      const dateOfBirth = calculateDateOfBirth(data.birthMonth, data.birthDay, data.birthYear);
      const age = parseInt(data.age) || new Date().getFullYear() - parseInt(data.birthYear);
      const dataSummary = generateDataSummary(data);

      console.log('📊 Data completeness summary:', dataSummary);
      console.log('Calculated date of birth:', dateOfBirth);
      console.log('Calculated age:', age);

      // Step 3: Prepare comprehensive user profile data for user_profiles table
      // Build date_of_birth string
      const monthIndex = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
      ].indexOf(data.birthMonth) + 1;
      const date_of_birth = `${data.birthYear}-${monthIndex.toString().padStart(2, '0')}-${data.birthDay.padStart(2, '0')}`;

      // Build preferences object
      const preferences = {
        meals: {
          breakfast_time: data.breakfastTime,
          lunch_time: data.lunchTime,
          dinner_time: data.dinnerTime,
          diet_type: data.dietType
        },
        schedule: {
          sleep_time: data.sleepTime,
          wake_up_time: data.wakeUpTime,
          work_start: data.workStart,
          work_end: data.workEnd,
          routine_flexibility: data.routineFlexibility
        },
        health: {
          blood_group: data.bloodGroup,
          chronic_conditions: Array.isArray(data.chronicConditions) ? data.chronicConditions : [],
          takes_medications: data.takesMedications,
          medications: Array.isArray(data.medications) ? data.medications : [],
          has_surgery: data.hasSurgery,
          surgery_details: Array.isArray(data.surgeryDetails) ? data.surgeryDetails : [],
          critical_conditions: data.criticalConditions,
          health_goals: Array.isArray(data.healthGoals) ? data.healthGoals : []
        }
      };

      const userProfileData = {
        id: user.id,
        full_name: data.fullName.trim(),
        age: age,
        date_of_birth,
        gender: data.gender,
        unit_system: data.unitSystem,
        height_feet: data.heightFeet,
        height_inches: data.heightInches,
        height_cm: data.heightCm,
        weight_lb: data.weightLb,
        weight_kg: data.weightKg,
        wake_up_time: data.wakeUpTime,
        sleep_time: data.sleepTime,
        work_start: data.workStart,
        work_end: data.workEnd,
        chronic_conditions: Array.isArray(data.chronicConditions) ? data.chronicConditions : [],
        takes_medications: data.takesMedications,
        medications: Array.isArray(data.medications) ? data.medications : [],
        has_surgery: data.hasSurgery,
        surgery_details: Array.isArray(data.surgeryDetails) ? data.surgeryDetails : [],
        health_goals: Array.isArray(data.healthGoals) ? data.healthGoals : [],
        diet_type: data.dietType,
        blood_group: data.bloodGroup,
        breakfast_time: data.breakfastTime,
        lunch_time: data.lunchTime,
        dinner_time: data.dinnerTime,
        workout_time: data.workoutTime,
        routine_flexibility: data.routineFlexibility,
        uses_wearable: data.usesWearable,
        wearable_type: data.wearableType,
        track_family: data.trackFamily,
        share_progress: data.shareProgress,
        emergency_contact_name: data.emergencyContactName,
        emergency_contact_phone: data.emergencyContactPhone,
        critical_conditions: data.criticalConditions,
        has_health_reports: data.hasHealthReports,
        health_reports: Array.isArray(data.healthReports) ? data.healthReports : [],
        referral_code: data.referralCode,
        save_progress: data.saveProgress,
        onboarding_completed: true,
        status: 'active',
        preferences,
        updated_at: new Date().toISOString()
      };

      // Debug log before upsert
      console.log('Final userProfileData for upsert:', userProfileData);
      console.log('User id for upsert:', user.id);
      console.log('Supabase client available:', !!supabase);

      // Step 4: Save to user_profiles table with upsert
      console.log('Attempting to upsert user profile data...');
      const { error, data: upsertData } = await supabase
        .from('user_profiles')
        .upsert(userProfileData, { onConflict: 'id' });

      // Debug log after upsert
      console.log('Upsert result:', { error, upsertData });
      console.log('Error details:', error?.message, error?.details, error?.hint);

      if (error) {
        console.error('❌ Database upsert failed:', error);
        throw error;
      }

      console.log('✅ Database upsert successful:', upsertData);

      // Step 5: Refresh auth context with updated profile
      try {
        await refreshProfile();
        console.log('✅ Auth context refreshed with updated profile');
        await new Promise(resolve => setTimeout(resolve, 500));
      } catch (refreshError) {
        console.warn('Could not refresh auth profile:', refreshError);
      }

      // Step 6: Show completion screen with detailed confirmation
      setOnboardingStep('complete');

      // Step 7: Navigate to custom plan with success feedback
      setTimeout(() => {
        toast.success('🎉 Welcome to UrCare!', {
          description: `Profile setup complete! ${dataSummary.completeness}% data completeness with ${dataSummary.totalCompleted} key fields saved securely.`,
          duration: 4000
        });
        navigate('/custom-plan');
      }, 2500);
    } catch (error: any) {
      console.error('❌ Error completing onboarding:', error);
      let errorMessage = 'There was an error saving your profile.';
      if (error.message?.includes('duplicate')) {
        errorMessage = 'Profile already exists. Updating existing profile...';
      } else if (error.message?.includes('network')) {
        errorMessage = 'Network error. Please check your connection and try again.';
      } else if (error.message?.includes('validation')) {
        errorMessage = 'Data validation error. Please check your information.';
      }
      toast.error('Onboarding Error', {
        description: errorMessage,
        duration: 6000
      });
    } finally {
      setLoading(false);
    }
  };

  // Show serial onboarding directly (welcome screen is now separate)
  if (onboardingStep === 'welcome' || onboardingStep === 'serial') {
    return (
      <>
        <SerialOnboarding
          onComplete={handleSerialComplete}
          onBack={() => navigate('/')}
        />
      </>
    );
  }

  // Show completion
  if (onboardingStep === 'complete') {
    return (
      <OnboardingSteps
        stepType="complete"
        onContinue={() => navigate('/custom-plan')}
      />
    );
  }

  return null;
};

export default Onboarding; 