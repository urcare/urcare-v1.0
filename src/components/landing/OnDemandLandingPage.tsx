import React from 'react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { GRID_IMAGES } from './constants';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { AuthOptions } from '@/components/auth/AuthOptions';
import { Mail } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface OnDemandLandingPageProps {
  showModal?: boolean;
}

export const OnDemandLandingPage = ({ showModal = false }: OnDemandLandingPageProps) => {
  const navigate = useNavigate();
  const [showLogin, setShowLogin] = React.useState(false);

  // Unified login handler
  const handleLogin = async (provider: 'apple' | 'google' | 'email') => {
    let error = null;
    if (provider === 'google') {
      ({ error } = await supabase.auth.signInWithOAuth({ provider: 'google' }));
    } else if (provider === 'apple') {
      ({ error } = await supabase.auth.signInWithOAuth({ provider: 'apple' }));
    } else if (provider === 'email') {
      // You may want to show an email/password form/modal here
      // For now, just return
      return;
    }
    if (!error) {
      // Wait for auth state to update
      setTimeout(async () => {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          // Fetch onboarding status and subscription
          const { data, error } = await supabase
            .from('onboarding_submissions')
            .select('onboarding_completed, preferences')
            .eq('user_id', user.id)
            .single();
          if (!data || !data.onboarding_completed) {
            navigate('/onboarding');
          } else {
            // Check subscription in preferences (assuming preferences.subscription === 'active')
            const isSubscribed = data.preferences && data.preferences.subscription === 'active';
            if (isSubscribed) {
              navigate('/dashboard');
            } else {
              navigate('/custom-plan');
            }
          }
        }
      }, 1000);
    }
  };

  return (
    <div className="h-screen bg-gradient-to-br from-gray-50 to-white relative overflow-hidden">
      {/* Main Content */}
      <div className="py-8 px-6 h-full flex flex-col justify-center">
        {/* Grid Layout */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="grid grid-cols-3 gap-3 h-[45vh] mb-6 flex-shrink-0"
        >
          {GRID_IMAGES.map((image, index) => (
            <motion.div
              key={image.id}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className={`${image.className} rounded-3xl overflow-hidden bg-gray-200 relative group cursor-pointer`}
            >
              <div 
                className="w-full h-full bg-cover bg-center transition-transform duration-300 group-hover:scale-105"
                style={{ backgroundImage: `url('${image.url}')`, backgroundColor: '#f3f4f6' }}
              />
              <div className="absolute inset-0 bg-black/5 group-hover:bg-black/10 transition-colors duration-300" />
            </motion.div>
          ))}
        </motion.div>

        {/* Text Content */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-center space-y-4 flex-shrink-0"
        >
          <h1 className="text-4xl font-light text-gray-900 leading-tight">
            Your Health,Your Way
          </h1>
          
          <p className="text-lg text-gray-600 font-normal max-w-sm mx-auto">
            Anytime, Anywhere.
          </p>

          {/* CTA Buttons */}
          <div className="space-y-3 pt-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
            >
              <Button
                onClick={() => navigate('/welcome')}
                className="w-full max-w-sm bg-gray-900 hover:bg-gray-800 text-white py-4 px-8 rounded-2xl text-lg font-medium transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
              >
                Get started
              </Button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1.0 }}
            >
              <Button
                onClick={() => setShowLogin(true)}
                variant="outline"
                className="w-full max-w-sm bg-transparent border-gray-300 text-gray-900 hover:bg-gray-50 py-4 px-8 rounded-2xl text-lg font-medium transition-all duration-300"
              >
                I'm already a member
              </Button>
            </motion.div>
          </div>
        </motion.div>
      </div>

      {/* Login Dialog - half screen bottom sheet style */}
      {showLogin && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/30">
          <div className="w-full max-w-md bg-white rounded-t-3xl shadow-xl pb-8 pt-4 px-6 animate-slide-up" style={{ minHeight: '50vh' }}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold mx-auto">Sign In</h2>
              <button onClick={() => setShowLogin(false)} className="text-2xl font-light absolute right-6 top-6">&times;</button>
            </div>
            <div className="space-y-4">
              <button
                onClick={() => handleLogin('apple')}
                className="w-full flex items-center justify-center gap-3 bg-black text-white rounded-full py-4 text-lg font-medium mb-2"
              >
                <svg width="24" height="24" fill="currentColor" className="inline-block"><path d="M16.365 1.43c0 1.14-.93 2.06-2.07 2.06-.03-1.18.95-2.06 2.07-2.06zm4.44 15.13c-.06-.12-2.13-1.04-2.13-3.09 0-2.43 1.98-3.5 2.07-3.56-1.13-1.66-2.89-1.89-3.5-1.91-1.5-.15-2.93.88-3.7.88-.77 0-1.97-.86-3.24-.84-1.67.03-3.22.97-4.08 2.47-1.74 3.01-.45 7.47 1.25 9.92.83 1.18 1.81 2.5 3.1 2.45 1.25-.05 1.72-.8 3.23-.8 1.51 0 1.92.8 3.24.78 1.34-.02 2.18-1.19 2.99-2.37.53-.77.75-1.18 1.17-2.07-3.07-1.18-3.56-5.6.07-6.7z"/></svg>
                Sign in with Apple
              </button>
              <button
                onClick={() => handleLogin('google')}
                className="w-full flex items-center justify-center gap-3 border-2 border-black rounded-full py-4 text-lg font-medium mb-2 bg-white"
              >
                <svg className="h-6 w-6" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
                Sign in with Google
              </button>
              <button
                onClick={() => handleLogin('email')}
                className="w-full flex items-center justify-center gap-3 border-2 border-black rounded-full py-4 text-lg font-medium bg-white"
              >
                <Mail className="h-6 w-6" />
                Continue with email
              </button>
            </div>
            <div className="text-xs text-center text-gray-500 mt-6">
              By continuing you agree to UrCare's{' '}
              <a href="#" className="underline">Terms and Conditions</a> and{' '}
              <a href="#" className="underline">Privacy Policy</a>.
            </div>
          </div>
        </div>
      )}
    </div>
  );
}; 