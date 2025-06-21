
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AlertTriangle, Phone, MapPin, Heart, User, QrCode, Bell, Shield } from 'lucide-react';
import { toast } from 'sonner';

interface EmergencyContact {
  id: string;
  name: string;
  relationship: string;
  phone: string;
  isPrimary: boolean;
}

interface MedicalAlert {
  id: string;
  condition: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  medications: string[];
  allergies: string[];
  lastUpdated: Date;
}

export const EmergencySystem = () => {
  const [isEmergencyActive, setIsEmergencyActive] = useState(false);
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [emergencyContacts] = useState<EmergencyContact[]>([
    {
      id: '1',
      name: 'Sarah Johnson',
      relationship: 'Spouse',
      phone: '+1-555-0123',
      isPrimary: true
    },
    {
      id: '2',
      name: 'Dr. Michael Chen',
      relationship: 'Primary Doctor',
      phone: '+1-555-0456',
      isPrimary: false
    },
    {
      id: '3',
      name: 'Mom',
      relationship: 'Mother',
      phone: '+1-555-0789',
      isPrimary: false
    }
  ]);

  const [medicalAlerts] = useState<MedicalAlert[]>([
    {
      id: '1',
      condition: 'Type 1 Diabetes',
      severity: 'high',
      description: 'Insulin dependent, prone to hypoglycemia',
      medications: ['Insulin', 'Glucagon'],
      allergies: ['Penicillin'],
      lastUpdated: new Date()
    },
    {
      id: '2',
      condition: 'Severe Penicillin Allergy',
      severity: 'critical',
      description: 'Anaphylaxis risk - avoid all penicillin-based antibiotics',
      medications: [],
      allergies: ['Penicillin', 'Amoxicillin'],
      lastUpdated: new Date()
    }
  ]);

  useEffect(() => {
    // Get user location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        (error) => {
          console.error('Error getting location:', error);
        }
      );
    }
  }, []);

  const handleEmergencyActivation = () => {
    setIsEmergencyActive(true);
    
    // Simulate emergency services call
    toast.promise(
      new Promise(resolve => setTimeout(resolve, 3000)),
      {
        loading: 'Contacting emergency services...',
        success: 'Emergency services contacted. Help is on the way.',
        error: 'Failed to contact emergency services'
      }
    );

    // Simulate family notifications
    emergencyContacts.forEach(contact => {
      setTimeout(() => {
        toast.success(`Emergency alert sent to ${contact.name}`);
      }, 1000 + Math.random() * 2000);
    });

    // Auto-deactivate after 30 seconds for demo
    setTimeout(() => {
      setIsEmergencyActive(false);
    }, 30000);
  };

  const handleCancelEmergency = () => {
    setIsEmergencyActive(false);
    toast.success('Emergency cancelled');
  };

  const generateEmergencyQR = () => {
    const emergencyData = {
      name: 'John Doe',
      conditions: medicalAlerts.map(alert => alert.condition),
      allergies: medicalAlerts.flatMap(alert => alert.allergies),
      medications: medicalAlerts.flatMap(alert => alert.medications),
      emergencyContacts: emergencyContacts.map(contact => ({
        name: contact.name,
        phone: contact.phone,
        relationship: contact.relationship
      })),
      bloodType: 'O+',
      lastUpdated: new Date().toISOString()
    };
    
    toast.success('Emergency QR code generated');
    return JSON.stringify(emergencyData);
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-100 text-red-800 border-red-200';
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default: return 'bg-green-100 text-green-800 border-green-200';
    }
  };

  return (
    <div className="space-y-6">
      {/* Emergency Status Alert */}
      {isEmergencyActive && (
        <Alert className="border-red-500 bg-red-50">
          <AlertTriangle className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-800">
            <div className="flex items-center justify-between">
              <span className="font-semibold">EMERGENCY ACTIVE - Help is on the way</span>
              <Button
                size="sm"
                variant="outline"
                onClick={handleCancelEmergency}
                className="border-red-300 text-red-700 hover:bg-red-100"
              >
                Cancel Emergency
              </Button>
            </div>
          </AlertDescription>
        </Alert>
      )}

      {/* SOS Button */}
      <Card className="border-red-200">
        <CardContent className="pt-6">
          <div className="text-center space-y-4">
            <Button
              size="lg"
              onClick={handleEmergencyActivation}
              disabled={isEmergencyActive}
              className={`w-32 h-32 rounded-full text-white font-bold text-lg ${
                isEmergencyActive 
                  ? 'bg-gray-400 cursor-not-allowed' 
                  : 'bg-red-600 hover:bg-red-700 shadow-lg hover:shadow-xl animate-pulse'
              }`}
            >
              {isEmergencyActive ? (
                <div className="text-center">
                  <Shield className="h-8 w-8 mx-auto mb-1" />
                  <div className="text-sm">ACTIVE</div>
                </div>
              ) : (
                <div className="text-center">
                  <AlertTriangle className="h-8 w-8 mx-auto mb-1" />
                  <div className="text-sm">SOS</div>
                </div>
              )}
            </Button>
            <div>
              <h3 className="font-semibold text-lg">Emergency SOS</h3>
              <p className="text-sm text-gray-600">
                Press and hold for 3 seconds to activate emergency services
              </p>
              {location && (
                <p className="text-xs text-gray-500 mt-1">
                  <MapPin className="h-3 w-3 inline mr-1" />
                  Location services enabled
                </p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="profile">Emergency Profile</TabsTrigger>
          <TabsTrigger value="contacts">Emergency Contacts</TabsTrigger>
          <TabsTrigger value="alerts">Medical Alerts</TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <QrCode className="h-5 w-5" />
                Emergency QR Profile
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center">
                <div className="w-48 h-48 bg-gray-100 mx-auto mb-4 rounded-lg flex items-center justify-center border-2 border-dashed border-gray-300">
                  <QrCode className="h-16 w-16 text-gray-400" />
                </div>
                <Button onClick={generateEmergencyQR}>
                  Generate Emergency QR Code
                </Button>
                <p className="text-sm text-gray-600 mt-2">
                  First responders can scan this QR code to access your critical medical information
                </p>
              </div>
              
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <h4 className="font-semibold mb-2">Basic Information</h4>
                  <ul className="space-y-1">
                    <li>Name: John Doe</li>
                    <li>Blood Type: O+</li>
                    <li>Age: 35</li>
                    <li>Gender: Male</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Critical Conditions</h4>
                  <ul className="space-y-1">
                    {medicalAlerts.slice(0, 3).map(alert => (
                      <li key={alert.id}>• {alert.condition}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="contacts" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Emergency Contacts</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {emergencyContacts.map((contact) => (
                <div key={contact.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <User className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold flex items-center gap-2">
                        {contact.name}
                        {contact.isPrimary && (
                          <Badge variant="default" className="text-xs">Primary</Badge>
                        )}
                      </h4>
                      <p className="text-sm text-gray-600">{contact.relationship}</p>
                      <p className="text-sm text-gray-500">{contact.phone}</p>
                    </div>
                  </div>
                  <Button size="sm" variant="outline">
                    <Phone className="h-4 w-4 mr-2" />
                    Call
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="alerts" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Medical Alerts & Conditions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {medicalAlerts.map((alert) => (
                <div key={alert.id} className={`p-4 rounded-lg border ${getSeverityColor(alert.severity)}`}>
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-semibold">{alert.condition}</h4>
                    <Badge className={getSeverityColor(alert.severity)}>
                      {alert.severity.toUpperCase()}
                    </Badge>
                  </div>
                  <p className="text-sm mb-3">{alert.description}</p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                    {alert.medications.length > 0 && (
                      <div>
                        <h5 className="font-medium mb-1">Medications:</h5>
                        <ul className="list-disc list-inside">
                          {alert.medications.map((med, index) => (
                            <li key={index}>{med}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                    
                    {alert.allergies.length > 0 && (
                      <div>
                        <h5 className="font-medium mb-1">Allergies:</h5>
                        <ul className="list-disc list-inside">
                          {alert.allergies.map((allergy, index) => (
                            <li key={index}>{allergy}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                  
                  <p className="text-xs text-gray-500 mt-2">
                    Last updated: {alert.lastUpdated.toLocaleDateString()}
                  </p>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
