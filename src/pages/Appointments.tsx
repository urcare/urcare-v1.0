
import React from 'react';
import { Layout } from '@/components/Layout';
import { AppointmentDashboard } from '@/components/appointments/AppointmentDashboard';

const Appointments = () => {
  return (
    <Layout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold tracking-tight">Appointments</h1>
        <AppointmentDashboard />
      </div>
    </Layout>
  );
};

export default Appointments;
