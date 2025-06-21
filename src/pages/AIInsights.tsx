
import React from 'react';
import { SmartHealthInsights } from '@/components/ai-insights/SmartHealthInsights';

const AIInsights = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">AI Health Insights</h1>
        <p className="text-gray-600">
          Intelligent health recommendations powered by AI analysis of your health data
        </p>
      </div>
      
      <SmartHealthInsights />
    </div>
  );
};

export default AIInsights;
