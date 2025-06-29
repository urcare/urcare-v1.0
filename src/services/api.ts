import { supabase } from '../integrations/supabase/client';

export interface OnboardingData {
  first_name: string;
  last_name: string;
  date_of_birth: string;
  age: number;
  height: string;
  weight: string;
  gender: string;
  address: string;
  phone: string;
  blood_type: string;
  emergency_contact: string;
  emergency_phone: string;
  allergies: string;
  medical_conditions: string;
  selected_conditions: string[];
  medications: string;
  selected_medications: string[];
  insurance_provider: string;
  insurance_number: string;
  insurance_group: string;
  insurance_phone: string;
}

class ApiService {
  /**
   * Save onboarding data to user profile
   */
  async saveOnboardingData(userId: string, data: OnboardingData): Promise<boolean> {
    try {
      const fullName = `${data.first_name} ${data.last_name}`.trim();
      const allConditions = [...data.selected_conditions];
      if (data.medical_conditions) {
        allConditions.push(data.medical_conditions);
      }
      
      const allMedications = [...data.selected_medications];
      if (data.medications) {
        allMedications.push(data.medications);
      }

      const profileData = {
        full_name: fullName,
        phone: data.phone,
        date_of_birth: data.date_of_birth,
        gender: data.gender,
        address: data.address,
        emergency_contact: data.emergency_contact,
        preferences: {
          blood_type: data.blood_type,
          allergies: data.allergies,
          medical_conditions: allConditions.join(', '),
          medications: allMedications.join(', '),
          insurance_provider: data.insurance_provider,
          insurance_number: data.insurance_number,
          insurance_group: data.insurance_group,
          insurance_phone: data.insurance_phone,
          height: data.height,
          weight: data.weight,
          age: data.age
        },
        updated_at: new Date().toISOString()
      };

      // Try to update existing profile
      const { error: updateError } = await supabase
        .from('user_profiles')
        .update(profileData)
        .eq('id', userId);

      if (updateError) {
        // If update fails, try to insert new profile
        const { error: insertError } = await supabase
          .from('user_profiles')
          .insert({
            id: userId,
            ...profileData,
            role: 'patient',
            status: 'active'
          });

        if (insertError) {
          console.error('Failed to save onboarding data:', insertError);
          return false;
        }
      }

      return true;
    } catch (error) {
      console.error('Error saving onboarding data:', error);
      return false;
    }
  }

  /**
   * Mark onboarding as completed
   */
  async completeOnboarding(userId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('user_profiles')
        .update({
          onboarding_completed: true,
          updated_at: new Date().toISOString()
        })
        .eq('id', userId);

      if (error) {
        console.error('Failed to mark onboarding as completed:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error completing onboarding:', error);
      return false;
    }
  }

  /**
   * Get user profile data
   */
  async getUserProfile(userId: string) {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('Error fetching user profile:', error);
        return null;
      }

      return data;
    } catch (error) {
      console.error('Error in getUserProfile:', error);
      return null;
    }
  }
}

export const apiService = new ApiService(); 