import React from 'react';
import Lottie from 'lottie-react';
import animationData from '../../logoAnimation.json';

interface SplashScreenProps {
  onComplete: () => void;
}

export const SplashScreen = ({ onComplete }: SplashScreenProps) => {
  return (
    <div className="fixed inset-0 bg-white z-50 flex items-center justify-center">
      <div className="w-64 h-64">
        <Lottie
          animationData={animationData}
          loop={false}
          autoplay={true}
          onComplete={onComplete}
          style={{ width: '100%', height: '100%' }}
        />
      </div>
    </div>
  );
}; 