
import React from 'react';
import { Layout } from '@/components/Layout';
import { PatientJourneyDashboard } from '@/components/patient-journey/PatientJourneyDashboard';

const PatientJourney = () => {
  return (
    <Layout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold tracking-tight">Patient Journey</h1>
        <PatientJourneyDashboard />
      </div>
    </Layout>
  );
};

export default PatientJourney;
