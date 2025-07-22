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
  const { user, refreshProfile } = useAuth();
  const [onboardingStep, setOnboardingStep] = useState<'welcome' | 'serial' | 'complete'>('welcome');
  const [loading, setLoading] = useState(false);

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
    setLoading(true);

    try {
      // Step 1: Validate all collected data
      const validation = validateOnboardingData(data);
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

      // Step 3: Prepare comprehensive user profile data
      const userProfileData = {
        id: user.id,
        full_name: data.fullName.trim(),
        date_of_birth: dateOfBirth,
        gender: data.gender,
        phone: data.emergencyContactPhone, // Store emergency contact as primary phone initially
        emergency_contact: data.emergencyContactName,
        emergency_phone: data.emergencyContactPhone,
        onboarding_completed: true,
        status: 'active',
        preferences: {
          // Personal Info
          age: age,
          birth_details: {
            month: data.birthMonth,
            day: data.birthDay,
            year: data.birthYear
          },
          
          // Physical Measurements
          measurements: {
            unit_system: data.unitSystem,
            height: {
              cm: parseInt(data.heightCm),
              feet: parseInt(data.heightFeet || '0'),
              inches: parseInt(data.heightInches || '0')
            },
            weight: {
              kg: parseInt(data.weightKg),
              lb: parseInt(data.weightLb || '0')
            }
          },

          // Sleep & Schedule
          schedule: {
            wake_up_time: data.wakeUpTime,
            sleep_time: data.sleepTime,
            work_start: data.workStart,
            work_end: data.workEnd,
            routine_flexibility: parseInt(data.routineFlexibility || '5')
          },

          // Meal Timings
          meals: {
            breakfast_time: data.breakfastTime,
            lunch_time: data.lunchTime,
            dinner_time: data.dinnerTime,
            diet_type: data.dietType
          },

          // Health Information
          health: {
            blood_group: data.bloodGroup,
            chronic_conditions: data.chronicConditions || [],
            takes_medications: data.takesMedications,
            medications: data.medications || [],
            has_surgery: data.hasSurgery,
            surgery_details: data.surgeryDetails || [],
            critical_conditions: data.criticalConditions || '',
            health_goals: data.healthGoals || []
          },

          // Lifestyle
          lifestyle: {
            workout_time: data.workoutTime,
            uses_wearable: data.usesWearable,
            wearable_type: data.wearableType || '',
            track_family: data.trackFamily,
            share_progress: data.shareProgress
          },

          // Reports & Progress
          reports: {
            has_health_reports: data.hasHealthReports,
            health_reports: data.healthReports || [],
            referral_code: data.referralCode || ''
          },

          // Onboarding metadata
          onboarding_completed_at: new Date().toISOString(),
          onboarding_version: '1.0',
          data_completeness: dataSummary.completeness,
          data_summary: dataSummary.categories,
          total_fields_saved: dataSummary.totalCompleted
        }
      };

      console.log('Saving comprehensive user profile:', userProfileData);

      // Step 4: Save to database with retry logic
      let retryCount = 0;
      const maxRetries = 3;
      
      while (retryCount < maxRetries) {
        try {
          const { error: upsertError } = await supabase
            .from('user_profiles')
            .upsert(userProfileData, { 
              onConflict: 'id',
              ignoreDuplicates: false 
            });

          if (upsertError) throw upsertError;
          break; // Success, exit retry loop
          
        } catch (retryError: any) {
          retryCount++;
          console.error(`Database save attempt ${retryCount} failed:`, retryError);
          
          if (retryCount === maxRetries) {
            throw retryError; // Final attempt failed
          }
          
          // Wait before retry
          await new Promise(resolve => setTimeout(resolve, 1000 * retryCount));
        }
      }

      console.log('✅ User profile saved successfully with all onboarding data');

      // Step 5: Verify data was saved correctly
      const { data: savedProfile, error: verifyError } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (verifyError) {
        console.warn('Could not verify saved data:', verifyError);
      } else {
        console.log('✅ Data verification successful:', {
          onboarding_completed: (savedProfile as any)?.onboarding_completed,
          preferences_saved: !!savedProfile.preferences,
          data_fields: Object.keys(savedProfile.preferences || {}).length
        });
      }

      // Step 6: Refresh auth context with updated profile
      try {
        await refreshProfile();
        console.log('✅ Auth context refreshed with updated profile');
        
        // Wait a moment for the auth context to update
        await new Promise(resolve => setTimeout(resolve, 500));
      } catch (refreshError) {
        console.warn('Could not refresh auth profile:', refreshError);
      }

      // Step 7: Show completion screen with detailed confirmation
      setOnboardingStep('complete');
      
      // Step 8: Navigate to custom plan with success feedback
      setTimeout(() => {
        toast.success('🎉 Welcome to UrCare!', { 
          description: `Profile setup complete! ${dataSummary.completeness}% data completeness with ${dataSummary.totalCompleted} key fields saved securely.`,
          duration: 4000
        });
        
        // Additional detailed feedback
        setTimeout(() => {
          toast.info('📋 Data Saved Successfully', {
            description: `✅ Personal Info ✅ Health Metrics ✅ Schedule ✅ Emergency Contact - All stored safely!`,
            duration: 3000
          });
        }, 1000);
        
        navigate('/custom-plan');
      }, 2500);
      
    } catch (error: any) {
      console.error('❌ Error completing onboarding:', error);
      
      // Detailed error handling
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
      <SerialOnboarding
        onComplete={handleSerialComplete}
        onBack={() => navigate('/')}
      />
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