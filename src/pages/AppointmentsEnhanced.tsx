
import React from 'react';
import { EnhancedAppointmentSystem } from '@/components/appointments/EnhancedAppointmentSystem';

const AppointmentsEnhanced = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Enhanced Appointments</h1>
        <p className="text-gray-600">
          Book appointments, join teleconsults, and manage your healthcare schedule
        </p>
      </div>
      
      <EnhancedAppointmentSystem />
    </div>
  );
};

export default AppointmentsEnhanced;
