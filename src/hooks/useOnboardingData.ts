
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface OnboardingData {
  profile?: {
    profilePhoto: string;
    firstName: string;
    lastName: string;
    age: string;
    height: string;
    weight: string;
    gender: string;
  };
  conditions?: {
    conditions: string[];
    noConditions: boolean;
  };
  medications?: {
    medications: string[];
    noMedications: boolean;
  };
  lifestyle?: {
    sleepQuality: string;
    stressLevel: string;
  };
  healthRecords?: {
    healthRecords: File[];
  };
  wearables?: {
    connectedDevices: string[];
    skipWearables: boolean;
  };
  goals?: {
    healthGoals: string[];
  };
}

export const useOnboardingData = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const saveOnboardingData = async (allData: OnboardingData) => {
    setIsSubmitting(true);
    
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error('User not authenticated');
      }

      // Transform the collected data to match database schema
      const onboardingRecord = {
        user_id: user.id,
        full_name: allData.profile ? `${allData.profile.firstName} ${allData.profile.lastName}` : null,
        age: allData.profile?.age ? parseInt(allData.profile.age) : null,
        height_cm: allData.profile?.height ? parseInt(allData.profile.height) : null,
        weight_kg: allData.profile?.weight ? parseInt(allData.profile.weight) : null,
        gender: allData.profile?.gender || null,
        medical_conditions: allData.conditions?.noConditions ? [] : (allData.conditions?.conditions || []),
        medications: allData.medications?.noMedications ? [] : (allData.medications?.medications || []),
        sleep_quality: allData.lifestyle?.sleepQuality || null,
        stress_level: allData.lifestyle?.stressLevel || null,
        health_goals: allData.goals?.healthGoals || [],
        profile_photo_url: allData.profile?.profilePhoto || null,
        records_uploaded: allData.healthRecords ? allData.healthRecords.healthRecords.length > 0 : false,
        wearable_connected: allData.wearables ? !allData.wearables.skipWearables && allData.wearables.connectedDevices.length > 0 : false
      };

      // Use upsert to handle potential duplicate entries
      const { error } = await supabase
        .from('user_onboarding')
        .upsert(onboardingRecord, { 
          onConflict: 'user_id',
          ignoreDuplicates: false 
        });

      if (error) {
        throw error;
      }

      toast.success('Onboarding completed successfully!', {
        description: 'Your health profile has been saved.'
      });

      return { success: true };
    } catch (error) {
      console.error('Error saving onboarding data:', error);
      toast.error('Failed to save onboarding data', {
        description: error instanceof Error ? error.message : 'Please try again.'
      });
      return { success: false, error };
    } finally {
      setIsSubmitting(false);
    }
  };

  const getOnboardingData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        return null;
      }

      const { data, error } = await supabase
        .from('user_onboarding')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (error) {
        throw error;
      }

      return data;
    } catch (error) {
      console.error('Error fetching onboarding data:', error);
      return null;
    }
  };

  return {
    saveOnboardingData,
    getOnboardingData,
    isSubmitting
  };
};
