
import React from 'react';
import { PredictiveAnalytics } from '@/components/ai/PredictiveAnalytics';

const AIInsights = () => {
  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="text-center space-y-2 mb-8">
        <h1 className="text-3xl font-bold">AI Health Insights</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Discover personalized health insights powered by advanced artificial intelligence. 
          Get predictive analytics, risk assessments, and actionable recommendations for your wellness journey.
        </p>
      </div>
      
      <PredictiveAnalytics />
    </div>
  );
};

export default AIInsights;
