import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';

interface NameStepProps {
  onContinue: (name: string) => void;
  onBack: () => void;
  initialValue?: string;
}

export const NameStep: React.FC<NameStepProps> = ({ onContinue, onBack, initialValue = '' }) => {
  const [name, setName] = useState(initialValue);
  const [showContinue, setShowContinue] = useState(false);

  useEffect(() => {
    // Show continue button when name has at least 2 characters
    setShowContinue(name.trim().length >= 2);
  }, [name]);

  const handleContinue = () => {
    if (name.trim()) {
      onContinue(name.trim());
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && showContinue) {
      handleContinue();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header with back button and progress */}
      <div className="flex items-center justify-between p-4 pt-12">
        <Button
          variant="ghost"
          size="sm"
          onClick={onBack}
          className="p-2 hover:bg-gray-100 rounded-full"
        >
          <ArrowLeft className="w-6 h-6 text-gray-600" />
        </Button>
        
        {/* Progress bar */}
        <div className="flex-1 mx-8">
          <div className="w-full bg-gray-200 rounded-full h-1">
            <div className="bg-gray-800 h-1 rounded-full w-1/6 transition-all duration-300"></div>
          </div>
        </div>
        
        <div className="w-10"></div> {/* Spacer for balance */}
      </div>

      {/* Main content */}
      <div className="flex-1 flex items-center justify-center px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-md text-center"
        >
          {/* Question */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-2xl font-normal text-gray-900 mb-12"
          >
            What's your first name?
          </motion.h1>

          {/* Name Input */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mb-16"
          >
            <Input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder=""
              className="text-center text-3xl font-normal border-none bg-transparent focus:ring-0 focus:outline-none text-gray-900 placeholder-gray-400 p-0 h-auto"
              style={{ boxShadow: 'none' }}
              autoFocus
            />
            <div className="w-full h-px bg-gray-200 mt-2"></div>
          </motion.div>
        </motion.div>
      </div>

      {/* Continue Button */}
      <div className="p-6 pb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ 
            opacity: showContinue ? 1 : 0, 
            y: showContinue ? 0 : 20 
          }}
          transition={{ duration: 0.3 }}
        >
          <Button
            onClick={handleContinue}
            disabled={!showContinue}
            className="w-full bg-gray-900 hover:bg-gray-800 text-white py-4 px-8 rounded-2xl text-lg font-medium transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl disabled:opacity-0 disabled:cursor-not-allowed"
          >
            Continue
          </Button>
        </motion.div>
      </div>
    </div>
  );
}; 