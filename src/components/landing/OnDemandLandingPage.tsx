import React from 'react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { GRID_IMAGES, COMMON_STYLES } from './constants';

interface OnDemandLandingPageProps {
  showModal?: boolean;
  onGetStarted?: () => void;
  onAlreadyMember?: () => void;
}

export const OnDemandLandingPage = ({ 
  showModal = false, 
  onGetStarted, 
  onAlreadyMember 
}: OnDemandLandingPageProps) => {
  return (
    <div className="h-screen bg-gradient-to-br from-gray-50 to-white relative overflow-hidden">
      {/* Main Content */}
      <div className="py-6 sm:py-8 px-4 sm:px-6 h-full flex flex-col justify-center">
        {/* Grid Layout */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className={COMMON_STYLES.grid}
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
                className={COMMON_STYLES.button.primary}
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
                className={COMMON_STYLES.button.secondary}
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