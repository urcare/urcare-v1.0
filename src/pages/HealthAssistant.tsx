
import React from 'react';
import { HealthAssistantChatbot } from '@/components/ai-insights/HealthAssistantChatbot';

const HealthAssistant = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">AI Health Assistant</h1>
        <p className="text-gray-600">
          Your personal AI health companion for symptoms, education, and wellness coaching
        </p>
      </div>
      
      <HealthAssistantChatbot />
    </div>
  );
};

export default HealthAssistant;
