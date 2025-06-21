
import React from 'react';
import { MedicationTracker } from '@/components/medications/MedicationTracker';

const MedicationManagement = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Medication Management</h1>
        <p className="text-gray-600">
          Smart medication tracking with AI-powered insights and family coordination
        </p>
      </div>
      
      <MedicationTracker />
    </div>
  );
};

export default MedicationManagement;
