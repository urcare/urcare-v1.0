
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { AlertTriangle, Clock, CheckCircle, X, Bell } from 'lucide-react';
import { toast } from 'sonner';

interface MissedDose {
  id: string;
  medicationId: string;
  medicationName: string;
  scheduledTime: string;
  missedTime: Date;
  escalationLevel: number;
  acknowledged: boolean;
}

interface MissedDoseTrackerProps {
  medications: any[];
}

export const MissedDoseTracker = ({ medications }: MissedDoseTrackerProps) => {
  const [missedDoses, setMissedDoses] = useState<MissedDose[]>([]);
  const [escalationSettings, setEscalationSettings] = useState({
    firstReminder: 15, // minutes
    secondReminder: 60,
    escalateToEmergency: 240,
    emergencyContact: '+1-555-EMERGENCY'
  });

  // Simulate missed doses for demo
  useEffect(() => {
    const sampleMissedDoses: MissedDose[] = [
      {
        id: '1',
        medicationId: '1',
        medicationName: 'Lisinopril 10mg',
        scheduledTime: '08:00',
        missedTime: new Date(Date.now() - 30 * 60 * 1000), // 30 minutes ago
        escalationLevel: 1,
        acknowledged: false
      },
      {
        id: '2',
        medicationId: '2',
        medicationName: 'Metformin 500mg',
        scheduledTime: '20:00',
        missedTime: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
        escalationLevel: 2,
        acknowledged: false
      }
    ];
    setMissedDoses(sampleMissedDoses);
  }, []);

  const handleAcknowledgeDose = (doseId: string, action: 'taken' | 'skip') => {
    setMissedDoses(prev => prev.map(dose => 
      dose.id === doseId ? { ...dose, acknowledged: true } : dose
    ));

    if (action === 'taken') {
      toast.success('Dose marked as taken');
    } else {
      toast.info('Dose marked as skipped');
    }
  };

  const handleEscalateToEmergency = (doseId: string) => {
    const dose = missedDoses.find(d => d.id === doseId);
    if (dose) {
      toast.promise(
        new Promise(resolve => setTimeout(resolve, 2000)),
        {
          loading: 'Contacting emergency contact...',
          success: `Emergency contact notified about missed ${dose.medicationName}`,
          error: 'Failed to contact emergency contact'
        }
      );
    }
  };

  const getEscalationColor = (level: number) => {
    switch (level) {
      case 1: return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 2: return 'bg-orange-100 text-orange-800 border-orange-300';
      case 3: return 'bg-red-100 text-red-800 border-red-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const getTimeSinceMissed = (missedTime: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - missedTime.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffMins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    
    if (diffHours > 0) {
      return `${diffHours}h ${diffMins}m ago`;
    }
    return `${diffMins}m ago`;
  };

  const activeMissedDoses = missedDoses.filter(dose => !dose.acknowledged);
  const weeklyAdherence = medications.reduce((acc, med) => acc + med.adherenceScore, 0) / medications.length;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5" />
            Missed Dose Tracker & Escalation
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Adherence Overview */}
          <div className="p-4 bg-blue-50 rounded-lg">
            <div className="flex justify-between items-center mb-2">
              <span className="font-medium">Weekly Adherence Rate</span>
              <span className="text-lg font-bold">{Math.round(weeklyAdherence)}%</span>
            </div>
            <Progress value={weeklyAdherence} className="h-2" />
            <p className="text-sm text-gray-600 mt-2">
              Target: 95% or higher for optimal health outcomes
            </p>
          </div>

          {/* Active Missed Doses */}
          {activeMissedDoses.length > 0 ? (
            <div className="space-y-4">
              <h3 className="font-semibold text-red-600">
                Active Missed Doses ({activeMissedDoses.length})
              </h3>
              
              {activeMissedDoses.map((dose) => (
                <Alert key={dose.id} className={getEscalationColor(dose.escalationLevel)}>
                  <AlertTriangle className="h-4 w-4" />
                  <div className="flex-1">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <p className="font-medium">{dose.medicationName}</p>
                        <p className="text-sm">
                          Scheduled: {dose.scheduledTime} • Missed: {getTimeSinceMissed(dose.missedTime)}
                        </p>
                      </div>
                      <Badge variant="outline">
                        Level {dose.escalationLevel} Alert
                      </Badge>
                    </div>
                    
                    <div className="flex gap-2 mt-3">
                      <Button 
                        size="sm" 
                        onClick={() => handleAcknowledgeDose(dose.id, 'taken')}
                      >
                        <CheckCircle className="h-4 w-4 mr-1" />
                        Mark as Taken
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleAcknowledgeDose(dose.id, 'skip')}
                      >
                        <X className="h-4 w-4 mr-1" />
                        Skip Dose
                      </Button>
                      {dose.escalationLevel >= 2 && (
                        <Button 
                          size="sm" 
                          variant="destructive"
                          onClick={() => handleEscalateToEmergency(dose.id)}
                        >
                          <Bell className="h-4 w-4 mr-1" />
                          Emergency Contact
                        </Button>
                      )}
                    </div>
                  </div>
                </Alert>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <CheckCircle className="h-12 w-12 mx-auto mb-3 text-green-500" />
              <p className="text-lg font-medium">All doses up to date!</p>
              <p className="text-sm">Great job maintaining your medication schedule.</p>
            </div>
          )}

          {/* Escalation Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Escalation Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium">First Reminder:</span>
                  <span className="ml-2">{escalationSettings.firstReminder} minutes</span>
                </div>
                <div>
                  <span className="font-medium">Second Reminder:</span>
                  <span className="ml-2">{escalationSettings.secondReminder} minutes</span>
                </div>
                <div>
                  <span className="font-medium">Emergency Escalation:</span>
                  <span className="ml-2">{escalationSettings.escalateToEmergency} minutes</span>
                </div>
                <div>
                  <span className="font-medium">Emergency Contact:</span>
                  <span className="ml-2">{escalationSettings.emergencyContact}</span>
                </div>
              </div>
              <Button variant="outline" size="sm" className="w-full">
                Configure Settings
              </Button>
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center p-3 border rounded-lg">
              <div className="text-2xl font-bold text-green-600">
                {medications.reduce((acc, med) => acc + (7 - med.missedDoses), 0)}
              </div>
              <p className="text-sm text-gray-600">Doses Taken This Week</p>
            </div>
            <div className="text-center p-3 border rounded-lg">
              <div className="text-2xl font-bold text-red-600">
                {medications.reduce((acc, med) => acc + med.missedDoses, 0)}
              </div>
              <p className="text-sm text-gray-600">Missed This Week</p>
            </div>
            <div className="text-center p-3 border rounded-lg">
              <div className="text-2xl font-bold text-blue-600">
                {Math.round(weeklyAdherence)}%
              </div>
              <p className="text-sm text-gray-600">Adherence Rate</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
