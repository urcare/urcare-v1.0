
import React from 'react';
import { WellnessTracker } from '@/components/wellness/WellnessTracker';

const WellnessTracking = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Wellness Tracking</h1>
        <p className="text-gray-600">
          Track your health metrics, build healthy habits, and achieve your wellness goals
        </p>
      </div>
      
      <WellnessTracker />
    </div>
  );
};

export default WellnessTracking;
