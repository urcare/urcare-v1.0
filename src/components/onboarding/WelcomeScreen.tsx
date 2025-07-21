import React from 'react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

interface WelcomeScreenProps {
  onContinue: () => void;
}

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onContinue }) => {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
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
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-12"
        >
          <div className="w-24 h-24 mx-auto mb-8">
            {/* UrCare Logo - Green Heart with Medical Cross and Circuit Patterns */}
            <svg
              width="96"
              height="96"
              viewBox="0 0 96 96"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="w-full h-full drop-shadow-lg"
            >
              {/* Heart Shape */}
              <path
                d="M48 84C48 84 12 60 12 36C12 24 21.6 14 33.6 14C40.8 14 46.8 18 48 24C49.2 18 55.2 14 62.4 14C74.4 14 84 24 84 36C84 60 48 84 48 84Z"
                fill="#22C55E"
                stroke="#16A34A"
                strokeWidth="2"
              />
              
              {/* Medical Cross */}
              <g transform="translate(58, 20)">
                <rect x="6" y="2" width="4" height="12" fill="white" rx="1"/>
                <rect x="2" y="6" width="12" height="4" fill="white" rx="1"/>
              </g>
              
              {/* Circuit Patterns */}
              <g transform="translate(16, 28)" stroke="white" strokeWidth="1.5" fill="none">
                <circle cx="4" cy="4" r="2"/>
                <circle cx="4" cy="12" r="2"/>
                <circle cx="12" cy="8" r="2"/>
                <line x1="4" y1="6" x2="4" y2="10"/>
                <line x1="6" y1="4" x2="10" y2="8"/>
                <line x1="6" y1="12" x2="10" y2="8"/>
              </g>
              
              {/* Additional circuit elements */}
              <g transform="translate(20, 40)" stroke="white" strokeWidth="1" fill="white">
                <circle cx="2" cy="2" r="1"/>
                <circle cx="8" cy="6" r="1"/>
                <circle cx="14" cy="2" r="1"/>
                <line x1="2" y1="2" x2="8" y2="6" stroke="white" strokeWidth="0.8"/>
                <line x1="8" y1="6" x2="14" y2="2" stroke="white" strokeWidth="0.8"/>
              </g>
            </svg>
          </div>
        </motion.div>

        {/* Welcome Text */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mb-16"
        >
          <h1 className="text-3xl font-light text-gray-900 mb-4">
            Welcome to UrCare
          </h1>
          <p className="text-lg text-gray-600 leading-relaxed">
            Before you begin, let's take a few minutes to learn more about you!
          </p>
        </motion.div>

        {/* Continue Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <Button
            onClick={onContinue}
            className="w-full max-w-sm bg-gray-900 hover:bg-gray-800 text-white py-4 px-8 rounded-2xl text-lg font-medium transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
          >
            Continue
          </Button>
        </motion.div>
      </motion.div>
    </div>
  );
}; 