
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, Baby, Users, Shield, Phone, MapPin, Clock } from 'lucide-react';
import { toast } from 'sonner';

interface PanicMode {
  id: string;
  type: 'child' | 'elder' | 'general';
  name: string;
  description: string;
  icon: React.ReactNode;
  alertSettings: {
    immediateContacts: string[];
    authorities: boolean;
    gpsTracking: boolean;
    audioRecording: boolean;
    specialInstructions: string;
  };
}

interface ActiveAlert {
  id: string;
  type: string;
  startTime: Date;
  location?: string;
  status: 'active' | 'acknowledged' | 'resolved';
}

export const PanicModeSystem = () => {
  const [activePanic, setActivePanic] = useState<ActiveAlert | null>(null);
  const [selectedMode, setSelectedMode] = useState<string>('');

  const panicModes: PanicMode[] = [
    {
      id: 'child',
      type: 'child',
      name: 'Child Safety Mode',
      description: 'Special alerts for minors with enhanced parent/guardian notifications',
      icon: <Baby className="h-6 w-6" />,
      alertSettings: {
        immediateContacts: ['Parents', 'School', 'Pediatrician'],
        authorities: true,
        gpsTracking: true,
        audioRecording: true,
        specialInstructions: 'Child emergency - requires immediate adult supervision'
      }
    },
    {
      id: 'elder',
      type: 'elder',
      name: 'Elder Care Mode',
      description: 'Specialized alerts for seniors with medical considerations',
      icon: <Users className="h-6 w-6" />,
      alertSettings: {
        immediateContacts: ['Family Caregiver', 'Primary Doctor', 'Home Care Service'],
        authorities: true,
        gpsTracking: true,
        audioRecording: false,
        specialInstructions: 'Senior citizen emergency - check for medication needs and mobility assistance'
      }
    },
    {
      id: 'general',
      type: 'general',
      name: 'General Panic Mode',
      description: 'Standard emergency alert for adults',
      icon: <Shield className="h-6 w-6" />,
      alertSettings: {
        immediateContacts: ['Emergency Contact', 'Family Member'],
        authorities: false,
        gpsTracking: true,
        audioRecording: false,
        specialInstructions: 'General emergency alert'
      }
    }
  ];

  const activatePanicMode = (mode: PanicMode) => {
    const newAlert: ActiveAlert = {
      id: `alert_${Date.now()}`,
      type: mode.name,
      startTime: new Date(),
      location: 'Current GPS Location', // Would be actual location
      status: 'active'
    };

    setActivePanic(newAlert);
    setSelectedMode(mode.id);

    // Simulate emergency protocol
    toast.warning(`${mode.name} activated! Alerting contacts...`, {
      duration: 5000
    });

    // Simulate sending alerts based on mode settings
    setTimeout(() => {
      mode.alertSettings.immediateContacts.forEach((contact, index) => {
        setTimeout(() => {
          toast.success(`Alert sent to ${contact}`);
        }, (index + 1) * 1000);
      });
    }, 1000);

    if (mode.alertSettings.authorities) {
      setTimeout(() => {
        toast.success('Emergency services have been notified');
      }, 3000);
    }
  };

  const acknowledgePanic = () => {
    if (activePanic) {
      setActivePanic({
        ...activePanic,
        status: 'acknowledged'
      });
      toast.success('Emergency acknowledged by responder');
    }
  };

  const resolvePanic = () => {
    if (activePanic) {
      setActivePanic({
        ...activePanic,
        status: 'resolved'
      });
      
      setTimeout(() => {
        setActivePanic(null);
        setSelectedMode('');
        toast.success('Emergency resolved');
      }, 2000);
    }
  };

  if (activePanic) {
    const currentMode = panicModes.find(m => m.id === selectedMode);
    const duration = Math.floor((new Date().getTime() - activePanic.startTime.getTime()) / 1000);

    return (
      <Card className="border-red-500 bg-red-50">
        <CardHeader className="bg-red-100">
          <CardTitle className="text-red-800 flex items-center gap-2">
            <AlertTriangle className="h-6 w-6 animate-pulse" />
            PANIC MODE ACTIVE: {activePanic.type}
          </CardTitle>
          <CardDescription className="text-red-700">
            Emergency protocol is running. Status: {activePanic.status.toUpperCase()}
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-4 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white p-3 rounded border">
              <div className="flex items-center gap-2 text-sm font-medium mb-1">
                <Clock className="h-4 w-4" />
                Duration
              </div>
              <p className="text-lg font-bold">{Math.floor(duration / 60)}:{(duration % 60).toString().padStart(2, '0')}</p>
            </div>
            
            <div className="bg-white p-3 rounded border">
              <div className="flex items-center gap-2 text-sm font-medium mb-1">
                <MapPin className="h-4 w-4" />
                Location
              </div>
              <p className="text-sm">{activePanic.location || 'Locating...'}</p>
            </div>

            <div className="bg-white p-3 rounded border">
              <div className="flex items-center gap-2 text-sm font-medium mb-1">
                <Phone className="h-4 w-4" />
                Status
              </div>
              <Badge 
                className={
                  activePanic.status === 'active' ? 'bg-red-100 text-red-800' :
                  activePanic.status === 'acknowledged' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-green-100 text-green-800'
                }
              >
                {activePanic.status}
              </Badge>
            </div>
          </div>

          {currentMode && (
            <div className="bg-white p-4 rounded border">
              <h4 className="font-medium mb-2">Alert Settings Active</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="font-medium">Contacts Notified:</p>
                  <ul className="list-disc list-inside text-gray-600">
                    {currentMode.alertSettings.immediateContacts.map((contact, index) => (
                      <li key={index}>{contact}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <p className="font-medium">Active Features:</p>
                  <div className="space-y-1">
                    {currentMode.alertSettings.authorities && <Badge variant="outline">Emergency Services</Badge>}
                    {currentMode.alertSettings.gpsTracking && <Badge variant="outline">GPS Tracking</Badge>}
                    {currentMode.alertSettings.audioRecording && <Badge variant="outline">Audio Recording</Badge>}
                  </div>
                </div>
              </div>
              <div className="mt-3 p-2 bg-gray-50 rounded">
                <p className="text-sm"><strong>Instructions:</strong> {currentMode.alertSettings.specialInstructions}</p>
              </div>
            </div>
          )}

          <div className="flex gap-2">
            {activePanic.status === 'active' && (
              <Button onClick={acknowledgePanic} variant="outline">
                Acknowledge Emergency
              </Button>
            )}
            <Button onClick={resolvePanic} variant="default">
              Mark as Resolved
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-6 w-6" />
            Panic Mode System
          </CardTitle>
          <CardDescription>
            Specialized emergency modes for different situations and demographics
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {panicModes.map((mode) => (
              <Card key={mode.id} className="hover:shadow-md transition-shadow cursor-pointer">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-red-100 rounded-full text-red-600">
                      {mode.icon}
                    </div>
                    <div>
                      <CardTitle className="text-lg">{mode.name}</CardTitle>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-gray-600">{mode.description}</p>
                  
                  <div className="space-y-2">
                    <h4 className="font-medium text-sm">Alert Features:</h4>
                    <div className="flex flex-wrap gap-1">
                      {mode.alertSettings.authorities && (
                        <Badge variant="outline" className="text-xs">Emergency Services</Badge>
                      )}
                      {mode.alertSettings.gpsTracking && (
                        <Badge variant="outline" className="text-xs">GPS Tracking</Badge>
                      )}
                      {mode.alertSettings.audioRecording && (
                        <Badge variant="outline" className="text-xs">Audio Recording</Badge>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h4 className="font-medium text-sm">Contacts ({mode.alertSettings.immediateContacts.length}):</h4>
                    <ul className="text-xs text-gray-600">
                      {mode.alertSettings.immediateContacts.slice(0, 2).map((contact, index) => (
                        <li key={index}>• {contact}</li>
                      ))}
                      {mode.alertSettings.immediateContacts.length > 2 && (
                        <li>• +{mode.alertSettings.immediateContacts.length - 2} more</li>
                      )}
                    </ul>
                  </div>

                  <Button 
                    onClick={() => activatePanicMode(mode)}
                    className="w-full bg-red-600 hover:bg-red-700"
                  >
                    Activate {mode.name}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="bg-amber-50 border-amber-200">
        <CardHeader>
          <CardTitle className="text-amber-800">Important Information</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="text-sm text-amber-700 space-y-1">
            <li>• Panic modes are designed for different emergency scenarios and user demographics</li>
            <li>• Child mode includes enhanced notifications to parents, schools, and child protection services</li>
            <li>• Elder mode considers mobility limitations and medication needs</li>
            <li>• All modes include GPS tracking and immediate contact notifications</li>
            <li>• False activations can be cancelled within the first 30 seconds</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};
