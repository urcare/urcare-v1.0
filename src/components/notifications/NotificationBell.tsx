import { Bell } from 'lucide-react';
import React from 'react';
import { Button } from '../ui/button';

export const NotificationBell: React.FC = () => {
  return (
    <Button variant="ghost" size="sm" className="relative">
      <Bell className="h-4 w-4" />
      <span className="sr-only">Notifications</span>
      {/* Notification badge */}
      <span className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full text-xs flex items-center justify-center text-white">
        <span className="sr-only">3 notifications</span>
      </span>
    </Button>
  );
};
