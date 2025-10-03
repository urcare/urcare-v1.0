import React, { useEffect, useRef } from 'react';
// Remove Lottie import
// import Lottie from 'lottie-react';
// import animationData from '../../logoAnimation.json';

// Import lottie-player web component
import '@lottiefiles/lottie-player';

// Add custom element type for lottie-player
// eslint-disable-next-line @typescript-eslint/no-explicit-any
declare global {
  namespace JSX {
    interface IntrinsicElements {
      'lottie-player': any;
    }
  }
}

interface SplashScreenProps {
  onComplete: () => void;
}

export const SplashScreen = ({ onComplete }: SplashScreenProps) => {
  const playerRef = useRef(null);

  useEffect(() => {
    const player = playerRef.current;
    if (player) {
      // Listen for complete event
      player.addEventListener('complete', onComplete);
      return () => {
        player.removeEventListener('complete', onComplete);
      };
    }
  }, [onComplete]);

  return (
    <div className="fixed inset-0 bg-white z-50 flex items-center justify-center" style={{ willChange: 'opacity' }}>
      <div className="w-64 h-64" style={{ willChange: 'transform' }}>
        <lottie-player
          ref={playerRef}
          src="/logoAnimation.json"
          background="transparent"
          speed="1"
          style={{ width: '100%', height: '100%' }}
          loop={false}
          autoplay
        />
      </div>
    </div>
  );
}; 