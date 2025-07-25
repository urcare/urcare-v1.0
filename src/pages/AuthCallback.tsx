import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '../contexts/AuthContext';

interface UserProfile {
  id: string;
  full_name: string | null;
  phone: string | null;
  date_of_birth: string | null;
  gender: string | null;
  address: string | null;
  emergency_contact: string | null;
  emergency_phone: string | null;
  health_id: string | null;
  guardian_id: string | null;
  status: string;
  preferences: any;
  onboarding_completed: boolean;
  created_at: string;
  updated_at: string;
}

const AuthCallback = () => {
  const navigate = useNavigate();
  const { user: authUser, refreshProfile } = useAuth();

  // Helper: validate onboarding data (copied from Onboarding.tsx)
  const validateOnboardingData = (data) => {
    const errors = [];
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
    const currentYear = new Date().getFullYear();
    const birthYear = parseInt(data.birthYear);
    if (birthYear < currentYear - 120 || birthYear > currentYear) {
      errors.push('Invalid birth year');
    }
    const phoneRegex = /^[\+]?[\d\s\-\(\)]{10,}$/;
    if (data.emergencyContactPhone && !phoneRegex.test(data.emergencyContactPhone)) {
      errors.push('Invalid emergency contact phone number');
    }
    if (data.takesMedications === 'Yes' && (!data.medications || data.medications.length === 0)) {
      errors.push('Please list medications if you take any');
    }
    if (data.hasSurgery === 'Yes' && (!data.surgeryDetails || data.surgeryDetails.length === 0)) {
      errors.push('Please provide surgery details if you have had surgery');
    }
    return { isValid: errors.length === 0, errors };
  };

  // Helper: upload onboarding data (copied from Onboarding.tsx)
  const uploadOnboardingData = async (user, data) => {
    // Calculate derived fields
    const monthIndex = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ].indexOf(data.birthMonth) + 1;
    const date_of_birth = `${data.birthYear}-${monthIndex.toString().padStart(2, '0')}-${data.birthDay.padStart(2, '0')}`;
    const age = parseInt(data.age) || new Date().getFullYear() - parseInt(data.birthYear);
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
    const { error } = await supabase
      .from('user_profiles')
      .upsert(userProfileData, { onConflict: 'id' });
    if (error) throw error;
    if (refreshProfile) await refreshProfile();
  };

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    const handleAuthCallback = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          // Check for onboarding data in localStorage
          const pending = localStorage.getItem('pendingOnboardingData');
          if (pending) {
            try {
              const onboardingData = JSON.parse(pending);
              const validation = validateOnboardingData(onboardingData);
              if (!validation.isValid) {
                toast.error('Incomplete onboarding data', { description: validation.errors.join(', ') });
                localStorage.removeItem('pendingOnboardingData');
                navigate('/onboarding', { replace: true });
                return;
              }
              await uploadOnboardingData(user, onboardingData);
              localStorage.removeItem('pendingOnboardingData');
              toast.success('Onboarding data uploaded!');
              navigate('/custom-plan', { replace: true });
              return;
            } catch (e) {
              console.warn('Failed to parse or upload onboardingData from localStorage:', e);
              localStorage.removeItem('pendingOnboardingData');
              navigate('/onboarding', { replace: true });
              return;
            }
          }
          // No onboarding data in localStorage, check profile
          let { data: profile } = await supabase
            .from('user_profiles')
            .select('*')
            .eq('id', user.id)
            .maybeSingle();
          if (!profile) {
            // Create a minimal profile row
            const { error } = await supabase.from('user_profiles').insert([
              { id: user.id, full_name: user.email, onboarding_completed: false }
            ]);
            if (error) {
              toast.error('Failed to create user profile', { description: error.message });
              navigate('/onboarding', { replace: true });
              return;
            }
            // Fetch the new profile
            ({ data: profile } = await supabase
              .from('user_profiles')
              .select('*')
              .eq('id', user.id)
              .maybeSingle());
          }
          if (profile && profile.onboarding_completed) {
            navigate('/custom-plan', { replace: true });
            return;
          } else {
            navigate('/onboarding', { replace: true });
            return;
          }
        } else {
          navigate('/welcome');
        }
      } catch (error) {
        toast.error('Authentication failed');
        navigate('/welcome');
      }
    };
    timeoutId = setTimeout(() => {
      toast.error('Authentication timeout', {
        description: 'Taking too long to authenticate. Please try again.'
      });
      navigate('/welcome');
    }, 15000);
    handleAuthCallback();
    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [navigate, refreshProfile]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="text-center max-w-md mx-auto px-4">
        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
        <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-2">
          Completing Authentication
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mb-4">
          Setting up your secure session...
        </p>
        <div className="text-sm text-gray-500 dark:text-gray-500 mb-6">
          If this takes more than 15 seconds, you'll be redirected automatically.
        </div>
        
        <button 
          onClick={() => {
            console.log('AuthCallback: Manual navigation to onboarding');
            toast.info('Redirecting to setup...');
            navigate('/onboarding');
          }}
          className="text-blue-600 hover:text-blue-700 underline text-sm"
        >
          Having trouble? Click here to continue
        </button>
      </div>
    </div>
  );
};

export default AuthCallback; 