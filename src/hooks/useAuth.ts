
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export type UserRole = 'Patient' | 'Doctor' | 'Nurse' | 'Admin' | 'Pharmacy' | 'Lab' | 'Reception';

export const useAuth = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const signUp = async (email: string, password: string, fullName: string, role: UserRole) => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
            role: role
          },
          emailRedirectTo: `${window.location.origin}/auth`
        }
      });

      if (error) throw error;

      if (data?.user) {
        toast.success('Account created successfully!', {
          description: 'Please check your email to verify your account.'
        });
        // Don't redirect immediately, let them verify email first
      }
    } catch (error: any) {
      console.error('Signup error:', error);
      toast.error('Signup failed', {
        description: error.message
      });
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (email: string, password: string, rememberMe: boolean = false) => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) throw error;

      if (data?.user) {
        // Fetch user role from the users table
        const { data: userData, error: userError } = await supabase
          .from('users')
          .select('role, full_name')
          .eq('id', data.user.id)
          .single();

        if (userError) {
          console.error('Error fetching user data:', userError);
          // Fallback to metadata if users table query fails
          const role = data.user.user_metadata?.role || 'Patient';
          redirectToRoleDashboard(role);
        } else {
          redirectToRoleDashboard(userData.role);
        }

        toast.success('Login successful!', {
          description: `Welcome back${userData?.full_name ? `, ${userData.full_name}` : ''}!`
        });
      }
    } catch (error: any) {
      console.error('Login error:', error);
      toast.error('Login failed', {
        description: error.message
      });
    } finally {
      setLoading(false);
    }
  };

  const redirectToRoleDashboard = (role: string) => {
    const roleRoutes: Record<string, string> = {
      'Patient': '/dashboard/patient',
      'Doctor': '/dashboard/doctor', 
      'Nurse': '/dashboard/nurse',
      'Admin': '/dashboard/admin',
      'Pharmacy': '/dashboard/pharmacy',
      'Lab': '/dashboard/lab',
      'Reception': '/dashboard/reception'
    };

    const route = roleRoutes[role] || '/dashboard/patient';
    navigate(route);
  };

  return {
    signUp,
    signIn,
    loading
  };
};
