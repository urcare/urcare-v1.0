
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Plus, Calendar, Video, Upload, Phone, X } from 'lucide-react';
import { cn } from '@/lib/utils';

export const FloatingActionButton = () => {
  const [isOpen, setIsOpen] = useState(false);

  const actions = [
    {
      icon: Calendar,
      label: 'Book Appointment',
      color: 'bg-blue-500 hover:bg-blue-600',
      action: () => console.log('Book appointment')
    },
    {
      icon: Video,
      label: 'Start Teleconsult',
      color: 'bg-green-500 hover:bg-green-600',
      action: () => console.log('Start teleconsult')
    },
    {
      icon: Upload,
      label: 'Upload Records',
      color: 'bg-purple-500 hover:bg-purple-600',
      action: () => console.log('Upload records')
    },
    {
      icon: Phone,
      label: 'Emergency Call',
      color: 'bg-red-500 hover:bg-red-600',
      action: () => console.log('Emergency call')
    }
  ];

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Action Buttons */}
      <div className={cn(
        "flex flex-col-reverse gap-3 mb-3 transition-all duration-300",
        isOpen ? "opacity-100 scale-100" : "opacity-0 scale-95 pointer-events-none"
      )}>
        {actions.map((action, index) => {
          const IconComponent = action.icon;
          return (
            <div key={index} className="flex items-center gap-3">
              <div className="bg-white dark:bg-gray-800 px-3 py-2 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
                <span className="text-sm font-medium text-gray-900 dark:text-white whitespace-nowrap">
                  {action.label}
                </span>
              </div>
              <Button
                size="icon"
                className={cn(
                  "w-12 h-12 rounded-full shadow-lg text-white",
                  action.color
                )}
                onClick={() => {
                  action.action();
                  setIsOpen(false);
                }}
              >
                <IconComponent className="w-5 h-5" />
              </Button>
            </div>
          );
        })}
      </div>

      {/* Main FAB */}
      <Button
        size="icon"
        className={cn(
          "w-14 h-14 rounded-full shadow-lg transition-all duration-300",
          isOpen 
            ? "bg-gray-500 hover:bg-gray-600 rotate-45" 
            : "bg-blue-500 hover:bg-blue-600"
        )}
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? (
          <X className="w-6 h-6 text-white" />
        ) : (
          <Plus className="w-6 h-6 text-white" />
        )}
      </Button>
    </div>
  );
};
