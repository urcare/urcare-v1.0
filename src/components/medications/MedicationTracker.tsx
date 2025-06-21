
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BarcodeScanner } from '../documents/BarcodeScanner';
import { AllergyChecker } from '../documents/AllergyChecker';
import { AdherenceScoring } from '../documents/AdherenceScoring';
import { PrescriptionReminders } from '../documents/PrescriptionReminders';
import { MedicationExpiryWatcher } from '../documents/MedicationExpiryWatcher';
import { FamilyMedicationLog } from '../documents/FamilyMedicationLog';
import { Pill, Plus, Bell, AlertTriangle, Camera, Users, Award, Calendar } from 'lucide-react';
import { toast } from 'sonner';

interface Medication {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  instructions: string;
  startDate: Date;
  endDate?: Date;
  reminders: boolean;
  adherenceScore: number;
  nextDose?: Date;
  isActive: boolean;
}

interface Allergy {
  id: string;
  allergen: string;
  severity: 'mild' | 'moderate' | 'severe';
  reaction: string;
}

export const MedicationTracker = () => {
  const [medications, setMedications] = useState<Medication[]>([
    {
      id: '1',
      name: 'Lisinopril 10mg',
      dosage: '1 tablet',
      frequency: 'Once daily',
      instructions: 'Take with food in the morning',
      startDate: new Date('2024-01-01'),
      endDate: new Date('2024-03-01'),
      reminders: true,
      adherenceScore: 95,
      nextDose: new Date(Date.now() + 2 * 60 * 60 * 1000),
      isActive: true
    },
    {
      id: '2',
      name: 'Metformin 500mg',
      dosage: '2 tablets',
      frequency: 'Twice daily',
      instructions: 'Take with meals',
      startDate: new Date('2024-01-15'),
      reminders: true,
      adherenceScore: 78,
      nextDose: new Date(Date.now() + 4 * 60 * 60 * 1000),
      isActive: true
    }
  ]);

  const [allergies, setAllergies] = useState<Allergy[]>([
    {
      id: '1',
      allergen: 'Penicillin',
      severity: 'severe',
      reaction: 'Anaphylaxis, difficulty breathing'
    }
  ]);

  const [showBarcodeScanner, setShowBarcodeScanner] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

  const handleBarcodeScanned = (barcode: string) => {
    setShowBarcodeScanner(false);
    // Simulate medication identification
    const mockMedication = {
      id: Date.now().toString(),
      name: 'New Medication (Barcode: ' + barcode + ')',
      dosage: '1 tablet',
      frequency: 'As prescribed',
      instructions: 'Follow doctor instructions',
      startDate: new Date(),
      reminders: true,
      adherenceScore: 100,
      isActive: true
    };
    setMedications(prev => [mockMedication, ...prev]);
    toast.success('Medication identified and added to your list');
  };

  const handleMarkAsTaken = (medicationId: string) => {
    setMedications(prev => prev.map(med => {
      if (med.id === medicationId) {
        const nextDose = new Date();
        if (med.frequency === 'Once daily') {
          nextDose.setDate(nextDose.getDate() + 1);
        } else if (med.frequency === 'Twice daily') {
          nextDose.setHours(nextDose.getHours() + 12);
        }
        return { ...med, nextDose };
      }
      return med;
    }));
    toast.success('Medication marked as taken');
  };

  const getAdherenceColor = (score: number) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  const overallAdherence = Math.round(
    medications.reduce((acc, med) => acc + med.adherenceScore, 0) / medications.length
  );

  return (
    <div className="space-y-6">
      {/* Header with Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 mb-2">
              <Pill className="h-4 w-4 text-blue-600" />
              <span className="font-medium">Active Meds</span>
            </div>
            <div className="text-2xl font-bold">{medications.filter(m => m.isActive).length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 mb-2">
              <Award className="h-4 w-4 text-green-600" />
              <span className="font-medium">Adherence</span>
            </div>
            <div className={`text-2xl font-bold ${getAdherenceColor(overallAdherence)}`}>
              {overallAdherence}%
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 mb-2">
              <Bell className="h-4 w-4 text-yellow-600" />
              <span className="font-medium">Due Soon</span>
            </div>
            <div className="text-2xl font-bold">
              {medications.filter(m => m.nextDose && m.nextDose < new Date(Date.now() + 2 * 60 * 60 * 1000)).length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle className="h-4 w-4 text-red-600" />
              <span className="font-medium">Allergies</span>
            </div>
            <div className="text-2xl font-bold">{allergies.length}</div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="flex gap-2 flex-wrap">
        <Button onClick={() => setShowBarcodeScanner(true)} className="flex items-center gap-2">
          <Camera className="h-4 w-4" />
          Scan Medication
        </Button>
        <Button variant="outline" onClick={() => setActiveTab('reminders')}>
          <Bell className="h-4 w-4 mr-2" />
          Set Reminders
        </Button>
        <Button variant="outline" onClick={() => setActiveTab('allergies')}>
          <AlertTriangle className="h-4 w-4 mr-2" />
          Check Interactions
        </Button>
        <Button variant="outline" onClick={() => setActiveTab('family')}>
          <Users className="h-4 w-4 mr-2" />
          Family Log
        </Button>
      </div>

      {/* Main Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="reminders">Reminders</TabsTrigger>
          <TabsTrigger value="allergies">Allergies</TabsTrigger>
          <TabsTrigger value="adherence">Adherence</TabsTrigger>
          <TabsTrigger value="expiry">Expiry</TabsTrigger>
          <TabsTrigger value="family">Family</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Current Medications</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {medications.filter(med => med.isActive).map((medication) => (
                <div key={medication.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex-1">
                    <h4 className="font-semibold">{medication.name}</h4>
                    <p className="text-sm text-gray-600">
                      {medication.dosage} • {medication.frequency}
                    </p>
                    <p className="text-xs text-gray-500">{medication.instructions}</p>
                    {medication.nextDose && (
                      <p className="text-xs text-blue-600 mt-1">
                        Next dose: {medication.nextDose.toLocaleString()}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-center">
                      <div className={`text-sm font-medium ${getAdherenceColor(medication.adherenceScore)}`}>
                        {medication.adherenceScore}%
                      </div>
                      <Progress value={medication.adherenceScore} className="w-16 h-2" />
                    </div>
                    <Button
                      size="sm"
                      onClick={() => handleMarkAsTaken(medication.id)}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      Take Now
                    </Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reminders">
          <PrescriptionReminders />
        </TabsContent>

        <TabsContent value="allergies">
          <AllergyChecker allergies={allergies} onAllergyUpdate={setAllergies} />
        </TabsContent>

        <TabsContent value="adherence">
          <AdherenceScoring />
        </TabsContent>

        <TabsContent value="expiry">
          <MedicationExpiryWatcher />
        </TabsContent>

        <TabsContent value="family">
          <FamilyMedicationLog />
        </TabsContent>
      </Tabs>

      {/* Barcode Scanner Modal */}
      {showBarcodeScanner && (
        <BarcodeScanner
          onScanned={handleBarcodeScanned}
          onClose={() => setShowBarcodeScanner(false)}
        />
      )}
    </div>
  );
};
