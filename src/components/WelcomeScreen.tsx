import React from 'react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

export const WelcomeScreen: React.FC = () => {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    navigate('/onboarding');
  };

  return (
    <div className="h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-50 to-white px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center max-w-md mx-auto"
      >
        {/* Logo */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 120, damping: 12, delay: 0.2 }}
          className="mb-12"
        >
          <div className="w-24 h-24 mx-auto mb-8">
            <img 
              src="/brand.png" 
              alt="UrCare Logo" 
              className="w-full h-full drop-shadow-lg rounded-xl" 
            />
          </div>
        </motion.div>

        {/* Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mb-16"
        >
          <h1 className="text-3xl font-light text-gray-900 dark:text-gray-100 mb-4">
            Welcome to UrCare
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
            Your personalized health companion.<br/>
            Let's start by getting to know you better.
          </p>
        </motion.div>

        {/* Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <Button 
            onClick={handleGetStarted} 
            className="w-full max-w-sm text-white py-4 px-8 rounded-2xl text-lg font-medium transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
            style={{ backgroundColor: '#008000' }}
          >
            Get Started
            <ArrowRight className="ml-2 w-5 h-5" />
          </Button>
        </motion.div>

        {/* Footer text */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="mt-8"
        >
          <p className="text-sm text-gray-500 dark:text-gray-400">
            This will take about 3-5 minutes
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
}; 