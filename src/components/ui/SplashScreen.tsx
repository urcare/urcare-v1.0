import React, { useEffect, useRef } from 'react';
import '@lottiefiles/lottie-player';

interface SplashScreenProps {
  onComplete: () => void;
}

export const SplashScreen = ({ onComplete }: SplashScreenProps) => {
  const playerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const player = playerRef.current;
    if (player) {
      const handleComplete = () => onComplete();
      player.addEventListener('complete', handleComplete);
      return () => player.removeEventListener('complete', handleComplete);
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