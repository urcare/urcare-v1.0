
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Pill, Clock, AlertTriangle, Download, Share, Search } from 'lucide-react';
import { toast } from 'sonner';

interface Medication {
  id: string;
  name: string;
  genericName: string;
  dosage: string;
  frequency: string;
  prescribedBy: string;
  prescribedDate: Date;
  purpose: string;
  instructions: string;
  interactions: string[];
  sideEffects: string[];
  emergencyNotes: string;
  criticalLevel: 'high' | 'medium' | 'low';
}

export const EmergencyMedicationList = () => {
  const [medications] = useState<Medication[]>([
    {
      id: '1',
      name: 'Lisinopril',
      genericName: 'Lisinopril',
      dosage: '10mg',
      frequency: 'Once daily',
      prescribedBy: 'Dr. Sarah Johnson',
      prescribedDate: new Date('2024-01-15'),
      purpose: 'Blood pressure control',
      instructions: 'Take with or without food, preferably at the same time each day',
      interactions: ['Potassium supplements', 'NSAIDs'],
      sideEffects: ['Dry cough', 'Dizziness', 'Hyperkalemia'],
      emergencyNotes: 'Do not stop abruptly. May cause rebound hypertension.',
      criticalLevel: 'high'
    },
    {
      id: '2',
      name: 'Metformin',
      genericName: 'Metformin HCl',
      dosage: '1000mg',
      frequency: 'Twice daily',
      prescribedBy: 'Dr. Michael Chen',
      prescribedDate: new Date('2023-11-20'),
      purpose: 'Type 2 Diabetes management',
      instructions: 'Take with meals to reduce stomach upset',
      interactions: ['Alcohol', 'Contrast dyes'],
      sideEffects: ['Nausea', 'Diarrhea', 'Metallic taste'],
      emergencyNotes: 'Hold before surgery or contrast procedures. Risk of lactic acidosis.',
      criticalLevel: 'high'
    },
    {
      id: '3',
      name: 'Albuterol Inhaler',
      genericName: 'Albuterol Sulfate',
      dosage: '90mcg',
      frequency: 'As needed',
      prescribedBy: 'Dr. Lisa Wong',
      prescribedDate: new Date('2024-02-10'),
      purpose: 'Asthma rescue inhaler',
      instructions: 'Shake well, exhale fully, inhale deeply while pressing. Hold breath 10 seconds.',
      interactions: ['Beta blockers'],
      sideEffects: ['Rapid heartbeat', 'Nervousness', 'Tremor'],
      emergencyNotes: 'CRITICAL FOR BREATHING EMERGENCIES. Always carry. Call 911 if no improvement after 2 puffs.',
      criticalLevel: 'high'
    },
    {
      id: '4',
      name: 'Atorvastatin',
      genericName: 'Atorvastatin Calcium',
      dosage: '20mg',
      frequency: 'Once daily at bedtime',
      prescribedBy: 'Dr. Sarah Johnson',
      prescribedDate: new Date('2023-12-05'),
      purpose: 'Cholesterol management',
      instructions: 'Take at bedtime, avoid grapefruit juice',
      interactions: ['Grapefruit juice', 'Warfarin'],
      sideEffects: ['Muscle pain', 'Liver enzyme elevation'],
      emergencyNotes: 'Stop if severe muscle pain develops. Check for rhabdomyolysis.',
      criticalLevel: 'medium'
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [filterLevel, setFilterLevel] = useState<string>('all');

  const filteredMedications = medications.filter(med => {
    const matchesSearch = med.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         med.genericName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         med.purpose.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = filterLevel === 'all' || med.criticalLevel === filterLevel;
    
    return matchesSearch && matchesFilter;
  });

  const getCriticalLevelColor = (level: string) => {
    switch (level) {
      case 'high': return 'bg-red-100 text-red-800 border-red-300';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'low': return 'bg-green-100 text-green-800 border-green-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const downloadList = () => {
    toast.success('Emergency medication list downloaded as PDF');
  };

  const shareList = () => {
    toast.success('Medication list shared with emergency contacts');
  };

  return (
    <div className="space-y-6">
      <Card className="border-red-200 bg-red-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-red-800">
            <Pill className="h-6 w-6" />
            Emergency Medication List
          </CardTitle>
          <CardDescription className="text-red-700">
            Critical medication information for emergency responders and medical professionals
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="h-4 w-4 absolute left-3 top-3 text-gray-400" />
                <Input
                  placeholder="Search medications..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div>
              <select
                value={filterLevel}
                onChange={(e) => setFilterLevel(e.target.value)}
                className="p-2 border rounded-md"
              >
                <option value="all">All Levels</option>
                <option value="high">High Critical</option>
                <option value="medium">Medium Critical</option>
                <option value="low">Low Critical</option>
              </select>
            </div>
          </div>

          <div className="flex gap-2">
            <Button onClick={downloadList} variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Download PDF
            </Button>
            <Button onClick={shareList} variant="outline">
              <Share className="h-4 w-4 mr-2" />
              Share with Contacts
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-4">
        {filteredMedications.map((medication) => (
          <Card key={medication.id} className={`border-l-4 ${
            medication.criticalLevel === 'high' ? 'border-l-red-500' :
            medication.criticalLevel === 'medium' ? 'border-l-yellow-500' :
            'border-l-green-500'
          }`}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    {medication.name}
                    <Badge className={getCriticalLevelColor(medication.criticalLevel)}>
                      {medication.criticalLevel} critical
                    </Badge>
                  </CardTitle>
                  <CardDescription>
                    {medication.genericName} • {medication.dosage} • {medication.frequency}
                  </CardDescription>
                </div>
                <div className="text-right text-sm text-gray-600">
                  <p>Prescribed by: {medication.prescribedBy}</p>
                  <p>{medication.prescribedDate.toLocaleDateString()}</p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h5 className="font-medium text-sm mb-2">Purpose & Instructions</h5>
                  <p className="text-sm text-gray-700 mb-2">
                    <strong>Purpose:</strong> {medication.purpose}
                  </p>
                  <p className="text-sm text-gray-700">
                    <strong>Instructions:</strong> {medication.instructions}
                  </p>
                </div>
                
                <div>
                  <h5 className="font-medium text-sm mb-2">Dosage Information</h5>
                  <div className="space-y-1 text-sm">
                    <p><strong>Dosage:</strong> {medication.dosage}</p>
                    <p><strong>Frequency:</strong> {medication.frequency}</p>
                    <p><strong>Prescribed:</strong> {medication.prescribedDate.toLocaleDateString()}</p>
                  </div>
                </div>
              </div>

              {medication.emergencyNotes && (
                <div className="p-3 bg-red-100 rounded border border-red-200">
                  <div className="flex items-start gap-2">
                    <AlertTriangle className="h-4 w-4 text-red-600 mt-0.5" />
                    <div>
                      <h5 className="font-medium text-red-800 text-sm">Emergency Notes</h5>
                      <p className="text-sm text-red-700">{medication.emergencyNotes}</p>
                    </div>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {medication.interactions.length > 0 && (
                  <div>
                    <h5 className="font-medium text-sm mb-2">Drug Interactions</h5>
                    <div className="flex flex-wrap gap-1">
                      {medication.interactions.map((interaction, index) => (
                        <Badge key={index} variant="outline" className="text-xs bg-yellow-50 text-yellow-800">
                          {interaction}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {medication.sideEffects.length > 0 && (
                  <div>
                    <h5 className="font-medium text-sm mb-2">Side Effects</h5>
                    <div className="flex flex-wrap gap-1">
                      {medication.sideEffects.map((effect, index) => (
                        <Badge key={index} variant="outline" className="text-xs bg-gray-50 text-gray-600">
                          {effect}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredMedications.length === 0 && (
        <Card>
          <CardContent className="text-center py-8">
            <Pill className="h-12 w-12 mx-auto text-gray-400 mb-4" />
            <p className="text-gray-600">No medications match your search criteria</p>
          </CardContent>
        </Card>
      )}

      <Card className="bg-blue-50 border-blue-200">
        <CardHeader>
          <CardTitle className="text-blue-800">Emergency Medication Guidelines</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-medium mb-2">For Emergency Responders:</h4>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• Red markers indicate life-critical medications</li>
                <li>• Check emergency notes for contraindications</li>
                <li>• Consider drug interactions before administering new medications</li>
                <li>• Note recent dosing times to avoid overdose</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-2">Critical Levels Explained:</h4>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Badge className="bg-red-100 text-red-800">High</Badge>
                  <span className="text-sm">Life-threatening if missed or interrupted</span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge className="bg-yellow-100 text-yellow-800">Medium</Badge>
                  <span className="text-sm">Important for health management</span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge className="bg-green-100 text-green-800">Low</Badge>
                  <span className="text-sm">Can be temporarily interrupted if needed</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
