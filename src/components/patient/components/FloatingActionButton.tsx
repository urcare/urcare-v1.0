
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Shield, Phone, Camera, Stethoscope, Plus, X } from 'lucide-react';
import { cn } from '@/lib/utils';

export const FloatingActionButton = () => {
  const [isOpen, setIsOpen] = useState(false);

  const quickActions = [
    {
      icon: Shield,
      label: 'Emergency SOS',
      color: 'bg-destructive hover:bg-destructive/90',
      action: () => console.log('Emergency SOS triggered')
    },
    {
      icon: Stethoscope,
      label: 'Symptom Check',
      color: 'bg-primary hover:bg-primary/90',
      action: () => console.log('Symptom checker opened')
    },
    {
      icon: Camera,
      label: 'Scan Document',
      color: 'bg-secondary hover:bg-secondary/90',
      action: () => console.log('Document scanner opened')
    },
    {
      icon: Phone,
      label: 'Call Doctor',
      color: 'bg-accent hover:bg-accent/90',
      action: () => console.log('Call doctor initiated')
    }
  ];

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Quick Action Buttons */}
      <div className={cn(
        "absolute bottom-16 right-0 space-y-3 transition-all duration-300",
        isOpen ? "opacity-100 scale-100" : "opacity-0 scale-95 pointer-events-none"
      )}>
        {quickActions.map((action, index) => {
          const IconComponent = action.icon;
          return (
            <div
              key={index}
              className="flex items-center gap-3"
              style={{ transitionDelay: `${index * 50}ms` }}
            >
              <div className="bg-background border border-border rounded-lg px-3 py-2 shadow-lg">
                <span className="text-sm font-medium text-foreground whitespace-nowrap">
                  {action.label}
                </span>
              </div>
              <Button
                size="icon"
                className={cn(
                  "w-12 h-12 rounded-full shadow-lg transition-all duration-200",
                  action.color
                )}
                onClick={action.action}
              >
                <IconComponent className="w-6 h-6" />
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
            ? "bg-muted hover:bg-muted/90 rotate-45" 
            : "bg-gradient-to-br from-primary to-secondary hover:scale-110"
        )}
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? (
          <X className="w-6 h-6" />
        ) : (
          <Plus className="w-6 h-6" />
        )}
      </Button>
    </div>
  );
};
