
import React from 'react';
import { NotificationCenter } from '@/components/notifications/NotificationCenter';

const Notifications = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Notification Center</h1>
        <p className="text-gray-600">
          Stay updated with all your healthcare notifications and alerts
        </p>
      </div>
      
      <div className="flex justify-center">
        <NotificationCenter />
      </div>
    </div>
  );
};

export default Notifications;
