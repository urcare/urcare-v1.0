
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AlertTriangle, Phone, MapPin, User, Clock, Shield, Heart, Zap } from 'lucide-react';
import { toast } from 'sonner';

interface EmergencyContact {
  id: string;
  name: string;
  relationship: string;
  phone: string;
  priority: number;
}

interface MedicalAlert {
  id: string;
  type: string;
  description: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  active: boolean;
}

export const EmergencySystem = () => {
  const [activeTab, setActiveTab] = useState('sos');
  const [sosActive, setSosActive] = useState(false);
  const [emergencyContacts, setEmergencyContacts] = useState<EmergencyContact[]>([
    { id: '1', name: 'John Smith', relationship: 'Spouse', phone: '+1-555-0123', priority: 1 },
    { id: '2', name: 'Dr. Johnson', relationship: 'Primary Care', phone: '+1-555-0456', priority: 2 },
    { id: '3', name: 'Sarah Smith', relationship: 'Daughter', phone: '+1-555-0789', priority: 3 }
  ]);

  const [medicalAlerts, setMedicalAlerts] = useState<MedicalAlert[]>([
    { id: '1', type: 'Allergy', description: 'Severe peanut allergy', severity: 'critical', active: true },
    { id: '2', type: 'Medication', description: 'Takes blood thinners', severity: 'high', active: true },
    { id: '3', type: 'Condition', description: 'Diabetes Type 2', severity: 'medium', active: true }
  ]);

  const handleSOS = () => {
    setSosActive(true);
    toast.success('SOS Alert Activated! Emergency contacts notified.');
    
    // Simulate emergency response
    setTimeout(() => {
      setSosActive(false);
      toast.info('Emergency services contacted. Help is on the way.');
    }, 5000);
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'low': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'critical': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <Card className="bg-gradient-to-r from-red-50 to-orange-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-6 w-6 text-red-600" />
            Emergency Center
          </CardTitle>
          <CardDescription>
            Quick access to emergency services and critical health information
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-white/50 rounded-lg">
              <Phone className="h-8 w-8 mx-auto text-red-600 mb-2" />
              <h3 className="font-bold text-red-800">24/7</h3>
              <p className="text-sm text-gray-600">Emergency Access</p>
            </div>
            <div className="text-center p-4 bg-white/50 rounded-lg">
              <MapPin className="h-8 w-8 mx-auto text-blue-600 mb-2" />
              <h3 className="font-bold text-blue-800">Location</h3>
              <p className="text-sm text-gray-600">GPS Tracking</p>
            </div>
            <div className="text-center p-4 bg-white/50 rounded-lg">
              <Heart className="h-8 w-8 mx-auto text-purple-600 mb-2" />
              <h3 className="font-bold text-purple-800">Medical</h3>
              <p className="text-sm text-gray-600">Critical Info</p>
            </div>
            <div className="text-center p-4 bg-white/50 rounded-lg">
              <Shield className="h-8 w-8 mx-auto text-green-600 mb-2" />
              <h3 className="font-bold text-green-800">Secure</h3>
              <p className="text-sm text-gray-600">Protected Data</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="sos">SOS Alert</TabsTrigger>
          <TabsTrigger value="contacts">Emergency Contacts</TabsTrigger>
          <TabsTrigger value="medical">Medical Alerts</TabsTrigger>
          <TabsTrigger value="info">Emergency Info</TabsTrigger>
        </TabsList>

        <TabsContent value="sos" className="space-y-6">
          <div className="text-center space-y-6">
            <div className="max-w-md mx-auto">
              <h3 className="text-2xl font-bold mb-4">Emergency SOS</h3>
              <p className="text-gray-600 mb-6">
                Press and hold the button below to activate emergency alert
              </p>
              
              <Button
                size="lg"
                className={`w-40 h-40 rounded-full text-xl font-bold ${
                  sosActive 
                    ? 'bg-red-600 hover:bg-red-700 animate-pulse' 
                    : 'bg-red-500 hover:bg-red-600'
                }`}
                onClick={handleSOS}
                disabled={sosActive}
              >
                {sosActive ? (
                  <div className="flex flex-col items-center">
                    <Zap className="h-8 w-8 mb-2" />
                    ACTIVE
                  </div>
                ) : (
                  <div className="flex flex-col items-center">
                    <AlertTriangle className="h-8 w-8 mb-2" />
                    SOS
                  </div>
                )}
              </Button>
              
              {sosActive && (
                <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                  <div className="flex items-center justify-center gap-2 text-red-800">
                    <Clock className="h-5 w-5" />
                    <span className="font-semibold">Emergency Alert Active</span>
                  </div>
                  <p className="text-red-600 mt-2">
                    Contacts notified. Emergency services contacted.
                  </p>
                </div>
              )}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="contacts" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Emergency Contacts</h3>
            <Button variant="outline">Add Contact</Button>
          </div>
          
          <div className="grid gap-4">
            {emergencyContacts.map((contact) => (
              <Card key={contact.id}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <User className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <h4 className="font-semibold">{contact.name}</h4>
                        <p className="text-sm text-gray-600">{contact.relationship}</p>
                        <p className="text-sm text-gray-500">{contact.phone}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">Priority {contact.priority}</Badge>
                      <Button size="sm">
                        <Phone className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="medical" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Medical Alerts</h3>
            <Button variant="outline">Add Alert</Button>
          </div>
          
          <div className="grid gap-4">
            {medicalAlerts.map((alert) => (
              <Card key={alert.id}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <h4 className="font-semibold">{alert.type}</h4>
                        <Badge className={getSeverityColor(alert.severity)}>
                          {alert.severity.toUpperCase()}
                        </Badge>
                      </div>
                      <p className="text-gray-600">{alert.description}</p>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Badge variant={alert.active ? "default" : "outline"}>
                        {alert.active ? "Active" : "Inactive"}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="info" className="space-y-4">
          <h3 className="text-lg font-semibold">Emergency Information Card</h3>
          
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Personal Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Full Name</label>
                  <Input defaultValue="John Smith" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Date of Birth</label>
                  <Input defaultValue="01/15/1980" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Blood Type</label>
                  <Input defaultValue="O+" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Insurance ID</label>
                  <Input defaultValue="ABC123456789" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Medical Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Current Medications</label>
                  <Input placeholder="List current medications..." />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Known Allergies</label>
                  <Input placeholder="List known allergies..." />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Medical Conditions</label>
                  <Input placeholder="List medical conditions..." />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
