import React from 'react';
import { Layout } from '@/components/Layout';
import { ThemeWrapper } from '@/components/ThemeWrapper';

// Import all the dashboard components directly
import { MedicalImagingInterface } from '@/components/ai-diagnostics/MedicalImagingInterface';
import { ClinicalDecisionSupportDashboard } from '@/components/clinical-decision/ClinicalDecisionSupportDashboard';
import { MentalHealthDashboard } from '@/components/mental-health/MentalHealthDashboard';
import { GeriatricCareDashboard } from '@/components/geriatric/GeriatricCareDashboard';
import { LIMSDashboard } from '@/components/lims/LIMSDashboard';
import { ClinicalAnalyticsDashboard } from '@/components/clinical-analytics/ClinicalAnalyticsDashboard';
import { PerformanceMonitoringDashboard } from '@/components/performance/PerformanceMonitoringDashboard';
import { HospitalAnalyticsDashboard } from '@/components/analytics/HospitalAnalyticsDashboard';

// Profile Management Component
export const ProfilePage = () => {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Profile Management</h1>
        <p className="text-gray-600">Manage your profile settings and preferences.</p>
      </div>
    </Layout>
  );
};

// AI Diagnostics with Layout
export const AIDiagnosticsPage = () => {
  return (
    <Layout>
      <MedicalImagingInterface />
    </Layout>
  );
};

// Clinical Decision Support with Layout
export const ClinicalDecisionSupportPage = () => {
  return (
    <Layout>
      <ClinicalDecisionSupportDashboard />
    </Layout>
  );
};

// Mental Health with Layout
export const MentalHealthPage = () => {
  return (
    <Layout>
      <MentalHealthDashboard />
    </Layout>
  );
};

// Geriatric Care with Layout
export const GeriatricCarePage = () => {
  return (
    <Layout>
      <GeriatricCareDashboard />
    </Layout>
  );
};

// LIMS with Theme Wrapper
export const LIMSPage = () => {
  return (
    <ThemeWrapper>
      <LIMSDashboard />
    </ThemeWrapper>
  );
};

// Clinical Analytics with Layout
export const ClinicalAnalyticsPage = () => {
  return (
    <Layout>
      <ClinicalAnalyticsDashboard />
    </Layout>
  );
};

// Performance Monitoring with Layout
export const PerformanceMonitoringPage = () => {
  return (
    <Layout>
      <PerformanceMonitoringDashboard />
    </Layout>
  );
};

// Analytics with Layout
export const AnalyticsPage = () => {
  return (
    <Layout>
      <HospitalAnalyticsDashboard />
    </Layout>
  );
}; 