
import React from 'react';
import { FamilyGuardianHub } from '@/components/family/FamilyGuardianHub';

const FamilyHub = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Family & Guardian Hub</h1>
        <p className="text-gray-600">
          Coordinate family healthcare, manage guardian permissions, and track care activities
        </p>
      </div>
      
      <FamilyGuardianHub />
    </div>
  );
};

export default FamilyHub;
