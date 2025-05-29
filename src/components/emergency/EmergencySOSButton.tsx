
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, MapPin, Phone, Users, Clock, Shield } from 'lucide-react';
import { toast } from 'sonner';

interface EmergencyContact {
  id: string;
  name: string;
  phone: string;
  relationship: string;
  priority: number;
}

interface LocationData {
  latitude: number;
  longitude: number;
  accuracy: number;
  timestamp: Date;
  address?: string;
}

export const EmergencySOSButton = () => {
  const [isEmergencyActive, setIsEmergencyActive] = useState(false);
  const [location, setLocation] = useState<LocationData | null>(null);
  const [countdown, setCountdown] = useState(0);
  const [emergencyContacts] = useState<EmergencyContact[]>([
    { id: '1', name: 'Dr. Sarah Johnson', phone: '+1-555-0123', relationship: 'Primary Doctor', priority: 1 },
    { id: '2', name: 'John Doe', phone: '+1-555-0456', relationship: 'Emergency Contact', priority: 2 },
    { id: '3', name: 'Jane Smith', phone: '+1-555-0789', relationship: 'Family Member', priority: 3 }
  ]);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else if (countdown === 0 && isEmergencyActive) {
      executeEmergencyProtocol();
    }
  }, [countdown, isEmergencyActive]);

  const getCurrentLocation = (): Promise<LocationData> => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation not supported'));
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          const locationData: LocationData = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            accuracy: position.coords.accuracy,
            timestamp: new Date()
          };
          
          // Reverse geocoding simulation (in real app, use actual service)
          locationData.address = `${position.coords.latitude.toFixed(4)}, ${position.coords.longitude.toFixed(4)}`;
          
          resolve(locationData);
        },
        (error) => reject(error),
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 }
      );
    });
  };

  const triggerSOS = async () => {
    try {
      const currentLocation = await getCurrentLocation();
      setLocation(currentLocation);
      setIsEmergencyActive(true);
      setCountdown(10); // 10 second countdown before activation
      
      toast.warning('Emergency SOS activated! Cancelling in 10 seconds...', {
        duration: 10000
      });
    } catch (error) {
      console.error('Location error:', error);
      setIsEmergencyActive(true);
      setCountdown(10);
      toast.warning('Emergency SOS activated! (Location unavailable)');
    }
  };

  const executeEmergencyProtocol = async () => {
    console.log('Executing emergency protocol...');
    
    // Send location and emergency alert to contacts
    const emergencyData = {
      timestamp: new Date().toISOString(),
      location: location,
      emergencyType: 'SOS',
      userProfile: {
        name: 'Current User',
        medicalInfo: 'View emergency profile for details'
      }
    };

    // Simulate sending alerts to emergency contacts
    emergencyContacts.forEach((contact, index) => {
      setTimeout(() => {
        console.log(`Sending emergency alert to ${contact.name} (${contact.phone})`);
        toast.success(`Emergency alert sent to ${contact.name}`);
      }, index * 1000);
    });

    // Simulate calling emergency services
    setTimeout(() => {
      toast.success('Emergency services have been notified');
    }, 2000);
  };

  const cancelEmergency = () => {
    setIsEmergencyActive(false);
    setCountdown(0);
    setLocation(null);
    toast.success('Emergency SOS cancelled');
  };

  if (isEmergencyActive) {
    return (
      <Card className="border-red-500 bg-red-50">
        <CardHeader className="bg-red-100">
          <CardTitle className="text-red-800 flex items-center gap-2">
            <AlertTriangle className="h-6 w-6" />
            EMERGENCY SOS ACTIVE
          </CardTitle>
          <CardDescription className="text-red-700">
            {countdown > 0 ? `Activating in ${countdown} seconds...` : 'Emergency protocol executing...'}
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-4 space-y-4">
          {location && (
            <div className="bg-white p-3 rounded border">
              <div className="flex items-center gap-2 mb-2">
                <MapPin className="h-4 w-4 text-red-600" />
                <span className="font-medium">Current Location</span>
              </div>
              <p className="text-sm">
                {location.address || `${location.latitude}, ${location.longitude}`}
              </p>
              <p className="text-xs text-gray-600">
                Accuracy: {location.accuracy}m | {location.timestamp.toLocaleTimeString()}
              </p>
            </div>
          )}

          <div className="space-y-2">
            <h4 className="font-medium flex items-center gap-2">
              <Users className="h-4 w-4" />
              Alerting Emergency Contacts
            </h4>
            {emergencyContacts.map((contact) => (
              <div key={contact.id} className="flex items-center justify-between p-2 bg-white rounded border">
                <div>
                  <p className="font-medium text-sm">{contact.name}</p>
                  <p className="text-xs text-gray-600">{contact.relationship}</p>
                </div>
                <Badge variant="outline" className="text-xs">
                  Priority {contact.priority}
                </Badge>
              </div>
            ))}
          </div>

          {countdown > 0 && (
            <Button 
              onClick={cancelEmergency}
              variant="outline"
              className="w-full"
            >
              Cancel Emergency SOS
            </Button>
          )}
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card className="border-red-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-red-800">
            <Shield className="h-6 w-6" />
            Emergency SOS System
          </CardTitle>
          <CardDescription>
            Quick access emergency button with GPS location sharing and family alerts
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center">
            <Button
              onClick={triggerSOS}
              size="lg"
              className="h-24 w-24 rounded-full bg-red-600 hover:bg-red-700 text-white font-bold text-xl"
            >
              SOS
            </Button>
            <p className="text-sm text-gray-600 mt-2">
              Press and hold for emergency
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
            <div className="p-3 bg-red-50 rounded border">
              <MapPin className="h-6 w-6 mx-auto text-red-600 mb-2" />
              <p className="text-sm font-medium">GPS Location</p>
              <p className="text-xs text-gray-600">Shared automatically</p>
            </div>
            <div className="p-3 bg-red-50 rounded border">
              <Phone className="h-6 w-6 mx-auto text-red-600 mb-2" />
              <p className="text-sm font-medium">Emergency Services</p>
              <p className="text-xs text-gray-600">Auto-contacted</p>
            </div>
            <div className="p-3 bg-red-50 rounded border">
              <Users className="h-6 w-6 mx-auto text-red-600 mb-2" />
              <p className="text-sm font-medium">Family Alerts</p>
              <p className="text-xs text-gray-600">{emergencyContacts.length} contacts</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Emergency Contacts</CardTitle>
          <CardDescription>
            These contacts will be automatically notified in case of emergency
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {emergencyContacts.map((contact) => (
              <div key={contact.id} className="flex items-center justify-between p-3 border rounded">
                <div className="flex items-center gap-3">
                  <Phone className="h-4 w-4 text-gray-500" />
                  <div>
                    <p className="font-medium">{contact.name}</p>
                    <p className="text-sm text-gray-600">{contact.phone}</p>
                  </div>
                </div>
                <div className="text-right">
                  <Badge variant="outline">
                    {contact.relationship}
                  </Badge>
                  <p className="text-xs text-gray-500 mt-1">
                    Priority {contact.priority}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
