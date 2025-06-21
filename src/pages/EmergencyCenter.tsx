
import React from 'react';
import { EmergencySystem } from '@/components/emergency/EmergencySystem';

const EmergencyCenter = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Emergency Center</h1>
        <p className="text-gray-600">
          Emergency SOS, medical alerts, and critical health information access
        </p>
      </div>
      
      <EmergencySystem />
    </div>
  );
};

export default EmergencyCenter;
