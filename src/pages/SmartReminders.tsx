
import React from 'react';
import { SmartReminders as SmartRemindersComponent } from '@/components/ai/SmartReminders';

const SmartReminders = () => {
  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="text-center space-y-2 mb-8">
        <h1 className="text-3xl font-bold">Smart Reminders</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Never miss important health activities with AI-powered smart reminders. 
          Adaptive scheduling learns from your routine to optimize timing and improve adherence.
        </p>
      </div>
      
      <SmartRemindersComponent />
    </div>
  );
};

export default SmartReminders;
