import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { motion } from 'framer-motion';
import { ArrowLeft, CheckCircle, Sparkles } from 'lucide-react';
import { 
  ONBOARDING_ANIMATIONS, 
  ONBOARDING_BUTTON_STYLES, 
  ONBOARDING_LAYOUTS,
  PROGRESS_BAR_STYLES,
  COMPLETION_FEATURES
} from './constants';

interface OnboardingStepsProps {
  stepType: 'welcome' | 'name' | 'greeting' | 'complete';
  userName?: string;
  initialValue?: string;
  progressWidth?: string;
  onContinue?: (value?: string) => void;
  onBack?: () => void;
  onDataChange?: (data: any) => void;
}

export const OnboardingSteps: React.FC<OnboardingStepsProps> = ({
  stepType,
  userName,
  initialValue = '',
  progressWidth = 'w-1/6',
  onContinue,
  onBack,
  onDataChange
}) => {
  const [inputValue, setInputValue] = useState(initialValue);
  const [showContinue, setShowContinue] = useState(stepType !== 'name');

  useEffect(() => {
    if (stepType === 'name') {
      setShowContinue(inputValue.trim().length >= 2);
    }
  }, [inputValue, stepType]);

  const handleContinue = () => {
    if (stepType === 'name' && inputValue.trim()) {
      onContinue?.(inputValue.trim());
    } else {
      onContinue?.();
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && showContinue && stepType === 'name') {
      handleContinue();
    }
  };

  // Welcome Screen
  if (stepType === 'welcome') {
    return (
      <div className={ONBOARDING_LAYOUTS.centered}>
        <motion.div
          initial={ONBOARDING_ANIMATIONS.containerInitial}
          animate={ONBOARDING_ANIMATIONS.containerAnimate}
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
              <img src="/brand.png" alt="UrCare Logo" className="w-full h-full drop-shadow-lg rounded-xl" />
            </div>
          </motion.div>

          <motion.div
            initial={ONBOARDING_ANIMATIONS.itemInitial}
            animate={ONBOARDING_ANIMATIONS.itemAnimate}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mb-16"
          >
            <h1 className="text-3xl font-light text-gray-900 mb-4">Welcome to UrCare</h1>
            <p className="text-lg text-gray-600 leading-relaxed">
              Before you begin, let's take a few minutes to learn more about you!
            </p>
          </motion.div>

          <motion.div
            initial={ONBOARDING_ANIMATIONS.itemInitial}
            animate={ONBOARDING_ANIMATIONS.itemAnimate}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <Button onClick={handleContinue} className={ONBOARDING_BUTTON_STYLES.secondary}>
              Continue
            </Button>
          </motion.div>
        </motion.div>
      </div>
    );
  }

  // Complete Screen
  if (stepType === 'complete') {
    return (
      <div className="text-center space-y-8">
        <div className="relative">
          <div className="w-24 h-24 bg-gradient-to-r from-teal-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse">
            <CheckCircle className="w-12 h-12 text-white" />
          </div>
          <div className="absolute -top-2 -right-2 animate-bounce">
            <Sparkles className="w-8 h-8 text-yellow-400" />
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-3xl font-light text-gray-900">You're All Set!</h2>
          <p className="text-lg text-gray-600 max-w-md mx-auto">
            Based on your inputs, your personalized health journey begins now.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-2xl mx-auto">
          {COMPLETION_FEATURES.map((feature, index) => (
            <div key={index} className={`p-4 bg-gradient-to-br ${feature.gradient} rounded-lg`}>
              <feature.icon className={`w-8 h-8 ${feature.iconColor} mx-auto mb-2`} />
              <h4 className="font-medium text-gray-900 mb-1">{feature.title}</h4>
              <p className="text-sm text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>

        <div className="bg-gradient-to-r from-teal-50 to-blue-50 p-6 rounded-xl">
          <p className="text-teal-800 font-medium mb-2">
            "Your journey to better health starts with a single step."
          </p>
          <p className="text-sm text-teal-700">
            We're here to guide you every step of the way. Welcome to UrCare!
          </p>
        </div>
      </div>
    );
  }

  // Steps with navigation (name, greeting)
  return (
    <div className={ONBOARDING_LAYOUTS.fullScreen}>
      {/* Header with back button and progress */}
      {onBack && (
        <div className={ONBOARDING_LAYOUTS.header}>
          <Button variant="ghost" size="sm" onClick={onBack} className={ONBOARDING_BUTTON_STYLES.ghost}>
            <ArrowLeft className="w-6 h-6 text-gray-600" />
          </Button>
          
          <div className={PROGRESS_BAR_STYLES.container}>
            <div className={PROGRESS_BAR_STYLES.track}>
              <div className={`${PROGRESS_BAR_STYLES.fill} ${progressWidth}`}></div>
            </div>
          </div>
          
          <div className="w-10"></div>
        </div>
      )}

      {/* Main content */}
      <div className={ONBOARDING_LAYOUTS.content}>
        <motion.div
          initial={ONBOARDING_ANIMATIONS.containerInitial}
          animate={ONBOARDING_ANIMATIONS.containerAnimate}
          transition={ONBOARDING_ANIMATIONS.containerTransition}
          className="w-full max-w-md text-center"
        >
          {stepType === 'greeting' && (
            <>
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="mb-12"
              >
                <div className="text-8xl mb-4">👋</div>
              </motion.div>

              <motion.h1
                initial={ONBOARDING_ANIMATIONS.itemInitial}
                animate={ONBOARDING_ANIMATIONS.itemAnimate}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="text-2xl font-normal text-gray-900 mb-8"
              >
                Nice to meet you, {userName}!
              </motion.h1>

              <motion.p
                initial={ONBOARDING_ANIMATIONS.itemInitial}
                animate={ONBOARDING_ANIMATIONS.itemAnimate}
                transition={{ duration: 0.6, delay: 0.6 }}
                className="text-lg text-gray-600 leading-relaxed"
              >
                UrCare is your health companion, helping you track fitness, nutrition, and sleep.
              </motion.p>
            </>
          )}

          {stepType === 'name' && (
            <>
              <motion.h1
                initial={ONBOARDING_ANIMATIONS.itemInitial}
                animate={ONBOARDING_ANIMATIONS.itemAnimate}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="text-2xl font-normal text-gray-900 mb-12"
              >
                What's your first name?
              </motion.h1>

              <motion.div
                initial={ONBOARDING_ANIMATIONS.itemInitial}
                animate={ONBOARDING_ANIMATIONS.itemAnimate}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="mb-16"
              >
                <Input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder=""
                  className="text-center text-3xl font-normal border-none bg-transparent focus:ring-0 focus:outline-none text-gray-900 placeholder-gray-400 p-0 h-auto"
                  style={{ boxShadow: 'none' }}
                  autoFocus
                />
                <div className="w-full h-px bg-gray-200 mt-2"></div>
              </motion.div>
            </>
          )}
        </motion.div>
      </div>

      {/* Continue Button */}
      <div className={ONBOARDING_LAYOUTS.footer}>
        <motion.div
          initial={ONBOARDING_ANIMATIONS.itemInitial}
          animate={{ 
            opacity: showContinue ? 1 : 0, 
            y: showContinue ? 0 : 20 
          }}
          transition={ONBOARDING_ANIMATIONS.buttonTransition}
        >
          <Button
            onClick={handleContinue}
            disabled={!showContinue}
            className={`${ONBOARDING_BUTTON_STYLES.primary} ${!showContinue ? 'disabled:opacity-0 disabled:cursor-not-allowed' : ''}`}
          >
            Continue
          </Button>
        </motion.div>
      </div>
    </div>
  );
}; 