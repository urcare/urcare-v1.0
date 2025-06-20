
import React from 'react';
import { Layout } from '@/components/Layout';
import { AppointmentDashboard } from '@/components/appointments/AppointmentDashboard';
import { ThemeWrapper } from '@/components/ThemeWrapper';

const Appointments = () => {
  return (
    <ThemeWrapper>
      <Layout>
        <div className="space-y-6">
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Appointments</h1>
          <AppointmentDashboard />
        </div>
      </Layout>
    </ThemeWrapper>
  );
};

export default Appointments;
