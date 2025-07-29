import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

export const WelcomeScreen: React.FC = () => {
  const navigate = useNavigate();
  const [logoLoaded, setLogoLoaded] = useState(false);

  useEffect(() => {
    const img = new window.Image();
    img.src = '/brand.png';
    img.onload = () => setLogoLoaded(true);
  }, []);

  const handleGetStarted = () => {
    navigate('/onboarding');
  };

  return (
    <div className="h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 px-4 overflow-hidden">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center max-w-sm sm:max-w-md mx-auto"
      >
        {/* Logo */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: logoLoaded ? 1 : 0.8, opacity: logoLoaded ? 1 : 0 }}
          transition={{ type: 'spring', stiffness: 120, damping: 12, delay: 0.2 }}
          className="mb-8 sm:mb-12"
          style={{ willChange: 'transform, opacity' }}
        >
          <div className="w-20 h-20 sm:w-24 sm:h-24 mx-auto mb-6 sm:mb-8">
            <img src="/brand.png" alt="UrCare Logo" className="w-full h-full drop-shadow-lg rounded-xl" style={{ opacity: logoLoaded ? 1 : 0 }} />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mb-12 sm:mb-16"
        >
          <h1 className="text-2xl sm:text-3xl font-light text-gray-900 dark:text-gray-100 mb-3 sm:mb-4">
            Welcome to UrCare
          </h1>
          <p className="text-base sm:text-lg text-gray-600 dark:text-gray-300 leading-relaxed px-2">
            Your personalized health companion.<br/>
            Let's start by getting to know you better.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <Button 
            onClick={handleGetStarted} 
            className="w-full max-w-sm bg-gray-900 hover:bg-gray-800 text-white py-3 sm:py-4 px-6 sm:px-8 rounded-2xl text-base sm:text-lg font-medium transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
          >
            Get Started
            <ArrowRight className="ml-2 w-4 h-4 sm:w-5 sm:h-5" />
          </Button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="mt-6 sm:mt-8"
        >
          <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
            This will take about 3-5 minutes
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
}; 