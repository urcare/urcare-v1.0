import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'sonner';
import { SerialOnboarding } from '../components/onboarding/SerialOnboarding';
import { supabase } from '@/integrations/supabase/client';
import { AuthOptions } from '@/components/auth/AuthOptions';

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
  const [showAuth, setShowAuth] = useState(false);

  // Show auth popup if not authenticated
  useEffect(() => {
    if (!user) setShowAuth(true);
    else setShowAuth(false);
  }, [user]);

  // Redirect to /custom-plan if onboarding is already complete
  useEffect(() => {
    if (profile && profile.onboarding_completed) {
      navigate('/custom-plan', { replace: true });
    }
  }, [profile, navigate]);

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

  // Fallback: create profile row if missing
  useEffect(() => {
    if (user && !profile) {
      supabase.from('user_profiles').insert([
        { id: user.id, full_name: user.email, onboarding_completed: false }
      ]).then(({ error }) => {
        if (error) {
          console.error('Failed to create user profile in onboarding fallback:', error);
        } else {
          console.log('Created user profile in onboarding fallback for user:', user.id);
        }
      });
    }
  }, [user, profile]);

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

      // Clean and validate data before sending to database
      const cleanUserProfileData = {
        id: user.id,
        full_name: data.fullName?.trim() || '',
        age: age || 0,
        date_of_birth: date_of_birth || null,
        gender: data.gender || null,
        unit_system: data.unitSystem || 'imperial',
        height_feet: data.heightFeet || null,
        height_inches: data.heightInches || null,
        height_cm: data.heightCm || null,
        weight_lb: data.weightLb || null,
        weight_kg: data.weightKg || null,
        wake_up_time: data.wakeUpTime || null,
        sleep_time: data.sleepTime || null,
        work_start: data.workStart || null,
        work_end: data.workEnd || null,
        chronic_conditions: Array.isArray(data.chronicConditions) ? data.chronicConditions : [],
        takes_medications: data.takesMedications || null,
        medications: Array.isArray(data.medications) ? data.medications : [],
        has_surgery: data.hasSurgery || null,
        surgery_details: Array.isArray(data.surgeryDetails) ? data.surgeryDetails : [],
        health_goals: Array.isArray(data.healthGoals) ? data.healthGoals : [],
        diet_type: data.dietType || null,
        blood_group: data.bloodGroup || null,
        breakfast_time: data.breakfastTime || null,
        lunch_time: data.lunchTime || null,
        dinner_time: data.dinnerTime || null,
        workout_time: data.workoutTime || null,
        routine_flexibility: data.routineFlexibility || null,
        uses_wearable: data.usesWearable || null,
        wearable_type: data.wearableType || null,
        track_family: data.trackFamily || null,
        share_progress: data.shareProgress || null,
        emergency_contact_name: data.emergencyContactName || null,
        emergency_contact_phone: data.emergencyContactPhone || null,
        critical_conditions: data.criticalConditions || null,
        has_health_reports: data.hasHealthReports || null,
        health_reports: Array.isArray(data.healthReports) ? data.healthReports : [],
        referral_code: data.referralCode || null,
        save_progress: data.saveProgress || null,
        onboarding_completed: true,
        status: 'active',
        preferences: preferences || {},
        updated_at: new Date().toISOString()
      };

      const userProfileData = cleanUserProfileData;

      // Debug log before upsert
      console.log('Final userProfileData for upsert:', userProfileData);
      console.log('User id for upsert:', user.id);
      console.log('Supabase client available:', !!supabase);
      console.log('Supabase URL configured:', !!import.meta.env.VITE_SUPABASE_URL);
      console.log('Supabase key configured:', !!import.meta.env.VITE_SUPABASE_ANON_KEY);

      // Check if Supabase is properly configured
      if (!import.meta.env.VITE_SUPABASE_URL || !import.meta.env.VITE_SUPABASE_ANON_KEY) {
        console.error('❌ Supabase environment variables are missing!');
        toast.error('Configuration Error', {
          description: 'Supabase is not properly configured. Please check your environment variables.',
          duration: 6000
        });
        setLoading(false);
        return;
      }

      // Step 4: Save to user_profiles table with upsert
      console.log('Attempting to upsert user profile data...');
      
      // Add timeout protection for the database operation
      const upsertPromise = supabase
        .from('user_profiles')
        .upsert(userProfileData, { onConflict: 'id' });
      
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Database operation timed out')), 10000)
      );
      
      const { error, data: upsertData } = await Promise.race([upsertPromise, timeoutPromise]) as any;

      // Debug log after upsert
      console.log('Upsert result:', { error, upsertData });
      console.log('Error details:', error?.message, error?.details, error?.hint);

      if (error) {
        console.error('❌ Database upsert failed:', error);
        console.error('Error code:', error.code);
        console.error('Error message:', error.message);
        console.error('Error details:', error.details);
        console.error('Error hint:', error.hint);
        
        // Try fallback approach - insert instead of upsert
        console.log('Trying fallback insert approach...');
        const { error: insertError, data: insertData } = await supabase
          .from('user_profiles')
          .insert(userProfileData);
        
        if (insertError) {
          console.error('❌ Fallback insert also failed:', insertError);
          
          // Provide more specific error messages
          let errorMessage = 'There was an error saving your profile.';
          if (error.code === 'PGRST116') {
            errorMessage = 'User profile not found. Please try signing in again.';
          } else if (error.code === '42501') {
            errorMessage = 'Permission denied. Please check your database permissions.';
          } else if (error.message?.includes('duplicate')) {
            errorMessage = 'Profile already exists. Updating existing profile...';
          } else if (error.message?.includes('network')) {
            errorMessage = 'Network error. Please check your connection and try again.';
          } else if (error.message?.includes('validation')) {
            errorMessage = 'Data validation error. Please check your information.';
          }
          
          toast.error('Database Error', {
            description: errorMessage,
            duration: 6000
          });
          throw error;
        } else {
          console.log('✅ Fallback insert successful:', insertData);
        }
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

  // Show auth popup if not authenticated
  if (showAuth) {
    return <AuthOptions onboardingData={{}} onAuthSuccess={() => setShowAuth(false)} />;
  }

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
      <div className="h-screen flex flex-col items-center justify-center bg-gradient-to-br from-green-50 to-blue-50 px-4 overflow-hidden">
        <div className="text-center max-w-sm sm:max-w-md">
          <div className="w-16 h-16 sm:w-20 sm:h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6 sm:mb-8">
            <svg className="w-8 h-8 sm:w-10 sm:h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3 sm:mb-4">
            Profile Setup Complete!
          </h2>
          <p className="text-base sm:text-lg text-gray-600 mb-6 sm:mb-8">
            Your profile has been successfully saved. You can now start using UrCare.
          </p>
          <button 
            onClick={() => navigate('/custom-plan')}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 sm:py-4 px-6 sm:px-8 rounded-2xl text-base sm:text-lg font-medium transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
          >
            Continue to Custom Plan
          </button>
        </div>
      </div>
    );
  }

  return null;
};

export default Onboarding; 