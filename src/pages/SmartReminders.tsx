
import React from 'react';
import { IntelligentReminders } from '@/components/ai-insights/IntelligentReminders';

const SmartReminders = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Intelligent Reminders</h1>
        <p className="text-gray-600">
          Context-aware, AI-optimized reminders for medications, appointments, and health goals
        </p>
      </div>
      
      <IntelligentReminders />
    </div>
  );
};

export default SmartReminders;
