
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, Users, AlertCircle } from 'lucide-react';

interface WaitTimeDisplayProps {
  appointmentId: string;
  scheduledTime: string;
}

export const WaitTimeDisplay = ({ appointmentId, scheduledTime }: WaitTimeDisplayProps) => {
  const [currentWaitTime, setCurrentWaitTime] = useState(15); // minutes
  const [queuePosition, setQueuePosition] = useState(3);
  const [estimatedCallTime, setEstimatedCallTime] = useState('');

  useEffect(() => {
    // Simulate real-time updates
    const interval = setInterval(() => {
      // Simulate dynamic wait time changes
      setCurrentWaitTime(prev => {
        const change = Math.floor(Math.random() * 6) - 3; // -3 to +3 minutes
        return Math.max(0, prev + change);
      });

      setQueuePosition(prev => Math.max(1, prev - Math.floor(Math.random() * 2)));
    }, 30000); // Update every 30 seconds

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    // Calculate estimated call time
    const scheduled = new Date(scheduledTime);
    const estimated = new Date(scheduled.getTime() + currentWaitTime * 60000);
    setEstimatedCallTime(estimated.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
  }, [currentWaitTime, scheduledTime]);

  const getWaitStatus = () => {
    if (currentWaitTime <= 5) return { color: 'bg-green-500', text: 'On Time' };
    if (currentWaitTime <= 15) return { color: 'bg-yellow-500', text: 'Short Delay' };
    return { color: 'bg-red-500', text: 'Delayed' };
  };

  const waitStatus = getWaitStatus();

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5" />
          Real-Time Wait Status
        </CardTitle>
        <CardDescription>
          Live updates for your appointment
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className={`w-3 h-3 rounded-full ${waitStatus.color} animate-pulse`} />
            <span className="font-medium">{waitStatus.text}</span>
          </div>
          <Badge variant={currentWaitTime <= 5 ? "default" : currentWaitTime <= 15 ? "secondary" : "destructive"}>
            {currentWaitTime} min delay
          </Badge>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="text-center p-3 bg-slate-50 rounded-lg">
            <div className="flex items-center justify-center gap-1 text-sm text-muted-foreground mb-1">
              <Users className="h-4 w-4" />
              Queue Position
            </div>
            <div className="text-2xl font-bold">{queuePosition}</div>
          </div>

          <div className="text-center p-3 bg-slate-50 rounded-lg">
            <div className="flex items-center justify-center gap-1 text-sm text-muted-foreground mb-1">
              <Clock className="h-4 w-4" />
              Estimated Time
            </div>
            <div className="text-2xl font-bold">{estimatedCallTime}</div>
          </div>
        </div>

        {currentWaitTime > 15 && (
          <div className="flex items-center gap-2 p-3 bg-amber-50 border border-amber-200 rounded-lg">
            <AlertCircle className="h-4 w-4 text-amber-600" />
            <span className="text-sm text-amber-800">
              We apologize for the delay. You'll be seen as soon as possible.
            </span>
          </div>
        )}

        <div className="text-xs text-muted-foreground text-center">
          Updates automatically every 30 seconds
        </div>
      </CardContent>
    </Card>
  );
};
