
import React from 'react';
import { AppointmentManagement } from '@/components/patient/appointments/AppointmentManagement';

export const AppointmentDashboard = () => {
  return (
    <div className="bg-background text-foreground min-h-screen">
      <AppointmentManagement />
    </div>
  );
};
