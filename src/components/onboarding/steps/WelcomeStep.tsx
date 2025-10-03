import React from 'react';
import { motion } from 'framer-motion';
import { User, Heart, Sparkles } from 'lucide-react';

interface WelcomeStepProps {
  fullName: string;
}

export const WelcomeStep: React.FC<WelcomeStepProps> = ({ fullName }) => {
  const displayName = fullName.trim() || 'there';
  const firstName = displayName.split(' ')[0];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="text-center w-full"
    >
      <div className="mb-6 sm:mb-8">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6"
        >
          <User className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
        </motion.div>
        
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-xl sm:text-2xl font-semibold text-gray-900 mb-3 sm:mb-4 px-2"
        >
          Welcome, {firstName}! 👋
        </motion.h1>
        
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-gray-600 text-base sm:text-lg leading-relaxed mb-4 sm:mb-6 px-2"
        >
          We're excited to help you on your health journey. 
          Let's get to know you better so we can personalize your experience.
        </motion.p>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.5 }}
        className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-4 sm:p-6 border border-blue-100 mx-2"
      >
        <div className="flex items-center justify-center space-x-3 sm:space-x-4 mb-3 sm:mb-4">
          <Heart className="w-4 h-4 sm:w-5 sm:h-5 text-red-500" />
          <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-500" />
          <Heart className="w-4 h-4 sm:w-5 sm:h-5 text-red-500" />
        </div>
        <p className="text-xs sm:text-sm text-gray-600">
          This will only take a few minutes and will help us create your personalized health plan.
        </p>
      </motion.div>
    </motion.div>
  );
}; 