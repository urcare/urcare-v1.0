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
  onGetStarted?: () => void;
  onAlreadyMember?: () => void;
}

export const OnDemandLandingPage = ({ showModal = false, onGetStarted, onAlreadyMember }: OnDemandLandingPageProps) => {
  const navigate = useNavigate();
  // Remove showLogin state and related modal logic

  // Unified login handler - removed as OAuth is now handled by AuthOptions component
  const handleLogin = async (provider: 'apple' | 'google' | 'email') => {
    // This function is no longer used as OAuth is handled by AuthOptions
    console.log('handleLogin called but not used');
  };

  return (
    <div className="h-screen bg-gradient-to-br from-gray-50 to-white relative overflow-hidden">
      {/* Main Content */}
      <div className="py-6 sm:py-8 px-4 sm:px-6 h-full flex flex-col justify-center">
        {/* Grid Layout */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="grid grid-cols-3 gap-2 sm:gap-3 h-[35vh] sm:h-[45vh] mb-4 sm:mb-6 flex-shrink-0"
        >
          {GRID_IMAGES.map((image, index) => (
            <motion.div
              key={image.id}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className={`${image.className} rounded-2xl sm:rounded-3xl overflow-hidden bg-gray-200 relative group cursor-pointer`}
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
          className="text-center space-y-3 sm:space-y-4 flex-shrink-0"
        >
          <h1 className="text-2xl sm:text-4xl font-light text-gray-900 leading-tight px-2">
            Your Health, Your Way
          </h1>
          
          <p className="text-base sm:text-lg text-gray-600 font-normal max-w-sm mx-auto px-2">
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
                onClick={onGetStarted}
                className="w-full max-w-sm bg-gray-900 hover:bg-gray-800 text-white py-3 sm:py-4 px-6 sm:px-8 rounded-2xl text-base sm:text-lg font-medium transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
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
                onClick={onAlreadyMember}
                variant="outline"
                className="w-full max-w-sm bg-transparent border-gray-300 text-gray-900 hover:bg-gray-50 py-3 sm:py-4 px-6 sm:px-8 rounded-2xl text-base sm:text-lg font-medium transition-all duration-300"
              >
                I'm already a member
              </Button>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}; 