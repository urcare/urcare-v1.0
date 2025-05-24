
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Pill, Plus, Barcode, Bell, AlertTriangle, Clock, Calendar, Truck } from 'lucide-react';
import { toast } from 'sonner';
import { BarcodeScanner } from './BarcodeScanner';
import { PharmacyIntegration } from './PharmacyIntegration';
import { AllergyChecker } from './AllergyChecker';
import { AIScheduler } from './AIScheduler';
import { DeliveryInterface } from './DeliveryInterface';
import { MissedDoseTracker } from './MissedDoseTracker';

interface Medication {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  prescribedBy: string;
  startDate: Date;
  endDate: Date;
  refillsRemaining: number;
  lastRefillDate: Date;
  pharmacy: string;
  interactions: string[];
  sideEffects: string[];
  instructions: string;
  barcode?: string;
  reminderTimes: string[];
  missedDoses: number;
  adherenceScore: number;
}

interface Allergy {
  id: string;
  allergen: string;
  severity: 'mild' | 'moderate' | 'severe';
  reaction: string;
}

const sampleMedications: Medication[] = [
  {
    id: '1',
    name: 'Lisinopril 10mg',
    dosage: '10mg',
    frequency: 'Once daily',
    prescribedBy: 'Dr. Johnson',
    startDate: new Date('2024-01-01'),
    endDate: new Date('2024-04-01'),
    refillsRemaining: 2,
    lastRefillDate: new Date('2024-01-15'),
    pharmacy: 'CVS Pharmacy',
    interactions: ['Potassium supplements', 'NSAIDs'],
    sideEffects: ['Dry cough', 'Dizziness'],
    instructions: 'Take with or without food',
    reminderTimes: ['08:00'],
    missedDoses: 1,
    adherenceScore: 95
  },
  {
    id: '2',
    name: 'Metformin 500mg',
    dosage: '500mg',
    frequency: 'Twice daily',
    prescribedBy: 'Dr. Smith',
    startDate: new Date('2024-01-15'),
    endDate: new Date('2024-07-15'),
    refillsRemaining: 5,
    lastRefillDate: new Date('2024-02-01'),
    pharmacy: 'Walgreens',
    interactions: ['Alcohol', 'Contrast dye'],
    sideEffects: ['Nausea', 'Diarrhea'],
    instructions: 'Take with meals',
    reminderTimes: ['08:00', '20:00'],
    missedDoses: 0,
    adherenceScore: 100
  }
];

const sampleAllergies: Allergy[] = [
  {
    id: '1',
    allergen: 'Penicillin',
    severity: 'severe',
    reaction: 'Anaphylaxis'
  },
  {
    id: '2',
    allergen: 'Sulfa drugs',
    severity: 'moderate',
    reaction: 'Skin rash'
  }
];

export const MedicationTracker = () => {
  const [medications, setMedications] = useState<Medication[]>(sampleMedications);
  const [allergies, setAllergies] = useState<Allergy[]>(sampleAllergies);
  const [activeTab, setActiveTab] = useState('overview');
  const [showBarcodeScanner, setShowBarcodeScanner] = useState(false);
  const [smartRemindersEnabled, setSmartRemindersEnabled] = useState(true);
  const [deliveryEnabled, setDeliveryEnabled] = useState(false);

  const handleAddMedication = (medicationData: any) => {
    const newMedication: Medication = {
      id: Date.now().toString(),
      ...medicationData,
      missedDoses: 0,
      adherenceScore: 100,
      reminderTimes: ['08:00']
    };
    setMedications(prev => [...prev, newMedication]);
    toast.success('Medication added successfully');
  };

  const handleBarcodeScanned = (barcode: string) => {
    // Mock medication lookup by barcode
    toast.success(`Barcode scanned: ${barcode}. Medication details loaded.`);
    setShowBarcodeScanner(false);
  };

  const handleRefillRequest = (medicationId: string) => {
    toast.promise(
      new Promise(resolve => setTimeout(resolve, 2000)),
      {
        loading: 'Requesting refill from pharmacy...',
        success: 'Refill request sent successfully',
        error: 'Failed to request refill'
      }
    );
  };

  const checkInteractions = (medicationName: string) => {
    const interactions = medications
      .filter(med => med.name !== medicationName)
      .flatMap(med => med.interactions);
    return interactions.length > 0 ? interactions : [];
  };

  const checkAllergies = (medicationName: string) => {
    return allergies.filter(allergy => 
      medicationName.toLowerCase().includes(allergy.allergen.toLowerCase())
    );
  };

  const getAdherenceColor = (score: number) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  const upcomingDoses = medications.flatMap(med => 
    med.reminderTimes.map(time => ({
      medication: med.name,
      time,
      dosage: med.dosage
    }))
  ).sort((a, b) => a.time.localeCompare(b.time));

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Pill className="h-5 w-5" />
            Comprehensive Medication Tracker
          </CardTitle>
          <CardDescription>
            Complete medication management with smart reminders, interaction checking, and pharmacy integration
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-6 w-full">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="medications">Medications</TabsTrigger>
              <TabsTrigger value="reminders">Reminders</TabsTrigger>
              <TabsTrigger value="pharmacy">Pharmacy</TabsTrigger>
              <TabsTrigger value="delivery">Delivery</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              {/* Summary Cards */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-2 mb-2">
                      <Pill className="h-4 w-4 text-blue-600" />
                      <span className="font-medium">Active Medications</span>
                    </div>
                    <div className="text-2xl font-bold text-blue-600">{medications.length}</div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-2 mb-2">
                      <Clock className="h-4 w-4 text-green-600" />
                      <span className="font-medium">Adherence Rate</span>
                    </div>
                    <div className="text-2xl font-bold text-green-600">
                      {Math.round(medications.reduce((acc, med) => acc + med.adherenceScore, 0) / medications.length)}%
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-2 mb-2">
                      <AlertTriangle className="h-4 w-4 text-yellow-600" />
                      <span className="font-medium">Refills Due</span>
                    </div>
                    <div className="text-2xl font-bold text-yellow-600">
                      {medications.filter(med => med.refillsRemaining <= 1).length}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-2 mb-2">
                      <Bell className="h-4 w-4 text-purple-600" />
                      <span className="font-medium">Today's Doses</span>
                    </div>
                    <div className="text-2xl font-bold text-purple-600">{upcomingDoses.length}</div>
                  </CardContent>
                </Card>
              </div>

              {/* Upcoming Doses */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Today's Medication Schedule</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {upcomingDoses.map((dose, index) => (
                      <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center gap-3">
                          <Clock className="h-4 w-4 text-gray-600" />
                          <div>
                            <p className="font-medium">{dose.medication}</p>
                            <p className="text-sm text-gray-600">{dose.dosage}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline">{dose.time}</Badge>
                          <Button size="sm">Mark Taken</Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Alerts */}
              {allergies.length > 0 && (
                <Alert>
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    <strong>Known Allergies:</strong> {allergies.map(a => a.allergen).join(', ')}
                  </AlertDescription>
                </Alert>
              )}
            </TabsContent>

            <TabsContent value="medications" className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">Your Medications</h3>
                <div className="flex gap-2">
                  <Button onClick={() => setShowBarcodeScanner(true)} variant="outline">
                    <Barcode className="h-4 w-4 mr-2" />
                    Scan Barcode
                  </Button>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Medication
                  </Button>
                </div>
              </div>

              <div className="grid gap-4">
                {medications.map((medication) => {
                  const allergyWarnings = checkAllergies(medication.name);
                  const interactions = checkInteractions(medication.name);
                  
                  return (
                    <Card key={medication.id}>
                      <CardContent className="pt-6">
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <h4 className="font-semibold text-lg">{medication.name}</h4>
                            <p className="text-gray-600">{medication.dosage} • {medication.frequency}</p>
                            <p className="text-sm text-gray-500">Prescribed by {medication.prescribedBy}</p>
                          </div>
                          <div className="text-right">
                            <div className={`text-sm font-medium ${getAdherenceColor(medication.adherenceScore)}`}>
                              {medication.adherenceScore}% Adherence
                            </div>
                            <Badge variant={medication.refillsRemaining <= 1 ? 'destructive' : 'secondary'}>
                              {medication.refillsRemaining} refills left
                            </Badge>
                          </div>
                        </div>

                        {allergyWarnings.length > 0 && (
                          <Alert className="mb-3">
                            <AlertTriangle className="h-4 w-4" />
                            <AlertDescription>
                              <strong>Allergy Warning:</strong> You are allergic to components in this medication.
                            </AlertDescription>
                          </Alert>
                        )}

                        {interactions.length > 0 && (
                          <Alert className="mb-3">
                            <AlertTriangle className="h-4 w-4" />
                            <AlertDescription>
                              <strong>Interaction Warning:</strong> May interact with: {interactions.join(', ')}
                            </AlertDescription>
                          </Alert>
                        )}

                        <div className="flex gap-2">
                          <Button 
                            size="sm" 
                            onClick={() => handleRefillRequest(medication.id)}
                            disabled={medication.refillsRemaining === 0}
                          >
                            Request Refill
                          </Button>
                          <Button size="sm" variant="outline">
                            Edit Schedule
                          </Button>
                          <Button size="sm" variant="outline">
                            View Details
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </TabsContent>

            <TabsContent value="reminders">
              <AIScheduler 
                medications={medications}
                onScheduleUpdate={(medicationId, times) => {
                  setMedications(prev => prev.map(med => 
                    med.id === medicationId ? { ...med, reminderTimes: times } : med
                  ));
                }}
                smartRemindersEnabled={smartRemindersEnabled}
              />
              <MissedDoseTracker medications={medications} />
            </TabsContent>

            <TabsContent value="pharmacy">
              <PharmacyIntegration 
                medications={medications}
                onRefillRequest={handleRefillRequest}
              />
            </TabsContent>

            <TabsContent value="delivery">
              <DeliveryInterface 
                medications={medications}
                deliveryEnabled={deliveryEnabled}
                onDeliveryToggle={setDeliveryEnabled}
              />
            </TabsContent>

            <TabsContent value="settings" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Notification Settings</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-base">Smart AI Reminders</Label>
                      <p className="text-sm text-gray-600">AI learns your routine and optimizes reminder timing</p>
                    </div>
                    <Switch 
                      checked={smartRemindersEnabled}
                      onCheckedChange={setSmartRemindersEnabled}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-base">Missed Dose Escalation</Label>
                      <p className="text-sm text-gray-600">Progressive alerts for missed medications</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-base">Refill Reminders</Label>
                      <p className="text-sm text-gray-600">Automatic pharmacy refill notifications</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                </CardContent>
              </Card>

              <AllergyChecker 
                allergies={allergies}
                onAllergyUpdate={setAllergies}
              />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {showBarcodeScanner && (
        <BarcodeScanner 
          onScanned={handleBarcodeScanned}
          onClose={() => setShowBarcodeScanner(false)}
        />
      )}
    </div>
  );
};
