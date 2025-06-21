
import React from 'react';
import { HealthAssistant as HealthAssistantComponent } from '@/components/ai/HealthAssistant';

const HealthAssistant = () => {
  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="text-center space-y-2 mb-8">
        <h1 className="text-3xl font-bold">AI Health Assistant</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Get instant, intelligent health guidance from your personal AI assistant. 
          Ask questions, analyze symptoms, and receive personalized recommendations 24/7.
        </p>
      </div>
      
      <HealthAssistantComponent />
    </div>
  );
};

export default HealthAssistant;
