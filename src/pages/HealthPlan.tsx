import React from 'react';
import { HealthPlanDisplay } from '@/components/health/HealthPlanDisplay';

const HealthPlan: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Your Personalized Health Plan
            </h1>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Based on your onboarding data, we've created a comprehensive health plan tailored to your goals, 
              lifestyle, and preferences. This plan includes nutrition guidance, workout routines, and lifestyle 
              optimization strategies.
            </p>
          </div>

          {/* Health Plan Display */}
          <HealthPlanDisplay showGenerateButton={true} />
        </div>
      </div>
    </div>
  );
};

export default HealthPlan;
