
import React from 'react';
import { Layout } from '@/components/Layout';
import { MedicalImagingInterface } from '@/components/ai-diagnostics/MedicalImagingInterface';

const AIDiagnostics = () => {
  return (
    <Layout>
      <MedicalImagingInterface />
    </Layout>
  );
};

export default AIDiagnostics;
